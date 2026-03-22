import { NextRequest, NextResponse } from "next/server";
import { generateLogoPrompt } from "@/lib/ai";

// POST /api/logo-prompt - Generate logo creation prompt
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { businessName, nameAr, sector, description, style, colors, keywords } = body;

    const result = await generateLogoPrompt(
      businessName,
      nameAr,
      sector,
      description,
      style || "modern and clean",
      colors || {
        primary: "#D4A574",
        secondary: "#0A0A0A",
        accent: "#8B7355",
      },
      keywords || []
    );

    return NextResponse.json(result);
  } catch (error) {
    console.error("Logo prompt error:", error);
    return NextResponse.json(
      { error: "Failed to generate logo prompt" },
      { status: 500 }
    );
  }
}
