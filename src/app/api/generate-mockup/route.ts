import { NextRequest, NextResponse } from "next/server";
import { generateMockupSVG, getMockupType } from "@/lib/mockups";
import { generateMockupPrompt } from "@/lib/ai";

// POST /api/generate-mockup - Generate packaging mockup
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { mockupType, brandName, colors, sector, logoDescription } = body;

    const mockup = getMockupType(mockupType);
    if (!mockup) {
      return NextResponse.json(
        { error: "Invalid mockup type" },
        { status: 400 }
      );
    }

    const brandColors = colors || {
      primary: "#D4A574",
      secondary: "#0A0A0A",
      accent: "#8B7355",
    };

    // Generate SVG mockup preview
    const mockupImage = generateMockupSVG(mockupType, brandName, brandColors);

    // Generate detailed prompt using LLM (for future image gen integration)
    let prompt = "";
    try {
      const result = await generateMockupPrompt(
        brandName,
        mockup.nameEn,
        brandColors,
        sector || "general",
        logoDescription || "professional logo"
      );
      prompt = result.prompt;
    } catch {
      prompt = `Professional ${mockup.nameEn} mockup for ${brandName}`;
    }

    return NextResponse.json({
      mockupType: mockup.id,
      mockupName: mockup.name,
      image: mockupImage,
      prompt,
    });
  } catch (error) {
    console.error("Mockup generation error:", error);
    return NextResponse.json(
      { error: "Failed to generate mockup" },
      { status: 500 }
    );
  }
}
