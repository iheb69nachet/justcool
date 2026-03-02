import React, { useState, useEffect, useRef, useCallback } from "react";
import type { Product } from "./CategorySection";

// ─── API types ────────────────────────────────────────────────────────────────

interface ApiSupplement {
  id: string;
  name: string;
  price: number;
  is_active: boolean;
  sort_order: number;
  image_url: string | null;
}

interface ApiSupplementGroup {
  id: string;
  name: string;
  description: string;
  is_required: boolean;
  min_selection: number;
  max_selection: number;
  sort_order: number;
  supplements: ApiSupplement[];
}

// ─── Public types ─────────────────────────────────────────────────────────────

interface OrderOptions {
  crudites: string[];
  bread: string;
  sauces: string[];
  menuFormule: boolean;
  isStudent: boolean;
  supplements: string[];
  groupSelections: Record<string, string[]>;
  supplementSurcharge: number; // ← NEW: per-unit surcharge from supplements
}

interface ProductModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
  onAddToCart: (product: Product, quantity: number, options: OrderOptions) => void;
}

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

const AlertIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24"
    fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
    className="shrink-0">
    <path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
    <line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>
  </svg>
);

// ─── Sub-components ───────────────────────────────────────────────────────────

function Separator() {
  return <div className="h-px w-full bg-white/10" />;
}

function ErrorBanner({ message }: { message: string }) {
  return (
    <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-red-500/15 border border-red-500/40 text-red-400 text-xs font-bold animate-[shake_0.35s_ease]">
      <AlertIcon />
      {message}
    </div>
  );
}

function OptionChip({
  label, selected, onClick, disabled,
}: {
  label: string; selected: boolean; onClick: () => void; disabled?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled && !selected}
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
  label, imageSrc, selected, onClick, disabled, price,
}: {
  label: string; imageSrc: string; selected: boolean; onClick: () => void;
  disabled?: boolean; price?: number;
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
      <div className="w-[60px] h-[60px] shrink-0 rounded-full overflow-hidden bg-black/20 relative">
        <img alt={label} loading="lazy"
          src={"https://resto.devsolve-agency.com:8443/" + imageSrc}
          className="absolute inset-0 w-full h-full object-contain p-2" />
      </div>
      <div className="flex flex-col items-start gap-0.5 min-w-0 flex-1">
        <span className="text-xs text-white leading-tight truncate">{label}</span>
        {price !== undefined && price > 0 && (
          <span className="text-white/50 text-xs font-bold">+{price.toFixed(2)}€</span>
        )}
      </div>
      {selected && (
        <div className="absolute top-1.5 right-1.5 w-4 h-4 rounded-full bg-red-600 flex items-center justify-center">
          <CheckIcon />
        </div>
      )}
    </button>
  );
}

// ─── Spicy-name detection ─────────────────────────────────────────────────────

const SPICY_KEYWORDS = ["harissa", "samourai", "algérienne", "algerienne", "chili", "piment", "sriracha", "marocaine"];
function isSpicyName(name: string) {
  const lower = name.toLowerCase();
  return SPICY_KEYWORDS.some((k) => lower.includes(k));
}

// ─── GroupSection ─────────────────────────────────────────────────────────────

interface GroupSectionProps {
  group: ApiSupplementGroup;
  selected: string[];
  hasError: boolean;
  onChange: (groupId: string, newSelected: string[]) => void;
}

