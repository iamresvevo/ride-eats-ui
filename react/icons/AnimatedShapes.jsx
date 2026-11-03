import React from "react";
import { coreMotion, coreAliases } from "./core-motion.js";
import { authoredMotion } from "./authored-motion.js";
const settle = "0.25 1 0.3 1";
function Motion({ attributeName, values, phase = 0 }) {
  const [start, peak, end] = values.split(";");
  return (
    <animate
      attributeName={attributeName}
      values={`${start};${start};${peak};${end};${end}`}
      keyTimes={`0;${0.08 + phase};${0.27 + phase};${0.52 + phase};1`}
      dur="2.8s"
      begin="indefinite"
      calcMode="spline"
      keySplines={`0 0 1 1;${settle};${settle};0 0 1 1`}
    />
  );
}
function Headset() {
  return (
    <>
      <path d="M3 11a9 9 0 0 1 18 0" />
      <path d="M3 11h3a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z">
        <Motion
          attributeName="d"
          values="M3 11h3a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z;M3 11h3a2 2 0 0 1 2 2v2a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z;M3 11h3a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"
        />
      </path>
      <path d="M21 11h-3a2 2 0 0 0-2 2v3a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2z">
        <Motion
          attributeName="d"
          phase={0.04}
          values="M21 11h-3a2 2 0 0 0-2 2v3a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2z;M21 11h-3a2 2 0 0 0-2 2v2a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2z;M21 11h-3a2 2 0 0 0-2 2v3a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2z"
        />
      </path>
      <path d="M21 16v2a4 4 0 0 1-4 4h-5">
        <Motion
          attributeName="d"
          phase={0.08}
          values="M21 16v2a4 4 0 0 1-4 4h-5;M21 16v1a4 4 0 0 1-4 4h-5;M21 16v2a4 4 0 0 1-4 4h-5"
        />
      </path>
    </>
  );
}
function Folder() {
  return (
    <>
      <path d="M3 9v10a1 1 0 0 0 1 1h16a1 1 0 0 0 1-1V9" />
      <path d="M3 9V5h6l2 3h10v1">
        <Motion
          attributeName="d"
          values="M3 9V5h6l2 3h10v1;M3 9V3h6l2 3h10v3;M3 9V5h6l2 3h10v1"
        />
      </path>
    </>
  );
}
export function AnimatedShapes({
  nodes,
  name = "",
  motion = "auto",
  strokeWidth = 1.7,
}) {
  name = coreAliases[name] || name;
  const definition = coreMotion[name] || authoredMotion[name];
  if (motion === "auto" && coreMotion[name]) nodes = coreMotion[name].nodes;
  if (name === "headset" && motion !== "draw") return <Headset />;
  if (name === "folder" && motion !== "draw") return <Folder />;
  if (motion === "auto" && definition) {
    return nodes.map(([tag, attributes], index) => {
      const part = definition.parts[index];
      return React.createElement(
        tag,
        { ...attributes, key: index },
        part ? (
          <Motion
            attributeName={part.attributeName}
            values={`${attributes[part.attributeName]};${part.peak};${attributes[part.attributeName]}`}
          />
        ) : null,
      );
    });
  }
  return nodes.map(([tag, attributes], index) => {
    if (motion === "draw")
      return (
        <g key={index} data-svg-trace="true">
          {React.createElement(tag, attributes)}
          {React.createElement(
            tag,
            {
              ...attributes,
              pathLength: 1,
              strokeDasharray: ".16 .84",
              strokeOpacity: 0,
              strokeWidth: Number(strokeWidth) + 0.35,
            },
            <>
              <animate
                attributeName="stroke-dashoffset"
                values="0;0;-1;-1;0"
                keyTimes="0;.1;.6;.9;1"
                dur="2.8s"
                begin="indefinite"
                calcMode="spline"
                keySplines={`0 0 1 1;${settle};0 0 1 1;0 0 1 1`}
              />
              <animate
                attributeName="stroke-opacity"
                values="0;.8;.8;0;0"
                keyTimes="0;.1;.6;.9;1"
                dur="2.8s"
                begin="indefinite"
              />
            </>,
          )}
        </g>
      );
    return React.createElement(tag, { ...attributes, key: index });
  });
}
