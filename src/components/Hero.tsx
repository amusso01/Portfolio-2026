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
 * ANIMATIONS (GSAP): See useHeroAnimations hook
 * - Hello (h2): variable font weight wave on load + proximity on hover
 * - Subtitle: words slide up with stagger after Hello
 * - Image: ellipse clip reveal + parallax on mouse
 *
 * Layout: 12-col grid; on mobile, image appears above text (order-1/order-2)
 */
import { Fragment, useRef } from 'react'
import profileData from '../data/profile.json'
import {
	HELLO_CHARS,
	PLACEHOLDER_IMAGE,
	getSubtitleWords,
} from './hero.utils'
import { useHeroAnimations } from '../hooks/useHeroAnimations'
import { Marquee } from './Marquee'

export function Hero() {
	const heroRef = useRef<HTMLDivElement>(null)
	const contentRef = useRef<HTMLDivElement>(null)
	const imageRef = useRef<HTMLDivElement>(null)
	const imageClipRef = useRef<HTMLDivElement>(null)
	const subtitleWrapRef = useRef<HTMLDivElement>(null)

	useHeroAnimations({
		heroRef,
		contentRef,
		imageRef,
		imageClipRef,
		subtitleWrapRef,
	})

	const subtitleWords = getSubtitleWords()

	return (
		<section
			id="hero"
			ref={heroRef}
			className="min-h-screen flex flex-col relative bg-canvas"
		>
			{/* Main content area - Full width, closer to edges */}
			<div className="flex-1 px-8 md:px-16 container-custom flex items-center pt-8 pb-8">
				<div className="grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-8 w-full items-center">
					{/* Left side - Text content */}
					<div
						ref={contentRef}
						className="md:col-span-8 lg:col-span-7 order-2 md:order-1"
					>
						<h2
							data-hello-container
							className="text-hero-mobile md:text-[90px] lg:text-[120px] xl:text-hero 2xl:text-[220px] font-display text-ink pb-5 cursor-default"
						>
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

						<div ref={subtitleWrapRef} className="overflow-hidden opacity-0">
							<p className="text-lg md:text-xl lg:text-3xl 2xl:text-4xl font-light max-w-full 2xl:max-w-2xl">
								{subtitleWords.map((w, i) => (
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
										{i < subtitleWords.length - 1 ? ' ' : null}
									</Fragment>
								))}
							</p>
						</div>
					</div>

					{/* Right side - Image */}
					<div
						ref={imageRef}
						className="md:col-span-4 lg:col-span-5 order-1 md:order-2 flex justify-center lg:justify-end"
					>
						<div
							ref={imageClipRef}
							className="relative w-full max-w-sm md:max-w-md aspect-[3/4] overflow-hidden rounded-sm"
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
