import apiClient from "@/lib/api-client";
import { ENV } from "@/lib/env";

export interface Category {
  id: number;
  name: string;
  viewsCount: number;
  description: string | null;
  slug: string;
  _count: {
    products: number;
  };
}

export interface CategoriesResponse {
  categories: Category[];
  currentPage: number;
  totalPages: number;
  totalCategories: number;
}

export const categoriesService = {
  // Получить все категории
  async getCategories(params?: { sort?: string }): Promise<Category[]> {
    const queryParams = new URLSearchParams();
    if (params?.sort) {
      queryParams.append('sort', params.sort);
    }
    const queryString = queryParams.toString();
    const url = `/category/categories${queryString ? `?${queryString}` : ''}`;
    const { data } = await apiClient.get<CategoriesResponse>(url);
    return data.categories;
  },

  // Получить категорию по slug
  async getCategoryBySlug(slug: string): Promise<Category> {
    const categories = await this.getCategories();
    const category = categories.find(cat => cat.slug === slug);
    if (!category) {
      throw new Error(`Category with slug "${slug}" not found`);
    }
    return category;
  },

  // Получить URL изображения категории
  getCategoryImageUrl(slug: string, opts?: { iconType?: string }): string {
    const query = opts?.iconType ? `?iconType=${encodeURIComponent(opts.iconType)}` : "";
    return `${ENV.API_URL}/storage/category/images/${slug}${query}`;
  },
};

