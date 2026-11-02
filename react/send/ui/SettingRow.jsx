import React from "react";
import { t } from "../i18n.js";
import Icon from "../Icon.jsx";

/**
 * One setting: what it is on the left, its control on the right at the control's natural size.
 * Rows stack with a hairline between them, so a wide panel reads as a list, not a stretched form.
 */
export default function SettingRow({
  icon,
  label,
  hint,
  wide = false,
  children,
}) {
  return (
    <div className="setting-row">
      {icon && <Icon name={icon} />}
      <div className="setting-text">
        {t(label)}
        {hint && <small>{t(hint)}</small>}
      </div>
      <div
        className={
          wide ? "setting-control setting-control-wide" : "setting-control"
        }
      >
        {children}
      </div>
    </div>
  );
}
