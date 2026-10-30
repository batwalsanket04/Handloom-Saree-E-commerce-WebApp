import React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva } from 'class-variance-authority';
import { cn } from '../../utils/cn';

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 font-medium transition-all duration-fast focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-400 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 active:scale-[0.98]',
  {
    variants: {
      variant: {
        primary: 'bg-gradient-to-r from-brand-600 to-brand-700 text-white hover:from-brand-700 hover:to-brand-800 shadow-sm hover:shadow-md',
        secondary: 'bg-white text-brand-700 border border-brand-200 hover:bg-brand-50 hover:border-brand-300',
        outline: 'bg-transparent text-brand-700 border border-brand-300 hover:bg-brand-50',
        ghost: 'bg-transparent text-brand-700 hover:bg-brand-50',
        danger: 'bg-red-600 text-white hover:bg-red-700',
        dangerOutline: 'bg-transparent text-red-600 border border-red-300 hover:bg-red-50',
        link: 'text-brand-600 underline-offset-2 hover:underline',
      },
      size: {
        sm: 'h-8 px-3 text-body-sm rounded-input',
        md: 'h-10 px-4 text-body rounded-input',
        lg: 'h-12 px-6 text-body-lg rounded-input',
        xl: 'h-14 px-8 text-heading-6 rounded-input',
        icon: 'h-10 w-10',
      },
      fullWidth: {
        true: 'w-full',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'md',
    },
  }
);

const Button = React.forwardRef(
  ({ className, variant, size, fullWidth, asChild = false, loading, children, disabled, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button';
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, fullWidth }), className)}
        ref={ref}
        disabled={disabled || loading}
        aria-busy={loading}
        {...props}
      >
        {loading && (
          <svg
            className="animate-spin h-4 w-4"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
        )}
        {children}
      </Comp>
    );
  }
);
Button.displayName = 'Button';

export { Button, buttonVariants };