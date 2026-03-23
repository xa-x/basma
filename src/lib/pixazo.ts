/**
 * Pixazo.ai Image Generation Provider
 * API Docs: https://api.pixazo.ai
 * Gateway: https://gateway.pixazo.ai
 */

const PIXAZO_BASE_URL = "https://gateway.pixazo.ai";

export const PIXAZO_MODELS = {
  "flux-1-schnell": {
    id: "flux-1-schnell",
    name: "Flux 1 Schnell",
    endpoint: "/getImage/v1/flux-1-schnell",
    description: "Fast, high-quality generation",
    supports: ["english"],
  },
  getSDXLImage: {
    id: "getSDXLImage",
    name: "SDXL",
    endpoint: "/getImage/v1/getSDXLImage",
    description: "Stable Diffusion XL - detailed, artistic",
    supports: ["english"],
  },
} as const;

export type PixazoModelId = keyof typeof PIXAZO_MODELS;

interface PixazoResponse {
  imageUrl?: string;
  image?: string;
  data?: string;
  error?: string;
  message?: string;
}

/**
 * Generate an image using Pixazo.ai API
 */
export async function generateWithPixazo(
  prompt: string,
  model: PixazoModelId = "flux-1-schnell",
  apiKey: string
): Promise<string> {
  const modelConfig = PIXAZO_MODELS[model];
  
  if (!modelConfig) {
    throw new Error(`Unknown Pixazo model: ${model}`);
  }

  const response = await fetch(`${PIXAZO_BASE_URL}${modelConfig.endpoint}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({ prompt }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Pixazo API error (${response.status}): ${errorText}`);
  }

  const data: PixazoResponse = await response.json();

  // Handle different response formats
  const imageUrl = data.imageUrl || data.image || data.data;
  
  if (!imageUrl) {
    throw new Error(`Pixazo returned no image: ${JSON.stringify(data)}`);
  }

  return imageUrl;
}

/**
 * Generate multiple images with Pixazo
 */
export async function generateMultipleWithPixazo(
  prompt: string,
  model: PixazoModelId,
  apiKey: string,
  count: number = 4
): Promise<string[]> {
  // Pixazo generates one image per request, so we make multiple calls
  const promises = Array.from({ length: count }, () =>
    generateWithPixazo(prompt, model, apiKey)
  );

  return Promise.all(promises);
}
