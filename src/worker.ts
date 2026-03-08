interface Env {
	ASSETS: Fetcher
	RESEND_API_KEY: string
	TURNSTILE_SECRET_KEY: string
}

interface ContactPayload {
	name: string
	email: string
	budget: string
	project: string
	turnstileToken: string
}

const CORS_HEADERS = {
	'Access-Control-Allow-Origin': '*',
	'Access-Control-Allow-Methods': 'POST, OPTIONS',
	'Access-Control-Allow-Headers': 'Content-Type',
}

async function verifyTurnstile(
	token: string,
	secret: string,
	ip: string | null,
): Promise<boolean> {
	const formData = new FormData()
	formData.append('secret', secret)
	formData.append('response', token)
	if (ip) formData.append('remoteip', ip)

	const res = await fetch(
		'https://challenges.cloudflare.com/turnstile/v0/siteverify',
		{ method: 'POST', body: formData },
	)
	const result = (await res.json()) as { success: boolean }
	return result.success
}

async function sendEmail(
	apiKey: string,
	payload: Omit<ContactPayload, 'turnstileToken'>,
): Promise<Response> {
	const budgetLabels: Record<string, string> = {
		'800-1500': '£800 – £1,500',
		'1500-3000': '£1,500 – £3,000',
		'3000-5000': '£3,000 – £5,000',
		'over-5000': 'Over £5,000',
	}

	const budget = budgetLabels[payload.budget] ?? payload.budget

	return fetch('https://api.resend.com/emails', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			Authorization: `Bearer ${apiKey}`,
		},
		body: JSON.stringify({
			from: 'Portfolio <hello@andreamusso.dev>',
			to: ['hello@andreamusso.dev'],
			subject: `New enquiry from ${payload.name}`,
			reply_to: payload.email,
			html: [
				`<h2>New contact form submission</h2>`,
				`<p><strong>Name:</strong> ${payload.name}</p>`,
				`<p><strong>Email:</strong> ${payload.email}</p>`,
				`<p><strong>Budget:</strong> ${budget}</p>`,
				`<p><strong>Project:</strong></p>`,
				`<p>${payload.project.replace(/\n/g, '<br>')}</p>`,
			].join('\n'),
		}),
	})
}

function json(data: Record<string, unknown>, status = 200): Response {
	return new Response(JSON.stringify(data), {
		status,
		headers: { 'Content-Type': 'application/json', ...CORS_HEADERS },
	})
}

export default {
	async fetch(request: Request, env: Env): Promise<Response> {
		const url = new URL(request.url)

		if (request.method === 'OPTIONS' && url.pathname.startsWith('/api/')) {
			return new Response(null, { status: 204, headers: CORS_HEADERS })
		}

		if (url.pathname === '/api/contact' && request.method === 'POST') {
			try {
				const body = (await request.json()) as ContactPayload

				if (
					!body.name?.trim() ||
					!body.email?.trim() ||
					!body.project?.trim() ||
					!body.turnstileToken?.trim()
				) {
					return json({ error: 'Missing required fields' }, 400)
				}

				const ip = request.headers.get('CF-Connecting-IP')
				const valid = await verifyTurnstile(
					body.turnstileToken,
					env.TURNSTILE_SECRET_KEY,
					ip,
				)

				if (!valid) {
					return json({ error: 'Turnstile verification failed' }, 403)
				}

				const emailRes = await sendEmail(env.RESEND_API_KEY, {
					name: body.name,
					email: body.email,
					budget: body.budget,
					project: body.project,
				})

				if (!emailRes.ok) {
					const err = await emailRes.text()
					console.error('Resend error:', err)
					return json({ error: 'Failed to send email' }, 500)
				}

				return json({ success: true })
			} catch (err) {
				console.error('Contact handler error:', err)
				return json({ error: 'Internal server error' }, 500)
			}
		}

		return env.ASSETS.fetch(request)
	},
} satisfies ExportedHandler<Env>
