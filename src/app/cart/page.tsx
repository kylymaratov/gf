"use client";

import Link from "next/link";
import { useState } from "react";
import { Trash2, Plus, Minus, ShoppingBag, Heart, Package, Truck, Shield, ArrowLeft } from "lucide-react";
import { BackButton } from "@/components/ui/back-button";
import { Button } from "@/components/ui/button";
import { OrderForm } from "@/components/ui/order-form";
import { OrderSuccessModal } from "@/components/ui/order-success-modal";
import { useCartStore } from "@/stores/cart-store";
import { productsService } from "@/services/products";
import { toast } from "sonner";

export default function CartPage() {
  const [showOrderForm, setShowOrderForm] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [createdOrderId, setCreatedOrderId] = useState<string>("");
  const { 
    items, 
    removeItem, 
    updateQuantity, 
    getTotalPrice, 
    getTotalItems,
    getTotalOriginalPrice,
    getTotalDiscount,
    getTotalDiscountPercent
  } = useCartStore();

  const handleOrderSuccess = (orderId?: string) => {
    setShowOrderForm(false);
    if (orderId) {
      setCreatedOrderId(orderId);
      setShowSuccessModal(true);
    } else {
      // Дополнительное уведомление об успехе
      setTimeout(() => {
        toast.success("🎉 Заказ оформлен!", {
          description: "Ваш заказ принят в обработку. Ожидайте звонка от менеджера.",
          duration: 4000,
        });
      }, 100);
    }
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-6 sm:py-8 lg:py-12">
          {/* Header */}
          <div className="mb-6 sm:mb-8">
            <Button
              variant="ghost"
              onClick={() => window.history.back()}
              className="mb-4 sm:mb-6 text-sm"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Назад
            </Button>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900">
              Корзина
            </h1>
          </div>

          {/* Empty State */}
          <div className="flex min-h-[60vh] flex-col items-center justify-center py-12 sm:py-16">
            <div className="text-center">
              <div className="mb-6">
                <div className="mx-auto w-24 h-24 sm:w-32 sm:h-32 bg-gray-100 rounded-full flex items-center justify-center">
                  <ShoppingBag className="w-12 h-12 sm:w-16 sm:h-16 text-gray-400" />
                </div>
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3 sm:mb-4">
                Корзина пуста
              </h2>
              <p className="text-sm sm:text-base text-gray-600 mb-6 sm:mb-8 max-w-md">
                Добавьте товары в корзину, чтобы продолжить покупки
              </p>
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                <Link href="/products">
                  <Button size="lg" className="w-full sm:w-auto bg-[#ff6900] hover:bg-[#e55a00] text-white">
                    Перейти в каталог
                  </Button>
                </Link>
                <Link href="/categories">
                  <Button variant="outline" size="lg" className="w-full sm:w-auto">
                    Посмотреть категории
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-6 sm:py-8 lg:py-12">
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <BackButton className="mb-4 sm:mb-6" onClick={() => window.history.back()} />
          <div className="flex items-center justify-between">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900">
              Корзина
            </h1>
            <div className="text-sm sm:text-base text-gray-600">
              {getTotalItems()} товар{getTotalItems() !== 1 ? 'ов' : ''}
            </div>
          </div>
        </div>

        <div className="grid gap-6 sm:gap-8 lg:grid-cols-3">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <div className="space-y-3 sm:space-y-4">
              {items.map((item) => {
                const firstImage = item.product.images && item.product.images.length > 0 
                  ? productsService.getProductImageUrl(item.product.images[0].id) 
                  : null;
                const { price, originalPrice, discount } = productsService.getDisplayPrice(item.product);
                
                return (
                  <div
                    key={item.product.sku}
                    className="bg-white rounded-lg sm:rounded-xl border border-gray-200 p-3 sm:p-4 lg:p-6 shadow-sm hover:shadow-md transition-shadow"
                  >
                    <div className="flex gap-3 sm:gap-4">
                      {/* Product Image */}
                      <Link href={`/products/${item.product.slug}`}>
                        <div className="relative h-20 w-20 sm:h-24 sm:w-24 lg:h-28 lg:w-28 overflow-hidden rounded-lg bg-gray-100 cursor-pointer hover:opacity-80 transition-opacity flex-shrink-0">
                          {firstImage ? (
                            <img
                              src={firstImage}
                              alt={item.product.name}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                const target = e.target as HTMLImageElement;
                                target.style.display = 'none';
                                const parent = target.parentElement;
                                if (parent) {
                                  parent.innerHTML = `
                                    <div class="flex items-center justify-center h-full text-gray-400">
                                      <div class="text-center">
                                        <svg class="w-8 h-8 mx-auto mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"></path>
                                        </svg>
                                        <p class="text-xs">Нет изображения</p>
                                      </div>
                                    </div>
                                  `;
                                }
                              }}
                            />
                          ) : (
                            <div className="flex items-center justify-center h-full text-gray-400">
                              <div className="text-center">
                                <svg className="w-8 h-8 mx-auto mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"></path>
                                </svg>
                                <p className="text-xs">Нет изображения</p>
                              </div>
                            </div>
                          )}
                        </div>
                      </Link>

                      {/* Product Info */}
                      <div className="flex flex-1 flex-col justify-between min-w-0">
                        <div className="flex-1">
                          <Link href={`/products/${item.product.slug}`}>
                            <h3 className="text-sm sm:text-base lg:text-lg font-semibold text-gray-900 hover:text-[#ff6900] transition-colors cursor-pointer line-clamp-2 mb-2">
                              {item.product.name}
                            </h3>
                          </Link>
                          
                          {/* Price */}
                          <div className="mb-3 sm:mb-4">
                            {originalPrice && discount && discount > 0 ? (
                              <div className="space-y-1">
                                <div className="flex items-center gap-2">
                                  <p className="text-xs sm:text-sm text-gray-500 line-through">
                                    {productsService.formatPrice(originalPrice)} с
                                  </p>
                                  <span className="inline-block bg-red-500 text-white text-[10px] sm:text-xs px-1.5 sm:px-2 py-0.5 sm:py-1 rounded">
                                    -{discount}%
                                  </span>
                                </div>
                                <p className="text-sm sm:text-base lg:text-lg text-[#ff6900] font-bold">
                                  {productsService.formatPrice(price)} с
                                </p>
                              </div>
                            ) : (
                              <p className="text-sm sm:text-base lg:text-lg text-gray-900 font-semibold">
                                {productsService.formatPrice(price)} с
                              </p>
                            )}
                          </div>

                          {/* Quantity Controls */}
                          <div className="flex items-center gap-2 sm:gap-3">
                            <Button
                              size="icon"
                              variant="outline"
                              className="h-7 w-7 sm:h-8 sm:w-8 lg:h-9 lg:w-9"
                              onClick={() =>
                                updateQuantity(item.product.sku, item.quantity - 1)
                              }
                            >
                              <Minus className="h-3 w-3 sm:h-4 sm:w-4" />
                            </Button>
                            <span className="w-8 sm:w-12 text-center text-sm sm:text-base font-medium">{item.quantity}</span>
                            <Button
                              size="icon"
                              variant="outline"
                              className="h-7 w-7 sm:h-8 sm:w-8 lg:h-9 lg:w-9"
                              onClick={() =>
                                updateQuantity(item.product.sku, item.quantity + 1)
                              }
                            >
                              <Plus className="h-3 w-3 sm:h-4 sm:w-4" />
                            </Button>
                          </div>
                        </div>
                      </div>

                      {/* Actions and Total */}
                      <div className="flex flex-col items-end justify-between">
                        <Button
                          size="icon"
                          variant="ghost"
                          className="h-8 w-8 sm:h-9 sm:w-9 text-gray-400 hover:text-red-500 hover:bg-red-50"
                          onClick={() => removeItem(item.product.sku)}
                        >
                          <Trash2 className="h-4 w-4 sm:h-5 sm:w-5" />
                        </Button>
                        
                        <div className="text-right mt-2">
                          {originalPrice && discount && discount > 0 ? (
                            <div className="space-y-1">
                              <p className="text-xs sm:text-sm text-gray-500 line-through">
                                {productsService.formatPrice(originalPrice * item.quantity)} с
                              </p>
                              <p className="text-sm sm:text-base lg:text-lg font-bold text-[#ff6900]">
                                {productsService.formatPrice(price * item.quantity)} с
                              </p>
                            </div>
                          ) : (
                            <p className="text-sm sm:text-base lg:text-lg font-bold text-gray-900">
                              {productsService.formatPrice(price * item.quantity)} с
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="sticky top-20 bottom-4 sm:bottom-auto bg-white rounded-lg sm:rounded-xl border border-gray-200 p-4 sm:p-6 shadow-sm mb-4 sm:mb-0">
              <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-4 sm:mb-6">
                Итого заказа
              </h2>

              <div className="mb-4 sm:mb-6 space-y-3 sm:space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm sm:text-base text-gray-600">
                    Товаров ({getTotalItems()}):
                  </span>
                  <span className="text-sm sm:text-base font-medium text-gray-900">
                    {productsService.formatPrice(getTotalOriginalPrice())} с
                  </span>
                </div>
                
                {getTotalDiscount() > 0 && (
                  <>
                    <div className="flex justify-between items-center">
                      <span className="text-sm sm:text-base text-gray-600">Скидка:</span>
                      <span className="text-sm sm:text-base font-semibold text-green-600">
                        -{productsService.formatPrice(getTotalDiscount())} с ({getTotalDiscountPercent()}%)
                      </span>
                    </div>
                    <div className="border-t border-gray-200 pt-3 sm:pt-4">
                      <div className="flex justify-between items-center">
                        <span className="text-sm sm:text-base text-gray-600">Без скидки:</span>
                        <span className="text-sm sm:text-base text-gray-500 line-through">
                          {productsService.formatPrice(getTotalOriginalPrice())} с
                        </span>
                      </div>
                    </div>
                  </>
                )}
                
                <div className="border-t border-gray-200 pt-3 sm:pt-4">
                  <div className="flex justify-between items-center">
                    <span className="text-base sm:text-lg font-bold text-gray-900">Всего:</span>
                    <span className={`text-lg sm:text-xl font-bold ${getTotalDiscount() > 0 ? "text-[#ff6900]" : "text-gray-900"}`}>
                      {productsService.formatPrice(getTotalPrice())} с
                    </span>
                  </div>
                </div>
              </div>

              {/* Benefits */}
              <div className="mb-4 sm:mb-6 space-y-2 sm:space-y-3">
                <div className="flex items-center gap-2 sm:gap-3 text-xs sm:text-sm text-gray-600">
                  <Truck className="h-4 w-4 sm:h-5 sm:w-5 text-[#ff6900]" />
                  <span>Бесплатная доставка от 1000 сом</span>
                </div>
                <div className="flex items-center gap-2 sm:gap-3 text-xs sm:text-sm text-gray-600">
                  <Shield className="h-4 w-4 sm:h-5 sm:w-5 text-[#ff6900]" />
                  <span>Гарантия качества</span>
                </div>
                <div className="flex items-center gap-2 sm:gap-3 text-xs sm:text-sm text-gray-600">
                  <Package className="h-4 w-4 sm:h-5 sm:w-5 text-[#ff6900]" />
                  <span>Быстрая упаковка</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-2 sm:space-y-3">
                <Button 
                  className="w-full h-10 sm:h-12 bg-[#ff6900] hover:bg-[#e55a00] text-white font-semibold text-sm sm:text-base"
                  size="lg"
                  onClick={() => setShowOrderForm(true)}
                >
                  Оформить заказ
                </Button>

                <Link href="/catalog">
                  <Button 
                    variant="outline" 
                    className="w-full h-10 sm:h-12 text-sm sm:text-base"
                    size="lg"
                  >
                    Продолжить покупки
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Order Form Modal */}
      {showOrderForm && (
        <OrderForm
          onClose={() => setShowOrderForm(false)}
          onSuccess={handleOrderSuccess}
        />
      )}

      {/* Success Modal */}
      {showSuccessModal && (
        <OrderSuccessModal
          orderId={createdOrderId}
          onClose={() => {
            setShowSuccessModal(false);
            setCreatedOrderId("");
          }}
        />
      )}
    </div>
  );
}

