import Link from "next/link";
import { Home } from "lucide-react";

export default function DeliveryPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-gray-600 mb-6">
          <Link href="/" className="hover:text-[#ff6900] transition-colors flex items-center">
            <Home className="h-4 w-4" />
          </Link>
          <span>/</span>
          <span className="text-gray-900">Доставка и оплата</span>
        </div>

        <h1 className="text-3xl font-bold text-gray-900 mb-8">Доставка и оплата</h1>
        
        <div className="space-y-8">
          {/* Доставка */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Доставка</h2>
            <div className="bg-gray-50 p-6 rounded-lg">
              <p className="text-gray-600 mb-4">
                Мы осуществляем доставку товаров по всей территории Кыргызстана. 
                Сроки и стоимость доставки зависят от вашего региона и выбранного способа доставки.
              </p>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-medium text-gray-800 mb-2">По Бишкеку</h3>
                  <ul className="text-gray-600 space-y-1">
                    <li>• Курьерская доставка: 1-2 дня</li>
                    <li>• Стоимость: 200 сом</li>
                    <li>• При заказе от 5000 сом - бесплатно</li>
                  </ul>
                </div>
                
                <div>
                  <h3 className="text-lg font-medium text-gray-800 mb-2">По регионам</h3>
                  <ul className="text-gray-600 space-y-1">
                    <li>• Доставка: 3-7 дней</li>
                    <li>• Стоимость: от 300 сом</li>
                    <li>• При заказе от 10000 сом - бесплатно</li>
                  </ul>
                </div>
              </div>
            </div>
          </section>

          {/* Оплата */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Способы оплаты</h2>
            <div className="bg-gray-50 p-6 rounded-lg">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-medium text-gray-800 mb-2">Наличными</h3>
                  <p className="text-gray-600">
                    Оплата наличными при получении товара курьеру или в пункте выдачи.
                  </p>
                </div>
                
                <div>
                  <h3 className="text-lg font-medium text-gray-800 mb-2">Банковской картой</h3>
                  <p className="text-gray-600">
                    Оплата картой Visa, MasterCard или МИР через безопасный платежный шлюз.
                  </p>
                </div>
                
                <div>
                  <h3 className="text-lg font-medium text-gray-800 mb-2">Электронные кошельки</h3>
                  <p className="text-gray-600">
                    Оплата через Elcart, MegaPay и другие популярные электронные кошельки.
                  </p>
                </div>
                
                <div>
                  <h3 className="text-lg font-medium text-gray-800 mb-2">Банковский перевод</h3>
                  <p className="text-gray-600">
                    Оплата через банковский перевод на наш расчетный счет.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Контакты */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Контакты для вопросов</h2>
            <div className="bg-blue-50 p-6 rounded-lg">
              <p className="text-gray-600 mb-4">
                Если у вас есть вопросы по доставке или оплате, обращайтесь к нашим специалистам:
              </p>
              <div className="space-y-2">
                <p className="text-gray-700">
                  <strong>Телефон:</strong> +996 709 891 054
                </p>
                <p className="text-gray-700">
                  <strong>Email:</strong> info@generalhub.kg
                </p>
                <p className="text-gray-700">
                  <strong>Время работы:</strong> Пн-Вс с 10:00 до 20:00
                </p>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
