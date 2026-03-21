import Link from "next/link";

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
    image: "/examples/coffee.jpg",
  },
  {
    name: "حكاية",
    sector: "fashion",
    description: "Modest fashion brand for modern women",
    image: "/examples/fashion.jpg",
  },
  {
    name: "بستان",
    sector: "health",
    description: "Organic dates and healthy snacks",
    image: "/examples/dates.jpg",
  },
];

export default function HomePage() {
  return (
    <main className="min-h-screen">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 bg-white/80 backdrop-blur-md z-50 border-b border-gray-50">
        <div className="container-wide py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#0A0A0A] rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">ب</span>
            </div>
            <span className="text-xl font-semibold">بصمة</span>
          </div>
          <div className="flex items-center gap-6">
            <Link href="#explore" className="text-gray-600 hover:text-black transition">
              استكشف
            </Link>
            <Link href="/create" className="btn-primary">
              ابدأ الآن
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-32 pb-20 md:pt-40 md:pb-32">
        <div className="container-narrow text-center">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
            اصنع علامتك التجارية
            <br />
            <span className="text-[#D4A574]">في دقائق</span>
          </h1>
          <p className="text-xl text-gray-600 mb-10 max-w-2xl mx-auto leading-relaxed">
            شعار، ألوان، تعبئة، ومطبوعات جاهزة للطباعة
            <br />
            بذكاء اصطناعي يفهم السوق السعودي
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/create" className="btn-primary text-lg px-8 py-4">
              ابدأ مشروعك ←
            </Link>
            <a href="#explore" className="btn-secondary text-lg px-8 py-4">
              شاهد أمثلة
            </a>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="section bg-[#F5F5F5]">
        <div className="container-wide">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-16">
            كيف يعمل؟
          </h2>
          <div className="grid md:grid-cols-4 gap-8">
            <Step
              number="١"
              title="صف مشروعك"
              description="أضف صور، أخبرنا عن نشاطك، والذكاء الاصطناعي يسألك أسئلة تفصيلية"
            />
            <Step
              number="٢"
              title="اختر شعارك"
              description="عدة نماذج ذكاء اصطناعي تولد لك خيارات متنوعة بالعربي والإنجليزي"
            />
            <Step
              number="٣"
              title="اختر التعبئة"
              description="شاهد علامتك على منتجات حقيقية بثلاثي الأبعاد"
            />
            <Step
              number="٤"
              title="حمل واستخدم"
              description="ملفات جاهزة للطباعة بجودة عالية، PDF و SVG"
            />
          </div>
        </div>
      </section>

      {/* Explore / Examples */}
      <section id="explore" className="section">
        <div className="container-wide">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">
            استكشف أعمالنا
          </h2>
          <p className="text-gray-600 text-center mb-12">
            مشاريع حقيقية من رواد أعمال مثلك
          </p>
          
          {/* Sector filter */}
          <div className="flex flex-wrap justify-center gap-3 mb-12">
            <button className="px-4 py-2 bg-[#0A0A0A] text-white rounded-full text-sm">
              الكل
            </button>
            {SECTORS.map((sector) => (
              <button
                key={sector.id}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-full text-sm hover:bg-gray-200 transition"
              >
                {sector.icon} {sector.labelAr}
              </button>
            ))}
          </div>

          {/* Examples grid */}
          <div className="grid md:grid-cols-3 gap-6">
            {EXAMPLES.map((example, i) => (
              <div key={i} className="card group cursor-pointer">
                <div className="aspect-[4/3] bg-gradient-to-br from-[#F5F5F5] to-gray-100 rounded-xl mb-4 overflow-hidden">
                  <div className="w-full h-full flex items-center justify-center text-6xl group-hover:scale-110 transition-transform duration-300">
                    {example.sector === "food" && "☕"}
                    {example.sector === "fashion" && "👗"}
                    {example.sector === "health" && "🌴"}
                  </div>
                </div>
                <h3 className="text-xl font-semibold mb-1">{example.name}</h3>
                <p className="text-gray-600 text-sm">{example.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section bg-[#0A0A0A]">
        <div className="container-narrow text-center">
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">
            جاهز تبدأ؟
          </h2>
          <p className="text-gray-400 text-lg mb-10">
            كل ما تحتاجه لعلامتك التجارية في مكان واحد
          </p>
          <Link href="/create" className="btn-accent text-lg px-10 py-4 inline-block">
            ابدأ الآن مجاناً
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-gray-100">
        <div className="container-wide flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-[#0A0A0A] rounded flex items-center justify-center">
              <span className="text-white font-bold">ب</span>
            </div>
            <span className="font-medium">بصمة</span>
          </div>
          <p className="text-gray-500 text-sm">
            صنع بـ ❤️ في السعودية
          </p>
        </div>
      </footer>
    </main>
  );
}

function Step({ number, title, description }: { number: string; title: string; description: string }) {
  return (
    <div className="text-center">
      <div className="w-16 h-16 bg-[#0A0A0A] text-white rounded-2xl flex items-center justify-center text-2xl font-bold mx-auto mb-4">
        {number}
      </div>
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-gray-600 text-sm leading-relaxed">{description}</p>
    </div>
  );
}
