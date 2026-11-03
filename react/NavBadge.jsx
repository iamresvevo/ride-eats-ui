import React from "react";
/** Internal navigation slot, shared by Header and AppShell. */
export default function NavBadge({ count, badge }) {
  if (badge != null && badge !== false)
    return <span className="nav-badge-slot">{badge}</span>;
  if (count == null) return null;
  return <span className="nav-badge">{count}</span>;
}
