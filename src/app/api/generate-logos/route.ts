import { NextRequest, NextResponse } from "next/server";
import { generateLogos, enhancePrompt, LOGO_STYLES, type LogoStyleId } from "@/lib/logo-gen";

// POST /api/generate-logos - Generate logo options
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { businessName, sector, style, colors } = body;

    const styleId = (style || "minimal") as LogoStyleId;
    const styleConfig = LOGO_STYLES[styleId];

    const brandColors = colors || {
      primary: "#D4A574",
      secondary: "#0A0A0A",
      accent: "#8B7355",
    };

    // Generate enhanced prompt (optional, for future use)
    const enhancedPrompt = await enhancePrompt(
      businessName,
      sector,
      styleId,
      brandColors
    );

    // Generate styled SVG logos
    const logos = await generateLogos(businessName, styleId, brandColors, 4);

    return NextResponse.json({
      logos,
      prompt: enhancedPrompt,
      style: styleConfig,
    });
  } catch (error) {
    console.error("Logo generation error:", error);
    return NextResponse.json(
      { error: "Failed to generate logos" },
      { status: 500 }
    );
  }
}
