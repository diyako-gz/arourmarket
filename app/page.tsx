
// "use client";

// import { useEffect, useMemo, useState } from "react";
// import type { ReactNode } from "react";
// import {
//   ArrowUp,
//   Bookmark,
//   Clock3,
//   ChevronLeft,
//   Coffee,
//   Grid2X2,
//   Heart,
//   MapPin,
//   Phone,
//   Search,
//   Send,
//   Utensils,
//   X,
// } from "lucide-react";
// import { categories, menuItems, type MenuItem } from "@/data/menu";

// type Tab = "menu" | "saved" | "cafe";

// const categoryIcons: Record<string, ReactNode> = {
//   همه: <Grid2X2 size={17} />,
//   پیش‌غذا: <Utensils size={17} />,
//   سالاد: <Heart size={17} />,
//   پاستا: <Utensils size={17} />,
//   "غذای اصلی": <Utensils size={17} />,
//   پیتزا: <Grid2X2 size={17} />,
//   عصرانه: <Coffee size={17} />,
//   "اسپرسو بار": <Coffee size={17} />,
//   "نوشیدنی گرم": <Coffee size={17} />,
//   "سرد کافئین‌دار": <Coffee size={17} />,
//   "شیک و اسموتی": <Coffee size={17} />,
//   "دمی بار": <Coffee size={17} />,
// };

// const fa = (n: number) => new Intl.NumberFormat("fa-IR").format(n);

// function formatPrice(value: string) {
//   const n = Number(value);
//   return Number.isFinite(n) ? fa(n) : value;
// }

// const realCategories = categories.filter((c) => c !== "همه");

// export default function HomePage() {
//   const [activeCategory, setActiveCategory] = useState("همه");
//   const [query, setQuery] = useState("");
//   const [tab, setTab] = useState<Tab>("menu");
//   const [saved, setSaved] = useState<number[]>([]);
//   const [ready, setReady] = useState(false);
//   const [showScrollTop, setShowScrollTop] = useState(false);

//   useEffect(() => {
//     const handleScroll = () => setShowScrollTop(window.scrollY > 350);
//     window.addEventListener("scroll", handleScroll, { passive: true });
//     handleScroll();
//     return () => window.removeEventListener("scroll", handleScroll);
//   }, []);

//   useEffect(() => {
//     try {
//       const raw = localStorage.getItem("afour_saved_items");
//       if (raw) setSaved(JSON.parse(raw));
//     } catch {
//       setSaved([]);
//     }
//     setReady(true);
//   }, []);

//   useEffect(() => {
//     if (ready) {
//       localStorage.setItem("afour_saved_items", JSON.stringify(saved));
//     }
//   }, [saved, ready]);

//   const normalizedQuery = query.trim().toLocaleLowerCase("fa");

//   const visibleItems = useMemo(() => {
//     const source =
//       tab === "saved"
//         ? menuItems.filter((item) => saved.includes(item.id))
//         : menuItems;

//     return source.filter((item) => {
//       const categoryMatch =
//         tab === "saved" ||
//         !!normalizedQuery ||
//         activeCategory === "همه" ||
//         item.category === activeCategory;

//       const searchMatch =
//         !normalizedQuery ||
//         `${item.title} ${item.description} ${item.category}`
//           .toLocaleLowerCase("fa")
//           .includes(normalizedQuery);

//       return categoryMatch && searchMatch;
//     });
//   }, [activeCategory, normalizedQuery, saved, tab]);

//   const grouped = useMemo(() => {
//     if (tab !== "menu" || normalizedQuery || activeCategory !== "همه") {
//       return null;
//     }

//     return realCategories
//       .map((name) => ({
//         name,
//         items: visibleItems.filter((item) => item.category === name),
//       }))
//       .filter((group) => group.items.length);
//   }, [tab, normalizedQuery, activeCategory, visibleItems]);

//   const toggleSaved = (id: number) => {
//     setSaved((current) =>
//       current.includes(id)
//         ? current.filter((item) => item !== id)
//         : [...current, id],
//     );
//   };

//   const changeTab = (next: Tab) => {
//     setTab(next);
//     setQuery("");

//     if (next === "menu") {
//       setActiveCategory("همه");
//     }

//     window.scrollTo({ top: 0, behavior: "smooth" });
//   };

//   const selectCategory = (name: string) => {
//     setActiveCategory(name);
//     setQuery("");
//   };

//   const sectionTitle =
//     tab === "saved"
//       ? "انتخاب‌های شما"
//       : normalizedQuery
//         ? "نتایج جست‌وجو"
//         : activeCategory === "همه"
//           ? "طعم‌های A.Four"
//           : activeCategory;

//   return (
//     <main
//       dir="rtl"
//       className="min-h-screen bg-[#ebe4d6] text-[#173d32]"
//     >
//       <div className="relative mx-auto min-h-screen w-full max-w-[600px] overflow-x-clip bg-[#f6f1e7] shadow-[0_0_100px_rgba(15,42,34,.13)]">

//         {/* EDITORIAL HERO */}
//         <section className="relative overflow-hidden bg-[#f6f1e7] text-[#173d32]">
//           <div className="pointer-events-none absolute -left-24 -top-28 h-[310px] w-[310px] rounded-full border border-[#c69b65]/15" />
//           <div className="pointer-events-none absolute -left-12 -top-16 h-[210px] w-[210px] rounded-full border border-[#c69b65]/10" />
//           <div className="pointer-events-none absolute right-0 top-0 h-[3px] w-28 bg-gradient-to-l from-[#c69b65] to-transparent" />

//           <div className="relative px-6 pb-7 pt-7 sm:px-8 sm:pb-9">
//             <header className="flex items-center justify-between">
//               <div>
//                 <div className="flex items-baseline gap-2">
//                   <span className="font-brand text-[37px] font-semibold italic leading-none tracking-tight text-[#173d32]">
//                     A.Four
//                   </span>
//                   <span className="text-[9px] font-semibold tracking-[.24em] text-[#a07840]">
//                     FOOD MARKET
//                   </span>
//                 </div>
//                 <p className="mt-2 text-[10px] tracking-wide text-[#8b9185]">
//                   یک انتخاب خوش‌طعم، برای هر لحظه
//                 </p>
//               </div>

//               <div className="flex items-center gap-2 rounded-full border border-[#d9cfbd] bg-white/65 px-3 py-2 shadow-sm">
//                 <span className="relative flex h-2 w-2">
//                   <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#78916f] opacity-35" />
//                   <span className="relative inline-flex h-2 w-2 rounded-full bg-[#78916f]" />
//                 </span>
//                 <span dir="ltr" className="text-[10px] font-semibold tracking-wide text-[#536b59]">
//                   17:00 — 24:00
//                 </span>
//               </div>
//             </header>

//             <div className="relative mt-8 overflow-hidden rounded-[26px] bg-[#173d32] px-5 py-6 text-[#fffaf0] shadow-[0_18px_45px_rgba(23,61,50,.13)] sm:px-7 sm:py-8">
//               <div className="pointer-events-none absolute -left-14 -top-20 h-56 w-56 rounded-full border border-[#d6b27f]/20" />
//               <div className="pointer-events-none absolute -left-5 -top-11 h-40 w-40 rounded-full border border-dashed border-[#d6b27f]/15" />
//               <div className="pointer-events-none absolute -bottom-24 right-20 h-52 w-52 rounded-full bg-[#d6b27f]/10 blur-3xl" />

//               <div className="relative flex items-end justify-between gap-3">
//                 <div className="min-w-0">
//                   <div className="mb-4 flex items-center gap-2">
//                     <span className="h-px w-7 bg-[#d6b27f]" />
//                     <span className="text-[9px] font-semibold tracking-[.25em] text-[#d6b27f]">
//                       THE A.FOUR MENU
//                     </span>
//                   </div>

//                   <h1 className="text-[31px] font-bold leading-[1.65] tracking-tight sm:text-[37px]">
//                     خوش‌طعم‌تر
//                     <br />
//                     <span className="font-light text-[#d6b27f]">از چیزی که فکر می‌کنی.</span>
//                   </h1>

