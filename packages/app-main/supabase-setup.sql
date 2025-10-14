-- ============================================
-- CRIAR TABELA DE TRANSAÇÕES
-- ============================================

CREATE TABLE IF NOT EXISTS transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  type VARCHAR(10) NOT NULL CHECK (type IN ('income', 'expense')),
  category VARCHAR(50) NOT NULL,
  amount DECIMAL(10, 2) NOT NULL,
  description TEXT,
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- CRIAR ÍNDICES PARA PERFORMANCE
-- ============================================

CREATE INDEX IF NOT EXISTS idx_transactions_user_id ON transactions(user_id);
CREATE INDEX IF NOT EXISTS idx_transactions_date ON transactions(date);
CREATE INDEX IF NOT EXISTS idx_transactions_type ON transactions(type);
CREATE INDEX IF NOT EXISTS idx_transactions_category ON transactions(category);

-- ============================================
-- HABILITAR ROW LEVEL SECURITY (RLS)
-- ============================================

ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;

-- ============================================
-- POLÍTICAS DE SEGURANÇA
-- ============================================

-- Permitir que usuários vejam apenas suas próprias transações
CREATE POLICY "Users can view their own transactions"
  ON transactions FOR SELECT
  USING (auth.uid() = user_id);

-- Permitir que usuários criem suas próprias transações
CREATE POLICY "Users can create their own transactions"
  ON transactions FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Permitir que usuários atualizem suas próprias transações
CREATE POLICY "Users can update their own transactions"
  ON transactions FOR UPDATE
  USING (auth.uid() = user_id);

-- Permitir que usuários deletem suas próprias transações
CREATE POLICY "Users can delete their own transactions"
  ON transactions FOR DELETE
  USING (auth.uid() = user_id);

-- ============================================
-- FUNÇÃO PARA ATUALIZAR updated_at AUTOMATICAMENTE
-- ============================================

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- TRIGGER PARA ATUALIZAR updated_at
-- ============================================

DROP TRIGGER IF EXISTS update_transactions_updated_at ON transactions;

CREATE TRIGGER update_transactions_updated_at
  BEFORE UPDATE ON transactions
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- INSERIR DADOS DE EXEMPLO (OPCIONAL)
-- ============================================

-- Descomente as linhas abaixo para inserir dados de exemplo
-- Substitua 'SEU_USER_ID' pelo ID do usuário logado

/*
INSERT INTO transactions (user_id, type, category, amount, description, date) VALUES
  ('SEU_USER_ID', 'income', 'Salário', 5000.00, 'Salário mensal', '2025-01-05'),
  ('SEU_USER_ID', 'expense', 'Alimentação', 350.00, 'Supermercado', '2025-01-10'),
  ('SEU_USER_ID', 'expense', 'Transporte', 200.00, 'Uber e gasolina', '2025-01-12'),
  ('SEU_USER_ID', 'income', 'Freelance', 1500.00, 'Projeto web', '2025-01-15'),
  ('SEU_USER_ID', 'expense', 'Lazer', 150.00, 'Cinema e jantar', '2025-01-20');
*/

