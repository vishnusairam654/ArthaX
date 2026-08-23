"use client";

import gsap from "gsap";

/**
 * ARTHAX motion baseline (gsap-animation-design).
 * One engine for scroll/timeline. Every helper respects prefers-reduced-motion.
 */

export function prefersReducedMotion(): boolean {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

/** Staggered entrance — decelerating, never a plain fade-in-up-by-default. */
export function assembleIn(elements: Element[] | NodeListOf<Element>): void {
  if (prefersReducedMotion()) return;
  gsap.from(elements, {
    y: 24,
    autoAlpha: 0,
    duration: 0.55,
    ease: "power2.out",
    stagger: 0.06,
    clearProps: "all",
  });
}

/** Gold shine sweep for reward/unlock moments (Shop). */
export function shineSweep(el: Element): void {
  if (prefersReducedMotion()) return;
  gsap.fromTo(
    el,
    { filter: "brightness(1)" },
    { filter: "brightness(1.25)", duration: 0.28, yoyo: true, repeat: 1, ease: "power1.inOut" },
  );
}
