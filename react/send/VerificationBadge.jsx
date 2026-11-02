import React from "react";
import { t } from "./i18n.js";

/** The same blue verification mark used beside Ride Eats account names. */
export default function VerificationBadge({ verified }) {
  if (!verified) return null;
  return (
    <span
      className="verification-badge"
      role="img"
      aria-label={t("Verified account")}
      data-tooltip={t("Verified account")}
    >
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path
          fill="currentColor"
          d="m12 1 2.4 2.7 3.6-.6.8 3.6 3.3 1.5-1.4 3.4 1.4 3.4-3.3 1.5-.8 3.6-3.6-.6L12 23l-2.4-2.9-3.6.6-.8-3.6-3.3-1.5L3.3 12 1.9 8.6l3.3-1.5L6 3.5l3.6.6Z"
        />
        <path
          d="m7.5 12 3 3 6-6"
          fill="none"
          stroke="#fff"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </span>
  );
}
