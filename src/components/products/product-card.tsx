"use client";

import Image from "next/image";
import Link from "next/link";
import { ShoppingCart, Heart } from "lucide-react";
import { Product } from "@/types";
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

  const discountedPrice = product.discount
    ? product.price * (1 - product.discount / 100)
    : product.price;

  return (
    <Link href={`/products/${product.id}`}>
      <div className="group relative overflow-hidden rounded-lg border bg-card transition-all hover:shadow-lg">
        {/* Discount Badge */}
        {product.discount && (
          <div className="absolute top-2 left-2 z-10 rounded-md bg-destructive px-2 py-1 text-xs font-bold text-destructive-foreground">
            -{product.discount}%
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
          <Image
            src={product.images[0] || "/placeholder.jpg"}
            alt={product.name}
            fill
            className="object-cover transition-transform group-hover:scale-105"
          />
        </div>

        {/* Content */}
        <div className="p-4">
          <h3 className="mb-2 line-clamp-2 text-sm font-semibold">
            {product.name}
          </h3>

          {/* Rating */}
          {product.rating && (
            <div className="mb-2 flex items-center gap-1 text-xs text-muted-foreground">
              <span className="text-yellow-500">★</span>
              <span>{product.rating.toFixed(1)}</span>
              {product.reviewsCount && (
                <span>({product.reviewsCount})</span>
              )}
            </div>
          )}

          {/* Price */}
          <div className="mb-3 flex items-baseline gap-2">
            <span className="text-lg font-bold">
              {formatPrice(discountedPrice)}
            </span>
            {product.discount && (
              <span className="text-sm text-muted-foreground line-through">
                {formatPrice(product.price)}
              </span>
            )}
          </div>

          {/* Stock Status */}
          {product.stock > 0 ? (
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

