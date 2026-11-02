import React from "react";
import { createContext, use, useEffect, useRef, useState } from "react";
import Icon from "../Icon.jsx";
import usePresence from "../hooks/usePresence.js";
import { t } from "../i18n.js";

const MenuContext = createContext({ close() {}, sub: null, setSub() {} });

// Rows that can take focus: shown, enabled, and not inside a collapsed group.
const visibleItems = (root) =>
  [...root.querySelectorAll('[role^="menuitem"]:not(:disabled)')].filter(
    (item) => item.offsetParent && !item.closest("[inert]"),
  );

/**
 * The app's one dropdown. `trigger` is a render function that receives the props
 * to spread on the button that opens it. Children are MenuItem / MenuSub / MenuLabel / MenuSeparator.
 *
 * A MenuSub is a row showing its current value. Choosing it expands its options in place,
 * directly under the row; choosing it again collapses them.
 *
 * Closes on selection, outside click and Escape; arrow keys move between items.
 * It opens upwards when there is no room below. Opening and closing are animated.
 */
export default function Menu({
  trigger,
  align = "end",
  className = "",
  style,
  children,
}) {
  const [open, setOpen] = useState(false);
  const [up, setUp] = useState(false);
  // The id of the expanded group, or null.
  const [sub, setSub] = useState(null);
  const root = useRef(null);
  const button = useRef(null);
  const panel = useRef(null);
  const presence = usePresence(open);

  const items = () => visibleItems(panel.current);

  useEffect(() => {
    if (!open) return;
    // No room below the trigger: flip above it.
    setUp(
      button.current.getBoundingClientRect().bottom +
        panel.current.offsetHeight +
        16 >
        innerHeight,
    );

    const onPointer = (event) => {
      if (!root.current.contains(event.target)) setOpen(false);
    };
    const onKey = (event) => {
      const inPicker = panel.current.hasAttribute("data-sub");
      if (event.key === "Escape" || (event.key === "ArrowLeft" && inPicker)) {
        event.preventDefault();
        // Collapse an expanded group first; close the menu after that.
        if (inPicker) return setSub(null);
        setOpen(false);
        button.current?.focus();
      } else if (event.key === "ArrowDown" || event.key === "ArrowUp") {
        event.preventDefault();
        const list = items();
        const next =
          list.indexOf(document.activeElement) +
          (event.key === "ArrowDown" ? 1 : -1);
        list[(next + list.length) % list.length]?.focus();
      }
    };
    document.addEventListener("pointerdown", onPointer);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", onPointer);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  // Opening the menu puts focus on its first row.
  useEffect(() => {
    if (open) items()[0]?.focus();
  }, [open]);

  const toggle = () => {
    setSub(null);
    setOpen(!open);
  };
  const close = () => {
    setSub(null);
    setOpen(false);
    button.current?.focus();
  };
  return (
    <div ref={root} className={`menu ${className}`.trim()} style={style}>
      {trigger({
        ref: button,
        "aria-haspopup": "menu",
        "aria-expanded": open,
        onClick: toggle,
      })}
      {presence.mounted && (
        <div
          ref={panel}
          className={`menu-panel menu-${align} ${up ? "menu-up" : ""} ${presence.closing ? "is-closing" : ""}`.trim()}
          role="menu"
          inert={presence.closing}
          aria-hidden={presence.closing || undefined}
          data-sub={sub || undefined}
          onAnimationEnd={presence.onAnimationEnd}
        >
          <MenuContext value={{ close, closeMenu: close, sub, setSub }}>
            {children}
          </MenuContext>
        </div>
      )}
    </div>
  );
}

/** One action. `checked` marks the current choice in a group; `danger` is for destructive actions. */
/** `closesMenu`: inside a group, closes the whole menu rather than just the group (for an item that opens a dialog). */
export function MenuItem({
  icon,
  danger = false,
  checked,
  disabled,
  closesMenu = false,
  onSelect,
  children,
}) {
  const { close, closeMenu } = use(MenuContext);
  return (
    <button
      type="button"
      role={typeof checked === "boolean" ? "menuitemradio" : "menuitem"}
      aria-checked={typeof checked === "boolean" ? checked : undefined}
      className={danger ? "menu-item menu-item-danger" : "menu-item"}
      disabled={disabled}
      onClick={() => {
        if (closesMenu) closeMenu();
        else close();
        onSelect?.();
      }}
    >
      {icon && <Icon name={icon} />}
      <span>{t(children)}</span>
      {checked && <Icon name="check" />}
    </button>
  );
}

export const MenuLabel = ({ children }) => (
  <div className="menu-label">{t(children)}</div>
);
export const MenuSeparator = () => (
  <div className="menu-separator" role="separator" />
);

/**
 * A row with a value whose options expand right under it. The row is highlighted while open,
 * and pressing it again closes it. Picking an option collapses the group and leaves the menu
 * open, so the new value is visible on the row.
 */
export function MenuSub({ id, icon, label, value, children }) {
  const menu = use(MenuContext);
  const open = menu.sub === id;
  return (
    <div className="menu-sub">
      <button
        type="button"
        role="menuitem"
        aria-expanded={open}
        className="menu-item"
        onClick={() => menu.setSub(open ? null : id)}
      >
        {icon && <Icon name={icon} />}
        <span>{t(label)}</span>
        {value && <small className="menu-value">{t(value)}</small>}
        <Icon name="select" />
      </button>
      {/* Always rendered so it can animate both ways; `inert` keeps it out of reach while collapsed. */}
      <div
        className={open ? "menu-options is-open" : "menu-options"}
        role="group"
        aria-label={t(label)}
        inert={!open}
      >
        <div>
          <MenuContext value={{ ...menu, close: () => menu.setSub(null) }}>
            {children}
          </MenuContext>
        </div>
      </div>
    </div>
  );
}
