/**
 * useScrollMomentum – scroll-driven translate with lerp smoothing & post-scroll momentum.
 *
 * Moves an element along X or Y as the page scrolls, relative to a section's
 * position. When scrolling stops, residual velocity decays with friction for a
 * natural "glide" feel.
 *
 * Used for the split-word section titles (PRO-JE-CTS, AB-OUT-ME, GET-IN-TOUCH)
 * and the parallax stat numbers in About.
 */
import { useEffect, type RefObject } from 'react'

export interface ScrollMomentumOptions {
	/** Axis to translate on. Default `'x'`. */
	axis?: 'x' | 'y'
	/** Scroll-to-pixel ratio (higher = faster movement). Default `0.15`. */
	speed?: number
	/** Smoothing factor (0 = no follow, 1 = instant). Default `0.08`. */
	lerp?: number
	/** Per-frame velocity decay during momentum (closer to 1 = longer glide). Default `0.95`. */
	friction?: number
	/** Velocity multiplier when momentum kicks in. Default `1.4`. */
	boost?: number
	/** Stop momentum when velocity drops below this. Default `0.04`. */
	threshold?: number
	/** Ms to wait after last scroll event before starting momentum. Default `120`. */
	scrollEndMs?: number
}

const DEFAULTS: Required<ScrollMomentumOptions> = {
	axis: 'x',
	speed: 0.15,
	lerp: 0.08,
	friction: 0.95,
	boost: 1.4,
	threshold: 0.04,
	scrollEndMs: 120,
}

export function useScrollMomentum(
	elementRef: RefObject<HTMLElement | null>,
	sectionRef: RefObject<HTMLElement | null>,
	options?: ScrollMomentumOptions,
): void {
	useEffect(() => {
		const el = elementRef.current
		const section = sectionRef.current
		if (!el || !section) return

		const {
			axis,
			speed,
			lerp,
			friction,
			boost,
			threshold,
			scrollEndMs,
		} = { ...DEFAULTS, ...options }

		let lastScrollY = window.scrollY
		let scrollOrigin = section.getBoundingClientRect().top + window.scrollY
		let scrollBased = 0
		let momentum = 0
		let velocity = 0
		let displayed = 0
		let momentumActive = false
		let rafId: number | null = null
		let scrollEndTimeout: ReturnType<typeof setTimeout> | null = null

		function applyTransform(v: number) {
			if (!el) return
			el.style.transform =
				axis === 'x'
					? `translate3d(${v}px, 0, 0)`
					: `translate3d(0, ${v}px, 0)`
		}

		function tick() {
			if (momentumActive) {
				momentum += velocity
				velocity *= friction
				if (Math.abs(velocity) < threshold) {
					velocity = 0
					momentumActive = false
				}
			}
			const target = scrollBased + momentum
			displayed += (target - displayed) * lerp
			applyTransform(displayed)
			rafId = requestAnimationFrame(tick)
		}

		function updateScrollOrigin() {
			if (!section) return
			scrollOrigin = section.getBoundingClientRect().top + window.scrollY
			scrollBased = (window.scrollY - scrollOrigin) * speed
			displayed = scrollBased
		}

		function onScroll() {
			if (!section) return
			const scrollY = window.scrollY
			const delta = scrollY - lastScrollY

			scrollBased = (scrollY - scrollOrigin) * speed
			velocity = delta * speed
			lastScrollY = scrollY
			momentumActive = false

			if (scrollEndTimeout) clearTimeout(scrollEndTimeout)
			scrollEndTimeout = setTimeout(() => {
				scrollEndTimeout = null
				velocity *= boost
				momentumActive = true
			}, scrollEndMs)
		}

		updateScrollOrigin()
		applyTransform(displayed)
		rafId = requestAnimationFrame(tick)

		window.addEventListener('scroll', onScroll, { passive: true })
		window.addEventListener('resize', updateScrollOrigin)
		return () => {
			window.removeEventListener('scroll', onScroll)
			window.removeEventListener('resize', updateScrollOrigin)
			if (rafId !== null) cancelAnimationFrame(rafId)
			if (scrollEndTimeout) clearTimeout(scrollEndTimeout)
		}
	}, [elementRef, sectionRef, options?.axis, options?.speed, options?.lerp, options?.friction, options?.boost, options?.threshold, options?.scrollEndMs])
}
