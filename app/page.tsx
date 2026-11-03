// "use client";

// import { useMemo, useState, useEffect, useRef } from "react";
// import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
// import { ArrowLeft, Menu as MenuIcon, X, Phone, ArrowUp } from "lucide-react";

// /* ─────────────────────── Types ─────────────────────── */

// type Tag = "پرفروش" | "جدید";

// interface Category {
//   id: string;
//   label: string;
// }

// interface Item {
//   id: string;
//   category: string;
//   name: string;
//   desc: string;
//   price: string;
//   image: string;
//   tag?: Tag;
// }

// /* ─────────────────────── Data ─────────────────────── */

// const categories: Category[] = [
//   { id: "all", label: "همه" },
//   { id: "coffee", label: "قهوه" },
//   { id: "drinks", label: "نوشیدنی" },
//   { id: "desserts", label: "دسر" },
//   { id: "food", label: "غذا" },
// ];

// const img = (id: string) => `https://images.unsplash.com/${id}?w=500&q=80`;

// const items: Item[] = [
//   { id: "c1", category: "coffee", name: "اسپرسو", desc: "شوت غلیظ با عطر دانه‌های تازه و کرمای طلایی", price: "۸۵,۰۰۰", image: img("photo-1510707577719-ae7c14805e3a") },
//   { id: "c2", category: "coffee", name: "لاته افرومارکت", desc: "اسپرسو، شیر میکروفوم و یک لمسه وانیل", price: "۱۲۵,۰۰۰", tag: "پرفروش", image: img("photo-1461023058943-07fcbe16d735") },
//   { id: "c3", category: "coffee", name: "کاپوچینو", desc: "اسپرسو، شیر گرم و فوم ابریشمی", price: "۱۱۵,۰۰۰", image: img("photo-1572442388796-11668a67e53d") },
//   { id: "c4", category: "coffee", name: "کورتادو", desc: "اسپرسو و شیر گرم با تعادل کلاسیک", price: "۱۰۵,۰۰۰", tag: "جدید", image: img("photo-1509042239860-f550ce710b93") },
//   { id: "c5", category: "coffee", name: "آمریکانو", desc: "اسپرسو و آب داغ، طعمی ملایم و دلنشین", price: "۹۵,۰۰۰", image: img("photo-1497636577773-f1231844b336") },
//   { id: "c6", category: "coffee", name: "ماتشا لاته", desc: "چای سبز ژاپنی با شیر و عطر ملایم", price: "۱۴۵,۰۰۰", image: img("photo-1515823064-d6e0c04616a7") },
//   { id: "c7", category: "coffee", name: "موکا", desc: "ترکیب اسپرسو، شکلات و شیر بخارپز", price: "۱۳۵,۰۰۰", image: img("photo-1570968915860-54d5c301fa9f") },
//   { id: "d1", category: "drinks", name: "چای ایرانی", desc: "چای دم‌کرده با عطر بهاره و طعمی اصیل", price: "۳۰,۰۰۰", image: img("photo-1544787219-7f47ccb76574") },
//   { id: "d2", category: "drinks", name: "چای ترش", desc: "دمنوش خوش‌رنگ با طعمی متفاوت", price: "۵۵,۰۰۰", image: img("photo-1576092768241-dec231879fc3") },
//   { id: "d3", category: "drinks", name: "لیموناد خیار", desc: "لیمو، خیار، نعنا و طراوت یک روز تابستانی", price: "۸۰,۰۰۰", tag: "پرفروش", image: img("photo-1513558161293-cdaf765edfd4") },
//   { id: "d4", category: "drinks", name: "آب پرتقال", desc: "پرتقال تازه، بدون شکر افزوده", price: "۹۰,۰۰۰", image: img("photo-1600271886742-f049cd451bba") },
//   { id: "d5", category: "drinks", name: "اسموتی توت‌فرنگی", desc: "توت‌فرنگی، موز و ماست یونانی", price: "۱۲۵,۰۰۰", image: img("photo-1505252585461-04db1eb84625") },
//   { id: "d6", category: "drinks", name: "دمنوش زعفران", desc: "دمنوش زعفران با عطر گرم و دلنشین", price: "۷۰,۰۰۰", tag: "جدید", image: img("photo-1544787219-7f47ccb76574") },
//   { id: "s1", category: "desserts", name: "چیزکیک نیویورکی", desc: "چیزکیک کلاسیک با سس توت‌فرنگی", price: "۱۵۰,۰۰۰", tag: "پرفروش", image: img("photo-1533134242443-d4fd215305ad") },
//   { id: "s2", category: "desserts", name: "تیرامیسو", desc: "دسر ایتالیایی با قهوه و ماسکارپونه", price: "۱۶۵,۰۰۰", image: img("photo-1571877227200-a0d98ea607e9") },
//   { id: "s3", category: "desserts", name: "براونی با بستنی", desc: "براونی شکلاتی گرم با بستنی وانیلی", price: "۱۴۰,۰۰۰", image: img("photo-1606313564200-e75d5e30476c") },
//   { id: "s4", category: "desserts", name: "پنکیک", desc: "پنکیک خانگی با عسل و میوه تازه", price: "۱۳۵,۰۰۰", image: img("photo-1528207776546-365bb710ee93") },
//   { id: "s5", category: "desserts", name: "کرم بروله", desc: "دسر فرانسوی با کرم وانیلی لطیف", price: "۱۵۰,۰۰۰", image: img("photo-1488477181946-6428a0291777") },
//   { id: "s6", category: "desserts", name: "کیک شکلاتی", desc: "کیک شکلاتی با مغز نرم و غلیظ", price: "۱۴۵,۰۰۰", tag: "جدید", image: img("photo-1578985545062-69928b1d9587") },
//   { id: "f1", category: "food", name: "ساندویچ مرغ", desc: "مرغ گریل، سبزیجات تازه و سس مخصوص", price: "۱۸۰,۰۰۰", image: img("photo-1521390188846-e2a3a97453a0") },
//   { id: "f2", category: "food", name: "ساندویچ آووکادو", desc: "آووکادو، پنیر و سبزیجات تازه", price: "۱۶۵,۰۰۰", tag: "پرفروش", image: img("photo-1528735602780-2552fd46c7af") },
//   { id: "f3", category: "food", name: "پیتزا مارگاریتا", desc: "سس گوجه، موزارلا و رزماری", price: "۲۲۰,۰۰۰", image: img("photo-1574071318508-1cdbab80d002") },
//   { id: "f4", category: "food", name: "پاستا آلفردو", desc: "پاستا با سس خامه‌ای و مرغ", price: "۲۰۰,۰۰۰", image: img("photo-1645112411341-6c4fd023714a") },
//   { id: "f5", category: "food", name: "سالاد سزار", desc: "کاهو، مرغ گریل، کروتون و سس سزار", price: "۱۷۵,۰۰۰", image: img("photo-1546793665-c74683f339c1") },
//   { id: "f6", category: "food", name: "سوپ روز", desc: "سوپ فصل با نان تست تازه", price: "۱۲۰,۰۰۰", tag: "جدید", image: img("photo-1547592166-23ac45744acd") },
// ];

// const coffeeBlends = [
//   { id: "50/50", label: "۵۰ / ۵۰", title: "متعادل و کلاسیک", description: "ترکیبی متعادل با طعمی دلنشین، مناسب برای مصرف روزانه.", body: 75, acidity: 55, aroma: 70, arabica: "50%", robusta: "50%" },
//   { id: "70/30", label: "۷۰ / ۳۰", title: "ملایم و خوش‌عطر", description: "عطر بیشتر، تلخی کنترل‌شده و تجربه‌ای لطیف‌تر.", body: 65, acidity: 75, aroma: 90, arabica: "70%", robusta: "30%" },
//   { id: "100%", label: "۱۰۰٪ عربیکا", title: "خالص و اصیل", description: "۱۰۰٪ عربیکا؛ عطری پیچیده‌تر و طعمی ظریف و خاص.", body: 55, acidity: 90, aroma: 95, arabica: "100%", robusta: "0%" },
// ];

// const navLinks = [
//   ["خانه", "#home"],
//   ["پیشنهاد ویژه", "#featured"],
//   ["منو", "#menu"],
//   ["ترکیب قهوه", "#blend"],
//   ["درباره ما", "#about"],
//   ["تماس", "#contact"],
// ];

// const sections = categories.filter((c) => c.id !== "all");

// const chapterNote: Record<string, string> = {
//   coffee: "اسپرسو، شیر و دانه‌های تازه",
//   drinks: "دمنوش، آب‌میوه و نوشیدنی‌های خنک",
//   desserts: "شیرینی‌های دست‌ساز برای بعد از قهوه",
//   food: "سبک و سیر، برای هر ساعت از روز",
// };

// const chapterLatin: Record<string, string> = {
//   coffee: "Coffee",
//   drinks: "Refreshers",
//   desserts: "Desserts",
//   food: "Kitchen",
// };

// const EASE = [0.22, 1, 0.36, 1] as const;
// const fa = (n: number) => n.toLocaleString("fa-IR");
// const large = (src: string) => src.replace("w=500", "w=900");

// /* ─────────────────────── Small pieces ─────────────────────── */

// function Logo({ light = false }: { light?: boolean }) {
//   return (
//     <a href="#home" className="flex items-baseline gap-1.5" aria-label="Afroumarket">
//       <span
//         className={`font-brand text-[21px] font-semibold tracking-wide ${
//           light ? "text-white" : "text-[#1D4D3F]"
//         }`}
//       >
//         Afroumarket
//       </span>
//       <span className="h-1 w-1 rounded-full bg-[#CD9E6A]" />
//     </a>
//   );
// }

