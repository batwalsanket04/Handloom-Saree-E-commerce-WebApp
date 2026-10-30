import React from 'react';
import { cn } from '../../utils/cn';
import { Container } from './Container';

const spacingClasses = {
  none: '',
  sm: 'py-8',
  md: 'py-12',
  lg: 'py-section',      // 4rem = 64px
  xl: 'py-[5rem]',       // 80px
};

const backgroundClasses = {
  none: '',
  white: 'bg-white',
  gray: 'bg-gray-50',
  brand: 'bg-brand-50',
  'brand-gradient': 'bg-gradient-to-b from-brand-50 to-brand-100',
};

const Section = React.forwardRef(
  ({ className, as: Component = 'section', container = true, spacing = 'lg', background = 'none', children, ...props }, ref) => {
    const content = (
      <div className={cn(spacingClasses[spacing], backgroundClasses[background], className)} {...props}>
        {children}
      </div>
    );

    if (container === false) {
      return <Component ref={ref}>{content}</Component>;
    }

    const containerProps = typeof container === 'object' ? container : {};
    return (
      <Component ref={ref}>
        <Container {...containerProps}>{content}</Container>
      </Component>
    );
  }
);
Section.displayName = 'Section';

export { Section };