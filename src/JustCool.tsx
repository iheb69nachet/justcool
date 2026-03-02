import { useState, useEffect, useRef, useCallback } from "react";
import Hero from "./components/Hero";
import CategoryNav from "./components/CategoryNav";
import CategorySection from "./components/CategorySection";
import Footer from "./components/Footer";
import type { Product } from "./components/CategorySection";
import Header from "./components/NavBar";
import ProductModal from "./components/Productmodal";
import CartDrawer from "./components/CartDrawer";
import type { CartItem } from "./components/CartDrawer";
import './App.css'

// ─── Types ────────────────────────────────────────────────────────────────────

interface OrderOptions {
  crudites: string[];
  bread: string;
  sauces: string[];
  menuFormule: boolean;
  isStudent: boolean;
  supplements: string[];
  groupSelections: Record<string, string[]>;
  supplementSurcharge: number;
}

// ─── API Types ────────────────────────────────────────────────────────────────

interface ApiSupplement {
  id: string;
  name: string;
  price: number;
  is_active: boolean;
  sort_order: number;
  image_url: string | null;
}

interface ApiSupplementGroup {
  id: string;
  name: string;
  description: string;
  is_required: boolean;
  min_selection: number;
  max_selection: number;
  sort_order: number;
  supplements: ApiSupplement[];
}

interface ApiProduct {
  id: string;
  name: string;
  description: string;
  price: number;
  is_active: boolean;
  sort_order: number;
  image_url: string | null;
  supplement_groups: ApiSupplementGroup[];
}

interface ApiCategory {
  id: string;
  name: string;
  description: string;
  sort_order: number;
  is_active: boolean;
  products: ApiProduct[];
}

// ─── Mapping helpers ──────────────────────────────────────────────────────────

/**
 * Slugify a category name to use as DOM id / navigation key.
 * e.g. "Naan Burger" → "naan-burger"
 */
function slugify(name: string): string {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-");
}

/**
 * Map an ApiProduct to the Product shape the existing components expect.
 * supplement_groups are stored on the product so ProductModal can use them.
 */
function mapProduct(apiProduct: ApiProduct): Product {
  // Build a human-readable extras string from group descriptions
  const extrasGroups = apiProduct.supplement_groups
    .filter((g) => !g.is_required && g.supplements.length > 0)
    .map((g) => g.name)
    .slice(0, 2)
    .join(", ");

  return {
    id: apiProduct.id,
    name: apiProduct.name.trim(),
    mainIngredient: apiProduct.description || "",
    extras: extrasGroups,
    price: apiProduct.price,
    imageSrc: apiProduct.image_url ?? undefined,
    // Attach raw supplement groups so ProductModal can render them
    supplementGroups: apiProduct.supplement_groups,
  };
}

function mapCategories(apiCategories: ApiCategory[]) {
  return apiCategories
    .filter((c) => c.is_active)
    .sort((a, b) => a.sort_order - b.sort_order)
    .map((cat) => ({
      categoryId: slugify(cat.name),
      categoryLabel: cat.name.trim(),
      products: cat.products
        .filter((p) => p.is_active)
        .sort((a, b) => a.sort_order - b.sort_order)
        .map(mapProduct),
    }));
}

const STICKY_OFFSET = 60 + 48;
const API_URL = "https://resto.devsolve-agency.com:8443/menu/justcool/categories";

// ─── Cart helpers ──────────────────────────────────────────────────────────────

function makeCartId(productId: string, options: OrderOptions): string {
  const key = [
    productId,
    options.bread,
    [...options.sauces].sort().join("|"),
    [...options.crudites].sort().join("|"),
    options.menuFormule ? "menu" : "",
    options.isStudent ? "student" : "",
    [...options.supplements].sort().join("|"),
  ].join("__");
  return key;
}

function calcUnitPrice(product: Product, options: OrderOptions): number {
  let price = product.price;
  if (options.menuFormule && product.menuUpcharge) price += product.menuUpcharge;
  if (options.isStudent && product.studentDiscount) price -= product.studentDiscount;
  price += options.supplementSurcharge ?? 0; // ← add supplement costs
  return Math.max(0, price);
}

