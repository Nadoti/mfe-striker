export type TransactionType = 'income' | 'expense';

export interface TransactionAttachment {
  name: string;
  url: string;
  type: string;
  size: number;
  uploadedAt: string;
}

export interface Transaction {
  id: string;
  user_id: string;
  type: TransactionType;
  category: string;
  amount: number;
  description?: string;
  date: string;
  attachments?: TransactionAttachment[];
  created_at: string;
  updated_at: string;
}

export interface CreateTransactionDTO {
  type: TransactionType;
  category: string;
  amount: number;
  description?: string;
  date: string;
  attachments?: TransactionAttachment[];
}

export interface UpdateTransactionDTO extends Partial<CreateTransactionDTO> {
  id: string;
}

export interface TransactionFilters {
  type?: TransactionType;
  category?: string;
  startDate?: string;
  endDate?: string;
  minAmount?: number;
  maxAmount?: number;
  search?: string;
}

export interface PaginationParams {
  page: number;
  limit: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// Categorias padrão
export const INCOME_CATEGORIES = [
  'Salário',
  'Freelance',
  'Investimentos',
  'Vendas',
  'Aluguel',
  'Outros',
] as const;

export const EXPENSE_CATEGORIES = [
  'Alimentação',
  'Transporte',
  'Moradia',
  'Saúde',
  'Educação',
  'Lazer',
  'Compras',
  'Contas',
  'Outros',
] as const;

