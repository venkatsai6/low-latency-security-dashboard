import { useState, useEffect, type MutableRefObject } from 'react';

export const useVisibility = (ref: MutableRefObject<HTMLElement | null>) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const target = ref.current;
    if (!target) return;

    // The observer fires whenever the target enters or leaves the viewport
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
      },
      {
        root: null, // relative to the viewport
        rootMargin: '0px',
        threshold: 0.1, // triggers when at least 10% of the video is visible
      }
    );

    observer.observe(target);

    return () => {
      observer.unobserve(target);
      observer.disconnect();
    };
  }, [ref]);

  return isVisible;
};