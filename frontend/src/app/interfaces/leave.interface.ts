// Leave management interfaces that match backend DTOs

export interface LeaveResponse {
  id: number;
  userId: number;
  userName?: string;
  userEmail?: string;
  leaveType: string;
  startDate: string;
  endDate: string;
  duration: number;
  reason?: string;
  status: string;
  approvedBy?: number;
  approvedByName?: string;
  approvedAt?: string;
  comments?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateLeaveRequest {
  leaveType: string;
  startDate: string;
  endDate: string;
  duration: number;
  reason?: string;
}

export interface ApproveLeaveRequest {
  status: string; // APPROVED or REJECTED
  comments?: string;
}

export interface LeaveBalance {
  annualRemaining: number;
  sickRemaining: number;
  casualRemaining: number;
  annualUsed: number;
  sickUsed: number;
  casualUsed: number;
}

export interface User {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  active: boolean;
  annualLeaveBalance?: number;
  sickLeaveBalance?: number;
  casualLeaveBalance?: number;
  createdAt: string;
  updatedAt: string;
}

export interface AdminStats {
  userCount: number;
  leaveCount: number;
  pendingLeaves: number;
  approvedLeaves: number;
  rejectedLeaves: number;
}

export enum LeaveType {
  ANNUAL = 'ANNUAL',
  SICK = 'SICK',
  CASUAL = 'CASUAL',
  EMERGENCY = 'EMERGENCY'
}

export enum LeaveStatus {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED'
} 