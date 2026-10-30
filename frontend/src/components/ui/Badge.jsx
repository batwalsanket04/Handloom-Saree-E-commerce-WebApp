import React from 'react';
import { cn } from '../../utils/cn';

const badgeVariants = cn(
  'inline-flex items-center gap-1.5 font-medium rounded-button transition-colors duration-fast',
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-400 focus-visible:ring-offset-2'
);

const Badge = React.forwardRef(
  ({ className, variant = 'default', size = 'md', dot, children, ...props }, ref) => {
    const sizeClasses = {
      sm: 'px-2 py-0.5 text-caption',
      md: 'px-2.5 py-1 text-body-sm',
      lg: 'px-3 py-1 text-body',
    };

    const variantClasses = {
      default: 'bg-gray-100 text-gray-700 hover:bg-gray-200',
      success: 'bg-green-100 text-green-700 hover:bg-green-200',
      warning: 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200',
      danger: 'bg-red-100 text-red-700 hover:bg-red-200',
      info: 'bg-blue-100 text-blue-700 hover:bg-blue-200',
      brand: 'bg-brand-100 text-brand-700 hover:bg-brand-200',
      outline: 'bg-transparent border border-gray-300 text-gray-700 hover:bg-gray-50',
    };

    return (
      <span
        ref={ref}
        className={cn(badgeVariants, sizeClasses[size], variantClasses[variant], className)}
        {...props}
      >
        {dot && (
          <span
            className={cn(
              'w-1.5 h-1.5 rounded-full',
              variant === 'success' && 'bg-green-500',
              variant === 'warning' && 'bg-yellow-500',
              variant === 'danger' && 'bg-red-500',
              variant === 'info' && 'bg-blue-500',
              variant === 'brand' && 'bg-brand-500',
              variant === 'default' && 'bg-gray-500',
              variant === 'outline' && 'bg-gray-500'
            )}
          />
        )}
        {children}
      </span>
    );
  }
);
Badge.displayName = 'Badge';

export { Badge };