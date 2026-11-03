import { coreMotion, coreAliases } from "../icons/core-motion.js";
import { authoredMotion } from "../icons/authored-motion.js";
import { AnimatedShapes } from "../icons/AnimatedShapes.jsx";
import { useSvgMotion } from "../icons/useSvgMotion.js";
import React, { lazy, Suspense, useRef } from "react";
import { loaders } from "../icons/loaders.js";
import { useCustomIcons } from "../icons/registry.jsx";
const loadedChunks = new Map();
function catalogChunk(key) {
  if (!loaders[key]) return null;
  if (!loadedChunks.has(key))
    loadedChunks.set(
      key,
      lazy(() =>
        loaders[key]().then((module) => ({
          default: ({ name, motion, strokeWidth }) => {
            const nodes = module.default[name] || [
              ["path", { d: "M9 9a3 3 0 0 1 6 0c0 2-3 2-3 4m0 4h.01" }],
            ];
            if (motion === "auto" || motion === "draw")
              return (
                <AnimatedShapes
                  nodes={nodes}
                  name={name}
                  motion={motion}
                  strokeWidth={strokeWidth}
                />
              );
            return nodes.map(([tag, attributes], index) =>
              React.createElement(tag, {
                ...attributes,
                pathLength: 1,
                key: index,
              }),
            );
          },
        })),
      ),
    );
  return loadedChunks.get(key);
}

const PATHS = {
  // Core formatting controls render synchronously. Geometry is Lucide/ISC (see icons notice).
  bold: "M6 12h9a4 4 0 010 8H7a1 1 0 01-1-1V5a1 1 0 011-1h7a4 4 0 010 8",
  italic: "M19 4h-9M14 20H5M15 4 9 20",
  underline: "M6 4v6a6 6 0 0 0 12 0V4M4 20h16",
  minus: "M5 12h14",
  filter: "M3 5h18l-7 8v6l-4-2v-4L3 5Z",
  infinity:
    "M12 12c-2-2.7-3.7-4-5.5-4a4 4 0 0 0 0 8c1.8 0 3.5-1.3 5.5-4Zm0 0c2 2.7 3.7 4 5.5 4a4 4 0 0 0 0-8c-1.8 0-3.5 1.3-5.5 4Z",
  terminal: "m5 7 5 5-5 5M13 17h6",
  list: "M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01",
  upload: "M12 16V3m-5 5 5-5 5 5M4 15v5h16v-5",
  files: "M8 3h8l4 4v14H8V3M16 3v5h4M4 7v14",
  link: "M10 13a5 5 0 0 0 7 0l3-3a5 5 0 0 0-7-7l-2 2M14 11a5 5 0 0 0-7 0l-3 3a5 5 0 0 0 7 7l2-2",
  copy: "M9 9h12v12H9V9M15 5V3H3v12h2",
  download: "M12 3v13m-5-5 5 5 5-5M4 17v4h16v-4",
  trash: "M3 6h18M9 6V3h6v3M5 6l1 15h12l1-15M10 10v7m4-7v7",
  pause: "M8 5v14M16 5v14",
  play: "m8 4 12 8-12 8V4",
  tag: "M3 12V4h8l10 10-8 8L3 12Zm4.5-4.5h.01",
  restore: "M4 12a8 8 0 1 0 2.5-5.8M4 4v5h5",
  folder: "M3 6h6l2 2h10v11H3V6",
  close: "m6 6 12 12M6 18 18 6",
  plus: "M12 5v14M5 12h14",
  clock: "M12 8v4l3 2M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0",
  login: "M14 4h6v16h-6M3 12h12m-4-4 4 4-4 4",
  logout: "M10 4H5v16h5M9 12h12m-4-4 4 4-4 4",
  check: "m5 12 4 4L19 6",
  edit: "M4 20h4L20 8l-4-4L4 16v4M14 6l4 4",
  calendar: "M4 6h16v15H4V6M4 10h16M8 3v4M16 3v4",
  message: "M4 5h16v11H9l-5 4V5",
  storage:
    "M4 6c0-1.7 3.6-3 8-3s8 1.3 8 3v12c0 1.7-3.6 3-8 3s-8-1.3-8-3V6M4 6c0 1.7 3.6 3 8 3s8-1.3 8-3M4 12c0 1.7 3.6 3 8 3s8-1.3 8-3",
  send: "M21 3 3 10l7 3 3 7 8-17M10 13 21 3",
  activity: "M3 12h4l3-8 4 16 3-8h4",
  warning: "M12 4 2 20h20L12 4M12 10v5M12 18h.01",
  qr: "M4 4h6v6H4V4M14 4h6v6h-6V4M4 14h6v6H4v-6M14 14h3v3h-3v-3M20 14v.01M17 20h3v-3M14 20v.01",
  bell: "M6 16V11a6 6 0 0 1 12 0v5l2 2H4l2-2M10 21h4",
  expand: "M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5",
  users:
    "M9 11a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7M2.5 20a6.5 6.5 0 0 1 13 0M16 11a3 3 0 1 0 0-6M18 14.5a5.5 5.5 0 0 1 3.5 5.5",
  settings:
    "M4 6h10M18 6h2M4 12h4M12 12h8M4 18h12M20 18h.01M14 4v4M8 10v4M16 16v4",
  more: "M5 11a1 1 0 1 0 0 2 1 1 0 0 0 0-2M12 11a1 1 0 1 0 0 2 1 1 0 0 0 0-2M19 11a1 1 0 1 0 0 2 1 1 0 0 0 0-2",
  sun: "M12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8M12 2v2M12 20v2M4 12H2M22 12h-2M5 5l1.5 1.5M17.5 17.5 19 19M5 19l1.5-1.5M17.5 6.5 19 5",
  moon: "M20 14A8 8 0 1 1 10 4a6.5 6.5 0 0 0 10 10",
  monitor: "M3 5h18v11H3V5M8 20h8M12 16v4",
  sort: "M7 4v16m-3-3 3 3 3-3M17 20V4m-3 3 3-3 3 3",
  user: "M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8M4 21a8 8 0 0 1 16 0",
  chart: "M4 20V10M10 20V4M16 20v-7M22 20H2",
  chevron: "m6 9 6 6 6-6",
  select: "m8 9 4-4 4 4M8 15l4 4 4-4",
  mail: "M3 6h18v12H3V6m0 1 9 6 9-6",
  eye: "M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12M12 9a3 3 0 1 0 0 6 3 3 0 0 0 0-6",
  search: "M11 4a7 7 0 1 0 0 14 7 7 0 0 0 0-14M20 20l-4-4",
  back: "M19 12H5m6-6-6 6 6 6",
  prev: "m15 5-7 7 7 7",
  next: "m9 5 7 7-7 7",
  external: "M14 4h6v6M20 4l-9 9M18 14v6H4V6h6",
  lock: "M6 10h12v11H6V10M8 10V7a4 4 0 0 1 8 0v3",
  globe:
    "M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18M3 12h18M12 3c3 3 3 15 0 18M12 3c-3 3-3 15 0 18",
  team: "M4 21V5h10v16M14 9h6v12M2 21h20M8 9h2M8 13h2M8 17h2",
  music:
    "M9 18V5l11-2v13M9 18a3 3 0 1 1-6 0 3 3 0 0 1 6 0M20 16a3 3 0 1 1-6 0 3 3 0 0 1 6 0",
  archive: "M4 4h16v5H4V4M6 9v11h12V9M10 13h4",
  bolt: "M13 3 5 14h6l-1 7 8-11h-6l1-7",
  phone: "M7 2h10v20H7V2M11 18h2",
  shield: "M12 3 4 6v6c0 5 3.5 8 8 9 4.5-1 8-4 8-9V6l-8-3M9 12l2 2 4-4",
};

