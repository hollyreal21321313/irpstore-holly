import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Plus, Minus, ChevronDown, ChevronUp, ShoppingBag, ChevronLeft, ChevronRight, ArrowLeft, Tag, Check } from "lucide-react";

import irpLogo from "./assets/irp_logo_nobg.png";
import tBlack1 from "@assets/photo_2026-04-06_20.32.00_1775496962199.jpeg";
import tBlack2 from "@assets/photo_2026-04-06_20.31.52_1775496962198.jpeg";
import tBlack3 from "@assets/photo_2026-04-06_20.32.05_1775496962199.jpeg";
import tBlack4 from "@assets/photo_2026-04-06_20.32.09_1775496962200.jpeg";
import tBlack5 from "@assets/photo_2026-04-06_20.32.13_1775496962201.jpeg";
import tBlack6 from "@assets/photo_2026-04-06_20.32.15_1775496962203.jpeg";
import zipHoodie2 from "@assets/photo_2026-04-06_19.40.05_1775493628490.jpeg";
import zipHoodie3 from "@assets/photo_2026-04-06_19.39.58_1775493628494.jpeg";
import zipHoodie4 from "@assets/photo_2026-04-06_19.39.56_1775493628495.jpeg";
import zipHoodie5 from "@assets/photo_2026-04-06_19.39.49_1775493628496.jpeg";
import zipHoodie6 from "@assets/photo_2026-04-06_19.39.53_1775493628497.jpeg";
import zipHoodie7 from "@assets/photo_2026-04-06_19.40.07_1775493628498.jpeg";

// --- DATA ---

const PRODUCTS = [
  {
    title: "Футболка Core White",
    category: "Футболки",
    description: "Плотный премиум хлопок, чистый силуэт и универсальная база на каждый день.",
    price: "2 490 ₽",
    oldPrice: "2 990 ₽",
    saleBadge: "-17%",
    sizes: "S / M / L / XL",
  },
  {
    title: "ФУТБОЛКА IRP BLACK",
    category: "Футболки",
    description: "Минималистичная футболка в чёрном цвете с уверенной посадкой.",
    price: "4 500 ₽",
    oldPrice: "",
    saleBadge: "",
    sizes: "S / M / L / XL",
    images: [tBlack1, tBlack2, tBlack3, tBlack4, tBlack5, tBlack6],
  },
  {
    title: "ХУДИ С ЗИПОМ IRP",
    category: "Худи",
    description: "Мягкий футер, объёмный крой и премиальный комфорт в повседневной носке.",
    price: "10 000 ₽",
    oldPrice: "",
    saleBadge: "SALE",
    sizes: "M / L / XL",
    images: [zipHoodie5, zipHoodie6, zipHoodie4, zipHoodie3, zipHoodie2, zipHoodie7],
  },
  {
    title: "Худи Heavy Gray",
    category: "Худи",
    description: "Плотный материал и чистая подача без лишних деталей.",
    price: "5 290 ₽",
    oldPrice: "",
    saleBadge: "",
    sizes: "S / M / L",
  },
  {
    title: "Штаны Urban Fit",
    category: "Штаны",
    description: "Аккуратная посадка, комфорт в движении и универсальный стиль.",
    price: "3 990 ₽",
    oldPrice: "4 490 ₽",
    saleBadge: "-11%",
    sizes: "S / M / L / XL",
  },
  {
    title: "Штаны Relaxed Black",
    category: "Штаны",
    description: "Свободный крой и глубокий чёрный оттенок для базового гардероба.",
    price: "4 290 ₽",
    oldPrice: "",
    saleBadge: "",
    sizes: "M / L / XL",
  },
];

const BENEFITS = [
  { title: "Плотные ткани", text: "Футболки и худи держат форму и ощущаются дороже своей цены." },
  { title: "Понятный размерный ряд", text: "S / M / L / XL с удобным обменом, если посадка не подошла." },
  { title: "Готово к продажам", text: "Фото, скидки, корзина, FAQ, доставка, оплата и контактный блок уже на месте." },
];

const FAQ_ITEMS = [
  { question: "Как выбрать размер?", answer: "Выберите размер прямо в карточке товара. Если сомневаетесь, отправьте нам рост и вес — поможем подобрать." },
  { question: "Можно ли оплатить не на сайте, а через менеджера?", answer: "Да. Кнопку оформления можно вести на Telegram, WhatsApp или на внешний checkout/платёжную страницу." },
  { question: "Что делать, если размер не подошёл?", answer: "Мы предусмотрели обмен размера. Уточните условия и адрес возврата в вашем контактном блоке ниже." },
];

// --- UTILS ---

