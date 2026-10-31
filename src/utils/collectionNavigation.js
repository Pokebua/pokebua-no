function normalizeLabel(value) {
  return value.trim().normalize("NFC").toLocaleLowerCase("nb-NO");
}

export function createCollectionNavigation(collections) {
  const links = [];
  const accessories = [];
  const seenHandles = new Set();

  for (const collection of collections) {
    const { handle, title } = collection;
    const normalizedTitle = normalizeLabel(title);

    if (seenHandles.has(handle)) continue;
    seenHandles.add(handle);

    // Use our /produkter page as the single all-products destination.
    if (handle === "all" || normalizedTitle === "alle produkter") {
      continue;
    }

    const isAccessories = normalizedTitle === "tilbehør";

    const link = {
      href: `/produkter/${encodeURIComponent(handle)}`,
      label: isAccessories ? "Tilbehør" : title,
      separated: isAccessories,
    };

    if (isAccessories) {
      accessories.push(link);
    } else {
      links.push(link);
    }
  }

  return [
    {
      href: "/produkter",
      label: "Alle produkter",
      separated: false,
    },
    ...links,
    ...accessories,
  ];
}
