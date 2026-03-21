"use client";

import { useState, useEffect, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";

interface Project {
  id: string;
  name: string;
  nameAr: string | null;
  sector: string;
  description: string | null;
  referenceImages: string[] | null;
  extractedColors: any | null;
  brandVibe: string | null;
  logoUrl: string | null;
  status: string;
}

const SECTORS: Record<string, string> = {
  food: "طعام ومشروبات",
  fashion: "أزياء",
  tech: "تقنية",
  health: "صحة وجمال",
  retail: "تجزئة",
  services: "خدمات",
  education: "تعليم",
  other: "أخرى",
};

const AI_MODELS = [
  { id: "qwen", name: "Qwen-VL", description: "ممتاز للعربي والنصوص" },
  { id: "dalle3", name: "DALL-E 3", description: "واقعي ومتعدد" },
  { id: "sdxl", name: "Stable Diffusion", description: "فني ومميز" },
  { id: "flux", name: "Flux Pro", description: "إبداعي وعصري" },
];

export default function ProjectPage() {
  const params = useParams();
  const router = useRouter();
  const [project, setProject] = useState<Project | null>(null);
  const [activeStep, setActiveStep] = useState("overview");
  const [loading, setLoading] = useState(false);
  
  // Logo generation state
  const [selectedModel, setSelectedModel] = useState("qwen");
  const [logoPrompt, setLogoPrompt] = useState("");
  const [generatedLogos, setGeneratedLogos] = useState<string[]>([]);
  const [generating, setGenerating] = useState(false);

  useEffect(() => {
    fetchProject();
  }, [params.id]);

  const fetchProject = async () => {
    const res = await fetch(`/api/projects/${params.id}`);
    const data = await res.json();
    setProject(data);
    
    // Set active step based on status
    if (data.status === "draft") setActiveStep("logo");
    else if (data.status === "logo") setActiveStep("design");
    else if (data.status === "design") setActiveStep("packaging");
    else setActiveStep("download");
  };

  const handleGenerateLogo = async () => {
    if (!logoPrompt.trim()) return;
    setGenerating(true);
    
    // TODO: Call actual AI API
    setTimeout(() => {
      setGeneratedLogos([
        "/placeholder-logo-1.svg",
        "/placeholder-logo-2.svg",
        "/placeholder-logo-3.svg",
        "/placeholder-logo-4.svg",
      ]);
      setGenerating(false);
    }, 2000);
  };

  const handleSelectLogo = async (logoUrl: string) => {
    await fetch(`/api/projects/${params.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ logoUrl, status: "logo" }),
    });
    fetchProject();
    setActiveStep("design");
  };

  if (!project) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-2xl">⏳</div>
      </div>
    );
  }

  const steps = [
    { id: "overview", label: "نظرة عامة", icon: "📋" },
    { id: "logo", label: "الشعار", icon: "🎨" },
    { id: "design", label: "التصميم", icon: "✨" },
    { id: "packaging", label: "التعبئة", icon: "📦" },
    { id: "download", label: "التحميل", icon: "⬇️" },
  ];

  return (
    <main className="min-h-screen bg-[#F5F5F5]">
      {/* Sidebar */}
      <aside className="fixed right-0 top-0 bottom-0 w-72 bg-white border-l border-gray-100 p-6 overflow-y-auto">
        {/* Logo */}
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 bg-[#0A0A0A] rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-lg">ب</span>
          </div>
          <span className="text-xl font-semibold">بصمة</span>
        </div>

        {/* Project info */}
        <div className="mb-8 p-4 bg-gray-50 rounded-xl">
          <h2 className="font-semibold text-lg mb-1">
            {project.nameAr || project.name}
          </h2>
          <p className="text-gray-500 text-sm">
            {SECTORS[project.sector] || project.sector}
          </p>
        </div>

        {/* Steps */}
        <nav className="space-y-2">
          {steps.map((step) => (
            <button
              key={step.id}
              onClick={() => setActiveStep(step.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-right transition ${
                activeStep === step.id
                  ? "bg-[#0A0A0A] text-white"
                  : "hover:bg-gray-50 text-gray-700"
              }`}
            >
              <span>{step.icon}</span>
              <span className="font-medium">{step.label}</span>
            </button>
          ))}
        </nav>

        {/* Back to home */}
        <div className="mt-8 pt-8 border-t border-gray-100">
          <Link href="/" className="text-gray-500 hover:text-black text-sm flex items-center gap-2">
            → الرئيسية
          </Link>
        </div>
      </aside>

      {/* Main content */}
      <div className="mr-72 p-8">
        {/* Overview */}
        {activeStep === "overview" && (
          <div className="max-w-2xl">
            <h1 className="text-3xl font-bold mb-6">
              {project.nameAr || project.name}
            </h1>
            
            <div className="bg-white rounded-2xl p-6 mb-6">
              <h3 className="font-medium text-gray-500 mb-2">الوصف</h3>
              <p className="text-lg">{project.description || "لا يوجد وصف"}</p>
            </div>

            {project.referenceImages && project.referenceImages.length > 0 && (
              <div className="bg-white rounded-2xl p-6">
                <h3 className="font-medium text-gray-500 mb-4">صور الإلهام</h3>
                <div className="grid grid-cols-3 gap-4">
                  {project.referenceImages.map((img, i) => (
                    <img
                      key={i}
                      src={img}
                      alt={`Reference ${i + 1}`}
                      className="aspect-square object-cover rounded-xl"
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Logo generation */}
        {activeStep === "logo" && (
          <div className="max-w-3xl">
            <h1 className="text-3xl font-bold mb-2">إنشاء الشعار</h1>
            <p className="text-gray-600 mb-8">
              اختر نموذج الذكاء الاصطناعي واكتب وصف الشعار المطلوب
            </p>

            {/* Model selection */}
            <div className="bg-white rounded-2xl p-6 mb-6">
              <h3 className="font-medium mb-4">اختر النموذج</h3>
              <div className="grid grid-cols-2 gap-4">
                {AI_MODELS.map((model) => (
                  <button
                    key={model.id}
                    onClick={() => setSelectedModel(model.id)}
                    className={`p-4 rounded-xl border-2 text-right transition ${
                      selectedModel === model.id
                        ? "border-[#0A0A0A] bg-gray-50"
                        : "border-gray-100 hover:border-gray-200"
                    }`}
                  >
                    <div className="font-medium">{model.name}</div>
                    <div className="text-gray-500 text-sm">{model.description}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Prompt */}
            <div className="bg-white rounded-2xl p-6 mb-6">
              <h3 className="font-medium mb-4">وصف الشعار</h3>
              <textarea
                value={logoPrompt}
                onChange={(e) => setLogoPrompt(e.target.value)}
                placeholder="شعار عصري لمقهى سعودي، يستخدم ألوان الترابي والذهبي، مع رمز النخلة..."
                rows={3}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-[#0A0A0A] transition resize-none"
              />
              <button
                onClick={handleGenerateLogo}
                disabled={!logoPrompt.trim() || generating}
                className="btn-primary w-full mt-4 py-3 disabled:opacity-40"
              >
                {generating ? "جاري التوليد..." : "توليد 4 خيارات ✨"}
              </button>
            </div>

            {/* Generated logos */}
            {generatedLogos.length > 0 && (
              <div className="bg-white rounded-2xl p-6">
                <h3 className="font-medium mb-4">اختر شعارك</h3>
                <div className="grid grid-cols-2 gap-4">
                  {generatedLogos.map((logo, i) => (
                    <button
                      key={i}
                      onClick={() => handleSelectLogo(logo)}
                      className="aspect-square bg-gray-50 rounded-xl border-2 border-transparent hover:border-[#D4A574] transition p-4"
                    >
                      <div className="w-full h-full flex items-center justify-center text-4xl">
                        🎨 {i + 1}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Design */}
        {activeStep === "design" && (
          <div className="max-w-3xl">
            <h1 className="text-3xl font-bold mb-2">الألوان والخطوط</h1>
            <p className="text-gray-600 mb-8">
              تم استخراج الألوان من شعارك. يمكنك تعديلها.
            </p>

            {/* Logo preview */}
            {project.logoUrl && (
              <div className="bg-white rounded-2xl p-6 mb-6 flex items-center gap-6">
                <div className="w-24 h-24 bg-gray-100 rounded-xl flex items-center justify-center">
                  🎨
                </div>
                <div>
                  <h3 className="font-semibold text-lg">{project.nameAr || project.name}</h3>
                  <p className="text-gray-500">{SECTORS[project.sector]}</p>
                </div>
              </div>
            )}

            {/* Color palette */}
            <div className="bg-white rounded-2xl p-6 mb-6">
              <h3 className="font-medium mb-4">لوحة الألوان</h3>
              <div className="flex gap-4">
                {["#D4A574", "#0A0A0A", "#F5F5F5", "#8B7355"].map((color) => (
                  <div key={color} className="flex flex-col items-center">
                    <div
                      className="w-20 h-20 rounded-xl border border-gray-100"
                      style={{ backgroundColor: color }}
                    />
                    <span className="text-xs text-gray-500 mt-2">{color}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Typography */}
            <div className="bg-white rounded-2xl p-6">
              <h3 className="font-medium mb-4">الخطوط</h3>
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <div className="text-sm text-gray-500 mb-2">العنوان</div>
                  <div className="text-2xl font-bold">Noto Sans Arabic</div>
                </div>
                <div>
                  <div className="text-sm text-gray-500 mb-2">النص</div>
                  <div className="text-xl">IBM Plex Sans Arabic</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Packaging */}
        {activeStep === "packaging" && (
          <div className="max-w-4xl">
            <h1 className="text-3xl font-bold mb-2">التعبئة والتغليف</h1>
            <p className="text-gray-600 mb-8">
              شاهد علامتك على منتجات حقيقية
            </p>

            {/* 3D viewer placeholder */}
            <div className="bg-white rounded-2xl p-8 mb-6">
              <div className="aspect-video bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl flex items-center justify-center">
                <div className="text-center">
                  <div className="text-6xl mb-4">📦</div>
                  <p className="text-gray-500">عارض 3D قادم قريباً</p>
                </div>
              </div>
            </div>

            {/* Packaging options */}
            <div className="grid grid-cols-3 gap-4">
              {["كوب ورقي", "صندوق", "كيس ورقي", "ملصق", "قائمة طعام", "بطاقة عمل"].map((item, i) => (
                <div
                  key={i}
                  className="bg-white rounded-2xl p-6 text-center cursor-pointer hover:shadow-md transition"
                >
                  <div className="text-4xl mb-3">
                    {["☕", "📦", "🛍️", "🏷️", "📋", "💳"][i]}
                  </div>
                  <div className="font-medium">{item}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Download */}
        {activeStep === "download" && (
          <div className="max-w-2xl">
            <h1 className="text-3xl font-bold mb-2">تحميل الملفات</h1>
            <p className="text-gray-600 mb-8">
              كل ملفات علامتك التجارية جاهزة
            </p>

            <div className="bg-white rounded-2xl p-6 mb-6">
              <h3 className="font-medium mb-4">الملفات المتاحة</h3>
              <div className="space-y-3">
                {[
                  { name: "الشعار", format: "SVG + PNG + PDF", size: "2.4 MB" },
                  { name: "بطاقة العمل", format: "PDF (جاهز للطباعة)", size: "1.2 MB" },
                  { name: "الكوب الورقي", format: "PDF (جاهز للطباعة)", size: "3.1 MB" },
                  { name: "لوحة الألوان", format: "PDF + ASE", size: "0.3 MB" },
                ].map((file, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between p-4 bg-gray-50 rounded-xl"
                  >
                    <div>
                      <div className="font-medium">{file.name}</div>
                      <div className="text-gray-500 text-sm">{file.format}</div>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="text-gray-400 text-sm">{file.size}</span>
                      <button className="text-[#D4A574] hover:text-[#c49666]">
                        ⬇️
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <button className="btn-primary w-full py-4 text-lg">
              تحميل الكل (ZIP) ⬇️
            </button>
          </div>
        )}
      </div>
    </main>
  );
}
