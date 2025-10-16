import { useEffect } from 'react';
import Lenis from 'lenis';

const SmoothScroll = ({ children }) => {
  useEffect(() => {
    // Initialize Lenis with POLISHED PROFESSIONAL settings - slower but more elegant
    const lenis = new Lenis({
      duration: 1.8, // Slower, more graceful scrolling for professional feel
      easing: (t) => 1 - Math.pow(1 - t, 5), // Quintic easing for ultra-polished curves
      direction: 'vertical',
      gestureDirection: 'vertical',
      smooth: true,
      mouseMultiplier: 0.6, // Reduced sensitivity for polished, professional feel
      smoothTouch: false,
      touchMultiplier: 0.8, // Gentle touch response
      infinite: false,
      lerp: 0.1, // Very smooth interpolation for polished animation
      orientation: 'vertical',
      prevent: (node) => node.id === 'no-smooth',
      syncTouch: false,
      wheelMultiplier: 0.5, // Gentle wheel sensitivity for professional feel
    });

    // Polished animation loop with consistent timing
    let rafId;
    let lastTime = 0;
    const raf = (time) => {
      // Consistent frame timing for professional smoothness
      if (time - lastTime >= 16) { // ~60fps
        lenis.raf(time);
        lastTime = time;
      }
      rafId = requestAnimationFrame(raf);
    };

    rafId = requestAnimationFrame(raf);

    // Professional resize handling
    let resizeTimeout;
    const handleResize = () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(() => {
        lenis.resize();
      }, 75); // Slightly slower for polished feel
    };

    window.addEventListener('resize', handleResize, { passive: true });

    // Clean professional cleanup
    return () => {
      if (rafId) {
        cancelAnimationFrame(rafId);
      }
      clearTimeout(resizeTimeout);
      window.removeEventListener('resize', handleResize);
      lenis.destroy();
    };
  }, []);

  return <>{children}</>;
};

export default SmoothScroll;
