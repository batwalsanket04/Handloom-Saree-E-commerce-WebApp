import React from 'react';
import { ProductCard } from './ProductCard';
import { EmptyState } from '../ui/EmptyState';
import { Spinner } from '../ui/Spinner';
import { cn } from '../../utils/cn';

const gridCols = {
  default: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4',
  compact: 'grid-cols-1',
  admin: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4',
};

const gapSize = {
  default: 'gap-6',
  compact: 'gap-3',
  admin: 'gap-6',
};

export const ProductGrid = ({
  products,
  variant = 'default',
  showActions = true,
  showWishlist = true,
  showCategory = true,
  onAddToCart,
  onRemoveFromCart,
  onToggleWishlist,
  isInWishlist,
  getQuantity,
  loading,
  emptyTitle = 'No products found',
  emptyDescription = 'Try adjusting your filters or search terms.',
  emptyAction,
  className,
}) => {
  if (loading) {
    return (
      <div className={cn('grid', gridCols[variant], gapSize[variant], className)}>
        {[...Array(8)].map((_, i) => (
          <ProductCardSkeleton key={i} variant={variant} />
        ))}
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <EmptyState
        title={emptyTitle}
        description={emptyDescription}
        action={emptyAction}
        icon={
          <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
          </svg>
        }
      />
    );
  }

  return (
    <div className={cn('grid', gridCols[variant], gapSize[variant], className)}>
      {products.map((product) => (
        <ProductCard
          key={product._id}
          _id={product._id}
          name={product.name}
          price={product.price}
          description={product.description}
          image={product.image}
          category={product.category}
          rating={product.rating}
          variant={variant}
          showActions={showActions}
          showWishlist={showWishlist}
          showCategory={showCategory}
          onAddToCart={onAddToCart}
          onRemoveFromCart={onRemoveFromCart}
          onToggleWishlist={onToggleWishlist}
          isInWishlist={isInWishlist ? isInWishlist(product._id) : false}
          quantity={getQuantity ? getQuantity(product._id) : 0}
        />
      ))}
    </div>
  );
};

const ProductCardSkeleton = ({ variant = 'default' }) => {
  if (variant === 'compact') {
    return (
      <div className="flex gap-4 bg-white rounded-xl border border-gray-100 overflow-hidden animate-pulse">
        <div className="w-24 h-32 flex-shrink-0 bg-gray-200" />
        <div className="flex-1 p-3 space-y-3">
          <div className="h-4 bg-gray-200 rounded w-3/4" />
          <div className="h-3 bg-gray-200 rounded w-1/4" />
          <div className="h-5 bg-gray-200 rounded w-1/3" />
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl overflow-hidden flex flex-col animate-pulse">
      <div className="aspect-[3/4] bg-gray-200" />
      <div className="p-4 flex flex-col flex-1 space-y-3">
        <div className="h-5 bg-gray-200 rounded w-3/4" />
        <div className="h-4 bg-gray-200 rounded w-1/2" />
        <div className="h-4 bg-gray-200 rounded w-5/6" />
        <div className="flex-1" />
        <div className="h-7 bg-gray-200 rounded w-1/4" />
      </div>
    </div>
  );
};

export default ProductGrid;