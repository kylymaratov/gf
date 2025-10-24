import { categoriesService } from "@/services/categories";
import { productsService } from "@/services/products";
import { bannersService } from "@/services/banners";

// Server-side functions for SSR

export async function getCategoriesSSR() {
  try {
    const categories = await categoriesService.getCategories();
    return { categories, error: null };
  } catch (error) {
    console.error('Error fetching categories:', error);
    return { categories: null, error: 'Failed to fetch categories' };
  }
}

export async function getProductsSSR(params: {
  page?: number;
  limit?: number;
  sort?: string;
  categorySlug?: string;
  withImage?: boolean;
}) {
  try {
    const products = await productsService.getProducts(params);
    return { products, error: null };
  } catch (error) {
    console.error('Error fetching products:', error);
    return { products: null, error: 'Failed to fetch products' };
  }
}

export async function getProductBySlugSSR(slug: string) {
  try {
    const product = await productsService.getProductBySlug(slug);
    return { product, error: null };
  } catch (error) {
    console.error('Error fetching product:', error);
    return { product: null, error: 'Failed to fetch product' };
  }
}

export async function getBannersSSR() {
  try {
    const banners = await bannersService.getBannersSorted();
    return { banners, error: null };
  } catch (error) {
    console.error('Error fetching banners:', error);
    return { banners: null, error: 'Failed to fetch banners' };
  }
}

export async function getCategoryBySlugSSR(slug: string) {
  try {
    const category = await categoriesService.getCategoryBySlug(slug);
    return { category, error: null };
  } catch (error) {
    console.error('Error fetching category:', error);
    return { category: null, error: 'Failed to fetch category' };
  }
}
