import { openai } from "@ai-sdk/openai";
import { generateObject } from "ai";
import { z } from "zod";

// Logo generation configurations for different models
export const AI_MODELS = {
  dalle3: {
    id: "dalle3",
    name: "DALL-E 3",
    provider: "OpenAI",
    description: "Photorealistic, versatile",
    supports: ["english", "arabic"],
  },
  sdxl: {
    id: "sdxl",
    name: "Stable Diffusion XL",
    provider: "Stability AI",
    description: "Artistic, stylized",
    supports: ["english"],
  },
  flux: {
    id: "flux",
    name: "Flux Pro",
    provider: "Replicate",
    description: "Creative, modern",
    supports: ["english"],
  },
  qwen: {
    id: "qwen",
    name: "Qwen-VL",
    provider: "Alibaba",
    description: "Arabic text expert",
    supports: ["english", "arabic"],
  },
} as const;

export type ModelId = keyof typeof AI_MODELS;

// Mock logo generation for MVP
function generateMockLogos(prompt: string, model: ModelId): string[] {
  const modelColors: Record<ModelId, string[]> = {
    dalle3: ["#3B82F6", "#10B981", "#8B5CF6", "#F59E0B"],
    sdxl: ["#EC4899", "#6366F1", "#14B8A6", "#F97316"],
    flux: ["#8B5CF6", "#EC4899", "#3B82F6", "#10B981"],
    qwen: ["#D4A574", "#0A0A0A", "#8B7355", "#F5F5F5"],
  };

  const colors = modelColors[model];
  const businessName = prompt.match(/Business:\s*([^\n]+)/)?.[1] || "Logo";

  return Array.from({ length: 4 }, (_, i) => {
    const color = colors[i % colors.length].slice(1);
    return `https://placehold.co/512x512/${color}/white?text=${encodeURIComponent(businessName)}`;
  });
}

// Generate logo prompt optimized for the selected model
export async function enhancePromptForModel(
  basePrompt: string,
  model: ModelId,
  businessName: string,
  sector: string,
  style?: string
): Promise<string> {
  const { object } = await generateObject({
    model: openai("gpt-4o"),
    schema: z.object({
      enhancedPrompt: z.string(),
      negativePrompt: z.string(),
    }),
    messages: [
      {
        role: "system",
        content: `You are an expert prompt engineer for AI image generation.
        Optimize the given prompt for ${AI_MODELS[model].name}.
        Consider the model's strengths: ${AI_MODELS[model].description}
        ${model === "qwen" ? "Optimize for Arabic text rendering if the business name is Arabic." : ""}
        Keep the prompt concise but detailed.
        Logo should be:
        - Simple and scalable
        - Works in black and white
        - Memorable
        - Relevant to the industry`,
      },
      {
        role: "user",
        content: `Business: ${businessName}
Sector: ${sector}
Style: ${style || "modern and clean"}
Base Prompt: ${basePrompt}

Create an enhanced prompt optimized for ${AI_MODELS[model].name}`,
      },
    ],
  });

  return object.enhancedPrompt;
}

// Generate logos with selected model
export async function generateLogos(
  prompt: string,
  model: ModelId,
  count: number = 4
): Promise<string[]> {
  // For MVP, use mock generation
  // TODO: Replace with actual API calls when keys are available
  return generateMockLogos(prompt, model);
}
