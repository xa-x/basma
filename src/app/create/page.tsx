"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button, Input, Textarea, Card } from "@/components/ui";
import { Loader2, Sparkles, ArrowLeft, ArrowRight, Palette } from "lucide-react";

const SECTORS = [
  { id: "food", label: "طعام ومشروبات", icon: "🍽️" },
  { id: "fashion", label: "أزياء", icon: "👔" },
  { id: "tech", label: "تقنية", icon: "💻" },
  { id: "health", label: "صحة وجمال", icon: "💚" },
  { id: "retail", label: "تجزئة", icon: "🛍️" },
  { id: "services", label: "خدمات", icon: "💼" },
  { id: "education", label: "تعليم", icon: "📚" },
  { id: "other", label: "أخرى", icon: "✨" },
];

const VIBES = [
  { id: "modern", label: "عصري", icon: "⚡" },
  { id: "luxury", label: "فاخر", icon: "👑" },
  { id: "traditional", label: "تراثي", icon: "🏛️" },
  { id: "playful", label: "مرح", icon: "🎨" },
  { id: "minimal", label: "بسيط", icon: "◻️" },
  { id: "bold", label: "جريء", icon: "🔥" },
];

const COLOR_PRESETS = [
  { name: "ذهبي تراثي", primary: "#D4A574", secondary: "#0A0A0A", accent: "#8B7355" },
  { name: "أزرق عصري", primary: "#2563EB", secondary: "#1E293B", accent: "#60A5FA" },
  { name: "أخضر طبيعي", primary: "#059669", secondary: "#1F2937", accent: "#34D399" },
  { name: "وردي فاخر", primary: "#DB2777", secondary: "#1E1B2E", accent: "#F472B6" },
  { name: "برتقالي حيوي", primary: "#EA580C", secondary: "#1C1917", accent: "#FB923C" },
  { name: "بنفسجي ملكي", primary: "#7C3AED", secondary: "#0F172A", accent: "#A78BFA" },
];

