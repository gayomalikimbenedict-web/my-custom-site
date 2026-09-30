"use client";

import Lenis from "lenis";
import { useEffect } from "react";

export function SmoothScroll() {
  useEffect(() => {
    const motionPreference = window.matchMedia("(prefers-reduced-motion: reduce)");
    let lenis: Lenis | undefined;

    const syncMotionPreference = () => {
      if (motionPreference.matches) {
        lenis?.destroy();
        lenis = undefined;
      } else {
        lenis ??= new Lenis({ autoRaf: true });
      }
    };

    syncMotionPreference();
    motionPreference.addEventListener("change", syncMotionPreference);

    return () => {
      motionPreference.removeEventListener("change", syncMotionPreference);
      lenis?.destroy();
    };
  }, []);

  return null;
}