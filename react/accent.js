// Prefer the higher-contrast black/white foreground for a solid hex accent.
export function accentText(color) {
  const match = /^#([\da-f]{3}|[\da-f]{6})$/i.exec(color || "");
  if (!match) return undefined;
  const hex =
    match[1].length === 3 ? [...match[1]].map((c) => c + c).join("") : match[1];
  const channels = [0, 2, 4]
    .map((i) => parseInt(hex.slice(i, i + 2), 16) / 255)
    .map((c) => (c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4));
  const luminance =
    channels[0] * 0.2126 + channels[1] * 0.7152 + channels[2] * 0.0722;
  return 1.05 / (luminance + 0.05) >= (luminance + 0.05) / 0.05
    ? "#ffffff"
    : "#000000";
}