export default function CreatePage() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);

  // Step 1: Sector + Name
  const [sector, setSector] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [nameAr, setNameAr] = useState("");
  const [description, setDescription] = useState("");

  // Step 2: Style preferences
  const [vibe, setVibe] = useState<string | null>(null);
  const [selectedColors, setSelectedColors] = useState(COLOR_PRESETS[0]);
  const [keywords, setKeywords] = useState("");

  const handleCreate = async () => {
    setLoading(true);

    try {
      const res = await fetch("/api/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          nameAr: nameAr || null,
          sector,
          description,
          referenceImages: [],
          extractedColors: {
            primary: selectedColors.primary,
            secondary: selectedColors.secondary,
            accent: selectedColors.accent,
            neutral: "#888888",
            background: "#F5F5F5",
          },
          brandVibe: vibe || null,
        }),
      });

      const project = await res.json();
      router.push(`/project/${project.id}`);
    } catch (error) {
      console.error("Failed to create project:", error);
      setLoading(false);
    }
  };

  const canProceed = () => {
    switch (step) {
      case 0:
        return sector !== null && (nameAr.trim().length > 0 || name.trim().length > 0);
      case 1:
        return true; // Style preferences are optional
      default:
        return true;
    }
  };

  return (
    <main className="min-h-screen bg-white">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 bg-white border-b border-border z-50">
        <div className="container-narrow py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">ب</span>
            </div>
            <span className="text-xl font-semibold">بصمة</span>
          </div>

          {/* Progress — 3 steps */}
          <div className="flex items-center gap-2">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className={`w-12 h-1 rounded-full transition-colors ${
                  i <= step ? "bg-primary" : "bg-border"
                }`}
              />
            ))}
          </div>
        </div>
      </header>

      {/* Content */}
      <div className="pt-24 pb-12">
        <div className="container-narrow">
          {/* Step 0: Sector + Name */}
          {step === 0 && (
            <div className="animate-fadeIn">
              <h1 className="text-4xl font-bold mb-4">أنشئ علامتك التجارية</h1>
              <p className="text-gray-600 mb-8">اختر القطاع واكتب اسم العلامة</p>

              {/* Sector */}
              <div className="mb-8">
                <label className="block text-sm font-medium text-gray-700 mb-3">القطاع</label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {SECTORS.map((s) => (
                    <button
                      key={s.id}
                      onClick={() => setSector(s.id)}
                      className={`p-4 rounded-xl border-2 text-center transition-all hover:border-accent ${
                        sector === s.id ? "border-primary bg-gray-50" : "border-border"
                      }`}
                    >
                      <div className="text-3xl mb-2">{s.icon}</div>
                      <div className="text-sm font-medium">{s.label}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Names */}
              <div className="space-y-4 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">الاسم بالعربي</label>
                  <Input
                    value={nameAr}
                    onChange={(e) => setNameAr(e.target.value)}
                    placeholder="مثال: مقهى النخيل"
                    className="text-lg"
                    dir="rtl"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">الاسم بالإنجليزي (اختياري)</label>
                  <Input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g., Palm Coffee"
                    className="text-lg"
                    dir="ltr"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">وصف مختصر</label>
                  <Textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="مثال: مقهى سعودي يقدم القهوة العربية بطريقة عصرية..."
                    rows={3}
                  />
                </div>
              </div>

              <Button
                onClick={() => setStep(1)}
                disabled={!canProceed()}
                className="w-full py-4 text-lg"
              >
                التالي <ArrowLeft className="w-4 h-4 mr-2" />
              </Button>
            </div>
          )}

          {/* Step 1: Style preferences */}
          {step === 1 && (
            <div className="animate-fadeIn">
              <button onClick={() => setStep(0)} className="text-gray-500 hover:text-black mb-6 flex items-center gap-2">
                <ArrowRight className="w-4 h-4" /> رجوع
              </button>
              <h1 className="text-4xl font-bold mb-4">اختر أسلوب العلامة</h1>
              <p className="text-gray-600 mb-8">حدد الشعور العام والألوان</p>

              {/* Vibe */}
              <div className="mb-8">
                <label className="block text-sm font-medium text-gray-700 mb-3">الشعور العام</label>
                <div className="grid grid-cols-3 gap-3">
                  {VIBES.map((v) => (
                    <button
                      key={v.id}
                      onClick={() => setVibe(v.id)}
                      className={`p-4 rounded-xl border-2 text-center transition-all hover:border-accent ${
                        vibe === v.id ? "border-primary bg-gray-50" : "border-border"
                      }`}
                    >
                      <div className="text-2xl mb-1">{v.icon}</div>
                      <div className="text-sm font-medium">{v.label}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Color preset */}
              <div className="mb-8">
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  <Palette className="w-4 h-4 inline ml-1" />
                  لوحة الألوان
                </label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {COLOR_PRESETS.map((preset, i) => (
                    <button
                      key={i}
                      onClick={() => setSelectedColors(preset)}
                      className={`p-4 rounded-xl border-2 text-center transition-all hover:border-accent ${
                        selectedColors.primary === preset.primary
                          ? "border-primary bg-gray-50"
                          : "border-border"
                      }`}
                    >
                      <div className="flex justify-center gap-1 mb-2">
                        <div
                          className="w-8 h-8 rounded-lg border border-border"
                          style={{ backgroundColor: preset.primary }}
                        />
                        <div
                          className="w-8 h-8 rounded-lg border border-border"
                          style={{ backgroundColor: preset.secondary }}
                        />
                        <div
                          className="w-8 h-8 rounded-lg border border-border"
                          style={{ backgroundColor: preset.accent }}
                        />
                      </div>
                      <div className="text-xs font-medium">{preset.name}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Keywords */}
              <div className="mb-8">
                <label className="block text-sm font-medium text-gray-700 mb-2">كلمات مفتاحية (اختياري)</label>
                <Input
                  value={keywords}
                  onChange={(e) => setKeywords(e.target.value)}
                  placeholder="مثال: نخلة، قهوة، سعودي، تراث"
                  dir="rtl"
                />
              </div>

              <Button
                onClick={() => setStep(2)}
                className="w-full py-4 text-lg"
              >
                التالي <ArrowLeft className="w-4 h-4 mr-2" />
              </Button>
            </div>
          )}

          {/* Step 2: Confirm + Create */}
          {step === 2 && (
            <div className="animate-fadeIn">
              <button onClick={() => setStep(1)} className="text-gray-500 hover:text-black mb-6 flex items-center gap-2">
                <ArrowRight className="w-4 h-4" /> رجوع
              </button>
              <h1 className="text-4xl font-bold mb-4">جاهز للإنشاء! ✨</h1>
              <p className="text-gray-600 mb-8">راجع التفاصيل وأنشئ مشروعك</p>

              <Card className="mb-6 p-6">
                <div className="space-y-4">
                  <div>
                    <span className="text-sm text-gray-500">الاسم</span>
                    <div className="text-xl font-semibold">
                      {nameAr || name}
                      {nameAr && name && <span className="text-gray-400 text-base mr-2">({name})</span>}
                    </div>
                  </div>
                  <div>
                    <span className="text-sm text-gray-500">القطاع</span>
                    <div className="text-lg">
                      {SECTORS.find((s) => s.id === sector)?.icon}{" "}
                      {SECTORS.find((s) => s.id === sector)?.label}
                    </div>
                  </div>
                  {description && (
                    <div>
                      <span className="text-sm text-gray-500">الوصف</span>
                      <div className="text-gray-700">{description}</div>
                    </div>
                  )}
                  {vibe && (
                    <div>
                      <span className="text-sm text-gray-500">الشعور</span>
                      <div className="text-lg">
                        {VIBES.find((v) => v.id === vibe)?.icon}{" "}
                        {VIBES.find((v) => v.id === vibe)?.label}
                      </div>
                    </div>
                  )}
                  <div>
                    <span className="text-sm text-gray-500">الألوان</span>
                    <div className="flex gap-2 mt-1">
                      <div
                        className="w-10 h-10 rounded-lg border border-border"
                        style={{ backgroundColor: selectedColors.primary }}
                      />
                      <div
                        className="w-10 h-10 rounded-lg border border-border"
                        style={{ backgroundColor: selectedColors.secondary }}
                      />
                      <div
                        className="w-10 h-10 rounded-lg border border-border"
                        style={{ backgroundColor: selectedColors.accent }}
                      />
                    </div>
                  </div>
                </div>
              </Card>

              <Button
                onClick={handleCreate}
                disabled={loading}
                className="w-full py-4 text-lg"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 ml-2 animate-spin" />
                    جاري الإنشاء...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-5 h-5 ml-2" />
                    أنشئ المشروع
                  </>
                )}
              </Button>
            </div>
          )}
        </div>
      </div>

      <style jsx>{`
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </main>
  );
}
