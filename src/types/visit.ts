export interface ICD10Diagnosis {
  code: string;
  name: string;
  classification: 'Primary' | 'Secondary';
  addedAt: string;
}

export interface VisitDiagnosis {
  icd10: ICD10Diagnosis[];
}
