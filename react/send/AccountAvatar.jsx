import React from "react";
import { useState } from "react";
const initials = (name = "") =>
  name
    .split(/\s+/)
    .map((word) => word[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase();

export default function AccountAvatar({ name, src, className = "" }) {
  const [failed, setFailed] = useState(null);
  return (
    <span className={`account-avatar ${className}`.trim()} aria-hidden="true">
      {initials(name)}
      {src && failed !== src && (
        <img
          src={src}
          alt=""
          referrerPolicy="no-referrer"
          onError={() => setFailed(src)}
        />
      )}
    </span>
  );
}
