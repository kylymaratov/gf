import { useQuery } from "@tanstack/react-query";
import { productsService, ProductsParams } from "@/services/products";

export function useProducts(params: ProductsParams & { enabled?: boolean } = {}) {
  const { enabled = true, ...queryParams } = params;
  
  // Создаем стабильный query key из параметров
  const queryKey = [
    "products", 
    queryParams.page || 1,
    queryParams.limit || 10,
    queryParams.sort || "default",
    queryParams.categorySlug || "all",
    queryParams.withImage || false,
    queryParams.discountPrecent || "none"
  ];
  
  return useQuery({
    queryKey,
    queryFn: () => productsService.getProducts(queryParams),
    enabled,
    staleTime: 5 * 60 * 1000, // 5 минут
    refetchOnWindowFocus: false, // Отключаем refetch при фокусе окна
    refetchOnMount: false, // Отключаем refetch при монтировании, если данные свежие
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