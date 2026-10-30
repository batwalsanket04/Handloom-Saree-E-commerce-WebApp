import React from 'react';
import { cn } from '../../utils/cn';
import { Button } from './Button';

export const EmptyState = ({
  icon,
  title,
  description,
  action,
  className,
}) => (
  <div
    className={cn(
      'flex flex-col items-center justify-center text-center py-16 px-4',
      className
    )}
  >
    {icon && (
      <div className="mb-4 text-gray-300" aria-hidden="true">
        {icon}
      </div>
    )}
    <h3 className="text-heading-5 font-semibold text-gray-900 mb-2">{title}</h3>
    {description && (
      <p className="text-body text-gray-500 mb-6 max-w-sm">{description}</p>
    )}
    {action && (
      <Button
        variant={action.variant || 'primary'}
        onClick={action.onClick}
        className="w-auto"
      >
        {action.label}
      </Button>
    )}
  </div>
);