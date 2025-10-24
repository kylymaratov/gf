import apiClient from "@/lib/api-client";

export interface Banner {
  id: string;
  position: number;
  imageUrl: string;
  openUrl: string;
  title: string;
  description: string;
  buttonTitle: string;
  contentPosition: 'left' | 'center' | 'right';
  isPrimary: boolean;
}

export interface BannerImage {
  id: string;
  url: string;
  alt?: string;
}

export const bannerService = {
  // Получить все баннеры
  async getAllBanners(): Promise<Banner[]> {
    const { data } = await apiClient.get<Banner[]>("/banner/all");
    return data;
  },

  // Получить URL изображения баннера
  getBannerImageUrl(bannerId: string): string {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";
    return `${baseUrl}/api/banner/${bannerId}`;
  },

  // Получить баннеры отсортированные по позиции
  async getBannersSorted(): Promise<Banner[]> {
    const banner = await this.getAllBanners();
    return banner.sort((a, b) => a.position - b.position);
  },
};
