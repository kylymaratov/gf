"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ordersService } from "@/services/orders";
import { useCartStore } from "@/stores/cart-store";
import { CreateOrderRequest, OrderProduct } from "@/types/order";
import { toast } from "sonner";
import { X, Loader2 } from "lucide-react";

interface OrderFormProps {
  onClose: () => void;
  onSuccess: (orderId?: string) => void;
}

export function OrderForm({ onClose, onSuccess }: OrderFormProps) {
  const { items, clearCart, getTotalPrice } = useCartStore();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<CreateOrderRequest>({
    firstName: "",
    lastName: "",
    phoneNumber: "",
    email: "",
    deliveryAddress: "",
    products: items.map(item => ({
      sku: item.product.sku,
      count: item.quantity
    })),
    comment: "",
  });

  const [errors, setErrors] = useState<Partial<CreateOrderRequest>>({});

  const validateForm = (): boolean => {
    const newErrors: Partial<CreateOrderRequest> = {};

    if (!formData.firstName.trim()) {
      newErrors.firstName = "Имя обязательно для заполнения";
    }

    if (!formData.phoneNumber.trim()) {
      newErrors.phoneNumber = "Номер телефона обязателен для заполнения";
    } else if (!/^\+996 \(\d{3}\) \d{2}-\d{2}-\d{2}$/.test(formData.phoneNumber)) {
      newErrors.phoneNumber = "Номер телефона должен быть в формате +996 (XXX) XX-XX-XX";
    }

    if (!formData.deliveryAddress.trim()) {
      newErrors.deliveryAddress = "Адрес доставки обязателен для заполнения";
    }

    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Введите корректный email адрес";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    
    try {
      console.log("Sending order data:", formData);
      const response = await ordersService.createOrder(formData);
      console.log("Order response:", response);
      
      // Проверяем успешность по наличию orderId
      if (response.orderId) {
        console.log("Setting success modal with orderId:", response.orderId);
        clearCart();
        onSuccess(response.orderId);
      } else {
        console.log("No orderId in response, showing error");
        toast.error("❌ Ошибка при создании заказа", {
          description: response.message || "Попробуйте еще раз позже.",
        });
      }
    } catch (error: any) {
      console.error("Order creation error:", error);
      console.error("Error response:", error.response);
      
      // Если это ошибка от сервера с сообщением
      if (error.response?.data?.message) {
        toast.error("❌ Ошибка при создании заказа", {
          description: error.response.data.message,
        });
      } else {
        toast.error("❌ Ошибка при создании заказа", {
          description: "Попробуйте еще раз позже или свяжитесь с поддержкой.",
        });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (field: keyof CreateOrderRequest, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Очищаем ошибку при изменении поля
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const formatPhoneNumber = (value: string) => {
    // Удаляем все символы кроме цифр и +
    const cleaned = value.replace(/[^\d+]/g, '');
    
    // Если не начинается с +996, добавляем +996
    if (!cleaned.startsWith('+996')) {
      if (cleaned.startsWith('996')) {
        return '+996';
      } else if (cleaned.startsWith('0')) {
        return '+996';
      } else {
        return '+996';
      }
    }
    
    // Извлекаем только цифры после +996
    const digits = cleaned.slice(4);
    
    // Ограничиваем до 9 цифр
    const limitedDigits = digits.slice(0, 9);
    
    // Форматируем по маске
    if (limitedDigits.length === 0) {
      return '+996 (';
    } else if (limitedDigits.length <= 3) {
      return `+996 (${limitedDigits}`;
    } else if (limitedDigits.length <= 5) {
      return `+996 (${limitedDigits.slice(0, 3)}) ${limitedDigits.slice(3)}`;
    } else if (limitedDigits.length <= 7) {
      return `+996 (${limitedDigits.slice(0, 3)}) ${limitedDigits.slice(3, 5)}-${limitedDigits.slice(5)}`;
    } else if (limitedDigits.length <= 9) {
      return `+996 (${limitedDigits.slice(0, 3)}) ${limitedDigits.slice(3, 5)}-${limitedDigits.slice(5, 7)}-${limitedDigits.slice(7, 9)}`;
    } else {
      return `+996 (${limitedDigits.slice(0, 3)}) ${limitedDigits.slice(3, 5)}-${limitedDigits.slice(5, 7)}-${limitedDigits.slice(7, 9)}`;
    }
  };

  const handlePhoneChange = (value: string) => {
    const formatted = formatPhoneNumber(value);
    handleInputChange('phoneNumber', formatted);
  };

  const handlePhoneKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    // Разрешаем только цифры, Backspace, Delete, Tab, Escape, Enter, стрелки
    const allowedKeys = ['Backspace', 'Delete', 'Tab', 'Escape', 'Enter', 'ArrowLeft', 'ArrowRight', 'Home', 'End'];
    
    if (allowedKeys.includes(e.key)) {
      return;
    }
    
    // Разрешаем только цифры
    if (!/^\d$/.test(e.key)) {
      e.preventDefault();
    }
  };

  const handlePhoneFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    // На мобильных устройствах предотвращаем зум при фокусе
    if (window.innerWidth < 768) {
      e.target.style.fontSize = '16px';
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-start justify-center p-0 sm:p-4 z-[9999]">
      <div className="bg-white w-full h-full sm:rounded-lg sm:w-auto sm:max-w-lg md:max-w-xl sm:max-h-[90vh] sm:h-auto sm:my-auto overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 p-4 sm:p-5 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">Оформление заказа</h2>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="h-8 w-8"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 sm:p-5 space-y-4">
          {/* Name row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">
                Имя *
              </label>
              <input
                type="text"
                id="firstName"
                autoComplete="given-name"
                value={formData.firstName}
                onChange={(e) => handleInputChange('firstName', e.target.value)}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#ff6900] ${
                  errors.firstName ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Введите ваше имя"
              />
              {errors.firstName && (
                <p className="text-red-500 text-xs mt-1">{errors.firstName}</p>
              )}
            </div>

            <div>
              <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">
                Фамилия
              </label>
              <input
                type="text"
                id="lastName"
                autoComplete="family-name"
                value={formData.lastName}
                onChange={(e) => handleInputChange('lastName', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#ff6900]"
                placeholder="Введите вашу фамилию"
              />
            </div>
          </div>

          {/* Contacts row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700 mb-1">
                Номер телефона *
              </label>
              <input
                type="tel"
                id="phoneNumber"
                inputMode="numeric"
                autoComplete="tel"
                value={formData.phoneNumber}
                onChange={(e) => handlePhoneChange(e.target.value)}
                onKeyDown={handlePhoneKeyDown}
                onFocus={handlePhoneFocus}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#ff6900] text-sm ${
                  errors.phoneNumber ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="+996 (XXX) XX-XX-XX"
                maxLength={20}
                autoFocus={false}
              />
              {errors.phoneNumber && (
                <p className="text-red-500 text-xs mt-1">{errors.phoneNumber}</p>
              )}
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                type="email"
                id="email"
                autoComplete="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#ff6900] ${
                  errors.email ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="example@email.com"
              />
              {errors.email && (
                <p className="text-red-500 text-xs mt-1">{errors.email}</p>
              )}
            </div>
          </div>

          {/* Delivery Address */}
          <div>
            <label htmlFor="deliveryAddress" className="block text-sm font-medium text-gray-700 mb-1">
              Адрес доставки *
            </label>
            <textarea
              id="deliveryAddress"
              autoComplete="street-address"
              value={formData.deliveryAddress}
              onChange={(e) => handleInputChange('deliveryAddress', e.target.value)}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#ff6900] resize-none ${
                errors.deliveryAddress ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Укажите полный адрес доставки"
              rows={3}
            />
            {errors.deliveryAddress && (
              <p className="text-red-500 text-xs mt-1">{errors.deliveryAddress}</p>
            )}
          </div>

          {/* Comment */}
          <div>
            <label htmlFor="comment" className="block text-sm font-medium text-gray-700 mb-1">
              Комментарий к заказу
            </label>
            <textarea
              id="comment"
              value={formData.comment}
              onChange={(e) => handleInputChange('comment', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#ff6900]"
              placeholder="Дополнительная информация к заказу"
              rows={2}
            />
          </div>

          {/* Order Summary */}
          <div className="bg-gray-50 rounded-md p-3">
            <h3 className="font-medium text-gray-900 mb-2">Сумма заказа</h3>
            <p className="text-lg font-bold text-[#ff6900]">
              {formData.products.reduce((total, product) => {
                const item = items.find(i => i.product.sku === product.sku);
                if (item) {
                  const { price } = require("@/services/products").productsService.getDisplayPrice(item.product);
                  return total + price * product.count;
                }
                return total;
              }, 0).toLocaleString()} сом
            </p>
            <div className="mt-2 text-sm text-gray-600">
              <p>Товаров: {formData.products.reduce((sum, p) => sum + p.count, 0)} шт.</p>
              <p>Позиций: {formData.products.length} шт.</p>
            </div>
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-[#ff6900] hover:bg-[#e55a00] text-white"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Создание заказа...
              </>
            ) : (
              "Создать заказ"
            )}
          </Button>
        </form>
      </div>
    </div>
  );
}
