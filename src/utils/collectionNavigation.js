function normalizeLabel(value) {
  return value.trim().normalize("NFC").toLocaleLowerCase("nb-NO");
}

export function createCollectionNavigation(collections) {
  const links = [];
  const seenHandles = new Set();
  let gradingLink;

  for (const { handle, title } of collections) {
    if (seenHandles.has(handle)) continue;
    seenHandles.add(handle);

    const normalizedTitle = normalizeLabel(title);

    if (
      handle === "all" ||
      normalizedTitle === "alle produkter" ||
      handle === "forhandsbestilling" ||
      normalizedTitle === "tilbehør"
    ) {
      continue;
    }

    const href = `/produkter/${encodeURIComponent(handle)}`;

    if (handle === "cgc-gradering") {
      gradingLink = {
        href,
        label: "Gradering",
        separated: true,
      };
      continue;
    }

    links.push({
      href,
      label: title,
      separated: false,
    });
  }

  return [
    {
      href: "/produkter",
      label: "Alle produkter",
      separated: false,
    },
    ...links,
    ...(gradingLink ? [gradingLink] : []),
  ];
}
