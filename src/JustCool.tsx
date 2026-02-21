import { useState, useEffect, useRef, useCallback } from "react";
import Hero from "./components/Hero";
import CategoryNav, { CATEGORIES } from "./components/CategoryNav";
import CategorySection from "./components/CategorySection";
import Footer from "./components/Footer";
import type { Product } from "./components/CategorySection";
import Header from "./components/NavBar";
import ProductModal from "./components/Productmodal";
import CartDrawer from "./components/CartDrawer";
import type { CartItem } from "./components/CartDrawer";

// ─── Types ────────────────────────────────────────────────────────────────────

interface OrderOptions {
  crudites: string[];
  bread: string;
  sauces: string[];
  menuFormule: boolean;
  isStudent: boolean;
  supplements: string[];
}

// ─── Product Data ─────────────────────────────────────────────────────────────

const naanProducts: Product[] = [
  { id: "naan-1",  name: "Le Just Cool",  mainIngredient: "Double steak, Pomme de terre, Cheddar",                extras: "+ Salade, Tomate, Oignon", price: 9.00, imageSrc: "https://justcool.fr/assets/images/products/naans/le-just-cool.webp" },
  { id: "naan-2",  name: "Kebab",         mainIngredient: "Viande de kebab",                                      extras: "+ Salade, Tomate, Oignon", price: 7.50, imageSrc: "https://justcool.fr/assets/images/products/naans/naan-kebab.webp" },
  { id: "naan-3",  name: "Tenders",       mainIngredient: "Tenders de poulet",                                    extras: "+ Salade, Tomate, Oignon", price: 7.50, imageSrc: "https://justcool.fr/assets/images/products/naans/naan-tenders.webp" },
  { id: "naan-4",  name: "Poulet Curry",  mainIngredient: "Poulet au curry",                                      extras: "+ Salade, Tomate, Oignon", price: 7.50, imageSrc: "https://justcool.fr/assets/images/products/naans/naan-poulet-curry.webp" },
  { id: "naan-5",  name: "Veggie",        mainIngredient: "Légumes frais, cheddar",                               extras: "+ Salade, Tomate, Oignon", price: 7.50, imageSrc: "https://justcool.fr/assets/images/products/naans/naan-veggie.webp" },
  { id: "naan-6",  name: "Cordon bleu",   mainIngredient: "Cordon bleu",                                          extras: "+ Salade, Tomate, Oignon", price: 7.50, imageSrc: "https://justcool.fr/assets/images/products/naans/naan-cordon-bleu.webp" },
  { id: "naan-7",  name: "Falafel",       mainIngredient: "Falafel",                                              extras: "+ Salade, Tomate, Oignon", price: 7.50, imageSrc: "https://justcool.fr/assets/images/products/naans/naan-falafel.webp" },
  { id: "naan-8",  name: "L'oriental",    mainIngredient: "Poulet mariné épicé (spicy) avec poivrons et oignons", extras: "+ Salade, Tomate, Oignon", price: 8.00, imageSrc: "https://justcool.fr/assets/images/products/naans/naan-oriental.webp" },
  { id: "naan-9",  name: "Steak",         mainIngredient: "Steak grillé",                                         extras: "+ Salade, Tomate, Oignon", price: 7.50, imageSrc: "https://justcool.fr/assets/images/products/naans/naan-steak.webp" },
  { id: "naan-10", name: "Merguez",       mainIngredient: "Merguez",                                              extras: "+ Salade, Tomate, Oignon", price: 7.50, imageSrc: "https://justcool.fr/assets/images/products/naans/naan-merguez.webp" },
  { id: "naan-11", name: "Boursin",       mainIngredient: "Escalope + Boursin",                                   extras: "+ Salade, Tomate, Oignon", price: 8.50, isNew: true, imageSrc: "https://justcool.fr/assets/images/products/naans/naan-boursin.webp" },
];

