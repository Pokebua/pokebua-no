import Image from "next/image";
import Link from "next/link";

export default function PokebuaLogo() {
  return (
    <Link
      href="/"
      aria-label="Go to the home page"
      className="col-start-1 row-start-1 rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#f7b900]"
    >
      <Image
        src="/images/pokebua_logo_transparent_cropped.png"
        alt="Pokébua.no"
        width={180}
        height={80}
        priority
        className="h-auto w-28 sm:w-36"
      />
    </Link>
  );
}
