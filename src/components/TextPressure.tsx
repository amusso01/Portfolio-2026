/**
 * =============================================================================
 * TextPressure - Variable Font Effects
 * =============================================================================
 *
 * Displays text with optional interactive effects:
 * - weight: font weight varies with mouse Y position (300–900)
 * - width: font-stretch varies with mouse X position (50%–150%)
 * - stroke: outline-style text
 * - alpha: duplicate text layer at 30% opacity behind
 *
 * Font size scales with container width and text length.
 * Not currently used in the main app - available for creative headlines.
 */
import { useRef, useEffect, useState } from 'react'

interface TextPressureProps {
	text: string
	flex?: boolean
	alpha?: boolean
	stroke?: boolean
	width?: boolean
	weight?: boolean
	italic?: boolean
	textColor?: string
	strokeColor?: string
	minFontSize?: number
}

export function TextPressure({
	text,
	flex = false,
	alpha = false,
	stroke = false,
	width = false,
	weight = false,
	italic = false,
	textColor = '#ffffff',
	strokeColor = '#5227FF',
	minFontSize = 36,
}: TextPressureProps) {
	const containerRef = useRef<HTMLDivElement>(null)
	const [fontSize, setFontSize] = useState(minFontSize)
	const [fontWeight, setFontWeight] = useState(weight ? 900 : 700)
	const [fontStretch, setFontStretch] = useState(100)

	// Calculate font size based on container width
	useEffect(() => {
		const handleResize = () => {
			if (containerRef.current) {
				const containerWidth = containerRef.current.offsetWidth
				// Scale font based on container width
				const newFontSize = Math.max(
					minFontSize,
					(containerWidth / text.length) * 1.5,
				)
				setFontSize(newFontSize)
			}
		}

		handleResize()
		window.addEventListener('resize', handleResize)
		return () => window.removeEventListener('resize', handleResize)
	}, [text, minFontSize])

	// Handle mouse movement for weight/stretch effects
	useEffect(() => {
		if (!weight && !width) return

		const container = containerRef.current
		if (!container) return

		const handleMouseMove = (e: MouseEvent) => {
			const rect = container.getBoundingClientRect()
			const x = e.clientX - rect.left
			const y = e.clientY - rect.top

			// Calculate normalized position (0 to 1)
			const posX = x / rect.width
			const posY = y / rect.height

			// Vary weight based on vertical mouse position
			if (weight) {
				const newWeight = 900 - posY * 600 // Range from 300 to 900
				setFontWeight(Math.max(100, Math.min(900, newWeight)))
			}

			// Vary width based on horizontal mouse position
			if (width) {
				const newStretch = 50 + posX * 100 // Range from 50% to 150%
				setFontStretch(newStretch)
			}
		}

		const handleMouseLeave = () => {
			setFontWeight(weight ? 900 : 700)
			setFontStretch(100)
		}

		container.addEventListener('mousemove', handleMouseMove)
		container.addEventListener('mouseleave', handleMouseLeave)

		return () => {
			container.removeEventListener('mousemove', handleMouseMove)
			container.removeEventListener('mouseleave', handleMouseLeave)
		}
	}, [weight, width])

	const baseStyles: React.CSSProperties = {
		fontSize: `${fontSize}px`,
		fontWeight: fontWeight,
		fontStretch: `${fontStretch}%`,
		fontStyle: italic ? 'italic' : 'normal',
		fontFamily: "'Alexandria', sans-serif",
		color: textColor,
		display: flex ? 'flex' : 'block',
		justifyContent: flex ? 'center' : 'undefined',
		alignItems: flex ? 'center' : 'undefined',
		textAlign: 'center',
		position: 'relative',
		letterSpacing: width ? '0.05em' : '0',
		transform: 'scale(1, 1.2)',
		transformOrigin: 'center',
		lineHeight: 1,
		width: '100%',
		cursor: 'default',
		userSelect: 'none',
	}

	const strokeStyles: React.CSSProperties = stroke
		? {
				WebkitTextStroke: `2px ${strokeColor}`,
				color: 'transparent',
			}
		: {}

	return (
		<div
			ref={containerRef}
			style={{
				width: '100%',
				height: '100%',
				display: flex ? 'flex' : 'block',
				justifyContent: flex ? 'center' : 'undefined',
				alignItems: 'center',
			}}
		>
			<span style={{ ...baseStyles, ...strokeStyles }}>{text}</span>
			{alpha && (
				<span
					style={{
						...baseStyles,
						position: 'absolute',
						top: 0,
						left: 0,
						opacity: 0.3,
						transform: 'scale(1, 1.2)',
						pointerEvents: 'none',
					}}
					aria-hidden="true"
				>
					{text}
				</span>
			)}
		</div>
	)
}
