/**
 * LoaderAMMonogram - Infinite drawing animation resembling a loading spinner
 *
 * Vivus-style: draws A then M (OneByOne), then erases. No pause between loops
 * so it feels continuous like a spinner. Uses stroke-dashoffset for the
 * drawing effect.
 *
 * @see https://maxwellito.github.io/vivus/
 */
import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'

/** Geometric paths for A and M (stroked outline, fill none) */
const PATH_A = 'M 10 90 L 25 12 L 40 90 M 18 62 L 32 62'
const PATH_M = 'M 55 90 L 55 12 L 72 52 L 90 12 L 90 90'

export function LoaderAMMonogram() {
	const pathARef = useRef<SVGPathElement>(null)
	const pathMRef = useRef<SVGPathElement>(null)

	useEffect(() => {
		const pathA = pathARef.current
		const pathM = pathMRef.current
		if (!pathA || !pathM) return

		const ctx = gsap.context(() => {
			gsap.set([pathA, pathM], {
				attr: { 'stroke-dasharray': 1, 'stroke-dashoffset': 1 },
			})

			const tl = gsap.timeline({ repeat: -1, repeatDelay: 0.25 })

			// 1. Draw A
			tl.to(pathA, {
				attr: { 'stroke-dashoffset': 0 },
				duration: 0.4,
				ease: 'power2.out',
			})
			// 2. Draw M (A stays visible)
			tl.to(pathM, {
				attr: { 'stroke-dashoffset': 0 },
				duration: 0.4,
				ease: 'power2.out',
			})
			// 3. Undraw M first
			tl.to(pathM, {
				attr: { 'stroke-dashoffset': 1 },
				duration: 0.35,
				ease: 'power2.in',
			})
			// 4. Start undrawing A as M is finishing
			tl.to(
				pathA,
				{
					attr: { 'stroke-dashoffset': 1 },
					duration: 0.35,
					ease: 'power2.in',
				},
				'-=0.1',
			)
		})

		return () => ctx.revert()
	}, [])

	return (
		<svg
			className="text-white"
			viewBox="0 0 100 100"
			width={48}
			height={48}
			aria-hidden
		>
			<path
				ref={pathARef}
				d={PATH_A}
				fill="none"
				stroke="currentColor"
				strokeWidth={4}
				strokeLinecap="round"
				strokeLinejoin="round"
				pathLength={1}
			/>
			<path
				ref={pathMRef}
				d={PATH_M}
				fill="none"
				stroke="currentColor"
				strokeWidth={4}
				strokeLinecap="round"
				strokeLinejoin="round"
				pathLength={1}
			/>
		</svg>
	)
}
