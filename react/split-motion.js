// Visual resistance never changes the controlled min/max contract.
export function elasticSplit(value, min, max) {
  const bound = Math.max(min, Math.min(max, value));
  const distance = value - bound;
  const resistance = 6 * (1 - 1 / (1 + (Math.abs(distance) * 0.55) / 6));
  return Math.max(0, Math.min(100, bound + Math.sign(distance) * resistance));
}

// Read the divider's rendered position, not an in-flight controlled target.
export function renderedSplit(rootRect, dividerRect) {
  const width = Math.max(1, rootRect.width - dividerRect.width);
  return { value: ((dividerRect.left - rootRect.left) / width) * 100, width };
}
