// Simple JSON-based storage for MVP
// Can migrate to SQLite when better-sqlite3 supports Node 25

import { readFileSync, writeFileSync, existsSync, mkdirSync } from "fs";
import { join } from "path";

const DATA_DIR = join(process.cwd(), "data");
const DB_FILE = join(DATA_DIR, "db.json");

interface DB {
  projects: Project[];
}

interface Project {
  id: string;
  name: string;
  nameAr: string | null;
  sector: string;
  description: string | null;
  referenceImages: string[];
  extractedColors: ColorPalette | null;
  extractedFonts: string[];
  brandVibe: string | null;
  logoUrl: string | null;
  logoPrompt: string | null;
  logoModel: string | null;
  patternId: string | null;
  primaryColor: string | null;
  secondaryColor: string | null;
  accentColor: string | null;
  selectedPackaging: string[];
  status: string;
  createdAt: string;
  updatedAt: string;
}

interface ColorPalette {
  primary: string;
  secondary: string;
  accent: string;
  neutral: string;
  background: string;
}

// Ensure data directory and DB file exist
if (!existsSync(DATA_DIR)) {
  mkdirSync(DATA_DIR, { recursive: true });
}

if (!existsSync(DB_FILE)) {
  writeFileSync(DB_FILE, JSON.stringify({ projects: [] }, null, 2));
}

function readDB(): DB {
  try {
    const data = readFileSync(DB_FILE, "utf-8");
    return JSON.parse(data);
  } catch {
    return { projects: [] };
  }
}

function writeDB(db: DB): void {
  writeFileSync(DB_FILE, JSON.stringify(db, null, 2));
}

// Database operations
export const db = {
  projects: {
    findMany: async (): Promise<Project[]> => {
      return readDB().projects;
    },

    findUnique: async (id: string): Promise<Project | null> => {
      const db = readDB();
      return db.projects.find((p) => p.id === id) || null;
    },

    create: async (data: Omit<Project, "id" | "createdAt" | "updatedAt">): Promise<Project> => {
      const db = readDB();
      const now = new Date().toISOString();
      const project: Project = {
        id: generateId(),
        ...data,
        createdAt: now,
        updatedAt: now,
      };
      db.projects.push(project);
      writeDB(db);
      return project;
    },

    update: async (id: string, data: Partial<Project>): Promise<Project | null> => {
      const db = readDB();
      const index = db.projects.findIndex((p) => p.id === id);
      if (index === -1) return null;

      db.projects[index] = {
        ...db.projects[index],
        ...data,
        updatedAt: new Date().toISOString(),
      };
      writeDB(db);
      return db.projects[index];
    },

    delete: async (id: string): Promise<boolean> => {
      const db = readDB();
      const index = db.projects.findIndex((p) => p.id === id);
      if (index === -1) return false;

      db.projects.splice(index, 1);
      writeDB(db);
      return true;
    },
  },
};

export type { Project, ColorPalette };

function generateId(): string {
  return Math.random().toString(36).substring(2, 12);
}
