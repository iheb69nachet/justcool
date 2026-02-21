import React, { useState, useEffect, useRef, useCallback } from "react";
import type { Product } from "./CategorySection";

// ─── Types ────────────────────────────────────────────────────────────────────

interface Sauce {
  id: string;
  label: string;
  imageSrc: string;
  isSpicy?: boolean;
}

interface Supplement {
  id: string;
  label: string;
  price: number;
  imageSrc: string;
}

interface ProductModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
  onAddToCart: (product: Product, quantity: number, options: OrderOptions) => void;
}

interface OrderOptions {
  crudites: string[];
  bread: string;
  sauces: string[];
  menuFormule: boolean;
  isStudent: boolean;
  supplements: string[];
}

// ─── Static data ──────────────────────────────────────────────────────────────

const CRUDITES = ["Salade", "Tomate", "Oignon"];

const BREADS = ["Pain Naan", "Pain Galette", "Pain Turc"];

const SAUCES: Sauce[] = [
  { id: "blanche",    label: "Blanche",    imageSrc: "https://justcool.fr/assets/images/products/sauces/sauce-blanche.webp" },
  { id: "mayo",       label: "Mayonnaise", imageSrc: "https://justcool.fr/assets/images/products/sauces/sauce-mayonnaise.webp" },
  { id: "biggy",      label: "Biggy",      imageSrc: "https://justcool.fr/assets/images/products/sauces/sauce-biggy.webp" },
  { id: "andalouse",  label: "Andalouse",  imageSrc: "https://justcool.fr/assets/images/products/sauces/sauce-andalouse.webp" },
  { id: "ketchup",    label: "Ketchup",    imageSrc: "https://justcool.fr/assets/images/products/sauces/sauce-ketchup.webp" },
  { id: "curry",      label: "Curry",      imageSrc: "https://justcool.fr/assets/images/products/sauces/sauce-curry.webp" },
  { id: "bbq",        label: "Barbecue",   imageSrc: "https://justcool.fr/assets/images/products/sauces/sauce-barbecue.webp" },
  { id: "samourai",   label: "Samouraï",   imageSrc: "https://justcool.fr/assets/images/products/sauces/sauce-samourai.webp",  isSpicy: true },
  { id: "algerienne", label: "Algérienne", imageSrc: "https://justcool.fr/assets/images/products/sauces/sauce-algerienne.webp", isSpicy: true },
  { id: "harissa",    label: "Harissa",    imageSrc: "https://justcool.fr/assets/images/products/sauces/sauce-harissa.webp",    isSpicy: true },
];

const SUPPLEMENTS: Supplement[] = [
  { id: "bacon",        label: "Bacon",           price: 1.50, imageSrc: "https://justcool.fr/assets/images/products/supplements/supplement-bacon.webp" },
  { id: "lardons",      label: "Lardons",         price: 1.50, imageSrc: "https://justcool.fr/assets/images/products/supplements/supplement-lardons.webp" },
  { id: "chevre",       label: "Chèvre",          price: 1.50, imageSrc: "https://justcool.fr/assets/images/products/supplements/supplement-chevre.webp" },
  { id: "raclette",     label: "Raclette",        price: 1.50, imageSrc: "https://justcool.fr/assets/images/products/supplements/supplement-raclette.webp" },
  { id: "cheddar",      label: "Cheddar",         price: 1.50, imageSrc: "https://justcool.fr/assets/images/products/supplements/supplement-cheddar.webp" },
  { id: "pomdeterre",   label: "Pomme de terre",  price: 1.50, imageSrc: "https://justcool.fr/assets/images/products/supplements/supplement-pomme-de-terre.webp" },
  { id: "oeuf",         label: "Œuf",             price: 1.00, imageSrc: "https://justcool.fr/assets/images/products/supplements/supplement-oeuf.webp" },
  { id: "kiri",         label: "Kiri",            price: 1.00, imageSrc: "https://justcool.fr/assets/images/products/supplements/supplement-kiri.webp" },
  { id: "boursin",      label: "Boursin",         price: 1.00, imageSrc: "https://justcool.fr/assets/images/products/supplements/supplement-boursin.webp" },
  { id: "fromagere",    label: "Sauce Fromagère", price: 0.50, imageSrc: "https://justcool.fr/assets/images/products/supplements/supplement-sauce-fromagere.webp" },
];

const MENU_UPCHARGE = 2.00;
const STUDENT_DISCOUNT = 1.00;
const MAX_SAUCES = 2;

