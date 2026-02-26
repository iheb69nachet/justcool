import { useEffect, useRef } from "react";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface CartItem {
  id: string;          // unique cart line id (product id + options hash)
  productId: string;
  name: string;
  price: number;       // unit price already factoring menu/student
  quantity: number;
  options: {
    bread?: string;
    sauces?: string[];
    crudites?: string[];
    menuFormule?: boolean;
    isStudent?: boolean;
    supplements?: string[];
  };
}

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onUpdateQty: (id: string, qty: number) => void;
  onRemove: (id: string) => void;
  dineMode: "surplace" | "emporter";
  onDineModeChange: (mode: "surplace" | "emporter") => void;
}

// ─── Icons ────────────────────────────────────────────────────────────────────

const BagIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24"
    fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M16 10a4 4 0 0 1-8 0" /><path d="M3.103 6.034h17.794" />
    <path d="M3.4 5.467a2 2 0 0 0-.4 1.2V20a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6.667a2 2 0 0 0-.4-1.2l-2-2.667A2 2 0 0 0 17 2H7a2 2 0 0 0-1.6.8z" />
  </svg>
);

const MinusIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24"
    fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M5 12h14" />
  </svg>
);

const PlusIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24"
    fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M5 12h14" /><path d="M12 5v14" />
  </svg>
);

const TrashIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24"
    fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M10 11v6" /><path d="M14 11v6" />
    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6" />
    <path d="M3 6h18" /><path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
  </svg>
);

const CloseIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24"
    fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M18 6 6 18" /><path d="m6 6 12 12" />
  </svg>
);

const PhoneIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24"
    fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M13.832 16.568a1 1 0 0 0 1.213-.303l.355-.465A2 2 0 0 1 17 15h3a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2A18 18 0 0 1 2 4a2 2 0 0 1 2-2h3a2 2 0 0 1 2 2v3a2 2 0 0 1-.8 1.6l-.468.351a1 1 0 0 0-.292 1.233 14 14 0 0 0 6.392 6.384" />
  </svg>
);

const WhatsAppIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" width="22" height="22" aria-hidden="true">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
  </svg>
);

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatPrice(n: number) {
  return n.toFixed(2).replace(".", ",") + "€";
}

function buildOptionSummary(options: CartItem["options"]): string[] {
  const lines: string[] = [];
  if (options.bread) lines.push(`Pain: ${options.bread}`);
  if (options.sauces?.length) lines.push(`Sauce${options.sauces.length > 1 ? "s" : ""}: ${options.sauces.join(", ")}`);
  if (options.crudites?.length) lines.push(`Crudités: ${options.crudites.join(", ")}`);
  if (options.menuFormule) lines.push("Formule menu");
  if (options.isStudent) lines.push("Tarif étudiant");

  // Named group selections: { "Cuisson": ["Saignant"], "Sauce": ["BBQ", "Ketchup"] }
  const gs = options.groupSelections as Record<string, string[]> | undefined;
  if (gs && Object.keys(gs).length > 0) {
    Object.entries(gs).forEach(([groupName, items]) => {
      if (Array.isArray(items) && items.length) {
        lines.push(`${groupName}: ${items.join(", ")}`);
      }
    });
  } else if (options.supplements?.length) {
    // Fallback for older cart entries
    lines.push(`Suppléments: ${options.supplements.join(", ")}`);
  }

  return lines;
}

