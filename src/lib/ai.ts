import { createOpenRouter } from "@openrouter/ai-sdk-provider";
import { generateObject } from "ai";
import { z } from "zod";

const openrouter = createOpenRouter({
  apiKey: process.env.OPENROUTER_API_KEY,
});

const MODEL = "google/gemini-2.0-flash-001";

// Generate enhanced logo prompt
export async function generateLogoPrompt(
  businessName: string,
  nameAr: string | null,
  sector: string,
  description: string,
  style: string,
  colors: { primary: string; secondary: string; accent: string },
  keywords: string[]
) {
  const { object } = await generateObject({
    model: openrouter(MODEL),
    schema: z.object({
      prompt: z.string().describe("Detailed logo generation prompt (3-4 sentences)"),
      promptAr: z.string().optional().describe("Arabic version of the prompt"),
      negativePrompt: z.string().describe("What to avoid in the logo"),
      suggestedStyles: z.array(z.string()).describe("3-5 style suggestions"),
    }),
    messages: [
      {
        role: "system",
        content: `You are a logo design expert creating prompts for AI image generation.
        Create detailed, specific prompts that will generate professional logos.
        Consider: Arabic typography if applicable, cultural sensitivity, scalability, and versatility.
        The logo should work on: business cards, packaging, signage, and digital media.`,
      },
      {
        role: "user",
        content: `Create a logo generation prompt for:

Business: ${businessName} ${nameAr ? `(${nameAr})` : ""}
Sector: ${sector}
Description: ${description}
Style: ${style}
Colors: Primary ${colors.primary}, Secondary ${colors.secondary}, Accent ${colors.accent}
Keywords: ${keywords.join(", ")}

Generate a detailed prompt for professional logo creation.`,
      },
    ],
  });

  return object;
}

// Generate mockup image prompt
export async function generateMockupPrompt(
  brandName: string,
  mockupType: string,
  colors: { primary: string; secondary: string; accent: string },
  sector: string,
  logoDescription: string
) {
  const { object } = await generateObject({
    model: openrouter(MODEL),
    schema: z.object({
      prompt: z.string().describe("Detailed mockup generation prompt (2-3 sentences)"),
      description: z.string().describe("Brief description of what the mockup shows"),
    }),
    messages: [
      {
        role: "system",
        content: `You are a packaging design expert creating detailed image prompts for product mockups.
        Create prompts that describe professional, photorealistic product packaging.
        Consider the Saudi/Middle Eastern market and cultural context.`,
      },
      {
        role: "user",
        content: `Create a mockup prompt for:
Brand: ${brandName}
Mockup type: ${mockupType}
Colors: Primary ${colors.primary}, Secondary ${colors.secondary}, Accent ${colors.accent}
Sector: ${sector}
Logo description: ${logoDescription}

Generate a detailed prompt for a professional ${mockupType} mockup.`,
      },
    ],
  });

  return object;
}

// Extract colors from image URL (placeholder)
export async function extractColorsFromImage(_imageUrl: string) {
  return {
    primary: "#D4A574",
    secondary: "#0A0A0A",
    accent: "#8B7355",
    neutral: "#888888",
    background: "#F5F5F5",
  };
}
