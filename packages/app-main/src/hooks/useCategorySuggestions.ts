import { useState, useEffect, useMemo } from 'react';
import type { TransactionType } from '@/types/transaction';
import { INCOME_CATEGORIES, EXPENSE_CATEGORIES } from '@/types/transaction';

export function useCategorySuggestions(
  description: string,
  type: TransactionType
) {
  const [suggestions, setSuggestions] = useState<string[]>([]);

  const categoryKeywords = useMemo(() => ({
    'Salário': ['salário', 'salario', 'pagamento', 'vencimento', 'folha'],
    'Freelance': ['freelance', 'freela', 'projeto', 'cliente', 'trabalho extra'],
    'Investimentos': ['investimento', 'dividendo', 'ação', 'ações', 'fundo', 'renda fixa', 'cdb', 'tesouro'],
    'Vendas': ['venda', 'vendeu', 'mercado livre', 'olx', 'marketplace'],
    'Aluguel': ['aluguel', 'inquilino', 'locação'],
    
    'Alimentação': ['comida', 'almoço', 'jantar', 'café', 'restaurante', 'ifood', 'uber eats', 'delivery', 'supermercado', 'mercado', 'padaria', 'lanche'],
    'Transporte': ['uber', '99', 'taxi', 'gasolina', 'combustível', 'ônibus', 'metrô', 'estacionamento', 'pedágio', 'transporte'],
    'Moradia': ['aluguel', 'condomínio', 'condominio', 'iptu', 'água', 'luz', 'internet', 'energia', 'gás', 'gas'],
    'Saúde': ['médico', 'medico', 'hospital', 'farmácia', 'farmacia', 'remédio', 'remedio', 'consulta', 'exame', 'plano de saúde', 'plano'],
    'Educação': ['escola', 'faculdade', 'curso', 'livro', 'material escolar', 'mensalidade', 'matrícula', 'matricula'],
    'Lazer': ['cinema', 'show', 'viagem', 'passeio', 'festa', 'diversão', 'netflix', 'spotify', 'streaming', 'jogo', 'game'],
    'Compras': ['compra', 'comprei', 'loja', 'roupa', 'sapato', 'eletrônico', 'eletronico', 'magazine', 'shopping'],
    'Contas': ['conta', 'fatura', 'boleto', 'cartão', 'cartao', 'crédito', 'credito', 'débito', 'debito'],
  }), []);

  useEffect(() => {
    if (!description || description.length < 3) {
      setSuggestions([]);
      return;
    }

    const descLower = description.toLowerCase().trim();
    const categories = type === 'income' ? INCOME_CATEGORIES : EXPENSE_CATEGORIES;
    
    const matches: Array<{ category: string; score: number }> = [];

    categories.forEach((category) => {
      const keywords = categoryKeywords[category as keyof typeof categoryKeywords] || [];
      let score = 0;

      keywords.forEach((keyword) => {
        if (descLower.includes(keyword)) {
          score += descLower.startsWith(keyword) ? 3 : 2;
        }
      });

      if (score > 0) {
        matches.push({ category, score });
      }
    });

    matches.sort((a, b) => b.score - a.score);

    setSuggestions(matches.slice(0, 3).map((m) => m.category));
  }, [description, type, categoryKeywords]);

  return suggestions;
}

export function useAmountValidation(amount: number, type: TransactionType) {
  const [warning, setWarning] = useState<string | null>(null);

  useEffect(() => {
    if (amount <= 0) {
      setWarning(null);
      return;
    }

    if (type === 'expense' && amount > 50000) {
      setWarning('⚠️ Valor muito alto para uma despesa. Confirme se está correto.');
    } else if (type === 'income' && amount > 100000) {
      setWarning('⚠️ Valor muito alto para uma receita. Confirme se está correto.');
    } else {
      setWarning(null);
    }
  }, [amount, type]);

  return warning;
}

export function useDateValidation(date: string) {
  const [warning, setWarning] = useState<string | null>(null);

  useEffect(() => {
    if (!date) {
      setWarning(null);
      return;
    }

    const selectedDate = new Date(date);
    const today = new Date();
    const diffDays = Math.floor((today.getTime() - selectedDate.getTime()) / (1000 * 60 * 60 * 24));

    if (diffDays < 0) {
      setWarning('📅 Esta transação está no futuro.');
    } 
    else if (diffDays > 365) {
      setWarning('📅 Esta transação tem mais de 1 ano.');
    } else {
      setWarning(null);
    }
  }, [date]);

  return warning;
}

