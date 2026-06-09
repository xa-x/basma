// Packaging mockup types and generation helpers

export interface MockupType {
  id: string;
  name: string;
  nameEn: string;
  icon: string;
  description: string;
}

export const MOCKUP_TYPES: MockupType[] = [
  {
    id: "coffee-cup",
    name: "كوب قهوة",
    nameEn: "Coffee Cup",
    icon: "☕",
    description: "كوب ورقي مع سليف ماركة",
  },
  {
    id: "shopping-bag",
    name: "كيس تسوق",
    nameEn: "Shopping Bag",
    icon: "🛍️",
    description: "كيس ورقي للتسوق",
  },
  {
    id: "takeout-box",
    name: "علبة سفري",
    nameEn: "Takeout Box",
    icon: "📦",
    description: "علبة طعام سفري",
  },
  {
    id: "business-card",
    name: "بطاقة عمل",
    nameEn: "Business Card",
    icon: "💳",
    description: "بطاقة عمل أمام وخلف",
  },
  {
    id: "tshirt",
    name: "تيشيرت",
    nameEn: "T-Shirt",
    icon: "👕",
    description: "تيشيرت مع الشعار",
  },
  {
    id: "sauce-bottle",
    name: "قاروص صلصة",
    nameEn: "Sauce Bottle",
    icon: "🫙",
    description: "قاروص مع ملصق العلامة",
  },
];

export function getMockupType(id: string): MockupType | undefined {
  return MOCKUP_TYPES.find((m) => m.id === id);
}

// Generate a styled SVG mockup preview
export function generateMockupSVG(
  mockupType: string,
  brandName: string,
  colors: { primary: string; secondary: string; accent: string }
): string {
  const p = colors.primary;
  const s = colors.secondary;
  const a = colors.accent;
  const name = escapeXml(brandName);
  const initial = escapeXml(brandName.charAt(0));

  let mockupContent = "";

  switch (mockupType) {
    case "coffee-cup":
      mockupContent = `
        <ellipse cx="256" cy="380" rx="100" ry="20" fill="#e0e0e0"/>
        <path d="M156 180 Q156 380 176 380 L336 380 Q356 380 356 180 Z" fill="white" stroke="${p}" stroke-width="3"/>
        <ellipse cx="256" cy="180" rx="100" ry="25" fill="white" stroke="${p}" stroke-width="3"/>
        <rect x="176" y="240" width="160" height="80" fill="${p}" rx="8"/>
        <text x="256" y="270" text-anchor="middle" font-family="Arial, sans-serif" font-size="32" font-weight="bold" fill="white">${initial}</text>
        <text x="256" y="305" text-anchor="middle" font-family="Arial, sans-serif" font-size="16" fill="white">${name}</text>
        <path d="M356 220 Q380 220 380 270 Q380 320 356 320" fill="none" stroke="${p}" stroke-width="8" stroke-linecap="round"/>`;
      break;

    case "shopping-bag":
      mockupContent = `
        <rect x="120" y="140" width="272" height="280" rx="4" fill="${p}"/>
        <rect x="130" y="150" width="252" height="260" rx="2" fill="white"/>
        <rect x="130" y="150" width="252" height="6" fill="${p}"/>
        <path d="M190 140 Q190 80 256 80 Q322 80 322 140" fill="none" stroke="${p}" stroke-width="6" stroke-linecap="round"/>
        <text x="256" y="290" text-anchor="middle" font-family="Arial, sans-serif" font-size="48" font-weight="bold" fill="${p}">${initial}</text>
        <text x="256" y="340" text-anchor="middle" font-family="Arial, sans-serif" font-size="24" fill="${s}">${name}</text>`;
      break;

    case "takeout-box":
      mockupContent = `
        <path d="M120 200 L180 160 L332 160 L392 200 L392 380 L120 380 Z" fill="white" stroke="${p}" stroke-width="3"/>
        <path d="M120 200 L180 160 L332 160 L392 200" fill="${p}" opacity="0.15" stroke="${p}" stroke-width="3"/>
        <line x1="256" y1="160" x2="256" y2="200" stroke="${p}" stroke-width="2" stroke-dasharray="8,4"/>
        <rect x="186" y="260" width="140" height="80" fill="${p}" rx="8"/>
        <text x="256" y="300" text-anchor="middle" font-family="Arial, sans-serif" font-size="28" font-weight="bold" fill="white">${initial}</text>
        <text x="256" y="370" text-anchor="middle" font-family="Arial, sans-serif" font-size="18" fill="${s}">${name}</text>`;
      break;

    case "business-card":
      mockupContent = `
        <rect x="56" y="100" width="400" height="240" rx="12" fill="white" stroke="#e0e0e0" stroke-width="2"/>
        <rect x="56" y="100" width="400" height="6" fill="${p}" rx="3"/>
        <text x="256" y="200" text-anchor="middle" font-family="Arial, sans-serif" font-size="40" font-weight="bold" fill="${p}">${initial}</text>
        <text x="256" y="250" text-anchor="middle" font-family="Arial, sans-serif" font-size="22" fill="${s}">${name}</text>
        <rect x="56" y="380" width="400" height="240" rx="12" fill="${p}"/>
        <text x="256" y="490" text-anchor="middle" font-family="Arial, sans-serif" font-size="36" font-weight="bold" fill="white">${initial}</text>
        <line x1="180" y1="520" x2="332" y2="520" stroke="white" stroke-width="1" opacity="0.5"/>
        <text x="256" y="560" text-anchor="middle" font-family="Arial, sans-serif" font-size="18" fill="white" opacity="0.9">${name}</text>`;
      break;

    case "tshirt":
      mockupContent = `
        <path d="M160 160 L100 200 L130 260 L180 230 L180 420 L332 420 L332 230 L382 260 L412 200 L352 160 Q352 120 306 120 Q280 140 256 140 Q232 140 206 120 Q160 120 160 160 Z" fill="white" stroke="${p}" stroke-width="3"/>
        <circle cx="256" cy="290" r="50" fill="${p}"/>
        <text x="256" y="305" text-anchor="middle" font-family="Arial, sans-serif" font-size="40" font-weight="bold" fill="white">${initial}</text>
        <text x="256" y="380" text-anchor="middle" font-family="Arial, sans-serif" font-size="18" fill="${s}">${name}</text>`;
      break;

    case "sauce-bottle":
      mockupContent = `
        <rect x="216" y="100" width="80" height="30" rx="4" fill="${s}"/>
        <rect x="236" y="80" width="40" height="25" rx="10" fill="${s}"/>
        <path d="M196 130 L196 420 Q196 440 256 440 Q316 440 316 420 L316 130 Z" fill="${p}"/>
        <rect x="206" y="200" width="100" height="140" fill="white" rx="4"/>
        <text x="256" y="260" text-anchor="middle" font-family="Arial, sans-serif" font-size="32" font-weight="bold" fill="${p}">${initial}</text>
        <text x="256" y="310" text-anchor="middle" font-family="Arial, sans-serif" font-size="16" fill="${s}">${name}</text>`;
      break;

    default:
      mockupContent = `
        <rect x="100" y="100" width="312" height="312" rx="20" fill="${p}"/>
        <text x="256" y="280" text-anchor="middle" font-family="Arial, sans-serif" font-size="48" font-weight="bold" fill="white">${initial}</text>
        <text x="256" y="340" text-anchor="middle" font-family="Arial, sans-serif" font-size="20" fill="white">${name}</text>`;
  }

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 620" width="512" height="620">
    <rect width="512" height="620" fill="#f8f8f8"/>
    ${mockupContent}
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
