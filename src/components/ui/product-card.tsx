"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Heart, Eye, ShoppingCart } from "lucide-react";
import { Button } from "./button";
import { Product } from "@/services/products";
import { productsService } from "@/services/products";
import { QuickViewModal } from "./quick-view-modal";
import { useRecentlyViewed } from "@/hooks/use-recently-viewed";
import { useCartStore } from "@/stores/cart-store";

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const [isFavorite, setIsFavorite] = useState(false);
  const [isQuickViewOpen, setIsQuickViewOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const { addToRecentlyViewed } = useRecentlyViewed();
  const { addItem, getItemQuantity } = useCartStore();
  
  const itemQuantity = getItemQuantity(product.sku);
  const isInCart = itemQuantity > 0;

  // Получаем все изображения продукта
  const allImages = product.images || [];
  const currentImage = allImages[currentImageIndex];
  const currentImageUrl = currentImage ? productsService.getProductImageUrl(currentImage.id) : null;

  // Автоматическое переключение изображений при наведении
  useEffect(() => {
    if (isHovered && allImages.length > 1) {
      const interval = setInterval(() => {
        setCurrentImageIndex((prev) => (prev + 1) % allImages.length);
      }, 1500); // Переключаем каждые 1.5 секунды

      return () => clearInterval(interval);
    }
  }, [isHovered, allImages.length]);

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setCurrentImageIndex(0);
  };

  const { price, originalPrice, discount } = productsService.getDisplayPrice(product);
  const formattedPrice = productsService.formatPrice(price);
  const formattedOriginalPrice = originalPrice ? productsService.formatPrice(originalPrice) : null;

  const handleAddToCart = () => {
    addItem(product, 1);
  };

  const handleToggleFavorite = () => {
    setIsFavorite(!isFavorite);
  };

  const handleProductClick = () => {
    addToRecentlyViewed(product);
  };


  return (
    <div 
      className="bg-white rounded-lg sm:rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-xl hover:scale-[1.02] hover:-translate-y-1 transition-all duration-300 ease-out h-full flex flex-col group"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Product Image */}
      <div className="relative aspect-square bg-gray-50">
        <Link href={`/products/${product.slug}`} onClick={handleProductClick}>
          {currentImageUrl ? (
            <img
              src={currentImageUrl}
              alt={product.name}
              className="w-full h-full object-cover transition-all duration-500 ease-in-out"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.style.display = 'none';
                const parent = target.parentElement;
                if (parent) {
                  parent.innerHTML = `
                    <div class="flex items-center justify-center h-full text-gray-400">
                      <div class="text-center">
                        <svg class="w-12 h-12 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"></path>
                        </svg>
                        <p class="text-sm">Нет изображения</p>
                      </div>
                    </div>
                  `;
                }
              }}
            />
          ) : (
            <div className="flex items-center justify-center h-full text-gray-400">
              <div className="text-center">
                <svg className="w-12 h-12 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"></path>
                </svg>
                <p className="text-sm">Нет изображения</p>
              </div>
            </div>
          )}
        </Link>

        {/* Stock Status */}
        {product.inStock && (
          <div className="absolute top-2 right-2">
            <span className="bg-green-500 text-white text-[9px] sm:text-[10px] lg:text-xs px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full font-medium">
              В НАЛИЧИИ
            </span>
          </div>
        )}

        {/* Interactive Icons */}
        <div className="absolute top-2 left-2 flex flex-col gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6 sm:h-7 sm:w-7 lg:h-8 lg:w-8 bg-white/90 hover:bg-white shadow-sm"
            onClick={handleToggleFavorite}
          >
            <Heart 
              className={`h-3 w-3 sm:h-3.5 sm:w-3.5 lg:h-4 lg:w-4 ${isFavorite ? 'fill-red-500 text-red-500' : 'text-gray-600'}`} 
            />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6 sm:h-7 sm:w-7 lg:h-8 lg:w-8 bg-white/90 hover:bg-white shadow-sm"
            onClick={() => setIsQuickViewOpen(true)}
          >
            <Eye className="h-3 w-3 sm:h-3.5 sm:w-3.5 lg:h-4 lg:w-4 text-gray-600" />
          </Button>
        </div>

        {/* Discount Badge */}
        {discount && discount > 0 && (
          <div className="absolute bottom-2 left-2">
            <span className="bg-red-500 text-white text-[9px] sm:text-[10px] lg:text-xs px-1.5 sm:px-2 py-0.5 sm:py-1 rounded font-medium">
              -{discount}%
            </span>
          </div>
        )}
      </div>

      {/* Product Info */}
      <div className="p-3 sm:p-3 lg:p-4 flex flex-col flex-1">
        {/* Product Name */}
        <Link href={`/products/${product.slug}`} onClick={handleProductClick}>
          <h3 className="font-medium text-gray-900 text-xs sm:text-sm lg:text-base leading-tight mb-2 hover:text-[#ff6900] transition-colors line-clamp-2">
            {product.name}
          </h3>
        </Link>

        {/* Price */}
        <div className="mb-2 sm:mb-3 flex-1 flex flex-col justify-end">
          {originalPrice && (
            <div className="text-[9px] sm:text-[10px] lg:text-xs text-gray-500 mb-1">
              Без скидки: <span className="line-through">{formattedOriginalPrice} с</span>
            </div>
          )}
          <div className={`text-sm sm:text-base lg:text-lg font-bold ${originalPrice ? 'text-[#ff6900]' : 'text-gray-900'}`}>
            {formattedPrice} с
          </div>
        </div>

        {/* Add to Cart Button */}
            <Button
              onClick={handleAddToCart}
              className={`w-full h-7 sm:h-7 lg:h-8 text-[9px] sm:text-[10px] lg:text-xs font-medium flex items-center justify-center mt-auto ${
                isInCart 
                  ? 'bg-green-500 hover:bg-green-600' 
                  : 'bg-[#ff6900] hover:bg-[#e55a00]'
              } text-white`}
            >
              <ShoppingCart className="h-3 w-3 sm:h-3.5 sm:w-3.5 lg:h-4 lg:w-4 mr-1" />
              {isInCart ? `В КОРЗИНЕ (${itemQuantity})` : 'В КОРЗИНУ'}
            </Button>
      </div>

      {/* Quick View Modal */}
      <QuickViewModal
        product={product}
        isOpen={isQuickViewOpen}
        onClose={() => setIsQuickViewOpen(false)}
      />
    </div>
  );
}
