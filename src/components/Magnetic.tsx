/**
 * =============================================================================
 * Magnetic - Magnetic Hover Effect
 * =============================================================================
 *
 * Makes children "stick" to the cursor when hovered. Used on nav buttons.
 *
 * HOW IT WORKS:
 * - On mouse move: compute offset from element center to cursor
 * - Apply x/y transform = offset * strength * bounds (clamped)
 * - On mouse leave: animate back to 0,0 with elastic.out
 *
 * strength: how strongly the element follows (default 0.3)
 * bounds: multiplier for max displacement (default 0.5)
 */
import { useRef, useState, useEffect, ReactNode, MouseEvent } from 'react';
import { gsap } from 'gsap';

function useHasHover() {
  const [hasHover, setHasHover] = useState(true);

  useEffect(() => {
    const mql = window.matchMedia('(hover: hover)');
    setHasHover(mql.matches);
    const onChange = (e: MediaQueryListEvent) => setHasHover(e.matches);
    mql.addEventListener('change', onChange);
    return () => mql.removeEventListener('change', onChange);
  }, []);

  return hasHover;
}

interface MagneticProps {
  children: ReactNode;
  strength?: number;
  bounds?: number;
}

export function Magnetic({ children, strength = 0.3, bounds = 0.5 }: MagneticProps) {
  const ref = useRef<HTMLDivElement>(null);
  const hasHover = useHasHover();

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    if (!hasHover || !ref.current) return;
    const { left, top, width, height } = ref.current.getBoundingClientRect();
    const centerX = left + width / 2;
    const centerY = top + height / 2;

    const mouseX = e.clientX - centerX;
    const mouseY = e.clientY - centerY;

    const x = mouseX * strength * bounds;
    const y = mouseY * strength * bounds;

    gsap.to(ref.current, {
      x,
      y,
      duration: 0.3,
      ease: 'power2.out',
    });
  };

  const handleMouseLeave = () => {
    if (!hasHover || !ref.current) return;
    gsap.to(ref.current, {
      x: 0,
      y: 0,
      duration: 0.5,
      ease: 'elastic.out(1, 0.3)',
    });
  };

  return (
    <div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="inline-block"
    >
      {children}
    </div>
  );
}
