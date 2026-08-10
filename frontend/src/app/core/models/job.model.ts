export type ContractType = 'CDI' | 'CDD' | 'INTERIM' | 'STAGE' | 'MISSION' | 'FREELANCE';
export type JobStatus = 'DRAFT' | 'PUBLISHED' | 'CLOSED';
export type ApplicationStatus = 'RECEIVED' | 'REVIEWING' | 'SHORTLISTED' | 'REJECTED' | 'HIRED';

export interface Job {
  id: number;
  title: string;
  department?: string;
  location: string;
  contractType: ContractType;
  experienceLevel?: string;
  description: string;
  responsibilities?: string;
  requirements?: string;
  salaryMin?: number;
  salaryMax?: number;
  status: JobStatus;
  createdAt: string;
  closingDate?: string;
  applicationCount: number;
}

export interface JobRequest {
  title: string;
  department?: string;
  location: string;
  contractType: ContractType;
  experienceLevel?: string;
  description: string;
  responsibilities?: string;
  requirements?: string;
  salaryMin?: number | null;
  salaryMax?: number | null;
  status: JobStatus;
  closingDate?: string | null;
}

export interface JobApplication {
  id: number;
  jobId: number;
  jobTitle: string;
  fullName: string;
  email: string;
  phone?: string;
  coverLetter?: string;
  cvOriginalName?: string;
  hasCv: boolean;
  status: ApplicationStatus;
  createdAt: string;
}

export const CONTRACT_LABELS: Record<ContractType, string> = {
  CDI: 'CDI',
  CDD: 'CDD',
  INTERIM: 'Intérim',
  STAGE: 'Stage',
  MISSION: 'Mission',
  FREELANCE: 'Freelance'
};

export const STATUS_LABELS: Record<ApplicationStatus, string> = {
  RECEIVED: 'Reçue',
  REVIEWING: 'En revue',
  SHORTLISTED: 'Présélectionnée',
  REJECTED: 'Rejetée',
  HIRED: 'Recrutée'
};

export const JOB_STATUS_LABELS: Record<JobStatus, string> = {
  DRAFT: 'Brouillon',
  PUBLISHED: 'Publiée',
  CLOSED: 'Fermée'
};
