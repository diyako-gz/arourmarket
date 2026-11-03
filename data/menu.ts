export type MenuItem = { id: number; category: string; title: string; description: string; price: string };

export const categories = [
  "همه",
  "پیش‌غذا",
  "سالاد",
  "پاستا",
  "غذای اصلی",
  "پیتزا",
  "عصرانه",
  "اسپرسو بار",
  "نوشیدنی گرم",
  "سرد کافئین‌دار",
  "شیک و اسموتی",
  "دمی بار"
] as const;

export const menuItems: MenuItem[] = [
  {
    "id": 1,
    "category": "پیش‌غذا",
    "title": "فرنچ فرایز",
    "description": "پیش‌غذای کلاسیک سیب‌زمینی",
    "price": "200"
  },
  {
    "id": 2,
    "category": "پیش‌غذا",
    "title": "ولکانو",
    "description": "پیش غذای مخصوص و هیجان انگیز",
    "price": "200"
  },
  {
    "id": 3,
    "category": "پیش‌غذا",
    "title": "سوپ ولوته قارچ و تره فرنگی",
    "description": "سوپ لذیذ و مقوی",
    "price": "200"
  },
  {
    "id": 4,
    "category": "پیش‌غذا",
    "title": "بروسکتا",
    "description": "نان تست شده با تاپینگ‌های ایتالیایی",
    "price": "200"
  },
  {
    "id": 5,
    "category": "پیش‌غذا",
    "title": "حمص و سارمای گوشت",
    "description": "ترکیب اصیل خاورمیانه‌ای",
    "price": "200"
  },
  {
    "id": 6,
    "category": "پیش‌غذا",
    "title": "اسپرینگ رول سبزیجات",
    "description": "به همراه سس هانی چیلی",
    "price": "200"
  },
  {
    "id": 7,
    "category": "سالاد",
    "title": "سزار کلاسیک",
    "description": "با بال مرغ گریل",
    "price": "200"
  },
  {
    "id": 8,
    "category": "سالاد",
    "title": "سالاد کرنبری",
    "description": "با درسینگ باربری",
    "price": "200"
  },
  {
    "id": 9,
    "category": "سالاد",
    "title": "سالاد گرین لاین",
    "description": "با سس آنتراکت",
    "price": "200"
  },
  {
    "id": 10,
    "category": "پاستا",
    "title": "پنه آلفردو",
    "description": "پاستا با سس سفید و قارچ",
    "price": "200"
  },
  {
    "id": 11,
    "category": "پاستا",
    "title": "فتوچینی پستو",
    "description": "پاستا با سس ریحان و سیر",
    "price": "200"
  },
  {
    "id": 12,
    "category": "پاستا",
    "title": "ریگاتونی استیک",
    "description": "ترکیب پاستا و استیک لذیذ",
    "price": "200"
  },
  {
    "id": 13,
    "category": "غذای اصلی",
    "title": "ریب آی استیک",
    "description": "استیک لذیذ و آبدار",
    "price": "200"
  },
  {
    "id": 14,
    "category": "غذای اصلی",
    "title": "چیکن استیک",
    "description": "استیک سینه مرغ گریل شده",
    "price": "200"
  },
  {
    "id": 15,
    "category": "غذای اصلی",
    "title": "راگوی مرغ و سبزیجات",
    "description": "خوراک فرانسوی اصیل",
    "price": "200"
  },
  {
    "id": 16,
    "category": "غذای اصلی",
    "title": "لاهماجون",
    "description": "پیتزای اصیل ترکی با گوشت چرخ‌کرده",
    "price": "200"
  },
  {
    "id": 17,
    "category": "پیتزا",
    "title": "کاپری",
    "description": "پیتزای کلاسیک ایتالیایی",
    "price": "200"
  },
  {
    "id": 18,
    "category": "پیتزا",
    "title": "پپرونی",
    "description": "پیتزا با سوسیس تخمیری و پنیر",
    "price": "200"
  },
  {
    "id": 19,
    "category": "پیتزا",
    "title": "بیانکو",
    "description": "پیتزای سفید بدون سس گوجه",
    "price": "200"
  },
  {
    "id": 20,
    "category": "پیتزا",
    "title": "روکوبیف",
    "description": "ترکیب گوشت و روگولا",
    "price": "200"
  },
  {
    "id": 21,
    "category": "پیتزا",
    "title": "بیف کارپاچیو",
    "description": "ورقه‌های نازک گوشت طعم‌دار",
    "price": "200"
  },
  {
    "id": 22,
    "category": "پیتزا",
    "title": "تاکینو پستو",
    "description": "ترکیب بوقلمون و سس پستو",
    "price": "200"
  },
  {
    "id": 23,
    "category": "عصرانه",
    "title": "فرنچ تست",
    "description": "تست فرانسوی لذیذ",
    "price": "200"
  },
  {
    "id": 24,
    "category": "عصرانه",
    "title": "چاشت گودا و ریحان",
    "description": "عصرانه سبک و خوش‌عطر",
    "price": "200"
  },
  {
    "id": 25,
    "category": "عصرانه",
    "title": "کروسان نوتلا و موز",
    "description": "کروسان کره‌ای پر شده",
    "price": "200"
  },
  {
    "id": 26,
    "category": "عصرانه",
    "title": "کرپ بیکن و سبزیجات",
    "description": "کرپ شور و خوشمزه",
    "price": "200"
  },
  {
    "id": 27,
    "category": "اسپرسو بار",
    "title": "اسپرسو",
    "description": "عربیکا، روبوستا و ۱۰۰٪ عربیکا",
    "price": "200"
  },
  {
    "id": 28,
    "category": "اسپرسو بار",
    "title": "اسپرسو کن پانا",
    "description": "عصاره قهوه با خامه سنگین",
    "price": "200"
  },
  {
    "id": 29,
    "category": "اسپرسو بار",
    "title": "آمریکانو",
    "description": "عصاره غلیظ قهوه با آب جوش",
    "price": "200"
  },
  {
    "id": 30,
    "category": "اسپرسو بار",
    "title": "کورتادو فیوژن",
    "description": "شیر و قهوه با هل و شیره انگور",
    "price": "200"
  },
  {
    "id": 31,
    "category": "اسپرسو بار",
    "title": "کاپوچینو",
    "description": "شیر، قهوه غلیظ با فوم سنگین",
    "price": "200"
  },
  {
    "id": 32,
    "category": "اسپرسو بار",
    "title": "کافه لاته",
    "description": "شیر، قهوه غلیظ با فوم سبک",
    "price": "200"
  },
  {
    "id": 33,
    "category": "اسپرسو بار",
    "title": "موکاچینو",
    "description": "شیر، قهوه غلیظ با طعم شکلات",
    "price": "200"
  },
  {
    "id": 34,
    "category": "اسپرسو بار",
    "title": "کارامل ماکیاتو",
    "description": "شیر، قهوه غلیظ با طعم کارامل",
    "price": "200"
  },
  {
    "id": 35,
    "category": "اسپرسو بار",
    "title": "پامکین لاته",
    "description": "طعم کدو حلوایی و دارچین",
    "price": "200"
  },
  {
    "id": 36,
    "category": "اسپرسو بار",
    "title": "آفوگاتو کلاسیک",
    "description": "بستنی وانیل و قهوه غلیظ",
    "price": "200"
  },
  {
    "id": 37,
    "category": "اسپرسو بار",
    "title": "آفوگاتو فیوژن",
    "description": "بستنی وانیل پسته و قهوه با طعم آجیلی",
    "price": "200"
  },
  {
    "id": 38,
    "category": "دمی بار",
    "title": "فیلتر کافی",
    "description": "عصاره قهوه دمی (۱۰۰٪ عربیکا)",
    "price": "200"
  },
  {
    "id": 39,
    "category": "دمی بار",
    "title": "فرنچ پرس",
    "description": "قهوه دم شده فرانسوی (۱۰۰٪ عربیکا)",
    "price": "200"
  },
  {
    "id": 40,
    "category": "نوشیدنی گرم",
    "title": "کَرک چای زعفران",
    "description": "ادویه کَرک، زعفران و شیر",
    "price": "200"
  },
  {
    "id": 41,
    "category": "نوشیدنی گرم",
    "title": "ماچا لاته",
    "description": "چای سبز ژاپنی با شیر",
    "price": "200"
  },
  {
    "id": 42,
    "category": "نوشیدنی گرم",
    "title": "اوبه لاته",
    "description": "سیب شیرین بنفش با شیر",
    "price": "200"
  },
  {
    "id": 43,
    "category": "نوشیدنی گرم",
    "title": "اسپیرولینا لاته",
    "description": "اسپیرولینا آبی با شیر",
    "price": "200"
  },
  {
    "id": 44,
    "category": "نوشیدنی گرم",
    "title": "ماسالا",
    "description": "ادویه ماسالا هندی با شیر",
    "price": "200"
  },
  {
    "id": 45,
    "category": "نوشیدنی گرم",
    "title": "هات چاکلت",
    "description": "شکلات داغ با خامه سبک",
    "price": "200"
  },
  {
    "id": 46,
    "category": "نوشیدنی گرم",
    "title": "دارک چاکلت",
    "description": "شکلات داغ تلخ با خامه سبک",
    "price": "200"
  },
  {
    "id": 47,
    "category": "نوشیدنی گرم",
    "title": "هیزلنات چاکلت",
    "description": "شکلات داغ و فندق با شیر",
    "price": "200"
  },
  {
    "id": 48,
    "category": "نوشیدنی گرم",
    "title": "کوکو چاکلت",
    "description": "شکلات، بادام زمینی، شیر و آجیل",
    "price": "200"
  },
  {
    "id": 49,
    "category": "نوشیدنی گرم",
    "title": "کَرک چای هل",
    "description": "ادویه کرک، هل و شیر",
    "price": "200"
  },
  {
    "id": 50,
    "category": "سرد کافئین‌دار",
    "title": "آیسد آمریکانو",
    "description": "آمریکانو خنک و یخی",
    "price": "200"
  },
  {
    "id": 51,
    "category": "سرد کافئین‌دار",
    "title": "آیسد لاته",
    "description": "لاته خنک و یخی",
    "price": "200"
  },
  {
    "id": 52,
    "category": "سرد کافئین‌دار",
    "title": "آیسد موکاچینو",
    "description": "موکاچینو خنک و یخی",
    "price": "200"
  },
  {
    "id": 53,
    "category": "سرد کافئین‌دار",
    "title": "آیسد کارامل ماکیاتو",
    "description": "کارامل ماکیاتو سرد",
    "price": "200"
  },
  {
    "id": 54,
    "category": "سرد کافئین‌دار",
    "title": "آیسد ماچا انبه",
    "description": "ماچا و انبه سرد",
    "price": "200"
  },
  {
    "id": 55,
    "category": "سرد کافئین‌دار",
    "title": "آیسد ماچا بری",
    "description": "ماچا و توت سرد",
    "price": "200"
  },
  {
    "id": 56,
    "category": "سرد کافئین‌دار",
    "title": "آیسد اسپیرولینا انبه",
    "description": "اسپیرولینا و انبه سرد",
    "price": "200"
  },
  {
    "id": 57,
    "category": "سرد کافئین‌دار",
    "title": "آیسد اسپیرولینا بری",
    "description": "اسپیرولینا و توت سرد",
    "price": "200"
  },
  {
    "id": 58,
    "category": "سرد کافئین‌دار",
    "title": "آیسد اوبه آیریش",
    "description": "نوشیدنی سرد اوبه و آیریش",
    "price": "200"
  },
  {
    "id": 59,
    "category": "سرد کافئین‌دار",
    "title": "آیسد سیتروس کافی",
    "description": "قهوه سرد با طعم مرکبات",
    "price": "200"
  },
  {
    "id": 60,
    "category": "شیک و اسموتی",
    "title": "هیزلنات چاکلت شیک",
    "description": "شیک شکلات و فندق",
    "price": "200"
  },
  {
    "id": 61,
    "category": "شیک و اسموتی",
    "title": "بیسکو باتر شیک",
    "description": "شیک بیسکویت و کره",
    "price": "200"
  },
  {
    "id": 62,
    "category": "شیک و اسموتی",
    "title": "نات بری شیک",
    "description": "شیک توت و آجیل",
    "price": "200"
  },
  {
    "id": 63,
    "category": "شیک و اسموتی",
    "title": "سالتد موکا کارامل شیک",
    "description": "شیک موکا کارامل نمکی",
    "price": "200"
  },
  {
    "id": 64,
    "category": "شیک و اسموتی",
    "title": "ایفور رویال شیک",
    "description": "شیک مخصوص و رویال ای فور",
    "price": "200"
  },
  {
    "id": 65,
    "category": "شیک و اسموتی",
    "title": "پرولایت اسموتی",
    "description": "اسموتی خنک و سبک",
    "price": "200"
  },
  {
    "id": 66,
    "category": "شیک و اسموتی",
    "title": "سوربری اسموتی",
    "description": "اسموتی توت‌های ترش",
    "price": "200"
  },
  {
    "id": 67,
    "category": "شیک و اسموتی",
    "title": "تروپیکال زست اسموتی",
    "description": "اسموتی میوه‌های استوایی",
    "price": "200"
  },
  {
    "id": 68,
    "category": "شیک و اسموتی",
    "title": "اِمبر آمور اسموتی",
    "description": "اسموتی با طعم ویژه",
    "price": "200"
  },
  {
    "id": 69,
    "category": "شیک و اسموتی",
    "title": "وانگونا اسموتی",
    "description": "اسموتی خاص وانگونا",
    "price": "200"
  },
  {
    "id": 70,
    "category": "شیک و اسموتی",
    "title": "رد واین اسموتی",
    "description": "اسموتی با ترکیب انگور قرمز",
    "price": "200"
  }
];
