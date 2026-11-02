import { useSvgMotion } from "./icons/useSvgMotion.js";
import React, {
  useEffect,
  useId,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import Icon from "./send/Icon.jsx";
import Modal from "./send/ui/Modal.jsx";
const heart =
  "M20.8 4.6 C18.6 2.4 15.1 2.4 13 4.6 L12 5.7 L10.9 4.6 C8.7 2.4 5.2 2.4 3.1 4.6 C.9 6.8 .9 10.3 3.1 12.4 L12 21 L20.8 12.4 C23 10.3 23 6.8 20.8 4.6 Z";
const expandHeart = (scale) =>
  heart.replace(/-?\d*\.?\d+/g, (number) =>
    String(Number((12 + (Number(number) - 12) * scale).toFixed(3))),
  );
const glyphs = {
  bell: (
    <>
      <g>
        <path d="M6 16V11a6 6 0 0 1 12 0v5l2 2H4l2-2" />
        <animateTransform
          attributeName="transform"
          type="rotate"
          values="0 12 4;18 12 4;-15 12 4;10 12 4;-5 12 4;0 12 4"
          dur=".8s"
          begin="indefinite"
        />
      </g>
      <path d="M10 21h4" />
    </>
  ),
  heart: (
    <path d={heart}>
      <animate
        attributeName="d"
        values={`${heart};${expandHeart(1.08)};${heart};${expandHeart(1.04)};${heart}`}
        dur=".7s"
        begin="indefinite"
      />
    </path>
  ),
  check: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path pathLength="1" strokeDasharray="1" d="m7.5 12 3 3 6-6">
        <animate
          attributeName="stroke-dashoffset"
          values="1;0"
          dur=".6s"
          begin="indefinite"
        />
      </path>
    </>
  ),
  upload: (
    <>
      <path d="M4 16v5h16v-5" />
      <g>
        <path d="M12 16V3m-5 5 5-5 5 5" />
        <animateTransform
          attributeName="transform"
          type="translate"
          values="0 0;0 -3;0 1;0 0"
          dur=".65s"
          begin="indefinite"
        />
      </g>
    </>
  ),
  download: (
    <>
      <path d="M4 17v4h16v-4" />
      <g>
        <path d="M12 3v13m-5-5 5 5 5-5" />
        <animateTransform
          attributeName="transform"
          type="translate"
          values="0 0;0 3;0 -1;0 0"
          dur=".65s"
          begin="indefinite"
        />
      </g>
    </>
  ),
  search: (
    <>
      <circle cx="10.5" cy="10.5" r="6.5">
        <animate
          attributeName="r"
          values="6.5;7.3;6.5"
          dur=".7s"
          begin="indefinite"
        />
      </circle>
      <path d="m16 16 5 5" />
    </>
  ),
  refresh: (
    <g>
      <path d="M20 7a8 8 0 0 0-13.5-2L3 8m0-5v5h5M4 17a8 8 0 0 0 13.5 2L21 16m0 5v-5h-5" />
      <animateTransform
        attributeName="transform"
        type="rotate"
        from="0 12 12"
        to="360 12 12"
        dur="1s"
        begin="indefinite"
      />
    </g>
  ),
  settings: (
    <>
      <path d="M4 6h16M4 12h16M4 18h16" />
      <path d="M8 3v6">
        <animate
          attributeName="d"
          values="M8 3v6;M12 3v6;M8 3v6"
          dur=".7s"
          begin="indefinite"
        />
      </path>
      <path d="M16 9v6">
        <animate
          attributeName="d"
          values="M16 9v6;M11 9v6;M16 9v6"
          dur=".7s"
          begin="indefinite"
        />
      </path>
      <path d="M10 15v6">
        <animate
          attributeName="d"
          values="M10 15v6;M15 15v6;M10 15v6"
          dur=".7s"
          begin="indefinite"
        />
      </path>
    </>
  ),
  folder: (
    <>
      <path d="M3 9v11h18V9" />
      <path d="M3 9V5h6l2 3h10v1">
        <animate
          attributeName="d"
          values="M3 9V5h6l2 3h10v1;M3 9V3h6l2 3h10v3;M3 9V5h6l2 3h10v1"
          dur=".7s"
          begin="indefinite"
        />
      </path>
    </>
  ),
  send: (
    <g>
      <path d="m21 3-7 18-4-8-8-4L21 3ZM10 13 21 3" />
      <animateTransform
        attributeName="transform"
        type="translate"
        values="0 0;2 -2;-.5 .5;0 0"
        dur=".7s"
        begin="indefinite"
      />
    </g>
  ),
};
export const animatedIconNames = Object.keys(glyphs);
export function AnimatedIcon({
  name,
  size = 24,
  strokeWidth = 1.7,
  playing = false,
  loop = false,
  label,
  className = "",
  style,
  ...props
}) {
  const ref = useRef(null);
  useSvgMotion(ref, { playing, loop, hover: true, name });
  return (
    <svg
      {...props}
      ref={ref}
      className={`re-animated-icon ${className}`}
      data-preset={name}
      data-playing={playing || undefined}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      width={size}
      height={size}
      style={{ width: size, height: size, ...style }}
      aria-hidden={label ? undefined : true}
      aria-label={label}
      role={label ? "img" : undefined}
    >
      {glyphs[name] || glyphs.check}
    </svg>
  );
}
export function Popover({
  open,
  onOpenChange,
  trigger,
  children,
  label = "Details",
  align = "start",
  width = 280,
  className = "",
  style,
}) {
  const panel = useRef(null),
    button = useRef(null),
    id = useId();
  useLayoutEffect(() => {
    const node = panel.current;
    if (!node) return;
    if (!open) {
      if (node.matches(":popover-open")) node.hidePopover();
      return;
    }
    node.showPopover();
    const place = () => {
      const b = button.current.getBoundingClientRect(),
        p = node.getBoundingClientRect();
      const left = align === "end" ? b.right - p.width : b.left;
      node.style.left =
        Math.max(8, Math.min(left, innerWidth - p.width - 8)) + "px";
      node.style.top =
        (b.bottom + 8 + p.height <= innerHeight - 8
          ? b.bottom + 8
          : Math.max(8, b.top - p.height - 8)) + "px";
    };
    place();
    addEventListener("resize", place);
    addEventListener("scroll", place, true);
    return () => {
      removeEventListener("resize", place);
      removeEventListener("scroll", place, true);
    };
  }, [open, align, width]);
  return (
    <>
      {trigger({
        ref: button,
        "aria-expanded": open,
        "aria-controls": id,
        "aria-haspopup": "dialog",
        onClick: () => onOpenChange(!open),
      })}
      <div
        ref={panel}
        id={id}
        popover="auto"
        role="dialog"
        aria-label={label}
        className={`re-popover ${className}`}
        style={{ width, ...style }}
        onToggle={(event) => {
          if (event.newState === "closed" && open) onOpenChange(false);
        }}
        onKeyDown={(event) => {
          if (event.key === "Escape") {
            event.preventDefault();
            onOpenChange(false);
            button.current?.focus();
          }
        }}
      >
        {children}
      </div>
    </>
  );
}
export function Collapsible({
  open,
  onOpenChange,
  title,
  children,
  className = "",
  style,
}) {
  const id = useId();
  return (
    <div
      className={`re-collapsible ${open ? "is-open" : ""} ${className}`}
      style={style}
    >
      <button
        type="button"
        aria-expanded={open}
        aria-controls={id}
        onClick={() => onOpenChange(!open)}
      >
        <span>{title}</span>
        <Icon name="chevron" />
      </button>
      <div className="re-collapsible-grid" inert={!open}>
        <div>
          <div id={id}>{children}</div>
        </div>
      </div>
    </div>
  );
}
export function Steps({
  items,
  value,
  onValueChange,
  label = "Progress",
  orientation = "horizontal",
  className = "",
  style,
}) {
  const active = items.findIndex((item) => item.value === value);
  return (
    <ol
      className={`re-steps ${className}`}
      style={style}
      data-orientation={orientation}
      aria-label={label}
    >
      {items.map((item, i) => {
        const Tag = onValueChange ? "button" : "div";
        return (
          <li
            key={item.value}
            data-state={
              i < active ? "complete" : i === active ? "current" : "upcoming"
            }
          >
            <Tag
              type={onValueChange ? "button" : undefined}
              onClick={
                onValueChange ? () => onValueChange(item.value) : undefined
              }
              aria-current={i === active ? "step" : undefined}
            >
              <span className="re-step-number">
                {i < active ? <Icon name="check" /> : i + 1}
              </span>
              <span>
                <strong>{item.label}</strong>
                {item.description && <small>{item.description}</small>}
              </span>
            </Tag>
          </li>
        );
      })}
    </ol>
  );
}
export function PinInput({
  value,
  onValueChange,
  length = 6,
  label = "Verification code",
  disabled = false,
  onComplete,
  className = "",
  style,
}) {
  const id = useId();
  return (
    <div className={`re-pin ${className}`} style={style}>
      <label htmlFor={id}>{label}</label>
      <div className="re-pin-control">
        <input
          id={id}
          type="text"
          inputMode="numeric"
          autoComplete="one-time-code"
          value={value}
          disabled={disabled}
          onChange={(event) => {
            const next = event.target.value.replace(/\D/g, "").slice(0, length);
            onValueChange(next);
            if (next.length === length && next !== value) onComplete?.(next);
          }}
        />
        <div className="re-pin-cells" aria-hidden="true">
          {Array.from({ length }, (_, i) => (
            <span
              key={i}
              data-active={
                i === Math.min(value.length, length - 1) || undefined
              }
            >
              {value[i] || ""}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
export function ToggleGroup({
  items,
  value,
  onValueChange,
  label = "Options",
  multiple = false,
  disabled = false,
  className = "",
  style,
}) {
  const selected = (item) => (multiple ? value.includes(item) : value === item);
  return (
    <div
      role="group"
      aria-label={label}
      className={`re-toggle-group ${className}`}
      style={style}
    >
      {items.map((item) => (
        <button
          type="button"
          key={item.value}
          aria-label={item.label}
          aria-pressed={selected(item.value)}
          disabled={disabled || item.disabled}
          onClick={() =>
            onValueChange(
              multiple
                ? selected(item.value)
                  ? value.filter((v) => v !== item.value)
                  : [...value, item.value]
                : selected(item.value)
                  ? null
                  : item.value,
            )
          }
        >
          {item.icon && <Icon name={item.icon} />}
          <span>{item.label}</span>
        </button>
      ))}
    </div>
  );
}
export function Rating({
  value,
  onValueChange,
  max = 5,
  label = "Rating",
  readOnly = false,
  className = "",
  style,
}) {
  const id = useId();
  return (
    <fieldset className={`re-rating ${className}`} style={style}>
      <legend>{label}</legend>
      {Array.from({ length: max }, (_, i) => (
        <label key={i} title={`${i + 1} of ${max}`}>
          <input
            type="radio"
            name={id}
            value={i + 1}
            checked={value === i + 1}
            disabled={readOnly}
            onChange={() => onValueChange(i + 1)}
            aria-label={`${i + 1} of ${max}`}
          />
          <svg
            viewBox="0 0 24 24"
            data-filled={i < value || undefined}
            aria-hidden="true"
          >
            <path d="m12 3 2.8 5.7 6.2.9-4.5 4.4 1.1 6.2L12 17.3l-5.6 2.9 1.1-6.2L3 9.6l6.2-.9L12 3Z" />
          </svg>
        </label>
      ))}
    </fieldset>
  );
}
export function ScrollArea({
  children,
  height = 240,
  label = "Scrollable content",
  header,
  className = "",
  style,
}) {
  return (
    <div
      className={`re-scroll-area ${className}`}
      style={{ maxHeight: height, ...style }}
      tabIndex={0}
      role="region"
      aria-label={label}
    >
      {header && <div className="re-scroll-header">{header}</div>}
      {children}
    </div>
  );
}
export function Separator({
  label,
  orientation = "horizontal",
  className = "",
  style,
}) {
  return (
    <div
      role="separator"
      aria-orientation={orientation}
      className={`re-separator ${className}`}
      data-orientation={orientation}
      style={style}
    >
      {label && <span>{label}</span>}
    </div>
  );
}
export function CommandMenu({
  open,
  onOpenChange,
  items,
  label = "Quick actions",
  placeholder = "Find an action…",
  shortcut = false,
  className = "",
  style,
}) {
  const [query, setQuery] = useState(""),
    [active, setActive] = useState(0);
  const id = useId();
  const rows = items.filter(
    (item) =>
      !item.disabled &&
      (item.label + " " + (item.keywords || ""))
        .toLowerCase()
        .includes(query.toLowerCase()),
  );
  useEffect(() => {
    if (!shortcut) return;
    const key = (event) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        onOpenChange(!open);
      }
    };
    addEventListener("keydown", key);
    return () => removeEventListener("keydown", key);
  }, [shortcut, open, onOpenChange]);
  useEffect(() => {
    if (open) {
      setQuery("");
      setActive(0);
    }
  }, [open]);
  const choose = (item) => {
    onOpenChange(false);
    item.onSelect?.();
  };
  return (
    <Modal
      open={open}
      onClose={() => onOpenChange(false)}
      label={label}
      className={`re-command ${className}`}
      style={style}
    >
      <div className="re-command-search">
        <Icon name="search" />
        <input
          role="combobox"
          aria-label={label}
          aria-autocomplete="list"
          aria-controls={id}
          aria-expanded={open}
          aria-activedescendant={rows[active] ? `${id}-${active}` : undefined}
          placeholder={placeholder}
          value={query}
          onChange={(event) => {
            setQuery(event.target.value);
            setActive(0);
          }}
          onKeyDown={(event) => {
            if (event.key === "ArrowDown" || event.key === "ArrowUp") {
              event.preventDefault();
              setActive((index) =>
                rows.length
                  ? (index +
                      (event.key === "ArrowDown" ? 1 : -1) +
                      rows.length) %
                    rows.length
                  : 0,
              );
            }
            if (event.key === "Enter" && rows[active]) {
              event.preventDefault();
              choose(rows[active]);
            }
          }}
        />
        <kbd>esc</kbd>
      </div>
      <div
        id={id}
        role="listbox"
        aria-label={label}
        className="re-command-list"
      >
        {rows.length ? (
          rows.map((item, i) => (
            <div
              key={item.value}
              id={`${id}-${i}`}
              role="option"
              aria-selected={active === i}
              className={active === i ? "is-active" : ""}
              onMouseMove={() => setActive(i)}
              onMouseDown={(event) => event.preventDefault()}
              onClick={() => choose(item)}
            >
              {item.icon && <Icon name={item.icon} />}
              <span>{item.label}</span>
              {item.shortcut && <kbd>{item.shortcut}</kbd>}
            </div>
          ))
        ) : (
          <p role="status">No matching actions.</p>
        )}
      </div>
      <div className="re-command-footer">
        <span>↑ ↓ to navigate</span>
        <span>↵ to select</span>
      </div>
    </Modal>
  );
}
