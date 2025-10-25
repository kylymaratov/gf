import { useQuery } from "@tanstack/react-query";
import { productsService } from "@/services/products";

export function useSimilarProducts(productSlug: string, limit: number = 10) {
  return useQuery({
    queryKey: ["similar-products", productSlug, limit],
    queryFn: () => productsService.getSimilarProducts(productSlug, limit),
    enabled: !!productSlug,
    staleTime: 5 * 60 * 1000, // 5 минут
  });
}