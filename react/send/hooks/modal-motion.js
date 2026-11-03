/** Edge surfaces travel completely off-screen, while centered dialogs retain their own exit. */
export function modalExitMotion(className, reduced = false) {
  const sheet = className.includes("re-bottom-sheet"),
    drawer = className.includes("re-drawer"),
    surface = sheet || drawer;
  return {
    duration: reduced ? (surface ? 0 : 80) : surface ? 300 : 180,
    opacity: surface ? 1 : 0,
    offset: reduced
      ? ""
      : sheet
        ? " translateY(calc(100% + 24px))"
        : drawer
          ? ` translateX(calc(${className.includes("re-drawer-left") ? "-100% -" : "100% +"} 24px))`
          : " translateY(8px) scale(.98)",
  };
}
