'use client';

import { useEffect, useRef, type ReactNode } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/**
 * Draws the hairline rules inside a block outward from the left, then fills any
 * proportional bars.
 *
 * The point is that both are *directional facts*: a document is ruled left to
 * right, and a schedule bar encodes elapsed time. Neither is decoration, which
 * is why they animate and the surrounding type does not — motion applies to
 * some layers, not all.
 */

type Props = {
  children: ReactNode;
  className?: string;
  /** selector for elements whose border should draw; they get a scaleX sweep */
  rules?: string;
  /** selector for proportional bars that should fill */
  bars?: string;
  stagger?: number;
};

export default function Draw({
  children,
  className,
  rules,
  bars,
  stagger = 0.05,
}: Props) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia();
      mm.add('(prefers-reduced-motion: no-preference)', () => {
        const ruleEls = rules ? el.querySelectorAll<HTMLElement>(rules) : [];
        const barEls = bars ? el.querySelectorAll<HTMLElement>(bars) : [];

        // Reveal vertically, not as a horizontal wipe. A left-origin scaleX on
        // every card and rule made the whole page look like it was sliding in
        // from the left; a fade-and-rise reads calmer and has no direction.
        if (ruleEls.length) {
          gsap.from(ruleEls, {
            opacity: 0,
            y: 14,
            duration: 0.7,
            ease: 'expo.out',
            stagger,
            scrollTrigger: { trigger: el, start: 'top 82%', once: true },
          });
        }

        if (barEls.length) {
          gsap.from(barEls, {
            opacity: 0,
            y: 8,
            duration: 0.6,
            ease: 'power2.out',
            stagger: 0.12,
            scrollTrigger: { trigger: el, start: 'top 78%', once: true },
          });
        }
      });
    }, ref);

    return () => ctx.revert();
  }, [rules, bars, stagger]);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