// ─── Icons ────────────────────────────────────────────────────────────────────

const FlameIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24"
    fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
    className="text-orange-500 animate-pulse" aria-hidden="true">
    <path d="M12 3q1 4 4 6.5t3 5.5a1 1 0 0 1-14 0 5 5 0 0 1 1-3 1 1 0 0 0 5 0c0-2-1.5-3-1.5-5q0-2 2.5-4" />
  </svg>
);

const CloseIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24"
    fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 6L6 18" /><path d="M6 6l12 12" />
  </svg>
);

const CheckIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="11" height="11" viewBox="0 0 24 24"
    fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 6 9 17l-5-5" />
  </svg>
);

// ─── Sub-components ───────────────────────────────────────────────────────────

function Separator() {
  return <div className="h-px w-full bg-white/10" />;
}

function SectionLegend({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-2 mb-4">
      <span className="font-bold uppercase tracking-widest text-sm text-white">{children}</span>
      <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-normal uppercase tracking-wider
        border border-red-500/50 bg-red-500/20 text-red-500 h-5">
        Obligatoire
      </span>
    </div>
  );
}

function OptionChip({
  label,
  selected,
  onClick,
  disabled,
}: {
  label: string;
  selected: boolean;
  onClick: () => void;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`h-8 px-3 rounded-full text-xs font-bold transition-all border
        ${selected
          ? "bg-gradient-to-r from-red-600 to-red-700 border-red-600 text-white shadow-[0_0_15px_rgba(204,30,39,0.3)]"
          : "bg-white/5 border-white/20 text-white/70 hover:bg-white/10 hover:text-white hover:border-white/40"
        }
        disabled:opacity-40 disabled:cursor-not-allowed`}
    >
      {label}
    </button>
  );
}

function ImageOption({
  label,
  imageSrc,
  selected,
  onClick,
  disabled,
  price,
  isSpicy,
}: {
  label: string;
  imageSrc: string;
  selected: boolean;
  onClick: () => void;
  disabled?: boolean;
  price?: number;
  isSpicy?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled && !selected}
      className={`relative flex items-center gap-1 h-[60px] rounded-full border pr-3 w-full overflow-hidden transition-all duration-200
        ${selected
          ? "border-red-600 bg-red-600/15 shadow-[0_0_12px_rgba(204,30,39,0.3)]"
          : "border-white/20 bg-white/5 text-white/70 hover:bg-white/10 hover:border-white/40"
        }
        disabled:opacity-40 disabled:cursor-not-allowed`}
    >
      {/* Image circle */}
      <div className="w-[60px] h-[60px] shrink-0 rounded-full overflow-hidden bg-black/20 relative">
        <img
          alt={label}
          loading="lazy"
          src={imageSrc}
          className="absolute inset-0 w-full h-full object-contain p-2"
        />
      </div>

      {/* Label + price */}
      <div className="flex flex-col items-start gap-0.5 min-w-0 flex-1">
        <div className="flex items-center gap-1">
          <span className="text-xs text-white leading-tight truncate">{label}</span>
          {isSpicy && <FlameIcon />}
        </div>
        {price !== undefined && (
          <span className="text-white/50 text-xs font-bold">+{price.toFixed(2)}€</span>
        )}
      </div>

      {/* Check indicator */}
      {selected && (
        <div className="absolute top-1.5 right-1.5 w-4 h-4 rounded-full bg-red-600 flex items-center justify-center">
          <CheckIcon />
        </div>
      )}
    </button>
  );
}

// ─── Main modal ───────────────────────────────────────────────────────────────

