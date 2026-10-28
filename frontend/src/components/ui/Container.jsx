import React from 'react';
import { cn } from '../../utils/cn';

const sizeClasses = {
  sm: 'max-w-3xl',
  md: 'max-w-5xl',
  lg: 'max-w-6xl',
  xl: 'max-w-7xl',
  full: 'max-full',
};

const Container = React.forwardRef(
  ({ className, size = 'lg', children, ...props }, ref) => (
    <div
      ref={ref}
      className={cn('mx-auto px-container', sizeClasses[size], className)}
      {...props}
    >
      {children}
    </div>
  )
);
Container.displayName = 'Container';

export { Container };