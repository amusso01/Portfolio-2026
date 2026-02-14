/**
 * =============================================================================
 * Contact - Contact Section & Footer
 * =============================================================================
 *
 * Contains:
 * - Headline + CTA copy
 * - Large email link (mailto) with hover color animation
 * - Social icons (GitHub, LinkedIn, Twitter) from profile.json
 * - Contact form: name, email, budget, project description
 * - Footer with copyright
 *
 * FORM: Currently simulates submission (setTimeout). In production, wire to
 * backend/API or form service (Formspree, Netlify Forms, etc.).
 *
 * ANIMATIONS:
 * - Email, social links, form: fade in on scroll
 * - Email link: GSAP color transition on hover (to accent green)
 */
import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Github, Linkedin, Twitter, Send } from 'lucide-react';
import profileData from '../data/profile.json';

gsap.registerPlugin(ScrollTrigger);

interface FormData {
  name: string;
  email: string;
  budget: string;
  project: string;
}

const budgetOptions = [
  { value: '', label: 'Select budget' },
  { value: 'under-1k', label: 'Under £1,000' },
  { value: '1k-2.5k', label: '£1,000 - £2,500' },
  { value: 'over-2.5k', label: 'Over £2,500' },
];

export function Contact() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const emailRef = useRef<HTMLAnchorElement>(null);
  const socialsRef = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    budget: '',
    project: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus('idle');
    /* TODO: Replace with real API/form service (Formspree, Netlify, custom backend) */
    setTimeout(() => {
      // Reset form
      setFormData({ name: '', email: '', budget: '', project: '' });
      setIsSubmitting(false);
      setSubmitStatus('success');

      // Clear success message after 3 seconds
      setTimeout(() => setSubmitStatus('idle'), 3000);
    }, 1000);
  };

  useEffect(() => {
    const ctx = gsap.context(() => {
      /* Email link animates in when section enters view */
      gsap.fromTo(
        emailRef.current,
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 60%',
            toggleActions: 'play none none reverse',
          },
        }
      );

      /* Social icons: stagger fade-in */
      const socialLinks = socialsRef.current?.querySelectorAll('a');
      if (socialLinks) {
        gsap.fromTo(
          socialLinks,
          { opacity: 0, y: 20 },
          {
            opacity: 1,
            y: 0,
            duration: 0.6,
            stagger: 0.1,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: socialsRef.current,
              start: 'top 80%',
              toggleActions: 'play none none reverse',
            },
          }
        );
      }

      /* Form fades in after social links */
      if (formRef.current) {
        gsap.fromTo(
          formRef.current,
          { opacity: 0, y: 30 },
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            delay: 0.2,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: formRef.current,
              start: 'top 80%',
              toggleActions: 'play none none reverse',
            },
          }
        );
      }

      /* Email link: GSAP color transition on hover (accent green) */
      if (emailRef.current) {
        const text = emailRef.current;

        text.addEventListener('mouseenter', () => {
          gsap.to(text, {
            color: '#97F093',
            duration: 0.3,
            ease: 'power2.out',
          });
        });

        text.addEventListener('mouseleave', () => {
          gsap.to(text, {
            color: '#111111',
            duration: 0.3,
            ease: 'power2.out',
          });
        });
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const socialLinks = [
    { icon: Github, href: profileData.social.github, label: 'GitHub' },
    { icon: Linkedin, href: profileData.social.linkedin, label: 'LinkedIn' },
    { icon: Twitter, href: profileData.social.twitter, label: 'Twitter' },
  ];

  return (
    <section id="contact" ref={sectionRef} className="section-padding bg-canvas">
      <div className="container-custom">
        <div className="flex flex-col items-center justify-center text-center">
          <h2 className="text-section-mobile md:text-section font-display font-bold mb-6">
            Let&apos;s Build Something Amazing
          </h2>

          <p className="text-muted text-lg max-w-xl mb-12">
            Have a project in mind? I&apos;d love to hear about it. Let&apos;s
            discuss how we can bring your vision to life.
          </p>

          <a
            ref={emailRef}
            href={`mailto:${profileData.email}`}
            className="text-4xl md:text-6xl lg:text-7xl font-display font-bold text-ink hover:text-accent transition-colors duration-300 mb-12 break-all"
          >
            {profileData.email}
          </a>

          <div ref={socialsRef} className="flex items-center gap-6 mb-16">
            {socialLinks.map(({ icon: Icon, href, label }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={label}
                className="w-12 h-12 flex items-center justify-center bg-subtle rounded-full text-ink hover:bg-accent hover:text-white transition-colors duration-300"
              >
                <Icon className="w-5 h-5" />
              </a>
            ))}
          </div>
        </div>

        {/* Contact Form */}
        <div className="max-w-xl mx-auto">
          <form
            ref={formRef}
            onSubmit={handleSubmit}
            className="space-y-6"
          >
            <div>
              <label htmlFor="name" className="block text-sm font-body font-medium text-muted mb-2">
                Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 bg-white border border-subtle/60 text-ink font-body placeholder:text-muted/50 focus:outline-none focus:border-accent focus:border-opacity-50 transition-colors duration-300"
                placeholder="Your name"
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-body font-medium text-muted mb-2">
                Contact Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 bg-white border border-subtle/60 text-ink font-body placeholder:text-muted/50 focus:outline-none focus:border-accent focus:border-opacity-50 transition-colors duration-300"
                placeholder="your@email.com"
              />
            </div>

            <div>
              <label htmlFor="budget" className="block text-sm font-body font-medium text-muted mb-2">
                Project Budget
              </label>
              <select
                id="budget"
                name="budget"
                value={formData.budget}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 bg-white border border-subtle/60 text-ink font-body focus:outline-none focus:border-accent focus:border-opacity-50 transition-colors duration-300 appearance-none cursor-pointer"
              >
                {budgetOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="project" className="block text-sm font-body font-medium text-muted mb-2">
                Nature of Project
              </label>
              <textarea
                id="project"
                name="project"
                value={formData.project}
                onChange={handleChange}
                required
                rows={4}
                className="w-full px-4 py-3 bg-white border border-subtle/60 text-ink font-body placeholder:text-muted/50 focus:outline-none focus:border-accent focus:border-opacity-50 transition-colors duration-300 resize-none"
                placeholder="Tell me about your project..."
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-4 bg-ink text-white font-body font-medium text-lg flex items-center justify-center gap-2 hover:bg-accent transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                'Sending...'
              ) : (
                <>
                  Send Message
                  <Send className="w-5 h-5" />
                </>
              )}
            </button>

            {submitStatus === 'success' && (
              <p className="text-center text-green-600 font-body">
                Message sent successfully! I&apos;ll get back to you soon.
              </p>
            )}
          </form>
        </div>

        {/* Footer */}
        <footer className="mt-20 pt-8 border-t border-subtle">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-sm text-muted">
              &copy; {new Date().getFullYear()} {profileData.name}. All rights reserved.
            </p>
            <p className="text-sm text-muted">
              Built with React, GSAP, and React Bits
            </p>
          </div>
        </footer>
      </div>
    </section>
  );
}
