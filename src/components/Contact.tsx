/**
 * =============================================================================
 * Contact - Contact Section & Footer
 * =============================================================================
 *
 * Layout: Big split-word title (GET IN TOUCH) with scroll-driven middle word;
 * two-column grid: left = CTA copy, email link, socials; right = contact form.
 *
 * Form: name, email, budget, project description. Simulates submission (setTimeout).
 * In production, wire to backend/API or form service (Formspree, Netlify, etc.).
 *
 * ANIMATIONS:
 * - Title: scroll-driven horizontal translate on "IN" (momentum/lerp)
 * - Email: fade in on section view; GSAP color transition on hover (accent)
 * - Form fields: staggered fade + slide up on scroll
 */
import { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { Send } from 'lucide-react'
import profileData from '../data/profile.json'
import { SocialLinks } from './SocialLinks'
import { Magnetic } from './Magnetic'
import { useScrollMomentum } from '../hooks/useScrollMomentum'

gsap.registerPlugin(ScrollTrigger)

interface FormData {
	name: string
	email: string
	budget: string
	project: string
}

const budgetOptions = [
	{ value: '800-1500', label: '£800 - £1,500' },
	{ value: '1500-3000', label: '£1,500 - £3,000' },
	{ value: '3000-5000', label: '£3,000 - £5,000' },
	{ value: 'over-5000', label: 'Over £5,000' },
]

export function Contact() {
	const sectionRef = useRef<HTMLDivElement>(null)
	const movingWordRef = useRef<HTMLSpanElement>(null)
	const emailRef = useRef<HTMLAnchorElement>(null)
	const formRef = useRef<HTMLFormElement>(null)
	const [formData, setFormData] = useState<FormData>({
		name: '',
		email: '',
		budget: '',
		project: '',
	})
	const [isSubmitting, setIsSubmitting] = useState(false)
	const [submitStatus, setSubmitStatus] = useState<
		'idle' | 'success' | 'error'
	>('idle')

	const handleChange = (
		e: React.ChangeEvent<
			HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
		>,
	) => {
		setFormData((prev) => ({
			...prev,
			[e.target.name]: e.target.value,
		}))
	}

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault()
		setIsSubmitting(true)
		setSubmitStatus('idle')
		/* TODO: Replace with real API/form service (Formspree, Netlify, custom backend) */
		setTimeout(() => {
			// Reset form
			setFormData({ name: '', email: '', budget: '', project: '' })
			setIsSubmitting(false)
			setSubmitStatus('success')

			// Clear success message after 3 seconds
			setTimeout(() => setSubmitStatus('idle'), 3000)
		}, 1000)
	}

	useEffect(() => {
		const cleanups: Array<() => void> = []
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
				},
			)

			/* Form fields: staggered fade + slide up on scroll */
			if (formRef.current) {
				const formFields = formRef.current.querySelectorAll('.form-field')
				if (formFields.length) {
					gsap.fromTo(
						formFields,
						{ opacity: 0, y: 20 },
						{
							opacity: 1,
							y: 0,
							duration: 0.5,
							stagger: 0.08,
							ease: 'power3.out',
							scrollTrigger: {
								trigger: formRef.current,
								start: 'top 80%',
								toggleActions: 'play none none reverse',
							},
						},
					)
				}
			}

			/* Email link: GSAP color transition on hover (accent green) */
			const text = emailRef.current
			if (text) {
				const onMouseEnter = () => {
					gsap.to(text, {
						color: '#97F093',
						duration: 0.3,
						ease: 'power2.out',
					})
				}
				const onMouseLeave = () => {
					gsap.to(text, {
						color: '#111111',
						duration: 0.3,
						ease: 'power2.out',
					})
				}
				text.addEventListener('mouseenter', onMouseEnter)
				text.addEventListener('mouseleave', onMouseLeave)
				cleanups.push(() => {
					text.removeEventListener('mouseenter', onMouseEnter)
					text.removeEventListener('mouseleave', onMouseLeave)
				})
			}
		}, sectionRef)

		return () => {
			cleanups.forEach((fn) => fn())
			ctx.revert()
		}
	}, [])

	useScrollMomentum(movingWordRef, sectionRef)

	return (
		<section
			id="contact"
			ref={sectionRef}
			className="section-padding bg-canvas"
		>
			<div className="container-custom">
				<div className="bigTitle text-[58px] md:text-[110px] xl:text-[160px] font-display font-bold mb-16">
					<span className="titleWord inline-block overflow-hidden align-top">
						GET
					</span>
					<span
						ref={movingWordRef}
						className="titleWord inline-block overflow-hidden align-top"
					>
						IN
					</span>
					<span className="titleWord inline-block overflow-hidden align-top">
						TOUCH
					</span>
				</div>

				{/* Two-column: left = email + CTA + socials, right = form */}
				<div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20">
					{/* Left column */}
					<div className="lg:col-span-5 flex flex-col justify-center">
						<p className="text-muted text-lg lg:text-[1.55rem] leading-[45px] mb-8">
							Have a project in mind? I&apos;d love to hear about it. Let&apos;s
							discuss how we can bring your vision to life.
						</p>
						<a
							ref={emailRef}
							href={`mailto:${profileData.email}`}
							className="text-xl md:text-2xl lg:text-3xl font-display font-bold text-ink hover:text-accent transition-colors duration-300 mb-10 break-all inline-block"
						>
							{profileData.email}
						</a>
						<SocialLinks />
					</div>

					{/* Right column: Contact Form */}
					<div className="lg:col-span-6 lg:col-start-7">
						<form ref={formRef} onSubmit={handleSubmit} className="space-y-8">
							<div className="form-field">
								<label
									htmlFor="name"
									className="block text-xs font-body font-medium text-muted uppercase tracking-widest mb-3"
								>
									Name
								</label>
								<input
									type="text"
									id="name"
									name="name"
									value={formData.name}
									onChange={handleChange}
									required
									className="w-full px-0 py-4 bg-transparent border-0 border-b-2 border-subtle/70 text-ink font-body placeholder:text-muted/50 focus:outline-none focus:border-ink focus:ring-0 transition-colors duration-300"
									placeholder="Your name"
								/>
							</div>

							<div className="form-field">
								<label
									htmlFor="email"
									className="block text-xs font-body font-medium text-muted uppercase tracking-widest mb-3"
								>
									Contact Email
								</label>
								<input
									type="email"
									id="email"
									name="email"
									value={formData.email}
									onChange={handleChange}
									required
									className="w-full px-0 py-4 bg-transparent border-0 border-b-2 border-subtle/70 text-ink font-body placeholder:text-muted/50 focus:outline-none focus:border-ink focus:ring-0 transition-colors duration-300"
									placeholder="your@email.com"
								/>
							</div>

							<div className="form-field">
								<label
									htmlFor="budget"
									className="block text-xs font-body font-medium text-muted uppercase tracking-widest mb-3"
								>
									Project Budget
								</label>
								<select
									id="budget"
									name="budget"
									value={formData.budget}
									onChange={handleChange}
									required
									className="w-full px-0 py-4 bg-transparent border-0 border-b-2 border-subtle/70 text-ink font-body focus:outline-none focus:border-ink focus:ring-0 transition-colors duration-300 cursor-pointer appearance-none"
								>
									<option value="" disabled>
										Select budget
									</option>
									{budgetOptions.map((option) => (
										<option key={option.value} value={option.value}>
											{option.label}
										</option>
									))}
								</select>
							</div>

							<div className="form-field">
								<label
									htmlFor="project"
									className="block text-xs font-body font-medium text-muted uppercase tracking-widest mb-3"
								>
									Nature of Project
								</label>
								<textarea
									id="project"
									name="project"
									value={formData.project}
									onChange={handleChange}
									required
									rows={4}
									className="w-full px-0 py-4 bg-transparent border-0 border-b-2 border-subtle/70 text-ink font-body placeholder:text-muted/50 focus:outline-none focus:border-ink focus:ring-0 transition-colors duration-300 resize-none"
									placeholder="Tell me about your project..."
								/>
							</div>

							<div className="form-field">
								<div className="w-full [&>div]:block [&>div]:w-full">
									<Magnetic strength={0.2} bounds={0.4}>
										<button
											type="submit"
											disabled={isSubmitting}
											className="w-full py-4 bg-ink text-white font-body font-medium text-lg flex items-center justify-center gap-2 transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
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
									</Magnetic>
								</div>

								{submitStatus === 'success' && (
									<p className="text-accent font-body font-medium">
										Message sent successfully! I&apos;ll get back to you soon.
									</p>
								)}
							</div>
						</form>
					</div>
				</div>

				{/* Footer */}
				<footer className="mt-20 pt-8 border-t border-subtle/40">
					<p className="text-sm text-muted">
						&copy; {new Date().getFullYear()} {profileData.name}. All rights
						reserved.
					</p>
				</footer>
			</div>
		</section>
	)
}
