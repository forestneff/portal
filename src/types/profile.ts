export type ThemeMode = 'stone' | 'dark';
export type LockItMode = 'astrolabe' | 'analog' | 'none';
export type PersonaTemplate = 'slides' | 'gallery' | 'text' | 'custom';
export type ProfileStatus = 'draft' | 'published' | 'archived';

export interface SiteConfig {
  theme: ThemeMode;
  animSpeed: string;
  bgImage: string;
  fontHead: string;
  fontBody: string;
  lockitMode: LockItMode;
}

export interface ProfileBio {
  name: string;
  title?: string;
  image: string;
  email: string;
  site: string;
  bio: string[];
  socials: Array<{
    name: string;
    link: string;
    icon?: string;
  }>;
}

export interface Persona {
  label: string;
  tag: string;
  title: string;
  desc: string;
  icon: string;
  slideTitle?: string;
  pTitle?: string;
  pContent?: string;
  template: PersonaTemplate;
}

export interface PortfolioAsset {
  label: string;
  url: string;
}

export interface PortfolioItem {
  id: number | string;
  title: string;
  type: string;
  icon: string;
  metaIcon?: string;
  metaImage?: string;
  desc: string;
  link: string;
  doc?: string;
  repo?: string;
  cats: string[];
  featured: boolean;
  featuredIn?: string[];
  assets?: PortfolioAsset[];
}

export interface GalleryItem {
  id: number | string;
  title: string;
  type: string;
  image: string;
  featured: boolean;
}

export interface CustomPage {
  slug: string;
  title: string;
  subtitle?: string;
  date: string;
  excerpt?: string;
  content: string;
  coverImage?: string;
}

export interface VersionLog {
  version: string;
  date: string;
  label?: string;
  notes: string[];
}

export interface SiteProfile {
  id: string;
  version: string;
  status: ProfileStatus;
  title: string;
  createdAt: string;
  updatedAt: string;
  config: SiteConfig;
  profile: ProfileBio;
  personas: Record<string, Persona>;
  portfolio: PortfolioItem[];
  galleries: Record<string, GalleryItem[]>;
  customPages?: CustomPage[];
  versionHistory?: VersionLog[];
}
