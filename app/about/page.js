import { getSEOTags } from "@/libs/seo";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import config from "@/config";

export const metadata = getSEOTags({
  title: `За нас | ${config.appName}`,
  description: "Научете повече за e-menu.bg - най-модерната платформа за дигитални менюта в България. Революционизираме начина, по който ресторантите представят своите менюта.",
  canonicalUrlRelative: "/about",
});

export default function About() {
  return (
    <>
      <Header />
      <main className="min-h-screen">
        {/* Hero Section */}
        <section className="bg-base-200 py-16 lg:py-24">
          <div className="max-w-7xl mx-auto px-8">
            <div className="max-w-3xl mx-auto text-center">
              <h1 className="text-4xl lg:text-6xl font-bold mb-6">
                За <span className="text-primary">e-menu.bg</span>
              </h1>
              <p className="text-lg lg:text-xl opacity-80 leading-relaxed">
                Ние сме иновативната платформа, която революционизира начина, по който ресторантите в България представят своите менюта. 
                Създадена специално за българския пазар с фокус върху качеството и простотата.
              </p>
            </div>
          </div>
        </section>

        {/* Mission Section */}
        <section className="py-16 lg:py-24">
          <div className="max-w-7xl mx-auto px-8">
            <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
              <div>
                <h2 className="text-3xl lg:text-4xl font-bold mb-6">
                  Нашата <span className="text-primary">мисия</span>
                </h2>
                <p className="text-lg opacity-80 leading-relaxed mb-6">
                  Да направим дигиталните менюта достъпни за всеки ресторант в България, независимо от размера му. 
                  Вярваме, че всеки ресторант заслужава модерно, красиво и функционално дигитално меню.
                </p>
                <p className="text-lg opacity-80 leading-relaxed">
                  С фокус върху българския пазар, ние разбираме нуждите на местните ресторанти и предлагаме решения, 
                  които са практични, ефективни и лесни за използване.
                </p>
              </div>
              <div className="bg-base-200 rounded-2xl p-8">
                <div className="grid grid-cols-2 gap-6">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-primary mb-2">500+</div>
                    <div className="text-sm opacity-70">Създадени менюта</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-primary mb-2">4</div>
                    <div className="text-sm opacity-70">Поддържани езика</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-primary mb-2">99.9%</div>
                    <div className="text-sm opacity-70">Време без прекъсване</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-primary mb-2">24/7</div>
                    <div className="text-sm opacity-70">Поддръжка</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="bg-base-200 py-16 lg:py-24">
          <div className="max-w-7xl mx-auto px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl lg:text-4xl font-bold mb-6">
                Защо <span className="text-primary">E-Menu Bulgaria?</span>
              </h2>
              <p className="text-lg opacity-80 max-w-3xl mx-auto">
                Комбинираме най-новите технологии с дълбоко разбиране на българския ресторантьорски бизнес
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {/* AI Assistant */}
              <div className="bg-base-100 rounded-2xl p-8 shadow-lg">
                <div className="text-4xl mb-4">🤖</div>
                <h3 className="text-xl font-bold mb-4">AI Асистент</h3>
                <p className="opacity-80">
                  Интелигентен помощник, който отговаря на въпросите на клиентите за менюто на български, английски, немски и руски език.
                </p>
              </div>

              {/* QR Codes */}
              <div className="bg-base-100 rounded-2xl p-8 shadow-lg">
                <div className="text-4xl mb-4">📱</div>
                <h3 className="text-xl font-bold mb-4">QR Кодове</h3>
                <p className="opacity-80">
                  Автоматично генериране на QR кодове за всяка маса, които водят директно до менюто на ресторанта.
                </p>
              </div>

              {/* Multi-language */}
              <div className="bg-base-100 rounded-2xl p-8 shadow-lg">
                <div className="text-4xl mb-4">🌍</div>
                <h3 className="text-xl font-bold mb-4">Многоезична поддръжка</h3>
                <p className="opacity-80">
                  Менютата се показват на български, английски, немски и руски език - идеално за туристически райони.
                </p>
              </div>

              {/* Real-time updates */}
              <div className="bg-base-100 rounded-2xl p-8 shadow-lg">
                <div className="text-4xl mb-4">⚡</div>
                <h3 className="text-xl font-bold mb-4">Мигновени актуализации</h3>
                <p className="opacity-80">
                  Променете цените, добавете нови ястия или скрийте недостъпни продукти с един клик - промените са мигновени.
                </p>
              </div>

              {/* Analytics */}
              <div className="bg-base-100 rounded-2xl p-8 shadow-lg">
                <div className="text-4xl mb-4">💱</div>
                <h3 className="text-xl font-bold mb-4">BGN и EUR</h3>
                <p className="opacity-80">
                  Автоматично показване на цени в лева и евро с актуален курс - готови сме за еврозоната.
                </p>
              </div>

              {/* SEO Optimized */}
              <div className="bg-base-100 rounded-2xl p-8 shadow-lg">
                <div className="text-4xl mb-4">🔍</div>
                <h3 className="text-xl font-bold mb-4">SEO Оптимизирано</h3>
                <p className="opacity-80">
                  Менютата ви се показват в Google търсенията, привличайки повече клиенти към ресторанта ви.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Technology Section */}
        <section className="py-16 lg:py-24">
          <div className="max-w-7xl mx-auto px-8">
            <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
              <div>
                <h2 className="text-3xl lg:text-4xl font-bold mb-6">
                  Модерни <span className="text-primary">технологии</span>
                </h2>
                <p className="text-lg opacity-80 leading-relaxed mb-6">
                  Използваме най-новите уеб технологии за да осигурим бързо, сигурно и надеждно решение:
                </p>
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-primary rounded-full"></div>
                    <span><strong>Next.js 14</strong> - Най-бързата React framework</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-primary rounded-full"></div>
                    <span><strong>MongoDB</strong> - Мащабируема база данни</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-primary rounded-full"></div>
                    <span><strong>AWS S3</strong> - Надеждно съхранение на изображения</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-primary rounded-full"></div>
                    <span><strong>OpenAI GPT</strong> - AI асистент за клиенти</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-primary rounded-full"></div>
                    <span><strong>Stripe</strong> - Сигурни плащания</span>
                  </div>
                </div>
              </div>
              <div className="bg-gradient-to-br from-primary/10 to-secondary/10 rounded-2xl p-8">
                                  <div className="text-center">
                    <div className="text-6xl mb-4">🚀</div>
                    <h3 className="text-2xl font-bold mb-4">Бъдещето е тук</h3>
                    <p className="opacity-80">
                      Присъединете се към стотиците ресторанти, които вече използват e-menu.bg 
                      за да предложат на клиентите си най-доброто дигитално изживяване.
                    </p>
                  </div>
              </div>
            </div>
          </div>
        </section>

        {/* Bulgarian Focus Section */}
        <section className="bg-base-200 py-16 lg:py-24">
          <div className="max-w-7xl mx-auto px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl lg:text-4xl font-bold mb-6">
                Създадено за <span className="text-primary">България</span>
              </h2>
              <p className="text-lg opacity-80 max-w-3xl mx-auto mb-12">
                Разбираме специфичните нужди на българските ресторанти и туристическия бизнес
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="text-4xl mb-4">🇧🇬</div>
                <h3 className="text-xl font-bold mb-4">Български фокус</h3>
                <p className="opacity-80">
                  Платформата е създадена специално за българския пазар с разбиране на местните нужди и особености.
                </p>
              </div>

              <div className="text-center">
                <div className="text-4xl mb-4">💱</div>
                <h3 className="text-xl font-bold mb-4">BGN и EUR</h3>
                <p className="opacity-80">
                  Автоматично показване на цени в лева и евро с актуален курс - готови сме за еврозоната.
                </p>
              </div>

              <div className="text-center">
                <div className="text-4xl mb-4">🏖️</div>
                <h3 className="text-xl font-bold mb-4">Туристически райони</h3>
                <p className="opacity-80">
                  Многоезичната поддръжка прави платформата идеална за курортни и туристически ресторанти.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 lg:py-24">
          <div className="max-w-4xl mx-auto px-8 text-center">
            <h2 className="text-3xl lg:text-4xl font-bold mb-6">
              Готови ли сте да <span className="text-primary">започнете?</span>
            </h2>
            <p className="text-lg opacity-80 mb-8">
              Присъединете се към стотиците ресторанти, които вече използват e-menu.bg
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a href="/api/auth/signin" className="btn btn-primary btn-lg">
                Започнете безплатно
              </a>
              <a href="/contact" className="btn btn-outline btn-lg">
                Свържете се с нас
              </a>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
