/**
 * =============================================================================
 * cn - Tailwind Class Name Utility
 * =============================================================================
 *
 * Merges Tailwind classes safely, handling conflicts (e.g. "p-4" + "p-6").
 * Uses clsx for conditional/array classes, tailwind-merge to dedupe.
 *
 * Usage: cn('base-class', condition && 'conditional', { 'class': bool })
 */
import { clsx, ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
