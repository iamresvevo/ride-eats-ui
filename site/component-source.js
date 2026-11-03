import { gesturePages } from "./gesture-data.js";
import { collectionPages } from "./collection-data.js";
import { motionPages } from "./motion-data.js";
import { platformPages } from "./platform-data.js";
const send = {
  header: "Header.jsx",
  dropdown: "ui/Menu.jsx",
  switch: "ui/Switch.jsx",
  "date-time": "ui/DateTimePicker.jsx",
  segmented: "Segmented.jsx",
  skeleton: "ui/Skeleton.jsx",
  empty: "ui/EmptyState.jsx",
  settings: "ui/SettingRow.jsx",
  pagination: "ui/Pagination.jsx",
};
const forms = new Set([
  "textarea",
  "form",
  "combobox",
  "multi-select",
  "date-range-picker",
  "time-picker",
  "upload-progress",
]);
const workflows = new Set([
  "settings-panel",
  "team-directory",
  "file-manager",
  "activity-feed",
  "support-inbox",
]);
export function sourceForPage(id) {
  if (
    [
      "image-compare",
      "tree-view",
      "signature-pad",
      "activity-heatmap",
    ].includes(id)
  )
    return "react/specialized.jsx";
  if (send[id]) return "react/send/" + send[id];
  if (id === "command-menu") return "react/CommandMenu.jsx";
  if (id === "sticky-bar") return "react/StickyBar.jsx";
  if (id === "data-grid") return "react/DataGrid.jsx";
  if (id === "icons" || id === "animated-icons") return "react/send/Icon.jsx";
  if (id === "stacked-dialogs" || id === "toast") return "react/Feedback.jsx";
  if (forms.has(id)) return "react/forms.jsx";
  if (workflows.has(id)) return "react/workflows.jsx";
  if (collectionPages.some((p) => p.id === id)) return "react/collection.jsx";
  if (gesturePages.some((p) => p.id === id)) return "react/gestures.jsx";
  if (motionPages.some((p) => p.id === id)) return "react/motion.jsx";
  if (platformPages.some((p) => p.id === id)) return "react/platform.jsx";
  return "react/index.jsx";
}
