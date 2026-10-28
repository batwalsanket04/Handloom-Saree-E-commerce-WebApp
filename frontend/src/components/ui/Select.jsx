import React from 'react';
import { cn } from '../../utils/cn';

const selectVariants = cn(
  'w-full px-4 py-2.5 text-body bg-white border appearance-none transition-colors duration-fast',
  'focus:outline-none focus:ring-2 focus:ring-brand-400 focus:border-transparent',
  'disabled:bg-gray-50 disabled:text-gray-500 disabled:cursor-not-allowed',
  'rounded-input',
  'bg-[url("data:image/svg+xml,%3csvg xmlns=%27http://www.w3.org/2000/svg%27 fill=%27none%27 viewBox=%270 0 20 20%27%3e%3cpath stroke=%27%236b7280%27 stroke-linecap=%27round%27 stroke-linejoin=%27round%27 stroke-width=%271.5%27 d=%27M6 8l4 4 4-4%27/%3e%3c/svg%3e")] bg-right-3 bg-center bg-no-repeat pr-10'
);

const Select = React.forwardRef(
  ({ className, label, error, hint, options, placeholder, id, ...props }, ref) => {
    const selectId = id || label?.toLowerCase().replace(/\s+/g, '-');
    const errorId = error ? `${selectId}-error` : undefined;
    const hintId = hint ? `${selectId}-hint` : undefined;

    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={selectId}
            className="block text-body-sm font-medium text-gray-700 mb-1.5"
          >
            {label}
          </label>
        )}
        <select
          ref={ref}
          id={selectId}
          className={cn(selectVariants, error && 'border-red-300 focus:ring-red-400', className)}
          aria-invalid={error ? 'true' : 'false'}
          aria-describedby={cn(errorId, hintId)}
          {...props}
        >
          {placeholder && (
            <option value="" disabled>
              {placeholder}
            </option>
          )}
          {options.map((option) => (
            <option key={option.value} value={option.value} disabled={option.disabled}>
              {option.label}
            </option>
          ))}
        </select>
        {error && (
          <p id={errorId} className="mt-1.5 text-body-sm text-red-600" role="alert">
            {error}
          </p>
        )}
        {hint && !error && (
          <p id={hintId} className="mt-1.5 text-body-sm text-gray-500">
            {hint}
          </p>
        )}
      </div>
    );
  }
);
Select.displayName = 'Select';

export { Select };