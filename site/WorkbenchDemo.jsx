import React, { useId, useRef, useState } from "react";
import {
  Button,
  Dialog,
  Workbench,
  ScrollArea,
  Flex,
  CardHeader,
  Tile,
  Segmented,
  Toolbar,
  Field,
  ColorPicker,
  NumberInput,
  Slider,
  Badge,
  useToast,
} from "../react/index.jsx";
const INITIAL = [
  {
    id: "headline",
    name: "Make room for ideas",
    kind: "text",
    x: 92,
    y: 108,
    rotation: 0,
    scale: 1,
    color: "#f2f2f3",
    saved: true,
  },
  {
    id: "circle",
    name: "Circle",
    kind: "circle",
    x: 280,
    y: 258,
    rotation: 0,
    scale: 1,
    color: "#1fa476",
    saved: false,
  },
  {
    id: "panel",
    name: "Rounded panel",
    kind: "panel",
    x: 100,
    y: 210,
    rotation: -12,
    scale: 1,
    color: "#007aff",
    saved: true,
  },
  {
    id: "caption",
    name: "A fresh perspective",
    kind: "text",
    x: 100,
    y: 420,
    rotation: 0,
    scale: 0.6,
    color: "#d0d0d6",
    saved: false,
  },
  {
    id: "circle2",
    name: "Small circle",
    kind: "circle",
    x: 426,
    y: 144,
    rotation: 0,
    scale: 0.32,
    color: "#ffcc00",
    saved: false,
  },
  {
    id: "panel2",
    name: "Accent panel",
    kind: "panel",
    x: 346,
    y: 360,
    rotation: 14,
    scale: 0.48,
    color: "#8b5cf6",
    saved: false,
  },
];
export default function WorkbenchDemo() {
  const [open, setOpen] = useState(false),
    [objects, setObjects] = useState(INITIAL),
    [selected, setSelected] = useState("circle"),
    [filter, setFilter] = useState("all"),
    [name, setName] = useState("Studio artwork"),
    [preview, setPreview] = useState(false),
    [tool, setTool] = useState("move");
  const snapshot = useRef(null),
    uid = useId().replaceAll(":", ""),
    toast = useToast();
  const object = objects.find((x) => x.id === selected),
    visible = objects.filter((x) => filter === "all" || x.saved);
  const update = (patch) =>
    setObjects((all) =>
      all.map((x) => (x.id === selected ? { ...x, ...patch } : x)),
    );
  const cancel = () => {
    if (snapshot.current) {
      setObjects(snapshot.current.objects);
      setName(snapshot.current.name);
    }
    setOpen(false);
  };
  return (
    <>
      <Button
        onClick={() => {
          snapshot.current = { objects, name };
          setPreview(false);
          setOpen(true);
        }}
      >
        Open editor layout
      </Button>
      <Dialog
        open={open}
        onOpenChange={(next) => (next ? setOpen(true) : cancel())}
        title="Editor workspace"
        style={{ width: "min(1280px,96vw)", maxWidth: "none" }}
        toolbar={
          <Toolbar
            trailing={
              <Button
                icon={preview ? "edit" : "eye"}
                onClick={() => setPreview(!preview)}
              >
                {preview ? "Edit artwork" : "Preview"}
              </Button>
            }
          >
            <Field label="Workspace name">
              <input value={name} onChange={(e) => setName(e.target.value)} />
            </Field>
            <Badge>{objects.length} layers</Badge>
          </Toolbar>
        }
        footer={
          <>
            <Button onClick={cancel}>Cancel</Button>
            <Button
              variant="primary"
              onClick={() => {
                setOpen(false);
                toast("Workspace updated in this demo");
              }}
            >
              Done
            </Button>
          </>
        }
      >
        <Workbench
          leadingWidth={220}
          trailingWidth={250}
          height="min(62dvh,640px)"
        >
          <ScrollArea
            label="Artwork layers"
            header={
              <Flex direction="column" gap={12}>
                <CardHeader title="Layers" headingLevel={3} />
                <Segmented
                  name="Layer view"
                  value={filter}
                  onChange={setFilter}
                  options={[
                    { value: "all", label: "All" },
                    { value: "saved", label: "Saved" },
                  ]}
                />
              </Flex>
            }
            footer={<small className="muted">Select a layer to edit it.</small>}
          >
            <Flex direction="column" gap={4}>
              {visible.map((item) => (
                <Tile
                  key={item.id}
                  variant="row"
                  density="compact"
                  titleLines={1}
                  showFooter={false}
                  title={item.name}
                  description={
                    item.kind === "text" ? "Text layer" : "Shape layer"
                  }
                  icon={
                    item.kind === "text"
                      ? "type"
                      : item.kind === "circle"
                        ? "circle"
                        : "square"
                  }
                  selected={selected === item.id}
                  onClick={() => setSelected(item.id)}
                />
              ))}
            </Flex>
          </ScrollArea>
          <Flex direction="column" gap={12}>
            <Flex
              direction="column"
              gap={12}
              style={{ background: "var(--raised)", padding: 16 }}
            >
              <CardHeader
                title={name || "Untitled artwork"}
                headingLevel={3}
                action={<Badge>{preview ? "Preview" : "Live canvas"}</Badge>}
              />
              <svg
                viewBox="0 0 560 500"
                role="img"
                aria-label="Artwork preview. Selecting a layer or changing its inspector updates this canvas."
                style={{ width: "100%", height: "100%", minHeight: 0, flex: 1 }}
              >
                <defs>
                  <pattern
                    id={uid + "grid"}
                    width="24"
                    height="24"
                    patternUnits="userSpaceOnUse"
                  >
                    <path
                      d="M 24 0 L 0 0 0 24"
                      fill="none"
                      stroke="#ffffff"
                      opacity="0.06"
                      strokeWidth="1"
                    />
                  </pattern>
                </defs>
                <rect width="560" height="500" rx="20" fill="#161618" />
                <rect
                  width="560"
                  height="500"
                  rx="20"
                  fill={`url(#${uid}grid)`}
                />
                {objects.map((item) => (
                  <g
                    key={item.id}
                    transform={`translate(${item.x} ${item.y}) rotate(${item.rotation}) scale(${item.scale})`}
                  >
                    {item.kind === "text" ? (
                      <text
                        fill={item.color}
                        fontSize="30"
                        fontWeight="750"
                        fontFamily="inherit"
                      >
                        {item.name}
                      </text>
                    ) : item.kind === "circle" ? (
                      <circle r="84" fill={item.color} />
                    ) : (
                      <rect
                        width="148"
                        height="112"
                        rx="24"
                        fill={item.color}
                      />
                    )}
                    {!preview && selected === item.id && (
                      <g
                        fill="var(--surface)"
                        stroke="var(--brand)"
                        strokeWidth="2"
                      >
                        <rect
                          x={item.kind === "circle" ? -92 : -8}
                          y={
                            item.kind === "circle"
                              ? -92
                              : item.kind === "text"
                                ? -34
                                : -8
                          }
                          width={
                            item.kind === "circle"
                              ? 184
                              : item.kind === "text"
                                ? 340
                                : 164
                          }
                          height={
                            item.kind === "circle"
                              ? 184
                              : item.kind === "text"
                                ? 48
                                : 128
                          }
                          fill="none"
                          strokeDasharray="5 4"
                        />
                        <circle r="4" />
                      </g>
                    )}
                  </g>
                ))}
              </svg>
            </Flex>
            <Toolbar trailing={<span className="muted">{object.name}</span>}>
              <Segmented
                name="Transform tool"
                value={tool}
                onChange={setTool}
                options={[
                  { value: "move", label: "Move", icon: "move" },
                  { value: "rotate", label: "Rotate", icon: "rotate-cw" },
                  { value: "scale", label: "Scale", icon: "maximize" },
                ]}
              />
            </Toolbar>
          </Flex>
          <ScrollArea
            label="Layer inspector"
            header={<CardHeader title="Inspector" headingLevel={3} />}
            footer={
              <Button
                size="sm"
                icon="rotate-ccw"
                onClick={() => update(INITIAL.find((x) => x.id === selected))}
              >
                Reset layer
              </Button>
            }
          >
            <Flex direction="column" gap={16}>
              <Field label="Layer name">
                <input
                  value={object.name}
                  onChange={(e) => update({ name: e.target.value })}
                />
              </Field>
              <Field label="Fill">
                <ColorPicker
                  label="Layer color"
                  value={object.color}
                  onValueChange={(color) => update({ color })}
                />
              </Field>
              {tool === "move" ? (
                <Flex direction="column">
                  <NumberInput
                    label="Horizontal position"
                    value={object.x}
                    min={0}
                    max={500}
                    buttonStep={8}
                    onValueChange={(x) => update({ x })}
                  />
                  <NumberInput
                    label="Vertical position"
                    value={object.y}
                    min={0}
                    max={470}
                    buttonStep={8}
                    onValueChange={(y) => update({ y })}
                  />
                </Flex>
              ) : tool === "rotate" ? (
                <Slider
                  label="Rotation"
                  value={object.rotation}
                  min={-180}
                  max={180}
                  step={1}
                  onValueChange={(rotation) => update({ rotation })}
                />
              ) : (
                <Slider
                  label="Scale"
                  value={object.scale}
                  min={0.2}
                  max={1.4}
                  step={0.05}
                  onValueChange={(scale) => update({ scale })}
                />
              )}
              <Button
                size="sm"
                variant="ghost"
                icon="star"
                onClick={() => update({ saved: !object.saved })}
              >
                {object.saved ? "Remove from saved" : "Save layer"}
              </Button>
            </Flex>
          </ScrollArea>
        </Workbench>
      </Dialog>
    </>
  );
}
