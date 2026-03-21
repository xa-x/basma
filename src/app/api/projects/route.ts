import { db } from "@/db";
import { NextRequest, NextResponse } from "next/server";

// GET /api/projects - List all projects
export async function GET() {
  const projects = await db.projects.findMany();
  return NextResponse.json(projects);
}

// POST /api/projects - Create new project
export async function POST(req: NextRequest) {
  const body = await req.json();
  const { name, nameAr, sector, description, referenceImages } = body;
  
  const project = await db.projects.create({
    name: name || nameAr,
    nameAr: nameAr || null,
    sector,
    description: description || null,
    referenceImages: referenceImages || [],
    extractedColors: null,
    extractedFonts: [],
    brandVibe: null,
    logoUrl: null,
    logoPrompt: null,
    logoModel: null,
    patternId: null,
    primaryColor: null,
    secondaryColor: null,
    accentColor: null,
    selectedPackaging: [],
    status: "draft",
  });
  
  return NextResponse.json(project);
}
