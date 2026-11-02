import React from "react";
import { t } from "../i18n.js";
import ActionButton from "../ActionButton.jsx";

/** Previous / next with the position between them. Hidden when everything fits on one page. */
export default function Pagination({ page, pages, total, disabled, onPage }) {
  if (pages <= 1) return null;
  return (
    <nav className="pagination" aria-label={t("Pages")}>
      <ActionButton
        icon="prev"
        className="btn-surface btn-sm"
        disabled={disabled || page <= 1}
        onClick={() => onPage(page - 1)}
      >
        {t("Previous")}
      </ActionButton>
      <span>
        {t("Page {page} of {pages} · {total} in total", { page, pages, total })}
      </span>
      <ActionButton
        icon="next"
        className="btn-surface btn-sm"
        disabled={disabled || page >= pages}
        onClick={() => onPage(page + 1)}
      >
        {t("Next")}
      </ActionButton>
    </nav>
  );
}
