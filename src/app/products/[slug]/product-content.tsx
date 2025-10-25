"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Heart, ShoppingCart, Minus, Plus, Star, Truck, Shield, RotateCcw, X, ChevronLeft, ChevronRight, Maximize2, Home, Eye } from "lucide-react";
import { BackButton } from "@/components/ui/back-button";
import { Button } from "@/components/ui/button";
import { productsService } from "@/services/products";
import { useProduct } from "@/hooks/use-products";
import { useCartStore } from "@/stores/cart-store";
import { transitions } from "@/lib/view-transitions";
import { SimilarProductsSlider } from "@/components/ui/similar-products-slider";

interface ProductPageContentProps {
  product: any;
  error: string | null;
  slug: string;
}

export function ProductPageContent({ product: initialProduct, error: initialError, slug }: ProductPageContentProps) {
  const router = useRouter();
  const { addItem, getItemQuantity, removeItem } = useCartStore();
  
  // Используем клиентский хук для обновлений, но с начальными данными
  const { data: product, isLoading, error } = useProduct(slug);
  
  // Используем данные из хука или начальные данные
  const currentProduct = product || initialProduct;
  const hasError = error || initialError;

  const [quantity, setQuantity] = useState(1);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [activeTab, setActiveTab] = useState('description');
  const [isFavorite, setIsFavorite] = useState(false);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);

  // Увеличиваем счетчик просмотров при загрузке страницы
  useEffect(() => {
    if (currentProduct) {
      productsService.incrementViews(currentProduct.slug);
    }
  }, [currentProduct, slug]);

  // Обработка клавиш для полноэкранного просмотра
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (!isFullscreen) return;
      
      switch (event.key) {
        case 'Escape':
          setIsFullscreen(false);
          break;
        case 'ArrowLeft':
          if (currentProduct?.images && currentProduct.images.length > 1) {
            handleImageNavigation('prev');
          }
          break;
        case 'ArrowRight':
          if (currentProduct?.images && currentProduct.images.length > 1) {
            handleImageNavigation('next');
          }
          break;
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isFullscreen, currentProduct]);

  const isInCart = currentProduct ? getItemQuantity(currentProduct.sku) > 0 : false;
  const itemQuantity = currentProduct ? getItemQuantity(currentProduct.sku) : 0;

  const { price, originalPrice, discount } = currentProduct ? productsService.getDisplayPrice(currentProduct) : { price: 0, originalPrice: 0, discount: 0 };

  const formattedPrice = price ? price.toLocaleString('ru-RU') : '0';
  const formattedOriginalPrice = originalPrice ? originalPrice.toLocaleString('ru-RU') : '0';

  const handleAddToCart = () => {
    if (currentProduct) {
      addItem(currentProduct, quantity);
    }
  };

  const handleRemoveFromCart = () => {
    if (currentProduct) {
      removeItem(currentProduct.sku);
    }
  };

  const handleQuantityChange = (newQuantity: number) => {
    if (newQuantity >= 1) {
      setQuantity(newQuantity);
    }
  };

  const handleImageNavigation = (direction: 'prev' | 'next') => {
    if (!currentProduct?.images) return;
    
    const totalImages = currentProduct.images.length;
    if (direction === 'prev') {
      setCurrentImageIndex((prev) => (prev - 1 + totalImages) % totalImages);
    } else {
      setCurrentImageIndex((prev) => (prev + 1) % totalImages);
    }
  };

  // Функции для обработки свайпов
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;

    if (isLeftSwipe && currentProduct?.images && currentProduct.images.length > 1) {
      handleImageNavigation('next');
    }
    if (isRightSwipe && currentProduct?.images && currentProduct.images.length > 1) {
      handleImageNavigation('prev');
    }
  };

  const handleBackClick = () => {
    transitions.slide(() => {
      router.back();
    });
  };

  if (hasError) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="mb-8 text-4xl font-bold">Товар не найден</h1>
            <p className="text-center text-muted-foreground mb-4">
              Товар с таким названием не существует или был удален.
            </p>
            <Button onClick={handleBackClick}>
              Вернуться назад
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (isLoading || !currentProduct) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-64 mb-8"></div>
            <div className="grid lg:grid-cols-2 gap-8">
              <div className="aspect-square bg-gray-200 rounded-lg"></div>
              <div className="space-y-4">
                <div className="h-8 bg-gray-200 rounded w-3/4"></div>
                <div className="h-6 bg-gray-200 rounded w-1/2"></div>
                <div className="h-12 bg-gray-200 rounded w-1/3"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const currentImage = currentProduct.images?.[currentImageIndex];
  const imageUrl = currentImage ? productsService.getProductImageUrl(currentImage.id) : null;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-gray-600 mb-6">
          <Link href="/" className="hover:text-[#ff6900] transition-colors flex items-center">
            <Home className="h-4 w-4" />
          </Link>
          <span>/</span>
          <Link href="/catalog" className="hover:text-[#ff6900] transition-colors">
            Каталог
          </Link>
          <span>/</span>
          <span className="text-gray-900">{currentProduct.name}</span>
        </div>

        {/* Back Button */}
        <BackButton className="mb-6" />

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-12">
          {/* Product Images */}
          <div className="space-y-4">
            {/* Main Image */}
            <div className="relative aspect-square bg-white rounded-xl overflow-hidden shadow-sm group">
              {currentProduct.images && currentProduct.images.length > 0 ? (
                <div className="relative w-full h-full">
                  {/* Slider Container */}
                  <div 
                    className="flex transition-transform duration-500 ease-in-out h-full"
                    style={{ transform: `translateX(-${currentImageIndex * 100}%)` }}
                    onTouchStart={handleTouchStart}
                    onTouchMove={handleTouchMove}
                    onTouchEnd={handleTouchEnd}
                  >
                    {currentProduct.images.map((image: any, index: number) => (
                      <div 
                        key={image.id}
                        className="w-full h-full flex-shrink-0 cursor-pointer"
                        onClick={() => currentProduct.images && currentProduct.images.length > 0 && setIsFullscreen(true)}
                      >
                        <img
                          src={productsService.getProductImageUrl(image.id)}
                          alt={`${currentProduct.name} - ${index + 1}`}
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
              {currentProduct.images && currentProduct.images.length > 0 && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute top-4 right-4 bg-white/80 hover:bg-white shadow-sm"
                  onClick={() => setIsFullscreen(true)}
                >
                  <Maximize2 className="h-4 w-4" />
                </Button>
              )}

              {/* Navigation Arrows */}
              {currentProduct.images && currentProduct.images.length > 1 && (
                <>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-gray-600"
                    onClick={() => handleImageNavigation('prev')}
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>

                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-gray-600"
                    onClick={() => handleImageNavigation('next')}
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </>
              )}
            </div>

            {/* Dots Navigation */}
            {currentProduct.images && currentProduct.images.length > 1 && (
              <div className="flex justify-center space-x-2">
                {currentProduct.images.map((_: any, index: number) => (
                  <button
                    key={index}
                    className={`w-2 h-2 rounded-full transition-colors ${
                      index === currentImageIndex ? 'bg-[#ff6900]' : 'bg-gray-300'
                    }`}
                    onClick={() => setCurrentImageIndex(index)}
                  />
                ))}
              </div>
            )}

            {/* Thumbnail Images */}
            {currentProduct.images && currentProduct.images.length > 1 && (
              <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                {currentProduct.images.map((image: any, index: number) => (
                  <button
                    key={image.id}
                    onClick={() => setCurrentImageIndex(index)}
                    className={`flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-all duration-300 hover:scale-105 ${
                      index === currentImageIndex 
                        ? 'border-[#ff6900] ring-2 ring-[#ff6900]/20' 
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <img
                      src={productsService.getProductImageUrl(image.id)}
                      alt={`${currentProduct.name} ${index + 1}`}
                      className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            {/* Category */}
            <div className="text-sm text-gray-500">
              Категория: {currentProduct.category ? (
                <Link href={`/categories/${currentProduct.category.slug}`} className="text-[#ff6900] hover:underline">
                  {currentProduct.category.name}
                </Link>
              ) : (
                <span>Без категории</span>
              )}
            </div>

            {/* Product Name */}
            <h1 className="text-3xl font-bold text-gray-900">{currentProduct.name}</h1>

            {/* SKU */}
            <div className="text-sm text-gray-500">
              Артикул: {currentProduct.sku}
            </div>

            {/* Rating */}
            <div className="flex items-center gap-2">
              <div className="flex items-center">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={`h-5 w-5 ${
                      star <= 4 ? 'text-yellow-400 fill-current' : 'text-gray-300'
                    }`}
                  />
                ))}
              </div>
              <span className="text-sm text-gray-600">4.0 (0 отзывов)</span>
            </div>

            {/* Views Count */}
            <div className="flex items-center gap-1 text-sm text-gray-500">
              <Eye className="h-4 w-4" />
              <span>{currentProduct.viewsCount} просмотров</span>
            </div>

            {/* Price */}
            <div className="space-y-2">
              {originalPrice && originalPrice > price && (
                <div className="text-lg text-gray-500">
                  Без скидки: <span className="line-through">{formattedOriginalPrice} с</span>
                </div>
              )}
              <div className={`text-4xl font-bold ${originalPrice ? 'text-[#ff6900]' : 'text-gray-900'}`}>
                {formattedPrice} с
              </div>
              {discount && discount > 0 && (
                <div className="inline-block bg-red-500 text-white text-sm px-3 py-1 rounded">
                  -{discount}%
                </div>
              )}
            </div>

            {/* Stock Status */}
            <div className="flex items-center gap-2">
              {currentProduct.inStock ? (
                <>
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span className="text-green-600 font-medium text-sm">В наличии</span>
                </>
              ) : (
                <>
                  <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                  <span className="text-red-600 font-medium text-sm">Нет в наличии</span>
                </>
              )}
            </div>

            {/* Quantity and Add to Cart */}
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <span className="text-sm font-medium">Количество:</span>
                <div className="flex items-center border border-gray-200 rounded">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-10 w-10 text-gray-600 hover:bg-gray-100"
                    onClick={() => handleQuantityChange(quantity - 1)}
                    disabled={quantity <= 1}
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

              <div className="flex gap-3">
                {isInCart ? (
                  <>
                    <Button
                      onClick={handleAddToCart}
                      disabled={!currentProduct.inStock}
                      className="flex-1 h-12 text-sm font-medium bg-green-500 hover:bg-green-600 text-white"
                    >
                      <ShoppingCart className="h-5 w-5 mr-2" />
                      В КОРЗИНЕ ({itemQuantity})
                    </Button>
                    <Button
                      onClick={handleRemoveFromCart}
                      variant="outline"
                      className="h-12 px-4 text-sm font-medium border-red-200 text-red-600 hover:bg-red-50"
                    >
                      Убрать
                    </Button>
                  </>
                ) : (
                  <Button
                    onClick={handleAddToCart}
                    disabled={!currentProduct.inStock}
                    className="flex-1 h-12 text-sm font-medium bg-[#ff6900] hover:bg-[#e55a00] text-white"
                  >
                    <ShoppingCart className="h-5 w-5 mr-2" />
                    В КОРЗИНУ
                  </Button>
                )}
                
                <Button
                  variant="outline"
                  size="icon"
                  className="h-12 w-12"
                  onClick={() => setIsFavorite(!isFavorite)}
                >
                  <Heart 
                    className={`h-5 w-5 ${isFavorite ? 'fill-red-500 text-red-500' : 'text-gray-600'}`} 
                  />
                </Button>
              </div>
            </div>

            {/* Features */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6 border-t border-gray-200">
              <div className="flex items-center gap-3">
                <Truck className="h-6 w-6 text-[#ff6900]" />
                <div>
                  <div className="font-medium text-sm">Быстрая доставка</div>
                  <div className="text-xs text-gray-500">1-2 дня</div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Shield className="h-6 w-6 text-[#ff6900]" />
                <div>
                  <div className="font-medium text-sm">Гарантия</div>
                  <div className="text-xs text-gray-500">12 месяцев</div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <RotateCcw className="h-6 w-6 text-[#ff6900]" />
                <div>
                  <div className="font-medium text-sm">Возврат</div>
                  <div className="text-xs text-gray-500">14 дней</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Product Description & Specifications Tabs */}
        <div className="mt-12">
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            {/* Tabs Header */}
            <div className="flex border-b border-gray-200 overflow-x-auto">
              <button
                onClick={() => setActiveTab("description")}
                className={`flex-1 px-3 sm:px-6 py-4 text-sm sm:text-base font-medium transition-colors relative whitespace-nowrap ${
                  activeTab === "description"
                    ? "text-[#ff6900] bg-white"
                    : "text-gray-600 hover:text-gray-900 bg-gray-50"
                }`}
              >
                Описание
                {activeTab === "description" && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#ff6900]"></div>
                )}
              </button>
              <button
                onClick={() => setActiveTab("specifications")}
                className={`flex-1 px-3 sm:px-6 py-4 text-sm sm:text-base font-medium transition-colors relative whitespace-nowrap ${
                  activeTab === "specifications"
                    ? "text-[#ff6900] bg-white"
                    : "text-gray-600 hover:text-gray-900 bg-gray-50"
                }`}
              >
                Характеристики
                {activeTab === "specifications" && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#ff6900]"></div>
                )}
              </button>
              <button
                onClick={() => setActiveTab("reviews")}
                className={`flex-1 px-3 sm:px-6 py-4 text-sm sm:text-base font-medium transition-colors relative whitespace-nowrap ${
                  activeTab === "reviews"
                    ? "text-[#ff6900] bg-white"
                    : "text-gray-600 hover:text-gray-900 bg-gray-50"
                }`}
              >
                Отзывы
                {activeTab === "reviews" && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#ff6900]"></div>
                )}
              </button>
            </div>

            {/* Tabs Content */}
            <div className="p-4 sm:p-6">
              {activeTab === "description" && (
                <div className="prose max-w-none space-y-4">
                  {currentProduct.descriptions && currentProduct.descriptions.length > 0 ? (
                    currentProduct.descriptions
                      .sort((a: any, b: any) => a.position - b.position)
                      .map((desc: any) => (
                        <div key={desc.id}>
                          {desc.type === "text" && (
                            <div className="text-gray-600 leading-relaxed text-sm sm:text-base whitespace-pre-line">
                              {desc.content}
                            </div>
                          )}
                          {desc.type === "image" && (
                            <div className="my-6 flex justify-center">
                              <img
                                src={desc.content}
                                alt={`Описание ${currentProduct.name}`}
                                className="max-w-full h-auto rounded-lg shadow-md"
                                onError={(e) => {
                                  const target = e.target as HTMLImageElement;
                                  target.style.display = 'none';
                                }}
                              />
                            </div>
                          )}
                        </div>
                      ))
                  ) : (
                    <p className="text-gray-600 leading-relaxed text-sm sm:text-base">
                      Описание товара отсутствует.
                    </p>
                  )}
                </div>
              )}

              {activeTab === "specifications" && (
                <div className="space-y-3">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center p-3 bg-gray-50 rounded-lg gap-2">
                      <span className="text-gray-600 font-medium text-sm sm:text-base">Температура замерзания:</span>
                      <span className="text-gray-900 font-semibold text-sm sm:text-base">-40°C</span>
                    </div>
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center p-3 bg-gray-50 rounded-lg gap-2">
                      <span className="text-gray-600 font-medium text-sm sm:text-base">Температура кипения:</span>
                      <span className="text-gray-900 font-semibold text-sm sm:text-base">+130°C</span>
                    </div>
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center p-3 bg-gray-50 rounded-lg gap-2">
                      <span className="text-gray-600 font-medium text-sm sm:text-base">Объем:</span>
                      <span className="text-gray-900 font-semibold text-sm sm:text-base">5 литров</span>
                    </div>
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center p-3 bg-gray-50 rounded-lg gap-2">
                      <span className="text-gray-600 font-medium text-sm sm:text-base">Совместимость:</span>
                      <span className="text-gray-900 font-semibold text-sm sm:text-base">BMW E36, E46, E90, F30</span>
                    </div>
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center p-3 bg-gray-50 rounded-lg gap-2">
                      <span className="text-gray-600 font-medium text-sm sm:text-base">Срок службы:</span>
                      <span className="text-gray-900 font-semibold text-sm sm:text-base">2 года или 50,000 км</span>
                    </div>
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center p-3 bg-gray-50 rounded-lg gap-2">
                      <span className="text-gray-600 font-medium text-sm sm:text-base">Артикул:</span>
                      <span className="text-gray-900 font-semibold text-sm sm:text-base">{currentProduct.sku}</span>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "reviews" && (
                <div className="space-y-4 sm:space-y-6">
                  {/* Reviews Header */}
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4 sm:mb-6">
                    <div>
                      <h3 className="text-lg sm:text-xl font-semibold text-gray-900">Отзывы покупателей</h3>
                      <p className="text-sm text-gray-500 mt-1">Всего отзывов: 0</p>
                    </div>
                    <Button className="bg-[#ff6900] hover:bg-[#e55a00] text-white text-sm sm:text-base px-4 py-2">
                      Оставить отзыв
                    </Button>
                  </div>

                  {/* No Reviews Yet */}
                  <div className="text-center py-8 sm:py-12">
                    <div className="mb-4">
                      <svg className="w-12 h-12 sm:w-16 sm:h-16 mx-auto text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path>
                      </svg>
                    </div>
                    <h4 className="text-base sm:text-lg font-medium text-gray-900 mb-2">Пока нет отзывов</h4>
                    <p className="text-sm sm:text-base text-gray-500 mb-4 sm:mb-6 px-4">
                      Будьте первым, кто оставит отзыв об этом товаре
                    </p>
                    <Button variant="outline" className="text-[#ff6900] border-[#ff6900] hover:bg-[#ff6900] hover:text-white text-sm sm:text-base px-4 py-2">
                      Написать отзыв
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Similar Products Section */}
        <div className="mt-12">
          <SimilarProductsSlider productSlug={slug} limit={10} />
        </div>
      </div>

      {/* Fullscreen Image Modal */}
      {isFullscreen && imageUrl && currentProduct.images && currentProduct.images.length > 0 && createPortal(
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
          {currentProduct.images && currentProduct.images.length > 1 && (
            <>
              <Button
                variant="ghost"
                size="icon"
                className="absolute left-8 top-1/2 -translate-y-1/2 h-14 w-14 bg-white/80 hover:bg-white text-gray-800 shadow-lg z-10"
                onClick={(e) => {
                  e.stopPropagation();
                  handleImageNavigation('prev');
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
                  handleImageNavigation('next');
                }}
              >
                <ChevronRight className="h-8 w-8" />
              </Button>
            </>
          )}

          {/* Image */}
          <div 
            className="relative max-w-7xl max-h-[95vh] w-full h-full flex items-center justify-center px-24 py-4"
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
            <img
              key={`fullscreen-${currentImageIndex}`}
              src={imageUrl}
              alt={currentProduct.name}
              className="max-w-full max-h-full object-contain transition-opacity duration-500 ease-in-out"
              onClick={(e) => e.stopPropagation()}
            />

            {/* Image Counter */}
            {currentProduct.images && currentProduct.images.length > 1 && (
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/50 text-white px-4 py-2 rounded-full text-sm">
                {currentImageIndex + 1} / {currentProduct.images.length}
              </div>
            )}
          </div>
        </div>,
        document.body
      )}
    </div>
  );
}
