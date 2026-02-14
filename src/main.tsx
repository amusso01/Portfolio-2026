/**
 * =============================================================================
 * MAIN ENTRY POINT - React Application Bootstrap
 * =============================================================================
 *
 * This file is the JavaScript/TypeScript entry point for the portfolio app.
 * It runs when the browser loads index.html and executes the script.
 *
 * RENDERING HIERARCHY (outer to inner):
 * 1. StrictMode - React dev-mode checks (double-invokes effects, deprecated API warnings)
 * 2. ErrorBoundary - Catches JS errors in child tree; shows fallback UI instead of crashing
 * 3. App - The root component containing the full page layout
 *
 * Why this structure?
 * - ErrorBoundary at this level ensures any uncaught error in the app shows a friendly
 *   error message rather than a blank white screen
 * - StrictMode helps catch subtle bugs during development
 */
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { ErrorBoundary } from './components/ErrorBoundary.tsx'
import './index.css'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </StrictMode>,
)
