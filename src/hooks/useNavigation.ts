/**
 * Shared navigation logic: active section detection and smooth scroll to section.
 * Used by both desktop Navigation and MobileNavigation.
 */
import { useState, useEffect, useRef, useCallback } from 'react'
import { gsap } from 'gsap'
import { ScrollToPlugin } from 'gsap/ScrollToPlugin'

gsap.registerPlugin(ScrollToPlugin)

export interface NavItem {
	label: string
	href: string
}

export const navItems: NavItem[] = [
	{ label: 'Hero', href: '#hero' },
	{ label: 'About', href: '#about' },
	{ label: 'Work', href: '#work' },
	{ label: 'Services', href: '#services' },
	{ label: 'Contact', href: '#contact' },
]

const sectionIds = navItems.map((item) => item.href.slice(1))
const sectionSelector = sectionIds.map((id) => `#${id}`).join(',')

/**
 * Returns the current active section id based on scroll position.
 * Section is "active" when its top is at or above 150px from viewport top.
 * Uses DOM order (not nav order) so the correct section is highlighted when
 * layout order differs from nav (e.g. Work before Skills in the page).
 */
export function useActiveSection(): string {
	const [activeSection, setActiveSection] = useState('hero')

	useEffect(() => {
		let rafId: number | null = null

		const updateActiveSection = () => {
			const sections = document.querySelectorAll<HTMLElement>(sectionSelector)
			// Iterate in reverse DOM order so we get the topmost section that has passed the threshold
			for (let i = sections.length - 1; i >= 0; i--) {
				const element = sections[i]
				const id = element.id
				if (id) {
					const rect = element.getBoundingClientRect()
					if (rect.top <= 150) {
						setActiveSection(id)
						break
					}
				}
			}
			rafId = null
		}

		const handleScroll = () => {
			if (rafId === null) {
				rafId = requestAnimationFrame(updateActiveSection)
			}
		}

		window.addEventListener('scroll', handleScroll, { passive: true })
		// Run once on mount so initial position / hash is reflected
		rafId = requestAnimationFrame(updateActiveSection)
		return () => {
			window.removeEventListener('scroll', handleScroll)
			if (rafId !== null) cancelAnimationFrame(rafId)
		}
	}, [])

	return activeSection
}

/**
 * Returns a stable scrollToSection function that smooth-scrolls to the given href
 * with the specified header offset. Prevents multiple rapid clicks.
 */
export function useScrollToSection(headerOffset: number): (href: string) => void {
	const isScrollingRef = useRef(false)

	return useCallback((href: string) => {
		if (isScrollingRef.current) return

		const element = document.querySelector(href)
		if (!element) return

		isScrollingRef.current = true
		const targetTop =
			element.getBoundingClientRect().top + window.scrollY

		gsap.to(window, {
			scrollTo: { y: targetTop - headerOffset, autoKill: false },
			duration: 0.8,
			ease: 'power2.inOut',
			onComplete: () => {
				isScrollingRef.current = false
			},
		})
	}, [headerOffset])
}
