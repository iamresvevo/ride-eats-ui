import { iconNames } from "./icons/names.js";
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
export const animatedIconNames = [
  ...new Set([
    "bell",
    "heart",
    "check",
    "upload",
    "download",
    "search",
    "refresh",
    "settings",
    "folder",
    "send",
    ...iconNames,
  ]),
];
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
  return (
    <Icon
      {...props}
      name={name}
      size={size}
      strokeWidth={strokeWidth}
      playing={playing}
      loop={loop}
      label={label}
      className={`re-animated-icon ${className}`}
      style={style}
      motion="auto"
    />
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
      if (node.contains(document.activeElement)) button.current?.focus();
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
          if (
            event.target === event.currentTarget &&
            event.newState === "closed" &&
            open
          )
            onOpenChange(false);
        }}
        onKeyDown={(event) => {
          if (event.key === "Escape") {
            event.preventDefault();
            event.stopPropagation();
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
  const id = useId(),
    root = useRef(null),
    drag = useRef(null);
  const [preview, setPreview] = useState(null);
  const at = (x) => {
    const labels = [...root.current.querySelectorAll("label")];
    const index = labels.findIndex(
      (label) => x < label.getBoundingClientRect().right,
    );
    return index < 0 ? max : index + 1;
  };
  return (
    <fieldset
      ref={root}
      className={`re-rating ${className}`}
      style={style}
      onPointerDown={(event) => {
        if (readOnly || event.button !== 0 || !event.target.closest("label"))
          return;
        event.preventDefault();
        drag.current = { initial: value, last: value };
        root.current.setPointerCapture(event.pointerId);
        const next = at(event.clientX);
        drag.current.last = next;
        setPreview(next);
        onValueChange(next);
        root.current.querySelectorAll("input")[next - 1]?.focus();
      }}
      onPointerMove={(event) => {
        if (readOnly || (!event.target.closest("label") && !drag.current))
          return;
        const next = at(event.clientX);
        setPreview(next);
        if (drag.current && drag.current.last !== next) {
          drag.current.last = next;
          onValueChange(next);
        }
      }}
      onPointerUp={() => {
        if (drag.current)
          root.current
            .querySelectorAll("input")
            [drag.current.last - 1]?.focus();
        drag.current = null;
        setPreview(null);
      }}
      onPointerCancel={() => {
        if (drag.current) onValueChange(drag.current.initial);
        drag.current = null;
        setPreview(null);
      }}
      onPointerLeave={() => {
        if (!drag.current) setPreview(null);
      }}
    >
      <legend>{label}</legend>
      {Array.from({ length: max }, (_, i) => (
        <label key={i} title={`${i + 1} of ${max}`}>
          <input
            type="radio"
            name={id}
            value={i + 1}
            checked={value === i + 1}
            disabled={readOnly}
            onChange={() => {
              setPreview(null);
              onValueChange(i + 1);
            }}
            aria-label={`${i + 1} of ${max}`}
          />
          <svg
            viewBox="0 0 24 24"
            data-filled={i < (preview ?? value) || undefined}
            aria-hidden="true"
          >
            <path d="m12 3 2.8 5.7 6.2.9-4.5 4.4 1.1 6.2L12 17.3l-5.6 2.9 1.1-6.2L3 9.6l6.2-.9L12 3Z" />
          </svg>
        </label>
      ))}
    </fieldset>
  );
}
export { CommandMenu } from "./CommandMenu.jsx";
