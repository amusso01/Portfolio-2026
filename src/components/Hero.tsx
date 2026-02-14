/**
 * =============================================================================
 * Hero - Landing Section (Above the Fold)
 * =============================================================================
 *
 * The first thing visitors see. Contains:
 * - Greeting + intro text (left)
 * - Profile image with parallax on mouse move (right)
 * - Marquee strip at bottom with scrolling tags (WEB DEVELOPER, FREELANCE, etc.)
 *
 * ANIMATIONS (GSAP):
 * - Hello (h2): variable font weight wave — each char 100→900→300; next char
 *   starts swelling when previous starts returning (Alexandria variable font).
 * - Subtitle: appears after Hello; words slide up from overflow-hidden with stagger.
 * - Image: ellipse clip reveal + parallax (magnet) on mouse.
 *
 * Layout: 12-col grid; on mobile, image appears above text (order-1/order-2)
 */
import { Fragment, useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import profileData from '../data/profile.json'
import { Marquee } from './Marquee'

const HELLO_CHARS = ['H', 'e', 'l', 'l', 'o']

/** Build subtitle as word chunks for stagger (each can be bold) */
function getSubtitleWords(): { text: string; bold?: boolean }[] {
	const first = profileData.name.split(' ')[0]
	const years = profileData.yearsOfExperience
	return [
		{ text: '"I\'m' },
		{ text: first, bold: true },
		{ text: 'a' },
		{ text: 'web' },
		{ text: 'developer', bold: true },
		{ text: 'with' },
		{ text: `${years}+` },
		{ text: 'years' },
		{ text: 'experience' },
		{ text: 'primarily' },
		{ text: 'focusing' },
		{ text: 'on' },
		{ text: 'E-Commerce', bold: true },
		{ text: 'and' },
		{ text: 'Front-end.', bold: true },
		{ text: 'Welcome' },
		{ text: 'to' },
		{ text: 'my' },
		{ text: 'site"' },
	]
}

/** Replace with your own headshot URL */
const PLACEHOLDER_IMAGE = '/AM.png'

export function Hero() {
	const heroRef = useRef<HTMLDivElement>(null)
	const contentRef = useRef<HTMLDivElement>(null)
	const imageRef = useRef<HTMLDivElement>(null)
	const imageClipRef = useRef<HTMLDivElement>(null)
	const subtitleWrapRef = useRef<HTMLDivElement>(null)

	useEffect(() => {
		const ctx = gsap.context(() => {
			/* Subtitle: start hidden; each word starts below (staggered slide-up after Hello) */
			if (subtitleWrapRef.current) {
				gsap.set(subtitleWrapRef.current, { opacity: 0 })
				const wordInners = subtitleWrapRef.current.querySelectorAll<HTMLElement>('.subtitle-word-inner')
				gsap.set(wordInners, { y: '100%' })
			}

			/* Hello (h2): variable font weight wave — 100→900→300 per char; next char swells as previous returns */
			const helloChars =
				contentRef.current?.querySelectorAll<HTMLElement>('[data-hello-char]')
			if (helloChars?.length) {
				const tl = gsap.timeline({ delay: 0.2 })
				const swellDuration = 0.28
				const returnDuration = 0.28
				const stagger = 0.12
				helloChars.forEach((el, i) => {
					const t = i * stagger
					tl.fromTo(
						el,
						{ fontWeight: 100 },
						{ fontWeight: 900, duration: swellDuration, ease: 'none' },
						t,
					)
					tl.to(
						el,
						{ fontWeight: 300, duration: returnDuration, ease: 'none' },
						t + stagger,
					)
				})
				/* Subtitle starts slightly before Hello ends; quicker word stagger */
				tl.call(
					() => {
						if (subtitleWrapRef.current) {
							gsap.to(subtitleWrapRef.current, {
								opacity: 1,
								duration: 0.15,
								ease: 'power2.out',
							})
							const wordInners = subtitleWrapRef.current.querySelectorAll<HTMLElement>('.subtitle-word-inner')
							gsap.to(wordInners, {
								y: 0,
								duration: 0.35,
								stagger: 0.04,
								ease: 'power3.out',
							})
						}
					},
					[],
					'-=0.35',
				)
			}

			/* Image container: subtle position, no slide – liquify happens via clip */
			gsap.fromTo(
				imageRef.current,
				{ opacity: 0 },
				{
					opacity: 1,
					duration: 0.5,
					delay: 0.3,
					ease: 'power2.out',
				},
			)

			/* Reveal top-to-bottom: ellipse grows from top center (curved edge) */
			gsap.fromTo(
				imageClipRef.current,
				{
					clipPath: 'ellipse(100% 0% at 50% 0%)',
				},
				{
					clipPath: 'ellipse(100% 150% at 50% 0%)',
					duration: 1.5,
					delay: 0.35,
					ease: 'power2.out',
				},
			)

			/* Parallax (magnet): image follows mouse; stronger pull from viewport center */
			const handleMouseMove = (e: MouseEvent) => {
				if (!imageRef.current) return
				const { clientX, clientY } = e
				const { innerWidth, innerHeight } = window
				const xPos = (clientX / innerWidth - 0.5) * 22
				const yPos = (clientY / innerHeight - 0.5) * 22

				gsap.to(imageRef.current, {
					x: xPos,
					y: yPos,
					duration: 0.5,
					ease: 'power2.out',
				})
			}

			window.addEventListener('mousemove', handleMouseMove)
			return () => window.removeEventListener('mousemove', handleMouseMove)
		}, heroRef)

		return () => ctx.revert()
	}, [])

	return (
		<section
			id="hero"
			ref={heroRef}
			className="min-h-screen flex flex-col relative bg-canvas"
		>
			{/* Main content area - Full width, closer to edges */}
			<div className="flex-1 px-8 md:px-16 container-custom flex items-center pt-8 pb-12">
				<div className="grid grid-cols-1 lg:grid-cols-12 gap-4 md:gap-8 w-full items-center">
					{/* Left side - Text content */}
					<div
						ref={contentRef}
						className=" md:col-span-8 lg:col-span-7 order-2 lg:order-1"
					>
						<h2 className="text-hero-mobile lg:text-[120px] xl:text-hero 2xl:text-[220px] font-display text-ink pb-5">
							{HELLO_CHARS.map((char, i) => (
								<span
									key={i}
									data-hello-char
									className="inline-block"
									style={{ fontWeight: 100 }}
								>
									{char}
								</span>
							))}{' '}
							<span className="text-accent">—</span>
						</h2>

						<div
							ref={subtitleWrapRef}
							className="overflow-hidden opacity-0"
						>
							<p className="text-lg md:text-xl lg:text-3xl 2xl:text-4xl font-light max-w-full 2xl:max-w-2xl">
								{getSubtitleWords().map((w, i) => (
									<Fragment key={i}>
										<span className="subtitle-word-wrap overflow-hidden inline-block align-bottom">
											<span className="subtitle-word-inner inline-block will-change-transform">
												{w.bold ? (
													<span className="font-[400]">{w.text}</span>
												) : (
													w.text
												)}
											</span>
										</span>
										{i < getSubtitleWords().length - 1 ? ' ' : null}
									</Fragment>
								))}
							</p>
						</div>
					</div>

					{/* Right side - Image */}
					<div
						ref={imageRef}
						className="md:col-span-4 lg:col-span-5 order-1 lg:order-2 flex justify-center lg:justify-end"
					>
						<div
							ref={imageClipRef}
							className="relative w-full max-w-sm aspect-[3/4] overflow-hidden rounded-sm"
						>
							<img
								src={PLACEHOLDER_IMAGE}
								alt={profileData.name}
								className="w-full h-full object-cover"
							/>
						</div>
					</div>
				</div>
			</div>

			{/* Scrolling marquee at bottom */}
			<Marquee />
		</section>
	)
}
