import React from "react";
import Icon from "../Icon.jsx";
import { t } from "../i18n.js";

/** An on/off setting with its label and optional explanation. */
export default function Switch({
  icon,
  label,
  hint,
  checked,
  onChange,
  disabled,
  className = "",
}) {
  return (
    <label className={`switch ${className}`.trim()}>
      {icon && <Icon name={icon} />}
      <span className="switch-text">
        {t(label)}
        {hint && <small>{t(hint)}</small>}
      </span>
      <input
        type="checkbox"
        role="switch"
        checked={checked}
        disabled={disabled}
        onChange={(event) => onChange(event.target.checked)}
      />
      <span className="switch-track" aria-hidden="true" />
    </label>
  );
}
