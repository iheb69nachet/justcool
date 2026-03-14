import React from "react";

export default function Hero() {
  return (
    <section
      id="hero"
      className="relative w-full min-h-[70vh] flex flex-col items-center justify-center px-4 font-sans overflow-hidden"
    >
      {/* Background */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-black/80 z-10" />
        <img
          alt=""
          aria-hidden="true"
          decoding="async"
          src="https://justcool.fr/assets/images/hero-bg-facade.webp"
          className="object-cover absolute inset-0 w-full h-full"
        />
      </div>

      {/* Content */}
      <div className="relative z-20 text-center max-w-3xl mx-auto space-y-6 pt-24 pb-8 px-4 sm:px-6">
        {/* Location badge */}
        <span
  className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#cc2222]/10 border border-[#cc2222]/20 text-[#cc2222] text-sm font-semibold"
  style={{ fontFamily: "framer-sans, sans-serif" }}
>
  <span aria-hidden="true" className="text-xs">📍</span>
  2 Bd Riquier, Nice
</span>

        {/* Heading */}
        <h1
  id="hero-title"
  className='font-bold text-white text-4xl md:text-[60px] leading-[65px] text-center'
  style={{ fontFamily: '"framer-sans", sans-serif' }}
>
  <span
  aria-hidden="true"
  className="
  block text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-300 uppercase tracking-wide
  max-sm:whitespace-nowrap
  max-sm:text-[37px]
  max-sm:mt-1
"
>
  LE SPÉCIALISTE DU
</span>

 {/* Ligne 2 */}
<span
  aria-hidden="true"
  className="block mt-2 max-sm:mt-1 uppercase tracking-wider text-transparent max-sm:whitespace-nowrap max-sm:text-[30px]"
  style={{
    fontFamily: "Zamenhof Inverse, sans-serif",
    WebkitTextStroke: "0.1px #CC2222",
    textShadow: "0 0 30px rgba(220,38,38,0.4)"
  }}
>
  NAAN CHEESE &amp; TACOS
</span>
</h1>

        {/* Description */}
        <p
  className="text-white/60 text-base sm:text-lg md:text-xl leading-relaxed max-w-3xl mx-auto"
  style={{ fontFamily: "framer-sans, sans-serif" }}
>
  Envie d'un fast-food qui a du goût ? Découvrez nos{" "}
  <span className="text-white font-bold">Naan Burgers faits maison</span>, cuits minute au{" "}
  <span className="text-white font-bold">Tandoor traditionnel</span>. Situé au cœur de Nice
  Riquier, <span className="text-white font-bold">Just Cool</span> réinvente le snack Halal avec
  des produits frais, généreux et certifiés.
</p>

        {/* CTA */}
        <div className="pt-4">
          <a
  href="#menu"
  className="
    inline-flex items-center justify-center
    mt-8
    px-10 py-4
    rounded-full
    bg-[#CC2222]
    text-white
    text-sm
    font-bold
    uppercase
    tracking-wide
    transition
    hover:bg-red-700
    shadow-[0_0_35px_rgba(204,34,34,0.55)]
  "
  style={{ fontFamily: "framer-sans, sans-serif" }}
>
  <a href="/#nav-categories" className="...">
  COMMANDER MAINTENANT
</a>
</a>
        </div>
      </div>
    </section>
  );
}