// /** the arch (طاق) — the shape this whole page is built around */
// function ArchMark({ className = "" }: { className?: string }) {
//   return (
//     <svg
//       aria-hidden
//       width="26"
//       height="34"
//       viewBox="0 0 26 34"
//       fill="none"
//       className={className}
//     >
//       <path d="M2 33V13a11 11 0 0 1 22 0v20" stroke="#CD9E6A" strokeWidth="1.5" strokeLinecap="round" />
//     </svg>
//   );
// }

// function MenuCard({ item }: { item: Item }) {
//   return (
//     <motion.article
//       initial={{ opacity: 0, y: 28 }}
//       whileInView={{ opacity: 1, y: 0 }}
//       viewport={{ once: true, amount: 0.15 }}
//       transition={{ duration: 0.8, ease: EASE }}
//       className="group relative"
//     >
//       {/* soft square */}
//       <div className="relative aspect-square overflow-hidden rounded-[40px] bg-[#F5F2ED]">
//         <img
//           src={large(item.image)}
//           alt={item.name}
//           loading="lazy"
//           className="h-full w-full object-cover transition-transform duration-[1400ms] ease-out group-hover:scale-[1.06]"
//         />
//         <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#0F2A22]/45 via-transparent to-transparent" />

//         {item.tag && (
//           <span
//             className={`absolute right-4 top-4 rounded-full px-3.5 py-1.5 text-[11px] font-bold backdrop-blur-md ${
//               item.tag === "پرفروش" ? "bg-[#CD9E6A] text-white" : "bg-white/90 text-[#1D4D3F]"
//             }`}
//           >
//             {item.tag}
//           </span>
//         )}
//       </div>

//       {/* gold outline, one step out */}
//       <div className="pointer-events-none absolute -inset-2 rounded-[48px] border border-[#CD9E6A]/30 transition-colors duration-700 group-hover:border-[#CD9E6A]/70" />

//       {/* glass label */}
//       <div className="absolute inset-x-3 bottom-3 rounded-[28px] bg-white/85 p-5 shadow-[0_18px_40px_-20px_rgba(15,42,34,0.5)] backdrop-blur-xl sm:p-6">
//         <div className="flex items-baseline justify-between gap-4">
//           <h3 className="text-lg font-bold text-[#1D4D3F] sm:text-xl">{item.name}</h3>
//           <div className="flex shrink-0 items-baseline gap-1">
//             <span className="text-lg font-extrabold text-[#A07840] sm:text-xl">{item.price}</span>
//             <span className="text-[10px] text-[#1D4D3F]/45">تومان</span>
//           </div>
//         </div>
//         <p className="mt-2 line-clamp-2 text-xs leading-6 text-[#1D4D3F]/55 sm:text-[13px]">
//           {item.desc}
//         </p>
//       </div>
//     </motion.article>
//   );
// }

// function CoffeeBlendSelector() {
//   const [selected, setSelected] = useState("70/30");
//   const active = coffeeBlends.find((b) => b.id === selected) ?? coffeeBlends[1];

//   return (
//     <section id="blend" className="px-5 md:px-8">
//       <div className="relative mx-auto max-w-6xl overflow-hidden rounded-[36px] bg-[#1D4D3F] px-6 py-16 md:px-16 md:py-24">
//         <div className="pointer-events-none absolute -left-24 -top-24 h-80 w-80 rounded-full bg-[#CD9E6A]/[0.12] blur-[90px]" />

//         <div className="relative mx-auto max-w-3xl">
//           <div className="mb-12 text-center">
//             <h2 className="text-3xl font-light text-white md:text-5xl">ترکیب قهوه‌ات را انتخاب کن</h2>
//             <p className="mt-4 text-sm text-white/50">هر ترکیب، تجربه‌ای متفاوت از طعم و عطر</p>
//           </div>

//           <div className="mx-auto grid max-w-xl grid-cols-3 border-b border-white/15">
//             {coffeeBlends.map((blend) => (
//               <button
//                 key={blend.id}
//                 onClick={() => setSelected(blend.id)}
//                 className={`relative py-4 text-sm transition-colors duration-300 ${
//                   selected === blend.id ? "font-bold text-white" : "text-white/45 hover:text-white/80"
//                 }`}
//               >
//                 {blend.label}
//                 {selected === blend.id && (
//                   <motion.span
//                     layoutId="blendUnderline"
//                     className="absolute inset-x-6 -bottom-px h-[2px] bg-[#CD9E6A]"
//                     transition={{ type: "spring", stiffness: 380, damping: 32 }}
//                   />
//                 )}
//               </button>
//             ))}
//           </div>

//           <AnimatePresence mode="wait">
//             <motion.div
//               key={active.id}
//               initial={{ opacity: 0, y: 10 }}
//               animate={{ opacity: 1, y: 0 }}
//               exit={{ opacity: 0, y: -6 }}
//               transition={{ duration: 0.3, ease: EASE }}
//               className="mx-auto mt-12 grid max-w-xl gap-10 md:grid-cols-2 md:gap-14"
//             >
//               <div>
//                 <h3 className="text-xl font-bold text-white">{active.title}</h3>
//                 <p className="mt-3 text-sm leading-8 text-white/55">{active.description}</p>
//                 <div className="mt-6 flex gap-10">
//                   <div>
//                     <p className="text-xs text-white/40">عربیکا</p>
//                     <p className="mt-1 text-2xl font-light text-[#CD9E6A]" dir="ltr">{active.arabica}</p>
//                   </div>
//                   <div>
//                     <p className="text-xs text-white/40">روبوستا</p>
//                     <p className="mt-1 text-2xl font-light text-[#CD9E6A]" dir="ltr">{active.robusta}</p>
//                   </div>
//                 </div>
//               </div>

//               <div className="space-y-6 self-center">
//                 {[
//                   { label: "بدنه", value: active.body },
//                   { label: "اسیدیته", value: active.acidity },
//                   { label: "عطر", value: active.aroma },
//                 ].map((row) => (
//                   <div key={row.label}>
//                     <div className="mb-2 flex justify-between text-xs">
//                       <span className="text-white/70">{row.label}</span>
//                       <span className="text-[#CD9E6A]">{row.value}%</span>
//                     </div>
//                     <div className="h-px bg-white/15">
//                       <motion.div
//                         initial={{ width: 0 }}
//                         animate={{ width: `${row.value}%` }}
//                         transition={{ duration: 0.8, ease: EASE }}
//                         className="h-[2px] -translate-y-px rounded-full bg-[#CD9E6A]"
//                       />
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             </motion.div>
//           </AnimatePresence>
//         </div>
//       </div>
//     </section>
//   );
// }

// function BackToTop() {
//   const [visible, setVisible] = useState(false);

//   useEffect(() => {
//     const onScroll = () => setVisible(window.scrollY > 400);
//     window.addEventListener("scroll", onScroll, { passive: true });
//     onScroll();
//     return () => window.removeEventListener("scroll", onScroll);
//   }, []);

//   return (
//     <AnimatePresence>
//       {visible && (
//         <motion.button
//           initial={{ opacity: 0, y: 16 }}
//           animate={{ opacity: 1, y: 0 }}
//           exit={{ opacity: 0, y: 16 }}
//           transition={{ duration: 0.25 }}
//           onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
//           aria-label="بازگشت به بالای صفحه"
//           className="fixed bottom-6 left-6 z-[80] flex h-11 w-11 items-center justify-center rounded-full bg-[#1D4D3F] text-white shadow-lg shadow-[#1D4D3F]/20 transition hover:bg-[#14382E] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#CD9E6A]"
//         >
//           <ArrowUp size={18} strokeWidth={1.8} />
//         </motion.button>
//       )}
//     </AnimatePresence>
//   );
// }

// /* ─────────────────────── Special offer slider ─────────────────────── */

// const offerItems = items.filter((i) => i.tag === "پرفروش");
// const SLIDE_MS = 5500;

// function SpecialOffer({ onSeeInMenu }: { onSeeInMenu: (category: string) => void }) {
//   const reduce = useReducedMotion();
//   const [index, setIndex] = useState(0);
//   const item = offerItems[index];
//   const categoryLabel = categories.find((c) => c.id === item.category)?.label;

//   /* auto-advance; restarts whenever the slide changes (also after a manual click) */
//   useEffect(() => {
//     if (reduce) return;
//     const t = setTimeout(() => setIndex((i) => (i + 1) % offerItems.length), SLIDE_MS);
//     return () => clearTimeout(t);
//   }, [index, reduce]);

//   return (
//     <section id="featured" aria-label="پیشنهاد ویژه" className="px-5 md:px-8">
//       <div className="relative mx-auto max-w-6xl">
//         <div className="relative overflow-hidden rounded-[40px] bg-[#1D4D3F] p-3 md:p-4">
//           <div className="pointer-events-none absolute -right-20 -top-24 h-72 w-72 rounded-full bg-[#CD9E6A]/[0.14] blur-[90px]" />

