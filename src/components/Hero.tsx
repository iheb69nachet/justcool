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
        <span className="inline-block py-1 px-3 rounded-full bg-red-600/10 border border-red-600/20 text-red-500 font-medium text-sm mb-4 backdrop-blur-sm">
          <span aria-hidden="true">📍</span> 2 Bd Riquier, Nice
        </span>

        {/* Heading */}
        <h1
          id="hero-title"
          tabIndex={-1}
          aria-label="Le spécialiste du Naan Cheese et Tacos"
          className="font-bold text-white text-4xl sm:text-5xl md:text-6xl leading-tight drop-shadow-lg outline-none"
        >
          <span
            aria-hidden="true"
            className="block text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-300 uppercase"
          >
            Le spécialiste du
          </span>
          <span
            aria-hidden="true"
            className="block text-red-600 font-extrabold mt-2 uppercase tracking-wide"
            style={{ textShadow: "rgba(220, 38, 38, 0.4) 0px 0px 30px" }}
          >
            NAAN CHEESE &amp; TACOS
          </span>
        </h1>

        {/* Description */}
        <p
          aria-label="Envie d'un fast-food qui a du goût ? Découvrez nos Naan Burgers faits maison, cuits minute au Tandoor traditionnel. Situé au cœur de Nice Riquier, Just Cool réinvente le snack Halal avec des produits frais, généreux et certifiés."
          className="text-white/60 text-base sm:text-lg md:text-xl leading-relaxed px-0 sm:px-4 mx-auto"
        >
          <span aria-hidden="true">
            Envie d&apos;un fast-food qui a du goût ? Découvrez nos{" "}
            <strong className="text-white">Naan Burgers faits maison</strong>, cuits
            minute au <strong className="text-white">Tandoor traditionnel</strong>.
            Situé au cœur de Nice Riquier,{" "}
            <span className="font-bold text-white">Just Cool</span> réinvente le snack
            Halal avec des produits frais, généreux et certifiés.
          </span>
        </p>

        {/* CTA */}
        <div className="pt-4">
          <a
            href="#nav-categories-heading"
            className="inline-flex items-center justify-center gap-2 font-bold text-white text-base sm:text-lg
              px-8 py-4 rounded-full
              bg-gradient-to-r from-red-600 to-red-700
              hover:from-red-500 hover:to-red-600
              shadow-[0_0_20px_rgba(204,30,39,0.5)]
              hover:shadow-[0_0_30px_rgba(204,30,39,0.8)]
              transition-all duration-300
              whitespace-nowrap
              focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500"
          >
            COMMANDER MAINTENANT
          </a>
        </div>
      </div>
    </section>
  );
}