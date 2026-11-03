import React, { useId, useRef, useState } from "react";
import Icon from "./send/Icon.jsx";

/** Compare two versions of the same artwork with a native keyboard/touch range. */
export function ImageCompare({
  before,
  after,
  value,
  onValueChange,
  label = "Compare images",
  aspectRatio = "16 / 10",
  disabled = false,
  className = "",
  style,
}) {
  const position = Math.max(0, Math.min(100, Number(value) || 0));
  return (
    <figure
      className={`re-image-compare ${className}`}
      style={{ aspectRatio, "--compare-position": `${position}%`, ...style }}
    >
      <img src={after.src} alt={after.alt} draggable={false} />
      <div
        className="re-compare-before"
        style={{ clipPath: `inset(0 ${100 - position}% 0 0)` }}
      >
        <img src={before.src} alt={before.alt} draggable={false} />
      </div>
      <span className="re-compare-caption re-compare-caption-before">
        {before.label || "Before"}
      </span>
      <span className="re-compare-caption re-compare-caption-after">
        {after.label || "After"}
      </span>
      <span className="re-compare-divider" aria-hidden="true">
        <span>
          <Icon name="chevrons-left-right" />
        </span>
      </span>
      <input
        type="range"
        min={0}
        max={100}
        step={1}
        value={position}
        disabled={disabled}
        aria-label={label}
        aria-valuetext={`${position}% before, ${100 - position}% after`}
        onChange={(e) => onValueChange(Number(e.target.value))}
      />
    </figure>
  );
}

/** A flat ARIA tree with explicit levels, roving focus and controlled expansion. */
export function TreeView({
  nodes,
  value,
  onValueChange,
  expandedKeys,
  onExpandedChange,
  label = "Items",
  className = "",
  style,
}) {
  const refs = useRef(new Map()),
    search = useRef({ text: "", time: 0 });
  const [focused, setFocused] = useState(value || nodes[0]?.id);
  const expanded = new Set(expandedKeys),
    visible = [];
  const walk = (items, level = 1, parent = null) =>
    items.forEach((node, index) => {
      visible.push({ node, level, parent, index, size: items.length });
      if (node.children?.length && expanded.has(node.id))
        walk(node.children, level + 1, node.id);
    });
  walk(nodes);
  const focusable = visible.some((x) => x.node.id === focused)
    ? focused
    : visible.some((x) => x.node.id === value)
      ? value
      : visible[0]?.node.id;
  const focus = (id) => {
    setFocused(id);
    refs.current.get(id)?.focus();
  };
  const toggle = (node) =>
    onExpandedChange(
      expanded.has(node.id)
        ? expandedKeys.filter((id) => id !== node.id)
        : [...expandedKeys, node.id],
    );
  return (
    <div
      role="tree"
      aria-label={label}
      className={`re-tree ${className}`}
      style={style}
    >
      {visible.map(({ node, level, parent, index, size }, i) => (
        <div
          key={node.id}
          ref={(el) => {
            if (el) refs.current.set(node.id, el);
            else refs.current.delete(node.id);
          }}
          role="treeitem"
          aria-level={level}
          aria-posinset={index + 1}
          aria-setsize={size}
          aria-selected={value === node.id}
          aria-expanded={
            node.children?.length ? expanded.has(node.id) : undefined
          }
          aria-disabled={node.disabled || undefined}
          tabIndex={focusable === node.id ? 0 : -1}
          className="re-tree-row"
          style={{ "--tree-level": level - 1 }}
          onFocus={() => setFocused(node.id)}
          onClick={() => {
            focus(node.id);
            if (!node.disabled) onValueChange(node.id);
          }}
          onKeyDown={(event) => {
            let next;
            if (event.key === "ArrowDown")
              next = visible[Math.min(visible.length - 1, i + 1)]?.node.id;
            else if (event.key === "ArrowUp")
              next = visible[Math.max(0, i - 1)]?.node.id;
            else if (event.key === "Home") next = visible[0]?.node.id;
            else if (event.key === "End") next = visible.at(-1)?.node.id;
            else if (event.key === "ArrowRight" && node.children?.length) {
              if (!expanded.has(node.id)) toggle(node);
              else next = node.children[0].id;
            } else if (event.key === "ArrowLeft") {
              if (node.children?.length && expanded.has(node.id)) toggle(node);
              else next = parent;
            } else if (event.key === "Enter" || event.key === " ") {
              if (!node.disabled) onValueChange(node.id);
            } else if (
              event.key.length === 1 &&
              !event.ctrlKey &&
              !event.metaKey &&
              !event.altKey
            ) {
              const now = Date.now();
              search.current = {
                text:
                  (now - search.current.time < 600 ? search.current.text : "") +
                  event.key.toLowerCase(),
                time: now,
              };
              next = [...visible.slice(i + 1), ...visible.slice(0, i + 1)].find(
                (x) =>
                  x.node.label.toLowerCase().startsWith(search.current.text),
              )?.node.id;
            } else return;
            event.preventDefault();
            if (next) focus(next);
          }}
        >
          {node.children?.length ? (
            <button
              type="button"
              tabIndex={-1}
              aria-label={`${expanded.has(node.id) ? "Collapse" : "Expand"} ${node.label}`}
              aria-expanded={expanded.has(node.id)}
              onClick={(e) => {
                e.stopPropagation();
                focus(node.id);
                toggle(node);
              }}
            >
              <Icon
                name={expanded.has(node.id) ? "chevron-down" : "chevron-right"}
              />
            </button>
          ) : (
            <span className="re-tree-spacer" />
          )}
          <Icon
            name={node.icon || (node.children?.length ? "folder" : "file")}
          />
          <span className="re-tree-label">{node.label}</span>
          {node.detail && <small>{node.detail}</small>}
        </div>
      ))}
      {!visible.length && <p className="muted">No items</p>}
    </div>
  );
}

