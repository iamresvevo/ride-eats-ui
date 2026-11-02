import { motionEase } from "./send/hooks/motion.js";
import React, { useId, useLayoutEffect, useRef, useState } from "react";
import Icon from "./send/Icon.jsx";

// The application owns ordering; stable IDs preserve focus and state.
export function ReorderList({
  items,
  onReorder,
  getItemKey = (item) => item.id,
  renderItem = (item) => item.label,
  label = "Reorder items",
  disabled = false,
  className = "",
  style,
}) {
  const root = useRef(null),
    drag = useRef(null),
    before = useRef(new Map()),
    [active, setActive] = useState(null),
    [announcement, setAnnouncement] = useState("");
  useLayoutEffect(() => {
    const nodes = root.current?.querySelectorAll("[data-reorder-key]") || [];
    const next = new Map();
    nodes.forEach((node) => {
      const key = node.dataset.reorderKey,
        box = { top: node.offsetTop },
        old = before.current.get(key);
      next.set(key, box);
      if (
        old &&
        !matchMedia("(prefers-reduced-motion: reduce)").matches &&
        old.top !== box.top
      ) {
        node.getAnimations().forEach((animation) => animation.cancel());
        node.animate(
          [
            { transform: `translateY(${old.top - box.top}px)` },
            { transform: "translateY(0)" },
          ],
          { duration: 240, easing: motionEase(node) },
        );
      }
    });
    before.current = next;
  }, [items]);
  const move = (from, to) => {
    if (from === to || to < 0 || to >= items.length) return;
    const next = [...items];
    const [item] = next.splice(from, 1);
    next.splice(to, 0, item);
    onReorder(next);
    setAnnouncement(`Moved item to position ${to + 1} of ${items.length}`);
  };
  return (
    <div
      className={`re-reorder ${className}`}
      style={style}
      ref={root}
      onPointerMove={(e) => {
        if (!drag.current) return;
        const key = drag.current.key;
        const rows = [...root.current.querySelectorAll("[data-reorder-key]")];
        const to = rows.reduce(
          (best, row, index) => {
            const top =
                root.current.getBoundingClientRect().top + row.offsetTop,
              distance = Math.abs(e.clientY - top - row.offsetHeight / 2);
            return distance < best.distance ? { index, distance } : best;
          },
          { index: 0, distance: Infinity },
        ).index;
        move(
          items.findIndex((i) => String(getItemKey(i)) === key),
          to,
        );
      }}
      onPointerUp={() => {
        drag.current = null;
        setActive(null);
      }}
      onPointerCancel={() => {
        drag.current = null;
        setActive(null);
      }}
    >
      <ul aria-label={label}>
        {items.map((item, index) => {
          const key = String(getItemKey(item));
          return (
            <li
              key={key}
              data-reorder-key={key}
              data-dragging={active === key || undefined}
            >
              <button
                type="button"
                className="re-drag-handle"
                aria-label={`Move item ${index + 1}`}
                disabled={disabled}
                onKeyDown={(e) => {
                  if (e.key === "ArrowUp" || e.key === "ArrowDown") {
                    e.preventDefault();
                    move(index, index + (e.key === "ArrowUp" ? -1 : 1));
                  }
                }}
                onPointerDown={(e) => {
                  if (e.button !== 0) return;
                  root.current.setPointerCapture(e.pointerId);
                  drag.current = { key, startY: e.clientY };
                  setActive(key);
                }}
              >
                <Icon name="grip-vertical" />
              </button>
              <div className="re-reorder-content">
                {renderItem(item, index)}
              </div>
              <div className="re-reorder-controls">
                <button
                  type="button"
                  disabled={disabled || index === 0}
                  aria-label={`Move item ${index + 1} up`}
                  onClick={() => move(index, index - 1)}
                >
                  <Icon name="chevron-up" />
                </button>
                <button
                  type="button"
                  disabled={disabled || index === items.length - 1}
                  aria-label={`Move item ${index + 1} down`}
                  onClick={() => move(index, index + 1)}
                >
                  <Icon name="chevron-down" />
                </button>
              </div>
            </li>
          );
        })}
      </ul>
      <span role="status" className="re-sr-only">
        {announcement}
      </span>
    </div>
  );
}

