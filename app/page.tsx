"use client";

import { useMemo, useState, useEffect } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import {
  ArrowLeft,
  ArrowUpLeft,
  Coffee,
  Menu as MenuIcon,
  X,
  Phone,
  Sparkles,
  ShoppingBag,
  ChevronLeft,
  Leaf,
  ArrowUp,
} from "lucide-react";

/* ─────────────────────── Types ─────────────────────── */

type Tag = "پرفروش" | "جدید";

interface Category {
  id: string;
  label: string;
}

interface Item {
  id: string;
  category: string;
  name: string;
  desc: string;
  price: string;
  image: string;
  tag?: Tag;
  featured?: boolean;
}

/* ─────────────────────── Data ─────────────────────── */

const categories: Category[] = [
  { id: "all", label: "همه" },
  { id: "coffee", label: "قهوه" },
  { id: "drinks", label: "نوشیدنی" },
  { id: "desserts", label: "دسر" },
  { id: "food", label: "غذا" },
];

const items: Item[] = [
  {
    id: "c1",
    category: "coffee",
    name: "اسپرسو",
    desc: "شوت غلیظ با عطر دانه‌های تازه و کرمای طلایی",
    price: "۸۵,۰۰۰",
    image:
      "https://images.unsplash.com/photo-1510707577719-ae7c14805e3a?w=700&q=85",
  },
  {
    id: "c2",
    category: "coffee",
    name: "لاته افرومارکت",
    desc: "اسپرسو، شیر میکروفوم و یک لمسه وانیل",
    price: "۱۲۵,۰۰۰",
    tag: "پرفروش",
    featured: true,
    image:
      "https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=700&q=85",
  },
  {
    id: "c3",
    category: "coffee",
    name: "کاپوچینو",
    desc: "اسپرسو، شیر گرم و فوم ابریشمی",
    price: "۱۱۵,۰۰۰",
    image:
      "https://images.unsplash.com/photo-1572442388796-11668a67e53d?w=700&q=85",
  },
  {
    id: "c4",
    category: "coffee",
    name: "کورتادو",
    desc: "اسپرسو و شیر گرم با تعادل کلاسیک",
    price: "۱۰۵,۰۰۰",
    tag: "جدید",
    image:
      "https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=700&q=85",
  },
  {
    id: "c5",
    category: "coffee",
    name: "آمریکانو",
    desc: "اسپرسو و آب داغ، طعمی ملایم و دلنشین",
    price: "۹۵,۰۰۰",
    image:
      "https://images.unsplash.com/photo-1497636577773-f1231844b336?w=700&q=85",
  },
  {
    id: "c6",
    category: "coffee",
    name: "ماتشا لاته",
    desc: "چای سبز ژاپنی با شیر و عطر ملایم",
    price: "۱۴۵,۰۰۰",
    image:
      "https://images.unsplash.com/photo-1515823064-d6e0c04616a7?w=700&q=85",
  },
  {
    id: "c7",
    category: "coffee",
    name: "موکا",
    desc: "ترکیب اسپرسو، شکلات و شیر بخارپز",
    price: "۱۳۵,۰۰۰",
    image:
      "https://images.unsplash.com/photo-1570968915860-54d5c301fa9f?w=700&q=85",
  },
  {
    id: "d1",
    category: "drinks",
    name: "چای ایرانی",
    desc: "چای دم‌کرده با عطر بهاره و طعمی اصیل",
    price: "۳۰,۰۰۰",
    image:
      "https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=700&q=85",
  },
  {
    id: "d2",
    category: "drinks",
    name: "چای ترش",
    desc: "دمنوش خوش‌رنگ با طعمی متفاوت",
    price: "۵۵,۰۰۰",
    image:
      "https://images.unsplash.com/photo-1576092768241-dec231879fc3?w=700&q=85",
  },
  {
    id: "d3",
    category: "drinks",
    name: "لیموناد خیار",
    desc: "لیمو، خیار، نعنا و طراوت یک روز تابستانی",
    price: "۸۰,۰۰۰",
    tag: "پرفروش",
    image:
      "https://images.unsplash.com/photo-1513558161293-cdaf765edfd4?w=700&q=85",
  },
  {
    id: "d4",
    category: "drinks",
    name: "آب پرتقال",
    desc: "پرتقال تازه، بدون شکر افزوده",
    price: "۹۰,۰۰۰",
    image:
      "https://images.unsplash.com/photo-1600271886742-f049cd451bba?w=700&q=85",
  },
  {
    id: "d5",
    category: "drinks",
    name: "اسموتی توت‌فرنگی",
    desc: "توت‌فرنگی، موز و ماست یونانی",
    price: "۱۲۵,۰۰۰",
    image:
      "https://images.unsplash.com/photo-1505252585461-04db1eb84625?w=700&q=85",
  },
  {
    id: "d6",
    category: "drinks",
    name: "دمنوش زعفران",
    desc: "دمنوش زعفران با عطر گرم و دلنشین",
    price: "۷۰,۰۰۰",
    tag: "جدید",
    image:
      "https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=700&q=85",
  },
  {
    id: "s1",
    category: "desserts",
    name: "چیزکیک نیویورکی",
    desc: "چیزکیک کلاسیک با سس توت‌فرنگی",
    price: "۱۵۰,۰۰۰",
    tag: "پرفروش",
    featured: true,
    image:
      "https://images.unsplash.com/photo-1533134242443-d4fd215305ad?w=700&q=85",
  },
  {
    id: "s2",
    category: "desserts",
    name: "تیرامیسو",
    desc: "دسر ایتالیایی با قهوه و ماسکارپونه",
    price: "۱۶۵,۰۰۰",
    image:
      "https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=700&q=85",
  },
  {
    id: "s3",
    category: "desserts",
    name: "براونی با بستنی",
    desc: "براونی شکلاتی گرم با بستنی وانیلی",
    price: "۱۴۰,۰۰۰",
    image:
      "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=700&q=85",
  },
  {
    id: "s4",
    category: "desserts",
    name: "پنکیک",
    desc: "پنکیک خانگی با عسل و میوه تازه",
    price: "۱۳۵,۰۰۰",
    image:
      "https://images.unsplash.com/photo-1528207776546-365bb710ee93?w=700&q=85",
  },
  {
    id: "s5",
    category: "desserts",
    name: "کرم بروله",
    desc: "دسر فرانسوی با کرم وانیلی لطیف",
    price: "۱۵۰,۰۰۰",
    image:
      "https://images.unsplash.com/photo-1488477181946-6428a0291777?w=700&q=85",
  },
  {
    id: "s6",
    category: "desserts",
    name: "کیک شکلاتی",
    desc: "کیک شکلاتی با مغز نرم و غلیظ",
    price: "۱۴۵,۰۰۰",
    tag: "جدید",
    image:
      "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=700&q=85",
  },
  {
    id: "f1",
    category: "food",
    name: "ساندویچ مرغ",
    desc: "مرغ گریل، سبزیجات تازه و سس مخصوص",
    price: "۱۸۰,۰۰۰",
    image:
      "https://images.unsplash.com/photo-1521390188846-e2a3a97453a0?w=700&q=85",
  },
  {
    id: "f2",
    category: "food",
    name: "ساندویچ آووکادو",
    desc: "آووکادو، پنیر و سبزیجات تازه",
    price: "۱۶۵,۰۰۰",
    tag: "پرفروش",
    image:
      "https://images.unsplash.com/photo-1528735602780-2552fd46c7af?w=700&q=85",
  },
  {
    id: "f3",
    category: "food",
    name: "پیتزا مارگاریتا",
    desc: "سس گوجه، موزارلا و رزماری",
    price: "۲۲۰,۰۰۰",
    image:
      "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=700&q=85",
  },
  {
    id: "f4",
    category: "food",
    name: "پاستا آلفردو",
    desc: "پاستا با سس خامه‌ای و مرغ",
    price: "۲۰۰,۰۰۰",
    image:
      "https://images.unsplash.com/photo-1645112411341-6c4fd023714a?w=700&q=85",
  },
  {
    id: "f5",
    category: "food",
    name: "سالاد سزار",
    desc: "کاهو، مرغ گریل، کروتون و سس سزار",
    price: "۱۷۵,۰۰۰",
    image:
      "https://images.unsplash.com/photo-1546793665-c74683f339c1?w=700&q=85",
  },
  {
    id: "f6",
    category: "food",
    name: "سوپ روز",
    desc: "سوپ فصل با نان تست تازه",
    price: "۱۲۰,۰۰۰",
    tag: "جدید",
    image:
      "https://images.unsplash.com/photo-1547592166-23ac45744acd?w=700&q=85",
  },
];

