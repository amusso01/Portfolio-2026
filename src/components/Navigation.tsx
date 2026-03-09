/**
 * =============================================================================
 * Navigation - Desktop & Mobile Nav Components
 * =============================================================================
 *
 * NAVIGATION (desktop):
 * - Fixed bottom pill (hidden on mobile: hidden md:block)
 * - Uses Magnetic for hover effect on nav items
 * - Active section and scroll-to logic from useActiveSection / useScrollToSection
 *
 * MOBILENAVIGATION (mobile):
 * - Fixed top bar (shown only on mobile: md:hidden)
 * - Same section tracking and scroll-to logic with different header offset
 */
import { MouseEvent } from 'react'
import { Magnetic } from './Magnetic'
import {
	navItems,
	useActiveSection,
	useScrollToSection,
} from '../hooks/useNavigation'

const DESKTOP_HEADER_OFFSET = 80
const MOBILE_HEADER_OFFSET = 100

export function Navigation() {
	const activeSection = useActiveSection()
	const scrollToSection = useScrollToSection(DESKTOP_HEADER_OFFSET)

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
								<span className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-selection rounded-full" />
							)}
						</button>
					</Magnetic>
				))}
			</div>
		</nav>
	)
}

export function MobileNavigation() {
	const activeSection = useActiveSection()
	const scrollToSection = useScrollToSection(MOBILE_HEADER_OFFSET)

	const handleNavClick = (e: MouseEvent<HTMLButtonElement>, href: string) => {
		e.preventDefault()
		scrollToSection(href)
	}

	return (
		<nav className="fixed top-0 left-0 right-0 z-50 md:hidden bg-white/80 backdrop-blur-xl border-b border-subtle">
			<div className="flex items-center justify-between px-2 py-2 overflow-x-auto">
				<span className="text-lg font-bold font-display whitespace-nowrap shrink-0">
					AM
				</span>
				<div className="flex items-center gap-0.5 min-w-0">
					{navItems.map((item) => (
						<button
							key={item.href}
							onClick={(e) => handleNavClick(e, item.href)}
							className={`px-2 py-1 text-xs font-medium transition-colors duration-300 ease-premium whitespace-nowrap ${
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
