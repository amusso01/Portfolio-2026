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
 * - Direction-aware hover: on enter, a background wipe fills from the edge
 *   the mouse entered (top or bottom). On leave, it disappears toward the
 *   edge the mouse left from. Title shifts right, arrow moves diagonally
 *   and turns accent green, index number brightens.
 * - Scroll-driven horizontal translate on the "JE" word in the section title,
 *   with lerp smoothing and post-scroll momentum/friction.
 */
import { useEffect, useRef, useCallback } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

type Timeline = ReturnType<typeof gsap.timeline>
import { ArrowUpRight } from 'lucide-react'
import projectsData from '../data/projects.json'
import { useScrollMomentum } from '../hooks/useScrollMomentum'

gsap.registerPlugin(ScrollTrigger)

// Shared hover timing
const HOVER_DURATION = 0.25
const HOVER_EASE = 'power2.out'

/* ─────────────────────────── ProjectRow ─────────────────────────── */

/**
 * Single project row: index, title, year, tags. Links to project.link.
 *
 * HOVER EFFECT:
 * The grey background highlight is a single shared div owned by the parent
 * Work component. On mouseenter/leave, each row calls onHoverEnter/Leave
 * to position + animate that shared div. Per-row animations (title shift,
 * arrow diagonal + accent color, index highlight) still run locally.
 */