export function SwipeActions({
  children,
  actions,
  label = "Item actions",
  className = "",
  style,
}) {
  const [open, setOpen] = useState(false),
    [offset, setOffset] = useState(0),
    [dragging, setDragging] = useState(false),
    start = useRef(null),
    toggle = useRef(null);
  const width = Math.min(actions.length * 96 + 16, 304);
  return (
    <div
      className={`re-swipe ${className}`}
      data-open={open || undefined}
      style={{ "--swipe-width": `${width}px`, ...style }}
    >
      <div
        className="re-swipe-actions"
        aria-label={label}
        inert={!open || undefined}
      >
        {actions.map((action) => (
          <button
            key={action.value}
            type="button"
            className={action.destructive ? "is-destructive" : ""}
            data-tone={action.destructive ? "danger" : action.tone || "neutral"}
            onClick={() => {
              toggle.current?.focus();
              action.onSelect?.();
              setOpen(false);
              setOffset(0);
            }}
          >
            {action.icon && <Icon name={action.icon} />}
            <span>{action.label}</span>
          </button>
        ))}
      </div>
      <div
        className="re-swipe-content"
        data-dragging={dragging || undefined}
        style={{
          transform: `translateX(${dragging ? offset : open ? -width : 0}px)`,
        }}
        onPointerDown={(e) => {
          if (
            e.button !== 0 ||
            e.target.closest("button,a,input,select,textarea")
          )
            return;
          start.current = {
            x: e.clientX,
            y: e.clientY,
            base: open ? -width : 0,
          };
        }}
        onPointerMove={(e) => {
          const s = start.current;
          if (!s) return;
          const dx = e.clientX - s.x,
            dy = e.clientY - s.y;
          if (!dragging && Math.abs(dy) > Math.abs(dx) && Math.abs(dy) > 8) {
            start.current = null;
            return;
          }
          if (Math.abs(dx) > 8) {
            e.currentTarget.setPointerCapture(e.pointerId);
            setDragging(true);
            setOffset(Math.max(-width, Math.min(0, s.base + dx)));
          }
        }}
        onPointerUp={() => {
          if (dragging) setOpen(offset < -width * 0.35);
          setDragging(false);
          start.current = null;
        }}
        onPointerCancel={() => {
          setDragging(false);
          start.current = null;
        }}
      >
        {children}
        <button
          type="button"
          ref={toggle}
          className="re-swipe-toggle"
          aria-label={open ? "Hide actions" : "Show actions"}
          aria-expanded={open}
          onClick={() => setOpen(!open)}
        >
          <Icon name={open ? "close" : "more"} />
        </button>
      </div>
    </div>
  );
}

export function Carousel({
  items,
  renderItem,
  label = "Carousel",
  className = "",
  style,
}) {
  const track = useRef(null),
    drag = useRef(null),
    [active, setActive] = useState(0),
    id = useId();
  const go = (index) => {
    const el = track.current;
    el?.scrollTo({
      left: index * el.clientWidth,
      behavior: matchMedia("(prefers-reduced-motion: reduce)").matches
        ? "instant"
        : "smooth",
    });
  };
  return (
    <section
      className={`re-carousel ${className}`}
      style={style}
      aria-label={label}
      aria-roledescription="carousel"
    >
      <div
        id={id}
        className="re-carousel-track"
        ref={track}
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "ArrowRight" || e.key === "ArrowLeft") {
            e.preventDefault();
            go(
              Math.max(
                0,
                Math.min(
                  items.length - 1,
                  active + (e.key === "ArrowRight" ? 1 : -1),
                ),
              ),
            );
          }
        }}
        onScroll={(e) =>
          setActive(
            Math.round(
              e.currentTarget.scrollLeft / (e.currentTarget.clientWidth || 1),
            ),
          )
        }
        onPointerDown={(e) => {
          if (
            e.pointerType !== "mouse" ||
            e.button !== 0 ||
            e.target.closest("button,a,input")
          )
            return;
          drag.current = { x: e.clientX, left: e.currentTarget.scrollLeft };
        }}
        onPointerMove={(e) => {
          if (!drag.current) return;
          const dx = e.clientX - drag.current.x;
          if (Math.abs(dx) > 6) {
            e.currentTarget.setPointerCapture(e.pointerId);
            e.currentTarget.dataset.dragging = "true";
            e.currentTarget.scrollLeft = drag.current.left - dx;
          }
        }}
        onPointerUp={(e) => {
          if (!drag.current) return;
          const dx = e.clientX - drag.current.x,
            startIndex = Math.round(
              drag.current.left / (e.currentTarget.clientWidth || 1),
            );
          drag.current = null;
          delete e.currentTarget.dataset.dragging;
          go(
            Math.max(
              0,
              Math.min(
                items.length - 1,
                startIndex + (Math.abs(dx) > 40 ? (dx < 0 ? 1 : -1) : 0),
              ),
            ),
          );
        }}
        onPointerCancel={(e) => {
          drag.current = null;
          delete e.currentTarget.dataset.dragging;
          go(active);
        }}
      >
        {items.map((item, index) => (
          <div
            key={item.id ?? index}
            className="re-carousel-slide"
            role="group"
            aria-roledescription="slide"
            aria-label={`${index + 1} of ${items.length}`}
            inert={index !== active || undefined}
          >
            {renderItem(item, index)}
          </div>
        ))}
      </div>
      <div className="re-carousel-nav">
        <button
          type="button"
          aria-label="Previous slide"
          disabled={!active}
          onClick={() => go(active - 1)}
        >
          <Icon name="prev" />
        </button>
        <div>
          {items.map((item, index) => (
            <button
              key={item.id ?? index}
              type="button"
              aria-label={`Go to slide ${index + 1}`}
              aria-current={active === index ? "true" : undefined}
              aria-controls={id}
              onClick={() => go(index)}
            />
          ))}
        </div>
        <button
          type="button"
          aria-label="Next slide"
          disabled={active >= items.length - 1}
          onClick={() => go(active + 1)}
        >
          <Icon name="next" />
        </button>
      </div>
      <span className="re-sr-only" role="status">
        {items.length ? `Slide ${active + 1} of ${items.length}` : "No slides"}
      </span>
    </section>
  );
}

