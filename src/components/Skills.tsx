/**
 * =============================================================================
 * Skills - Skills & Expertise Section
 * =============================================================================
 *
 * Layout: Title on left (1/3), 3-column tech stack grid on right (2/3).
 * Skills shown as uppercase names in rows of 3 with subtle row dividers.
 *
 * ANIMATIONS (all scroll-triggered):
 * - Section title: fades in when section enters view
 * - Grid rows: fade in + slide up with stagger
 */
import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import skillsData from '../data/skills.json'
import { Magnetic } from './Magnetic'

gsap.registerPlugin(ScrollTrigger)

/** Chunk an array into groups of `size` */
function chunk<T>(arr: T[], size: number): T[][] {
	const result: T[][] = []
	for (let i = 0; i < arr.length; i += size) {
		result.push(arr.slice(i, i + size))
	}
	return result
}

export function Skills() {
	const sectionRef = useRef<HTMLDivElement>(null)
	const titleRef = useRef<HTMLDivElement>(null)
	const contentRef = useRef<HTMLDivElement>(null)

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

			const gridRows = contentRef.current?.querySelectorAll('.skill-row')
			if (gridRows) {
				gsap.fromTo(
					gridRows,
					{ opacity: 0, y: 15 },
					{
						opacity: 1,
						y: 0,
						duration: 0.5,
						stagger: 0.06,
						ease: 'power3.out',
						scrollTrigger: {
							trigger: contentRef.current,
							start: 'top 85%',
							toggleActions: 'play none none reverse',
						},
					},
				)
			}
		}, sectionRef)

		return () => ctx.revert()
	}, [])

	const rows = chunk(skillsData.techStack, 3)

	return (
		<section id="skills" ref={sectionRef} className="section-padding bg-canvas">
			<div className="container-custom">
				<div className="flex flex-col md:flex-row">
					{/* Title on the left */}
					<div ref={titleRef} className="md:w-1/3 mb-12 md:mb-0">
						<h2 className="text-section-mobile md:text-section font-display font-bold text-subtle">
							Skills & Expertise
						</h2>
					</div>

					{/* 3-column tech stack grid on the right */}
					<div ref={contentRef} className="md:w-2/3 md:pl-12">
						{rows.map((row, rowIndex) => (
							<div
								key={rowIndex}
								className="skill-row grid grid-cols-3 border-t border-subtle/40"
							>
								{row.map((skill) => (
									<Magnetic key={skill} strength={0.15} bounds={0.4}>
										<span className="inline-block py-5 text-sm md:text-base font-body font-medium text-ink uppercase tracking-wider cursor-default">
											{skill}
										</span>
									</Magnetic>
								))}
							</div>
						))}
						<div className="border-t border-subtle/40" />
					</div>
				</div>
			</div>
		</section>
	)
}
