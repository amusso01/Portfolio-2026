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

gsap.registerPlugin(ScrollTrigger)

// SCROLL_SPEED: How fast the animated word moves in response to scroll (higher = faster)
const SCROLL_SPEED = 0.15
// LERP: Smoothing factor for scroll-driven position (0 = no follow, 1 = instant). Higher = snappier.
const LERP = 0.08
// MOMENTUM_FRICTION: Decay per frame (closer to 1 = longer glide after you stop)
const MOMENTUM_FRICTION = 0.95
// MOMENTUM_BOOST: Multiply scroll velocity when entering momentum so it continues a bit more
const MOMENTUM_BOOST = 1.4
// MOMENTUM_THRESHOLD: Stop momentum when velocity is below this
const MOMENTUM_THRESHOLD = 0.04
// SCROLL_END_MS: Wait after last scroll before starting momentum
const SCROLL_END_MS = 120

// Parallax for the number: vertical movement factor (0 = no move, 1 = 1:1 with scroll)
const PARALLAX_SPEED = 0.22
// Reverse parallax for projects number (negative = moves up when scrolling down)
const PARALLAX_SPEED_UP = -0.1

export function About() {
	const sectionRef = useRef<HTMLDivElement>(null)
	const numberRef = useRef<HTMLDivElement>(null)
	const projectsRef = useRef<HTMLDivElement>(null)
	const contentRef = useRef<HTMLDivElement>(null)
	const whatIBuildRef = useRef<HTMLParagraphElement>(null)
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
		}, sectionRef)

		return () => ctx.revert()
	}, [])

	/* Scroll-driven horizontal translate for second title word, with smoothing + friction/momentum */
	useEffect(() => {
		const el = movingWordRef.current
		const section = sectionRef.current
		if (!el || !section) return

		let lastScrollY = window.scrollY
		let scrollOrigin = section.getBoundingClientRect().top + window.scrollY
		let scrollBasedX = 0
		let momentumX = 0
		let velocityX = 0
		let displayedX = 0
		let momentumActive = false
		let rafId: number | null = null
		let scrollEndTimeout: ReturnType<typeof setTimeout> | null = null

		function applyTransform(x: number) {
			el.style.transform = `translate3d(${x}px, 0, 0)`
		}

		function tick() {
			if (momentumActive) {
				momentumX += velocityX
				velocityX *= MOMENTUM_FRICTION
				if (Math.abs(velocityX) < MOMENTUM_THRESHOLD) {
					velocityX = 0
					momentumActive = false
				}
			}
			const targetX = scrollBasedX + momentumX
			displayedX += (targetX - displayedX) * LERP
			applyTransform(displayedX)
			rafId = requestAnimationFrame(tick)
		}

		function onScroll() {
			const scrollY = window.scrollY
			const deltaY = scrollY - lastScrollY

			scrollOrigin = section.getBoundingClientRect().top + window.scrollY
			scrollBasedX = (scrollY - scrollOrigin) * SCROLL_SPEED
			velocityX = deltaY * SCROLL_SPEED
			lastScrollY = scrollY
			momentumActive = false

			if (scrollEndTimeout) clearTimeout(scrollEndTimeout)
			scrollEndTimeout = setTimeout(() => {
				scrollEndTimeout = null
				velocityX *= MOMENTUM_BOOST
				momentumActive = true
			}, SCROLL_END_MS)
		}

		/* Initial position and start smooth loop */
		scrollOrigin = section.getBoundingClientRect().top + window.scrollY
		scrollBasedX = (window.scrollY - scrollOrigin) * SCROLL_SPEED
		displayedX = scrollBasedX
		applyTransform(displayedX)
		rafId = requestAnimationFrame(tick)

		window.addEventListener('scroll', onScroll, { passive: true })
		return () => {
			window.removeEventListener('scroll', onScroll)
			if (rafId !== null) cancelAnimationFrame(rafId)
			if (scrollEndTimeout) clearTimeout(scrollEndTimeout)
		}
	}, [])

	/* Parallax + momentum for the years number (same feel as OUT word) */
	useEffect(() => {
		const el = numberRef.current
		const section = sectionRef.current
		if (!el || !section) return

		let lastScrollY = window.scrollY
		let scrollOrigin = section.getBoundingClientRect().top + window.scrollY
		let scrollBasedY = 0
		let momentumY = 0
		let velocityY = 0
		let displayedY = 0
		let momentumActive = false
		let rafId: number | null = null
		let scrollEndTimeout: ReturnType<typeof setTimeout> | null = null

		function applyTransform(y: number) {
			el.style.transform = `translate3d(0, ${y}px, 0) scale(1)`
		}

		function tick() {
			if (momentumActive) {
				momentumY += velocityY
				velocityY *= MOMENTUM_FRICTION
				if (Math.abs(velocityY) < MOMENTUM_THRESHOLD) {
					velocityY = 0
					momentumActive = false
				}
			}
			const targetY = scrollBasedY + momentumY
			displayedY += (targetY - displayedY) * LERP
			applyTransform(displayedY)
			rafId = requestAnimationFrame(tick)
		}

		function onScroll() {
			const scrollY = window.scrollY
			const deltaY = scrollY - lastScrollY

			scrollOrigin = section.getBoundingClientRect().top + window.scrollY
			scrollBasedY = (scrollY - scrollOrigin) * PARALLAX_SPEED
			velocityY = deltaY * PARALLAX_SPEED
			lastScrollY = scrollY
			momentumActive = false

			if (scrollEndTimeout) clearTimeout(scrollEndTimeout)
			scrollEndTimeout = setTimeout(() => {
				scrollEndTimeout = null
				velocityY *= MOMENTUM_BOOST
				momentumActive = true
			}, SCROLL_END_MS)
		}

		scrollOrigin = section.getBoundingClientRect().top + window.scrollY
		scrollBasedY = (window.scrollY - scrollOrigin) * PARALLAX_SPEED
		displayedY = scrollBasedY
		applyTransform(displayedY)
		rafId = requestAnimationFrame(tick)

		window.addEventListener('scroll', onScroll, { passive: true })
		return () => {
			window.removeEventListener('scroll', onScroll)
			if (rafId !== null) cancelAnimationFrame(rafId)
			if (scrollEndTimeout) clearTimeout(scrollEndTimeout)
		}
	}, [])

	/* Reverse parallax + momentum for the projects number (moves UP on scroll down) */
	useEffect(() => {
		const el = projectsRef.current
		const section = sectionRef.current
		if (!el || !section) return

		let lastScrollY = window.scrollY
		let scrollOrigin = section.getBoundingClientRect().top + window.scrollY
		let scrollBasedY = 0
		let momentumY = 0
		let velocityY = 0
		let displayedY = 0
		let momentumActive = false
		let rafId: number | null = null
		let scrollEndTimeout: ReturnType<typeof setTimeout> | null = null

		function applyTransform(y: number) {
			el.style.transform = `translate3d(0, ${y}px, 0) scale(1)`
		}

		function tick() {
			if (momentumActive) {
				momentumY += velocityY
				velocityY *= MOMENTUM_FRICTION
				if (Math.abs(velocityY) < MOMENTUM_THRESHOLD) {
					velocityY = 0
					momentumActive = false
				}
			}
			const targetY = scrollBasedY + momentumY
			displayedY += (targetY - displayedY) * LERP
			applyTransform(displayedY)
			rafId = requestAnimationFrame(tick)
		}

		function onScroll() {
			const scrollY = window.scrollY
			const deltaY = scrollY - lastScrollY

			scrollOrigin = section.getBoundingClientRect().top + window.scrollY
			scrollBasedY = (scrollY - scrollOrigin) * PARALLAX_SPEED_UP
			velocityY = deltaY * PARALLAX_SPEED_UP
			lastScrollY = scrollY
			momentumActive = false

			if (scrollEndTimeout) clearTimeout(scrollEndTimeout)
			scrollEndTimeout = setTimeout(() => {
				scrollEndTimeout = null
				velocityY *= MOMENTUM_BOOST
				momentumActive = true
			}, SCROLL_END_MS)
		}

		scrollOrigin = section.getBoundingClientRect().top + window.scrollY
		scrollBasedY = (window.scrollY - scrollOrigin) * PARALLAX_SPEED_UP
		displayedY = scrollBasedY
		applyTransform(displayedY)
		rafId = requestAnimationFrame(tick)

		window.addEventListener('scroll', onScroll, { passive: true })
		return () => {
			window.removeEventListener('scroll', onScroll)
			if (rafId !== null) cancelAnimationFrame(rafId)
			if (scrollEndTimeout) clearTimeout(scrollEndTimeout)
		}
	}, [])

	return (
		<section
			id="about"
			ref={sectionRef}
			className="section-padding section-padding-about bg-canvas"
		>
			<div className="container-custom">
				<div className="bigTitle text-section-mobile md:text-section xl:text-[190px] font-display font-bold mb-10">
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
				<div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20">
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
				<div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 mt-8">
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
							className="relative will-change-transform self-start mt-[30vh]"
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
						<p className="text-lg lg:text-[1.55rem] text-ink leading-[45px] text-justify mt-10">
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
