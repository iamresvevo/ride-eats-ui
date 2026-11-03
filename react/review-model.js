const modifierOrder = ["Control", "Alt", "Shift", "Meta"];
export function normalizeShortcut(keys = []) {
  const aliases = {
    Ctrl: "Control",
    Cmd: "Meta",
    Command: "Meta",
    Option: "Alt",
    " ": "Space",
    Esc: "Escape",
  };
  const normalized = [
    ...new Set(
      keys.map(
        (key) => aliases[key] || (key.length === 1 ? key.toUpperCase() : key),
      ),
    ),
  ];
  return [
    ...modifierOrder.filter((key) => normalized.includes(key)),
    ...normalized.filter((key) => !modifierOrder.includes(key)),
  ];
}
export function shortcutFromEvent(event) {
  return normalizeShortcut(
    [
      ...(event.ctrlKey ? ["Control"] : []),
      ...(event.altKey ? ["Alt"] : []),
      ...(event.shiftKey ? ["Shift"] : []),
      ...(event.metaKey ? ["Meta"] : []),
      event.key,
    ].filter((key) => !["Dead", "Unidentified"].includes(key)),
  );
}
export function shortcutIssue(keys, bindings = []) {
  const normalized = normalizeShortcut(keys),
    key = normalized.join("+");
  const hasCommand =
    normalized.includes("Control") || normalized.includes("Meta");
  const last = normalized.at(-1);
  if (hasCommand && ["L", "R", "W", "T", "N", "Q", "Tab"].includes(last))
    return {
      kind: "reserved",
      message:
        "This combination is commonly reserved by the browser or operating system.",
    };
  if (normalized.includes("Alt") && ["F4", "Tab"].includes(last))
    return {
      kind: "reserved",
      message: "This combination is commonly reserved by the operating system.",
    };
  const match = bindings.find(
    (binding) => normalizeShortcut(binding.keys).join("+") === key,
  );
  return match
    ? { kind: "conflict", message: `Already assigned to ${match.label}.` }
    : null;
}
const lines = (text) =>
  text === "" ? [] : text.replace(/\r\n?/g, "\n").split("\n");
/** Bounded LCS after trimming shared ends. Large replacements retain every line in coarse form. */
export function lineDiff(before, after, { cellBudget = 1000000 } = {}) {
  const old = lines(before),
    next = lines(after),
    rows = [];
  let prefix = 0,
    suffix = 0;
  while (
    prefix < Math.min(old.length, next.length) &&
    old[prefix] === next[prefix]
  )
    prefix++;
  while (
    suffix < Math.min(old.length - prefix, next.length - prefix) &&
    old[old.length - 1 - suffix] === next[next.length - 1 - suffix]
  )
    suffix++;
  const a = old.slice(prefix, old.length - suffix),
    b = next.slice(prefix, next.length - suffix);
  let oldLine = 1,
    newLine = 1;
  const equal = (text) =>
    rows.push({ type: "equal", text, oldLine: oldLine++, newLine: newLine++ });
  const remove = (text) =>
    rows.push({ type: "remove", text, oldLine: oldLine++ });
  const add = (text) => rows.push({ type: "add", text, newLine: newLine++ });
  for (let i = 0; i < prefix; i++) equal(old[i]);
  const coarse = (a.length + 1) * (b.length + 1) > cellBudget;
  if (coarse) {
    a.forEach(remove);
    b.forEach(add);
  } else {
    const width = b.length + 1,
      table = new Uint32Array((a.length + 1) * width);
    for (let i = a.length - 1; i >= 0; i--)
      for (let j = b.length - 1; j >= 0; j--)
        table[i * width + j] =
          a[i] === b[j]
            ? 1 + table[(i + 1) * width + j + 1]
            : Math.max(table[(i + 1) * width + j], table[i * width + j + 1]);
    let i = 0,
      j = 0;
    while (i < a.length || j < b.length) {
      if (i < a.length && j < b.length && a[i] === b[j]) {
        equal(a[i]);
        i++;
        j++;
      } else if (
        i < a.length &&
        (j >= b.length ||
          table[(i + 1) * width + j] >= table[i * width + j + 1])
      )
        remove(a[i++]);
      else add(b[j++]);
    }
  }
  for (let i = suffix; i > 0; i--) equal(old[old.length - i]);
  return {
    rows,
    coarse,
    added: rows.filter((x) => x.type === "add").length,
    removed: rows.filter((x) => x.type === "remove").length,
  };
}
export function foldDiff(rows, context = 3, expanded = []) {
  const output = [],
    keep = Math.max(0, Math.floor(context));
  let i = 0;
  while (i < rows.length) {
    if (rows[i].type !== "equal") {
      output.push(rows[i++]);
      continue;
    }
    let end = i;
    while (end < rows.length && rows[end].type === "equal") end++;
    const head = i === 0 ? 0 : keep,
      tail = end === rows.length ? 0 : keep,
      startHidden = i + head,
      endHidden = end - tail,
      id = `equal-${i}-${end}`;
    if (endHidden - startHidden > 1 && !expanded.includes(id)) {
      output.push(
        ...rows.slice(i, startHidden),
        { type: "fold", id, count: endHidden - startHidden },
        ...rows.slice(endHidden, end),
      );
    } else output.push(...rows.slice(i, end));
    i = end;
  }
  return output;
}
export function splitDiff(rows) {
  const pairs = [];
  let i = 0;
  while (i < rows.length) {
    const row = rows[i];
    if (row.type === "fold") {
      pairs.push({ fold: row });
      i++;
    } else if (row.type === "equal") {
      pairs.push({ left: row, right: row });
      i++;
    } else {
      const removed = [],
        added = [];
      while (i < rows.length && !["equal", "fold"].includes(rows[i].type)) {
        const current = rows[i++];
        (current.type === "remove" ? removed : added).push(current);
      }
      for (let j = 0; j < Math.max(removed.length, added.length); j++)
        pairs.push({ left: removed[j] || null, right: added[j] || null });
    }
  }
  return pairs;
}
