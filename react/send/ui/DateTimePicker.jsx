import React from "react";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import Icon from "../Icon.jsx";
import usePresence from "../hooks/usePresence.js";
import { getLanguage, t } from "../i18n.js";

const startOfDay = (date) =>
  new Date(date.getFullYear(), date.getMonth(), date.getDate());
const sameDay = (a, b) => a.toDateString() === b.toDateString();
const MINUTES = [0, 15, 30, 45];

/**
 * A date and time in the app's own style, instead of the browser's picker: the field shows the
 * chosen moment, and opens a month grid with hour and minute lists beside it. `value` is a Unix
 * time; with `future`, moments already past can't be picked.
 */
export default function DateTimePicker({
  value,
  future = false,
  onChange,
  label = "Date and time",
  locale,
  disabled = false,
  className = "",
  style,
}) {
  const [open, setOpen] = useState(false);
  const chosen = new Date(value * 1000);
  const [month, setMonth] = useState(
    () => new Date(chosen.getFullYear(), chosen.getMonth(), 1),
  );
  const root = useRef(null);
  const button = useRef(null);
  const panel = useRef(null);
  const presence = usePresence(open, panel);
  const language = locale || getLanguage();
  // Read once per opening, so the past stays put while the panel is open.
  const [now, setNow] = useState(null);
  // Inside a dialog the panel must live in it too, or the dialog's top layer would cover it.
  const [host, setHost] = useState(null);
  const min = future && now ? Math.floor(now / 1000) : null;
  const earliest = min ? new Date(min * 1000) : null;

  useEffect(() => {
    if (!open) return;
    // Center each time list on its choice without scrolling the page.
    panel.current
      .querySelectorAll('.dtp-column [aria-selected="true"]')
      .forEach((item) => {
        item.parentElement.scrollTop =
          item.offsetTop -
          item.parentElement.offsetTop -
          (item.parentElement.clientHeight - item.offsetHeight) / 2;
      });
    const onPointer = (event) => {
      if (
        !root.current.contains(event.target) &&
        !panel.current?.contains(event.target)
      )
        setOpen(false);
    };
    const onKey = (event) => {
      if (event.key !== "Escape") return;
      setOpen(false);
      button.current?.focus();
    };
    document.addEventListener("pointerdown", onPointer);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", onPointer);
      document.removeEventListener("keydown", onKey);
    };
    // Only on opening: the lists center on the current choice once, then stay where the person scrolls.
  }, [open]);

  // The panel floats above everything (scrolling cards and dialogs clip their content), next to the
  // field: below it, or above when there's no room, and kept inside the window.
  useLayoutEffect(() => {
    if (!presence.mounted) return;
    const place = () => {
      const box = button.current.getBoundingClientRect();
      const el = panel.current;
      const below =
        box.bottom + 8 + el.offsetHeight <= innerHeight - 8 ||
        box.top < el.offsetHeight + 16;
      el.style.top = `${below ? box.bottom + 8 : box.top - 8 - el.offsetHeight}px`;
      el.style.left = `${Math.max(8, Math.min(box.left, innerWidth - el.offsetWidth - 8))}px`;
      el.style.transformOrigin = below ? "top left" : "bottom left";
    };
    place();
    addEventListener("scroll", place, true);
    addEventListener("resize", place);
    return () => {
      removeEventListener("scroll", place, true);
      removeEventListener("resize", place);
    };
  }, [presence.mounted]);

  const toggle = () => {
    if (!open) {
      setNow(Date.now());
      setHost(button.current.closest("dialog") ?? document.body);
      setMonth(new Date(chosen.getFullYear(), chosen.getMonth(), 1));
    }
    setOpen(!open);
  };

  // Keeps the time when the day changes and the day when the time changes; never earlier than `min`.
  const pick = (date) => {
    const next = Math.floor(date.getTime() / 1000);
    onChange(min && next < min ? Math.ceil(min / 900) * 900 : next);
  };
  const withDay = (day) =>
    pick(
      new Date(
        day.getFullYear(),
        day.getMonth(),
        day.getDate(),
        chosen.getHours(),
        chosen.getMinutes(),
      ),
    );
  const withTime = (hours, minutes) =>
    pick(
      new Date(
        chosen.getFullYear(),
        chosen.getMonth(),
        chosen.getDate(),
        hours,
        minutes,
      ),
    );

  // Six weeks from the Monday (or the locale's first day) on or before the 1st.
  const firstDay = new Intl.Locale(language).getWeekInfo?.().firstDay % 7 || 1;
  const lead = (month.getDay() - firstDay + 7) % 7;
  const days = Array.from(
    { length: 42 },
    (_, i) => new Date(month.getFullYear(), month.getMonth(), 1 - lead + i),
  );
  const weekdays = days
    .slice(0, 7)
    .map((day) => day.toLocaleDateString(language, { weekday: "narrow" }));
  const today = new Date();
  const hourLabel = (hour) =>
    new Date(2000, 0, 1, hour).toLocaleTimeString(language, {
      hour: "numeric",
    });
  const canGoBack =
    !earliest ||
    month > new Date(earliest.getFullYear(), earliest.getMonth(), 1);
  const tooEarly = (hours, minutes) =>
    earliest &&
    new Date(
      chosen.getFullYear(),
      chosen.getMonth(),
      chosen.getDate(),
      hours,
      minutes,
    ) < new Date(earliest.getTime() - 899000);

  return (
    <div ref={root} className={`dtp ${className}`} style={style}>
      <button
        ref={button}
        type="button"
        className="dtp-field"
        disabled={disabled}
        aria-haspopup="dialog"
        aria-expanded={open}
        onClick={toggle}
      >
        <span>
          {chosen.toLocaleString(language, {
            weekday: "short",
            day: "numeric",
            month: "long",
            hour: "numeric",
            minute: "2-digit",
          })}
        </span>
        <Icon name="chevron" />
      </button>
      {presence.mounted &&
        host &&
        createPortal(
          <div
            ref={panel}
            inert={presence.closing}
            aria-hidden={presence.closing || undefined}
            role="dialog"
            aria-label={t(label)}
            className={`dtp-panel ${presence.closing ? "is-closing" : ""}`.trim()}
            onAnimationEnd={presence.onAnimationEnd}
          >
            <div className="dtp-calendar">
              <div className="dtp-head">
                <strong>
                  {month.toLocaleDateString(language, {
                    month: "long",
                    year: "numeric",
                  })}
                </strong>
                <button
                  type="button"
                  className="dtp-nav dtp-prev"
                  aria-label={t("Previous month")}
                  disabled={!canGoBack}
                  onClick={() =>
                    setMonth(
                      new Date(month.getFullYear(), month.getMonth() - 1, 1),
                    )
                  }
                >
                  <Icon name="chevron" />
                </button>
                <button
                  type="button"
                  className="dtp-nav dtp-next"
                  aria-label={t("Next month")}
                  onClick={() =>
                    setMonth(
                      new Date(month.getFullYear(), month.getMonth() + 1, 1),
                    )
                  }
                >
                  <Icon name="chevron" />
                </button>
              </div>
              <div className="dtp-grid" role="grid">
                {weekdays.map((name, i) => (
                  <span key={`w${i}`} className="dtp-weekday">
                    {name}
                  </span>
                ))}
                {days.map((day) => (
                  <button
                    key={day.getTime()}
                    type="button"
                    className={`dtp-day ${day.getMonth() !== month.getMonth() ? "is-outside" : ""} ${sameDay(day, today) ? "is-today" : ""}`.trim()}
                    aria-selected={sameDay(day, chosen)}
                    disabled={Boolean(earliest) && day < startOfDay(earliest)}
                    onClick={() => withDay(day)}
                  >
                    {day.getDate()}
                  </button>
                ))}
              </div>
            </div>
            <div className="dtp-times">
              <div className="dtp-column" role="listbox" aria-label={t("Hour")}>
                {Array.from({ length: 24 }, (_, hour) => (
                  <button
                    key={hour}
                    type="button"
                    role="option"
                    aria-selected={chosen.getHours() === hour}
                    disabled={tooEarly(hour, 45)}
                    onClick={() => withTime(hour, chosen.getMinutes())}
                  >
                    {hourLabel(hour)}
                  </button>
                ))}
              </div>
              <div
                className="dtp-column"
                role="listbox"
                aria-label={t("Minute")}
              >
                {MINUTES.map((minutes) => (
                  <button
                    key={minutes}
                    type="button"
                    role="option"
                    aria-selected={chosen.getMinutes() === minutes}
                    disabled={tooEarly(chosen.getHours(), minutes)}
                    onClick={() => withTime(chosen.getHours(), minutes)}
                  >
                    :{String(minutes).padStart(2, "0")}
                  </button>
                ))}
              </div>
            </div>
            <div className="dtp-foot">
              <button
                type="button"
                className="dtp-done"
                onClick={() => {
                  setOpen(false);
                  button.current?.focus();
                }}
              >
                {t("Done")}
              </button>
            </div>
          </div>,
          host,
        )}
    </div>
  );
}
