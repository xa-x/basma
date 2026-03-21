import { openai } from "@ai-sdk/openai";
import { generateText, generateObject } from "ai";
import { z } from "zod";

// AI-powered brand analysis
export async function analyzeBrandImages(images: string[]) {
  const { object } = await generateObject({
    model: openai("gpt-4o"),
    schema: z.object({
      vibe: z.string().describe("Overall brand vibe and personality"),
      colors: z.array(z.string()).describe("Dominant colors in the images"),
      style: z.string().describe("Design style (minimal, bold, traditional, etc.)"),
      suggestions: z.array(z.string()).describe("Suggestions for improvement"),
    }),
    prompt: `Analyze these brand images and describe the brand personality, colors, and style. Images: ${images.join(", ")}`,
  });

  return object;
}

// AI logo prompt generation
export async function generateLogoPrompt(
  businessName: string,
  sector: string,
  description: string,
  style?: string
) {
  const { text } = await generateText({
    model: openai("gpt-4o"),
    prompt: `Create a detailed logo design prompt for:
    
Business: ${businessName}
Sector: ${sector}
Description: ${description}
Style: ${style || "modern and clean"}

The prompt should be specific, describing:
- Visual elements
- Color palette
- Typography style
- Overall feel

Keep it concise (2-3 sentences) and optimized for AI image generation.`,
  });

  return text;
}

// AI follow-up questions
export async function generateFollowUpQuestions(
  businessName: string,
  sector: string,
  description: string
) {
  const { object } = await generateObject({
    model: openai("gpt-4o"),
    schema: z.object({
      questions: z.array(z.object({
        question: z.string(),
        reason: z.string(),
      })).max(5),
    }),
    prompt: `Generate 3-5 follow-up questions to better understand this business:
    
Business: ${businessName}
Sector: ${sector}
Description: ${description}

Ask about:
- Target audience
- Competitors
- Brand values
- Visual preferences
- Unique selling points

Questions should be in Arabic when appropriate for a Saudi market.`,
  });

  return object.questions;
}
