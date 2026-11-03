import NavBadge from "../NavBadge.jsx";
import React from "react";
import { useLayoutEffect, useRef } from "react";
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
  const pill = useRef(null);
  const navItems = useRef(null);
  useLayoutEffect(() => {
    const element = nav.current;
    const items = navItems.current;
    const desktop = matchMedia("(min-width: 701px)");
    let initialized = false;
    const resize = () => {
      if (!desktop.matches) {
        element.style.removeProperty("width");
        return;
      }
      const width = Math.ceil(items.getBoundingClientRect().width) + 8;
      if (!initialized) element.style.transition = "none";
      element.style.width = `${width}px`;
      if (!initialized) {
        void element.offsetWidth;
        element.style.removeProperty("transition");
        initialized = true;
      }
    };
    resize();
    const observer = new ResizeObserver(resize);
    observer.observe(items);
    desktop.addEventListener("change", resize);
    return () => {
      observer.disconnect();
      desktop.removeEventListener("change", resize);
    };
  }, []);
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
      <nav ref={nav} className="site-nav" aria-label={"Main navigation"}>
        <span ref={pill} className="nav-pill" aria-hidden="true" />
        <div ref={navItems} className="site-nav-items">
          {items.map((item) => (
            <a
              key={item.value}
              href={item.href}
              className={activeValue === item.value ? "nav-active" : undefined}
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
