
export enum View {
  Home = 'home',
  Consultation = 'consultation',
  FileAnalysis = 'file_analysis',
  Research = 'research',
  ContractDrafting = 'contract_drafting',
  Radar = 'radar',
  Resources = 'resources',
  DataProtection = 'data_protection',
  Contact = 'contact',
  Auth = 'auth'
}

export interface User {
  username: string;
  email: string;
  isVerified: boolean;
}

export interface Message {
  role: 'user' | 'model';
  text: string;
  timestamp: Date;
  sources?: { title: string, url: string }[];
  id: string; // معرف فريد للرسالة للسماح بالتصحيح
}

export interface OfficialResource {
  name: string;
  icon: string;
  url: string;
  description: string;
}

export interface RadarResult {
  text: string;
  sources: { title: string, url: string }[];
}

export interface LegalCorrection {
  originalQuery: string;
  correctedText: string;
  lawyerInfo?: string;
  timestamp: Date;
}

export interface LegalNotification {
  id: string;
  title: string;
  category: string;
  summary: string;
  date: string;
  relevance: string; // سبب التنبيه (مثلاً: بناءً على بحثك في القانون التجاري)
}
