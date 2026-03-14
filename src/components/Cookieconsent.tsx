import { useState, useEffect, useRef } from "react";

interface CookieSettings {
  essential: boolean;
  analytics: boolean;
}

function CookieIcon({ size = 22 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <circle cx="8.5" cy="8.5" r="1.2" fill="currentColor" stroke="none" />
      <circle cx="15" cy="10" r="1" fill="currentColor" stroke="none" />
      <circle cx="9" cy="14.5" r="1" fill="currentColor" stroke="none" />
      <circle cx="14.5" cy="15" r="1.2" fill="currentColor" stroke="none" />
    </svg>
  );
}

function Toggle({
  checked,
  onChange,
  disabled,
}: {
  checked: boolean;
  onChange?: (v: boolean) => void;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      disabled={disabled}
      onClick={() => !disabled && onChange?.(!checked)}
      style={{
        width: 52,
        height: 30,
        borderRadius: 999,
        background: checked ? "#E45835" : "#3a3a3a",
        border: "none",
        cursor: disabled ? "not-allowed" : "pointer",
        opacity: disabled ? 0.6 : 1,
        transition: "background 0.2s",
        outline: "none",
        position: "relative",
        flexShrink: 0,
      }}
    >
      <span
        style={{
          position: "absolute",
          top: 3,
          left: checked ? 25 : 3,
          width: 24,
          height: 24,
          borderRadius: "50%",
          background: "#fff",
          transition: "left 0.2s cubic-bezier(0.34,1.56,0.64,1)",
          boxShadow: "0 1px 4px rgba(0,0,0,0.3)",
        }}
      />
    </button>
  );
}

type View = "main" | "personalise";

