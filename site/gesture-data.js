export const gesturePages = [
  [
    "reorder-list",
    "Reorder List",
    "Layout",
    "Drag handles to reorder rows with animated position changes. Arrow keys on the handle and move buttons provide equivalent controls.",
    `const [items, setItems] = useState([{id:'a',label:'Design'}, {id:'b',label:'Build'}, {id:'c',label:'Review'}]);\n<ReorderList items={items} onReorder={setItems} />`,
    [
      [
        "items / onReorder",
        "T[] / callback",
        "Caller-owned ordered items. Stable IDs preserve state.",
      ],
      [
        "getItemKey / renderItem",
        "(item) => key / (item, index) => ReactNode",
        "Customize identity and row content. Defaults to item.id and item.label.",
      ],
      [
        "disabled / label",
        "boolean / string",
        "Disable movement or name the list.",
      ],
    ],
    "ReorderList",
  ],
  [
    "swipe-actions",
    "Swipe Actions",
    "Actions",
    "Drag a row left to reveal actions, or use its action button. Actions only run when explicitly pressed.",
    `<SwipeActions actions={[{value:'archive', label:'Archive', icon:'archive', tone:'info', onSelect:archive}]}><strong>Project files</strong></SwipeActions>`,
    [
      [
        "actions",
        "{value,label,icon?,tone?,destructive?,onSelect?}[]",
        "Up to three visible actions. Revealing never executes them.",
      ],
      [
        "children / label",
        "ReactNode / string",
        "Row content and action region name.",
      ],
    ],
    "SwipeActions",
  ],
  [
    "carousel",
    "Carousel",
    "Display",
    "Touch scrolling, mouse dragging, keyboard arrows and navigation buttons share one scroll-snap carousel. Reduced motion removes animated scrolling.",
    `<Carousel items={cards} renderItem={card => <Card title={card.title}>{card.description}</Card>} />`,
    [
      [
        "items / renderItem",
        "T[] / (item,index) => ReactNode",
        "Content is yours. Item IDs provide stable keys.",
      ],
      ["label", "string", "Accessible carousel name."],
    ],
    "Carousel, Card",
  ],
  [
    "split-pane",
    "Split Pane",
    "Layout",
    "Drag the divider to resize with elastic resistance at the bounds and a smooth release. Controlled values stay within min/max. Keyboard resizing uses the shared settling curve: arrows adjust by 2%, Shift by 10%, Home/End jump to bounds.",
    `const [split, setSplit] = useState(40);\n<SplitPane value={split} onValueChange={setSplit} first={<p>Navigation</p>} second={<p>Workspace</p>} />`,
    [
      [
        "value / onValueChange",
        "number / callback",
        "First-panel width as a percentage.",
      ],
      ["min / max", "number", "Allowed percentages; defaults 20–80."],
      [
        "first / second / label",
        "ReactNode / ReactNode / string",
        "Panel content and separator name.",
      ],
    ],
    "SplitPane",
  ],
  [
    "range-slider",
    "Range Slider",
    "Inputs",
    "Two native range handles with a shared accent track. Drag either handle or use keyboard arrows; the bounds cannot cross.",
    `const [range, setRange] = useState([20,80]);\n<RangeSlider label="Budget" value={range} onValueChange={setRange} formatValue={value => '$' + value} />`,
    [
      [
        "value / onValueChange",
        "[number,number] / callback",
        "Controlled minimum and maximum.",
      ],
      ["min / max / step", "number", "Bounds and native stepping."],
      [
        "label / formatValue / disabled",
        "string / function / boolean",
        "Label, value formatting and availability.",
      ],
    ],
    "RangeSlider",
  ],
].map(([id, name, group, detail, code, props, imports]) => ({
  id,
  name,
  group,
  description: detail,
  detail,
  code,
  props,
  imports,
}));
