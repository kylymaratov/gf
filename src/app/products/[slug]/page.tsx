"use client";

import { useState, useEffect } from "react";
import { use } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Heart, ShoppingCart, Minus, Plus, ArrowLeft, Star, Truck, Shield, RotateCcw, X, ChevronLeft, ChevronRight, Maximize2, Home, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { productsService } from "@/services/products";
import { useProduct } from "@/hooks/use-products";
import { useCartStore } from "@/stores/cart-store";

interface ProductPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export default function ProductPage({ params }: ProductPageProps) {
  const { slug } = use(params);
  const router = useRouter();
  const [quantity, setQuantity] = useState(1);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [isFavorite, setIsFavorite] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [activeTab, setActiveTab] = useState<"description" | "specifications" | "reviews">("description");
  const { addItem, getItemQuantity } = useCartStore();
  
  const { data: product, isLoading, error } = useProduct(slug);
  const itemQuantity = product ? getItemQuantity(product.sku) : 0;
  const isInCart = itemQuantity > 0;
  const [showLoginPopup, setShowLoginPopup] = useState(false);

  // Увеличиваем счетчик просмотров при загрузке страницы
  useEffect(() => {
    if (slug) {
      productsService.incrementViews(slug);
    }
  }, [slug]);

  const handleQuantityChange = (newQuantity: number) => {
    if (newQuantity >= 1) {
      setQuantity(newQuantity);
    }
  };

  const handleAddToCart = () => {
    if (product) {
      addItem(product, quantity);
    }
  };

  const handleToggleFavorite = () => {
    // Проверяем, авторизован ли пользователь (пока всегда false, потом заменим на реальную проверку)
    const isAuthenticated = false; // TODO: заменить на реальную проверку авторизации
    
    if (!isAuthenticated) {
      setShowLoginPopup(true);
      setTimeout(() => setShowLoginPopup(false), 3000); // Скрываем через 3 секунды
      return;
    }
    
    setIsFavorite(!isFavorite);
  };

  const goToImage = (index: number) => {
    setSelectedImageIndex(index);
  };

  const goToPreviousImage = () => {
    if (product && product.images) {
      setSelectedImageIndex((prev) => (prev - 1 + product.images.length) % product.images.length);
    }
  };

  const goToNextImage = () => {
    if (product && product.images) {
      setSelectedImageIndex((prev) => (prev + 1) % product.images.length);
    }
  };

  // Показываем загрузку
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto py-8 px-4">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/2 mb-6"></div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="space-y-4">
                <div className="aspect-square bg-gray-200 rounded-lg"></div>
                <div className="flex gap-2">
                  {Array.from({ length: 4 }).map((_, i) => (
                    <div key={i} className="w-20 h-20 bg-gray-200 rounded"></div>
                  ))}
                </div>
              </div>
              <div className="space-y-6">
                <div className="h-10 bg-gray-200 rounded w-3/4"></div>
                <div className="h-6 bg-gray-200 rounded w-1/2"></div>
                <div className="h-12 bg-gray-200 rounded w-1/3"></div>
                <div className="h-40 bg-gray-200 rounded"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Показываем ошибку
  if (error || !product) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto py-8 px-4">
          <div className="text-center py-12">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Товар не найден</h1>
            <p className="text-gray-600 mb-6">
              Запрашиваемый товар не существует или был удален.
            </p>
            <Button onClick={() => router.back()}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Вернуться назад
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const { price, originalPrice, discount } = productsService.getDisplayPrice(product);
  const formattedPrice = productsService.formatPrice(price);
  const formattedOriginalPrice = originalPrice ? productsService.formatPrice(originalPrice) : null;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto py-8 px-4">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-gray-600 mb-6">
          <Link href="/" className="hover:text-[#ff6900] transition-colors flex items-center">
            <Home className="h-4 w-4" />
          </Link>
          <span>/</span>
          <Link href="/categories" className="hover:text-[#ff6900] transition-colors">
            Категории
          </Link>
          <span>/</span>
          <Link href={`/categories/${product.category.slug}`} className="hover:text-[#ff6900] transition-colors">
            {product.category.name}
          </Link>
          <span>/</span>
          <span className="text-gray-900">{product.name}</span>
        </div>

