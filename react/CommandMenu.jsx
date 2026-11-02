import React, { useEffect, useId, useMemo, useRef, useState } from "react";
import Modal from "./send/ui/Modal.jsx";
import Icon from "./send/Icon.jsx";
import {
  flattenCommands,
  searchCommands,
  matchesCommandShortcut,
} from "./command-model.js";

export function CommandMenu({
  open,
  onOpenChange,
  items,
  label = "Command search",
  placeholder = "Search commands or pages…",
  shortcut = false,
  className = "",
  style,
}) {
  const [query, setQuery] = useState(""),
    [active, setActive] = useState(0),
    [path, setPath] = useState([]),
    [recent, setRecent] = useState([]),
    [pending, setPending] = useState(null),
    [error, setError] = useState("");
  const id = useId(),
    list = useRef(null),
    executing = useRef(false);
  let scoped = items;
  const breadcrumbs = [];
  for (const key of path) {
    const item = scoped.find((item) => item.value === key);
    if (!item?.items) break;
    breadcrumbs.push(item);
    scoped = item.items;
  }
  const rows = useMemo(() => {
    let found = searchCommands(scoped, query);
    if (!query && !path.length && recent.length) {
      const all = flattenCommands(items);
      const prior = recent
        .map((value) => all.find((item) => item.value === value))
        .filter(Boolean)
        .map((item) => ({ ...item, group: "Recent" }));
      const keys = new Set(prior.map((item) => item.value));
      found = [...prior, ...found.filter((item) => !keys.has(item.value))];
    }
    const orderedGroups = [
      ...new Set(found.map((item) => item.group || "Commands")),
    ];
    return orderedGroups.flatMap((group) =>
      found.filter((item) => (item.group || "Commands") === group),
    );
  }, [scoped, items, query, path.length, recent]);
  const groups = [...new Set(rows.map((item) => item.group || "Commands"))];
  useEffect(() => {
    if (open) {
      setQuery("");
      setPath([]);
      setActive(0);
      setError("");
    }
  }, [open]);
  useEffect(() => {
    if (!shortcut) return;
    const key = (event) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        if (!executing.current) onOpenChange(!open);
      }
    };
    addEventListener("keydown", key);
    return () => removeEventListener("keydown", key);
  }, [shortcut, open, onOpenChange]);
  useEffect(() => {
    list.current
      ?.querySelector(`[data-command-index="${active}"]`)
      ?.scrollIntoView({ block: "nearest" });
  }, [active]);
  const choose = async (item) => {
    if (executing.current) return;
    setError("");
    if (item.items) {
      setPath((old) => [...old, ...(item.path || []), item.value]);
      setQuery("");
      setActive(0);
      return;
    }
    executing.current = true;
    setPending(item.value);
    try {
      await item.onSelect?.();
      setRecent((old) =>
        [item.value, ...old.filter((value) => value !== item.value)].slice(
          0,
          4,
        ),
      );
      onOpenChange(false);
    } catch (reason) {
      setError(reason?.message || "The command could not complete. Try again.");
    } finally {
      executing.current = false;
      setPending(null);
    }
  };
  const back = () => {
    setPath((old) => old.slice(0, -1));
    setQuery("");
    setActive(0);
    setError("");
  };
  return (
    <Modal
      open={open}
      onClose={() => onOpenChange(false)}
      dismissable={!pending}
      label={label}
      className={`re-command ${className}`}
      style={style}
    >
      <div className="re-command-context">
        <span>{label}</span>
        {breadcrumbs.length > 0 && (
          <>
            <button
              type="button"
              onClick={() => {
                setPath([]);
                setQuery("");
                setActive(0);
              }}
            >
              All commands
            </button>
            {breadcrumbs.map((item) => (
              <React.Fragment key={item.value}>
                <Icon name="chevron-right" size={11} />
                <strong>{item.label}</strong>
              </React.Fragment>
            ))}
          </>
        )}
      </div>
      <div className="re-command-search">
        <Icon name={pending ? "loader-circle" : "search"} />
        <input
          role="combobox"
          aria-label={label}
          aria-autocomplete="list"
          aria-controls={id}
          aria-expanded={open}
          aria-activedescendant={rows[active] ? `${id}-${active}` : undefined}
          aria-busy={!!pending}
          placeholder={
            breadcrumbs.length
              ? `Search ${breadcrumbs.at(-1).label.toLowerCase()}…`
              : placeholder
          }
          value={query}
          readOnly={!!pending}
          onChange={(event) => {
            setQuery(event.target.value);
            setActive(0);
            setError("");
          }}
          onKeyDown={(event) => {
            if (pending) return;
            if (event.key === "Escape") {
              event.preventDefault();
              event.stopPropagation();
              path.length ? back() : onOpenChange(false);
            } else if (event.key === "Backspace" && !query && path.length) {
              event.preventDefault();
              back();
            } else if (
              ["ArrowDown", "ArrowUp", "Home", "End"].includes(event.key)
            ) {
              event.preventDefault();
              setActive((index) =>
                event.key === "Home"
                  ? 0
                  : event.key === "End"
                    ? Math.max(0, rows.length - 1)
                    : rows.length
                      ? (index +
                          (event.key === "ArrowDown" ? 1 : -1) +
                          rows.length) %
                        rows.length
                      : 0,
              );
            } else if (event.key === "Enter" && rows[active]) {
              event.preventDefault();
              choose(rows[active]);
            } else {
              const command = flattenCommands(items).find((item) =>
                matchesCommandShortcut(event, item.shortcut),
              );
              if (command) {
                event.preventDefault();
                choose(command);
              }
            }
          }}
        />
        <kbd>{path.length ? "esc back" : "esc"}</kbd>
      </div>
      {error && (
        <p className="re-command-error" role="alert">
          {error}
        </p>
      )}
      <div
        id={id}
        ref={list}
        role="listbox"
        aria-label={label}
        className="re-command-list"
        aria-busy={!!pending}
      >
        {groups.map((group) => (
          <div
            role="group"
            aria-label={group}
            key={group}
            className="re-command-group"
          >
            <div className="re-command-group-label" aria-hidden="true">
              {group}
            </div>
            {rows
              .filter((item) => (item.group || "Commands") === group)
              .map((item) => {
                const index = rows.indexOf(item);
                return (
                  <div
                    key={item.value}
                    id={`${id}-${index}`}
                    role="option"
                    aria-selected={active === index}
                    aria-disabled={!!pending || undefined}
                    data-command-index={index}
                    className={active === index ? "is-active" : ""}
                    onMouseMove={() => {
                      if (!pending) setActive(index);
                    }}
                    onMouseDown={(event) => event.preventDefault()}
                    onClick={() => choose(item)}
                  >
                    <Icon
                      name={item.icon || (item.items ? "folder" : "terminal")}
                    />
                    <span>
                      <strong>{item.label}</strong>
                      {(item.description || item.trail.length > 0) && (
                        <small>
                          {item.description || item.trail.join(" / ")}
                        </small>
                      )}
                    </span>
                    {pending === item.value ? (
                      <span className="spinner" />
                    ) : item.items ? (
                      <Icon name="chevron-right" size={13} />
                    ) : item.shortcut ? (
                      <kbd>{item.shortcut}</kbd>
                    ) : active === index ? (
                      <kbd>↵</kbd>
                    ) : null}
                  </div>
                );
              })}
          </div>
        ))}
        {!rows.length && (
          <div className="re-command-empty" role="status">
            <Icon name="search" size={24} />
            <strong>No matching commands</strong>
            <p>Try a page name or an action, such as “files”.</p>
          </div>
        )}
      </div>
      <div className="re-command-footer">
        <span>
          {pending
            ? "Running command…"
            : `${rows.length} ${rows.length === 1 ? "result" : "results"}`}
        </span>
        <span>
          ↑ ↓ navigate <kbd>↵</kbd> run {path.length > 0 && "· esc back"}
        </span>
      </div>
    </Modal>
  );
}
