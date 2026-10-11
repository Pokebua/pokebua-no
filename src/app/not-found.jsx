import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center bg-[#fff8e7] px-4 py-16 sm:px-8">
      <section
        aria-labelledby="not-found-heading"
        className="w-full max-w-2xl rounded-xl border-2 border-[#f7b900] bg-white p-8 text-center text-[#001016] sm:p-12"
      >
        <p className="mb-2 text-6xl font-bold text-[#001016] sm:text-7xl">
          404
        </p>

        <h1 id="not-found-heading" className="text-3xl sm:text-4xl">
          Siden ble ikke funnet
        </h1>

        <p className="mx-auto mt-4 max-w-lg text-base sm:text-lg">
          Siden du leter etter finnes ikke, eller kan ha blitt flyttet.
        </p>

        <Link
          href="/"
          className="mt-8 inline-flex min-h-11 items-center justify-center rounded-md bg-[#001016] px-6 py-3 font-semibold text-[#f7b900] transition-colors hover:bg-[#001016]/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#f7b900] focus-visible:ring-offset-4"
        >
          Til forsiden
        </Link>
      </section>
    </div>
  );
}
