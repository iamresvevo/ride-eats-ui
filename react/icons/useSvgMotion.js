import { useLayoutEffect } from "react";
// Finish hover gestures smoothly. Pointer + focus must never restart an active cycle.
export function useSvgMotion(
  ref,
  { playing = false, loop = false, hover = true, name },
) {
  useLayoutEffect(() => {
    const root = ref.current;
    if (!root || (!playing && !hover)) return;
    const media = matchMedia("(prefers-reduced-motion: reduce)");
    let active = false,
      timer;
    const animations = () => root.querySelectorAll("animate");
    const stop = () => {
      clearTimeout(timer);
      active = false;
      animations().forEach((animation) => {
        try {
          animation.endElement();
        } catch {}
      });
    };
    const play = () => {
      if (media.matches || active) return;
      const nodes = [...animations()];
      if (!nodes.length) return;
      active = true;
      nodes.forEach((animation) => {
        try {
          animation.setAttribute("repeatCount", loop ? "indefinite" : "1");
          animation.beginElement?.();
        } catch {
          /* Unsupported SVG playback leaves the complete glyph still. */
        }
      });
      if (!loop)
        timer = setTimeout(
          () => {
            active = false;
          },
          Math.max(
            ...nodes.map((node) => parseFloat(node.getAttribute("dur")) || 2.4),
          ) * 1000,
        );
    };
    const host = hover ? root.closest("button,a") || root : null;
    host?.addEventListener("pointerenter", play);
    host?.addEventListener("focus", play);
    const preference = () => {
      if (media.matches) stop();
      else if (playing) play();
    };
    media.addEventListener("change", preference);
    if (playing) play();
    const observer = new MutationObserver(() => {
      if (playing || host?.matches(":hover") || document.activeElement === host)
        play();
    });
    observer.observe(root, { childList: true, subtree: true });
    return () => {
      observer.disconnect();
      host?.removeEventListener("pointerenter", play);
      host?.removeEventListener("focus", play);
      media.removeEventListener("change", preference);
      stop();
    };
  }, [playing, loop, hover, name]);
}
