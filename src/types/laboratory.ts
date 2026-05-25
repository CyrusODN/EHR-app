export type LabTestStatus = 'ordered' | 'collected' | 'in_progress' | 'completed' | 'cancelled';
export type LabTestPriority = 'routine' | 'urgent' | 'stat';
export type LabTestCategory = 'biochemistry' | 'hematology' | 'microbiology' | 'immunology' | 'other';

export interface LabTest {
  id: string;
  code: string;
  name: string;
  category: LabTestCategory;
  description: string;
  normalRange?: {
    min: number;
    max: number;
    unit: string;
  };
  preparationInstructions?: string[];
  turnaroundTime: number;
  cost: number;
  refundationCode?: string;
}

export interface LabOrder {
  id: string;
  patientId: string;
  visitId: string;
  orderedBy: string;
  orderedAt: string;
  priority: LabTestPriority;
  status: LabTestStatus;
  tests: OrderedTest[];
  collectionDetails?: {
    collectedAt: string;
    collectedBy: string;
    notes: string;
  };
  results?: LabResults;
}

export interface OrderedTest extends LabTest {
  orderNotes?: string;
  scheduledDate?: string;
}

export interface LabResults {
  id: string;
  orderId: string;
  completedAt: string;
  verifiedBy: string;
  verifiedAt: string;
  testResults: TestResult[];
  interpretation?: string;
  attachments: LabAttachment[];
  criticalValues: boolean;
}

export interface TestResult {
  testId: string;
  testName?: string;
  value: number | string;
  unit: string;
  referenceRange?: string;
  flag?: 'normal' | 'high' | 'low' | 'critical';
  notes?: string;
}

export interface LabAttachment {
  id: string;
  type: 'report' | 'image' | 'raw_data';
  name: string;
  url: string;
  uploadedAt: string;
  description?: string;
}
