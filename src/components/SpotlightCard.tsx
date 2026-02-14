/**
 * =============================================================================
 * SpotlightCard - Spotlight Cursor Effect
 * =============================================================================
 *
 * Renders children with a spotlight gradient that follows the cursor on hover.
 * The spotlight is a radial gradient positioned at cursor, faded in on enter
 * and out on leave.
 *
 * Not currently used in the main app - available for card/CTA components.
 */
import { useRef, useState, ReactNode, MouseEvent } from 'react';
import { gsap } from 'gsap';

interface SpotlightCardProps {
  children: ReactNode;
  className?: string;
  spotlightColor?: string;
  borderRadius?: string;
}

export function SpotlightCard({
  children,
  className = '',
  spotlightColor = 'rgba(59, 130, 246, 0.15)',
  borderRadius = '16px',
}: SpotlightCardProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const spotlightRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    if (!ref.current || !spotlightRef.current) return;

    const { left, top } = ref.current.getBoundingClientRect();
    const x = e.clientX - left;
    const y = e.clientY - top;

    gsap.to(spotlightRef.current, {
      opacity: 1,
      duration: 0.3,
      ease: 'power2.out',
    });

    gsap.to(spotlightRef.current, {
      left: x - 150,
      top: y - 150,
      duration: 0.2,
      ease: 'power2.out',
    });
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    gsap.to(spotlightRef.current, {
      opacity: 0,
      duration: 0.3,
      ease: 'power2.out',
    });
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  return (
    <div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onMouseEnter={handleMouseEnter}
      className={`${className} relative overflow-hidden`}
      style={{ borderRadius }}
    >
      {/* Spotlight effect */}
      <div
        ref={spotlightRef}
        className="absolute pointer-events-none opacity-0 w-[300px] h-[300px] rounded-full"
        style={{
          background: `radial-gradient(circle, ${spotlightColor} 0%, transparent 70%)`,
          transform: 'translate(-50%, -50%)',
        }}
      />

      {/* Content */}
      <div className="relative z-10">{children}</div>
    </div>
  );
}
