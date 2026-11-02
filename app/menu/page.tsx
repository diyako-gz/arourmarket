"use client";

import { useState } from "react";

/* ────────────────────────── Types ────────────────────────── */
type Tag = "پرفروش" | "جدید";

interface Item {
  id: string;
  category: string;
  name: string;
  desc: string;
  price: string;
  tag?: Tag;
}

/* ────────────────────────── Data ────────────────────────── */
const categories = [
  { id: "all", label: "همه" },
  { id: "coffee", label: "قهوه" },
  { id: "drinks", label: "نوشیدنی" },
  { id: "desserts", label: "دسر" },
  { id: "food", label: "غذا" },
];

const items: Item[] = [
  // ── قهوه ──
  { id: "c1", category: "coffee", name: "اسپرسو", desc: "شوت غلیظ با عطر دانه‌های تازه", price: "۸۵,۰۰۰" },
  { id: "c2", category: "coffee", name: "لاته افرومارکت", desc: "اسپرسو، شیر میکروفوم و یک لمسه وانیل", price: "۱۲۵,۰۰۰", tag: "پرفروش" },
  { id: "c3", category: "coffee", name: "کاپوچینو", desc: "اسپرسو، شیر گرم و فوم ابریشمی", price: "۱۱۵,۰۰۰" },
  { id: "c4", category: "coffee", name: "کورتادو", desc: "اسپرسو و شیر گرم با تعادل کلاسیک", price: "۱۰۵,۰۰۰", tag: "جدید" },
  { id: "c5", category: "coffee", name: "آمریکانو", desc: "اسپرسو و آب داغ، طعم ملایم‌تر", price: "۹۵,۰۰۰" },
  { id: "c6", category: "coffee", name: "ماتشا لاته", desc: "سبز چای ژاپنی با شیر و عطر ملایم", price: "۱۴۵,۰۰۰" },
  { id: "c7", category: "coffee", name: "موکا", desc: "اسپرسو، شکلات و شیر بخارپز", price: "۱۳۵,۰۰۰" },

  // ── نوشیدنی ──
  { id: "d1", category: "drinks", name: "چای ایرانی", desc: "چای دم‌کرده با عطر بهاره", price: "۳۰,۰۰۰" },
  { id: "d2", category: "drinks", name: "چای ترش", desc: "چای ترش تازه با طعم خاص", price: "۵۵,۰۰۰" },
  { id: "d3", category: "drinks", name: "لیموناد خیار", desc: "لیمو، خیار، نعنا و شکر", price: "۸۰,۰۰۰", tag: "پرفروش" },
  { id: "d4", category: "drinks", name: "آب پرتقال", desc: "پرتقال تازه، بدون شکر افزوده", price: "۹۰,۰۰۰" },
  { id: "d5", category: "drinks", name: "اسموتی توت‌فرنگی", desc: "توت‌فرنگی، موز و ماست یونانی", price: "۱۲۵,۰۰۰" },
  { id: "d6", category: "drinks", name: "دمنوش زعفران", desc: "دمنوش زعفران با عطر گرم", price: "۷۰,۰۰۰", tag: "جدید" },

  // ── دسر ──
  { id: "s1", category: "desserts", name: "چیزکیک نیویورکی", desc: "چیزکیک کلاسیک با سس توت‌فرنگی", price: "۱۵۰,۰۰۰", tag: "پرفروش" },
  { id: "s2", category: "desserts", name: "تیرامیسو", desc: "دسر ایتالیایی با قهوه و ماسکارپونه", price: "۱۶۵,۰۰۰" },
  { id: "s3", category: "desserts", name: "براونی با بستنی", desc: "براونی داغ با بستنی وانیلی", price: "۱۴۰,۰۰۰" },
  { id: "s4", category: "desserts", name: "پنکیک", desc: "پنکیک خانگی با عسل و میوه", price: "۱۳۵,۰۰۰" },
  { id: "s5", category: "desserts", name: "کرم بروله", desc: "دسر فرانسوی با کرم وانیلی", price: "۱۵۰,۰۰۰" },
  { id: "s6", category: "desserts", name: "کیک لاونگوش", desc: "کیک شکلاتی با مغز مذاب", price: "۱۴۵,۰۰۰", tag: "جدید" },

  // ── غذا ──
  { id: "f1", category: "food", name: "ساندویچ مرغ", desc: "مرغ گریل، سالاد و سس مخصوص", price: "۱۸۰,۰۰۰" },
  { id: "f2", category: "food", name: "ساندویچ آووکادو", desc: "آووکادو، پنیر و سبزیجات تازه", price: "۱۶۵,۰۰۰", tag: "پرفروش" },
  { id: "f3", category: "food", name: "پیتزا مارگاریتا", desc: "سس گوجه، موزارلا و رزماری", price: "۲۲۰,۰۰۰" },
  { id: "f4", category: "food", name: "پاستا آلفردو", desc: "پاستا با سس خامه‌ای و مرغ", price: "۲۰۰,۰۰۰" },
  { id: "f5", category: "food", name: "سالاد سزار", desc: "کاهو، مرغ گریل، کروتون و سس سزار", price: "۱۷۵,۰۰۰" },
  { id: "f6", category: "food", name: "سوپ روز", desc: "سوپ فصل با نان تست", price: "۱۲۰,۰۰۰", tag: "جدید" },
];

