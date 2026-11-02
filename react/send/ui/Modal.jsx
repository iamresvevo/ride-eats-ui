import React from "react";
import { createPortal } from "react-dom";
import { useLayoutEffect, useId, useRef } from "react";
import Icon from "../Icon.jsx";
import { t } from "../i18n.js";

const modalStack = [];
function syncStack() {
  modalStack.forEach((element, index) => {
    const depth = modalStack.length - index - 1;
    element.dataset.stackDepth = String(depth);
    element.dataset.backdropOwner = String(index === 0);
    element.style.setProperty("--dialog-depth", String(depth));
    element.classList.toggle("is-behind", depth > 0);
    element.inert = depth > 0;
  });
}
let openModals = 0;
let exitingModals = 0;

function updateScrollLock() {
  document.body.classList.toggle("dialog-open", openModals + exitingModals > 0);
}

// React's autoFocus runs while <dialog> is still closed. Focus editable content
// after showModal(), and allow an asynchronously loaded form one initial focus.
function focusFormOnOpen(element) {
  const editable =
    'input:not([type="hidden"]):not([type="checkbox"]):not([type="radio"]):not([type="file"]):not([type="button"]):not([type="submit"]):not([type="reset"]):not([type="range"]):not([type="color"]), textarea, [contenteditable="true"]';
  const available = (field) =>
    !field.matches(":disabled, [readonly]") &&
    !field.closest("[inert]") &&
    field.getClientRects().length > 0;
  const focus = () => {
    // Do not replace an explicit field focus chosen by the form itself.
    if (
      element.contains(document.activeElement) &&
      document.activeElement.matches(editable)
    )
      return true;
    const preferred = [
      ...element.querySelectorAll("[autofocus], [data-autofocus]"),
    ].find(available);
    const field =
      preferred || [...element.querySelectorAll(editable)].find(available);
    if (!field) return false;
    field.focus({ preventScroll: true });
    return document.activeElement === field;
  };
  if (focus()) return () => {};
  const stop = () => {
    observer.disconnect();
    element.removeEventListener("pointerdown", stop, true);
    element.removeEventListener("keydown", stop, true);
  };
  const observer = new MutationObserver(() => {
    if (focus()) stop();
  });
  observer.observe(element, {
    childList: true,
    subtree: true,
    attributes: true,
    attributeFilter: ["disabled", "hidden", "readonly"],
  });
  // A user who has started interacting owns focus, even if data arrives later.
  element.addEventListener("pointerdown", stop, true);
  element.addEventListener("keydown", stop, true);
  return stop;
}

/**
 * React removes a closed dialog at once, so the close animation plays on an inert copy left in its place
 * for those 150ms. It shows the same pixels, takes no input, and is removed when the animation ends.
 */
function playExit(element, opener) {
  if (
    !element.classList.contains("dialog") ||
    matchMedia("(prefers-reduced-motion: reduce)").matches
  )
    return false;
  const ghost = element.cloneNode(true);
  ghost.inert = true;
  ghost.removeAttribute("id");
  ghost.removeAttribute("open");
  ghost.classList.add("dialog-closing");
  document.body.append(ghost);
  try {
    ghost.showModal();
  } catch (error) {
    ghost.remove();
    throw error;
  }
  exitingModals++;
  updateScrollLock();
  const scrollers = element.querySelectorAll("*");
  ghost.querySelectorAll("*").forEach((node, index) => {
    if (scrollers[index]?.scrollTop)
      node.scrollTop = scrollers[index].scrollTop;
  });
  // The copy is modal for a moment, so focus goes back to the opener once it is gone.
  const done = () => {
    if (!ghost.isConnected) return;
    ghost.remove();
    exitingModals--;
    updateScrollLock();
    // A newly opened dialog owns focus; closing an older one must not steal it.
    const top = [
      ...document.querySelectorAll("dialog[open]:not(.dialog-closing)"),
    ].at(-1);
    if (!top || top.contains(opener)) opener?.focus?.({ preventScroll: true });
  };
  ghost.addEventListener("animationend", (event) => {
    if (
      event.target === ghost &&
      ["dialog-out", "re-dialog-out", "re-drawer-out"].includes(
        event.animationName,
      )
    )
      done();
  });
  setTimeout(done, 300);
  return true;
}

