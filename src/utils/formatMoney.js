export function formatMoney({ amount, currencyCode }) {
  return new Intl.NumberFormat("nb-NO", {
    style: "currency",
    currency: currencyCode,
  }).format(Number(amount));
}