//           <div className="relative grid gap-3 md:grid-cols-[1fr_340px] md:gap-6 lg:grid-cols-[1fr_400px]">
//             {/* text */}
//             <div className="flex flex-col justify-between p-5 md:min-h-[300px] md:p-8">
//               <AnimatePresence mode="wait" initial={false}>
//                 <motion.div
//                   key={item.id}
//                   initial={{ opacity: 0, y: 14 }}
//                   animate={{ opacity: 1, y: 0 }}
//                   exit={{ opacity: 0, y: -10 }}
//                   transition={{ duration: 0.45, ease: EASE }}
//                 >
//                   <div className="flex items-center gap-3">
//                     <span className="text-xs font-bold text-[#CD9E6A]">پیشنهاد ویژه</span>
//                     <span className="h-px w-8 bg-[#CD9E6A]/50" />
//                     <span className="text-xs text-white/45">{categoryLabel}</span>
//                   </div>
//                   <h2 className="mt-4 text-3xl font-light leading-snug text-white md:text-5xl">
//                     {item.name}
//                   </h2>
//                   <p className="mt-3 line-clamp-2 max-w-sm text-sm leading-8 text-white/55">
//                     {item.desc}
//                   </p>
//                   <div className="mt-5 flex items-baseline gap-2">
//                     <span className="text-3xl font-light text-[#CD9E6A]">{item.price}</span>
//                     <span className="text-xs text-white/40">تومان</span>
//                   </div>
//                 </motion.div>
//               </AnimatePresence>

//               <div className="mt-6 flex items-center justify-between gap-4">
//                 <button
//                   onClick={() => onSeeInMenu(item.category)}
//                   className="group flex items-center gap-2.5 rounded-full bg-[#CD9E6A] px-6 py-3 text-xs font-bold text-[#14382E] transition hover:bg-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
//                 >
//                   دیدن در منو
//                   <ArrowLeft size={15} className="transition-transform group-hover:-translate-x-1" />
//                 </button>

//                 <div className="flex items-center gap-2" role="group" aria-label="انتخاب پیشنهاد">
//                   {offerItems.map((o, i) => (
//                     <button
//                       key={o.id}
//                       onClick={() => setIndex(i)}
//                       aria-label={o.name}
//                       aria-current={i === index}
//                       className="flex items-center py-3"
//                     >
//                       <span
//                         className={`relative block h-1 overflow-hidden rounded-full bg-white/20 transition-all duration-500 ${
//                           i === index ? "w-10" : "w-4"
//                         }`}
//                       >
//                         {i === index &&
//                           (reduce ? (
//                             <span className="absolute inset-0 bg-[#CD9E6A]" />
//                           ) : (
//                             <motion.span
//                               key={index}
//                               initial={{ width: 0 }}
//                               animate={{ width: "100%" }}
//                               transition={{ duration: SLIDE_MS / 1000, ease: "linear" }}
//                               className="absolute inset-y-0 right-0 bg-[#CD9E6A]"
//                             />
//                           ))}
//                       </span>
//                     </button>
//                   ))}
//                 </div>
//               </div>
//             </div>

//             {/* image */}
//             <div className="relative order-first aspect-[4/3] overflow-hidden rounded-[30px] bg-[#14382E] md:order-none md:aspect-auto md:min-h-[300px]">
//               <AnimatePresence initial={false}>
//                 <motion.img
//                   key={item.id}
//                   src={large(item.image)}
//                   alt={item.name}
//                   initial={{ opacity: 0, scale: 1.08 }}
//                   animate={{ opacity: 1, scale: 1 }}
//                   exit={{ opacity: 0 }}
//                   transition={{ duration: 0.9, ease: EASE }}
//                   className="absolute inset-0 h-full w-full object-cover"
//                 />
//               </AnimatePresence>
//               <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#0F2A22]/35 via-transparent to-transparent" />
//               <span className="absolute right-4 top-4 rounded-full bg-[#CD9E6A] px-3.5 py-1.5 text-[11px] font-bold text-white">
//                 پرفروش
//               </span>
//             </div>
//           </div>
//         </div>

//         <div className="pointer-events-none absolute -inset-2 rounded-[48px] border border-[#CD9E6A]/30" />
//       </div>
//     </section>
//   );
// }

// /* ─────────────────────── Main Page ─────────────────────── */

// const heroArches = [
//   {
//     src: "https://images.unsplash.com/photo-1572442388796-11668a67e53d?w=800&q=85",
//     alt: "Cappuccino",
//     size: "w-[27vw] max-w-[230px] aspect-[2/3]",
//     delay: 0.3,
//   },
//   {
//     src: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=900&q=85",
//     alt: "Coffee",
//     size: "w-[35vw] max-w-[290px] aspect-[2/3.5]",
//     delay: 0.1,
//   },
//   {
//     src: "https://images.unsplash.com/photo-1533134242443-d4fd215305ad?w=800&q=85",
//     alt: "Cheesecake",
//     size: "w-[27vw] max-w-[230px] aspect-[2/3]",
//     delay: 0.5,
//   },
// ];

// export default function Home() {
//   const [mobileMenu, setMobileMenu] = useState(false);
//   const [scrolled, setScrolled] = useState(false);
//   const [activeCat, setActiveCat] = useState(sections[0].id);
//   const shouldReduceMotion = useReducedMotion();
//   const tabRefs = useRef<Record<string, HTMLButtonElement | null>>({});

//   /* always start at the very top after a refresh */
//   useEffect(() => {
//     if ("scrollRestoration" in window.history) {
//       window.history.scrollRestoration = "manual";
//     }
//     window.scrollTo(0, 0);
//     const reset = () => window.scrollTo(0, 0);
//     window.addEventListener("beforeunload", reset);
//     return () => window.removeEventListener("beforeunload", reset);
//   }, []);

//   useEffect(() => {
//     const onScroll = () => setScrolled(window.scrollY > 24);
//     window.addEventListener("scroll", onScroll, { passive: true });
//     onScroll();
//     return () => window.removeEventListener("scroll", onScroll);
//   }, []);

//   /* scroll-spy: highlight the chapter currently on screen */
//   useEffect(() => {
//     const observer = new IntersectionObserver(
//       (entries) => {
//         entries.forEach((e) => {
//           if (e.isIntersecting) setActiveCat(e.target.getAttribute("data-cat") ?? sections[0].id);
//         });
//       },
//       { rootMargin: "-30% 0px -60% 0px" },
//     );
//     sections.forEach((c) => {
//       const el = document.getElementById(`cat-${c.id}`);
//       if (el) observer.observe(el);
//     });
//     return () => observer.disconnect();
//   }, []);

//   useEffect(() => {
//     tabRefs.current[activeCat]?.scrollIntoView({
//       inline: "center",
//       block: "nearest",
//       behavior: shouldReduceMotion ? "auto" : "smooth",
//     });
//   }, [activeCat, shouldReduceMotion]);

//   const byCategory = useMemo(() => {
//     const map: Record<string, Item[]> = {};
//     items.forEach((i) => (map[i.category] = [...(map[i.category] ?? []), i]));
//     return map;
//   }, []);

//   const goTo = (id: string) =>
//     document
//       .getElementById(`cat-${id}`)
//       ?.scrollIntoView({ behavior: shouldReduceMotion ? "auto" : "smooth" });

//   const scrollToMenu = () =>
//     document
//       .getElementById("menu")
//       ?.scrollIntoView({ behavior: shouldReduceMotion ? "auto" : "smooth" });

//   const heroIn = (delay: number) => ({
//     initial: shouldReduceMotion ? false : { opacity: 0, y: 20 },
//     animate: { opacity: 1, y: 0 },
//     transition: { duration: 0.9, delay, ease: EASE },
//   });

//   return (
//     <main id="home" dir="rtl" className="relative isolate min-h-screen overflow-x-clip text-[#1D4D3F]">
//       {/* ───────────── BACKGROUND ───────────── */}
//       <div
//         aria-hidden
//         className="pointer-events-none fixed inset-0 -z-20 bg-[#FBFAF7]"
//         style={{
//           backgroundImage:
//             "radial-gradient(60% 45% at 100% 0%, rgba(205,158,106,0.18), transparent 70%), radial-gradient(50% 40% at 0% 45%, rgba(29,77,63,0.08), transparent 70%), radial-gradient(45% 35% at 100% 100%, rgba(205,158,106,0.12), transparent 70%)",
//         }}
//       />
//       <div
//         aria-hidden
//         className="pointer-events-none fixed inset-0 -z-10"
//         style={{
//           backgroundImage: "radial-gradient(rgba(29,77,63,0.09) 1px, transparent 1px)",
//           backgroundSize: "28px 28px",
//           maskImage: "linear-gradient(to bottom, black, transparent 75%)",
//           WebkitMaskImage: "linear-gradient(to bottom, black, transparent 75%)",
//         }}
//       />

//       {/* ───────────── HEADER ───────────── */}
//       <header
//         className={`fixed inset-x-0 top-0 z-50 border-b transition-colors duration-500 ${
//           scrolled || mobileMenu
//             ? "border-[#1D4D3F]/[0.07] bg-[#FBFAF7]/85 backdrop-blur-xl"
//             : "border-transparent bg-transparent"
//         }`}
//       >
//         <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5 md:px-8">
//           <Logo />
//           <nav className="hidden items-center gap-9 text-[13px] text-[#1D4D3F]/60 md:flex">
//             {navLinks.map(([label, href]) => (
//               <a key={href} href={href} className="transition hover:text-[#1D4D3F]">
//                 {label}
//               </a>
//             ))}
//           </nav>
//           <div className="flex items-center gap-2">
//             <a
//               href="#contact"
//               className="hidden rounded-full bg-[#1D4D3F] px-5 py-2.5 text-xs font-bold text-white transition hover:bg-[#14382E] sm:block"
//             >
//               سفارش و رزرو
//             </a>
//             <button
//               onClick={() => setMobileMenu(!mobileMenu)}
//               aria-label="باز کردن منو"
//               className="flex h-10 w-10 items-center justify-center rounded-full text-[#1D4D3F] md:hidden"
//             >
//               {mobileMenu ? <X size={20} /> : <MenuIcon size={20} />}
//             </button>
//           </div>
//         </div>