const naanBurgerProducts: Product[] = [
  { id: "nb-1", name: "Double Naan Burger",        mainIngredient: "Double steak haché, cheddar",    extras: "+ Salade, Tomate, Oignon", price: 8.50,  imageSrc: "https://justcool.fr/assets/images/products/naan-burgers/naan-burger-double.webp" },
  { id: "nb-2", name: "Naan Chicken Burger",        mainIngredient: "Poulet pané, cheddar",           extras: "+ Salade, Tomate",         price: 7.50,  imageSrc: "https://justcool.fr/assets/images/products/naan-burgers/naan-burger-chicken.webp" },
  { id: "nb-3", name: "Naan Burger",                mainIngredient: "Steak haché, cheddar",           extras: "+ Salade, Tomate, Oignon", price: 7.50,  imageSrc: "https://justcool.fr/assets/images/products/naan-burgers/naan-burger.webp" },
  { id: "nb-4", name: "Naan Bacon Burger",          mainIngredient: "Steak, bacon, cheddar",          extras: "+ Salade, Tomate",         price: 10.00, imageSrc: "https://justcool.fr/assets/images/products/naan-burgers/naan-burger-bacon.webp" },
  { id: "nb-5", name: "Naan Double Chicken Burger", mainIngredient: "Double poulet pané, cheddar",    extras: "+ Salade",                 price: 8.50,  imageSrc: "https://justcool.fr/assets/images/products/naan-burgers/naan-burger-double-chicken.webp" },
  { id: "nb-6", name: "Duo Naan Burger",            mainIngredient: "Steak + poulet pané, cheddar",   extras: "+ Salade, Tomate",         price: 9.00,  imageSrc: "https://justcool.fr/assets/images/products/naan-burgers/naan-burger-duo.webp" },
  { id: "nb-7", name: "Naan Burger 180",            mainIngredient: "180g de viande hachée, cheddar", extras: "+ Salade, Tomate, Oignon", price: 10.00, imageSrc: "https://justcool.fr/assets/images/products/naan-burgers/naan-burger-180.webp" },
  { id: "nb-8", name: "Naan Burger 260",            mainIngredient: "260g de viande hachée, cheddar", extras: "+ Salade, Tomate, Oignon", price: 12.00, imageSrc: "https://justcool.fr/assets/images/products/naan-burgers/naan-burger-260.webp" },
];

const burgerProducts: Product[] = [
  { id: "b-1", name: "Le Bulle",           mainIngredient: "Steak haché, cheddar, sauce maison",  extras: "+ Salade, Tomate, Oignon", price: 11.00, isNew: true, imageSrc: "https://justcool.fr/assets/images/products/burgers/burger-le-bulle.webp" },
  { id: "b-2", name: "Duo Burger",          mainIngredient: "Double steak haché, cheddar",         extras: "+ Salade, Tomate, Oignon", price: 8.00,  imageSrc: "https://justcool.fr/assets/images/products/burgers/burger-duo.webp" },
  { id: "b-3", name: "Burger Bacon",        mainIngredient: "Steak, bacon, cheddar",               extras: "+ Salade, Tomate",         price: 8.50,  imageSrc: "https://justcool.fr/assets/images/products/burgers/burger-bacon.webp" },
  { id: "b-4", name: "Burger 180",          mainIngredient: "180g de viande hachée, cheddar",      extras: "+ Salade, Tomate, Oignon", price: 8.50,  imageSrc: "https://justcool.fr/assets/images/products/burgers/burger-180.webp" },
  { id: "b-5", name: "Burger 260",          mainIngredient: "260g de viande hachée, cheddar",      extras: "+ Salade, Tomate",         price: 11.00, imageSrc: "https://justcool.fr/assets/images/products/burgers/burger-260.webp" },
  { id: "b-6", name: "Double Steak Burger", mainIngredient: "Double steak haché, cheddar",         extras: "+ Salade, Tomate, Oignon", price: 7.50,  imageSrc: "https://justcool.fr/assets/images/products/burgers/burger-double-steak.webp" },
  { id: "b-7", name: "Cheese Burger",       mainIngredient: "Steak haché, double cheddar",         extras: "+ Salade, Tomate",         price: 6.50,  imageSrc: "https://justcool.fr/assets/images/products/burgers/burger-cheese.webp" },
  { id: "b-8", name: "Chicken Burger",      mainIngredient: "Poulet pané, cheddar",                extras: "+ Salade, Tomate, Oignon", price: 6.50,  imageSrc: "https://justcool.fr/assets/images/products/burgers/burger-chicken.webp" },
];

