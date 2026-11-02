import React, {
  useEffect,
  useLayoutEffect,
  useId,
  useRef,
  useState,
} from "react";
import Icon from "./send/Icon.jsx";
import Avatar from "./send/AccountAvatar.jsx";
import Modal from "./send/ui/Modal.jsx";
import ActionButton from "./send/ActionButton.jsx";

export function Accordion({
  items,
  value,
  onValueChange,
  label = "Details",
  className = "",
  style,
}) {
  const uid = useId();
  return (
    <div
      className={`re-accordion ${className}`}
      style={style}
      aria-label={label}
    >
      {items.map((item, i) => {
        const open = value === item.value;
        return (
          <section
            key={item.value}
            className={`re-accordion-item ${open ? "is-open" : ""}`}
          >
            <h3>
              <button
                type="button"
                aria-expanded={open}
                aria-controls={`${uid}-${i}`}
                id={`${uid}-trigger-${i}`}
                onClick={() => onValueChange(open ? null : item.value)}
              >
                {item.icon && <Icon name={item.icon} />}
                <span>{item.title}</span>
                <Icon name="chevron" />
              </button>
            </h3>
            <div className="re-accordion-body" inert={!open}>
              <div>
                <div
                  id={`${uid}-${i}`}
                  role="region"
                  aria-labelledby={`${uid}-trigger-${i}`}
                >
                  {item.content}
                </div>
              </div>
            </div>
          </section>
        );
      })}
    </div>
  );
}
export function Alert({
  tone = "neutral",
  title,
  children,
  onDismiss,
  action,
  className = "",
  style,
}) {
  return (
    <div
      className={`re-alert ${tone} ${className}`}
      style={style}
      role={tone === "bad" ? "alert" : "status"}
    >
      <span className="re-alert-icon">
        <Icon
          name={tone === "good" ? "check" : tone === "bad" ? "warning" : "bell"}
        />
      </span>
      <div>
        <strong>{title}</strong>
        {children && <p>{children}</p>}
        {action && <div className="re-alert-action">{action}</div>}
      </div>
      {onDismiss && (
        <button
          type="button"
          className="icon-btn"
          aria-label="Dismiss alert"
          onClick={onDismiss}
        >
          <Icon name="close" />
        </button>
      )}
    </div>
  );
}
export function Checkbox({
  checked,
  onCheckedChange,
  label,
  hint,
  disabled = false,
  indeterminate = false,
  className = "",
  style,
  inputProps = {},
}) {
  const input = useRef(null);
  useLayoutEffect(() => {
    input.current.indeterminate = indeterminate;
  });
  return (
    <label
      className={`re-check ${disabled ? "is-disabled" : ""} ${className}`}
      style={style}
    >
      <input
        {...inputProps}
        ref={input}
        type="checkbox"
        checked={checked}
        onChange={(e) => {
          const next = e.target.checked;
          e.target.indeterminate = indeterminate;
          onCheckedChange(next);
        }}
        disabled={disabled}
      />
      <span className="re-check-box" aria-hidden="true">
        <Icon name="check" />
      </span>
      <span className="re-control-copy">
        {label}
        {hint && <small>{hint}</small>}
      </span>
    </label>
  );
}
export function RadioGroup({
  options,
  value,
  onValueChange,
  label,
  name,
  disabled = false,
  className = "",
  style,
}) {
  const uid = useId();
  return (
    <fieldset className={`re-radio-group ${className}`} style={style}>
      <legend>{label}</legend>
      {options.map((option) => (
        <label
          key={option.value}
          className={`re-radio-option ${value === option.value ? "is-selected" : ""}`}
        >
          <input
            type="radio"
            name={name || uid}
            value={option.value}
            checked={value === option.value}
            onChange={() => onValueChange(option.value)}
            disabled={disabled || option.disabled}
          />
          <span className="re-radio-dot" aria-hidden="true" />
          <span className="re-control-copy">
            {option.label}
            {option.description && <small>{option.description}</small>}
          </span>
          {option.trailing && (
            <span className="re-radio-trailing">{option.trailing}</span>
          )}
        </label>
      ))}
    </fieldset>
  );
}
export function Slider({
  value,
  onValueChange,
  min = 0,
  max = 100,
  step = 1,
  label = "Value",
  formatValue = (value) => String(value),
  disabled = false,
  className = "",
  style,
}) {
  const id = useId();
  const percentage =
    max > min
      ? Math.max(0, Math.min(100, ((value - min) / (max - min)) * 100))
      : 0;
  return (
    <div className={`re-slider ${className}`} style={style}>
      <div>
        <label htmlFor={id}>{label}</label>
        <output htmlFor={id}>{formatValue(value)}</output>
      </div>
      <input
        id={id}
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        disabled={disabled}
        aria-valuetext={formatValue(value)}
        style={{ "--range-fill": percentage + "%" }}
        onChange={(e) => onValueChange(Number(e.target.value))}
      />
      <div className="re-range-ends">
        <span>{formatValue(min)}</span>
        <span>{formatValue(max)}</span>
      </div>
    </div>
  );
}
export function Progress({
  value,
  max = 100,
  label = "Progress",
  hint,
  indeterminate = false,
  className = "",
  style,
}) {
  const limit = max > 0 ? max : 100;
  const current = Number.isFinite(value)
    ? Math.max(0, Math.min(limit, value))
    : 0;
  const amount = (current / limit) * 100;
  return (
    <div className={`re-progress ${className}`} style={style}>
      <div className="re-progress-label">
        <span>{label}</span>
        {!indeterminate && <span>{Math.round(amount)}%</span>}
      </div>
      <div
        role="progressbar"
        aria-label={label}
        aria-valuenow={indeterminate ? undefined : current}
        aria-valuemin={0}
        aria-valuemax={limit}
        className={`re-progress-track ${indeterminate ? "is-indeterminate" : ""}`}
      >
        <span style={{ width: indeterminate ? "40%" : amount + "%" }} />
      </div>
      {hint && <small>{hint}</small>}
    </div>
  );
}
export function PasswordInput({
  label = "Password",
  hint,
  className = "",
  style,
  ...props
}) {
  const [visible, setVisible] = useState(false);
  const id = useId();
  return (
    <div className={`field ${className}`} style={style}>
      <label htmlFor={id}>{label}</label>
      <div className="re-password">
        <input {...props} id={id} type={visible ? "text" : "password"} />
        <button
          type="button"
          aria-label={visible ? "Hide password" : "Show password"}
          aria-pressed={visible}
          disabled={props.disabled}
          onClick={() => setVisible(!visible)}
        >
          <Icon name={visible ? "lock" : "eye"} />
        </button>
      </div>
      {hint && <small className="muted">{hint}</small>}
    </div>
  );
}
export function NumberInput({
  value,
  onValueChange,
  min = -Infinity,
  max = Infinity,
  step = 1,
  label = "Quantity",
  disabled = false,
  className = "",
  style,
}) {
  const id = useId();
  const [draft, setDraft] = useState(String(value));
  useLayoutEffect(() => setDraft(String(value)), [value]);
  const clamp = (number) => Math.min(max, Math.max(min, number));
  return (
    <div className={`re-number ${className}`} style={style}>
      <label htmlFor={id}>{label}</label>
      <div>
        <button
          type="button"
          aria-label={`Decrease ${label.toLowerCase()}`}
          disabled={disabled || value <= min}
          onClick={() =>
            onValueChange(clamp(Number((value - step).toFixed(10))))
          }
        >
          <Icon name="minus" />
        </button>
        <input
          id={id}
          type="number"
          value={draft}
          step={step}
          min={Number.isFinite(min) ? min : undefined}
          max={Number.isFinite(max) ? max : undefined}
          disabled={disabled}
          onBlur={() => {
            const next = Number(draft);
            const safe =
              draft.trim() !== "" && Number.isFinite(next)
                ? clamp(next)
                : value;
            setDraft(String(safe));
            if (safe !== value) onValueChange(safe);
          }}
          onChange={(e) => {
            setDraft(e.target.value);
            if (e.target.value !== "") {
              const next = Number(e.target.value);
              if (Number.isFinite(next)) onValueChange(clamp(next));
            }
          }}
        />
        <button
          type="button"
          aria-label={`Increase ${label.toLowerCase()}`}
          disabled={disabled || value >= max}
          onClick={() =>
            onValueChange(clamp(Number((value + step).toFixed(10))))
          }
        >
          <Icon name="plus" />
        </button>
      </div>
    </div>
  );
}
export function Breadcrumbs({
  items,
  label = "Breadcrumb",
  className = "",
  style,
}) {
  return (
    <nav
      className={`re-breadcrumbs ${className}`}
      style={style}
      aria-label={label}
    >
      <ol>
        {items.map((item, i) => (
          <li key={item.href || i}>
            {i > 0 && <Icon name="next" />}
            {i === items.length - 1 ? (
              <span aria-current="page">{item.label}</span>
            ) : (
              <a href={item.href}>{item.label}</a>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
export function AvatarGroup({
  people,
  max = 4,
  label = "Team members",
  size = 40,
  overlap = 12,
  onMore,
  className = "",
  style,
}) {
  const count = Math.max(0, Math.floor(max)),
    visible = people.slice(0, count),
    extra = people.length - visible.length;
  const More = onMore ? "button" : "span";
  return (
    <div
      className={`re-avatar-group ${className}`}
      style={{
        "--avatar-size": `${size}px`,
        "--avatar-overlap": `${overlap}px`,
        ...style,
      }}
      aria-label={label}
    >
      {visible.map((person, i) => (
        <span
          key={person.id || i}
          className="re-avatar-person"
          style={{ "--avatar-index": visible.length - i }}
          title={person.name}
          aria-label={person.name}
        >
          <Avatar {...person} />
        </span>
      ))}
      {extra > 0 && (
        <More
          type={onMore ? "button" : undefined}
          className="re-avatar-more"
          aria-label={`${extra} more members`}
          onClick={onMore}
        >
          +{extra}
        </More>
      )}
    </div>
  );
}
export function CopyButton({
  value,
  label = "Copy",
  copiedLabel = "Copied",
  onCopy,
  onError,
  className = "",
  style,
}) {
  const [copied, setCopied] = useState(false),
    [error, setError] = useState("");
  const timer = useRef(null);
  useEffect(() => () => clearTimeout(timer.current), []);
  return (
    <div className={`re-copy-wrap ${className}`} style={style}>
      <ActionButton
        className="btn-outline"
        icon={copied ? "check" : "copy"}
        onClick={async () => {
          try {
            await navigator.clipboard.writeText(value);
            setCopied(true);
            setError("");
            onCopy?.();
            clearTimeout(timer.current);
            timer.current = setTimeout(() => setCopied(false), 1800);
          } catch (e) {
            setError("Could not copy. Select and copy the text manually.");
            onError?.(e);
          }
        }}
      >
        {copied ? copiedLabel : label}
      </ActionButton>
      <span role="status" className="re-copy-status">
        {error}
      </span>
    </div>
  );
}
export function FileDropzone({
  onFiles,
  accept,
  multiple = true,
  disabled = false,
  maxSize = 10 * 1024 * 1024,
  label = "Drop your files here",
  description = "or browse from your device",
  className = "",
  style,
}) {
  const [dragging, setDragging] = useState(false),
    [error, setError] = useState("");
  const input = useRef(null),
    depth = useRef(0);
  const id = useId();
  const acceptFile = (file) =>
    !accept ||
    accept.split(",").some((pattern) => {
      const p = pattern.trim().toLowerCase();
      return p.startsWith(".")
        ? file.name.toLowerCase().endsWith(p)
        : p.endsWith("/*")
          ? file.type.toLowerCase().startsWith(p.slice(0, -1))
          : file.type.toLowerCase() === p;
    });
  const choose = (files) => {
    if (disabled) return;
    const all = [...files];
    if (!all.length) return;
    if (!multiple && all.length > 1) {
      setError("Choose one file.");
      return;
    }
    if (all.some((file) => file.size > maxSize)) {
      setError(
        `Each file must be smaller than ${Math.round(maxSize / 1024 / 1024)} MB.`,
      );
      return;
    }
    if (all.some((file) => !acceptFile(file))) {
      setError("This file type is not supported.");
      return;
    }
    setError("");
    onFiles(all);
  };
  return (
    <div className={`re-dropzone-wrap ${className}`} style={style}>
      <button
        type="button"
        className={`re-dropzone ${dragging ? "is-dragging" : ""}`}
        disabled={disabled}
        aria-describedby={`${id}-hint`}
        onClick={() => input.current?.click()}
        onDragEnter={(e) => {
          e.preventDefault();
          depth.current++;
          if (!disabled) setDragging(true);
        }}
        onDragOver={(e) => e.preventDefault()}
        onDragLeave={(e) => {
          e.preventDefault();
          depth.current--;
          if (depth.current <= 0) {
            depth.current = 0;
            setDragging(false);
          }
        }}
        onDrop={(e) => {
          e.preventDefault();
          depth.current = 0;
          setDragging(false);
          choose(e.dataTransfer.files);
        }}
      >
        <span className="re-drop-icon">
          <Icon name="upload" />
        </span>
        <strong>{label}</strong>
        <span id={`${id}-hint`}>{description}</span>
        <small>
          {accept || "Any file type"} · Up to{" "}
          {Math.round(maxSize / 1024 / 1024)} MB each
        </small>
      </button>
      <input
        ref={input}
        type="file"
        hidden
        accept={accept}
        multiple={multiple}
        disabled={disabled}
        onChange={(e) => {
          choose(e.target.files);
          e.target.value = "";
        }}
      />
      {error && (
        <p className="re-file-error" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
export function Timeline({ items, label = "Activity", className = "", style }) {
  return (
    <ol className={`re-timeline ${className}`} style={style} aria-label={label}>
      {items.map((item, i) => (
        <li key={item.id || i}>
          <span className={`re-timeline-dot ${item.tone || ""}`}>
            <Icon name={item.icon || "check"} />
          </span>
          <div>
            <strong>{item.title}</strong>
            {item.description && <p>{item.description}</p>}
            {item.time && <time dateTime={item.dateTime}>{item.time}</time>}
          </div>
        </li>
      ))}
    </ol>
  );
}
export function Drawer({
  open,
  onOpenChange,
  title,
  children,
  footer,
  side = "right",
  className = "",
  style,
}) {
  return (
    <Modal
      open={open}
      title={title}
      className={`re-drawer re-drawer-${side} ${className}`}
      style={style}
      onClose={() => onOpenChange(false)}
      footer={footer}
    >
      {children}
    </Modal>
  );
}
export function DataTable({
  columns,
  rows,
  rowKey = "id",
  caption,
  emptyText = "No records found",
  emptyContent,
  loading = false,
  sort,
  onSortChange,
  onRowClick,
  selectedKeys,
  onSelectionChange,
  rowActions,
  density = "comfortable",
  className = "",
  style,
}) {
  const keyOf = (row, i) =>
    typeof rowKey === "function" ? rowKey(row) : (row[rowKey] ?? i);
  const keys = rows.map(keyOf),
    selected = new Set(selectedKeys || []);
  const selectable = !!onSelectionChange;
  const toggleAll = (checked) => {
    const next = new Set(selected);
    keys.forEach((key) => (checked ? next.add(key) : next.delete(key)));
    onSelectionChange([...next]);
  };
  return (
    <div
      className={`re-data-table ${className}`}
      style={style}
      data-density={density}
      aria-busy={loading || undefined}
    >
      <table>
        {caption && <caption>{caption}</caption>}
        <colgroup>
          {selectable && <col style={{ width: 44 }} />}
          {columns.map((column) => (
            <col key={column.key} style={{ width: column.width }} />
          ))}
          {rowActions && <col style={{ width: 72 }} />}
        </colgroup>
        <thead>
          <tr>
            {selectable && (
              <th scope="col">
                <Checkbox
                  label={<span className="re-sr-only">Select all rows</span>}
                  checked={
                    keys.length > 0 && keys.every((key) => selected.has(key))
                  }
                  indeterminate={
                    keys.some((key) => selected.has(key)) &&
                    !keys.every((key) => selected.has(key))
                  }
                  onCheckedChange={toggleAll}
                  disabled={!keys.length}
                />
              </th>
            )}
            {columns.map((column) => (
              <th
                key={column.key}
                scope="col"
                style={{
                  width: column.width,
                  textAlign: column.align || "left",
                }}
                aria-sort={
                  sort?.key === column.key
                    ? sort.direction === "asc"
                      ? "ascending"
                      : "descending"
                    : column.sortable
                      ? "none"
                      : undefined
                }
              >
                {column.sortable && onSortChange ? (
                  <button
                    type="button"
                    onClick={() =>
                      onSortChange({
                        key: column.key,
                        direction:
                          sort?.key === column.key && sort.direction === "asc"
                            ? "desc"
                            : "asc",
                      })
                    }
                  >
                    {column.label}
                    <Icon name="sort" />
                  </button>
                ) : (
                  column.label
                )}
              </th>
            ))}
            {rowActions && (
              <th scope="col">
                <span className="re-sr-only">Actions</span>
              </th>
            )}
          </tr>
        </thead>
        <tbody>
          {!loading && rows.length ? (
            rows.map((row, i) => {
              const key = keyOf(row, i);
              return (
                <tr key={key} data-selected={selected.has(key) || undefined}>
                  {selectable && (
                    <td>
                      <Checkbox
                        label={
                          <span className="re-sr-only">Select row {i + 1}</span>
                        }
                        checked={selected.has(key)}
                        onCheckedChange={(checked) => {
                          const next = new Set(selected);
                          checked ? next.add(key) : next.delete(key);
                          onSelectionChange([...next]);
                        }}
                      />
                    </td>
                  )}
                  {columns.map((column, j) => (
                    <td
                      key={column.key}
                      style={{ textAlign: column.align || "left" }}
                    >
                      {j === 0 && onRowClick ? (
                        <button
                          type="button"
                          className="re-table-row-action"
                          onClick={() => onRowClick(row)}
                        >
                          {column.render
                            ? column.render(row[column.key], row)
                            : row[column.key]}
                        </button>
                      ) : column.render ? (
                        column.render(row[column.key], row)
                      ) : (
                        row[column.key]
                      )}
                    </td>
                  ))}
                  {rowActions && <td>{rowActions(row)}</td>}
                </tr>
              );
            })
          ) : (
            <tr>
              <td
                className="re-table-empty"
                colSpan={
                  columns.length + Number(selectable) + Number(!!rowActions)
                }
              >
                {loading ? (
                  <span className="re-table-loading" role="status">
                    <span className="spinner" />
                    Loading records…
                  </span>
                ) : (
                  emptyContent || emptyText
                )}
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export function CardHeader({
  title,
  description,
  action,
  children,
  className = "",
  ...props
}) {
  return (
    <div {...props} className={`re-card-header ${className}`}>
      <div>
        {title && <h2>{title}</h2>}
        {description && <p>{description}</p>}
        {children}
      </div>
      {action && <div className="re-card-header-action">{action}</div>}
    </div>
  );
}
export function CardBody({ children, className = "", ...props }) {
  return (
    <div {...props} className={`re-card-body ${className}`}>
      {children}
    </div>
  );
}
export function CardFooter({ children, className = "", ...props }) {
  return (
    <div {...props} className={`re-card-footer ${className}`}>
      {children}
    </div>
  );
}
export function MetricGrid({
  children,
  minWidth = 170,
  className = "",
  style,
  ...props
}) {
  return (
    <div
      {...props}
      className={`re-metric-grid ${className}`}
      style={{ "--metric-min": `${minWidth}px`, ...style }}
    >
      {children}
    </div>
  );
}
export function StatCard({
  label,
  value,
  hint,
  icon,
  tone = "neutral",
  trend,
  trendLabel,
  chart,
  progress,
  variant = "default",
  className = "",
  style,
  ...props
}) {
  const id = useId();
  const points = chart?.length > 1 ? chart : undefined;
  const low = points ? Math.min(...points) : 0,
    high = points ? Math.max(...points) : 1;
  const path = points
    ?.map(
      (v, i) =>
        `${i === 0 ? "M" : "L"}${(i / (points.length - 1)) * 120},${32 - ((v - low) / (high - low || 1)) * 28}`,
    )
    .join(" ");
  return (
    <section
      {...props}
      className={`re-stat-card re-stat-${variant} ${tone} ${className}`}
      style={style}
    >
      <div className="re-stat-label">
        <span>{label}</span>
        {icon && <Icon name={icon} />}
      </div>
      <div className="re-stat-main">
        <strong>{value}</strong>
        {trend && (
          <span
            className={`re-stat-trend ${String(trend).startsWith("-") ? "negative" : ""}`}
          >
            {trend}
          </span>
        )}
      </div>
      {(hint || trendLabel) && <p>{hint || trendLabel}</p>}
      {points && (
        <svg
          className="re-stat-chart"
          viewBox="0 0 120 38"
          role="img"
          aria-label={`${label} trend`}
        >
          <defs>
            <linearGradient id={id} x1="0" x2="0" y1="0" y2="1">
              <stop offset="0%" stopColor="currentColor" stopOpacity=".18" />
              <stop offset="100%" stopColor="currentColor" stopOpacity="0" />
            </linearGradient>
          </defs>
          <path d={`${path} L120,38 L0,38 Z`} fill={`url(#${id})`} />
          <path
            d={path}
            fill="none"
            stroke="currentColor"
            strokeWidth="1.7"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      )}
      {progress != null && (
        <div
          className="re-stat-progress"
          role="progressbar"
          aria-label={`${label} progress`}
          aria-valuenow={Math.max(0, Math.min(100, progress))}
          aria-valuemin={0}
          aria-valuemax={100}
        >
          <span style={{ width: Math.max(0, Math.min(100, progress)) + "%" }} />
        </div>
      )}
    </section>
  );
}
export function Tile({
  title,
  description,
  icon = "files",
  image,
  meta,
  footer,
  href,
  onClick,
  disabled = false,
  className = "",
  ...props
}) {
  const Tag = href ? "a" : onClick ? "button" : "article";
  return (
    <Tag
      {...props}
      href={disabled ? undefined : href}
      tabIndex={disabled ? -1 : undefined}
      type={onClick ? "button" : undefined}
      onClick={disabled ? undefined : onClick}
      disabled={onClick ? disabled : undefined}
      aria-disabled={disabled || undefined}
      className={`re-tile ${href || onClick ? "is-interactive" : ""} ${className}`}
    >
      <div className="re-tile-top">
        <span className="re-tile-icon">
          {image ? <img src={image} alt="" /> : <Icon name={icon} />}
        </span>
        {meta && <span className="re-tile-meta">{meta}</span>}
      </div>
      <strong>{title}</strong>
      {description && <p>{description}</p>}
      {(footer || href || onClick) && (
        <div className="re-tile-footer">
          <span>{footer || "Open"}</span>
          {(href || onClick) && <Icon name="next" />}
        </div>
      )}
    </Tag>
  );
}
export function PageHeader({
  title,
  description,
  icon,
  image,
  eyebrow,
  actions,
  children,
  className = "",
  ...props
}) {
  return (
    <header {...props} className={`re-page-header ${className}`}>
      <div className="re-page-heading">
        {(icon || image) && (
          <span className="re-page-icon">
            {image ? <img src={image} alt="" /> : <Icon name={icon} />}
          </span>
        )}
        <div>
          {eyebrow && <small>{eyebrow}</small>}
          <h1>{title}</h1>
          {description && <p>{description}</p>}
        </div>
      </div>
      {actions && <div className="re-page-actions">{actions}</div>}
      {children}
    </header>
  );
}
export function Toolbar({ children, trailing, className = "", ...props }) {
  return (
    <div {...props} className={`re-toolbar ${className}`}>
      <div>{children}</div>
      {trailing && <div>{trailing}</div>}
    </div>
  );
}
