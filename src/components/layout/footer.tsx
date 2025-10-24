import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-gray-700 bg-gray-800 text-white">
      <div className="container mx-auto py-12 md:py-16 px-4">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {/* О компании */}
          <div>
            <h3 className="mb-4 text-lg font-semibold">GeneralHub</h3>
            <p className="text-sm text-gray-300">
              Ваш надежный интернет-магазин с широким ассортиментом качественных товаров.
            </p>
          </div>

          {/* Покупателям */}
          <div>
            <h3 className="mb-4 text-lg font-semibold">Покупателям</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/delivery" className="text-gray-300 hover:text-white transition-colors">
                  Доставка и оплата
                </Link>
              </li>
              <li>
                <Link href="/returns" className="text-gray-300 hover:text-white transition-colors">
                  Возврат товара
                </Link>
              </li>
              <li>
                <Link href="/warranty" className="text-gray-300 hover:text-white transition-colors">
                  Гарантия
                </Link>
              </li>
              <li>
                <Link href="/faq" className="text-gray-300 hover:text-white transition-colors">
                  Частые вопросы
                </Link>
              </li>
            </ul>
          </div>

          {/* Компания */}
          <div>
            <h3 className="mb-4 text-lg font-semibold">Компания</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/about" className="text-gray-300 hover:text-white transition-colors">
                  О нас
                </Link>
              </li>
              <li>
                <Link href="/contacts" className="text-gray-300 hover:text-white transition-colors">
                  Контакты
                </Link>
              </li>
              <li>
                <Link href="/news" className="text-gray-300 hover:text-white transition-colors">
                  Новости
                </Link>
              </li>
              <li>
                <Link href="/careers" className="text-gray-300 hover:text-white transition-colors">
                  Вакансии
                </Link>
              </li>
            </ul>
          </div>

          {/* Контакты */}
          <div>
            <h3 className="mb-4 text-lg font-semibold">Контакты</h3>
            <ul className="space-y-2 text-sm text-gray-300">
              <li>Email: info@generalhub.com</li>
              <li>Телефон: +7 (800) 123-45-67</li>
              <li>Адрес: г. Москва, ул. Примерная, д. 1</li>
            </ul>
          </div>
        </div>

        <div className="mt-12 border-t border-gray-700 pt-8 text-center text-sm text-gray-300">
          <p>&copy; {new Date().getFullYear()} GeneralHub. Все права защищены.</p>
        </div>
      </div>
    </footer>
  );
}

