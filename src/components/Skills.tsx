/**
 * =============================================================================
 * Skills - Skills & Expertise Section
 * =============================================================================
 *
 * Layout: Title on left (1/3), skill categories on right (2/3).
 * Data-driven: skillsData.categories defines structure.
 *
 * ANIMATIONS (all scroll-triggered):
 * - Section title: fades in when section enters view
 * - SkillCategory: each category fades in + slides up with stagger
 * - SkillItem: each skill row fades in + slides from right (delayed by index)
 */
import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import skillsData from '../data/skills.json';

gsap.registerPlugin(ScrollTrigger);

/** Single skill row: name + level %. Animates in on scroll into view */
function SkillItem({
  skill,
  index,
}: {
  skill: { name: string; level: number };
  index: number;
}) {
  const itemRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        itemRef.current,
        { opacity: 0, x: 20 },
        {
          opacity: 1,
          x: 0,
          duration: 0.5,
          delay: index * 0.03,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: itemRef.current,
            start: 'top 85%',
            toggleActions: 'play none none reverse',
          },
        }
      );
    }, itemRef);

    return () => ctx.revert();
  }, [index]);

  return (
    <div
      ref={itemRef}
      className="flex justify-between items-center py-5 border-b border-subtle/40 hover:border-accent/30 transition-colors duration-300 cursor-default"
    >
      <span className="text-base font-body text-ink">{skill.name}</span>
      <span className="text-sm font-body text-muted">{skill.level}%</span>
    </div>
  );
}

/** Group of skills under a category (e.g. "Development", "Design") */
function SkillCategory({
  category,
  index,
}: {
  category: (typeof skillsData.categories)[0];
  index: number;
}) {
  const categoryRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        categoryRef.current,
        { opacity: 0, y: 20 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          delay: index * 0.1,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: categoryRef.current,
            start: 'top 80%',
            toggleActions: 'play none none reverse',
          },
        }
      );
    }, categoryRef);

    return () => ctx.revert();
  }, [index]);

  return (
    <div ref={categoryRef} className="mb-12 last:mb-0">
      <h3 className="text-xs font-body font-medium text-muted uppercase tracking-[0.2em] mb-4">
        {category.name}
      </h3>

      <div className="border-t border-subtle/40">
        {category.skills.map((skill, skillIndex) => (
          <SkillItem key={skill.name} skill={skill} index={skillIndex} />
        ))}
      </div>
    </div>
  );
}

export function Skills() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Animate title on load
      gsap.fromTo(
        titleRef.current,
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 70%',
            toggleActions: 'play none none reverse',
          },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section id="skills" ref={sectionRef} className="section-padding bg-canvas">
      <div className="container-custom">
        <div className="flex flex-col md:flex-row">
          {/* Title on the left - will be pinned */}
          <div ref={titleRef} className="md:w-1/3 mb-12 md:mb-0">
            <h2 className="text-section-mobile md:text-section font-display font-bold text-subtle">
              Skills & Expertise
            </h2>
          </div>

          {/* Skills content on the right */}
          <div ref={contentRef} className="md:w-2/3 md:pl-12">
            {skillsData.categories.map((category, index) => (
              <SkillCategory key={category.name} category={category} index={index} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
