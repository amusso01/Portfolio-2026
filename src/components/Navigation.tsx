/**
 * =============================================================================
 * Navigation - Desktop & Mobile Nav Components
 * =============================================================================
 *
 * NAVIGATION (desktop):
 * - Fixed bottom pill (hidden on mobile: hidden md:block)
 * - Uses Magnetic for hover effect on nav items
 * - Active section tracked via scroll listener (which section top is near viewport top)
 * - GSAP ScrollToPlugin for smooth scroll to section on click
 *
 * MOBILENAVIGATION (mobile):
 * - Fixed top bar (shown only on mobile: md:hidden)
 * - Same section tracking and scroll-to logic
 *
 * navItems maps labels to #hero, #about, #skills, #work, #contact.
 */
import { useState, useEffect, useRef, MouseEvent } from 'react'
import { Magnetic } from './Magnetic'
import { gsap } from 'gsap'
import { ScrollToPlugin } from 'gsap/ScrollToPlugin'

gsap.registerPlugin(ScrollToPlugin)

interface NavItem {
	label: string
	href: string
}

const navItems: NavItem[] = [
	{ label: 'Hero', href: '#hero' },
	{ label: 'About', href: '#about' },
	{ label: 'Skills', href: '#skills' },
	{ label: 'Work', href: '#work' },
	{ label: 'Contact', href: '#contact' },
]

export function Navigation() {
	const [activeSection, setActiveSection] = useState('hero')
	const isScrollingRef = useRef(false)
	const scrollTimeoutRef = useRef<number | null>(null)

	useEffect(() => {
		const handleScroll = () => {
			const sections = navItems.map((item) => item.href.slice(1))

			for (const section of sections.reverse()) {
				const element = document.getElementById(section)
				if (element) {
					const rect = element.getBoundingClientRect()
					if (rect.top <= 150) {
						setActiveSection(section)
						break
					}
				}
			}
		}

		window.addEventListener('scroll', handleScroll)
		return () => window.removeEventListener('scroll', handleScroll)
	}, [])

	const scrollToSection = (href: string) => {
		// Prevent multiple rapid clicks
		if (isScrollingRef.current) {
			return
		}

		const element = document.querySelector(href)
		if (element) {
			isScrollingRef.current = true
			if (scrollTimeoutRef.current) {
				window.clearTimeout(scrollTimeoutRef.current)
			}
			/* GSAP ScrollToPlugin: smooth scroll to section */
			const targetTop = element.getBoundingClientRect().top + window.scrollY
			const headerOffset = 80

			gsap.to(window, {
				scrollTo: { y: targetTop - headerOffset, autoKill: false },
				duration: 0.8,
				ease: 'power2.inOut',
				onComplete: () => {
					isScrollingRef.current = false
				},
			})
		}
	}

	const handleNavClick = (e: MouseEvent<HTMLButtonElement>, href: string) => {
		e.preventDefault()
		scrollToSection(href)
	}

	return (
		<nav
			className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 hidden md:block"
			aria-label="Main navigation"
		>
			<div className="flex items-center gap-2 px-5 py-2 bg-white/80 backdrop-blur-xl rounded-full border border-subtle shadow-sm">
				{navItems.map((item) => (
					<Magnetic key={item.href} strength={0.3} bounds={0.5}>
						<button
							onClick={(e) => handleNavClick(e, item.href)}
							className={`relative px-4 py-2 text-sm font-[450] font-body transition-colors duration-300 ease-premium ${
								activeSection === item.href.slice(1)
									? 'text-ink'
									: 'text-muted hover:text-ink'
							}`}
						>
							{item.label}
							{activeSection === item.href.slice(1) && (
								<span className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-accent rounded-full" />
							)}
						</button>
					</Magnetic>
				))}
			</div>
		</nav>
	)
}

export function MobileNavigation() {
	const [activeSection, setActiveSection] = useState('hero')
	const isScrollingRef = useRef(false)

	useEffect(() => {
		const handleScroll = () => {
			const sections = navItems.map((item) => item.href.slice(1))

			for (const section of sections.reverse()) {
				const element = document.getElementById(section)
				if (element) {
					const rect = element.getBoundingClientRect()
					if (rect.top <= 150) {
						setActiveSection(section)
						break
					}
				}
			}
		}

		window.addEventListener('scroll', handleScroll)
		return () => window.removeEventListener('scroll', handleScroll)
	}, [])

	const scrollToSection = (href: string) => {
		if (isScrollingRef.current) return
		const element = document.querySelector(href)
		if (element) {
			isScrollingRef.current = true
			const targetTop = element.getBoundingClientRect().top + window.scrollY
			const headerOffset = 100 /* Mobile header height */

			gsap.to(window, {
				scrollTo: { y: targetTop - headerOffset, autoKill: false },
				duration: 0.8,
				ease: 'power2.inOut',
				onComplete: () => {
					isScrollingRef.current = false
				},
			})
		}
	}

	const handleNavClick = (e: MouseEvent<HTMLButtonElement>, href: string) => {
		e.preventDefault()
		scrollToSection(href)
	}

	return (
		<nav className="fixed top-0 left-0 right-0 z-50 md:hidden bg-white/80 backdrop-blur-xl border-b border-subtle">
			<div className="flex items-center justify-between px-4 py-3 overflow-x-auto">
				<span className="text-lg font-bold font-display whitespace-nowrap">
					AM
				</span>
				<div className="flex items-center gap-1">
					{navItems.map((item) => (
						<button
							key={item.href}
							onClick={(e) => handleNavClick(e, item.href)}
							className={`px-3 py-1.5 text-xs font-medium transition-colors duration-300 ease-premium whitespace-nowrap ${
								activeSection === item.href.slice(1)
									? 'text-ink bg-subtle rounded-full'
									: 'text-muted hover:text-ink'
							}`}
						>
							{item.label}
						</button>
					))}
				</div>
			</div>
		</nav>
	)
}