export default function CookieConsent() {
  const [modalOpen, setModalOpen] = useState(false);
  const [view, setView] = useState<View>("personalise");
  const [animDir, setAnimDir] = useState<"forward" | "back">("forward");
  const [settings, setSettings] = useState<CookieSettings>({
    essential: true,
    analytics: true,
  });
  const modalRef = useRef<HTMLDivElement>(null);

  const goTo = (v: View, dir: "forward" | "back") => {
    setAnimDir(dir);
    setView(v);
  };

  const handleOpen = () => {
    setView("main");
    setAnimDir("forward");
    setModalOpen(true);
  };

  useEffect(() => {
    if (!modalOpen) return;
    const handle = (e: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
        setModalOpen(false);
      }
    };
    document.addEventListener("mousedown", handle);
    return () => document.removeEventListener("mousedown", handle);
  }, [modalOpen]);

  useEffect(() => {
    if (!modalOpen) return;
    const handle = (e: KeyboardEvent) => {
      if (e.key === "Escape") setModalOpen(false);
    };
    document.addEventListener("keydown", handle);
    return () => document.removeEventListener("keydown", handle);
  }, [modalOpen]);

  const btnBase: React.CSSProperties = {
    height: 50,
    borderRadius: 14,
    fontWeight: 700,
    fontSize: 15,
    cursor: "pointer",
    letterSpacing: "0.2px",
    border: "none",
    transition: "opacity 0.15s, background 0.15s",
    fontFamily: "inherit",
  };

  return (
    <>
      <style>{`
      .cookies{
      font-family:'framer-sans', sans-serif !important
      }
        @keyframes modal-in {
          from { opacity: 0; transform: translateY(14px) scale(0.97); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes slide-left-in {
          from { opacity: 0; transform: translateX(28px); }
          to   { opacity: 1; transform: translateX(0); }
        }
        @keyframes slide-right-in {
          from { opacity: 0; transform: translateX(-28px); }
          to   { opacity: 1; transform: translateX(0); }
        }
        .cookie-modal {
          animation: modal-in 0.3s cubic-bezier(0.34, 1.2, 0.64, 1) forwards;
        }
        .view-forward {
          animation: slide-left-in 0.22s cubic-bezier(0.34, 1.2, 0.64, 1) forwards;
        }
        .view-back {
          animation: slide-right-in 0.22s cubic-bezier(0.34, 1.2, 0.64, 1) forwards;
        }
        .cookie-trigger:hover .cookie-ring {
          box-shadow: 0 0 0 3px rgba(228,88,53,0.35);
        }
        .red-btn:hover { opacity: 0.85 !important; }
        .grey-btn:hover { background: #2e2e2e !important; }
      `}</style>

      <div className="fixed z-50 cookies" style={{ bottom: "2px", left: "1.5rem" }}>

        {modalOpen && (
          <div
            ref={modalRef}
            className="cookie-modal fixed w-[93vw] md:w-[20vw]"
            style={{
              bottom: "1.5rem",
              right: "1.5rem",
              background: "#141414",
              borderRadius: 22,
              padding: "28px 24px 24px",
              boxShadow: "0 24px 60px rgba(0,0,0,0.75), 0 0 0 1px rgba(255,255,255,0.07)",
           
              overflow: "hidden",
            }}
          >
            {/* ── MAIN VIEW ── */}
            {view === "main" && (
              <div className={animDir === "back" ? "view-back" : "view-forward"}>
                <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 18 }}>
                  <span style={{ color: "#E45835" }}><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-cookie w-5 h-5 text-brand-red" aria-hidden="true"><path d="M12 2a10 10 0 1 0 10 10 4 4 0 0 1-5-5 4 4 0 0 1-5-5"></path><path d="M8.5 8.5v.01"></path><path d="M16 15.5v.01"></path><path d="M12 12v.01"></path><path d="M11 17v.01"></path><path d="M7 14v.01"></path></svg>
</span>
                  <h2 style={{ color: "#fff", fontSize: 21, fontWeight: 800, margin: 0, letterSpacing: "-0.4px" }}>
                    Gestion des Cookies
                  </h2>
                </div>

                <p style={{ color: "#999", fontSize: 14, lineHeight: 1.65, margin: "0 0 26px" }}>
                  Nous utilisons des cookies pour améliorer votre expérience et analyser les visites (Google & Vercel Analytics). Conformément au RGPD, votre choix est libre, mémorisé pendant 6 mois et modifiable à tout moment.
                </p>

                <div style={{ display: "flex", gap: 10, marginBottom: 10 }}>
                  <button
                    className="red-btn"
                    onClick={() => setModalOpen(false)}
                    style={{ ...btnBase, flex: 1, background: "#E45835", color: "#fff" }}
                  >
                    Tout accepter
                  </button>
                  <button
                    className="red-btn"
                    onClick={() => setModalOpen(false)}
                    style={{ ...btnBase, flex: 1, background: "#b02a1a", color: "#fff" }}
                  >
                    Tout refuser
                  </button>
                </div>

                <button
                  className="grey-btn"
                  onClick={() => goTo("personalise", "forward")}
                  style={{
                    ...btnBase,
                    width: "100%",
                    background: "#222",
                    color: "#ccc",
                    border: "1px solid rgba(255,255,255,0.08)",
                    marginBottom: 18,
                    fontSize: 14,
                  }}
                >
                  Personnaliser mes choix
                </button>

                <p style={{ textAlign: "center", margin: 0 }}>
                  <a href="#" style={{ color: "#555", fontSize: 12, textDecoration: "underline", textUnderlineOffset: 3 }}>
                    Politique de confidentialité
                  </a>
                </p>
              </div>
            )}

            {/* ── PERSONALISE VIEW ── */}
            {view === "personalise" && (
              <div className={animDir === "forward" ? "view-forward" : "view-back"}>
                <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 18 }}>
                  <span style={{ color: "#E45835" }}><CookieIcon size={26} /></span>
                  <h2 style={{ color: "#fff", fontSize: 21, fontWeight: 800, margin: 0, letterSpacing: "-0.4px" }}>
                    Personnalisation
                  </h2>
                </div>

                <p style={{ color: "#999", fontSize: 14, lineHeight: 1.65, margin: "0 0 20px" }}>
                  Choisissez les types de cookies que vous souhaitez autoriser. Les cookies essentiels ne peuvent pas être désactivés.
                </p>

                <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 22 }}>
                  <div style={{ background: "#1e1e1e", borderRadius: 14, padding: "14px 16px", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12 }}>
                    <div>
                      <p style={{ color: "#fff", fontWeight: 700, fontSize: 14, margin: "0 0 3px" }}>Cookies Essentiels</p>
                      <p style={{ color: "#666", fontSize: 12, margin: 0 }}>Nécessaires au fonctionnement du site.</p>
                    </div>
                    <Toggle checked={settings.essential} disabled />
                  </div>

                  <div style={{ background: "#1e1e1e", borderRadius: 14, padding: "14px 16px", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12 }}>
                    <div>
                      <p style={{ color: "#fff", fontWeight: 700, fontSize: 14, margin: "0 0 3px" }}>Cookies Analytiques</p>
                      <p style={{ color: "#666", fontSize: 12, margin: 0 }}>Google Analytics & Vercel Analytics.</p>
                    </div>
                    <Toggle
                      checked={settings.analytics}
                      onChange={(v) => setSettings((s) => ({ ...s, analytics: v }))}
                    />
                  </div>
                </div>

                <div style={{ display: "flex", gap: 10, marginBottom: 18 }}>
                  <button
                    className="grey-btn"
                    onClick={() => goTo("main", "back")}
                    style={{ ...btnBase, flex: 1, background: "#222", color: "#ccc", border: "1px solid rgba(255,255,255,0.08)", fontSize: 14 }}
                  >
                    Retour
                  </button>
                  <button
                    className="red-btn"
                    onClick={() => setModalOpen(false)}
                    style={{ ...btnBase, flex: 1.6, background: "#E45835", color: "#fff" }}
                  >
                    Confirmer
                  </button>
                </div>

                <p style={{ textAlign: "center", margin: 0 }}>
                  <a href="#" style={{ color: "#555", fontSize: 12, textDecoration: "underline", textUnderlineOffset: 3 }}>
                    Politique de confidentialité
                  </a>
                </p>
              </div>
            )}
          </div>
        )}

        {/* Cookie trigger button */}
        <button
          className="cookie-trigger"
          onClick={handleOpen}
          aria-label="Paramètres cookies"
          style={{
            width: 44,
            height: 44,
            borderRadius: "50%",
            background: modalOpen ? "#2a2a2a" : "#1a1a1a",
            border: `1px solid ${modalOpen ? "rgba(228,88,53,0.5)" : "rgba(255,255,255,0.1)"}`,
            color: modalOpen ? "#E45835" : "#aaa",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            transition: "color 0.2s, border-color 0.2s, background 0.2s",
          }}
        >
          <span className="cookie-ring" style={{
            width: "100%", height: "100%", borderRadius: "50%",
            display: "flex", alignItems: "center", justifyContent: "center",
            transition: "box-shadow 0.2s",
          }}>
<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-cookie w-5 h-5 text-brand-red" aria-hidden="true"><path d="M12 2a10 10 0 1 0 10 10 4 4 0 0 1-5-5 4 4 0 0 1-5-5"></path><path d="M8.5 8.5v.01"></path><path d="M16 15.5v.01"></path><path d="M12 12v.01"></path><path d="M11 17v.01"></path><path d="M7 14v.01"></path></svg>
          </span>
        </button>
      </div>
    </>
  );
}