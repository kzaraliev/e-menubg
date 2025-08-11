import { Suspense } from "react";
import { getSEOTags } from "@/libs/seo";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ContactForm from "./ContactForm";
import config from "@/config";

export const metadata = getSEOTags({
  title: `Контакти | ${config.appName}`,
  description: "Свържете се с екипа на e-menu.bg. Поддръжка 24/7, бърз отговор и професионална помощ за вашия ресторант.",
  canonicalUrlRelative: "/contact",
});

export default function Contact() {
  return (
    <>
      <Suspense>
        <Header />
      </Suspense>
      <main className="min-h-screen">
        {/* Hero Section */}
        <section className="bg-base-200 py-16 lg:py-24">
          <div className="max-w-7xl mx-auto px-8">
            <div className="max-w-3xl mx-auto text-center">
              <h1 className="text-4xl lg:text-6xl font-bold mb-6">
                <span className="text-primary">Свържете се</span> с нас
              </h1>
              <p className="text-lg lg:text-xl opacity-80 leading-relaxed">
                Тук сме, за да ви помогнем! Нашият екип е винаги готов да отговори на въпросите ви 
                и да ви помогне да създадете най-доброто дигитално меню за ресторанта ви.
              </p>
            </div>
          </div>
        </section>

        {/* Contact Methods */}
        <section className="py-16 lg:py-24">
          <div className="max-w-7xl mx-auto px-8">
            <div className="grid lg:grid-cols-2 gap-8 mb-16">
              {/* Email Support */}
              <div className="bg-base-100 rounded-2xl p-8 shadow-lg text-center">
                <div className="text-4xl mb-4">📧</div>
                <h3 className="text-xl font-bold mb-4">Имейл поддръжка</h3>
                <p className="opacity-80 mb-6">
                  За всякакви въпроси, технически проблеми или предложения
                </p>
                <a 
                  href={`mailto:${config.resend.supportEmail}`}
                  className="btn btn-primary btn-wide"
                >
                  {config.resend.supportEmail}
                </a>
              </div>

              {/* Phone Support */}
              <div className="bg-base-100 rounded-2xl p-8 shadow-lg text-center">
                <div className="text-4xl mb-4">📞</div>
                <h3 className="text-xl font-bold mb-4">Телефон</h3>
                <p className="opacity-80 mb-6">
                  За спешни въпроси и персонализирана консултация
                </p>
                <a 
                  href="tel:+359888123456"
                  className="btn btn-primary btn-wide"
                >
                  +359 888 123 456
                </a>
              </div>
            </div>

            {/* Response Times */}
            <div className="bg-base-200 rounded-2xl p-8">
              <h3 className="text-2xl font-bold text-center mb-8">Времена за отговор</h3>
              <div className="grid md:grid-cols-2 gap-8 text-center">
                <div>
                  <div className="text-3xl font-bold text-primary mb-2">&lt; 4 часа</div>
                  <div className="text-sm opacity-70">Имейл поддръжка</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-primary mb-2">24/7</div>
                  <div className="text-sm opacity-70">Спешна поддръжка</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Contact Form */}
        <section className="bg-base-200 py-16 lg:py-24">
          <div className="max-w-4xl mx-auto px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl lg:text-4xl font-bold mb-6">
                Изпратете ни <span className="text-primary">съобщение</span>
              </h2>
              <p className="text-lg opacity-80">
                Попълнете формата по-долу и ще се свържем с вас до 2 часа в работно време
              </p>
            </div>

            <div className="bg-base-100 rounded-2xl p-8 shadow-lg">
              <ContactForm />
            </div>
          </div>
        </section>

        {/* FAQ Quick Links */}
        <section className="py-16 lg:py-24">
          <div className="max-w-7xl mx-auto px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl lg:text-4xl font-bold mb-6">
                Често задавани <span className="text-primary">въпроси</span>
              </h2>
              <p className="text-lg opacity-80">
                Може би отговорът на вашия въпрос е тук
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="bg-base-100 rounded-xl p-6 shadow">
                <h3 className="font-bold mb-3">🚀 Как да започна?</h3>
                <p className="text-sm opacity-80 mb-4">
                  Регистрирайте се, създайте профил на ресторанта и започнете да добавяте продукти в менюто си.
                </p>
                <a href="/#faq" className="link link-primary text-sm">Научете повече →</a>
              </div>

              <div className="bg-base-100 rounded-xl p-6 shadow">
                <h3 className="font-bold mb-3">💰 Колко струва?</h3>
                <p className="text-sm opacity-80 mb-4">
                  Имаме два плана - Starter за 5.99 лв/месец и Advanced за 59.99 лв/година.
                </p>
                <a href="/#pricing" className="link link-primary text-sm">Вижте цените →</a>
              </div>

              <div className="bg-base-100 rounded-xl p-6 shadow">
                <h3 className="font-bold mb-3">📱 Как работят QR кодовете?</h3>
                <p className="text-sm opacity-80 mb-4">
                  Генерираме уникални QR кодове за всяка маса, които водят директно до менюто ви.
                </p>
                <a href="/about" className="link link-primary text-sm">Научете повече →</a>
              </div>

              <div className="bg-base-100 rounded-xl p-6 shadow">
                <h3 className="font-bold mb-3">🌍 Поддържате ли други езици?</h3>
                <p className="text-sm opacity-80 mb-4">
                  Да! Поддържаме български, английски, немски и руски език.
                </p>
                <a href="/about" className="link link-primary text-sm">Вижте функциите →</a>
              </div>

              <div className="bg-base-100 rounded-xl p-6 shadow">
                <h3 className="font-bold mb-3">🤖 Как работи AI асистентът?</h3>
                <p className="text-sm opacity-80 mb-4">
                  AI асистентът отговаря на въпросите на клиентите за менюто на всички поддържани езици.
                </p>
                <a href="/about" className="link link-primary text-sm">Научете повече →</a>
              </div>

              <div className="bg-base-100 rounded-xl p-6 shadow">
                <h3 className="font-bold mb-3">📊 Предлагате ли analytics?</h3>
                <p className="text-sm opacity-80 mb-4">
                  Да! Виждате кои ястия се разглеждат най-често и можете да оптимизирате менюто си.
                </p>
                <a href="/about" className="link link-primary text-sm">Вижте функциите →</a>
              </div>
            </div>
          </div>
        </section>

        {/* Business Hours */}
        <section className="bg-base-200 py-16 lg:py-24">
          <div className="max-w-4xl mx-auto px-8 text-center">
            <h2 className="text-3xl lg:text-4xl font-bold mb-6">
              Работно <span className="text-primary">време</span>
            </h2>
            <p className="text-lg opacity-80 mb-8">
              Нашият екип за поддръжка е на разположение
            </p>
            <div className="bg-base-100 rounded-2xl p-8 shadow-lg">
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-xl font-bold mb-4">Работни дни</h3>
                  <div className="space-y-2 text-left">
                    <div className="flex justify-between">
                      <span>Понеделник - Петък</span>
                      <span className="opacity-80">9:00 - 18:00</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Събота</span>
                      <span className="opacity-80">Почивен ден</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Неделя</span>
                      <span className="opacity-80">Почивен ден</span>
                    </div>
                  </div>
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-4">Спешна поддръжка</h3>
                  <p className="opacity-80 text-left">
                    За спешни технически проблеми сме на разположение 24/7 чрез 
                    имейл поддръжката. Отговаряме в рамките на 1 час.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
