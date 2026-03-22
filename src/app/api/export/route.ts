import { NextRequest, NextResponse } from "next/server";
import {
  generateBrandKitZip,
  generateBusinessCard,
  generatePdf,
  type BrandKit,
  type ExportOptions,
} from "@/lib/export";

// POST /api/export - Generate export files
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { type, brandKit, options } = body as {
      type: "zip" | "pdf" | "business-card";
      brandKit: BrandKit;
      options?: Partial<ExportOptions>;
    };

    const defaultOptions: ExportOptions = {
      format: "pdf",
      size: "a4",
      dpi: 300,
      bleed: true,
      cropMarks: true,
      ...options,
    };

    let blob: Blob;
    let filename: string;

    switch (type) {
      case "zip":
        blob = await generateBrandKitZip(brandKit);
        filename = `brand-kit-${Date.now()}.zip`;
        break;

      case "business-card":
        blob = await generateBusinessCard(brandKit, defaultOptions);
        filename = `business-card-${Date.now()}.pdf`;
        break;

      case "pdf":
      default:
        blob = await generatePdf(brandKit, defaultOptions);
        filename = `brand-kit-${Date.now()}.pdf`;
        break;
    }

    // Convert blob to base64 for JSON response
    const buffer = await blob.arrayBuffer();
    const base64 = Buffer.from(buffer).toString("base64");

    return NextResponse.json({
      data: base64,
      filename,
      mimeType: blob.type,
      size: blob.size,
    });
  } catch (error) {
    console.error("Export error:", error);
    return NextResponse.json(
      { error: "Failed to generate export" },
      { status: 500 }
    );
  }
}