/**
 * The app's one popup. Rendering it opens it; unmounting it closes it.
 *
 * It owns everything every popup needs: native modal behaviour (focus trap, Escape,
 * top layer), page scroll lock, returning focus to whatever opened it, and closing on
 * a backdrop click. `onClose` fires for Escape and backdrop clicks; the parent then
 * stops rendering it. `dismissable={false}` blocks both while something is saving.
 *
 * variant: 'dialog' (centred card) or 'screen' (covers the whole window).
 * `title` adds the standard header with a close button; popups without one label themselves.
 * `footer` keeps paging/actions outside the caller's scrollable content.
 */
export default function Modal({
  variant = "dialog",
  size,
  className = "",
  style,
  title,
  label,
  labelledBy,
  dismissable = true,
  closeOnBackdrop = true,
  onClose,
  children,
  footer,
}) {
  const dialog = useRef(null);
  const titleId = useId();

  useLayoutEffect(() => {
    const element = dialog.current;
    const active = document.activeElement;
    // Menu items disappear when their menu closes. Return to its persistent trigger.
    const opener =
      active
        .closest('[role="menu"]')
        ?.parentElement.querySelector('[aria-haspopup="menu"]') || active;
    modalStack.push(element);
    syncStack();
    openModals++;
    updateScrollLock();
    element.dataset.entered = "false";
    const enterTimer = setTimeout(() => {
      element.dataset.entered = "true";
    }, 280);
    element.showModal();
    const stopInitialFocus = focusFormOnOpen(element);
    return () => {
      clearTimeout(enterTimer);
      stopInitialFocus();
      // React replays effects in StrictMode without removing the dialog. Only a
      // real unmount gets an exit copy; otherwise it covers the new opening.
      queueMicrotask(() => {
        if (!element.isConnected) {
          let animated = false;
          try {
            animated = playExit(element, opener);
          } catch {
            /* closing still works without animation */
          }
          if (!animated) opener?.focus?.({ preventScroll: true });
        }
        updateScrollLock();
      });
      const index = modalStack.indexOf(element);
      if (index >= 0) modalStack.splice(index, 1);
      element.inert = false;
      syncStack();
      element.close();
      openModals--;
    };
  }, []);

  if (typeof document === "undefined") return null;
  return createPortal(
    <dialog
      ref={dialog}
      style={style}
      className={`${variant === "screen" ? "viewer" : "dialog"} ${size ? "dialog-" + size : ""} ${className}`.trim()}
      aria-label={label}
      aria-labelledby={title ? titleId : labelledBy}
      // Escape: let the parent decide, rather than the dialog closing itself out of sync with React.
      // If the browser closes it anyway (a second Escape), keep React in step.
      onClose={() => {
        // Ignore a queued close from development effect cleanup after reopening.
        if (dialog.current?.isConnected && !dialog.current.open) onClose();
      }}
      onCancel={(event) => {
        // A file picker closed without choosing also fires `cancel`, and it bubbles up to here: only Escape on the dialog itself closes it.
        if (event.target !== dialog.current) return;
        event.preventDefault();
        if (dismissable) onClose();
      }}
      // A click on the backdrop lands on the dialog element itself.
      onClick={(event) => {
        if (
          dismissable &&
          closeOnBackdrop &&
          variant === "dialog" &&
          event.target === dialog.current
        )
          onClose();
      }}
    >
      {title && (
        <div className="dialog-head">
          <h2 id={titleId}>{t(title)}</h2>
          <button
            type="button"
            className="btn btn-ghost btn-icon"
            aria-label={t("Close")}
            disabled={!dismissable}
            onClick={onClose}
          >
            <Icon name="close" />
          </button>
        </div>
      )}
      {children}
      {footer && <div className="dialog-footer">{footer}</div>}
    </dialog>,
    document.body,
  );
}
