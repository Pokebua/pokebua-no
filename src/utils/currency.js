const nokFormatter = new Intl.NumberFormat("nb-NO", {
  style: "currency",
  currency: "NOK",
});

export function toOre(price) {
  return Math.round(price * 100);
}

export function formatNok(amountInOre) {
  return nokFormatter.format(amountInOre / 100);
}
