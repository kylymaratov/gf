import { QueryClient } from "@tanstack/react-query";

export function makeQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 60 * 1000, // 1 минута
        gcTime: 5 * 60 * 1000, // 5 минут (было cacheTime)
        retry: 1,
        refetchOnWindowFocus: false,
      },
    },
  });
}

