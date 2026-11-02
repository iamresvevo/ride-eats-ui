import React from "react";
import { t } from "../i18n.js";

/**
 * A page's first load, before it knows what it will show: a spinner in the middle of the space an empty state
 * would take. It appears only after a short delay, so a quick answer shows nothing at all rather than a flash.
 */
export default function PageLoading({ label = "Loading..." }) {
  return (
    <div className="empty page-loading" role="status" aria-label={t(label)}>
      <span className="spinner" aria-hidden="true" />
    </div>
  );
}
