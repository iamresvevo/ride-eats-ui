import React, { useLayoutEffect, useRef, useState, useId } from "react";
import { createPortal } from "react-dom";
import Icon from "../Icon.jsx";
import { t } from "../i18n.js";
const stack = [];
function syncStack() {
  stack.forEach((element, index) => {
    const depth = stack.length - index - 1;
    element.dataset.stackDepth = String(depth);
    element.dataset.backdropOwner = String(index === 0);
    element.style.setProperty("--dialog-depth", String(depth));
    element.classList.toggle("is-behind", depth > 0);
    element.inert = depth > 0 || element.dataset.closing === "true";
  });
  document.body.classList.toggle("dialog-open", stack.length > 0);
}
function restoreFocus(opener) {
  const top = stack.at(-1);
  if (
    opener?.isConnected &&
    !opener.closest("[inert]") &&
    (!top || top.contains(opener))
  )
    opener.focus?.({ preventScroll: true });
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

/** A real React-managed native dialog. Keep it mounted and control `open` for animated exits. */
export default function Modal({
  open = true,
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
  onAfterClose,
  children,
  footer,
}) {
  const [mounted, setMounted] = useState(open);
  if (open && !mounted) setMounted(true);
  const openerRef = useRef(null);
  const dialog = useRef(null),
    titleId = useId(),
    latest = useRef({ onClose, onAfterClose });
  latest.current = { onClose, onAfterClose };
  useLayoutEffect(() => {
    if (!mounted) {
      openerRef.current = null;
      return;
    }
    const element = dialog.current,
      active = document.activeElement;
    const candidate =
      active
        ?.closest('[role="menu"]')
        ?.parentElement.querySelector('[aria-haspopup="menu"]') || active;
    if (!openerRef.current) openerRef.current = candidate;
    const opener = openerRef.current;
    element.dataset.entered = "false";
    element.dataset.closing = "false";
    stack.push(element);
    syncStack();
    element.showModal();
    const enterTimer = setTimeout(() => {
      element.dataset.entered = "true";
    }, 280);
    const stopFocus = focusFormOnOpen(element);
    return () => {
      clearTimeout(enterTimer);
      stopFocus();
      const index = stack.indexOf(element);
      if (index >= 0) stack.splice(index, 1);
      syncStack();
      element.close();
      queueMicrotask(() => restoreFocus(opener));
    };
  }, [mounted]);
  useLayoutEffect(() => {
    if (!mounted) return;
    const element = dialog.current;
    if (open) {
      element.dataset.closing = "false";
      element.classList.remove("dialog-closing");
      element.style.animation = "";
      element.style.transition = "";
      syncStack();
      return;
    }
    let cancelled = false,
      finished = false,
      animation;
    const done = () => {
      if (cancelled || finished) return;
      finished = true;
      setMounted(false);
      latest.current.onAfterClose?.();
    };
    const current = getComputedStyle(element),
      from = {
        opacity: current.opacity,
        transform:
          current.transform === "none"
            ? "matrix(1,0,0,1,0,0)"
            : current.transform,
      };
    element.dataset.closing = "true";
    element.classList.add("dialog-closing");
    element.style.animation = "none";
    element.style.transition = "none";
    syncStack();
    const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
    const duration = reduced
      ? 0
      : variant === "dialog" && className.includes("re-drawer")
        ? 220
        : 180;
    const timer = setTimeout(done, duration + 40);
    if (reduced) done();
    else {
      const drawer = className.includes("re-drawer");
      const offset = drawer
        ? ` translateX(${className.includes("re-drawer-left") ? "-24" : "24"}px)`
        : " translateY(8px) scale(.98)";
      animation = element.animate(
        [from, { opacity: 0, transform: from.transform + offset }],
        { duration, easing: "cubic-bezier(.4,0,1,1)", fill: "forwards" },
      );
      animation.finished.then(done, () => {});
    }
    return () => {
      cancelled = true;
      clearTimeout(timer);
      animation?.cancel();
    };
  }, [open, mounted]);
  if (!mounted || typeof document === "undefined") return null;
  const requestClose = () => {
    if (open && dismissable) latest.current.onClose?.();
  };
  return createPortal(
    <dialog
      ref={dialog}
      style={style}
      className={`${variant === "screen" ? "viewer" : "dialog"} ${size ? "dialog-" + size : ""} ${className}`.trim()}
      aria-label={label}
      aria-labelledby={title ? titleId : labelledBy}
      onClose={() => {
        if (open && dialog.current?.isConnected && !dialog.current.open)
          requestClose();
      }}
      onCancel={(event) => {
        if (event.target !== dialog.current) return;
        event.preventDefault();
        requestClose();
      }}
      onClick={(event) => {
        if (
          closeOnBackdrop &&
          variant === "dialog" &&
          event.target === dialog.current
        )
          requestClose();
      }}
    >
      {title && (
        <div className="dialog-head">
          <h2 id={titleId}>{t(title)}</h2>
          <button
            type="button"
            className="btn btn-ghost btn-icon"
            aria-label={t("Close")}
            disabled={!dismissable || !open}
            onClick={requestClose}
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
