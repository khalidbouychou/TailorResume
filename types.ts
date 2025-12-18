
export interface ResumeExperience {
  company: string;
  role: string;
  duration: string;
  location: string;
  bullets: string[];
}

export interface ResumeEducation {
  institution: string;
  degree: string;
  duration: string;
  location: string;
}

export interface ResumeData {
  personalInfo: {
    name: string;
    email: string;
    phone: string;
    linkedin?: string;
    portfolio?: string;
    location: string;
  };
  summary: string;
  experience: ResumeExperience[];
  education: ResumeEducation[];
  skills: {
    category: string;
    items: string[];
  }[];
}

export interface AdaptationResult {
  latexCode: string;
  previewData: ResumeData;
  groundingSources?: any[];
}

export enum AppStatus {
  IDLE = 'IDLE',
  GENERATING = 'GENERATING',
  SUCCESS = 'SUCCESS',
  ERROR = 'ERROR'
}
