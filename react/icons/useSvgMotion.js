import { useLayoutEffect } from "react";
// Native SVG animation, with no animated HTML/view wrapper.
export function useSvgMotion(
  ref,
  { playing = false, loop = false, hover = true, name },
) {
  useLayoutEffect(() => {
    const root = ref.current;
    if (!root) return;
    if (!playing && !hover) return;
    const media = matchMedia("(prefers-reduced-motion: reduce)");
    const animations = () => root.querySelectorAll("animate,animateTransform");
    const stop = () =>
      animations().forEach((animation) => {
        try {
          animation.endElement();
        } catch {}
      });
    const play = () => {
      if (media.matches) return;
      animations().forEach((animation) => {
        animation.setAttribute("repeatCount", loop ? "indefinite" : "1");
        animation.beginElement?.();
      });
    };
    const host = hover ? root.closest("button,a") || root : null;
    const leave = () => {
      if (!playing && document.activeElement !== host) stop();
    };
    const blur = () => {
      if (!playing && !host?.matches(":hover")) stop();
    };
    host?.addEventListener("pointerleave", leave);
    host?.addEventListener("blur", blur);
    host?.addEventListener("pointerenter", play);
    host?.addEventListener("focus", play);
    const preference = () => {
      if (media.matches) stop();
      else if (playing) play();
    };
    media.addEventListener("change", preference);
    if (playing) play();
    else stop();
    return () => {
      host?.removeEventListener("pointerleave", leave);
      host?.removeEventListener("blur", blur);
      host?.removeEventListener("pointerenter", play);
      host?.removeEventListener("focus", play);
      media.removeEventListener("change", preference);
      stop();
    };
  }, [playing, loop, hover, name]);
}
