/**
 * Scroll-velocity marquee: base drift L→R, scroll down = faster L→R, scroll up = R→L.
 * Reusable horizontal strip with infinite loop in both directions.
 */
import { useEffect, useRef } from 'react'

/** Items shown in the scrolling marquee */
const MARQUEE_ITEMS = ['DEVELOPER', 'FREELANCE', 'CREATIVE', 'DESIGN', 'AM']

/** Number of repeated segments so track is always wider than viewport (no white space) */
const MARQUEE_COPIES = 12

function RotatingPlus({ index }: { index: number }) {
	// Stagger each plus so they're at different phases of the 8s rotation
	const delay = -(index * 0.5) // negative = start partway through cycle
	return (
		<svg
			className="w-5 h-5 text-selection animate-spin-slow"
			style={{ animationDelay: `${delay}s` }}
			viewBox="0 0 24 24"
			fill="none"
			xmlns="http://www.w3.org/2000/svg"
		>
			<path
				d="M12 5V19M5 12H19"
				stroke="currentColor"
				strokeWidth="2"
				strokeLinecap="round"
			/>
		</svg>
	)
}

/** 1 = L→R, -1 = R→L; direction persists until user scrolls the other way */
const DIRECTION_LTR = 1
const DIRECTION_RTL = -1

export function Marquee() {
	const trackRef = useRef<HTMLDivElement>(null)
	const offsetRef = useRef(0)
	const velocityRef = useRef(0)
	const lastScrollYRef = useRef(0)
	const directionRef = useRef(DIRECTION_LTR) // which way the marquee drifts; flips only on scroll
	const segmentWidthRef = useRef(400) // fallback until measured
	const rafRef = useRef<number>(0)

	const items = Array.from(
		{ length: MARQUEE_COPIES },
		() => MARQUEE_ITEMS,
	).flat()

	useEffect(() => {
		const BASE_DRIFT = 0.15 // px/frame in current direction
		const SCROLL_FACTOR = 0.03 // lower = slower reaction to scroll
		const FRICTION = 0.88 // FRICTION controls how quickly the marquee's scroll velocity slows down ("momentum dampening")

		const tick = () => {
			const track = trackRef.current
			if (!track) {
				rafRef.current = requestAnimationFrame(tick)
				return
			}
			const segmentWidth = segmentWidthRef.current
			// Base drift in current direction so it keeps going until user scrolls the other way
			offsetRef.current +=
				BASE_DRIFT * directionRef.current + velocityRef.current
			velocityRef.current *= FRICTION

			// Wrap offset to [0, segmentWidth) for seamless loop
			let o = offsetRef.current
			while (o >= segmentWidth) o -= segmentWidth
			while (o < 0) o += segmentWidth
			offsetRef.current = o

			track.style.transform = `translateX(-${offsetRef.current}px)`
			rafRef.current = requestAnimationFrame(tick)
		}

		const handleScroll = () => {
			const scrollY = window.scrollY
			const delta = scrollY - lastScrollYRef.current
			// Update persistent direction: scroll down → L→R, scroll up → R→L
			if (delta > 0) directionRef.current = DIRECTION_LTR
			else if (delta < 0) directionRef.current = DIRECTION_RTL
			velocityRef.current += delta * SCROLL_FACTOR
			lastScrollYRef.current = scrollY
		}

		// One segment = one full set of marquee items (total width / number of segments)
		const measure = () => {
			if (trackRef.current) {
				const w = trackRef.current.scrollWidth
				if (w > 0) segmentWidthRef.current = w / MARQUEE_COPIES
			}
		}

		measure()
		window.addEventListener('resize', measure)
		window.addEventListener('scroll', handleScroll, { passive: true })
		lastScrollYRef.current = window.scrollY
		rafRef.current = requestAnimationFrame(tick)

		return () => {
			window.removeEventListener('scroll', handleScroll)
			window.removeEventListener('resize', measure)
			cancelAnimationFrame(rafRef.current)
		}
	}, [])

	return (
		<div className="overflow-hidden h-12 bg-canvas">
			<div
				ref={trackRef}
				className="flex items-center h-full w-max gap-8"
				style={{ willChange: 'transform' }}
			>
				{items.map((item, index) => (
					<div key={index} className="flex items-center gap-8 shrink-0">
						<span className="text-base md:text-xl font-light uppercase tracking-[15%] whitespace-nowrap">
							{item}
						</span>
						<RotatingPlus index={index} />
					</div>
				))}
			</div>
		</div>
	)
}
