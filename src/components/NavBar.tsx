import React, { useState } from "react";

const ShoppingBagIcon = ({ size = 28 }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M16 10a4 4 0 0 1-8 0" />
    <path d="M3.103 6.034h17.794" />
    <path d="M3.4 5.467a2 2 0 0 0-.4 1.2V20a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6.667a2 2 0 0 0-.4-1.2l-2-2.667A2 2 0 0 0 17 2H7a2 2 0 0 0-1.6.8z" />
  </svg>
);

const MenuIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M4 5h16" />
    <path d="M4 12h16" />
    <path d="M4 19h16" />
  </svg>
);

const CloseIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M18 6L6 18" />
    <path d="M6 6l12 12" />
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

  return (
    <>
      <style>{`
        .mobile-drawer {
          max-height: 0;
          overflow: hidden;
          transition: max-height 0.35s cubic-bezier(0.4, 0, 0.2, 1),
                      opacity 0.3s ease;
          opacity: 0;
        }
        .mobile-drawer.open {
          max-height: 400px;
          opacity: 1;
        }
        .mobile-nav-link {
          display: flex;
          align-items: center;
          padding: 1rem 1.5rem;
          color: #d1d5db;
          font-size: 1rem;
          font-weight: 600;
          letter-spacing: 0.03em;
          border-bottom: 1px solid #1f1f1f;
          text-decoration: none;
          transition: color 0.2s, background 0.2s, padding-left 0.2s;
        }
        .mobile-nav-link:hover {
          color: #fff;
          background: #111;
          padding-left: 2rem;
        }
        .mobile-nav-link .arrow {
          margin-left: auto;
          opacity: 0.4;
          font-size: 0.8rem;
        }
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
          background: linear-gradient(135deg, #dc2626, #b91c1c);
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
          background: linear-gradient(135deg, #ef4444, #dc2626);
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

      <header className="sticky top-0 z-[100] w-full flex flex-col bg-black">
        {/* Main bar */}
        <div
          className="relative bg-gradient-to-r from-black via-gray-900 to-black w-full bg-black border-b-2 border-red-600 flex items-center gap-2 sm:gap-4 px-3 sm:px-6"
          style={{ height: "3.75rem" }}
        >
          {/* Logo */}
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

          {/* Right side */}
          <div className="ml-auto flex items-center gap-3 sm:gap-5">
            {/* Desktop nav */}
            <nav className="hidden md:flex items-center gap-6">
              <a href="/#nav-categories" className="desktop-nav-link">
                Notre Menu
              </a>
              <a href="/a-propos" className="desktop-nav-link">
                À propos de nous
              </a>
            </nav>

            {/* Commander — desktop */}
            <a
              href="/#nav-categories"
              className="commander-btn hidden md:inline-flex items-center"
            >
              Commander
            </a>

            {/* Cart */}
            <button
              aria-label={`Voir le panier (${cartCount} articles)`}
              className="cart-btn"
              onClick={onCartClick}
            >
              <ShoppingBagIcon size={24} />
              {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
            </button>

            {/* Mobile menu toggle */}
            <button
              aria-label={mobileOpen ? "Fermer le menu" : "Ouvrir le menu"}
              aria-expanded={mobileOpen}
              className="flex items-center justify-center w-11 h-11 rounded-lg bg-transparent border-none text-white cursor-pointer transition-colors duration-200 hover:bg-white/10 sm:hidden"
              onClick={() => setMobileOpen((v) => !v)}
            >
              {mobileOpen ? <CloseIcon /> : <MenuIcon />}
            </button>
          </div>
        </div>

        {/* Mobile drawer */}
        <div
          className={`mobile-drawer md:hidden bg-black ${mobileOpen ? "open" : ""}`}
          aria-hidden={!mobileOpen}
        >
          <a
            href="/#nav-categories"
            className="mobile-nav-link"
            onClick={() => setMobileOpen(false)}
          >
            Notre Menu
            <span className="arrow">›</span>
          </a>
          <a
            href="/a-propos"
            className="mobile-nav-link"
            onClick={() => setMobileOpen(false)}
          >
            À propos de nous
            <span className="arrow">›</span>
          </a>
          <div className="px-4 py-4">
            <a
              href="/#nav-categories"
              className="commander-btn flex items-center justify-center w-full text-center"
              onClick={() => setMobileOpen(false)}
            >
              Commander
            </a>
          </div>
        </div>
      </header>
    </>
  );
}