//                   <p className="mt-3 max-w-[280px] text-[10px] leading-7 text-white/60 sm:text-[11px]">
//                     از اولین انتخاب تا آخرین لقمه؛ چیزی برای لذت بردن پیدا می‌کنی.
//                   </p>
//                 </div>

//                 <div className="mb-1 hidden shrink-0 text-left sm:block" dir="ltr">
//                   <span className="block font-brand text-[58px] font-semibold italic leading-none text-[#d6b27f]/90">
//                     04
//                   </span>
//                   <span className="mt-2 block text-[8px] tracking-[.28em] text-white/35">
//                     GOOD TASTE
//                   </span>
//                 </div>

//                 <div className="mb-1 grid h-[66px] w-[66px] shrink-0 place-items-center rounded-full border border-[#d6b27f]/35 bg-white/[0.06] sm:hidden">
//                   <span className="font-brand text-[27px] font-semibold italic text-[#d6b27f]">
//                     A4
//                   </span>
//                 </div>
//               </div>

//               <div className="relative mt-6 flex items-center justify-between border-t border-white/10 pt-4">
//                 <span className="text-[9px] tracking-wide text-white/45">
//                   MADE FOR YOUR GOOD MOMENTS
//                 </span>
//                 <span className="font-brand text-[13px] italic text-[#d6b27f]">
//                   Est. A.Four
//                 </span>
//               </div>
//             </div>

//             {tab !== "cafe" && (
//               <div className="mt-5">
//                 <label className="group flex h-[56px] items-center gap-3 rounded-2xl border border-[#e5dccd] bg-white/90 px-3.5 shadow-[0_8px_24px_rgba(23,61,50,.055)] transition-all duration-300 focus-within:border-[#c69b65] focus-within:shadow-[0_10px_28px_rgba(23,61,50,.10)]">
//                   <div className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-[#f1eadf] text-[#98703f] transition-colors group-focus-within:bg-[#173d32] group-focus-within:text-[#d6b27f]">
//                     <Search size={17} strokeWidth={1.8} />
//                   </div>
//                   <input
//                     value={query}
//                     onChange={(e) => setQuery(e.target.value)}
//                     placeholder="دنبال چه طعمی می‌گردی؟"
//                     className="h-full min-w-0 flex-1 bg-transparent text-[12px] font-medium text-[#173d32] outline-none placeholder:font-normal placeholder:text-[#a6a69a]"
//                   />
//                   {query ? (
//                     <button
//                       type="button"
//                       onClick={() => setQuery("")}
//                       aria-label="پاک کردن جست‌وجو"
//                       className="grid h-8 w-8 shrink-0 place-items-center rounded-lg text-[#8c9388] transition hover:bg-[#f1eadf] hover:text-[#173d32]"
//                     >
//                       <X size={16} />
//                     </button>
//                   ) : (
//                     <span className="shrink-0 text-[9px] font-semibold tracking-[.18em] text-[#b49a75]">
//                       SEARCH
//                     </span>
//                   )}
//                 </label>
//               </div>
//             )}
//           </div>
//         </section>

//         {/* STICKY CATEGORY NAVIGATION */}
//         {tab === "menu" && (
//           <div className="sticky top-0 z-40 border-b border-[#e6dccb]/90 bg-[#f8f4ec]/95 shadow-[0_8px_24px_rgba(23,61,50,.08)] backdrop-blur-2xl">
//             <div className="flex items-center gap-3 px-5 pb-3 pt-3 sm:px-7">
//               <div className="flex shrink-0 flex-col items-start">
//                 <span className="text-[10px] font-extrabold text-[#173d32]">
//                   دسته‌ها
//                 </span>
//                 <span className="mt-0.5 text-[8px] font-medium tracking-[.16em] text-[#b08a56]">
//                   MENU
//                 </span>
//               </div>

//               <div className="h-8 w-px shrink-0 bg-[#e4d9c7]" />

//               <div className="no-scrollbar flex min-w-0 flex-1 items-center gap-2 overflow-x-auto py-0.5">
//                 {categories.map((category) => {
//                   const active = activeCategory === category;

//                   return (
//                     <button
//                       key={category}
//                       type="button"
//                       onClick={() => selectCategory(category)}
//                       aria-pressed={active}
//                       className={`group relative flex shrink-0 items-center gap-2 rounded-full border px-3.5 py-2.5 transition-all duration-300 ${
//                         active
//                           ? "border-[#173d32] bg-[#173d32] text-[#fffaf0] shadow-[0_5px_14px_rgba(23,61,50,.18)]"
//                           : "border-[#e6dccb] bg-white/70 text-[#68776c] hover:border-[#c69b65]/70 hover:bg-white hover:text-[#173d32]"
//                       }`}
//                     >
//                       <span className={active ? "text-[#d6b27f]" : "text-[#a07840]/75"}>
//                         {categoryIcons[category] ?? <Utensils size={16} />}
//                       </span>
//                       <span className="whitespace-nowrap text-[10px] font-semibold">
//                         {category}
//                       </span>
//                       {active && (
//                         <span className="h-1 w-1 rounded-full bg-[#d6b27f]" />
//                       )}
//                     </button>
//                   );
//                 })}
//               </div>
//             </div>
//           </div>
//         )}

//         {/* MAIN CONTENT */}
//         {tab === "cafe" ? (
//           <CafeInfo />
//         ) : (
//           <section className="px-6 pb-36 pt-9 sm:px-8">

//             {/* SECTION HEADING */}
//             <div className="mb-6 flex items-end justify-between">

//               <div>
//                 <span className="mb-2 block text-[9px] font-medium tracking-[.22em] text-[#a07840]">
//                   {tab === "saved" ? "YOUR COLLECTION" : "A.FOUR SELECTION"}
//                 </span>

//                 <h2 className="text-[25px] font-bold leading-tight text-[#173d32]">
//                   {sectionTitle}
//                 </h2>
//               </div>

//               <div className="flex flex-col items-end">
//                 <span className="font-brand text-[25px] italic leading-none text-[#c69b65]">
//                   {fa(visibleItems.length)}
//                 </span>
//                 <span className="mt-1 text-[9px] text-[#879087]">
//                   آیتم
//                 </span>
//               </div>

//             </div>

//             <div className="mb-6 flex items-center gap-3">
//               <div className="h-[2px] w-9 rounded-full bg-[#c69b65]" />
//               <div className="h-px flex-1 bg-gradient-to-l from-[#e6dccb] to-transparent" />
//             </div>

//             {visibleItems.length === 0 ? (
//               <EmptyState
//                 saved={tab === "saved"}
//                 onBack={() => changeTab("menu")}
//               />
//             ) : grouped ? (
//               <div key="all" className="fade-in space-y-10">
//                 {grouped.map((group, index) => (
//                   <section key={group.name}>
//                     <div className="mb-5 flex items-center gap-3">
//                       <span className="font-brand text-sm italic text-[#c69b65]">
//                         {String(index + 1).padStart(2, "0")}
//                       </span>

//                       <h3 className="text-base font-bold text-[#173d32]">
//                         {group.name}
//                       </h3>

//                       <div className="h-px flex-1 bg-[#e6dccb]" />

//                       <span className="text-[10px] text-[#a07840]">
//                         {fa(group.items.length)} محصول
//                       </span>
//                     </div>

//                     <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4">
//                       {group.items.map((item) => (
//                         <MenuCard
//                           key={item.id}
//                           item={item}
//                           saved={saved.includes(item.id)}
//                           onToggle={() => toggleSaved(item.id)}
//                         />
//                       ))}
//                     </div>
//                   </section>
//                 ))}
//               </div>
//             ) : (
//               <div
//                 key={`${tab}-${activeCategory}-${normalizedQuery}`}
//                 className="fade-in grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4"
//               >
//                 {visibleItems.map((item) => (
//                   <MenuCard
//                     key={item.id}
//                     item={item}
//                     saved={saved.includes(item.id)}
//                     onToggle={() => toggleSaved(item.id)}
//                     showCategory={tab === "saved" || !!normalizedQuery}
//                   />
//                 ))}
//               </div>
//             )}

