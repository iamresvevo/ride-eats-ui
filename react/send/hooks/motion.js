// Same soft settle as Send's --spring-soft. CSS remains the customization API.
export const DEFAULT_MOTION_EASE = "cubic-bezier(.25,1,.3,1)";
export function motionEase(element) {
  return (
    (typeof getComputedStyle === "function" && element
      ? getComputedStyle(element).getPropertyValue("--motion-ease").trim()
      : "") || DEFAULT_MOTION_EASE
  );
}
