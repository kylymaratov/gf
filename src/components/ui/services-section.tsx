"use client";

import { MapPin, CreditCard, ShoppingBasket } from "lucide-react";

export function ServicesSection() {
  const services = [
    {
      icon: MapPin,
      title: "Доставка по всему СНГ",
      description: "Доставим ваш заказ во все регионы КР и СНГ"
    },
    {
      icon: CreditCard,
      title: "Оплата онлайн",
      description: "Наличными, банковской картой или онлайн (MBANK, OPTIMA, СБЕР)"
    },
    {
      icon: MapPin,
      title: "Мы находимся в Бишкеке",
      description: "ул. Лермонтова, 11. Приходите мы всегда Вам рады!"
    },
    {
      icon: ShoppingBasket,
      title: "Бесплатная доставка",
      description: "от 4999 сом"
    }
  ];

  return (
    <section className="pt-1 pb-4 sm:pt-2 sm:pb-6 lg:pt-3 lg:pb-8 bg-white">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {services.map((service, index) => {
            const IconComponent = service.icon;
            return (
              <div
                key={index}
                className="bg-white rounded-xl p-4 sm:p-6 border border-gray-200 hover:border-[#ff6900] transition-all duration-300 hover:shadow-lg hover:shadow-[#ff6900]/10"
              >
                <div className="flex items-start gap-3 sm:gap-4">
                  <div className="flex-shrink-0">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-[#ff6900] to-[#ff8533] rounded-lg flex items-center justify-center shadow-sm">
                      <IconComponent className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-gray-900 font-bold text-sm sm:text-base lg:text-lg mb-1 sm:mb-2 leading-tight">
                      {service.title}
                    </h3>
                    <p className="text-gray-600 text-xs sm:text-sm leading-relaxed">
                      {service.description}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
