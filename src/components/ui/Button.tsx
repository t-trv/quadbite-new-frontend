'use client';

import { cn } from '@/utils/cn';
import { forwardRef, memo } from 'react';
import { ComponentSize, COMPONENT_SIZE_CLASSES } from './shared/size';

/**
 * ============================================================================
 * BUTTON COMPONENT
 * ============================================================================
 *
 * A reusable, accessible button component with multiple variants and sizes.
 *
 * ## Usage Examples:
 *
 * ```tsx
 * import { Button } from '@/components/ui/Button';
 *
 * // Basic usage
 * <Button>Click me</Button>
 *
 * // With variant
 * <Button variant="primary">Primary</Button>
 * <Button variant="secondary">Secondary</Button>
 * <Button variant="outline">Outline</Button>
 * <Button variant="ghost">Ghost</Button>
 *
 * // With size
 * <Button size="xs">Extra Small</Button>
 * <Button size="sm">Small</Button>
 * <Button size="md">Medium (default)</Button>
 * <Button size="lg">Large</Button>
 *
 * // With icons
 * <Button icon={<IconLeft />}>Left Icon</Button>
 * <Button iconRight={<IconRight />}>Right Icon</Button>
 * <Button icon={<IconLeft />} iconRight={<IconRight />}>Both</Button>
 *
 * // States
 * <Button disabled>Disabled</Button>
 * <Button isLoading>Loading...</Button>
 *
 * // Full width
 * <Button fullWidth>Full Width Button</Button>
 *
 * // With ref
 * const buttonRef = useRef<HTMLButtonElement>(null);
 * <Button ref={buttonRef}>With Ref</Button>
 *
 * // Form submit
 * <Button type="submit">Submit Form</Button>
 *
 * // Custom className
 * <Button className="my-custom-class">Custom Styled</Button>
 * ```
 *
 * ## Props:
 * @param variant - Button style variant: 'primary' | 'secondary' | 'outline' | 'ghost' | 'default'
 * @param size - Button size: 'xs' | 'sm' | 'md' | 'lg'
 * @param icon - ReactNode to display on the left side
 * @param iconRight - ReactNode to display on the right side
 * @param isLoading - Shows loading spinner and disables button
 * @param fullWidth - Makes button take full container width
 * @param disabled - Disables button interaction
 * @param type - HTML button type: 'button' | 'submit'
 * @param className - Additional CSS classes
 * @param ref - Forward ref for DOM access
 *
 * ## Color Palette:
 * - Black: #111827, #1F2937, #374151
 * - Gray: #E5E7EB, #F3F4F6, #D1D5DB
 * - White: #FFFFFF
 *
 * ============================================================================
 */

// ============================================================================
// TYPES
// ============================================================================

export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'default';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /** Button style variant */
  variant?: ButtonVariant;
  /** Button size - md (44px) is recommended for mobile touch targets */
  size?: ComponentSize;
  /** Icon element to display on the left */
  icon?: React.ReactNode;
  /** Icon element to display on the right */
  iconRight?: React.ReactNode;
  /** Shows loading spinner and disables button */
  isLoading?: boolean;
  /** Makes button take full container width */
  fullWidth?: boolean;
}

// ============================================================================
// STYLES
// ============================================================================

/** Base styles applied to all buttons */
const commonClasses =
  'cursor-pointer flex items-center rounded-lg justify-center gap-2 h-fit w-fit text-nowrap leading-tight font-medium transition-all duration-200 select-none';

/**
 * Variant styles - Using white, gray, black color palette
 * Each variant includes: background, text color, border, hover state, active state
 */
const buttonVariantClasses: Record<ButtonVariant, string> = {
  // Primary: Black background with white text
  primary: 'bg-primary text-white hover:bg-primary/80 active:bg-primary/90',
  // Secondary: Light gray background with dark text and border
  secondary:
    'bg-[#F3F4F6] text-[#111827] border border-[#E5E7EB] hover:bg-[#E5E7EB] active:bg-[#D1D5DB]',
  // Outline: Transparent with border
  outline:
    'bg-transparent text-[#111827] border border-[#E5E7EB] hover:bg-[#F3F4F6] active:bg-[#E5E7EB]',
  // Ghost: Transparent with no border
  ghost: 'bg-transparent text-[#111827] hover:bg-[#F3F4F6] active:bg-[#E5E7EB]',
  // Default: Mapped to Primary for backward compatibility
  default: 'bg-primary text-white hover:bg-primary/80 active:bg-primary/90',
};

// ============================================================================
// COMPONENTS
// ============================================================================

/**
 * Loading spinner component - Memoized to prevent re-creation on each render
 */
const LoadingSpinner = memo(() => (
  <svg
    className="animate-spin w-4 h-4"
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    aria-hidden="true"
  >
    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
    <path
      className="opacity-75"
      fill="currentColor"
      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
    />
  </svg>
));
LoadingSpinner.displayName = 'LoadingSpinner';

/**
 * Button Component
 *
 * A flexible, accessible button with forwardRef support for DOM access.
 * Uses Tailwind CSS for styling and cn() for class merging.
 */
export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = 'primary',
      size = 'md',
      className,
      icon,
      iconRight,
      children,
      disabled = false,
      isLoading = false,
      fullWidth = false,
      type = 'button',
      ...props
    },
    ref,
  ) => {
    // Combine disabled and loading states
    const isDisabled = disabled || isLoading;

    return (
      <button
        ref={ref}
        type={type}
        className={cn(
          commonClasses,
          buttonVariantClasses[variant],
          COMPONENT_SIZE_CLASSES[size],
          fullWidth && 'w-full',
          isDisabled && 'cursor-not-allowed opacity-50 pointer-events-none',
          className,
        )}
        disabled={isDisabled}
        aria-busy={isLoading}
        {...props}
      >
        {/* Left icon or loading spinner */}
        {isLoading ? <LoadingSpinner /> : icon}
        {/* Button text content */}
        {children}
        {/* Right icon (hidden when loading) */}
        {!isLoading && iconRight}
      </button>
    );
  },
);
Button.displayName = 'Button';

export default Button;