function parseSizes(value: string): string[] {
  if (!value) return [];
  return value.replaceAll(",", "/").split("/").map((s) => s.trim()).filter(Boolean);
}

function parsePrice(value: string): number {
  const raw = String(value);
  let cleaned = "";
  for (const char of raw) {
    if ((char >= "0" && char <= "9") || char === "." || char === ",") cleaned += char;
  }
  const normalized = cleaned.replace(",", ".");
  const numeric = parseFloat(normalized);
  return Number.isFinite(numeric) ? numeric : 0;
}

function formatPrice(value: number, symbol = "₽"): string {
  return Math.round(value).toLocaleString("ru-RU") + " " + symbol;
}

const getCategories = (products: typeof PRODUCTS) => {
  const unique = Array.from(new Set(products.map((p) => p.category).filter(Boolean)));
  return ["Все", ...unique];
};

// --- IMAGE CAROUSEL ---

function ProductImageCarousel({ images }: { images: string[] }) {
  const [[page, dir], setPage] = useState<[number, number]>([0, 0]);
  const total = images.length;

  const paginate = (newDir: number) => {
    setPage(([cur]) => {
      const next = (cur + newDir + total) % total;
      return [next, newDir];
    });
  };

  const variants = {
    enter: (d: number) => ({ x: d > 0 ? "100%" : "-100%", opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (d: number) => ({ x: d > 0 ? "-100%" : "100%", opacity: 0 }),
  };

  return (
    <div className="relative aspect-[4/5] overflow-hidden bg-[#111] select-none">
      <AnimatePresence initial={false} custom={dir}>
        <motion.img
          key={page}
          src={images[page]}
          alt={`Фото ${page + 1}`}
          custom={dir}
          variants={variants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          className="absolute inset-0 w-full h-full object-cover"
          drag="x"
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={0.15}
          onDragEnd={(_e, { offset }) => {
            if (offset.x < -40) paginate(1);
            else if (offset.x > 40) paginate(-1);
          }}
        />
      </AnimatePresence>

      {/* Arrows */}
      <button
        onClick={() => paginate(-1)}
        className="absolute left-2.5 top-1/2 -translate-y-1/2 z-10 w-8 h-8 rounded-full bg-black/50 backdrop-blur-sm border border-white/10 flex items-center justify-center hover:bg-black/70 transition-colors"
      >
        <ChevronLeft className="w-4 h-4" />
      </button>
      <button
        onClick={() => paginate(1)}
        className="absolute right-2.5 top-1/2 -translate-y-1/2 z-10 w-8 h-8 rounded-full bg-black/50 backdrop-blur-sm border border-white/10 flex items-center justify-center hover:bg-black/70 transition-colors"
      >
        <ChevronRight className="w-4 h-4" />
      </button>

      {/* Dots */}
      <div className="absolute bottom-3 left-0 right-0 flex justify-center gap-1.5 z-10">
        {images.map((_, i) => (
          <button
            key={i}
            onClick={() => setPage([i, i > page ? 1 : -1])}
            className={`rounded-full transition-all ${
              i === page ? "w-4 h-1.5 bg-white" : "w-1.5 h-1.5 bg-white/40 hover:bg-white/60"
            }`}
          />
        ))}
      </div>
    </div>
  );
}

// --- ANIMATION ---
const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.65, ease: [0.22, 1, 0.36, 1] },
  },
};

// --- TYPES ---
type CartItem = {
  key: string;
  title: string;
  size: string;
  priceLabel: string;
  priceValue: number;
  quantity: number;
  thumbnail?: string;
};

// --- VALID PROMO CODES ---
const PROMO_CODES: Record<string, number> = {
  IRP10: 10,
  IRP15: 15,
};

type PaymentMethod = "sbp" | "card" | "installment";

