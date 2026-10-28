import React, { useEffect, useRef, useState } from 'react';

interface RevealOnScrollProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  direction?: 'up' | 'down' | 'left' | 'right' | 'none';
  duration?: number;
  rootMargin?: string;
  threshold?: number;
}

export const RevealOnScroll: React.FC<RevealOnScrollProps> = ({
  children,
  className = '',
  delay = 0,
  direction = 'up',
  duration = 920,
  rootMargin = '100% 0px -40% 0px',
  threshold = 0,
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    // Check prefers-reduced-motion
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setIsVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          // Bidirectional reactivity at the center line:
          // Reveals smoothly when scrolling up into the center line (50% of viewport),
          // Reverses smoothly when scrolling back down below the center line!
          setIsVisible(entry.isIntersecting);
        });
      },
      {
        threshold,
        rootMargin,
      }
    );

    observer.observe(element);

    // Bottom-of-page safety: if the user reaches the absolute bottom of the document,
    // ensure that any elements visible in the viewport are revealed even if they
    // didn't reach the exact center line due to limited scroll space.
    const handleScroll = () => {
      const scrollBottom = window.innerHeight + window.scrollY;
      const docHeight = document.documentElement.scrollHeight;
      if (scrollBottom >= docHeight - 80) {
        const rect = element.getBoundingClientRect();
        if (rect.top < window.innerHeight && rect.bottom > 0) {
          setIsVisible(true);
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      observer.disconnect();
      window.removeEventListener('scroll', handleScroll);
    };
  }, [rootMargin, threshold]);

  const getTransformClass = () => {
    switch (direction) {
      case 'up':
        return isVisible ? 'translate-y-0' : 'translate-y-7';
      case 'down':
        return isVisible ? 'translate-y-0' : '-translate-y-7';
      case 'left':
        return isVisible ? 'translate-x-0' : 'translate-x-7';
      case 'right':
        return isVisible ? 'translate-x-0' : '-translate-x-7';
      case 'none':
      default:
        return '';
    }
  };

  return (
    <div
      ref={ref}
      style={{
        transitionDuration: `${duration}ms`,
        // Stagger when appearing; reverse immediately when scrolling away
        transitionDelay: isVisible ? `${delay}ms` : '0ms',
        transitionTimingFunction: 'cubic-bezier(0.22, 1, 0.36, 1)',
      }}
      className={`transition-all will-change-[transform,opacity] ${getTransformClass()} ${
        isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-[0.98]'
      } ${className}`}
    >
      {children}
    </div>
  );
};

export default RevealOnScroll;
