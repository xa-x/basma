import { NextRequest, NextResponse } from "next/server";
import { analyzeBrandImages, generateFollowUpQuestions } from "@/lib/ai";

// POST /api/analyze - Analyze brand images and generate insights
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { businessName, images, sector, description } = body;

    if (!images || images.length === 0) {
      return NextResponse.json(
        { error: "No images provided" },
        { status: 400 }
      );
    }

    // Analyze images with AI
    const analysis = await analyzeBrandImages(images, sector, description);

    // Generate follow-up questions
    const questions = await generateFollowUpQuestions(
      businessName || "Your Business",
      sector,
      description,
      analysis
    );

    return NextResponse.json({
      analysis,
      questions,
    });
  } catch (error) {
    console.error("Analysis error:", error);
    return NextResponse.json(
      { error: "Failed to analyze images" },
      { status: 500 }
    );
  }
}
