export default function RemoveCartItemButton({
  productName,
  isPending,
  unavailable,
  onRemove,
}) {
  return (
    <button
      type="button"
      aria-label={`Fjern ${productName} fra handlekurven`}
      aria-disabled={unavailable}
      onClick={(event) => {
        if (unavailable) return;
        onRemove(event.currentTarget);
      }}
      className={`mt-2 inline-flex min-h-11 items-center rounded-md px-2 text-sm text-white underline underline-offset-4 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#f7b900] ${
        unavailable
          ? "cursor-not-allowed opacity-50"
          : "cursor-pointer hover:text-[#f7b900]"
      }`}
    >
      {isPending ? "Fjerner..." : "Fjern"}
    </button>
  );
}