const assiettesProducts: Product[] = [
  { id: "a-1", name: "Assiette 1 Viande",   mainIngredient: "1 viande au choix",           extras: "Frites + Salade", price: 9.00,  imageSrc: "https://justcool.fr/assets/images/products/assiettes/assiette-1-viande.webp" },
  { id: "a-2", name: "Assiette 2 Viandes",  mainIngredient: "2 viandes au choix",          extras: "Frites + Salade", price: 11.00, imageSrc: "https://justcool.fr/assets/images/products/assiettes/assiette-2-viandes.webp" },
  { id: "a-3", name: "Assiette 3 Viandes",  mainIngredient: "3 viandes au choix",          extras: "Frites + Salade", price: 13.00, imageSrc: "https://justcool.fr/assets/images/products/assiettes/assiette-3-viandes.webp" },
  { id: "a-4", name: "Assiette 1 Viande+",  mainIngredient: "1 viande premium au choix",   extras: "Frites + Salade", price: 12.00, imageSrc: "https://justcool.fr/assets/images/products/assiettes/assiette-1-viande-plus.webp" },
  { id: "a-5", name: "Assiette 2 Viandes+", mainIngredient: "2 viandes premium au choix",  extras: "Frites + Salade", price: 13.00, imageSrc: "https://justcool.fr/assets/images/products/assiettes/assiette-2-viandes-plus.webp" },
  { id: "a-6", name: "Assiette 3 Viandes+", mainIngredient: "3 viandes premium au choix",  extras: "Frites + Salade", price: 14.50, imageSrc: "https://justcool.fr/assets/images/products/assiettes/assiette-3-viandes-plus.webp" },
];

const tacosProducts: Product[] = [
  { id: "t-1", name: "Tacos M",       mainIngredient: "1 viande au choix, frites",   extras: "Sauce au choix",           price: 8.00,  imageSrc: "https://justcool.fr/assets/images/products/tacos/tacos-m.webp" },
  { id: "t-2", name: "Tacos L",       mainIngredient: "2 viandes au choix, frites",  extras: "Sauce au choix",           price: 9.00,  imageSrc: "https://justcool.fr/assets/images/products/tacos/tacos-l.webp" },
  { id: "t-3", name: "Tacos XL",      mainIngredient: "3 viandes au choix, frites",  extras: "Sauce au choix",           price: 10.00, imageSrc: "https://justcool.fr/assets/images/products/tacos/tacos-xl.webp" },
  { id: "t-4", name: "Tacos XXL",     mainIngredient: "4 viandes au choix, frites",  extras: "Sauce au choix",           price: 12.00, isNew: true, imageSrc: "https://justcool.fr/assets/images/products/tacos/tacos-xxl.webp" },
  { id: "t-5", name: "Tacos Kebab",   mainIngredient: "Viande de kebab, frites",     extras: "+ Salade, Tomate, Oignon", price: 8.50,  imageSrc: "https://justcool.fr/assets/images/products/tacos/tacos-kebab.webp" },
  { id: "t-6", name: "Tacos Merguez", mainIngredient: "Merguez, frites",             extras: "Sauce au choix",           price: 8.50,  imageSrc: "https://justcool.fr/assets/images/products/tacos/tacos-merguez.webp" },
];

const texmexProducts: Product[] = [
  { id: "tx-1", name: "Quesadilla Poulet", mainIngredient: "Poulet grillé, cheddar, poivrons",       extras: "Sauce salsa",              price: 8.00, imageSrc: "https://justcool.fr/assets/images/products/snacks/quesadilla-poulet.webp" },
  { id: "tx-2", name: "Quesadilla Bœuf",  mainIngredient: "Bœuf haché épicé, cheddar, jalapeños",   extras: "Sauce salsa",              price: 8.50, imageSrc: "https://justcool.fr/assets/images/products/snacks/quesadilla-boeuf.webp" },
  { id: "tx-3", name: "Burrito Poulet",    mainIngredient: "Poulet, riz, haricots, cheddar",         extras: "Sauce salsa + crème",      price: 9.00, imageSrc: "https://justcool.fr/assets/images/products/snacks/burrito-poulet.webp" },
  { id: "tx-4", name: "Burrito Bœuf",     mainIngredient: "Bœuf haché, riz, haricots, cheddar",     extras: "Sauce salsa + crème",      price: 9.50, imageSrc: "https://justcool.fr/assets/images/products/snacks/burrito-boeuf.webp" },
  { id: "tx-5", name: "Nachos",           mainIngredient: "Chips de maïs, cheddar fondu",           extras: "Sauce jalapeño ou tomate", price: 5.00, imageSrc: "https://justcool.fr/assets/images/products/snacks/nachos.webp" },
  { id: "tx-6", name: "Wings Tex-Mex",    mainIngredient: "Ailes de poulet marinées épicées",       extras: "Sauce BBQ ou ranch",       price: 7.00, imageSrc: "https://justcool.fr/assets/images/products/snacks/wings-tex-mex.webp" },
];

