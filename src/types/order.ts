export interface OrderProduct {
  sku: string;
  count: number;
}

export interface CreateOrderRequest {
  firstName: string;
  lastName?: string;
  phoneNumber: string;
  email?: string;
  deliveryAddress: string;
  products: OrderProduct[];
  comment?: string;
}

export interface CreateOrderResponse {
  orderId?: string;
  firstName?: string;
  lastName?: string;
  phoneNumber?: string;
  email?: string;
  deliveryAddress?: string;
  products?: OrderProduct[];
  comment?: string;
  success?: boolean;
  message?: string;
}

export interface Order {
  id: string;
  firstName: string;
  lastName?: string;
  phoneNumber: string;
  email?: string;
  deliveryAddress: string;
  products: OrderProduct[];
  comment?: string;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  createdAt: string;
  updatedAt: string;
}
