"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { X, Heart, ShoppingCart, Minus, Plus, ArrowRight, ChevronLeft, ChevronRight, Maximize2 } from "lucide-react";
import { Button } from "./button";
import { Product } from "@/services/products";
import { productsService } from "@/services/products";
import { useCartStore } from "@/stores/cart-store";
import { transitions } from "@/lib/view-transitions";

interface QuickViewModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
}

export function QuickViewModal({ product, isOpen, onClose }: QuickViewModalProps) {
  const router = useRouter();
  const [quantity, setQuantity] = useState(1);
  const [isFavorite, setIsFavorite] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [showLoginPopup, setShowLoginPopup] = useState(false);
  const { addItem, getItemQuantity } = useCartStore();
  
  const itemQuantity = product ? getItemQuantity(product.sku) : 0;
  const isInCart = itemQuantity > 0;

  // Trigger animation when modal opens
  useEffect(() => {
    if (isOpen) {
      setIsAnimating(true);
    } else {
      setIsAnimating(false);
    }
  }, [isOpen]);

  if (!isOpen || !product) return null;

  const { price, originalPrice, discount } = productsService.getDisplayPrice(product);
  const formattedPrice = productsService.formatPrice(price);
  const formattedOriginalPrice = originalPrice ? productsService.formatPrice(originalPrice) : null;
  
      // Получаем все изображения продукта
      const allImages = product.images || [];
      const currentImage = allImages[currentImageIndex];
      const currentImageUrl = currentImage ? productsService.getProductImageUrl(currentImage.id) : null;

  const goToPrevious = () => {
    setCurrentImageIndex((prev) => (prev - 1 + allImages.length) % allImages.length);
  };

  const goToNext = () => {
    setCurrentImageIndex((prev) => (prev + 1) % allImages.length);
  };

  const goToSlide = (index: number) => {
    setCurrentImageIndex(index);
  };

  const handleAddToCart = () => {
    if (product) {
      addItem(product, quantity);
    }
  };

  const handleToggleFavorite = () => {
    // Проверяем, авторизован ли пользователь
    const isAuthenticated = false; // TODO: заменить на реальную проверку авторизации
    
    if (!isAuthenticated) {
      setShowLoginPopup(true);
      setTimeout(() => setShowLoginPopup(false), 3000);
      return;
    }
    
    setIsFavorite(!isFavorite);
  };

  const handleQuantityChange = (newQuantity: number) => {
    if (newQuantity >= 1) {
      setQuantity(newQuantity);
    }
  };

  return createPortal(
    <div className={`fixed inset-0 z-[70] flex items-center justify-center transition-opacity duration-300 ${isAnimating ? 'opacity-100' : 'opacity-0'}`}>
      {/* Backdrop */}
      <div 
        className={`absolute inset-0 bg-black/50 backdrop-blur-sm transition-all duration-300 ${isAnimating ? 'opacity-100' : 'opacity-0'}`}
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className={`relative bg-white rounded-lg shadow-xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-hidden transition-all duration-300 ${isAnimating ? 'scale-100 opacity-100' : 'scale-95 opacity-0'}`}>
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-semibold">Быстрый просмотр</h2>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="h-8 w-8"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Product Image */}
            <div className="space-y-4">
              <div className="relative aspect-square bg-gray-50 rounded-lg overflow-hidden group">
                {allImages.length > 0 ? (
                  <div className="relative w-full h-full">
                    {/* Slider Container */}
                    <div 
                      className="flex transition-transform duration-500 ease-in-out h-full"
                      style={{ transform: `translateX(-${currentImageIndex * 100}%)` }}
                    >
                      {allImages.map((image, index) => (
                        <div 
                          key={image.id}
                          className="w-full h-full flex-shrink-0 cursor-pointer"
                          onClick={() => allImages.length > 0 && setIsFullscreen(true)}
                        >
                          <img
                            src={productsService.getProductImageUrl(image.id)}
                            alt={`${product.name} - ${index + 1}`}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.style.display = 'none';
                              const parent = target.parentElement;
                              if (parent) {
                                parent.innerHTML = `
                                  <div class="flex items-center justify-center h-full text-gray-400">
                                    <div class="text-center">
                                      <svg class="w-16 h-16 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"></path>
                                      </svg>
                                      <p class="text-sm">Нет изображения</p>
                                    </div>
                                  </div>
                                `;
                              }
                            }}
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center justify-center h-full text-gray-400">
                    <div className="text-center">
                      <svg className="w-16 h-16 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"></path>
                      </svg>
                      <p className="text-sm">Нет изображения</p>
                    </div>
                  </div>
                )}

                {/* Fullscreen Button - only show if there are images */}
                {allImages.length > 0 && (
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute top-2 right-2 bg-white/80 hover:bg-white text-gray-600 opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={() => setIsFullscreen(true)}
                  >
                    <Maximize2 className="h-4 w-4" />
                  </Button>
                )}

                {/* Navigation Arrows */}
                {allImages.length > 1 && (
                  <>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-gray-600"
                      onClick={goToPrevious}
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </Button>

                    <Button
                      variant="ghost"
                      size="icon"
                      className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-gray-600"
                      onClick={goToNext}
                    >
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </>
                )}
              </div>

              {/* Dots Navigation */}
              {allImages.length > 1 && (
                <div className="flex justify-center space-x-2">
                  {allImages.map((_, index) => (
                    <button
                      key={index}
                      className={`w-2 h-2 rounded-full transition-colors ${
                        index === currentImageIndex ? 'bg-[#ff6900]' : 'bg-gray-300'
                      }`}
                      onClick={() => goToSlide(index)}
                    />
                  ))}
                </div>
              )}

              {/* Stock Status */}
              {product.inStock && (
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span className="text-green-600 font-medium text-sm">В наличии</span>
                </div>
              )}
            </div>

            {/* Product Info */}
            <div className="space-y-6">
              {/* Product Name */}
              <div>
                <h1 className="text-2xl font-bold text-gray-900 mb-2">{product.name}</h1>
                <p className="text-sm text-gray-500">Артикул: {product.sku}</p>
              </div>

              {/* Price */}
              <div className="space-y-2">
                {originalPrice && (
                  <div className="text-sm text-gray-500">
                    Без скидки: <span className="line-through">{formattedOriginalPrice} с</span>
                  </div>
                )}
                <div className="text-3xl font-bold text-[#ff6900]">
                  {formattedPrice} с
                </div>
                {discount && discount > 0 && (
                  <div className="inline-block bg-red-500 text-white text-sm px-2 py-1 rounded">
                    -{discount}%
                  </div>
                )}
              </div>

              {/* Category */}
              {product.category && (
                <div>
                  <span className="text-sm text-gray-500">Категория: </span>
                  <span className="text-sm font-medium">{product.category.name}</span>
                </div>
              )}

              {/* Quantity and Actions */}
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <span className="text-sm font-medium">Количество:</span>
                  <div className="flex items-center border border-gray-200 rounded">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-10 w-10 text-gray-600 hover:bg-gray-100"
                      onClick={() => handleQuantityChange(quantity - 1)}
                    >
                      <Minus className="h-4 w-4" />
                    </Button>
                    <input
                      type="number"
                      value={quantity}
                      onChange={(e) => handleQuantityChange(parseInt(e.target.value) || 1)}
                      className="w-16 h-10 text-center text-sm border-0 focus:outline-none"
                      min="1"
                    />
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-10 w-10 text-gray-600 hover:bg-gray-100"
                      onClick={() => handleQuantityChange(quantity + 1)}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex gap-3">
                      <Button
                        onClick={handleAddToCart}
                        className={`flex-1 h-12 text-sm font-medium ${
                          isInCart 
                            ? 'bg-green-500 hover:bg-green-600' 
                            : 'bg-[#ff6900] hover:bg-[#e55a00]'
                        } text-white`}
                      >
                        <ShoppingCart className="h-5 w-5 mr-2" />
                        {isInCart ? `В КОРЗИНЕ (${itemQuantity})` : 'В КОРЗИНУ'}
                      </Button>
                    
                    <div className="relative">
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-12 w-12"
                        onClick={handleToggleFavorite}
                      >
                        <Heart 
                          className={`h-5 w-5 ${isFavorite ? 'fill-red-500 text-red-500' : 'text-gray-600'}`} 
                        />
                      </Button>
                      
                      {/* Login Popup */}
                      {showLoginPopup && (
                        <div className="absolute top-full right-0 mt-2 z-[100] animate-in fade-in slide-in-from-top-2 duration-200">
                          <div className="bg-white rounded-lg shadow-xl border border-gray-200 p-4 w-64">
                            <div className="flex items-start gap-3">
                              <div className="flex-shrink-0">
                                <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
                                  <Heart className="h-5 w-5 text-[#ff6900]" />
                                </div>
                              </div>
                              <div className="flex-1">
                                <h4 className="text-sm font-semibold text-gray-900 mb-1">
                                  Требуется авторизация
                                </h4>
                                <p className="text-xs text-gray-600 mb-3">
                                  Войдите в систему, чтобы добавить товар в избранное
                                </p>
                                <Button 
                                  size="sm" 
                                  className="w-full h-8 bg-[#ff6900] hover:bg-[#e55a00] text-white text-xs"
                                  onClick={() => {
                                    setShowLoginPopup(false);
                                    onClose();
                                    transitions.slide(() => {
                                      router.push('/login');
                                    });
                                  }}
                                >
                                  Войти
                                </Button>
                              </div>
                            </div>
                            {/* Arrow */}
                            <div className="absolute -top-2 right-4 w-4 h-4 bg-white border-l border-t border-gray-200 transform rotate-45"></div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  <Link href={`/products/${product.slug}`} onClick={onClose}>
                    <Button
                      variant="outline"
                      className="w-full h-12 text-sm font-medium"
                    >
                      Перейти к товару
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Fullscreen Image Viewer */}
      {isFullscreen && currentImageUrl && allImages.length > 0 && createPortal(
        <div 
          className="fixed inset-0 z-[80] bg-black/95 flex items-center justify-center animate-in fade-in duration-200"
          onClick={() => setIsFullscreen(false)}
        >
          {/* Close Button */}
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-4 right-4 h-10 w-10 bg-white/10 hover:bg-white/20 text-white z-10"
            onClick={() => setIsFullscreen(false)}
          >
            <X className="h-6 w-6" />
          </Button>

          {/* Navigation Arrows */}
          {allImages.length > 1 && (
            <>
              <Button
                variant="ghost"
                size="icon"
                className="absolute left-8 top-1/2 -translate-y-1/2 h-14 w-14 bg-white/80 hover:bg-white text-gray-800 shadow-lg z-10"
                onClick={(e) => {
                  e.stopPropagation();
                  goToPrevious();
                }}
              >
                <ChevronLeft className="h-8 w-8" />
              </Button>

              <Button
                variant="ghost"
                size="icon"
                className="absolute right-8 top-1/2 -translate-y-1/2 h-14 w-14 bg-white/80 hover:bg-white text-gray-800 shadow-lg z-10"
                onClick={(e) => {
                  e.stopPropagation();
                  goToNext();
                }}
              >
                <ChevronRight className="h-8 w-8" />
              </Button>
            </>
          )}

          {/* Image */}
          <div className="relative max-w-7xl max-h-[95vh] w-full h-full flex items-center justify-center px-24 py-4">
            <img
              key={`fullscreen-${currentImageIndex}`}
              src={currentImageUrl}
              alt={product.name}
              className="max-w-full max-h-full object-contain transition-opacity duration-500 ease-in-out"
              onClick={(e) => e.stopPropagation()}
            />

            {/* Image Counter */}
            {allImages.length > 1 && (
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/50 text-white px-4 py-2 rounded-full text-sm">
                {currentImageIndex + 1} / {allImages.length}
              </div>
            )}
          </div>
        </div>,
        document.body
      )}
    </div>,
    document.body
  );
}
