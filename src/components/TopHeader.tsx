/**
 * =============================================================================
 * TopHeader - Fixed Header Bar
 * =============================================================================
 *
 * Fixed at top (z-50). Shows:
 * - Left: "LOCATION" / London | HH:MM (live London time)
 * - Right: "WEB DEVELOPER" / Name (desktop only)
 *         "STATUS" / PulsatingDot + "Available for freelance"
 *
 * useLondonTime: Intl.DateTimeFormat for Europe/London; updates every second.
 * PulsatingColon: Blinks every 1s for clock effect.
 * PulsatingDot: Green dot with ping animation (availability indicator).
 */
import {
	type MouseEvent,
	useState,
	useEffect,
	useMemo,
	useCallback,
} from 'react'
import profileData from '../data/profile.json'
import { useScrollToSection } from '../hooks/useNavigation'

/** Returns current time in London (HH:MM), updates every second */
function useLondonTime() {
	const [time, setTime] = useState<string>('')

	useEffect(() => {
		const updateTime = () => {
			const now = new Date()
			const londonTime = new Intl.DateTimeFormat('en-GB', {
				timeZone: 'Europe/London',
				hour: '2-digit',
				minute: '2-digit',
				hour12: false,
			}).format(now)
			setTime(londonTime)
		}

		updateTime()
		const interval = setInterval(updateTime, 1000)
		return () => clearInterval(interval)
	}, [])

	return time
}

/** Blinks colon every 1s to simulate clock tick */
function PulsatingColon() {
	const [visible, setVisible] = useState(true)

	useEffect(() => {
		const interval = setInterval(() => {
			setVisible((prev) => !prev)
		}, 1000)
		return () => clearInterval(interval)
	}, [])

	return (
		<span
			className={`inline-block transition-opacity duration-300 ease-in-out text-ink ${visible ? 'opacity-100' : 'opacity-10'}`}
		>
			:
		</span>
	)
}

const SCROLL_THRESHOLD = 150

function useScrolledPastThreshold() {
	const [collapsed, setCollapsed] = useState(false)

	useEffect(() => {
		let rafId: number | null = null

		const onScroll = () => {
			if (rafId !== null) return
			rafId = requestAnimationFrame(() => {
				setCollapsed(window.scrollY > SCROLL_THRESHOLD)
				rafId = null
			})
		}

		window.addEventListener('scroll', onScroll, { passive: true })
		onScroll()
		return () => {
			window.removeEventListener('scroll', onScroll)
			if (rafId !== null) cancelAnimationFrame(rafId)
		}
	}, [])

	return collapsed
}

/**
 * Splits "Andrea Musso" into individual characters and collapses
 * all but "A" and "M" when scrolled past threshold. Each hidden
 * character gets a staggered delay for a cascading effect.
 */
function CollapsibleName({
	name,
	collapsed,
}: {
	name: string
	collapsed: boolean
}) {
	const [hovered, setHovered] = useState(false)
	const onEnter = useCallback(() => setHovered(true), [])
	const onLeave = useCallback(() => setHovered(false), [])

	const shouldCollapse = collapsed && !hovered

	const chars = useMemo(() => {
		const words = name.split(' ')
		const result: { char: string; keepVisible: boolean; delayIndex: number }[] =
			[]
		let hiddenIndex = 0

		words.forEach((word, wordIdx) => {
			word.split('').forEach((char, charIdx) => {
				const isInitial = charIdx === 0
				result.push({
					char,
					keepVisible: isInitial,
					delayIndex: isInitial ? 0 : hiddenIndex++,
				})
			})
			if (wordIdx < words.length - 1) {
				result.push({
					char: '\u00A0',
					keepVisible: false,
					delayIndex: hiddenIndex++,
				})
			}
		})

		return result
	}, [name])

	const maxDelay = chars.reduce((max, c) => Math.max(max, c.delayIndex), 0)

	return (
		<span
			className="text-sm md:text-[15px] uppercase font-body font-bold text-ink leading-tight inline-flex items-baseline cursor-inherit"
			onMouseEnter={onEnter}
			onMouseLeave={onLeave}
		>
			{chars.map((c, i) => {
				const hide = shouldCollapse && !c.keepVisible
				const delay = shouldCollapse
					? c.delayIndex * 25
					: (maxDelay - c.delayIndex) * 25

				return (
					<span
						key={i}
						className="inline-block whitespace-pre overflow-hidden"
						style={{
							maxWidth: hide ? 0 : '1em',
							opacity: hide ? 0 : 1,
							transition: `max-width 0.4s cubic-bezier(0.16, 1, 0.3, 1) ${delay}ms, opacity 0.3s ease ${delay}ms`,
						}}
					>
						{c.char}
					</span>
				)
			})}
		</span>
	)
}

/** Green dot with ping animation - indicates "available" status */
function PulsatingDot() {
	return (
		<span className="relative inline-flex h-1.5 w-1.5 items-center justify-center">
			<span className="absolute inline-flex h-[10px] w-[10px] rounded-full bg-accent opacity-75 animate-ping" />
			<span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-accent" />
		</span>
	)
}

const HEADER_OFFSET = 60

export function TopHeader() {
	const londonTime = useLondonTime()
	const [hours, minutes] = londonTime.split(':') || ['', '']
	const collapsed = useScrolledPastThreshold()
	const scrollToSection = useScrollToSection(HEADER_OFFSET)

	const handleLogoClick = (e: MouseEvent<HTMLButtonElement>) => {
		e.preventDefault()
		scrollToSection('#hero')
	}

	return (
		<div className="fixed top-0 left-0 right-0 z-50 bg-canvas/95 backdrop-blur-sm border-b border-subtle/40">
			<div className="container-custom">
				<div className="flex items-center justify-between h-12 md:h-14 px-4 md:px-0">
					{/* WEB DEVELOPER / Name - site logo, links to hero */}
					<button
						type="button"
						onClick={handleLogoClick}
						className="flex flex-col text-left hover:opacity-80 transition-opacity duration-200"
						aria-label="Scroll to top"
					>
						<span className="text-[12px] font-display font-extralight lowercase tracking-[0.1px]">
							Web Developer
						</span>
						<CollapsibleName name={profileData.name} collapsed={collapsed} />
					</button>

					{/* Right side container - everything text-align right */}
					<div className="flex items-center gap-8 md:gap-16">
						{/* Left: LOCATION / City + Time - very close to left */}
						<div className="hidden md:flex flex-col items-end text-right">
							<span className="text-[12px] font-display font-extralight lowercase tracking-[0.1px]">
								Location
							</span>
							<div className="flex items-center gap-1 leading-tight">
								<span className="text-sm md:text-[14px] uppercase font-body font-[350] text-ink">
									London UK
								</span>
								{hours && minutes ? (
									<span className="text-sm md:text-[14px] uppercase font-body font-[350] text-ink">
										{hours}
										<PulsatingColon />
										{minutes}
									</span>
								) : (
									<span className="text-sm md:text-[14px] uppercase font-body font-[350] text-ink">
										--:--
									</span>
								)}
							</div>
						</div>

						{/* STATUS / Available */}
						<div className="flex flex-col items-end text-right">
							<span className="text-[12px] font-display font-extralight lowercase tracking-[0.1px]">
								Status
							</span>
							<div className="flex items-center gap-2 leading-tight">
								<PulsatingDot />
								<span className="text-sm md:text-[13px] font-body font-[350] text-ink">
									Available for freelance
								</span>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	)
}
