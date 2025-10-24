import { useQuery } from "@tanstack/react-query";
import { productsService, ProductsParams } from "@/services/products";

interface UseDiscountProductsParams {
  limit?: number;
  discountPrecent?: number;
  enabled?: boolean;
}

export function useDiscountProducts({ 
  limit = 10, 
  discountPrecent = 1,
  enabled = true 
}: UseDiscountProductsParams = {}) {
  const params: ProductsParams = {
    limit,
    withImage: true,
    discountPrecent,
    sort: 'newest'
  };

  return useQuery({
    queryKey: ['discount-products', params],
    queryFn: () => productsService.getProducts(params),
    enabled,
    staleTime: 5 * 60 * 1000, // 5 минут
    gcTime: 10 * 60 * 1000, // 10 минут
  });
}
