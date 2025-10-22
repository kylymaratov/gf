"use client";

import { useState } from "react";
import Link from "next/link";
import { Heart, Eye, ShoppingCart } from "lucide-react";
import { Button } from "./button";
import { Product } from "@/services/products";
import { productsService } from "@/services/products";
import { QuickViewModal } from "./quick-view-modal";
import { useCartStore } from "@/stores/cart-store";

interface ProductListItemProps {
  product: Product;
}

export function ProductListItem({ product }: ProductListItemProps) {
  const [isFavorite, setIsFavorite] = useState(false);
  const [isQuickViewOpen, setIsQuickViewOpen] = useState(false);
  const { addItem, getItemQuantity } = useCartStore();
  
  const itemQuantity = getItemQuantity(product.sku);
  const isInCart = itemQuantity > 0;

  const handleAddToCart = () => {
    addItem(product, 1);
  };

  const handleToggleFavorite = () => {
    setIsFavorite(!isFavorite);
  };

  const { price, originalPrice, discount } = productsService.getDisplayPrice(product);
  const formattedPrice = productsService.formatPrice(price);
  const formattedOriginalPrice = originalPrice ? productsService.formatPrice(originalPrice) : null;
  
  const firstImage = product.images && product.images.length > 0 
    ? productsService.getProductImageUrl(product.images[0].id) 
    : null;

  return (
    <div className="group relative bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden flex hover:shadow-xl transition-all duration-300 ease-out">
      {/* Product Image */}
      <div className="relative w-48 bg-gray-50 flex-shrink-0">
        <Link href={`/products/${product.slug}`} className="block h-full">
          {firstImage ? (
            <img
              src={firstImage}
              alt={product.name}
              className="w-full h-full object-cover"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.style.display = 'none';
                const parent = target.parentElement;
                if (parent) {
                  parent.innerHTML = `
                    <div class="flex items-center justify-center h-full text-gray-400">
                      <svg class="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"></path>
                      </svg>
                    </div>
                  `;
                }
              }}
            />
          ) : (
            <div className="flex items-center justify-center h-full text-gray-400">
              <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"></path>
              </svg>
            </div>
          )}
        </Link>

        {/* Stock Status */}
        {product.inStock && (
          <div className="absolute top-2 right-2">
            <span className="bg-green-500 text-white text-xs px-2 py-1 rounded-full font-medium">
              В НАЛИЧИИ
            </span>
          </div>
        )}

        {/* Discount Badge */}
        {discount && discount > 0 && (
          <div className="absolute bottom-2 left-2">
            <span className="bg-red-500 text-white text-xs px-2 py-1 rounded font-medium">
              -{discount}%
            </span>
          </div>
        )}
      </div>

      {/* Product Info */}
      <div className="flex-1 p-6 flex flex-col">
        <div className="flex justify-between items-start mb-4">
          <div className="flex-1">
            {/* Category */}
            {product.category && (
              <p className="text-xs text-gray-500 mb-1">{product.category.name}</p>
            )}
            
            {/* Product Name */}
            <Link href={`/products/${product.slug}`}>
              <h3 className="font-semibold text-gray-900 text-lg leading-tight mb-2 hover:text-[#ff6900] transition-colors line-clamp-2">
                {product.name}
              </h3>
            </Link>

            {/* SKU */}
            <p className="text-xs text-gray-500 mb-3">Артикул: {product.sku}</p>
          </div>

          {/* Interactive Icons */}
          <div className="flex gap-2 ml-4">
            <Button
              variant="ghost"
              size="icon"
              className="h-9 w-9 hover:bg-gray-100"
              onClick={handleToggleFavorite}
            >
              <Heart 
                className={`h-4 w-4 ${isFavorite ? 'fill-red-500 text-red-500' : 'text-gray-600'}`} 
              />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-9 w-9 hover:bg-gray-100"
              onClick={() => setIsQuickViewOpen(true)}
            >
              <Eye className="h-4 w-4 text-gray-600" />
            </Button>
          </div>
        </div>

        {/* Stats */}
        <div className="flex gap-4 text-xs text-gray-500 mb-4">
          <span>👁️ {product.viewsCount} просмотров</span>
          <span>🛒 {product.soldCount} продаж</span>
          {product.ratingCount > 0 && <span>⭐ {product.ratingCount} отзывов</span>}
        </div>

        {/* Price and Actions */}
        <div className="flex items-center justify-between mt-auto">
          <div>
            {originalPrice && (
              <div className="text-xs text-gray-500 mb-1">
                Без скидки: <span className="line-through">{formattedOriginalPrice} с</span>
              </div>
            )}
            <div className={`text-2xl font-bold ${originalPrice ? 'text-[#ff6900]' : 'text-gray-900'}`}>
              {formattedPrice} с
            </div>
          </div>

          {/* Add to Cart Button */}
              <Button
                onClick={handleAddToCart}
                className={`h-10 px-6 text-sm font-medium flex items-center ${
                  isInCart 
                    ? 'bg-green-500 hover:bg-green-600' 
                    : 'bg-[#ff6900] hover:bg-[#e55a00]'
                } text-white`}
              >
                <ShoppingCart className="h-4 w-4 mr-2" />
                {isInCart ? `В КОРЗИНЕ (${itemQuantity})` : 'В КОРЗИНУ'}
              </Button>
        </div>
      </div>

      <QuickViewModal
        product={product}
        isOpen={isQuickViewOpen}
        onClose={() => setIsQuickViewOpen(false)}
      />
    </div>
  );
}

