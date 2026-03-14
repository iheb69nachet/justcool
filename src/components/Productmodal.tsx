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
  supplementSurcharge: number;
  selectedBoisson?: string;
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

function OptionChip({
  label, selected, onClick, disabled, hasError,
}: {
  label: string; selected: boolean; onClick: () => void; disabled?: boolean; hasError?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled && !selected}
      className={`h-8 px-3 rounded-full text-xs font-bold transition-all border
        ${selected
          ? "bg-gradient-to-r from-red-600 to-red-700 border-red-600 text-white shadow-[0_0_15px_rgba(204,30,39,0.3)]"
          : hasError
            ? "error-pulse-chip border-red-500/40 text-red-300/70 hover:bg-white/10 hover:text-white hover:border-white/40"
            : "bg-white/5 border-white/20 text-white/70 hover:bg-white/10 hover:text-white hover:border-white/40"
        }
        disabled:opacity-40 disabled:cursor-not-allowed`}
    >
      {label}
    </button>
  );
}

function ImageOption({
  label, imageSrc, selected, onClick, disabled, price, hasError, isSpicy,
}: {
  label: string; imageSrc: string; selected: boolean; onClick: () => void;
  disabled?: boolean; price?: number; hasError?: boolean; isSpicy?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled && !selected}
      className={`relative flex items-center gap-1 h-[60px] rounded-full border pr-3 w-full overflow-hidden transition-all duration-200
        ${selected
          ? "border-[#DC2626] bg-[#DC2626] shadow-[0_0_18px_rgba(220,38,38,0.45)]"
          : hasError
            ? "error-pulse-img border-red-500/30 text-white/70 hover:border-white/40"
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
        <span className="text-xs text-white leading-tight truncate flex gap-2" >{label}   {isSpicy && <FlameIcon />}</span>
         
        {price !== undefined && price > 0 && (
          <span className="text-white/50 text-xs font-bold">+{price.toFixed(2)}€</span>
        )}
      </div>
    </button>
  );
}

// ─── Spicy-name detection ─────────────────────────────────────────────────────

// "spicy" in the API name is the explicit tag — show flame icon, strip from display
function isSpicyName(name: string) {
  console.log(name);
  
  return name.toLowerCase().includes("spicy");
}

// Strip the hidden "spicy" tag so it never appears in the UI
function cleanDisplayName(name: string) {
  return name.replace(/\s*spicy\s*/gi, "").trim();
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function isBoissonGroup(group: ApiSupplementGroup) {
  return group.name.toLowerCase().includes("boisson");
}

function buildDefaultSelections(groups: ApiSupplementGroup[]): Record<string, string[]> {
  const defaults: Record<string, string[]> = {};
  groups.forEach((g) => {
    if (g.name === "Choisissez votre pain") {
      const naan = g.supplements.find(
        (s) => s.is_active && s.name.trim().toLowerCase() === "pain naan"
      );
      if (naan) defaults[g.id] = [naan.id];
    }
  });
  return defaults;
}

// ─── FormuleMenuSection ───────────────────────────────────────────────────────

const FORMULE_PRICE = 2.00;
const STUDENT_DISCOUNT = 1.00;

interface FormuleMenuSectionProps {
  menuFormule: boolean;
  isStudent: boolean;
  selectedBoisson: string | null;
  boissonError: boolean;
  onToggleFormule: (v: boolean) => void;
  onToggleStudent: (v: boolean) => void;
  onSelectBoisson: (supId: string) => void;
}

// ─── Hardcoded boisson list ───────────────────────────────────────────────────
// extra: number > 0 means a surcharge on top of the formule price
// displayPrice: the retail price shown struck-through (included in formule)

const HARDCODED_BOISSONS: { id: string; name: string; extra: number; displayPrice: string }[] = [
  { id: "cristaline",             name: "Cristaline",             extra: 0,    displayPrice: "1.50€" },
  { id: "perrier",                name: "Perrier",                extra: 0,    displayPrice: "2.00€" },
  { id: "coca-cola-cherry",       name: "Coca-Cola Cherry",       extra: 0,    displayPrice: "2.00€" },
  { id: "coca-cola",              name: "Coca-Cola",              extra: 0,    displayPrice: "2.00€" },
  { id: "coca-cola-zero",         name: "Coca-Cola Zero",         extra: 0,    displayPrice: "2.00€" },
  { id: "tropico",                name: "Tropico",                extra: 0,    displayPrice: "2.00€" },
  { id: "ice-tea",                name: "Ice Tea",                extra: 0,    displayPrice: "2.00€" },
  { id: "oasis-tropicale",        name: "Oasis tropicale",        extra: 0,    displayPrice: "2.00€" },
  { id: "oasis-fraise-framboise", name: "Oasis fraise framboise", extra: 0,    displayPrice: "2.00€" },
  { id: "oasis-pomme-cassis",     name: "Oasis pomme cassis",     extra: 0,    displayPrice: "2.00€" },
  { id: "oasis-pomme-poire",      name: "Oasis pomme poire",      extra: 0,    displayPrice: "2.00€" },
  { id: "sprite",                 name: "Sprite",                 extra: 0,    displayPrice: "2.00€" },
  { id: "fanta-orange",           name: "Fanta orange",           extra: 0,    displayPrice: "2.00€" },
  { id: "fanta-citron",           name: "Fanta citron",           extra: 0,    displayPrice: "2.00€" },
  { id: "schweppes-pomme",        name: "Schweppes pomme",        extra: 0,    displayPrice: "2.00€" },
  { id: "schweppes-agrumes",      name: "Schweppes Agrumes",      extra: 0,    displayPrice: "2.00€" },
  { id: "seven-up",               name: "Seven Up",               extra: 0,    displayPrice: "2.00€" },
  { id: "seven-up-moj",           name: "Seven Up Moj.",          extra: 0,    displayPrice: "2.00€" },
  { id: "orangina",               name: "Orangina",               extra: 0,    displayPrice: "2.00€" },
  { id: "fuze-tea",               name: "Fuze Tea",               extra: 0,    displayPrice: "2.00€" },
  { id: "coca-cola-1l",           name: "Coca-Cola 1 litre",      extra: 1.50, displayPrice: ""      },
  { id: "capri-sun",              name: "Capri-Sun",              extra: 0,    displayPrice: "1.50€" },
];

function FormuleMenuSection({
  menuFormule,
  isStudent,
  selectedBoisson,
  boissonError,
  onToggleFormule,
  onToggleStudent,
  onSelectBoisson,
}: FormuleMenuSectionProps) {
  return (
    <div className="space-y-0">
      {/* ── Formule toggle row ── */}
      <div
        className="flex items-center justify-between cursor-pointer select-none group py-1"
        onClick={() => onToggleFormule(!menuFormule)}
        role="checkbox"
        aria-checked={menuFormule}
        tabIndex={0}
        onKeyDown={(e) => { if (e.key === " " || e.key === "Enter") onToggleFormule(!menuFormule); }}
      >
        <span className="font-sans font-bold uppercase tracking-widest text-sm text-white group-hover:text-white/80 transition-colors">
          Ajoutez la formule menu (frites + boisson)
        </span>
        <div className="flex items-center gap-3 shrink-0">
          <span className="font-black text-[#DC2626] font-sans text-sm">+{FORMULE_PRICE.toFixed(2)}€</span>
          <span
            className={`w-5 h-5 rounded flex items-center justify-center border-2 transition-all duration-200 shrink-0
              ${menuFormule
                ? "bg-[#DC2626] border-[#DC2626] shadow-[0_0_10px_rgba(220,38,38,0.4)]"
                : "bg-transparent border-white/40 group-hover:border-white/70"
              }`}
          >
            {menuFormule && <CheckIcon />}
          </span>
        </div>
      </div>

      {/* ── Student discount + boisson picker (visible only when formule is ON) ── */}
      <div
        style={{
          maxHeight: menuFormule ? "2000px" : "0px",
          opacity: menuFormule ? 1 : 0,
          overflow: "hidden",
          transition: "max-height 0.45s cubic-bezier(0.16,1,0.3,1), opacity 0.3s ease",
        }}
      >
        <div className="pt-3 space-y-4">
          {/* Student discount row */}
          <div>
            <div
              className="flex items-center justify-between cursor-pointer select-none group py-1"
              onClick={() => onToggleStudent(!isStudent)}
              role="checkbox"
              aria-checked={isStudent}
              tabIndex={menuFormule ? 0 : -1}
              onKeyDown={(e) => { if (e.key === " " || e.key === "Enter") onToggleStudent(!isStudent); }}
            >
              <div className="flex items-center gap-2">
                <span className="font-sans font-black uppercase tracking-widest text-white/70 text-xs">
                  Offre spéciale étudiant
                </span>
                <span className="inline-flex items-center px-2 py-0.5 rounded border text-xs uppercase tracking-wider h-5 font-bold border-green-500/50 bg-green-500/20 text-green-500">
                  -{STUDENT_DISCOUNT.toFixed(0)}€ sur le menu
                </span>
              </div>
              <span
                className={`w-4 h-4 rounded flex items-center justify-center border-2 transition-all duration-200 shrink-0 ml-3
                  ${isStudent
                    ? "bg-green-500 border-green-500 shadow-[0_0_8px_rgba(34,197,94,0.4)]"
                    : "bg-transparent border-green-500/50 hover:border-green-500"
                  }`}
              >
                {isStudent && (
                  <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M20 6 9 17l-5-5" />
                  </svg>
                )}
              </span>
            </div>
            {isStudent && (
              <p className="text-green-500/80 italic text-xs mt-1 pl-1">
                * Présentez votre carte étudiante en caisse pour bénéficier de la réduction.
              </p>
            )}
          </div>

          <div className="h-px w-full bg-white/10" />

          {/* Boisson picker — hardcoded list */}
          <fieldset
            id="section-boisson"
            className={`section-box ${boissonError ? "section-error" : ""}`}
          >
            <div className="section-legend">
              <span className={`font-bold uppercase tracking-widest text-sm ${boissonError ? "text-red-400" : "text-white"}`}>
                Choisissez votre boisson
              </span>
              <span className="inline-flex items-center px-2 py-0.5 rounded text-xs uppercase tracking-wider border h-5 border-red-500/80 bg-red-500/10 text-red-400">
                Obligatoire
              </span>
            </div>

            <div className="grid grid-cols-2 gap-1">
              {HARDCODED_BOISSONS.map((b) => {
                const isSelected = selectedBoisson === b.id;
                return (
                  <button
                    key={b.id}
                    type="button"
                    onClick={() => onSelectBoisson(b.id)}
                    className={`whitespace-nowrap border backdrop-blur-xl h-8 rounded-full font-bold transition-all text-xs py-2.5 px-3 flex items-center justify-between gap-1
                      ${isSelected
                        ? "bg-gradient-to-r from-red-600 to-red-700 border-red-600 text-white shadow-[0_0_15px_rgba(204,30,39,0.4)]"
                        : boissonError
                          ? "error-pulse-chip bg-white/5 border-red-500/40 text-red-300/70 hover:bg-white/10 hover:text-white hover:border-white/40"
                          : "bg-white/5 border-white/20 text-white/70 hover:bg-white/10 hover:text-white hover:border-white/40"
                      }`}
                  >
                    <span className="truncate">{b.name}</span>
                    {b.extra > 0 ? (
                      <span className={`font-black font-sans text-xs ml-1 shrink-0 ${isSelected ? "text-white" : "text-[#DC2626]"}`}>
                        +{b.extra.toFixed(2)}€
                      </span>
                    ) : b.displayPrice ? (
                      <span className={`font-black font-sans text-xs ml-1 shrink-0 line-through ${isSelected ? "text-white/50" : "text-white/30"}`}>
                        {b.displayPrice}
                      </span>
                    ) : null}
                  </button>
                );
              })}
            </div>
          </fieldset>
        </div>
      </div>
    </div>
  );
}

// ─── CruditesGroupSection ─────────────────────────────────────────────────────

interface CruditesGroupSectionProps {
  group: ApiSupplementGroup;
  selected: string[];
  hasError: boolean;
  onChange: (groupId: string, newSelected: string[]) => void;
}

function CruditesGroupSection({ group, selected, hasError, onChange }: CruditesGroupSectionProps) {
  const sectionId = `section-group-${group.id}`;

  const NATURE_SENTINEL = "__nature__";
  const STATIC_ITEMS = ["Salade", "Tomate", "Oignon"];

  const realSelected = selected.filter((id) => id !== NATURE_SENTINEL);
  const isNatureSelected = selected.includes(NATURE_SENTINEL);
  const isCompletSelected = STATIC_ITEMS.every((label) => realSelected.includes(label));

  const handleNature = () => onChange(group.id, [NATURE_SENTINEL]);
  const handleComplet = () => onChange(group.id, [...STATIC_ITEMS]);

  const toggleIndividual = (label: string) => {
    if (realSelected.includes(label)) {
      onChange(group.id, realSelected.filter((id) => id !== label));
    } else {
      onChange(group.id, [...realSelected, label]);
    }
  };

  return (
    <fieldset id={sectionId} className={`section-box ${hasError ? "section-error" : ""}`}>
      <div className="section-legend">
        <span className={`font-bold uppercase tracking-widest text-sm transition-colors ${hasError ? "text-red-400" : "text-white"}`}>
          {group.name}
        </span>
        {group.is_required ? (
          <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs uppercase tracking-wider border h-5 ${hasError ? "border-red-500 bg-red-500/20 text-red-400" : "border-red-500 bg-red-500/20 text-red-400"}`}>
            Obligatoire
          </span>
        ) : (
          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs uppercase tracking-wider border h-5 border-white/20 bg-white/5 text-white/40">
            Optionnel
          </span>
        )}
        {group.description && (
          <span className="text-white/35 text-xs italic">{group.description}</span>
        )}
      </div>

      <p className="text-white/40 text-[10px] font-bold uppercase tracking-[0.15em] mb-2">
        Sélection rapide
      </p>

      <div className="grid grid-cols-2 gap-2 mb-4">
        <button type="button" onClick={handleNature}
          className={`relative flex flex-col items-center justify-center gap-1.5 py-3 px-2 rounded-xl border transition-all duration-200
            ${isNatureSelected ? "border-[#DC2626] bg-[#DC2626]/15 shadow-[0_0_14px_rgba(228,88,53,0.25)]" : "border-white/15 bg-white/[0.04] hover:bg-white/[0.08] hover:border-white/30"}`}>
          <span className={`text-[11px] font-extrabold uppercase tracking-widest ${isNatureSelected ? "text-white" : "text-white/60"}`}>Nature</span>
          <span className="relative text-2xl leading-none select-none inline-block">
            🥬🍅🧅
            <span className="pointer-events-none absolute left-0 right-0 top-1/2 h-[2px] -translate-y-1/2 -rotate-[18deg] bg-white/70" />
          </span>
          <span className="text-[10px] text-white/35 italic">Aucune crudité</span>
          {isNatureSelected && (
            <div className="absolute top-2 right-2 w-4 h-4 rounded-full bg-[#DC2626] flex items-center justify-center shadow-md">
              <CheckIcon />
            </div>
          )}
        </button>

        <button type="button" onClick={handleComplet}
          className={`relative flex flex-col items-center justify-center gap-1.5 py-3 px-2 rounded-xl border transition-all duration-200
            ${isCompletSelected ? "border-[#DC2626] bg-[#DC2626]/15 shadow-[0_0_14px_rgba(228,88,53,0.25)]" : "border-white/15 bg-white/[0.04] hover:bg-white/[0.08] hover:border-white/30"}`}>
          <span className={`text-[11px] font-extrabold uppercase tracking-widest ${isCompletSelected ? "text-white" : "text-white/60"}`}>Complet</span>
          <span className="text-2xl leading-none select-none">🥬🍅🧅</span>
          <span className="text-[10px] text-white/35 italic">toutes les crudités</span>
          {isCompletSelected && (
            <div className="absolute top-2 right-2 w-4 h-4 rounded-full bg-[#DC2626] flex items-center justify-center shadow-md">
              <CheckIcon />
            </div>
          )}
        </button>
      </div>

      <p className="text-white/40 text-[10px] font-bold uppercase tracking-[0.15em] mb-3">
        Ou sélection individuelle
      </p>
      <div className="flex flex-wrap items-center gap-x-5 gap-y-3">
        {(["Salade", "Tomate", "Oignon"] as const).map((label) => {
          const isSelected = realSelected.includes(label);
          return (
            <button key={label} type="button" onClick={() => toggleIndividual(label)} className="flex items-center gap-2 group">
              <span className={`w-5 h-5 rounded-md flex items-center justify-center shrink-0 transition-all duration-150 border-2
                ${isSelected ? "bg-[#DC2626] border-[#DC2626] shadow-[0_0_10px_rgba(228,88,53,0.5)]" : "bg-transparent border-white/35 group-hover:border-white/60"}`}>
                {isSelected && <CheckIcon />}
              </span>
              <span className={`text-sm font-bold uppercase tracking-widest transition-colors ${isSelected ? "text-white" : "text-white/60 group-hover:text-white/90"}`}>
                {label}
              </span>
            </button>
          );
        })}
      </div>
    </fieldset>
  );
}

