import { Suspense } from "react";
import { Metadata } from "next";
import { getProductBySlugSSR } from "@/lib/server-actions";
import { ProductPageContent } from "./product-content";
import { ProductSkeleton } from "@/components/ui/product-skeleton";

interface ProductPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const { slug } = await params;
  const { product } = await getProductBySlugSSR(slug);
  
  if (!product) {
    return {
      title: "Товар не найден - GeneralHub",
      description: "Запрашиваемый товар не найден",
    };
  }

  const { price, originalPrice, discount } = product.price ? {
    price: product.discountedPrice || product.price,
    originalPrice: product.discountedPrice ? product.price : undefined,
    discount: product.discountPrecent || 0
  } : { price: 0, originalPrice: undefined, discount: 0 };

  const formattedPrice = price ? price.toLocaleString('ru-RU') : '0';
  const title = `${product.name} - ${formattedPrice} с | GeneralHub`;
  const productDescription = product.descriptions && product.descriptions.length > 0 
    ? product.descriptions[0].content 
    : null;
  const description = productDescription 
    ? `${productDescription.substring(0, 160)}...`
    : `Купить ${product.name} по выгодной цене ${formattedPrice} с. Быстрая доставка, гарантия качества.`;

  return {
    title,
    description,
    keywords: `${product.name}, купить, цена, доставка, GeneralHub, ${product.category?.name || ''}`,
    openGraph: {
      title,
      description,
      type: "website",
      images: product.images?.[0] ? [`/api/storage/products/images/${product.images[0].id}`] : [],
    },
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;
  
  // Получаем данные продукта на сервере
  const { product, error } = await getProductBySlugSSR(slug);

  return (
    <Suspense fallback={<ProductSkeleton />}>
      <ProductPageContent 
        product={product} 
        error={error}
        slug={slug}
      />
    </Suspense>
  );
}