const coffeeBlends = [
  {
    id: "50/50",
    title: "متعادل و کلاسیک",
    description: "ترکیبی متعادل با طعمی دلنشین، مناسب برای مصرف روزانه.",
    body: 75,
    acidity: 55,
    aroma: 70,
    arabica: "50%",
    robusta: "50%",
  },
  {
    id: "70/30",
    title: "ملایم و خوش‌عطر",
    description: "عطر بیشتر، تلخی کنترل‌شده و تجربه‌ای لطیف‌تر.",
    body: 65,
    acidity: 75,
    aroma: 90,
    arabica: "70%",
    robusta: "30%",
  },
  {
    id: "100%",
    title: "خالص و اصیل",
    description: "۱۰۰٪ عربیکا؛ عطری پیچیده‌تر و طعمی ظریف و خاص.",
    body: 55,
    acidity: 90,
    aroma: 95,
    arabica: "100%",
    robusta: "0%",
  },
];

function CoffeeBlendSelector() {
  const [selected, setSelected] = useState("70/30");

  const activeBlend =
    coffeeBlends.find((blend) => blend.id === selected) ?? coffeeBlends[1];

  return (
    <section className="relative z-0 mx-auto my-12 w-full max-w-2xl px-4">
      <div className="rounded-[28px] border border-[#1D4D3F]/10 bg-white p-5 shadow-[0_18px_55px_rgba(29,77,63,0.08)] sm:p-7">
        <div className="mb-6 text-center">
          <span className="mb-2 inline-block text-xs font-bold tracking-[0.2em] text-[#CD9E6A]">
            YOUR PERFECT BLEND
          </span>
          <h3 className="text-2xl font-black text-[#1D4D3F]">
            ترکیب قهوه‌ات رو انتخاب کن
          </h3>
          <p className="mt-2 text-sm text-gray-500">
            هر ترکیب، تجربه‌ای متفاوت از طعم و عطر قهوه
          </p>
        </div>

        {/* انتخاب‌گر متحرک */}
        <div className="relative grid grid-cols-3 rounded-2xl bg-[#F5F3EE] p-1.5">
          {coffeeBlends.map((blend) => (
            <button
              key={blend.id}
              onClick={() => setSelected(blend.id)}
              className={`relative z-10 rounded-xl px-2 py-4 text-sm font-extrabold transition-colors duration-300 ${
                selected === blend.id
                  ? "text-white"
                  : "text-[#1D4D3F]/65 hover:text-[#1D4D3F]"
              }`}
            >
              {selected === blend.id && (
                <motion.span
                  layoutId="coffeeBlendActive"
                  className="absolute inset-0 -z-10 rounded-xl bg-[#1D4D3F] shadow-[0_5px_15px_rgba(29,77,63,0.2)]"
                  transition={{
                    type: "spring",
                    stiffness: 350,
                    damping: 30,
                  }}
                />
              )}
              <span dir="ltr" className="relative">
                {blend.id === "100%" ? "100% Arabica" : blend.id}
              </span>
            </button>
          ))}
        </div>

        {/* اطلاعات ترکیب انتخاب‌شده */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeBlend.id}
            initial={{ opacity: 0, y: 14, filter: "blur(5px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            exit={{ opacity: 0, y: -10, filter: "blur(4px)" }}
            transition={{ duration: 0.3 }}
            className="pt-7"
          >
            <div className="mb-6 flex items-center justify-between gap-3">
              <div>
                <h4 className="text-xl font-black text-[#1D4D3F]">
                  {activeBlend.title}
                </h4>
                <p className="mt-2 text-sm leading-7 text-gray-500">
                  {activeBlend.description}
                </p>
              </div>
              <motion.div
                initial={{ scale: 0.8, rotate: -12, opacity: 0 }}
                animate={{ scale: 1, rotate: 0, opacity: 1 }}
                transition={{ duration: 0.45, ease: "easeOut" }}
                className="relative flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-[#CD9E6A]/30 bg-gradient-to-br from-[#CD9E6A]/15 to-[#CD9E6A]/5 shadow-inner"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-white/70 to-transparent" />
                <Coffee
                  size={29}
                  strokeWidth={1.5}
                  className="relative z-10 text-[#1D4D3F]"
                />
              </motion.div>
            </div>

            <div className="mb-6 grid grid-cols-2 gap-3">
              <div className="rounded-2xl bg-[#F8F7F3] p-4 text-center">
                <span className="block text-xs text-gray-500">عربیکا</span>
                <strong className="mt-1 block text-xl text-[#1D4D3F]">
                  {activeBlend.arabica}
                </strong>
              </div>
              <div className="rounded-2xl bg-[#F8F7F3] p-4 text-center">
                <span className="block text-xs text-gray-500">روبوستا</span>
                <strong className="mt-1 block text-xl text-[#1D4D3F]">
                  {activeBlend.robusta}
                </strong>
              </div>
            </div>

            <div className="space-y-4">
              {[
                { label: "BODY", value: activeBlend.body },
                { label: "ACIDITY", value: activeBlend.acidity },
                { label: "AROMA", value: activeBlend.aroma },
              ].map((item) => (
                <div key={item.label}>
                  <div className="mb-2 flex justify-between text-xs font-bold tracking-wider">
                    <span className="text-[#1D4D3F]">{item.label}</span>
                    <span className="text-[#CD9E6A]">{item.value}%</span>
                  </div>
                  <div className="h-1.5 overflow-hidden rounded-full bg-[#EDEAE3]">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${item.value}%` }}
                      transition={{ duration: 0.7, ease: "easeOut" }}
                      className="h-full rounded-full bg-gradient-to-r from-[#1D4D3F] to-[#CD9E6A]"
                    />
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}

/* ─────────────────────── Animation ─────────────────────── */

const reveal = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0 },
};

const stagger = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.08,
    },
  },
};

/* ─────────────────────── Components ─────────────────────── */

function Logo({ light = false }: { light?: boolean }) {
  return (
    <a href="#home" className="flex items-center gap-3">
      <span
        className={`flex h-11 w-11 items-center justify-center rounded-full ${
          light ? "bg-white text-[#1D4D3F]" : "bg-[#1D4D3F] text-white"
        }`}
      >
        <span className="font-brand text-2xl font-bold">A</span>
      </span>
      <span
        className={`font-brand text-[21px] font-semibold tracking-wide ${
          light ? "text-white" : "text-[#1D4D3F]"
        }`}
      >
        Afroumarket
      </span>
    </a>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="mb-4 flex items-center gap-3">
      <span className="h-px w-8 bg-[#CD9E6A]" />
      <span className="text-xs font-bold tracking-widest text-[#A07840]">
        {children}
      </span>
    </div>
  );
}

function ProductCard({ item, index }: { item: Item; index: number }) {
  return (
    <motion.article
      variants={reveal}
      custom={index}
      className="group overflow-hidden rounded-[24px] border border-[#1D4D3F]/[0.07] bg-white transition-all duration-500 hover:-translate-y-1.5 hover:border-[#CD9E6A]/40 hover:shadow-[0_22px_55px_-25px_rgba(29,77,63,0.2)]"
    >
      <div className="relative aspect-[16/10] overflow-hidden bg-[#F5F2ED]">
        <img
          src={item.image}
          alt={item.name}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
        />

        <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent" />

        {item.tag && (
          <span
            className={`absolute right-4 top-4 rounded-full px-3 py-1.5 text-[10px] font-bold backdrop-blur-md ${
              item.tag === "پرفروش"
                ? "bg-[#CD9E6A] text-white"
                : "bg-white/90 text-[#1D4D3F]"
            }`}
          >
            {item.tag}
          </span>
        )}

        <span className="absolute bottom-4 left-4 flex h-9 w-9 items-center justify-center rounded-full bg-white/90 text-[#1D4D3F] opacity-0 shadow-lg backdrop-blur-md transition-all duration-300 group-hover:opacity-100">
          <ArrowUpLeft size={17} />
        </span>
      </div>

      <div className="p-5 md:p-6">
        <div className="mb-3 flex items-start justify-between gap-3">
          <div>
            <h3 className="text-base font-bold text-[#1D4D3F] md:text-lg">
              {item.name}
            </h3>
            <p className="mt-2 text-xs leading-7 text-[#1D4D3F]/50">
              {item.desc}
            </p>
          </div>
          {item.featured && (
            <Sparkles size={17} className="mt-1 shrink-0 text-[#CD9E6A]" />
          )}
        </div>

        <div className="mt-4 flex items-center justify-between border-t border-dashed border-[#1D4D3F]/10 pt-4">
          <span className="text-[10px] text-[#1D4D3F]/35">Afroumarket</span>
          <div className="text-left">
            <span className="text-lg font-extrabold text-[#A07840]">
              {item.price}
            </span>
            <span className="mr-1 text-[10px] text-[#1D4D3F]/40">تومان</span>
          </div>
        </div>
      </div>
    </motion.article>
  );
}

function BackToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setVisible(window.scrollY > 400);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });

    handleScroll();

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <motion.button
          initial={{ opacity: 0, y: 20, scale: 0.8 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.8 }}
          transition={{ duration: 0.3 }}
          onClick={() =>
            window.scrollTo({
              top: 0,
              behavior: "smooth",
            })
          }
          aria-label="بازگشت به بالای صفحه"
          title="بازگشت به بالا"
          className="
            fixed bottom-6 left-6 z-[100]
            flex h-12 w-12 items-center justify-center
            rounded-full
            border border-[#CD9E6A]/50
            bg-[#1D4D3F]
            text-white
            shadow-[0_8px_25px_rgba(29,77,63,0.22)]
            transition-all duration-300
            hover:-translate-y-1
            hover:bg-[#14382E]
            hover:shadow-[0_12px_30px_rgba(29,77,63,0.3)]
            active:scale-90
          "
        >
          <ArrowUp size={21} strokeWidth={2} />
        </motion.button>
      )}
    </AnimatePresence>
  );
}

/* ─────────────────────── Main Page ─────────────────────── */

export default function Home() {
  const [active, setActive] = useState("all");
  const [mobileMenu, setMobileMenu] = useState(false);
  const shouldReduceMotion = useReducedMotion();

  const filtered = useMemo(
    () =>
      active === "all"
        ? items
        : items.filter((item) => item.category === active),
    [active],
  );

  const activeLabel =
    categories.find((category) => category.id === active)?.label ?? "";

  const scrollToMenu = () => {
    document.getElementById("menu")?.scrollIntoView({
      behavior: shouldReduceMotion ? "auto" : "smooth",
    });
  };

  return (
    <main
      id="home"
      dir="rtl"
      className="min-h-screen overflow-hidden bg-white text-[#1D4D3F]"
    >
      {/* ───────────────── NAVBAR ───────────────── */}

      <header className="fixed inset-x-0 top-0 z-50 border-b border-[#1D4D3F]/[0.06] bg-white/90 backdrop-blur-xl">
        <div className="mx-auto flex h-[78px] max-w-7xl items-center justify-between px-5 md:px-8">
          <Logo />

          <nav className="hidden items-center gap-9 text-sm font-medium text-[#1D4D3F]/65 md:flex">
            <a href="#home" className="transition hover:text-[#CD9E6A]">
              خانه
            </a>
            <a href="#menu" className="transition hover:text-[#CD9E6A]">
              منوی کافه
            </a>
            <a href="#featured" className="transition hover:text-[#CD9E6A]">
              پیشنهاد ویژه
            </a>
            <a href="#about" className="transition hover:text-[#CD9E6A]">
              درباره ما
            </a>
            <a href="#contact" className="transition hover:text-[#CD9E6A]">
              تماس
            </a>
          </nav>

          <div className="flex items-center gap-3">
            <a
              href="#contact"
              className="hidden items-center gap-2 rounded-full bg-[#1D4D3F] px-6 py-3 text-xs font-bold text-white shadow-lg shadow-[#1D4D3F]/10 transition hover:bg-[#14382E] sm:flex"
            >
              <ShoppingBag size={15} />
              سفارش و رزرو
            </a>

            <button
              onClick={() => setMobileMenu(!mobileMenu)}
              aria-label="باز کردن منو"
              className="flex h-10 w-10 items-center justify-center rounded-full border border-[#1D4D3F]/10 text-[#1D4D3F] md:hidden"
            >
              {mobileMenu ? <X size={20} /> : <MenuIcon size={20} />}
            </button>
          </div>
        </div>
        <AnimatePresence>
          {mobileMenu && (
            <motion.nav
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden border-t border-[#1D4D3F]/10 bg-white md:hidden"
            >
              <div className="flex flex-col gap-1 px-6 py-4 text-sm">
                {[
                  ["خانه", "#home"],
                  ["منوی کافه", "#menu"],
                  ["پیشنهاد ویژه", "#featured"],
                  ["درباره ما", "#about"],
                  ["تماس", "#contact"],
                ].map(([label, href]) => (
                  <a
                    key={href}
                    href={href}
                    onClick={() => setMobileMenu(false)}
                    className="rounded-xl px-4 py-3 transition hover:bg-[#1D4D3F]/5"
                  >
                    {label}
                  </a>
                ))}
              </div>
            </motion.nav>
          )}
        </AnimatePresence>
      </header>

      {/* ───────────────── HERO ───────────────── */}

      <section className="relative px-5 pb-24 pt-32 md:px-8 md:pb-32 md:pt-44">
        <div className="pointer-events-none absolute -right-40 top-24 h-[450px] w-[450px] rounded-full bg-[#CD9E6A]/[0.07] blur-[100px]" />
        <div className="pointer-events-none absolute -bottom-20 left-0 h-[350px] w-[350px] rounded-full bg-[#1D4D3F]/[0.045] blur-[100px]" />

        <div className="relative mx-auto grid max-w-7xl items-center gap-14 lg:grid-cols-[0.95fr_1.05fr] lg:gap-20">
          {/* Hero Text */}

          <motion.div
            initial="hidden"
            animate="visible"
            variants={stagger}
            className="order-2 lg:order-1"
          >
            <motion.div variants={reveal}>
              <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-[#CD9E6A]/30 bg-[#CD9E6A]/[0.07] px-4 py-2">
                <span className="h-1.5 w-1.5 rounded-full bg-[#CD9E6A]" />
                <span className="text-[11px] font-bold text-[#A07840]">
                  تجربه‌ای متفاوت از طعم و آرامش
                </span>
                <Sparkles size={13} className="text-[#CD9E6A]" />
              </div>
            </motion.div>

            <motion.h1
              variants={reveal}
              className="font-brand text-5xl font-bold leading-[1.15] tracking-tight text-[#1D4D3F] sm:text-6xl md:text-7xl lg:text-[76px]"
            >
              Afroumarket
              <span className="mt-3 block font-[family-name:var(--font-yekan)] text-3xl font-bold leading-relaxed md:text-4xl">
                طعم لحظه‌های
                <span className="text-[#CD9E6A]"> ماندگار</span>
              </span>
            </motion.h1>

            <motion.p
              variants={reveal}
              className="mt-6 max-w-lg text-sm leading-9 text-[#1D4D3F]/55 md:text-base"
            >
              جایی برای مکث کردن، لذت بردن و ساختن لحظه‌هایی که ارزش به خاطر
              سپردن دارند. از عطر قهوه تازه تا طعم دسرهای دست‌ساز.
            </motion.p>

            <motion.div
              variants={reveal}
              className="mt-9 flex flex-wrap items-center gap-4"
            >
              <button
                onClick={scrollToMenu}
                className="group flex items-center gap-3 rounded-full bg-[#1D4D3F] px-7 py-4 text-sm font-bold text-white shadow-xl shadow-[#1D4D3F]/15 transition hover:-translate-y-1 hover:bg-[#14382E]"
              >
                مشاهده منو
                <ArrowLeft
                  size={17}
                  className="transition-transform group-hover:-translate-x-1"
                />
              </button>

              <a
                href="#about"
                className="flex items-center gap-2 rounded-full border border-[#1D4D3F]/15 px-7 py-4 text-sm font-bold transition hover:border-[#CD9E6A] hover:text-[#A07840]"
              >
                داستان ما
                <ChevronLeft size={16} />
              </a>
            </motion.div>

            <motion.div
              variants={reveal}
              className="mt-14 flex flex-wrap items-center gap-8 border-t border-[#1D4D3F]/10 pt-8"
            >
              <div>
                <p className="font-brand text-3xl font-bold text-[#1D4D3F]">
                  100%
                </p>
                <p className="mt-1 text-[11px] text-[#1D4D3F]/45">
                  کیفیت و تازگی
                </p>
              </div>

              <div className="h-10 w-px bg-[#1D4D3F]/10" />

              <div>
                <p className="font-brand text-3xl font-bold text-[#1D4D3F]">
                  Fresh
                </p>
                <p className="mt-1 text-[11px] text-[#1D4D3F]/45">
                  آماده‌سازی روزانه
                </p>
              </div>

              <div className="h-10 w-px bg-[#1D4D3F]/10" />

              <div>
                <p className="font-brand text-3xl font-bold text-[#1D4D3F]">
                  Love
                </p>
                <p className="mt-1 text-[11px] text-[#1D4D3F]/45">
                  با عشق آماده شده
                </p>
              </div>
            </motion.div>
          </motion.div>

          {/* Hero Image */}

          <motion.div
            initial={{ opacity: 0, x: -35 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.9, ease: "easeOut" }}
            className="relative order-1 lg:order-2"
          >
            <div className="relative mx-auto aspect-[4/4.3] max-w-[570px]">
              <div className="absolute -left-5 -top-5 h-36 w-36 rounded-full border border-[#CD9E6A]/30" />

              <div className="absolute inset-0 overflow-hidden rounded-[35%_35%_24px_24px] bg-[#F3EEE7] shadow-[0_35px_90px_-35px_rgba(29,77,63,0.3)]">
                <img
                  src="https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=1200&q=90"
                  alt="Coffee and cafe"
                  className="h-full w-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#142E25]/55 via-transparent to-transparent" />

                <div className="absolute bottom-9 right-8 text-white md:bottom-12 md:right-12">
                  <p className="font-brand text-3xl md:text-4xl">
                    Coffee moments
                  </p>
                  <p className="mt-2 text-xs tracking-widest text-white/70">
                    MADE WITH LOVE
                  </p>
                </div>
              </div>

              <div className="absolute -bottom-6 -right-4 flex items-center gap-3 rounded-2xl border border-[#CD9E6A]/20 bg-white p-4 shadow-[0_20px_55px_-20px_rgba(29,77,63,0.2)] md:-right-8 md:p-5">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#1D4D3F] text-[#CD9E6A]">
                  <Coffee size={23} />
                </div>
                <div>
                  <p className="text-xs font-bold text-[#1D4D3F]">
                    Freshly brewed
                  </p>
                  <p className="mt-1 text-[10px] text-[#1D4D3F]/45">
                    Every single day
                  </p>
                </div>
              </div>

              <div className="absolute -left-5 bottom-20 flex h-20 w-20 items-center justify-center rounded-full border border-[#CD9E6A]/30 bg-white/90 shadow-xl backdrop-blur-md md:-left-9">
                <div className="text-center">
                  <Leaf size={19} className="mx-auto text-[#CD9E6A]" />
                  <p className="mt-1 text-[9px] font-bold text-[#1D4D3F]">
                    FRESH
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
      <div className="relative w-full">
        <CoffeeBlendSelector />
      </div>
      {/* ───────────────── FEATURED ───────────────── */}

      <section id="featured" className="px-5 py-12 md:px-8 md:py-16">
        <div className="mx-auto max-w-7xl">
          <div className="relative grid overflow-hidden rounded-[30px] bg-[#1D4D3F] lg:grid-cols-2">
            <div className="absolute -right-32 -top-40 h-96 w-96 rounded-full border border-white/[0.08]" />
            <div className="absolute -bottom-40 -left-20 h-96 w-96 rounded-full border border-white/[0.08]" />

            <div className="relative flex flex-col justify-center px-8 py-12 md:px-14 md:py-16">
              <SectionLabel>AFROUMARKET SPECIAL</SectionLabel>

              <h2 className="mt-2 text-3xl font-bold leading-relaxed text-white md:text-4xl">
                یک فنجان آرامش،
                <br />
                <span className="text-[#CD9E6A]">برای لحظه‌های تو</span>
              </h2>

              <p className="mt-5 max-w-md text-sm leading-8 text-white/55">
                لاته اختصاصی افرومارکت؛ ترکیبی متعادل از اسپرسوی تازه، شیر مخملی
                و رایحه لطیف وانیل.
              </p>

              <div className="mt-8 flex items-center gap-5">
                <span className="text-2xl font-bold text-[#CD9E6A]">
                  ۱۲۵,۰۰۰
                </span>
                <span className="text-xs text-white/40">تومان</span>
              </div>

              <button
                onClick={scrollToMenu}
                className="mt-8 flex w-fit items-center gap-3 rounded-full bg-white px-7 py-3.5 text-xs font-bold text-[#1D4D3F] transition hover:bg-[#CD9E6A] hover:text-white"
              >
                دیدن محصولات
                <ArrowLeft size={16} />
              </button>
            </div>

            <div className="relative min-h-[280px] overflow-hidden lg:min-h-[450px]">
              <img
                src="https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=1100&q=90"
                alt="Special latte"
                className="absolute inset-0 h-full w-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-l from-[#1D4D3F]/10 via-transparent to-[#1D4D3F]/30" />
              <div className="absolute bottom-6 left-6 rounded-full border border-white/40 bg-white/15 px-5 py-2 text-xs text-white backdrop-blur-xl">
                Our signature taste
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ───────────────── MENU ───────────────── */}

      <section id="menu" className="px-5 py-24 md:px-8 md:py-32">
        <div className="mx-auto max-w-7xl">
          <div className="mb-12 flex flex-col justify-between gap-8 lg:flex-row lg:items-end">
            <div>
              <SectionLabel>OUR MENU</SectionLabel>
              <h2 className="text-3xl font-bold text-[#1D4D3F] md:text-5xl">
                طعم‌هایی برای
                <span className="text-[#CD9E6A]"> انتخاب شما</span>
              </h2>
              <p className="mt-5 max-w-lg text-sm leading-8 text-[#1D4D3F]/50">
                از قهوه‌های خوش‌عطر تا دسرهای دست‌ساز؛ انتخابی برای هر سلیقه و
                هر لحظه.
              </p>
            </div>

            <div className="flex items-center gap-2 text-xs text-[#1D4D3F]/40">
              <span className="h-px w-8 bg-[#CD9E6A]" />
              MENU ۱۴۰۵
            </div>
          </div>

          {/* Categories */}

          <div className="mb-10 flex items-center gap-3 overflow-x-auto pb-3">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setActive(category.id)}
                className={`relative shrink-0 overflow-hidden rounded-full px-7 py-3 text-xs font-bold transition-all duration-300 ${
                  active === category.id
                    ? "bg-[#1D4D3F] text-white shadow-lg shadow-[#1D4D3F]/15"
                    : "border border-[#1D4D3F]/10 bg-white text-[#1D4D3F]/55 hover:border-[#CD9E6A]/50 hover:text-[#1D4D3F]"
                }`}
              >
                {category.label}
              </button>
            ))}
          </div>

          {/* Result count */}

          <div className="mb-6 flex items-center justify-between">
            <p className="text-xs text-[#1D4D3F]/45">
              {activeLabel}
              <span className="mx-2 text-[#CD9E6A]">/</span>
              {filtered.length} محصول
            </p>
            <span className="text-[10px] tracking-wider text-[#1D4D3F]/30">
              AFROUMARKET COLLECTION
            </span>
          </div>

          {/* Product Grid */}

          <AnimatePresence mode="wait">
            <motion.div
              key={active}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.25 }}
              className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
            >
              {filtered.map((item, index) => (
                <ProductCard key={item.id} item={item} index={index} />
              ))}
            </motion.div>
          </AnimatePresence>

          <p className="mt-12 text-center text-[11px] text-[#1D4D3F]/35">
            قیمت‌ها به تومان هستند و ممکن است با تغییر فصل به‌روزرسانی شوند.
          </p>
        </div>
      </section>

      {/* ───────────────── ABOUT ───────────────── */}

      <section
        id="about"
        className="border-y border-[#1D4D3F]/[0.06] bg-[#FAFAF8] px-5 py-24 md:px-8"
      >
        <div className="mx-auto grid max-w-7xl items-center gap-14 lg:grid-cols-2">
          <div className="relative grid grid-cols-2 gap-4">
            <img
              src="https://images.unsplash.com/photo-1445116572660-236099ec97a0?w=700&q=85"
              alt="Cafe interior"
              className="mt-12 h-64 w-full rounded-[24px] object-cover"
            />
            <img
              src="https://images.unsplash.com/photo-1442512595331-e89e73853f31?w=700&q=85"
              alt="Coffee preparation"
              className="h-64 w-full rounded-[24px] object-cover"
            />
            <div className="absolute -bottom-5 right-1/2 flex h-20 w-20 translate-x-1/2 items-center justify-center rounded-full border-4 border-[#FAFAF8] bg-[#1D4D3F] text-[#CD9E6A]">
              <Coffee size={30} />
            </div>
          </div>

          <div>
            <SectionLabel>OUR STORY</SectionLabel>
            <h2 className="text-3xl font-bold leading-relaxed text-[#1D4D3F] md:text-4xl">
              بیشتر از یک کافه،
              <br />
              <span className="text-[#CD9E6A]">یک حس خوب</span>
            </h2>
            <p className="mt-6 text-sm leading-9 text-[#1D4D3F]/55">
              افرومارکت جایی است برای تجربه طعم‌های دوست‌داشتنی، دیدارهای صمیمی
              و لحظه‌هایی که دوست داریم کمی طولانی‌تر شوند. ما به کیفیت مواد
              اولیه، تازگی و جزئیات اهمیت می‌دهیم.
            </p>

            <div className="mt-9 flex items-center gap-3">
              <span className="h-10 w-10 rounded-full bg-[#1D4D3F] text-center leading-10 text-[#CD9E6A]">
                A
              </span>
              <div>
                <p className="font-brand text-sm font-bold text-[#1D4D3F]">
                  Afroumarket
                </p>
                <p className="mt-1 text-[10px] text-[#1D4D3F]/40">
                  Made with love, served with care.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ───────────────── CONTACT ───────────────── */}

      <section id="contact" className="px-5 py-24 md:px-8 md:py-28">
        <div className="relative mx-auto max-w-7xl overflow-hidden rounded-[30px] bg-[#1D4D3F] px-7 py-16 text-center md:px-16 md:py-20">
          <div className="pointer-events-none absolute -right-28 -top-40 h-96 w-96 rounded-full border border-white/[0.08]" />
          <div className="pointer-events-none absolute -bottom-48 -left-20 h-96 w-96 rounded-full border border-white/[0.08]" />

          <div className="relative mx-auto max-w-2xl">
            <SectionLabel>GET IN TOUCH</SectionLabel>

            <h2 className="text-3xl font-bold leading-relaxed text-white md:text-5xl">
              آماده یک تجربه
              <span className="text-[#CD9E6A]"> خوشمزه </span>
              هستید؟
            </h2>

            <p className="mx-auto mt-5 max-w-lg text-sm leading-8 text-white/55">
              برای رزرو میز، سفارش یا دریافت اطلاعات بیشتر با ما در ارتباط
              باشید. منتظر دیدار شما هستیم.
            </p>

            <div className="mt-9 flex flex-wrap justify-center gap-4">
              <a
                href="tel:02112345678"
                className="flex items-center gap-3 rounded-full bg-white px-7 py-4 text-xs font-bold text-[#1D4D3F] transition hover:bg-[#CD9E6A] hover:text-white"
              >
                <Phone size={16} />
                تماس با ما
              </a>

              <a
                href="https://instagram.com/"
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-3 rounded-full border border-white/25 px-7 py-4 text-xs font-bold text-white transition hover:bg-white/10"
              >
                اینستاگرام
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ───────────────── FOOTER ───────────────── */}

      <footer className="border-t border-[#1D4D3F]/10 bg-white px-5 py-10 md:px-8">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-8 md:flex-row">
          <Logo />

          <div className="flex flex-wrap justify-center gap-6 text-xs text-[#1D4D3F]/55">
            <a href="#home" className="transition hover:text-[#CD9E6A]">
              خانه
            </a>
            <a href="#menu" className="transition hover:text-[#CD9E6A]">
              منو
            </a>
            <a href="#about" className="transition hover:text-[#CD9E6A]">
              درباره ما
            </a>
            <a href="#contact" className="transition hover:text-[#CD9E6A]">
              تماس
            </a>
          </div>

          <p className="text-[10px] text-[#1D4D3F]/35">
            Afroumarket © ۱۴۰۵ — All rights reserved.
          </p>
        </div>
      </footer>
      <BackToTop />
    </main>
  );
}
