import { Type } from "@google/genai";

export interface Project {
  id: string;
  title: string;
  category: string;
  description: string;
  fullDescription: string;
  technologies: string[];
  features: string[];
  status: "Completed" | "In Progress" | "Research";
  image: string;
  githubLink?: string;
  linkedinLink?: string;
  websiteLink?: string;
}

export interface LifeEvent {
  id: string;
  title: string;
  cursiveTitle?: string;
  description: string;
  image: string;
  date: string;
  category: string;
}

export interface WorkExperience {
  id: string;
  company: string;
  role: string;
  timespan: string;
  description: string;
  logo?: string;
}

export interface Research {
  id: string;
  title: string;
  description: string;
  fullDetails: string;
  date: string;
  image?: string;
  githubLink?: string;
  linkedinLink?: string;
  websiteLink?: string;
}

export interface Certificate {
  id: string;
  title: string;
  organization: string;
  image: string;
}

export interface SkillItem {
  name: string;
  level: number;
  tags?: string[];
}

export interface SkillCategory {
  id: string;
  category: "Programming" | "Embedded Systems" | "AI Tools" | "Vibe Coding Tools" | "Web Development" | "Research & Leadership";
  description?: string;
  skills: SkillItem[];
}

export interface BlogPost {
  id: string;
  title: string;
  thumbnail: string;
  preview: string;
  date: string;
}

export interface PortfolioSettings {
  profileImage: string;
  name: string;
  title: string;
  bio: string;
  cvUrl?: string;
  aboutText?: string;
  aboutImage?: string;
  blogVideoUrl?: string;
  stats?: {
    projectsCompleted: number;
    happyClients: number;
    yearsExperience: number;
    satisfactionRate: number;
  };
  socialLinks?: {
    github?: string;
    linkedin?: string;
    x?: string;
    dribbble?: string;
  };
  isMaintenanceMode?: boolean;
}

export interface QuickInfo {
  id: string;
  title: string;
  subtitle: string;
  icon: 'education' | 'focus' | 'location' | 'experience' | 'other';
  description: string;
}
