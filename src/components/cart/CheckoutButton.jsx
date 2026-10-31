export default function CheckoutButton() {
  return (
    <div className="mt-6">
      <button
        type="button"
        disabled
        aria-describedby="cart-checkout-help"
        className="min-h-11 w-full cursor-not-allowed rounded-md bg-[#f7b900] px-5 py-3 text-center font-semibold text-[#001016] opacity-60"
      >
        Til kassen
      </button>

      <p id="cart-checkout-help" className="mt-2 text-sm text-white">
        Kassen er ikke tilgjengelig ennå. Det er foreløpig ikke mulig å
        gjennomføre kjøp.
      </p>
    </div>
  );
}
