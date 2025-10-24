"use client";

import Image from "next/image";
import Link from "next/link";
import { ShoppingCart, Heart } from "lucide-react";
import { Product } from "@/services/products";
import { Button } from "@/components/ui/button";
import { useCartStore } from "@/stores/cart-store";
import { formatPrice } from "@/lib/utils";
import { toast } from "sonner";

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const addItem = useCartStore((state) => state.addItem);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    addItem(product, 1);
    toast.success("Товар добавлен в корзину", {
      description: product.name,
    });
  };

  const discountedPrice = product.discountedPrice || product.price;

  return (
    <Link href={`/products/${product.slug}`}>
      <div className="group relative overflow-hidden rounded-lg border bg-card transition-all hover:shadow-lg">
        {/* Discount Badge */}
        {product.discountPrecent && product.discountPrecent > 0 && (
          <div className="absolute top-2 left-2 z-10 rounded-md bg-destructive px-2 py-1 text-xs font-bold text-destructive-foreground">
            -{product.discountPrecent}%
          </div>
        )}

        {/* Favorite Button */}
        <Button
          size="icon"
          variant="ghost"
          className="absolute top-2 right-2 z-10 h-8 w-8 rounded-full bg-background/80 opacity-0 transition-opacity group-hover:opacity-100"
          onClick={(e) => {
            e.preventDefault();
            toast.info("Добавлено в избранное");
          }}
        >
          <Heart className="h-4 w-4" />
        </Button>

        {/* Image */}
        <div className="relative aspect-square overflow-hidden bg-muted">
          {product.images[0]?.id ? (
            <Image
              src={`/api/storage/products/images/${product.images[0].id}`}
              alt={product.name}
              fill
              className="object-cover transition-transform group-hover:scale-105"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.style.display = 'none';
                const parent = target.parentElement;
                if (parent) {
                  parent.innerHTML = `
                    <div class="flex items-center justify-center h-full bg-gray-100 text-gray-400">
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
            <div className="flex items-center justify-center h-full bg-gray-100 text-gray-400">
              <div className="text-center">
                <svg className="w-8 h-8 mx-auto mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"></path>
                </svg>
                <p className="text-xs">Нет изображения</p>
              </div>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-4">
          <h3 className="mb-2 line-clamp-2 text-sm font-semibold">
            {product.name}
          </h3>

          {/* Rating */}
          {product.ratingCount > 0 && (
            <div className="mb-2 flex items-center gap-1 text-xs text-muted-foreground">
              <span className="text-yellow-500">★</span>
              <span>4.5</span>
              <span>({product.ratingCount})</span>
            </div>
          )}

          {/* Price */}
          <div className="mb-3 flex items-baseline gap-2">
            <span className="text-lg font-bold">
              {formatPrice(discountedPrice)}
            </span>
            {product.discountPrecent && product.discountPrecent > 0 && (
              <span className="text-sm text-muted-foreground line-through">
                {formatPrice(product.price)}
              </span>
            )}
          </div>

          {/* Stock Status */}
          {product.inStock ? (
            <Button
              className="w-full"
              size="sm"
              onClick={handleAddToCart}
            >
              <ShoppingCart className="mr-2 h-4 w-4" />
              В корзину
            </Button>
          ) : (
            <Button className="w-full" size="sm" disabled>
              Нет в наличии
            </Button>
          )}
        </div>
      </div>
    </Link>
  );
}

