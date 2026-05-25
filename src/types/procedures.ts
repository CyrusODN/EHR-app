export type ProcedureCategory = 'diagnostic' | 'therapeutic' | 'preventive' | 'surgical';
export type ProcedureStatus = 'planned' | 'in-progress' | 'completed' | 'cancelled';

export interface MedicalProcedure {
  id: string;
  name: string;
  category: ProcedureCategory;
  icd9Code: string;
  description: string;
  duration: number;
  requiredSpecialization: string[];
  contraindications: string[];
  preparationInstructions: string[];
  risks: string[];
  expectedOutcomes: string[];
  aftercareInstructions: string[];
  estimatedCost: number;
  refundationCode?: string;
}

export interface ScheduledProcedure extends MedicalProcedure {
  patientId: string;
  visitId: string;
  scheduledDate: string;
  status: ProcedureStatus;
  assignedDoctor: string;
  notes: string;
  results?: ProcedureResult;
}

export interface ProcedureResult {
  completionDate: string;
  findings: string;
  complications?: string[];
  recommendations: string[];
  attachments: ProcedureAttachment[];
}

export interface ProcedureAttachment {
  id: string;
  type: 'image' | 'document' | 'lab_result';
  name: string;
  url: string;
  uploadDate: string;
  description?: string;
}
