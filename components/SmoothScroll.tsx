'use client';

import { useEffect } from 'react';
import Lenis from 'lenis';
import 'lenis/dist/lenis.css';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/**
 * Lenis wraps native scroll rather than replacing it, so `position: sticky`,
 * keyboard paging and accessibility all survive. That is why it is here
 * instead of ScrollSmoother.
 *
 * Never run two scroll systems at once.
 */
export default function SmoothScroll() {
  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    // touch scrolling is better native than simulated, and reduced-motion
    // users asked for no vestibular smoothing
    const coarse = window.matchMedia('(pointer: coarse)').matches;
    if (reduced || coarse) return;

    const lenis = new Lenis();
    // exposed so components (the hero's email capture) can scroll through Lenis
    // rather than fighting it with a native window.scrollTo
    (window as unknown as { __lenis?: Lenis }).__lenis = lenis;

    lenis.on('scroll', ScrollTrigger.update);
    const tick = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);

    /**
     * Route in-page anchors through Lenis. Left alone, the browser performs an
     * instant native jump while every other scroll on the page is smoothed —
     * and with Lenis's transform offset active the landing position is wrong.
     */
    const onClick = (event: MouseEvent) => {
      if (event.defaultPrevented || event.button !== 0) return;
      if (event.metaKey || event.ctrlKey || event.shiftKey) return;

      const anchor = (event.target as HTMLElement)?.closest?.('a[href^="#"]');
      if (!anchor) return;

      const hash = anchor.getAttribute('href');
      if (!hash || hash === '#') return;

      const target = document.querySelector(hash);
      if (!target) return;

      event.preventDefault();
      const masthead = document.querySelector('header');
      const offset = -((masthead?.getBoundingClientRect().height ?? 0) + 16);
      lenis.scrollTo(target as HTMLElement, { offset });
      history.pushState(null, '', hash);
    };

    document.addEventListener('click', onClick);

    return () => {
      document.removeEventListener('click', onClick);
      gsap.ticker.remove(tick);
      delete (window as unknown as { __lenis?: Lenis }).__lenis;
      lenis.destroy();
    };
  }, []);

  return null;
}
