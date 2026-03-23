import { useState, useEffect, type MutableRefObject } from 'react';

export const useVisibility = (ref: MutableRefObject<HTMLElement | null>) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const target = ref.current;
    if (!target) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
      },
      {
        root: null,
        rootMargin: '0px',
        threshold: 0.1,
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