import { Suspense } from "react";

export default function ProductsPage() {
  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="mb-8 text-3xl font-bold">Каталог товаров</h1>
      
      <Suspense fallback={<ProductsLoading />}>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          <p className="col-span-full text-center text-muted-foreground">
            Здесь будет отображаться каталог товаров.
            <br />
            Подключите API для отображения товаров.
          </p>
        </div>
      </Suspense>
    </div>
  );
}

function ProductsLoading() {
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {Array.from({ length: 8 }).map((_, i) => (
        <div
          key={i}
          className="h-96 animate-pulse rounded-lg border bg-muted"
        />
      ))}
    </div>
  );
}

