export interface ColorPalette {
  primary: string;
  secondary: string;
  accent: string;
  neutral: string;
  background: string;
}

export function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : null;
}

export function rgbToHex(r: number, g: number, b: number): string {
  return "#" + [r, g, b].map((x) => x.toString(16).padStart(2, "0")).join("");
}

export async function extractColors(imageUrl: string): Promise<ColorPalette> {
  // TODO: Implement actual color extraction
  return {
    primary: "#D4A574",
    secondary: "#0A0A0A",
    accent: "#8B7355",
    neutral: "#888888",
    background: "#F5F5F5",
  };
}
