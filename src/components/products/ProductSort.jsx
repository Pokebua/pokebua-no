"use client";

import { useOptimistic, useTransition } from "react";
import { useRouter } from "next/navigation";

export default function ProductSort({ basePath, sort, options }) {
  const router = useRouter();
  const [selectedSort, setSelectedSort] = useOptimistic(sort);
  const [isPending, startTransition] = useTransition();

  function handleChange(event) {
    const value = event.target.value;
    const params = new URLSearchParams({ sort: value });

    startTransition(() => {
      setSelectedSort(value);
      router.push(`${basePath}?${params}`, { scroll: false });
    });
  }

  return (
    <form
      action={basePath}
      method="get"
      className="flex flex-wrap items-center gap-3 text-[#001016]"
    >
      <label htmlFor="product-sort" className="font-semibold">
        Sorter etter
      </label>

      <select
        id="product-sort"
        name="sort"
        value={selectedSort}
        onChange={handleChange}
        className="min-h-11 rounded-lg border border-[#001016] bg-white px-3 focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-[#001016]"
      >
        {options.map(({ value, label }) => (
          <option key={value} value={value}>
            {label}
          </option>
        ))}
      </select>

      <span role="status" className="sr-only">
        {isPending ? "Sorterer produkter …" : ""}
      </span>

      <noscript>
        <button
          type="submit"
          className="min-h-11 rounded-lg bg-[#001016] px-4 font-semibold text-[#f7b900]"
        >
          Sorter
        </button>
      </noscript>
    </form>
  );
}
