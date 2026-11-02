import { motionEase } from "./hooks/motion.js";
import React from "react";
import { useLayoutEffect, useRef } from "react";
import Menu, { MenuItem, MenuSeparator } from "./ui/Menu.jsx";
import AccountAvatar from "./AccountAvatar.jsx";
import VerificationBadge from "./VerificationBadge.jsx";
import Icon from "./Icon.jsx";
import { Bone } from "./ui/Skeleton.jsx";
function AccountShell({ children }) {
  const root = useRef(null);
  const content = useRef(null);
  const width = useRef(42);
  useLayoutEffect(() => {
    const element = root.current;
    const inner = content.current;
    let reveal;
    const measure = () => {
      const next = Math.ceil(inner.getBoundingClientRect().width);
      if (!next || next === width.current) return;
      const previous = width.current;
      width.current = next;
      element.style.width = `${next}px`;
      reveal?.cancel();
      if (
        !matchMedia("(prefers-reduced-motion: reduce)").matches &&
        next > previous
      ) {
        reveal = inner.animate(
          [
            {
              opacity: 0,
              clipPath: `inset(0 0 0 ${next - previous}px round 24px)`,
            },
            { opacity: 1, clipPath: "inset(0 0 0 0 round 24px)" },
          ],
          { duration: 280, easing: motionEase(element) },
        );
      }
    };
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(inner);
    return () => {
      observer.disconnect();
      reveal?.cancel();
    };
  }, []);
  return (
    <div ref={root} className="account-wrap account-shell">
      <div ref={content} className="account-content">
        {children}
      </div>
    </div>
  );
}

export default function AccountMenu({
  account,
  ready = true,
  onSignOut,
  menuContent,
  signingOut = false,
  guestContent,
}) {
  return (
    <AccountShell>
      {!ready ? (
        <div
          className="account account-placeholder"
          role="status"
          aria-label="Loading account"
        >
          <Bone className="bone-avatar" />
        </div>
      ) : !account ? (
        guestContent || null
      ) : (
        <Menu
          trigger={(props) => (
            <button
              {...props}
              type="button"
              className="account"
              aria-label={`Account: ${account.name}`}
              disabled={signingOut}
              aria-busy={signingOut || undefined}
            >
              {signingOut ? (
                "Signing out…"
              ) : (
                <>
                  <AccountAvatar name={account.name} src={account.avatar} />
                  <span className="account-label">{account.name}</span>
                  <VerificationBadge verified={account.verified} />
                  <Icon name="chevron" />
                </>
              )}
            </button>
          )}
        >
          <div className="menu-profile">
            <strong>{account.name}</strong>
            <span>{account.email}</span>
          </div>
          {menuContent && (
            <>
              <MenuSeparator />
              {menuContent}
            </>
          )}
          {onSignOut && (
            <>
              <MenuSeparator />
              <MenuItem icon="logout" danger onSelect={onSignOut}>
                Sign out
              </MenuItem>
            </>
          )}
        </Menu>
      )}
    </AccountShell>
  );
}
