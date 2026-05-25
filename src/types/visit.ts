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
