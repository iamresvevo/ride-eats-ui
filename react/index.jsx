import { accentText } from "./accent.js";
import { IconProvider } from "./icons/registry.jsx";
import { CardHeader, CardFooter } from "./collection.jsx";
import { ToastProvider } from "./Feedback.jsx";
export {
  ToastProvider,
  useToast,
  useConfirm,
  useFeedback,
} from "./Feedback.jsx";
import SendIcon from "./send/Icon.jsx";
import { placeSelection } from "./send/hooks/selection.js";
export { default as Segmented } from "./send/Segmented.jsx";
import Tooltips from "./send/ui/Tooltips.jsx";
export { default as Tooltips } from "./send/ui/Tooltips.jsx";
export { default as PageLoading } from "./send/ui/PageLoading.jsx";
import SendButton from "./send/ActionButton.jsx";
import SendMenu, {
  MenuItem,
  MenuSub,
  MenuLabel,
  MenuSeparator,
} from "./send/ui/Menu.jsx";
import SendModal from "./send/ui/Modal.jsx";
import SendPagination from "./send/ui/Pagination.jsx";
import SendEmpty from "./send/ui/EmptyState.jsx";
export { default as Header } from "./send/Header.jsx";
export { default as AccountMenu } from "./send/AccountMenu.jsx";
export { default as Avatar } from "./send/AccountAvatar.jsx";
export { default as VerificationBadge } from "./send/VerificationBadge.jsx";
export { default as VerifiedName } from "./send/VerifiedName.jsx";
export { default as Icon } from "./send/Icon.jsx";
export { default as Switch } from "./send/ui/Switch.jsx";
export { default as SettingRow } from "./send/ui/SettingRow.jsx";
export { default as Skeleton, Bone, BoneText } from "./send/ui/Skeleton.jsx";
export { default as DateTimePicker } from "./send/ui/DateTimePicker.jsx";
export {
  default as Menu,
  MenuItem,
  MenuSub,
  MenuLabel,
  MenuSeparator,
} from "./send/ui/Menu.jsx";
import React, {
  useEffect,
  useLayoutEffect,
  useId,
  useRef,
  useState,
} from "react";
import { createPortal } from "react-dom";

export function ThemeProvider({
  children,
  defaultTheme = "system",
  storageKey = "rideEatsUI.theme",
}) {
  const [theme, setTheme] = useState(() => {
    try {
      return localStorage.getItem(storageKey) || defaultTheme;
    } catch {
      return defaultTheme;
    }
  });
  useEffect(() => {
    const media = matchMedia("(prefers-color-scheme: dark)");
    const apply = () =>
      (document.documentElement.dataset.theme =
        theme === "system" ? (media.matches ? "dark" : "light") : theme);
    apply();
    media.addEventListener("change", apply);
    try {
      localStorage.setItem(storageKey, theme);
    } catch {}
    return () => media.removeEventListener("change", apply);
  }, [theme, storageKey]);
  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}
const ThemeContext = React.createContext({
  theme: "system",
  setTheme: () => {},
});
export const useTheme = () => React.useContext(ThemeContext);

