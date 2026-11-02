// Motion extracted from Send Segmented.jsx; shared by radio controls and Tabs.
export function placeSelection(
  root,
  animate,
  selector = '[aria-checked="true"]',
) {
  const selected = root.querySelector(selector);
  const pill = root.querySelector("[data-selection-pill]");
  if (!selected || !selected.offsetWidth || !root.offsetWidth) {
    pill.style.opacity = "0";
    delete pill.dataset.geometry;
    return;
  }
  const x = selected.offsetLeft;
  const geometry = `${x}:${selected.offsetTop}:${selected.offsetWidth}:${selected.offsetHeight}`;
  if (pill.dataset.geometry === geometry) return;
  pill.dataset.geometry = geometry;
  const previousX = Number(pill.dataset.x ?? x);
  const moving =
    animate &&
    pill.dataset.ready &&
    !matchMedia("(prefers-reduced-motion: reduce)").matches;
  pill.style.transition = moving ? "" : "none";
  pill.style.width = `${selected.offsetWidth}px`;
  pill.style.height = `${selected.offsetHeight}px`;
  pill.style.transform = `translate(${x}px, ${selected.offsetTop}px)`;
  pill.style.opacity = "1";
  pill.dataset.x = x;
  pill.dataset.ready = "true";
  const liquid = pill.firstElementChild;
  liquid.getAnimations().forEach((animation) => animation.cancel());
  if (moving) {
    const stretch =
      1 +
      Math.min(0.2, (Math.abs(x - previousX) / selected.offsetWidth) * 0.09);
    liquid.style.transformOrigin = x > previousX ? "25% center" : "75% center";
    liquid.animate(
      [
        { transform: "scale(1, 1)", offset: 0 },
        { transform: `scale(${stretch}, 0.88)`, offset: 0.32 },
        { transform: "scale(0.98, 1.035)", offset: 0.72 },
        { transform: "scale(1, 1)", offset: 1 },
      ],
      { duration: 400, easing: "cubic-bezier(.22,1,.36,1)" },
    );
  }
}