export function SplitPane({
  value,
  onValueChange,
  min = 20,
  max = 80,
  first,
  second,
  label = "Resize panels",
  className = "",
  style,
}) {
  const root = useRef(null),
    [dragging, setDragging] = useState(false);
  const update = (e) => {
    const box = root.current.getBoundingClientRect();
    onValueChange(
      Math.max(min, Math.min(max, ((e.clientX - box.left) / box.width) * 100)),
    );
  };
  return (
    <div
      className={`re-split ${className}`}
      ref={root}
      data-dragging={dragging || undefined}
      style={{ "--split": `${Math.max(min, Math.min(max, value))}%`, ...style }}
    >
      <div>{first}</div>
      <div
        role="separator"
        tabIndex={0}
        aria-label={label}
        aria-orientation="vertical"
        aria-valuemin={min}
        aria-valuemax={max}
        aria-valuenow={Math.round(value)}
        onKeyDown={(e) => {
          if (["ArrowLeft", "ArrowRight", "Home", "End"].includes(e.key)) {
            e.preventDefault();
            onValueChange(
              e.key === "Home"
                ? min
                : e.key === "End"
                  ? max
                  : Math.max(
                      min,
                      Math.min(
                        max,
                        value +
                          (e.key === "ArrowRight" ? 1 : -1) *
                            (e.shiftKey ? 10 : 2),
                      ),
                    ),
            );
          }
        }}
        onPointerDown={(e) => {
          if (e.button !== 0) return;
          e.currentTarget.setPointerCapture(e.pointerId);
          setDragging(true);
          update(e);
        }}
        onPointerMove={(e) => {
          if (dragging) update(e);
        }}
        onPointerUp={() => setDragging(false)}
        onPointerCancel={() => setDragging(false)}
      >
        <span />
      </div>
      <div>{second}</div>
    </div>
  );
}

export function RangeSlider({
  value,
  onValueChange,
  min = 0,
  max = 100,
  step = 1,
  label = "Range",
  formatValue = String,
  disabled = false,
  className = "",
  style,
}) {
  const id = useId();
  const [low, high] = value;
  return (
    <fieldset
      className={`re-range-slider ${className}`}
      style={style}
      disabled={disabled}
    >
      <legend>{label}</legend>
      <output>
        {formatValue(low)} – {formatValue(high)}
      </output>
      <div
        className="re-range-rail"
        style={{
          "--low": `${((low - min) / (max - min || 1)) * 100}%`,
          "--high": `${((high - min) / (max - min || 1)) * 100}%`,
        }}
      >
        <span />
        <input
          aria-label={`${label} minimum`}
          aria-valuetext={formatValue(low)}
          id={`${id}-min`}
          type="range"
          min={min}
          max={max}
          step={step}
          value={low}
          onChange={(e) =>
            onValueChange([Math.min(Number(e.target.value), high), high])
          }
        />
        <input
          aria-label={`${label} maximum`}
          aria-valuetext={formatValue(high)}
          id={`${id}-max`}
          type="range"
          min={min}
          max={max}
          step={step}
          value={high}
          onChange={(e) =>
            onValueChange([low, Math.max(low, Number(e.target.value))])
          }
        />
      </div>
    </fieldset>
  );
}
