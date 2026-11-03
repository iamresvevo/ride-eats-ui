import { shouldDismissSheet } from "./sheet-motion.js";
import React, { useRef, useState, useEffect } from "react";
import Icon from "./send/Icon.jsx";
import Modal from "./send/ui/Modal.jsx";
import Menu, { MenuItem } from "./send/ui/Menu.jsx";
import { Popover } from "./motion.jsx";
import { Button } from "./index.jsx";

export function WorkspaceSwitcher({
  items,
  value,
  onValueChange,
  label = "Workspace",
  className = "",
  style,
}) {
  const selected = items.find((item) => item.value === value);
  return (
    <Menu
      align="start"
      className={`re-workspace-menu ${className}`}
      style={style}
      trigger={(props) => (
        <button {...props} type="button" className="re-workspace-trigger">
          <span className="re-workspace-mark">
            {selected?.icon ? (
              <Icon name={selected.icon} />
            ) : (
              selected?.label?.slice(0, 1)
            )}
          </span>
          <span>{selected?.label || label}</span>
          <Icon name="select" size={12} />
        </button>
      )}
    >
      {items.map((item) => (
        <MenuItem
          key={item.value}
          icon={item.icon}
          checked={value === item.value}
          disabled={item.disabled}
          onSelect={() => onValueChange(item.value)}
        >
          <span className="re-workspace-option-copy">
            <span>{item.label}</span>
            {item.description && <small>{item.description}</small>}
          </span>
        </MenuItem>
      ))}
    </Menu>
  );
}
export function NotificationCenter({
  items,
  onRead,
  onReadAll,
  onSelect,
  label = "Notifications",
}) {
  const [open, setOpen] = useState(false);
  const unread = items.filter((item) => !item.read).length;
  return (
    <Popover
      open={open}
      onOpenChange={setOpen}
      label={label}
      width={320}
      align="end"
      className="re-notifications"
      trigger={(props) => (
        <button
          {...props}
          type="button"
          className="re-notifications-trigger"
          aria-label={`${label}, ${unread} unread`}
        >
          <Icon name="bell" />
          {unread > 0 && <span>{unread > 9 ? "9+" : unread}</span>}
        </button>
      )}
    >
      <div className="re-notifications-head">
        <strong>{label}</strong>
        {unread > 0 && onReadAll && (
          <button type="button" onClick={onReadAll}>
            Mark all read
          </button>
        )}
      </div>
      {items.length ? (
        <div className="re-notifications-list">
          {items.map((item) => (
            <button
              type="button"
              key={item.id}
              data-unread={!item.read || undefined}
              onClick={() => {
                onRead?.(item.id);
                onSelect?.(item);
                setOpen(false);
              }}
            >
              <Icon name={item.icon || "bell"} />
              <span>
                <strong>{item.title}</strong>
                {item.description && <small>{item.description}</small>}
                <time>{item.time}</time>
              </span>
              {!item.read && <i aria-label="Unread" />}
            </button>
          ))}
        </div>
      ) : (
        <p className="re-platform-empty">You're all caught up.</p>
      )}
    </Popover>
  );
}
export function AppShell({
  brand = "Workspace",
  items,
  value,
  onValueChange,
  workspace,
  search,
  actions,
  sidebarFooter,
  children,
  collapsed: controlledCollapsed,
  onCollapsedChange,
  className = "",
  style,
}) {
  const [localCollapsed, setLocalCollapsed] = useState(false),
    [mobile, setMobile] = useState(false);
  const collapsed = controlledCollapsed ?? localCollapsed;
  useEffect(() => {
    const media = matchMedia("(min-width: 761px)");
    const close = () => {
      if (media.matches) setMobile(false);
    };
    media.addEventListener("change", close);
    return () => media.removeEventListener("change", close);
  }, []);
  const navigate = (key) => {
    onValueChange(key);
    setMobile(false);
  };
  const links = () =>
    items.map((item) => (
      <button
        key={item.value}
        type="button"
        disabled={item.disabled}
        title={item.label}
        aria-current={value === item.value ? "page" : undefined}
        onClick={() => navigate(item.value)}
      >
        {item.icon && <Icon name={item.icon} />}
        <span>{item.label}</span>
        {item.count != null && <small>{item.count}</small>}
      </button>
    ));
  return (
    <div
      className={`re-app-shell ${className}`}
      style={style}
      data-collapsed={collapsed || undefined}
    >
      <aside className="re-app-sidebar">
        <div className="re-app-brand">
          {typeof brand === "string" ? (
            <>
              <span className="re-workspace-mark">
                <Icon name="layers" />
              </span>
              <strong>{brand}</strong>
            </>
          ) : (
            brand
          )}
        </div>
        {workspace && <div className="re-app-workspace">{workspace}</div>}
        <nav aria-label="App navigation">{links()}</nav>
        <div className="re-app-sidebar-footer">
          {sidebarFooter}
          <button
            type="button"
            aria-label={collapsed ? "Expand navigation" : "Collapse navigation"}
            onClick={() => {
              setLocalCollapsed(!collapsed);
              onCollapsedChange?.(!collapsed);
            }}
          >
            <Icon name={collapsed ? "panel-left-open" : "panel-left-close"} />
            <span>Collapse</span>
          </button>
        </div>
      </aside>
      <div className="re-app-content">
        <header className="re-app-toolbar">
          <Button
            className="re-app-mobile-trigger"
            size="sm"
            variant="ghost"
            icon="menu"
            aria-label="Open navigation"
            onClick={() => setMobile(true)}
          />
          <div className="re-app-search">{search}</div>
          <div className="re-app-actions">{actions}</div>
        </header>
        <main>{children}</main>
      </div>
      <Modal
        open={mobile}
        onClose={() => setMobile(false)}
        label="Mobile navigation"
        title={typeof brand === "string" ? brand : "Navigation"}
        className="re-app-mobile-nav"
      >
        {workspace && (
          <div className="re-app-mobile-workspace">{workspace}</div>
        )}
        <nav aria-label="Mobile app navigation">{links()}</nav>
      </Modal>
    </div>
  );
}
export function BottomSheet({
  open,
  onClose,
  title,
  children,
  footer,
  height = 360,
  className = "",
  style,
}) {
  const [offset, setOffset] = useState(0);
  const [dragging, setDragging] = useState(false);
  const drag = useRef(null),
    moved = useRef(false);
  const reset = () => {
    drag.current = null;
    setDragging(false);
    setOffset(0);
  };
  useEffect(() => {
    if (open) reset();
  }, [open]);
  const dragProps = {
    onPointerDown(event) {
      if (
        event.button !== 0 ||
        !event.isPrimary ||
        event.target.closest(
          "input,textarea,select,a,[contenteditable=true],.dialog-head button",
        )
      )
        return;
      const sheet = event.currentTarget.closest("dialog");
      if (sheet?.dataset.closing === "true") return;
      event.currentTarget.setPointerCapture(event.pointerId);
      drag.current = {
        pointer: event.pointerId,
        start: event.clientY,
        last: event.clientY,
        time: event.timeStamp,
        velocity: 0,
        distance: 0,
        height: sheet?.offsetHeight || 360,
      };
      moved.current = false;
      setDragging(true);
    },
    onPointerMove(event) {
      const current = drag.current;
      if (!current || current.pointer !== event.pointerId) return;
      const elapsed = event.timeStamp - current.time;
      if (elapsed > 0)
        current.velocity = (event.clientY - current.last) / elapsed;
      current.last = event.clientY;
      current.time = event.timeStamp;
      current.distance = Math.max(0, event.clientY - current.start);
      if (Math.abs(event.clientY - current.start) > 4) moved.current = true;
      setOffset(current.distance);
    },
    onPointerUp(event) {
      const current = drag.current;
      if (!current || current.pointer !== event.pointerId) return;
      const distance = Math.max(0, event.clientY - current.start);
      const velocity =
        event.timeStamp - current.time > 100 ? 0 : current.velocity;
      drag.current = null;
      setDragging(false);
      if (event.currentTarget.hasPointerCapture(event.pointerId))
        event.currentTarget.releasePointerCapture(event.pointerId);
      if (shouldDismissSheet(distance, velocity, current.height)) {
        setOffset(distance);
        onClose();
      } else setOffset(0);
    },
    onPointerCancel() {
      if (drag.current) reset();
    },
    onLostPointerCapture() {
      if (drag.current) reset();
    },
  };
  return (
    <Modal
      open={open}
      onClose={onClose}
      title={title}
      onAfterClose={reset}
      headerProps={dragProps}
      className={`re-bottom-sheet ${dragging ? "is-dragging" : ""} ${className}`}
      style={{
        "--sheet-offset": `${offset}px`,
        "--sheet-height": typeof height === "number" ? `${height}px` : height,
        ...style,
      }}
      footer={footer}
    >
      <button
        type="button"
        className="re-sheet-handle"
        aria-label="Close sheet"
        data-dragging={dragging || undefined}
        onClick={(event) => {
          if (event.detail === 0 || !moved.current) onClose();
        }}
        {...dragProps}
      >
        <span />
      </button>
      <div className="re-sheet-body">{children}</div>
    </Modal>
  );
}
export function ContextMenu({
  items,
  children,
  label = "Context actions",
  className = "",
  style,
}) {
  const panel = useRef(null),
    host = useRef(null),
    [position, setPosition] = useState(null),
    [submenu, setSubmenu] = useState(null);
  useEffect(() => {
    if (!position || !panel.current) return;
    const node = panel.current;
    if (!node.matches(":popover-open")) node.showPopover();
    node.style.left =
      Math.max(8, Math.min(position.x, innerWidth - node.offsetWidth - 8)) +
      "px";
    node.style.top =
      Math.max(8, Math.min(position.y, innerHeight - node.offsetHeight - 8)) +
      "px";
    if (submenu)
      node
        .querySelector(".re-context-sub.is-open button:not(:disabled)")
        ?.focus();
    else if (!node.contains(document.activeElement))
      node.querySelector("button:not(:disabled)")?.focus();
  }, [position, submenu]);
  const close = () => {
    panel.current?.hidePopover();
    setPosition(null);
    setSubmenu(null);
    host.current?.focus();
  };
  const render = (options) =>
    options.map((item) =>
      item.separator ? (
        <hr key={item.value} />
      ) : (
        <React.Fragment key={item.value}>
          <button
            type="button"
            role="menuitem"
            disabled={item.disabled}
            aria-haspopup={item.items ? "menu" : undefined}
            aria-expanded={item.items ? submenu === item.value : undefined}
            className={item.destructive ? "is-destructive" : ""}
            onClick={() => {
              if (item.items)
                setSubmenu(submenu === item.value ? null : item.value);
              else {
                close();
                item.onSelect?.();
              }
            }}
          >
            {item.icon && <Icon name={item.icon} />}
            <span>{item.label}</span>
            {item.items && <Icon name="chevron" />}
          </button>
          {item.items && (
            <div
              className={`re-context-sub ${submenu === item.value ? "is-open" : ""}`}
              inert={submenu !== item.value}
              aria-hidden={submenu !== item.value}
            >
              <div role="menu" aria-label={item.label}>
                {render(item.items)}
              </div>
            </div>
          )}
        </React.Fragment>
      ),
    );
  return (
    <>
      <div
        ref={host}
        className={`re-context-target ${className}`}
        style={style}
        tabIndex={0}
        aria-label={label}
        aria-haspopup="menu"
        onContextMenu={(event) => {
          event.preventDefault();
          setPosition({ x: event.clientX, y: event.clientY });
        }}
        onKeyDown={(event) => {
          if (
            event.key === "ContextMenu" ||
            (event.shiftKey && event.key === "F10")
          ) {
            event.preventDefault();
            const box = event.currentTarget.getBoundingClientRect();
            setPosition({ x: box.left + 16, y: box.top + 16 });
          }
        }}
      >
        {children}
      </div>
      <div
        ref={panel}
        popover="auto"
        role="menu"
        aria-label={label}
        className="re-context-menu"
        onToggle={(event) => {
          if (event.newState === "closed") {
            setPosition(null);
            setSubmenu(null);
          }
        }}
        onKeyDown={(event) => {
          if (
            (event.key === "Escape" || event.key === "ArrowLeft") &&
            submenu
          ) {
            event.preventDefault();
            const parent = panel.current.querySelector(
              '[aria-expanded="true"]',
            );
            setSubmenu(null);
            requestAnimationFrame(() => parent?.focus());
          } else if (event.key === "Escape") {
            event.preventDefault();
            close();
          } else if (
            event.key === "ArrowRight" &&
            event.target.getAttribute("aria-haspopup") === "menu"
          ) {
            event.preventDefault();
            event.target.click();
          } else if (
            ["ArrowDown", "ArrowUp", "Home", "End"].includes(event.key)
          ) {
            event.preventDefault();
            const buttons = [
                ...panel.current.querySelectorAll("button:not(:disabled)"),
              ].filter((button) => !button.closest("[inert]")),
              current = buttons.indexOf(document.activeElement),
              next =
                event.key === "Home"
                  ? 0
                  : event.key === "End"
                    ? buttons.length - 1
                    : (current +
                        (event.key === "ArrowDown" ? 1 : -1) +
                        buttons.length) %
                      buttons.length;
            buttons[next]?.focus();
          }
        }}
      >
        {render(items)}
      </div>
    </>
  );
}
