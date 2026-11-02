import React from "react";
import VerificationBadge from "./VerificationBadge.jsx";

export default function VerifiedName({ name, verified, className = "" }) {
  return (
    <span className={`verified-name ${className}`.trim()}>
      <span className="verified-name-text" title={name}>
        {name}
      </span>
      <VerificationBadge verified={verified} />
    </span>
  );
}
