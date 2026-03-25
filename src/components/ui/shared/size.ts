/**
 * ============================================================================
 * SHARED COMPONENT SIZES
 * ============================================================================
 *
 * Unified size constants for Button, Input, and Select components.
 * Ensures consistency across all form elements.
 *
 * ## Size Guidelines:
 * - xs: 28px - Compact UI, dense layouts
 * - sm: 36px - Secondary actions, filters
 * - md: 44px - Default, recommended touch target (Apple/Google guidelines)
 * - lg: 52px - Primary actions, hero sections
 */

export type ComponentSize = 'xs' | 'sm' | 'md' | 'lg';

/**
 * Unified size classes for all components
 * Format: text-{size} min-h-{height} px-{horizontal} py-{vertical}
 */
export const COMPONENT_SIZE_CLASSES: Record<ComponentSize, string> = {
  xs: 'text-xs min-h-7 px-3 py-1', // 28px height
  sm: 'text-sm min-h-9 px-3 py-1.5', // 36px height
  md: 'text-base min-h-11 px-4 py-2', // 44px height - recommended
  lg: 'text-lg min-h-13 px-5 py-2.5', // 52px height
};

/**
 * Height values in pixels for reference
 */
export const COMPONENT_HEIGHTS: Record<ComponentSize, number> = {
  xs: 28,
  sm: 36,
  md: 44, // Apple/Google recommended minimum touch target
  lg: 52,
};
