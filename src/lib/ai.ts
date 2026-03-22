import { openai } from "@ai-sdk/openai";
import { generateObject } from "ai";
import { z } from "zod";

// Analyze uploaded images and extract brand insights
export async function analyzeBrandImages(
  images: string[],
  sector: string,
  description: string
) {
  const { object } = await generateObject({
    model: openai("gpt-4o"),
    schema: z.object({
      vibe: z.string().describe("Overall brand vibe and personality (2-3 sentences)"),
      colors: z.object({
        primary: z.string().describe("Primary color hex code"),
        secondary: z.string().describe("Secondary color hex code"),
        accent: z.string().describe("Accent color hex code"),
        neutral: z.string().describe("Neutral color hex code"),
        background: z.string().describe("Background color hex code"),
      }),
      style: z.string().describe("Design style (minimal, bold, traditional, modern, etc.)"),
      keywords: z.array(z.string()).describe("Brand keywords for logo generation"),
      suggestions: z.array(z.string()).describe("3-5 suggestions for improvement"),
      targetAudience: z.string().describe("Inferred target audience"),
      competitors: z.array(z.string()).describe("Potential competitor brands"),
    }),
    messages: [
      {
        role: "system",
        content: `You are a brand strategist analyzing visual references for a ${sector} business in Saudi Arabia. 
        Consider Middle Eastern design preferences, cultural context, and local market trends.
        Respond in a mix of Arabic and English where appropriate.
        Be specific and actionable in your suggestions.`,
      },
      {
        role: "user",
        content: [
          { type: "text", text: `Business: ${description}\n\nAnalyze these brand reference images:` },
          ...images.map((img) => ({
            type: "image" as const,
            image: img,
          })),
        ],
      },
    ],
  });

  return object;
}

// Generate follow-up questions based on business info
export async function generateFollowUpQuestions(
  businessName: string,
  sector: string,
  description: string,
  brandAnalysis?: any
) {
  const { object } = await generateObject({
    model: openai("gpt-4o"),
    schema: z.object({
      questions: z.array(z.object({
        id: z.string(),
        question: z.string(),
        questionAr: z.string().optional(),
        type: z.enum(["text", "select", "multiselect"]),
        options: z.array(z.string()).optional(),
        reason: z.string(),
        priority: z.enum(["high", "medium", "low"]),
      })).max(5),
    }),
    messages: [
      {
        role: "system",
        content: `You are a brand consultant preparing questions for a client.
        Ask questions that will help create a better brand identity.
        Consider the Saudi market and cultural context.
        Provide questions in both Arabic and English.
        Focus on: target audience, brand values, visual preferences, and unique selling points.`,
      },
      {
        role: "user",
        content: `Business Name: ${businessName}
Sector: ${sector}
Description: ${description}
${brandAnalysis ? `Initial Analysis: ${JSON.stringify(brandAnalysis)}` : ""}

Generate 4-5 follow-up questions to better understand this brand.`,
      },
    ],
  });

  return object.questions;
}

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
    model: openai("gpt-4o"),
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

Generate a detailed prompt optimized for DALL-E 3, Stable Diffusion, and Flux.`,
      },
    ],
  });

  return object;
}

// Extract colors from image URL (simplified - in production use colorthief)
export async function extractColorsFromImage(imageUrl: string) {
  // TODO: Implement actual color extraction
  // For now, return a default palette
  return {
    primary: "#D4A574",
    secondary: "#0A0A0A",
    accent: "#8B7355",
    neutral: "#888888",
    background: "#F5F5F5",
  };
}
