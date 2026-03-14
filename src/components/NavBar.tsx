import React, { useState, useEffect } from "react";
import FloatingMenu from "./FloatingMenu";
import logoMangeMoi from "../assets/logomangemoi.png";

const ShoppingBagIcon = ({ size = 28 }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M16 10a4 4 0 0 1-8 0" />
    <path d="M3.103 6.034h17.794" />
    <path d="M3.4 5.467a2 2 0 0 0-.4 1.2V20a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6.667a2 2 0 0 0-.4-1.2l-2-2.667A2 2 0 0 0 17 2H7a2 2 0 0 0-1.6.8z" />
  </svg>
);

const MenuIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 5h16" /><path d="M4 12h16" /><path d="M4 19h16" />
  </svg>
);

const CloseIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M18 6 6 18" /><path d="m6 6 12 12" />
  </svg>
);

export default function Header({
  cartCount = 0,
  onCartClick,
}: {
  cartCount?: number;
  onCartClick?: () => void;
}) {
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [mobileOpen]);

  return (
    <>
      <style>{`
        /* ── Sheet overlay ── */
        .sheet-overlay {
          position: fixed;
          inset: 0;
          z-index: 149;
          background: rgba(0, 0, 0, 0);
          pointer-events: none;
          transition: background 0.3s ease;
        }
        .sheet-overlay.open {
          background: rgba(0, 0, 0, 0.5);
          pointer-events: all;
        }

        /* ── Sheet panel — slides from right ── */
        .sheet-panel {
          position: fixed;
          inset-block: 0;
          right: 0;
          height: 100%;
          width: 100%;
          max-width: 100%;
          z-index: 150;
          display: flex;
          flex-direction: column;
          background: rgba(8, 8, 8, 0.45);
          backdrop-filter: blur(32px) saturate(160%) brightness(0.8);
          -webkit-backdrop-filter: blur(32px) saturate(160%) brightness(0.8);
          border-left: 1px solid rgba(255, 255, 255, 0.07);
          box-shadow: -8px 0 60px rgba(0,0,0,0.55), inset 1px 0 0 rgba(255,255,255,0.04);
          transform: translateX(100%);
          transition: transform 0.5s cubic-bezier(0.4, 0, 0.2, 1);
          padding: 0;
        }
        .sheet-panel.open {
          transform: translateX(0);
          transition: transform 0.5s cubic-bezier(0.4, 0, 0.2, 1);
        }

        /* ── Sheet header row ── */
        .sheet-header-row {
          display: flex;
          flex-direction: row;
          align-items: center;
          justify-content: space-between;
          height: 3.75rem;
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
          padding: 0 0 0 0;
          flex-shrink: 0;
        }

        /* ── Sheet close button ── */
        .sheet-close-btn {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 3rem;
          height: 3rem;
          border-radius: 9999px;
          background: transparent;
          border: none;
          color: #fff;
          cursor: pointer;
          position: absolute;
          right: 0.5rem;
          top: 6px;
          transition: background 0.2s;
          flex-shrink: 0;
        }
        .sheet-close-btn:hover { background: rgba(255,255,255,0.08); }

        /* ── Sheet body ── */
        .sheet-body {
          display: flex;
          flex-direction: column;
          height: calc(100vh - 3.75rem);
          padding: 2rem;
        }

        /* ── Nav links ── */
        .sheet-nav-link {
          display: block;
          text-align: center;
          color: #fff;
          font-size: 1.875rem;
          font-weight: 500;
          text-decoration: none;
          transition: color 0.2s;
        }
        .sheet-nav-link:hover { color: #ef4444; }

        /* ── Commander CTA ── */
        .sheet-commander-btn {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 100%;
          max-width: 20rem;
          margin: 0 auto;
          background: linear-gradient(to right, #dc2626, #b91c1c);
          color: #fff;
          font-weight: 700;
          font-size: 1.5rem;
          letter-spacing: 0.05em;
          text-transform: uppercase;
          padding: 1.5rem 1rem;
          border-radius: 1rem;
          text-decoration: none;
          box-shadow: 0 0 30px rgba(220, 38, 38, 0.4);
          transition: all 0.3s;
          font-family: 'framer-sans', sans-serif;
        }
        .sheet-commander-btn:hover {
          background: linear-gradient(to right, #ef4444, #dc2626);
          box-shadow: 0 0 30px rgba(220, 38, 38, 0.8);
        }

        /* ── Desktop styles ── */
        .desktop-nav-link {
          position: relative;
          color: #d1d5db;
          font-weight: 600;
          font-size: 1.05rem;
          text-decoration: none;
          transition: color 0.2s;
        }
        .desktop-nav-link::after {
          content: '';
          position: absolute;
          bottom: -4px; left: 0;
          width: 0; height: 2px;
          background: #ef4444;
          border-radius: 2px;
          transition: width 0.25s ease;
        }
        .desktop-nav-link:hover { color: #fff; }
        .desktop-nav-link:hover::after { width: 100%; }
        .commander-btn {
          background: linear-gradient(to right, #dc2626, #b91c1c);
          color: #fff;
          font-weight: 700;
          font-size: 0.875rem;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          padding: 0.55rem 1.4rem;
          border-radius: 9999px;
          text-decoration: none;
          transition: all 0.25s;
          box-shadow: 0 4px 14px rgba(220, 38, 38, 0.45);
          white-space: nowrap;
        }
        .commander-btn:hover {
          background: linear-gradient(to right, #ef4444, #dc2626);
          box-shadow: 0 6px 20px rgba(220, 38, 38, 0.6);
          transform: translateY(-1px);
        }
        .commander-btn:active { transform: translateY(0); }
        .cart-btn {
          position: relative;
          padding: 0.5rem;
          background: none;
          border: none;
          color: rgba(255,255,255,0.75);
          cursor: pointer;
          border-radius: 50%;
          transition: color 0.2s, background 0.2s;
        }
        .cart-btn:hover {
          color: #fff;
          background: rgba(255,255,255,0.08);
        }
        .cart-badge {
          position: absolute;
          top: -2px; right: -2px;
          background: #dc2626;
          color: #fff;
          font-size: 0.65rem;
          font-weight: 700;
          border-radius: 9999px;
          min-width: 18px;
          height: 18px;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 0 4px;
        }
      `}</style>

      {/* ── Header bar ── */}
      <header className="sticky top-0 z-[100] w-full bg-black">
        <div
          className="relative bg-gradient-to-r from-black via-gray-900 to-black w-full border-b-2 border-red-600 flex items-center gap-2 sm:gap-4 px-3 "
          style={{ height: "3.75rem" }}
        >
          <a
            href="/"
            aria-label="Accueil Just Cool - Restaurant Halal Nice"
            className="flex items-center gap-2 sm:gap-3 hover:opacity-90 transition-opacity flex-shrink-0"
          >
            <img
              src="https://justcool.fr/assets/images/logo_just-cool_no-bg.svg"
              alt="Logo Just Cool"
              style={{ height: "3.2rem", width: "3.2rem" }}
              className="object-contain"
            />
            <p className="font-bold text-white text-2xl sm:text-3xl flex leading-none font-zamenhof-inverse">
              <span>JUST</span>
              <span className="text-red-500 ml-1">COOL</span>
            </p>
            <img
              src="https://justcool.fr/assets/images/badge-halal.svg"
              alt="Certifié Halal"
              style={{ height: "2.2rem", width: "2.2rem" }}
              className="object-contain hover:scale-110 transition-transform cursor-help hidden xs:block sm:block"
            />
          </a>

          <div className="ml-auto flex items-center gap-3 sm:gap-5">
            <nav className="hidden md:flex items-center gap-6">
              <a href="/#nav-categories" className="desktop-nav-link">Notre Menu</a>
              <a href="/about" className="desktop-nav-link">À propos de nous</a>
            </nav>

            <a href="/#nav-categories" className="commander-btn hidden md:inline-flex items-center">
              Commander
            </a>
            <button
              aria-label={`Voir le panier (${cartCount} articles)`}
              className="cart-btn"
              onClick={onCartClick}
            >
              <ShoppingBagIcon size={24} />
              {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
            </button>

            <button
              aria-label="Ouvrir le menu"
              aria-expanded={mobileOpen}
              className="flex items-center justify-center w-11 h-11 rounded-lg bg-transparent border-none text-white cursor-pointer transition-colors duration-200 hover:bg-white/10 md:hidden"
              onClick={() => setMobileOpen(true)}
            >
              <MenuIcon />
            </button>
          </div>
        </div>
      </header>

      {/* ── Overlay ── */}
      <div
        className={`sheet-overlay ${mobileOpen ? "open" : ""}`}
        onClick={() => setMobileOpen(false)}
        aria-hidden="true"
      />

      {/* ── Right Sheet Panel ── */}
      <div
        className={`sheet-panel md:hidden ${mobileOpen ? "open" : ""}`}
        role="dialog"
        aria-modal="true"
        aria-label="Navigation principale"
      >
        {/* Accessible title (screen-reader only) */}
        <div className="sr-only">
          <h2>Navigation principale</h2>
          <p>Accès aux différentes sections du menu Just Cool.</p>
        </div>

        {/* Header row — logo + close btn */}
        <div className="sheet-header-row">
          <a
            href="/"
            className="flex items-center gap-2 sm:gap-4 focus-visible:outline-none focus-visible:ring-2 rounded-md"
            onClick={() => setMobileOpen(false)}
          >
            <img
              src="https://justcool.fr/assets/images/logo_just-cool_no-bg.svg"
              alt="Logo"
              style={{ height: "3.75rem", width: "3.75rem" }}
              className="object-contain"
            />
            <div className="flex items-center gap-2">
              <p aria-hidden="true" className="font-bold text-white flex font-display text-3xl">
                <span>JUST</span><span className="text-red-500 ml-1">COOL</span>
              </p>
              <img
                src="https://justcool.fr/assets/images/badge-halal.svg"
                alt="Halal Certifié"
                style={{ height: "2rem", width: "2rem" }}
              />
            </div>
          </a>

          {/* Close button — absolute top-right */}
          <button
            className="sheet-close-btn"
            onClick={() => setMobileOpen(false)}
            aria-label="Fermer"
          >
            <CloseIcon />
            <span className="sr-only">Close</span>
          </button>
        </div>

        {/* Body — nav + CTA */}
        <div className="sheet-body">
          <nav aria-label="Navigation mobile">
            <ul className="flex flex-col items-center gap-6 w-full p-0 m-0 list-none">
              <li className="w-full text-center">
                <a
                  href="/#nav-categories"
                  className="sheet-nav-link"
                  onClick={() => setMobileOpen(false)}
                >
                  Notre Menu
                </a>
              </li>
              <li className="w-full text-center">
                <a
                  href="/a-propos"
                  className="sheet-nav-link"
                  onClick={() => setMobileOpen(false)}
                >
                  À propos de nous
                </a>
              </li>
              <li className="flex justify-center w-full">
                <div style={{ width: "6rem", height: "1px", background: "rgba(255,255,255,0.1)" }} />
              </li>
              <li className="w-full text-center">
                {/* <a
                  href="/#nav-categories"
                  className="sheet-commander-btn"
                  onClick={() => setMobileOpen(false)}
                >
                  COMMANDER
                </a> */}
                <a   onClick={() => setMobileOpen(false)} className="w-full max-w-xs block mx-auto inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&amp;_svg]:pointer-events-none [&amp;_svg:not([class*='size-'])]:size-4 shrink-0 [&amp;_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring focus-visible:ring-2 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive border border-transparent bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-primary-foreground shadow-[0_0_20px_rgba(204,30,39,0.5)] hover:shadow-[0_0_30px_rgba(204,30,39,0.8)] transition-all duration-300 h-9 px-4 py-2 has-[&gt;svg]:px-3 w-full py-6 rounded-2xl text-2xl font-bold h-auto shadow-[0_0_30px_rgba(220,38,38,0.4)] focus:outline-none focus-visible:ring-2 focus-visible:ring-ring" href="/#nav-categories">COMMANDER</a>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </>
  );
}