function buildWhatsAppMessage(items: CartItem[], dineMode: "surplace" | "emporter") {
  const mode = dineMode === "surplace" ? "Sur Place" : "À Emporter";
  const lines = items.map((item) => {
    const opts = buildOptionSummary(item.options);
    const optStr = opts.length ? `\n    • ${opts.join("\n    • ")}` : "";
    return `• ${item.quantity}× ${item.name} — ${formatPrice(item.price * item.quantity)}${optStr}`;
  });
  const total = items.reduce((s, i) => s + i.price * i.quantity, 0);
  return encodeURIComponent(
    `Bonjour Just Cool 👋\n\nJe souhaite commander (${mode}) :\n\n${lines.join("\n\n")}\n\n*Total : ${formatPrice(total)}*`
  );
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function CartDrawer({
  isOpen,
  onClose,
  items,
  onUpdateQty,
  onRemove,
  dineMode,
  onDineModeChange,
}: CartDrawerProps) {
  const drawerRef = useRef<HTMLDivElement>(null);
  const total = items.reduce((s, i) => s + i.price * i.quantity, 0);
  const isEmpty = items.length === 0;

  // Lock body scroll when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  // Close on Escape
  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isOpen, onClose]);

  const waNumber = "33497125303"; // French number format for WA
  const waMsg = buildWhatsAppMessage(items, dineMode);
  const waUrl = `https://wa.me/${waNumber}?text=${waMsg}`;

  return (
    <>
      <style>{`
        .cart-drawer-backdrop {
          position: fixed;
          inset: 0;
          z-index: 140;
          background: rgba(0,0,0,0.6);
          backdrop-filter: blur(2px);
          opacity: 0;
          pointer-events: none;
          transition: opacity 0.3s ease;
        }
        .cart-drawer-backdrop.open {
          opacity: 1;
          pointer-events: auto;
        }

        .cart-drawer {
          position: fixed;
          inset-block: 0;
          right: 0;
          z-index: 150;
          height: 100%;
          width: 100%;
          max-width: 28rem; /* sm:max-w-md */
          display: flex;
          flex-direction: column;
          background: rgba(0,0,0,0.65);
          backdrop-filter: blur(24px);
          -webkit-backdrop-filter: blur(24px);
          border-left: 1px solid rgba(255,255,255,0.1);
          box-shadow: -8px 0 40px rgba(0,0,0,0.5);
          transform: translateX(100%);
          transition: transform 0.35s cubic-bezier(0.32, 0.72, 0, 1);
          will-change: transform;
        }
        .cart-drawer.open {
          transform: translateX(0);
        }

        .cart-scrollarea {
          flex: 1;
          overflow-y: auto;
          overscroll-behavior: contain;
          scrollbar-width: thin;
          scrollbar-color: rgba(255,255,255,0.12) transparent;
        }
        .cart-scrollarea::-webkit-scrollbar { width: 4px; }
        .cart-scrollarea::-webkit-scrollbar-track { background: transparent; }
        .cart-scrollarea::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.12); border-radius: 4px; }

        .cart-item {
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 0.75rem;
          padding: 0.75rem;
          display: flex;
          gap: 0.75rem;
          transition: background 0.2s;
        }
        .cart-item:hover { background: rgba(255,255,255,0.09); }

        .qty-btn {
          width: 1.75rem; height: 1.75rem;
          display: flex; align-items: center; justify-content: center;
          background: rgba(255,255,255,0.1);
          border: none;
          border-radius: 0.375rem;
          color: #fff;
          cursor: pointer;
          transition: background 0.15s;
        }
        .qty-btn:hover { background: rgba(255,255,255,0.22); }
        .qty-btn:disabled { opacity: 0.4; cursor: not-allowed; }

        .dine-toggle {
          display: flex;
          background: rgba(39,39,42,0.5);
          backdrop-filter: blur(8px);
          border: 1px solid rgba(255,255,255,0.05);
          border-radius: 0.75rem;
          padding: 0.25rem;
          margin-bottom: 0.75rem;
        }
        .dine-btn {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.4rem;
          border: none;
          border-radius: 0.6rem;
          font-size: 0.875rem;
          font-weight: 700;
          padding: 0.6rem 1rem;
          cursor: pointer;
          transition: background 0.2s, color 0.2s, box-shadow 0.2s;
        }
        .dine-btn-inactive {
          background: transparent;
          color: rgba(255,255,255,0.45);
        }
        .dine-btn-inactive:hover { color: #fff; }
        .dine-btn-active {
          background: linear-gradient(135deg, #dc2626, #b91c1c);
          color: #fff;
          box-shadow: 0 2px 12px rgba(220,38,38,0.4);
        }

        .wa-btn {
          width: 100%;
          height: 3.5rem;
          display: flex; align-items: center; justify-content: center; gap: 0.6rem;
          background: #25D366;
          color: #000;
          font-weight: 700;
          font-size: 0.875rem;
          letter-spacing: 0.07em;
          text-transform: uppercase;
          border: none;
          border-radius: 0.75rem;
          cursor: pointer;
          text-decoration: none;
          transition: background 0.2s, transform 0.15s;
        }
        .wa-btn:hover { background: #22c35e; transform: translateY(-1px); }
        .wa-btn:active { transform: translateY(0); }
        .wa-btn:disabled { opacity: 0.45; pointer-events: none; }

        .phone-btn {
          width: 100%;
          height: 3.5rem;
          display: flex; align-items: center; justify-content: center; gap: 0.6rem;
          background: transparent;
          color: #fff;
          font-weight: 700;
          font-size: 0.875rem;
          letter-spacing: 0.07em;
          text-transform: uppercase;
          border: 1px solid rgba(255,255,255,0.2);
          border-radius: 0.75rem;
          cursor: pointer;
          text-decoration: none;
          transition: background 0.2s, border-color 0.2s;
        }
        .phone-btn:hover { background: rgba(255,255,255,0.08); border-color: rgba(255,255,255,0.4); }

        .close-btn {
          position: absolute;
          top: 0.375rem; right: 0.5rem;
          width: 3rem; height: 3rem;
          display: flex; align-items: center; justify-content: center;
          background: transparent;
          border: none;
          color: rgba(255,255,255,0.6);
          border-radius: 9999px;
          cursor: pointer;
          transition: background 0.15s, color 0.15s;
        }
        .close-btn:hover { background: rgba(255,255,255,0.08); color: #fff; }

        .trash-btn {
          background: transparent;
          border: none;
          color: rgba(255,255,255,0.35);
          cursor: pointer;
          padding: 0.25rem;
          border-radius: 0.375rem;
          transition: color 0.2s;
          display: flex; align-items: center;
        }
        .trash-btn:hover { color: #dc2626; }

        .empty-state {
          flex: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 1rem;
          padding: 2rem;
          color: rgba(255,255,255,0.35);
          text-align: center;
        }
        .empty-bag {
          width: 4rem; height: 4rem;
          display: flex; align-items: center; justify-content: center;
          background: rgba(255,255,255,0.05);
          border-radius: 9999px;
        }
      `}</style>

      {/* Backdrop */}
      <div
        className={`cart-drawer-backdrop ${isOpen ? "open" : ""}`}
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Drawer */}
      <div
        ref={drawerRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="cart-title"
        aria-describedby="cart-desc"
        className={`cart-drawer ${isOpen ? "open" : ""}`}
        tabIndex={-1}
      >
        {/* Header */}
        <div
          style={{ position: "relative" }}
          className="flex flex-col gap-1 p-4 border-b border-white/10"
          style={{ background: "rgba(255,255,255,0.04)" }}
        >
          <div className="flex items-center gap-2" id="cart-title">
            <span className="text-red-500"><BagIcon /></span>
            <h3 className="font-bold text-white text-xl">Mon Panier</h3>
            {!isEmpty && (
              <span style={{
                marginLeft: "auto",
                background: "rgba(220,38,38,0.15)",
                border: "1px solid rgba(220,38,38,0.3)",
                color: "#ef4444",
                fontSize: "0.75rem",
                fontWeight: 700,
                padding: "2px 10px",
                borderRadius: "9999px",
                marginRight: "3rem",
              }}>
                {items.reduce((s, i) => s + i.quantity, 0)} article{items.reduce((s, i) => s + i.quantity, 0) > 1 ? "s" : ""}
              </span>
            )}
          </div>
          <p id="cart-desc" className="sr-only">Récapitulatif de votre commande et validation du panier.</p>

          <button className="close-btn" onClick={onClose} aria-label="Fermer le panier">
            <CloseIcon />
          </button>
        </div>

        {/* Body */}
        {isEmpty ? (
          <div className="empty-state">
            <div className="empty-bag">
              <BagIcon />
            </div>
            <div>
              <p style={{ fontWeight: 600, color: "rgba(255,255,255,0.6)", marginBottom: "0.25rem" }}>Votre panier est vide</p>
              <p style={{ fontSize: "0.875rem" }}>Ajoutez des plats depuis le menu !</p>
            </div>
          </div>
        ) : (
          <div className="cart-scrollarea p-4">
            <ul className="space-y-3 list-none p-0 m-0" aria-label="Articles dans votre panier">
              {items.map((item) => {
                const summary = buildOptionSummary(item.options);
                return (
                  <li key={item.id}>
                    <div className="cart-item">
                      <div style={{ flex: 1, minWidth: 0 }}>
                        {/* Name + price */}
                        <div className="flex justify-between items-start">
                          <h4 style={{
                            fontWeight: 700, color: "#fff", fontSize: "0.875rem",
                            whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
                            paddingRight: "0.5rem", flex: 1,
                          }}>
                            {item.name}
                          </h4>
                          <span style={{ fontWeight: 900, color: "#dc2626", fontSize: "0.875rem", flexShrink: 0 }}>
                            {formatPrice(item.price * item.quantity)}
                          </span>
                        </div>

                        {/* Options summary */}
                        {summary.length > 0 && (
                          <div style={{ color: "rgba(255,255,255,0.55)", fontSize: "0.75rem", marginTop: "0.25rem", lineHeight: 1.6 }}>
                            {summary.map((l, i) => <p key={i}>{l}</p>)}
                          </div>
                        )}

                        {/* Quantity + delete */}
                        <div className="flex items-center justify-between" style={{ marginTop: "0.75rem" }}>
                          <div style={{
                            display: "flex", alignItems: "center", gap: "0.75rem",
                            background: "rgba(0,0,0,0.4)", borderRadius: "0.5rem",
                            padding: "0.25rem", border: "1px solid rgba(255,255,255,0.05)",
                          }}>
                            <button
                              className="qty-btn"
                              onClick={() => item.quantity <= 1 ? onRemove(item.id) : onUpdateQty(item.id, item.quantity - 1)}
                              aria-label={`Diminuer la quantité de ${item.name}`}
                            >
                              <MinusIcon />
                            </button>
                            <span style={{ fontSize: "0.875rem", fontWeight: 600, minWidth: "1rem", textAlign: "center" }}
                              aria-live="polite">
                              {item.quantity}
                            </span>
                            <button
                              className="qty-btn"
                              onClick={() => onUpdateQty(item.id, item.quantity + 1)}
                              aria-label={`Augmenter la quantité de ${item.name}`}
                            >
                              <PlusIcon />
                            </button>
                          </div>

                          <button
                            className="trash-btn"
                            onClick={() => onRemove(item.id)}
                            aria-label={`Supprimer ${item.name} du panier`}
                          >
                            <TrashIcon />
                          </button>
                        </div>
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>
        )}

        {/* Footer */}
        <div
          className="p-4 border-t border-white/10 space-y-4"
          style={{ background: "rgba(255,255,255,0.04)" }}
        >
          {/* Dine mode toggle */}
          <div className="dine-toggle" role="radiogroup" aria-label="Mode de consommation">
            {(["surplace", "emporter"] as const).map((mode) => (
              <button
                key={mode}
                role="radio"
                aria-checked={dineMode === mode}
                className={`dine-btn ${dineMode === mode ? "dine-btn-active" : "dine-btn-inactive"}`}
                onClick={() => onDineModeChange(mode)}
              >
                <span aria-hidden="true">{mode === "surplace" ? "🍽️" : "🛍️"}</span>
                {mode === "surplace" ? "Sur Place" : "À Emporter"}
              </button>
            ))}
          </div>

          {/* Total */}
          <div className="flex items-center justify-between px-1" aria-live="polite" aria-atomic="true">
            <span style={{ color: "rgba(255,255,255,0.5)", fontWeight: 400 }}>Total de la commande</span>
            <span style={{ fontWeight: 900, color: "#dc2626", fontSize: "1.75rem", fontFamily: "sans-serif" }}>
              {formatPrice(total)}
            </span>
          </div>

          {/* CTA buttons */}
          <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
            <a
              href={isEmpty ? undefined : waUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="wa-btn"
              style={isEmpty ? { opacity: 0.45, pointerEvents: "none" } : {}}
              aria-disabled={isEmpty}
            >
              <WhatsAppIcon />
              Commander sur WhatsApp
            </a>

            <a href="tel:0497125303" className="phone-btn">
              <span style={{ color: "rgba(255,255,255,0.5)" }}><PhoneIcon /></span>
              Appeler (04 97 12 53 03)
            </a>
          </div>
        </div>
      </div>
    </>
  );
}