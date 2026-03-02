import React, { useRef, useEffect } from "react";

// ─── Types ────────────────────────────────────────────────────────────────────

export type Category = {
  id: string;
  label: string;
  emoji?: string; // optional — auto-assigned from label if omitted
};

// ─── Emoji auto-assignment ────────────────────────────────────────────────────
// Maps lowercase keywords found in the category label to an emoji.
// The first matching keyword wins; falls back to "🍽️".

const EMOJI_MAP: [string, string][] = [
  ["naan burger",  "🥪"],
  ["naan",         "🌯"],
  ["burger",       "🍔"],
  ["assiette",     "🍽️"],
  ["tacos",        "🌮"],
  ["tex",          "🍗"],
  ["snack",        "🍗"],
  ["dessert",      "🍰"],
  ["boisson",      "🥤"],
  ["drink",        "🥤"],
  ["pizza",        "🍕"],
  ["wrap",         "🌯"],
  ["salade",       "🥗"],
  ["sandwich",     "🥙"],
  ["frite",        "🍟"],
  ["formule",      "🍱"],
  ["menu",         "🍱"],
  ["plus",         "➕"],
  ["extra",        "➕"],
];

function resolveEmoji(label: string): string {
  const lower = label.toLowerCase();
  for (const [keyword, emoji] of EMOJI_MAP) {
    if (lower.includes(keyword)) return emoji;
  }
  return "🍽️";
}

// ─── Component ────────────────────────────────────────────────────────────────

interface CategoryNavProps {
  /** The currently active category id */
  activeId: string;
  /** Distance from the top of the viewport the sticky bar should sit below */
  topOffset?: string;
  /** Called when the user clicks a category pill */
  onSelect: (id: string) => void;
  /** Dynamic list of categories — driven by the API, no default */
  categories: Category[];
}

export default function CategoryNav({
  activeId,
  topOffset = "3.75rem",
  onSelect,
  categories,
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
          background: linear-gradient(135deg, #e45835, #e45835);
          border-color: #e45835;
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
          {categories.map((cat, i) => {
            const isActive = cat.id === activeId;
            const emoji = cat.emoji ?? resolveEmoji(cat.label);
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
                  <span aria-hidden="true">{emoji}</span>
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