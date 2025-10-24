export function ProductSkeleton() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-4 sm:py-6 lg:py-8">
        {/* Header Skeleton */}
        <div className="mb-6 sm:mb-8">
          <div className="flex items-center gap-4">
            <div className="h-8 w-8 bg-gray-200 rounded animate-pulse"></div>
            <div className="h-8 w-48 bg-gray-200 rounded animate-pulse"></div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Image Skeleton */}
          <div className="space-y-4">
            <div className="aspect-square bg-gray-200 rounded-xl animate-pulse"></div>
            <div className="flex justify-center space-x-2">
              <div className="w-2 h-2 bg-gray-200 rounded-full animate-pulse"></div>
              <div className="w-2 h-2 bg-gray-200 rounded-full animate-pulse"></div>
              <div className="w-2 h-2 bg-gray-200 rounded-full animate-pulse"></div>
            </div>
          </div>

          {/* Product Info Skeleton */}
          <div className="space-y-6">
            {/* Category */}
            <div className="h-4 w-32 bg-gray-200 rounded animate-pulse"></div>
            
            {/* Product Name */}
            <div className="space-y-2">
              <div className="h-8 w-full bg-gray-200 rounded animate-pulse"></div>
              <div className="h-8 w-3/4 bg-gray-200 rounded animate-pulse"></div>
            </div>

            {/* SKU */}
            <div className="h-4 w-24 bg-gray-200 rounded animate-pulse"></div>

            {/* Rating */}
            <div className="flex items-center gap-2">
              <div className="flex space-x-1">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div key={i} className="h-5 w-5 bg-gray-200 rounded animate-pulse"></div>
                ))}
              </div>
              <div className="h-4 w-20 bg-gray-200 rounded animate-pulse"></div>
            </div>

            {/* Views Count */}
            <div className="flex items-center gap-1">
              <div className="h-4 w-4 bg-gray-200 rounded animate-pulse"></div>
              <div className="h-4 w-24 bg-gray-200 rounded animate-pulse"></div>
            </div>

            {/* Price */}
            <div className="space-y-2">
              <div className="h-6 w-32 bg-gray-200 rounded animate-pulse"></div>
              <div className="h-10 w-48 bg-gray-200 rounded animate-pulse"></div>
              <div className="h-6 w-16 bg-gray-200 rounded animate-pulse"></div>
            </div>

            {/* Stock Status */}
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-gray-200 rounded-full animate-pulse"></div>
              <div className="h-4 w-24 bg-gray-200 rounded animate-pulse"></div>
            </div>

            {/* Quantity and Add to Cart */}
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="h-4 w-20 bg-gray-200 rounded animate-pulse"></div>
                <div className="flex items-center border border-gray-200 rounded">
                  <div className="h-10 w-10 bg-gray-200 rounded animate-pulse"></div>
                  <div className="w-16 h-10 bg-gray-200 rounded animate-pulse"></div>
                  <div className="h-10 w-10 bg-gray-200 rounded animate-pulse"></div>
                </div>
              </div>

              <div className="flex gap-3">
                <div className="flex-1 h-12 bg-gray-200 rounded animate-pulse"></div>
                <div className="h-12 w-12 bg-gray-200 rounded animate-pulse"></div>
              </div>
            </div>

            {/* Features */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6 border-t border-gray-200">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="h-6 w-6 bg-gray-200 rounded animate-pulse"></div>
                  <div className="space-y-1">
                    <div className="h-4 w-20 bg-gray-200 rounded animate-pulse"></div>
                    <div className="h-3 w-16 bg-gray-200 rounded animate-pulse"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Tabs Skeleton */}
        <div className="mt-12">
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            {/* Tabs Header */}
            <div className="flex border-b border-gray-200">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex-1 px-6 py-4">
                  <div className="h-4 w-24 bg-gray-200 rounded animate-pulse mx-auto"></div>
                </div>
              ))}
            </div>

            {/* Tabs Content */}
            <div className="p-6">
              <div className="space-y-4">
                <div className="h-4 w-full bg-gray-200 rounded animate-pulse"></div>
                <div className="h-4 w-5/6 bg-gray-200 rounded animate-pulse"></div>
                <div className="h-4 w-4/5 bg-gray-200 rounded animate-pulse"></div>
                <div className="h-4 w-full bg-gray-200 rounded animate-pulse"></div>
                <div className="h-4 w-3/4 bg-gray-200 rounded animate-pulse"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
