import { NextRequest, NextResponse } from "next/server";
import { generateLogos, enhancePromptForModel, AI_MODELS, type ModelId } from "@/lib/logo-gen";

// POST /api/generate-logos - Generate logo options
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { prompt, model, businessName, sector, style } = body;

    const modelId = (model || "dalle3") as ModelId;

    // Enhance prompt for the selected model
    const enhancedPrompt = await enhancePromptForModel(
      prompt,
      modelId,
      businessName,
      sector,
      style
    );

    // Generate logos
    const logos = await generateLogos(enhancedPrompt, modelId, 4);

    return NextResponse.json({
      logos,
      prompt: enhancedPrompt,
      model: AI_MODELS[modelId],
    });
  } catch (error) {
    console.error("Logo generation error:", error);
    return NextResponse.json(
      { error: "Failed to generate logos" },
      { status: 500 }
    );
  }
}
