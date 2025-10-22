import { useQuery } from "@tanstack/react-query";
import { productsService, ProductsParams } from "@/services/products";

export function useProducts(params: ProductsParams = {}) {
  return useQuery({
    queryKey: ["products", params],
    queryFn: () => productsService.getProducts(params),
    staleTime: 5 * 60 * 1000, // 5 минут
  });
}

export function useProduct(slug: string) {
  return useQuery({
    queryKey: ["product", slug],
    queryFn: () => productsService.getProductBySlug(slug),
    staleTime: 5 * 60 * 1000, // 5 минут
    enabled: !!slug, // Запускаем запрос только если slug есть
  });
}