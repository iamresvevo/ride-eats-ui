import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  normalizeShortcut,
  shortcutFromEvent,
  shortcutIssue,
  lineDiff,
  foldDiff,
  splitDiff,
} from "./review-model.js";

export function ShortcutRecorder({
  value,
  onValueChange,
  label = "Keyboard shortcut",
  bindings = [],
  disabled = false,
  allowConflicts = false,
  className = "",
  style,
}) {
  const [phase, setPhase] = useState("idle"),
    [draft, setDraft] = useState([]),
    [held, setHeld] = useState([]),
    [message, setMessage] = useState("");
  const record = useRef(null),
    current = normalizeShortcut(value),
    candidate = normalizeShortcut(draft);
  const issue = phase === "review" ? shortcutIssue(candidate, bindings) : null;
  const blocked = issue && (issue.kind === "reserved" || !allowConflicts);
  useEffect(() => {
    if (disabled) {
      setPhase("idle");
      setHeld([]);
    }
  }, [disabled]);
  const start = () => {
    setDraft([]);
    setHeld([]);
    setMessage("");
    setPhase("recording");
    record.current?.focus();
  };
  const cancel = () => {
    setPhase("idle");
    setHeld([]);
    setMessage("Recording cancelled.");
    record.current?.focus();
  };
  const keys =
    phase === "recording" ? held : phase === "review" ? candidate : current;
  return (
    <section
      className={`re-shortcut-recorder ${className}`}
      style={style}
      aria-label={label}
      onKeyDown={(event) => {
        if (phase === "idle" || disabled) return;
        if (event.key === "Escape") {
          event.preventDefault();
          event.stopPropagation();
          cancel();
          return;
        }
        if (phase !== "recording") return;
        event.preventDefault();
        event.stopPropagation();
        if (event.repeat || event.isComposing) return;
        const next = shortcutFromEvent(event);
        setHeld(next);
        if (
          !next.some(
            (key) => !["Control", "Alt", "Shift", "Meta"].includes(key),
          )
        )
          return;
        setDraft(next);
        setPhase("review");
        setHeld([]);
      }}
      onKeyUp={(event) => {
        if (phase === "recording")
          setHeld(
            shortcutFromEvent({
              key: "Unidentified",
              ctrlKey: event.ctrlKey,
              altKey: event.altKey,
              shiftKey: event.shiftKey,
              metaKey: event.metaKey,
            }),
          );
      }}
    >
      <header>
        <strong>{label}</strong>
        <span>
          {phase === "recording"
            ? "Recording"
            : phase === "review"
              ? "Review combination"
              : current.length
                ? "Assigned"
                : "Not assigned"}
        </span>
      </header>
      <button
        ref={record}
        type="button"
        className="re-shortcut-capture"
        disabled={disabled}
        aria-pressed={phase === "recording"}
        aria-label={
          phase === "recording"
            ? "Press a shortcut, or Escape to cancel"
            : `Record ${label.toLowerCase()}`
        }
        onClick={start}
      >
        {keys.length ? (
          keys.map((key, i) => (
            <React.Fragment key={`${key}-${i}`}>
              {i > 0 && <span aria-hidden="true">+</span>}
              <kbd>{key === "Control" ? "Ctrl" : key}</kbd>
            </React.Fragment>
          ))
        ) : (
          <span>
            {phase === "recording"
              ? "Press your key combination"
              : "Click to record a shortcut"}
          </span>
        )}
      </button>
      <p className="re-shortcut-hint" role="status" aria-live="polite">
        {issue?.message ||
          message ||
          (phase === "recording"
            ? "Escape cancels. Modifier keys alone are not saved."
            : phase === "review"
              ? "Save this combination or record another."
              : "Keyboard shortcuts are saved only when you confirm.")}
      </p>
      <footer>
        {phase === "review" ? (
          <>
            <button type="button" className="btn btn-outline" onClick={start}>
              Record again
            </button>
            <button
              type="button"
              className="btn btn-primary"
              disabled={!!blocked || disabled}
              onClick={() => {
                onValueChange(candidate);
                setPhase("idle");
                setMessage("Shortcut saved.");
              }}
            >
              Save shortcut
            </button>
          </>
        ) : null}
        {phase !== "idle" ? (
          <button type="button" className="btn btn-ghost" onClick={cancel}>
            Cancel
          </button>
        ) : (
          <button
            type="button"
            className="btn btn-ghost"
            disabled={disabled || !current.length}
            onClick={() => {
              onValueChange([]);
              setMessage("Shortcut cleared.");
            }}
          >
            Clear shortcut
          </button>
        )}
      </footer>
    </section>
  );
}

