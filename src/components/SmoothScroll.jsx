// SmoothScroll.jsx
import React, { useEffect, useRef } from 'react';
import Lenis from 'lenis';

const SmoothScroll = ({ children }) => {
  const lenisRef = useRef(null);
  const rafRef = useRef(null);

  useEffect(() => {
    // SSR guard
    if (typeof window === 'undefined') return;

    // Respect user's motion preference
    if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      // Do not enable smooth scrolling for users who prefer reduced motion.
      return;
    }

    // Create Lenis with tuned options for smooth, elegant scrolling
    const lenis = new Lenis({
      duration: 6.2,                     // slower, graceful feeling
      easing: (t) => 1 - Math.pow(1 - t, 4), // smooth quartic curve
      direction: 'vertical',
      gestureDirection: 'vertical',
      smooth: true,
      smoothTouch: true,                 // smooth on touch devices too
      mouseMultiplier: 0.9,              // gentle mouse wheel sensitivity
      touchMultiplier: 0.9,              // gentle touch sensitivity
      wheelMultiplier: 0.75,
      infinite: false,
      lerp: 0.07,                        // smoother interpolation without large lag
      orientation: 'vertical',
      syncTouch: true,                   // better synchronization for touch
      // Prevent smoothing on nodes containing id="no-smooth"
      prevent: (node) => !!node && node.id === 'no-smooth',
    });

    lenisRef.current = lenis;

    // Simple, continuous RAF loop — let Lenis manage frame timing
    const raf = (time) => {
      lenis.raf(time);
      rafRef.current = requestAnimationFrame(raf);
    };

    rafRef.current = requestAnimationFrame(raf);

    // Resize / orientation handling
    let resizeTimer;
    const handleResize = () => {
      // debounce a tiny bit to avoid thrashing during continuous resize
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        lenis.resize();
      }, 16);
    };

    window.addEventListener('resize', handleResize, { passive: true });
    window.addEventListener('orientationchange', handleResize);

    // Cleanup
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      clearTimeout(resizeTimer);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('orientationchange', handleResize);
      if (lenisRef.current) {
        try {
          lenisRef.current.destroy();
        } catch (e) {
          // safe fallback
        }
      }
    };
  }, []);

  return <>{children}</>;
};

export default SmoothScroll;
