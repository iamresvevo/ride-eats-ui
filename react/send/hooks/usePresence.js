import { useState } from "react";

/** Keep a closing surface mounted until its own exit animation ends. */
export default function usePresence(open) {
  const [mounted, setMounted] = useState(open);
  if (open && !mounted) setMounted(true);
  return {
    mounted,
    closing: mounted && !open,
    onAnimationEnd: (event) => {
      if (event.target === event.currentTarget && !open) setMounted(false);
    },
  };
}
