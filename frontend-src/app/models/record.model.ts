export interface VerificationRecord {
  id: string;
  candidateName: string;
  position: string;
  status: 'Verified' | 'Pending' | 'In Progress' | 'Failed';
  riskLevel: 'Low' | 'Medium' | 'High';
  verifiedDate: string | null;
  checks: number;
  assignedTo: string;
}

export interface DashboardStats {
  totalRecords: number;
  verified: number;
  pending: number;
  inProgress: number;
  failed: number;
  totalUsers: number;
}
