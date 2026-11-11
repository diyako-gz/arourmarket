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
  const activeCat = selectedCat ?? "";
  const [panelOpen, setPanelOpen] = useState(true);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [barVisible, setBarVisible] = useState(false);
  const [showTop, setShowTop] = useState(false);

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
      if (mode === "large" || mode === "grid" || mode === "list" || mode === "mosaic") {
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

  /* scroll: back-to-top, floating bar visibility, active category sync */
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
    setSaved((cur) => (cur.includes(id) ? cur.filter((x) => x !== id) : [...cur, id]));
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

  const openSearch = () => {
    setSearchOpen(true);
  };

  const closeSearch = () => {
    setQuery("");
    setSearchOpen(false);
  };

  const barOn = tab === "menu" && (barVisible || searchOpen);

  return (
    <main dir="rtl" className="min-h-[100svh] bg-[#0d251d] text-[#f5f2ed]">
      <div className="relative mx-auto min-h-[100svh] w-full max-w-[600px] overflow-x-clip bg-[#14382E] bg-[radial-gradient(110%_40%_at_50%_0%,rgba(205,158,106,0.09),transparent_70%)] shadow-[0_0_80px_rgba(0,0,0,0.45)]">
        {/* ───────── floating category bar ───────── */}
        <div
          style={{ top: "max(env(safe-area-inset-top), 10px)" }}
          className={`fixed left-1/2 z-50 w-[calc(100%-20px)] max-w-[580px] -translate-x-1/2 transition-all duration-300 ${
            barOn ? "translate-y-0 opacity-100" : "pointer-events-none -translate-y-6 opacity-0"
          }`}
        >
          <div className="flex items-center gap-2 rounded-full border border-[#CD9E6A]/25 bg-[#1D4D3F]/85 p-1.5 shadow-[0_16px_44px_rgba(0,0,0,0.45),inset_0_1px_0_rgba(255,255,255,0.1)] backdrop-blur-xl backdrop-saturate-150">
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
                  className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-[#CD9E6A] text-[#14382E] transition active:scale-95"
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
                  className="flex h-11 shrink-0 items-center gap-2 rounded-full bg-[#14382E] px-3.5 text-[12px] font-bold text-[#f5f2ed] transition active:scale-95"
                >
                  دسته‌بندی‌ها
                  <Grid2X2 size={16} className="text-[#CD9E6A]" />
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
                            ? "bg-[#CD9E6A] text-[#14382E] shadow-[0_6px_16px_rgba(205,158,106,0.4)]"
                            : "bg-white/[0.06] text-[#f5f2ed]/75 active:bg-white/10"
                        }`}
                      >
                        <Icon size={16} strokeWidth={1.8} />
                        <span className="whitespace-nowrap">{g.name}</span>
                      </button>
                    );
                  })}
                </div>

                <button
                  type="button"
                  onClick={openSearch}
                  aria-label="جست‌وجو"
                  className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-[#14382E] text-[#CD9E6A] transition active:scale-95"
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
            className="fixed inset-0 z-[70] flex justify-center bg-black/60 backdrop-blur-sm"
            onClick={() => setSheetOpen(false)}
          >
            <div
              role="dialog"
              aria-label="دسته‌بندی‌ها"
              onClick={(e) => e.stopPropagation()}
              style={{ marginTop: "max(env(safe-area-inset-top), 12px)" }}
              className="fade-in h-fit max-h-[85svh] w-[calc(100%-24px)] max-w-[576px] overflow-y-auto rounded-[30px] border border-white/10 bg-[#1D4D3F] p-5 shadow-[0_24px_60px_rgba(0,0,0,0.5)]"
            >
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-[17px] font-bold">دسته‌بندی‌ها</h2>
                <button
                  type="button"
                  onClick={() => setSheetOpen(false)}
                  aria-label="بستن"
                  className="grid h-11 w-11 place-items-center rounded-full bg-[#CD9E6A] text-[#14382E]"
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
            <section className="relative flex min-h-[100svh] flex-col overflow-hidden bg-gradient-to-b from-[#1D4D3F] via-[#14382E] to-[#0d251d] px-4 pb-[calc(env(safe-area-inset-bottom)+110px)] pt-[max(env(safe-area-inset-top),14px)]">
              <div className="pointer-events-none absolute -right-24 top-24 h-72 w-72 rounded-full bg-[#CD9E6A]/15 blur-[90px]" />
              <div className="pointer-events-none absolute -left-24 bottom-40 h-72 w-72 rounded-full bg-[#CD9E6A]/10 blur-[90px]" />
              <div className="pointer-events-none absolute inset-0 opacity-70" style={{ backgroundImage: GRAIN }} />

              <header className="relative grid grid-cols-3 items-center rounded-full border border-white/12 bg-white/[0.07] px-5 py-3 shadow-[inset_0_1px_0_rgba(255,255,255,0.12)] backdrop-blur-xl">
                <div className="flex items-center gap-2 justify-self-start">
                  <span className="relative flex h-2 w-2">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#CD9E6A] opacity-50" />
                    <span className="relative inline-flex h-2 w-2 rounded-full bg-[#CD9E6A]" />
                  </span>
                  <span dir="ltr" className="text-[11px] font-bold text-[#f5f2ed]/85">
                    17:00 – 24:00
                  </span>
                </div>
                <span className="font-brand text-center text-[20px] font-semibold italic text-[#f5f2ed]">
                  A.Four
                </span>
                <span />
              </header>

              <div className="relative mt-4 flex flex-1 items-center justify-center overflow-hidden rounded-[36px] border border-white/12 bg-gradient-to-b from-white/[0.08] to-white/[0.02] px-6 py-12 shadow-[inset_0_1px_0_rgba(255,255,255,0.12)] backdrop-blur-2xl">
                <div className="pointer-events-none absolute h-[300px] w-[300px] rounded-full border border-[#CD9E6A]/15" />
                <div className="pointer-events-none absolute h-[210px] w-[210px] rounded-full border border-[#CD9E6A]/20" />
                <div className="pointer-events-none absolute h-[120px] w-[120px] rounded-full bg-[#CD9E6A]/15 blur-3xl" />
                <div className="relative text-center">
                  <div className="font-brand bg-gradient-to-b from-[#f6e3bf] via-[#d9b27a] to-[#a07840] bg-clip-text text-[68px] font-semibold italic leading-none text-transparent">
                    A.Four
                  </div>
                  <div className="my-5 flex items-center justify-center gap-3">
                    <span className="h-px w-8 bg-[#CD9E6A]/50" />
                    <span className="h-1.5 w-1.5 rotate-45 bg-[#CD9E6A]" />
                    <span className="h-px w-8 bg-[#CD9E6A]/50" />
                  </div>
                  <p className="text-[14px] font-light text-[#f5f2ed]/80">
                    یک انتخاب خوش‌طعم، برای هر لحظه
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => changeTab("cafe")}
                className="relative mt-4 flex items-center gap-4 rounded-[28px] border border-white/12 bg-gradient-to-l from-white/[0.09] to-white/[0.03] p-3.5 text-right shadow-[inset_0_1px_0_rgba(255,255,255,0.1)] backdrop-blur-xl transition active:scale-[0.99]"
              >
                <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-[#CD9E6A]/15 text-[#CD9E6A]">
                  <Info size={20} />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block text-[14px] font-bold">درباره A.Four</span>
                  <span className="mt-0.5 block text-[11px] font-light text-[#f5f2ed]/60">
                    آدرس، ساعت کاری و راه‌های ارتباطی اینجاست
                  </span>
                </span>
                <ChevronLeft size={18} className="shrink-0 text-[#CD9E6A]" />
              </button>

              <button
                type="button"
                onClick={scrollToMenu}
                className="relative mt-8 flex flex-col items-center gap-1 text-center"
              >
                <span className="mb-1 grid h-11 w-11 place-items-center rounded-full border border-[#CD9E6A]/40 bg-[#CD9E6A]/10">
                  <ChevronUp size={22} className="animate-bounce text-[#CD9E6A]" />
                </span>
                <span className="text-[26px] font-bold tracking-tight">مشاهده منو</span>
                <span className="text-[12px] font-light text-[#f5f2ed]/65">
                  دسته‌ها و محصولات را در ادامه ببینید
                </span>
              </button>
            </section>

            {/* category panel + view switch */}
            <div id="menu-start" className="px-3 pt-5">
              <div
                ref={panelRef}
                className="rounded-[32px] border border-white/10 bg-gradient-to-b from-[#235a49] to-[#1D4D3F] p-5 shadow-[0_24px_60px_rgba(0,0,0,0.35),inset_0_1px_0_rgba(255,255,255,0.08)]"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-[21px] font-bold tracking-tight">دسته‌بندی‌ها</h2>
                    <p className="mt-0.5 text-[11px] font-light text-[#f5f2ed]/55">
                      {fa(menuItems.length)} آیتم در {fa(groups.length)} دسته
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={openSearch}
                    aria-label="جست‌وجو"
                    className="grid h-12 w-12 place-items-center rounded-full bg-[#CD9E6A] text-[#14382E] transition active:scale-95"
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
                  aria-label={panelOpen ? "جمع کردن دسته‌بندی‌ها" : "نمایش دسته‌بندی‌ها"}
                  aria-expanded={panelOpen}
                  className="grid h-10 w-24 place-items-center rounded-full bg-[#CD9E6A] text-[#14382E] transition active:scale-95"
                >
                  {panelOpen ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                </button>
                <span className="text-[12px] font-bold text-[#f5f2ed]/80">حالت نمایش آیتم‌ها</span>
                <ViewSwitch value={viewMode} onChange={setViewMode} />
              </div>
            </div>

            {/* content */}
            <section className="px-3 pb-44 pt-8">
              {searching ? (
                <div key={`s-${normalizedQuery}`} className="fade-in">
                  <SectionHead title="نتایج جست‌وجو" count={searchResults.length} />
                  {searchResults.length === 0 ? (
                    <EmptyState saved={false} onBack={() => changeTab("menu")} />
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
                    <section key={g.name} id="items-start" className="fade-in scroll-mt-[84px]">
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
                <p className="py-10 text-center text-[13px] font-light text-[#f5f2ed]/60">
                  یکی از دسته‌بندی‌ها را انتخاب کنید تا آیتم‌هایش نمایش داده شود.
                </p>
              )}

              {(searching || selectedCat) && (
              <div className="mt-14 flex flex-col items-center">
                <div className="mb-3 flex items-center gap-3">
                  <span className="h-px w-10 bg-[#CD9E6A]/40" />
                  <span className="font-brand text-[20px] italic text-[#CD9E6A]">A.Four</span>
                  <span className="h-px w-10 bg-[#CD9E6A]/40" />
                </div>
                <p className="text-[11px] font-light text-[#f5f2ed]/50">
                  قیمت‌ها به هزار تومان است.
                </p>
              </div>
              )}
            </section>
          </>
        )}

        {/* ───────── SAVED TAB ───────── */}
        {tab === "saved" && (
          <section className="min-h-[100svh] px-3 pb-44 pt-[calc(max(env(safe-area-inset-top),14px)+16px)]">
            <SectionHead title="انتخاب‌های شما" count={savedItems.length} />
            <SearchField
              value={query}
              onChange={setQuery}
              className="mb-5 w-full border border-white/10 bg-[#1D4D3F]"
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
              <div key={`saved-${normalizedQuery}`} className="fade-in">
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
          className={`fixed left-[max(16px,calc(50%-284px))] z-40 grid h-12 w-12 place-items-center rounded-full bg-[#CD9E6A] text-[#14382E] shadow-[0_10px_28px_rgba(0,0,0,0.4)] transition-all duration-300 active:scale-95 ${
            showTop ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-4 opacity-0"
          }`}
        >
          <ArrowUp size={20} strokeWidth={2} />
        </button>

        {/* ───────── bottom navigation ───────── */}
        <nav
          style={{ bottom: "max(env(safe-area-inset-bottom), 12px)" }}
          className="fixed left-1/2 z-50 flex w-[calc(100%-24px)] max-w-[380px] -translate-x-1/2 items-center justify-between rounded-full border border-[#CD9E6A]/25 bg-[#1D4D3F]/90 p-1.5 shadow-[0_18px_44px_rgba(0,0,0,0.5),inset_0_1px_0_rgba(255,255,255,0.1)] backdrop-blur-xl backdrop-saturate-150"
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
                ? "border-[#CD9E6A] bg-[#14382E] shadow-[0_8px_22px_rgba(205,158,106,0.18)]"
                : "border-white/8 bg-[#14382E]/75 hover:border-[#CD9E6A]/40"
            }`}
          >
            <span
              className={`grid h-12 w-12 place-items-center rounded-full ring-1 transition ${
                on
                  ? "bg-[#CD9E6A] text-[#14382E] ring-[#CD9E6A]"
                  : "bg-[#CD9E6A]/12 text-[#CD9E6A] ring-[#CD9E6A]/25"
              }`}
            >
              <Icon size={24} strokeWidth={1.5} />
            </span>
            <span className="text-center text-[12.5px] font-bold leading-5 text-[#f5f2ed]">
              {g.name}
            </span>
            <span className="text-[10px] font-light text-[#f5f2ed]/50">
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
    <div className="flex items-center gap-1 rounded-full bg-[#CD9E6A] p-1.5">
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
              on ? "bg-[#14382E] text-[#CD9E6A]" : "text-[#14382E]/70"
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
      className={`flex h-11 items-center gap-2.5 rounded-full bg-[#14382E] px-4 text-[#f5f2ed] focus-within:ring-1 focus-within:ring-[#CD9E6A] ${className}`}
    >
      <Search size={17} className="shrink-0 text-[#CD9E6A]" />
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        autoFocus={autoFocus}
        placeholder="دنبال چه طعمی می‌گردی؟"
        className="h-full min-w-0 flex-1 bg-transparent text-[13px] outline-none placeholder:font-light placeholder:text-[#f5f2ed]/40"
      />
      {value && (
        <button
          type="button"
          onClick={() => onChange("")}
          aria-label="پاک کردن جست‌وجو"
          className="grid h-7 w-7 shrink-0 place-items-center rounded-full text-[#f5f2ed]/70"
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
      <div className="h-px flex-1 bg-gradient-to-l from-[#CD9E6A]/50 to-transparent" />
      <span className="rounded-full border border-[#CD9E6A]/30 bg-[#CD9E6A]/10 px-3 py-1 text-[11px] font-medium text-[#e6c99d]">
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
      <div className="absolute inset-0 grid place-items-center bg-gradient-to-br from-[#1D4D3F] to-[#0d251d]">
        <Coffee size={34} strokeWidth={1} className="text-[#CD9E6A]/50" />
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

function Price({ value, small, pill }: { value: string; small?: boolean; pill?: boolean }) {
  return (
    <div
      className={`shrink-0 text-left ${
        pill ? "rounded-2xl bg-[#0d251d]/55 px-3 py-1.5 ring-1 ring-[#CD9E6A]/30 backdrop-blur-md" : ""
      }`}
    >
      <span
        className={`block font-bold tabular-nums text-[#e6c99d] ${
          small ? "text-[14px]" : "text-[17px]"
        }`}
      >
        {formatPrice(value)}
      </span>
      <span className="block text-[10px] font-light text-[#f5f2ed]/65">تومان</span>
    </div>
  );
}

function SaveButton({
  saved,
  onToggle,
  className = "",
}: {
  saved: boolean;
  onToggle: () => void;
  className?: string;
}) {
  return (
    <button
      type="button"
      onClick={onToggle}
      aria-label={saved ? "حذف از علاقه‌مندی‌ها" : "افزودن به علاقه‌مندی‌ها"}
      aria-pressed={saved}
      className={`grid h-11 w-11 place-items-center rounded-full border backdrop-blur-xl transition active:scale-90 ${
        saved
          ? "border-[#CD9E6A] bg-[#CD9E6A] text-[#14382E] shadow-[0_6px_18px_rgba(205,158,106,0.45)]"
          : "border-white/20 bg-[#0d251d]/60 text-[#f5f2ed]"
      } ${className}`}
    >
      <Bookmark size={17} strokeWidth={1.8} fill={saved ? "currentColor" : "none"} />
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
      <article style={enterStyle} className="fade-in group flex items-center gap-3 rounded-[26px] border border-white/10 bg-gradient-to-l from-[#1D4D3F]/90 to-[#1D4D3F]/50 p-2.5 shadow-[inset_0_1px_0_rgba(255,255,255,0.06)]">
        <div className="relative h-[92px] w-[92px] shrink-0 overflow-hidden rounded-[16px] bg-[#0d251d]">
          <Thumb item={item} />
        </div>
        <div className="min-w-0 flex-1">
          {showCategory && (
            <span className="text-[10px] font-medium text-[#CD9E6A]">{item.category}</span>
          )}
          <h3 className="line-clamp-1 text-[14px] font-bold leading-7">{item.title}</h3>
          <p className="line-clamp-2 text-[11px] font-light leading-5 text-[#f5f2ed]/60">
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
      <article style={enterStyle} className="fade-in group flex min-w-0 flex-col overflow-hidden rounded-[28px] border border-white/10 bg-gradient-to-b from-[#215645] to-[#1a4639] shadow-[0_12px_30px_rgba(0,0,0,0.28)]">
        <div className="relative aspect-square overflow-hidden bg-[#0d251d]">
          <Thumb item={item} />
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/30 to-transparent" />
          <SaveButton saved={saved} onToggle={onToggle} className="absolute left-2 top-2" />
          {showCategory && (
            <span className="absolute right-2 top-2 rounded-full bg-[#0d251d]/70 px-2.5 py-1 text-[10px] font-medium backdrop-blur-md">
              {item.category}
            </span>
          )}
        </div>
        <div className="flex flex-1 flex-col p-3">
          <h3 className="line-clamp-1 text-[13.5px] font-bold leading-6">{item.title}</h3>
          <p className="mt-0.5 line-clamp-2 min-h-[40px] text-[11px] font-light leading-5 text-[#f5f2ed]/60">
            {desc}
          </p>
          <div className="mt-2 flex items-end justify-between border-t border-white/8 pt-2.5">
            <span className="text-[10px] text-[#f5f2ed]/50">قیمت</span>
            <Price value={item.price} small />
          </div>
        </div>
      </article>
    );
  }

  /* large + mosaic: full-bleed image with text over it */
  const large = mode === "large";
  const aspect = large ? "aspect-[4/3.4]" : wide ? "aspect-[16/10]" : "aspect-square";
  return (
    <article
      style={enterStyle}
      className={`fade-in group relative overflow-hidden rounded-[30px] border border-white/10 bg-[#0d251d] shadow-[0_18px_40px_rgba(0,0,0,0.35)] ring-1 ring-inset ring-white/5 ${
        wide ? "col-span-2" : ""
      }`}
    >
      <div className={`relative ${aspect}`}>
        <Thumb item={item} />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#0d251d]/95 via-[#0d251d]/25 to-transparent" />
        <SaveButton saved={saved} onToggle={onToggle} className="absolute left-3 top-3" />
        {showCategory && (
          <span className="absolute right-3 top-3 rounded-full bg-[#0d251d]/70 px-2.5 py-1 text-[10px] font-medium backdrop-blur-md">
            {item.category}
          </span>
        )}
        <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-3 p-4">
          <div className="min-w-0">
            <h3 className={`line-clamp-2 font-bold leading-7 ${large || wide ? "text-[19px] tracking-tight" : "text-[14px]"}`}>
              {item.title}
            </h3>
            {(large || wide) && (
              <p className="mt-0.5 line-clamp-1 text-[11px] font-light text-[#f5f2ed]/65">{desc}</p>
            )}
          </div>
          <Price value={item.price} small={!large && !wide} pill />
        </div>
      </div>
    </article>
  );
}

function EmptyState({ saved, onBack }: { saved: boolean; onBack: () => void }) {
  return (
    <div className="fade-in flex min-h-[300px] flex-col items-center justify-center rounded-[28px] border border-white/8 bg-[#1D4D3F]/60 px-6 text-center">
      <div className="grid h-16 w-16 place-items-center rounded-2xl bg-[#CD9E6A]/15 text-[#CD9E6A]">
        {saved ? <Bookmark size={27} /> : <Search size={27} />}
      </div>
      <h3 className="mt-5 text-[16px] font-bold">
        {saved ? "هنوز آیتمی ذخیره نکرده‌اید" : "موردی پیدا نشد"}
      </h3>
      <p className="mt-2 max-w-[250px] text-[12px] font-light leading-7 text-[#f5f2ed]/60">
        {saved
          ? "روی نشانک هر آیتم بزنید تا اینجا نگهش داریم."
          : "عبارت دیگری را جست‌وجو کنید یا از دسته‌بندی‌ها انتخاب کنید."}
      </p>
      {saved && (
        <button
          type="button"
          onClick={onBack}
          className="mt-5 flex items-center gap-2 rounded-full bg-[#CD9E6A] px-6 py-3 text-[12px] font-bold text-[#14382E]"
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
      <div className="relative overflow-hidden rounded-[30px] border border-white/10 bg-gradient-to-b from-[#1D4D3F] to-[#14382E] px-6 py-12 text-center">
        <div className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full bg-[#CD9E6A]/15 blur-[70px]" />
        <div className="relative">
          <div className="font-brand text-[52px] font-semibold italic leading-none text-[#e6c99d]">
            A.Four
          </div>
          <div className="mx-auto my-5 h-px w-14 bg-[#CD9E6A]/50" />
          <p className="text-[14px] font-light text-[#f5f2ed]/80">جایی برای همه</p>
        </div>
      </div>

      <h2 className="mb-4 mt-8 text-[19px] font-bold">اطلاعات کافه</h2>

      <div className="overflow-hidden rounded-[26px] border border-white/8 bg-[#1D4D3F]/70 px-5">
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
          className="flex h-14 items-center justify-center rounded-full border border-[#CD9E6A]/50 text-[13px] font-bold text-[#e6c99d] transition active:scale-95"
        >
          اینستاگرام
        </a>
        <a
          href="https://t.me/Afourcenter"
          target="_blank"
          rel="noreferrer"
          className="flex h-14 items-center justify-center gap-2 rounded-full bg-[#CD9E6A] text-[13px] font-bold text-[#14382E] transition active:scale-95"
        >
          <Send size={16} strokeWidth={1.8} />
          تلگرام
        </a>
      </div>

      <p className="mt-10 text-center text-[12px] font-light text-[#f5f2ed]/50">
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
      <div className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-[#CD9E6A]/15 text-[#CD9E6A]">
        {icon}
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-[11px] font-light text-[#f5f2ed]/55">{label}</p>
        <p
          dir={ltr ? "ltr" : undefined}
          className={`mt-0.5 text-[14px] font-bold leading-7 ${ltr ? "text-right" : ""}`}
        >
          {value}
        </p>
      </div>
    </>
  );
  const cls = `flex items-center gap-4 py-4 ${last ? "" : "border-b border-white/8"}`;
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
        active ? "bg-[#CD9E6A] font-bold text-[#14382E] shadow-[0_6px_16px_rgba(205,158,106,0.35)]" : "font-medium text-[#f5f2ed]/70"
      }`}
    >
      {icon}
      {active && <span className="whitespace-nowrap">{label}</span>}
      {!active && <span className="sr-only">{label}</span>}
      {!!count && count > 0 && (
        <span className="absolute -top-1 right-1 grid h-[18px] min-w-[18px] place-items-center rounded-full border-2 border-[#1D4D3F] bg-[#e6c99d] px-1 text-[10px] font-bold text-[#14382E]">
          {fa(count)}
        </span>
      )}
    </button>
  );
}





// "use client";

// import { useEffect, useMemo, useRef, useState } from "react";
// import type { ReactNode } from "react";
// import {
//   ArrowUp,
//   Beef,
//   Bookmark,
//   ChevronDown,
//   ChevronLeft,
//   ChevronUp,
//   Clock3,
//   Coffee,
//   Cookie,
//   CupSoda,
//   GlassWater,
//   Grid2X2,
//   Info,
//   Leaf,
//   LayoutDashboard,
//   List,
//   MapPin,
//   Phone,
//   Pizza,
//   Rows3,
//   Salad,
//   Search,
//   Send,
//   Soup,
//   Utensils,
//   X,
// } from "lucide-react";
// import type { LucideIcon } from "lucide-react";
// import { categories, menuItems, type MenuItem } from "@/data/menu";

// /* ───────────── config ───────────── */

// /** Cover photo: public/images/cover.webp. Falls back to the first menu photo. */
// const COVER_SRC = "/images/cover.webp";

// const HEADER_OFFSET = 84;

// /* palette: ink #14382E · green #1D4D3F · gold #CD9E6A · deep gold #A07840 · paper #F6F1E7 · card #FFFDF8 · sand #EBE4D6 */

// type Tab = "menu" | "saved" | "cafe";
// type ViewMode = "large" | "grid" | "list" | "mosaic";

// const norm = (s: string) => s.replace(/[\u200c\s]/g, "");

// const iconMap: Record<string, LucideIcon> = {
//   پیشغذا: Utensils,
//   سالاد: Salad,
//   پاستا: Soup,
//   غذایاصلی: Beef,
//   پیتزا: Pizza,
//   عصرانه: Cookie,
//   اسپرسوبار: Coffee,
//   نوشیدنیگرم: Coffee,
//   سردکافئیندار: CupSoda,
//   شیکواسموتی: GlassWater,
//   دمیبار: Leaf,
// };

// const iconFor = (name: string): LucideIcon => iconMap[norm(name)] ?? Utensils;

// const fa = (n: number) => new Intl.NumberFormat("fa-IR").format(n);

// function formatPrice(value: string) {
//   const n = Number(value);
//   return Number.isFinite(n) ? fa(n) : value;
// }

// const realCategories = categories.filter((c) => c !== "همه");

// const groups = realCategories
//   .map((name) => ({
//     name,
//     items: menuItems.filter((item) => item.category === name),
//   }))
//   .filter((g) => g.items.length > 0);

// const viewModes: { id: ViewMode; label: string; Icon: LucideIcon }[] = [
//   { id: "large", label: "کارت بزرگ", Icon: Rows3 },
//   { id: "grid", label: "دو ستونه", Icon: Grid2X2 },
//   { id: "list", label: "لیست", Icon: List },
//   { id: "mosaic", label: "موزاییکی", Icon: LayoutDashboard },
// ];

// /* ───────────── page ───────────── */

// export default function HomePage() {
//   const [tab, setTab] = useState<Tab>("menu");
//   const [saved, setSaved] = useState<number[]>([]);
//   const [ready, setReady] = useState(false);
//   const [query, setQuery] = useState("");
//   const [searchOpen, setSearchOpen] = useState(false);
//   const [viewMode, setViewMode] = useState<ViewMode>("grid");
//   const [selectedCat, setSelectedCat] = useState<string | null>(null);
//   const [panelOpen, setPanelOpen] = useState(true);
//   const [sheetOpen, setSheetOpen] = useState(false);
//   const [barVisible, setBarVisible] = useState(false);
//   const [showTop, setShowTop] = useState(false);
//   const [coverStage, setCoverStage] = useState(0);

//   const activeCat = selectedCat ?? "";
//   const panelRef = useRef<HTMLDivElement>(null);
//   const chipRefs = useRef<Record<string, HTMLButtonElement | null>>({});

//   const normalizedQuery = query.trim().toLocaleLowerCase("fa");
//   const searching = !!normalizedQuery;

//   const coverSrc =
//     coverStage === 0
//       ? COVER_SRC
//       : coverStage === 1 && menuItems[0]
//         ? `/images/menu/${menuItems[0].id}.webp`
//         : null;

//   /* persistence */
//   useEffect(() => {
//     try {
//       const raw = localStorage.getItem("afour_saved_items");
//       if (raw) setSaved(JSON.parse(raw));
//       const mode = localStorage.getItem("afour_view_mode");
//       if (mode === "large" || mode === "grid" || mode === "list" || mode === "mosaic") {
//         setViewMode(mode);
//       }
//     } catch {
//       setSaved([]);
//     }
//     setReady(true);
//   }, []);

//   useEffect(() => {
//     if (!ready) return;
//     try {
//       localStorage.setItem("afour_saved_items", JSON.stringify(saved));
//       localStorage.setItem("afour_view_mode", viewMode);
//     } catch {
//       /* storage unavailable */
//     }
//   }, [saved, viewMode, ready]);

//   /* scroll: back-to-top + floating bar visibility */
//   useEffect(() => {
//     let raf = 0;
//     const run = () => {
//       raf = 0;
//       setShowTop(window.scrollY > 500);
//       if (tab !== "menu") return;
//       const panel = panelRef.current;
//       if (panel) setBarVisible(panel.getBoundingClientRect().bottom < 70);
//     };
//     const onScroll = () => {
//       if (!raf) raf = requestAnimationFrame(run);
//     };
//     window.addEventListener("scroll", onScroll, { passive: true });
//     run();
//     return () => {
//       window.removeEventListener("scroll", onScroll);
//       if (raf) cancelAnimationFrame(raf);
//     };
//   }, [tab]);

//   /* keep the active chip in view inside the bar */
//   useEffect(() => {
//     if (!barVisible || searchOpen) return;
//     chipRefs.current[activeCat]?.scrollIntoView({
//       inline: "center",
//       block: "nearest",
//       behavior: "smooth",
//     });
//   }, [activeCat, barVisible, searchOpen]);

//   /* lock page scroll while the category sheet is open */
//   useEffect(() => {
//     document.body.style.overflow = sheetOpen ? "hidden" : "";
//     return () => {
//       document.body.style.overflow = "";
//     };
//   }, [sheetOpen]);

//   /* data */
//   const searchResults = useMemo(
//     () =>
//       menuItems.filter((item) =>
//         `${item.title} ${item.description} ${item.category}`
//           .toLocaleLowerCase("fa")
//           .includes(normalizedQuery),
//       ),
//     [normalizedQuery],
//   );

//   const savedItems = useMemo(
//     () =>
//       menuItems.filter(
//         (item) =>
//           saved.includes(item.id) &&
//           (!normalizedQuery ||
//             `${item.title} ${item.description} ${item.category}`
//               .toLocaleLowerCase("fa")
//               .includes(normalizedQuery)),
//       ),
//     [saved, normalizedQuery],
//   );

//   const toggleSaved = (id: number) => {
//     setSaved((cur) => (cur.includes(id) ? cur.filter((x) => x !== id) : [...cur, id]));
//   };

//   /* navigation */
//   const changeTab = (next: Tab) => {
//     setTab(next);
//     setQuery("");
//     setSearchOpen(false);
//     setSheetOpen(false);
//     setSelectedCat(null);
//     setPanelOpen(true);
//     window.scrollTo({ top: 0, behavior: "smooth" });
//   };

//   const scrollToMenu = () => {
//     const el = document.getElementById("menu-start");
//     if (el) window.scrollTo({ top: el.offsetTop - 8, behavior: "smooth" });
//   };

//   const goToCategory = (name: string) => {
//     setSheetOpen(false);
//     setSelectedCat(name);
//     setPanelOpen(false);
//     if (searching) {
//       setQuery("");
//       setSearchOpen(false);
//     }
//     window.setTimeout(() => {
//       const el = document.getElementById("items-start");
//       if (!el) return;
//       window.scrollTo({
//         top: el.getBoundingClientRect().top + window.scrollY - HEADER_OFFSET,
//         behavior: "smooth",
//       });
//     }, 540);
//   };

//   const closeSearch = () => {
//     setQuery("");
//     setSearchOpen(false);
//   };

//   const barOn = tab === "menu" && (barVisible || searchOpen);

//   return (
//     <main dir="rtl" className="min-h-[100svh] bg-[#E4DCCB] text-[#14382E]">
//       <style>{`
//         @keyframes afKen { from { transform: scale(1.12); } to { transform: scale(1); } }
//         @keyframes afRise { from { opacity: 0; transform: translateY(22px); } to { opacity: 1; transform: none; } }
//         .af-ken { animation: afKen 2.8s cubic-bezier(.2,.7,.2,1) both; }
//         .af-rise { animation: afRise .95s cubic-bezier(.2,.7,.2,1) both; }
//       `}</style>

//       <div className="relative mx-auto min-h-[100svh] w-full max-w-[600px] overflow-x-clip bg-[#F6F1E7] shadow-[0_0_80px_rgba(20,56,46,0.22)]">
//         {/* ───────── floating category bar ───────── */}
//         <div
//           style={{ top: "max(env(safe-area-inset-top), 10px)" }}
//           className={`fixed left-1/2 z-50 w-[calc(100%-20px)] max-w-[580px] -translate-x-1/2 transition-all duration-300 ${
//             barOn ? "translate-y-0 opacity-100" : "pointer-events-none -translate-y-6 opacity-0"
//           }`}
//         >
//           <div className="flex items-center gap-1.5 rounded-full border border-black/5 bg-[#FFFDF8]/85 p-1.5 shadow-[0_12px_40px_rgba(20,56,46,0.16)] backdrop-blur-2xl backdrop-saturate-150">
//             {searchOpen ? (
//               <>
//                 <SearchField value={query} onChange={setQuery} autoFocus className="flex-1" />
//                 <button
//                   type="button"
//                   onClick={closeSearch}
//                   aria-label="بستن جست‌وجو"
//                   className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-[#14382E] text-[#F6F1E7] transition active:scale-95"
//                 >
//                   <X size={18} />
//                 </button>
//               </>
//             ) : (
//               <>
//                 <button
//                   type="button"
//                   onClick={() => setSheetOpen(true)}
//                   aria-label="باز کردن دسته‌بندی‌ها"
//                   className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-[#EBE4D6] text-[#14382E] transition active:scale-95"
//                 >
//                   <Grid2X2 size={18} strokeWidth={1.8} />
//                 </button>

//                 <div className="no-scrollbar flex min-w-0 flex-1 items-center gap-1 overflow-x-auto">
//                   {groups.map((g) => {
//                     const active = activeCat === g.name;
//                     return (
//                       <button
//                         key={g.name}
//                         type="button"
//                         ref={(el) => {
//                           chipRefs.current[g.name] = el;
//                         }}
//                         onClick={() => goToCategory(g.name)}
//                         aria-pressed={active}
//                         className={`h-11 shrink-0 whitespace-nowrap rounded-full px-4 text-[13px] font-bold transition-all duration-300 ${
//                           active ? "bg-[#14382E] text-[#F6F1E7]" : "text-[#14382E]/65 active:bg-black/5"
//                         }`}
//                       >
//                         {g.name}
//                       </button>
//                     );
//                   })}
//                 </div>

//                 <button
//                   type="button"
//                   onClick={() => setSearchOpen(true)}
//                   aria-label="جست‌وجو"
//                   className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-[#EBE4D6] text-[#14382E] transition active:scale-95"
//                 >
//                   <Search size={18} strokeWidth={1.8} />
//                 </button>
//               </>
//             )}
//           </div>
//         </div>

//         {/* ───────── category sheet ───────── */}
//         {sheetOpen && (
//           <div
//             className="fixed inset-0 z-[70] flex justify-center bg-[#0d251d]/55 backdrop-blur-sm"
//             onClick={() => setSheetOpen(false)}
//           >
//             <div
//               role="dialog"
//               aria-label="دسته‌بندی‌ها"
//               onClick={(e) => e.stopPropagation()}
//               style={{ marginTop: "max(env(safe-area-inset-top), 12px)" }}
//               className="fade-in h-fit max-h-[85svh] w-[calc(100%-24px)] max-w-[576px] overflow-y-auto rounded-[30px] bg-[#FFFDF8] px-5 pb-3 pt-5 shadow-[0_24px_60px_rgba(0,0,0,0.35)]"
//             >
//               <div className="mb-2 flex items-center justify-between">
//                 <h2 className="text-[22px] font-bold tracking-tight">دسته‌بندی‌ها</h2>
//                 <button
//                   type="button"
//                   onClick={() => setSheetOpen(false)}
//                   aria-label="بستن"
//                   className="grid h-11 w-11 place-items-center rounded-full bg-[#EBE4D6]"
//                 >
//                   <X size={18} />
//                 </button>
//               </div>
//               <ul className="divide-y divide-[#E9E0D0]">
//                 {groups.map((g) => {
//                   const on = activeCat === g.name;
//                   return (
//                     <li key={g.name}>
//                       <button
//                         type="button"
//                         onClick={() => goToCategory(g.name)}
//                         className="flex min-h-[56px] w-full items-center justify-between gap-3 py-3 text-right"
//                       >
//                         <span className={`text-[16px] ${on ? "font-bold text-[#A07840]" : "font-bold"}`}>
//                           {g.name}
//                         </span>
//                         <span className="flex items-center gap-2 text-[12px] font-light text-[#14382E]/50">
//                           {fa(g.items.length)} آیتم
//                           <ChevronLeft size={16} className="text-[#CD9E6A]" />
//                         </span>
//                       </button>
//                     </li>
//                   );
//                 })}
//               </ul>
//             </div>
//           </div>
//         )}

//         {/* ───────── MENU TAB ───────── */}
//         {tab === "menu" && (
//           <>
//             {/* cover */}
//             <section className="relative flex min-h-[100svh] flex-col justify-between overflow-hidden bg-[#0d251d] px-6 pb-[calc(env(safe-area-inset-bottom)+104px)] pt-[max(env(safe-area-inset-top),22px)] text-white">
//               {coverSrc && (
//                 <img
//                   key={coverSrc}
//                   src={coverSrc}
//                   alt=""
//                   onError={() => setCoverStage((s) => s + 1)}
//                   className="af-ken absolute inset-0 h-full w-full object-cover"
//                 />
//               )}
//               <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-[#0d251d]/75 via-[#0d251d]/10 to-[#0d251d]/95" />

//               <header className="af-rise relative flex items-center justify-between" style={{ animationDelay: "150ms" }}>
//                 <span className="font-brand text-[26px] font-semibold italic tracking-tight">A.Four</span>
//                 <span className="flex items-center gap-2 text-[12px] font-light text-white/85">
//                   <span className="h-1.5 w-1.5 rounded-full bg-[#CD9E6A]" />
//                   <span dir="ltr">17:00 – 24:00</span>
//                 </span>
//               </header>

//               <div className="relative">
//                 <h1
//                   className="af-rise text-[42px] font-bold leading-[1.4] tracking-tight"
//                   style={{ animationDelay: "350ms" }}
//                 >
//                   خوش‌طعم‌تر
//                   <br />
//                   <span className="font-light text-[#e6c99d]">از چیزی که فکر می‌کنی.</span>
//                 </h1>
//                 <p
//                   className="af-rise mt-3 max-w-[300px] text-[13px] font-light leading-7 text-white/75"
//                   style={{ animationDelay: "500ms" }}
//                 >
//                   از اولین انتخاب تا آخرین لقمه؛ چیزی برای لذت بردن پیدا می‌کنی.
//                 </p>

//                 <button
//                   type="button"
//                   onClick={scrollToMenu}
//                   className="af-rise mt-7 flex h-[60px] w-full items-center justify-between rounded-full bg-[#F6F1E7] pl-2 pr-7 text-[#14382E] shadow-[0_18px_40px_rgba(0,0,0,0.35)] transition active:scale-[0.99]"
//                   style={{ animationDelay: "650ms" }}
//                 >
//                   <span className="text-[17px] font-bold">مشاهده منو</span>
//                   <span className="grid h-11 w-11 place-items-center rounded-full bg-[#14382E] text-[#CD9E6A]">
//                     <ChevronDown size={22} className="animate-bounce" />
//                   </span>
//                 </button>

//                 <button
//                   type="button"
//                   onClick={() => changeTab("cafe")}
//                   className="af-rise mx-auto mt-5 flex items-center gap-2 text-[12px] font-light text-white/80"
//                   style={{ animationDelay: "800ms" }}
//                 >
//                   <Info size={15} className="text-[#CD9E6A]" />
//                   درباره A.Four و راه‌های ارتباطی
//                 </button>
//               </div>
//             </section>

//             {/* menu body */}
//             <div id="menu-start" className="relative -mt-7 rounded-t-[34px] bg-[#F6F1E7] px-4 pt-9">
//               <p className="text-[12px] font-light text-[#14382E]/55">
//                 {fa(menuItems.length)} آیتم در {fa(groups.length)} دسته
//               </p>
//               <h2 className="mt-1 text-[34px] font-bold leading-tight tracking-tight">منوی A.Four</h2>

//               <SearchField
//                 value={query}
//                 onChange={setQuery}
//                 onFocus={() => undefined}
//                 className="mt-5 w-full shadow-[0_8px_28px_rgba(20,56,46,0.07)]"
//               />

//               <div
//                 ref={panelRef}
//                 className={`grid transition-[grid-template-rows] duration-500 ease-out ${
//                   panelOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
//                 }`}
//               >
//                 <div className="overflow-hidden">
//                   <div className="pt-6">
//                     <CategoryCards active={activeCat} onPick={goToCategory} />
//                   </div>
//                 </div>
//               </div>

//               <button
//                 type="button"
//                 onClick={() => setPanelOpen((v) => !v)}
//                 aria-expanded={panelOpen}
//                 className="mx-auto mt-5 flex h-11 items-center gap-2 rounded-full px-4 text-[12px] font-bold text-[#14382E]/70 active:bg-black/5"
//               >
//                 {panelOpen ? "جمع کردن دسته‌ها" : "نمایش همه دسته‌ها"}
//                 {panelOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
//               </button>

//               {/* items */}
//               <section className="pb-44 pt-6">
//                 {searching ? (
//                   <div key={`s-${normalizedQuery}`}>
//                     <SectionHead
//                       title="نتایج جست‌وجو"
//                       count={searchResults.length}
//                       right={<ViewSwitch value={viewMode} onChange={setViewMode} />}
//                     />
//                     {searchResults.length === 0 ? (
//                       <EmptyState saved={false} onBack={() => changeTab("menu")} />
//                     ) : (
//                       <ItemsLayout
//                         items={searchResults}
//                         mode={viewMode}
//                         saved={saved}
//                         onToggle={toggleSaved}
//                         showCategory
//                       />
//                     )}
//                   </div>
//                 ) : selectedCat ? (
//                   (() => {
//                     const g = groups.find((x) => x.name === selectedCat);
//                     if (!g) return null;
//                     return (
//                       <section key={g.name} id="items-start" className="scroll-mt-[84px]">
//                         <SectionHead
//                           title={g.name}
//                           count={g.items.length}
//                           right={<ViewSwitch value={viewMode} onChange={setViewMode} />}
//                         />
//                         <ItemsLayout items={g.items} mode={viewMode} saved={saved} onToggle={toggleSaved} />
//                       </section>
//                     );
//                   })()
//                 ) : (
//                   <p className="py-8 text-center text-[13px] font-light text-[#14382E]/55">
//                     یکی از دسته‌ها را انتخاب کنید تا آیتم‌هایش نمایش داده شود.
//                   </p>
//                 )}

//                 {(searching || selectedCat) && (
//                   <div className="mt-14 flex flex-col items-center">
//                     <div className="mb-3 flex items-center gap-3">
//                       <span className="h-px w-10 bg-[#CD9E6A]/50" />
//                       <span className="font-brand text-[20px] italic text-[#A07840]">A.Four</span>
//                       <span className="h-px w-10 bg-[#CD9E6A]/50" />
//                     </div>
//                     <p className="text-[11px] font-light text-[#14382E]/50">قیمت‌ها به هزار تومان است.</p>
//                   </div>
//                 )}
//               </section>
//             </div>
//           </>
//         )}

//         {/* ───────── SAVED TAB ───────── */}
//         {tab === "saved" && (
//           <section className="min-h-[100svh] px-4 pb-44 pt-[calc(max(env(safe-area-inset-top),14px)+28px)]">
//             <p className="text-[12px] font-light text-[#14382E]/55">آیتم‌هایی که نشانک زده‌اید</p>
//             <h2 className="mb-5 mt-1 text-[34px] font-bold leading-tight tracking-tight">انتخاب‌های شما</h2>
//             <SearchField value={query} onChange={setQuery} className="mb-6 w-full shadow-[0_8px_28px_rgba(20,56,46,0.07)]" />
//             {savedItems.length === 0 ? (
//               <EmptyState saved={saved.length === 0} onBack={() => changeTab("menu")} />
//             ) : (
//               <div key={`saved-${normalizedQuery}`}>
//                 <div className="mb-5 flex items-center justify-between">
//                   <span className="text-[12px] font-medium text-[#A07840]">{fa(savedItems.length)} آیتم</span>
//                   <ViewSwitch value={viewMode} onChange={setViewMode} />
//                 </div>
//                 <ItemsLayout items={savedItems} mode={viewMode} saved={saved} onToggle={toggleSaved} showCategory />
//               </div>
//             )}
//           </section>
//         )}

//         {/* ───────── ABOUT TAB ───────── */}
//         {tab === "cafe" && <CafeInfo />}

//         {/* ───────── back to top ───────── */}
//         <button
//           type="button"
//           onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
//           aria-label="بازگشت به بالای صفحه"
//           style={{ bottom: "calc(env(safe-area-inset-bottom) + 88px)" }}
//           className={`fixed left-[max(16px,calc(50%-284px))] z-40 grid h-12 w-12 place-items-center rounded-full border border-black/5 bg-[#FFFDF8]/90 text-[#14382E] shadow-[0_10px_28px_rgba(20,56,46,0.2)] backdrop-blur-xl transition-all duration-300 active:scale-95 ${
//             showTop ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-4 opacity-0"
//           }`}
//         >
//           <ArrowUp size={20} strokeWidth={2} />
//         </button>

//         {/* ───────── bottom navigation ───────── */}
//         <nav
//           style={{ bottom: "max(env(safe-area-inset-bottom), 12px)" }}
//           className="fixed left-1/2 z-50 flex w-[calc(100%-24px)] max-w-[380px] -translate-x-1/2 items-center justify-between rounded-full border border-black/5 bg-[#FFFDF8]/88 p-1.5 shadow-[0_16px_44px_rgba(20,56,46,0.2)] backdrop-blur-2xl backdrop-saturate-150"
//         >
//           <NavButton
//             active={tab === "menu"}
//             label="منو"
//             icon={<Utensils size={19} strokeWidth={1.8} />}
//             onClick={() => changeTab("menu")}
//           />
//           <NavButton
//             active={tab === "saved"}
//             label="علاقه‌مندی‌ها"
//             icon={<Bookmark size={19} strokeWidth={1.8} />}
//             count={saved.length}
//             onClick={() => changeTab("saved")}
//           />
//           <NavButton
//             active={tab === "cafe"}
//             label="درباره ما"
//             icon={<Coffee size={19} strokeWidth={1.8} />}
//             onClick={() => changeTab("cafe")}
//           />
//         </nav>
//       </div>
//     </main>
//   );
// }

// /* ───────────── pieces ───────────── */

// function CategoryCards({ active, onPick }: { active: string; onPick: (name: string) => void }) {
//   return (
//     <div className="grid grid-cols-2 gap-3">
//       {groups.map((g, i) => {
//         const lonely = i === groups.length - 1 && (i % 5 === 1 || i % 5 === 3);
//         return (
//           <CategoryCard
//             key={g.name}
//             name={g.name}
//             count={g.items.length}
//             item={g.items[0]}
//             on={active === g.name}
//             wide={i % 5 === 0 || lonely}
//             onPick={onPick}
//           />
//         );
//       })}
//     </div>
//   );
// }

// function CategoryCard({
//   name,
//   count,
//   item,
//   on,
//   wide,
//   onPick,
// }: {
//   name: string;
//   count: number;
//   item: MenuItem;
//   on: boolean;
//   wide: boolean;
//   onPick: (name: string) => void;
// }) {
//   const [failed, setFailed] = useState(false);
//   const Icon = iconFor(name);
//   return (
//     <button
//       type="button"
//       onClick={() => onPick(name)}
//       aria-pressed={on}
//       className={`group relative overflow-hidden rounded-[26px] bg-[#1D4D3F] text-right transition active:scale-[0.98] ${
//         wide ? "col-span-2 aspect-[2/1]" : "aspect-[1/1.12]"
//       } ${on ? "ring-2 ring-[#CD9E6A] ring-offset-2 ring-offset-[#F6F1E7]" : ""}`}
//     >
//       {!failed ? (
//         <img
//           src={`/images/menu/${item.id}.webp`}
//           alt=""
//           loading="lazy"
//           onError={() => setFailed(true)}
//           className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
//         />
//       ) : (
//         <div className="absolute inset-0 grid place-items-center bg-gradient-to-br from-[#1D4D3F] to-[#14382E]">
//           <Icon size={40} strokeWidth={1} className="text-[#CD9E6A]/60" />
//         </div>
//       )}
//       <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#0d251d]/85 via-[#0d251d]/15 to-transparent" />
//       <div className="absolute inset-x-0 bottom-0 p-4 text-white">
//         <span className={`block font-bold tracking-tight ${wide ? "text-[22px]" : "text-[17px]"}`}>{name}</span>
//         <span className="mt-0.5 block text-[11px] font-light text-white/75">{fa(count)} آیتم</span>
//       </div>
//     </button>
//   );
// }

// function ViewSwitch({ value, onChange }: { value: ViewMode; onChange: (mode: ViewMode) => void }) {
//   return (
//     <div className="flex items-center rounded-full bg-[#EBE4D6] p-1">
//       {viewModes.map(({ id, label, Icon }) => {
//         const on = value === id;
//         return (
//           <button
//             key={id}
//             type="button"
//             onClick={() => onChange(id)}
//             aria-label={label}
//             aria-pressed={on}
//             className={`grid h-10 w-10 place-items-center rounded-full transition-all duration-300 ${
//               on ? "bg-[#14382E] text-[#CD9E6A] shadow-[0_4px_12px_rgba(20,56,46,0.25)]" : "text-[#14382E]/55"
//             }`}
//           >
//             <Icon size={18} strokeWidth={1.8} />
//           </button>
//         );
//       })}
//     </div>
//   );
// }

// function SearchField({
//   value,
//   onChange,
//   autoFocus,
//   onFocus,
//   className = "",
// }: {
//   value: string;
//   onChange: (v: string) => void;
//   autoFocus?: boolean;
//   onFocus?: () => void;
//   className?: string;
// }) {
//   return (
//     <label
//       className={`flex h-[52px] items-center gap-3 rounded-full bg-[#FFFDF8] px-4 text-[#14382E] focus-within:ring-1 focus-within:ring-[#CD9E6A] ${className}`}
//     >
//       <Search size={18} strokeWidth={1.8} className="shrink-0 text-[#A07840]" />
//       <input
//         value={value}
//         onChange={(e) => onChange(e.target.value)}
//         onFocus={onFocus}
//         autoFocus={autoFocus}
//         placeholder="دنبال چه طعمی می‌گردی؟"
//         className="h-full min-w-0 flex-1 bg-transparent text-[14px] outline-none placeholder:font-light placeholder:text-[#14382E]/40"
//       />
//       {value && (
//         <button
//           type="button"
//           onClick={() => onChange("")}
//           aria-label="پاک کردن جست‌وجو"
//           className="grid h-8 w-8 shrink-0 place-items-center rounded-full opacity-60"
//         >
//           <X size={16} />
//         </button>
//       )}
//     </label>
//   );
// }

// function SectionHead({ title, count, right }: { title: string; count: number; right?: ReactNode }) {
//   return (
//     <div className="mb-6 flex items-end justify-between gap-3">
//       <div className="min-w-0">
//         <span className="text-[12px] font-medium text-[#A07840]">{fa(count)} آیتم</span>
//         <h2 className="mt-0.5 truncate text-[30px] font-bold leading-tight tracking-tight">{title}</h2>
//       </div>
//       {right}
//     </div>
//   );
// }

// function ItemsLayout({
//   items,
//   mode,
//   saved,
//   onToggle,
//   showCategory,
// }: {
//   items: MenuItem[];
//   mode: ViewMode;
//   saved: number[];
//   onToggle: (id: number) => void;
//   showCategory?: boolean;
// }) {
//   const wrap =
//     mode === "large"
//       ? "grid grid-cols-1 gap-5"
//       : mode === "list"
//         ? "flex flex-col divide-y divide-[#E6DCCB]"
//         : mode === "grid"
//           ? "grid grid-cols-2 gap-x-3 gap-y-6"
//           : "grid grid-cols-2 gap-3";

//   return (
//     <div key={mode} className={wrap}>
//       {items.map((item, i) => (
//         <MenuCard
//           key={item.id}
//           item={item}
//           mode={mode}
//           index={i}
//           wide={mode === "mosaic" && i % 3 === 0}
//           saved={saved.includes(item.id)}
//           onToggle={() => onToggle(item.id)}
//           showCategory={showCategory}
//         />
//       ))}
//     </div>
//   );
// }

// function Thumb({ item }: { item: MenuItem }) {
//   const [failed, setFailed] = useState(false);
//   if (failed) {
//     return (
//       <div className="absolute inset-0 grid place-items-center bg-gradient-to-br from-[#EFE7D8] to-[#E2D5BD]">
//         <Coffee size={34} strokeWidth={1} className="text-[#A07840]/50" />
//       </div>
//     );
//   }
//   return (
//     <img
//       src={`/images/menu/${item.id}.webp`}
//       alt={item.title}
//       loading="lazy"
//       onError={() => setFailed(true)}
//       className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
//     />
//   );
// }

// function Price({
//   value,
//   large,
//   onPhoto,
//   inline,
// }: {
//   value: string;
//   large?: boolean;
//   onPhoto?: boolean;
//   inline?: boolean;
// }) {
//   return (
//     <div className={`shrink-0 ${inline ? "flex items-baseline gap-1" : "text-left"}`}>
//       <span
//         className={`font-bold tabular-nums ${inline ? "" : "block"} ${large ? "text-[20px]" : "text-[15px]"} ${
//           onPhoto ? "text-[#f3d9ab]" : "text-[#A07840]"
//         }`}
//       >
//         {formatPrice(value)}
//       </span>
//       <span
//         className={`text-[10px] font-light ${inline ? "" : "block"} ${
//           onPhoto ? "text-white/75" : "text-[#14382E]/50"
//         }`}
//       >
//         تومان
//       </span>
//     </div>
//   );
// }

// function SaveButton({
//   saved,
//   onToggle,
//   onPhoto,
//   className = "",
// }: {
//   saved: boolean;
//   onToggle: () => void;
//   onPhoto?: boolean;
//   className?: string;
// }) {
//   return (
//     <button
//       type="button"
//       onClick={onToggle}
//       aria-label={saved ? "حذف از علاقه‌مندی‌ها" : "افزودن به علاقه‌مندی‌ها"}
//       aria-pressed={saved}
//       className={`grid h-11 w-11 place-items-center rounded-full transition active:scale-90 ${
//         saved
//           ? "bg-[#CD9E6A] text-[#14382E] shadow-[0_6px_18px_rgba(205,158,106,0.5)]"
//           : onPhoto
//             ? "bg-[#0d251d]/45 text-white backdrop-blur-xl"
//             : "bg-[#EBE4D6] text-[#14382E]"
//       } ${className}`}
//     >
//       <Bookmark size={17} strokeWidth={1.8} fill={saved ? "currentColor" : "none"} />
//     </button>
//   );
// }

// function MenuCard({
//   item,
//   mode,
//   index,
//   wide,
//   saved,
//   onToggle,
//   showCategory,
// }: {
//   item: MenuItem;
//   mode: ViewMode;
//   index: number;
//   wide?: boolean;
//   saved: boolean;
//   onToggle: () => void;
//   showCategory?: boolean;
// }) {
//   const enterStyle = { animationDelay: `${Math.min(index, 10) * 40}ms` };
//   const desc = item.description || "یک انتخاب خوش‌طعم از منوی A.Four";

//   if (mode === "list") {
//     return (
//       <article style={enterStyle} className="fade-in group flex items-center gap-4 py-4">
//         <div className="relative h-[96px] w-[96px] shrink-0 overflow-hidden rounded-[22px] bg-[#EBE4D6]">
//           <Thumb item={item} />
//         </div>
//         <div className="min-w-0 flex-1">
//           {showCategory && <span className="text-[10px] font-medium text-[#A07840]">{item.category}</span>}
//           <h3 className="line-clamp-1 text-[15px] font-bold leading-7">{item.title}</h3>
//           <p className="line-clamp-2 text-[11.5px] font-light leading-5 text-[#14382E]/60">{desc}</p>
//           <div className="mt-1.5">
//             <Price value={item.price} inline />
//           </div>
//         </div>
//         <SaveButton saved={saved} onToggle={onToggle} className="shrink-0" />
//       </article>
//     );
//   }

//   if (mode === "grid") {
//     return (
//       <article style={enterStyle} className="fade-in group min-w-0">
//         <div className="relative aspect-[4/5] overflow-hidden rounded-[26px] bg-[#EBE4D6] shadow-[0_14px_30px_rgba(20,56,46,0.14)]">
//           <Thumb item={item} />
//           <SaveButton saved={saved} onToggle={onToggle} onPhoto className="absolute left-2 top-2" />
//           {showCategory && (
//             <span className="absolute right-2 top-2 rounded-full bg-[#0d251d]/55 px-2.5 py-1 text-[10px] font-medium text-white backdrop-blur-md">
//               {item.category}
//             </span>
//           )}
//         </div>
//         <div className="px-1 pt-3">
//           <h3 className="line-clamp-1 text-[14.5px] font-bold leading-6">{item.title}</h3>
//           <p className="mt-0.5 line-clamp-2 min-h-[40px] text-[11.5px] font-light leading-5 text-[#14382E]/60">
//             {desc}
//           </p>
//           <div className="mt-1.5">
//             <Price value={item.price} inline />
//           </div>
//         </div>
//       </article>
//     );
//   }

//   const large = mode === "large";
//   const aspect = large ? "aspect-[4/4.4]" : wide ? "aspect-[16/10]" : "aspect-[4/5]";
//   return (
//     <article
//       style={enterStyle}
//       className={`fade-in group relative overflow-hidden rounded-[30px] bg-[#14382E] shadow-[0_18px_40px_rgba(20,56,46,0.22)] ${
//         wide ? "col-span-2" : ""
//       }`}
//     >
//       <div className={`relative ${aspect}`}>
//         <Thumb item={item} />
//         <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#0d251d]/90 via-[#0d251d]/15 to-transparent" />
//         <SaveButton saved={saved} onToggle={onToggle} onPhoto className="absolute left-3 top-3" />
//         {showCategory && (
//           <span className="absolute right-3 top-3 rounded-full bg-[#0d251d]/55 px-2.5 py-1 text-[10px] font-medium text-white backdrop-blur-md">
//             {item.category}
//           </span>
//         )}
//         <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-3 p-4 text-white">
//           <div className="min-w-0">
//             <h3
//               className={`line-clamp-2 font-bold leading-7 ${
//                 large || wide ? "text-[20px] tracking-tight" : "text-[14px]"
//               }`}
//             >
//               {item.title}
//             </h3>
//             {(large || wide) && (
//               <p className="mt-0.5 line-clamp-1 text-[11.5px] font-light text-white/75">{desc}</p>
//             )}
//           </div>
//           <Price value={item.price} large={large || wide} onPhoto />
//         </div>
//       </div>
//     </article>
//   );
// }

// function EmptyState({ saved, onBack }: { saved: boolean; onBack: () => void }) {
//   return (
//     <div className="fade-in flex min-h-[300px] flex-col items-center justify-center rounded-[28px] bg-[#FFFDF8] px-6 text-center shadow-[0_10px_30px_rgba(20,56,46,0.06)]">
//       <div className="grid h-16 w-16 place-items-center rounded-full bg-[#EBE4D6] text-[#A07840]">
//         {saved ? <Bookmark size={26} strokeWidth={1.6} /> : <Search size={26} strokeWidth={1.6} />}
//       </div>
//       <h3 className="mt-5 text-[17px] font-bold">{saved ? "هنوز آیتمی ذخیره نکرده‌اید" : "موردی پیدا نشد"}</h3>
//       <p className="mt-2 max-w-[250px] text-[12px] font-light leading-7 text-[#14382E]/60">
//         {saved
//           ? "روی نشانک هر آیتم بزنید تا اینجا نگهش داریم."
//           : "عبارت دیگری را جست‌وجو کنید یا از دسته‌ها انتخاب کنید."}
//       </p>
//       {saved && (
//         <button
//           type="button"
//           onClick={onBack}
//           className="mt-5 flex h-12 items-center gap-2 rounded-full bg-[#14382E] px-6 text-[13px] font-bold text-[#F6F1E7]"
//         >
//           مشاهده منو
//           <ChevronLeft size={16} className="text-[#CD9E6A]" />
//         </button>
//       )}
//     </div>
//   );
// }

// function CafeInfo() {
//   return (
//     <section className="min-h-[100svh] px-4 pb-44 pt-[calc(max(env(safe-area-inset-top),14px)+16px)]">
//       <div className="relative overflow-hidden rounded-[34px] bg-gradient-to-b from-[#1D4D3F] to-[#14382E] px-6 py-14 text-center shadow-[0_22px_50px_rgba(20,56,46,0.28)]">
//         <div className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full bg-[#CD9E6A]/20 blur-[70px]" />
//         <div className="relative">
//           <div className="font-brand bg-gradient-to-b from-[#fbeccd] via-[#e0b985] to-[#b88a52] bg-clip-text text-[58px] font-semibold italic leading-none text-transparent">
//             A.Four
//           </div>
//           <div className="my-5 flex items-center justify-center gap-3">
//             <span className="h-px w-8 bg-[#CD9E6A]/50" />
//             <span className="h-1.5 w-1.5 rotate-45 bg-[#CD9E6A]" />
//             <span className="h-px w-8 bg-[#CD9E6A]/50" />
//           </div>
//           <p className="text-[14px] font-light text-white/80">جایی برای همه</p>
//         </div>
//       </div>

//       <h2 className="mb-1 mt-9 text-[26px] font-bold tracking-tight">اطلاعات کافه</h2>

//       <div className="divide-y divide-[#E6DCCB]">
//         <InfoRow
//           icon={<MapPin size={19} strokeWidth={1.6} />}
//           label="آدرس"
//           value="زیباشهر منطقه ۲، بلوار مطهری، شقایق ۷"
//         />
//         <InfoRow
//           icon={<Clock3 size={19} strokeWidth={1.6} />}
//           label="ساعت کاری"
//           value="۱۷:۰۰ تا ۲۴:۰۰، همه روزه"
//         />
//         <InfoRow
//           icon={<Phone size={19} strokeWidth={1.6} />}
//           label="تماس با ما"
//           value="0900 285 4000"
//           ltr
//           href="tel:09002854000"
//         />
//       </div>

//       <div className="mt-6 grid grid-cols-2 gap-3">
//         <a
//           href="https://instagram.com/A.fourcenter"
//           target="_blank"
//           rel="noreferrer"
//           className="flex h-14 items-center justify-center rounded-full border border-[#14382E]/25 text-[14px] font-bold text-[#14382E] transition active:scale-95"
//         >
//           اینستاگرام
//         </a>
//         <a
//           href="https://t.me/Afourcenter"
//           target="_blank"
//           rel="noreferrer"
//           className="flex h-14 items-center justify-center gap-2 rounded-full bg-[#14382E] text-[14px] font-bold text-[#F6F1E7] transition active:scale-95"
//         >
//           <Send size={16} strokeWidth={1.8} className="text-[#CD9E6A]" />
//           تلگرام
//         </a>
//       </div>

//       <p className="mt-10 text-center text-[12px] font-light text-[#14382E]/50">خوشحالیم که انتخابمان کرده‌اید.</p>
//     </section>
//   );
// }

// function InfoRow({
//   icon,
//   label,
//   value,
//   ltr,
//   href,
// }: {
//   icon: ReactNode;
//   label: string;
//   value: string;
//   ltr?: boolean;
//   href?: string;
// }) {
//   const body = (
//     <>
//       <div className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-[#EBE4D6] text-[#A07840]">
//         {icon}
//       </div>
//       <div className="min-w-0 flex-1">
//         <p className="text-[11px] font-light text-[#14382E]/55">{label}</p>
//         <p dir={ltr ? "ltr" : undefined} className={`mt-0.5 text-[15px] font-bold leading-7 ${ltr ? "text-right" : ""}`}>
//           {value}
//         </p>
//       </div>
//     </>
//   );
//   const cls = "flex items-center gap-4 py-5";
//   return href ? (
//     <a href={href} className={cls}>
//       {body}
//     </a>
//   ) : (
//     <div className={cls}>{body}</div>
//   );
// }

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
//       type="button"
//       onClick={onClick}
//       aria-current={active ? "page" : undefined}
//       className={`relative flex h-12 flex-1 items-center justify-center gap-2 rounded-full px-2 text-[12px] transition-all duration-300 ${
//         active ? "bg-[#14382E] font-bold text-[#F6F1E7]" : "font-medium text-[#14382E]/55"
//       }`}
//     >
//       {icon}
//       {active ? <span className="whitespace-nowrap">{label}</span> : <span className="sr-only">{label}</span>}
//       {!!count && count > 0 && (
//         <span className="absolute -top-1 right-1 grid h-[18px] min-w-[18px] place-items-center rounded-full border-2 border-[#FFFDF8] bg-[#CD9E6A] px-1 text-[10px] font-bold text-[#14382E]">
//           {fa(count)}
//         </span>
//       )}
//     </button>
//   );
// }
