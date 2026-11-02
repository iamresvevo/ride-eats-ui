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
  page(
    "animated-icons",
    "Animated Icons",
    "Motion",
    "Ten purpose-built SVG motions: a ringing bell, beating heart, drawing check, moving upload/download arrows, searching lens, refreshing arrows, adjusting sliders, opening folder and flying send glyph. Hover, click, or replay the collection.",
    `<AnimatedIcon name="bell" size={28} />\n<AnimatedIcon name="check" playing />\n<AnimatedIcon name="refresh" playing loop />\n// Hover/focus on a parent button also triggers the icon.\n<Button><AnimatedIcon name="send" /> Send files</Button>`,
    [
      [
        "name",
        "bell | heart | check | upload | download | search | refresh | settings | folder | send",
        "A motion designed for that glyph.",
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
    "Keyboard-first actions with filtering, arrow navigation and a native dialog. Enable the optional Ctrl/⌘K shortcut for a global launcher.",
    `const [open, setOpen] = useState(false);\n<Button onClick={() => setOpen(true)}>Quick actions</Button>\n<CommandMenu open={open} onOpenChange={setOpen} shortcut\n  items={[\n    { value:'new',label:'New transfer',icon:'plus',onSelect:createTransfer },\n    { value:'team',label:'Open team',icon:'team',keywords:'people members',onSelect:openTeam },\n  ]} />`,
    [
      ["open / onOpenChange", "boolean / callback", "Controlled launcher."],
      [
        "items",
        "CommandItem[]",
        "value, label, icon, keywords, shortcut, disabled and onSelect.",
      ],
      ["shortcut", "boolean", "Optionally register Ctrl/⌘K."],
    ],
    "CommandMenu, Button",
  ),
  page(
    "collapsible",
    "Collapsible",
    "Layout",
    "One expandable section, with a rotating chevron and animated content height. Use it for optional settings and extra details.",
    `const [open, setOpen] = useState(false);\n<Collapsible title="Advanced settings" open={open} onOpenChange={setOpen}>\n  <YourSettings />\n</Collapsible>`,
    [
      ["open / onOpenChange", "boolean / callback", "Expanded state."],
      ["title / children", "ReactNode", "Trigger and content."],
    ],
  ),
  page(
    "steps",
    "Steps",
    "Navigation",
    "A compact wizard progress rail with completed, current and upcoming steps. Supports horizontal or vertical layouts and optional step navigation.",
    `const [step, setStep] = useState('details');\n<Steps value={step} onValueChange={setStep} items={[\n  {value:'details',label:'Details',description:'Name your transfer'},\n  {value:'files',label:'Files',description:'Choose what to share'},\n  {value:'review',label:'Review',description:'Ready to send'},\n]} />`,
    [
      ["items", "{value,label,description?}[]", "Ordered steps."],
      [
        "value / onValueChange",
        "string / optional callback",
        "Current step and optional navigation.",
      ],
      ["orientation", "horizontal | vertical", "Layout direction."],
    ],
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
    "A small, keyboard-accessible star rating with native radio behavior and a restrained hover lift.",
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
  page(
    "scroll-area",
    "Scroll Area",
    "Layout",
    "A contained, keyboard-scrollable region with a sticky header for search, filters or section labels.",
    `<ScrollArea height={240} label="Team members"\n  header={<input type="search" placeholder="Find a member…" aria-label="Find a member" />}>\n  {members.map(member => <YourRow key={member.id} member={member} />)}\n</ScrollArea>`,
    [
      ["height", "number or CSS length", "Maximum region height."],
      [
        "header / children",
        "ReactNode",
        "Sticky header and scrolling content.",
      ],
      [
        "label / className / style",
        "accessibility and styling",
        "Region name and appearance.",
      ],
    ],
  ),
  page(
    "separator",
    "Separator",
    "Layout",
    "A quiet dividing line with an optional label, in horizontal or vertical layouts.",
    `<Separator label="or continue with" />\n<Separator orientation="vertical" />`,
    [
      ["label", "ReactNode", "Optional line label."],
      ["orientation", "horizontal | vertical", "Divider direction."],
    ],
  ),
];
