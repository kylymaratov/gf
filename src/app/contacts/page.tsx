import { Mail, Phone, MapPin } from "lucide-react";

export default function ContactsPage() {
  return (
    <div className="container mx-auto py-16 px-4">
      <div className="mx-auto max-w-3xl">
        <h1 className="mb-8 text-4xl font-bold">Контакты</h1>

        <div className="grid gap-8 md:grid-cols-2">
          <div className="space-y-6">
            <div className="flex gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                <Phone className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold">Телефон</h3>
                <p className="text-muted-foreground">+7 (800) 123-45-67</p>
                <p className="text-sm text-muted-foreground">
                  Ежедневно с 9:00 до 21:00
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                <Mail className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold">Email</h3>
                <p className="text-muted-foreground">info@generalhub.com</p>
                <p className="text-sm text-muted-foreground">
                  Ответим в течение 24 часов
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                <MapPin className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold">Адрес</h3>
                <p className="text-muted-foreground">
                  г. Москва, ул. Примерная, д. 1
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-lg border p-6">
            <h2 className="mb-4 text-xl font-bold">Напишите нам</h2>
            <p className="text-muted-foreground">
              Форма обратной связи будет доступна после подключения API.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

