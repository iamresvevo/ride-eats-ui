const clamp = (n, max = 1) => Math.max(0, Math.min(max, n));
export function parseColor(value) {
  if (typeof value !== "string") return null;
  const hex = value.trim().match(/^#([\da-f]{3,4}|[\da-f]{6}|[\da-f]{8})$/i);
  if (hex) {
    let h = hex[1];
    if (h.length < 5) h = [...h].map((c) => c + c).join("");
    return {
      r: parseInt(h.slice(0, 2), 16),
      g: parseInt(h.slice(2, 4), 16),
      b: parseInt(h.slice(4, 6), 16),
      a: h.length === 8 ? parseInt(h.slice(6, 8), 16) / 255 : 1,
    };
  }
  const rgb = value
    .trim()
    .match(
      /^rgba?\(\s*([\d.]+)\s*,\s*([\d.]+)\s*,\s*([\d.]+)(?:\s*,\s*([\d.]+))?\s*\)$/i,
    );
  if (rgb) {
    const [, r, g, b, a = "1"] = rgb.map((x, i) =>
      i ? Number(x ?? (i === 4 ? 1 : x)) : x,
    );
    if (
      [r, g, b].some((n) => !Number.isFinite(n) || n > 255) ||
      !Number.isFinite(a) ||
      a > 1
    )
      return null;
    return { r: Math.round(r), g: Math.round(g), b: Math.round(b), a };
  }
  const hsl = value
    .trim()
    .match(
      /^hsla?\(\s*([\d.+-]+)\s*,\s*([\d.]+)%\s*,\s*([\d.]+)%(?:\s*,\s*([\d.]+))?\s*\)$/i,
    );
  if (!hsl) return null;
  const h = Number(hsl[1]),
    s = Number(hsl[2]) / 100,
    l = Number(hsl[3]) / 100,
    a = Number(hsl[4] ?? 1);
  if (![h, s, l, a].every(Number.isFinite) || s > 1 || l > 1 || a > 1)
    return null;
  const v = l + s * Math.min(l, 1 - l);
  return { ...hsvToRgb(h, v ? 2 * (1 - l / v) : 0, v), a };
}
export function hsvToRgb(h, s, v) {
  h = ((h % 360) + 360) % 360;
  s = clamp(s);
  v = clamp(v);
  const c = v * s,
    x = c * (1 - Math.abs(((h / 60) % 2) - 1)),
    m = v - c;
  const channels =
    h < 60
      ? [c, x, 0]
      : h < 120
        ? [x, c, 0]
        : h < 180
          ? [0, c, x]
          : h < 240
            ? [0, x, c]
            : h < 300
              ? [x, 0, c]
              : [c, 0, x];
  return Object.fromEntries(
    channels.map((n, i) => [["r", "g", "b"][i], Math.round((n + m) * 255)]),
  );
}
export function rgbToHsv({ r, g, b }) {
  r /= 255;
  g /= 255;
  b /= 255;
  const v = Math.max(r, g, b),
    min = Math.min(r, g, b),
    d = v - min;
  let h = !d
    ? 0
    : v === r
      ? 60 * (((g - b) / d) % 6)
      : v === g
        ? 60 * ((b - r) / d + 2)
        : 60 * ((r - g) / d + 4);
  return { h: (h + 360) % 360, s: v ? d / v : 0, v };
}
export function colorHex({ r, g, b, a = 1 }, alpha = false) {
  return (
    "#" +
    [r, g, b, ...(alpha ? [clamp(a) * 255] : [])]
      .map((n) => Math.round(n).toString(16).padStart(2, "0"))
      .join("")
  );
}
export function formatColor(color, format = "hex", alpha = false) {
  const { r, g, b, a = 1 } = color,
    opacity = Number(a.toFixed(3));
  if (format === "rgb")
    return alpha
      ? `rgba(${r}, ${g}, ${b}, ${opacity})`
      : `rgb(${r}, ${g}, ${b})`;
  if (format === "hsl") {
    const { h, s, v } = rgbToHsv(color),
      l = v * (1 - s / 2),
      saturation = l === 0 || l === 1 ? 0 : (v - l) / Math.min(l, 1 - l);
    const values = `${Math.round(h)}, ${Math.round(saturation * 100)}%, ${Math.round(l * 100)}%`;
    return alpha ? `hsla(${values}, ${opacity})` : `hsl(${values})`;
  }
  return colorHex(color, alpha);
}
