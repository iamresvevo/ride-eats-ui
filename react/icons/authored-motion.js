// Explicit geometry keyframes. Indexes refer to the vendored glyph's SVG nodes.
// Structural parts not listed here remain completely still.
export const authoredMotion = {
  check: {
    intent: "Tick flexes at its joint to acknowledge completion",
    parts: { 0: { attributeName: "d", peak: "M20 5 9 18l-5-6" } },
  },
  x: {
    intent: "Cross arms contract toward their shared dismiss point",
    parts: {
      0: { attributeName: "d", peak: "M16.5 7.5 7.5 16.5" },
      1: { attributeName: "d", peak: "m7.5 7.5 9 9" },
    },
  },
  plus: {
    intent: "Add sign opens its arms around a fixed center",
    parts: {
      0: { attributeName: "d", peak: "M4 12h16" },
      1: { attributeName: "d", peak: "M12 4v16" },
    },
  },
  copy: {
    intent: "Front sheet separates from its stationary original",
    parts: { 0: { attributeName: "x", peak: "9" } },
  },
  users: {
    intent: "Foreground teammate nods while the group stays grounded",
    parts: { 3: { attributeName: "cy", peak: "7.8" } },
  },
  user: {
    intent: "Profile acknowledges focus with a small head tilt",
    parts: { 1: { attributeName: "cx", peak: "12.8" } },
  },
  "chevron-down": {
    intent: "Chevron tip opens downward around fixed endpoints",
    parts: { 0: { attributeName: "d", peak: "m6 9 6 7.5 6-7.5" } },
  },
  "chevron-left": {
    intent: "Back tip reaches left around fixed endpoints",
    parts: { 0: { attributeName: "d", peak: "m15 18-7.5-6 7.5-6" } },
  },
  "chevron-right": {
    intent: "Forward tip reaches right around fixed endpoints",
    parts: { 0: { attributeName: "d", peak: "m9 18 7.5-6-7.5-6" } },
  },
  "arrow-right": {
    intent: "Arrow extends forward while its tail stays anchored",
    parts: {
      0: { attributeName: "d", peak: "M5 12h16" },
      1: { attributeName: "d", peak: "m14 5 7 7-7 7" },
    },
  },
  bell: {
    intent: "Clapper swings inside a stationary bell silhouette",
    parts: { 0: { attributeName: "d", peak: "M11.068 21a2 2 0 0 0 3.464 0" } },
  },
  database: {
    intent: "Internal data tier rises within the stationary storage cylinder",
    parts: { 2: { attributeName: "d", peak: "M3 10.5A9 3 0 0 0 21 10.5" } },
  },
  camera: {
    intent: "Lens aperture contracts for a photograph",
    parts: { 1: { attributeName: "r", peak: "1.4" } },
  },
  clock: {
    intent: "Minute hand advances while the dial stays still",
    parts: { 1: { attributeName: "d", peak: "M12 5v7l5 1" } },
  },
  coffee: {
    intent: "Three steam strands curl independently above the cup",
    parts: {
      0: { attributeName: "d", peak: "M10.6 1v3" },
      1: { attributeName: "d", peak: "M13.5 1.5v2.5" },
      3: { attributeName: "d", peak: "M5.5 1.2v2.8" },
    },
  },
  "toggle-left": {
    intent: "Thumb nudges toward the opposite position without changing state",
    parts: { 0: { attributeName: "cx", peak: "11" } },
  },
  "toggle-right": {
    intent: "Thumb gives a restrained return nudge within the active track",
    parts: { 0: { attributeName: "cx", peak: "13" } },
  },
  "volume-2": {
    intent: "Sound fronts expand from a stationary speaker",
    parts: {
      1: { attributeName: "d", peak: "M16.6 8.4a6 6 0 0 1 0 7.2" },
      2: { attributeName: "d", peak: "M20 19a10 10 0 0 0 0-14" },
    },
  },
  wifi: {
    intent: "Signal arcs spread outward from the stationary source",
    parts: {
      1: { attributeName: "d", peak: "M1 8a16 16 0 0 1 22 0" },
      2: { attributeName: "d", peak: "M4.4 12.3a11 11 0 0 1 15.2 0" },
      3: { attributeName: "d", peak: "M8.1 16a5.6 5.6 0 0 1 7.8 0" },
    },
  },
  calendar: {
    intent: "Binding rings lift together while the date surface stays fixed",
    parts: {
      0: { attributeName: "d", peak: "M8 1v4" },
      1: { attributeName: "d", peak: "M16 1v4" },
    },
  },
  upload: {
    intent: "Arrow rises out of a stationary receiving tray",
    parts: {
      0: { attributeName: "d", peak: "M12 1v12" },
      1: { attributeName: "d", peak: "m17 6-5-5-5 5" },
    },
  },
  download: {
    intent: "Arrow settles into a stationary receiving tray",
    parts: {
      0: { attributeName: "d", peak: "M12 17V5" },
      2: { attributeName: "d", peak: "m7 12 5 5 5-5" },
    },
  },
  mail: {
    intent: "Envelope flap lifts while its body stays still",
    parts: {
      0: {
        attributeName: "d",
        peak: "m22 7-8.991 -2.273a2 2 0 0 1-2.009 0L2 7",
      },
    },
  },
  lock: {
    intent: "Shackle gives a restrained locked resistance pull",
    parts: {
      1: { attributeName: "d", peak: "M7 11V6a5 5 0 0 1 10 0v5" },
    },
  },
  eye: {
    intent: "Pupil glances sideways inside a stationary eye",
    parts: {
      1: { attributeName: "cx", peak: "13.5" },
    },
  },
  search: {
    intent: "Lens focuses subtly while its handle stays anchored",
    parts: {
      1: { attributeName: "r", peak: "7.4" },
    },
  },
  trash: {
    intent: "Lid and handle lift together above the stationary bin",
    parts: {
      3: { attributeName: "d", peak: "M3 4.5h18" },
      4: {
        attributeName: "d",
        peak: "M8 4.5V2.5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2",
      },
    },
  },
};
