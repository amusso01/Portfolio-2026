import { useEffect, useRef, useCallback } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useScrollMomentum, type ScrollMomentumOptions } from '../hooks/useScrollMomentum'
import { useIsMobile } from '../hooks/use-mobile'

gsap.registerPlugin(ScrollTrigger)

interface BigTitleProps {
	/** Three fragments for the desktop split layout (e.g. ['AB','OUT','ME']). */
	words: [string, string, string]
	/** Human-readable sentence shown on mobile (e.g. "ABOUT ME"). */
	sentence: string
	sectionRef: React.RefObject<HTMLDivElement | null>
	className?: string
	momentumOptions?: Omit<ScrollMomentumOptions, 'enabled'>
}

/**
 * Scales font-size so the text element exactly fills its parent's width.
 * Measures at a known reference size, then computes the ratio.
 */
function fitTextToContainer(textEl: HTMLElement, containerEl: HTMLElement) {
	const REF_SIZE = 100
	textEl.style.fontSize = `${REF_SIZE}px`
	const textWidth = textEl.scrollWidth
	const containerWidth = containerEl.clientWidth
	if (textWidth > 0) {
		textEl.style.fontSize = `${(containerWidth / textWidth) * REF_SIZE}px`
	}
}

export function BigTitle({ words, sentence, sectionRef, className = '', momentumOptions }: BigTitleProps) {
	const isMobile = useIsMobile()
	const movingWordRef = useRef<HTMLSpanElement>(null)
	const mobileWrapRef = useRef<HTMLDivElement>(null)
	const mobileTitleRef = useRef<HTMLDivElement>(null)

	useScrollMomentum(movingWordRef, sectionRef, {
		enabled: !isMobile,
		speed: 0.15,
		...momentumOptions,
	})

	const fitMobileTitle = useCallback(() => {
		if (mobileTitleRef.current && mobileWrapRef.current) {
			fitTextToContainer(mobileTitleRef.current, mobileWrapRef.current)
		}
	}, [])

	useEffect(() => {
		if (!isMobile) return
		fitMobileTitle()
		window.addEventListener('resize', fitMobileTitle)
		return () => window.removeEventListener('resize', fitMobileTitle)
	}, [isMobile, fitMobileTitle])

	useEffect(() => {
		if (!isMobile || !mobileTitleRef.current) return

		const ctx = gsap.context(() => {
			gsap.fromTo(
				mobileTitleRef.current,
				{ yPercent: 110 },
				{
					yPercent: 0,
					duration: 0.7,
					ease: 'power3.out',
					scrollTrigger: {
						trigger: mobileTitleRef.current,
						start: 'top 95%',
						toggleActions: 'play none none reverse',
					},
				},
			)
		}, mobileWrapRef)

		return () => ctx.revert()
	}, [isMobile])

	if (isMobile) {
		return (
			<div ref={mobileWrapRef} className={`bigTitle-mobile overflow-hidden ${className}`}>
				<div
					ref={mobileTitleRef}
					className="font-display font-bold whitespace-nowrap leading-none w-fit"
				>
					{sentence}
				</div>
			</div>
		)
	}

	return (
		<div className={`bigTitle font-display font-bold ${className}`}>
			<span className="titleWord inline-block overflow-hidden align-top">
				{words[0]}
			</span>
			<span
				ref={movingWordRef}
				className="titleWord inline-block overflow-hidden align-top"
			>
				{words[1]}
			</span>
			<span className="titleWord inline-block overflow-hidden align-top">
				{words[2]}
			</span>
		</div>
	)
}
