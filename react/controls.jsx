import React, { useEffect, useId, useRef, useState } from "react";
import { Popover } from "./motion.jsx";
import Icon from "./send/Icon.jsx";
import Segmented from "./send/Segmented.jsx";
import {
  parseColor,
  colorHex,
  formatColor,
  rgbToHsv,
  hsvToRgb,
} from "./color-model.js";

/** A native input with optional adjacent content. Field associations reach the input. */
export function InputGroup({
  prefix,
  suffix,
  disabled,
  className = "",
  style,
  ...props
}) {
  return (
    <fieldset
      disabled={disabled}
      className={`re-input-group ${className}`}
      data-disabled={disabled || undefined}
      data-invalid={props["aria-invalid"] || undefined}
      style={style}
    >
      {prefix != null && <span className="re-input-addon">{prefix}</span>}
      <input {...props} disabled={disabled} />
      {suffix != null && <span className="re-input-addon">{suffix}</span>}
    </fieldset>
  );
}

/** Group existing actions. Each action retains native keyboard and disabled behavior. */
export function ButtonGroup({
  children,
  label = "Actions",
  orientation = "horizontal",
  attached = false,
  className = "",
  style,
  ...props
}) {
  return (
    <div
      {...props}
      role="group"
      aria-label={label}
      className={`re-button-group ${className}`}
      data-orientation={orientation}
      data-attached={attached || undefined}
      style={style}
    >
      {children}
    </div>
  );
}
const DEFAULT_SWATCHES = [
  "#1fa476",
  "#007aff",
  "#8b5cf6",
  "#e5484d",
  "#ffcc00",
  "#18181b",
  "#ffffff",
];
export function ColorPicker({
  value,
  onValueChange,
  label = "Color",
  variant = "popover",
  alpha = false,
  formats = ["hex", "rgb", "hsl"],
  swatches = DEFAULT_SWATCHES,
  eyedropper = true,
  disabled = false,
  id,
  className = "",
  style,
  "aria-describedby": describedBy,
  "aria-invalid": invalid,
}) {
  const [open, setOpen] = useState(false),
    [format, setFormat] = useState(formats[0] || "hex"),
    [draft, setDraft] = useState(null),
    [error, setError] = useState(""),
    [picking, setPicking] = useState(false),
    [canPick, setCanPick] = useState(false);
  const generated = useId(),
    pickerId = id || generated,
    current = parseColor(value) || parseColor("#1fa476");
  const hsv = rgbToHsv(current),
    drag = useRef(null),
    active = useRef(null),
    eyeAbort = useRef(null),
    mounted = useRef(true),
    panelRef = useRef(null);
  // Achromatic colors cannot encode hue; black cannot encode saturation either.
  const [latent, setLatent] = useState({ h: hsv.h, s: hsv.s });
  useEffect(() => {
    if (hsv.v > 0)
      setLatent((previous) => {
        const next = { h: hsv.s > 0 ? hsv.h : previous.h, s: hsv.s };
        return next.h === previous.h && next.s === previous.s ? previous : next;
      });
  }, [hsv.h, hsv.s, hsv.v]);
  const hue = hsv.s > 0 ? hsv.h : latent.h,
    saturation = hsv.v > 0 ? hsv.s : latent.s,
    chosenFormat = formats.includes(format) ? format : formats[0] || "hex";
  const text = formatColor(current, chosenFormat, alpha);
  useEffect(() => {
    mounted.current = true;
    setCanPick(typeof window.EyeDropper === "function");
    return () => {
      mounted.current = false;
      eyeAbort.current?.abort();
    };
  }, []);
  useEffect(() => {
    if (open)
      panelRef.current?.querySelector("input")?.focus({ preventScroll: true });
  }, [open]);
  useEffect(() => {
    if (disabled) {
      setOpen(false);
      eyeAbort.current?.abort();
    }
  }, [disabled]);
  const commit = (color) => {
    if (disabled) return;
    setDraft(null);
    setError("");
    onValueChange(colorHex(color, alpha));
  };
  const shade = (patch) => {
    const next = { h: hue, s: saturation, v: hsv.v, ...patch };
    setLatent({ h: next.h, s: next.s });
    commit({ ...hsvToRgb(next.h, next.s, next.v), a: current.a });
  };
  const fromPointer = (event) => {
    const rect = event.currentTarget.getBoundingClientRect();
    shade({
      s: Math.max(0, Math.min(1, (event.clientX - rect.left) / rect.width)),
      v: 1 - Math.max(0, Math.min(1, (event.clientY - rect.top) / rect.height)),
    });
  };
  // Pointer moves use the latest render without losing pointer capture.
  active.current = fromPointer;
  const acceptDraft = () => {
    if (draft === null) return;
    const parsed = parseColor(draft);
    if (parsed) commit(parsed);
    else setError("Enter a valid HEX, RGB or HSL color.");
  };
  const pick = async () => {
    eyeAbort.current?.abort();
    const controller = new AbortController();
    eyeAbort.current = controller;
    setPicking(true);
    setError("");
    try {
      const result = await new window.EyeDropper().open({
        signal: controller.signal,
      });
      if (mounted.current && !controller.signal.aborted)
        commit({ ...parseColor(result.sRGBHex), a: current.a });
    } catch (e) {
      if (mounted.current && e.name !== "AbortError")
        setError("Could not pick a screen color.");
    } finally {
      if (mounted.current) setPicking(false);
    }
  };
  const panel = (
    <fieldset
      ref={panelRef}
      className="re-color-panel"
      disabled={disabled}
      aria-label={label}
    >
      <legend className="re-sr-only">{label}</legend>
      <div className="re-color-heading">
        <strong>{label}</strong>
        <span className="re-color-value">
          {colorHex(current, alpha).toUpperCase()}
        </span>
      </div>
      <div
        className="re-color-plane"
        aria-hidden="true"
        style={{ "--picker-hue": `hsl(${hue},100%,50%)` }}
        onPointerDown={(event) => {
          if (disabled || event.button !== 0) return;
          event.preventDefault();
          drag.current = event.pointerId;
          event.currentTarget.setPointerCapture(event.pointerId);
          active.current(event);
        }}
        onPointerMove={(event) => {
          if (drag.current === event.pointerId && !disabled)
            active.current(event);
        }}
        onPointerUp={(event) => {
          if (drag.current === event.pointerId) {
            drag.current = null;
            event.currentTarget.releasePointerCapture(event.pointerId);
          }
        }}
        onPointerCancel={() => (drag.current = null)}
        onLostPointerCapture={() => (drag.current = null)}
      >
        <span
          style={{
            left: `${saturation * 100}%`,
            top: `${(1 - hsv.v) * 100}%`,
            background: colorHex(current),
          }}
        />
      </div>
      <label className="re-color-track">
        <span>Hue</span>
        <input
          aria-label={`${label} hue`}
          data-channel="hue"
          type="range"
          min="0"
          max="359"
          step="1"
          value={Math.round(hue)}
          onChange={(e) => shade({ h: Number(e.target.value) })}
        />
      </label>
      <label className="re-color-track">
        <span>Saturation</span>
        <input
          aria-label={`${label} saturation`}
          type="range"
          min="0"
          max="100"
          value={Math.round(saturation * 100)}
          onChange={(e) => shade({ s: Number(e.target.value) / 100 })}
        />
      </label>
      <label className="re-color-track">
        <span>Brightness</span>
        <input
          aria-label={`${label} brightness`}
          type="range"
          min="0"
          max="100"
          value={Math.round(hsv.v * 100)}
          onChange={(e) => shade({ v: Number(e.target.value) / 100 })}
        />
      </label>
      {alpha && (
        <label className="re-color-track">
          <span>Opacity</span>
          <input
            aria-label={`${label} opacity`}
            type="range"
            min="0"
            max="100"
            value={Math.round(current.a * 100)}
            onChange={(e) =>
              commit({ ...current, a: Number(e.target.value) / 100 })
            }
          />
        </label>
      )}
      {formats.length > 1 && (
        <Segmented
          label={`${label} format`}
          fit
          disabled={disabled}
          value={chosenFormat}
          onChange={(next) => {
            setFormat(next);
            setDraft(null);
            setError("");
          }}
          options={formats.map((f) => ({ value: f, label: f.toUpperCase() }))}
        />
      )}
      <div className="re-color-entry">
        <input
          aria-label={`${label} value`}
          spellCheck={false}
          value={draft ?? text}
          aria-invalid={!!error}
          aria-describedby={error ? `${pickerId}-error` : undefined}
          onChange={(e) => {
            setDraft(e.target.value);
            setError("");
          }}
          onBlur={acceptDraft}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              acceptDraft();
            }
            if (e.key === "Escape" && draft !== null) {
              e.preventDefault();
              e.stopPropagation();
              setDraft(null);
              setError("");
            }
          }}
        />
        {eyedropper && canPick && (
          <button
            type="button"
            className="btn btn-outline btn-icon"
            aria-label="Pick color from screen"
            disabled={disabled || picking}
            onClick={pick}
          >
            <Icon name="pipette" />
          </button>
        )}
      </div>
      {error && (
        <small id={`${pickerId}-error`} role="alert" className="re-color-error">
          {error}
        </small>
      )}
      {swatches.length > 0 && (
        <div
          className="re-color-swatches"
          role="group"
          aria-label={`${label} swatches`}
        >
          {swatches.map((swatch, i) => {
            const color = typeof swatch === "string" ? swatch : swatch.value,
              name = typeof swatch === "string" ? swatch : swatch.label;
            const parsed = parseColor(color);
            if (!parsed) return null;
            return (
              <button
                key={`${color}-${i}`}
                type="button"
                aria-label={name}
                aria-pressed={
                  colorHex(parsed, alpha) === colorHex(current, alpha)
                }
                style={{ "--swatch": colorHex(parsed, alpha) }}
                onClick={() => commit(parsed)}
              >
                <span>
                  {colorHex(parsed, alpha) === colorHex(current, alpha) && (
                    <Icon name="check" />
                  )}
                </span>
              </button>
            );
          })}
        </div>
      )}
      {variant === "popover" && (
        <button
          type="button"
          className="btn btn-outline"
          onClick={() => {
            setDraft(null);
            setError("");
            setOpen(false);
          }}
        >
          Done
        </button>
      )}
    </fieldset>
  );
  return (
    <div className={`re-color-picker ${className}`} style={style}>
      {variant === "inline" ? (
        <div
          className="re-color-inline"
          id={pickerId}
          aria-describedby={describedBy}
          aria-invalid={invalid}
        >
          {panel}
        </div>
      ) : (
        <Popover
          className="re-color-popover"
          open={open}
          onOpenChange={(next) => {
            if (!disabled) {
              setOpen(next);
              if (!next) {
                setDraft(null);
                setError("");
                eyeAbort.current?.abort();
              }
            }
          }}
          label={label}
          width={320}
          trigger={(props) => (
            <button
              {...props}
              id={pickerId}
              type="button"
              className="re-color-trigger"
              disabled={disabled}
              aria-label={label}
              aria-describedby={describedBy}
              aria-invalid={invalid}
            >
              <span
                className="re-color-trigger-swatch"
                style={{ "--swatch": colorHex(current, alpha) }}
              />
              <span>{colorHex(current, alpha).toUpperCase()}</span>
              <Icon name="chevron-down" />
            </button>
          )}
        >
          {panel}
        </Popover>
      )}
    </div>
  );
}