/** Caller-owned vector strokes: no upload or legal signing flow is performed. */
export function SignaturePad({
  value,
  onValueChange,
  label = "Draw your signature",
  disabled = false,
  strokeWidth = 3,
  emptyText = "Draw here",
  footer,
  className = "",
  style,
}) {
  const surface = useRef(null),
    drawing = useRef(null),
    [draft, setDraft] = useState(null),
    id = useId();
  const point = (e) => {
    const rect = surface.current.getBoundingClientRect();
    return {
      x: Math.max(
        0,
        Math.min(1000, ((e.clientX - rect.left) / rect.width) * 1000),
      ),
      y: Math.max(
        0,
        Math.min(400, ((e.clientY - rect.top) / rect.height) * 400),
      ),
    };
  };
  const finish = (e, cancel = false) => {
    if (drawing.current?.pointer !== e.pointerId) return;
    const stroke = drawing.current.points;
    drawing.current = null;
    setDraft(null);
    if (!cancel) onValueChange([...value, stroke]);
    if (e.currentTarget.hasPointerCapture(e.pointerId))
      e.currentTarget.releasePointerCapture(e.pointerId);
  };
  const width = Math.max(1, Math.min(12, strokeWidth));
  return (
    <div className={`re-signature ${className}`} style={style}>
      <div className="re-signature-label" id={id}>
        {label}
      </div>
      <svg
        ref={surface}
        viewBox="0 0 1000 400"
        role="img"
        aria-labelledby={id}
        aria-describedby={`${id}-hint`}
        aria-disabled={disabled || undefined}
        onPointerDown={(e) => {
          if (disabled || e.button !== 0 || !e.isPrimary) return;
          e.preventDefault();
          e.currentTarget.setPointerCapture(e.pointerId);
          const p = point(e);
          drawing.current = { pointer: e.pointerId, points: [p] };
          setDraft([p]);
        }}
        onPointerMove={(e) => {
          if (drawing.current?.pointer !== e.pointerId || disabled) return;
          const p = point(e),
            points = drawing.current.points,
            last = points.at(-1);
          if (Math.hypot(p.x - last.x, p.y - last.y) < 1) return;
          points.push(p);
          setDraft([...points]);
        }}
        onPointerUp={(e) => finish(e)}
        onPointerCancel={(e) => finish(e, true)}
        onLostPointerCapture={(e) => finish(e, true)}
      >
        <path className="re-signature-baseline" d="M80 310H920" />
        {!value.length && !draft && (
          <text
            x="500"
            y="190"
            textAnchor="middle"
            className="re-signature-placeholder"
          >
            {emptyText}
          </text>
        )}
        {[...value, ...(draft ? [draft] : [])].map((stroke, i) =>
          stroke.length > 0 ? (
            <path
              key={i}
              d={
                stroke.length === 1
                  ? `M${stroke[0].x} ${stroke[0].y}l.1 .1`
                  : stroke
                      .map((p, j) => `${j ? "L" : "M"}${p.x} ${p.y}`)
                      .join(" ")
              }
              fill="none"
              stroke="currentColor"
              strokeWidth={width}
              vectorEffect="non-scaling-stroke"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          ) : null,
        )}
      </svg>
      <div className="re-signature-tools">
        <span id={`${id}-hint`}>
          {footer ||
            "Use a pointer or touch. Drawing requires a pointing device."}
        </span>
        <button
          type="button"
          className="btn btn-ghost"
          disabled={disabled || !value.length}
          onClick={() => onValueChange(value.slice(0, -1))}
        >
          Undo stroke
        </button>
        <button
          type="button"
          className="btn btn-outline"
          disabled={disabled || !value.length}
          onClick={() => onValueChange([])}
        >
          Clear
        </button>
      </div>
    </div>
  );
}

