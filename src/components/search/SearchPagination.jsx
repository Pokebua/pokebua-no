import Pagination from "@/components/Pagination";

export default function SearchPagination({
  query,
  currentPage,
  totalCount,
  pageSize,
}) {
  return (
    <Pagination
      currentPage={currentPage}
      totalPages={Math.ceil(totalCount / pageSize)}
      basePath="/sok"
      queryParams={{ q: query }}
      label="Sider med søkeresultater"
    />
  );
}