export function Badge({
  tone = "neutral",
  children,
  className = "",
  ...props
}) {
  return (
    <span {...props} className={`badge ${tone} ${className}`}>
      {children}
    </span>
  );
}
export function Card({
  title,
  description,
  action,
  footer,
  variant = "default",
  padding = "default",
  children,
  className = "",
  ...props
}) {
  return (
    <section
      {...props}
      className={`card re-card re-card-${variant} re-card-padding-${padding} ${className}`}
    >
      {(title || description || action) && (
        <CardHeader title={title} description={description} action={action} />
      )}
      {children}
      {footer && <CardFooter>{footer}</CardFooter>}
    </section>
  );
}
export function Field({
  label,
  hint,
  error,
  id,
  labelHidden = false,
  layout,
  children,
  className = "",
  style,
}) {
  const generated = useId();
  const fieldId = id || children?.props?.id || generated;
  return (
    <div className={`field ${className}`} data-layout={layout} style={style}>
      <label
        htmlFor={fieldId}
        className={labelHidden ? "re-sr-only" : undefined}
      >
        {label}
      </label>
      {React.isValidElement(children)
        ? React.cloneElement(children, {
            id: fieldId,
            "aria-describedby": hint || error ? `${fieldId}-hint` : undefined,
            "aria-invalid": error ? true : undefined,
          })
        : children}
      {(error || hint) && (
        <small
          id={`${fieldId}-hint`}
          style={{ color: error ? "var(--bad)" : "var(--muted)" }}
        >
          {error || hint}
        </small>
      )}
    </div>
  );
}
export function Tabs({
  items,
  value,
  onValueChange,
  label = "Tabs",
  width = "fit",
  variant = "pill",
  ...props
}) {
  const buttons = useRef([]);
  const root = useRef(null);
  const previous = useRef(value);
  useLayoutEffect(() => {
    placeSelection(
      root.current,
      previous.current !== value,
      '[aria-selected="true"]',
    );
    previous.current = value;
  });
  const itemKeys = items.map((item) => item.value).join("\0");
  useLayoutEffect(() => {
    const element = root.current;
    const observer = new ResizeObserver(() =>
      placeSelection(element, false, '[aria-selected="true"]'),
    );
    observer.observe(element);
    element
      .querySelectorAll("button")
      .forEach((button) => observer.observe(button));
    return () => {
      observer.disconnect();
      element
        .querySelector("[data-selection-pill] > span")
        ?.getAnimations()
        .forEach((animation) => animation.cancel());
    };
  }, [itemKeys]);

  return (
    <div
      {...props}
      ref={root}
      role="tablist"
      aria-label={label}
      className={`tabs tabs-${variant} ${width === "full" ? "tabs-full" : "tabs-fit"} ${props.className || ""}`}
    >
      <span
        className="tabs-selection"
        data-selection-pill=""
        aria-hidden="true"
      >
        <span />
      </span>
      {items.map((item, i) => (
        <button
          type="button"
          key={item.value}
          ref={(node) => {
            buttons.current[i] = node;
          }}
          role="tab"
          id={item.id}
          aria-controls={item.panelId}
          aria-selected={value === item.value}
          tabIndex={value === item.value ? 0 : -1}
          className={`tab ${value === item.value ? "active" : ""}`}
          onClick={() => onValueChange(item.value)}
          onKeyDown={(e) => {
            let next;
            if (e.key === "ArrowRight") next = (i + 1) % items.length;
            if (e.key === "ArrowLeft")
              next = (i - 1 + items.length) % items.length;
            if (e.key === "Home") next = 0;
            if (e.key === "End") next = items.length - 1;
            if (next !== undefined) {
              e.preventDefault();
              onValueChange(items[next].value);
              buttons.current[next]?.focus();
            }
          }}
        >
          {item.label}
          {item.count != null && (
            <span className="tab-count">{item.count}</span>
          )}
        </button>
      ))}
    </div>
  );
}
export function SearchSelect({
  label = "Search",
  load,
  value = [],
  onValueChange,
  max = 50,
  placeholder = "Search or select",
  className = "",
  style,
  disabled = false,
  renderOption,
  renderSelected,
}) {
  const [query, setQuery] = useState(""),
    [rows, setRows] = useState([]),
    [open, setOpen] = useState(false),
    [status, setStatus] = useState(""),
    [active, setActive] = useState(-1);
  const root = useRef(null);
  const id = useId();
  useEffect(() => {
    if (!open) return;
    let cancelled = false;
    setStatus("Loading…");
    const timer = setTimeout(() => {
      Promise.resolve()
        .then(() => load(query))
        .then(
          (items) => {
            if (!cancelled) {
              setRows(
                items.filter(
                  (item) => !value.some((v) => v.value === item.value),
                ),
              );
              setStatus("");
              setActive(-1);
            }
          },
          (error) => {
            if (!cancelled) {
              setRows([]);
              setStatus(error.message || "Could not load choices");
            }
          },
        );
    }, 200);
    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [query, open, load, value]);
  useEffect(() => {
    const outside = (e) => {
      if (!root.current?.contains(e.target)) setOpen(false);
    };
    document.addEventListener("pointerdown", outside);
    return () => document.removeEventListener("pointerdown", outside);
  }, []);
  const choose = (item) => {
    if (!disabled && value.length < max) {
      onValueChange([...value, item]);
      setQuery("");
      setOpen(false);
    }
  };
  return (
    <div className={`search-select ${className}`} style={style} ref={root}>
      <div className="search-select-chips">
        {value.map((item) => (
          <span className="search-select-chip" key={item.value}>
            {renderSelected ? renderSelected(item) : item.label}
            <button
              type="button"
              disabled={disabled}
              aria-label={`Remove ${item.label}`}
              onClick={() =>
                onValueChange(value.filter((v) => v.value !== item.value))
              }
            >
              ×
            </button>
          </span>
        ))}
      </div>
      <input
        role="combobox"
        aria-label={label}
        aria-expanded={open}
        aria-controls={id}
        aria-autocomplete="list"
        aria-activedescendant={active >= 0 ? `${id}-${active}` : undefined}
        placeholder={placeholder}
        value={query}
        disabled={disabled || value.length >= max}
        onFocus={() => setOpen(true)}
        onChange={(e) => {
          setQuery(e.target.value);
          setOpen(true);
        }}
        onKeyDown={(e) => {
          if (e.key === "Escape" || e.key === "Tab") setOpen(false);
          if (e.key === "ArrowDown" || e.key === "ArrowUp") {
            e.preventDefault();
            setOpen(true);
            setActive(
              rows.length
                ? (active + (e.key === "ArrowDown" ? 1 : -1) + rows.length) %
                    rows.length
                : -1,
            );
          }
          if (e.key === "Enter" && open) {
            e.preventDefault();
            if (rows[active]) choose(rows[active]);
          }
        }}
      />
      {open && (
        <div className="search-select-panel">
          <div role="status" className="search-select-status">
            {status || (!rows.length ? "No matches found." : "")}
          </div>
          <div id={id} role="listbox" aria-label={label}>
            {!status &&
              rows.map((item, i) => (
                <div
                  id={`${id}-${i}`}
                  role="option"
                  aria-selected={false}
                  key={item.value}
                  className={`search-select-option ${active === i ? "focused" : ""}`}
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => choose(item)}
                >
                  {renderOption ? (
                    renderOption(item)
                  ) : (
                    <span className="search-select-label">
                      <strong>{item.label}</strong>
                      <small className="muted">{item.detail}</small>
                    </span>
                  )}
                </div>
              ))}
          </div>
        </div>
      )}
    </div>
  );
}

