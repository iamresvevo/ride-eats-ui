import React from "react";
import { placeSelection } from "./hooks/selection.js";
import { useLayoutEffect, useRef } from "react";
import Icon from "./Icon.jsx";
import { t } from "./i18n.js";

/** A shared radio tab group with one fluid selection surface behind the labels. */
export default function Segmented({
  label,
  icon,
  options,
  value,
  onChange,
  disabled,
  fit = false,
  name,
}) {
  const root = useRef(null);
  const previous = useRef(value);
  useLayoutEffect(() => {
    placeSelection(root.current, previous.current !== value);
    previous.current = value;
  });
  useLayoutEffect(() => {
    const element = root.current;
    const observer = new ResizeObserver(() => placeSelection(element, false));
    observer.observe(element);
    element
      .querySelectorAll("button")
      .forEach((button) => observer.observe(button));
    return () => observer.disconnect();
  }, []);
  const onKeyDown = (event) => {
    const direction = {
      ArrowLeft: -1,
      ArrowUp: -1,
      ArrowRight: 1,
      ArrowDown: 1,
    }[event.key];
    if (
      disabled ||
      (direction === undefined && event.key !== "Home" && event.key !== "End")
    )
      return;
    event.preventDefault();
    const index = options.findIndex((option) => option.value === value);
    const next =
      event.key === "Home"
        ? 0
        : event.key === "End"
          ? options.length - 1
          : (index + direction + options.length) % options.length;
    onChange(options[next].value);
    root.current.querySelectorAll("button")[next]?.focus();
  };
  const group = (
    <div
      ref={root}
      className={fit ? "segmented segmented-fit" : "segmented"}
      role="radiogroup"
      aria-label={t(label || name)}
      onKeyDown={onKeyDown}
    >
      <span
        className="segmented-selection"
        data-selection-pill=""
        aria-hidden="true"
      >
        <span />
      </span>
      {options.map((option) => (
        <button
          key={option.value}
          type="button"
          role="radio"
          tabIndex={option.value === value ? 0 : -1}
          aria-checked={option.value === value}
          aria-label={option.title && t(option.title)}
          title={option.title && t(option.title)}
          disabled={disabled}
          onClick={() => onChange(option.value)}
        >
          {option.icon && <Icon name={option.icon} />}
          {option.label && t(option.label)}
        </button>
      ))}
    </div>
  );
  return label ? (
    <div className="segmented-field">
      <span className="field-label">
        {icon && <Icon name={icon} />}
        {t(label)}
      </span>
      {group}
    </div>
  ) : (
    group
  );
}
