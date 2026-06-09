"use client";

import { useState } from "react";
import { MOCKUP_TYPES, type MockupType } from "@/lib/mockups";
import { Button, Card } from "@/components/ui";
import { Loader2, Sparkles } from "lucide-react";

interface MockupSelectorProps {
  brandName: string;
  colors: { primary: string; secondary: string; accent: string };
  sector: string;
  logoUrl: string | null;
  onMockupGenerated?: (mockupType: string, imageUrl: string) => void;
}

export function MockupSelector({
  brandName,
  colors,
  sector,
  logoUrl,
  onMockupGenerated,
}: MockupSelectorProps) {
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [generatedMockups, setGeneratedMockups] = useState<
    Record<string, { image: string; prompt: string }>
  >({});
  const [loading, setLoading] = useState(false);

  const handleGenerate = async (type: string) => {
    setSelectedType(type);
    setLoading(true);

    try {
      const res = await fetch("/api/generate-mockup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          mockupType: type,
          brandName,
          colors,
          sector,
          logoDescription: logoUrl ? "Custom logo" : "Professional logo",
        }),
      });

      const data = await res.json();
      setGeneratedMockups((prev) => ({
        ...prev,
        [type]: { image: data.image, prompt: data.prompt },
      }));

      onMockupGenerated?.(type, data.image);
    } catch (error) {
      console.error("Mockup generation failed:", error);
    } finally {
      setLoading(false);
      setSelectedType(null);
    }
  };

  return (
    <div>
      {/* Mockup type grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
        {MOCKUP_TYPES.map((type) => (
          <button
            key={type.id}
            onClick={() => handleGenerate(type.id)}
            disabled={loading}
            className={`p-6 rounded-2xl border-2 text-center transition-all hover:border-accent ${
              generatedMockups[type.id]
                ? "border-primary bg-primary/5"
                : "border-border"
            } ${loading && selectedType === type.id ? "opacity-50" : ""}`}
          >
            <div className="text-4xl mb-3">{type.icon}</div>
            <div className="font-medium mb-1">{type.name}</div>
            <div className="text-gray-500 text-sm">{type.description}</div>
            {loading && selectedType === type.id && (
              <Loader2 className="w-5 h-5 mx-auto mt-2 animate-spin text-primary" />
            )}
          </button>
        ))}
      </div>

      {/* Generated mockups */}
      {Object.keys(generatedMockups).length > 0 && (
        <div className="space-y-6">
          <h3 className="text-lg font-semibold">الموك ابس المولّدة</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {Object.entries(generatedMockups).map(([typeId, data]) => {
              const type = MOCKUP_TYPES.find((t) => t.id === typeId);
              return (
                <Card key={typeId} className="overflow-hidden">
                  <div className="aspect-[4/3] bg-white flex items-center justify-center p-4">
                    <img
                      src={data.image}
                      alt={type?.name || typeId}
                      className="max-w-full max-h-full object-contain"
                    />
                  </div>
                  <div className="p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-2xl">{type?.icon}</span>
                      <span className="font-medium">{type?.name}</span>
                    </div>
                    <p className="text-sm text-gray-500 line-clamp-2">
                      {data.prompt}
                    </p>
                  </div>
                </Card>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
