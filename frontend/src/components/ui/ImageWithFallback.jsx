import React, { useState } from 'react';
import { cn } from '../../utils/cn';

const aspectRatioClasses = {
  square: 'aspect-square',
  video: 'aspect-video',      // 16:9
  photo: 'aspect-[4/3]',      // 4:3
  portrait: 'aspect-[3/4]',   // 3:4
};

const borderRadiusClasses = {
  none: '',
  sm: 'rounded-sm',
  md: 'rounded-md',
  lg: 'rounded-lg',
  xl: 'rounded-xl',
  full: 'rounded-full',
};

const ImageWithFallback = React.forwardRef(
  (
    {
      src,
      fallback = '/placeholder.jpg',
      aspectRatio = 'photo',
      objectFit = 'cover',
      borderRadius = 'lg',
      className,
      onError,
      ...props
    },
    ref
  ) => {
    const [imageSrc, setImageSrc] = useState(src);
    const [hasError, setHasError] = useState(false);

    const handleError = (e) => {
      if (!hasError && imageSrc !== fallback) {
        setHasError(true);
        setImageSrc(fallback);
      }
      onError?.(e);
    };

    const handleLoad = () => {
      setHasError(false);
    };

    // Reset when src changes
    React.useEffect(() => {
      setImageSrc(src);
      setHasError(false);
    }, [src]);

    return (
      <div className={cn('relative overflow-hidden', aspectRatioClasses[aspectRatio], borderRadiusClasses[borderRadius], className)}>
        <img
          ref={ref}
          src={imageSrc}
          alt={props.alt || ''}
          className={cn(
            'w-full h-full transition-opacity duration-300',
            objectFit === 'cover' && 'object-cover',
            objectFit === 'contain' && 'object-contain',
            objectFit === 'fill' && 'object-fill',
            hasError && 'opacity-75'
          )}
          onError={handleError}
          onLoad={handleLoad}
          {...props}
        />
        {hasError && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-50 text-gray-400" aria-hidden="true">
            <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 002 2z" />
            </svg>
          </div>
        )}
      </div>
    );
  }
);
ImageWithFallback.displayName = 'ImageWithFallback';

export { ImageWithFallback };