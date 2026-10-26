"use client";

import { useEffect, useRef, useState, type CSSProperties, type ReactNode, type TransitionEvent } from "react";
import styles from "./auto-carousel.module.css";

type CarouselProps = {
  items: ReactNode[];
  label: string;
  desktopVisible?: number;
  tabletVisible?: number;
};

/** Infinite, accessible carousel; manual navigation suspends autoplay for 10 seconds. */
export function AutoCarousel({ items, label, desktopVisible = 3, tabletVisible = 2 }: CarouselProps) {
  const count = items.length;
  const clones = count < 2 ? 0 : Math.min(3, count);
  const [position, setPosition] = useState(clones);
  const [animated, setAnimated] = useState(true);
  const [motionAllowed, setMotionAllowed] = useState(false);
  const pausedUntil = useRef(0);
  const lastAdvance = useRef(0);
  const locked = useRef(false);
  const touchStart = useRef<number | null>(null);

  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setMotionAllowed(!query.matches);
    update();
    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    if (count < 2 || !motionAllowed) return;
    lastAdvance.current = Date.now();
    const timer = window.setInterval(() => {
      const now = Date.now();
      if (
        now < pausedUntil.current || document.hidden || locked.current ||
        now - lastAdvance.current < 6000
      ) return;
      locked.current = true;
      lastAdvance.current = now;
      setPosition((current) => current + 1);
    }, 500);
    return () => window.clearInterval(timer);
  }, [count, motionAllowed]);

  function move(delta: number) {
    if (count < 2 || locked.current) return;
    pausedUntil.current = Date.now() + 10000;
    lastAdvance.current = Date.now();
    if (!motionAllowed) {
      setPosition((current) => ((current - clones + delta + count) % count) + clones);
      return;
    }
    locked.current = true;
    setAnimated(true);
    setPosition((current) => current + delta);
  }

  function onTransitionEnd(event: TransitionEvent<HTMLDivElement>) {
    if (event.target !== event.currentTarget || event.propertyName !== "transform") return;
    locked.current = false;
    if (position >= clones + count || position < clones) {
      const normalized = ((position - clones) % count + count) % count + clones;
      setAnimated(false);
      setPosition(normalized);
      window.requestAnimationFrame(() => window.requestAnimationFrame(() => setAnimated(true)));
    }
  }

  const loopedItems = count < 2 ? items : [
    ...items.slice(-clones), ...items, ...items.slice(0, clones),
  ];
  const vars = {
    "--position": position,
    "--tablet-visible": Math.min(tabletVisible, Math.max(1, count)),
    "--desktop-visible": Math.min(desktopVisible, Math.max(1, count)),
  } as CSSProperties;

  return (
    <section className={styles.carousel} aria-label={label} role="region" aria-roledescription="kaydırmalı galeri"
      style={vars}
    >
      <div className={styles.viewport}
        onTouchStart={(event) => { touchStart.current = event.touches[0]?.clientX ?? null; }}
        onTouchEnd={(event) => {
          if (touchStart.current === null) return;
          const difference = touchStart.current - (event.changedTouches[0]?.clientX ?? touchStart.current);
          touchStart.current = null;
          if (Math.abs(difference) > 50) move(difference > 0 ? 1 : -1);
        }}>
        <div className={styles.track} onTransitionEnd={onTransitionEnd}
          style={{ transitionDuration: animated && motionAllowed ? "550ms" : "0ms" }}>
          {loopedItems.map((item, index) => (
            <div key={index} className={styles.slide}
              aria-hidden={count > 1 && (index < clones || index >= count + clones) && (index < position || index >= position + 3) ? true : undefined}
              inert={count > 1 && (index < clones || index >= count + clones) && (index < position || index >= position + 3) ? true : undefined}>
              {item}
            </div>
          ))}
        </div>
      </div>
      {count > 1 && (
        <div className={styles.controls}>
          <div className="flex gap-2">
            <button type="button" aria-label={label + ": önceki"} onClick={() => move(-1)}
              className={styles.arrow}>←</button>
            <button type="button" aria-label={label + ": sonraki"} onClick={() => move(1)}
              className={styles.arrow}>→</button>
          </div>
        </div>
      )}
    </section>
  );
}
