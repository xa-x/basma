// Simple JSON-based storage for MVP
// Can be replaced with SQLite later

import { readFileSync, writeFileSync, existsSync, mkdirSync } from "fs";
import { join } from "path";

const DATA_DIR = join(process.cwd(), "data");
const PROJECTS_FILE = join(DATA_DIR, "projects.json");

// Ensure data directory exists
if (!existsSync(DATA_DIR)) {
  mkdirSync(DATA_DIR, { recursive: true });
}

// Initialize projects file if it doesn't exist
if (!existsSync(PROJECTS_FILE)) {
  writeFileSync(PROJECTS_FILE, JSON.stringify([], null, 2));
}

export interface Project {
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
  createdAt: number;
  updatedAt: number;
}

export interface ColorPalette {
  primary: string;
  secondary: string;
  accent: string;
  neutral: string;
  background: string;
}

function readProjects(): Project[] {
  try {
    const data = readFileSync(PROJECTS_FILE, "utf-8");
    return JSON.parse(data);
  } catch {
    return [];
  }
}

function writeProjects(projects: Project[]): void {
  writeFileSync(PROJECTS_FILE, JSON.stringify(projects, null, 2));
}

export const db = {
  projects: {
    findMany: async (): Promise<Project[]> => {
      return readProjects();
    },

    findUnique: async (id: string): Promise<Project | null> => {
      const projects = readProjects();
      return projects.find((p) => p.id === id) || null;
    },

    create: async (data: Omit<Project, "id" | "createdAt" | "updatedAt">): Promise<Project> => {
      const projects = readProjects();
      const now = Math.floor(Date.now() / 1000);
      const project: Project = {
        id: generateId(),
        ...data,
        createdAt: now,
        updatedAt: now,
      };
      projects.push(project);
      writeProjects(projects);
      return project;
    },

    update: async (id: string, data: Partial<Project>): Promise<Project | null> => {
      const projects = readProjects();
      const index = projects.findIndex((p) => p.id === id);
      if (index === -1) return null;
      
      projects[index] = {
        ...projects[index],
        ...data,
        updatedAt: Math.floor(Date.now() / 1000),
      };
      writeProjects(projects);
      return projects[index];
    },

    delete: async (id: string): Promise<boolean> => {
      const projects = readProjects();
      const index = projects.findIndex((p) => p.id === id);
      if (index === -1) return false;
      
      projects.splice(index, 1);
      writeProjects(projects);
      return true;
    },
  },
};

function generateId(): string {
  return Math.random().toString(36).substring(2, 12);
}
