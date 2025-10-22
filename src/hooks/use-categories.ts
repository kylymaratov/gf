import { useQuery } from "@tanstack/react-query";
import { categoriesService, Category } from "@/services/categories";

export function useCategories(params?: { sort?: string }) {
  return useQuery({
    queryKey: ["categories", params],
    queryFn: () => categoriesService.getCategories(params),
    staleTime: 5 * 60 * 1000, // 5 минут
  });
}

export function useCategory(slug: string) {
  return useQuery({
    queryKey: ["category", slug],
    queryFn: () => categoriesService.getCategoryBySlug(slug),
    enabled: !!slug,
  });
}

