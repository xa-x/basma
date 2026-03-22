"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Button, Input, Textarea, Card } from "@/components/ui";
import { Upload, Loader2, Sparkles, ArrowLeft, ArrowRight } from "lucide-react";

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

interface Question {
  id: string;
  question: string;
  questionAr?: string;
  type: "text" | "select" | "multiselect";
  options?: string[];
  priority: "high" | "medium" | "low";
}

export default function CreatePage() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);

  // Form data
  const [sector, setSector] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [nameAr, setNameAr] = useState("");
  const [description, setDescription] = useState("");
  const [images, setImages] = useState<string[]>([]);

  // AI-generated data
  const [questions, setQuestions] = useState<Question[]>([]);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [analysis, setAnalysis] = useState<any>(null);

  const handleImageUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    Array.from(files).forEach((file) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target?.result) {
          setImages((prev) => [...prev, e.target!.result as string]);
        }
      };
      reader.readAsDataURL(file);
    });
  }, []);

  const removeImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleAnalyze = async () => {
    if (images.length === 0) {
      // Skip analysis if no images
      handleCreate();
      return;
    }

    setAnalyzing(true);
    try {
      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          businessName: nameAr || name,
          sector,
          description,
          images,
        }),
      });

      const data = await res.json();
      setAnalysis(data.analysis);
      setQuestions(data.questions);
      setStep(4); // Go to questions step
    } catch (error) {
      console.error("Analysis failed:", error);
      // Continue without analysis
      handleCreate();
    } finally {
      setAnalyzing(false);
    }
  };

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
          referenceImages: images,
          extractedColors: analysis?.colors || null,
          brandVibe: analysis?.vibe || null,
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
        return sector !== null;
      case 1:
        return nameAr.trim().length > 0 || name.trim().length > 0;
      case 2:
        return description.trim().length >= 20;
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

          {/* Progress */}
          <div className="flex items-center gap-2">
            {[0, 1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className={`w-8 h-1 rounded-full transition-colors ${
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
          {/* Step 0: Sector */}
          {step === 0 && (
            <div className="animate-fadeIn">
              <h1 className="text-4xl font-bold mb-4">ما نوع نشاطك؟</h1>
              <p className="text-gray-600 mb-8">اختر القطاع الأقرب لنشاطك التجاري</p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {SECTORS.map((s) => (
                  <button
                    key={s.id}
                    onClick={() => {
                      setSector(s.id);
                      setStep(1);
                    }}
                    className={`p-6 rounded-2xl border-2 text-center transition-all hover:border-accent ${
                      sector === s.id ? "border-primary bg-gray-50" : "border-border"
                    }`}
                  >
                    <div className="text-4xl mb-3">{s.icon}</div>
                    <div className="font-medium">{s.label}</div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 1: Name */}
          {step === 1 && (
            <div className="animate-fadeIn">
              <button onClick={() => setStep(0)} className="text-gray-500 hover:text-black mb-6 flex items-center gap-2">
                <ArrowRight className="w-4 h-4" /> رجوع
              </button>
              <h1 className="text-4xl font-bold mb-4">ما اسم علامتك التجارية؟</h1>
              <p className="text-gray-600 mb-8">يمكنك إضافة الاسم بالعربي والإنجليزي</p>
              <div className="space-y-6">
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
                <Button
                  onClick={() => setStep(2)}
                  disabled={!nameAr.trim() && !name.trim()}
                  className="w-full py-4 text-lg"
                >
                  التالي <ArrowLeft className="w-4 h-4 mr-2" />
                </Button>
              </div>
            </div>
          )}

          {/* Step 2: Description */}
          {step === 2 && (
            <div className="animate-fadeIn">
              <button onClick={() => setStep(1)} className="text-gray-500 hover:text-black mb-6 flex items-center gap-2">
                <ArrowRight className="w-4 h-4" /> رجوع
              </button>
              <h1 className="text-4xl font-bold mb-4">أخبرنا المزيد عن نشاطك</h1>
              <p className="text-gray-600 mb-8">كلما زادت التفاصيل، كانت النتائج أفضل</p>
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">وصف النشاط</label>
                  <Textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="مثال: مقهى سعودي يقدم القهوة العربية بطريقة عصرية مع حلويات تقليدية. نستهدف الشباب السعودي الذين يبحثون عن تجربة قهوة فريدة..."
                    rows={5}
                    className="text-lg"
                  />
                  <p className="text-sm text-gray-500 mt-2">
                    {description.length}/500 حرف (الحد الأدنى 20)
                  </p>
                </div>
                <Button
                  onClick={() => setStep(3)}
                  disabled={description.trim().length < 20}
                  className="w-full py-4 text-lg"
                >
                  التالي <ArrowLeft className="w-4 h-4 mr-2" />
                </Button>
              </div>
            </div>
          )}

          {/* Step 3: Images */}
          {step === 3 && (
            <div className="animate-fadeIn">
              <button onClick={() => setStep(2)} className="text-gray-500 hover:text-black mb-6 flex items-center gap-2">
                <ArrowRight className="w-4 h-4" /> رجوع
              </button>
              <h1 className="text-4xl font-bold mb-4">أضف صور للإلهام</h1>
              <p className="text-gray-600 mb-8">
                صورة واجهة المحل، منتجات تحبها، أو أي شيء يعبر عن علامتك
              </p>

              <div className="space-y-6">
                {/* Upload area */}
                <label className="block border-2 border-dashed border-border rounded-2xl p-12 text-center cursor-pointer hover:border-accent transition">
                  <Upload className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                  <p className="text-gray-600 mb-2">اسحب الصور هنا أو اضغط للاختيار</p>
                  <p className="text-gray-400 text-sm">PNG, JPG حتى 10MB</p>
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                </label>

                {/* Uploaded images */}
                {images.length > 0 && (
                  <div className="grid grid-cols-3 gap-4">
                    {images.map((img, i) => (
                      <div key={i} className="relative group">
                        <img
                          src={img}
                          alt={`Upload ${i + 1}`}
                          className="aspect-square object-cover rounded-xl"
                        />
                        <button
                          onClick={() => removeImage(i)}
                          className="absolute top-2 right-2 w-8 h-8 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition flex items-center justify-center"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                <div className="flex gap-4">
                  <Button
                    onClick={handleAnalyze}
                    disabled={loading || analyzing}
                    className="flex-1 py-4 text-lg"
                  >
                    {analyzing ? (
                      <>
                        <Loader2 className="w-5 h-5 ml-2 animate-spin" />
                        يحلل بالذكاء الاصطناعي...
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-5 h-5 ml-2" />
                        تحليل وإنشاء المشروع
                      </>
                    )}
                  </Button>
                  {images.length === 0 && (
                    <Button onClick={handleCreate} variant="secondary" className="py-4 px-8">
                      تخطي
                    </Button>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Step 4: AI Questions */}
          {step === 4 && questions.length > 0 && (
            <div className="animate-fadeIn">
              <button onClick={() => setStep(3)} className="text-gray-500 hover:text-black mb-6 flex items-center gap-2">
                <ArrowRight className="w-4 h-4" /> رجوع
              </button>
              <h1 className="text-4xl font-bold mb-2">أسئلة تفصيلية</h1>
              <p className="text-gray-600 mb-8">
                ساعدنا نفهم علامتك أكثر للحصول على نتائج أفضل
              </p>

              {/* Analysis preview */}
              {analysis && (
                <Card className="mb-8 bg-accent/5 border-accent/20">
                  <div className="flex items-start gap-3">
                    <Sparkles className="w-5 h-5 text-accent mt-1" />
                    <div>
                      <h3 className="font-semibold mb-2">تحليل الذكاء الاصطناعي</h3>
                      <p className="text-gray-600 text-sm">{analysis.vibe}</p>
                      {analysis.colors && (
                        <div className="flex gap-2 mt-3">
                          {Object.values(analysis.colors as Record<string, string>).map((color, i) => (
                            <div
                              key={i}
                              className="w-8 h-8 rounded-lg border border-border"
                              style={{ backgroundColor: color }}
                              title={color}
                            />
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </Card>
              )}

              {/* Questions */}
              <div className="space-y-6">
                {questions.map((q) => (
                  <div key={q.id}>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {q.questionAr || q.question}
                    </label>
                    {q.type === "text" && (
                      <Textarea
                        value={answers[q.id] || ""}
                        onChange={(e) => setAnswers({ ...answers, [q.id]: e.target.value })}
                        placeholder="اكتب إجابتك..."
                        rows={3}
                      />
                    )}
                    {q.type === "select" && q.options && (
                      <div className="grid grid-cols-2 gap-3">
                        {q.options.map((opt, i) => (
                          <button
                            key={i}
                            onClick={() => setAnswers({ ...answers, [q.id]: opt })}
                            className={`p-3 rounded-xl border text-sm transition ${
                              answers[q.id] === opt
                                ? "border-primary bg-primary/5"
                                : "border-border hover:border-gray-300"
                            }`}
                          >
                            {opt}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                ))}

                <Button onClick={handleCreate} disabled={loading} className="w-full py-4 text-lg">
                  {loading ? (
                    <>
                      <Loader2 className="w-5 h-5 ml-2 animate-spin" />
                      جاري الإنشاء...
                    </>
                  ) : (
                    "إنشاء المشروع ✨"
                  )}
                </Button>
              </div>
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