//         <AnimatePresence>
//           {mobileMenu && (
//             <motion.nav
//               initial={{ height: 0, opacity: 0 }}
//               animate={{ height: "auto", opacity: 1 }}
//               exit={{ height: 0, opacity: 0 }}
//               className="overflow-hidden md:hidden"
//             >
//               <div className="flex flex-col px-6 pb-3 text-sm">
//                 {navLinks.map(([label, href]) => (
//                   <a
//                     key={href}
//                     href={href}
//                     onClick={() => setMobileMenu(false)}
//                     className="border-b border-[#1D4D3F]/[0.06] py-4 text-[#1D4D3F]/70 last:border-0"
//                   >
//                     {label}
//                   </a>
//                 ))}
//               </div>
//             </motion.nav>
//           )}
//         </AnimatePresence>
//       </header>

//       {/* ───────────── HERO ───────────── */}
//       <section className="px-5 pb-20 pt-32 text-center md:px-8 md:pb-24 md:pt-40">
//         <div className="mx-auto max-w-6xl">
//           <motion.p {...heroIn(0)} className="font-brand text-sm italic text-[#A07840]">
//             Afroumarket Café
//           </motion.p>
//           <motion.h1
//             {...heroIn(0.1)}
//             className="mt-6 text-5xl font-light leading-[1.3] text-[#1D4D3F] md:text-8xl"
//           >
//             طعم لحظه‌های
//             <br />
//             ماندگار
//           </motion.h1>
//           <motion.p
//             {...heroIn(0.2)}
//             className="mx-auto mt-7 max-w-sm text-sm leading-9 text-[#1D4D3F]/55 md:text-base"
//           >
//             جایی برای مکث کردن و لذت بردن؛ از عطر قهوه تازه تا طعم دسرهای دست‌ساز.
//           </motion.p>
//           <motion.div {...heroIn(0.3)} className="mt-9 flex items-center justify-center gap-7">
//             <button
//               onClick={scrollToMenu}
//               className="group flex items-center gap-3 rounded-full bg-[#1D4D3F] px-8 py-4 text-sm font-bold text-white transition hover:bg-[#14382E] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#CD9E6A]"
//             >
//               مشاهده منو
//               <ArrowLeft size={16} className="transition-transform group-hover:-translate-x-1" />
//             </button>
//             <a
//               href="#about"
//               className="border-b border-[#CD9E6A] pb-1 text-sm text-[#1D4D3F]/70 transition hover:text-[#1D4D3F]"
//             >
//               داستان ما
//             </a>
//           </motion.div>

//           {/* three arches */}
//           <div className="mt-16 md:mt-24">
//             <div className="flex items-end justify-center gap-4 md:gap-8">
//               {heroArches.map((arch) => (
//                 <motion.div
//                   key={arch.alt}
//                   initial={shouldReduceMotion ? false : { opacity: 0, y: 70 }}
//                   animate={{ opacity: 1, y: 0 }}
//                   transition={{ duration: 1.2, delay: arch.delay, ease: EASE }}
//                   className={`relative ${arch.size}`}
//                 >
//                   <div className="h-full w-full overflow-hidden rounded-t-[999px] rounded-b-[20px] bg-[#F5F2ED]">
//                     <img src={arch.src} alt={arch.alt} className="h-full w-full object-cover" />
//                   </div>
//                   <div className="pointer-events-none absolute -inset-2 rounded-t-[999px] rounded-b-[26px] border border-[#CD9E6A]/40" />
//                 </motion.div>
//               ))}
//             </div>
//             <div className="mx-auto mt-4 h-px w-full max-w-4xl bg-gradient-to-r from-transparent via-[#CD9E6A]/60 to-transparent" />
//           </div>
//         </div>
//       </section>

//       {/* ───────────── SPECIAL OFFER (slider) ───────────── */}
//       <SpecialOffer onSeeInMenu={goTo} />

//       {/* ───────────── MENU ───────────── */}
//       <section id="menu" className="px-5 pb-28 pt-24 md:px-8 md:pb-40 md:pt-32">
//         <div className="mx-auto max-w-6xl">
//           <div className="mb-10 text-center">
//             <ArchMark className="mx-auto mb-6" />
//             <h2 className="text-5xl font-light text-[#1D4D3F] md:text-7xl">منوی کافه</h2>
//             <p className="mx-auto mt-5 max-w-sm text-sm leading-8 text-[#1D4D3F]/50">
//               از قهوه‌های خوش‌عطر تا دسرهای دست‌ساز؛ انتخابی برای هر سلیقه.
//             </p>
//           </div>

//           {/* sticky dock */}
//           <div className="sticky top-[76px] z-40 mb-14 flex justify-center">
//             <div className="max-w-full overflow-x-auto rounded-full bg-[#1D4D3F] p-1.5 shadow-[0_16px_38px_-14px_rgba(29,77,63,0.6)] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
//               <div className="flex items-center gap-1">
//                 {sections.map((c) => (
//                   <button
//                     key={c.id}
//                     ref={(el) => {
//                       tabRefs.current[c.id] = el;
//                     }}
//                     onClick={() => goTo(c.id)}
//                     className={`relative isolate shrink-0 rounded-full px-6 py-2.5 text-[13px] transition-colors duration-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#CD9E6A] ${
//                       activeCat === c.id ? "font-bold text-[#1D4D3F]" : "text-white/70 hover:text-white"
//                     }`}
//                   >
//                     {activeCat === c.id && (
//                       <motion.span
//                         layoutId="dockPill"
//                         className="absolute inset-0 -z-10 rounded-full bg-[#FBFAF7]"
//                         transition={{ type: "spring", stiffness: 380, damping: 32 }}
//                       />
//                     )}
//                     {c.label}
//                   </button>
//                 ))}
//               </div>
//             </div>
//           </div>

//           {/* chapters */}
//           {sections.map((c) => {
//             const list = byCategory[c.id] ?? [];
//             return (
//               <div key={c.id} id={`cat-${c.id}`} data-cat={c.id} className="scroll-mt-8 pb-24 last:pb-0">
//                 <div className="mb-12 flex items-end justify-between gap-6 border-b border-[#CD9E6A]/30 pb-7">
//                   <div>
//                     <p className="font-brand text-lg italic text-[#A07840]">{chapterLatin[c.id]}</p>
//                     <h3 className="mt-1 text-5xl font-light text-[#1D4D3F] md:text-7xl">{c.label}</h3>
//                     <p className="mt-4 text-sm text-[#1D4D3F]/50">{chapterNote[c.id]}</p>
//                   </div>
//                   <span className="shrink-0 pb-1 text-xs text-[#A07840]">{fa(list.length)} مورد</span>
//                 </div>

//                 <div className="grid grid-cols-1 gap-x-8 gap-y-12 px-2 md:grid-cols-2 lg:grid-cols-3">
//                   {list.map((item) => (
//                     <MenuCard key={item.id} item={item} />
//                   ))}
//                 </div>
//               </div>
//             );
//           })}

//           <p className="mt-16 text-center text-[11px] text-[#1D4D3F]/35">
//             قیمت‌ها به تومان هستند و ممکن است با تغییر فصل به‌روزرسانی شوند.
//           </p>
//         </div>
//       </section>

//       {/* ───────────── BLEND ───────────── */}
//       <div className="pb-28 md:pb-40">
//         <CoffeeBlendSelector />
//       </div>

//       {/* ───────────── ABOUT ───────────── */}
//       <section id="about" className="px-5 pb-28 md:px-8 md:pb-40">
//         <div className="mx-auto grid max-w-6xl items-center gap-16 lg:grid-cols-2 lg:gap-24">
//           <div className="relative mx-auto w-full max-w-sm lg:max-w-md">
//             <div className="aspect-[3/4] overflow-hidden rounded-t-[999px] rounded-b-[36px] bg-[#F5F2ED]">
//               <img
//                 src="https://images.unsplash.com/photo-1445116572660-236099ec97a0?w=900&q=85"
//                 alt="Cafe interior"
//                 className="h-full w-full object-cover"
//               />
//             </div>
//             <div className="pointer-events-none absolute -inset-2 rounded-t-[999px] rounded-b-[44px] border border-[#CD9E6A]/35" />
//             <img
//               src="https://images.unsplash.com/photo-1442512595331-e89e73853f31?w=500&q=85"
//               alt="Coffee preparation"
//               className="absolute -bottom-8 -left-5 h-44 w-32 rounded-t-[999px] rounded-b-[20px] border-[6px] border-[#FBFAF7] object-cover md:-left-10 md:h-56 md:w-40"
//             />
//           </div>

//           <div>
//             <ArchMark className="mb-6" />
//             <h2 className="text-4xl font-light leading-[1.4] text-[#1D4D3F] md:text-6xl">
//               بیشتر از یک کافه،
//               <br />
//               یک حس خوب
//             </h2>
//             <p className="mt-8 max-w-md text-sm leading-9 text-[#1D4D3F]/55">
//               افرومارکت جایی است برای طعم‌های دوست‌داشتنی، دیدارهای صمیمی و لحظه‌هایی که
//               دوست داریم کمی طولانی‌تر شوند. ما به کیفیت مواد اولیه، تازگی و جزئیات اهمیت
//               می‌دهیم.
//             </p>
//           </div>
//         </div>
//       </section>

