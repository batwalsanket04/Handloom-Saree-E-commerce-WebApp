import React, { useContext, useMemo } from 'react';
import { ShoppingCart, Heart, Minus, Plus } from 'lucide-react';
import { context } from '../../Context/StoreContext';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { ImageWithFallback } from '../ui/ImageWithFallback';
import { cn } from '../../utils/cn';

const ProductCard = React.memo(
  ({
    _id,
    name,
    price,
    description,
    image,
    category,
    rating = 4.5,
    variant = 'default',
    showActions = true,
    showWishlist = true,
    showCategory = true,
    onAddToCart,
    onRemoveFromCart,
    onToggleWishlist,
    isInWishlist = false,
    quantity = 0,
    className,
  }) => {
    const { url } = useContext(context);

    const imageUrl = image
      ? image.startsWith('http')
        ? image
        : `${url}/images/${image}`
      : undefined;

    const stars = useMemo(() => {
      return Array.from({ length: 5 }, (_, i) => i + 1).map((star) => (
        <span key={star} className="text-yellow-400" aria-hidden="true">
          {star <= Math.floor(rating) ? '★' : star - rating < 0.5 ? '☆' : '☆'}
        </span>
      ));
    }, [rating]);

    if (variant === 'compact') {
      return (
        <div className={cn('flex gap-4 bg-white rounded-xl border border-gray-100 overflow-hidden hover:shadow-md transition-shadow', className)}>
          <ImageWithFallback
            src={imageUrl}
            alt={name}
            aspectRatio="portrait"
            borderRadius="none"
            className="w-24 h-32 flex-shrink-0 object-cover"
          />
          <div className="flex-1 flex flex-col justify-between p-3 min-w-0">
            <div>
              <h4 className="font-medium text-gray-900 truncate">{name}</h4>
              {category && showCategory && (
                <Badge variant="outline" size="sm" className="mt-1">
                  {category}
                </Badge>
              )}
            </div>
            <div className="flex items-center justify-between mt-2">
              <span className="font-bold text-brand-600">₹{price}</span>
              {showActions && quantity > 0 && (
                <div className="flex items-center gap-1.5 bg-gray-100 rounded-lg px-2 py-1">
                  <button
                    onClick={() => onRemoveFromCart?.(_id)}
                    className="p-1 text-gray-600 hover:text-gray-900"
                    aria-label="Decrease quantity"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="font-medium w-6 text-center">{quantity}</span>
                  <button
                    onClick={() => onAddToCart?.(_id)}
                    className="p-1 text-gray-600 hover:text-gray-900"
                    aria-label="Increase quantity"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      );
    }

    if (variant === 'admin') {
      return (
        <Card padding="md" className={cn('flex flex-col', className)}>
          <div className="relative aspect-[3/4] mb-4">
            <ImageWithFallback
              src={imageUrl}
              alt={name}
              aspectRatio="portrait"
              borderRadius="md"
              className="w-full h-full"
            />
          </div>
          <div className="flex-1 flex flex-col">
            <h4 className="font-medium text-gray-900 mb-1 line-clamp-2">{name}</h4>
            {category && (
              <Badge variant="outline" size="sm" className="mb-2 w-fit">
                {category}
              </Badge>
            )}
            <p className="text-body-sm text-gray-500 flex-1 mb-3 line-clamp-2">{description || 'No description'}</p>
            <div className="flex items-center justify-between">
              <span className="text-heading-6 font-bold text-brand-600">₹{price}</span>
            </div>
          </div>
        </Card>
      );
    }

    // Default variant - full product card
    return (
      <Card
        variant="interactive"
        padding="none"
        className={cn('flex flex-col h-full group', className)}
      >
        {/* Image */}
        <div className="relative aspect-[3/4] overflow-hidden">
          <ImageWithFallback
            src={imageUrl}
            alt={name}
            aspectRatio="portrait"
            borderRadius="none"
            className="w-full h-full group-hover:scale-105 transition-transform duration-300"
          />

          {/* Wishlist Button */}
          {showWishlist && (
            <button
              onClick={() => onToggleWishlist?.(_id)}
              className="absolute top-2 left-2 p-2 bg-white/90 backdrop-blur-sm rounded-full shadow-sm transition-all hover:bg-white hover:scale-110"
              aria-label={isInWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
            >
              <Heart
                className={cn(
                  'w-5 h-5 transition-colors',
                  isInWishlist ? 'fill-brand-600 text-brand-600' : 'text-gray-400'
                )}
              />
            </button>
          )}

          {/* Category Badge */}
          {showCategory && category && (
            <span className="absolute top-2 right-2 px-2 py-1 bg-white/90 backdrop-blur-sm text-body-sm font-medium text-gray-700 rounded-button shadow-sm">
              {category}
            </span>
          )}
        </div>

        {/* Content */}
        <div className="p-4 flex flex-col flex-1">
          <h3 className="font-semibold text-gray-900 line-clamp-2 mb-2 group-hover:text-brand-600 transition-colors">
            {name}
          </h3>

          {/* Rating */}
          <div className="flex items-center gap-1 text-sm mb-2" aria-label={`Rating: ${rating} out of 5`}>
            {stars}
            <span className="text-gray-500 ml-1">({rating})</span>
          </div>

          {description && (
            <p className="text-body-sm text-gray-500 flex-1 mb-4 line-clamp-2">{description}</p>
          )}

          {/* Footer: Price + Actions */}
          <div className="flex items-center justify-between mt-auto pt-3 border-t border-gray-100">
            <span className="text-heading-5 font-bold text-brand-600">₹{price}</span>

            {showActions && (
              <div className="flex items-center gap-2">
                {quantity > 0 ? (
                  <div className="flex items-center gap-1.5 bg-gray-100 rounded-lg px-2 py-1">
                    <button
                      onClick={() => onRemoveFromCart?.(_id)}
                      className="p-1.5 text-gray-600 hover:text-gray-900 rounded-md hover:bg-gray-200 transition-colors"
                      aria-label="Decrease quantity"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="font-medium w-7 text-center">{quantity}</span>
                    <button
                      onClick={() => onAddToCart?.(_id)}
                      className="p-1.5 text-gray-600 hover:text-gray-900 rounded-md hover:bg-gray-200 transition-colors"
                      aria-label="Increase quantity"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <Button
                    size="sm"
                    variant="primary"
                    onClick={() => onAddToCart?.(_id)}
                    aria-label={`Add ${name} to cart`}
                  >
                    <ShoppingCart className="w-4 h-4" />
                    <span className="hidden sm:inline">Add</span>
                  </Button>
                )}
              </div>
            )}
          </div>
        </div>
      </Card>
    );
  }
);

ProductCard.displayName = 'ProductCard';

export { ProductCard };