/**
 * =============================================================================
 * About - Personal Introduction Section
 * =============================================================================
 *
 * Two-column layout:
 * - Left: Large "10+" number (parallax scroll + momentum, same feel as title word)
 * - Right: Bio text, location, availability
 *
 * ANIMATIONS:
 * - Big title: second word translates horizontally with scroll + friction/momentum.
 * - Number: fades in + scales up on load; then scrolls with parallax and stops
 *   with the same momentum/friction as the OUT word.
 * - Paragraphs: fade in + slide up on scroll into view (staggered)
 */
import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import profileData from '../data/profile.json'
import { useScrollMomentum } from '../hooks/useScrollMomentum'

gsap.registerPlugin(ScrollTrigger)

export function About() {
	const sectionRef = useRef<HTMLDivElement>(null)
	const numberRef = useRef<HTMLDivElement>(null)
	const projectsRef = useRef<HTMLDivElement>(null)
	const contentRef = useRef<HTMLDivElement>(null)
	const whatIBuildRef = useRef<HTMLParagraphElement>(null)
	const outsideWorkRef = useRef<HTMLParagraphElement>(null)
	const movingWordRef = useRef<HTMLSpanElement>(null)

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
				},
			)

			/* Initial projects number animation: scale + fade */
			gsap.fromTo(
				projectsRef.current,
				{ opacity: 0, scale: 0.8 },
				{
					opacity: 1,
					scale: 1,
					duration: 1,
					ease: 'power3.out',
				},
			)

			/* Paragraphs animate in when they enter view (scrollTrigger) */
			const paragraphs = contentRef.current?.querySelectorAll('p')
			if (paragraphs) {
				gsap.fromTo(
					paragraphs,
					{ opacity: 0, y: 30 },
					{
						opacity: 1,
						y: 0,
						duration: 0.55,
						stagger: 0.2,
						ease: 'power2.in',
						scrollTrigger: {
							trigger: contentRef.current,
							start: 'top 100%',
							toggleActions: 'play none none reverse',
						},
					},
				)
			}

			/* What I Build paragraph: same animation, separate trigger */
			if (whatIBuildRef.current) {
				gsap.fromTo(
					whatIBuildRef.current,
					{ opacity: 0, y: 30 },
					{
						opacity: 1,
						y: 0,
						duration: 0.55,
						ease: 'power2.in',
						scrollTrigger: {
							trigger: whatIBuildRef.current,
							start: 'top 100%',
							toggleActions: 'play none none reverse',
						},
					},
				)
			}

			if (outsideWorkRef.current) {
				gsap.fromTo(
					outsideWorkRef.current,
					{ opacity: 0, y: 30 },
					{
						opacity: 1,
						y: 0,
						duration: 0.55,
						ease: 'power2.in',
						scrollTrigger: {
							trigger: outsideWorkRef.current,
							start: 'top 95%',
							toggleActions: 'play none none reverse',
						},
					},
				)
			}
		}, sectionRef)

		return () => ctx.revert()
	}, [])

	const ABOUT_PHYSICS = {
		lerp: 0.06,
		friction: 0.96,
		boost: 1.2,
		scrollEndMs: 80,
	} as const

	useScrollMomentum(movingWordRef, sectionRef, {
		speed: 0.15,
		speedMobile: 0.08,
		...ABOUT_PHYSICS,
	})
	useScrollMomentum(numberRef, sectionRef, {
		axis: 'y',
		speed: 0.22,
		...ABOUT_PHYSICS,
	})
	useScrollMomentum(projectsRef, sectionRef, {
		axis: 'y',
		speed: -0.1,
		...ABOUT_PHYSICS,
	})

	return (
		<section
			id="about"
			ref={sectionRef}
			className="section-padding section-padding-about bg-canvas"
		>
			<div className="container-custom">
				<div className="bigTitle text-[48px] md:text-section xl:text-[190px] font-display font-bold mb-10">
					<span className="titleWord inline-block overflow-hidden align-top">
						AB
					</span>
					<span
						ref={movingWordRef}
						className="titleWord inline-block overflow-hidden align-top"
					>
						OUT
					</span>
					<span className="titleWord inline-block overflow-hidden align-top">
						ME
					</span>
				</div>

				{/* Row 1: 10+ left, bio right */}
				<div className="grid grid-cols-1 lg:grid-cols-12 gap-1 lg:gap-20 mb-10 md:mb-0">
					<div className="lg:col-span-6 flex items-center lg:items-start select-none">
						<div
							ref={numberRef}
							className="relative will-change-transform number-offset self-start"
						>
							<span className="text-[200px] md:text-[300px] font-display font-extrabold text-subtle/50 leading-none">
								{profileData.yearsOfExperience}+
							</span>
							<span
								className="absolute text-sm text-muted uppercase tracking-widest whitespace-nowrap"
								style={{
									left: '50%',
									top: '50%',
									transform: 'translate(-50%, -50%)',
								}}
							>
								Years Experience
							</span>
						</div>
					</div>

					<div
						ref={contentRef}
						className="lg:col-span-5 flex flex-col justify-center"
					>
						<p className="text-lg lg:text-[1.55rem] text-ink leading-[45px] text-justify">
							{profileData.bio}
						</p>
					</div>
				</div>

				{/* Row 2: What I Build left, 50+ right */}
				<div className="grid grid-cols-1 lg:grid-cols-12 gap-1 lg:gap-20 mb-10 md:mb-0">
					<div className="lg:col-span-5 flex flex-col justify-center">
						<p
							ref={whatIBuildRef}
							className="text-lg lg:text-[1.55rem] text-ink leading-[45px] text-justify"
						>
							<span className="block text-sm text-muted uppercase tracking-widest mb-4">
								What I Build
							</span>
							{profileData.whatIBuild}
						</p>
					</div>

					<div className="lg:col-span-6 lg:col-start-7 flex flex-col items-center lg:items-end select-none">
						<div
							ref={projectsRef}
							className="relative will-change-transform self-start mt-[15vh] md:mt-[30vh]"
						>
							<span className="text-[200px] md:text-[300px] font-display font-extrabold text-subtle/50 leading-none">
								{profileData.projectsCompleted}+
							</span>
							<span
								className="absolute text-sm text-muted uppercase tracking-widest whitespace-nowrap"
								style={{
									left: '50%',
									top: '50%',
									transform: 'translate(-50%, -50%)',
								}}
							>
								Projects Completed
							</span>
						</div>
						<p
							ref={outsideWorkRef}
							className="text-lg lg:text-[1.55rem] text-ink leading-[45px] text-justify mt-10"
						>
							<span className="block text-sm text-muted uppercase tracking-widest mb-4">
								Outside of Work
							</span>
							{profileData.outsideOfWork}
						</p>
					</div>
				</div>
			</div>
		</section>
	)
}
