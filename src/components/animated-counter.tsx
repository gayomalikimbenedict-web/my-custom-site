"use client";

import { useEffect, useRef, useState } from "react";

type AnimatedCounterProps = {
  value: number;
  duration?: number;
  prefix?: string;
  suffix?: string;
};

export function AnimatedCounter({
  value,
  duration = 1200,
  prefix = "",
  suffix = "",
}: AnimatedCounterProps) {
  const counterRef = useRef<HTMLOutputElement>(null);
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    const counter = counterRef.current;
    if (!counter) return;

    const motionPreference = window.matchMedia("(prefers-reduced-motion: reduce)");
    let observer: IntersectionObserver | undefined;
    let frame = 0;
    let started = false;

    const finish = () => {
      started = true;
      setDisplayValue(value);
    };

    const start = () => {
      if (started) return;
      started = true;

      if (motionPreference.matches || duration <= 0) {
        setDisplayValue(value);
        return;
      }

      const startTime = performance.now();
      const tick = (now: number) => {
        const progress = Math.min(1, (now - startTime) / duration);
        const easedProgress = 1 - (1 - progress) ** 3;
        setDisplayValue(Math.round(value * easedProgress));
        if (progress < 1) frame = requestAnimationFrame(tick);
      };

      frame = requestAnimationFrame(tick);
    };

    const syncMotionPreference = () => {
      if (motionPreference.matches) {
        observer?.disconnect();
        cancelAnimationFrame(frame);
        finish();
      }
    };

    if (motionPreference.matches || !("IntersectionObserver" in window)) {
      start();
    } else {
      observer = new IntersectionObserver((entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          observer?.disconnect();
          start();
        }
      }, { threshold: 0.25 });
      observer.observe(counter);
    }

    motionPreference.addEventListener("change", syncMotionPreference);

    return () => {
      observer?.disconnect();
      motionPreference.removeEventListener("change", syncMotionPreference);
      cancelAnimationFrame(frame);
    };
  }, [duration, value]);

  return (
    <output ref={counterRef} aria-label={`${prefix}${value.toLocaleString()}${suffix}`}>
      <span aria-hidden="true">
        {prefix}{displayValue.toLocaleString()}{suffix}
      </span>
    </output>
  );
}