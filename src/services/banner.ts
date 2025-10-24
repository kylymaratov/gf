import apiClient from "@/lib/api-client";
import { ENV } from "@/lib/env";

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
    return `${ENV.API_URL}/banner/${bannerId}`;
  },

  // Получить баннеры отсортированные по позиции
  async getBannersSorted(): Promise<Banner[]> {
    const banner = await this.getAllBanners();
    return banner.sort((a, b) => a.position - b.position);
  },
};
