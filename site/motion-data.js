import { gesturePages } from "./gesture-data.js";
const page = (
  id,
  name,
  group,
  detail,
  code,
  props,
  imports = name === "PIN Input" ? "PinInput" : name.replaceAll(" ", ""),
) => ({
  id,
  name,
  group,
  description: detail,
  detail,
  code,
  props,
  imports,
});
export const motionPages = [
  ...gesturePages,
  page(
    "animated-icons",
    "Animated Icons",
    "Motion",
    "29 explicit SVG animations with complete visible glyphs, smooth easing and a resting pause. Unfinished catalog icons remain static. Replay, loop and copy the exact React usage.",
    `<AnimatedIcon name="bell" size={28} />\n<AnimatedIcon name="check" playing />\n<AnimatedIcon name="refresh" playing loop />\n// Hover/focus on a parent button also triggers the icon.\n<Button><AnimatedIcon name="send" /> Send files</Button>`,
    [
      [
        "name",
        "string — any catalog name",
        "Any catalog name. The animated browser lists geometry treatments; other names remain static.",
      ],
      [
        "playing / loop",
        "boolean",
        "Play explicitly or repeat. Hover/focus also plays.",
      ],
      [
        "size / strokeWidth / label",
        "number / number / string",
        "SVG appearance and accessibility.",
      ],
    ],
    "AnimatedIcon, Button",
  ),
  page(
    "popover",
    "Popover",
    "Feedback",
    "A floating, native top-layer panel for small forms and contextual details. It positions beside its trigger, escapes clipping, and dismisses on outside click or Escape.",
    `const [open, setOpen] = useState(false);\n<Popover open={open} onOpenChange={setOpen} label="Share settings"\n  trigger={props => <Button {...props}>Share settings</Button>}>\n  <p>Anyone with the link can view this transfer.</p>\n  <Button onClick={() => setOpen(false)}>Done</Button>\n</Popover>`,
    [
      [
        "open / onOpenChange",
        "boolean / callback",
        "Controlled native popover.",
      ],
      [
        "trigger",
        "(buttonProps) => ReactNode",
        "Spread the supplied ref and handlers.",
      ],
      [
        "label / children / width / align",
        "content and placement",
        "Dialog label, panel body, pixel width, start/end alignment.",
      ],
    ],
    "Popover, Button",
  ),
  page(
    "command-menu",
    "Command Menu",
    "Navigation",
    "A workspace command palette: grouped ranked search, nested scopes, recent commands, modifier shortcuts, async execution and error recovery. The focused demo creates local drafts and filters transfers.",
    `<CommandMenu open={open} onOpenChange={setOpen} shortcut items={[{value:'new',label:'New transfer',group:'Create',description:'Create a draft',shortcut:'Alt+N',onSelect:createDraft},{value:'settings',label:'Settings',group:'Navigate',items:settingsCommands}]} />`,
    [
      [
        "open / onOpenChange",
        "controlled state",
        "Open with a visible launcher or optional Ctrl/⌘K.",
      ],
      [
        "items",
        "CommandItem[]",
        "Unique value, label, description, group, icon, keywords, modifier shortcut, disabled, onSelect and nested items.",
      ],
      [
        "onSelect",
        "void | Promise",
        "Successful commands close the palette; rejected commands show an error and stay open.",
      ],
      [
        "label / placeholder / shortcut",
        "configuration",
        "Accessible scope name, search prompt and global launcher shortcut. Recent IDs stay in memory for the lifetime of this instance.",
      ],
    ],
    "CommandMenu",
  ),
  page(
    "pin-input",
    "PIN Input",
    "Inputs",
    "One real input with individual visual cells, so pasting, numeric keyboards and one-time-code autofill work naturally.",
    `const [code, setCode] = useState('');\n<PinInput label="Verification code" value={code} onValueChange={setCode}\n  length={6} onComplete={code => verifyCode(code)} />`,
    [
      [
        "value / onValueChange",
        "string / callback",
        "Digits only, controlled.",
      ],
      [
        "length / label / disabled",
        "number / string / boolean",
        "Cell count and field configuration.",
      ],
      [
        "onComplete",
        "(code) => void",
        "Called when a new complete code is entered.",
      ],
    ],
  ),
  page(
    "toggle-group",
    "Toggle Group",
    "Inputs",
    "A compact toolbar for one or several independent selections, with native pressed states and soft selection transitions.",
    `const [format, setFormat] = useState(['bold']);\n<ToggleGroup label="Text formatting" multiple value={format} onValueChange={setFormat}\n  items={[{value:'bold',label:'Bold',icon:'bold'},{value:'italic',label:'Italic',icon:'italic'}]} />`,
    [
      ["items", "{value,label,icon?,disabled?}[]", "Toggle controls."],
      [
        "value / onValueChange",
        "string|null or string[] / callback",
        "Single or multiple selection.",
      ],
      ["multiple / disabled", "boolean", "Selection mode and availability."],
    ],
  ),
  page(
    "rating",
    "Rating",
    "Inputs",
    "Drag across stars to choose a rating, preview on hover, or use native radio keyboard controls. Touch cancellation restores the previous value.",
    `const [rating, setRating] = useState(4);\n<Rating label="How was your experience?" value={rating} onValueChange={setRating} max={5} />`,
    [
      ["value / onValueChange", "number / callback", "Chosen rating, 1-based."],
      [
        "max / label / readOnly",
        "configuration",
        "Star count, group label and display-only mode.",
      ],
    ],
  ),
];
