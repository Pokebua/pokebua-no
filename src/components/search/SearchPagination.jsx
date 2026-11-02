import Link from "next/link";

const linkClassName =
  "inline-flex min-h-11 min-w-11 items-center justify-center rounded-md border border-[#001016] px-3 py-2 font-semibold transition-colors hover:bg-[#001016] hover:text-white focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#001016]";

function createPageHref(query, page) {
  const params = new URLSearchParams({ q: query });

  if (page > 1) {
    params.set("page", String(page));
  }

  return `/sok?${params}`;
}

export default function SearchPagination({
  query,
  currentPage,
  totalCount,
  pageSize,
}) {
  const totalPages = Math.ceil(totalCount / pageSize);

  if (totalPages <= 1 && currentPage === 1) return null;

  const visiblePages = new Set([1]);

  if (totalPages > 0) {
    visiblePages.add(totalPages);
  }

  // Show every number for smaller result sets.
  if (totalPages <= 7) {
    for (let page = 1; page <= totalPages; page += 1) {
      visiblePages.add(page);
    }
  } else {
    for (
      let page = Math.max(1, currentPage - 2);
      page <= Math.min(totalPages, currentPage + 2);
      page += 1
    ) {
      visiblePages.add(page);
    }
  }

  const pages = [...visiblePages].sort((a, b) => a - b);
  const isValidPage = currentPage <= totalPages;

  return (
    <nav aria-label="Sider med søkeresultater" className="mt-8">
      <p className="text-center text-sm">
        {isValidPage
          ? `Side ${currentPage} av ${totalPages}`
          : "Denne siden er ikke lenger tilgjengelig."}
      </p>

      <ul className="mt-4 flex flex-wrap items-center justify-center gap-2">
        <li>
          {currentPage > 1 && isValidPage ? (
            <Link
              href={createPageHref(query, currentPage - 1)}
              rel="prev"
              className={linkClassName}
            >
              Forrige
            </Link>
          ) : (
            <span
              aria-disabled="true"
              className="inline-flex min-h-11 items-center px-3 text-gray-500"
            >
              Forrige
            </span>
          )}
        </li>

        {pages.map((page, index) => {
          const showGap = index > 0 && page - pages[index - 1] > 1;

          return (
            <li key={page} className="flex items-center gap-2">
              {showGap && (
                <span aria-hidden="true" className="px-1">
                  …
                </span>
              )}

              {page === currentPage ? (
                <span
                  aria-current="page"
                  aria-label={`Side ${page}`}
                  className="grid min-h-11 min-w-11 place-items-center rounded-md border border-[#001016] bg-[#001016] px-3 py-2 font-semibold text-[#f7b900]"
                >
                  {page}
                </span>
              ) : (
                <Link
                  href={createPageHref(query, page)}
                  aria-label={`Gå til side ${page}`}
                  className={linkClassName}
                >
                  {page}
                </Link>
              )}
            </li>
          );
        })}

        <li>
          {currentPage < totalPages ? (
            <Link
              href={createPageHref(query, currentPage + 1)}
              rel="next"
              className={linkClassName}
            >
              Neste
            </Link>
          ) : (
            <span
              aria-disabled="true"
              className="inline-flex min-h-11 items-center px-3 text-gray-500"
            >
              Neste
            </span>
          )}
        </li>
      </ul>
    </nav>
  );
}
