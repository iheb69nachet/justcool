import React, { useRef, useState, useCallback } from "react";
import { NeonText } from "./NeonText";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface Product {
  id: string | number;
  name: string;
  mainIngredient: string;
  extras?: string;
  price: number;
  menuUpcharge?: number;
  studentDiscount?: number;
  imageSrc: string;
  isNew?: boolean;
}

export interface CategorySectionProps {
  /** Matches the id used in CategoryNav (e.g. "naans") */
  categoryId: string;
  /** Display label shown next to "Just" in the heading */
  categoryLabel: string;
  products: Product[];
  scrollMt?: string;
  onProductClick?: (product: Product) => void;
}

// ─── Icons ────────────────────────────────────────────────────────────────────

const ArrowLeft = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="m12 19-7-7 7-7" />
    <path d="M19 12H5" />
  </svg>
);

const ArrowRight = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="M5 12h14" />
    <path d="m12 5 7 7-7 7" />
  </svg>
);

// ─── ProductCard ──────────────────────────────────────────────────────────────

function ProductCard({
  product,
  onClick,
}: {
  product: Product;
  onClick?: (p: Product) => void;
}) {
  const {
    name,
    mainIngredient,
    extras,
    price,
    menuUpcharge = 2,
    studentDiscount = 1,
    imageSrc,
    isNew,
  } = product;

  return (
    <article
      role="button"
      tabIndex={0}
      aria-label={`${name}. ${mainIngredient}. ${price.toFixed(2)}€. Personnaliser.`}
      aria-haspopup="dialog"
      className="product-card flex flex-col rounded-xl border border-white/10 bg-black text-white
        transition-all duration-300 ease-out
        hover:border-red-600 hover:shadow-[0_0_30px_rgba(204,30,39,0.4)] hover:scale-[1.02] hover:z-10
        focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-600
        w-[11rem] h-[26rem] flex-shrink-0 overflow-hidden relative cursor-pointer"
      onClick={() => onClick?.(product)}
      onKeyDown={(e) => e.key === "Enter" && onClick?.(product)}
    >
      {/* Image */}
      <div
        className="relative w-full aspect-[4/3] shrink-0 overflow-hidden rounded-t-xl bg-gray-900"
        aria-hidden="true"
      >
        <img
          alt=""
          loading="lazy"
          src={"https://resto.devsolve-agency.com:8443/"+imageSrc}
          className="absolute inset-0 w-full h-full object-contain transition-transform duration-500 group-hover:scale-105"
          style={{
            background:
              "radial-gradient(circle farthest-side, #555 -80px, #1a1a1a)",
          }}
        />
        {isNew && (
          <div className="absolute top-3 right-3">
            <span
              className="inline-flex items-center justify-center rounded-sm px-2 py-0.5 text-xs
              font-bold uppercase tracking-wider bg-red-600 text-white shadow-lg shadow-red-600/20"
            >
              NEW
            </span>
          </div>
        )}
      </div>

      {/* Body */}
      <div className="flex flex-col flex-grow px-4 pt-4 pb-6 w-full text-left">
        {/* Name */}
        <div className="h-14 mb-1">
          <h3 className="font-bold text-white text-xl line-clamp-2">{name}</h3>
        </div>

        {/* Ingredients */}
        <div className="h-[3.75rem] mb-2 text-sm line-clamp-3">
          <p className="text-white/60 font-bold text-sm">{mainIngredient}</p>
          {extras && <p className="text-white/40 text-xs">{extras}</p>}
        </div>

        {/* Pricing + CTA */}
        <div className="mt-auto" aria-hidden="true">
          <div className="font-black text-red-600 text-3xl mb-2">
            {price.toFixed(2)}€
          </div>
          <p className="text-white/40 text-xs whitespace-nowrap overflow-hidden mb-0.5">
            <span className="font-bold">+{menuUpcharge}€</span> en menu{" "}
            <span>(frites + boisson)</span>
          </p>
          <p className="text-white/40 text-xs whitespace-nowrap mb-2">
            <span className="font-bold">-{studentDiscount}€</span> pour
            étudiants
          </p>
          <span
            className="inline-flex items-center justify-center w-full
            h-9 rounded-full px-4 text-sm font-bold uppercase tracking-wider text-white
            bg-gradient-to-r from-red-600 to-red-700
            hover:from-red-500 hover:to-red-600
            hover:shadow-[0_0_30px_rgba(204,30,39,0.8)]
            shadow-lg transition-all duration-300"
          >
            Personnaliser
          </span>
        </div>
      </div>
    </article>
  );
}

