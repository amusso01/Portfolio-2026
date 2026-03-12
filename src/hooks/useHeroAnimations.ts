/**
 * useHeroAnimations – GSAP animations for the Hero section.
 *
 * Orchestrates:
 * - Subtitle: hidden initially, words slide up with stagger after Hello wave
 * - Hello: font-weight wave (100→900→300) per char; proximity effect on hover
 * - Image: ellipse clip reveal + parallax (magnet) following mouse
 */
import { useEffect, RefObject } from 'react'
import { gsap } from 'gsap'
import { useLoaderExited } from '../context/LoaderContext'

/** Refs required by useHeroAnimations – must point to Hero DOM nodes */
export interface HeroAnimationRefs {
	heroRef: RefObject<HTMLDivElement | null>
	contentRef: RefObject<HTMLDivElement | null>
	imageRef: RefObject<HTMLDivElement | null>
	imageClipRef: RefObject<HTMLDivElement | null>
	subtitleWrapRef: RefObject<HTMLDivElement | null>
}

/** Set subtitle hidden and words below viewport before animation */
function setupSubtitleInitialState(subtitleWrapRef: HTMLDivElement) {
	gsap.set(subtitleWrapRef, { opacity: 0 })
	const wordInners = subtitleWrapRef.querySelectorAll<HTMLElement>(
		'.subtitle-word-inner',
	)
	gsap.set(wordInners, { y: '100%' })
}

/** Fade in subtitle and slide words up with stagger */
function runSubtitleAnimation(subtitleWrapRef: HTMLDivElement) {
	gsap.to(subtitleWrapRef, {
		opacity: 1,
		duration: 0.15,
		ease: 'power2.out',
	})
	const wordInners = subtitleWrapRef.querySelectorAll<HTMLElement>(
		'.subtitle-word-inner',
	)
	gsap.to(wordInners, {
		y: 0,
		duration: 0.35,
		stagger: 0.04,
		ease: 'power3.out',
	})
}

/**
 * Hello wave: each char swells 100→900→300 with stagger.
 * Triggers subtitle animation before wave ends (tl.call).
 * Proximity: letters grow (fontWeight) by cursor distance within radius.
 * Returns cleanup to remove mousemove/mouseleave listeners.
 */
function runHelloWaveAndProximity(
	contentRef: HTMLDivElement,
	subtitleWrapRef: HTMLDivElement | null,
): (() => void) | null {
	const helloChars =
		contentRef.querySelectorAll<HTMLElement>('[data-hello-char]')
	if (!helloChars.length) return null

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

	tl.call(
		() => {
			if (subtitleWrapRef) runSubtitleAnimation(subtitleWrapRef)
		},
		[],
		'-=0.35',
	)

	const radius = 200
	const handleHelloMouseMove = (e: MouseEvent) => {
		const mouseX = e.clientX
		const mouseY = e.clientY
		helloChars.forEach((el) => {
			const rect = el.getBoundingClientRect()
			const centerX = rect.left + rect.width / 2
			const centerY = rect.top + rect.height / 2
			const dx = mouseX - centerX
			const dy = mouseY - centerY
			const distance = Math.sqrt(dx * dx + dy * dy)
			const strength = Math.max(0, 1 - distance / radius)
			const fontWeight = Math.round(300 + strength * 600)
			gsap.to(el, { fontWeight, duration: 0.12, ease: 'none' })
		})
	}
	const handleHelloMouseLeave = () => {
		gsap.to(helloChars, {
			fontWeight: 300,
			duration: 0.35,
			ease: 'ease',
		})
	}
	const helloContainer = contentRef.querySelector<HTMLElement>(
		'[data-hello-container]',
	)
	if (helloContainer) {
		helloContainer.addEventListener('mousemove', handleHelloMouseMove)
		helloContainer.addEventListener('mouseleave', handleHelloMouseLeave)
		return () => {
			helloContainer.removeEventListener('mousemove', handleHelloMouseMove)
			helloContainer.removeEventListener('mouseleave', handleHelloMouseLeave)
		}
	}
	return null
}

/**
 * Image reveal: fade in + ellipse clip from top.
 * Parallax: image follows mouse (magnet effect) on desktop only; disabled on mobile to prevent overflow.
 * Returns cleanup to remove global mousemove listener and media query listener.
 */
function runImageAnimations(
	imageRef: HTMLDivElement | null,
	imageClipRef: HTMLDivElement | null,
): () => void {
	// Initial state is set in Hero.tsx (opacity: 0, clipPath) to avoid flash before GSAP runs
	gsap.to(imageRef, {
		opacity: 1,
		duration: 0.5,
		delay: 0.3,
		ease: 'power2.out',
	})

	gsap.to(imageClipRef, {
		clipPath: 'ellipse(100% 150% at 50% 0%)',
		duration: 1.5,
		delay: 0.35,
		ease: 'power2.out',
	})

	const mediaQuery = window.matchMedia('(min-width: 768px)')

	const handleMouseMove = (e: MouseEvent) => {
		if (!imageRef || !mediaQuery.matches) return
		const { clientX, clientY } = e
		const { innerWidth, innerHeight } = window
		const xPos = (clientX / innerWidth - 0.5) * 48
		const yPos = (clientY / innerHeight - 0.5) * 48
		gsap.to(imageRef, {
			x: xPos,
			y: yPos,
			duration: 0.9,
			ease: 'power2.out',
		})
	}

	const handleMediaChange = (e: MediaQueryListEvent) => {
		if (!imageRef) return
		if (!e.matches) {
			gsap.set(imageRef, { x: 0, y: 0 })
		}
	}

	mediaQuery.addEventListener('change', handleMediaChange)
	// Reset transform on mobile (e.g. initial load or when resizing to mobile)
	if (!mediaQuery.matches && imageRef) {
		gsap.set(imageRef, { x: 0, y: 0 })
	}
	window.addEventListener('mousemove', handleMouseMove)

	return () => {
		window.removeEventListener('mousemove', handleMouseMove)
		mediaQuery.removeEventListener('change', handleMediaChange)
	}
}

/** Hook to run all Hero GSAP animations; call with refs from Hero component.
 * Waits for loader to exit so animations are visible (app pre-mounts under overlay). */
export function useHeroAnimations(refs: HeroAnimationRefs) {
	const { heroRef, contentRef, imageRef, imageClipRef, subtitleWrapRef } = refs
	const loaderExited = useLoaderExited()

	useEffect(() => {
		if (!loaderExited) return

		let cleanupProximity: (() => void) | null = null
		let cleanupParallax: (() => void) | null = null

		const ctx = gsap.context(() => {
			if (subtitleWrapRef.current) {
				setupSubtitleInitialState(subtitleWrapRef.current)
			}

			if (contentRef.current) {
				cleanupProximity = runHelloWaveAndProximity(
					contentRef.current,
					subtitleWrapRef.current,
				)
			}

			cleanupParallax = runImageAnimations(
				imageRef.current,
				imageClipRef.current,
			)
		}, heroRef)

		return () => {
			cleanupProximity?.()
			cleanupParallax?.()
			ctx.revert()
		}
	}, [loaderExited, heroRef, contentRef, imageRef, imageClipRef, subtitleWrapRef])
}