const dessertProducts: Product[] = [
  { id: "d-1", name: "Churros",    mainIngredient: "Churros maison à la cannelle",          extras: "Sauce caramel",   price: 3.50, menuUpcharge: 0, studentDiscount: 0, imageSrc: "https://justcool.fr/assets/images/products/desserts/churros.webp" },
  { id: "d-2", name: "Brownie",    mainIngredient: "Brownie chocolat fondant",              extras: "Crème anglaise",  price: 3.00, menuUpcharge: 0, studentDiscount: 0, imageSrc: "https://justcool.fr/assets/images/products/desserts/brownie.webp" },
  { id: "d-3", name: "Cookie",     mainIngredient: "Cookie double chocolat, noix de pécan", extras: "",               price: 2.50, menuUpcharge: 0, studentDiscount: 0, imageSrc: "https://justcool.fr/assets/images/products/desserts/cookie.webp" },
  { id: "d-4", name: "Glace",      mainIngredient: "Boule de glace artisanale (2 boules)",  extras: "Parfum au choix", price: 3.00, menuUpcharge: 0, studentDiscount: 0, imageSrc: "https://justcool.fr/assets/images/products/desserts/glace.webp" },
  { id: "d-5", name: "Cheesecake", mainIngredient: "Cheesecake New-York aux fruits rouges", extras: "",               price: 4.00, menuUpcharge: 0, studentDiscount: 0, imageSrc: "https://justcool.fr/assets/images/products/desserts/cheesecake.webp" },
  { id: "d-6", name: "Tiramisu",   mainIngredient: "Tiramisu café & mascarpone",            extras: "",               price: 4.50, menuUpcharge: 0, studentDiscount: 0, imageSrc: "https://justcool.fr/assets/images/products/desserts/tiramisu.webp" },
];

const boissonProducts: Product[] = [
  { id: "bv-1", name: "Boisson 33cl",    mainIngredient: "Coca-Cola, Fanta, Sprite, Ice Tea",   extras: "",               price: 2.00, menuUpcharge: 0, studentDiscount: 0, imageSrc: "https://justcool.fr/assets/images/products/boissons/boisson-33cl.webp" },
  { id: "bv-2", name: "Eau Minérale",    mainIngredient: "Eau plate ou pétillante 50cl",        extras: "",               price: 1.50, menuUpcharge: 0, studentDiscount: 0, imageSrc: "https://justcool.fr/assets/images/products/boissons/eau-minerale.webp" },
  { id: "bv-3", name: "Jus de fruit",    mainIngredient: "Jus d'orange, pomme ou ananas 25cl",  extras: "",               price: 2.00, menuUpcharge: 0, studentDiscount: 0, imageSrc: "https://justcool.fr/assets/images/products/boissons/jus-fruit.webp" },
  { id: "bv-4", name: "Capri-Sun",       mainIngredient: "Capri-Sun 20cl, diverses saveurs",    extras: "",               price: 1.50, menuUpcharge: 0, studentDiscount: 0, imageSrc: "https://justcool.fr/assets/images/products/boissons/capri-sun.webp" },
  { id: "bv-5", name: "Limonade",        mainIngredient: "Limonade artisanale maison",          extras: "Citron, menthe", price: 2.50, menuUpcharge: 0, studentDiscount: 0, imageSrc: "https://justcool.fr/assets/images/products/boissons/limonade.webp" },
  { id: "bv-6", name: "Thé à la menthe", mainIngredient: "Thé vert à la menthe fraîche",        extras: "Chaud ou froid", price: 2.50, menuUpcharge: 0, studentDiscount: 0, imageSrc: "https://justcool.fr/assets/images/products/boissons/the-menthe.webp" },
];

