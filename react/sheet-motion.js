// Distance handles deliberate pulls; velocity handles short, intentional flicks.
export function shouldDismissSheet(distance, velocity, height) {
  return (
    distance >= Math.min(120, height * 0.28) ||
    (distance >= 24 && velocity >= 0.6)
  );
}
