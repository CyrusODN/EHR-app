export interface ICD10Diagnosis {
  code: string;
  name: string;
  classification: 'Primary' | 'Secondary';
  addedAt: string;
}

export interface VisitDiagnosis {
  icd10: ICD10Diagnosis[];
}

export interface Medication {
  id: string;
  name: string;
  commonName: string;
  form: string;
  dose: string;
  package: string;
  ean: string;
  commonDosage: string;
  refundationCategories: string[];
  selectedRefundation?: string;
}

export interface PrescriptionMedication {
  name: string;
  commonName: string;
  form: string;
  dose: string;
  package: string;
  ean: string;
  dosage: string;
  quantity: number;
  refundation: string;
  instructions: string;
}

export interface Prescription {
  id: string;
  medications: PrescriptionMedication[];
  status: 'draft' | 'signed';
  type: string;
  additionalRights: string[];
  refillCount: number;
  signedAt?: string;
  signatureMethod?: string;
}

export interface SickLeaveEmployer {
  id: string;
  name: string;
  nip: string;
  hasPue: boolean;
}

export interface SickLeave {
  startDate: string;
  endDate: string;
  reason: string;
  recommendations: string;
  icdCode: string;
  statisticalNumber: string;
  literalCodes: string[];
  isHospitalization: boolean;
  hospitalizationStart?: string;
  hospitalizationEnd?: string;
  employers?: SickLeaveEmployer[];
  status?: 'draft' | 'signed';
  signedAt?: string;
}

export interface Referral {
  specialization: string;
  reason: string;
  urgency?: 'normal' | 'urgent' | 'immediate';
  additionalNotes?: string;
}

export interface MedicationScheduleEntry {
  medication: {
    id: string;
    name: string;
    commonDosage?: string;
  };
  instructions: string;
  duration?: string;
  reminders?: {
    enabled: boolean;
    times: string[];
  };
}

export interface ScaleSchedule {
  scale: string;
  frequencyDays: number;
  startDate: string;
  endDate?: string;
  reminderEnabled: boolean;
}

export interface AIAssistanceFeatures {
  moodTracking: boolean;
  medicationReminders: boolean;
  crisisIntervention: boolean;
  copingStrategies: boolean;
}

export interface PortalRecommendation {
  medications: MedicationScheduleEntry[];
  scales: ScaleSchedule[];
  aiAssistance: {
    enabled: boolean;
    features: AIAssistanceFeatures;
  };
  emergencyContacts: boolean;
  specialization?: string;
}

export interface NextVisit {
  date: string;
  startTime: string;
  endTime: string;
  visitId?: string;
  status?: string;
  doctor?: any;
  patient?: any;
}
