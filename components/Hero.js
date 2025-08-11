import Image from "next/image";
import TestimonialsAvatars from "./TestimonialsAvatars";


const Hero = () => {
  return (
    <section className="max-w-7xl mx-auto bg-base-100 flex flex-col lg:flex-row items-center justify-center gap-16 lg:gap-20 px-8 py-8 lg:py-20">
      <div className="flex flex-col gap-10 lg:gap-14 items-center justify-center text-center lg:text-left lg:items-start">
        <div className="badge badge-primary badge-lg">
          🎉 Най-новата платформа за дигитални менюта в България!
        </div>

        <h1 className="font-extrabold text-4xl lg:text-6xl tracking-tight md:-mb-4">
          Създайте <span className="text-primary">дигитално меню</span> за ресторанта си за минути
        </h1>
        <p className="text-lg opacity-80 leading-relaxed">
          Модерна платформа за дигитални менюта с AI асистент, QR кодове, многоезична поддръжка и analytics. 
          Специално създадена за ресторанти в България.
        </p>
        <div className="flex flex-col sm:flex-row gap-4">
          <a href="/api/auth/signin" className="btn btn-primary btn-wide">
            Започнете безплатно
          </a>
          <a href="/about" className="btn btn-outline btn-wide">
            Научете повече
          </a>
        </div>

        <TestimonialsAvatars priority={true} />
      </div>
      <div className="lg:w-full">
        <Image
          src="/images/digitalno-menu.webp"
          alt="Ресторант с дигитално меню"
          className="w-full rounded-2xl shadow-2xl"
          priority={true}
          width={500}
          height={500}
        />
      </div>
    </section>
  );
};

export default Hero;
