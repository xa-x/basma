"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";

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

export default function CreatePage() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  
  // Form data
  const [sector, setSector] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [nameAr, setNameAr] = useState("");
  const [description, setDescription] = useState("");
  const [images, setImages] = useState<string[]>([]);

  const handleImageUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    
    // Convert to base64 for preview (in production, upload to storage)
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
      case 0: return sector !== null;
      case 1: return name.trim().length > 0;
      case 2: return description.trim().length > 0;
      default: return true;
    }
  };

  return (
    <main className="min-h-screen bg-white">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 bg-white border-b border-gray-100 z-50">
        <div className="container-narrow py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#0A0A0A] rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">ب</span>
            </div>
            <span className="text-xl font-semibold">بصمة</span>
          </div>
          
          {/* Progress */}
          <div className="flex items-center gap-2">
            {[0, 1, 2, 3].map((i) => (
              <div
                key={i}
                className={`w-8 h-1 rounded-full transition-colors ${
                  i <= step ? "bg-[#0A0A0A]" : "bg-gray-200"
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
              <h1 className="text-4xl font-bold mb-4">
                ما نوع نشاطك؟
              </h1>
              <p className="text-gray-600 mb-8">
                اختر القطاع الأقرب لنشاطك التجاري
              </p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {SECTORS.map((s) => (
                  <button
                    key={s.id}
                    onClick={() => {
                      setSector(s.id);
                      setStep(1);
                    }}
                    className={`p-6 rounded-2xl border-2 text-center transition-all hover:border-[#D4A574] ${
                      sector === s.id
                        ? "border-[#0A0A0A] bg-gray-50"
                        : "border-gray-100"
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
              <button
                onClick={() => setStep(0)}
                className="text-gray-500 hover:text-black mb-6 flex items-center gap-2"
              >
                ← رجوع
              </button>
              <h1 className="text-4xl font-bold mb-4">
                ما اسم علامتك التجارية؟
              </h1>
              <p className="text-gray-600 mb-8">
                يمكنك إضافة الاسم بالعربي والإنجليزي
              </p>
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    الاسم بالعربي
                  </label>
                  <input
                    type="text"
                    value={nameAr}
                    onChange={(e) => setNameAr(e.target.value)}
                    placeholder="مثال: مقهى النخيل"
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl text-lg focus:outline-none focus:border-[#0A0A0A] transition"
                    dir="rtl"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    الاسم بالإنجليزي (اختياري)
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g., Palm Coffee"
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl text-lg focus:outline-none focus:border-[#0A0A0A] transition"
                    dir="ltr"
                  />
                </div>
                <button
                  onClick={() => setStep(2)}
                  disabled={!nameAr.trim() && !name.trim()}
                  className="btn-primary w-full py-4 text-lg disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  التالي →
                </button>
              </div>
            </div>
          )}

          {/* Step 2: Description */}
          {step === 2 && (
            <div className="animate-fadeIn">
              <button
                onClick={() => setStep(1)}
                className="text-gray-500 hover:text-black mb-6 flex items-center gap-2"
              >
                ← رجوع
              </button>
              <h1 className="text-4xl font-bold mb-4">
                أخبرنا المزيد عن نشاطك
              </h1>
              <p className="text-gray-600 mb-8">
                كلما زادت التفاصيل، كانت النتائج أفضل
              </p>
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    وصف النشاط
                  </label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="مثال: مقهى سعودي يقدم القهوة العربية بطريقة عصرية مع حلويات تقليدية..."
                    rows={4}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl text-lg focus:outline-none focus:border-[#0A0A0A] transition resize-none"
                  />
                </div>
                <button
                  onClick={() => setStep(3)}
                  disabled={!description.trim()}
                  className="btn-primary w-full py-4 text-lg disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  التالي →
                </button>
              </div>
            </div>
          )}

          {/* Step 3: Images */}
          {step === 3 && (
            <div className="animate-fadeIn">
              <button
                onClick={() => setStep(2)}
                className="text-gray-500 hover:text-black mb-6 flex items-center gap-2"
              >
                ← رجوع
              </button>
              <h1 className="text-4xl font-bold mb-4">
                أضف صور للإلهام (اختياري)
              </h1>
              <p className="text-gray-600 mb-8">
                صورة واجهة المحل، منتجات تحبها، أو أي شيء يعبر عن علامتك
              </p>
              
              <div className="space-y-6">
                {/* Upload area */}
                <label className="block border-2 border-dashed border-gray-200 rounded-2xl p-12 text-center cursor-pointer hover:border-[#D4A574] transition">
                  <div className="text-4xl mb-4">📷</div>
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
                  <button
                    onClick={handleCreate}
                    disabled={loading}
                    className="btn-primary flex-1 py-4 text-lg"
                  >
                    {loading ? "جاري الإنشاء..." : "إنشاء المشروع ✨"}
                  </button>
                  {images.length === 0 && (
                    <button
                      onClick={handleCreate}
                      className="btn-secondary py-4 px-8"
                    >
                      تخطي
                    </button>
                  )}
                </div>
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
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </main>
  );
}