/* ────────────────────────── Helpers ────────────────────────── */
const tagStyle: Record<Tag, string> = {
  "پرفروش": "bg-[#CD9E6A]/10 text-[#A07840] border border-[#CD9E6A]/25",
  "جدید":   "bg-[#1D4D3F]/5 text-[#1D4D3F] border border-[#1D4D3F]/15",
};

/* ────────────────────────── Page ────────────────────────── */
export default function MenuPage() {
  const [active, setActive] = useState("all");
  const filtered = active === "all" ? items : items.filter(i => i.category === active);
  const activeLabel = categories.find(c => c.id === active)?.label ?? "";

  return (
    <div className="min-h-screen bg-white text-[#1D4D3F]">

      {/* ═══════════ NAVBAR ═══════════ */}
      <nav className="fixed top-0 inset-x-0 z-50 border-b border-[#1D4D3F]/8 bg-white/80 backdrop-blur-xl">
        <div className="mx-auto max-w-6xl px-6 h-20 flex items-center justify-between">
          {/* لوگو */}
          <a href="#" className="flex items-center gap-3">
            <span className="w-10 h-10 rounded-full bg-[#1D4D3F] flex items-center justify-center">
              <span className="font-brand text-white text-lg font-bold">A</span>
            </span>
            <span className="font-brand text-xl tracking-wide text-[#1D4D3F]">
              Afroumarket
            </span>
          </a>

          {/* لینک‌ها */}
          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-[#1D4D3F]/60">
            <a href="#menu" className="hover:text-[#1D4D3F] transition">منو</a>
            <a href="#featured" className="hover:text-[#1D4D3F] transition">توصیه ما</a>
            <a href="#contact" className="hover:text-[#1D4D3F] transition">تماس</a>
          </div>

          {/* CTA */}
          <a
            href="#contact"
            className="rounded-full bg-[#1D4D3F] text-white px-5 py-2.5 text-sm font-medium hover:bg-[#14382E] transition shadow-lg shadow-[#1D4D3F]/15"
          >
            سفارش
          </a>
        </div>
      </nav>

      {/* ═══════════ HERO ═══════════ */}
      <section className="relative pt-32 pb-20 md:pt-44 md:pb-28 overflow-hidden">
        {/* blobs */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-24 right-[10%] w-80 h-80 bg-[#CD9E6A]/15 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-[5%] w-96 h-96 bg-[#1D4D3F]/8 rounded-full blur-3xl" />
        </div>

        <div className="mx-auto max-w-6xl px-6">
          <div className="grid md:grid-cols-2 gap-14 items-center">

            {/* متن */}
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-[#CD9E6A]/30 bg-[#CD9E6A]/8 px-4 py-1.5 text-xs font-medium mb-7">
                <span className="w-1.5 h-1.5 rounded-full bg-[#CD9E6A]" />
                منوی ۱۴۰۵
              </div>

              <h1 className="font-brand text-6xl md:text-7xl tracking-tight text-[#1D4D3F] leading-none mb-5">
                Afroumarket
              </h1>

              <h2 className="text-2xl md:text-3xl font-bold mb-4">
                کافه‌ای برای لحظه‌های خاص
              </h2>

              <p className="text-[#1D4D3F]/55 leading-8 max-w-md mb-9 font-light">
                ترکیبی از طعم‌های کلاسیک و طراحی مدرن؛ برای یک قهوه خوب،
                یک دسر دست‌ساز و یک گفتگوی طولانی.
              </p>

              <div className="flex flex-wrap gap-4">
                <a
                  href="#menu"
                  className="rounded-full bg-[#1D4D3F] text-white px-7 py-3.5 font-medium hover:bg-[#14382E] transition shadow-xl shadow-[#1D4D3F]/15"
                >
                  مشاهده منو
                </a>
                <a
                  href="#contact"
                  className="rounded-full border border-[#1D4D3F]/15 px-7 py-3.5 font-medium hover:border-[#CD9E6A]/50 hover:text-[#A07840] transition"
                >
                  رزرو میز
                </a>
              </div>
            </div>

            {/* کارت بصری */}
            <div className="relative" id="featured">
              <div className="relative aspect-[4/5] rounded-[2.5rem] bg-[#1D4D3F] overflow-hidden shadow-[0_40px_80px_-30px_rgba(29,77,63,0.4)]">
                {/* گرادیان تزئینی */}
                <div
                  className="absolute inset-0"
                  style={{
                    backgroundImage:
                      "radial-gradient(circle at 20% 25%, rgba(205,158,106,0.3) 0%, transparent 40%), radial-gradient(circle at 80% 75%, rgba(255,255,255,0.08) 0%, transparent 45%)",
                  }}
                />
                {/* حاشیه داخلی */}
                <div className="absolute inset-6 border border-white/10 rounded-[2rem]" />

                {/* متن روی کارت */}
                <div className="absolute bottom-10 right-10 text-white">
                  <p className="font-brand text-4xl md:text-5xl mb-2">
                    Coffee &amp; Dessert
                  </p>
                  <p className="text-white/50 text-sm font-light">
                    Freshly made, every day
                  </p>
                </div>

                {/* لوگوی کوچک */}
                <div className="absolute top-10 left-10 w-16 h-16 rounded-full border border-white/15 flex items-center justify-center">
                  <span className="font-brand text-2xl text-[#CD9E6A]">A</span>
                </div>
              </div>

              {/* کارت شناور توصیه */}
              <div className="absolute -bottom-6 -right-3 md:-right-8 bg-white rounded-2xl shadow-2xl border border-[#CD9E6A]/15 p-5 max-w-[230px]">
                <p className="text-xs text-[#A07840] font-medium mb-1.5">توصیه ما</p>
                <p className="font-bold text-[#1D4D3F] mb-1">لاته افرومارکت</p>
                <p className="text-sm text-[#1D4D3F]/50 font-light leading-6">
                  اسپرسو، شیر میکروفوم و وانیل
                </p>
                <p className="mt-3 font-bold text-[#A07840]">۱۲۵,۰۰۰ تومان</p>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ═══════════ MENU ═══════════ */}
      <section id="menu" className="mx-auto max-w-6xl px-6 py-16 md:py-24">

        {/* هدر منو */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 mb-12">
          <div>
            <p className="text-sm font-medium text-[#A07840] mb-2">
              منوی Afroumarket
            </p>
            <h2 className="text-3xl md:text-4xl font-bold">انتخاب کنید</h2>
            <p className="mt-3 text-[#1D4D3F]/50 max-w-md font-light">
              از قهوه‌های تازه تا دسرهای دست‌ساز، همه‌چیز برای یک تجربه آرام و شیک.
            </p>
          </div>

          {/* تب‌ها */}
          <div className="flex gap-2 overflow-x-auto pb-1">
            {categories.map((c) => (
              <button
                key={c.id}
                onClick={() => setActive(c.id)}
                className={`whitespace-nowrap rounded-full px-5 py-2.5 text-sm font-medium transition-all duration-300 ${
                  active === c.id
                    ? "bg-[#1D4D3F] text-white shadow-lg shadow-[#1D4D3F]/20"
                    : "bg-white text-[#1D4D3F]/55 border border-[#1D4D3F]/10 hover:border-[#CD9E6A]/40 hover:text-[#1D4D3F]"
                }`}
              >
                {c.label}
              </button>
            ))}
          </div>
        </div>

        {/* گرید آیتم‌ها */}
        <div className="grid gap-5 md:grid-cols-2">
          {filtered.map((item) => (
            <article
              key={item.id}
              className="group rounded-3xl border border-[#1D4D3F]/8 bg-white p-6 transition-all duration-300 hover:-translate-y-1 hover:border-[#CD9E6A]/25 hover:shadow-[0_20px_50px_-20px_rgba(29,77,63,0.2)]"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                  {/* نام + تگ */}
                  <div className="flex items-center gap-2 mb-2 flex-wrap">
                    <h3 className="text-lg font-bold text-[#1D4D3F]">
                      {item.name}
                    </h3>
                    {item.tag && (
                      <span
                        className={`text-[10px] font-medium px-2.5 py-0.5 rounded-full ${tagStyle[item.tag]}`}
                      >
                        {item.tag}
                      </span>
                    )}
                  </div>
                  <p className="text-sm leading-7 text-[#1D4D3F]/50 font-light">
                    {item.desc}
                  </p>
                </div>

                {/* قیمت */}
                <div className="shrink-0 text-left">
                  <p className="font-bold text-[#A07840] text-lg whitespace-nowrap">
                    {item.price}
                  </p>
                  <p className="text-[10px] text-[#1D4D3F]/35 mt-0.5">تومان</p>
                </div>
              </div>

              {/* فوتر کارت */}
              <div className="mt-5 pt-4 border-t border-dashed border-[#1D4D3F]/8 flex items-center justify-between text-[11px] text-[#1D4D3F]/35">
                <span>{activeLabel}</span>
                <span className="flex items-center gap-1.5">
                  <span className="w-1 h-1 rounded-full bg-[#CD9E6A]/60" />
                  Afroumarket
                </span>
              </div>
            </article>
          ))}
        </div>

        {/* نوت قیمت */}
        <p className="text-center text-xs text-[#1D4D3F]/30 mt-10 font-light">
          * قیمت‌ها به تومان است و ممکن است با تغییر فصل تغییر کند.
        </p>
      </section>

      {/* ═══════════ CTA ═══════════ */}
      <section id="contact" className="mx-auto max-w-6xl px-6 pb-20 md:pb-28">
        <div className="relative overflow-hidden rounded-[2.5rem] bg-[#1D4D3F] text-white px-8 py-14 md:px-16 md:py-20">
          <div
            className="absolute inset-0 opacity-15"
            style={{
              backgroundImage:
                "radial-gradient(circle at 15% 20%, #CD9E6A 0%, transparent 35%), radial-gradient(circle at 85% 80%, white 0%, transparent 30%)",
            }}
          />
          <div className="relative max-w-2xl">
            <p className="text-[#CD9E6A] text-sm font-medium mb-3">
              سفارش و رزرو
            </p>
            <h2 className="text-3xl md:text-4xl font-bold mb-4 leading-snug">
              برای یک لحظه‌ی خوب، همین حالا پیام بدهید
            </h2>
            <p className="text-white/55 leading-8 mb-9 font-light">
              برای سفارش تلفنی، رزرو میز یا سفارش دسته‌جمعی، با ما در تماس باشید.
            </p>
            <div className="flex flex-wrap gap-4">
              <a
                href="tel:02112345678"
                className="rounded-full bg-white text-[#1D4D3F] px-7 py-3.5 font-medium hover:bg-[#CD9E6A] hover:text-white transition"
              >
                تماس بگیرید
              </a>
              <a
                href="#"
                className="rounded-full border border-white/25 px-7 py-3.5 font-medium hover:bg-white/10 transition"
              >
                ارسال سفارش
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════ FOOTER ═══════════ */}
      <footer className="border-t border-[#1D4D3F]/8 py-8">
        <div className="mx-auto max-w-6xl px-6 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-[#1D4D3F]/40">
          <div className="flex items-center gap-3">
            <span className="w-8 h-8 rounded-full bg-[#1D4D3F] flex items-center justify-center">
              <span className="font-brand text-white text-xs font-bold">A</span>
            </span>
            <span>Afroumarket © ۱۴۰۵</span>
          </div>
          <div className="flex gap-6">
            <a href="#menu" className="hover:text-[#1D4D3F] transition">منو</a>
            <a href="#contact" className="hover:text-[#1D4D3F] transition">تماس</a>
          </div>
        </div>
      </footer>

    </div>
  );
}