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
import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { ArrowUpRight } from 'lucide-react'
import projectsData from '../data/projects.json'

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

/** Single project row: index, title, year, tags. Links to project.link */
function ProjectRow({
	project,
	index,
}: {
	project: (typeof projectsData)[0]
	index: number
}) {
	const rowRef = useRef<HTMLDivElement>(null)
	const formattedIndex = String(index + 1).padStart(2, '0')

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
				},
			)
		}, rowRef)

		return () => ctx.revert()
	}, [index])

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
							{i < Math.min(project.tags.length, 3) - 1 && (
								<span className="text-subtle mx-1">/</span>
							)}
						</span>
					))}
				</div>
			</a>
		</div>
	)
}

export function Work() {
	const sectionRef = useRef<HTMLDivElement>(null)
	const movingWordRef = useRef<HTMLSpanElement>(null)

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
				},
			)
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

	return (
		<section id="work" ref={sectionRef} className="section-padding bg-canvas">
			<div className="container-custom">
				<div className="bigTitle text-section-mobile md:text-section xl:text-[190px] font-display font-bold mb-10">
					<span className="titleWord inline-block overflow-hidden align-top">
						PRO
					</span>
					<span
						ref={movingWordRef}
						className="titleWord inline-block overflow-hidden align-top"
					>
						JE
					</span>
					<span className="titleWord inline-block overflow-hidden align-top">
						CTS
					</span>
				</div>

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
	)
}
