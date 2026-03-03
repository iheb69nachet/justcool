import { useState } from "react";

const CartIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" viewBox="0 0 24 24"
    fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="8" cy="21" r="1" /><circle cx="19" cy="21" r="1" />
    <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12" />
  </svg>
);

interface CartFABProps {
  itemCount: number;
  onClick: () => void;
}

export default function CartFAB({ itemCount, onClick }: CartFABProps) {
  const [pressed, setPressed] = useState(false);

  if (itemCount === 0) return null;

  return (
    <>
      <style>{`
        @keyframes fab-bounce {
          0%   { transform: scale(1); }
          30%  { transform: scale(0.88); }
          60%  { transform: scale(1.08); }
          100% { transform: scale(1); }
        }
        @keyframes badge-pop {
          0%   { transform: scale(0); opacity: 0; }
          70%  { transform: scale(1.25); opacity: 1; }
          100% { transform: scale(1); opacity: 1; }
        }
        @keyframes cart-pulse {
          0%, 100% { box-shadow: 0 0 0 0 rgba(228,88,53,0.55), 0 8px 32px rgba(228,88,53,0.35); }
          50%       { box-shadow: 0 0 0 10px rgba(228,88,53,0), 0 8px 32px rgba(228,88,53,0.35); }
        }
        .cart-fab {
          position: relative;
          width: 62px;
          height: 62px;
          border-radius: 50%;
          background: radial-gradient(circle at 35% 35%, #f0633c, #c93d1e);
          border: none;
          color: #fff;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          animation: cart-pulse 2.4s ease-in-out infinite;
          transition: filter 0.15s;
          outline: none;
        }
        .cart-fab:hover {
          filter: brightness(1.1);
        }
        .cart-fab:active {
          animation: fab-bounce 0.35s ease forwards;
          filter: brightness(0.95);
        }
        .cart-fab-badge {
          position: absolute;
          top: -2px;
          right: -2px;
          min-width: 22px;
          height: 22px;
          border-radius: 999px;
          background: #fff;
          color: #c93d1e;
          font-size: 12px;
          font-weight: 800;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 0 5px;
          border: 2px solid #c93d1e;
          animation: badge-pop 0.3s cubic-bezier(0.34,1.56,0.64,1) forwards;
          line-height: 1;
        }
      `}</style>

      <div style={{ position: "fixed", bottom: "1.5rem", right: "1.5rem", zIndex: 50 }}>
      <button
        className="cart-fab"
        onClick={onClick}
        aria-label={`Ouvrir le panier — ${itemCount} article${itemCount > 1 ? "s" : ""}`}
      >
        <CartIcon />
        <span className="cart-fab-badge" aria-hidden="true">
          {itemCount > 99 ? "99+" : itemCount}
        </span>
      </button>
      </div>
    </>
  );
}