import React from "react";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

/** Shared icon tooltips, including controls inside modal and menu portals. */
export default function Tooltips() {
  const [tip, setTip] = useState(null);
  const [position, setPosition] = useState(null);
  const panel = useRef(null);

  useEffect(() => {
    let timer;
    let active;
    let focused;
    let hovered;
    const hide = () => {
      clearTimeout(timer);
      active = null;
      setTip((current) => (current ? { ...current, closing: true } : null));
    };
    const show = (target, immediate = false) => {
      const control =
        target instanceof Element
          ? target.closest("[data-tooltip], button, a[href]")
          : null;
      const explicit = control?.getAttribute("data-tooltip");
      const text =
        explicit ||
        (!control?.textContent?.trim()
          ? control?.getAttribute("aria-label")
          : null);
      if (
        !control ||
        !text ||
        control.disabled ||
        control.getAttribute("aria-expanded") === "true"
      )
        return hide();
      if (active === control) return;
      hide();
      active = control;
      timer = setTimeout(
        () => {
          if (!control.isConnected) return hide();
          setPosition(null);
          setTip({ control, text, closing: false });
        },
        immediate ? 0 : 350,
      );
    };
    const over = (event) => {
      if (event.pointerType === "touch") return;
      hovered = event.target;
      show(hovered);
    };
    const out = (event) => {
      hovered = event.relatedTarget;
      show(focused || hovered);
    };
    const focus = (event) => {
      focused = event.target;
      show(focused, true);
    };
    const blur = () => {
      focused = null;
      show(hovered);
    };
    const key = (event) => {
      if (event.key === "Escape") hide();
    };
    document.addEventListener("pointerover", over);
    document.addEventListener("pointerout", out);
    document.addEventListener("focusin", focus);
    document.addEventListener("focusout", blur);
    document.addEventListener("pointerdown", hide);
    document.addEventListener("keydown", key);
    window.addEventListener("scroll", hide, true);
    window.addEventListener("resize", hide);
    return () => {
      clearTimeout(timer);
      document.removeEventListener("pointerover", over);
      document.removeEventListener("pointerout", out);
      document.removeEventListener("focusin", focus);
      document.removeEventListener("focusout", blur);
      document.removeEventListener("pointerdown", hide);
      document.removeEventListener("keydown", key);
      window.removeEventListener("scroll", hide, true);
      window.removeEventListener("resize", hide);
    };
  }, []);

  useLayoutEffect(() => {
    if (!tip || tip.closing || !panel.current) return;
    const anchor = tip.control.getBoundingClientRect();
    const box = panel.current.getBoundingClientRect();
    const below = anchor.top < box.height + 16;
    setPosition({
      left: Math.max(
        8,
        Math.min(
          anchor.left + (anchor.width - box.width) / 2,
          innerWidth - box.width - 8,
        ),
      ),
      top: below ? anchor.bottom + 8 : anchor.top - box.height - 8,
      transformOrigin: below ? "top center" : "bottom center",
    });
    const previous = tip.control.getAttribute("aria-describedby");
    tip.control.setAttribute(
      "aria-describedby",
      [previous, "send-tooltip"].filter(Boolean).join(" "),
    );
    return () => {
      if (previous) tip.control.setAttribute("aria-describedby", previous);
      else tip.control.removeAttribute("aria-describedby");
    };
  }, [tip]);

  if (!tip) return null;
  return createPortal(
    <div
      ref={panel}
      id="send-tooltip"
      role="tooltip"
      className={`tooltip${tip.closing ? " is-closing" : ""}`}
      style={{ ...position, visibility: position ? "visible" : "hidden" }}
      onAnimationEnd={() => {
        if (tip.closing) setTip(null);
      }}
    >
      {tip.text}
    </div>,
    document.body,
  );
}
