/**
 * =============================================================================
 * Work - Selected Projects Section
 * =============================================================================
 *
 * Lists projects from data/projects.json. Each row:
 * - Index number (01, 02, ...)
 * - Title + ArrowUpRight icon (links to project)
 * - Year
 * - Tech tags (on desktop)
 *
 * ANIMATIONS:
 * - Section title: fades in on scroll
 * - Each ProjectRow: fade + slide up on scroll into view (staggered by index)
 */
import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowUpRight } from 'lucide-react';
import projectsData from '../data/projects.json';

gsap.registerPlugin(ScrollTrigger);

/** Single project row: index, title, year, tags. Links to project.link */
function ProjectRow({ project, index }: { project: (typeof projectsData)[0]; index: number }) {
  const rowRef = useRef<HTMLDivElement>(null);
  const formattedIndex = String(index + 1).padStart(2, '0');

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        rowRef.current,
        { opacity: 0, y: 20 },
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          delay: index * 0.05,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: rowRef.current,
            start: 'top 85%',
            toggleActions: 'play none none reverse',
          },
        }
      );
    }, rowRef);

    return () => ctx.revert();
  }, [index]);

  return (
    <div ref={rowRef}>
      <a
        href={project.link}
        target="_blank"
        rel="noopener noreferrer"
        className="group flex items-center py-6 md:py-8 border-b border-subtle/50 hover:border-accent/30 transition-colors duration-300"
      >
        {/* Index number - left */}
        <span className="text-4xl md:text-6xl font-display font-bold text-subtle/60 w-16 md:w-20 flex-shrink-0">
          {formattedIndex}
        </span>

        {/* Project title and year - center */}
        <div className="flex-1 flex flex-col md:flex-row md:items-center gap-1 md:gap-6 ml-4 md:ml-8">
          <h3 className="text-lg md:text-xl font-display font-medium text-ink group-hover:text-accent transition-colors duration-300 flex items-center gap-2">
            {project.title}
            <ArrowUpRight className="w-4 h-4 md:w-5 md:h-5 text-subtle group-hover:text-accent transition-colors duration-300 -translate-x-1 translate-y-[-2px]" />
          </h3>
          <span className="text-sm text-muted">{project.year}</span>
        </div>

        {/* Tech stack - right */}
        <div className="hidden md:flex items-center justify-end gap-3 text-sm text-muted font-medium uppercase tracking-wider">
          {project.tags.slice(0, 3).map((tag, i) => (
            <span key={tag} className="flex items-center">
              {tag}
              {i < Math.min(project.tags.length, 3) - 1 && <span className="text-subtle mx-1">/</span>}
            </span>
          ))}
        </div>
      </a>
    </div>
  );
}

export function Work() {
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        sectionRef.current?.querySelector('h2'),
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
    <section id="work" ref={sectionRef} className="section-padding bg-canvas">
      <div className="container-custom">
        <h2 className="text-section-mobile md:text-section font-display font-bold mb-2 text-subtle/40">
          Selected Work
        </h2>

        <p className="text-muted mb-12">
          A curated selection of projects showcasing expertise in e-commerce
          development, custom solutions, and creative animations.
        </p>

        <div className="flex flex-col">
          {projectsData.map((project, index) => (
            <ProjectRow key={project.id} project={project} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}
