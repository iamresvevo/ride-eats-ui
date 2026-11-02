export function flattenCommands(items, trail = [], path = []) {
  return items.flatMap((item) =>
    item.disabled
      ? []
      : [
          { ...item, trail, path },
          ...(item.items
            ? flattenCommands(
                item.items,
                [...trail, item.label],
                [...path, item.value],
              )
            : []),
        ],
  );
}
export function searchCommands(items, query = "") {
  const terms = query.toLocaleLowerCase().trim().split(/\s+/).filter(Boolean);
  if (!terms.length)
    return items
      .filter((item) => !item.disabled)
      .map((item) => ({ ...item, trail: [] }));
  return flattenCommands(items)
    .map((item, index) => {
      const label = item.label.toLocaleLowerCase(),
        text = [item.label, item.description, item.keywords, ...item.trail]
          .filter(Boolean)
          .join(" ")
          .toLocaleLowerCase();
      const matches = terms.every((term) => text.includes(term));
      const score = matches
        ? terms.reduce(
            (score, term) =>
              score +
              (label === term
                ? 100
                : label.startsWith(term)
                  ? 60
                  : label.includes(term)
                    ? 30
                    : 10),
            0,
          )
        : -1;
      return { item, index, score };
    })
    .filter((result) => result.score >= 0)
    .sort((a, b) => b.score - a.score || a.index - b.index)
    .map((result) => result.item);
}
export function matchesCommandShortcut(event, shortcut) {
  if (!shortcut) return false;
  const parts = shortcut
      .toLowerCase()
      .split("+")
      .map((part) => part.trim()),
    key = parts.at(-1);
  if (parts.length < 2) return false; // Never consume plain characters from the search field.
  const mod = parts.includes("mod"),
    ctrl = parts.includes("ctrl"),
    meta = parts.includes("cmd") || parts.includes("meta"),
    alt = parts.includes("alt"),
    shift = parts.includes("shift");
  return (
    event.key.toLowerCase() === key &&
    (mod
      ? event.metaKey || event.ctrlKey
      : !!event.ctrlKey === ctrl && !!event.metaKey === meta) &&
    !!event.altKey === alt &&
    !!event.shiftKey === shift
  );
}