export function TextDiffViewer({
  before,
  after,
  beforeLabel = "Previous",
  afterLabel = "Revision",
  label = "Text changes",
  view = "split",
  onViewChange,
  contextLines = 3,
  collapseUnchanged = true,
  syncScroll = true,
  maxHeight = 360,
  className = "",
  style,
}) {
  const diff = useMemo(() => lineDiff(before, after), [before, after]);
  const [expanded, setExpanded] = useState([]),
    [message, setMessage] = useState("");
  const left = useRef(null),
    right = useRef(null),
    syncing = useRef(false),
    frame = useRef(null);
  useEffect(() => {
    setExpanded([]);
    setMessage("");
    if (left.current) left.current.scrollTop = 0;
    if (right.current) right.current.scrollTop = 0;
  }, [before, after]);
  useEffect(
    () => () => {
      if (frame.current != null) cancelAnimationFrame(frame.current);
    },
    [],
  );
  const rows = collapseUnchanged
    ? foldDiff(diff.rows, contextLines, expanded)
    : diff.rows;
  const pairs = splitDiff(rows);
  const unfold = (fold) => (
    <button
      type="button"
      className="re-diff-fold"
      onClick={() => setExpanded((old) => [...old, fold.id])}
    >
      Show {fold.count} unchanged lines
    </button>
  );
  const scroll = (event, other) => {
    if (!syncScroll || syncing.current || !other.current) return;
    syncing.current = true;
    other.current.scrollTop = event.currentTarget.scrollTop;
    other.current.scrollLeft = event.currentTarget.scrollLeft;
    if (frame.current != null) cancelAnimationFrame(frame.current);
    frame.current = requestAnimationFrame(() => {
      syncing.current = false;
    });
  };
  const content = (row, side) =>
    row ? (
      <tr data-change={row.type}>
        <th scope="row">{side === "left" ? row.oldLine : row.newLine}</th>
        <td
          className="re-diff-marker"
          aria-label={
            row.type === "add"
              ? "Added"
              : row.type === "remove"
                ? "Removed"
                : "Unchanged"
          }
        >
          {row.type === "add" ? "+" : row.type === "remove" ? "-" : " "}
        </td>
        <td>
          <code>{row.text || "\u00a0"}</code>
        </td>
      </tr>
    ) : (
      <tr className="re-diff-placeholder" aria-hidden="true">
        <td colSpan={3}>&nbsp;</td>
      </tr>
    );
  return (
    <section
      className={`re-diff ${className}`}
      style={{
        "--diff-height":
          typeof maxHeight === "number" ? `${maxHeight}px` : maxHeight,
        ...style,
      }}
      aria-label={label}
    >
      <header className="re-diff-toolbar">
        <div>
          <strong>{label}</strong>
          <span>
            {diff.added} added · {diff.removed} removed
          </span>
        </div>
        <div>
          {onViewChange && (
            <div role="group" aria-label="Diff layout">
              <button
                type="button"
                className="btn btn-ghost"
                aria-pressed={view === "split"}
                onClick={() => onViewChange("split")}
              >
                Split
              </button>
              <button
                type="button"
                className="btn btn-ghost"
                aria-pressed={view === "unified"}
                onClick={() => onViewChange("unified")}
              >
                Unified
              </button>
            </div>
          )}
          <button
            type="button"
            className="btn btn-outline"
            onClick={async () => {
              try {
                await navigator.clipboard.writeText(after);
                setMessage("Revision copied.");
              } catch {
                setMessage(
                  "Copy unavailable. Select the revision text to copy it.",
                );
              }
            }}
          >
            Copy revision
          </button>
        </div>
      </header>
      {diff.coarse && (
        <p className="re-diff-notice">
          Large replacement shown as complete removed and added blocks. All text
          is retained.
        </p>
      )}
      {view === "split" ? (
        <div className="re-diff-split">
          {["left", "right"].map((side) => (
            <div key={side} className="re-diff-pane">
              <h3>{side === "left" ? beforeLabel : afterLabel}</h3>
              <div
                ref={side === "left" ? left : right}
                className="re-diff-scroll"
                role="region"
                tabIndex={0}
                aria-label={`${side === "left" ? beforeLabel : afterLabel} text`}
                onScroll={(event) =>
                  scroll(event, side === "left" ? right : left)
                }
              >
                <table
                  aria-label={`${side === "left" ? beforeLabel : afterLabel} lines`}
                >
                  <tbody>
                    {pairs.map((pair, i) =>
                      pair.fold ? (
                        <tr key={pair.fold.id}>
                          <td colSpan={3}>{unfold(pair.fold)}</td>
                        </tr>
                      ) : (
                        <React.Fragment key={i}>
                          {content(pair[side], side)}
                        </React.Fragment>
                      ),
                    )}
                  </tbody>
                </table>
                {!pairs.length && <p className="re-diff-empty">No text</p>}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="re-diff-pane">
          <h3>
            {beforeLabel} → {afterLabel}
          </h3>
          <div
            className="re-diff-scroll"
            role="region"
            tabIndex={0}
            aria-label="Unified changes"
          >
            <table aria-label="Unified line changes">
              <tbody>
                {rows.map((row, i) =>
                  row.type === "fold" ? (
                    <tr key={row.id}>
                      <td colSpan={4}>{unfold(row)}</td>
                    </tr>
                  ) : (
                    <tr key={i} data-change={row.type}>
                      <th scope="row">{row.oldLine}</th>
                      <th scope="row">{row.newLine}</th>
                      <td
                        className="re-diff-marker"
                        aria-label={
                          row.type === "add"
                            ? "Added"
                            : row.type === "remove"
                              ? "Removed"
                              : "Unchanged"
                        }
                      >
                        {row.type === "add"
                          ? "+"
                          : row.type === "remove"
                            ? "-"
                            : " "}
                      </td>
                      <td>
                        <code>{row.text || "\u00a0"}</code>
                      </td>
                    </tr>
                  ),
                )}
              </tbody>
            </table>
            {!rows.length && <p className="re-diff-empty">No text</p>}
          </div>
        </div>
      )}
      <p role="status" className="re-sr-only" aria-live="polite">
        {message}
      </p>
    </section>
  );
}
