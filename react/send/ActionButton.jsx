import React from "react";
import Icon from "./Icon.jsx";
import { t } from "./i18n.js";

/**
 * The app's button. `className` picks the look (btn-primary, btn-ghost, btn-sm…).
 * While `loading`, it shows `loadingLabel` with a spinner and is disabled.
 * Plain-text children and `loadingLabel` are translated here.
 */
export default function ActionButton({
  icon,
  className = "",
  loading = false,
  loadingLabel,
  disabled,
  children,
  ref,
  title,
  ...props
}) {
  return (
    <button
      ref={ref}
      type="button"
      className={`btn ${className} ${icon === "trash" && className.split(" ").includes("btn-icon") ? "btn-icon-danger" : ""} ${loading ? "is-loading" : ""}`.trim()}
      disabled={disabled || loading}
      data-tooltip={title}
      aria-busy={loading || undefined}
      {...props}
    >
      {/* Idle content stays while loading (hidden by CSS) so the button,
          and everything beside it, never changes width. */}
      {icon && <Icon name={icon} />}
      {children != null && (
        <span className="btn-label" aria-hidden={loading || undefined}>
          {t(children)}
        </span>
      )}
      {loading && <span className="btn-busy">{t(loadingLabel)}</span>}
    </button>
  );
}
