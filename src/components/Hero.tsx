import React from "react";
import mangemoibanner from "../assets/mangemoibanner.jpeg"; // ✅ import de la nouvelle bannière

export default function Hero() {
  return (
    <section
      id="hero"
      className="relative w-full min-h-[70vh] flex flex-col items-center justify-center px-4 font-sans overflow-hidden"
    >
      {/* Background */}
      <div className="absolute inset-0 z-0">
        {/* Overlay sombre (ajuste /80 si trop sombre) */}
        <div className="absolute inset-0 bg-black/60 z-10" />

        <img
          alt=""
          aria-hidden="true"
          decoding="async"
          src={mangemoibanner}
          className="object-cover absolute inset-0 w-full h-full"
        />
      </div>

      {/* Content */}
      <div className="relative z-20 text-center max-w-3xl mx-auto space-y-6 pt-24 pb-8 px-4 sm:px-6">
        {/* Location badge */}
        <a
  href="https://www.google.com/maps/search/?api=1&query=MANGE+MOI+30+Av.+de+la+République+06300+Nice+France"
  target="_blank"
  rel="noopener noreferrer"
  className="inline-flex items-center gap-2 py-1 px-4 rounded-full
             bg-[#E45835]/10 border border-[#E45835]/30
             text-[#E45835] font-semibold text-sm mb-4
             backdrop-blur-sm
             hover:bg-[#E45835]/20
             transition-all duration-300"
>
  <span aria-hidden="true">📍</span>
  MANGE MOI – 30 Av. de la République, 06300 Nice
</a>

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
            Des saveurs qui 

          </span>
          <span
            aria-hidden="true"
            className="block text-red-600 font-extrabold mt-2 uppercase tracking-wide font-zamenhof-inverse"
            style={{ textShadow: "#e45835 0px 0px 30px" }}
          >
            font notre renommée
          </span>
        </h1>

        {/* Description */}
        <p
          className="text-white/60 text-base sm:text-lg md:text-xl leading-relaxed px-0 sm:px-4 mx-auto"
        >
          Des recettes signature préparées avec passion et des produits d’exception.
        </p>

        {/* CTA */}
        <div className="pt-4">
          <a
            href="#nav-categories-heading"
            className="inline-flex items-center justify-center gap-2 font-bold text-white text-base sm:text-lg
              px-8 py-4 rounded-full
              bg-gradient-to-r from-[#E45835] to-[#cc4729]
              hover:from-[#d94d2f] hover:to-[#b63f24]
              shadow-[0_0_20px_rgba(228,88,53,0.5)]
              hover:shadow-[0_0_30px_rgba(228,88,53,0.8)]
              transition-all duration-300
              whitespace-nowrap
              focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E45835]"
          >
            COMMANDER MAINTENANT
          </a>
        </div>
      </div>
    </section>
  );
}