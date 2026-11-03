const lengths = { M: 2, L: 2, H: 1, V: 1, C: 6, S: 4, Q: 4, T: 2, A: 7 };
// Preserve command topology and arc flags while moving SVG geometry, never its viewport.
export function morphPath(d, { dx = 0, dy = 0, scale = 1 } = {}) {
  const tokens =
    String(d).match(
      /[a-df-zA-DF-Z]|[-+]?(?:\d*\.\d+|\d+\.?\d*)(?:e[-+]?\d+)?/gi,
    ) || [];
  const output = [];
  let i = 0,
    command,
    initial = true,
    group = 0;
  while (i < tokens.length) {
    if (/^[a-z]$/i.test(tokens[i])) {
      command = tokens[i++];
      group = 0;
      if (command.toUpperCase() === "Z") {
        output.push(command);
        continue;
      }
    }
    const size = lengths[command?.toUpperCase()];
    if (!size || i + size > tokens.length) return String(d);
    const values = tokens.slice(i, i + size).map(Number);
    if (values.some((v) => !Number.isFinite(v))) return String(d);
    i += size;
    const upper = command.toUpperCase(),
      absolute = command === upper || (initial && upper === "M");
    const point = (n, axis) =>
      absolute ? 12 + (n - 12) * scale + (axis === "x" ? dx : dy) : n * scale;
    const result = values.map((n, index) => {
      if (upper === "A") {
        if (index < 2) return n * scale;
        if (index < 5) return n;
        return point(n, index === 5 ? "x" : "y");
      }
      return point(
        n,
        upper === "H" ? "x" : upper === "V" ? "y" : index % 2 ? "y" : "x",
      );
    });
    output.push(
      upper === "M" && group > 0 ? (command === "M" ? "L" : "l") : command,
      ...result.map((n) => String(Number(n.toFixed(3)))),
    );
    initial = false;
    group++;
  }
  return output.join(" ");
}

export function motionFamily(name) {
  if (name === "headset") return "headset";
  if (
    /^(upload|download|cloud-upload|cloud-download|arrow|chevron|move|navigation)/.test(
      name,
    )
  )
    return "direction";
  if (/^(heart|badge-check|circle-check|check)/.test(name)) return "affirm";
  if (/^(bell|alarm|clock)/.test(name)) return "notification";
  if (/^(user|users|person|contact|smile|laugh|frown|meh)/.test(name))
    return "people";
  if (/^(search|scan|focus|target|crosshair)/.test(name)) return "focus";
  if (
    /^(chart|bar-chart|line-chart|activity|audio|music|wave|signal|wifi|volume|radio)/.test(
      name,
    )
  )
    return "signal";
  if (/^(folder|file|book|notebook|clipboard|copy|files)/.test(name))
    return "document";
  if (/^(settings|sliders|toggle|switch|list-filter|filter)/.test(name))
    return "adjust";
  if (/^(sun|moon|star|sparkle|cloud|rain|snow|wind|flame)/.test(name))
    return "ambient";
  if (/^(trash|archive|package|box|door|lock|unlock)/.test(name))
    return "mechanism";
  return "detail";
}

// A family chooses a relevant subpart; structural frames remain readable and still.
export function shapeMotion(name, tag, attributes, index, nodes) {
  const family = motionFamily(name);
  const frames = (values) => ({ values: values.join(";") });
  const path = (dx, dy, scale = 1) => ({
    attributeName: "d",
    ...frames([
      morphPath(attributes.d),
      morphPath(attributes.d, { dx, dy, scale }),
      morphPath(attributes.d),
    ]),
  });
  if (family === "direction" && tag === "path") {
    const outline = /[aA]/.test(attributes.d) && nodes.length > 1;
    if (!outline) {
      const down = /down|download/.test(name),
        up = /up|upload/.test(name),
        left = /left/.test(name),
        right = /right/.test(name);
      const dualY = down && up,
        dualX = left && right;
      const dy = dualY ? (index % 2 ? 1.2 : -1.2) : down ? 1.6 : up ? -1.6 : 0;
      const dx = dualX
        ? index % 2
          ? 1.2
          : -1.2
        : left
          ? -1.5
          : right || !dy
            ? 1.5
            : 0;
      return path(dx, dy);
    }
  }
  if (family === "people" && tag === "circle")
    return {
      attributeName: "cy",
      ...frames([attributes.cy, Number(attributes.cy) - 0.65, attributes.cy]),
    };
  if (family === "focus" && tag === "circle")
    return {
      attributeName: "r",
      ...frames([
        attributes.r,
        Math.max(0.5, Number(attributes.r) - 0.7),
        attributes.r,
      ]),
    };
  if (family === "affirm" && tag === "path")
    return path(0, 0, name.startsWith("heart") ? 1.045 : 1.025);
  if (family === "adjust" && tag === "circle")
    return {
      attributeName: "cx",
      ...frames([
        attributes.cx,
        Number(attributes.cx) + (index % 2 ? -1.2 : 1.2),
        attributes.cx,
      ]),
    };
  if (
    family === "notification" &&
    tag === "path" &&
    index === 0 &&
    nodes.length > 1
  )
    return path(0.9, 0);
  if (family === "notification" && tag === "line")
    return {
      attributeName: "x2",
      ...frames([attributes.x2, Number(attributes.x2) + 0.7, attributes.x2]),
    };
  if (family === "signal" && tag === "rect")
    return {
      attributeName: "height",
      ...frames([
        attributes.height,
        Math.max(1, Number(attributes.height) - 1.5),
        attributes.height,
      ]),
    };
  if (family === "document" && tag === "path" && index > 0)
    return path(0, -0.8);
  if (
    family === "mechanism" &&
    tag === "path" &&
    index === nodes.length - 1 &&
    nodes.length > 1
  )
    return path(0, -1);
  if (family === "ambient" && tag === "circle")
    return {
      attributeName: "r",
      ...frames([attributes.r, Number(attributes.r) + 0.3, attributes.r]),
    };
  return { attributeName: "stroke-opacity", ...frames([1, 0.84, 1]) };
}
