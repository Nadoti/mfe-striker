# 🚀 Setup do Supabase - Sistema de Transações

## 📋 Passo a Passo

### 1️⃣ **Acessar o Supabase SQL Editor**

1. Acesse: https://supabase.com/dashboard
2. Selecione seu projeto
3. No menu lateral, clique em **SQL Editor**
4. Clique em **New query**

---

### 2️⃣ **Executar o Script SQL**

Copie e cole o conteúdo do arquivo `supabase-setup.sql` no editor SQL e clique em **RUN**.

Ou cole o script abaixo:

```sql
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
```

---

### 3️⃣ **Verificar se Criou Corretamente**

1. No menu lateral, clique em **Table Editor**
2. Você deve ver a tabela **transactions** criada
3. Clique nela para ver a estrutura

---

### 4️⃣ **(Opcional) Inserir Dados de Exemplo**

Se quiser testar com dados de exemplo, execute este SQL (substitua `SEU_USER_ID` pelo seu ID de usuário):

```sql
-- Para pegar seu user_id, execute:
SELECT id FROM auth.users;

-- Depois insira os dados (substitua 'SEU_USER_ID' pelo ID retornado acima):
INSERT INTO transactions (user_id, type, category, amount, description, date) VALUES
  ('SEU_USER_ID', 'income', 'Salário', 5000.00, 'Salário mensal', '2025-01-05'),
  ('SEU_USER_ID', 'expense', 'Alimentação', 350.00, 'Supermercado', '2025-01-10'),
  ('SEU_USER_ID', 'expense', 'Transporte', 200.00, 'Uber e gasolina', '2025-01-12'),
  ('SEU_USER_ID', 'income', 'Freelance', 1500.00, 'Projeto web', '2025-01-15'),
  ('SEU_USER_ID', 'expense', 'Lazer', 150.00, 'Cinema e jantar', '2025-01-20');
```

---

### 5️⃣ **Instalar Dependências**

No terminal, dentro da pasta `packages/app-main`:

```bash
npm install
```

Ou se estiver usando Docker:

```bash
docker-compose down
docker-compose up --build
```

---

## ✅ Pronto!

Agora você pode:

1. **Dashboard**: Ver resumo financeiro e gráficos em `/dashboard`
2. **Transações**: Listar, criar, editar e excluir em `/dashboard/transactions`
3. **Filtros**: Buscar por texto, tipo, categoria, data, valor
4. **Paginação**: Navegar entre páginas de transações

---

## 🎯 Estrutura Criada

### **Tabela `transactions`**
- `id` (UUID): ID único
- `user_id` (UUID): ID do usuário (FK)
- `type` (VARCHAR): "income" ou "expense"
- `category` (VARCHAR): Categoria da transação
- `amount` (DECIMAL): Valor da transação
- `description` (TEXT): Descrição opcional
- `date` (DATE): Data da transação
- `created_at` (TIMESTAMP): Data de criação
- `updated_at` (TIMESTAMP): Data de atualização

### **Segurança (RLS)**
- ✅ Usuários só podem ver suas próprias transações
- ✅ Usuários só podem criar/editar/excluir suas próprias transações

### **Performance**
- ✅ Índices em `user_id`, `date`, `type`, `category`
- ✅ Trigger automático para `updated_at`

---

## 🔥 Funcionalidades Implementadas

### ✅ **Dashboard** (`/dashboard`)
- Cards com resumo financeiro (Receitas, Despesas, Saldo)
- Gráfico de receitas vs despesas (últimos 6 meses)
- Gráfico de despesas por categoria (pizza)
- Lista de transações recentes (últimas 5)

### ✅ **Página de Transações** (`/dashboard/transactions`)
- Listagem completa com paginação
- Busca por texto (descrição ou categoria)
- Filtros avançados:
  - Tipo (receita/despesa)
  - Categoria
  - Período (data inicial/final)
  - Valor (mínimo/máximo)
- Criar nova transação (modal)
- Editar transação existente (modal)
- Excluir transação
- Toasts de sucesso/erro com Sonner

### ✅ **Validações**
- Campos obrigatórios
- Valor maior que zero
- Data válida
- Categoria selecionada

---

## 🛠️ Tecnologias Utilizadas

- **Next.js 15** (App Router)
- **Supabase** (PostgreSQL + Auth + RLS)
- **TypeScript**
- **Recharts** (Gráficos)
- **Sonner** (Toasts)
- **React Icons**
- **date-fns** (Formatação de datas)

---

## 📝 Notas

- As transações são privadas por usuário (RLS)
- Os gráficos são gerados dinamicamente
- A paginação é server-side (performance)
- Funciona local e em produção

