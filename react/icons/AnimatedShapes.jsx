import React from "react";

// Preserve commands, arc flags and control-point topology so SMIL can interpolate paths.
export function breathePath(d, scale = 1.025) {
  let command = "",
    index = 0;
  const lengths = { m: 2, l: 2, t: 2, h: 1, v: 1, c: 6, s: 4, q: 4, a: 7 };
  return d.replace(
    /[a-zA-Z]|[-+]?(?:\d*\.\d+|\d+\.?\d*)(?:e[-+]?\d+)?/g,
    (token) => {
      if (/^[a-z]$/i.test(token)) {
        command = token;
        index = 0;
        return token;
      }
      const kind = command.toLowerCase(),
        slot = index++ % (lengths[kind] || 1),
        n = Number(token);
      if (kind === "a" && slot >= 2 && slot <= 4) return token;
      const radius = kind === "a" && slot < 2;
      const value =
        radius || command === kind ? n * scale : 12 + (n - 12) * scale;
      return String(Number(value.toFixed(4)));
    },
  );
}

// Animate geometry and strokes independently. No viewport or group transforms.
export function AnimatedShapes({ nodes }) {
  return nodes.map(([tag, attributes], index) => {
    const phase = Math.min(index * 0.045, 0.3);
    const end = Math.min(phase + 0.55, 0.88);
    const children = [
      <animate
        key="draw"
        attributeName="stroke-dashoffset"
        values="1;1;0;0"
        keyTimes={`0;${phase || 0.001};${end};1`}
        dur=".95s"
        begin="indefinite"
        calcMode="spline"
        keySplines="0 0 1 1;.22 1 .36 1;0 0 1 1"
      />,
    ];
    if (tag === "path" && attributes.d)
      children.push(
        <animate
          key="path"
          attributeName="d"
          values={`${attributes.d};${breathePath(attributes.d)};${attributes.d}`}
          dur=".95s"
          begin="indefinite"
        />,
      );
    if (tag === "circle" && Number(attributes.r) > 0)
      children.push(
        <animate
          key="radius"
          attributeName="r"
          values={`${attributes.r};${Number(attributes.r) * 0.84};${attributes.r}`}
          dur=".95s"
          begin="indefinite"
        />,
      );
    if (tag === "ellipse" && Number(attributes.ry) > 0)
      children.push(
        <animate
          key="ellipse"
          attributeName="ry"
          values={`${attributes.ry};${Number(attributes.ry) * 0.84};${attributes.ry}`}
          dur=".95s"
          begin="indefinite"
        />,
      );
    if (tag === "rect" && Number(attributes.rx) > 0)
      children.push(
        <animate
          key="corner"
          attributeName="rx"
          values={`${attributes.rx};${Number(attributes.rx) * 0.5};${attributes.rx}`}
          dur=".95s"
          begin="indefinite"
        />,
      );
    return React.createElement(
      tag,
      {
        ...attributes,
        key: index,
        pathLength: 1,
        strokeDasharray: "1",
        strokeDashoffset: 0,
      },
      children,
    );
  });
}