//       {/* ───────────── CONTACT (a doorway) ───────────── */}
//       <section id="contact" className="px-5 pb-28 md:px-8 md:pb-36">
//         <div className="relative mx-auto max-w-xl overflow-hidden rounded-t-[999px] rounded-b-[44px] bg-[#1D4D3F] px-7 pb-16 pt-44 text-center md:px-14 md:pt-56">
//           <div className="pointer-events-none absolute inset-3 rounded-t-[999px] rounded-b-[34px] border border-[#CD9E6A]/30" />
//           <div className="pointer-events-none absolute -top-20 left-1/2 h-72 w-72 -translate-x-1/2 rounded-full bg-[#CD9E6A]/[0.14] blur-[80px]" />

//           <div className="relative">
//             <h2 className="text-3xl font-light leading-[1.45] text-white md:text-5xl">
//               آماده یک تجربه
//               <br />
//               خوشمزه هستید؟
//             </h2>
//             <p className="mx-auto mt-5 max-w-xs text-sm leading-8 text-white/55">
//               برای رزرو میز، سفارش یا دریافت اطلاعات بیشتر با ما در ارتباط باشید.
//             </p>
//             <div className="mt-9 flex flex-wrap justify-center gap-3">
//               <a
//                 href="tel:02112345678"
//                 className="flex items-center gap-3 rounded-full bg-[#CD9E6A] px-7 py-4 text-sm font-bold text-[#14382E] transition hover:bg-white"
//               >
//                 <Phone size={16} />
//                 تماس با ما
//               </a>
//               <a
//                 href="https://instagram.com/"
//                 target="_blank"
//                 rel="noreferrer"
//                 className="rounded-full border border-white/25 px-7 py-4 text-sm font-bold text-white transition hover:bg-white/10"
//               >
//                 اینستاگرام
//               </a>
//             </div>
//           </div>
//         </div>
//       </section>

//       {/* ───────────── FOOTER ───────────── */}
//       <footer className="border-t border-[#1D4D3F]/[0.08] px-5 py-10 md:px-8">
//         <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-6 md:flex-row">
//           <Logo />
//           <div className="flex gap-8 text-xs text-[#1D4D3F]/55">
//             <a href="#home" className="transition hover:text-[#1D4D3F]">خانه</a>
//             <a href="#menu" className="transition hover:text-[#1D4D3F]">منو</a>
//             <a href="#about" className="transition hover:text-[#1D4D3F]">درباره ما</a>
//             <a href="#contact" className="transition hover:text-[#1D4D3F]">تماس</a>
//           </div>
//           <p className="text-[11px] text-[#1D4D3F]/35">Afroumarket © ۱۴۰۵</p>
//         </div>
//       </footer>

//       <BackToTop />
//     </main>
//   );
// }


"use client";

import { useMemo, useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { ArrowLeft, Menu as MenuIcon, X, Phone, ArrowUp } from "lucide-react";

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
}

/* ─────────────────────── Data ─────────────────────── */

const categories: Category[] = [
  { id: "all", label: "همه" },
  { id: "coffee", label: "قهوه" },
  { id: "drinks", label: "نوشیدنی" },
  { id: "desserts", label: "دسر" },
  { id: "food", label: "غذا" },
];

const img = (id: string) => `https://images.unsplash.com/${id}?w=500&q=80`;

const items: Item[] = [
  { id: "c1", category: "coffee", name: "اسپرسو", desc: "شوت غلیظ با عطر دانه‌های تازه و کرمای طلایی", price: "۸۵,۰۰۰", image: img("photo-1510707577719-ae7c14805e3a") },
  { id: "c2", category: "coffee", name: "لاته افرومارکت", desc: "اسپرسو، شیر میکروفوم و یک لمسه وانیل", price: "۱۲۵,۰۰۰", tag: "پرفروش", image: img("photo-1461023058943-07fcbe16d735") },
  { id: "c3", category: "coffee", name: "کاپوچینو", desc: "اسپرسو، شیر گرم و فوم ابریشمی", price: "۱۱۵,۰۰۰", image: img("photo-1572442388796-11668a67e53d") },
  { id: "c4", category: "coffee", name: "کورتادو", desc: "اسپرسو و شیر گرم با تعادل کلاسیک", price: "۱۰۵,۰۰۰", tag: "جدید", image: img("photo-1509042239860-f550ce710b93") },
  { id: "c5", category: "coffee", name: "آمریکانو", desc: "اسپرسو و آب داغ، طعمی ملایم و دلنشین", price: "۹۵,۰۰۰", image: img("photo-1497636577773-f1231844b336") },
  { id: "c6", category: "coffee", name: "ماتشا لاته", desc: "چای سبز ژاپنی با شیر و عطر ملایم", price: "۱۴۵,۰۰۰", image: img("photo-1515823064-d6e0c04616a7") },
  { id: "c7", category: "coffee", name: "موکا", desc: "ترکیب اسپرسو، شکلات و شیر بخارپز", price: "۱۳۵,۰۰۰", image: img("photo-1570968915860-54d5c301fa9f") },
  { id: "d1", category: "drinks", name: "چای ایرانی", desc: "چای دم‌کرده با عطر بهاره و طعمی اصیل", price: "۳۰,۰۰۰", image: img("photo-1544787219-7f47ccb76574") },
  { id: "d2", category: "drinks", name: "چای ترش", desc: "دمنوش خوش‌رنگ با طعمی متفاوت", price: "۵۵,۰۰۰", image: img("photo-1576092768241-dec231879fc3") },
  { id: "d3", category: "drinks", name: "لیموناد خیار", desc: "لیمو، خیار، نعنا و طراوت یک روز تابستانی", price: "۸۰,۰۰۰", tag: "پرفروش", image: img("photo-1513558161293-cdaf765edfd4") },
  { id: "d4", category: "drinks", name: "آب پرتقال", desc: "پرتقال تازه، بدون شکر افزوده", price: "۹۰,۰۰۰", image: img("photo-1600271886742-f049cd451bba") },
  { id: "d5", category: "drinks", name: "اسموتی توت‌فرنگی", desc: "توت‌فرنگی، موز و ماست یونانی", price: "۱۲۵,۰۰۰", image: img("photo-1505252585461-04db1eb84625") },
  { id: "d6", category: "drinks", name: "دمنوش زعفران", desc: "دمنوش زعفران با عطر گرم و دلنشین", price: "۷۰,۰۰۰", tag: "جدید", image: img("photo-1544787219-7f47ccb76574") },
  { id: "s1", category: "desserts", name: "چیزکیک نیویورکی", desc: "چیزکیک کلاسیک با سس توت‌فرنگی", price: "۱۵۰,۰۰۰", tag: "پرفروش", image: img("photo-1533134242443-d4fd215305ad") },
  { id: "s2", category: "desserts", name: "تیرامیسو", desc: "دسر ایتالیایی با قهوه و ماسکارپونه", price: "۱۶۵,۰۰۰", image: img("photo-1571877227200-a0d98ea607e9") },
  { id: "s3", category: "desserts", name: "براونی با بستنی", desc: "براونی شکلاتی گرم با بستنی وانیلی", price: "۱۴۰,۰۰۰", image: img("photo-1606313564200-e75d5e30476c") },
  { id: "s4", category: "desserts", name: "پنکیک", desc: "پنکیک خانگی با عسل و میوه تازه", price: "۱۳۵,۰۰۰", image: img("photo-1528207776546-365bb710ee93") },
  { id: "s5", category: "desserts", name: "کرم بروله", desc: "دسر فرانسوی با کرم وانیلی لطیف", price: "۱۵۰,۰۰۰", image: img("photo-1488477181946-6428a0291777") },
  { id: "s6", category: "desserts", name: "کیک شکلاتی", desc: "کیک شکلاتی با مغز نرم و غلیظ", price: "۱۴۵,۰۰۰", tag: "جدید", image: img("photo-1578985545062-69928b1d9587") },
  { id: "f1", category: "food", name: "ساندویچ مرغ", desc: "مرغ گریل، سبزیجات تازه و سس مخصوص", price: "۱۸۰,۰۰۰", image: img("photo-1521390188846-e2a3a97453a0") },
  { id: "f2", category: "food", name: "ساندویچ آووکادو", desc: "آووکادو، پنیر و سبزیجات تازه", price: "۱۶۵,۰۰۰", tag: "پرفروش", image: img("photo-1528735602780-2552fd46c7af") },
  { id: "f3", category: "food", name: "پیتزا مارگاریتا", desc: "سس گوجه، موزارلا و رزماری", price: "۲۲۰,۰۰۰", image: img("photo-1574071318508-1cdbab80d002") },
  { id: "f4", category: "food", name: "پاستا آلفردو", desc: "پاستا با سس خامه‌ای و مرغ", price: "۲۰۰,۰۰۰", image: img("photo-1645112411341-6c4fd023714a") },
  { id: "f5", category: "food", name: "سالاد سزار", desc: "کاهو، مرغ گریل، کروتون و سس سزار", price: "۱۷۵,۰۰۰", image: img("photo-1546793665-c74683f339c1") },
  { id: "f6", category: "food", name: "سوپ روز", desc: "سوپ فصل با نان تست تازه", price: "۱۲۰,۰۰۰", tag: "جدید", image: img("photo-1547592166-23ac45744acd") },
];

