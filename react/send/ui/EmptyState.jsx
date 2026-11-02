import React from "react";
import Icon from "../Icon.jsx";
import { t } from "../i18n.js";

/** What a screen shows when there is nothing to list: an icon, a headline, one line, and an optional action. */
export default function EmptyState({ icon, title, text, children }) {
  return (
    <div className="empty">
      <span className="empty-icon">
        <Icon name={icon} />
      </span>
      <h2>{t(title)}</h2>
      {text && <p>{t(text)}</p>}
      {children}
    </div>
  );
}
