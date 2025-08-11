import Image from "next/image";
import config from "@/config";

const CTA = () => {
  return (
    <section className="relative hero overflow-hidden min-h-screen">
      <Image
        src="/images/cta-baner.webp"
        alt="Ресторант с модерно дигитално меню"
        className="object-cover w-full"
        fill
      />
      <div className="relative hero-overlay bg-neutral bg-opacity-70"></div>
      <div className="relative hero-content text-center text-neutral-content p-8">
        <div className="flex flex-col items-center max-w-xl p-8 md:p-0">
          <h2 className="font-bold text-3xl md:text-5xl tracking-tight mb-8 md:mb-12">
            Готови ли сте за <span className="text-primary">дигиталното бъдеще?</span>
          </h2>
          <p className="text-lg opacity-80 mb-12 md:mb-16">
            Присъединете се към стотиците ресторанти в България, които вече използват 
            e-menu.bg за модерно и ефективно обслужване на клиентите си.
          </p>

          <div className="flex flex-col sm:flex-row gap-4">
            <a href="/api/auth/signin" className="btn btn-primary btn-wide">
              Започнете безплатно
            </a>
            <a href="/contact" className="btn btn-outline btn-wide text-white border-white hover:bg-white hover:text-neutral">
              Контакти
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTA;