const parseDay = (text) => {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(text)) return null;
  const date = new Date(`${text}T00:00:00Z`);
  return Number.isFinite(+date) && date.toISOString().slice(0, 10) === text
    ? date
    : null;
};
/** A date-based activity matrix; day labels and intensity are available without color. */
export function ActivityHeatmap({
  startDate,
  weeks = 16,
  values = [],
  value,
  onValueChange,
  label = "Activity",
  max,
  locale = "en",
  formatValue = (n) => `${n} events`,
  className = "",
  style,
}) {
  const start = parseDay(startDate),
    count = Math.max(1, Math.min(53, Math.floor(weeks) || 1)) * 7,
    refs = useRef([]),
    [focused, setFocused] = useState(0);
  if (!start)
    return (
      <p role="alert">ActivityHeatmap needs a valid YYYY-MM-DD startDate.</p>
    );
  const monday = new Date(+start);
  monday.setUTCDate(start.getUTCDate() - ((start.getUTCDay() + 6) % 7));
  const byDate = new Map(
      values.map((x) => [
        x.date,
        Number.isFinite(Number(x.value)) ? Math.max(0, Number(x.value)) : 0,
      ]),
    ),
    peak =
      Number.isFinite(max) && max > 0 ? max : Math.max(1, ...byDate.values());
  const days = Array.from({ length: count }, (_, i) => {
    const date = new Date(+monday + i * 86400000),
      key = date.toISOString().slice(0, 10);
    return { date, key, value: byDate.get(key) || 0 };
  });
  const monthFormat = new Intl.DateTimeFormat(locale, {
    month: "short",
    timeZone: "UTC",
  });
  const weekdayFormat = new Intl.DateTimeFormat(locale, {
    weekday: "short",
    timeZone: "UTC",
  });
  const months = days.filter(
    (day, i) =>
      i % 7 === 0 &&
      (i === 0 || day.date.getUTCMonth() !== days[i - 7].date.getUTCMonth()),
  );
  const format = new Intl.DateTimeFormat(locale, {
    dateStyle: "full",
    timeZone: "UTC",
  });
  return (
    <figure className={`re-heatmap ${className}`} style={style}>
      <figcaption>{label}</figcaption>
      <div className="re-heatmap-scroll">
        <div
          className="re-heatmap-months"
          aria-hidden="true"
          style={{ "--heatmap-weeks": count / 7 }}
        >
          {months.map((day) => (
            <span
              key={day.key}
              style={{ gridColumn: Math.floor(days.indexOf(day) / 7) + 1 }}
            >
              {monthFormat.format(day.date)}
            </span>
          ))}
        </div>
        <div className="re-heatmap-body">
          <div className="re-heatmap-weekdays" aria-hidden="true">
            {days.slice(0, 7).map((day, i) => (
              <span key={day.key}>
                {i % 2 === 0 ? weekdayFormat.format(day.date) : ""}
              </span>
            ))}
          </div>
          <div
            className="re-heatmap-days"
            role="group"
            aria-label={label}
            style={{ "--heatmap-weeks": count / 7 }}
          >
            {days.map((day, i) => (
              <button
                key={day.key}
                ref={(el) => {
                  refs.current[i] = el;
                }}
                type="button"
                tabIndex={focused === i ? 0 : -1}
                aria-label={`${format.format(day.date)}: ${formatValue(day.value)}`}
                aria-pressed={onValueChange ? value === day.key : undefined}
                data-level={
                  day.value === 0
                    ? 0
                    : Math.min(
                        4,
                        Math.max(1, Math.ceil((day.value / peak) * 4)),
                      )
                }
                title={`${day.key} · ${formatValue(day.value)}`}
                onFocus={() => setFocused(i)}
                onClick={() => onValueChange?.(day.key)}
                onKeyDown={(e) => {
                  let next;
                  if (e.key === "ArrowRight") next = i + 7;
                  else if (e.key === "ArrowLeft") next = i - 7;
                  else if (e.key === "ArrowDown") next = i + 1;
                  else if (e.key === "ArrowUp") next = i - 1;
                  else if (e.key === "Home")
                    next = e.ctrlKey ? 0 : Math.floor(i / 7) * 7;
                  else if (e.key === "End")
                    next = e.ctrlKey ? count - 1 : Math.floor(i / 7) * 7 + 6;
                  else return;
                  e.preventDefault();
                  next = Math.max(0, Math.min(count - 1, next));
                  refs.current[next]?.focus();
                }}
              >
                <span className="re-sr-only">{day.value}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
      <div className="re-heatmap-legend" aria-hidden="true">
        <span>Less</span>
        {[0, 1, 2, 3, 4].map((level) => (
          <i key={level} data-level={level} />
        ))}
        <span>More</span>
      </div>
    </figure>
  );
}
