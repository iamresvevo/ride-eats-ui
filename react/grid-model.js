export function getGridRows(
  rows,
  columns,
  { query = "", filters = {}, sort = null } = {},
) {
  const text = String(query).toLocaleLowerCase().trim();
  const filtered = rows.filter(
    (row) =>
      columns.some((column) =>
        String(
          column.searchValue
            ? column.searchValue(row)
            : (row[column.key] ?? ""),
        )
          .toLocaleLowerCase()
          .includes(text),
      ) &&
      Object.entries(filters).every(
        ([key, value]) => !value || String(row[key]) === String(value),
      ),
  );
  if (!sort?.key) return filtered;
  const column = columns.find((column) => column.key === sort.key);
  return filtered
    .map((row, index) => ({ row, index }))
    .sort((a, b) => {
      const first = column?.sortValue
          ? column.sortValue(a.row)
          : a.row[sort.key],
        second = column?.sortValue ? column.sortValue(b.row) : b.row[sort.key];
      const comparison =
        typeof first === "number" && typeof second === "number"
          ? first - second
          : String(first ?? "").localeCompare(String(second ?? ""), undefined, {
              numeric: true,
              sensitivity: "base",
            });
      return (
        (sort.direction === "desc" ? -comparison : comparison) ||
        a.index - b.index
      );
    })
    .map((item) => item.row);
}
export function getWindow(total, scrollTop, rowHeight, height, overscan = 4) {
  const start = Math.max(
    0,
    Math.min(
      Math.max(0, total - 1),
      Math.floor(scrollTop / rowHeight) - overscan,
    ),
  );
  return {
    start,
    end: Math.min(total, start + Math.ceil(height / rowHeight) + overscan * 2),
  };
}