// ─── GroupSection ─────────────────────────────────────────────────────────────

interface GroupSectionProps {
  group: ApiSupplementGroup;
  selected: string[];
  hasError: boolean;
  onChange: (groupId: string, newSelected: string[]) => void;
}

function GroupSection({ group, selected, hasError, onChange }: GroupSectionProps) {
  if (group.name === "Choisissez vos crudités") {
    return <CruditesGroupSection group={group} selected={selected} hasError={hasError} onChange={onChange} />;
  }
  if (group.name === "Ou sélection individuelle") return null;

  const isRadio = group.max_selection === 1;
  const isMulti = group.max_selection > 1;
  const atMax = isMulti && selected.length >= group.max_selection;
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

  const activeSupplements = group.supplements.filter((s) => s.is_active).sort((a, b) => a.sort_order - b.sort_order);
  const hasImages = activeSupplements.some((s) => s.image_url);

  return (
    <fieldset id={sectionId} className={`section-box ${hasError ? "section-error" : ""}`}>
      <div className="section-legend">
        <span className={`font-bold uppercase tracking-widest text-sm transition-colors ${hasError ? "text-red-400" : "text-white"}`}>
          {group.name}
        </span>
        {isMulti && (
          <span className="text-xs px-2 py-0.5 rounded bg-red-500/20 text-red-400 border border-red-500/30">
            MAX {group.max_selection}
          </span>
        )}
        {group.is_required ? (
          <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs uppercase tracking-wider border h-5 ${hasError ? "border-red-500/80 bg-red-500/10 text-red-400" : "border-red-500/80 bg-red-500/10 text-red-400"}`}>
            Obligatoire
          </span>
        ) : (
          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs uppercase tracking-wider border h-5 border-white/20 bg-white/5 text-white/40">
            Optionnel
          </span>
        )}
        {group.description && <span className="text-white/35 text-xs italic">{group.description}</span>}
      </div>

      {hasImages ? (
        <div className="grid grid-cols-2 gap-1.5">
          {activeSupplements.map((sup) => {
            console.log(sup.name);
                      const isSauceGroup = group.name.toLowerCase().includes("sauce");
            const displayLabel = isSauceGroup ? cleanDisplayName(sup.name) : sup.name.trim();
            return(
            
            <ImageOption
              key={sup.id}
              label={displayLabel}
              imageSrc={sup.image_url!}
              selected={selected.includes(sup.id)}
              price={sup.price > 0 ? sup.price : undefined}
              disabled={atMax && !selected.includes(sup.id)}
              hasError={hasError && !selected.includes(sup.id)}
              onClick={() => toggle(sup.id)}
              isSpicy={isSauceGroup && isSpicyName(sup.name)}
            />
          )
          })}
        </div>
      ) : (
        <div className="flex flex-wrap gap-2">
          {activeSupplements.map((sup) => {
        
            
  
            return (
            <div key={sup.id} className="flex items-center gap-1">
              <OptionChip
                label={sup.name.trim()}
                selected={selected.includes(sup.id)}
                disabled={atMax && !selected.includes(sup.id)}
                hasError={hasError && !selected.includes(sup.id)}
                onClick={() => toggle(sup.id)}
              />
           
              {sup.price > 0 && (
                <span className="text-xs font-semibold" style={{ color: "#DC2626" }}>
                  +{sup.price.toFixed(2)}€
                </span>
              )}
            </div>
            );
          })}
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

  // ── Formule Menu state ────────────────────────────────────────────────────
  const [menuFormule, setMenuFormule] = useState(false);
  const [isStudent, setIsStudent] = useState(false);
  const [selectedBoisson, setSelectedBoisson] = useState<string | null>(null);
  const [boissonError, setBoissonError] = useState(false);

  const scrollRef      = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  const supplementGroups: ApiSupplementGroup[] = (product as any)?.supplementGroups ?? [];

  // Non-boisson groups for the normal section (filter out any API boisson group)
  const nonBoissonGroups = supplementGroups.filter((g) => !isBoissonGroup(g));

  // ── Reset when product changes ────────────────────────────────────────────
  useEffect(() => {
    if (product) {
      setQuantity(1);
      setErrors(new Set());
      setMenuFormule(false);
      setIsStudent(false);
      setSelectedBoisson(null);
      setBoissonError(false);
      setGroupSelections(buildDefaultSelections(nonBoissonGroups));
      setTimeout(() => { scrollRef.current?.scrollTo({ top: 0 }); }, 50);
    }
  }, [product]);

  // ── Clear boisson error when selection made ───────────────────────────────
  useEffect(() => {
    if (selectedBoisson) setBoissonError(false);
  }, [selectedBoisson]);

  // ── Auto-clear group errors when valid ────────────────────────────────────
  useEffect(() => {
    setErrors((prev) => {
      if (prev.size === 0) return prev;
      const next = new Set(prev);
      nonBoissonGroups.forEach((g) => {
        if (!g.is_required) return;
        const sel = groupSelections[g.id] ?? [];
        if (sel.includes("__nature__") || sel.length >= Math.max(1, g.min_selection)) {
          next.delete(g.id);
        }
      });
      return next;
    });
  }, [groupSelections, nonBoissonGroups]);

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

  // ── Supplement surcharge (non-boisson groups only) ────────────────────────
  const supplementSurcharge = (() => {
    let extra = 0;
    nonBoissonGroups.forEach((g) => {
      (groupSelections[g.id] ?? []).filter((id) => id !== "__nature__").forEach((supId) => {
        const sup = g.supplements.find((s) => s.id === supId);
        if (sup) extra += sup.price;
      });
    });
    return extra;
  })();

  // ── Boisson surcharge (extra cost above base formule price) ───────────────
  const boissonSurcharge = (() => {
    if (!menuFormule || !selectedBoisson) return 0;
    const b = HARDCODED_BOISSONS.find((b) => b.id === selectedBoisson);
    return b ? b.extra : 0;
  })();

  // ── Formule net price (base +2€, -1€ if student, +boisson surcharge) ─────
  const formuleSurcharge = menuFormule
    ? FORMULE_PRICE - (isStudent ? STUDENT_DISCOUNT : 0) + boissonSurcharge
    : 0;

  const totalPrice = product ? (product.price + supplementSurcharge + formuleSurcharge) * quantity : 0;

  // ── Validation ────────────────────────────────────────────────────────────
  const handleAdd = () => {
    if (!product) return;

    // Validate non-boisson required groups
    const failedGroups = nonBoissonGroups.filter((g) => {
      if (!g.is_required) return false;
      const sel = groupSelections[g.id] ?? [];
      if (sel.includes("__nature__")) return false;
      return sel.length < Math.max(1, g.min_selection);
    });

    // Validate boisson if formule is active
    let hasBoissonError = false;
    if (menuFormule && !selectedBoisson) {
      hasBoissonError = true;
    }

    if (failedGroups.length > 0 || hasBoissonError) {
      setErrors(new Set(failedGroups.map((g) => g.id)));
      setBoissonError(hasBoissonError);

      // Scroll to first error
      let firstEl: Element | null = null;
      if (hasBoissonError) {
        firstEl = scrollRef.current?.querySelector("#section-boisson") ?? null;
      }
      if (!firstEl && failedGroups.length > 0) {
        firstEl = scrollRef.current?.querySelector(`#section-group-${failedGroups[0].id}`) ?? null;
      }
      if (firstEl && scrollRef.current) {
        scrollRef.current.scrollTo({
          top: (firstEl as HTMLElement).offsetTop - 16,
          behavior: "smooth",
        });
      }
      return;
    }

    // Build named selections
    const allSelectedNames: string[] = [];
    const namedGroupSelections: Record<string, string[]> = {};

    nonBoissonGroups.forEach((g) => {
      const selectedIds = (groupSelections[g.id] ?? []).filter((id) => id !== "__nature__");
      const selectedNames = selectedIds.map((id) => {
        const sup = g.supplements.find((s) => s.id === id);
        return sup ? sup.name.trim() : id;
      });
      if (selectedNames.length > 0) {
        namedGroupSelections[g.name] = selectedNames;
        allSelectedNames.push(...selectedNames);
      }
    });

    // Add boisson to cart data if formule active
    let selectedBoissonName: string | undefined;
    if (menuFormule && selectedBoisson) {
      const b = HARDCODED_BOISSONS.find((b) => b.id === selectedBoisson);
      if (b) {
        selectedBoissonName = b.name;
        namedGroupSelections["Boisson (formule)"] = [selectedBoissonName];
        allSelectedNames.push(selectedBoissonName);
      }
    }

    onAddToCart(product, quantity, {
      crudites: [],
      bread: "",
      sauces: [],
      menuFormule,
      isStudent: menuFormule ? isStudent : false,
      supplements: allSelectedNames,
      groupSelections: namedGroupSelections,
      supplementSurcharge: supplementSurcharge + formuleSurcharge,
      selectedBoisson: selectedBoissonName,
    });
    onClose();
  };

  if (!isOpen || !product) return null;

  const hasCrudites = nonBoissonGroups.some((g) => g.name === "Choisissez vos crudités");

  const visibleGroups = nonBoissonGroups
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
        @keyframes pulse-red {
          0%, 100% { background-color: rgba(220, 38, 38, 0); }
          50%       { background-color: rgba(220, 38, 38, 0.12); }
        }
        .error-pulse-chip { animation: pulse-red 1.4s ease-in-out infinite; }
        .error-pulse-img  { animation: pulse-red 1.4s ease-in-out infinite; }
        .modal-animate { animation: modal-in 0.25s cubic-bezier(0.16,1,0.3,1) forwards; }
        .section-box {
          position: relative;
          border-radius: 12px;
          border: 1.5px solid rgba(255,255,255,0.08);
          padding: 0 1rem 1rem 1rem;
        }
        .section-box.section-error {
          border-color: rgba(220, 38, 38, 0.85);
          box-shadow: 0 0 20px rgba(220,38,38,0.12);
        }
        .section-legend {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          flex-wrap: wrap;
          margin-top: -0.65rem;
          margin-bottom: 1rem;
          padding: 0 0.25rem;
          background: #09090b;
          width: fit-content;
        }
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
          <div className="flex items-center justify-between px-4 py-3.5 shrink-0" style={{ backgroundColor: "#DC2626" }}>
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
            <div className="p-5 space-y-6 bg-black">

              {product.imageSrc && (
                <div className="relative w-full aspect-[4/3] overflow-hidden rounded-xl bg-black">
                  <img
                    alt={product.name}
                    src={"https://resto.devsolve-agency.com:8443/" + product.imageSrc}
                    className="absolute inset-0 w-full h-full object-contain"
                  />
                </div>
              )}

              {(product.mainIngredient || product.description) && (
                <div className="space-y-1 px-1">
                  {product.mainIngredient && (
                    <p className="text-white/60 text-base leading-relaxed">{product.mainIngredient}</p>
                  )}
                  {product.description && (
                    <p className="text-white/40 text-xs flex items-center gap-1.5">
                      <span className="font-bold text-red-500">+ / −</span>
                      {product.description}
                    </p>
                  )}
                </div>
              )}

              {hasCrudites && (
                <div className="text-white/40 font-sans text-xs flex items-center gap-2">
                  <span className="font-bold text-[#DC2626]">+ / -</span>
                  <span>Crudités : Salade, Tomate, Oignon</span>
                </div>
              )}

              <div>
                <div className="font-black text-3xl" style={{ color: "#DC2626" }}>
                  {product.price.toFixed(2)}€
                </div>
                <div className="text-xs text-white/50 italic mb-4">
                  Allergènes : voir <a className="text-red-600 underline decoration-dotted underline-offset-2 font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-sm" href="/#">tableau</a> ou en restaurant
                </div>
              </div>

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

              {/* ── Formule Menu section — shown after all other groups ── */}
              <>
                <Separator />
                <FormuleMenuSection
                  menuFormule={menuFormule}
                  isStudent={isStudent}
                  selectedBoisson={selectedBoisson}
                  boissonError={boissonError}
                  onToggleFormule={(v) => {
                    setMenuFormule(v);
                    if (!v) {
                      setIsStudent(false);
                      setSelectedBoisson(null);
                      setBoissonError(false);
                    }
                  }}
                  onToggleStudent={setIsStudent}
                  onSelectBoisson={setSelectedBoisson}
                />
              </>

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

              <button
                onClick={handleAdd}
                className="flex-1 flex items-center justify-between h-12 px-5 rounded-lg text-white font-bold transition-all duration-300 focus-visible:outline-none focus-visible:ring-2"
                style={{
                  background: "linear-gradient(135deg, #DC2626, #DC2626)",
                  boxShadow: "0 0 20px rgba(228,88,53,0.5)"
                }}
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