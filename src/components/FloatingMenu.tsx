import { useState, useEffect, useRef } from "react";

interface FloatingLink {
  label: string;
  href: string;
  icon: React.ReactNode;
  color: string;
}

const links: FloatingLink[] = [
  {
    label: "Notre Menu",
    href: "/",
    color: "#ef4444",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 11l19-9-9 19-2-8-8-2z" />
      </svg>
    ),
  },
  {
    label: "Nous Trouver",
    href: "https://www.google.com/maps/search/?api=1&query=Just+Cool+Nice+Riquier",
    color: "#f97316",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0" />
        <circle cx="12" cy="10" r="3" />
      </svg>
    ),
  },
  {
    label: "Commander",
    href: "tel:+33000000000",
    color: "#eab308",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.61 3.38 2 2 0 0 1 3.58 1h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L7.91 8.96a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
      </svg>
    ),
  },
];

export default function FloatingMenu() {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  return (
    <>
      <style>{`
        @keyframes fab-pop {
          0% { transform: scale(0.5) translateY(10px); opacity: 0; }
          70% { transform: scale(1.08) translateY(-2px); opacity: 1; }
          100% { transform: scale(1) translateY(0); opacity: 1; }
        }
        @keyframes fab-pulse {
          0%, 100% { box-shadow: 0 0 0 0 rgba(239,68,68,0.5); }
          50% { box-shadow: 0 0 0 12px rgba(239,68,68,0); }
        }
        @keyframes rotate-in {
          from { transform: rotate(0deg); }
          to { transform: rotate(135deg); }
        }
        @keyframes rotate-out {
          from { transform: rotate(135deg); }
          to { transform: rotate(0deg); }
        }
        .fab-item {
          animation: fab-pop 0.35s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
          opacity: 0;
        }
        .fab-item:nth-child(1) { animation-delay: 0.05s; }
        .fab-item:nth-child(2) { animation-delay: 0.12s; }
        .fab-item:nth-child(3) { animation-delay: 0.19s; }
        .fab-pulse { animation: fab-pulse 2.2s ease-in-out infinite; }
        .fab-icon-open { animation: rotate-in 0.25s ease forwards; }
        .fab-icon-close { animation: rotate-out 0.25s ease forwards; }
      `}</style>

      <div ref={ref} className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">
        {/* Sub buttons */}
        {open && (
          <div className="flex flex-col items-end gap-3">
            {links.map((link, i) => (
              <a
                key={i}
                href={link.href}
                target={link.href.startsWith("http") ? "_blank" : undefined}
                rel={link.href.startsWith("http") ? "noopener noreferrer" : undefined}
                className="fab-item flex items-center gap-3 group"
                onClick={() => setOpen(false)}
              >
                {/* Label */}
                <span
                  className="text-white text-sm font-semibold px-3 py-1.5 rounded-full shadow-lg tracking-wide"
                  style={{
                    background: "rgba(15,15,15,0.92)",
                    border: "1px solid rgba(255,255,255,0.08)",
                    backdropFilter: "blur(10px)",
                    fontFamily: "'Inter', sans-serif",
                  }}
                >
                  {link.label}
                </span>

                {/* Icon button */}
                <div
                  className="w-12 h-12 rounded-full flex items-center justify-center text-white shadow-xl transition-transform duration-200 group-hover:scale-110"
                  style={{
                    background: link.color,
                    boxShadow: `0 4px 20px ${link.color}55`,
                  }}
                >
                  {link.icon}
                </div>
              </a>
            ))}
          </div>
        )}

        {/* Main FAB */}
        <button
          onClick={() => setOpen((v) => !v)}
          aria-label={open ? "Fermer le menu" : "Ouvrir le menu"}
          className={`w-16 h-16 rounded-full flex items-center justify-center text-white shadow-2xl transition-all duration-200 hover:scale-105 active:scale-95 focus:outline-none ${!open ? "fab-pulse" : ""}`}
          style={{
            background: open
              ? "linear-gradient(135deg, #1a1a1a, #2d2d2d)"
              : "linear-gradient(135deg, #ef4444, #b91c1c)",
            border: open ? "1px solid rgba(255,255,255,0.1)" : "none",
          }}
        >
          <span className={open ? "fab-icon-open" : "fab-icon-close"} style={{ display: "inline-flex" }}>
            {open ? (
              /* X icon */
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 6 6 18M6 6l12 12" />
              </svg>
            ) : (
              /* Plus / spark icon */
              <svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 3q1 4 4 6.5t3 5.5a1 1 0 0 1-14 0 5 5 0 0 1 1-3 1 1 0 0 0 5 0c0-2-1.5-3-1.5-5q0-2 2.5-4" />
              </svg>
            )}
          </span>
        </button>
      </div>
    </>
  );
}