// ─── App ──────────────────────────────────────────────────────────────────────

export default function JustCool() {
  // ── Data state ──────────────────────────────────────────────────────────────
  const [sections, setSections] = useState<
    { categoryId: string; categoryLabel: string; products: Product[] }[]
  >([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // ── Cart / UI state ─────────────────────────────────────────────────────────
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [dineMode, setDineMode] = useState<"surplace" | "emporter">("surplace");
  const [activeCategory, setActiveCategory] = useState<string>("");
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  const isScrollingRef = useRef(false);
  const scrollTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const cartCount = cartItems.reduce((s, i) => s + i.quantity, 0);

  // ── Fetch categories from API ───────────────────────────────────────────────
  useEffect(() => {
    let cancelled = false;

    async function fetchData() {
      try {
        setLoading(true);
        setError(null);
        const res = await fetch(API_URL);
//         let varss=[
//   {
//     "name": "Naans",
//     "description": "Nos naans garnis maison",
//     "sort_order": 0,
//     "is_active": true,
//     "id": "cat-naan-001",
//     "created_at": "2026-02-01T10:00:00.000000",
//     "updated_at": "2026-02-01T10:00:00.000000",
//     "products": [
//       {
//         "name": "Le Just Cool",
//         "description": "Double steak, Pomme de terre, Cheddar",
//         "price": 9.00,
//         "is_active": true,
//         "sort_order": 0,
//         "id": "prod-naan-001",
//         "category_id": "cat-naan-001",
//         "image_url": "https://justcool.fr/assets/images/products/naans/le-just-cool.webp",
//         "created_at": "2026-02-01T10:00:00.000000",
//         "updated_at": "2026-02-01T10:00:00.000000",
//         "supplement_groups": [
//           {
//             "name": "Choisissez vos crudités",
//             "description": "",
//             "is_required": true,
//             "min_selection": 1,
//             "max_selection": 1,
//             "sort_order": 0,
//             "id": "grp-naan-001-crudites",
//             "product_id": "prod-naan-001",
//             "created_at": "2026-02-01T10:00:00.000000",
//             "updated_at": "2026-02-01T10:00:00.000000",
//             "supplements": [
//               { "name": "Aucune crudité", "price": 0.0, "is_active": true, "sort_order": 0, "id": "sup-001", "group_id": "grp-naan-001-crudites", "image_url": null, "created_at": "2026-02-01T10:00:00.000000", "updated_at": "2026-02-01T10:00:00.000000" },
//               { "name": "Toutes les crudités", "price": 0.0, "is_active": true, "sort_order": 1, "id": "sup-002", "group_id": "grp-naan-001-crudites", "image_url": null, "created_at": "2026-02-01T10:00:00.000000", "updated_at": "2026-02-01T10:00:00.000000" }
//             ]
//           },
//           {
//             "name": "Choisissez vos sauces",
//             "description": "Max 2",
//             "is_required": true,
//             "min_selection": 1,
//             "max_selection": 2,
//             "sort_order": 1,
//             "id": "grp-naan-001-sauces",
//             "product_id": "prod-naan-001",
//             "created_at": "2026-02-01T10:00:00.000000",
//             "updated_at": "2026-02-01T10:00:00.000000",
//             "supplements": [
//               { "name": "Blanche", "price": 0.0, "is_active": true, "sort_order": 0, "id": "sup-s01", "group_id": "grp-naan-001-sauces", "image_url": null, "created_at": "2026-02-01T10:00:00.000000", "updated_at": "2026-02-01T10:00:00.000000" },
//               { "name": "Ketchup", "price": 0.0, "is_active": true, "sort_order": 1, "id": "sup-s02", "group_id": "grp-naan-001-sauces", "image_url": null, "created_at": "2026-02-01T10:00:00.000000", "updated_at": "2026-02-01T10:00:00.000000" },
//               { "name": "Harissa", "price": 0.0, "is_active": true, "sort_order": 2, "id": "sup-s03", "group_id": "grp-naan-001-sauces", "image_url": null, "created_at": "2026-02-01T10:00:00.000000", "updated_at": "2026-02-01T10:00:00.000000" },
//               { "name": "Algérienne", "price": 0.0, "is_active": true, "sort_order": 3, "id": "sup-s04", "group_id": "grp-naan-001-sauces", "image_url": null, "created_at": "2026-02-01T10:00:00.000000", "updated_at": "2026-02-01T10:00:00.000000" }
//             ]
//           },
//           {
//             "name": "Menu",
//             "description": "",
//             "is_required": false,
//             "min_selection": 0,
//             "max_selection": 1,
//             "sort_order": 2,
//             "id": "grp-naan-001-menu",
//             "product_id": "prod-naan-001",
//             "created_at": "2026-02-01T10:00:00.000000",
//             "updated_at": "2026-02-01T10:00:00.000000",
//             "supplements": [
//               { "name": "Ajoutez la formule menu (frites + boisson)", "price": 2.0, "is_active": true, "sort_order": 0, "id": "sup-m01", "group_id": "grp-naan-001-menu", "image_url": null, "created_at": "2026-02-01T10:00:00.000000", "updated_at": "2026-02-01T10:00:00.000000" }
//             ]
//           },
//           {
//             "name": "Ajoutez vos suppléments",
//             "description": "",
//             "is_required": false,
//             "min_selection": 0,
//             "max_selection": 5,
//             "sort_order": 3,
//             "id": "grp-naan-001-supps",
//             "product_id": "prod-naan-001",
//             "created_at": "2026-02-01T10:00:00.000000",
//             "updated_at": "2026-02-01T10:00:00.000000",
//             "supplements": [
//               { "name": "Oeuf au plat", "price": 2.0, "is_active": true, "sort_order": 0, "id": "sup-sp01", "group_id": "grp-naan-001-supps", "image_url": null, "created_at": "2026-02-01T10:00:00.000000", "updated_at": "2026-02-01T10:00:00.000000" },
//               { "name": "Cheddar", "price": 2.0, "is_active": true, "sort_order": 1, "id": "sup-sp02", "group_id": "grp-naan-001-supps", "image_url": null, "created_at": "2026-02-01T10:00:00.000000", "updated_at": "2026-02-01T10:00:00.000000" },
//               { "name": "Bacon", "price": 2.0, "is_active": true, "sort_order": 2, "id": "sup-sp03", "group_id": "grp-naan-001-supps", "image_url": null, "created_at": "2026-02-01T10:00:00.000000", "updated_at": "2026-02-01T10:00:00.000000" }
//             ]
//           }
//         ]
//       },
//       {
//         "name": "Naan Kebab",
//         "description": "Viande de kebab marinée",
//         "price": 7.50,
//         "is_active": true,
//         "sort_order": 1,
//         "id": "prod-naan-002",
//         "category_id": "cat-naan-001",
//         "image_url": "https://justcool.fr/assets/images/products/naans/naan-kebab.webp",
//         "created_at": "2026-02-01T10:00:00.000000",
//         "updated_at": "2026-02-01T10:00:00.000000",
//         "supplement_groups": [
//           {
//             "name": "Choisissez vos crudités",
//             "description": "",
//             "is_required": true,
//             "min_selection": 1,
//             "max_selection": 1,
//             "sort_order": 0,
//             "id": "grp-naan-002-crudites",
//             "product_id": "prod-naan-002",
//             "created_at": "2026-02-01T10:00:00.000000",
//             "updated_at": "2026-02-01T10:00:00.000000",
//             "supplements": [
//               { "name": "Aucune crudité", "price": 0.0, "is_active": true, "sort_order": 0, "id": "sup-n2-001", "group_id": "grp-naan-002-crudites", "image_url": null, "created_at": "2026-02-01T10:00:00.000000", "updated_at": "2026-02-01T10:00:00.000000" },
//               { "name": "Toutes les crudités", "price": 0.0, "is_active": true, "sort_order": 1, "id": "sup-n2-002", "group_id": "grp-naan-002-crudites", "image_url": null, "created_at": "2026-02-01T10:00:00.000000", "updated_at": "2026-02-01T10:00:00.000000" }
//             ]
//           },
//           {
//             "name": "Choisissez vos sauces",
//             "description": "Max 2",
//             "is_required": true,
//             "min_selection": 1,
//             "max_selection": 2,
//             "sort_order": 1,
//             "id": "grp-naan-002-sauces",
//             "product_id": "prod-naan-002",
//             "created_at": "2026-02-01T10:00:00.000000",
//             "updated_at": "2026-02-01T10:00:00.000000",
//             "supplements": [
//               { "name": "Blanche", "price": 0.0, "is_active": true, "sort_order": 0, "id": "sup-n2-s01", "group_id": "grp-naan-002-sauces", "image_url": null, "created_at": "2026-02-01T10:00:00.000000", "updated_at": "2026-02-01T10:00:00.000000" },
//               { "name": "Harissa", "price": 0.0, "is_active": true, "sort_order": 1, "id": "sup-n2-s02", "group_id": "grp-naan-002-sauces", "image_url": null, "created_at": "2026-02-01T10:00:00.000000", "updated_at": "2026-02-01T10:00:00.000000" },
//               { "name": "Samourai", "price": 0.0, "is_active": true, "sort_order": 2, "id": "sup-n2-s03", "group_id": "grp-naan-002-sauces", "image_url": null, "created_at": "2026-02-01T10:00:00.000000", "updated_at": "2026-02-01T10:00:00.000000" }
//             ]
//           }
//         ]
//       }
//     ]
//   },
//   {
//     "name": "Burgers",
//     "description": "Nos burgers maison",
//     "sort_order": 1,
//     "is_active": true,
//     "id": "cat-burger-001",
//     "created_at": "2026-02-01T10:00:00.000000",
//     "updated_at": "2026-02-01T10:00:00.000000",
//     "products": [
//       {
//         "name": "Cheese Burger",
//         "description": "Steak haché, double cheddar",
//         "price": 6.50,
//         "is_active": true,
//         "sort_order": 0,
//         "id": "prod-burger-001",
//         "category_id": "cat-burger-001",
//         "image_url": "https://justcool.fr/assets/images/products/burgers/burger-cheese.webp",
//         "created_at": "2026-02-01T10:00:00.000000",
//         "updated_at": "2026-02-01T10:00:00.000000",
//         "supplement_groups": [
//           {
//             "name": "Choisissez vos crudités",
//             "description": "",
//             "is_required": true,
//             "min_selection": 1,
//             "max_selection": 1,
//             "sort_order": 0,
//             "id": "grp-b001-crudites",
//             "product_id": "prod-burger-001",
//             "created_at": "2026-02-01T10:00:00.000000",
//             "updated_at": "2026-02-01T10:00:00.000000",
//             "supplements": [
//               { "name": "Aucune crudité", "price": 0.0, "is_active": true, "sort_order": 0, "id": "sup-b1-001", "group_id": "grp-b001-crudites", "image_url": null, "created_at": "2026-02-01T10:00:00.000000", "updated_at": "2026-02-01T10:00:00.000000" },
//               { "name": "Toutes les crudités", "price": 0.0, "is_active": true, "sort_order": 1, "id": "sup-b1-002", "group_id": "grp-b001-crudites", "image_url": null, "created_at": "2026-02-01T10:00:00.000000", "updated_at": "2026-02-01T10:00:00.000000" }
//             ]
//           },
//           {
//             "name": "Choisissez vos sauces",
//             "description": "Max 2",
//             "is_required": true,
//             "min_selection": 1,
//             "max_selection": 2,
//             "sort_order": 1,
//             "id": "grp-b001-sauces",
//             "product_id": "prod-burger-001",
//             "created_at": "2026-02-01T10:00:00.000000",
//             "updated_at": "2026-02-01T10:00:00.000000",
//             "supplements": [
//               { "name": "Biggy burger", "price": 0.0, "is_active": true, "sort_order": 0, "id": "sup-b1-s01", "group_id": "grp-b001-sauces", "image_url": null, "created_at": "2026-02-01T10:00:00.000000", "updated_at": "2026-02-01T10:00:00.000000" },
//               { "name": "Ketchup", "price": 0.0, "is_active": true, "sort_order": 1, "id": "sup-b1-s02", "group_id": "grp-b001-sauces", "image_url": null, "created_at": "2026-02-01T10:00:00.000000", "updated_at": "2026-02-01T10:00:00.000000" },
//               { "name": "Mayonnaise", "price": 0.0, "is_active": true, "sort_order": 2, "id": "sup-b1-s03", "group_id": "grp-b001-sauces", "image_url": null, "created_at": "2026-02-01T10:00:00.000000", "updated_at": "2026-02-01T10:00:00.000000" },
//               { "name": "Barbecue", "price": 0.0, "is_active": true, "sort_order": 3, "id": "sup-b1-s04", "group_id": "grp-b001-sauces", "image_url": null, "created_at": "2026-02-01T10:00:00.000000", "updated_at": "2026-02-01T10:00:00.000000" }
//             ]
//           },
//           {
//             "name": "Menu",
//             "description": "",
//             "is_required": false,
//             "min_selection": 0,
//             "max_selection": 1,
//             "sort_order": 2,
//             "id": "grp-b001-menu",
//             "product_id": "prod-burger-001",
//             "created_at": "2026-02-01T10:00:00.000000",
//             "updated_at": "2026-02-01T10:00:00.000000",
//             "supplements": [
//               { "name": "Ajoutez la formule menu (frites + boisson)", "price": 2.0, "is_active": true, "sort_order": 0, "id": "sup-b1-m01", "group_id": "grp-b001-menu", "image_url": null, "created_at": "2026-02-01T10:00:00.000000", "updated_at": "2026-02-01T10:00:00.000000" }
//             ]
//           },
//           {
//             "name": "Ajoutez vos suppléments",
//             "description": "",
//             "is_required": false,
//             "min_selection": 0,
//             "max_selection": 7,
//             "sort_order": 3,
//             "id": "grp-b001-supps",
//             "product_id": "prod-burger-001",
//             "created_at": "2026-02-01T10:00:00.000000",
//             "updated_at": "2026-02-01T10:00:00.000000",
//             "supplements": [
//               { "name": "Bacon", "price": 2.0, "is_active": true, "sort_order": 0, "id": "sup-b1-sp01", "group_id": "grp-b001-supps", "image_url": null, "created_at": "2026-02-01T10:00:00.000000", "updated_at": "2026-02-01T10:00:00.000000" },
//               { "name": "Oeuf au plat", "price": 2.0, "is_active": true, "sort_order": 1, "id": "sup-b1-sp02", "group_id": "grp-b001-supps", "image_url": null, "created_at": "2026-02-01T10:00:00.000000", "updated_at": "2026-02-01T10:00:00.000000" },
//               { "name": "Oignon grillé", "price": 2.0, "is_active": true, "sort_order": 2, "id": "sup-b1-sp03", "group_id": "grp-b001-supps", "image_url": null, "created_at": "2026-02-01T10:00:00.000000", "updated_at": "2026-02-01T10:00:00.000000" },
//               { "name": "Raclette", "price": 2.0, "is_active": true, "sort_order": 3, "id": "sup-b1-sp04", "group_id": "grp-b001-supps", "image_url": null, "created_at": "2026-02-01T10:00:00.000000", "updated_at": "2026-02-01T10:00:00.000000" }
//             ]
//           }
//         ]
//       },
//       {
//         "name": "Burger Bacon",
//         "description": "Steak haché, bacon croustillant, cheddar",
//         "price": 8.50,
//         "is_active": true,
//         "sort_order": 1,
//         "id": "prod-burger-002",
//         "category_id": "cat-burger-001",
//         "image_url": "https://justcool.fr/assets/images/products/burgers/burger-bacon.webp",
//         "created_at": "2026-02-01T10:00:00.000000",
//         "updated_at": "2026-02-01T10:00:00.000000",
//         "supplement_groups": [
//           {
//             "name": "Choisissez vos crudités",
//             "description": "",
//             "is_required": true,
//             "min_selection": 1,
//             "max_selection": 1,
//             "sort_order": 0,
//             "id": "grp-b002-crudites",
//             "product_id": "prod-burger-002",
//             "created_at": "2026-02-01T10:00:00.000000",
//             "updated_at": "2026-02-01T10:00:00.000000",
//             "supplements": [
//               { "name": "Aucune crudité", "price": 0.0, "is_active": true, "sort_order": 0, "id": "sup-b2-001", "group_id": "grp-b002-crudites", "image_url": null, "created_at": "2026-02-01T10:00:00.000000", "updated_at": "2026-02-01T10:00:00.000000" },
//               { "name": "Toutes les crudités", "price": 0.0, "is_active": true, "sort_order": 1, "id": "sup-b2-002", "group_id": "grp-b002-crudites", "image_url": null, "created_at": "2026-02-01T10:00:00.000000", "updated_at": "2026-02-01T10:00:00.000000" }
//             ]
//           },
//           {
//             "name": "Choisissez vos sauces",
//             "description": "Max 2",
//             "is_required": true,
//             "min_selection": 1,
//             "max_selection": 2,
//             "sort_order": 1,
//             "id": "grp-b002-sauces",
//             "product_id": "prod-burger-002",
//             "created_at": "2026-02-01T10:00:00.000000",
//             "updated_at": "2026-02-01T10:00:00.000000",
//             "supplements": [
//               { "name": "Biggy burger", "price": 0.0, "is_active": true, "sort_order": 0, "id": "sup-b2-s01", "group_id": "grp-b002-sauces", "image_url": null, "created_at": "2026-02-01T10:00:00.000000", "updated_at": "2026-02-01T10:00:00.000000" },
//               { "name": "Barbecue", "price": 0.0, "is_active": true, "sort_order": 1, "id": "sup-b2-s02", "group_id": "grp-b002-sauces", "image_url": null, "created_at": "2026-02-01T10:00:00.000000", "updated_at": "2026-02-01T10:00:00.000000" },
//               { "name": "Andalouse", "price": 0.0, "is_active": true, "sort_order": 2, "id": "sup-b2-s03", "group_id": "grp-b002-sauces", "image_url": null, "created_at": "2026-02-01T10:00:00.000000", "updated_at": "2026-02-01T10:00:00.000000" }
//             ]
//           }
//         ]
//       }
//     ]
//   },
//   {
//     "name": "Desserts",
//     "description": "Nos desserts faits maison",
//     "sort_order": 2,
//     "is_active": true,
//     "id": "cat-dessert-001",
//     "created_at": "2026-02-01T10:00:00.000000",
//     "updated_at": "2026-02-01T10:00:00.000000",
//     "products": [
//       {
//         "name": "Churros",
//         "description": "Churros maison à la cannelle",
//         "price": 3.50,
//         "is_active": true,
//         "sort_order": 0,
//         "id": "prod-dessert-001",
//         "category_id": "cat-dessert-001",
//         "image_url": "https://justcool.fr/assets/images/products/desserts/churros.webp",
//         "created_at": "2026-02-01T10:00:00.000000",
//         "updated_at": "2026-02-01T10:00:00.000000",
//         "supplement_groups": []
//       },
//       {
//         "name": "Brownie",
//         "description": "Brownie chocolat fondant",
//         "price": 3.00,
//         "is_active": true,
//         "sort_order": 1,
//         "id": "prod-dessert-002",
//         "category_id": "cat-dessert-001",
//         "image_url": "https://justcool.fr/assets/images/products/desserts/brownie.webp",
//         "created_at": "2026-02-01T10:00:00.000000",
//         "updated_at": "2026-02-01T10:00:00.000000",
//         "supplement_groups": []
//       }
//     ]
//   },
//   {
//     "name": "Boissons",
//     "description": "Nos boissons fraîches",
//     "sort_order": 3,
//     "is_active": true,
//     "id": "cat-boisson-001",
//     "created_at": "2026-02-01T10:00:00.000000",
//     "updated_at": "2026-02-01T10:00:00.000000",
//     "products": [
//       {
//         "name": "Boisson 33cl",
//         "description": "Coca-Cola, Fanta, Sprite, Ice Tea",
//         "price": 2.00,
//         "is_active": true,
//         "sort_order": 0,
//         "id": "prod-boisson-001",
//         "category_id": "cat-boisson-001",
//         "image_url": "https://justcool.fr/assets/images/products/boissons/boisson-33cl.webp",
//         "created_at": "2026-02-01T10:00:00.000000",
//         "updated_at": "2026-02-01T10:00:00.000000",
//         "supplement_groups": [
//           {
//             "name": "Choisissez votre saveur",
//             "description": "",
//             "is_required": true,
//             "min_selection": 1,
//             "max_selection": 1,
//             "sort_order": 0,
//             "id": "grp-bv001-saveur",
//             "product_id": "prod-boisson-001",
//             "created_at": "2026-02-01T10:00:00.000000",
//             "updated_at": "2026-02-01T10:00:00.000000",
//             "supplements": [
//               { "name": "Coca-Cola", "price": 0.0, "is_active": true, "sort_order": 0, "id": "sup-bv-001", "group_id": "grp-bv001-saveur", "image_url": null, "created_at": "2026-02-01T10:00:00.000000", "updated_at": "2026-02-01T10:00:00.000000" },
//               { "name": "Fanta", "price": 0.0, "is_active": true, "sort_order": 1, "id": "sup-bv-002", "group_id": "grp-bv001-saveur", "image_url": null, "created_at": "2026-02-01T10:00:00.000000", "updated_at": "2026-02-01T10:00:00.000000" },
//               { "name": "Sprite", "price": 0.0, "is_active": true, "sort_order": 2, "id": "sup-bv-003", "group_id": "grp-bv001-saveur", "image_url": null, "created_at": "2026-02-01T10:00:00.000000", "updated_at": "2026-02-01T10:00:00.000000" },
//               { "name": "Ice Tea", "price": 0.0, "is_active": true, "sort_order": 3, "id": "sup-bv-004", "group_id": "grp-bv001-saveur", "image_url": null, "created_at": "2026-02-01T10:00:00.000000", "updated_at": "2026-02-01T10:00:00.000000" }
//             ]
//           }
//         ]
//       }
//     ]
//   },
//   {
//     "name": "Catégorie inactive",
//     "description": "Cette catégorie ne doit pas apparaître",
//     "sort_order": 99,
//     "is_active": false,
//     "id": "cat-hidden-001",
//     "created_at": "2026-02-01T10:00:00.000000",
//     "updated_at": "2026-02-01T10:00:00.000000",
//     "products": []
//   }
// ]
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data: ApiCategory[] =await res.json();
        if (cancelled) return;
        const mapped = mapCategories(data);
        setSections(mapped);
        if (mapped.length > 0) setActiveCategory(mapped[0].categoryId);
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : "Erreur de chargement");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    fetchData();
    return () => { cancelled = true; };
  }, []);

  // ── IntersectionObserver ────────────────────────────────────────────────────
  useEffect(() => {
    if (sections.length === 0) return;
    const observers: IntersectionObserver[] = [];
    sections.forEach(({ categoryId }) => {
      const el = document.getElementById(categoryId);
      if (!el) return;
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (isScrollingRef.current) return;
          if (entry.isIntersecting) setActiveCategory(categoryId);
        },
        { rootMargin: "-25% 0px -70% 0px", threshold: 0 }
      );
      observer.observe(el);
      observers.push(observer);
    });
    return () => observers.forEach((o) => o.disconnect());
  }, [sections]);

  // ── Category nav click ──────────────────────────────────────────────────────
  const handleCategorySelect = useCallback((id: string) => {
    setActiveCategory(id);
    const el = document.getElementById(id);
    if (!el) return;
    isScrollingRef.current = true;
    if (scrollTimerRef.current) clearTimeout(scrollTimerRef.current);
    const top = el.getBoundingClientRect().top + window.scrollY - STICKY_OFFSET - 12;
    window.scrollTo({ top, behavior: "smooth" });
    scrollTimerRef.current = setTimeout(() => { isScrollingRef.current = false; }, 750);
  }, []);

  // ── Product modal ───────────────────────────────────────────────────────────
  const openModal = (product: Product) => {
    setSelectedProduct(product);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setTimeout(() => setSelectedProduct(null), 300);
  };

  // ── Cart mutations ──────────────────────────────────────────────────────────
  const handleAddToCart = (product: Product, quantity: number, options: OrderOptions) => {
    const id = makeCartId(product.id, options);
    const unitPrice = calcUnitPrice(product, options);

    setCartItems((prev) => {
      const existing = prev.find((i) => i.id === id);
      if (existing) {
        return prev.map((i) => i.id === id ? { ...i, quantity: i.quantity + quantity } : i);
      }
      const newItem: CartItem = {
        id,
        productId: product.id,
        name: product.name,
        price: unitPrice,
        quantity,
        options: {
          bread: options.bread,
          sauces: options.sauces,
          crudites: options.crudites,
          menuFormule: options.menuFormule,
          isStudent: options.isStudent,
          supplements: options.supplements,
          groupSelections: options.groupSelections, // ← show selections in drawer
          supplementSurcharge: options.supplementSurcharge,
        },
      };
      return [...prev, newItem];
    });

    setCartOpen(true);
  };

  const handleUpdateQty = (id: string, qty: number) => {
    setCartItems((prev) => prev.map((i) => i.id === id ? { ...i, quantity: qty } : i));
  };

  const handleRemove = (id: string) => {
    setCartItems((prev) => prev.filter((i) => i.id !== id));
  };

  // ── Render ──────────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-black text-white">
      <Header
        cartCount={cartCount}
        onCartClick={() => setCartOpen(true)}
      />

      <main>
        <Hero />

        {loading && (
          <div className="flex items-center justify-center py-32 text-gray-400">
            <svg className="animate-spin h-8 w-8 mr-3" viewBox="0 0 24 24" fill="none">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
            </svg>
            Chargement du menu…
          </div>
        )}

        {error && (
          <div className="flex flex-col items-center justify-center py-32 text-red-400 gap-4">
            <p className="text-lg font-semibold">Impossible de charger le menu</p>
            <p className="text-sm text-gray-500">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="mt-2 px-6 py-2 bg-red-600 hover:bg-red-500 text-white rounded-full text-sm transition"
            >
              Réessayer
            </button>
          </div>
        )}

        {!loading && !error && sections.length > 0 && (
          <>
            <CategoryNav
              activeId={activeCategory}
              onSelect={handleCategorySelect}
              topOffset="3.75rem"
              // Pass dynamic categories so the nav reflects the API data
              categories={
                sections.map((s) => ({
                  id: s.categoryId,
                  label: s.categoryLabel,
                }))
              }
             
            />

            {sections.map(({ categoryId, categoryLabel, products }) => (
              <CategorySection
                key={categoryId}
                categoryId={categoryId}
                categoryLabel={categoryLabel}
                products={products}
                onProductClick={openModal}
              />
            ))}
          </>
        )}
      </main>

      <Footer />

      <ProductModal
        product={selectedProduct}
        isOpen={modalOpen}
        onClose={closeModal}
        onAddToCart={handleAddToCart}
      />

      <CartDrawer
        isOpen={cartOpen}
        onClose={() => setCartOpen(false)}
        items={cartItems}
        onUpdateQty={handleUpdateQty}
        onRemove={handleRemove}
        dineMode={dineMode}
        onDineModeChange={setDineMode}
      />
    </div>
  );
}