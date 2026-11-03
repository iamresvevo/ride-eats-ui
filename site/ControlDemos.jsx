import React, { useState } from "react";
import {
  ColorPicker,
  InputGroup,
  ButtonGroup,
  Button,
  Dropdown,
  Field,
  CardHeader,
  Flex,
  Switch,
  Icon,
  useToast,
} from "../react/index.jsx";
export function ControlDemo({ id }) {
  const [color, setColor] = useState("#1fa476cc"),
    [alpha, setAlpha] = useState(true),
    [disabled, setDisabled] = useState(false),
    [amount, setAmount] = useState("125"),
    [query, setQuery] = useState(""),
    [visible, setVisible] = useState(false);
  const toast = useToast();
  if (id === "color-picker")
    return (
      <Flex direction="column" gap={20}>
        <Flex>
          <Switch checked={alpha} onChange={setAlpha} label="Opacity" />
          <Switch checked={disabled} onChange={setDisabled} label="Disabled" />
        </Flex>
        <Flex align="start" gap={24}>
          <ColorPicker
            variant="inline"
            label="Accent color"
            value={color}
            onValueChange={setColor}
            alpha={alpha}
            disabled={disabled}
          />
          <Flex direction="column" gap={12}>
            <Field label="Same color, in a popover">
              <ColorPicker
                value={color}
                onValueChange={setColor}
                alpha={alpha}
                disabled={disabled}
                label="Choose accent"
              />
            </Field>
            <span>
              Saved value: <code>{color}</code>
            </span>
            <Button size="sm" onClick={() => setColor("#007aff80")}>
              Set blue externally
            </Button>
          </Flex>
        </Flex>
      </Flex>
    );
  if (id === "input-group")
    return (
      <Flex
        direction="column"
        gap={12}
        style={{ width: 360, maxWidth: "100%" }}
      >
        <Field
          label="Amount"
          hint="The prefix stays outside the editable value."
        >
          <InputGroup
            prefix="SRD"
            suffix="each"
            type="number"
            min="0"
            step="1"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />
        </Field>
        <Field label="Search">
          <InputGroup
            prefix={<Icon name="search" />}
            placeholder="Find anything"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            suffix={
              <Button
                size="sm"
                onClick={() =>
                  toast(query ? `Searching for ${query}` : "Enter a search")
                }
              >
                Search
              </Button>
            }
          />
        </Field>
        <Field label="Password">
          <InputGroup
            type={visible ? "text" : "password"}
            defaultValue="example-password"
            suffix={
              <Button
                variant="ghost"
                size="sm"
                className="btn-icon"
                aria-label={visible ? "Hide password" : "Show password"}
                onClick={() => setVisible(!visible)}
              >
                <Icon name={visible ? "eye-off" : "eye"} />
              </Button>
            }
          />
        </Field>
        <Field label="Unavailable">
          <InputGroup
            disabled
            value="Unavailable"
            readOnly
            suffix={<Button size="sm">Edit</Button>}
          />
        </Field>
      </Flex>
    );
  if (id === "button-group")
    return (
      <Flex direction="column" gap={24}>
        <Flex direction="column" gap={12}>
          <CardHeader title="Related actions" headingLevel={3} />
          <ButtonGroup label="Record actions">
            <Button icon="download" onClick={() => toast("Download callback")}>
              Download
            </Button>
            <Button icon="copy" onClick={() => toast("Copy callback")}>
              Copy
            </Button>
            <Button
              variant="danger"
              icon="trash"
              onClick={() => toast("Delete callback")}
            >
              Delete
            </Button>
          </ButtonGroup>
        </Flex>
        <Flex direction="column" gap={12}>
          <CardHeader title="Attached actions" headingLevel={3} />
          <ButtonGroup label="Save actions" attached>
            <Button
              variant="primary"
              onClick={() => toast("Saved in this demo")}
            >
              Save changes
            </Button>
            <Dropdown
              variant="primary"
              label="More save options"
              trigger={
                <span aria-label="More save options">
                  <Icon name="chevron-down" />
                </span>
              }
              items={[
                {
                  label: "Save as copy",
                  icon: "copy",
                  onSelect: () => toast("Saved a copy"),
                },
                {
                  label: "Save and close",
                  icon: "check",
                  onSelect: () => toast("Saved and closed"),
                },
              ]}
            />
          </ButtonGroup>
        </Flex>
        <Flex direction="column" gap={12}>
          <CardHeader title="Vertical layout" headingLevel={3} />
          <ButtonGroup label="Export formats" orientation="vertical">
            <Button onClick={() => toast("PDF export callback")}>
              Export PDF
            </Button>
            <Button onClick={() => toast("CSV export callback")}>
              Export CSV
            </Button>
            <Button disabled>Export XML</Button>
          </ButtonGroup>
        </Flex>
      </Flex>
    );
  return null;
}
