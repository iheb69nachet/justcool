import { useState, useEffect, useRef } from "react";
import delicityLogo from "../assets/delicity.png";
import deliverooLogo from "../assets/delivero.png";
import ubereatsLogo from "../assets/ubereats.png";

interface FloatingLink {
  label: string;
  href: string;
  icon: React.ReactNode;
  color: string;
}

const links: FloatingLink[] = [
  {
    label: "Delicity",
    href: "https://TON-LIEN-DELICITY",
    color: "#e4583500",
    icon: (
      <img
        src={delicityLogo}
        alt="Delicity"
        className="w-6 h-6 object-contain"
      />
    ),
  },
  {
    label: "Deliveroo",
    href: "https://TON-LIEN-DELIVEROO",
    color: "#e4583500",
    icon: (
      <img
        src={deliverooLogo}
        alt="Deliveroo"
        className="w-6 h-6 object-contain"
      />
    ),
  },
  {
    label: "Uber Eats",
    href: "https://TON-LIEN-UBER-EATS",
    color: "#e4583500",
    icon: (
      <img
        src={ubereatsLogo}
        alt="Uber Eats"
        className="w-6 h-6 object-contain"
      />
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
        {/* Main FAB */}
<button
  onClick={() => setOpen((v) => !v)}
  aria-label={open ? "Fermer le menu" : "Ouvrir le menu"}
className="px-8 h-14 rounded-full flex items-center justify-center ..."  style={{
    background: open ? "#cc4729" : "#E45835",
    border: open ? "1px solid rgba(255,255,255,0.15)" : "none",
  }}
>
  <span className="font-bold uppercase tracking-wider text-sm">
    Commander
  </span>
</button>
      </div>
    </>
  );
}