// ─── CategorySection ──────────────────────────────────────────────────────────

export default function CategorySection({
  categoryId,
  categoryLabel,
  products,
  scrollMt = "7.5rem",
  onProductClick,
}: CategorySectionProps) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const SCROLL_AMOUNT = 200;

  const updateArrows = useCallback(() => {
    const el = trackRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 4);
    setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 4);
  }, []);

  const scroll = (dir: "left" | "right") => {
    trackRef.current?.scrollBy({
      left: dir === "left" ? -SCROLL_AMOUNT : SCROLL_AMOUNT,
      behavior: "smooth",
    });
  };

  return (
    <>
      <style>{`
        .no-scrollbar { scrollbar-width: none; -ms-overflow-style: none; }
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .carousel-arrow {
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
          z-index: 10;
          width: 2rem;
          height: 2rem;
          border-radius: 9999px;
          border: none;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #dc2626;
          color: #fff;
          box-shadow: 0 0 15px rgba(204,30,39,0.4);
          transition: opacity 0.2s, background 0.2s;
        }
        .carousel-arrow:hover { background: #b91c1c; }
        .carousel-arrow:disabled { opacity: 0; pointer-events: none; }
      `}</style>

      <section
        className="relative bg-black flex flex-col gap-4 py-4 z-30"
        data-category={categoryId}
        style={
          {
            contentVisibility: "auto",
            containIntrinsicSize: "350px",
          } as React.CSSProperties
        }
      >
        {/* Section heading */}
        <h2
          id={categoryId}
          tabIndex={-1}
          aria-label={`Just ${categoryLabel}`}
          className="text-3xl font-bold flex items-center gap-2 px-4 outline-none focus:outline-none"
          style={{ scrollMarginTop: scrollMt }}
        >
          <span
            aria-hidden="true"
            className="uppercase text-[2.25rem] font-bold tracking-wider text-white font-zamenhof-inverse"
            style={{ textShadow: "rgb(255 255 255) 0px 0px 20px" }}
          >
            Just
          </span>
          <NeonText text={categoryLabel} />
          <span className="sr-only">{categoryLabel}</span>
        </h2>

        {/* Carousel */}
        <div
          className="relative w-full"
          role="region"
          aria-roledescription="carousel"
          aria-label={`Produits ${categoryLabel}`}
        >
          {/* Track */}
          <div
            ref={trackRef}
            className="no-scrollbar overflow-x-auto scroll-smooth"
            onScroll={updateArrows}
          >
            <div className="flex py-2 gap-2 px-4 w-max">
              {products.map((product, i) => (
                <div
                  key={product.id}
                  role="group"
                  aria-roledescription="slide"
                  aria-label={`${i + 1} sur ${products.length}`}
                >
                  <ProductCard product={product} onClick={onProductClick} />
                </div>
              ))}
            </div>
          </div>

          {/* Prev arrow */}
          <button
            className="carousel-arrow"
            style={{ left: "0.5rem" }}
            onClick={() => scroll("left")}
            disabled={!canScrollLeft}
            aria-label="Produit précédent"
            tabIndex={-1}
          >
            <ArrowLeft />
          </button>

          {/* Next arrow */}
          <button
            className="carousel-arrow"
            style={{ right: "0.5rem" }}
            onClick={() => scroll("right")}
            disabled={!canScrollRight}
            aria-label="Produit suivant"
            tabIndex={-1}
          >
            <ArrowRight />
          </button>
        </div>
      </section>
    </>
  );
}
