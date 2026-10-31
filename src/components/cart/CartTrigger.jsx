import { IoCart } from "react-icons/io5";

export default function CartTrigger({
  triggerRef,
  isOpen,
  itemCount,
  onToggle,
  iconClassName,
}) {
  return (
    <button
      ref={triggerRef}
      type="button"
      aria-label={`${isOpen ? "Lukk handlekurv" : "Åpne handlekurv"}, ${itemCount} ${
        itemCount === 1 ? "vare" : "varer"
      }`}
      aria-expanded={isOpen}
      aria-controls="cart-panel"
      onClick={onToggle}
      className={`${iconClassName} relative`}
    >
      <IoCart aria-hidden="true" className="size-6" />

      {itemCount > 0 && (
        <span
          aria-hidden="true"
          className="absolute -right-1 -top-1 grid h-5 min-w-5 place-items-center rounded-full bg-[#f7b900] px-1 text-xs font-bold leading-none text-[#001016]"
        >
          {itemCount > 99 ? "99+" : itemCount}
        </span>
      )}
    </button>
  );
}
