'use client';

import { useEffect, useRef, type ElementType, type ReactNode } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

type Props = {
  children: ReactNode;
  as?: ElementType;
  className?: string;
  /** seconds of delay, for staggering siblings by hand */
  delay?: number;
  /** px of travel. Kept small — large translations read as a template. */
  y?: number;
  /** scrub the element against scroll instead of playing once on entry */
  parallax?: number;
};

/**
 * Entry reveal, and optionally a parallax drift.
 *
 * Deliberately restrained: 24px of travel and a 1.1s expo.out. The rule in
 * this aesthetic is that motion applies to *some* layers, not all of them —
 * uniform animation is the tell of a templated site.
 */
export default function Reveal({
  children,
  as: Tag = 'div',
  className,
  delay = 0,
  y = 24,
  parallax,
}: Props) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // Anything already on screen at mount is not something you scroll to — and
    // animating it from opacity 0 delays Largest Contentful Paint by the whole
    // tween. Measured: the hero's candour line was the LCP element at 2.7s.
    if (el.getBoundingClientRect().top < window.innerHeight) return;

    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia();

      mm.add(
        {
          motion: '(prefers-reduced-motion: no-preference)',
          reduced: '(prefers-reduced-motion: reduce)',
        },
        (context) => {
          const { reduced } = context.conditions as { reduced: boolean };

          // reduced-motion still gets the reveal, just without the travel —
          // "no vestibular motion", not "no visual"
          gsap.from(el, {
            opacity: 0,
            y: reduced ? 0 : y,
            duration: reduced ? 0.3 : 1.1,
            delay,
            ease: 'expo.out',
            scrollTrigger: { trigger: el, start: 'top 88%', once: true },
          });

          if (parallax && !reduced) {
            gsap.to(el, {
              yPercent: parallax,
              ease: 'none',
              scrollTrigger: {
                trigger: el,
                start: 'top bottom',
                end: 'bottom top',
                // 1s of catch-up is what gives the drift weight; `true` is
                // rigid and reads mechanical
                scrub: 1,
              },
            });
          }
        }
      );
    }, ref);

    return () => ctx.revert();
  }, [delay, y, parallax]);

  return (
    <Tag ref={ref} className={className}>
      {children}
    </Tag>
  );
}
