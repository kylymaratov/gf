import { apiClient } from "@/lib/api-client";
import { ENV } from "@/lib/env";

export interface ProductImage {
  id: string;
  originalName: string;
  mimeType: string;
  fileSize: number;
}

export interface ProductDescription {
  id: number;
  position: number;
  type: string;
  content: string;
  productId: number;
}

export interface Product {
  sku: string;
  slug: string;
  name: string;
  inStock: boolean;
  price: number;
  priceInDollars?: number | null;
  discountPrecent: number | null;
  discountedPrice: number | null;
  soldCount: number;
  categoryId?: number;
  characterId: number | null;
  viewsCount: number;
  ratingCount: number;
  createdAt: string;
  updatedAt: string;
  category: {
    name: string;
    slug: string;
    description?: string;
    viewsCount?: number;
  };
  character?: any | null;
  images: ProductImage[];
  descriptions?: ProductDescription[];
}

export interface ProductsResponse {
  categorySlug: string;
  products: Product[];
  currentPage: number;
  totalPages: number;
  totalProducts: number;
}

export interface ProductsParams {
  page?: number;
  limit?: number;
  withImage?: boolean;
  sort?: string;
  categorySlug?: string;
  discountPrecent?: number;
}

export const productsService = {
  // Получить продукты с пагинацией
  async getProducts(params: ProductsParams = {}): Promise<ProductsResponse> {
    const searchParams = new URLSearchParams();
    
    if (params.page) searchParams.append('page', params.page.toString());
    if (params.limit) searchParams.append('limit', params.limit.toString());
    if (params.withImage !== undefined) searchParams.append('withImage', params.withImage.toString());
    if (params.sort) searchParams.append('sort', params.sort);
    if (params.discountPrecent !== undefined) searchParams.append('discountPrecent', params.discountPrecent.toString());

    const queryString = searchParams.toString();
    
    // Если указан categorySlug, используем специальный эндпоинт
    if (params.categorySlug) {
      const url = `/product/category-products?categorySlug=${encodeURIComponent(params.categorySlug)}${queryString ? `&${queryString}` : ''}`;
      const { data } = await apiClient.get<ProductsResponse>(url);
      return data;
    } else {
      // Иначе используем обычный эндпоинт
      const url = `/product/products${queryString ? `?${queryString}` : ''}`;
      const { data } = await apiClient.get<ProductsResponse>(url);
      return data;
    }
  },

  // Получить URL изображения продукта
  getProductImageUrl(imageId: string | number): string {
    return `${ENV.API_URL}/storage/product/images/${imageId}`;
  },

  // Получить URL изображения описания продукта
  getProductDescriptionImageUrl(imageId: string | number): string {
    return `${ENV.API_URL}/storage/product/description-images/${imageId}`;
  },

  // Форматировать цену
  formatPrice(price: number): string {
    return new Intl.NumberFormat('ru-RU').format(price);
  },

  // Получить отображаемую цену (со скидкой или обычную)
  getDisplayPrice(product: Product): { price: number; originalPrice?: number; discount?: number } {
    if (product.discountedPrice && product.discountPrecent && product.discountPrecent > 0) {
      return {
        price: product.discountedPrice,
        originalPrice: product.price,
        discount: product.discountPrecent
      };
    }
    return { price: product.price };
  },

  // Получить первое изображение продукта
  getFirstImageId(product: Product): string | null {
    return product.images && product.images.length > 0 ? product.images[0].id : null;
  },

  // Получить продукт по slug
  async getProductBySlug(slug: string): Promise<Product> {
    const { data } = await apiClient.get<Product[]>(`/product/${slug}`);
    // API возвращает массив с одним элементом
    if (data && data.length > 0) {
      return data[0];
    }
    throw new Error('Product not found');
  },

  // Увеличить счетчик просмотров
  async incrementViews(productSlug: string): Promise<void> {
    try {
      await apiClient.put(`/product/inc-views?productSlug=${encodeURIComponent(productSlug)}`);
    } catch (error: any) {
      // 403 - нормальное поведение для неавторизованных пользователей, игнорируем
      if (error?.response?.status !== 403) {
        console.error('Failed to increment product views:', error);
      }
    }
  }
};