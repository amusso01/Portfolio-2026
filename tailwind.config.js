/** @type {import('tailwindcss').Config} */
module.exports = {
	darkMode: ['class'],
	content: [
		'./pages/**/*.{ts,tsx}',
		'./components/**/*.{ts,tsx}',
		'./app/**/*.{ts,tsx}',
		'./src/**/*.{ts,tsx}',
	],
	theme: {
		container: {
			center: true,
			padding: {
				DEFAULT: '2rem',
				'2xl': '80px',
			},
			screens: {
				'2xl': '1560px',
			},
		},
		extend: {
			colors: {
				canvas: '#FAFAFA',
				ink: '#101110',
				accent: '#97F093',
				subtle: '#E5E5E5',
				muted: '#6B7280',
				border: 'hsl(var(--border))',
				input: 'hsl(var(--input))',
				ring: 'hsl(var(--ring))',
				background: 'hsl(var(--background))',
				foreground: 'hsl(var(--foreground))',
				primary: {
					DEFAULT: '#111111',
					foreground: 'hsl(var(--primary-foreground))',
				},
				secondary: {
					DEFAULT: '#97F093',
					foreground: 'hsl(var(--secondary-foreground))',
				},
				accent: {
					DEFAULT: '#97F093',
					foreground: 'hsl(var(--accent-foreground))',
				},
				destructive: {
					DEFAULT: 'hsl(var(--destructive))',
					foreground: 'hsl(var(--destructive-foreground))',
				},
				muted: {
					DEFAULT: 'hsl(var(--muted))',
					foreground: 'hsl(var(--muted-foreground))',
				},
				popover: {
					DEFAULT: 'hsl(var(--popover))',
					foreground: 'hsl(var(--popover-foreground))',
				},
				card: {
					DEFAULT: 'hsl(var(--card))',
					foreground: 'hsl(var(--card-foreground))',
				},
			},
			fontFamily: {
				display: ['Alexandria', 'sans-serif'],
				body: ['Space Grotesk', 'sans-serif'],
			},
			fontSize: {
				hero: ['180px', { lineHeight: '1', fontWeight: '500' }],
				'hero-mobile': ['72px', { lineHeight: '1', fontWeight: '500' }],
				section: ['56px', { lineHeight: '1.1', fontWeight: '700' }],
				'section-mobile': ['36px', { lineHeight: '1.1', fontWeight: '700' }],
				subtitle: ['24px', { lineHeight: '1.3', fontWeight: '500' }],
				'subtitle-mobile': ['18px', { lineHeight: '1.3', fontWeight: '500' }],
			},
			spacing: {
				section: '120px',
				'section-mobile': '80px',
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)',
			},
			keyframes: {
				'accordion-down': {
					from: { height: 0 },
					to: { height: 'var(--radix-accordion-content-height)' },
				},
				'accordion-up': {
					from: { height: 'var(--radix-accordion-content-height)' },
					to: { height: 0 },
				},
				'spin-slow': {
					'0%': { transform: 'rotate(0deg)' },
					'100%': { transform: 'rotate(360deg)' },
				},
				marquee: {
					'0%': { transform: 'translateX(0)' },
					'100%': { transform: 'translateX(-33.33%)' },
				},
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out',
				'spin-slow': 'spin-slow 8s linear infinite',
				marquee: 'marquee 25s linear infinite',
			},
		},
	},
	plugins: [require('tailwindcss-animate')],
}
