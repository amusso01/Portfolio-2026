/**
 * =============================================================================
 * APP - Root Component & Page Layout
 * =============================================================================
 *
 * This component defines the overall page structure. Key architectural choices:
 *
 * SMOOTH SCROLLING (ReactLenis):
 * - Wraps the entire app in ReactLenis for buttery-smooth scroll behavior
 * - lerp: 0.1 = interpolation factor (lower = smoother, more "floaty")
 * - duration: 1.5 = scroll animation duration in seconds
 * - smoothWheel: true = smooths native wheel events
 *
 * LAYOUT STRUCTURE:
 * 1. TopHeader - Fixed header with location, time, name, availability
 * 2. Navigation - Fixed bottom pill (desktop)
 * 3. MobileNavigation - Fixed top bar (mobile only)
 * 4. main - Scrollable content: Hero → About → Work → Skills → Services → Contact
 *
 */
import { ReactLenis } from '@studio-freight/react-lenis'
import { Navigation, MobileNavigation } from './components/Navigation'
import { TopHeader } from './components/TopHeader'
import { Hero } from './components/Hero'
import { About } from './components/About'
import { Skills } from './components/Skills'
import { Services } from './components/Services'
import { Work } from './components/Work'
import { Contact } from './components/Contact'

function App() {
	return (
		<ReactLenis root options={{ lerp: 0.1, duration: 1.5, smoothWheel: true }}>
			{/* Grain overlay */}
			<div className="grain-overlay" />

			{/* Header: top bar + navigation (desktop + mobile) */}
			<header>
				<TopHeader />
				<Navigation />
				<MobileNavigation />
			</header>

			{/* Main content */}
			<main className="pt-16 md:pt-20">
				<Hero />
				{/* No divider after Hero - marquee serves as divider */}
				<About />
				<Work />
				<Skills />
				<Services />
			</main>
			<footer>
				<Contact />
			</footer>
		</ReactLenis>
	)
}

export default App
