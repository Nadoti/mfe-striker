'use client';

import { useState, useEffect } from 'react';
import type { TransactionFilters } from '@/types/transaction';
import { INCOME_CATEGORIES, EXPENSE_CATEGORIES } from '@/types/transaction';
import { useDebounce } from '@/hooks/useDebounce';
import './transaction-filter.css';

interface Props {
  filters: TransactionFilters;
  onFiltersChange: (filters: TransactionFilters) => void;
}

export function TransactionFilter({ filters, onFiltersChange }: Props) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [searchInput, setSearchInput] = useState(filters.search || '');
  const [minAmountInput, setMinAmountInput] = useState(filters.minAmount?.toString() || '');
  const [maxAmountInput, setMaxAmountInput] = useState(filters.maxAmount?.toString() || '');
  
  // Debounce com 2 segundos
  const debouncedSearch = useDebounce(searchInput, 2000);
  const debouncedMinAmount = useDebounce(minAmountInput, 2000);
  const debouncedMaxAmount = useDebounce(maxAmountInput, 2000);

  // Atualizar filtros quando o debounced search mudar
  useEffect(() => {
    if (debouncedSearch !== filters.search) {
      onFiltersChange({
        ...filters,
        search: debouncedSearch || undefined,
      });
    }
  }, [debouncedSearch]);

  // Atualizar filtros quando o debounced minAmount mudar
  useEffect(() => {
    const numValue = minAmountInput ? Number(minAmountInput) : undefined;
    if (numValue !== filters.minAmount) {
      onFiltersChange({
        ...filters,
        minAmount: numValue,
      });
    }
  }, [debouncedMinAmount]);

  // Atualizar filtros quando o debounced maxAmount mudar
  useEffect(() => {
    const numValue = maxAmountInput ? Number(maxAmountInput) : undefined;
    if (numValue !== filters.maxAmount) {
      onFiltersChange({
        ...filters,
        maxAmount: numValue,
      });
    }
  }, [debouncedMaxAmount]);

  // Sincronizar searchInput quando filters.search mudar externamente
  useEffect(() => {
    if (filters.search !== searchInput && filters.search !== undefined) {
      setSearchInput(filters.search);
    } else if (filters.search === undefined && searchInput !== '') {
      setSearchInput('');
    }
  }, [filters.search]);

  // Sincronizar minAmountInput quando filters.minAmount mudar externamente
  useEffect(() => {
    const filterValue = filters.minAmount?.toString() || '';
    if (filterValue !== minAmountInput) {
      setMinAmountInput(filterValue);
    }
  }, [filters.minAmount]);

  // Sincronizar maxAmountInput quando filters.maxAmount mudar externamente
  useEffect(() => {
    const filterValue = filters.maxAmount?.toString() || '';
    if (filterValue !== maxAmountInput) {
      setMaxAmountInput(filterValue);
    }
  }, [filters.maxAmount]);

  const handleChange = (key: keyof TransactionFilters, value: any) => {
    onFiltersChange({
      ...filters,
      [key]: value || undefined,
    });
  };

  const clearFilters = () => {
    onFiltersChange({});
  };

  const hasActiveFilters = Object.keys(filters).length > 0;

  return (
    <div className="transaction-filters">
      {/* Busca rápida */}
      <div className="filter-search">
        <input
          type="text"
          placeholder="Buscar por descrição ou categoria..."
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          className="search-input"
        />
        {searchInput && searchInput !== debouncedSearch && (
          <span className="search-loading">Buscando...</span>
        )}
      </div>

      {/* Toggle filtros avançados */}
      <button
        className="toggle-filters-btn"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        {isExpanded ? '▼' : '▶'} Filtros Avançados
        {hasActiveFilters && <span className="filter-badge">{Object.keys(filters).length}</span>}
      </button>

      {/* Filtros avançados */}
      {isExpanded && (
        <div className="filters-expanded">
          <div className="filter-grid">
            {/* Tipo */}
            <div className="filter-item">
              <label>Tipo</label>
              <select
                value={filters.type || ''}
                onChange={(e) => handleChange('type', e.target.value)}
              >
                <option value="">Todos</option>
                <option value="income">Receitas</option>
                <option value="expense">Despesas</option>
              </select>
            </div>

            {/* Categoria */}
            <div className="filter-item">
              <label>Categoria</label>
              <select
                value={filters.category || ''}
                onChange={(e) => handleChange('category', e.target.value)}
              >
                <option value="">Todas</option>
                <optgroup label="Receitas">
                  {INCOME_CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </optgroup>
                <optgroup label="Despesas">
                  {EXPENSE_CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </optgroup>
              </select>
            </div>

            {/* Data inicial */}
            <div className="filter-item">
              <label>Data Inicial</label>
              <input
                type="date"
                value={filters.startDate || ''}
                onChange={(e) => handleChange('startDate', e.target.value)}
              />
            </div>

            {/* Data final */}
            <div className="filter-item">
              <label>Data Final</label>
              <input
                type="date"
                value={filters.endDate || ''}
                onChange={(e) => handleChange('endDate', e.target.value)}
              />
            </div>

            {/* Valor mínimo */}
            <div className="filter-item">
              <label>Valor Mínimo</label>
              <div className="filter-input-wrapper">
                <input
                  type="number"
                  placeholder="R$ 0,00"
                  value={minAmountInput}
                  onChange={(e) => setMinAmountInput(e.target.value)}
                  min="0"
                  step="0.01"
                />
                {minAmountInput && minAmountInput !== debouncedMinAmount && (
                  <span className="input-loading">...</span>
                )}
              </div>
            </div>

            {/* Valor máximo */}
            <div className="filter-item">
              <label>Valor Máximo</label>
              <div className="filter-input-wrapper">
                <input
                  type="number"
                  placeholder="R$ 0,00"
                  value={maxAmountInput}
                  onChange={(e) => setMaxAmountInput(e.target.value)}
                  min="0"
                  step="0.01"
                />
                {maxAmountInput && maxAmountInput !== debouncedMaxAmount && (
                  <span className="input-loading">...</span>
                )}
              </div>
            </div>
          </div>

          {/* Botão limpar */}
          {hasActiveFilters && (
            <button className="clear-filters-btn" onClick={clearFilters}>
              Limpar Filtros
            </button>
          )}
        </div>
      )}
    </div>
  );
}

