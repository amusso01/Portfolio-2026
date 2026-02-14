/**
 * =============================================================================
 * ErrorBoundary - Catches JavaScript Errors in Child Components
 * =============================================================================
 *
 * Error boundaries are React class components that catch errors in their child
 * tree during rendering, lifecycle methods, and constructors. They do NOT catch
 * errors in event handlers, async code, or server-side rendering.
 *
 * HOW IT WORKS:
 * 1. Normal render: returns children (the app)
 * 2. When a child throws: getDerivedStateFromError updates state
 * 3. Re-render with hasError: true → shows fallback UI instead of crashing
 *
 * Used in main.tsx to wrap the entire app - any uncaught error shows this UI
 * instead of a blank screen.
 */
import React from 'react'

/** Converts any error to a readable string for display in the fallback UI */
const searilizeError = (error: any) => {
	if (error instanceof Error) {
		return error.message + '\n' + error.stack
	}
	return JSON.stringify(error, null, 2)
}

export class ErrorBoundary extends React.Component<
	{ children: React.ReactNode },
	{ hasError: boolean; error: any }
> {
	constructor(props: { children: React.ReactNode }) {
		super(props)
		this.state = { hasError: false, error: null }
	}

	/** React lifecycle: called when a child throws; returns new state to trigger fallback UI */
	static getDerivedStateFromError(error: any) {
		return { hasError: true, error }
	}

	/** React lifecycle: renders the fallback UI if there's an error */
	render() {
		if (this.state.hasError) {
			return (
				<div className="p-4 border border-red-500 rounded">
					<h2 className="text-red-500">Something went wrong.</h2>
					<pre className="mt-2 text-sm">{searilizeError(this.state.error)}</pre>
				</div>
			)
		}

		return this.props.children
	}
}
