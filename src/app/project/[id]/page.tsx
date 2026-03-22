"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Button, Card } from "@/components/ui";
import {
  ArrowRight,
  Sparkles,
  Loader2,
  Palette,
  Package,
  Download,
  RefreshCw,
} from "lucide-react";
import { AI_MODELS, type ModelId } from "@/lib/logo-gen";

interface Project {
  id: string;
  name: string;
  nameAr: string | null;
  sector: string;
  description: string | null;
  brandVibe: string | null;
  extractedColors: {
    primary: string;
    secondary: string;
    accent: string;
    neutral: string;
    background: string;
  } | null;
  logoUrl: string | null;
  logoPrompt: string | null;
  logoModel: string | null;
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

export default function ProjectPage() {
  const params = useParams();
  const router = useRouter();
  const [project, setProject] = useState<Project | null>(null);
  const [activeStep, setActiveStep] = useState("logo");
  const [loading, setLoading] = useState(false);

  // Logo generation state
  const [selectedModel, setSelectedModel] = useState<ModelId>("dalle3");
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
    if (!logoPrompt.trim() || !project) return;
    setGenerating(true);

    try {
      const res = await fetch("/api/generate-logos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: logoPrompt,
          model: selectedModel,
          businessName: project.nameAr || project.name,
          sector: project.sector,
          style: project.brandVibe,
        }),
      });

      const data = await res.json();
      setGeneratedLogos(data.logos);
    } catch (error) {
      console.error("Logo generation failed:", error);
    } finally {
      setGenerating(false);
    }
  };

  const handleSelectLogo = async (logoUrl: string) => {
    if (!project) return;

    await fetch(`/api/projects/${params.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        logoUrl,
        logoPrompt,
        logoModel: selectedModel,
        status: "logo",
      }),
    });

    fetchProject();
    setActiveStep("design");
  };

  if (!project) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin" />
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
    <main className="min-h-screen bg-secondary/30">
      {/* Sidebar */}
      <aside className="fixed right-0 top-0 bottom-0 w-72 bg-white border-l border-border overflow-y-auto">
        <div className="p-6">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">ب</span>
            </div>
            <span className="text-xl font-semibold">بصمة</span>
          </Link>

          {/* Project info */}
          <div className="mb-8 p-4 bg-secondary rounded-xl">
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
                    ? "bg-primary text-white"
                    : "hover:bg-secondary text-gray-700"
                }`}
              >
                <span>{step.icon}</span>
                <span className="font-medium">{step.label}</span>
              </button>
            ))}
          </nav>

          {/* Back to home */}
          <div className="mt-8 pt-8 border-t border-border">
            <Link
              href="/"
              className="text-gray-500 hover:text-black text-sm flex items-center gap-2"
            >
              <ArrowRight className="w-4 h-4" /> الرئيسية
            </Link>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <div className="mr-72 p-8">
        {/* Overview */}
        {activeStep === "overview" && (
          <div className="max-w-2xl animate-fadeIn">
            <h1 className="text-3xl font-bold mb-6">
              {project.nameAr || project.name}
            </h1>

            <Card className="mb-6">
              <h3 className="font-medium text-gray-500 mb-2">الوصف</h3>
              <p className="text-lg">{project.description || "لا يوجد وصف"}</p>
            </Card>

            {project.brandVibe && (
              <Card className="mb-6">
                <h3 className="font-medium text-gray-500 mb-2">الشعور العام</h3>
                <p className="text-lg">{project.brandVibe}</p>
              </Card>
            )}

            {project.extractedColors && (
              <Card>
                <h3 className="font-medium text-gray-500 mb-4">لوحة الألوان</h3>
                <div className="flex gap-4">
                  {Object.entries(project.extractedColors).map(([name, color]) => (
                    <div key={name} className="flex flex-col items-center">
                      <div
                        className="w-16 h-16 rounded-xl border border-border"
                        style={{ backgroundColor: color as string }}
                      />
                      <span className="text-xs text-gray-500 mt-2 capitalize">
                        {name}
                      </span>
                    </div>
                  ))}
                </div>
              </Card>
            )}
          </div>
        )}

        {/* Logo generation */}
        {activeStep === "logo" && (
          <div className="max-w-3xl animate-fadeIn">
            <h1 className="text-3xl font-bold mb-2">إنشاء الشعار</h1>
            <p className="text-gray-600 mb-8">
              اختر نموذج الذكاء الاصطناعي واكتب وصف الشعار المطلوب
            </p>

            {/* Model selection */}
            <Card className="mb-6">
              <h3 className="font-medium mb-4">اختر النموذج</h3>
              <div className="grid grid-cols-2 gap-4">
                {Object.entries(AI_MODELS).map(([id, model]) => (
                  <button
                    key={id}
                    onClick={() => setSelectedModel(id as ModelId)}
                    className={`p-4 rounded-xl border-2 text-right transition ${
                      selectedModel === id
                        ? "border-primary bg-primary/5"
                        : "border-border hover:border-gray-300"
                    }`}
                  >
                    <div className="font-medium">{model.name}</div>
                    <div className="text-gray-500 text-sm">{model.description}</div>
                  </button>
                ))}
              </div>
            </Card>

            {/* Prompt */}
            <Card className="mb-6">
              <h3 className="font-medium mb-4">وصف الشعار</h3>
              <textarea
                value={logoPrompt}
                onChange={(e) => setLogoPrompt(e.target.value)}
                placeholder="شعار عصري لمقهى سعودي، يستخدم ألوان الترابي والذهبي، مع رمز النخلة..."
                rows={3}
                className="w-full px-4 py-3 border border-border rounded-xl focus:border-primary focus:outline-none transition resize-none"
              />
              <Button
                onClick={handleGenerateLogo}
                disabled={!logoPrompt.trim() || generating}
                className="w-full mt-4 py-3"
              >
                {generating ? (
                  <>
                    <Loader2 className="w-5 h-5 ml-2 animate-spin" />
                    جاري التوليد...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-5 h-5 ml-2" />
                    توليد 4 خيارات
                  </>
                )}
              </Button>
            </Card>

            {/* Generated logos */}
            {generatedLogos.length > 0 && (
              <Card>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-medium">اختر شعارك</h3>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleGenerateLogo}
                    disabled={generating}
                  >
                    <RefreshCw className="w-4 h-4 ml-2" />
                    توليد مجدداً
                  </Button>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  {generatedLogos.map((logo, i) => (
                    <button
                      key={i}
                      onClick={() => handleSelectLogo(logo)}
                      className="aspect-square bg-secondary rounded-xl border-2 border-transparent hover:border-accent transition p-4 group"
                    >
                      <div className="w-full h-full flex items-center justify-center">
                        <img
                          src={logo}
                          alt={`Logo ${i + 1}`}
                          className="max-w-full max-h-full object-contain rounded-lg"
                        />
                      </div>
                      <div className="text-center mt-2 text-sm text-gray-500 opacity-0 group-hover:opacity-100 transition">
                        اضغط للاختيار
                      </div>
                    </button>
                  ))}
                </div>
              </Card>
            )}
          </div>
        )}

        {/* Design */}
        {activeStep === "design" && (
          <div className="max-w-3xl animate-fadeIn">
            <h1 className="text-3xl font-bold mb-2">الألوان والخطوط</h1>
            <p className="text-gray-600 mb-8">
              تم استخراج الألوان من شعارك. يمكنك تعديلها.
            </p>

            {/* Logo preview */}
            {project.logoUrl && (
              <Card className="mb-6 flex items-center gap-6">
                <div className="w-24 h-24 bg-secondary rounded-xl flex items-center justify-center">
                  <img
                    src={project.logoUrl}
                    alt="Logo"
                    className="max-w-full max-h-full object-contain"
                  />
                </div>
                <div>
                  <h3 className="font-semibold text-lg">
                    {project.nameAr || project.name}
                  </h3>
                  <p className="text-gray-500">{SECTORS[project.sector]}</p>
                </div>
              </Card>
            )}

            {/* Color palette */}
            <Card className="mb-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-medium">لوحة الألوان</h3>
                <Button variant="ghost" size="sm">
                  <Palette className="w-4 h-4 ml-2" />
                  تخصيص
                </Button>
              </div>
              <div className="flex gap-4">
                {project.extractedColors ? (
                  Object.entries(project.extractedColors).map(([name, color]) => (
                    <div key={name} className="flex flex-col items-center">
                      <div
                        className="w-20 h-20 rounded-xl border border-border"
                        style={{ backgroundColor: color as string }}
                      />
                      <span className="text-xs text-gray-500 mt-2">{color as string}</span>
                    </div>
                  ))
                ) : (
                  ["#D4A574", "#0A0A0A", "#F5F5F5", "#8B7355"].map((color, i) => (
                    <div key={i} className="flex flex-col items-center">
                      <div
                        className="w-20 h-20 rounded-xl border border-border"
                        style={{ backgroundColor: color }}
                      />
                      <span className="text-xs text-gray-500 mt-2">{color}</span>
                    </div>
                  ))
                )}
              </div>
            </Card>

            {/* Typography */}
            <Card>
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
            </Card>

            <div className="mt-8 flex justify-end">
              <Button onClick={() => setActiveStep("packaging")} size="lg">
                التالي: التعبئة والتغليف
                <ArrowRight className="w-4 h-4 mr-2" />
              </Button>
            </div>
          </div>
        )}

        {/* Packaging */}
        {activeStep === "packaging" && (
          <div className="max-w-4xl animate-fadeIn">
            <h1 className="text-3xl font-bold mb-2">التعبئة والتغليف</h1>
            <p className="text-gray-600 mb-8">شاهد علامتك على منتجات حقيقية</p>

            {/* 3D viewer placeholder */}
            <Card className="mb-6">
              <div className="aspect-video bg-gradient-to-br from-secondary to-gray-100 rounded-xl flex items-center justify-center">
                <div className="text-center">
                  <Package className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                  <p className="text-gray-500">عارض 3D قادم قريباً</p>
                </div>
              </div>
            </Card>

            {/* Packaging options */}
            <div className="grid grid-cols-3 gap-4">
              {[
                { name: "كوب ورقي", icon: "☕" },
                { name: "صندوق", icon: "📦" },
                { name: "كيس ورقي", icon: "🛍️" },
                { name: "ملصق", icon: "🏷️" },
                { name: "قائمة طعام", icon: "📋" },
                { name: "بطاقة عمل", icon: "💳" },
              ].map((item, i) => (
                <div
                  key={i}
                  className="bg-white rounded-2xl p-6 text-center cursor-pointer hover:shadow-md transition border border-border"
                >
                  <div className="text-4xl mb-3">{item.icon}</div>
                  <div className="font-medium">{item.name}</div>
                </div>
              ))}
            </div>

            <div className="mt-8 flex justify-end">
              <Button onClick={() => setActiveStep("download")} size="lg">
                التالي: التحميل
                <ArrowRight className="w-4 h-4 mr-2" />
              </Button>
            </div>
          </div>
        )}

        {/* Download */}
        {activeStep === "download" && (
          <div className="max-w-2xl animate-fadeIn">
            <h1 className="text-3xl font-bold mb-2">تحميل الملفات</h1>
            <p className="text-gray-600 mb-8">كل ملفات علامتك التجارية جاهزة</p>

            <Card className="mb-6">
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
                    className="flex items-center justify-between p-4 bg-secondary rounded-xl"
                  >
                    <div>
                      <div className="font-medium">{file.name}</div>
                      <div className="text-gray-500 text-sm">{file.format}</div>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="text-gray-400 text-sm">{file.size}</span>
                      <Button variant="ghost" size="sm">
                        <Download className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            <Button className="w-full py-4 text-lg">
              <Download className="w-5 h-5 ml-2" />
              تحميل الكل (ZIP)
            </Button>
          </div>
        )}
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
