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
import { useState, useEffect } from 'react'
import profileData from '../data/profile.json'

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
			style={{
				display: 'inline-block',
				transition: 'opacity 0.3s ease-in-out',
				opacity: visible ? 1 : 0.1,
				color: '#111111',
			}}
		>
			:
		</span>
	)
}

/** Green dot with ping animation - indicates "available" status */
function PulsatingDot() {
	return (
		<span
			style={{
				position: 'relative',
				display: 'inline-flex',
				width: '6px',
				height: '6px',
				justifyContent: 'center',
				alignItems: 'center',
			}}
		>
			<span
				style={{
					position: 'absolute',
					display: 'inline-flex',
					width: '9px',
					height: '9px',
					borderRadius: '50%',
					backgroundColor: '#97F093',
					opacity: 0.75,
					animation: 'ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite',
				}}
			/>
			<span
				style={{
					position: 'relative',
					display: 'inline-flex',
					width: '6px',
					height: '6px',
					borderRadius: '50%',
					backgroundColor: '#97F093',
				}}
			/>
		</span>
	)
}

export function TopHeader() {
	const londonTime = useLondonTime()
	const [hours, minutes] = londonTime.split(':') || ['', '']

	return (
		<>
			<style>
				{`
          @keyframes ping {
            75%, 100% {
              transform: scale(2);
              opacity: 0;
            }
          }
        `}
			</style>
			<header className="fixed top-0 left-0 right-0 z-50 bg-canvas/95 backdrop-blur-sm border-b border-subtle/40">
				<div className="container-custom">
					<div className="flex items-center justify-between h-12 md:h-14 px-4 md:px-0">
						{/* WEB DEVELOPER / Name */}
						<div className="flex flex-col">
							<span className="text-[11px] font-display font-extralight lowercase tracking-[0.1px]">
								Web Developer
							</span>
							<span className="text-sm md:text-[13px] uppercase font-body font-bold text-ink leading-tight">
								{profileData.name}
							</span>
						</div>

						{/* Right side container - everything text-align right */}
						<div className="flex items-center gap-8 md:gap-16">
							{/* Left: LOCATION / City + Time - very close to left */}
							<div className="hidden md:flex flex-col items-end text-right">
								<span className="text-[11px] font-display font-extralight lowercase tracking-[0.1px]">
									Location
								</span>
								<div className="flex items-center gap-1 leading-tight">
									<span className="text-sm md:text-[13px] uppercase font-body font-[350] text-ink">
										London UK
									</span>
									{hours && minutes ? (
										<span className="text-sm md:text-[13px] uppercase font-body font-[350] text-ink">
											{hours}
											<PulsatingColon />
											{minutes}
										</span>
									) : (
										<span className="text-sm md:text-[13px] uppercase font-body font-[350] text-ink">
											--:--
										</span>
									)}
								</div>
							</div>

							{/* STATUS / Available */}
							<div className="flex flex-col items-end text-right">
								<span className="text-[11px] font-display font-extralight lowercase tracking-[0.1px]">
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
			</header>
		</>
	)
}
