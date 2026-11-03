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
      {loading ? (
        t(loadingLabel)
      ) : (
        <>
          {icon && <Icon name={icon} />}
          {children != null && <span className="btn-label">{t(children)}</span>}
        </>
      )}
    </button>
  );
}
