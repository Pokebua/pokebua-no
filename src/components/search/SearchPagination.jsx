import Link from "next/link";
import { IoChevronBack, IoChevronForward } from "react-icons/io5";

const controlClassName =
  "inline-flex size-11 shrink-0 items-center justify-center rounded-md border border-[#001016] font-semibold transition-colors hover:bg-[#001016] hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#001016]";

function createPageHref(query, page) {
  const params = new URLSearchParams({ q: query });

  if (page > 1) {
    params.set("page", String(page));
  }

  return `/sok?${params}`;
}

function getVisiblePages(currentPage, totalPages, compact) {
  if (totalPages <= (compact ? 4 : 7)) {
    return Array.from({ length: totalPages }, (_, index) => index + 1);
  }

  const pages = new Set([1, totalPages]);

  if (compact) {
    pages.add(Math.min(Math.max(currentPage, 2), totalPages - 1));
  } else {
    for (
      let page = Math.max(1, currentPage - 2);
      page <= Math.min(totalPages, currentPage + 2);
      page += 1
    ) {
      pages.add(page);
    }
  }

  return [...pages].sort((a, b) => a - b);
}

function PageNumbers({ pages, query, currentPage }) {
  return pages.map((page, index) => (
    <li key={page} className="flex shrink-0 items-center gap-1 sm:gap-2">
      {index > 0 && page - pages[index - 1] > 1 && (
        <span aria-hidden="true" className="text-gray-500">
          …
        </span>
      )}

      {page === currentPage ? (
        <span
          aria-current="page"
          aria-label={`Side ${page}`}
          className="inline-flex size-11 shrink-0 items-center justify-center rounded-md border border-[#001016] bg-[#001016] font-semibold text-[#f7b900]"
        >
          {page}
        </span>
      ) : (
        <Link
          href={createPageHref(query, page)}
          aria-label={`Gå til side ${page}`}
          className={controlClassName}
        >
          {page}
        </Link>
      )}
    </li>
  ));
}

export default function SearchPagination({
  query,
  currentPage,
  totalCount,
  pageSize,
}) {
  const totalPages = Math.ceil(totalCount / pageSize);

  if (totalPages <= 1 && currentPage === 1) return null;

  const isValidPage = currentPage >= 1 && currentPage <= totalPages;

  if (!isValidPage) {
    return (
      <nav aria-label="Sider med søkeresultater" className="mt-8 text-center">
        <p className="text-sm">Denne siden er ikke lenger tilgjengelig.</p>

        <Link
          href={createPageHref(query, 1)}
          className="mt-3 inline-flex min-h-11 items-center rounded-md px-4 underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#001016]"
        >
          Til første side
        </Link>
      </nav>
    );
  }

  const mobilePages = getVisiblePages(currentPage, totalPages, true);
  const desktopPages = getVisiblePages(currentPage, totalPages, false);

  return (
    <nav aria-label="Sider med søkeresultater" className="mt-8">
      <p className="text-center text-sm">
        Side {currentPage} av {totalPages}
      </p>

      <div className="mt-3 flex items-center justify-center gap-1 sm:gap-2">
        {currentPage > 1 ? (
          <Link
            href={createPageHref(query, currentPage - 1)}
            rel="prev"
            aria-label="Forrige side"
            className={controlClassName}
          >
            <IoChevronBack aria-hidden="true" className="size-5" />
          </Link>
        ) : (
          <span
            aria-disabled="true"
            aria-label="Forrige side"
            className="inline-flex size-11 shrink-0 items-center justify-center text-gray-400"
          >
            <IoChevronBack aria-hidden="true" className="size-5" />
          </span>
        )}

        <ul className="flex items-center gap-1 sm:hidden">
          <PageNumbers
            pages={mobilePages}
            query={query}
            currentPage={currentPage}
          />
        </ul>

        <ul className="hidden items-center gap-2 sm:flex">
          <PageNumbers
            pages={desktopPages}
            query={query}
            currentPage={currentPage}
          />
        </ul>

        {currentPage < totalPages ? (
          <Link
            href={createPageHref(query, currentPage + 1)}
            rel="next"
            aria-label="Neste side"
            className={controlClassName}
          >
            <IoChevronForward aria-hidden="true" className="size-5" />
          </Link>
        ) : (
          <span
            aria-disabled="true"
            aria-label="Neste side"
            className="inline-flex size-11 shrink-0 items-center justify-center text-gray-400"
          >
            <IoChevronForward aria-hidden="true" className="size-5" />
          </span>
        )}
      </div>
    </nav>
  );
}
