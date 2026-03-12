/**
 * LoaderContext – signals when the AppLoader overlay has exited.
 *
 * Used by Hero to delay its entrance animations until the loader is gone,
 * so the user can see them (they would otherwise run while hidden under the overlay).
 */
import { createContext, useContext } from 'react'

export const LoaderContext = createContext(false)

export function useLoaderExited() {
	return useContext(LoaderContext)
}
