"use client";

import { Button } from "@/components/ui/button";
import { CheckCircle } from "lucide-react";

interface OrderSuccessModalProps {
  orderId: string;
  onClose: () => void;
}

export function OrderSuccessModal({ orderId, onClose }: OrderSuccessModalProps) {
  console.log("OrderSuccessModal rendered with orderId:", orderId);
  
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-[9999]">
      <div className="bg-white rounded-lg max-w-md w-full p-6 text-center">
        {/* Success Icon */}
        <div className="mb-4">
          <CheckCircle className="h-16 w-16 text-green-500 mx-auto" />
        </div>

        {/* Success Message */}
        <h2 className="text-xl font-bold text-gray-900 mb-2">
          Заказ успешно создан!
        </h2>
        
        <p className="text-gray-600 mb-4">
          Ваш заказ принят в обработку
        </p>

        {/* Order ID */}
        <div className="bg-gray-50 rounded-md p-3 mb-4">
          <p className="text-sm text-gray-500 mb-1">Номер заказа:</p>
          <p className="font-mono text-sm font-semibold text-gray-900">
            {orderId}
          </p>
        </div>

        {/* Additional Info */}
        <div className="bg-blue-50 border border-blue-200 rounded-md p-3 mb-6">
          <p className="text-sm text-blue-800 font-medium mb-1">
            📞 Мы свяжемся с вами в ближайшее время
          </p>
          <p className="text-sm text-blue-700">
            для уточнения деталей заказа и подтверждения доставки
          </p>
        </div>

        {/* OK Button */}
        <Button
          onClick={onClose}
          className="w-full bg-[#ff6900] hover:bg-[#e55a00] text-white"
        >
          ОК
        </Button>
      </div>
    </div>
  );
}
