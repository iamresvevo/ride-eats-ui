import React from "react";

// Animate geometry and strokes independently. No viewport or group transforms.
export function AnimatedShapes({ nodes }) {
  return nodes.map(([tag, attributes], index) => {
    // Keep the glyph readable throughout the cycle; start and end at the same state.
    const phase = Math.min(index * 0.025, 0.16);
    const children = [
      <animate
        key="accent"
        attributeName="stroke-dashoffset"
        values="0;0;.55;0;0"
        keyTimes={`0;${phase || 0.001};${0.28 + phase};${0.6 + phase};1`}
        dur="2.4s"
        begin="indefinite"
        calcMode="spline"
        keySplines="0 0 1 1;.4 0 .2 1;.4 0 .2 1;0 0 1 1"
      />,
    ];
    return (
      <g key={index} data-svg-trace="true">
        {React.createElement(tag, {
          ...attributes,
          strokeOpacity: 0.24,
          "aria-hidden": true,
        })}
        {React.createElement(
          tag,
          {
            ...attributes,
            pathLength: 1,
            strokeDasharray: "1",
            strokeDashoffset: 0,
          },
          children,
        )}
      </g>
    );
  });
}