export function Button({
  variant = "secondary",
  size,
  loadingLabel = "Working…",
  ...props
}) {
  const variants = {
    primary: "btn-primary",
    brand: "btn-brand",
    secondary: "btn-outline",
    ghost: "btn-ghost",
    danger: "btn-danger",
    surface: "btn-surface",
  };
  return (
    <SendButton
      {...props}
      loadingLabel={loadingLabel}
      className={`${variants[variant] || ""} ${size ? "btn-" + size : ""} ${props.className || ""}`}
    />
  );
}
function MenuRows({ items }) {
  return items.map((item, i) =>
    item.type === "separator" ? (
      <MenuSeparator key={i} />
    ) : item.type === "label" ? (
      <MenuLabel key={i}>{item.label}</MenuLabel>
    ) : item.items ? (
      <MenuSub
        key={item.id || i}
        id={item.id || String(i)}
        label={item.label}
        icon={item.icon}
        value={item.value}
      >
        <MenuRows items={item.items} />
      </MenuSub>
    ) : (
      <MenuItem
        key={item.id || i}
        icon={item.icon}
        danger={item.danger}
        disabled={item.disabled}
        checked={item.checked}
        closesMenu={item.closesMenu}
        onSelect={item.onSelect || (() => {})}
      >
        {item.label}
      </MenuItem>
    ),
  );
}
export function Dropdown({
  trigger = "Actions",
  variant = "secondary",
  size,
  items,
  align = "end",
  label = "Actions",
  className = "",
  style,
}) {
  return (
    <SendMenu
      align={align}
      className={className}
      style={style}
      trigger={(props) => (
        <Button {...props} variant={variant} size={size} aria-label={label}>
          {trigger}
        </Button>
      )}
    >
      <MenuRows items={items} />
    </SendMenu>
  );
}
export function Select({
  options,
  value,
  onValueChange,
  label = "Select",
  disabled = false,
  className = "",
  style,
  renderValue,
  ...buttonProps
}) {
  return (
    <SendMenu
      className={`react-select ${className}`}
      style={style}
      align="start"
      trigger={(props) => (
        <Button
          {...buttonProps}
          {...props}
          onClick={(event) => {
            buttonProps.onClick?.(event);
            if (!event.defaultPrevented) props.onClick(event);
          }}
          disabled={disabled}
          aria-label={label}
          className="menu-select"
        >
          <span className="select-label">
            {renderValue
              ? renderValue(options.find((item) => item.value === value))
              : options.find((item) => item.value === value)?.label || label}
          </span>
          <SendIcon name="select" />
        </Button>
      )}
    >
      <MenuRows
        items={options.map((item) => ({
          ...item,
          checked: item.value === value,
          onSelect: () => onValueChange(item.value),
        }))}
      />
    </SendMenu>
  );
}
export function Dialog({
  open,
  onOpenChange,
  title,
  children,
  footer,
  toolbar,
  scroll = "body",
  size = "md",
  dismissible = true,
  beforeClose,
  label,
  labelledBy,
  onAfterClose,
  closeOnBackdrop = true,
  className,
  style,
}) {
  const closing = useRef(false);
  const requestClose = async () => {
    if (closing.current || !dismissible) return;
    closing.current = true;
    try {
      if (!beforeClose || (await beforeClose()) !== false) onOpenChange(false);
    } finally {
      closing.current = false;
    }
  };
  return (
    <SendModal
      open={open}
      label={label}
      labelledBy={labelledBy}
      onAfterClose={onAfterClose}
      closeOnBackdrop={closeOnBackdrop}
      title={title}
      className={className}
      style={style}
      size={size === "md" ? undefined : size}
      dismissable={dismissible}
      onClose={requestClose}
      footer={footer}
      toolbar={toolbar}
      scroll={scroll}
    >
      {children}
    </SendModal>
  );
}
export function Pagination({ page, pageSize, total, onPageChange, disabled }) {
  return (
    <SendPagination
      page={page}
      pages={Math.max(1, Math.ceil(total / pageSize))}
      total={total}
      onPage={onPageChange}
      disabled={disabled}
    />
  );
}
export function EmptyState({
  title,
  description,
  icon = "files",
  action,
  illustration,
  className,
  style,
}) {
  return (
    <SendEmpty
      icon={icon}
      title={title}
      text={description}
      illustration={illustration}
      className={className}
      style={style}
    >
      {action}
    </SendEmpty>
  );
}

