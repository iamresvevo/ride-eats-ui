// Explicit per-icon geometry and intent.
export const coreMotion = {
  files: {
    intent: "Fold opens on the front document",
    nodes: [
      [
        "path",
        {
          d: "M8 3h8l4 4v14H8V3M16 3v5h4M4 7v14",
        },
      ],
    ],
    parts: {
      0: {
        attributeName: "d",
        peak: "M8 3h8l4 4v14H8V3M16 3v6h4M4 7v14",
      },
    },
  },
  link: {
    intent: "Linked ends pull together under tension",
    nodes: [
      [
        "path",
        {
          d: "M10 13a5 5 0 0 0 7 0l3-3a5 5 0 0 0-7-7l-2 2M14 11a5 5 0 0 0-7 0l-3 3a5 5 0 0 0 7 7l2-2",
        },
      ],
    ],
    parts: {
      0: {
        attributeName: "d",
        peak: "M10.6 12.4a5 5 0 0 0 7 0l3-3a5 5 0 0 0-7-7l-2 2M14 11a5 5 0 0 0-7 0l-3 3a5 5 0 0 0 7 7l2-2",
      },
    },
  },
  pause: {
    intent: "Pause bars close toward their fixed center",
    nodes: [
      [
        "path",
        {
          d: "M8 5v14M16 5v14",
        },
      ],
    ],
    parts: {
      0: {
        attributeName: "d",
        peak: "M9 5v14M15 5v14",
      },
    },
  },
  play: {
    intent: "Play tip extends while its base stays anchored",
    nodes: [
      [
        "path",
        {
          d: "m8 4 12 8-12 8V4",
        },
      ],
    ],
    parts: {
      0: {
        attributeName: "d",
        peak: "m8 4 13.5 8-13.5 8V4",
      },
    },
  },
  tag: {
    intent: "Tag attachment hole shifts under a small pull",
    nodes: [
      [
        "path",
        {
          d: "M3 12V4h8l10 10-8 8L3 12Zm4.5-4.5h.01",
        },
      ],
    ],
    parts: {
      0: {
        attributeName: "d",
        peak: "M3 12V4h8l10 10-8 8L3 12Zm5-4.5h.01",
      },
    },
  },
  restore: {
    intent: "Return arrow curls toward the restored position",
    nodes: [
      [
        "path",
        {
          d: "M4 12a8 8 0 1 0 2.5-5.8M4 4v5h5",
        },
      ],
    ],
    parts: {
      0: {
        attributeName: "d",
        peak: "M4 12a8 8 0 1 0 2.5-5.8M3 4v6h6",
      },
    },
  },
  login: {
    intent: "Entry arrow extends into the doorway",
    nodes: [
      [
        "path",
        {
          d: "M14 4h6v16h-6M3 12h12m-4-4 4 4-4 4",
        },
      ],
    ],
    parts: {
      0: {
        attributeName: "d",
        peak: "M14 4h6v16h-6M3 12h14m-4-4 4 4-4 4",
      },
    },
  },
  logout: {
    intent: "Exit arrow extends away from the doorway",
    nodes: [
      [
        "path",
        {
          d: "M10 4H5v16h5M9 12h12m-4-4 4 4-4 4",
        },
      ],
    ],
    parts: {
      0: {
        attributeName: "d",
        peak: "M10 4H5v16h5M9 12h14m-4-4 4 4-4 4",
      },
    },
  },
  edit: {
    intent: "Pencil nib presses toward its writing surface",
    nodes: [
      [
        "path",
        {
          d: "M4 20h4L20 8l-4-4L4 16v4M14 6l4 4",
        },
      ],
    ],
    parts: {
      0: {
        attributeName: "d",
        peak: "M4 20h4L20 8l-4-4L3 17v4M14 6l4 4",
      },
    },
  },
  message: {
    intent: "Reply tail reaches toward the conversation",
    nodes: [
      [
        "path",
        {
          d: "M4 5h16v11H9l-5 4V5",
        },
      ],
    ],
    parts: {
      0: {
        attributeName: "d",
        peak: "M4 5h16v11H9l-5 5V5",
      },
    },
  },
  storage: {
    intent: "Middle storage tier advances inside the cylinder",
    nodes: [
      [
        "path",
        {
          d: "M4 6c0-1.7 3.6-3 8-3s8 1.3 8 3v12c0 1.7-3.6 3-8 3s-8-1.3-8-3V6M4 6c0 1.7 3.6 3 8 3s8-1.3 8-3M4 12c0 1.7 3.6 3 8 3s8-1.3 8-3",
        },
      ],
    ],
    parts: {
      0: {
        attributeName: "d",
        peak: "M4 6c0-1.7 3.6-3 8-3s8 1.3 8 3v12c0 1.7-3.6 3-8 3s-8-1.3-8-3V6M4 6c0 1.7 3.6 3 8 3s8-1.3 8-3M4 10.8c0 1.7 3.6 3 8 3s8-1.3 8-3",
      },
    },
  },
  send: {
    intent: "Paper plane nose extends along its flight direction",
    nodes: [
      [
        "path",
        {
          d: "M21 3 3 10l7 3 3 7 8-17M10 13 21 3",
        },
      ],
    ],
    parts: {
      0: {
        attributeName: "d",
        peak: "M22 2 3 10l7 3 3 7 8-17M10 13 21 3",
      },
    },
  },
  activity: {
    intent: "Heartbeat peak rises while the baseline stays fixed",
    nodes: [
      [
        "path",
        {
          d: "M3 12h4l3-8 4 16 3-8h4",
        },
      ],
    ],
    parts: {
      0: {
        attributeName: "d",
        peak: "M3 12h4l3-10 4 18 3-8h4",
      },
    },
  },
  warning: {
    intent: "Exclamation stem lengthens to signal attention",
    nodes: [
      [
        "path",
        {
          d: "M12 4 2 20h20L12 4M12 10v5M12 18h.01",
        },
      ],
    ],
    parts: {
      0: {
        attributeName: "d",
        peak: "M12 4 2 20h20L12 4M12 9v6M12 18h.01",
      },
    },
  },
  qr: {
    intent: "Inner scan marker expands within the code",
    nodes: [
      [
        "path",
        {
          d: "M4 4h6v6H4V4M14 4h6v6h-6V4M4 14h6v6H4v-6M14 14h3v3h-3v-3M20 14v.01M17 20h3v-3M14 20v.01",
        },
      ],
    ],
    parts: {
      0: {
        attributeName: "d",
        peak: "M4 4h6v6H4V4M14 4h6v6h-6V4M4 14h6v6H4v-6M13.5 13.5h4v4h-4v-4M20 14v.01M17 20h3v-3M14 20v.01",
      },
    },
  },
  expand: {
    intent: "Corner brackets reach outward",
    nodes: [
      [
        "path",
        {
          d: "M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5",
        },
      ],
    ],
    parts: {
      0: {
        attributeName: "d",
        peak: "M3 9V3h6M20 9V4h-5M4 15v5h5M20 15v5h-5",
      },
    },
  },
  settings: {
    intent: "Top adjustment slider moves along its rail",
    nodes: [
      [
        "path",
        {
          d: "M4 6h10M18 6h2M4 12h4M12 12h8M4 18h12M20 18h.01M14 4v4M8 10v4M16 16v4",
        },
      ],
    ],
    parts: {
      0: {
        attributeName: "d",
        peak: "M4 6h10M18 6h2M4 12h4M12 12h8M4 18h12M20 18h.01M16 4v4M8 10v4M16 16v4",
      },
    },
  },
  more: {
    intent: "Center menu dot rises to invite expansion",
    nodes: [
      [
        "path",
        {
          d: "M5 11a1 1 0 1 0 0 2 1 1 0 0 0 0-2M12 11a1 1 0 1 0 0 2 1 1 0 0 0 0-2M19 11a1 1 0 1 0 0 2 1 1 0 0 0 0-2",
        },
      ],
    ],
    parts: {
      0: {
        attributeName: "d",
        peak: "M5 11a1 1 0 1 0 0 2 1 1 0 0 0 0-2M12 10a1 1 0 1 0 0 2 1 1 0 0 0 0-2M19 11a1 1 0 1 0 0 2 1 1 0 0 0 0-2",
      },
    },
  },
  sun: {
    intent: "Top and bottom rays extend from the sun",
    nodes: [
      [
        "path",
        {
          d: "M12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8M12 2v2M12 20v2M4 12H2M22 12h-2M5 5l1.5 1.5M17.5 17.5 19 19M5 19l1.5-1.5M17.5 6.5 19 5",
        },
      ],
    ],
    parts: {
      0: {
        attributeName: "d",
        peak: "M12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8M12 1v3M12 20v3M4 12H2M22 12h-2M5 5l1.5 1.5M17.5 17.5 19 19M5 19l1.5-1.5M17.5 6.5 19 5",
      },
    },
  },
  monitor: {
    intent: "Monitor stand settles beneath the stationary screen",
    nodes: [
      [
        "path",
        {
          d: "M3 5h18v11H3V5M8 20h8M12 16v4",
        },
      ],
    ],
    parts: {
      0: {
        attributeName: "d",
        peak: "M3 5h18v11H3V5M7 21h10M12 16v5",
      },
    },
  },
  sort: {
    intent: "Downward sorting arrow extends to the next row",
    nodes: [
      [
        "path",
        {
          d: "M7 4v16m-3-3 3 3 3-3M17 20V4m-3 3 3-3 3 3",
        },
      ],
    ],
    parts: {
      0: {
        attributeName: "d",
        peak: "M7 4v17m-3-3 3 3 3-3M17 20V4m-3 3 3-3 3 3",
      },
    },
  },
  chart: {
    intent: "Middle data bar rises from its fixed baseline",
    nodes: [
      [
        "path",
        {
          d: "M4 20V10M10 20V4M16 20v-7M22 20H2",
        },
      ],
    ],
    parts: {
      0: {
        attributeName: "d",
        peak: "M4 20V10M10 20V2M16 20v-7M22 20H2",
      },
    },
  },
  select: {
    intent: "Opposing tips open around the selection",
    nodes: [
      [
        "path",
        {
          d: "m8 9 4-4 4 4M8 15l4 4 4-4",
        },
      ],
    ],
    parts: {
      0: {
        attributeName: "d",
        peak: "m8 9 4-5 4 5M8 15l4 5 4-5",
      },
    },
  },
  back: {
    intent: "Back arrow reaches left from a fixed tail",
    nodes: [
      [
        "path",
        {
          d: "M19 12H5m6-6-6 6 6 6",
        },
      ],
    ],
    parts: {
      0: {
        attributeName: "d",
        peak: "M19 12H3m6-6-6 6 6 6",
      },
    },
  },
  external: {
    intent: "Outgoing corner opens toward the destination",
    nodes: [
      [
        "path",
        {
          d: "M14 4h6v6M20 4l-9 9M18 14v6H4V6h6",
        },
      ],
    ],
    parts: {
      0: {
        attributeName: "d",
        peak: "M14 3h7v7M21 3l-10 10M18 14v6H4V6h6",
      },
    },
  },
  globe: {
    intent: "Longitude bows as the globe turns",
    nodes: [
      [
        "path",
        {
          d: "M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18M3 12h18M12 3c3 3 3 15 0 18M12 3c-3 3-3 15 0 18",
        },
      ],
    ],
    parts: {
      0: {
        attributeName: "d",
        peak: "M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18M3 12h18M12 3c5 3 5 15 0 18M12 3c-3 3-3 15 0 18",
      },
    },
  },
  team: {
    intent: "Workspace windows widen in welcome",
    nodes: [
      [
        "path",
        {
          d: "M4 21V5h10v16M14 9h6v12M2 21h20M8 9h2M8 13h2M8 17h2",
        },
      ],
    ],
    parts: {
      0: {
        attributeName: "d",
        peak: "M4 21V5h10v16M14 9h6v12M2 21h20M7.5 9h3M7.5 13h3M7.5 17h3",
      },
    },
  },
  music: {
    intent: "Second note lifts along its stem",
    nodes: [
      [
        "path",
        {
          d: "M9 18V5l11-2v13M9 18a3 3 0 1 1-6 0 3 3 0 0 1 6 0M20 16a3 3 0 1 1-6 0 3 3 0 0 1 6 0",
        },
      ],
    ],
    parts: {
      0: {
        attributeName: "d",
        peak: "M9 18V5l11-2v13M9 18a3 3 0 1 1-6 0 3 3 0 0 1 6 0M20 15a3 3 0 1 1-6 0 3 3 0 0 1 6 0",
      },
    },
  },
  archive: {
    intent: "Archive drawer handle rises inside its case",
    nodes: [
      [
        "path",
        {
          d: "M4 4h16v5H4V4M6 9v11h12V9M10 13h4",
        },
      ],
    ],
    parts: {
      0: {
        attributeName: "d",
        peak: "M4 4h16v5H4V4M6 9v11h12V9M10 11.5h4",
      },
    },
  },
  bolt: {
    intent: "Lightning knee bends along its discharge",
    nodes: [
      [
        "path",
        {
          d: "M13 3 5 14h6l-1 7 8-11h-6l1-7",
        },
      ],
    ],
    parts: {
      0: {
        attributeName: "d",
        peak: "M13 3 4 14h7l-1 7 8-11h-6l1-7",
      },
    },
  },
  phone: {
    intent: "Home indicator slides within the phone frame",
    nodes: [
      [
        "path",
        {
          d: "M7 2h10v20H7V2M11 18h2",
        },
      ],
    ],
    parts: {
      0: {
        attributeName: "d",
        peak: "M7 2h10v20H7V2M10 18h4",
      },
    },
  },
  shield: {
    intent: "Verification tick flexes inside its shield",
    nodes: [
      [
        "path",
        {
          d: "M12 3 4 6v6c0 5 3.5 8 8 9 4.5-1 8-4 8-9V6l-8-3M9 12l2 2 4-4",
        },
      ],
    ],
    parts: {
      0: {
        attributeName: "d",
        peak: "M12 3 4 6v6c0 5 3.5 8 8 9 4.5-1 8-4 8-9V6l-8-3M9 12l2 3 4-5",
      },
    },
  },
  filter: {
    intent: "Filter neck draws the flow downward",
    nodes: [
      [
        "path",
        {
          d: "M3 5h18l-7 8v6l-4-2v-4L3 5Z",
        },
      ],
    ],
    parts: {
      0: {
        attributeName: "d",
        peak: "M3 5h18l-7 8v7l-4-2v-4L3 5Z",
      },
    },
  },
  infinity: {
    intent: "Right infinity loop opens as flow passes through",
    nodes: [
      [
        "path",
        {
          d: "M12 12c-2-2.7-3.7-4-5.5-4a4 4 0 0 0 0 8c1.8 0 3.5-1.3 5.5-4Zm0 0c2 2.7 3.7 4 5.5 4a4 4 0 0 0 0-8c-1.8 0-3.5 1.3-5.5 4Z",
        },
      ],
    ],
    parts: {
      0: {
        attributeName: "d",
        peak: "M12 12c-2-2.7-3.7-4-5.5-4a4 4 0 0 0 0 8c1.8 0 3.5-1.3 5.5-4Zm0 0c2 3.4 3.7 4.7 5.5 4a4 4 0 0 0 0-8c-1.8 0-3.5 1.3-5.5 4Z",
      },
    },
  },
  terminal: {
    intent: "Command cursor advances along the input line",
    nodes: [
      [
        "path",
        {
          d: "m5 7 5 5-5 5M13 17h6",
        },
      ],
    ],
    parts: {
      0: {
        attributeName: "d",
        peak: "m5 7 5 5-5 5M15 17h6",
      },
    },
  },
  list: {
    intent: "Middle list row indents into its hierarchy",
    nodes: [
      [
        "path",
        {
          d: "M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01",
        },
      ],
    ],
    parts: {
      0: {
        attributeName: "d",
        peak: "M8 6h13M10 12h11M8 18h13M3 6h.01M3 12h.01M3 18h.01",
      },
    },
  },
  minus: {
    intent: "Remove stroke contracts around its center",
    nodes: [
      [
        "path",
        {
          d: "M5 12h14",
        },
      ],
    ],
    parts: {
      0: {
        attributeName: "d",
        peak: "M7 12h10",
      },
    },
  },
  "columns-3": {
    intent: "Middle column divider slides to resize",
    nodes: [
      [
        "path",
        {
          d: "M3 3h18v18H3zM9 3v18M15 3v18",
        },
      ],
    ],
    parts: {
      0: {
        attributeName: "d",
        peak: "M3 3h18v18H3zM10 3v18M15 3v18",
      },
    },
  },
  "grip-vertical": {
    intent: "Middle grip row shifts to suggest dragging",
    nodes: [
      [
        "path",
        {
          d: "M9 5h.01M15 5h.01M9 12h.01M15 12h.01M9 19h.01M15 19h.01",
        },
      ],
    ],
    parts: {
      0: {
        attributeName: "d",
        peak: "M9 5h.01M15 5h.01M10 12h.01M16 12h.01M9 19h.01M15 19h.01",
      },
    },
  },
  "messages-square": {
    intent: "Front conversation tail opens toward its reply",
    nodes: [
      [
        "path",
        {
          d: "M3 3h14v11H7l-4 4zM10 18h7l4 3V8h-1",
        },
      ],
    ],
    parts: {
      0: {
        attributeName: "d",
        peak: "M3 3h14v11H7l-4 5zM10 18h7l4 3V8h-1",
      },
    },
  },
  layers: {
    intent: "Bottom layer separates from the stack",
    nodes: [
      [
        "path",
        {
          d: "M12 3 2 8l10 5 10-5zM2 12l10 5 10-5M2 16l10 5 10-5",
        },
      ],
    ],
    parts: {
      0: {
        attributeName: "d",
        peak: "M12 3 2 8l10 5 10-5zM2 12l10 5 10-5M2 17l10 5 10-5",
      },
    },
  },
  menu: {
    intent: "Middle navigation row indents to invite opening",
    nodes: [
      [
        "path",
        {
          d: "M4 6h16M4 12h16M4 18h16",
        },
      ],
    ],
    parts: {
      0: {
        attributeName: "d",
        peak: "M4 6h16M7 12h13M4 18h16",
      },
    },
  },
  "panel-left": {
    intent: "Sidebar divider slides to reveal workspace",
    nodes: [
      [
        "path",
        {
          d: "M3 3h18v18H3zM9 3v18",
        },
      ],
    ],
    parts: {
      0: {
        attributeName: "d",
        peak: "M3 3h18v18H3zM11 3v18",
      },
    },
  },
  "layout-dashboard": {
    intent: "Lower right tile grows into available space",
    nodes: [
      [
        "path",
        {
          d: "M3 3h7v10H3zM14 3h7v6h-7zM14 13h7v8h-7zM3 17h7v4H3z",
        },
      ],
    ],
    parts: {
      0: {
        attributeName: "d",
        peak: "M3 3h7v10H3zM14 3h7v6h-7zM14 11h7v10h-7zM3 17h7v4H3z",
      },
    },
  },
  plug: {
    intent: "Connector pins extend toward their socket",
    nodes: [
      [
        "path",
        {
          d: "M7 3v5M17 3v5M5 8h14v3a7 7 0 0 1-14 0zM12 18v4",
        },
      ],
    ],
    parts: {
      0: {
        attributeName: "d",
        peak: "M7 1v7M17 1v7M5 8h14v3a7 7 0 0 1-14 0zM12 18v4",
      },
    },
  },
  image: {
    intent: "Mountain peak rises within a stationary image frame",
    nodes: [
      [
        "path",
        {
          d: "M3 3h18v18H3zM3 17l6-6 5 5 3-3 4 4M7 7h.01",
        },
      ],
    ],
    parts: {
      0: {
        attributeName: "d",
        peak: "M3 3h18v18H3zM3 17l6-8 5 7 3-3 4 4M7 7h.01",
      },
    },
  },
  bag: {
    intent: "Shopping bag handle lifts under its load",
    nodes: [
      [
        "path",
        {
          d: "M4 7h16l1 14H3zM8 7V5a4 4 0 0 1 8 0v2",
        },
      ],
    ],
    parts: {
      0: {
        attributeName: "d",
        peak: "M4 7h16l1 14H3zM8 7V4a4 4 0 0 1 8 0v3",
      },
    },
  },
  card: {
    intent: "Payment detail line advances across the card",
    nodes: [
      [
        "path",
        {
          d: "M3 5h18v14H3zM3 10h18M6 15h4",
        },
      ],
    ],
    parts: {
      0: {
        attributeName: "d",
        peak: "M3 5h18v14H3zM3 10h18M6 15h7",
      },
    },
  },
  orders: {
    intent: "Receipt item advances to its next line",
    nodes: [
      [
        "path",
        {
          d: "M5 2l2 2 2-2 3 2 3-2 2 2 2-2v20l-2-2-2 2-3-2-3 2-2-2-2 2zM8 8h8M8 12h8M8 16h5",
        },
      ],
    ],
    parts: {
      0: {
        attributeName: "d",
        peak: "M5 2l2 2 2-2 3 2 3-2 2 2 2-2v20l-2-2-2 2-3-2-3 2-2-2-2 2zM8 8h8M8 13h8M8 16h5",
      },
    },
  },
  home: {
    intent: "Door opens within the fixed house silhouette",
    nodes: [
      [
        "path",
        {
          d: "M3 10l9-7 9 7M5 9v12h14V9M9 21v-8h6v8",
        },
      ],
    ],
    parts: {
      0: {
        attributeName: "d",
        peak: "M3 10l9-7 9 7M5 9v12h14V9M9 21v-8h4v8",
      },
    },
  },
  "loader-circle": {
    intent: "Loading arc sweeps around its stationary center",
    nodes: [
      [
        "path",
        {
          d: "M20 12a8 8 0 1 1-8-8",
        },
      ],
    ],
    parts: {
      0: {
        attributeName: "d",
        peak: "M12 20a8 8 0 1 1 8-8",
      },
    },
  },
};
export const coreAliases = {
  close: "x",
  chevron: "chevron-down",
  prev: "chevron-left",
  next: "chevron-right",
  refresh: "restore",
  file: "files",
  "chevron-up": "chevron-up",
};

coreMotion["chevron-up"] = {
  intent: "Upward tip reaches above fixed endpoints",
  nodes: [["path", { d: "m6 15 6-6 6 6" }]],
  parts: { 0: { attributeName: "d", peak: "m6 15 6-7.5 6 7.5" } },
};
