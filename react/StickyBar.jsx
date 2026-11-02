import React, { useLayoutEffect, useRef } from 'react';

/** Tools' auto-floating toolbar. Keep it inside the scrollable content it serves. */
export function StickyBar({ children, offset, fade = true, blur = true, className = '', style, label = 'Page controls' }) {
  const sentinel = useRef(null), bar = useRef(null);
  useLayoutEffect(() => {
    const node = bar.current, marker = sentinel.current;
    let scrollRoot = node.parentElement;
    while (scrollRoot && !/(auto|scroll|overlay)/.test(getComputedStyle(scrollRoot).overflowY)) scrollRoot = scrollRoot.parentElement;
    let previous = -1;
    const paint = () => {
      const top = (parseFloat(getComputedStyle(node).top) || 0) + (scrollRoot ? scrollRoot.getBoundingClientRect().top + scrollRoot.clientTop : 0);
      const distance = top - marker.getBoundingClientRect().top;
      const progress = Math.round(Math.max(0, Math.min(1, distance / 24)) * 100) / 100;
      if (progress === previous) return;
      previous = progress;
      node.dataset.floating = String(distance > 0);
      node.style.setProperty('--float-progress', String(progress));
    };
    const resize = new ResizeObserver(paint);
    resize.observe(node);
    if (scrollRoot) resize.observe(scrollRoot);
    document.addEventListener('scroll', paint, { capture: true, passive: true });
    window.addEventListener('resize', paint, { passive: true });
    paint();
    return () => { resize.disconnect(); document.removeEventListener('scroll', paint, true); window.removeEventListener('resize', paint); };
  }, [offset]);
  return <>
    <div ref={sentinel} className="re-sticky-sentinel" aria-hidden="true" />
    <div ref={bar} className={`re-sticky-bar ${className}`} role="group" aria-label={label}
      data-blur={blur || undefined} data-fade={fade || undefined}
      style={{...(offset == null ? {} : {'--float-offset':typeof offset === 'number' ? `${offset}px` : offset}),...style}}>
      {fade && <span className="re-floater-fade" aria-hidden="true"><i /><i /><i /></span>}
      {children}
    </div>
  </>;
}