const coffeeBlends = [
  { id: "50/50", label: "۵۰ / ۵۰", title: "متعادل و کلاسیک", description: "ترکیبی متعادل با طعمی دلنشین، مناسب برای مصرف روزانه.", body: 75, acidity: 55, aroma: 70, arabica: "50%", robusta: "50%" },
  { id: "70/30", label: "۷۰ / ۳۰", title: "ملایم و خوش‌عطر", description: "عطر بیشتر، تلخی کنترل‌شده و تجربه‌ای لطیف‌تر.", body: 65, acidity: 75, aroma: 90, arabica: "70%", robusta: "30%" },
  { id: "100%", label: "۱۰۰٪ عربیکا", title: "خالص و اصیل", description: "۱۰۰٪ عربیکا؛ عطری پیچیده‌تر و طعمی ظریف و خاص.", body: 55, acidity: 90, aroma: 95, arabica: "100%", robusta: "0%" },
];

const navLinks = [
  ["خانه", "#home"],
  ["پیشنهاد ویژه", "#featured"],
  ["منو", "#menu"],
  ["ترکیب قهوه", "#blend"],
  ["درباره ما", "#about"],
  ["تماس", "#contact"],
];

const sections = categories.filter((c) => c.id !== "all");

const chapterNote: Record<string, string> = {
  coffee: "اسپرسو، شیر و دانه‌های تازه",
  drinks: "دمنوش، آب‌میوه و نوشیدنی‌های خنک",
  desserts: "شیرینی‌های دست‌ساز برای بعد از قهوه",
  food: "سبک و سیر، برای هر ساعت از روز",
};

const chapterLatin: Record<string, string> = {
  coffee: "Coffee",
  drinks: "Refreshers",
  desserts: "Desserts",
  food: "Kitchen",
};

const EASE = [0.22, 1, 0.36, 1] as const;
const fa = (n: number) => n.toLocaleString("fa-IR");
const large = (src: string) => src.replace("w=500", "w=900");

/* ─────────────────────── Small pieces ─────────────────────── */

function Logo({ light = false }: { light?: boolean }) {
  return (
    <a href="#home" className="flex items-baseline gap-1.5" aria-label="Afroumarket">
      <span
        className={`font-brand text-[21px] font-semibold tracking-wide ${
          light ? "text-white" : "text-[#1D4D3F]"
        }`}
      >
        Afroumarket
      </span>
      <span className="h-1 w-1 rounded-full bg-[#CD9E6A]" />
    </a>
  );
}

/** the arch (طاق) — the shape this whole page is built around */
function ArchMark({ className = "" }: { className?: string }) {
  return (
    <svg
      aria-hidden
      width="26"
      height="34"
      viewBox="0 0 26 34"
      fill="none"
      className={className}
    >
      <path d="M2 33V13a11 11 0 0 1 22 0v20" stroke="#CD9E6A" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function MenuCard({ item }: { item: Item }) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: 0.8, ease: EASE }}
      className="group relative"
    >
      {/* soft square */}
      <div className="relative aspect-square overflow-hidden rounded-[40px] bg-[#F5F2ED]">
        <img
          src={large(item.image)}
          alt={item.name}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-[1400ms] ease-out group-hover:scale-[1.06]"
        />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#0F2A22]/45 via-transparent to-transparent" />

        {item.tag && (
          <span
            className={`absolute right-4 top-4 rounded-full px-3.5 py-1.5 text-[11px] font-bold backdrop-blur-md ${
              item.tag === "پرفروش" ? "bg-[#CD9E6A] text-white" : "bg-white/90 text-[#1D4D3F]"
            }`}
          >
            {item.tag}
          </span>
        )}
      </div>

      {/* gold outline, one step out */}
      <div className="pointer-events-none absolute -inset-2 rounded-[48px] border border-[#CD9E6A]/30 transition-colors duration-700 group-hover:border-[#CD9E6A]/70" />

      {/* glass label */}
      <div className="absolute inset-x-3 bottom-3 rounded-[28px] bg-[#FCF8F1]/90 p-5 shadow-[0_18px_40px_-20px_rgba(15,42,34,0.5)] ring-1 ring-[#E8D5BC]/70 backdrop-blur-xl sm:p-6">
        <div className="flex items-baseline justify-between gap-4">
          <h3 className="text-lg font-bold text-[#1D4D3F] sm:text-xl">{item.name}</h3>
          <div className="flex shrink-0 items-baseline gap-1">
            <span className="text-lg font-extrabold text-[#A07840] sm:text-xl">{item.price}</span>
            <span className="text-[10px] text-[#1D4D3F]/45">تومان</span>
          </div>
        </div>
        <p className="mt-2 line-clamp-2 text-xs leading-6 text-[#1D4D3F]/55 sm:text-[13px]">
          {item.desc}
        </p>
      </div>
    </motion.article>
  );
}

