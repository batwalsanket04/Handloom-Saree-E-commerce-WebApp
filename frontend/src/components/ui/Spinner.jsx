import React from 'react';
import { cn } from '../../utils/cn';

const sizeClasses = {
  sm: 'w-4 h-4 border-2',
  md: 'w-6 h-6 border-2',
  lg: 'w-8 h-8 border-3',
  xl: 'w-12 h-12 border-4',
};

const colorClasses = {
  brand: 'border-brand-600 border-t-transparent',
  white: 'border-white border-t-transparent',
  gray: 'border-gray-400 border-t-transparent',
};

const Spinner = React.forwardRef(
  ({ className, size = 'md', color = 'brand', ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        'animate-spin rounded-full',
        sizeClasses[size],
        colorClasses[color],
        className
      )}
      role="status"
      aria-label="Loading"
      {...props}
    >
      <span className="sr-only">Loading...</span>
    </div>
  )
);
Spinner.displayName = 'Spinner';

export { Spinner };