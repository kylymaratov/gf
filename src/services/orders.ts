import apiClient from "@/lib/api-client";
import { CreateOrderRequest, CreateOrderResponse, Order } from "@/types/order";

export const ordersService = {
  // Создать заказ
  async createOrder(orderData: CreateOrderRequest): Promise<CreateOrderResponse> {
    try {
      const { data } = await apiClient.post<CreateOrderResponse>("/order/create-order", orderData);
      // Если есть orderId, считаем заказ успешно созданным
      if (data.orderId) {
        return { ...data, success: true };
      }
      return data;
    } catch (error: any) {
      // Если это ошибка валидации или другая ошибка от сервера
      if (error.response?.data) {
        return {
          success: false,
          message: error.response.data.message || "Ошибка при создании заказа"
        };
      }
      
      // Если это сетевая ошибка или другая проблема
      throw error;
    }
  },

  // Получить заказ по ID
  async getOrderById(orderId: string): Promise<Order> {
    const { data } = await apiClient.get<Order>(`/order/${orderId}`);
    return data;
  },

  // Получить все заказы пользователя
  async getUserOrders(): Promise<Order[]> {
    const { data } = await apiClient.get<Order[]>("/order/user-orders");
    return data;
  },

  // Отменить заказ
  async cancelOrder(orderId: string): Promise<CreateOrderResponse> {
    const { data } = await apiClient.post<CreateOrderResponse>(`/order/${orderId}/cancel`);
    return data;
  },
};
