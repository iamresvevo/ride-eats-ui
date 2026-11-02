import { Popover } from "./motion.jsx";
import React, { useState, useRef, useMemo } from "react";
import Icon from "./send/Icon.jsx";
import { Checkbox } from "./collection.jsx";
import { Button } from "./index.jsx";
import { getGridRows, getWindow } from "./grid-model.js";

const defaultRowKey = (row) => row.id;
export function DataGrid({
  rows,
  columns,
  getRowKey = defaultRowKey,
  label = "Records",
  pageSize = 8,
  virtual = false,
  height = 320,
  rowHeight = 40,
  filters: filterDefinitions = [],
  bulkActions = [],
  renderExpanded,
  rowActions,
  loading = false,
  error,
  onRetry,
  emptyText = "No records match your filters.",
  className = "",
  style,
}) {
  const [query, setQuery] = useState(""),
    [columnsOpen, setColumnsOpen] = useState(false),
    [filters, setFilters] = useState({}),
    [sort, setSort] = useState(null),
    [hidden, setHidden] = useState([]),
    [widths, setWidths] = useState({}),
    [selected, setSelected] = useState([]),
    [expanded, setExpanded] = useState([]),
    [page, setPage] = useState(0),
    [top, setTop] = useState(0);
  const scroll = useRef(null),
    resizing = useRef(null);
  const data = useMemo(
      () => getGridRows(rows, columns, { query, filters, sort }),
      [rows, columns, query, filters, sort],
    ),
    visible = columns.filter((column) => !hidden.includes(column.key)),
    selection = selected.filter((key) =>
      rows.some((row) => String(getRowKey(row)) === key),
    );
  const selectedRows = rows.filter((row) =>
    selection.includes(String(getRowKey(row))),
  );
  const windowed = virtual && !renderExpanded;
  const pages = Math.max(1, Math.ceil(data.length / pageSize)),
    currentPage = Math.min(page, pages - 1),
    range = windowed
      ? getWindow(data.length, top, rowHeight, height)
      : { start: currentPage * pageSize, end: (currentPage + 1) * pageSize };
  const display = data.slice(range.start, range.end);
  const controlColumns =
      Number(bulkActions.length > 0) + Number(!!renderExpanded),
    cellCount = visible.length + controlColumns + Number(!!rowActions);
  let pinOffset = 0;
  const layout = visible.map((column) => {
    const width = widths[column.key] || column.width || 160,
      left = pinOffset;
    if (column.pinned) pinOffset += width;
    return { ...column, width, left };
  });
  const reset = () => {
    setPage(0);
    setTop(0);
    if (scroll.current) scroll.current.scrollTop = 0;
  };
  const toggle = (key, checked) =>
    setSelected((old) =>
      checked
        ? [...new Set([...old, key])]
        : old.filter((value) => value !== key),
    );
  const all =
    display.length > 0 &&
    display.every((row) => selection.includes(String(getRowKey(row))));
  return (
    <section
      className={`re-grid ${className}`}
      style={{ "--ui-row": rowHeight + "px", ...style }}
      aria-label={label}
    >
      <div className="re-grid-toolbar">
        <div>
          <strong>{label}</strong>
          <small>{data.length.toLocaleString()} records</small>
        </div>
        <label className="re-grid-search">
          <Icon name="search" />
          <input
            aria-label={`Search ${label}`}
            placeholder="Search records…"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              reset();
            }}
          />
        </label>
        <Popover
          open={columnsOpen}
          onOpenChange={setColumnsOpen}
          label="Column visibility"
          width={210}
          align="end"
          className="re-column-options"
          trigger={(props) => (
            <button {...props} type="button" className="re-column-trigger">
              <Icon name="columns-3" />
              Columns
            </button>
          )}
        >
          {columns.map((column) => (
            <Checkbox
              key={column.key}
              label={column.label || column.key}
              checked={!hidden.includes(column.key)}
              disabled={!hidden.includes(column.key) && visible.length === 1}
              onCheckedChange={(checked) =>
                setHidden((old) =>
                  checked
                    ? old.filter((key) => key !== column.key)
                    : [...old, column.key],
                )
              }
            />
          ))}
        </Popover>
      </div>
      {filterDefinitions.length > 0 && (
        <div className="re-grid-filters">
          {filterDefinitions.map((filter) => (
            <label key={filter.key}>
              {filter.label}
              <select
                value={filters[filter.key] || ""}
                onChange={(e) => {
                  setFilters({ ...filters, [filter.key]: e.target.value });
                  reset();
                }}
              >
                <option value="">All</option>
                {filter.options.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </label>
          ))}
        </div>
      )}
      {selection.length > 0 && (
        <div className="re-grid-bulk" role="status">
          <span>{selection.length} selected</span>
          {bulkActions.map((action) => (
            <Button
              key={action.value}
              size="sm"
              variant="ghost"
              onClick={() => action.onSelect(selectedRows)}
            >
              {action.label}
            </Button>
          ))}
          <Button size="sm" variant="ghost" onClick={() => setSelected([])}>
            Clear selection
          </Button>
        </div>
      )}
      <div
        ref={scroll}
        className="re-grid-scroll"
        style={{ maxHeight: height }}
        onScroll={(e) => {
          if (windowed) setTop(e.currentTarget.scrollTop);
        }}
      >
        <table
          aria-label={label}
          aria-rowcount={windowed ? data.length + 1 : undefined}
          style={{
            minWidth: layout.reduce(
              (sum, column) => sum + column.width,
              controlColumns * 36 + (rowActions ? 68 : 0),
            ),
          }}
        >
          <colgroup>
            {bulkActions.length > 0 && <col style={{ width: 36 }} />}
            {renderExpanded && <col style={{ width: 36 }} />}
            {layout.map((column) => (
              <col key={column.key} style={{ width: column.width }} />
            ))}
            {rowActions && <col style={{ width: 68 }} />}
          </colgroup>
          <thead>
            <tr>
              {bulkActions.length > 0 && (
                <th className="re-grid-control">
                  <Checkbox
                    label={
                      <span className="re-sr-only">Select visible rows</span>
                    }
                    checked={all}
                    indeterminate={
                      !all &&
                      display.some((row) =>
                        selection.includes(String(getRowKey(row))),
                      )
                    }
                    onCheckedChange={(checked) => {
                      const keys = display.map((row) => String(getRowKey(row)));
                      setSelected((old) =>
                        checked
                          ? [...new Set([...old, ...keys])]
                          : old.filter((key) => !keys.includes(key)),
                      );
                    }}
                  />
                </th>
              )}
              {renderExpanded && (
                <th>
                  <span className="re-sr-only">Details</span>
                </th>
              )}
              {layout.map((column) => (
                <th
                  key={column.key}
                  className={column.pinned ? "is-pinned" : ""}
                  style={{ left: column.pinned ? column.left : undefined }}
                  aria-sort={
                    sort?.key === column.key
                      ? sort.direction === "asc"
                        ? "ascending"
                        : "descending"
                      : "none"
                  }
                >
                  <button
                    type="button"
                    disabled={column.sortable === false}
                    onClick={() => {
                      setSort({
                        key: column.key,
                        direction:
                          sort?.key === column.key && sort.direction === "asc"
                            ? "desc"
                            : "asc",
                      });
                      reset();
                    }}
                  >
                    {column.label || column.key}
                    {column.sortable !== false && (
                      <Icon
                        name={
                          sort?.key === column.key
                            ? sort.direction === "asc"
                              ? "arrow-up"
                              : "arrow-down"
                            : "sort"
                        }
                        size={12}
                      />
                    )}
                  </button>
                  {column.resizable !== false && (
                    <span
                      role="separator"
                      aria-label={`Resize ${column.label || column.key}`}
                      aria-orientation="vertical"
                      aria-valuenow={column.width}
                      aria-valuemin={72}
                      aria-valuemax={600}
                      tabIndex={0}
                      className="re-column-resizer"
                      onKeyDown={(e) => {
                        if (e.key === "ArrowRight" || e.key === "ArrowLeft") {
                          e.preventDefault();
                          setWidths({
                            ...widths,
                            [column.key]: Math.max(
                              72,
                              Math.min(
                                600,
                                column.width +
                                  (e.key === "ArrowRight" ? 8 : -8),
                              ),
                            ),
                          });
                        }
                      }}
                      onPointerDown={(e) => {
                        if (e.button !== 0) return;
                        e.currentTarget.setPointerCapture(e.pointerId);
                        resizing.current = {
                          x: e.clientX,
                          width: column.width,
                          key: column.key,
                        };
                      }}
                      onPointerMove={(e) => {
                        const start = resizing.current;
                        if (start?.key === column.key)
                          setWidths((old) => ({
                            ...old,
                            [column.key]: Math.max(
                              72,
                              Math.min(600, start.width + e.clientX - start.x),
                            ),
                          }));
                      }}
                      onPointerUp={() => {
                        resizing.current = null;
                      }}
                      onPointerCancel={() => {
                        resizing.current = null;
                      }}
                    />
                  )}
                </th>
              ))}
              {rowActions && (
                <th>
                  <span className="re-sr-only">Actions</span>
                </th>
              )}
            </tr>
          </thead>
          <tbody>
            {loading || error || !data.length ? (
              <tr>
                <td colSpan={cellCount} className="re-grid-empty">
                  <div role={error ? "alert" : "status"}>
                    {loading ? "Loading records…" : error || emptyText}
                    {error && onRetry && (
                      <Button size="sm" onClick={onRetry}>
                        Retry
                      </Button>
                    )}
                  </div>
                </td>
              </tr>
            ) : (
              <>
                {windowed && range.start > 0 && (
                  <tr aria-hidden="true">
                    <td
                      colSpan={cellCount}
                      style={{
                        height: range.start * rowHeight,
                        padding: 0,
                        border: 0,
                      }}
                    />
                  </tr>
                )}
                {display.map((row, index) => {
                  const key = String(getRowKey(row)),
                    isExpanded = expanded.includes(key);
                  return (
                    <React.Fragment key={key}>
                      <tr
                        data-selected={selection.includes(key) || undefined}
                        aria-rowindex={
                          windowed ? range.start + index + 2 : undefined
                        }
                        style={{ height: rowHeight }}
                      >
                        {bulkActions.length > 0 && (
                          <td className="re-grid-control">
                            <Checkbox
                              label={
                                <span className="re-sr-only">
                                  Select record {range.start + index + 1}
                                </span>
                              }
                              checked={selection.includes(key)}
                              onCheckedChange={(checked) =>
                                toggle(key, checked)
                              }
                            />
                          </td>
                        )}
                        {renderExpanded && (
                          <td>
                            <button
                              className="re-grid-expand"
                              type="button"
                              aria-label={`Details for record ${range.start + index + 1}`}
                              aria-expanded={isExpanded}
                              onClick={() =>
                                setExpanded((old) =>
                                  isExpanded
                                    ? old.filter((value) => value !== key)
                                    : [...old, key],
                                )
                              }
                            >
                              <Icon
                                name={
                                  isExpanded ? "chevron-down" : "chevron-right"
                                }
                                size={14}
                              />
                            </button>
                          </td>
                        )}
                        {layout.map((column) => (
                          <td
                            key={column.key}
                            className={column.pinned ? "is-pinned" : ""}
                            style={{
                              left: column.pinned ? column.left : undefined,
                              textAlign: column.align || "left",
                            }}
                          >
                            <div
                              className={windowed ? "re-grid-cell-fixed" : ""}
                              style={
                                windowed
                                  ? { maxHeight: rowHeight - 12 }
                                  : undefined
                              }
                            >
                              {column.render
                                ? column.render(row[column.key], row)
                                : String(row[column.key] ?? "")}
                            </div>
                          </td>
                        ))}
                        {rowActions && <td>{rowActions(row)}</td>}
                      </tr>
                      {isExpanded && (
                        <tr>
                          <td colSpan={cellCount} className="re-grid-expanded">
                            {renderExpanded(row)}
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  );
                })}
                {windowed && range.end < data.length && (
                  <tr aria-hidden="true">
                    <td
                      colSpan={cellCount}
                      style={{
                        height: (data.length - range.end) * rowHeight,
                        padding: 0,
                        border: 0,
                      }}
                    />
                  </tr>
                )}
              </>
            )}
          </tbody>
        </table>
      </div>
      <div className="re-grid-footer">
        <span>
          {windowed
            ? "Virtual scrolling"
            : `Page ${currentPage + 1} of ${pages}`}{" "}
          · {data.length.toLocaleString()} records
        </span>
        {!windowed && (
          <div>
            <Button
              size="sm"
              variant="ghost"
              disabled={!currentPage}
              onClick={() => setPage(currentPage - 1)}
              icon="prev"
              aria-label="Previous records"
            />
            <Button
              size="sm"
              variant="ghost"
              disabled={currentPage >= pages - 1}
              onClick={() => setPage(currentPage + 1)}
              icon="next"
              aria-label="Next records"
            />
          </div>
        )}
      </div>
    </section>
  );
}