function CoffeeBlendSelector() {
  const [selected, setSelected] = useState("70/30");
  const active = coffeeBlends.find((b) => b.id === selected) ?? coffeeBlends[1];

  return (
    <section id="blend" className="px-5 md:px-8">
      <div className="relative mx-auto max-w-6xl overflow-hidden rounded-[36px] bg-[#1D4D3F] px-6 py-16 md:px-16 md:py-24">
        <div className="pointer-events-none absolute -left-24 -top-24 h-80 w-80 rounded-full bg-[#CD9E6A]/[0.12] blur-[90px]" />

        <div className="relative mx-auto max-w-3xl">
          <div className="mb-12 text-center">
            <h2 className="text-3xl font-light text-white md:text-5xl">ترکیب قهوه‌ات را انتخاب کن</h2>
            <p className="mt-4 text-sm text-white/50">هر ترکیب، تجربه‌ای متفاوت از طعم و عطر</p>
          </div>

          <div className="mx-auto grid max-w-xl grid-cols-3 border-b border-white/15">
            {coffeeBlends.map((blend) => (
              <button
                key={blend.id}
                onClick={() => setSelected(blend.id)}
                className={`relative py-4 text-sm transition-colors duration-300 ${
                  selected === blend.id ? "font-bold text-white" : "text-white/45 hover:text-white/80"
                }`}
              >
                {blend.label}
                {selected === blend.id && (
                  <motion.span
                    layoutId="blendUnderline"
                    className="absolute inset-x-6 -bottom-px h-[2px] bg-[#CD9E6A]"
                    transition={{ type: "spring", stiffness: 380, damping: 32 }}
                  />
                )}
              </button>
            ))}
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={active.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.3, ease: EASE }}
              className="mx-auto mt-12 grid max-w-xl gap-10 md:grid-cols-2 md:gap-14"
            >
              <div>
                <h3 className="text-xl font-bold text-white">{active.title}</h3>
                <p className="mt-3 text-sm leading-8 text-white/55">{active.description}</p>
                <div className="mt-6 flex gap-10">
                  <div>
                    <p className="text-xs text-white/40">عربیکا</p>
                    <p className="mt-1 text-2xl font-light text-[#CD9E6A]" dir="ltr">{active.arabica}</p>
                  </div>
                  <div>
                    <p className="text-xs text-white/40">روبوستا</p>
                    <p className="mt-1 text-2xl font-light text-[#CD9E6A]" dir="ltr">{active.robusta}</p>
                  </div>
                </div>
              </div>

              <div className="space-y-6 self-center">
                {[
                  { label: "بدنه", value: active.body },
                  { label: "اسیدیته", value: active.acidity },
                  { label: "عطر", value: active.aroma },
                ].map((row) => (
                  <div key={row.label}>
                    <div className="mb-2 flex justify-between text-xs">
                      <span className="text-white/70">{row.label}</span>
                      <span className="text-[#CD9E6A]">{row.value}%</span>
                    </div>
                    <div className="h-px bg-white/15">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${row.value}%` }}
                        transition={{ duration: 0.8, ease: EASE }}
                        className="h-[2px] -translate-y-px rounded-full bg-[#CD9E6A]"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}

function BackToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 400);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <motion.button
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 16 }}
          transition={{ duration: 0.25 }}
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          aria-label="بازگشت به بالای صفحه"
          className="fixed bottom-6 left-6 z-[80] flex h-11 w-11 items-center justify-center rounded-full bg-[#1D4D3F] text-white shadow-lg shadow-[#1D4D3F]/20 transition hover:bg-[#14382E] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#CD9E6A]"
        >
          <ArrowUp size={18} strokeWidth={1.8} />
        </motion.button>
      )}
    </AnimatePresence>
  );
}

/* ─────────────────────── Special offer slider ─────────────────────── */

const offerItems = items.filter((i) => i.tag === "پرفروش");
const SLIDE_MS = 5500;

function SpecialOffer({ onSeeInMenu }: { onSeeInMenu: (category: string) => void }) {
  const reduce = useReducedMotion();
  const [index, setIndex] = useState(0);
  const item = offerItems[index];
  const categoryLabel = categories.find((c) => c.id === item.category)?.label;

  /* auto-advance; restarts whenever the slide changes (also after a manual click) */
  useEffect(() => {
    if (reduce) return;
    const t = setTimeout(() => setIndex((i) => (i + 1) % offerItems.length), SLIDE_MS);
    return () => clearTimeout(t);
  }, [index, reduce]);

  return (
    <section id="featured" aria-label="پیشنهاد ویژه" className="px-5 md:px-8">
      <div className="relative mx-auto max-w-5xl">
        <div className="relative overflow-hidden rounded-[36px] bg-[#1D4D3F] p-2.5 shadow-[0_30px_60px_-35px_rgba(29,77,63,0.6)] md:p-3">
          <div className="pointer-events-none absolute -right-20 -top-24 h-64 w-64 rounded-full bg-[#CD9E6A]/[0.15] blur-[80px]" />

          <div className="relative grid gap-2.5 md:grid-cols-[1fr_280px] md:gap-5 lg:grid-cols-[1fr_320px]">
            {/* text */}
            <div className="flex flex-col justify-between gap-5 p-4 md:min-h-[210px] md:py-5 md:pr-7">
              <AnimatePresence mode="wait" initial={false}>
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.45, ease: EASE }}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-bold text-[#CD9E6A]">پیشنهاد ویژه</span>
                    <span className="h-px w-8 bg-[#CD9E6A]/50" />
                    <span className="text-xs text-white/45">{categoryLabel}</span>
                  </div>
                  <h2 className="mt-3 text-3xl font-light leading-snug text-white md:text-4xl">
                    {item.name}
                  </h2>
                  <p className="mt-2 line-clamp-2 max-w-sm text-[13px] leading-7 text-white/55">
                    {item.desc}
                  </p>
                </motion.div>
              </AnimatePresence>

              <div className="flex flex-wrap items-center justify-between gap-x-6 gap-y-1">
                <div className="flex items-center gap-5">
                  <div className="flex items-baseline gap-1.5">
                    <AnimatePresence mode="wait" initial={false}>
                      <motion.span
                        key={item.id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="text-2xl font-light text-[#CD9E6A]"
                      >
                        {item.price}
                      </motion.span>
                    </AnimatePresence>
                    <span className="text-[11px] text-white/40">تومان</span>
                  </div>
                  <button
                    onClick={() => onSeeInMenu(item.category)}
                    className="group flex items-center gap-2 rounded-full bg-[#CD9E6A] px-5 py-2.5 text-xs font-bold text-[#14382E] transition hover:bg-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                  >
                    دیدن در منو
                    <ArrowLeft size={14} className="transition-transform group-hover:-translate-x-1" />
                  </button>
                </div>

                <div className="flex items-center gap-2" role="group" aria-label="انتخاب پیشنهاد">
                  {offerItems.map((o, i) => (
                    <button
                      key={o.id}
                      onClick={() => setIndex(i)}
                      aria-label={o.name}
                      aria-current={i === index}
                      className="flex items-center py-3"
                    >
                      <span
                        className={`relative block h-1 overflow-hidden rounded-full bg-white/20 transition-all duration-500 ${
                          i === index ? "w-10" : "w-4"
                        }`}
                      >
                        {i === index &&
                          (reduce ? (
                            <span className="absolute inset-0 bg-[#CD9E6A]" />
                          ) : (
                            <motion.span
                              key={index}
                              initial={{ width: 0 }}
                              animate={{ width: "100%" }}
                              transition={{ duration: SLIDE_MS / 1000, ease: "linear" }}
                              className="absolute inset-y-0 right-0 bg-[#CD9E6A]"
                            />
                          ))}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* image */}
            <div className="relative order-first aspect-[16/9] overflow-hidden rounded-[26px] bg-[#14382E] md:order-none md:aspect-auto md:min-h-[210px]">
              <AnimatePresence initial={false}>
                <motion.img
                  key={item.id}
                  src={large(item.image)}
                  alt={item.name}
                  initial={{ opacity: 0, scale: 1.08 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.9, ease: EASE }}
                  className="absolute inset-0 h-full w-full object-cover"
                />
              </AnimatePresence>
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#0F2A22]/35 via-transparent to-transparent" />
              <span className="absolute right-3.5 top-3.5 rounded-full bg-[#CD9E6A] px-3 py-1 text-[10px] font-bold text-white">
                پرفروش
              </span>
            </div>
          </div>
        </div>

        <div className="pointer-events-none absolute -inset-2 rounded-[44px] border border-[#CD9E6A]/30" />
      </div>
    </section>
  );
}

/* ─────────────────────── Main Page ─────────────────────── */

const heroArches = [
  {
    src: "https://images.unsplash.com/photo-1572442388796-11668a67e53d?w=800&q=85",
    alt: "Cappuccino",
    size: "w-[27vw] max-w-[230px] aspect-[2/3]",
    delay: 0.3,
  },
  {
    src: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=900&q=85",
    alt: "Coffee",
    size: "w-[35vw] max-w-[290px] aspect-[2/3.5]",
    delay: 0.1,
  },
  {
    src: "https://images.unsplash.com/photo-1533134242443-d4fd215305ad?w=800&q=85",
    alt: "Cheesecake",
    size: "w-[27vw] max-w-[230px] aspect-[2/3]",
    delay: 0.5,
  },
];

export default function Home() {
  const [mobileMenu, setMobileMenu] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeCat, setActiveCat] = useState(sections[0].id);
  const shouldReduceMotion = useReducedMotion();
  const tabRefs = useRef<Record<string, HTMLButtonElement | null>>({});

  /* always start at the very top after a refresh */
  useEffect(() => {
    if ("scrollRestoration" in window.history) {
      window.history.scrollRestoration = "manual";
    }
    window.scrollTo(0, 0);
    const reset = () => window.scrollTo(0, 0);
    window.addEventListener("beforeunload", reset);
    return () => window.removeEventListener("beforeunload", reset);
  }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  /* scroll-spy: highlight the chapter currently on screen */
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setActiveCat(e.target.getAttribute("data-cat") ?? sections[0].id);
        });
      },
      { rootMargin: "-30% 0px -60% 0px" },
    );
    sections.forEach((c) => {
      const el = document.getElementById(`cat-${c.id}`);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    tabRefs.current[activeCat]?.scrollIntoView({
      inline: "center",
      block: "nearest",
      behavior: shouldReduceMotion ? "auto" : "smooth",
    });
  }, [activeCat, shouldReduceMotion]);

  const byCategory = useMemo(() => {
    const map: Record<string, Item[]> = {};
    items.forEach((i) => (map[i.category] = [...(map[i.category] ?? []), i]));
    return map;
  }, []);

  const goTo = (id: string) =>
    document
      .getElementById(`cat-${id}`)
      ?.scrollIntoView({ behavior: shouldReduceMotion ? "auto" : "smooth" });

  const scrollToMenu = () =>
    document
      .getElementById("menu")
      ?.scrollIntoView({ behavior: shouldReduceMotion ? "auto" : "smooth" });

  const heroIn = (delay: number) => ({
    initial: shouldReduceMotion ? false : { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.9, delay, ease: EASE },
  });

  return (
    <main id="home" dir="rtl" className="relative isolate min-h-screen overflow-x-clip text-[#1D4D3F]">
      {/* ───────────── BACKGROUND: quiet warm cream + paper grain ───────────── */}
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 -z-20"
        style={{
          backgroundColor: "#FAF8F3",
          backgroundImage:
            "radial-gradient(70% 40% at 50% 0%, rgba(232,213,188,0.35), transparent 75%), linear-gradient(180deg, #FBFAF7 0%, #F8F5EE 100%)",
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 -z-10 opacity-[0.07] mix-blend-multiply"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='180' height='180'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 0.11 0 0 0 0 0.30 0 0 0 0 0.25 0 0 0 0.9 0'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>\")",
        }}
      />

      {/* ───────────── HEADER ───────────── */}
      <header
        className={`fixed inset-x-0 top-0 z-50 border-b transition-colors duration-500 ${
          scrolled || mobileMenu
            ? "border-[#1D4D3F]/[0.07] bg-[#FBFAF7]/85 backdrop-blur-xl"
            : "border-transparent bg-transparent"
        }`}
      >
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5 md:px-8">
          <Logo />
          <nav className="hidden items-center gap-9 text-[13px] text-[#1D4D3F]/60 md:flex">
            {navLinks.map(([label, href]) => (
              <a key={href} href={href} className="transition hover:text-[#1D4D3F]">
                {label}
              </a>
            ))}
          </nav>
          <div className="flex items-center gap-2">
            <a
              href="#contact"
              className="hidden rounded-full bg-[#1D4D3F] px-5 py-2.5 text-xs font-bold text-white transition hover:bg-[#14382E] sm:block"
            >
              سفارش و رزرو
            </a>
            <button
              onClick={() => setMobileMenu(!mobileMenu)}
              aria-label="باز کردن منو"
              className="flex h-10 w-10 items-center justify-center rounded-full text-[#1D4D3F] md:hidden"
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
              className="overflow-hidden md:hidden"
            >
              <div className="flex flex-col px-6 pb-3 text-sm">
                {navLinks.map(([label, href]) => (
                  <a
                    key={href}
                    href={href}
                    onClick={() => setMobileMenu(false)}
                    className="border-b border-[#1D4D3F]/[0.06] py-4 text-[#1D4D3F]/70 last:border-0"
                  >
                    {label}
                  </a>
                ))}
              </div>
            </motion.nav>
          )}
        </AnimatePresence>
      </header>

      {/* ───────────── HERO ───────────── */}
      <section className="px-5 pb-20 pt-32 text-center md:px-8 md:pb-24 md:pt-40">
        <div className="mx-auto max-w-6xl">
          <motion.p {...heroIn(0)} className="font-brand text-sm italic text-[#A07840]">
            Afroumarket Café
          </motion.p>
          <motion.h1
            {...heroIn(0.1)}
            className="mt-6 text-5xl font-light leading-[1.3] text-[#1D4D3F] md:text-8xl"
          >
            طعم لحظه‌های
            <br />
            ماندگار
          </motion.h1>
          <motion.p
            {...heroIn(0.2)}
            className="mx-auto mt-7 max-w-sm text-sm leading-9 text-[#1D4D3F]/55 md:text-base"
          >
            جایی برای مکث کردن و لذت بردن؛ از عطر قهوه تازه تا طعم دسرهای دست‌ساز.
          </motion.p>
          <motion.div {...heroIn(0.3)} className="mt-9 flex items-center justify-center gap-7">
            <button
              onClick={scrollToMenu}
              className="group flex items-center gap-3 rounded-full bg-[#1D4D3F] px-8 py-4 text-sm font-bold text-white transition hover:bg-[#14382E] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#CD9E6A]"
            >
              مشاهده منو
              <ArrowLeft size={16} className="transition-transform group-hover:-translate-x-1" />
            </button>
            <a
              href="#about"
              className="border-b border-[#CD9E6A] pb-1 text-sm text-[#1D4D3F]/70 transition hover:text-[#1D4D3F]"
            >
              داستان ما
            </a>
          </motion.div>

          {/* three arches */}
          <div className="mt-16 md:mt-24">
            <div className="flex items-end justify-center gap-4 md:gap-8">
              {heroArches.map((arch) => (
                <motion.div
                  key={arch.alt}
                  initial={shouldReduceMotion ? false : { opacity: 0, y: 70 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 1.2, delay: arch.delay, ease: EASE }}
                  className={`relative ${arch.size}`}
                >
                  <div className="h-full w-full overflow-hidden rounded-t-[999px] rounded-b-[20px] bg-[#EDE7DE]">
                    <img src={arch.src} alt={arch.alt} className="h-full w-full object-cover" />
                  </div>
                  <div className="pointer-events-none absolute -inset-2 rounded-t-[999px] rounded-b-[26px] border border-[#CD9E6A]/40" />
                </motion.div>
              ))}
            </div>
            <div className="mx-auto mt-4 h-px w-full max-w-4xl bg-gradient-to-r from-transparent via-[#CD9E6A]/60 to-transparent" />
          </div>
        </div>
      </section>

      {/* ───────────── SPECIAL OFFER (slider) ───────────── */}
      <SpecialOffer onSeeInMenu={goTo} />

      {/* ───────────── MENU ───────────── */}
      <section id="menu" className="px-5 pb-28 pt-20 md:px-8 md:pb-40 md:pt-28">
        <div className="mx-auto max-w-6xl">
          <div className="mb-10 text-center">
            <ArchMark className="mx-auto mb-6" />
            <h2 className="text-5xl font-light text-[#1D4D3F] md:text-7xl">منوی کافه</h2>
            <p className="mx-auto mt-5 max-w-sm text-sm leading-8 text-[#1D4D3F]/50">
              از قهوه‌های خوش‌عطر تا دسرهای دست‌ساز؛ انتخابی برای هر سلیقه.
            </p>
          </div>

          {/* sticky dock */}
          <div className="sticky top-[76px] z-40 mb-14 flex justify-center">
            <div className="max-w-full overflow-x-auto rounded-full bg-[#1D4D3F] p-1.5 shadow-[0_16px_38px_-14px_rgba(29,77,63,0.6)] ring-1 ring-[#CD9E6A]/30 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
              <div className="flex items-center gap-1">
                {sections.map((c) => (
                  <button
                    key={c.id}
                    ref={(el) => {
                      tabRefs.current[c.id] = el;
                    }}
                    onClick={() => goTo(c.id)}
                    className={`relative isolate shrink-0 rounded-full px-6 py-2.5 text-[13px] transition-colors duration-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#CD9E6A] ${
                      activeCat === c.id ? "font-bold text-[#1D4D3F]" : "text-white/70 hover:text-white"
                    }`}
                  >
                    {activeCat === c.id && (
                      <motion.span
                        layoutId="dockPill"
                        className="absolute inset-0 -z-10 rounded-full bg-[#F5F2ED]"
                        transition={{ type: "spring", stiffness: 380, damping: 32 }}
                      />
                    )}
                    {c.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* chapters */}
          {sections.map((c) => {
            const list = byCategory[c.id] ?? [];
            return (
              <div key={c.id} id={`cat-${c.id}`} data-cat={c.id} className="scroll-mt-8 pb-24 last:pb-0">
                <div className="mb-12 flex items-end justify-between gap-6 border-b border-[#E8D5BC] pb-7">
                  <div>
                    <p className="font-brand text-lg italic text-[#A07840]">{chapterLatin[c.id]}</p>
                    <h3 className="mt-1 text-5xl font-light text-[#1D4D3F] md:text-7xl">{c.label}</h3>
                    <p className="mt-4 text-sm text-[#1D4D3F]/50">{chapterNote[c.id]}</p>
                  </div>
                  <span className="shrink-0 pb-1 text-xs text-[#A07840]">{fa(list.length)} مورد</span>
                </div>

                <div className="grid grid-cols-1 gap-x-8 gap-y-12 px-2 md:grid-cols-2 lg:grid-cols-3">
                  {list.map((item) => (
                    <MenuCard key={item.id} item={item} />
                  ))}
                </div>
              </div>
            );
          })}

          <p className="mt-16 text-center text-[11px] text-[#1D4D3F]/35">
            قیمت‌ها به تومان هستند و ممکن است با تغییر فصل به‌روزرسانی شوند.
          </p>
        </div>
      </section>

      {/* ───────────── BLEND ───────────── */}
      <div className="pb-28 md:pb-40">
        <CoffeeBlendSelector />
      </div>

      {/* ───────────── ABOUT ───────────── */}
      <section id="about" className="px-5 pb-28 md:px-8 md:pb-40">
        <div className="mx-auto grid max-w-6xl items-center gap-16 lg:grid-cols-2 lg:gap-24">
          <div className="relative mx-auto w-full max-w-sm lg:max-w-md">
            <div className="aspect-[3/4] overflow-hidden rounded-t-[999px] rounded-b-[36px] bg-[#F5F2ED]">
              <img
                src="https://images.unsplash.com/photo-1445116572660-236099ec97a0?w=900&q=85"
                alt="Cafe interior"
                className="h-full w-full object-cover"
              />
            </div>
            <div className="pointer-events-none absolute -inset-2 rounded-t-[999px] rounded-b-[44px] border border-[#CD9E6A]/35" />
            <img
              src="https://images.unsplash.com/photo-1442512595331-e89e73853f31?w=500&q=85"
              alt="Coffee preparation"
              className="absolute -bottom-8 -left-5 h-44 w-32 rounded-t-[999px] rounded-b-[20px] border-[6px] border-[#FBFAF7] object-cover md:-left-10 md:h-56 md:w-40"
            />
          </div>

          <div>
            <ArchMark className="mb-6" />
            <h2 className="text-4xl font-light leading-[1.4] text-[#1D4D3F] md:text-6xl">
              بیشتر از یک کافه،
              <br />
              یک حس خوب
            </h2>
            <p className="mt-8 max-w-md text-sm leading-9 text-[#1D4D3F]/55">
              افرومارکت جایی است برای طعم‌های دوست‌داشتنی، دیدارهای صمیمی و لحظه‌هایی که
              دوست داریم کمی طولانی‌تر شوند. ما به کیفیت مواد اولیه، تازگی و جزئیات اهمیت
              می‌دهیم.
            </p>
          </div>
        </div>
      </section>

      {/* ───────────── CONTACT (a doorway) ───────────── */}
      <section id="contact" className="px-5 pb-28 md:px-8 md:pb-36">
        <div className="relative mx-auto max-w-xl overflow-hidden rounded-t-[999px] rounded-b-[44px] bg-[#1D4D3F] px-7 pb-16 pt-44 text-center md:px-14 md:pt-56">
          <div className="pointer-events-none absolute inset-3 rounded-t-[999px] rounded-b-[34px] border border-[#CD9E6A]/30" />
          <div className="pointer-events-none absolute -top-20 left-1/2 h-72 w-72 -translate-x-1/2 rounded-full bg-[#CD9E6A]/[0.14] blur-[80px]" />

          <div className="relative">
            <h2 className="text-3xl font-light leading-[1.45] text-white md:text-5xl">
              آماده یک تجربه
              <br />
              خوشمزه هستید؟
            </h2>
            <p className="mx-auto mt-5 max-w-xs text-sm leading-8 text-white/55">
              برای رزرو میز، سفارش یا دریافت اطلاعات بیشتر با ما در ارتباط باشید.
            </p>
            <div className="mt-9 flex flex-wrap justify-center gap-3">
              <a
                href="tel:02112345678"
                className="flex items-center gap-3 rounded-full bg-[#CD9E6A] px-7 py-4 text-sm font-bold text-[#14382E] transition hover:bg-white"
              >
                <Phone size={16} />
                تماس با ما
              </a>
              <a
                href="https://instagram.com/"
                target="_blank"
                rel="noreferrer"
                className="rounded-full border border-white/25 px-7 py-4 text-sm font-bold text-white transition hover:bg-white/10"
              >
                اینستاگرام
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ───────────── FOOTER ───────────── */}
      <footer className="border-t border-[#E8D5BC]/80 px-5 py-10 md:px-8">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-6 md:flex-row">
          <Logo />
          <div className="flex gap-8 text-xs text-[#1D4D3F]/55">
            <a href="#home" className="transition hover:text-[#1D4D3F]">خانه</a>
            <a href="#menu" className="transition hover:text-[#1D4D3F]">منو</a>
            <a href="#about" className="transition hover:text-[#1D4D3F]">درباره ما</a>
            <a href="#contact" className="transition hover:text-[#1D4D3F]">تماس</a>
          </div>
          <p className="text-[11px] text-[#1D4D3F]/35">Afroumarket © ۱۴۰۵</p>
        </div>
      </footer>

      <BackToTop />
    </main>
  );
}