export function UIProvider({
  children,
  defaultTheme = "system",
  storageKey = "rideEatsUI.theme",
  toastOptions,
  icons,
  accent,
  accentForeground,
}) {
  useLayoutEffect(() => {
    if (!accent && !accentForeground) return;
    const root = document.documentElement.style;
    const tokens = {
      ...(accent ? { "--brand": accent } : {}),
      "--on-brand": accentForeground || accentText(accent) || "#ffffff",
    };
    const previous = Object.fromEntries(
      Object.keys(tokens).map((key) => [
        key,
        [root.getPropertyValue(key), root.getPropertyPriority(key)],
      ]),
    );
    for (const [key, value] of Object.entries(tokens))
      if (value) root.setProperty(key, value);
    return () => {
      for (const [key, value] of Object.entries(tokens)) {
        if (value && root.getPropertyValue(key) === value) {
          const [old, priority] = previous[key];
          if (old) root.setProperty(key, old, priority);
          else root.removeProperty(key);
        }
      }
    };
  }, [accent, accentForeground]);
  return (
    <IconProvider icons={icons}>
      <ThemeProvider defaultTheme={defaultTheme} storageKey={storageKey}>
        <ToastProvider {...toastOptions}>
          {children}
          <Tooltips />
        </ToastProvider>
      </ThemeProvider>
    </IconProvider>
  );
}

export * from "./collection.jsx";

export { IconProvider } from "./icons/registry.jsx";
export { iconNames } from "./icons/names.js";

export * from "./motion.jsx";

export * from "./gestures.jsx";
export * from "./forms.jsx";
export { DataGrid } from "./DataGrid.jsx";
export * from "./platform.jsx";
export * from "./workflows.jsx";
export { StickyBar } from "./StickyBar.jsx";

export * from "./specialized.jsx";

export { ShortcutRecorder, TextDiffViewer } from "./review.jsx";

export { ColorPicker, InputGroup, ButtonGroup } from "./controls.jsx";
