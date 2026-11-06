import React, { useId, useRef, useState, useLayoutEffect } from "react";
import Icon from "./send/Icon.jsx";
import DateTimePicker from "./send/ui/DateTimePicker.jsx";
import { Field, Button } from "./index.jsx";
import { Progress } from "./collection.jsx";

export function Textarea({
  label,
  hint,
  error,
  rows = 3,
  className = "",
  ...props
}) {
  const id = useId();
  return (
    <Field
      label={label}
      hint={hint}
      error={error}
      id={props.id || id}
      className={className}
    >
      <textarea rows={rows} {...props} />
    </Field>
  );
}

export function Form({
  initialValues,
  validate = () => ({}),
  onSubmit,
  children,
  className = "",
  style,
}) {
  const [values, setValues] = useState(initialValues),
    [errors, setErrors] = useState({}),
    [submitting, setSubmitting] = useState(false),
    [failure, setFailure] = useState("");
  const form = useRef(null),
    busy = useRef(false);
  const setValue = (name, value) => {
    setValues((previous) => ({ ...previous, [name]: value }));
    setErrors((previous) => ({ ...previous, [name]: undefined }));
    setFailure("");
  };
  const field = (name) => ({
    name,
    value: values[name] ?? "",
    onChange: (event) =>
      setValue(
        name,
        event.target.type === "checkbox"
          ? event.target.checked
          : event.target.value,
      ),
    "aria-invalid": !!errors[name] || undefined,
  });
  return (
    <form
      ref={form}
      className={`re-form ${className}`}
      style={style}
      onSubmit={async (event) => {
        event.preventDefault();
        if (busy.current) return;
        const next = validate(values) || {};
        setErrors(next);
        if (Object.values(next).some(Boolean)) {
          requestAnimationFrame(() =>
            form.current?.querySelector('[aria-invalid="true"]')?.focus(),
          );
          return;
        }
        busy.current = true;
        setSubmitting(true);
        setFailure("");
        try {
          await onSubmit(values);
        } catch (error) {
          setFailure(error?.message || "Unable to save. Try again.");
        } finally {
          busy.current = false;
          setSubmitting(false);
        }
      }}
    >
      {children({
        values,
        errors,
        submitting,
        field,
        setValue,
        reset: () => {
          setValues(initialValues);
          setErrors({});
          setFailure("");
        },
      })}
      {failure && (
        <p role="alert" className="re-form-error">
          {failure}
        </p>
      )}
    </form>
  );
}

