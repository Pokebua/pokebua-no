import { Suspense } from "react";
import SearchResults from "@/components/search/SearchResults";

export const metadata = {
  title: "Søk | Pokébua",
  description: "Søk etter produkter hos Pokébua.",
};

export default function SearchPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-8">
      <Suspense fallback={<p>Laster søk...</p>}>
        <SearchResults />
      </Suspense>
    </div>
  );
}