export default function Icon({
  name,
  size,
  strokeWidth = 1.7,
  color,
  className = "",
  style,
  label,
  title,
  motion = "none",
  animateOn = "hover",
  playing,
  loop,
  ...props
}) {
  // Legacy movement names resolve to native geometry motion.
  if (["spin", "pulse", "bounce", "rotate"].includes(motion)) motion = "auto";
  const ref = useRef(null);
  useSvgMotion(ref, {
    playing: playing ?? (animateOn === "always" && motion !== "none"),
    loop: loop ?? (motion === "spin" || motion === "pulse"),
    hover: animateOn === "hover" && motion !== "none",
    name: motion + ":" + name,
  });
  const custom = useCustomIcons();
  const accessible = label || props["aria-label"] || title;
  if (motion === "auto" && coreAliases[name] && !custom[name])
    name = coreAliases[name];
  const preferCatalog =
    motion === "auto" &&
    (authoredMotion[name] ||
      [
        "eye",
        "mail",
        "lock",
        "bell",
        "heart",
        "upload",
        "download",
        "search",
        "settings",
        "users",
        "file",
        "trash",
        "trash-2",
      ].includes(name));
  const Glyph =
    (!PATHS[name] || preferCatalog) && !custom[name]
      ? catalogChunk(String(name || "")[0])
      : null;
  return (
    <svg
      {...props}
      ref={ref}
      className={`icon ${className}`}
      data-icon={name}
      data-motion={motion}
      data-animate-on={animateOn}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color || "currentColor"}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      width={size || 16}
      height={size || 16}
      style={{ ...(size ? { width: size, height: size } : {}), ...style }}
      role={accessible ? "img" : undefined}
      aria-label={accessible}
      aria-hidden={accessible ? undefined : true}
    >
      {title && <title>{title}</title>}
      <g strokeDasharray={custom[name] && motion === "draw" ? 1 : undefined}>
        {custom[name] && motion === "draw" && (
          <animate
            attributeName="stroke-dashoffset"
            values="0;.55;0;0"
            dur="2.4s"
            begin="indefinite"
          />
        )}
        {custom[name] ||
          (motion === "auto" && coreMotion[coreAliases[name] || name] ? (
            <AnimatedShapes
              name={name}
              motion={motion}
              nodes={coreMotion[coreAliases[name] || name]?.nodes || []}
            />
          ) : null) ||
          (PATHS[name] && !preferCatalog ? (
            motion === "auto" || motion === "draw" ? (
              <AnimatedShapes
                nodes={[["path", { d: PATHS[name] }]]}
                name={name}
                motion={motion}
                strokeWidth={strokeWidth}
              />
            ) : (
              <path d={PATHS[name]} pathLength="1" />
            )
          ) : Glyph ? (
            <Suspense fallback={null}>
              <Glyph name={name} motion={motion} strokeWidth={strokeWidth} />
            </Suspense>
          ) : (
            <path d="M9 9a3 3 0 0 1 6 0c0 2-3 2-3 4m0 4h.01" />
          ))}
      </g>
    </svg>
  );
}