        {/* Back Button */}
        <Button
          variant="ghost"
          onClick={() => router.back()}
          className="mb-6"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Назад
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Product Images */}
          <div className="space-y-4">
            {/* Main Image */}
            <div className="relative aspect-square bg-white rounded-lg overflow-hidden border border-gray-200 group">
              {product.images && product.images.length > 0 ? (
                <div className="relative w-full h-full">
                  {/* Slider Container */}
                  <div 
                    className="flex transition-transform duration-500 ease-in-out h-full"
                    style={{ transform: `translateX(-${selectedImageIndex * 100}%)` }}
                  >
                    {product.images.map((image, index) => (
                      <div 
                        key={image.id}
                        className="w-full h-full flex-shrink-0 cursor-pointer"
                        onClick={() => setIsFullscreen(true)}
                      >
                        <img
                          src={productsService.getProductImageUrl(image.id)}
                          alt={`${product.name} - ${index + 1}`}
                          className="w-full h-full object-contain"
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
                  
                  {/* Fullscreen Button */}
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute top-2 right-2 bg-white/80 hover:bg-white text-gray-600 opacity-0 group-hover:opacity-100 transition-opacity z-10"
                    onClick={() => setIsFullscreen(true)}
                  >
                    <Maximize2 className="h-4 w-4" />
                  </Button>

                  {/* Navigation Arrows */}
                  {product.images.length > 1 && (
                    <>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white z-10"
                        onClick={goToPreviousImage}
                      >
                        <ArrowLeft className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white z-10"
                        onClick={goToNextImage}
                      >
                        <ArrowLeft className="h-4 w-4 rotate-180" />
                      </Button>
                    </>
                  )}
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
            </div>

            {/* Thumbnail Images */}
            {product.images && product.images.length > 1 && (
              <div className="flex gap-3 overflow-x-auto mt-4 pb-2">
                {product.images.map((image, index) => (
                  <button
                    key={image.id}
                    onClick={() => goToImage(index)}
                    className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-3 transition-all duration-300 relative group ${
                      index === selectedImageIndex 
                        ? 'border-[#ff6900] shadow-lg scale-105' 
                        : 'border-gray-200 hover:border-gray-300 hover:scale-105'
                    }`}
                  >
                    <img
                      src={productsService.getProductImageUrl(image.id)}
                      alt={`${product.name} - ${index + 1}`}
                      className={`w-full h-full object-cover transition-all duration-300 ${
                        index === selectedImageIndex 
                          ? 'brightness-100' 
                          : 'brightness-90 group-hover:brightness-100'
                      }`}
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.style.display = 'none';
                        const parent = target.parentElement;
                        if (parent) {
                          parent.innerHTML = `
                            <div class="flex items-center justify-center h-full text-gray-400">
                              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"></path>
                              </svg>
                            </div>
                          `;
                        }
                      }}
                    />
                    
                    {/* Active indicator overlay */}
                    {index === selectedImageIndex && (
                      <div className="absolute inset-0 bg-[#ff6900]/20 rounded-lg"></div>
                    )}
                    
                    {/* Hover overlay */}
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-all duration-300 rounded-lg"></div>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            {/* Category */}
            <div className="text-sm text-gray-500">
              Категория: <Link href={`/categories/${product.category.slug}`} className="text-[#ff6900] hover:underline">{product.category.name}</Link>
            </div>

            {/* Product Name */}
            <h1 className="text-3xl font-bold text-gray-900">{product.name}</h1>

            {/* SKU */}
            <div className="text-sm text-gray-500">
              Артикул: {product.sku}
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
              <span>{product.viewsCount} просмотров</span>
            </div>

            {/* Price */}
            <div className="space-y-2">
              {originalPrice && (
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
              {product.inStock ? (
                <>
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span className="text-green-600 font-medium">В наличии</span>
                </>
              ) : (
                <>
                  <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                  <span className="text-red-600 font-medium">Нет в наличии</span>
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
                <Button
                  onClick={handleAddToCart}
                  disabled={!product.inStock}
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
                    <div className="absolute top-full right-0 mt-2 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
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
                                // TODO: Redirect to login page
                                router.push('/login');
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
            <div className="flex border-b border-gray-200">
              <button
                onClick={() => setActiveTab("description")}
                className={`flex-1 px-6 py-4 text-base font-medium transition-colors relative ${
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
                className={`flex-1 px-6 py-4 text-base font-medium transition-colors relative ${
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
                className={`flex-1 px-6 py-4 text-base font-medium transition-colors relative ${
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
            <div className="p-6">
              {activeTab === "description" && (
                <div className="prose max-w-none space-y-4">
                  {product.descriptions && product.descriptions.length > 0 ? (
                    product.descriptions
                      .sort((a, b) => a.position - b.position)
                      .map((desc) => (
                        <div key={desc.id}>
                          {desc.type === "text" && (
                            <div className="text-gray-600 leading-relaxed text-base whitespace-pre-line">
                              {desc.content}
                            </div>
                          )}
                          {desc.type === "image" && (
                            <div className="my-6 flex justify-center">
                              <img
                                src={desc.content}
                                alt={`Описание ${product.name}`}
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
                    <p className="text-gray-600 leading-relaxed text-base">
                      Описание товара отсутствует.
                    </p>
                  )}
                </div>
              )}

              {activeTab === "specifications" && (
                <div className="space-y-3">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                      <span className="text-gray-600 font-medium">Температура замерзания:</span>
                      <span className="text-gray-900 font-semibold">-40°C</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                      <span className="text-gray-600 font-medium">Температура кипения:</span>
                      <span className="text-gray-900 font-semibold">+130°C</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                      <span className="text-gray-600 font-medium">Объем:</span>
                      <span className="text-gray-900 font-semibold">5 литров</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                      <span className="text-gray-600 font-medium">Совместимость:</span>
                      <span className="text-gray-900 font-semibold">BMW E36, E46, E90, F30</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                      <span className="text-gray-600 font-medium">Срок службы:</span>
                      <span className="text-gray-900 font-semibold">2 года или 50,000 км</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                      <span className="text-gray-600 font-medium">Артикул:</span>
                      <span className="text-gray-900 font-semibold">{product.sku}</span>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "reviews" && (
                <div className="space-y-6">
                  {/* Reviews Header */}
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900">Отзывы покупателей</h3>
                      <p className="text-sm text-gray-500 mt-1">Всего отзывов: 0</p>
                    </div>
                    <Button className="bg-[#ff6900] hover:bg-[#e55a00] text-white">
                      Оставить отзыв
                    </Button>
                  </div>

                  {/* No Reviews Yet */}
                  <div className="text-center py-12">
                    <div className="mb-4">
                      <svg className="w-16 h-16 mx-auto text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path>
                      </svg>
                    </div>
                    <h4 className="text-lg font-medium text-gray-900 mb-2">Пока нет отзывов</h4>
                    <p className="text-gray-500 mb-6">
                      Будьте первым, кто оставит отзыв об этом товаре
                    </p>
                    <Button variant="outline" className="text-[#ff6900] border-[#ff6900] hover:bg-[#ff6900] hover:text-white">
                      Написать отзыв
                    </Button>
                  </div>

                  {/* Example Review Structure (hidden for now) */}
                  {/* 
                  <div className="space-y-4">
                    <div className="border-b border-gray-200 pb-6">
                      <div className="flex items-start gap-4">
                        <div className="flex-shrink-0">
                          <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
                            <span className="text-gray-600 font-medium">ИП</span>
                          </div>
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-2">
                            <div>
                              <h4 className="font-medium text-gray-900">Имя Покупателя</h4>
                              <div className="flex items-center gap-2 mt-1">
                                <div className="flex gap-1">
                                  {Array.from({ length: 5 }).map((_, i) => (
                                    <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                                  ))}
                                </div>
                                <span className="text-sm text-gray-500">15.10.2024</span>
                              </div>
                            </div>
                          </div>
                          <p className="text-gray-600 text-sm leading-relaxed">
                            Текст отзыва...
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                  */}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Fullscreen Image Viewer */}
      {isFullscreen && product.images && product.images.length > 0 && (
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
          {product.images.length > 1 && (
            <>
              <Button
                variant="ghost"
                size="icon"
                className="absolute left-8 top-1/2 -translate-y-1/2 h-14 w-14 bg-white/80 hover:bg-white text-gray-800 shadow-lg z-10"
                onClick={(e) => {
                  e.stopPropagation();
                  goToPreviousImage();
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
                  goToNextImage();
                }}
              >
                <ChevronRight className="h-8 w-8" />
              </Button>
            </>
          )}

          {/* Image */}
          <div className="relative max-w-7xl max-h-[95vh] w-full h-full flex items-center justify-center px-24 py-4">
            <img
              key={`fullscreen-${selectedImageIndex}`}
              src={productsService.getProductImageUrl(product.images[selectedImageIndex].id)}
              alt={product.name}
              className="max-w-full max-h-full object-contain transition-opacity duration-500 ease-in-out"
              onClick={(e) => e.stopPropagation()}
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

            {/* Image Counter */}
            {product.images.length > 1 && (
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/50 text-white px-4 py-2 rounded-full text-sm">
                {selectedImageIndex + 1} / {product.images.length}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