const plusProducts: Product[] = [
  { id: "p-1", name: "Frites",        mainIngredient: "Frites fraîches maison",                 extras: "Sel + ketchup", price: 3.00, menuUpcharge: 0, studentDiscount: 0, imageSrc: "https://justcool.fr/assets/images/products/plus/frites.webp" },
  { id: "p-2", name: "Frites Cheezy", mainIngredient: "Frites recouvertes de sauce fromagère",  extras: "",              price: 4.00, menuUpcharge: 0, studentDiscount: 0, imageSrc: "https://justcool.fr/assets/images/products/plus/frites-cheezy.webp" },
  { id: "p-3", name: "Salade",        mainIngredient: "Salade verte, tomates, oignons",         extras: "Vinaigrette",   price: 3.00, menuUpcharge: 0, studentDiscount: 0, imageSrc: "https://justcool.fr/assets/images/products/plus/salade.webp" },
  { id: "p-4", name: "Sauce Sup.",    mainIngredient: "Sauce supplémentaire au choix",           extras: "",              price: 0.50, menuUpcharge: 0, studentDiscount: 0, imageSrc: "https://justcool.fr/assets/images/products/plus/sauce-sup.webp" },
  { id: "p-5", name: "Pain seul",     mainIngredient: "Pain naan, galette ou turc",              extras: "",              price: 1.00, menuUpcharge: 0, studentDiscount: 0, imageSrc: "https://justcool.fr/assets/images/products/plus/pain.webp" },
];

const SECTIONS = [
  { categoryId: "naans",        categoryLabel: "Naans",        products: naanProducts },
  { categoryId: "naan_burgers", categoryLabel: "Naan Burgers", products: naanBurgerProducts },
  { categoryId: "burgers",      categoryLabel: "Burgers",      products: burgerProducts },
  { categoryId: "assiettes",    categoryLabel: "Assiettes",    products: assiettesProducts },
  { categoryId: "tacos",        categoryLabel: "Tacos",        products: tacosProducts },
  { categoryId: "snacks",       categoryLabel: "Tex-Mex",      products: texmexProducts },
  { categoryId: "desserts",     categoryLabel: "Desserts",     products: dessertProducts },
  { categoryId: "boissons",     categoryLabel: "Boissons",     products: boissonProducts },
  { categoryId: "plus",         categoryLabel: "Plus",         products: plusProducts },
];

const STICKY_OFFSET = 60 + 48;

// ─── Cart helpers ──────────────────────────────────────────────────────────────

/**
 * Build a stable cart line ID from product + options so the same
 * product with different options creates separate cart lines.
 */
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
  return Math.max(0, price);
}

// ─── App ──────────────────────────────────────────────────────────────────────

export default function JustCool() {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [dineMode, setDineMode] = useState<"surplace" | "emporter">("surplace");

  const [activeCategory, setActiveCategory] = useState(SECTIONS[0].categoryId);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  const isScrollingRef = useRef(false);
  const scrollTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const cartCount = cartItems.reduce((s, i) => s + i.quantity, 0);

  // ── IntersectionObserver ────────────────────────────────────────────────────
  useEffect(() => {
    const observers: IntersectionObserver[] = [];
    SECTIONS.forEach(({ categoryId }) => {
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
  }, []);

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
        },
      };
      return [...prev, newItem];
    });

    setCartOpen(true);   // auto-open cart drawer after adding
  };

  const handleUpdateQty = (id: string, qty: number) => {
    setCartItems((prev) => prev.map((i) => i.id === id ? { ...i, quantity: qty } : i));
  };

  const handleRemove = (id: string) => {
    setCartItems((prev) => prev.filter((i) => i.id !== id));
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <Header
        cartCount={cartCount}
        onCartClick={() => setCartOpen(true)}
      />

      <main>
        <Hero />
        <CategoryNav
          activeId={activeCategory}
          onSelect={handleCategorySelect}
          topOffset="3.75rem"
        />

        {SECTIONS.map(({ categoryId, categoryLabel, products }) => (
          <CategorySection
            key={categoryId}
            categoryId={categoryId}
            categoryLabel={categoryLabel}
            products={products}
            onProductClick={openModal}
          />
        ))}
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