function GroupSection({ group, selected, hasError, onChange }: GroupSectionProps) {
  const isRadio  = group.max_selection === 1;
  const isMulti  = group.max_selection > 1;
  const atMax    = isMulti && selected.length >= group.max_selection;
  const sectionId = `section-group-${group.id}`;

  const toggle = (supId: string) => {
    if (isRadio) {
      const alreadySelected = selected.includes(supId);
      onChange(group.id, alreadySelected && !group.is_required ? [] : [supId]);
    } else {
      if (selected.includes(supId)) {
        onChange(group.id, selected.filter((id) => id !== supId));
      } else if (!atMax) {
        onChange(group.id, [...selected, supId]);
      }
    }
  };

  const activeSupplements = group.supplements
    .filter((s) => s.is_active)
    .sort((a, b) => a.sort_order - b.sort_order);

  const hasImages = activeSupplements.some((s) => s.image_url);

  return (
    <fieldset
      id={sectionId}
      className={`p-3 -mx-3 rounded-xl transition-all ${hasError ? "section-error" : ""}`}
    >
      <div className="flex items-center gap-2 mb-4 flex-wrap">
        <span className={`font-bold uppercase tracking-widest text-sm transition-colors ${hasError ? "text-red-400" : "text-white"}`}>
          {group.name}
        </span>

        {group.is_required ? (
          <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs uppercase tracking-wider border h-5 transition-colors
            ${hasError
              ? "border-red-400 bg-red-400/20 text-red-400"
              : "border-red-500/50 bg-red-500/20 text-red-500"}`}>
            Obligatoire
          </span>
        ) : (
          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs uppercase tracking-wider border h-5
            border-white/20 bg-white/5 text-white/40">
            Optionnel
          </span>
        )}

        {isMulti && (
          <span className="text-xs px-2 py-0.5 rounded bg-red-500/20 text-red-500 border border-red-500/30 font-black tracking-tighter">
            MAX {group.max_selection}
          </span>
        )}

        {group.description && (
          <span className="text-white/35 text-xs italic">{group.description}</span>
        )}
      </div>

      {hasError && (
        <div className="mb-3">
          <ErrorBanner
            message={`Veuillez choisir ${isRadio ? "une option" : "au moins une option"} pour « ${group.name} ».`}
          />
        </div>
      )}

      {hasImages ? (
        <div className="grid grid-cols-2 gap-1.5">
          {activeSupplements.map((sup) => (
            <ImageOption
              key={sup.id}
              label={sup.name.trim()}
              imageSrc={sup.image_url!}
              selected={selected.includes(sup.id)}
              price={sup.price > 0 ? sup.price : undefined}
              disabled={atMax && !selected.includes(sup.id)}
              onClick={() => toggle(sup.id)}
            />
          ))}
        </div>
      ) : (
        <div className="flex flex-wrap gap-2">
          {activeSupplements.map((sup) => (
            <div key={sup.id} className="flex items-center gap-1">
              <OptionChip
                label={sup.name.trim()}
                selected={selected.includes(sup.id)}
                disabled={atMax && !selected.includes(sup.id)}
                onClick={() => toggle(sup.id)}
              />
              {isSpicyName(sup.name) && <FlameIcon />}
              {sup.price > 0 && (
                <span className="text-white/40 text-xs">+{sup.price.toFixed(2)}€</span>
              )}
            </div>
          ))}
        </div>
      )}
    </fieldset>
  );
}

// ─── Main modal ───────────────────────────────────────────────────────────────

export default function ProductModal({ product, isOpen, onClose, onAddToCart }: ProductModalProps) {
  const [quantity, setQuantity] = useState(1);
  const [groupSelections, setGroupSelections] = useState<Record<string, string[]>>({});
  const [errors, setErrors] = useState<Set<string>>(new Set());

  const scrollRef      = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  const supplementGroups: ApiSupplementGroup[] =
    (product as any)?.supplementGroups ?? [];

  // ── Reset when product changes ────────────────────────────────────────────
  useEffect(() => {
    if (product) {
      setQuantity(1);
      setGroupSelections({});
      setErrors(new Set());
      setTimeout(() => { scrollRef.current?.scrollTo({ top: 0 }); }, 50);
    }
  }, [product]);

  // ── Auto-clear errors when groups become valid ────────────────────────────
  useEffect(() => {
    setErrors((prev) => {
      if (prev.size === 0) return prev;
      const next = new Set(prev);
      supplementGroups.forEach((g) => {
        if (!g.is_required) return;
        const sel = groupSelections[g.id] ?? [];
        if (sel.length >= Math.max(1, g.min_selection)) next.delete(g.id);
      });
      return next;
    });
  }, [groupSelections, supplementGroups]);

  // ── Keyboard dismiss + scroll lock ───────────────────────────────────────
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

  const handleGroupChange = useCallback((groupId: string, newSelected: string[]) => {
    setGroupSelections((prev) => ({ ...prev, [groupId]: newSelected }));
  }, []);

  // ── Per-unit supplement surcharge ─────────────────────────────────────────
  const supplementSurcharge = (() => {
    let extra = 0;
    supplementGroups.forEach((g) => {
      (groupSelections[g.id] ?? []).forEach((supId) => {
        const sup = g.supplements.find((s) => s.id === supId);
        if (sup) extra += sup.price;
      });
    });
    return extra;
  })();

  // ── Total price shown in modal (base + supplements) × quantity ────────────
  const totalPrice = product ? (product.price + supplementSurcharge) * quantity : 0;

  // ── Validation + scroll-to-error ──────────────────────────────────────────
  const handleAdd = () => {
    if (!product) return;

    const failedGroups = supplementGroups.filter((g) => {
      if (!g.is_required) return false;
      const sel = groupSelections[g.id] ?? [];
      return sel.length < Math.max(1, g.min_selection);
    });

    if (failedGroups.length > 0) {
      setErrors(new Set(failedGroups.map((g) => g.id)));
      const firstId = `section-group-${failedGroups[0].id}`;
      const firstEl = scrollRef.current?.querySelector(`#${firstId}`);
      if (firstEl && scrollRef.current) {
        scrollRef.current.scrollTo({
          top: (firstEl as HTMLElement).offsetTop - 16,
          behavior: "smooth",
        });
      }
      return;
    }

    // Build human-readable supplement names
    const allSelectedNames: string[] = [];
    const namedGroupSelections: Record<string, string[]> = {};

    supplementGroups.forEach((g) => {
      const selectedIds = groupSelections[g.id] ?? [];
      const selectedNames = selectedIds.map((id) => {
        const sup = g.supplements.find((s) => s.id === id);
        return sup ? sup.name.trim() : id;
      });
      if (selectedNames.length > 0) {
        namedGroupSelections[g.name] = selectedNames;
        allSelectedNames.push(...selectedNames);
      }
    });

    onAddToCart(product, quantity, {
      crudites: [],
      bread: "",
      sauces: [],
      menuFormule: false,
      isStudent: false,
      supplements: allSelectedNames,
      groupSelections: namedGroupSelections,
      supplementSurcharge, // ← per-unit surcharge passed to parent
    });
    onClose();
  };

  if (!isOpen || !product) return null;

  const visibleGroups = supplementGroups
    .filter((g) => g.supplements.some((s) => s.is_active))
    .sort((a, b) => a.sort_order - b.sort_order);

  return (
    <>
      <style>{`
        .modal-scrollbar::-webkit-scrollbar { width: 4px; }
        .modal-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .modal-scrollbar::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.15); border-radius: 2px; }
        @keyframes modal-in {
          from { opacity: 0; transform: translateY(24px) scale(0.97); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes shake {
          0%,100% { transform: translateX(0); }
          20%     { transform: translateX(-5px); }
          40%     { transform: translateX(5px); }
          60%     { transform: translateX(-4px); }
          80%     { transform: translateX(4px); }
        }
        @keyframes error-highlight {
          0%   { box-shadow: 0 0 0 0 rgba(239,68,68,0); }
          30%  { box-shadow: 0 0 0 4px rgba(239,68,68,0.35); }
          100% { box-shadow: 0 0 0 0 rgba(239,68,68,0); }
        }
        .modal-animate { animation: modal-in 0.25s cubic-bezier(0.16,1,0.3,1) forwards; }
        .section-error { animation: error-highlight 0.9s ease forwards; border-radius: 12px; }
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
        <div
          className="modal-animate relative flex flex-col bg-zinc-950 w-full sm:max-w-md rounded-t-2xl sm:rounded-2xl overflow-hidden shadow-2xl"
          style={{ maxHeight: "90dvh" }}
        >

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
              {product.imageSrc && (
                <div className="relative w-full aspect-[4/3] overflow-hidden rounded-xl bg-black">
                  <img
                    alt={product.name}
                    src={"https://resto.devsolve-agency.com:8443/" + product.imageSrc}
                    className="absolute inset-0 w-full h-full object-contain"
                    style={{ background: "radial-gradient(circle farthest-side, #444 -80px, #111)" }}
                  />
                </div>
              )}

              {/* Description */}
              {(product.mainIngredient || product.extras) && (
                <div className="space-y-1 px-1">
                  {product.mainIngredient && (
                    <p className="text-white/60 text-base leading-relaxed">{product.mainIngredient}</p>
                  )}
                  {product.extras && (
                    <p className="text-white/40 text-xs flex items-center gap-1.5">
                      <span className="font-bold text-red-500">+ / −</span>
                      {product.extras}
                    </p>
                  )}
                </div>
              )}

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

              {/* ── Dynamic supplement groups ── */}
              {visibleGroups.length > 0 && (
                <>
                  <Separator />
                  <div className="space-y-6">
                    {visibleGroups.map((group, idx) => (
                      <React.Fragment key={group.id}>
                        <GroupSection
                          group={group}
                          selected={groupSelections[group.id] ?? []}
                          hasError={errors.has(group.id)}
                          onChange={handleGroupChange}
                        />
                        {idx < visibleGroups.length - 1 && <Separator />}
                      </React.Fragment>
                    ))}
                  </div>
                </>
              )}

              {visibleGroups.length === 0 && (
                <p className="text-white/30 text-xs italic text-center py-4">
                  Aucune option de personnalisation disponible.
                </p>
              )}

            </div>
          </div>

          {/* ── Footer ── */}
          <div className="px-4 py-3.5 bg-black/60 backdrop-blur-md border-t border-white/10 shrink-0">
            <div className="flex items-center gap-3">

              {/* Quantity */}
              <div className="flex items-center gap-2 bg-white/5 rounded-full px-1.5 py-1 border border-white/10 shrink-0">
                <button
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="w-8 h-8 rounded-full flex items-center justify-center text-white text-lg hover:bg-white/10 transition-colors"
                  aria-label="Diminuer la quantité"
                >−</button>
                <span className="font-bold text-white text-sm w-4 text-center select-none">{quantity}</span>
                <button
                  onClick={() => setQuantity((q) => q + 1)}
                  className="w-8 h-8 rounded-full flex items-center justify-center text-white text-lg hover:bg-white/10 transition-colors"
                  aria-label="Augmenter la quantité"
                >+</button>
              </div>

              {/* Add to cart */}
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