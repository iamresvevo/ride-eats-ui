import React from "react";
import { t } from "../i18n.js";

/**
 * One grey placeholder block. `className` sets its shape (bone-tile, bone-badge, bone-btn…).
 * An <i>, not a <span>: the stylesheet styles spans inside tiles, rows and figures, and a bone must not pick that up.
 */
export const Bone = ({ className = "" }) => (
  <i className={`bone ${className}`.trim()} aria-hidden="true" />
);

/**
 * A stand-in for a piece of text. It goes inside the real element (`<h1>`, `<strong>`, `<small>`…),
 * so it takes that element's size and line height and the row ends up exactly as tall as the real one.
 * `ch` is roughly how many characters the real text has: 3, 6, 10, 16, 24 or 36.
 */
export const BoneText = ({ ch = 10 }) => (
  <i className={`bone bone-text bone-ch-${ch}`} aria-hidden="true">
    0
  </i>
);

/**
 * The app's loading state: the outline of the content that is on its way, so the page doesn't
 * jump when it arrives. Announced to screen readers by `label`; the blocks themselves are decoration.
 *
 * A skeleton is the screen's own markup with its own class names: titles, panel heads and labels
 * that don't depend on the data are rendered for real, and only the data is replaced by bones.
 */
export default function Skeleton({ label, className = "", children }) {
  return (
    <div
      className={`skeleton ${className}`.trim()}
      role="status"
      aria-label={t(label)}
      aria-busy="true"
    >
      {children}
    </div>
  );
}

const times = (count) => Array.from({ length: count }, (_, index) => index);
// Rows differ a little in length, like real names do.
const LENGTHS = [16, 10, 24, 16, 10];

/** Rows of a transfer list: checkbox, tile, title and figures, two badges, two actions. */
export function SkeletonTransfers({ count = 2, selectable = true }) {
  return times(count).map((index) => (
    <div key={index} className="transfer-row">
      {selectable && <Bone className="bone-check" />}
      <span className="transfer-main">
        <Bone className="bone-tile-lg" />
        <span className="transfer-info">
          <strong>
            <BoneText ch={LENGTHS[index % LENGTHS.length]} />
          </strong>
          <small>
            <BoneText ch={24} />
          </small>
        </span>
      </span>
      <div className="transfer-badges">
        <Bone className="bone-badge" />
        <Bone className="bone-badge bone-badge-wide" />
      </div>
      <div className="transfer-actions">
        <Bone className="bone-btn-icon" />
        <Bone className="bone-btn-icon" />
      </div>
    </div>
  ));
}

/** Rows of an item list (files, transfers inside a panel): tile, name and a line, then `trailing`. */
export function SkeletonItems({
  count = 2,
  tile = true,
  trailing = <Bone className="bone-btn-icon" />,
}) {
  return times(count).map((index) => (
    <div key={index} className="item">
      <span className="item-open">
        {tile && <Bone className="bone-tile" />}
        <span className="item-info">
          <span className="file-name">
            <BoneText ch={LENGTHS[index % LENGTHS.length]} />
          </span>
          <small>
            <BoneText ch={10} />
          </small>
        </span>
      </span>
      {trailing}
    </div>
  ));
}

/** Rows of an activity timeline. */
export function SkeletonActivity({ count = 2 }) {
  return (
    <ul className="activity">
      {times(count).map((index) => (
        <li key={index}>
          <Bone className="bone-dot" />
          <p>
            <BoneText ch={LENGTHS[(index + 2) % LENGTHS.length]} />
          </p>
          <time>
            <BoneText ch={6} />
          </time>
        </li>
      ))}
    </ul>
  );
}
