const sortOptions = {
  "collection-default": {
    label: "Samlingens rekkefølge",
    sortKey: "COLLECTION_DEFAULT",
    reverse: false,
  },
  "best-selling": {
    label: "Bestselger",
    sortKey: "BEST_SELLING",
    reverse: false,
  },
  "price-asc": {
    label: "Pris, lav til høy",
    sortKey: "PRICE",
    reverse: false,
  },
  "price-desc": {
    label: "Pris, høy til lav",
    sortKey: "PRICE",
    reverse: true,
  },
  oldest: {
    label: "Dato, gammelt til nytt",
    sortKey: "CREATED_AT",
    collectionSortKey: "CREATED",
    reverse: false,
  },
  newest: {
    label: "Dato, nytt til gammelt",
    sortKey: "CREATED_AT",
    collectionSortKey: "CREATED",
    reverse: true,
  },
};

export function getProductSort(value, { isCollection = false } = {}) {
  const defaultSort = isCollection ? "collection-default" : "best-selling";

  const options = Object.entries(sortOptions)
    .filter(([key]) => isCollection || key !== "collection-default")
    .map(([key, option]) => ({
      value: key,
      label: option.label,
    }));

  const sort = options.some((option) => option.value === value)
    ? value
    : defaultSort;

  const selected = sortOptions[sort];

  return {
    sort,
    sortKey: isCollection
      ? (selected.collectionSortKey ?? selected.sortKey)
      : selected.sortKey,
    reverse: selected.reverse,
    options,
  };
}
