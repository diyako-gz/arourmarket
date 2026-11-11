"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import type { ReactNode } from "react";
import {
  ArrowUp,
  Beef,
  Bookmark,
  ChevronDown,
  ChevronLeft,
  ChevronUp,
  Clock3,
  Coffee,
  Cookie,
  CupSoda,
  GlassWater,
  Grid2X2,
  Info,
  Leaf,
  LayoutDashboard,
  List,
  MapPin,
  Phone,
  Pizza,
  Rows3,
  Salad,
  Search,
  Send,
  Soup,
  Utensils,
  X,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { categories, menuItems, type MenuItem } from "@/data/menu";

/*
  palette
  cream page  #EBE4D6 · surface #FAFAF8 · soft #F5F2ED / #EDE7DE · line #E8D5BC
  brown (buttons) #A07840 · gold #CD9E6A · ink green (text only) #14382E
*/

/* ───────────── types, data & helpers ───────────── */

type Tab = "menu" | "saved" | "cafe";
type ViewMode = "large" | "grid" | "list" | "mosaic";

const HEADER_OFFSET = 84;

const GRAIN = `url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='160' height='160'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='.8' numOctaves='2' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 .06 0'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>")`;

const norm = (s: string) => s.replace(/[\u200c\s]/g, "");

const iconMap: Record<string, LucideIcon> = {
  پیشغذا: Utensils,
  سالاد: Salad,
  پاستا: Soup,
  غذایاصلی: Beef,
  پیتزا: Pizza,
  عصرانه: Cookie,
  اسپرسوبار: Coffee,
  نوشیدنیگرم: Coffee,
  سردکافئیندار: CupSoda,
  شیکواسموتی: GlassWater,
  دمیبار: Leaf,
};

const iconFor = (name: string): LucideIcon => iconMap[norm(name)] ?? Utensils;

const fa = (n: number) => new Intl.NumberFormat("fa-IR").format(n);

function formatPrice(value: string) {
  const n = Number(value);
  return Number.isFinite(n) ? fa(n) : value;
}

const realCategories = categories.filter((c) => c !== "همه");

const groups = realCategories
  .map((name) => ({
    name,
    items: menuItems.filter((item) => item.category === name),
  }))
  .filter((g) => g.items.length > 0);

const viewModes: { id: ViewMode; label: string; Icon: LucideIcon }[] = [
  { id: "large", label: "کارت بزرگ", Icon: Rows3 },
  { id: "grid", label: "دو ستونه", Icon: Grid2X2 },
  { id: "list", label: "لیست", Icon: List },
  { id: "mosaic", label: "موزاییکی", Icon: LayoutDashboard },
];

/* ───────────── page ───────────── */

export default function HomePage() {
  const [tab, setTab] = useState<Tab>("menu");
  const [saved, setSaved] = useState<number[]>([]);
  const [ready, setReady] = useState(false);
  const [query, setQuery] = useState("");
  const [searchOpen, setSearchOpen] = useState(false);
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [selectedCat, setSelectedCat] = useState<string | null>(null);
  const [panelOpen, setPanelOpen] = useState(true);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [barVisible, setBarVisible] = useState(false);
  const [showTop, setShowTop] = useState(false);

  const activeCat = selectedCat ?? "";
  const panelRef = useRef<HTMLDivElement>(null);
  const chipRefs = useRef<Record<string, HTMLButtonElement | null>>({});

  const normalizedQuery = query.trim().toLocaleLowerCase("fa");
  const searching = !!normalizedQuery;

  /* persistence */
  useEffect(() => {
    try {
      const raw = localStorage.getItem("afour_saved_items");
      if (raw) setSaved(JSON.parse(raw));
      const mode = localStorage.getItem("afour_view_mode");
      if (
        mode === "large" ||
        mode === "grid" ||
        mode === "list" ||
        mode === "mosaic"
      ) {
        setViewMode(mode);
      }
    } catch {
      setSaved([]);
    }
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    try {
      localStorage.setItem("afour_saved_items", JSON.stringify(saved));
      localStorage.setItem("afour_view_mode", viewMode);
    } catch {
      /* storage unavailable */
    }
  }, [saved, viewMode, ready]);

  /* scroll: back-to-top + floating bar visibility */
  useEffect(() => {
    let raf = 0;
    const run = () => {
      raf = 0;
      setShowTop(window.scrollY > 500);
      if (tab !== "menu") return;
      const panel = panelRef.current;
      if (panel) setBarVisible(panel.getBoundingClientRect().bottom < 70);
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(run);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    run();
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [tab]);

  /* keep the active chip centered inside the bar */
  useEffect(() => {
    if (!barVisible || searchOpen) return;
    chipRefs.current[activeCat]?.scrollIntoView({
      inline: "center",
      block: "nearest",
      behavior: "smooth",
    });
  }, [activeCat, barVisible, searchOpen]);

  /* lock page scroll while the category sheet is open */
  useEffect(() => {
    document.body.style.overflow = sheetOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [sheetOpen]);

  /* data */
  const searchResults = useMemo(
    () =>
      menuItems.filter((item) =>
        `${item.title} ${item.description} ${item.category}`
          .toLocaleLowerCase("fa")
          .includes(normalizedQuery),
      ),
    [normalizedQuery],
  );

  const savedItems = useMemo(
    () =>
      menuItems.filter(
        (item) =>
          saved.includes(item.id) &&
          (!normalizedQuery ||
            `${item.title} ${item.description} ${item.category}`
              .toLocaleLowerCase("fa")
              .includes(normalizedQuery)),
      ),
    [saved, normalizedQuery],
  );

  const toggleSaved = (id: number) => {
    setSaved((cur) =>
      cur.includes(id) ? cur.filter((x) => x !== id) : [...cur, id],
    );
  };

  /* navigation */
  const changeTab = (next: Tab) => {
    setTab(next);
    setQuery("");
    setSearchOpen(false);
    setSheetOpen(false);
    setSelectedCat(null);
    setPanelOpen(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const scrollToMenu = () => {
    const el = document.getElementById("menu-start");
    if (el) window.scrollTo({ top: el.offsetTop - 8, behavior: "smooth" });
  };

  const goToCategory = (name: string) => {
    setSheetOpen(false);
    setSelectedCat(name);
    setPanelOpen(false);
    if (searching) {
      setQuery("");
      setSearchOpen(false);
    }
    window.setTimeout(() => {
      const el = document.getElementById("items-start");
      if (!el) return;
      window.scrollTo({
        top: el.getBoundingClientRect().top + window.scrollY - HEADER_OFFSET,
        behavior: "smooth",
      });
    }, 540);
  };

  const closeSearch = () => {
    setQuery("");
    setSearchOpen(false);
  };

  const barOn = tab === "menu" && (barVisible || searchOpen);

  return (
    <main dir="rtl" className="min-h-[100svh] bg-[#DCD2BD] text-[#14382E]">
      <div className="relative mx-auto min-h-[100svh] w-full max-w-[600px] overflow-x-clip bg-[#EBE4D6] shadow-[0_0_80px_rgba(60,40,15,0.28)]">
        {/* ───────── floating category bar ───────── */}
        <div
          style={{ top: "max(env(safe-area-inset-top), 10px)" }}
          className={`fixed left-1/2 z-50 w-[calc(100%-20px)] max-w-[580px] -translate-x-1/2 transition-all duration-300 ${
            barOn
              ? "translate-y-0 opacity-100"
              : "pointer-events-none -translate-y-6 opacity-0"
          }`}
        >
          <div className="flex items-center gap-2 rounded-full border border-white/70 bg-[#FAFAF8]/85 p-1.5 shadow-[0_14px_40px_rgba(60,40,15,0.22)] backdrop-blur-2xl backdrop-saturate-150">
            {searchOpen ? (
              <>
                <SearchField
                  value={query}
                  onChange={setQuery}
                  autoFocus
                  className="flex-1"
                />
                <button
                  type="button"
                  onClick={closeSearch}
                  aria-label="بستن جست‌وجو"
                  className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-[#A07840] text-white transition active:scale-95"
                >
                  <X size={18} />
                </button>
              </>
            ) : (
              <>
                <button
                  type="button"
                  onClick={() => setSheetOpen(true)}
                  aria-label="باز کردن دسته‌بندی‌ها"
                  className="flex h-11 shrink-0 items-center gap-2 rounded-full bg-[#EDE7DE] px-3.5 text-[12px] font-bold text-[#14382E] transition active:scale-95"
                >
                  دسته‌بندی‌ها
                  <Grid2X2 size={16} className="text-[#A07840]" />
                </button>

                <div className="no-scrollbar flex min-w-0 flex-1 items-center gap-1.5 overflow-x-auto">
                  {groups.map((g) => {
                    const Icon = iconFor(g.name);
                    const active = activeCat === g.name;
                    return (
                      <button
                        key={g.name}
                        type="button"
                        ref={(el) => {
                          chipRefs.current[g.name] = el;
                        }}
                        onClick={() => goToCategory(g.name)}
                        aria-pressed={active}
                        className={`flex h-11 shrink-0 items-center gap-2 rounded-full px-3.5 text-[12px] font-bold transition-all duration-300 ${
                          active
                            ? "bg-[#A07840] text-white shadow-[0_6px_16px_rgba(160,120,64,0.4)]"
                            : "text-[#14382E]/70 active:bg-black/5"
                        }`}
                      >
                        <Icon
                          size={16}
                          strokeWidth={1.8}
                          className={active ? "" : "text-[#A07840]"}
                        />
                        <span className="whitespace-nowrap">{g.name}</span>
                      </button>
                    );
                  })}
                </div>

                <button
                  type="button"
                  onClick={() => setSearchOpen(true)}
                  aria-label="جست‌وجو"
                  className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-[#EDE7DE] text-[#A07840] transition active:scale-95"
                >
                  <Search size={18} />
                </button>
              </>
            )}
          </div>
        </div>

        {/* ───────── category sheet ───────── */}
        {sheetOpen && (
          <div
            className="fixed inset-0 z-[70] flex justify-center bg-[#1c140b]/55 backdrop-blur-sm"
            onClick={() => setSheetOpen(false)}
          >
            <div
              role="dialog"
              aria-label="دسته‌بندی‌ها"
              onClick={(e) => e.stopPropagation()}
              style={{ marginTop: "max(env(safe-area-inset-top), 12px)" }}
              className="fade-in h-fit max-h-[85svh] w-[calc(100%-24px)] max-w-[576px] overflow-y-auto rounded-[30px] border border-[#E8D5BC] bg-[#FAFAF8] p-5 shadow-[0_24px_60px_rgba(0,0,0,0.35)]"
            >
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-[19px] font-bold tracking-tight">
                  دسته‌بندی‌ها
                </h2>
                <button
                  type="button"
                  onClick={() => setSheetOpen(false)}
                  aria-label="بستن"
                  className="grid h-11 w-11 place-items-center rounded-full bg-[#A07840] text-white"
                >
                  <X size={18} />
                </button>
              </div>
              <CategoryTiles active={activeCat} onPick={goToCategory} />
            </div>
          </div>
        )}

        {/* ───────── MENU TAB ───────── */}
        {tab === "menu" && (
          <>
            {/* cover */}

            <section className="relative flex min-h-[100svh] flex-col overflow-hidden px-4 pb-[calc(env(safe-area-inset-bottom)+120px)] pt-[max(env(safe-area-inset-top),14px)] text-[#f5f2ed]">
              {/* Full Header Background */}
              <div
                className="absolute inset-0 bg-cover bg-center"
                style={{ backgroundImage: "url('/images/head-photo.jpg')" }}
              />

              {/* Cinematic Overlay */}
              <div className="absolute inset-0 bg-gradient-to-b from-[#081a14]/75 via-[#10291f]/55 to-[#081a14]/95" />

              {/* Golden Ambient Light */}
              <div className="pointer-events-none absolute -right-24 top-24 h-72 w-72 rounded-full bg-[#CD9E6A]/20 blur-[100px]" />
              <div className="pointer-events-none absolute -left-24 bottom-40 h-72 w-72 rounded-full bg-[#CD9E6A]/15 blur-[100px]" />

              {/* Grain */}
              <div
                className="pointer-events-none absolute inset-0 opacity-30"
                style={{ backgroundImage: GRAIN }}
              />

              {/* Header */}
              <header className="relative z-10 flex items-center justify-between rounded-full border border-white/20 bg-black/25 px-5 py-3 shadow-[0_8px_30px_rgba(0,0,0,0.2)] backdrop-blur-xl">
                {/* Right: Working Hours */}
                <div className="flex items-center gap-2">
                  <span className="relative flex h-2 w-2">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#CD9E6A] opacity-50" />
                    <span className="relative inline-flex h-2 w-2 rounded-full bg-[#CD9E6A]" />
                  </span>

                  <span dir="ltr" className="text-[11px] font-bold text-white">
                    17:00 – 24:00
                  </span>
                </div>

                {/* Left: Logo + Cafe Menu */}
                <div className="flex items-center gap-2.5" dir="ltr">
                  {/* <img
                    src="/images/A.Four-09.png"
                    alt="AFOUR Logo"
                    className="h-8 w-8 object-contain"
                  /> */}

                  <span className="text-[11px] font-bold uppercase tracking-[2px] text-[#f5dfba]">
                    CAFE-MENü
                  </span>
                </div>
              </header>

              {/* Main Hero */}
              <div className="relative z-10 mt-4 flex flex-1 flex-col items-center justify-center overflow-hidden rounded-[36px] border border-white/15 bg-black/10 px-6 py-12 shadow-[inset_0_1px_0_rgba(255,255,255,0.15)] backdrop-blur-[2px]">
                {/* Logo */}
                <img
                  src="/images/A.Four-09.png"
                  alt="AFOUR"
                  className="absolute left-1/2 top-1/2 z-10 w-auto max-w-none -translate-x-1/2 -translate-y-1/2 object-contain drop-shadow-[0_8px_24px_rgba(0,0,0,0.75)]"
                  style={{ width: "400px" }}
                />
              </div>

              {/* About */}
              <button
                type="button"
                onClick={() => changeTab("cafe")}
                className="relative z-10 mt-4 flex items-center gap-4 rounded-[28px] border border-white/20 bg-black/35 p-3.5 text-right shadow-[0_12px_35px_rgba(0,0,0,0.25)] backdrop-blur-xl transition active:scale-[0.99]"
              >
                <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl border border-[#CD9E6A]/30 bg-[#CD9E6A]/20 text-[#f5dba9]">
                  <Info size={20} />
                </span>

                <span className="min-w-0 flex-1">
                  <span className="block text-[14px] font-bold text-white">
                    درباره A.Four
                  </span>
                  <span className="mt-0.5 block text-[11px] font-medium text-white/80">
                    آدرس، ساعت کاری و راه‌های ارتباطی اینجاست
                  </span>
                </span>

                <ChevronLeft size={18} className="shrink-0 text-[#e6c99d]" />
              </button>

              {/* Scroll to Menu */}
              <button
                type="button"
                onClick={scrollToMenu}
                className="relative z-10 mt-8 flex flex-col items-center gap-1 text-center"
              >
                <span className="mb-1 grid h-11 w-11 place-items-center rounded-full border border-[#CD9E6A]/60 bg-black/25 shadow-lg backdrop-blur-md">
                  <ChevronUp
                    size={22}
                    className="animate-bounce text-[#f5dba9]"
                  />
                </span>

                <span className="text-[26px] font-bold tracking-tight text-white [text-shadow:0_2px_8px_rgba(0,0,0,0.9)]">
                  مشاهده منو
                </span>

                <span className="text-[12px] font-medium text-white/85 [text-shadow:0_2px_5px_rgba(0,0,0,0.9)]">
                  دسته‌ها و محصولات را در ادامه ببینید
                </span>
              </button>
            </section>

            {/* menu body (cream sheet over the cover) */}
            <div
              id="menu-start"
              className="relative -mt-8 rounded-t-[36px] bg-[#EBE4D6] px-3 pt-7"
            >
              <div
                ref={panelRef}
                className="rounded-[32px] border border-[#E8D5BC] bg-[#FAFAF8] p-5 shadow-[0_18px_50px_rgba(60,40,15,0.08)]"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-[21px] font-bold tracking-tight">
                      دسته‌بندی‌ها
                    </h2>
                    <p className="mt-0.5 text-[11px] font-light text-[#14382E]/55">
                      {fa(menuItems.length)} آیتم در {fa(groups.length)} دسته
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setSearchOpen(true)}
                    aria-label="جست‌وجو"
                    className="grid h-12 w-12 place-items-center rounded-full bg-[#A07840] text-white shadow-[0_8px_20px_rgba(160,120,64,0.35)] transition active:scale-95"
                  >
                    <Search size={20} />
                  </button>
                </div>

                <div
                  className={`grid transition-[grid-template-rows] duration-500 ease-out ${
                    panelOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
                  }`}
                >
                  <div className="overflow-hidden">
                    <div className="pt-5">
                      <CategoryTiles active={activeCat} onPick={goToCategory} />
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex flex-col items-center gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setPanelOpen((v) => !v)}
                  aria-label={
                    panelOpen ? "جمع کردن دسته‌بندی‌ها" : "نمایش دسته‌بندی‌ها"
                  }
                  aria-expanded={panelOpen}
                  className="grid h-10 w-24 place-items-center rounded-full bg-[#A07840] text-white shadow-[0_8px_20px_rgba(160,120,64,0.3)] transition active:scale-95"
                >
                  {panelOpen ? (
                    <ChevronUp size={20} />
                  ) : (
                    <ChevronDown size={20} />
                  )}
                </button>
                <span className="text-[12px] font-bold text-[#14382E]/70">
                  حالت نمایش آیتم‌ها
                </span>
                <ViewSwitch value={viewMode} onChange={setViewMode} />
              </div>

              {/* content */}
              <section className="pb-44 pt-8">
                {searching ? (
                  <div key={`s-${normalizedQuery}`}>
                    <SectionHead
                      title="نتایج جست‌وجو"
                      count={searchResults.length}
                    />
                    {searchResults.length === 0 ? (
                      <EmptyState
                        saved={false}
                        onBack={() => changeTab("menu")}
                      />
                    ) : (
                      <ItemsLayout
                        items={searchResults}
                        mode={viewMode}
                        saved={saved}
                        onToggle={toggleSaved}
                        showCategory
                      />
                    )}
                  </div>
                ) : selectedCat ? (
                  (() => {
                    const g = groups.find((x) => x.name === selectedCat);
                    if (!g) return null;
                    return (
                      <section
                        key={g.name}
                        id="items-start"
                        className="scroll-mt-[84px]"
                      >
                        <SectionHead title={g.name} count={g.items.length} />
                        <ItemsLayout
                          items={g.items}
                          mode={viewMode}
                          saved={saved}
                          onToggle={toggleSaved}
                        />
                      </section>
                    );
                  })()
                ) : (
                  <p className="py-10 text-center text-[13px] font-light text-[#14382E]/55">
                    یکی از دسته‌بندی‌ها را انتخاب کنید تا آیتم‌هایش نمایش داده
                    شود.
                  </p>
                )}

                {(searching || selectedCat) && (
                  <div className="mt-14 flex flex-col items-center">
                    <div className="mb-3 flex items-center gap-3">
                      <span className="h-px w-10 bg-[#A07840]/40" />
                      <span className="font-brand text-[20px] italic text-[#A07840]">
                        A.Four
                      </span>
                      <span className="h-px w-10 bg-[#A07840]/40" />
                    </div>
                    <p className="text-[11px] font-light text-[#14382E]/50">
                      قیمت‌ها به هزار تومان است.
                    </p>
                  </div>
                )}
              </section>
            </div>
          </>
        )}

        {/* ───────── SAVED TAB ───────── */}
        {tab === "saved" && (
          <section className="min-h-[100svh] px-3 pb-44 pt-[calc(max(env(safe-area-inset-top),14px)+16px)]">
            <SectionHead title="انتخاب‌های شما" count={savedItems.length} />
            <SearchField
              value={query}
              onChange={setQuery}
              className="mb-5 w-full"
            />
            <div className="mb-6 flex justify-center">
              <ViewSwitch value={viewMode} onChange={setViewMode} />
            </div>
            {savedItems.length === 0 ? (
              <EmptyState
                saved={saved.length === 0}
                onBack={() => changeTab("menu")}
              />
            ) : (
              <div key={`saved-${normalizedQuery}`}>
                <ItemsLayout
                  items={savedItems}
                  mode={viewMode}
                  saved={saved}
                  onToggle={toggleSaved}
                  showCategory
                />
              </div>
            )}
          </section>
        )}

        {/* ───────── ABOUT TAB ───────── */}
        {tab === "cafe" && <CafeInfo />}

        {/* ───────── back to top ───────── */}
        <button
          type="button"
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          aria-label="بازگشت به بالای صفحه"
          style={{ bottom: "calc(env(safe-area-inset-bottom) + 88px)" }}
          className={`fixed left-[max(16px,calc(50%-284px))] z-40 grid h-12 w-12 place-items-center rounded-full bg-[#A07840] text-white shadow-[0_10px_28px_rgba(60,40,15,0.35)] transition-all duration-300 active:scale-95 ${
            showTop
              ? "translate-y-0 opacity-100"
              : "pointer-events-none translate-y-4 opacity-0"
          }`}
        >
          <ArrowUp size={20} strokeWidth={2} />
        </button>

        {/* ───────── bottom navigation ───────── */}
        <nav
          style={{ bottom: "max(env(safe-area-inset-bottom), 12px)" }}
          className="fixed left-1/2 z-50 flex w-[calc(100%-24px)] max-w-[380px] -translate-x-1/2 items-center justify-between rounded-full border border-white/70 bg-[#FAFAF8]/88 p-1.5 shadow-[0_16px_44px_rgba(60,40,15,0.25)] backdrop-blur-2xl backdrop-saturate-150"
        >
          <NavButton
            active={tab === "menu"}
            label="منو"
            icon={<Utensils size={19} strokeWidth={1.8} />}
            onClick={() => changeTab("menu")}
          />
          <NavButton
            active={tab === "saved"}
            label="علاقه‌مندی‌ها"
            icon={<Bookmark size={19} strokeWidth={1.8} />}
            count={saved.length}
            onClick={() => changeTab("saved")}
          />
          <NavButton
            active={tab === "cafe"}
            label="درباره ما"
            icon={<Coffee size={19} strokeWidth={1.8} />}
            onClick={() => changeTab("cafe")}
          />
        </nav>
      </div>
    </main>
  );
}

/* ───────────── pieces ───────────── */

function CategoryTiles({
  active,
  onPick,
}: {
  active: string;
  onPick: (name: string) => void;
}) {
  return (
    <div className="grid grid-cols-3 gap-3">
      {groups.map((g) => {
        const Icon = iconFor(g.name);
        const on = active === g.name;
        return (
          <button
            key={g.name}
            type="button"
            onClick={() => onPick(g.name)}
            className={`flex min-h-[126px] flex-col items-center justify-center gap-2 rounded-[24px] border px-1.5 py-3 transition active:scale-95 ${
              on
                ? "border-[#A07840] bg-[#A07840] text-white shadow-[0_10px_24px_rgba(160,120,64,0.35)]"
                : "border-[#E8D5BC] bg-[#F5F2ED] text-[#14382E] hover:border-[#CD9E6A]"
            }`}
          >
            <span
              className={`grid h-12 w-12 place-items-center rounded-full ring-1 transition ${
                on
                  ? "bg-white/90 text-[#A07840] ring-white/60"
                  : "bg-white text-[#A07840] ring-[#E8D5BC]"
              }`}
            >
              <Icon size={24} strokeWidth={1.5} />
            </span>
            <span className="text-center text-[12.5px] font-bold leading-5">
              {g.name}
            </span>
            <span
              className={`text-[10px] font-light ${on ? "text-white/75" : "text-[#14382E]/50"}`}
            >
              {fa(g.items.length)} آیتم
            </span>
          </button>
        );
      })}
    </div>
  );
}

function ViewSwitch({
  value,
  onChange,
}: {
  value: ViewMode;
  onChange: (mode: ViewMode) => void;
}) {
  return (
    <div className="flex items-center gap-1 rounded-full bg-[#A07840] p-1.5 shadow-[0_8px_20px_rgba(160,120,64,0.3)]">
      {viewModes.map(({ id, label, Icon }) => {
        const on = value === id;
        return (
          <button
            key={id}
            type="button"
            onClick={() => onChange(id)}
            aria-label={label}
            aria-pressed={on}
            className={`grid h-11 w-12 place-items-center rounded-full transition-all duration-300 ${
              on ? "bg-[#FAFAF8] text-[#A07840]" : "text-white/80"
            }`}
          >
            <Icon size={20} strokeWidth={1.8} />
          </button>
        );
      })}
    </div>
  );
}

function SearchField({
  value,
  onChange,
  autoFocus,
  className = "",
}: {
  value: string;
  onChange: (v: string) => void;
  autoFocus?: boolean;
  className?: string;
}) {
  return (
    <label
      className={`flex h-11 items-center gap-2.5 rounded-full border border-[#E8D5BC] bg-[#FAFAF8] px-4 text-[#14382E] focus-within:border-[#A07840] ${className}`}
    >
      <Search size={17} className="shrink-0 text-[#A07840]" />
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        autoFocus={autoFocus}
        placeholder="دنبال چه طعمی می‌گردی؟"
        className="h-full min-w-0 flex-1 bg-transparent text-[13px] outline-none placeholder:font-light placeholder:text-[#14382E]/40"
      />
      {value && (
        <button
          type="button"
          onClick={() => onChange("")}
          aria-label="پاک کردن جست‌وجو"
          className="grid h-7 w-7 shrink-0 place-items-center rounded-full text-[#14382E]/60"
        >
          <X size={15} />
        </button>
      )}
    </label>
  );
}

function SectionHead({ title, count }: { title: string; count: number }) {
  return (
    <div className="mb-5 flex items-center gap-3">
      <h2 className="text-[25px] font-bold tracking-tight">{title}</h2>
      <div className="h-px flex-1 bg-gradient-to-l from-[#A07840]/50 to-transparent" />
      <span className="rounded-full border border-[#A07840]/35 bg-[#A07840]/10 px-3 py-1 text-[11px] font-medium text-[#A07840]">
        {fa(count)} آیتم
      </span>
    </div>
  );
}

function ItemsLayout({
  items,
  mode,
  saved,
  onToggle,
  showCategory,
}: {
  items: MenuItem[];
  mode: ViewMode;
  saved: number[];
  onToggle: (id: number) => void;
  showCategory?: boolean;
}) {
  const wrap =
    mode === "large"
      ? "grid grid-cols-1 gap-4"
      : mode === "list"
        ? "flex flex-col gap-3"
        : "grid grid-cols-2 gap-3";

  return (
    <div key={mode} className={wrap}>
      {items.map((item, i) => (
        <MenuCard
          key={item.id}
          item={item}
          mode={mode}
          index={i}
          wide={mode === "mosaic" && i % 3 === 0}
          saved={saved.includes(item.id)}
          onToggle={() => onToggle(item.id)}
          showCategory={showCategory}
        />
      ))}
    </div>
  );
}

function Thumb({ item }: { item: MenuItem }) {
  const [failed, setFailed] = useState(false);
  if (failed) {
    return (
      <div className="absolute inset-0 grid place-items-center bg-gradient-to-br from-[#F5F2ED] to-[#E8D5BC]">
        <Coffee size={34} strokeWidth={1} className="text-[#A07840]/50" />
      </div>
    );
  }
  return (
    <img
      src={`/images/menu/${item.id}.webp`}
      alt={item.title}
      loading="lazy"
      onError={() => setFailed(true)}
      className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
    />
  );
}

function Price({
  value,
  small,
  onPhoto,
}: {
  value: string;
  small?: boolean;
  onPhoto?: boolean;
}) {
  return (
    <div
      className={`shrink-0 text-left ${
        onPhoto
          ? "rounded-2xl bg-[#1c140b]/55 px-3 py-1.5 ring-1 ring-[#CD9E6A]/40 backdrop-blur-md"
          : ""
      }`}
    >
      <span
        className={`block font-bold tabular-nums ${small ? "text-[14px]" : "text-[17px]"} ${
          onPhoto ? "text-[#f0d4a6]" : "text-[#A07840]"
        }`}
      >
        {formatPrice(value)}
      </span>
      <span
        className={`block text-[10px] font-light ${onPhoto ? "text-white/70" : "text-[#14382E]/50"}`}
      >
        تومان
      </span>
    </div>
  );
}

function SaveButton({
  saved,
  onToggle,
  onPhoto,
  className = "",
}: {
  saved: boolean;
  onToggle: () => void;
  onPhoto?: boolean;
  className?: string;
}) {
  return (
    <button
      type="button"
      onClick={onToggle}
      aria-label={saved ? "حذف از علاقه‌مندی‌ها" : "افزودن به علاقه‌مندی‌ها"}
      aria-pressed={saved}
      className={`grid h-11 w-11 place-items-center rounded-full border transition active:scale-90 ${
        saved
          ? "border-[#A07840] bg-[#A07840] text-white shadow-[0_6px_18px_rgba(160,120,64,0.45)]"
          : onPhoto
            ? "border-white/25 bg-[#1c140b]/50 text-white backdrop-blur-xl"
            : "border-[#E8D5BC] bg-[#F5F2ED] text-[#14382E]"
      } ${className}`}
    >
      <Bookmark
        size={17}
        strokeWidth={1.8}
        fill={saved ? "currentColor" : "none"}
      />
    </button>
  );
}

function MenuCard({
  item,
  mode,
  index,
  wide,
  saved,
  onToggle,
  showCategory,
}: {
  item: MenuItem;
  mode: ViewMode;
  index: number;
  wide?: boolean;
  saved: boolean;
  onToggle: () => void;
  showCategory?: boolean;
}) {
  const enterStyle = { animationDelay: `${Math.min(index, 10) * 40}ms` };
  const desc = item.description || "یک انتخاب خوش‌طعم از منوی A.Four";

  /* list row */
  if (mode === "list") {
    return (
      <article
        style={enterStyle}
        className="fade-in group flex items-center gap-3 rounded-[26px] border border-[#E8D5BC]/70 bg-[#FAFAF8] p-2.5 shadow-[0_8px_22px_rgba(60,40,15,0.06)]"
      >
        <div className="relative h-[92px] w-[92px] shrink-0 overflow-hidden rounded-[18px] bg-[#EDE7DE]">
          <Thumb item={item} />
        </div>
        <div className="min-w-0 flex-1">
          {showCategory && (
            <span className="text-[10px] font-medium text-[#A07840]">
              {item.category}
            </span>
          )}
          <h3 className="line-clamp-1 text-[14px] font-bold leading-7">
            {item.title}
          </h3>
          <p className="line-clamp-2 text-[11px] font-light leading-5 text-[#14382E]/60">
            {desc}
          </p>
        </div>
        <div className="flex shrink-0 flex-col items-end gap-1">
          <SaveButton saved={saved} onToggle={onToggle} />
          <Price value={item.price} small />
        </div>
      </article>
    );
  }

  /* two-column grid: image on top, text below */
  if (mode === "grid") {
    return (
      <article
        style={enterStyle}
        className="fade-in group flex min-w-0 flex-col overflow-hidden rounded-[28px] border border-[#E8D5BC]/70 bg-[#FAFAF8] shadow-[0_12px_30px_rgba(60,40,15,0.09)]"
      >
        <div className="relative aspect-square overflow-hidden bg-[#EDE7DE]">
          <Thumb item={item} />
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/25 to-transparent" />
          <SaveButton
            saved={saved}
            onToggle={onToggle}
            onPhoto
            className="absolute left-2 top-2"
          />
          {showCategory && (
            <span className="absolute right-2 top-2 rounded-full bg-[#1c140b]/60 px-2.5 py-1 text-[10px] font-medium text-white backdrop-blur-md">
              {item.category}
            </span>
          )}
        </div>
        <div className="flex flex-1 flex-col p-3">
          <h3 className="line-clamp-1 text-[13.5px] font-bold leading-6">
            {item.title}
          </h3>
          <p className="mt-0.5 line-clamp-2 min-h-[40px] text-[11px] font-light leading-5 text-[#14382E]/60">
            {desc}
          </p>
          <div className="mt-2 flex items-end justify-between border-t border-[#E8D5BC]/70 pt-2.5">
            <span className="text-[10px] text-[#14382E]/45">قیمت</span>
            <Price value={item.price} small />
          </div>
        </div>
      </article>
    );
  }

  /* large + mosaic: full-bleed image with text over it */
  const large = mode === "large";
  const aspect = large
    ? "aspect-[4/3.4]"
    : wide
      ? "aspect-[16/10]"
      : "aspect-square";
  return (
    <article
      style={enterStyle}
      className={`fade-in group relative overflow-hidden rounded-[30px] bg-[#1c140b] shadow-[0_18px_40px_rgba(60,40,15,0.28)] ${
        wide ? "col-span-2" : ""
      }`}
    >
      <div className={`relative ${aspect}`}>
        <Thumb item={item} />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#150e07]/90 via-[#150e07]/20 to-transparent" />
        <SaveButton
          saved={saved}
          onToggle={onToggle}
          onPhoto
          className="absolute left-3 top-3"
        />
        {showCategory && (
          <span className="absolute right-3 top-3 rounded-full bg-[#1c140b]/60 px-2.5 py-1 text-[10px] font-medium text-white backdrop-blur-md">
            {item.category}
          </span>
        )}
        <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-3 p-4 text-white">
          <div className="min-w-0">
            <h3
              className={`line-clamp-2 font-bold leading-7 ${
                large || wide ? "text-[19px] tracking-tight" : "text-[14px]"
              }`}
            >
              {item.title}
            </h3>
            {(large || wide) && (
              <p className="mt-0.5 line-clamp-1 text-[11px] font-light text-white/70">
                {desc}
              </p>
            )}
          </div>
          <Price value={item.price} small={!large && !wide} onPhoto />
        </div>
      </div>
    </article>
  );
}

function EmptyState({ saved, onBack }: { saved: boolean; onBack: () => void }) {
  return (
    <div className="fade-in flex min-h-[300px] flex-col items-center justify-center rounded-[28px] border border-[#E8D5BC] bg-[#FAFAF8] px-6 text-center">
      <div className="grid h-16 w-16 place-items-center rounded-2xl bg-[#A07840]/12 text-[#A07840]">
        {saved ? <Bookmark size={27} /> : <Search size={27} />}
      </div>
      <h3 className="mt-5 text-[16px] font-bold">
        {saved ? "هنوز آیتمی ذخیره نکرده‌اید" : "موردی پیدا نشد"}
      </h3>
      <p className="mt-2 max-w-[250px] text-[12px] font-light leading-7 text-[#14382E]/60">
        {saved
          ? "روی نشانک هر آیتم بزنید تا اینجا نگهش داریم."
          : "عبارت دیگری را جست‌وجو کنید یا از دسته‌بندی‌ها انتخاب کنید."}
      </p>
      {saved && (
        <button
          type="button"
          onClick={onBack}
          className="mt-5 flex items-center gap-2 rounded-full bg-[#A07840] px-6 py-3 text-[12px] font-bold text-white"
        >
          مشاهده منو
          <ChevronLeft size={15} />
        </button>
      )}
    </div>
  );
}

function CafeInfo() {
  return (
    <section className="min-h-[100svh] px-3 pb-44 pt-[calc(max(env(safe-area-inset-top),14px)+16px)]">
      <div className="relative overflow-hidden rounded-[32px] bg-gradient-to-b from-[#1D4D3F] to-[#14382E] px-6 py-12 text-center shadow-[0_20px_50px_rgba(20,56,46,0.25)]">
        <div className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full bg-[#CD9E6A]/20 blur-[70px]" />
        <div className="relative">
          <div className="font-brand bg-gradient-to-b from-[#f6e3bf] via-[#d9b27a] to-[#a07840] bg-clip-text text-[54px] font-semibold italic leading-none text-transparent">
            A.Four
          </div>
          <div className="my-5 flex items-center justify-center gap-3">
            <span className="h-px w-8 bg-[#CD9E6A]/50" />
            <span className="h-1.5 w-1.5 rotate-45 bg-[#CD9E6A]" />
            <span className="h-px w-8 bg-[#CD9E6A]/50" />
          </div>
          <p className="text-[14px] font-light text-[#f5f2ed]/80">
            جایی برای همه
          </p>
        </div>
      </div>

      <h2 className="mb-4 mt-8 text-[21px] font-bold tracking-tight">
        اطلاعات کافه
      </h2>

      <div className="overflow-hidden rounded-[26px] border border-[#E8D5BC] bg-[#FAFAF8] px-5">
        <InfoRow
          icon={<MapPin size={19} strokeWidth={1.6} />}
          label="آدرس"
          value="زیباشهر منطقه ۲، بلوار مطهری، شقایق ۷"
        />
        <InfoRow
          icon={<Clock3 size={19} strokeWidth={1.6} />}
          label="ساعت کاری"
          value="۱۷:۰۰ تا ۲۴:۰۰، همه روزه"
        />
        <InfoRow
          icon={<Phone size={19} strokeWidth={1.6} />}
          label="تماس با ما"
          value="0900 285 4000"
          ltr
          href="tel:09002854000"
          last
        />
      </div>

      <div className="mt-5 grid grid-cols-2 gap-3">
        <a
          href="https://instagram.com/A.fourcenter"
          target="_blank"
          rel="noreferrer"
          className="flex h-14 items-center justify-center rounded-full border border-[#A07840] text-[13px] font-bold text-[#A07840] transition active:scale-95"
        >
          اینستاگرام
        </a>
        <a
          href="https://t.me/Afourcenter"
          target="_blank"
          rel="noreferrer"
          className="flex h-14 items-center justify-center gap-2 rounded-full bg-[#A07840] text-[13px] font-bold text-white shadow-[0_8px_20px_rgba(160,120,64,0.3)] transition active:scale-95"
        >
          <Send size={16} strokeWidth={1.8} />
          تلگرام
        </a>
      </div>

      <p className="mt-10 text-center text-[12px] font-light text-[#14382E]/50">
        خوشحالیم که انتخابمان کرده‌اید.
      </p>
    </section>
  );
}

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
      <div className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-[#A07840]/12 text-[#A07840]">
        {icon}
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-[11px] font-light text-[#14382E]/55">{label}</p>
        <p
          dir={ltr ? "ltr" : undefined}
          className={`mt-0.5 text-[14px] font-bold leading-7 ${ltr ? "text-right" : ""}`}
        >
          {value}
        </p>
      </div>
    </>
  );
  const cls = `flex items-center gap-4 py-4 ${last ? "" : "border-b border-[#E8D5BC]/70"}`;
  return href ? (
    <a href={href} className={cls}>
      {body}
    </a>
  ) : (
    <div className={cls}>{body}</div>
  );
}

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
      type="button"
      onClick={onClick}
      aria-current={active ? "page" : undefined}
      className={`relative flex h-12 flex-1 items-center justify-center gap-2 rounded-full px-2 text-[12px] transition-all duration-300 ${
        active
          ? "bg-[#A07840] font-bold text-white shadow-[0_6px_16px_rgba(160,120,64,0.4)]"
          : "font-medium text-[#14382E]/55"
      }`}
    >
      {icon}
      {active ? (
        <span className="whitespace-nowrap">{label}</span>
      ) : (
        <span className="sr-only">{label}</span>
      )}
      {!!count && count > 0 && (
        <span className="absolute -top-1 right-1 grid h-[18px] min-w-[18px] place-items-center rounded-full border-2 border-[#FAFAF8] bg-[#14382E] px-1 text-[10px] font-bold text-white">
          {fa(count)}
        </span>
      )}
    </button>
  );
}
