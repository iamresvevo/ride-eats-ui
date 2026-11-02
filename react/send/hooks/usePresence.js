import { useEffect, useState } from "react";

/** Exit presence follows the surface's actual CSS duration, including overrides. */
export default function usePresence(open, surface) {
  const [mounted, setMounted] = useState(open);
  if (open && !mounted) setMounted(true);
  useEffect(() => {
    if (open || !mounted) return;
    const node = surface?.current;
    const css = node ? getComputedStyle(node) : null;
    const time = (value) =>
      value.trim().endsWith("ms")
        ? parseFloat(value)
        : parseFloat(value) * 1000;
    const durations = css?.animationDuration.split(",").map(time) || [0];
    const delays = css?.animationDelay.split(",").map(time) || [0];
    const duration = Math.max(
      0,
      ...durations.map(
        (value, index) => value + (delays[index % delays.length] || 0),
      ),
    );
    // animationend may not fire after stylesheet changes, hidden tabs or cancellation.
    const timer = setTimeout(() => setMounted(false), duration + 50);
    return () => clearTimeout(timer);
  }, [open, mounted, surface]);
  return {
    mounted,
    closing: mounted && !open,
    onAnimationEnd: (event) => {
      if (event.target === event.currentTarget && !open) setMounted(false);
    },
  };
}
