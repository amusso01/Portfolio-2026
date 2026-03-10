/**
 * SocialLinks - LinkedIn and GitHub icon links from profile data.
 */
import { Github, Linkedin } from 'lucide-react'
import profileData from '../data/profile.json'

const linkClass =
	'text-muted hover:text-selection transition-colors duration-300'

export function SocialLinks({ className = '' }: { className?: string }) {
	const { linkedin, github } = profileData.social

	return (
		<div className={`flex items-center gap-4 ${className}`.trim()}>
			{linkedin && (
				<a
					href={linkedin}
					target="_blank"
					rel="noopener noreferrer"
					aria-label="LinkedIn"
					className={linkClass}
				>
					<Linkedin className="w-5 h-5" strokeWidth={1.5} />
				</a>
			)}
			{github && (
				<a
					href={github}
					target="_blank"
					rel="noopener noreferrer"
					aria-label="GitHub"
					className={linkClass}
				>
					<Github className="w-5 h-5" strokeWidth={1.5} />
				</a>
			)}
		</div>
	)
}
