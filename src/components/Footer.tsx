import React from "react";

// ─── Icons ────────────────────────────────────────────────────────────────────

const MapPinIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24"
    fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
    aria-hidden="true" className="shrink-0 mt-0.5 text-red-600 group-hover:scale-110 transition-transform">
    <path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0" />
    <circle cx="12" cy="10" r="3" />
  </svg>
);

const PhoneIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24"
    fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
    aria-hidden="true" className="shrink-0 text-red-600">
    <path d="M13.832 16.568a1 1 0 0 0 1.213-.303l.355-.465A2 2 0 0 1 17 15h3a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2A18 18 0 0 1 2 4a2 2 0 0 1 2-2h3a2 2 0 0 1 2 2v3a2 2 0 0 1-.8 1.6l-.468.351a1 1 0 0 0-.292 1.233 14 14 0 0 0 6.392 6.384" />
  </svg>
);

const InstagramIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24"
    fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
    aria-hidden="true" className="shrink-0 text-red-600">
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
  </svg>
);

const ClockIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24"
    fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
    aria-hidden="true" className="shrink-0 text-red-600">
    <path d="M12 6v6l4 2" />
    <circle cx="12" cy="12" r="10" />
  </svg>
);

// ─── Shared link style ────────────────────────────────────────────────────────

const linkClass =
  "text-zinc-400 hover:text-white transition-colors font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500 rounded-sm";

// ─── Footer ───────────────────────────────────────────────────────────────────

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-zinc-950 text-zinc-400 py-12 pb-24 border-t border-white/5">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-8">

          {/* ── Column 1: Contact ── */}
          <div className="space-y-4">
            <h3 className="font-bold text-white text-xl">Just Cool</h3>

            <address className="not-italic space-y-4">
              {/* Address */}
              <a
                href="https://www.google.com/maps/search/?api=1&query=Just+Cool+Nice+Riquier"
                target="_blank"
                rel="noopener noreferrer"
                className={`${linkClass} flex items-start gap-3 group`}
              >
                <MapPinIcon />
                <div>
                  <p>2 Bd de Riquier</p>
                  <p>06300 Nice, France</p>
                </div>
              </a>

              {/* Phone */}
              <div className="flex items-center gap-3">
                <PhoneIcon />
                <a href="tel:0497125303" className={linkClass}>
                  04 97 12 53 03
                </a>
              </div>

              {/* Instagram */}
              <div className="flex items-center gap-3">
                <InstagramIcon />
                <a
                  href="https://instagram.com/justcool.nice"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={linkClass}
                >
                  @justcool.nice
                </a>
              </div>
            </address>
          </div>

          {/* ── Column 2: Hours ── */}
          <div>
            <h3 className="font-bold text-white text-xl mb-4 flex items-center gap-2">
              <ClockIcon />
              Horaires
            </h3>

            <ul className="space-y-2 text-sm">
              <li className="flex justify-between gap-4">
                <span className="text-zinc-400">Lundi – Samedi</span>
                <time dateTime="Mo-Sa 11:00-00:30" className="font-bold text-white whitespace-nowrap">
                  11:00 – 00:30
                </time>
              </li>
              <li className="flex justify-between gap-4">
                <span className="text-zinc-400">Dimanche</span>
                <time dateTime="Su 12:00-00:30" className="font-bold text-white whitespace-nowrap">
                  12:00 – 00:30
                </time>
              </li>
            </ul>
          </div>

          {/* ── Column 3: Links ── */}
          <nav aria-label="Footer Navigation">
            <h3 className="font-bold text-white text-xl mb-4">Informations</h3>

            <ul className="space-y-2">
              {[
                { href: "/a-propos", label: "À propos", highlight: true },
                { href: "/mentions-legales", label: "Mentions Légales" },
                { href: "/cgv", label: "CGV" },
                { href: "/politique-de-confidentialite", label: "Politique de confidentialité" },
                { href: "/allergenes", label: "Allergènes" },
              ].map(({ href, label, highlight }) => (
                <li key={href}>
                  <a
                    href={href}
                    className={
                      highlight
                        ? "text-red-600 hover:text-red-400 transition-colors font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500 rounded-sm"
                        : linkClass
                    }
                  >
                    {label}
                  </a>
                </li>
              ))}

              <li>
                <button
                  className={`${linkClass} text-left cursor-pointer bg-transparent border-none p-0`}
                  onClick={() => {
                    // Hook up your cookie consent manager here
                  }}
                >
                  Gérer les cookies
                </button>
              </li>

              <li className="pt-4">
                <span className="text-white/40 text-xs">
                  © {currentYear} Just Cool. Tous droits réservés.
                </span>
              </li>
            </ul>
          </nav>

        </div>
      </div>
    </footer>
  );
}