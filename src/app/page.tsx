import Link from "next/link";
import { Button } from "@/components/ui";

const SECTORS = [
  { id: "food", label: "Food & Beverage", labelAr: "طعام ومشروبات", icon: "🍽️" },
  { id: "fashion", label: "Fashion", labelAr: "أزياء", icon: "👔" },
  { id: "tech", label: "Technology", labelAr: "تقنية", icon: "💻" },
  { id: "health", label: "Health & Beauty", labelAr: "صحة وجمال", icon: "💚" },
  { id: "retail", label: "Retail", labelAr: "تجزئة", icon: "🛍️" },
  { id: "services", label: "Services", labelAr: "خدمات", icon: "💼" },
];

const EXAMPLES = [
  {
    name: "مقهى النخيل",
    sector: "food",
    description: "Traditional Saudi coffee shop with modern twist",
    color: "#D4A574",
  },
  {
    name: "حكاية",
    sector: "fashion",
    description: "Modest fashion brand for modern women",
    color: "#8B7355",
  },
  {
    name: "بستان",
    sector: "health",
    description: "Organic dates and healthy snacks",
    color: "#10B981",
  },
];

const FEATURES = [
  {
    icon: "🎨",
    title: "ذكاء اصطناعي متعدد",
    description: "4 نماذج ذكاء اصطناعي لتوليد شعارات متنوعة",
  },
  {
    icon: "🌍",
    title: "دعم كامل للعربية",
    description: "تصميم يفهم السوق السعودي والثقافة العربية",
  },
  {
    icon: "📦",
    title: "تعبئة وتغليف",
    description: "شاهد علامتك على منتجات حقيقية",
  },
  {
    icon: "⬇️",
    title: "جاهز للطباعة",
    description: "ملفات PDF بجودة عالية مع ألوان CMYK",
  },
];