//             {visibleItems.length > 0 && (
//               <div className="mt-12 flex flex-col items-center">

//                 <div className="mb-3 flex items-center gap-3">
//                   <span className="h-px w-10 bg-[#d6b27f]/50" />
//                   <span className="font-brand text-[21px] italic text-[#c69b65]">
//                     A.Four
//                   </span>
//                   <span className="h-px w-10 bg-[#d6b27f]/50" />
//                 </div>

//                 <p className="text-[10px] text-[#9a9589]">
//                   قیمت‌ها به هزار تومان است.
//                 </p>

//               </div>
//             )}

//           </section>
//         )}

//         {/* BACK TO TOP */}
//         <div className="pointer-events-none fixed bottom-[92px] left-1/2 z-[60] w-full max-w-[600px] -translate-x-1/2 px-5">
//           <button
//             type="button"
//             onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
//             aria-label="بازگشت به بالای صفحه"
//             className={`pointer-events-auto ml-auto grid h-12 w-12 place-items-center rounded-2xl border border-[#d6b27f]/40 bg-[#173d32]/95 text-[#e6c99d] shadow-[0_8px_25px_rgba(23,61,50,.25)] backdrop-blur-xl transition-all duration-500 hover:-translate-y-1 hover:bg-[#c69b65] hover:text-[#173d32] ${
//               showScrollTop
//                 ? "translate-y-0 scale-100 opacity-100"
//                 : "pointer-events-none translate-y-5 scale-75 opacity-0"
//             }`}
//           >
//             <ArrowUp size={20} strokeWidth={1.8} />
//           </button>
//         </div>

//         {/* BOTTOM NAVIGATION */}
//         <nav className="fixed bottom-0 left-1/2 z-50 flex h-[76px] w-full max-w-[600px] -translate-x-1/2 items-center justify-around border-t border-[#e6dccb]/80 bg-[#fbf8f2]/95 px-7 pb-[env(safe-area-inset-bottom)] shadow-[0_-8px_35px_rgba(23,61,50,.07)] backdrop-blur-2xl">

//           <NavButton
//             active={tab === "menu"}
//             label="منو"
//             icon={<Utensils size={20} strokeWidth={1.6} />}
//             onClick={() => changeTab("menu")}
//           />

//           <NavButton
//             active={tab === "saved"}
//             label="علاقه‌مندی‌ها"
//             icon={<Bookmark size={20} strokeWidth={1.6} />}
//             count={saved.length}
//             onClick={() => changeTab("saved")}
//           />

//           <NavButton
//             active={tab === "cafe"}
//             label="درباره ما"
//             icon={<Coffee size={20} strokeWidth={1.6} />}
//             onClick={() => changeTab("cafe")}
//           />

//         </nav>

//         <style jsx global>{`
//           @keyframes afourFadeUp {
//             from { opacity: 0; transform: translateY(10px); }
//             to { opacity: 1; transform: translateY(0); }
//           }
//           .fade-in {
//             animation: afourFadeUp 420ms cubic-bezier(.2,.7,.25,1) both;
//           }
//           .no-scrollbar {
//             -ms-overflow-style: none;
//             scrollbar-width: none;
//           }
//           .no-scrollbar::-webkit-scrollbar {
//             display: none;
//           }
//           @media (prefers-reduced-motion: reduce) {
//             .fade-in { animation: none; }
//           }
//         `}</style>

//       </div>
//     </main>
//   );
// }

// /* MENU CARD */

// function MenuCard({
//   item,
//   saved,
//   onToggle,
//   showCategory,
// }: {
//   item: MenuItem;
//   saved: boolean;
//   onToggle: () => void;
//   showCategory?: boolean;
// }) {
//   const [imageError, setImageError] = useState(false);
//   const imageSrc = `/images/menu/${item.id}.webp`;

//   return (
//     <article className="group relative flex min-w-0 flex-col overflow-hidden rounded-[20px] border border-[#e8dfd1] bg-[#fffdf8] shadow-[0_5px_18px_rgba(23,61,50,.045)] transition-all duration-300 hover:-translate-y-1 hover:border-[#c69b65]/50 hover:shadow-[0_14px_30px_rgba(23,61,50,.10)]">
//       <div className="relative aspect-square overflow-hidden bg-[#eee7da]">
//         {!imageError ? (
//           <img
//             src={imageSrc}
//             alt={item.title}
//             loading="lazy"
//             onError={() => setImageError(true)}
//             className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
//           />
//         ) : (
//           <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-[#e9dfce] via-[#f5eee2] to-[#d8c7ab]">
//             <div className="flex flex-col items-center gap-3 text-[#a07840]/60">
//               <Coffee size={36} strokeWidth={1} />
//               <span className="text-[9px] tracking-[.2em]">A.FOUR</span>
//             </div>
//           </div>
//         )}

//         <div className="pointer-events-none absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-[#142d24]/35 to-transparent" />

//         <div className="absolute bottom-3 right-3">
//           <span className="rounded-lg border border-white/20 bg-[#173d32]/65 px-2.5 py-1 text-[9px] font-medium text-white backdrop-blur-md">
//             A.Four Selection
//           </span>
//         </div>

//         <button
//           type="button"
//           onClick={onToggle}
//           aria-label={saved ? "حذف از علاقه‌مندی‌ها" : "افزودن به علاقه‌مندی‌ها"}
//           aria-pressed={saved}
//           className={`absolute left-3 top-3 grid h-9 w-9 place-items-center rounded-full border backdrop-blur-xl transition-all duration-300 ${
//             saved
//               ? "border-[#d6b27f]/60 bg-[#173d32] text-[#e6c99d]"
//               : "border-white/60 bg-white/80 text-[#173d32] hover:bg-[#173d32] hover:text-[#d6b27f]"
//           }`}
//         >
//           <Bookmark
//             size={15}
//             strokeWidth={1.7}
//             fill={saved ? "currentColor" : "none"}
//           />
//         </button>
//       </div>

//       <div className="flex flex-1 flex-col p-3 sm:p-4">
//         {showCategory && (
//           <span className="mb-1.5 text-[9px] font-medium text-[#a07840]">
//             {item.category}
//           </span>
//         )}

//         <h3 className="line-clamp-1 text-[13px] font-bold leading-7 text-[#173d32] sm:text-[14px]">
//           {item.title}
//         </h3>

//         <p className="mt-1 line-clamp-2 min-h-[38px] text-[10px] font-light leading-[1.9] text-[#828b80] sm:text-[11px]">
//           {item.description || "یک انتخاب خوش‌طعم از منوی A.Four"}
//         </p>

//         <div className="mb-2 mt-3 h-px bg-[#eae2d6]" />

//         <div className="mt-auto flex items-center justify-between gap-1">
//           <div className="min-w-0">
//             <span className="block text-[9px] text-[#9b9a8d]">قیمت</span>
//             <span className="mt-1 block whitespace-nowrap text-[13px] font-bold tabular-nums text-[#98703f] sm:text-[14px]">
//               {formatPrice(item.price)}
//               <span className="mr-1 text-[9px] font-normal text-[#a5a095]">
//                 تومان
//               </span>
//             </span>
//           </div>

//           <div className="grid h-8 w-8 shrink-0 place-items-center rounded-xl bg-[#173d32] text-[#d6b27f] transition-all duration-300 group-hover:bg-[#c69b65] group-hover:text-[#173d32]">
//             <ChevronLeft size={16} />
//           </div>
//         </div>
//       </div>
//     </article>
//   );
// }

// /* EMPTY STATE */

// function EmptyState({
//   saved,
//   onBack,
// }: {
//   saved: boolean;
//   onBack: () => void;
// }) {
//   return (
//     <div className="flex min-h-[330px] flex-col items-center justify-center rounded-[25px] border border-[#e9dfd0] bg-[#fbf8f2] px-6 text-center">

