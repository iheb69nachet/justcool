import React, { useRef, useEffect } from "react";

type Category = {
  id: string;
  label: string;
  emoji: string;
};

export const CATEGORIES: Category[] = [
  { id: "naans",        label: "Naans",        emoji: "🌯" },
  { id: "naan_burgers", label: "Naan Burgers",  emoji: "🥪" },
  { id: "burgers",      label: "Burgers",       emoji: "🍔" },
  { id: "assiettes",    label: "Assiettes",     emoji: "🍽️" },
  { id: "tacos",        label: "Tacos",         emoji: "🌮" },
  { id: "snacks",       label: "Tex-Mex",       emoji: "🍗" },
  { id: "desserts",     label: "Desserts",      emoji: "🍰" },
  { id: "boissons",     label: "Boissons",      emoji: "🥤" },
  { id: "plus",         label: "Plus",          emoji: "➕" },
];

interface CategoryNavProps {
  activeId: string;
  topOffset?: string;
  onSelect: (id: string) => void;
}

export default function CategoryNav({
  activeId,
  topOffset = "3.75rem",
  onSelect,
}: CategoryNavProps) {
  const listRef = useRef<HTMLUListElement>(null);
  const tabRefs = useRef<Map<string, HTMLAnchorElement>>(new Map());

  // Auto-scroll the active pill into view whenever activeId changes
  useEffect(() => {
    const el = tabRefs.current.get(activeId);
    if (el && listRef.current) {
      el.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" });
    }
  }, [activeId]);

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    onSelect(id);
  };

  return (
    <>
      <style>{`
        .no-scrollbar { scrollbar-width: none; -ms-overflow-style: none; }
        .no-scrollbar::-webkit-scrollbar { display: none; }

        .cat-tab {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 0.375rem;
          flex-shrink: 0;
          white-space: nowrap;
          height: 2rem;
          padding: 0 0.75rem;
          border-radius: 9999px;
          font-size: 0.875rem;
          font-weight: 500;
          text-decoration: none;
          border: 1px solid;
          cursor: pointer;
          outline: none;
          /* smooth pill transition */
          transition:
            background 0.25s ease,
            color 0.25s ease,
            box-shadow 0.25s ease,
            border-color 0.25s ease,
            transform 0.15s ease;
        }
        .cat-tab:focus-visible {
          box-shadow: 0 0 0 2px #ef4444;
        }
        .cat-tab:active { transform: scale(0.95); }

        .cat-tab-inactive {
          background: transparent;
          border-color: rgba(255,255,255,0.18);
          color: rgba(255,255,255,0.6);
        }
        .cat-tab-inactive:hover {
          background: rgba(255,255,255,0.07);
          color: #fff;
          border-color: rgba(255,255,255,0.3);
        }

        .cat-tab-active {
          background: linear-gradient(135deg, #dc2626, #b91c1c);
          border-color: #dc2626;
          color: #fff;
          box-shadow: 0 0 16px rgba(204, 30, 39, 0.4);
        }
      `}</style>

      <nav
        id="nav-categories"
        role="navigation"
        tabIndex={-1}
        aria-labelledby="nav-categories-heading"
        className="sticky w-full z-40 bg-black/90 backdrop-blur-md border-b border-white/10 shadow-xl outline-none"
        style={{ top: topOffset }}
      >
        <h2 id="nav-categories-heading" tabIndex={-1} className="sr-only">
          Navigation des catégories des plats
        </h2>

        <ul
          ref={listRef}
          role="tablist"
          className="no-scrollbar flex items-center gap-2 px-4 py-3 overflow-x-auto list-none m-0"
        >
          {CATEGORIES.map((cat, i) => {
            const isActive = cat.id === activeId;
            return (
              <li key={cat.id} role="presentation">
                <a
                  ref={(el) => {
                    if (el) tabRefs.current.set(cat.id, el);
                    else tabRefs.current.delete(cat.id);
                  }}
                  id={i === 0 ? "first-tab-focus" : undefined}
                  href={`#${cat.id}`}
                  role="tab"
                  aria-selected={isActive}
                  aria-controls={cat.id}
                  tabIndex={isActive ? 0 : -1}
                  className={`cat-tab ${isActive ? "cat-tab-active" : "cat-tab-inactive"}`}
                  onClick={(e) => handleClick(e, cat.id)}
                >
                  <span aria-hidden="true">{cat.emoji}</span>
                  {cat.label}
                </a>
              </li>
            );
          })}
        </ul>
      </nav>
    </>
  );
}