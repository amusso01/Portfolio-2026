/**
 * =============================================================================
 * AppLoader - First-load intro and exit overlay
 * =============================================================================
 *
 * Full-screen black overlay (100vw x 100vh) shown until the app is ready.
 * Sequence:
 * 1. Pure black screen. If fonts are slow, "Loading" + spinner appear bottom-right.
 * 2. Once fonts load: collapsed "A M" fades in centered.
 * 3. After EXPAND_DELAY_MS: chars expand into "ANDREA MUSSO" while text
 *    scales down; "Web Developer" slides up above it.
 * 4. After hold time, overlay exits with ellipse clip (bottom to top).
 *
 * PRE-MOUNT: Children mount when fonts load (hidden under overlay) so Lenis,
 * GSAP, and layout initialize before the overlay exits. This avoids the stuck
 * scroll / stacked animations on mobile when the app would otherwise mount
 * only at exit time.
 *
 * Exit uses ellipse(... at 50% 0%) so the black layer retreats upward;
 * EXIT_DURATION_MS is the clip-path transition length.
 */
import { type ReactNode, useEffect, useMemo, useRef, useState } from 'react'
import { LoaderContext } from '../context/LoaderContext'

interface AppLoaderProps {
	children: ReactNode
}

/** Max wait for document.fonts.ready before giving up */
const FONT_LOAD_TIMEOUT_MS = 1800
/** Delay after AM appears before expanding to full name */
const EXPAND_DELAY_MS = 200
/** How long the lockup is shown before we're allowed to start the exit */
const LOCKUP_HOLD_MS = 600
/** Duration of the ellipse clip-path exit (black disappears bottom to top) */
const EXIT_DURATION_MS = 1450

interface LoaderChar {
	char: string
	keepVisible: boolean
	delayIndex: number
}

/** Resolves when fonts are loaded or FONT_LOAD_TIMEOUT_MS elapses (whichever first). */
function waitForFonts() {
	if (typeof document === 'undefined' || !('fonts' in document)) {
		return Promise.resolve()
	}

	return Promise.race([
		document.fonts.ready.then(() => undefined),
		new Promise<void>((resolve) => {
			window.setTimeout(resolve, FONT_LOAD_TIMEOUT_MS)
		}),
	])
}

/** Splits "Andrea Musso" into chars with stagger indices for expand/collapse (like TopHeader CollapsibleName). */
function buildNameChars(name: string): LoaderChar[] {
	const words = name.split(' ')
	const chars: LoaderChar[] = []
	let hiddenIndex = 0

	words.forEach((word, wordIdx) => {
		word.split('').forEach((char, charIdx) => {
			const isInitial = charIdx === 0
			chars.push({
				char,
				keepVisible: isInitial,
				delayIndex: isInitial ? 0 : hiddenIndex++,
			})
		})

		if (wordIdx < words.length - 1) {
			chars.push({
				char: '\u00A0',
				keepVisible: false,
				delayIndex: hiddenIndex++,
			})
		}
	})

	return chars
}