//       <div className="grid h-16 w-16 place-items-center rounded-2xl border border-[#c69b65]/30 bg-[#c69b65]/10 text-[#a07840]">
//         {saved ? <Bookmark size={27} /> : <Search size={27} />}
//       </div>

//       <h3 className="mt-6 text-[16px] font-bold text-[#173d32]">
//         {saved ? "هنوز انتخابی ندارید" : "موردی پیدا نشد"}
//       </h3>

//       <p className="mt-2 max-w-[240px] text-[11px] leading-7 text-[#8a9289]">
//         {saved
//           ? "با انتخاب نشانک کنار هر آیتم، آن را به لیست علاقه‌مندی‌های خود اضافه کنید."
//           : "عبارت دیگری را جست‌وجو کنید یا دسته‌بندی دیگری را انتخاب کنید."}
//       </p>

//       {saved && (
//         <button
//           onClick={onBack}
//           className="mt-6 flex items-center gap-2 rounded-xl bg-[#173d32] px-6 py-3 text-[11px] font-bold text-white transition hover:bg-[#0f2a22]"
//         >
//           مشاهده منو
//           <ChevronLeft size={15} />
//         </button>
//       )}

//     </div>
//   );
// }

// /* CAFE INFORMATION */

// function CafeInfo() {
//   return (
//     <section className="px-6 pb-36 pt-10 sm:px-8">

//       <div className="relative overflow-hidden rounded-[28px] bg-[#173d32] px-6 py-10 text-center text-white">

//         <div className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full border border-[#d6b27f]/15" />
//         <div className="pointer-events-none absolute -bottom-16 -left-10 h-40 w-40 rounded-full border border-[#d6b27f]/15" />

//         <div className="relative">

//           <div className="mx-auto grid h-14 w-14 place-items-center rounded-full border border-[#d6b27f]/40 bg-[#d6b27f]/10 text-[#d6b27f]">
//             <Coffee size={25} strokeWidth={1.3} />
//           </div>

//           <div className="mt-5 font-brand text-[46px] font-semibold italic leading-none text-[#d6b27f]">
//             A.Four
//           </div>

//           <p className="mt-4 text-[11px] tracking-[.25em] text-white/65">
//             FOOD MARKET
//           </p>

//           <div className="mx-auto mt-6 h-px w-16 bg-[#d6b27f]/50" />

//           <p className="mt-5 text-[13px] font-light text-white/80">
//             جایی برای همه
//           </p>

//         </div>
//       </div>

//       <div className="mb-5 mt-9 flex items-center justify-between">
//         <h2 className="text-[19px] font-bold text-[#173d32]">
//           اطلاعات کافه
//         </h2>
//         <span className="font-brand text-[17px] italic text-[#c69b65]">
//           CONTACT
//         </span>
//       </div>

//       <div className="overflow-hidden rounded-[23px] border border-[#e9dfd0] bg-[#fbf8f2] px-5">

//         <InfoRow
//           icon={<MapPin size={19} />}
//           label="آدرس"
//           value="زیباشهر منطقه ۲، بلوار مطهری، شقایق ۷"
//         />

//         <InfoRow
//           icon={<Clock3 size={19} />}
//           label="ساعت کاری"
//           value="۱۷:۰۰ تا ۲۴:۰۰، همه روزه"
//         />

//         <InfoRow
//           icon={<Phone size={19} />}
//           label="تماس با ما"
//           value="0900 285 4000"
//           ltr
//           href="tel:09002854000"
//           last
//         />

//       </div>

//       <div className="mt-6 grid grid-cols-2 gap-3">

//         <a
//           href="https://instagram.com/A.fourcenter"
//           target="_blank"
//           rel="noreferrer"
//           className="flex items-center justify-center gap-2 rounded-2xl border border-[#173d32]/20 bg-[#fbf8f2] py-4 text-[12px] font-bold text-[#173d32] transition hover:border-[#c69b65] hover:bg-[#f0e7d8]"
//         >
//           اینستاگرام
//         </a>

//         <a
//           href="https://t.me/Afourcenter"
//           target="_blank"
//           rel="noreferrer"
//           className="flex items-center justify-center gap-2 rounded-2xl bg-[#173d32] py-4 text-[12px] font-bold text-white transition hover:bg-[#0f2a22]"
//         >
//           <Send size={15} />
//           تلگرام
//         </a>

//       </div>

//       <p className="mt-10 text-center text-[11px] font-light text-[#92958b]">
//         خوشحالیم که انتخابمان کرده‌اید.
//       </p>

//     </section>
//   );
// }

// /* INFORMATION ROW */

// function InfoRow({
//   icon,
//   label,
//   value,
//   ltr,
//   href,
//   last,
// }: {
//   icon: ReactNode;
//   label: string;
//   value: string;
//   ltr?: boolean;
//   href?: string;
//   last?: boolean;
// }) {
//   const body = (
//     <>
//       <div className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl border border-[#c69b65]/30 bg-[#c69b65]/10 text-[#a07840]">
//         {icon}
//       </div>

//       <div className="min-w-0 flex-1">
//         <p className="text-[10px] font-light text-[#96978d]">
//           {label}
//         </p>

//         <p
//           dir={ltr ? "ltr" : undefined}
//           className={`mt-1 text-[13px] font-bold leading-7 text-[#173d32] ${
//             ltr ? "text-right" : ""
//           }`}
//         >
//           {value}
//         </p>
//       </div>
//     </>
//   );

//   const cls = `flex items-center gap-4 py-5 ${
//     last ? "" : "border-b border-[#e9dfd0]"
//   }`;

//   return href ? (
//     <a href={href} className={cls}>
//       {body}
//     </a>
//   ) : (
//     <div className={cls}>{body}</div>
//   );
// }

// /* BOTTOM NAVIGATION BUTTON */

// function NavButton({
//   active,
//   label,
//   icon,
//   count,
//   onClick,
// }: {
//   active: boolean;
//   label: string;
//   icon: ReactNode;
//   count?: number;
//   onClick: () => void;
// }) {
//   return (
//     <button
//       onClick={onClick}
//       aria-current={active ? "page" : undefined}
//       className={`relative flex min-w-[85px] flex-col items-center justify-center gap-1.5 transition-all duration-300 ${
//         active ? "text-[#173d32]" : "text-[#a0a59c] hover:text-[#173d32]"
//       }`}
//     >
//       <span
//         className={`relative grid h-9 w-12 place-items-center rounded-xl transition-all duration-300 ${
//           active
//             ? "bg-[#173d32] text-[#d6b27f] shadow-[0_4px_12px_rgba(23,61,50,.16)]"
//             : ""
//         }`}
//       >
//         {icon}

//         {!!count && count > 0 && (
//           <span className="absolute -right-1.5 -top-1.5 grid h-[17px] min-w-[17px] place-items-center rounded-full border-2 border-[#fbf8f2] bg-[#c69b65] px-1 text-[9px] font-bold text-[#173d32]">
//             {fa(count)}
//           </span>
//         )}
//       </span>

//       <span className={`text-[10px] transition-all ${
//         active ? "font-bold" : "font-medium"
//       }`}>
//         {label}
//       </span>

//       {active && (
//         <span className="absolute -bottom-[7px] h-[2px] w-5 rounded-full bg-[#c69b65]" />
//       )}
//     </button>
//   );
// }


"use client";

import { useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";
import {
  ArrowUp,
  Bookmark,
  ChevronLeft,
  Clock3,
  Coffee,
  Grid2X2,
  Heart,
  MapPin,
  Phone,
  Search,
  Send,
  Sparkles,
  Utensils,
  X,
} from "lucide-react";
import { categories, menuItems, type MenuItem } from "@/data/menu";

type Tab = "menu" | "saved" | "cafe";

const categoryIcons: Record<string, ReactNode> = {
  همه: <Grid2X2 size={15} strokeWidth={1.8} />,
  "پیش‌غذا": <Utensils size={15} strokeWidth={1.8} />,
  سالاد: <Heart size={15} strokeWidth={1.8} />,
  پاستا: <Utensils size={15} strokeWidth={1.8} />,
  "غذای اصلی": <Utensils size={15} strokeWidth={1.8} />,
  پیتزا: <Grid2X2 size={15} strokeWidth={1.8} />,
  عصرانه: <Coffee size={15} strokeWidth={1.8} />,
  "اسپرسو بار": <Coffee size={15} strokeWidth={1.8} />,
  "نوشیدنی گرم": <Coffee size={15} strokeWidth={1.8} />,
  "سرد کافئین‌دار": <Coffee size={15} strokeWidth={1.8} />,
  "شیک و اسموتی": <Coffee size={15} strokeWidth={1.8} />,
  "دمی بار": <Coffee size={15} strokeWidth={1.8} />,
};

const fa = (n: number) => new Intl.NumberFormat("fa-IR").format(n);

function formatPrice(value: string) {
  const n = Number(value);
  return Number.isFinite(n) ? fa(n) : value;
}

const realCategories = categories.filter((c) => c !== "همه");

export default function HomePage() {
  const [activeCategory, setActiveCategory] = useState("همه");
  const [query, setQuery] = useState("");
  const [tab, setTab] = useState<Tab>("menu");
  const [saved, setSaved] = useState<number[]>([]);
  const [ready, setReady] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => setShowScrollTop(window.scrollY > 350);
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    try {
      const raw = localStorage.getItem("afour_saved_items");
      if (raw) setSaved(JSON.parse(raw));
    } catch {
      setSaved([]);
    }
    setReady(true);
  }, []);

  useEffect(() => {
    if (ready) {
      localStorage.setItem("afour_saved_items", JSON.stringify(saved));
    }
  }, [saved, ready]);

  const normalizedQuery = query.trim().toLocaleLowerCase("fa");

  const visibleItems = useMemo(() => {
    const source =
      tab === "saved"
        ? menuItems.filter((item) => saved.includes(item.id))
        : menuItems;

    return source.filter((item) => {
      const categoryMatch =
        tab === "saved" ||
        !!normalizedQuery ||
        activeCategory === "همه" ||
        item.category === activeCategory;

      const searchMatch =
        !normalizedQuery ||
        `${item.title} ${item.description} ${item.category}`
          .toLocaleLowerCase("fa")
          .includes(normalizedQuery);

      return categoryMatch && searchMatch;
    });
  }, [activeCategory, normalizedQuery, saved, tab]);

  const grouped = useMemo(() => {
    if (tab !== "menu" || normalizedQuery || activeCategory !== "همه") {
      return null;
    }

    return realCategories
      .map((name) => ({
        name,
        items: visibleItems.filter((item) => item.category === name),
      }))
      .filter((group) => group.items.length);
  }, [tab, normalizedQuery, activeCategory, visibleItems]);

  const toggleSaved = (id: number) => {
    setSaved((current) =>
      current.includes(id)
        ? current.filter((item) => item !== id)
        : [...current, id],
    );
  };

  const changeTab = (next: Tab) => {
    setTab(next);
    setQuery("");
    if (next === "menu") setActiveCategory("همه");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const selectCategory = (name: string) => {
    setActiveCategory(name);
    setQuery("");
  };

  const sectionTitle =
    tab === "saved"
      ? "انتخاب‌های شما"
      : normalizedQuery
        ? "نتایج جست‌وجو"
        : activeCategory === "همه"
          ? "طعم‌های A.Four"
          : activeCategory;

  return (
    <main dir="rtl" className="afour-root min-h-screen bg-[#e4dcd0] text-[#1a3a2f]">
      <div className="relative mx-auto min-h-screen w-full max-w-[600px] overflow-x-clip bg-[#f8f4ec] shadow-[0_0_120px_rgba(10,30,22,0.18)]">

        {/* ─── GLOBAL STYLES ─── */}
        <style>{`
          .afour-root {
            font-family: Vazirmatn, system-ui, -apple-system, sans-serif;
          }
          @keyframes afourFadeUp {
            from { opacity: 0; transform: translateY(14px); }
            to   { opacity: 1; transform: translateY(0); }
          }
          @keyframes afourPulse {
            0%, 100% { opacity: 1; }
            50%      { opacity: 0.4; }
          }
          .fade-in { animation: afourFadeUp 480ms cubic-bezier(0.22, 0.68, 0.31, 1) both; }
          .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
          .no-scrollbar::-webkit-scrollbar { display: none; }
          @media (prefers-reduced-motion: reduce) {
            .fade-in { animation: none; }
          }
        `}</style>

        {/* ═══════════════ HERO ═══════════════ */}
        <section className="relative overflow-hidden">
          {/* ambient glow */}
          <div className="pointer-events-none absolute -top-32 left-1/2 h-[280px] w-[420px] -translate-x-1/2 rounded-full bg-[#c69b65]/8 blur-[80px]" />
          <div className="pointer-events-none absolute -left-20 top-20 h-40 w-40 rounded-full border border-[#c69b65]/12" />
          <div className="pointer-events-none absolute -left-10 top-30 h-24 w-24 rounded-full border border-dashed border-[#c69b65]/8" />

          <div className="relative px-5 pb-8 pt-6 sm:px-7 sm:pb-10 sm:pt-8">

            {/* top bar */}
            <header className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="grid h-11 w-11 shrink-0 place-items-center rounded-[14px] bg-[#1a3a2f] shadow-[0_4px_14px_rgba(26,58,47,0.25)]">
                  <span className="font-brand text-[15px] font-bold italic tracking-tight text-[#d6b27f]">A4</span>
                </div>
                <div>
                  <div className="flex items-baseline gap-1.5">
                    <span className="font-brand text-[30px] font-semibold italic leading-none tracking-tight text-[#1a3a2f]">
                      A.Four
                    </span>
                    <span className="hidden text-[8px] font-semibold tracking-[0.22em] text-[#a07840] sm:inline">
                      FOOD MARKET
                    </span>
                  </div>
                  <p className="mt-1 text-[10px] font-light tracking-wide text-[#8b9185]">
                    یک انتخاب خوش‌طعم، برای هر لحظه
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 rounded-full border border-[#ddd4c4] bg-white/70 px-3 py-2 shadow-sm backdrop-blur-sm">
                <span className="relative flex h-1.5 w-1.5">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#6b8f65] opacity-40" />
                  <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-[#6b8f65]" />
                </span>
                <span dir="ltr" className="text-[10px] font-semibold tracking-wide text-[#4d6b55]">
                  17:00 – 24:00
                </span>
              </div>
            </header>

            {/* hero card */}
            {/* <div className="relative mt-7 overflow-hidden rounded-[28px] bg-[#1a3a2f] px-6 py-7 text-[#fdf9f0] shadow-[0_20px_60px_rgba(26,58,47,0.3)] ring-1 ring-white/8 sm:px-8 sm:py-9">
              <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(214,178,127,0.12),transparent_50%)]" />
              <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,rgba(214,178,127,0.08),transparent_40%)]" />
              <div className="pointer-events-none absolute -left-16 -top-16 h-52 w-52 rounded-full border border-[#d6b27f]/12" />
              <div className="pointer-events-none absolute -left-8 -top-8 h-36 w-36 rounded-full border border-dashed border-[#d6b27f]/8" />
              <div className="pointer-events-none absolute -bottom-20 right-16 h-44 w-44 rounded-full bg-[#d6b27f]/6 blur-3xl" />

              <div className="relative flex items-end justify-between gap-4">
                <div className="min-w-0">
                  <div className="mb-4 inline-flex items-center gap-1.5 rounded-full border border-[#d6b27f]/20 bg-[#d6b27f]/8 px-3 py-1.5">
                    <Sparkles size={11} className="text-[#d6b27f]" />
                    <span className="text-[8px] font-semibold tracking-[0.24em] text-[#d6b27f]">
                      THE A.FOUR MENU
                    </span>
                  </div>

                  <h1 className="text-[30px] font-bold leading-[1.6] tracking-tight sm:text-[36px]">
                    خوش‌طعم‌تر
                    <br />
                    <span className="font-light text-[#d6b27f]">از چیزی که فکر می‌کنی.</span>
                  </h1>

                  <p className="mt-3 max-w-[280px] text-[10px] font-light leading-7 text-white/55 sm:text-[11px]">
                    از اولین انتخاب تا آخرین لقمه؛ چیزی برای لذت بردن پیدا می‌کنی.
                  </p>
                </div>

                <div className="mb-1 hidden shrink-0 sm:block" dir="ltr">
                  <span className="block font-brand text-[62px] font-semibold italic leading-none text-[#d6b27f]/80">
                    04
                  </span>
                  <span className="mt-1.5 block text-[7px] tracking-[0.28em] text-white/30">
                    GOOD TASTE
                  </span>
                </div>

                <div className="mb-1 grid h-[64px] w-[64px] shrink-0 place-items-center rounded-full border border-[#d6b27f]/30 bg-white/5 sm:hidden">
                  <span className="font-brand text-[24px] font-semibold italic text-[#d6b27f]">A4</span>
                </div>
              </div>

              <div className="relative mt-6 flex items-center justify-between border-t border-white/8 pt-4">
                <span className="text-[8px] tracking-[0.18em] text-white/35">
                  MADE FOR YOUR GOOD MOMENTS
                </span>
                <span className="font-brand text-[12px] italic text-[#d6b27f]/70">
                  Est. A.Four
                </span>
              </div>
            </div> */}

            {tab !== "cafe" && (
              <div className="mt-5">
                <label className="group flex h-[56px] items-center gap-3 rounded-[20px] border border-[#e2d9c9] bg-white/85 px-3.5 shadow-[0_6px_20px_rgba(26,58,47,0.05)] transition-all duration-300 focus-within:border-[#c69b65] focus-within:shadow-[0_8px_28px_rgba(198,155,101,0.12)]">
                  <div className="grid h-10 w-10 shrink-0 place-items-center rounded-[12px] bg-[#f0e9dd] text-[#98703f] transition-colors duration-300 group-focus-within:bg-[#1a3a2f] group-focus-within:text-[#d6b27f]">
                    <Search size={17} strokeWidth={1.8} />
                  </div>
                  <input
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="دنبال چه طعمی می‌گردی؟"
                    className="h-full min-w-0 flex-1 bg-transparent text-[12px] font-medium text-[#1a3a2f] outline-none placeholder:font-light placeholder:text-[#b0ad9f]"
                  />
                  {query ? (
                    <button
                      type="button"
                      onClick={() => setQuery("")}
                      aria-label="پاک کردن جست‌وجو"
                      className="grid h-8 w-8 shrink-0 place-items-center rounded-lg text-[#8c9388] transition hover:bg-[#f0e9dd] hover:text-[#1a3a2f]"
                    >
                      <X size={15} />
                    </button>
                  ) : (
                    <span className="shrink-0 text-[8px] font-semibold tracking-[0.2em] text-[#c0a882]">
                      SEARCH
                    </span>
                  )}
                </label>
              </div>
            )}
          </div>
        </section>

        {/* ═══════════════ STICKY CATEGORIES ═══════════════ */}
        {tab === "menu" && (
          <div className="sticky top-0 z-40 border-b border-[#e6dccb]/70 bg-[#f8f4ec]/92 shadow-[0_6px_20px_rgba(26,58,47,0.06)] backdrop-blur-2xl">
            <div className="flex items-center gap-3 px-5 pb-3 pt-3 sm:px-7">
              <div className="flex shrink-0 flex-col items-start">
                <span className="text-[10px] font-bold text-[#1a3a2f]">دسته‌ها</span>
                <span className="mt-0.5 text-[7px] font-medium tracking-[0.18em] text-[#b08a56]">MENU</span>
              </div>
              <div className="h-7 w-px shrink-0 bg-[#e4d9c7]" />

              <div className="no-scrollbar flex min-w-0 flex-1 items-center gap-2 overflow-x-auto py-0.5">
                {categories.map((category) => {
                  const active = activeCategory === category;
                  return (
                    <button
                      key={category}
                      type="button"
                      onClick={() => selectCategory(category)}
                      aria-pressed={active}
                      className={`flex shrink-0 items-center gap-1.5 rounded-full border px-3 py-2 text-[10px] font-semibold transition-all duration-300 ${
                        active
                          ? "border-transparent bg-[#1a3a2f] text-[#fdf9f0] shadow-[0_4px_14px_rgba(26,58,47,0.2)]"
                          : "border-[#e6dccb] bg-white/60 text-[#6b7a6e] hover:border-[#c69b65]/50 hover:bg-white hover:text-[#1a3a2f]"
                      }`}
                    >
                      <span className={active ? "text-[#d6b27f]" : "text-[#a07840]/60"}>
                        {categoryIcons[category] ?? <Utensils size={14} />}
                      </span>
                      <span className="whitespace-nowrap">{category}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* ═══════════════ MAIN CONTENT ═══════════════ */}
        {tab === "cafe" ? (
          <CafeInfo />
        ) : (
          <section className="px-5 pb-40 pt-8 sm:px-7">

            {/* section header */}
            <div className="mb-5 flex items-end justify-between gap-3">
              <div className="min-w-0">
                <span className="mb-2 inline-flex items-center gap-1.5 text-[8px] font-medium tracking-[0.22em] text-[#a07840]">
                  <Sparkles size={10} />
                  {tab === "saved" ? "YOUR COLLECTION" : "A.FOUR SELECTION"}
                </span>
                <h2 className="text-[24px] font-bold leading-tight text-[#1a3a2f]">{sectionTitle}</h2>
              </div>
              <div className="flex shrink-0 flex-col items-center rounded-xl border border-[#e6dccb] bg-white/60 px-3 py-1.5">
                <span className="font-brand text-[22px] italic leading-none text-[#c69b65]">
                  {fa(visibleItems.length)}
                </span>
                <span className="mt-0.5 text-[8px] text-[#879087]">آیتم</span>
              </div>
            </div>

            {/* divider */}
            <div className="mb-6 flex items-center gap-3">
              <div className="h-[2px] w-8 rounded-full bg-gradient-to-l from-[#c69b65] to-[#c69b65]/40" />
              <div className="h-px flex-1 bg-gradient-to-l from-[#e6dccb] to-transparent" />
            </div>

            {/* content */}
            {visibleItems.length === 0 ? (
              <EmptyState saved={tab === "saved"} onBack={() => changeTab("menu")} />
            ) : grouped ? (
              <div key="all" className="fade-in space-y-11">
                {grouped.map((group, index) => (
                  <section key={group.name}>
                    <div className="mb-4 flex items-center gap-3">
                      <span className="font-brand text-[13px] italic text-[#c69b65]/70">
                        {String(index + 1).padStart(2, "0")}
                      </span>
                      <h3 className="text-[15px] font-bold text-[#1a3a2f]">{group.name}</h3>
                      <div className="h-px flex-1 bg-[#e6dccb]" />
                      <span className="text-[9px] font-medium text-[#a07840]">
                        {fa(group.items.length)} محصول
                      </span>
                    </div>
                    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-3.5">
                      {group.items.map((item) => (
                        <MenuCard
                          key={item.id}
                          item={item}
                          saved={saved.includes(item.id)}
                          onToggle={() => toggleSaved(item.id)}
                        />
                      ))}
                    </div>
                  </section>
                ))}
              </div>
            ) : (
              <div
                key={`${tab}-${activeCategory}-${normalizedQuery}`}
                className="fade-in grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-3.5"
              >
                {visibleItems.map((item) => (
                  <MenuCard
                    key={item.id}
                    item={item}
                    saved={saved.includes(item.id)}
                    onToggle={() => toggleSaved(item.id)}
                    showCategory={tab === "saved" || !!normalizedQuery}
                  />
                ))}
              </div>
            )}

            {/* footer note */}
            {visibleItems.length > 0 && (
              <div className="mt-12 flex flex-col items-center">
                <div className="mb-3 flex items-center gap-3">
                  <span className="h-px w-10 bg-gradient-to-l from-transparent to-[#d6b27f]/40" />
                  <span className="font-brand text-[20px] italic text-[#c69b65]/80">A.Four</span>
                  <span className="h-px w-10 bg-gradient-to-r from-transparent to-[#d6b27f]/40" />
                </div>
                <p className="text-[10px] font-light text-[#9a9589]">
                  قیمت‌ها به هزار تومان است.
                </p>
              </div>
            )}
          </section>
        )}

        {/* ═══════════════ SCROLL TO TOP ═══════════════ */}
        <div className="pointer-events-none fixed bottom-[100px] left-1/2 z- w-full max-w-[600px] -translate-x-1/2 px-5">
          <button
            type="button"
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            aria-label="بازگشت به بالای صفحه"
            className={`pointer-events-auto ml-auto grid h-11 w-11 place-items-center rounded-full border border-[#d6b27f]/30 bg-[#1a3a2f]/95 text-[#d6b27f] shadow-[0_8px_24px_rgba(26,58,47,0.3)] backdrop-blur-xl transition-all duration-500 hover:-translate-y-0.5 hover:bg-[#c69b65] hover:text-[#1a3a2f] hover:shadow-[0_10px_30px_rgba(198,155,101,0.35)] ${
              showScrollTop
                ? "translate-y-0 scale-100 opacity-100"
                : "pointer-events-none translate-y-4 scale-75 opacity-0"
            }`}
          >
            <ArrowUp size={18} strokeWidth={1.8} />
          </button>
        </div>

        {/* ═══════════════ BOTTOM NAV ═══════════════ */}
        <nav className="fixed bottom-4 left-1/2 z-50 w-[calc(100%-20px)] max-w-[540px] -translate-x-1/2 rounded-[24px] border border-[#e6dccb]/60 bg-[#fbf8f2]/94 px-5 pb-[max(env(safe-area-inset-bottom),10px)] pt-2.5 shadow-[0_16px_50px_rgba(26,58,47,0.14)] backdrop-blur-2xl">
          <div className="flex items-center justify-around">
            <NavButton
              active={tab === "menu"}
              label="منو"
              icon={<Utensils size={19} strokeWidth={1.6} />}
              onClick={() => changeTab("menu")}
            />
            <NavButton
              active={tab === "saved"}
              label="علاقه‌مندی‌ها"
              icon={<Bookmark size={19} strokeWidth={1.6} />}
              count={saved.length}
              onClick={() => changeTab("saved")}
            />
            <NavButton
              active={tab === "cafe"}
              label="درباره ما"
              icon={<Coffee size={19} strokeWidth={1.6} />}
              onClick={() => changeTab("cafe")}
            />
          </div>
        </nav>
      </div>
    </main>
  );
}

/* ═══════════════ MENU CARD ═══════════════ */

function MenuCard({
  item,
  saved,
  onToggle,
  showCategory,
}: {
  item: MenuItem;
  saved: boolean;
  onToggle: () => void;
  showCategory?: boolean;
}) {
  const [imageError, setImageError] = useState(false);
  const imageSrc = `/images/menu/${item.id}.webp`;

  return (
    <article className="group relative flex min-w-0 flex-col overflow-hidden rounded-[22px] border border-[#e8dfd1] bg-[#fffdf8] shadow-[0_4px_16px_rgba(26,58,47,0.04)] transition-all duration-300 hover:-translate-y-1 hover:border-[#c69b65]/40 hover:shadow-[0_14px_32px_rgba(26,58,47,0.1)]">
      {/* image */}
      <div className="relative aspect-square overflow-hidden bg-[#eee7da]">
        {!imageError ? (
          <img
            src={imageSrc}
            alt={item.title}
            loading="lazy"
            onError={() => setImageError(true)}
            className="h-full w-full object-cover transition-transform duration-[900ms] ease-out group-hover:scale-[1.06]"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-[#e9dfce] via-[#f5eee2] to-[#d8c7ab]">
            <div className="flex flex-col items-center gap-2.5 text-[#a07840]/50">
              <Coffee size={34} strokeWidth={1} />
              <span className="text-[8px] tracking-[0.2em]">A.FOUR</span>
            </div>
          </div>
        )}

        {/* bottom gradient */}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-[#142d24]/30 to-transparent" />

        {/* category chip */}
        {showCategory && (
          <span className="absolute right-2.5 top-2.5 rounded-full border border-white/20 bg-[#1a3a2f]/65 px-2 py-0.5 text-[8px] font-medium text-white/90 backdrop-blur-md">
            {item.category}
          </span>
        )}

        {/* bookmark */}
        <button
          type="button"
          onClick={onToggle}
          aria-label={saved ? "حذف از علاقه‌مندی‌ها" : "افزودن به علاقه‌مندی‌ها"}
          aria-pressed={saved}
          className={`absolute left-2.5 top-2.5 grid h-8 w-8 place-items-center rounded-full border backdrop-blur-xl transition-all duration-300 active:scale-90 ${
            saved
              ? "border-[#d6b27f]/50 bg-[#1a3a2f] text-[#d6b27f]"
              : "border-white/50 bg-white/80 text-[#1a3a2f] hover:bg-[#1a3a2f] hover:text-[#d6b27f]"
          }`}
        >
          <Bookmark size={14} strokeWidth={1.8} fill={saved ? "currentColor" : "none"} />
        </button>
      </div>

      {/* body */}
      <div className="flex flex-1 flex-col p-3 sm:p-3.5">
        <h3 className="line-clamp-1 text-[12.5px] font-bold leading-6 text-[#1a3a2f] sm:text-[13px]">
          {item.title}
        </h3>

        <p className="mt-1 line-clamp-2 min-h-[36px] text-[9.5px] font-light leading-[1.85] text-[#828b80] sm:text-[10.5px]">
          {item.description || "یک انتخاب خوش‌طعم از منوی A.Four"}
        </p>

        <div className="mb-2 mt-3 h-px bg-[#eae2d6]" />

        <div className="mt-auto flex items-center justify-between gap-1.5">
          <div className="min-w-0">
            <span className="block text-[8px] text-[#9b9a8d]">قیمت</span>
            <span className="mt-0.5 flex items-baseline gap-1 whitespace-nowrap text-[12.5px] font-bold tabular-nums text-[#98703f] sm:text-[13px]">
              {formatPrice(item.price)}
              <span className="text-[8px] font-normal text-[#a5a095]">تومان</span>
            </span>
          </div>

          <div className="grid h-8 w-8 shrink-0 place-items-center rounded-[10px] bg-[#1a3a2f] text-[#d6b27f] transition-all duration-300 group-hover:bg-[#c69b65] group-hover:text-[#1a3a2f] group-hover:shadow-[0_6px_16px_rgba(198,155,101,0.3)]">
            <ChevronLeft size={15} strokeWidth={2} />
          </div>
        </div>
      </div>
    </article>
  );
}

/* ═══════════════ EMPTY STATE ═══════════════ */

function EmptyState({
  saved,
  onBack,
}: {
  saved: boolean;
  onBack: () => void;
}) {
  return (
    <div className="fade-in flex min-h-[340px] flex-col items-center justify-center rounded-[26px] border border-[#e9dfd0] bg-gradient-to-b from-white/70 to-[#f8f4ec] px-6 text-center">
      <div className="relative grid h-18 w-18 place-items-center rounded-[22px] border border-[#c69b65]/25 bg-[#c69b65]/8 text-[#a07840]">
        <div className="absolute inset-0 rounded-[22px] bg-[radial-gradient(circle_at_center,rgba(198,155,101,0.1),transparent_70%)]" />
        {saved ? <Bookmark size={28} strokeWidth={1.4} /> : <Search size={28} strokeWidth={1.4} />}
      </div>

      <h3 className="mt-5 text-[15px] font-bold text-[#1a3a2f]">
        {saved ? "هنوز انتخابی ندارید" : "موردی پیدا نشد"}
      </h3>

      <p className="mt-2 max-w-[230px] text-[10.5px] font-light leading-7 text-[#8a9289]">
        {saved
          ? "با انتخاب نشانک کنار هر آیتم، آن را به لیست علاقه‌مندی‌های خود اضافه کنید."
          : "عبارت دیگری را جست‌وجو کنید یا دسته‌بندی دیگری را انتخاب کنید."}
      </p>

      {saved && (
        <button
          onClick={onBack}
          className="mt-5 flex items-center gap-2 rounded-xl bg-[#1a3a2f] px-5 py-2.5 text-[11px] font-bold text-white shadow-[0_4px_14px_rgba(26,58,47,0.2)] transition hover:bg-[#0f2a22] hover:shadow-[0_6px_20px_rgba(26,58,47,0.3)]"
        >
          مشاهده منو
          <ChevronLeft size={14} />
        </button>
      )}
    </div>
  );
}

/* ═══════════════ CAFE INFO ═══════════════ */

function CafeInfo() {
  return (
    <section className="px-5 pb-40 pt-8 sm:px-7">

      {/* brand card */}
      <div className="relative overflow-hidden rounded-[28px] bg-[#1a3a2f] px-6 py-10 text-center text-white shadow-[0_20px_60px_rgba(26,58,47,0.25)] ring-1 ring-white/8">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(214,178,127,0.1),transparent_50%)]" />
        <div className="pointer-events-none absolute -right-8 -top-8 h-32 w-32 rounded-full border border-[#d6b27f]/12" />
        <div className="pointer-events-none absolute -bottom-12 -left-8 h-36 w-36 rounded-full border border-[#d6b27f]/10" />
        <div className="pointer-events-none absolute -bottom-6 -left-4 h-24 w-24 rounded-full border border-dashed border-[#d6b27f]/8" />

        <div className="relative">
          <div className="mx-auto grid h-14 w-14 place-items-center rounded-full border border-[#d6b27f]/35 bg-[#d6b27f]/8 text-[#d6b27f]">
            <Coffee size={24} strokeWidth={1.2} />
          </div>

          <div className="mt-5 font-brand text-[44px] font-semibold italic leading-none text-[#d6b27f]">
            A.Four
          </div>

          <p className="mt-3 text-[9px] font-medium tracking-[0.28em] text-white/50">
            FOOD MARKET
          </p>

          <div className="mx-auto mt-5 h-px w-14 bg-[#d6b27f]/40" />

          <p className="mt-4 text-[12px] font-light text-white/70">
            جایی برای همه
          </p>
        </div>
      </div>

      {/* info heading */}
      <div className="mb-5 mt-8 flex items-end justify-between">
        <h2 className="text-[18px] font-bold text-[#1a3a2f]">اطلاعات کافه</h2>
        <span className="font-brand text-[15px] italic text-[#c69b65]/70">CONTACT</span>
      </div>

      {/* info card */}
      <div className="overflow-hidden rounded-[22px] border border-[#e9dfd0] bg-[#fbf8f2] px-5 shadow-[0_4px_16px_rgba(26,58,47,0.03)]">
        <InfoRow
          icon={<MapPin size={18} strokeWidth={1.6} />}
          label="آدرس"
          value="زیباشهر منطقه ۲، بلوار مطهری، شقایق ۷"
        />
        <InfoRow
          icon={<Clock3 size={18} strokeWidth={1.6} />}
          label="ساعت کاری"
          value="۱۷:۰۰ تا ۲۴:۰۰، همه روزه"
        />
        <InfoRow
          icon={<Phone size={18} strokeWidth={1.6} />}
          label="تماس با ما"
          value="0900 285 4000"
          ltr
          href="tel:09002854000"
          last
        />
      </div>

      {/* social */}
      <div className="mt-5 grid grid-cols-2 gap-3">
        <a
          href="https://instagram.com/A.fourcenter"
          target="_blank"
          rel="noreferrer"
          className="flex items-center justify-center gap-2 rounded-[16px] border border-[#1a3a2f]/15 bg-[#fbf8f2] py-3.5 text-[11px] font-bold text-[#1a3a2f] transition hover:border-[#c69b65]/60 hover:bg-[#f3ece0] hover:shadow-[0_4px_14px_rgba(198,155,101,0.15)]"
        >

          اینستاگرام
        </a>
        <a
          href="https://t.me/Afourcenter"
          target="_blank"
          rel="noreferrer"
          className="flex items-center justify-center gap-2 rounded-[16px] bg-[#1a3a2f] py-3.5 text-[11px] font-bold text-white shadow-[0_4px_14px_rgba(26,58,47,0.2)] transition hover:bg-[#0f2a22] hover:shadow-[0_6px_20px_rgba(26,58,47,0.3)]"
        >
          <Send size={14} strokeWidth={1.8} />
          تلگرام
        </a>
      </div>

      <p className="mt-9 text-center text-[10px] font-light text-[#92958b]">
        خوشحالیم که انتخابمان کرده‌اید.
      </p>
    </section>
  );
}

/* ═══════════════ INFO ROW ═══════════════ */

function InfoRow({
  icon,
  label,
  value,
  ltr,
  href,
  last,
}: {
  icon: ReactNode;
  label: string;
  value: string;
  ltr?: boolean;
  href?: string;
  last?: boolean;
}) {
  const body = (
    <>
      <div className="grid h-10 w-10 shrink-0 place-items-center rounded-[12px] border border-[#c69b65]/25 bg-[#c69b65]/8 text-[#a07840]">
        {icon}
      </div>
      <div className="min-w-0 flex-1">
              <p className="text-[10px] font-light text-[#96978d]">
          {label}
        </p>

        <p
          dir={ltr ? "ltr" : undefined}
          className={`mt-1 text-[13px] font-bold leading-7 text-[#1a3a2f] ${
            ltr ? "text-right" : ""
          }`}
        >
          {value}
        </p>
      </div>
    </>
  );

  const cls = `flex items-center gap-4 py-5 ${
    last ? "" : "border-b border-[#e9dfd0]"
  }`;

  return href ? (
    <a href={href} className={cls}>
      {body}
    </a>
  ) : (
    <div className={cls}>{body}</div>
  );
}

/* ═══════════════ BOTTOM NAVIGATION BUTTON ═══════════════ */

function NavButton({
  active,
  label,
  icon,
  count,
  onClick,
}: {
  active: boolean;
  label: string;
  icon: ReactNode;
  count?: number;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      aria-current={active ? "page" : undefined}
      className={`relative flex min-w-[88px] flex-col items-center justify-center gap-1.5 rounded-2xl px-2 py-1 transition-all duration-300 ${
        active ? "text-[#1a3a2f]" : "text-[#a0a59c] hover:text-[#1a3a2f]"
      }`}
    >
      <span
        className={`relative grid h-10 w-14 place-items-center rounded-2xl transition-all duration-300 ${
          active
            ? "bg-[#1a3a2f] text-[#d6b27f] shadow-[0_8px_20px_rgba(26,58,47,0.22)]"
            : "bg-transparent"
        }`}
      >
        {icon}

        {!!count && count > 0 && (
          <span className="absolute -right-1.5 -top-1.5 grid h-[17px] min-w-[17px] place-items-center rounded-full border-2 border-[#fbf8f2] bg-[#c69b65] px-1 text-[9px] font-bold text-[#1a3a2f]">
            {fa(count)}
          </span>
        )}
      </span>

      <span className={`text-[10px] transition-all ${active ? "font-bold" : "font-medium"}`}>
        {label}
      </span>

      {active && (
        <span className="absolute -bottom-0.5 h-[2px] w-5 rounded-full bg-[#c69b65]" />
      )}
    </button>
  );
}