export function Combobox({
  options,
  value,
  onValueChange,
  label = "Choose an option",
  labelHidden = false,
  placeholder = "Search options…",
  multiple = false,
  disabled = false,
  error,
  hint,
  allowCustom = false,
  className = "",
  style,
}) {
  const id = useId(),
    input = useRef(null),
    panel = useRef(null),
    pointerFocus = useRef(false),
    [open, setOpen] = useState(false),
    [query, setQuery] = useState(""),
    [active, setActive] = useState(0);
  const chosen = multiple ? value || [] : [value];
  const selected = options.find((option) => option.value === value);
  const matches = options.filter((option) =>
    option.label.toLowerCase().includes(query.toLowerCase()),
  );
  useLayoutEffect(() => {
    const node = panel.current;
    if (!node) return;
    if (!open) {
      if (node.matches(":popover-open")) node.hidePopover();
      return;
    }
    if (!node.matches(":popover-open")) node.showPopover();
    const place = () => {
      const anchor =
        input.current.closest(".re-combobox-input") || input.current;
      const b = anchor.getBoundingClientRect();
      const available = innerWidth - 16;
      node.style.width = "max-content";
      node.style.minWidth = Math.min(Math.max(b.width, 240), available) + "px";
      node.style.maxWidth = Math.min(Math.max(b.width, 560), available) + "px";
      node.style.left =
        Math.max(8, Math.min(b.left, innerWidth - node.offsetWidth - 8)) + "px";
      node.style.top =
        (b.bottom + 8 + node.offsetHeight < innerHeight
          ? b.bottom + 6
          : Math.max(8, b.top - node.offsetHeight - 6)) + "px";
    };
    place();
    addEventListener("resize", place);
    addEventListener("scroll", place, true);
    return () => {
      removeEventListener("resize", place);
      removeEventListener("scroll", place, true);
    };
  }, [open, matches.length]);
  const choose = (option) => {
    if (option.disabled) return;
    if (multiple) {
      onValueChange(
        chosen.includes(option.value)
          ? chosen.filter((v) => v !== option.value)
          : [...chosen, option.value],
      );
      setQuery("");
      input.current.focus();
    } else {
      onValueChange(option.value);
      setQuery("");
      setOpen(false);
      input.current.focus();
    }
  };
  const navigate = (direction) => {
    if (!matches.length) return;
    let next = active;
    for (let i = 0; i < matches.length; i++) {
      next = (next + direction + matches.length) % matches.length;
      if (!matches[next].disabled) break;
    }
    setActive(next);
    requestAnimationFrame(() =>
      panel.current
        ?.querySelector(`[data-index="${next}"]`)
        ?.scrollIntoView({ block: "nearest" }),
    );
  };
  return (
    <div className={`re-combobox ${className}`} style={style}>
      <label htmlFor={id} className={labelHidden ? "re-sr-only" : undefined}>
        {label}
      </label>
      {multiple && chosen.length > 0 && (
        <div className="re-selected-chips">
          {chosen.map((key) => (
            <button
              type="button"
              key={key}
              disabled={disabled}
              aria-label={`Remove ${options.find((o) => o.value === key)?.label || key}`}
              onClick={() => onValueChange(chosen.filter((v) => v !== key))}
            >
              {options.find((o) => o.value === key)?.label || key}
              <Icon name="close" size={12} />
            </button>
          ))}
        </div>
      )}
      <div className="re-combobox-input">
        <Icon name="search" />
        <input
          ref={input}
          id={id}
          role="combobox"
          autoComplete="off"
          disabled={disabled}
          aria-expanded={open}
          aria-controls={`${id}-options`}
          aria-autocomplete="list"
          aria-activedescendant={
            open && matches[active] ? `${id}-${active}` : undefined
          }
          aria-invalid={!!error || undefined}
          aria-describedby={error || hint ? `${id}-hint` : undefined}
          placeholder={placeholder}
          value={
            open
              ? query
              : multiple
                ? ""
                : selected?.label || (allowCustom ? value || "" : "")
          }
          onPointerDown={() => {
            pointerFocus.current = true;
          }}
          onPointerCancel={() => {
            pointerFocus.current = false;
          }}
          onBlur={() => {
            pointerFocus.current = false;
          }}
          onClick={() => {
            pointerFocus.current = false;
            if (!open) {
              setQuery("");
              setActive(0);
              setOpen(true);
            }
          }}
          onFocus={() => {
            // Pointer focus precedes native light-dismiss; open on click instead.
            if (pointerFocus.current) return;
            setOpen(true);
            setQuery("");
            setActive(0);
          }}
          onChange={(e) => {
            setQuery(e.target.value);
            setOpen(true);
            setActive(0);
          }}
          onKeyDown={(e) => {
            if (e.key === "Escape") {
              setOpen(false);
              setQuery("");
            } else if (e.key === "ArrowDown" || e.key === "ArrowUp") {
              e.preventDefault();
              if (!open) setOpen(true);
              else navigate(e.key === "ArrowDown" ? 1 : -1);
            } else if (e.key === "Enter" && open) {
              e.preventDefault();
              if (matches[active]) choose(matches[active]);
              else if (allowCustom && query.trim())
                choose({ value: query.trim(), label: query.trim() });
            } else if (e.key === "Tab") {
              setOpen(false);
            }
          }}
        />
        <button
          type="button"
          disabled={disabled}
          aria-label="Toggle options"
          tabIndex={-1}
          onMouseDown={(e) => e.preventDefault()}
          onClick={() => {
            input.current.focus();
            setOpen(!open);
          }}
        >
          <Icon name="chevron" />
        </button>
      </div>
      {(error || hint) && (
        <small id={`${id}-hint`} className={error ? "re-form-error" : ""}>
          {error || hint}
        </small>
      )}
      <div
        ref={panel}
        popover="auto"
        id={`${id}-options`}
        role="listbox"
        aria-label={label}
        aria-multiselectable={multiple || undefined}
        className="re-combobox-options"
        onToggle={(event) => {
          if (
            event.newState === "closed" &&
            !event.currentTarget.matches(":popover-open")
          )
            setOpen(false);
        }}
      >
        {matches.map((option, index) => (
          <div
            key={option.value}
            id={`${id}-${index}`}
            role="option"
            aria-selected={chosen.includes(option.value)}
            aria-disabled={option.disabled || undefined}
            data-index={index}
            data-active={index === active || undefined}
            onMouseDown={(e) => e.preventDefault()}
            onMouseMove={() => setActive(index)}
            onClick={() => choose(option)}
          >
            <span>
              {option.label}
              {option.description && <small>{option.description}</small>}
            </span>
            {chosen.includes(option.value) && <Icon name="check" />}
          </div>
        ))}
        {!matches.length && (
          <div className="re-option-empty">
            {allowCustom && query.trim() ? (
              <button
                type="button"
                onMouseDown={(e) => e.preventDefault()}
                onClick={() =>
                  choose({ value: query.trim(), label: query.trim() })
                }
              >
                Use “{query.trim()}”
              </button>
            ) : (
              "No matching options"
            )}
          </div>
        )}
      </div>
    </div>
  );
}
// Parse and serialize calendar dates in local time; UTC parsing shifts dates west of Greenwich.
const dateSeconds = (value) =>
  value ? new Date(value + "T12:00:00").getTime() / 1000 : undefined;
