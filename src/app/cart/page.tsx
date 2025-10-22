"use client";

import Link from "next/link";
import Image from "next/image";
import { Trash2, Plus, Minus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCartStore } from "@/stores/cart-store";
import { productsService } from "@/services/products";

export default function CartPage() {
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

  if (items.length === 0) {
    return (
      <div className="container mx-auto flex min-h-[60vh] flex-col items-center justify-center py-16 px-4">
        <h1 className="mb-4 text-3xl font-bold">Корзина пуста</h1>
        <p className="mb-8 text-muted-foreground">
          Добавьте товары в корзину, чтобы продолжить покупки
        </p>
        <Link href="/products">
          <Button size="lg">Перейти в каталог</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="mb-8 text-3xl font-bold">Корзина</h1>

      <div className="grid gap-8 lg:grid-cols-3">
        {/* Cart Items */}
        <div className="lg:col-span-2">
          <div className="space-y-4">
            {items.map((item) => {
              const firstImage = item.product.images && item.product.images.length > 0 
                ? productsService.getProductImageUrl(item.product.images[0].id) 
                : "/placeholder.jpg";
              const { price, originalPrice, discount } = productsService.getDisplayPrice(item.product);
              
              return (
                <div
                  key={item.product.sku}
                  className="flex gap-4 rounded-lg border p-4"
                >
                  <Link href={`/products/${item.product.slug}`}>
                    <div className="relative h-24 w-24 overflow-hidden rounded-md bg-muted cursor-pointer hover:opacity-80 transition-opacity">
                      <Image
                        src={firstImage}
                        alt={item.product.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                  </Link>

                <div className="flex flex-1 flex-col justify-between">
                  <div>
                    <Link href={`/products/${item.product.slug}`}>
                      <h3 className="font-semibold hover:text-[#ff6900] transition-colors cursor-pointer">
                        {item.product.name}
                      </h3>
                    </Link>
                    <div className="text-sm">
                      {originalPrice && discount && discount > 0 ? (
                        <div className="space-y-1">
                          <p className="text-muted-foreground line-through">
                            {productsService.formatPrice(originalPrice)} с
                          </p>
                          <p className="text-[#ff6900] font-semibold">
                            {productsService.formatPrice(price)} с
                          </p>
                          <span className="inline-block bg-red-500 text-white text-xs px-2 py-1 rounded">
                            -{discount}%
                          </span>
                        </div>
                      ) : (
                        <p className="text-muted-foreground">
                          {productsService.formatPrice(price)} с
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Button
                      size="icon"
                      variant="outline"
                      className="h-8 w-8"
                      onClick={() =>
                        updateQuantity(item.product.sku, item.quantity - 1)
                      }
                    >
                      <Minus className="h-4 w-4" />
                    </Button>
                    <span className="w-12 text-center">{item.quantity}</span>
                    <Button
                      size="icon"
                      variant="outline"
                      className="h-8 w-8"
                      onClick={() =>
                        updateQuantity(item.product.sku, item.quantity + 1)
                      }
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <div className="flex flex-col items-end justify-between">
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => removeItem(item.product.sku)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                  <div className="text-right">
                    {originalPrice && discount && discount > 0 ? (
                      <div className="space-y-1">
                        <p className="text-muted-foreground line-through text-sm">
                          {productsService.formatPrice(originalPrice * item.quantity)} с
                        </p>
                        <p className="font-bold text-[#ff6900]">
                          {productsService.formatPrice(price * item.quantity)} с
                        </p>
                      </div>
                    ) : (
                      <p className="font-bold">
                        {productsService.formatPrice(price * item.quantity)} с
                      </p>
                    )}
                  </div>
                </div>
              </div>
              );
            })}
          </div>
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="sticky top-20 rounded-lg border p-6">
            <h2 className="mb-4 text-xl font-bold">Итого</h2>

            <div className="mb-4 space-y-2">
              <div className="flex justify-between">
                <span className="text-muted-foreground">
                  Товаров: {getTotalItems()}
                </span>
              </div>
              
              {getTotalDiscount() > 0 && (
                <>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Без скидки:</span>
                    <span className="text-muted-foreground line-through">
                      {productsService.formatPrice(getTotalOriginalPrice())} с
                    </span>
                  </div>
                  <div className="flex justify-between text-green-600">
                    <span>Скидка:</span>
                    <span className="font-semibold">
                      -{productsService.formatPrice(getTotalDiscount())} с ({getTotalDiscountPercent()}%)
                    </span>
                  </div>
                </>
              )}
              
              <div className="flex justify-between text-lg font-bold">
                <span>Всего:</span>
                <span className={getTotalDiscount() > 0 ? "text-[#ff6900]" : ""}>
                  {productsService.formatPrice(getTotalPrice())} с
                </span>
              </div>
            </div>

            <Button className="w-full" size="lg">
              Оформить заказ
            </Button>

            <Link href="/products">
              <Button variant="ghost" className="mt-2 w-full">
                Продолжить покупки
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

