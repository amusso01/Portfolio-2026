/**
 * Hero utilities – constants and helpers for the Hero section.
 * Used for greeting text, subtitle word chunks, and image source.
 */
import profileData from '../data/profile.json'

/** Characters for "Hello" heading – each animated separately with variable font weight */
export const HELLO_CHARS = ['H', 'e', 'l', 'l', 'o'] as const

/** Replace with your own headshot URL */
export const PLACEHOLDER_IMAGE = '/AM.png'

/** Word chunk for subtitle stagger animation */
export interface SubtitleWord {
	text: string
	bold?: boolean
}

/**
 * Build subtitle as word chunks for stagger animation.
 * Each word can be bold; used for slide-up stagger in Hero.
 */
export function getSubtitleWords(): SubtitleWord[] {
	const first = profileData.name.split(' ')[0]
	const years = profileData.yearsOfExperience
	return [
		{ text: '"I\'m' },
		{ text: first, bold: true },
		{ text: 'a' },
		{ text: 'web' },
		{ text: 'developer', bold: true },
		{ text: 'with' },
		{ text: `${years}+` },
		{ text: 'years' },
		{ text: 'experience' },
		{ text: 'primarily' },
		{ text: 'focusing' },
		{ text: 'on' },
		{ text: 'E-Commerce', bold: true },
		{ text: 'and' },
		{ text: 'Front-end.', bold: true },
		{ text: 'Welcome' },
		{ text: 'to' },
		{ text: 'my' },
		{ text: 'site"' },
	]
}