function ProjectRow({
	project,
	index,
	onHoverEnter,
	onHoverLeave,
}: {
	project: (typeof projectsData)[0]
	index: number
	onHoverEnter: (linkEl: HTMLElement, e: React.MouseEvent) => void
	onHoverLeave: (linkEl: HTMLElement, e: React.MouseEvent) => void
}) {
	const rowRef = useRef<HTMLDivElement>(null)
	const titleRef = useRef<HTMLHeadingElement>(null)
	const arrowRef = useRef<HTMLSpanElement>(null)
	const indexRef = useRef<HTMLSpanElement>(null)
	const linkRef = useRef<HTMLAnchorElement>(null)
	const rowTlRef = useRef<Timeline | null>(null)
	const formattedIndex = String(index + 1).padStart(2, '0')

	/** Animate per-row elements (title, arrow, index) to hovered state */
	function animateRowIn() {
		if (rowTlRef.current) rowTlRef.current.kill()
		const tl = gsap.timeline()
		tl.to(
			titleRef.current,
			{ x: 8, duration: HOVER_DURATION, ease: HOVER_EASE },
			0,
		)
		tl.to(
			arrowRef.current,
			{
				x: -1,
				y: -5,
				scale: 1.1,
				color: '#97F093',
				duration: HOVER_DURATION,
				ease: HOVER_EASE,
			},
			0,
		)
		tl.to(
			indexRef.current,
			{
				opacity: 1,
				color: '#101110',
				duration: HOVER_DURATION,
				ease: HOVER_EASE,
			},
			0,
		)
		rowTlRef.current = tl
	}

	/** Animate per-row elements back to rest state */
	function animateRowOut() {
		if (rowTlRef.current) rowTlRef.current.kill()
		const tl = gsap.timeline()
		tl.to(
			titleRef.current,
			{ x: 0, duration: HOVER_DURATION, ease: HOVER_EASE },
			0,
		)
		tl.to(
			arrowRef.current,
			{
				x: -4,
				y: -2,
				scale: 1,
				color: '#E5E5E5',
				duration: HOVER_DURATION,
				ease: HOVER_EASE,
			},
			0,
		)
		tl.to(
			indexRef.current,
			{
				opacity: 0.6,
				color: '#E5E5E5',
				duration: HOVER_DURATION,
				ease: HOVER_EASE,
			},
			0,
		)
		rowTlRef.current = tl
	}

	function handleMouseEnter(e: React.MouseEvent<HTMLAnchorElement>) {
		if (linkRef.current) onHoverEnter(linkRef.current, e)
		animateRowIn()
	}

	function handleMouseLeave(e: React.MouseEvent<HTMLAnchorElement>) {
		if (linkRef.current) onHoverLeave(linkRef.current, e)
		animateRowOut()
	}

	/* Scroll-triggered entrance: fade + slide up, staggered by row index */
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
				ref={linkRef}
				href={project.link}
				target="_blank"
				rel="noopener noreferrer"
				className="group relative flex items-center py-6 md:py-8 border-b border-subtle/50 hover:border-ink/20 transition-colors duration-300"
				onMouseEnter={handleMouseEnter}
				onMouseLeave={handleMouseLeave}
			>
				{/* Index number - left */}
				<span
					ref={indexRef}
					className="text-4xl md:text-6xl font-display font-bold text-subtle/60 w-16 md:w-20 flex-shrink-0"
				>
					{formattedIndex}
				</span>

				{/* Project title and year - center */}
				<div className="flex-1 flex flex-col md:flex-row md:items-center gap-1 md:gap-6 ml-4 md:ml-8">
					<h3
						ref={titleRef}
						className="text-lg md:text-xl font-display font-medium text-ink flex items-center gap-2"
					>
						{project.title}
						<span
							ref={arrowRef}
							className="inline-flex -translate-x-1 translate-y-[-2px] text-subtle"
						>
							<ArrowUpRight className="w-4 h-4 md:w-5 md:h-5" />
						</span>
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

/* ─────────────────────────── Work (section) ─────────────────────────── */

export function Work() {
	const sectionRef = useRef<HTMLDivElement>(null)
	const movingWordRef = useRef<HTMLSpanElement>(null)
	const listRef = useRef<HTMLDivElement>(null)
	const hoverBgRef = useRef<HTMLDivElement>(null)
	// Track whether any row is currently hovered so we can distinguish
	// "entering from outside the list" vs "sliding between rows".
	const activeRowRef = useRef<HTMLElement | null>(null)

	/**
	 * Shared hover background: a single div positioned absolutely over the
	 * project list.
	 *
	 * - First entry (from outside the list): snap position, animate scaleY 0→1
	 *   from the mouse-entry edge.
	 * - Row-to-row transition: keep scaleY at 1 and smoothly tween top/height
	 *   so the background slides to the new row without disappearing.
	 * - Leave (mouse exits the list entirely): animate scaleY 1→0 toward the
	 *   exit edge.
	 */
	const handleHoverEnter = useCallback(
		(linkEl: HTMLElement, e: React.MouseEvent) => {
			const bg = hoverBgRef.current
			const list = listRef.current
			if (!bg || !list) return

			const listRect = list.getBoundingClientRect()
			const linkRect = linkEl.getBoundingClientRect()
			const top = linkRect.top - listRect.top
			const isSliding = activeRowRef.current !== null
			activeRowRef.current = linkEl

			gsap.killTweensOf(bg)

			if (isSliding) {
				// Already hovering a row — slide the bg to the new row, stay fully visible
				gsap.to(bg, {
					top,
					height: linkRect.height,
					scaleY: 1,
					duration: HOVER_DURATION,
					ease: HOVER_EASE,
				})
			} else {
				// First entry from outside the list — snap position, wipe in
				const fromTop = e.clientY < linkRect.top + linkRect.height / 2
				gsap.set(bg, {
					top,
					height: linkRect.height,
					left: 0,
					right: 0,
					scaleY: 0,
				})
				gsap.to(bg, {
					scaleY: 1,
					duration: HOVER_DURATION,
					ease: HOVER_EASE,
					transformOrigin: fromTop ? 'top center' : 'bottom center',
				})
			}
		},
		[],
	)

	const handleHoverLeave = useCallback(
		(linkEl: HTMLElement, e: React.MouseEvent) => {
			const bg = hoverBgRef.current
			if (!bg) return

			// Defer clearing activeRow so a subsequent enter (row-to-row) can
			// detect the slide. requestAnimationFrame fires before the next
			// row's mouseenter in the same pointer movement.
			requestAnimationFrame(() => {
				if (activeRowRef.current !== linkEl) return
				// Mouse truly left the list — no new row entered
				activeRowRef.current = null
				const linkRect = linkEl.getBoundingClientRect()
				const leaveFromTop = e.clientY < linkRect.top + linkRect.height / 2

				gsap.killTweensOf(bg)
				gsap.to(bg, {
					scaleY: 0,
					duration: HOVER_DURATION,
					ease: HOVER_EASE,
					transformOrigin: leaveFromTop ? 'top center' : 'bottom center',
				})
			})
		},
		[],
	)

	useScrollMomentum(movingWordRef, sectionRef)

	/* Section title fade-in on scroll */
	useEffect(() => {
		const ctx = gsap.context(() => {
			const titleEl = sectionRef.current?.querySelector('h2')
			if (titleEl && sectionRef.current) {
				gsap.fromTo(
					titleEl,
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
			}
		}, sectionRef)

		return () => ctx.revert()
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

				<div ref={listRef} className="relative flex flex-col">
					{/* Single shared hover background — positioned over whichever row is hovered */}
					<div
						ref={hoverBgRef}
						className="pointer-events-none absolute bg-ink/[0.03]"
						style={{ transform: 'scaleY(0)', left: 0, right: 0 }}
					/>
					{projectsData.map((project, index) => (
						<ProjectRow
							key={project.id}
							project={project}
							index={index}
							onHoverEnter={handleHoverEnter}
							onHoverLeave={handleHoverLeave}
						/>
					))}
				</div>
			</div>
		</section>
	)
}
