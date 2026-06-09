import { createOpenRouter } from "@openrouter/ai-sdk-provider";
import { generateObject } from "ai";
import { z } from "zod";

const openrouter = createOpenRouter({
  apiKey: process.env.OPENROUTER_API_KEY,
});

const MODEL = "google/gemini-2.0-flash-001";

// Simplified logo styles
export const LOGO_STYLES = {
  stylized: {
    id: "stylized",
    name: "مزخرف",
    nameEn: "Stylized",
    description: "شعار مزخرف وعصري مع تفاصيل فنية",
  },
  minimal: {
    id: "minimal",
    name: "بسيط",
    nameEn: "Minimal",
    description: "شعار بسيط ونظيف وعصري",
  },
} as const;

export type LogoStyleId = keyof typeof LOGO_STYLES;

// Generate a styled SVG logo placeholder
function generateStyledSVG(
  businessName: string,
  style: LogoStyleId,
  primaryColor: string,
  secondaryColor: string,
  variant: number
): string {
  const isMinimal = style === "minimal";

  const patterns = [
    // Variant 1: Icon + text horizontal
    isMinimal
      ? `<circle cx="256" cy="200" r="80" fill="${primaryColor}"/>
         <text x="256" y="380" text-anchor="middle" font-family="Arial, sans-serif" font-size="48" font-weight="bold" fill="${secondaryColor}">${escapeXml(businessName)}</text>`
      : `<rect x="176" y="120" width="160" height="160" rx="30" fill="${primaryColor}"/>
         <text x="256" y="220" text-anchor="middle" font-family="Arial, sans-serif" font-size="72" font-weight="bold" fill="white">ب</text>
         <text x="256" y="380" text-anchor="middle" font-family="Arial, sans-serif" font-size="48" font-weight="bold" fill="${secondaryColor}">${escapeXml(businessName)}</text>`,

    // Variant 2: Badge/roundel
    `<circle cx="256" cy="200" r="120" fill="${primaryColor}"/>
     <text x="256" y="220" text-anchor="middle" font-family="Arial, sans-serif" font-size="64" font-weight="bold" fill="white">${escapeXml(businessName.charAt(0))}</text>
     <text x="256" y="400" text-anchor="middle" font-family="Arial, sans-serif" font-size="36" fill="${secondaryColor}">${escapeXml(businessName)}</text>`,

    // Variant 3: Split/offset
    `<rect x="136" y="100" width="240" height="240" rx="20" fill="${primaryColor}" opacity="0.9"/>
     <rect x="156" y="120" width="200" height="200" rx="15" fill="white"/>
     <text x="256" y="240" text-anchor="middle" font-family="Arial, sans-serif" font-size="60" font-weight="bold" fill="${primaryColor}">${escapeXml(businessName.charAt(0))}</text>
     <text x="256" y="410" text-anchor="middle" font-family="Arial, sans-serif" font-size="40" fill="${secondaryColor}">${escapeXml(businessName)}</text>`,

    // Variant 4: Horizontal bar
    `<rect x="100" y="160" width="312" height="100" rx="12" fill="${primaryColor}"/>
     <text x="256" y="230" text-anchor="middle" font-family="Arial, sans-serif" font-size="56" font-weight="bold" fill="white">${escapeXml(businessName)}</text>
     <circle cx="256" cy="360" r="40" fill="${secondaryColor}"/>
     <text x="256" y="375" text-anchor="middle" font-family="Arial, sans-serif" font-size="36" fill="white">${escapeXml(businessName.charAt(0))}</text>`,
  ];

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="512" height="512">
    <rect width="512" height="512" fill="white"/>
    ${patterns[variant % patterns.length]}
  </svg>`;

  return `data:image/svg+xml;base64,${Buffer.from(svg).toString("base64")}`;
}

function escapeXml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

// Enhance prompt with LLM
export async function enhancePrompt(
  businessName: string,
  sector: string,
  style: LogoStyleId,
  colors: { primary: string; secondary: string; accent: string }
): Promise<string> {
  const styleInfo = LOGO_STYLES[style];

  const { object } = await generateObject({
    model: openrouter(MODEL),
    schema: z.object({
      enhancedPrompt: z.string(),
      negativePrompt: z.string(),
    }),
    messages: [
      {
        role: "system",
        content: `You are an expert prompt engineer for logo design.
        Create concise but detailed prompts for a ${styleInfo.nameEn} logo style.
        Logo should be: simple, scalable, works in black and white, memorable, relevant to the industry.`,
      },
      {
        role: "user",
        content: `Business: ${businessName}
Sector: ${sector}
Style: ${styleInfo.nameEn} - ${styleInfo.description}
Colors: Primary ${colors.primary}, Secondary ${colors.secondary}, Accent ${colors.accent}

Create an enhanced prompt for a professional ${styleInfo.nameEn} logo.`,
      },
    ],
  });

  return object.enhancedPrompt;
}

// Generate logos (returns styled SVGs)
export async function generateLogos(
  businessName: string,
  style: LogoStyleId,
  colors: { primary: string; secondary: string; accent: string },
  count: number = 4
): Promise<string[]> {
  return Array.from({ length: count }, (_, i) =>
    generateStyledSVG(businessName, style, colors.primary, colors.secondary, i)
  );
}
