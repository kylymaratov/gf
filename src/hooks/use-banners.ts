import { useQuery } from "@tanstack/react-query";
import { bannersService } from "@/services/banners";

export function useBanners() {
  return useQuery({
    queryKey: ["banners"],
    queryFn: () => bannersService.getBannersSorted(),
    staleTime: 5 * 60 * 1000, // 5 минут
  });
}