export default function HomePage() {
  return (
    <main className="min-h-screen">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 bg-white/80 backdrop-blur-md z-50 border-b border-border">
        <div className="container-wide py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">ب</span>
            </div>
            <span className="text-xl font-semibold">بصمة</span>
          </div>
          <div className="flex items-center gap-4 md:gap-6">
            <a href="#features" className="text-gray-600 hover:text-black transition hidden md:block">
              المميزات
            </a>
            <a href="#explore" className="text-gray-600 hover:text-black transition hidden md:block">
              استكشف
            </a>
            <Link href="/create">
              <Button>ابدأ الآن</Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-32 pb-16 md:pt-40 md:pb-24">
        <div className="container-narrow text-center px-4">
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
            اصنع علامتك التجارية
            <br />
            <span className="text-accent">في دقائق</span>
          </h1>
          <p className="text-lg md:text-xl text-gray-600 mb-10 max-w-2xl mx-auto leading-relaxed">
            شعار، ألوان، تعبئة، ومطبوعات جاهزة للطباعة
            <br className="hidden md:block" />
            بذكاء اصطناعي يفهم السوق السعودي
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/create">
              <Button size="lg" className="w-full sm:w-auto">
                ابدأ مشروعك ←
              </Button>
            </Link>
            <a href="#explore">
              <Button variant="secondary" size="lg" className="w-full sm:w-auto">
                شاهد أمثلة
              </Button>
            </a>
          </div>
          
          {/* Stats */}
          <div className="grid grid-cols-3 gap-8 mt-16 max-w-2xl mx-auto">
            <div>
              <div className="text-3xl md:text-4xl font-bold text-primary">٤+</div>
              <div className="text-gray-600 text-sm mt-1">نماذج ذكاء اصطناعي</div>
            </div>
            <div>
              <div className="text-3xl md:text-4xl font-bold text-primary">٥٠+</div>
              <div className="text-gray-600 text-sm mt-1">قالب تعبئة</div>
            </div>
            <div>
              <div className="text-3xl md:text-4xl font-bold text-primary">٣٠٠</div>
              <div className="text-gray-600 text-sm mt-1">DPI للطباعة</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="section bg-secondary/50">
        <div className="container-wide px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">
            لماذا بصمة؟
          </h2>
          <p className="text-gray-600 text-center mb-12 max-w-2xl mx-auto">
            كل ما تحتاجه لعلامتك التجارية في مكان واحد
          </p>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {FEATURES.map((feature, i) => (
              <div
                key={i}
                className="bg-white rounded-2xl p-6 border border-border hover:shadow-lg transition-shadow"
              >
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-600 text-sm">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="section">
        <div className="container-wide px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">
            كيف يعمل؟
          </h2>
          <p className="text-gray-600 text-center mb-12">
            4 خطوات بسيطة للحصول على علامتك التجارية
          </p>
          <div className="grid md:grid-cols-4 gap-8 max-w-5xl mx-auto">
            {[
              { num: "١", title: "صف مشروعك", desc: "أضف صور وأخبرنا عن نشاطك" },
              { num: "٢", title: "اختر شعارك", desc: "عدة خيارات من ذكاء اصطناعي" },
              { num: "٣", title: "خصص ألوانك", desc: "لوحة ألوان متناسقة" },
              { num: "٤", title: "حمل ملفاتك", desc: "جاهز للطباعة والاستخدام" },
            ].map((step, i) => (
              <div key={i} className="text-center">
                <div className="w-16 h-16 bg-primary text-white rounded-2xl flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                  {step.num}
                </div>
                <h3 className="text-lg font-semibold mb-2">{step.title}</h3>
                <p className="text-gray-600 text-sm">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Explore / Examples */}
      <section id="explore" className="section bg-secondary/30">
        <div className="container-wide px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">
            استكشف أعمالنا
          </h2>
          <p className="text-gray-600 text-center mb-12">
            مشاريع حقيقية من رواد أعمال مثلك
          </p>

          {/* Sector filter */}
          <div className="flex flex-wrap justify-center gap-3 mb-12">
            <button className="px-4 py-2 bg-primary text-white rounded-full text-sm">
              الكل
            </button>
            {SECTORS.map((sector) => (
              <button
                key={sector.id}
                className="px-4 py-2 bg-white text-gray-700 rounded-full text-sm hover:bg-gray-100 transition border border-border"
              >
                {sector.icon} {sector.labelAr}
              </button>
            ))}
          </div>

          {/* Examples grid */}
          <div className="grid md:grid-cols-3 gap-6">
            {EXAMPLES.map((example, i) => (
              <div
                key={i}
                className="bg-white rounded-2xl p-6 border border-border hover:shadow-lg transition-shadow cursor-pointer group"
              >
                <div
                  className="aspect-[4/3] rounded-xl mb-4 flex items-center justify-center text-6xl group-hover:scale-105 transition-transform"
                  style={{ backgroundColor: `${example.color}20` }}
                >
                  {example.sector === "food" && "☕"}
                  {example.sector === "fashion" && "👗"}
                  {example.sector === "health" && "🌴"}
                </div>
                <h3 className="text-xl font-semibold mb-1">{example.name}</h3>
                <p className="text-gray-600 text-sm">{example.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section bg-primary">
        <div className="container-narrow text-center px-4">
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">
            جاهز تبدأ؟
          </h2>
          <p className="text-gray-400 text-lg mb-10">
            كل ما تحتاجه لعلامتك التجارية في مكان واحد
          </p>
          <Link href="/create">
            <Button variant="accent" size="lg" className="text-lg px-10">
              ابدأ الآن مجاناً
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-border">
        <div className="container-wide px-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-primary rounded flex items-center justify-center">
                <span className="text-white font-bold">ب</span>
              </div>
              <span className="font-medium">بصمة</span>
            </div>
            <div className="flex items-center gap-6 text-sm text-gray-500">
              <span>صنع بـ ❤️ في السعودية</span>
              <span>© 2026</span>
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}
