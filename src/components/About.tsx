/**
 * =============================================================================
 * About - Personal Introduction Section
 * =============================================================================
 *
 * Two-column layout:
 * - Left: Large "YEARS+" number (pinned while scrolling via ScrollTrigger)
 * - Right: Bio text, location, availability
 *
 * ANIMATIONS:
 * - Number: fades in + scales up on load; then pins and scrubs with scroll
 * - Paragraphs: fade in + slide up on scroll into view (staggered)
 *
 * ScrollTrigger.create pins the number div so it stays in place while the
 * content scrolls past. start/end: 'top center' / 'bottom center' define when.
 */
import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import profileData from '../data/profile.json';

gsap.registerPlugin(ScrollTrigger);

export function About() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const numberRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      /* Initial number animation: scale + fade */
      gsap.fromTo(
        numberRef.current,
        { opacity: 0, scale: 0.8 },
        {
          opacity: 1,
          scale: 1,
          duration: 1,
          ease: 'power3.out',
        }
      );

      /* Pin the years number; it stays fixed while user scrolls through section */
      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: 'top center',
        end: 'bottom center',
        pin: numberRef.current,
        scrub: 1,
      });

      /* Paragraphs animate in when they enter view (scrollTrigger) */
      const paragraphs = contentRef.current?.querySelectorAll('p');
      if (paragraphs) {
        gsap.fromTo(
          paragraphs,
          { opacity: 0, y: 30 },
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            stagger: 0.2,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: contentRef.current,
              start: 'top 70%',
              toggleActions: 'play none none reverse',
            },
          }
        );
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="about"
      ref={sectionRef}
      className="section-padding bg-canvas"
    >
      <div className="container-custom">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20">
          {/* Large number - pinned */}
          <div className="lg:col-span-5 flex items-center justify-center lg:justify-start">
            <div ref={numberRef} className="relative">
              <span className="text-[200px] md:text-[300px] font-display font-extrabold text-subtle leading-none">
                {profileData.yearsOfExperience}+
              </span>
              <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-sm text-muted uppercase tracking-widest whitespace-nowrap">
                Years Experience
              </span>
            </div>
          </div>

          {/* Content */}
          <div ref={contentRef} className="lg:col-span-7 flex flex-col justify-center">
            <h2 className="text-section-mobile md:text-section font-display font-bold mb-8 text-subtle/40">
              About Me
            </h2>

            <div className="space-y-6">
              <p className="text-lg md:text-xl text-muted leading-relaxed">
                {profileData.bio}
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-accent rounded-full" />
                  <span className="text-ink font-medium">{profileData.location}</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-accent rounded-full" />
                  <span className="text-ink font-medium">{profileData.availability}</span>
                </div>
              </div>

              <p className="text-lg md:text-xl text-ink font-medium pt-4">
                I help brands build high-converting e-commerce experiences that
                combine beautiful design with powerful functionality.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
