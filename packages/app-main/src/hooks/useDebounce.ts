import { useState, useEffect } from 'react';

/**
 * Hook para fazer debounce de valores
 * @param value - Valor a ser debounced
 * @param delay - Delay em milissegundos (padrão: 500ms)
 * @returns Valor debounced
 */
export function useDebounce<T>(value: T, delay: number = 500): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    // Criar timeout para atualizar o valor após o delay
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    // Limpar timeout se o valor mudar antes do delay
    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

