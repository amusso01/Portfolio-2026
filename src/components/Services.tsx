/**
 * =============================================================================
 * Services - What I Offer Section
 * =============================================================================
 *
 * Layout: Title on left (1/3), service rows on right (2/3).
 * Each row always shows index + title + description (no accordion).
 *
 * HOVER EFFECT (desktop):
 * Direction-aware background fill — same technique as Work/Projects.
 * A single shared div is positioned absolutely behind the hovered row.
 * On first entry it wipes in from the mouse-entry edge (top or bottom).
 * Sliding between rows smoothly tweens position. On leave it wipes out
 * toward the exit edge.
 *
 * ANIMATIONS (scroll-triggered):
 * - Section title: fades in when section enters view
 * - Service rows: fade in + slide up with stagger
 */
import { useEffect, useRef, useCallback } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import servicesData from '../data/services.json'

gsap.registerPlugin(ScrollTrigger)

const HOVER_DURATION = 0.25
const HOVER_EASE = 'power2.out'

function ServiceRow({
	service,
	index,
	onHoverEnter,
	onHoverLeave,
}: {
	service: (typeof servicesData)[0]
	index: number
	onHoverEnter: (rowEl: HTMLElement, e: React.MouseEvent) => void
	onHoverLeave: (rowEl: HTMLElement, e: React.MouseEvent) => void
}) {
	const rowRef = useRef<HTMLDivElement>(null)
	const indexRef = useRef<HTMLSpanElement>(null)
	const titleRef = useRef<HTMLHeadingElement>(null)
	const descRef = useRef<HTMLParagraphElement>(null)
	const descMobileRef = useRef<HTMLParagraphElement>(null)
	const formattedIndex = String(index + 1).padStart(2, '0')

	useEffect(() => {
		const ctx = gsap.context(() => {
			gsap.fromTo(
				rowRef.current,
				{ opacity: 0, y: 20 },
				{
					opacity: 1,
					y: 0,
					duration: 0.5,
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

	function animateIn() {
		const targets = [
			indexRef.current,
			titleRef.current,
			descRef.current,
			descMobileRef.current,
		].filter(Boolean)
		gsap.to(targets, {
			color: '#FAFAFA',
			duration: HOVER_DURATION,
			ease: HOVER_EASE,
		})
	}

	function animateOut() {
		gsap.to(indexRef.current, {
			color: '#6B7280',
			duration: HOVER_DURATION,
			ease: HOVER_EASE,
		})
		gsap.to(titleRef.current, {
			color: '#101110',
			duration: HOVER_DURATION,
			ease: HOVER_EASE,
		})
		gsap.to([descRef.current, descMobileRef.current].filter(Boolean), {
			color: '#6B7280',
			duration: HOVER_DURATION,
			ease: HOVER_EASE,
		})
	}

	function handleMouseEnter(e: React.MouseEvent) {
		if (rowRef.current) onHoverEnter(rowRef.current, e)
		animateIn()
	}

	function handleMouseLeave(e: React.MouseEvent) {
		if (rowRef.current) onHoverLeave(rowRef.current, e)
		animateOut()
	}

	return (
		<div
			ref={rowRef}
			className="relative border-b border-subtle/40"
			onMouseEnter={handleMouseEnter}
			onMouseLeave={handleMouseLeave}
		>
			<div className="relative z-10 flex items-start py-6 md:py-8 px-4 md:px-6">
				<span
					ref={indexRef}
					className="text-sm md:text-base font-body font-medium text-muted w-12 md:w-16 flex-shrink-0 pt-1"
				>
					{formattedIndex}
				</span>

				<h3
					ref={titleRef}
					className="text-2xl md:text-3xl lg:text-4xl font-display font-bold text-ink flex-1"
				>
					{service.title}
				</h3>

				<div className="hidden md:block w-[45%] flex-shrink-0 pl-8">
					<p
						ref={descRef}
						className="text-sm md:text-base font-body leading-relaxed text-muted"
					>
						{service.description}
					</p>
				</div>
			</div>

			<div className="md:hidden px-4 pb-6">
				<p
					ref={descMobileRef}
					className="text-sm font-body leading-relaxed text-muted pl-12"
				>
					{service.description}
				</p>
			</div>
		</div>
	)
}

export function Services() {
	const sectionRef = useRef<HTMLDivElement>(null)
	const titleRef = useRef<HTMLDivElement>(null)
	const listRef = useRef<HTMLDivElement>(null)
	const hoverBgRef = useRef<HTMLDivElement>(null)
	const activeRowRef = useRef<HTMLElement | null>(null)

	const handleHoverEnter = useCallback(
		(rowEl: HTMLElement, e: React.MouseEvent) => {
			const bg = hoverBgRef.current
			const list = listRef.current
			if (!bg || !list) return

			const listRect = list.getBoundingClientRect()
			const rowRect = rowEl.getBoundingClientRect()
			const top = rowRect.top - listRect.top
			const isSliding = activeRowRef.current !== null
			activeRowRef.current = rowEl

			gsap.killTweensOf(bg)

			if (isSliding) {
				gsap.to(bg, {
					top,
					height: rowRect.height,
					scaleY: 1,
					duration: HOVER_DURATION,
					ease: HOVER_EASE,
				})
			} else {
				const fromTop = e.clientY < rowRect.top + rowRect.height / 2
				gsap.set(bg, {
					top,
					height: rowRect.height,
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
		(rowEl: HTMLElement, e: React.MouseEvent) => {
			const bg = hoverBgRef.current
			if (!bg) return

			requestAnimationFrame(() => {
				if (activeRowRef.current !== rowEl) return
				activeRowRef.current = null
				const rowRect = rowEl.getBoundingClientRect()
				const leaveFromTop = e.clientY < rowRect.top + rowRect.height / 2

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

	useEffect(() => {
		const ctx = gsap.context(() => {
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
				},
			)

			gsap.fromTo(
				titleRef.current,
				{ yPercent: 0 },
				{
					yPercent: 90,
					ease: 'none',
					scrollTrigger: {
						trigger: sectionRef.current,
						start: 'top top',
						end: 'bottom top',
						scrub: true,
					},
				},
			)
		}, sectionRef)

		return () => ctx.revert()
	}, [])

	return (
		<section
			id="services"
			ref={sectionRef}
			className="section-padding bg-canvas"
		>
			<div className="container-custom">
				<div className="flex flex-col md:flex-row">
					<div ref={titleRef} className="md:w-1/3 mb-12 md:mb-0">
						<h2 className="text-section-mobile md:text-section font-display font-bold text-subtle">
							Services
						</h2>
					</div>

					<div className="md:w-2/3 md:pl-12">
						<div ref={listRef} className="relative border-t border-subtle/40">
							<div
								ref={hoverBgRef}
								className="pointer-events-none absolute bg-ink"
								style={{ transform: 'scaleY(0)', left: 0, right: 0 }}
							/>
							{servicesData.map((service, index) => (
								<ServiceRow
									key={service.id}
									service={service}
									index={index}
									onHoverEnter={handleHoverEnter}
									onHoverLeave={handleHoverLeave}
								/>
							))}
						</div>
					</div>
				</div>
			</div>
		</section>
	)
}
