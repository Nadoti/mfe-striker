import { supabase } from '@/lib/supabase';
import type {
  Transaction,
  CreateTransactionDTO,
  UpdateTransactionDTO,
  TransactionFilters,
  PaginationParams,
  PaginatedResponse,
} from '@/types/transaction';

export class TransactionService {
  static async getTransactions(
    filters?: TransactionFilters,
    pagination?: PaginationParams
  ): Promise<PaginatedResponse<Transaction>> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error('Usuário não autenticado');
      }

      let query = supabase
        .from('transactions')
        .select('*', { count: 'exact' })
        .eq('user_id', user.id);

      if (filters?.type) {
        query = query.eq('type', filters.type);
      }

      if (filters?.category) {
        query = query.eq('category', filters.category);
      }

      if (filters?.startDate) {
        query = query.gte('date', filters.startDate);
      }

      if (filters?.endDate) {
        query = query.lte('date', filters.endDate);
      }

      if (filters?.minAmount !== undefined) {
        query = query.gte('amount', filters.minAmount);
      }

      if (filters?.maxAmount !== undefined) {
        query = query.lte('amount', filters.maxAmount);
      }

      if (filters?.search) {
        query = query.or(
          `description.ilike.%${filters.search}%,category.ilike.%${filters.search}%`
        );
      }

      query = query.order('date', { ascending: false });
      query = query.order('created_at', { ascending: false });

      if (pagination) {
        const { page, limit } = pagination;
        const from = (page - 1) * limit;
        const to = from + limit - 1;
        query = query.range(from, to);
      }

      const { data, error, count } = await query;

      if (error) {
        throw error;
      }

      const total = count || 0;
      const limit = pagination?.limit || total;
      const page = pagination?.page || 1;
      const totalPages = Math.ceil(total / limit);

      return {
        data: data || [],
        total,
        page,
        limit,
        totalPages,
      };
    } catch (error: any) {
      console.error('Erro ao buscar transações:', error);
      throw new Error(error.message || 'Erro ao buscar transações');
    }
  }

  static async getTransactionById(id: string): Promise<Transaction | null> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error('Usuário não autenticado');
      }

      const { data, error } = await supabase
        .from('transactions')
        .select('*')
        .eq('id', id)
        .eq('user_id', user.id)
        .single();

      if (error) {
        throw error;
      }

      return data;
    } catch (error: any) {
      console.error('Erro ao buscar transação:', error);
      return null;
    }
  }

  static async createTransaction(
    transaction: CreateTransactionDTO
  ): Promise<Transaction> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error('Usuário não autenticado');
      }

      const { data, error } = await supabase
        .from('transactions')
        .insert({
          ...transaction,
          user_id: user.id,
        })
        .select()
        .single();

      if (error) {
        throw error;
      }

      return data;
    } catch (error: any) {
      console.error('Erro ao criar transação:', error);
      throw new Error(error.message || 'Erro ao criar transação');
    }
  }

  static async updateTransaction(
    transaction: UpdateTransactionDTO
  ): Promise<Transaction> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error('Usuário não autenticado');
      }

      const { id, ...updates } = transaction;

      const { data, error } = await supabase
        .from('transactions')
        .update(updates)
        .eq('id', id)
        .eq('user_id', user.id)
        .select()
        .single();

      if (error) {
        throw error;
      }

      return data;
    } catch (error: any) {
      console.error('Erro ao atualizar transação:', error);
      throw new Error(error.message || 'Erro ao atualizar transação');
    }
  }

  static async deleteTransaction(id: string): Promise<void> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error('Usuário não autenticado');
      }

      const { error } = await supabase
        .from('transactions')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id);

      if (error) {
        throw error;
      }
    } catch (error: any) {
      console.error('Erro ao deletar transação:', error);
      throw new Error(error.message || 'Erro ao deletar transação');
    }
  }

  static async getFinancialSummary(startDate?: string, endDate?: string) {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error('Usuário não autenticado');
      }

      let query = supabase
        .from('transactions')
        .select('type, amount')
        .eq('user_id', user.id);

      if (startDate) {
        query = query.gte('date', startDate);
      }

      if (endDate) {
        query = query.lte('date', endDate);
      }

      const { data, error } = await query;

      if (error) {
        throw error;
      }

      const summary = data.reduce(
        (acc, transaction) => {
          if (transaction.type === 'income') {
            acc.totalIncome += Number(transaction.amount);
          } else {
            acc.totalExpense += Number(transaction.amount);
          }
          return acc;
        },
        { totalIncome: 0, totalExpense: 0 }
      );

      return {
        ...summary,
        balance: summary.totalIncome - summary.totalExpense,
      };
    } catch (error: any) {
      console.error('Erro ao buscar resumo financeiro:', error);
      throw new Error(error.message || 'Erro ao buscar resumo financeiro');
    }
  }

  static async getTransactionsByCategory(type?: 'income' | 'expense') {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error('Usuário não autenticado');
      }

      let query = supabase
        .from('transactions')
        .select('category, amount, type')
        .eq('user_id', user.id);

      if (type) {
        query = query.eq('type', type);
      }

      const { data, error } = await query;

      if (error) {
        throw error;
      }

      const grouped = data.reduce((acc: any, transaction) => {
        const key = transaction.category;
        if (!acc[key]) {
          acc[key] = {
            category: key,
            total: 0,
            type: transaction.type,
          };
        }
        acc[key].total += Number(transaction.amount);
        return acc;
      }, {});

      return Object.values(grouped);
    } catch (error: any) {
      console.error('Erro ao buscar transações por categoria:', error);
      throw new Error(error.message || 'Erro ao buscar transações por categoria');
    }
  }
}

