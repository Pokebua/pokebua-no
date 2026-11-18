const sortOptions = {
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

const options = Object.entries(sortOptions).map(([value, { label }]) => ({
  value,
  label,
}));

export function getProductSort(value, { isCollection = false } = {}) {
  const sort =
    typeof value === "string" && Object.hasOwn(sortOptions, value)
      ? value
      : "best-selling";

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
