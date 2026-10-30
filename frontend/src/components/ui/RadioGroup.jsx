import React from 'react';
import { cn } from '../../utils/cn';

const RadioGroup = ({ value, onValueChange, children, className }) => {
  return (
    <div className={cn(className)}>
      {React.Children.map(children, (child) => {
        if (React.isValidElement(child)) {
          return React.cloneElement(child, {
            value,
            onValueChange,
          });
        }
        return child;
      })}
    </div>
  );
};

const RadioGroupItem = React.forwardRef(
  ({ value, label, description, disabled, className, ...props }, ref) => {
    const isSelected = props.value === value;

    const handleClick = () => {
      if (!disabled && props.onValueChange) {
        props.onValueChange(value);
      }
    };

    return (
      <label
        ref={ref}
        className={cn(
          'relative flex items-start gap-3 p-4 rounded-xl border-2 transition-all duration-fast cursor-pointer',
          isSelected
            ? 'border-brand-500 bg-brand-50'
            : 'border-gray-200 hover:border-brand-300 hover:bg-gray-50',
          disabled && 'opacity-50 cursor-not-allowed'
        )}
        onClick={handleClick}
      >
        <input
          type="radio"
          value={value}
          checked={isSelected}
          onChange={handleClick}
          disabled={disabled}
          className="sr-only"
          aria-label={label}
        />
        <div className={cn(
          'relative flex h-5 w-5 items-center justify-center rounded-full border-2 transition-colors',
          isSelected
            ? 'border-brand-500 bg-brand-500'
            : 'border-gray-300 bg-white'
        )}>
          {isSelected && (
            <svg className="w-3 h-3 text-white" viewBox="0 0 12 12" fill="none" aria-hidden="true">
              <circle cx="6" cy="6" r="4" />
            </svg>
          )}
        </div>
        <div className="flex-1">
          <span className={cn(
            'block font-medium text-gray-900',
            isSelected ? 'text-brand-700' : ''
          )}>
            {label}
          </span>
          {description && (
            <span className="block text-body-sm text-gray-500 mt-0.5">{description}</span>
          )}
        </div>
      </label>
    );
  }
);
RadioGroupItem.displayName = 'RadioGroupItem';

export { RadioGroup, RadioGroupItem };