function CheckoutPage({
  items,
  total,
  onBack,
  onSuccess,
}: {
  items: CartItem[];
  total: number;
  onBack: () => void;
  onSuccess: () => void;
}) {
  const [email, setEmail] = useState("");
  const [promoInput, setPromoInput] = useState("");
  const [promoApplied, setPromoApplied] = useState<{ code: string; discount: number } | null>(null);
  const [promoError, setPromoError] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("card");
  const [submitted, setSubmitted] = useState(false);

  const discountAmount = promoApplied ? Math.round(total * promoApplied.discount / 100) : 0;
  const finalTotal = total - discountAmount;
  const installmentAmount = Math.round(finalTotal / 4);

  const applyPromo = () => {
    const code = promoInput.trim().toUpperCase();
    if (PROMO_CODES[code]) {
      setPromoApplied({ code, discount: PROMO_CODES[code] });
      setPromoError(false);
    } else {
      setPromoError(true);
      setPromoApplied(null);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.07 } },
  };
  const rowVariants = {
    hidden: { opacity: 0, y: 18 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } },
  };

  if (submitted) {
    return (
      <motion.div
        key="success"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="fixed inset-0 z-50 bg-[#0a0a0a] flex flex-col items-center justify-center text-center px-8"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="w-20 h-20 rounded-full bg-white flex items-center justify-center mb-8"
        >
          <Check className="w-9 h-9 text-black" />
        </motion.div>
        <motion.h2
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="text-3xl font-bold mb-3"
        >
          Заказ оформлен
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.45, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="text-white/60 text-lg mb-10"
        >
          Подтверждение отправлено на&nbsp;{email}
        </motion.p>
        <motion.button
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.55, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          onClick={onSuccess}
          className="px-10 py-3.5 bg-white text-black rounded-xl font-bold hover:opacity-90 transition-opacity"
        >
          Вернуться в магазин
        </motion.button>
      </motion.div>
    );
  }

  return (
    <motion.div
      key="checkout"
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 40 }}
      transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
      className="fixed inset-0 z-50 bg-[#0a0a0a] overflow-y-auto"
    >
      {/* Header */}
      <div className="sticky top-0 z-10 bg-[#0a0a0a]/90 backdrop-blur-md border-b border-white/10 px-6 py-4 flex items-center gap-4">
        <button
          onClick={onBack}
          className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center hover:bg-white/5 transition-colors flex-shrink-0"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>
        <h1 className="text-xl font-bold tracking-tight">Оформление заказа</h1>
      </div>

      <div className="max-w-lg mx-auto px-6 pb-24 pt-8">
        <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-8">

          {/* Order summary */}
          <motion.div variants={rowVariants} className="space-y-4">
            <h2 className="text-xs font-bold uppercase tracking-widest text-white/40">Ваш заказ</h2>
            <div className="space-y-3">
              {items.map((item) => (
                <div key={item.key} className="flex gap-4 items-center bg-white/[0.03] border border-white/8 rounded-2xl p-3">
                  <div className="w-16 h-20 rounded-xl overflow-hidden bg-white/5 flex items-center justify-center flex-shrink-0 border border-white/10">
                    {item.thumbnail ? (
                      <img src={item.thumbnail} alt={item.title} className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-[9px] opacity-30 font-bold uppercase tracking-widest">IRP</span>
                    )}
                  </div>
                  <div className="flex-grow min-w-0">
                    <p className="font-semibold text-sm leading-tight truncate">{item.title}</p>
                    <p className="text-xs text-white/50 mt-1">Размер: {item.size}</p>
                    <p className="text-xs text-white/50">Кол-во: {item.quantity}</p>
                  </div>
                  <p className="font-bold text-sm flex-shrink-0">{item.priceLabel}</p>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Promo code */}
          <motion.div variants={rowVariants} className="space-y-3">
            <h2 className="text-xs font-bold uppercase tracking-widest text-white/40">Промокод</h2>
            <div className="flex gap-2">
              <div className="relative flex-grow">
                <Tag className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                <input
                  type="text"
                  placeholder="Введите промокод"
                  value={promoInput}
                  onChange={(e) => { setPromoInput(e.target.value); setPromoError(false); }}
                  disabled={!!promoApplied}
                  className="w-full bg-white/[0.04] border border-white/10 rounded-xl pl-10 pr-4 py-3.5 text-sm placeholder:text-white/30 focus:outline-none focus:border-white/30 transition-colors disabled:opacity-60"
                />
              </div>
              {promoApplied ? (
                <button
                  onClick={() => { setPromoApplied(null); setPromoInput(""); }}
                  className="px-5 py-3.5 bg-white/10 border border-white/10 rounded-xl text-sm font-medium hover:bg-white/15 transition-colors flex-shrink-0"
                >
                  Убрать
                </button>
              ) : (
                <button
                  onClick={applyPromo}
                  className="px-5 py-3.5 bg-white text-black rounded-xl text-sm font-bold hover:opacity-90 transition-opacity flex-shrink-0"
                >
                  Применить
                </button>
              )}
            </div>
            <AnimatePresence>
              {promoApplied && (
                <motion.p
                  initial={{ opacity: 0, y: -6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                  className="text-sm text-green-400 flex items-center gap-1.5"
                >
                  <Check className="w-3.5 h-3.5" /> Промокод применён — скидка {promoApplied.discount}%
                </motion.p>
              )}
              {promoError && (
                <motion.p
                  initial={{ opacity: 0, y: -6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                  className="text-sm text-red-400"
                >
                  Промокод не найден
                </motion.p>
              )}
            </AnimatePresence>
          </motion.div>

          {/* Email */}
          <motion.div variants={rowVariants} className="space-y-3">
            <h2 className="text-xs font-bold uppercase tracking-widest text-white/40">Контакт</h2>
            <input
              type="email"
              placeholder="Email для подтверждения"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-white/[0.04] border border-white/10 rounded-xl px-4 py-3.5 text-sm placeholder:text-white/30 focus:outline-none focus:border-white/30 transition-colors"
            />
          </motion.div>

          {/* Payment method */}
          <motion.div variants={rowVariants} className="space-y-3">
            <h2 className="text-xs font-bold uppercase tracking-widest text-white/40">Способ оплаты</h2>
            <div className="grid grid-cols-3 gap-3">
              {(
                [
                  { id: "sbp", label: "СБП", sub: "Система быстрых платежей" },
                  { id: "card", label: "Картой", sub: "Visa / MasterCard / МИР" },
                  { id: "installment", label: "Долями", sub: `4 × ${formatPrice(installmentAmount)}` },
                ] as { id: PaymentMethod; label: string; sub: string }[]
              ).map((method) => (
                <button
                  key={method.id}
                  onClick={() => setPaymentMethod(method.id)}
                  className={`relative flex flex-col items-center justify-center text-center gap-1.5 rounded-2xl border p-4 transition-all duration-200 ${
                    paymentMethod === method.id
                      ? "bg-white text-black border-white"
                      : "bg-white/[0.03] border-white/10 hover:bg-white/[0.06] text-white"
                  }`}
                >
                  <span className="font-bold text-sm">{method.label}</span>
                  <span className={`text-[10px] leading-tight ${paymentMethod === method.id ? "text-black/60" : "text-white/40"}`}>
                    {method.sub}
                  </span>
                  {paymentMethod === method.id && (
                    <motion.div
                      layoutId="payment-indicator"
                      className="absolute top-2 right-2 w-4 h-4 rounded-full bg-black flex items-center justify-center"
                      transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
                    >
                      <Check className="w-2.5 h-2.5 text-white" />
                    </motion.div>
                  )}
                </button>
              ))}
            </div>
            <AnimatePresence>
              {paymentMethod === "installment" && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                  className="overflow-hidden"
                >
                  <div className="bg-white/[0.04] border border-white/10 rounded-2xl p-4 text-sm space-y-2">
                    <p className="font-semibold">График платежей:</p>
                    {[0, 1, 2, 3].map((i) => (
                      <div key={i} className="flex justify-between text-white/70">
                        <span>Платёж {i + 1} {i === 0 ? "(сейчас)" : `(через ${i * 2} нед.)`}</span>
                        <span className="font-medium text-white">{formatPrice(installmentAmount)}</span>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          {/* Total + confirm */}
          <motion.div variants={rowVariants} className="space-y-4 pt-2">
            <div className="space-y-2 border-t border-white/10 pt-4">
              <div className="flex justify-between text-sm text-white/60">
                <span>Товары</span>
                <span>{formatPrice(total)}</span>
              </div>
              {discountAmount > 0 && (
                <div className="flex justify-between text-sm text-green-400">
                  <span>Скидка по промокоду</span>
                  <span>−{formatPrice(discountAmount)}</span>
                </div>
              )}
              <div className="flex justify-between text-lg font-bold pt-1">
                <span>Итого</span>
                <span>{formatPrice(finalTotal)}</span>
              </div>
            </div>
            <button
              onClick={() => {
                if (!email.trim()) return;
                setSubmitted(true);
              }}
              disabled={!email.trim()}
              className="w-full py-4 bg-white text-black rounded-xl font-bold text-lg hover:opacity-90 transition-opacity disabled:opacity-30 disabled:cursor-not-allowed"
            >
              {paymentMethod === "installment" ? `Оплатить ${formatPrice(installmentAmount)} сейчас` : `Оплатить ${formatPrice(finalTotal)}`}
            </button>
          </motion.div>

        </motion.div>
      </div>
    </motion.div>
  );
}

export default function App() {
  const categories = getCategories(PRODUCTS);
  const [activeCategory, setActiveCategory] = useState("Все");
  const [selectedSizes, setSelectedSizes] = useState<Record<string, string>>({});
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const filteredProducts = activeCategory === "Все" ? PRODUCTS : PRODUCTS.filter((p) => p.category === activeCategory);

  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const cartTotal = cartItems.reduce((sum, item) => sum + item.quantity * item.priceValue, 0);

  const toggleSize = (productTitle: string, size: string) => {
    setSelectedSizes((prev) => ({
      ...prev,
      [productTitle]: prev[productTitle] === size ? "" : size,
    }));
  };

  const addToCart = (product: typeof PRODUCTS[0]) => {
    const sizes = parseSizes(product.sizes);
    const selectedSize = selectedSizes[product.title];

    if (sizes.length > 0 && !selectedSize) return;

    const cartKey = `${product.title}-${selectedSize || "one-size"}`;
    const priceValue = parsePrice(product.price);

    setCartItems((prev) => {
      const existing = prev.find((item) => item.key === cartKey);
      if (existing) {
        return prev.map((item) => (item.key === cartKey ? { ...item, quantity: item.quantity + 1 } : item));
      }
      return [
        ...prev,
        {
          key: cartKey,
          title: product.title,
          size: selectedSize || "One Size",
          priceLabel: product.price,
          priceValue,
          quantity: 1,
          thumbnail: ("images" in product && Array.isArray((product as { images?: string[] }).images) && (product as { images?: string[] }).images!.length > 0)
            ? (product as { images: string[] }).images[0]
            : ("thumbnail" in product ? (product as { thumbnail?: string }).thumbnail : undefined),
        },
      ];
    });

    setCartOpen(true);
  };

  const updateQuantity = (key: string, delta: number) => {
    setCartItems((prev) =>
      prev
        .map((item) => (item.key === key ? { ...item, quantity: item.quantity + delta } : item))
        .filter((item) => item.quantity > 0)
    );
  };

  return (
    <div className="w-full min-h-screen bg-[#0a0a0a] text-white font-sans overflow-x-hidden selection:bg-white selection:text-black">
      {/* Top Bar */}
      <div className="bg-white/10 text-white/80 text-center py-2.5 px-4 text-[13px] tracking-wide">
        Бесплатная доставка от 7 000 ₽ • Обмен размера 14 дней • Оплата картой / SBP
      </div>

      {/* Sticky Header */}
      <header className="sticky top-0 z-30 bg-[#0a0a0a]/75 backdrop-blur-md border-b border-white/[0.09]">
        <div className="max-w-[1240px] mx-auto px-5 py-4 flex items-center justify-between gap-5">
          <img src={irpLogo} alt="IRP" className="h-9 w-auto" style={{ filter: "invert(1)" }} />
          <nav className="hidden md:flex items-center gap-6 text-sm opacity-80">
            <a href="#catalog" className="hover:opacity-100 transition-opacity">
              Каталог
            </a>
            <a href="#benefits" className="hover:opacity-100 transition-opacity">
              Доставка
            </a>
            <a href="#faq" className="hover:opacity-100 transition-opacity">
              FAQ
            </a>
            <a href="#contacts" className="hover:opacity-100 transition-opacity">
              Контакты
            </a>
          </nav>

          <button
            data-testid="btn-open-cart"
            onClick={() => setCartOpen(true)}
            className="flex items-center gap-2.5 bg-white text-black px-4 py-2.5 rounded-full font-semibold text-sm hover:scale-105 transition-transform"
          >
            <span>Корзина</span>
            <span className="min-w-[24px] h-[24px] rounded-full bg-black/10 inline-flex items-center justify-center text-xs">
              {cartCount}
            </span>
          </button>
        </div>
      </header>

      {/* Hero Section */}
      <motion.section
        variants={fadeUp}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        className="max-w-[1240px] mx-auto px-5 pt-[72px] pb-10 grid grid-cols-1 md:grid-cols-2 gap-8 items-center"
      >
        <div>
          <div className="inline-block mb-5 px-3.5 py-2 rounded-full bg-white/5 border border-white/10 text-[13px] opacity-95">
            NEW DROP • PREMIUM CLOTHING
          </div>

          <h1 className="m-0 text-[clamp(42px,7vw,68px)] leading-[0.98] tracking-tight font-bold">
            Redefining <br /> Essentials.
          </h1>

          <p className="mt-5 max-w-[620px] text-lg leading-[1.7] opacity-75">
            Премиальные материалы, выверенный крой и внимание к деталям. Строгий и уверенный стиль для тех, кто ценит качество без компромиссов.
          </p>

          <div className="flex flex-wrap gap-3.5 mt-8">
            <a
              href="#catalog"
              className="inline-block bg-white text-black px-6 py-3.5 rounded-full font-semibold hover:opacity-90 transition-opacity"
            >
              Смотреть каталог
            </a>
            <a
              href="#contacts"
              className="inline-block border border-white/20 text-white px-6 py-3.5 rounded-full font-semibold hover:bg-white/5 transition-colors"
            >
              Связаться с нами
            </a>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mt-8">
            {["Плотный хлопок", "Оверсайз фит", "Унисекс"].map((item) => (
              <div
                key={item}
                className="px-3.5 py-3 rounded-[18px] border border-white/10 bg-white/[0.03] text-sm opacity-90 text-center flex items-center justify-center"
              >
                {item}
              </div>
            ))}
          </div>
        </div>

        <div className="min-h-[460px] rounded-[34px] border border-white/10 bg-gradient-to-br from-white/10 to-transparent flex items-end justify-center p-7 relative overflow-hidden">
          {/* Subtle noise/gradient background */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.08),transparent_40%),radial-gradient(circle_at_bottom_left,rgba(255,255,255,0.05),transparent_40%)]" />

          {/* Floating Drop Card */}
          <div className="relative w-full max-w-[360px] p-6 rounded-[28px] bg-black/40 backdrop-blur-xl border border-white/10 shadow-2xl">
            <div className="text-xs opacity-70 mb-2.5 uppercase tracking-wider">DROP 01</div>
            <div className="text-3xl font-bold leading-[1.1]">Limited Essentials</div>
            <div className="mt-2.5 opacity-75 leading-[1.6] text-sm">
              Базовые силуэты, доведённые до совершенства. Доступно прямо сейчас.
            </div>
          </div>
        </div>
      </motion.section>

      {/* Catalog Section */}
      <motion.section
        id="catalog"
        variants={fadeUp}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.15 }}
        className="max-w-[1240px] mx-auto px-5 py-[84px]"
      >
        <div className="mb-8">
          <h2 className="text-3xl font-semibold tracking-wide mb-2.5">Каталог</h2>
          <p className="opacity-70 leading-[1.7] max-w-[720px]">
            Выбирайте из нашей основной коллекции. Все вещи готовы к отправке.
          </p>
        </div>

        <div className="flex flex-wrap gap-3 mb-8">
          {categories.map((category) => {
            const isActive = activeCategory === category;
            return (
              <button
                key={category}
                data-testid={`filter-${category}`}
                onClick={() => setActiveCategory(category)}
                className={`px-4 py-2 rounded-full border text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-white border-white text-black"
                    : "border-white/10 bg-transparent text-white hover:bg-white/5"
                }`}
              >
                {category}
              </button>
            );
          })}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProducts.map((product) => {
            const sizes = parseSizes(product.sizes);
            const selectedSize = selectedSizes[product.title];
            const needsSize = sizes.length > 0;
            const canAdd = !needsSize || Boolean(selectedSize);

            return (
              <motion.div
                key={product.title}
                whileHover={{ y: -6 }}
                transition={{ duration: 0.28 }}
                className="bg-white/[0.03] border border-white/[0.09] rounded-[26px] overflow-hidden flex flex-col"
              >
                {"images" in product && product.images ? (
                  <div className="relative">
                    <ProductImageCarousel images={product.images} />
                    <div className="absolute top-4 left-4 flex gap-2 flex-wrap z-10">
                      {product.saleBadge && (
                        <div className="bg-white text-black px-2.5 py-1.5 rounded-full text-xs font-bold">
                          {product.saleBadge}
                        </div>
                      )}
                      {product.category && (
                        <div className="bg-black/50 text-white px-2.5 py-1.5 rounded-full text-xs backdrop-blur-sm">
                          {product.category}
                        </div>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="relative aspect-[4/5] bg-gradient-to-br from-white/[0.08] to-white/[0.02] flex items-center justify-center overflow-hidden">
                    <div className="text-white/30 font-bold tracking-[0.18em] uppercase text-xl">
                      IRP
                    </div>
                    <div className="absolute top-4 left-4 flex gap-2 flex-wrap">
                      {product.saleBadge && (
                        <div className="bg-white text-black px-2.5 py-1.5 rounded-full text-xs font-bold">
                          {product.saleBadge}
                        </div>
                      )}
                      {product.category && (
                        <div className="bg-black/50 text-white px-2.5 py-1.5 rounded-full text-xs backdrop-blur-sm">
                          {product.category}
                        </div>
                      )}
                    </div>
                  </div>
                )}

                <div className="p-6 flex flex-col flex-grow">
                  <h3 className="text-xl font-bold mb-2">{product.title}</h3>
                  <p className="text-sm opacity-60 leading-relaxed mb-4 flex-grow">
                    {product.description}
                  </p>

                  <div className="flex items-center gap-3 mb-5">
                    <span className="text-xl font-bold">{product.price}</span>
                    {product.oldPrice && (
                      <span className="text-sm opacity-50 line-through">{product.oldPrice}</span>
                    )}
                  </div>

                  {needsSize && (
                    <div className="flex flex-wrap gap-2 mb-5">
                      {sizes.map((size) => {
                        const isSelected = selectedSize === size;
                        return (
                          <button
                            key={size}
                            onClick={() => toggleSize(product.title, size)}
                            className={`min-w-[40px] h-[40px] px-2 rounded-xl text-sm font-medium transition-colors border ${
                              isSelected
                                ? "bg-white text-black border-white"
                                : "bg-white/5 border-white/10 text-white hover:bg-white/10"
                            }`}
                          >
                            {size}
                          </button>
                        );
                      })}
                    </div>
                  )}

                  <button
                    onClick={() => addToCart(product)}
                    disabled={!canAdd}
                    data-testid={`add-to-cart-${product.title}`}
                    className={`w-full py-3.5 rounded-xl font-semibold transition-all ${
                      canAdd
                        ? "bg-white text-black hover:opacity-90"
                        : "bg-white/10 text-white/40 cursor-not-allowed"
                    }`}
                  >
                    В корзину
                  </button>
                </div>
              </motion.div>
            );
          })}
        </div>
      </motion.section>

      {/* Benefits Section */}
      <motion.section
        id="benefits"
        variants={fadeUp}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.15 }}
        className="max-w-[1240px] mx-auto px-5 py-[84px]"
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {BENEFITS.map((benefit, i) => (
            <div
              key={i}
              className="bg-white/[0.03] border border-white/[0.09] rounded-[24px] p-8 hover:bg-white/[0.05] transition-colors"
            >
              <h3 className="text-lg font-bold mb-3">{benefit.title}</h3>
              <p className="opacity-70 leading-relaxed text-sm">{benefit.text}</p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
          <div className="bg-[#111] border border-white/5 rounded-[24px] p-8">
            <h4 className="text-white/60 text-sm font-semibold uppercase tracking-wider mb-4">Доставка</h4>
            <ul className="space-y-3 text-sm opacity-80">
              <li>По Москве: 1-2 дня</li>
              <li>По России: 3-5 дней (СДЭК)</li>
              <li>Бесплатно от 7 000 ₽</li>
            </ul>
          </div>
          <div className="bg-[#111] border border-white/5 rounded-[24px] p-8">
            <h4 className="text-white/60 text-sm font-semibold uppercase tracking-wider mb-4">Оплата</h4>
            <ul className="space-y-3 text-sm opacity-80">
              <li>Картой на сайте</li>
              <li>SBP (СБП)</li>
              <li>Долями / Сплит</li>
            </ul>
          </div>
          <div className="bg-[#111] border border-white/5 rounded-[24px] p-8">
            <h4 className="text-white/60 text-sm font-semibold uppercase tracking-wider mb-4">Возврат</h4>
            <ul className="space-y-3 text-sm opacity-80">
              <li>14 дней на примерку</li>
              <li>Простой обмен размера</li>
              <li>Возврат средств на карту</li>
            </ul>
          </div>
        </div>
      </motion.section>

      {/* FAQ Section */}
      <motion.section
        id="faq"
        variants={fadeUp}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.15 }}
        className="max-w-[800px] mx-auto px-5 py-[84px]"
      >
        <h2 className="text-3xl font-semibold text-center mb-10">Частые вопросы</h2>
        <div className="space-y-4">
          {FAQ_ITEMS.map((item, index) => {
            const isOpen = openFaq === index;
            return (
              <div
                key={index}
                className="bg-white/[0.03] border border-white/[0.09] rounded-[20px] overflow-hidden"
              >
                <button
                  onClick={() => setOpenFaq(isOpen ? null : index)}
                  className="w-full px-6 py-5 flex items-center justify-between text-left font-medium"
                >
                  <span>{item.question}</span>
                  {isOpen ? (
                    <ChevronUp className="w-5 h-5 opacity-60" />
                  ) : (
                    <ChevronDown className="w-5 h-5 opacity-60" />
                  )}
                </button>
                <AnimatePresence>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="px-6 pb-5 text-sm opacity-70 leading-relaxed"
                    >
                      {item.answer}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </motion.section>

      {/* Contacts Section */}
      <motion.section
        id="contacts"
        variants={fadeUp}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.15 }}
        className="max-w-[1240px] mx-auto px-5 py-[84px]"
      >
        <div className="bg-gradient-to-br from-[#1a1a1a] to-[#0a0a0a] border border-white/10 rounded-[32px] p-10 md:p-14 text-center max-w-[800px] mx-auto relative overflow-hidden">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-md h-[200px] bg-white/5 blur-[80px] rounded-full pointer-events-none" />
          
          <h2 className="text-3xl font-bold mb-4 relative z-10">Остались вопросы?</h2>
          <p className="opacity-70 mb-8 max-w-[400px] mx-auto relative z-10">
            Напишите нам в Telegram. Мы на связи каждый день с 10:00 до 22:00 и готовы помочь с выбором.
          </p>
          <a
            href="https://t.me/irp_store"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center justify-center bg-white text-black px-8 py-4 rounded-full font-bold text-lg hover:scale-105 transition-transform relative z-10"
          >
            Написать в Telegram
          </a>
          
          <div className="mt-10 flex items-center justify-center gap-6 text-sm opacity-60 relative z-10">
            <a href="#" className="hover:opacity-100 transition-opacity">Instagram</a>
            <a href="mailto:hello@irp.store" className="hover:opacity-100 transition-opacity">hello@irp.store</a>
          </div>
        </div>
      </motion.section>

      {/* Footer */}
      <footer className="border-t border-white/[0.09] mt-10">
        <div className="max-w-[1240px] mx-auto px-5 py-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="font-bold tracking-[0.2em] text-lg">IRP</div>
          <div className="text-sm opacity-50">© {new Date().getFullYear()} IRP Store. Все права защищены.</div>
          <div className="flex gap-6 text-sm opacity-60">
            <a href="#" className="hover:opacity-100 transition-opacity">Публичная оферта</a>
            <a href="#" className="hover:opacity-100 transition-opacity">Политика конфиденциальности</a>
          </div>
        </div>
      </footer>

      {/* Cart Drawer Overlay */}
      <AnimatePresence>
        {cartOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setCartOpen(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
            />
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 bottom-0 w-full max-w-[440px] bg-[#111111] border-l border-white/10 z-50 flex flex-col shadow-2xl"
            >
              <div className="flex items-center justify-between p-6 border-b border-white/10">
                <h2 className="text-xl font-bold">Корзина {cartCount > 0 && `(${cartCount})`}</h2>
                <button
                  onClick={() => setCartOpen(false)}
                  className="p-2 rounded-full hover:bg-white/10 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="flex-grow overflow-y-auto p-6 space-y-6">
                {cartItems.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-center opacity-50 space-y-4">
                    <ShoppingBag className="w-16 h-16 opacity-20" />
                    <p>Ваша корзина пуста</p>
                    <button
                      onClick={() => { setCartOpen(false); document.getElementById("catalog")?.scrollIntoView({ behavior: "smooth" }); }}
                      className="mt-4 px-6 py-2 border border-white/20 rounded-full hover:bg-white/5 transition-colors text-sm"
                    >
                      Перейти к покупкам
                    </button>
                  </div>
                ) : (
                  cartItems.map((item) => (
                    <div key={item.key} className="flex gap-4 items-center">
                      <div className="w-20 h-24 bg-white/5 rounded-xl border border-white/10 overflow-hidden flex items-center justify-center flex-shrink-0">
                        {item.thumbnail ? (
                          <img src={item.thumbnail} alt={item.title} className="w-full h-full object-cover" />
                        ) : (
                          <span className="text-[10px] opacity-40 font-bold uppercase tracking-widest">IRP</span>
                        )}
                      </div>
                      <div className="flex-grow min-w-0">
                        <h4 className="font-bold text-sm truncate">{item.title}</h4>
                        <p className="text-xs opacity-60 mt-1">Размер: {item.size}</p>
                        <p className="text-sm font-semibold mt-2">{item.priceLabel}</p>
                      </div>
                      <div className="flex flex-col items-center justify-between gap-3 bg-white/5 rounded-full p-1 border border-white/10">
                        <button
                          onClick={() => updateQuantity(item.key, 1)}
                          className="w-6 h-6 rounded-full flex items-center justify-center hover:bg-white/10"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                        <span className="text-xs font-bold">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.key, -1)}
                          className="w-6 h-6 rounded-full flex items-center justify-center hover:bg-white/10"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {cartItems.length > 0 && (
                <div className="p-6 border-t border-white/10 bg-[#0a0a0a]">
                  <div className="flex items-center justify-between mb-6">
                    <span className="opacity-70">Итого:</span>
                    <span className="text-2xl font-bold">{formatPrice(cartTotal)}</span>
                  </div>
                  <button
                    onClick={() => { setCartOpen(false); setCheckoutOpen(true); }}
                    className="w-full flex items-center justify-center bg-white text-black py-4 rounded-xl font-bold text-lg hover:opacity-90 transition-opacity"
                  >
                    Оформить заказ
                  </button>
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Checkout page */}
      <AnimatePresence>
        {checkoutOpen && (
          <CheckoutPage
            items={cartItems}
            total={cartTotal}
            onBack={() => { setCheckoutOpen(false); setCartOpen(true); }}
            onSuccess={() => { setCheckoutOpen(false); setCartItems([]); }}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