const calendarDate = (seconds) => {
  const date = new Date(seconds * 1000);
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
};
export function DateRangePicker({
  value,
  onValueChange,
  label = "Date range",
  min,
  max,
  locale,
  disabled = false,
  className = "",
  style,
}) {
  const id = useId();
  const upper = [max, value.end].filter(Boolean).sort()[0];
  const lower = [min, value.start].filter(Boolean).sort().at(-1);
  return (
    <fieldset
      className={`re-date-range ${className}`}
      style={style}
      disabled={disabled}
    >
      <legend>{label}</legend>
      <div>
        <label htmlFor={`${id}-start`}>
          From
          <DateTimePicker
            id={`${id}-start`}
            label={`${label}: From`}
            dateOnly
            locale={locale}
            disabled={disabled}
            empty={!value.start}
            value={dateSeconds(value.start) ?? Date.now() / 1000}
            min={dateSeconds(min)}
            max={dateSeconds(upper)}
            onChange={(seconds) =>
              onValueChange({ ...value, start: calendarDate(seconds) })
            }
            onClear={() => onValueChange({ ...value, start: "" })}
          />
        </label>
        <Icon name="arrow-right" />
        <label htmlFor={`${id}-end`}>
          Until
          <DateTimePicker
            id={`${id}-end`}
            label={`${label}: Until`}
            dateOnly
            locale={locale}
            disabled={disabled}
            empty={!value.end}
            value={dateSeconds(value.end) ?? Date.now() / 1000}
            min={dateSeconds(lower)}
            max={dateSeconds(max)}
            onChange={(seconds) =>
              onValueChange({ ...value, end: calendarDate(seconds) })
            }
            onClear={() => onValueChange({ ...value, end: "" })}
          />
        </label>
      </div>
    </fieldset>
  );
}
export function TimePicker({
  value,
  onValueChange,
  label = "Time",
  min,
  max,
  step = 60,
  disabled = false,
  className = "",
  style,
}) {
  const id = useId();
  const seconds = (text) => {
    if (!text || !/^\d{2}:\d{2}$/.test(text)) return undefined;
    const [hour, minute] = text.split(":").map(Number);
    if (hour > 23 || minute > 59) return undefined;
    return new Date(2000, 0, 1, hour, minute).getTime() / 1000;
  };
  return (
    <Field label={label} id={id} className={className} style={style}>
      <DateTimePicker
        id={id}
        label={label}
        timeOnly
        value={seconds(value) ?? seconds("09:00")}
        empty={!value}
        min={seconds(min)}
        max={seconds(max)}
        disabled={disabled}
        minuteStep={Math.max(1, Math.round(step / 60))}
        onChange={(timestamp) => {
          const date = new Date(timestamp * 1000);
          onValueChange(
            `${String(date.getHours()).padStart(2, "0")}:${String(date.getMinutes()).padStart(2, "0")}`,
          );
        }}
      />
    </Field>
  );
}

export function UploadProgress({
  files,
  onCancel,
  onRetry,
  className = "",
  style,
}) {
  return (
    <div
      className={`re-upload-progress ${className}`}
      style={style}
      role="region"
      aria-label="Upload progress"
    >
      {files.map((file) => (
        <div key={file.id}>
          <Icon name="file" size={20} />
          <div>
            <strong>{file.name}</strong>
            {file.status === "uploading" ? (
              <Progress value={file.progress ?? 0} label="Uploading" />
            ) : (
              <small className={file.status === "error" ? "re-form-error" : ""}>
                {file.error ||
                  {
                    done: "Uploaded",
                    cancelled: "Cancelled",
                    queued: "Waiting",
                  }[file.status] ||
                  file.status}
              </small>
            )}
          </div>
          {file.status === "uploading" && onCancel && (
            <Button
              size="sm"
              variant="ghost"
              aria-label={`Cancel ${file.name}`}
              onClick={() => onCancel(file.id)}
              icon="close"
            />
          )}
          {file.status === "error" && onRetry && (
            <Button size="sm" variant="ghost" onClick={() => onRetry(file.id)}>
              Retry
            </Button>
          )}
          {file.status === "done" && <Icon name="check" />}
        </div>
      ))}
    </div>
  );
}
