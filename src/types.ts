export type SplitType = '50_50' | '100_PAID_BY_ME' | '100_PAID_BY_OTHER' | 'CUSTOM';

export type UserRole = 'admin' | 'member';
export type MemberStatus = 'active' | 'pending';

export interface Member {
  id: string;
  name: string;
  email: string;
  avatar: string;
  role: UserRole;
  status: MemberStatus;
  income?: number; // For proportional splits
}

export interface Household {
  id: string;
  name: string;
  code: string;
  currency: string;
  defaultSplitRule: SplitType;
  createdDate: string;
  members: Member[];
  coverImage?: string;
}

export interface Category {
  id: string;
  name: string;
  definition?: string;
  icon: string;
  budgetLimit: number;
  color: string;
  subcategories: string[];
}

export type TransactionStatus = 'PAGADO' | 'PENDIENTE' | 'DEBES';

export interface ExpenseSplit {
  memberId: string;
  amount: number;
  percentage: number;
}

export interface Expense {
  id: string;
  title: string;
  amount: number;
  categoryId: string;
  subcategory?: string;
  paidById: string;
  date: string;
  status: TransactionStatus;
  notes?: string;
  receiptUrl?: string;
  splits: ExpenseSplit[];
  createdAt: string;
}

export interface SettlementRecord {
  id: string;
  date: string;
  period: string;
  totalAmount: number;
  paidBy: string;
  paidTo: string;
  note: string;
}

export type ActiveTab = 'inicio' | 'actividad' | 'presupuesto' | 'hogar';
