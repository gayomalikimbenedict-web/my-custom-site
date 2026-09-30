"use client";

import type { ReactNode } from "react";
import { useEffect, useRef } from "react";

type RevealProps = {
  children: ReactNode;
  className?: string;
};

export function Reveal({ children, className }: RevealProps) {
  const revealRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = revealRef.current;
    if (!element) return;

    const motionPreference = window.matchMedia("(prefers-reduced-motion: reduce)");
    let observer: IntersectionObserver | undefined;

    const observe = () => {
      observer?.disconnect();

      if (motionPreference.matches || !("IntersectionObserver" in window)) {
        element.dataset.revealState = "visible";
        return;
      }

      element.dataset.revealState = "hidden";
      observer = new IntersectionObserver((entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          element.dataset.revealState = "visible";
          observer?.disconnect();
        }
      }, { threshold: 0.15 });
      observer.observe(element);
    };

    observe();
    motionPreference.addEventListener("change", observe);

    return () => {
      observer?.disconnect();
      motionPreference.removeEventListener("change", observe);
    };
  }, []);

  return (
    <div ref={revealRef} className={className} data-reveal-state="hidden">
      {children}
    </div>
  );
}