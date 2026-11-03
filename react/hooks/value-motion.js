import { useLayoutEffect, useRef } from "react";
import { motionEase } from "../send/hooks/motion.js";
/** Directional value feedback, without animating an input while it is being edited. */
export function animateValue(node, previous, next) {
  if (
    !node ||
    previous === next ||
    !Number.isFinite(previous) ||
    !Number.isFinite(next) ||
    typeof node.animate !== "function" ||
    node.ownerDocument?.activeElement === node ||
    (node.ownerDocument?.activeElement &&
      node.parentElement?.contains(node.ownerDocument.activeElement)) ||
    matchMedia("(prefers-reduced-motion: reduce)").matches
  )
    return null;
  return node.animate(
    [
      { opacity: 0.25, transform: `translateY(${next > previous ? 6 : -6}px)` },
      { opacity: 1, transform: "translateY(0)" },
    ],
    { duration: 240, easing: motionEase(node) },
  );
}
export function useValueMotion(value) {
  const node = useRef(null),
    previous = useRef(value),
    animation = useRef(null);
  useLayoutEffect(() => {
    animation.current?.cancel();
    animation.current = animateValue(node.current, previous.current, value);
    previous.current = value;
    return () => animation.current?.cancel();
  }, [value]);
  return node;
}