/** Runs a staged intro; pre-mounts app when fonts load, removes overlay after exit. */
export function AppLoader({ children }: AppLoaderProps) {
	const [fontsLoaded, setFontsLoaded] = useState(false)
	const [showAM, setShowAM] = useState(false)
	const [showLockup, setShowLockup] = useState(false)
	const [canFinishSequence, setCanFinishSequence] = useState(false)
	const [isExiting, setIsExiting] = useState(false)
	const [showApp, setShowApp] = useState(false)
	/** Ensures we only start the exit sequence once. */
	const hasStartedExitRef = useRef(false)

	const nameChars = useMemo(() => buildNameChars('Andrea Musso'), [])
	const maxDelay = nameChars.reduce(
		(max, char) => Math.max(max, char.delayIndex),
		0,
	)

	// Wait for fonts, then reveal AM, then after a short delay expand to full name.
	useEffect(() => {
		let cancelled = false
		const timers: number[] = []

		const run = async () => {
			await waitForFonts()

			if (cancelled) return
			setFontsLoaded(true)

			// Let one frame pass so the font is painted before we show text.
			await new Promise<void>((resolve) => {
				requestAnimationFrame(() => {
					requestAnimationFrame(() => resolve())
				})
			})

			if (cancelled) return
			setShowAM(true)

			// After AM is visible, wait EXPAND_DELAY_MS then expand to full name.
			timers.push(
				window.setTimeout(() => {
					if (!cancelled) setShowLockup(true)
				}, EXPAND_DELAY_MS),
			)

			// After expand + hold, allow exit.
			timers.push(
				window.setTimeout(() => {
					if (!cancelled) setCanFinishSequence(true)
				}, EXPAND_DELAY_MS + LOCKUP_HOLD_MS),
			)
		}

		void run()

		return () => {
			cancelled = true
			timers.forEach((timer) => window.clearTimeout(timer))
		}
	}, [])

	// When fonts loaded and hold elapsed, start exit; after EXIT_DURATION_MS remove overlay.
	useEffect(() => {
		if (!fontsLoaded || !canFinishSequence || hasStartedExitRef.current) return

		hasStartedExitRef.current = true
		setIsExiting(true)
		const exitTimer = window.setTimeout(() => {
			setShowApp(true)
		}, EXIT_DURATION_MS)

		return () => window.clearTimeout(exitTimer)
	}, [fontsLoaded, canFinishSequence])

	// Show spinner only while waiting for fonts (before AM appears).
	const showLoadingHint = !fontsLoaded

	return (
		<LoaderContext.Provider value={showApp}>
			{/* Pre-mount app when fonts load so Lenis/GSAP initialize under the overlay */}
			{fontsLoaded && children}
			{/* Overlay stays on top until exit completes */}
			{!showApp && (
				<div
					className="fixed inset-0 z-[10000] overflow-hidden bg-black text-white"
					aria-live="polite"
					aria-busy={!fontsLoaded}
					style={{
						clipPath: isExiting
							? 'ellipse(100% 0% at 50% 0%)'
							: 'ellipse(100% 150% at 50% 0%)',
						transition: `clip-path ${EXIT_DURATION_MS}ms cubic-bezier(0.77, 0, 0.175, 1)`,
					}}
				>
					<div className="relative flex h-full w-full items-center justify-center px-6">
						{/* Name lockup: hidden until fonts load, then collapsed "A M" fades in, then expands */}
						<div
							className="relative z-10 flex flex-col items-center text-center"
							style={{
								opacity: showAM ? 1 : 0,
								transform: showAM ? 'translateY(0)' : 'translateY(8px)',
								transition:
									'opacity 400ms ease, transform 500ms cubic-bezier(0.16, 1, 0.3, 1)',
							}}
						>
							<div className="overflow-hidden mb-0">
								<span
									className="block text-[clamp(0.85rem,1.4vw,1rem)] font-display font-extralight lowercase tracking-[0.12em] leading-tight"
									style={{
										transform: showLockup ? 'translateY(0)' : 'translateY(100%)',
										opacity: showLockup ? 1 : 0,
										transition:
											'transform 650ms cubic-bezier(0.16, 1, 0.3, 1), opacity 400ms ease',
									}}
								>
									Web Developer
								</span>
							</div>

							<span
								className="inline-flex items-baseline uppercase leading-none tracking-[0.12em] text-white"
								style={{
									fontSize: 'clamp(4rem, 12vw, 12rem)',
									transform: showLockup ? 'scale(0.38)' : 'scale(1)',
									transition: 'transform 850ms cubic-bezier(0.16, 1, 0.3, 1)',
								}}
							>
								{nameChars.map((char, index) => {
									const delay = showLockup
										? char.delayIndex * 28
										: (maxDelay - char.delayIndex) * 28
									const hide = !showLockup && !char.keepVisible

									return (
										<span
											key={`${char.char}-${index}`}
											className="inline-block overflow-hidden whitespace-pre font-body font-bold"
											style={{
												maxWidth: hide ? 0 : '1em',
												opacity: hide ? 0 : 1,
												transition: `max-width 0.5s cubic-bezier(0.16, 1, 0.3, 1) ${delay}ms, opacity 0.3s ease ${delay}ms`,
											}}
										>
											{char.char}
										</span>
									)
								})}
							</span>
						</div>

						{/* Loading indicator: visible only while waiting for fonts */}
						<div
							className="absolute bottom-6 right-6 flex items-center gap-3"
							style={{
								opacity: showLoadingHint ? 1 : 0,
								transform: showLoadingHint ? 'translateY(0)' : 'translateY(10px)',
								transition:
									'opacity 300ms ease, transform 500ms cubic-bezier(0.16, 1, 0.3, 1)',
							}}
						>
							<span className="text-[11px] uppercase tracking-[0.35em] text-white/65">
								Loading
							</span>
							<span className="h-5 w-5 animate-spin rounded-full border border-white/25 border-t-white" />
						</div>
					</div>
				</div>
			)}
		</LoaderContext.Provider>
	)
}
