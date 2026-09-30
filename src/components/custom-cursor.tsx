"use client";

import { useEffect, useRef, useState } from "react";

export function CustomCursor() {
  const cursorRef = useRef<HTMLSpanElement>(null);
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    const pointerPreference = window.matchMedia("(hover: hover) and (pointer: fine)");
    const motionPreference = window.matchMedia("(prefers-reduced-motion: reduce)");
    let active = false;

    const syncPreferences = () => {
      active = pointerPreference.matches && !motionPreference.matches;
      document.documentElement.classList.toggle("custom-cursor-enabled", active);
      if (!active && cursorRef.current) cursorRef.current.style.opacity = "0";
      setEnabled(active);
    };

    const moveCursor = (event: PointerEvent) => {
      const cursor = cursorRef.current;
      if (!active || !cursor) return;

      cursor.style.transform = `translate3d(${event.clientX}px, ${event.clientY}px, 0) translate(-50%, -50%)`;
      cursor.style.opacity = "1";
    };

    const hideCursor = () => {
      if (cursorRef.current) cursorRef.current.style.opacity = "0";
    };

    syncPreferences();
    pointerPreference.addEventListener("change", syncPreferences);
    motionPreference.addEventListener("change", syncPreferences);
    window.addEventListener("pointermove", moveCursor, { passive: true });
    window.addEventListener("pointerleave", hideCursor);
    window.addEventListener("blur", hideCursor);

    return () => {
      pointerPreference.removeEventListener("change", syncPreferences);
      motionPreference.removeEventListener("change", syncPreferences);
      window.removeEventListener("pointermove", moveCursor);
      window.removeEventListener("pointerleave", hideCursor);
      window.removeEventListener("blur", hideCursor);
      document.documentElement.classList.remove("custom-cursor-enabled");
    };
  }, []);

  if (!enabled) return null;

  return <span ref={cursorRef} className="custom-cursor" aria-hidden="true" />;
}