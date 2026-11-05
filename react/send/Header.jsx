import NavBadge from "../NavBadge.jsx";
import React from "react";
import { useLayoutEffect, useRef, useState } from "react";
import AccountMenu from "./AccountMenu.jsx";
import Icon from "./Icon.jsx";
export default function Header({
  brand,
  items = [],
  activeValue,
  busy = false,
  onNavigate,
  account,
  loading = false,
  onSignOut,
  signingOut,
  menuContent,
  guestContent,
  extras,
  fade = true,
  fadeSize = 72,
  className = "",
  style,
}) {
  const header = useRef(null);
  useLayoutEffect(() => {
    const element = header.current;
    const app = element.parentElement;
    const resize = () =>
      app.style.setProperty("--header-height", `${element.offsetHeight}px`);
    resize();
    const observer = new ResizeObserver(resize);
    observer.observe(element);
    return () => observer.disconnect();
  }, []);
  // Paint directly from passive scroll events. Safari can defer animation frames
  // during a fast momentum scroll, leaving content exposed behind the controls.
  useLayoutEffect(() => {
    const element = header.current;
    const app = element.parentElement;
    let scrollRoot = app;
    while (
      scrollRoot &&
      !/(auto|scroll|overlay)/.test(getComputedStyle(scrollRoot).overflowY)
    )
      scrollRoot = scrollRoot.parentElement;
    let previous = -1;
    const paint = (offset) => {
      const opacity =
        Math.round(Math.min(1, Math.max(0, offset) / 40) * 100) / 100;
      if (opacity === previous) return;
      previous = opacity;
      element.style.setProperty(
        "--header-blur-opacity",
        String(fade ? opacity : 0),
      );
    };
    const onScroll = (event) => {
      if (
        event.target === document ||
        event.target === window ||
        event.target === document.scrollingElement
      )
        paint(scrollRoot ? scrollRoot.scrollTop : window.scrollY);
      else if (event.target === scrollRoot) paint(scrollRoot.scrollTop);
      else if (
        event.target instanceof HTMLElement &&
        event.target.matches(".page:not([hidden])") &&
        event.target.parentElement === app
      )
        paint(event.target.scrollTop);
    };
    paint(
      scrollRoot
        ? scrollRoot.scrollTop
        : window.scrollY ||
            app.querySelector(":scope > .page:not([hidden])")?.scrollTop ||
            0,
    );
    document.addEventListener("scroll", onScroll, {
      passive: true,
      capture: true,
    });
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      document.removeEventListener("scroll", onScroll, true);
      window.removeEventListener("scroll", onScroll);
    };
  }, [activeValue, fade]);
  // One pill slides to the active tab, like the app's tab bar.
  const nav = useRef(null);
  const navShell = useRef(null);
  const edgeMotion = useRef(() => {});
  const [edges, setEdges] = useState({ left: false, right: false });
  const pill = useRef(null);
  const navItems = useRef(null);
  useLayoutEffect(() => {
    const element = nav.current;
    const shell = navShell.current;
    const content = navItems.current;
    const reduced = matchMedia("(prefers-reduced-motion: reduce)");
    const fine = matchMedia("(hover: hover) and (pointer: fine)");
    let frame = 0,
      velocity = 0,
      target = 0,
      previous = 0;
    const update = () => {
      const left = element.scrollLeft > 2;
      const right =
        element.scrollWidth - element.clientWidth - element.scrollLeft > 2;
      setEdges((old) =>
        old.left === left && old.right === right ? old : { left, right },
      );
    };
    const reveal = (link, smooth = true) => {
      if (!link) return;
      const start = link.offsetLeft;
      const end = start + link.offsetWidth;
      const margin = 32;
      if (
        start < element.scrollLeft + margin ||
        end > element.scrollLeft + element.clientWidth - margin
      )
        element.scrollTo({
          left: Math.max(
            0,
            start - (element.clientWidth - link.offsetWidth) / 2,
          ),
          behavior: smooth && !reduced.matches ? "smooth" : "instant",
        });
    };
    const resize = () => {
      shell.style.maxWidth = `${Math.ceil(content.getBoundingClientRect().width) + 8}px`;
      reveal(element.querySelector(".nav-active"), false);
      update();
    };
    const step = (time) => {
      const dt = Math.min(32, previous ? time - previous : 16);
      previous = time;
      velocity += (target - velocity) * (1 - Math.exp(-dt / 140));
      const before = element.scrollLeft;
      element.scrollLeft += (velocity * dt) / 1000;
      if (
        (target === 0 && Math.abs(velocity) < 1) ||
        (Math.abs(element.scrollLeft - before) < 0.01 && target !== 0)
      ) {
        frame = 0;
        velocity = 0;
        previous = 0;
        return;
      }
      frame = requestAnimationFrame(step);
    };
    edgeMotion.current = (direction, immediate = false) => {
      if (immediate) {
        stop();
        return;
      }
      target = !reduced.matches && fine.matches ? direction * 320 : 0;
      if (!frame && (target || velocity)) frame = requestAnimationFrame(step);
    };
    const focus = (event) => {
      if (event.target.matches("a")) reveal(event.target);
    };
    const stop = () => {
      target = 0;
      velocity = 0;
      cancelAnimationFrame(frame);
      frame = 0;
      previous = 0;
    };
    element.addEventListener("scroll", update, { passive: true });
    element.addEventListener("focusin", focus);
    element.addEventListener("pointerdown", stop, { passive: true });
    element.addEventListener("wheel", stop, { passive: true });
    window.addEventListener("blur", stop);
    reduced.addEventListener("change", stop);
    const observer = new ResizeObserver(resize);
    observer.observe(content);
    observer.observe(shell);
    resize();
    reveal(element.querySelector(".nav-active"));
    return () => {
      stop();
      observer.disconnect();
      edgeMotion.current = () => {};
      element.removeEventListener("scroll", update);
      element.removeEventListener("focusin", focus);
      element.removeEventListener("pointerdown", stop);
      element.removeEventListener("wheel", stop);
      window.removeEventListener("blur", stop);
      reduced.removeEventListener("change", stop);
    };
  }, [activeValue, items]);
  const nudge = (direction) => {
    edgeMotion.current(0, true);
    const element = nav.current;
    element.scrollBy({
      left: direction * element.clientWidth * 0.65,
      behavior: matchMedia("(prefers-reduced-motion: reduce)").matches
        ? "instant"
        : "smooth",
    });
  };
  useLayoutEffect(() => {
    const place = () => {
      const active = nav.current?.querySelector(".nav-active");
      const element = pill.current;
      if (!element) return;
      if (!active) {
        element.style.opacity = "0";
        return;
      }
      const animate = element.style.opacity === "1";
      if (!animate) element.style.transition = "none";
      element.style.width = `${active.offsetWidth}px`;
      element.style.transform = `translateX(${active.offsetLeft}px)`;
      element.style.opacity = "1";
      if (!animate) {
        void element.offsetWidth;
        element.style.transition = "";
      }
    };
    place();
    const observer = new ResizeObserver(place);
    observer.observe(nav.current);
    observer.observe(navItems.current);
    return () => observer.disconnect();
  }, [activeValue, items]);
  return (
    <header
      ref={header}
      className={`site-header site-header-scope send-header ${className}`}
      style={{ "--header-fade-size": `${Math.max(0, fadeSize)}px`, ...style }}
    >
      <div className="header-blur" aria-hidden="true" />
      <a
        className="brand"
        href={brand.href || "/"}
        aria-label={`${brand.name} home`}
      >
        {brand.logoLight && (
          <img className="logo-light" src={brand.logoLight} alt="" />
        )}
        {brand.logoDark && (
          <img className="logo-dark" src={brand.logoDark} alt="" />
        )}
        <span className="brand-name">{brand.name}</span>
      </a>
      <div
        ref={navShell}
        className="site-nav-shell"
        data-overflow-left={edges.left || undefined}
        data-overflow-right={edges.right || undefined}
        onPointerLeave={() => edgeMotion.current(0)}
      >
        <nav ref={nav} className="site-nav" aria-label={"Main navigation"}>
          <span ref={pill} className="nav-pill" aria-hidden="true" />
          <div ref={navItems} className="site-nav-items">
            {items.map((item) => (
              <a
                key={item.value}
                href={item.href}
                className={
                  activeValue === item.value ? "nav-active" : undefined
                }
                aria-current={activeValue === item.value ? "page" : undefined}
                onClick={(event) => {
                  if (busy) {
                    event.preventDefault();
                    return;
                  }
                  if (
                    onNavigate &&
                    !event.metaKey &&
                    !event.ctrlKey &&
                    !event.shiftKey &&
                    !event.altKey
                  ) {
                    event.preventDefault();
                    onNavigate(item);
                  }
                }}
              >
                {item.icon && <Icon name={item.icon} />} {item.label}
                <NavBadge count={item.count} badge={item.badge} />
              </a>
            ))}
          </div>
        </nav>
        {["left", "right"].map(
          (side, index) =>
            edges[side] && (
              <button
                key={side}
                type="button"
                className={`site-nav-edge site-nav-edge-${side}`}
                aria-label={`Scroll navigation ${side}`}
                onPointerEnter={() => edgeMotion.current(index ? 1 : -1)}
                onPointerLeave={() => edgeMotion.current(0)}
                onClick={() => nudge(index ? 1 : -1)}
              >
                <Icon name={`chevron-${side}`} />
              </button>
            ),
        )}
      </div>
      <div className="header-account">
        {extras}
        <AccountMenu
          account={account}
          ready={!loading}
          onSignOut={onSignOut}
          signingOut={signingOut}
          menuContent={menuContent}
          guestContent={guestContent}
        />
      </div>
    </header>
  );
}
