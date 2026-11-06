import React, { useEffect, useRef, useState } from "react";
import { Dialog, Button, Icon } from "./index.jsx";

/** Lazy, asynchronous sources keep authentication and caching in the consuming app. */
export function ImageThumbnail({
  src,
  load,
  alt = "",
  label = "Open image",
  onClick,
  size = 56,
}) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  const [attempt, setAttempt] = useState(0);
  const [state, setState] = useState({});
  useEffect(() => {
    if (!ref.current) return;
    if (typeof IntersectionObserver === "undefined") {
      setVisible(true);
      return;
    }
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin: "100px" },
    );
    observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);
  useEffect(() => {
    if (!visible) return;
    const controller = new AbortController();
    setState({ loading: true });
    Promise.resolve()
      .then(() => src || load?.({ signal: controller.signal }))
      .then(
        (url) => {
          if (!controller.signal.aborted)
            setState(url ? { url } : { error: true });
        },
        () => {
          if (!controller.signal.aborted) setState({ error: true });
        },
      );
    return () => controller.abort();
  }, [visible, src, load, attempt]);
  return (
    <button
      ref={ref}
      type="button"
      className="image-thumbnail"
      style={{ width: size, height: size }}
      aria-label={state.error ? `Retry: ${label}` : label}
      aria-busy={state.loading || undefined}
      onClick={() => (state.error ? setAttempt((v) => v + 1) : onClick?.())}
    >
      {state.url ? (
        <img
          src={state.url}
          alt={alt}
          loading="lazy"
          onError={() => setState({ error: true })}
        />
      ) : (
        <Icon name={state.error ? "refresh-cw" : "image"} size={20} />
      )}
    </button>
  );
}

export function ImageGallery({
  items = [],
  open,
  onOpenChange,
  index = 0,
  onIndexChange,
  loadImage,
  renderActions,
  label = "Image gallery",
}) {
  const active = Math.max(0, Math.min(index, items.length - 1));
  const item = items[active];
  const [state, setState] = useState({});
  const [attempt, setAttempt] = useState(0);
  const [zoom, setZoom] = useState(false);
  const currentKey = item?.id ?? active;
  useEffect(() => {
    setZoom(false);
    if (!open || !item) {
      setState({});
      return;
    }
    const controller = new AbortController();
    setState({ loading: true });
    Promise.resolve()
      .then(() => item.src || loadImage?.(item, { signal: controller.signal }))
      .then(
        (url) => {
          if (!controller.signal.aborted)
            setState(url ? { url } : { error: true });
        },
        () => {
          if (!controller.signal.aborted) setState({ error: true });
        },
      );
    return () => controller.abort();
  }, [open, item, loadImage, attempt]);
  useEffect(() => {
    if (!open) return;
    const keydown = (event) => {
      if (
        !event.target.closest?.(".image-gallery") ||
        /INPUT|TEXTAREA|SELECT/.test(event.target.tagName) ||
        event.altKey ||
        event.ctrlKey ||
        event.metaKey
      )
        return;
      if (event.key === "ArrowRight" || event.key === "ArrowLeft") {
        event.preventDefault();
        onIndexChange?.(
          Math.max(
            0,
            Math.min(
              items.length - 1,
              active + (event.key === "ArrowRight" ? 1 : -1),
            ),
          ),
        );
      }
    };
    document.addEventListener("keydown", keydown);
    return () => document.removeEventListener("keydown", keydown);
  }, [open, active, items.length, onIndexChange]);
  const move = (delta) =>
    onIndexChange?.(Math.max(0, Math.min(items.length - 1, active + delta)));
  return (
    <Dialog
      open={open}
      onOpenChange={onOpenChange}
      title={item?.title || label}
      size="lg"
      className="image-gallery"
      footer={
        <div className="image-gallery-controls">
          <div className="image-gallery-navigation">
            <Button
              icon="chevron-left"
              aria-label="Previous image"
              disabled={!active}
              onClick={() => move(-1)}
            />
            <span aria-live="polite">
              {items.length ? active + 1 : 0} / {items.length}
            </span>
            <Button
              icon="chevron-right"
              aria-label="Next image"
              disabled={active >= items.length - 1}
              onClick={() => move(1)}
            />
          </div>
          <Button
            icon={zoom ? "minimize" : "zoom-in"}
            disabled={!state.url}
            onClick={() => setZoom((v) => !v)}
          >
            {zoom ? "Fit image" : "Zoom"}
          </Button>
          {item && renderActions?.(item)}
        </div>
      }
    >
      <div
        className="image-gallery-content"
        tabIndex={0}
        aria-label="Image viewer. Use left and right arrow keys to browse."
      >
        <div
          className="image-gallery-stage"
          data-zoom={zoom || undefined}
          aria-busy={state.loading || undefined}
        >
          {state.loading ? (
            <span role="status">Loading image…</span>
          ) : state.error ? (
            <div role="alert">
              Image unavailable.{" "}
              <Button onClick={() => setAttempt((v) => v + 1)}>Retry</Button>
            </div>
          ) : state.url ? (
            <img
              key={currentKey}
              src={state.url}
              alt={item?.alt || item?.title || "Image"}
              onError={() => setState({ error: true })}
            />
          ) : (
            <span>No images</span>
          )}
        </div>
        {item?.description && (
          <p className="image-gallery-caption">{item.description}</p>
        )}
      </div>
    </Dialog>
  );
}
