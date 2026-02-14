/**
 * =============================================================================
 * TiltCard - 3D Tilt on Hover
 * =============================================================================
 *
 * Applies perspective tilt based on mouse position. Children rotate slightly
 * toward the cursor (rotateX/rotateY) and scale up on hover.
 *
 * Not currently used in the main app - available for project cards, etc.
 */
import { useRef, useState, ReactNode, MouseEvent } from 'react';
import { gsap } from 'gsap';

interface TiltCardProps {
  children: ReactNode;
  className?: string;
  tiltAngleXInitial?: number;
  tiltAngleYInitial?: number;
  tiltAngleXMultiplier?: number;
  tiltAngleYMultiplier?: number;
  glowColor?: string;
  transitionDuration?: string;
  scale?: number;
}

export function TiltCard({
  children,
  className = '',
  tiltAngleXInitial = 0,
  tiltAngleYInitial = 0,
  tiltAngleXMultiplier = 10,
  tiltAngleYMultiplier = 10,
  glowColor = 'rgba(59, 130, 246, 0.1)',
  transitionDuration = '0.2s',
  scale = 1.02,
}: TiltCardProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;

    const { left, top, width, height } = ref.current.getBoundingClientRect();
    const centerX = left + width / 2;
    const centerY = top + height / 2;

    const mouseX = e.clientX - centerX;
    const mouseY = e.clientY - centerY;

    const rotateX = (mouseY / (height / 2)) * -tiltAngleXMultiplier;
    const rotateY = (mouseX / (width / 2)) * tiltAngleYMultiplier;

    gsap.to(ref.current, {
      rotateX,
      rotateY,
      transformPerspective: 1000,
      scale: scale,
      duration: transitionDuration,
      ease: 'power2.out',
    });
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    gsap.to(ref.current, {
      rotateX: tiltAngleXInitial,
      rotateY: tiltAngleYInitial,
      scale: 1,
      duration: transitionDuration,
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
      className={`${className} transition-shadow duration-300 ${isHovered ? 'shadow-lg' : ''}`}
      style={{
        boxShadow: isHovered ? `0 20px 40px ${glowColor}` : 'none',
        transformStyle: 'preserve-3d',
      }}
    >
      {children}
    </div>
  );
}
