// Send translation boundary: preserve React nodes; apps own their translated labels.
export const t = (value, replacements = {}) =>
  typeof value === "string"
    ? value.replace(/\{(\w+)\}/g, (match, key) => replacements[key] ?? match)
    : value;
export const getLanguage = () =>
  typeof document === "undefined"
    ? "en"
    : document.documentElement.lang || "en";