export default function ProductModal({ product, isOpen, onClose, onAddToCart }: ProductModalProps) {
  const [quantity, setQuantity] = useState(1);
  const [crudites, setCrudites] = useState<string[]>(["Salade", "Tomate", "Oignon"]);
  const [bread, setBread] = useState("Pain Naan");
  const [sauces, setSauces] = useState<string[]>([]);
  const [menuFormule, setMenuFormule] = useState(false);
  const [isStudent, setIsStudent] = useState(false);
  const [supplements, setSupplements] = useState<string[]>([]);

  const scrollRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  // Reset state when product changes
  useEffect(() => {
    if (product) {
      setQuantity(1);
      setCrudites(["Salade", "Tomate", "Oignon"]);
      setBread("Pain Naan");
      setSauces([]);
      setMenuFormule(false);
      setIsStudent(false);
      setSupplements([]);
      // Scroll content to top
      setTimeout(() => { scrollRef.current?.scrollTo({ top: 0 }); }, 50);
    }
  }, [product]);

  // Trap focus & keyboard dismiss
  useEffect(() => {
    if (!isOpen) return;
    const handleKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", handleKey);
    document.body.style.overflow = "hidden";
    closeButtonRef.current?.focus();
    return () => {
      document.removeEventListener("keydown", handleKey);
      document.body.style.overflow = "";
    };
  }, [isOpen, onClose]);

  const toggleCrudite = useCallback((item: string) => {
    setCrudites((prev) => prev.includes(item) ? prev.filter((c) => c !== item) : [...prev, item]);
  }, []);

  const toggleSauce = useCallback((id: string) => {
    setSauces((prev) => {
      if (prev.includes(id)) return prev.filter((s) => s !== id);
      if (prev.length >= MAX_SAUCES) return prev;
      return [...prev, id];
    });
  }, []);

  const toggleSupplement = useCallback((id: string) => {
    setSupplements((prev) => prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]);
  }, []);

  const selectAllCrudites = () => setCrudites([...CRUDITES]);
  const clearCrudites = () => setCrudites([]);

  const totalPrice = (() => {
    if (!product) return 0;
    let total = product.price * quantity;
    if (menuFormule) total += MENU_UPCHARGE * quantity;
    if (menuFormule && isStudent) total -= STUDENT_DISCOUNT * quantity;
    supplements.forEach((id) => {
      const sup = SUPPLEMENTS.find((s) => s.id === id);
      if (sup) total += sup.price * quantity;
    });
    return total;
  })();

  const handleAdd = () => {
    if (!product) return;
    onAddToCart(product, quantity, { crudites, bread, sauces, menuFormule, isStudent, supplements });
    onClose();
  };

  if (!isOpen || !product) return null;

  return (
    <>
      <style>{`
        .modal-scrollbar::-webkit-scrollbar { width: 4px; }
        .modal-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .modal-scrollbar::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.15); border-radius: 2px; }
        @keyframes modal-in {
          from { opacity: 0; transform: translateY(24px) scale(0.97); }
          to   { opacity: 1; transform: translateY(0)    scale(1); }
        }
        .modal-animate { animation: modal-in 0.25s cubic-bezier(0.16,1,0.3,1) forwards; }
      `}</style>

      {/* Backdrop */}
      <div
        className="fixed inset-0 z-[200] bg-black/75 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4"
        onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
      >
        {/* Panel */}
        <div className="modal-animate relative flex flex-col bg-zinc-950 w-full sm:max-w-md rounded-t-2xl sm:rounded-2xl overflow-hidden shadow-2xl"
          style={{ maxHeight: "90dvh" }}>

          {/* ── Header ── */}
          <div className="flex items-center justify-between bg-red-600 px-4 py-3.5 shrink-0">
            <h2 id="modal-title" className="text-white font-bold text-lg leading-tight pr-4">
              {product.name}
            </h2>
            <button
              ref={closeButtonRef}
              onClick={onClose}
              aria-label="Fermer"
              className="text-white/80 hover:text-white transition-colors p-1 rounded-full hover:bg-white/10 shrink-0"
            >
              <CloseIcon />
            </button>
          </div>

          {/* ── Scrollable body ── */}
          <div ref={scrollRef} className="flex-1 overflow-y-auto modal-scrollbar overscroll-contain">
            <div className="p-5 space-y-6">

              {/* Product image */}
              <div className="relative w-full aspect-[4/3] overflow-hidden rounded-xl bg-black">
                <img
                  alt={product.name}
                  src={product.imageSrc}
                  className="absolute inset-0 w-full h-full object-contain"
                  style={{ background: "radial-gradient(circle farthest-side, #444 -80px, #111)" }}
                />
              </div>

              {/* Description */}
              <div className="space-y-1 px-1">
                <p className="text-white/60 text-base leading-relaxed">{product.mainIngredient}</p>
                {product.extras && (
                  <p className="text-white/40 text-xs flex items-center gap-1.5">
                    <span className="font-bold text-red-500">+ / −</span>
                    Crudités : {product.extras.replace("+ ", "")}
                  </p>
                )}
              </div>

              {/* Price */}
              <div>
                <div className="font-black text-red-600 text-3xl">{product.price.toFixed(2)}€</div>
                <p className="text-white/40 text-xs italic mt-1">
                  Allergènes : voir{" "}
                  <a href="/allergenes" className="text-red-500 underline decoration-dotted underline-offset-2">
                    tableau
                  </a>{" "}
                  ou en restaurant
                </p>
              </div>

              <Separator />

              {/* ── Crudités ── */}
              <fieldset className="space-y-4">
                <SectionLegend>Choisissez vos crudités</SectionLegend>

                {/* Quick select */}
                <div className="space-y-2">
                  <span className="text-white/40 text-xs uppercase tracking-widest block">Sélection rapide</span>
                  <div className="flex gap-3">
                    {/* Nature */}
                    <div className="flex flex-col items-center gap-1">
                      <button
                        type="button"
                        onClick={clearCrudites}
                        className={`flex flex-col items-center gap-0.5 px-4 py-2 rounded-md border text-xs transition-all
                          ${crudites.length === 0
                            ? "bg-red-600/20 border-red-600 text-white"
                            : "bg-white/5 border-white/20 text-white/60 hover:bg-white/10"}`}
                      >
                        <span className="text-white/40 tracking-wider uppercase text-[10px]">NATURE</span>
                        <span className="line-through text-lg" aria-hidden="true">🥬 🍅 🧅</span>
                      </button>
                      <span className="text-white/40 text-xs">aucune crudité</span>
                    </div>
                    {/* Complet */}
                    <div className="flex flex-col items-center gap-1">
                      <button
                        type="button"
                        onClick={selectAllCrudites}
                        className={`flex flex-col items-center gap-0.5 px-4 py-2 rounded-md border text-xs transition-all
                          ${crudites.length === CRUDITES.length
                            ? "bg-red-600/20 border-red-600 text-white"
                            : "bg-white/5 border-white/20 text-white/60 hover:bg-white/10"}`}
                      >
                        <span className="text-white/40 tracking-wider uppercase text-[10px]">COMPLET</span>
                        <span className="text-lg" aria-hidden="true">🥬 🍅 🧅</span>
                      </button>
                      <span className="text-white/40 text-xs">toutes les crudités</span>
                    </div>
                  </div>
                </div>

                {/* Individual */}
                <div className="space-y-2">
                  <span className="text-white/40 text-xs uppercase tracking-widest block">Ou sélection individuelle</span>
                  <div className="flex flex-wrap gap-3">
                    {CRUDITES.map((c) => (
                      <label key={c} className="flex items-center gap-2 cursor-pointer group">
                        <button
                          type="button"
                          role="checkbox"
                          aria-checked={crudites.includes(c)}
                          onClick={() => toggleCrudite(c)}
                          className={`h-4 w-4 rounded-sm border transition-all flex items-center justify-center
                            ${crudites.includes(c)
                              ? "bg-red-600 border-red-600"
                              : "border-white/20 bg-transparent"}`}
                        >
                          {crudites.includes(c) && <CheckIcon />}
                        </button>
                        <span className="text-white/70 text-xs uppercase font-bold">{c}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </fieldset>

              <Separator />

              {/* ── Bread ── */}
              <fieldset>
                <SectionLegend>Choisissez votre pain</SectionLegend>
                <div className="flex flex-wrap gap-2">
                  {BREADS.map((b) => (
                    <OptionChip key={b} label={b} selected={bread === b} onClick={() => setBread(b)} />
                  ))}
                </div>
              </fieldset>

              <Separator />

              {/* ── Sauces ── */}
              <fieldset>
                <div className="flex items-center gap-2 mb-4">
                  <span className="font-bold uppercase tracking-widest text-sm text-white">
                    Choisissez vos sauces
                  </span>
                  <span className="text-xs px-2 py-0.5 rounded bg-red-500/20 text-red-500 border border-red-500/30 font-black tracking-tighter">
                    MAX {MAX_SAUCES}
                  </span>
                  <span className="inline-flex items-center px-2 py-0.5 rounded text-xs uppercase tracking-wider
                    border border-red-500/50 bg-red-500/20 text-red-500 h-5">
                    Obligatoire
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-1.5">
                  {SAUCES.map((s) => (
                    <ImageOption
                      key={s.id}
                      label={s.label}
                      imageSrc={s.imageSrc}
                      selected={sauces.includes(s.id)}
                      disabled={sauces.length >= MAX_SAUCES && !sauces.includes(s.id)}
                      isSpicy={s.isSpicy}
                      onClick={() => toggleSauce(s.id)}
                    />
                  ))}
                </div>
              </fieldset>

              <Separator />

              {/* ── Menu formule ── */}
              <div>
                <label className="flex items-center justify-between gap-4 cursor-pointer">
                  <div className="flex flex-col gap-0.5">
                    <span className="font-bold text-white text-sm uppercase tracking-widest">
                      Ajoutez la formule menu
                    </span>
                    <span className="text-white/40 text-xs">frites + boisson</span>
                  </div>
                  <div className="flex items-center gap-3 shrink-0">
                    <span className="font-black text-red-600 text-sm">+{MENU_UPCHARGE.toFixed(2)}€</span>
                    <button
                      type="button"
                      role="checkbox"
                      aria-checked={menuFormule}
                      onClick={() => { setMenuFormule((v) => !v); if (!menuFormule) setIsStudent(false); }}
                      className={`h-5 w-5 rounded-sm border transition-all flex items-center justify-center
                        ${menuFormule ? "bg-red-600 border-red-600" : "border-red-600 bg-transparent"}`}
                    >
                      {menuFormule && <CheckIcon />}
                    </button>
                  </div>
                </label>

                {/* Student discount — only shown when menu is active */}
                <div className={`mt-3 pl-2 transition-all duration-300 ${menuFormule ? "opacity-100" : "opacity-30 pointer-events-none"}`}>
                  <label className="flex items-center justify-between gap-4 cursor-pointer">
                    <div className="flex items-center gap-2">
                      <span className="font-bold uppercase tracking-widest text-white/70 text-xs">
                        Offre spéciale étudiant
                      </span>
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-bold uppercase tracking-wider
                        border border-green-500/50 bg-green-500/20 text-green-500 h-5">
                        −{STUDENT_DISCOUNT.toFixed(2)}€ sur le menu
                      </span>
                    </div>
                    <button
                      type="button"
                      role="checkbox"
                      aria-checked={isStudent}
                      disabled={!menuFormule}
                      onClick={() => setIsStudent((v) => !v)}
                      className={`h-4 w-4 rounded-sm border transition-all flex items-center justify-center shrink-0
                        ${isStudent ? "bg-green-500 border-green-500" : "border-green-500 bg-transparent"}`}
                    >
                      {isStudent && <CheckIcon />}
                    </button>
                  </label>
                </div>
              </div>

              <Separator />

              {/* ── Supplements ── */}
              <fieldset className="pb-2">
                <div className="font-bold uppercase tracking-widest text-sm text-white mb-4">
                  Ajoutez vos suppléments
                </div>
                <div className="grid grid-cols-2 gap-1.5">
                  {SUPPLEMENTS.map((s) => (
                    <ImageOption
                      key={s.id}
                      label={s.label}
                      imageSrc={s.imageSrc}
                      selected={supplements.includes(s.id)}
                      price={s.price}
                      onClick={() => toggleSupplement(s.id)}
                    />
                  ))}
                </div>
              </fieldset>

            </div>
          </div>

          {/* ── Footer / Add to cart ── */}
          <div className="px-4 py-3.5 bg-black/60 backdrop-blur-md border-t border-white/10 shrink-0">
            <div className="flex items-center gap-3">
              {/* Quantity */}
              <div className="flex items-center gap-2 bg-white/5 rounded-full px-1.5 py-1 border border-white/10 shrink-0">
                <button
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="w-8 h-8 rounded-full flex items-center justify-center text-white text-lg hover:bg-white/10 transition-colors"
                  aria-label="Diminuer la quantité"
                >
                  −
                </button>
                <span className="font-bold text-white text-sm w-4 text-center select-none">{quantity}</span>
                <button
                  onClick={() => setQuantity((q) => q + 1)}
                  className="w-8 h-8 rounded-full flex items-center justify-center text-white text-lg hover:bg-white/10 transition-colors"
                  aria-label="Augmenter la quantité"
                >
                  +
                </button>
              </div>

              {/* Add button */}
              <button
                onClick={handleAdd}
                className="flex-1 flex items-center justify-between h-12 px-5 rounded-lg
                  bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600
                  text-white font-bold transition-all duration-300
                  shadow-[0_0_20px_rgba(204,30,39,0.5)] hover:shadow-[0_0_30px_rgba(204,30,39,0.8)]
                  focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500"
              >
                <span className="uppercase tracking-wider text-sm">Ajouter</span>
                <span className="font-black text-lg">{totalPrice.toFixed(2)}€</span>
              </button>
            </div>
          </div>

        </div>
      </div>
    </>
  );
}