# Microfrontend Next.js - Multi-Zones

Projeto de microfrontend usando Next.js Multi-Zones com Docker, Supabase e deploy na Vercel.

## 🔧 Pré-requisitos e Configuração

### 1️⃣ Criar Conta no Supabase

Antes de rodar o projeto, você precisa configurar o backend:

1. Acesse [https://supabase.com](https://supabase.com) e crie uma conta
2. Crie um novo projeto
3. Aguarde a criação do projeto (pode levar alguns minutos)
4. Após criacar uma conta na tela de register, o supabase envia um email para confirmação da criacao de conta.

### 2️⃣ Configurar Variáveis de Ambiente

Após criar o projeto no Supabase, copie as credenciais:

1. No dashboard do Supabase, vá em **Settings** > **API**
2. Copie a **Project URL** e a **anon/public key**
3. Crie um arquivo `.env.local` em `packages/app-main/`:

```bash
NEXT_PUBLIC_SUPABASE_URL=sua-url-do-projeto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua-chave-publica-aqui
```

4. Faça o mesmo para `packages/mfe-login/` e `packages/mfe-register/`

### 3️⃣ Executar Queries no SQL Editor

No dashboard do Supabase:

1. Vá em **SQL Editor** no menu lateral
2. Clique em **New query**
3. Execute o seguinte script (disponível em `packages/app-main/supabase-setup.sql`):

```sql
-- Criar tabela de transações
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

-- Criar índices e políticas de segurança (RLS)
-- (veja o arquivo completo em packages/app-main/supabase-setup.sql)
```

### 4️⃣ Configurar Storage para Anexos

Para permitir upload de imagens/documentos nas transações:

1. No dashboard do Supabase, vá em **Storage**
2. Clique em **Create a new bucket**
3. Nome do bucket: `transaction-attachments`
4. Deixe como **Private** (não público)
5. Clique em **Create bucket**

Depois, execute no **SQL Editor** (disponível em `packages/app-main/supabase-attachments-setup.sql`):

```sql
-- Adicionar coluna de anexos
ALTER TABLE transactions 
ADD COLUMN IF NOT EXISTS attachments JSONB DEFAULT '[]'::jsonb;

-- Criar políticas de storage
-- (veja o arquivo completo em packages/app-main/supabase-attachments-setup.sql)
```

---

## 🛠️ Tecnologias Utilizadas

- **[Next.js 15](https://nextjs.org/)** - Framework React com App Router
- **[TypeScript](https://www.typescriptlang.org/)** - Tipagem estática
- **[Supabase](https://supabase.com/)** - Backend (PostgreSQL + Auth + Storage)
- **[Docker](https://www.docker.com/)** - Containerização
- **[Recharts](https://recharts.org/)** - Gráficos interativos
- **[Sonner](https://sonner.emilkowal.ski/)** - Toast notifications
- **[React Icons](https://react-icons.github.io/react-icons/)** - Ícones
- **[date-fns](https://date-fns.org/)** - Manipulação de datas

---

## 📁 Estrutura do Projeto

```
microfront-nextjs/
├── packages/
│   ├── app-main/           # Aplicação principal (Dashboard)
│   │   ├── src/
│   │   │   ├── app/
│   │   │   │   ├── dashboard/    # Páginas do dashboard
│   │   │   │   │   ├── home/     # Página inicial
│   │   │   │   │   ├── transactions/  # Gestão de transações
│   │   │   │   │   ├── profile/  # Perfil do usuário
│   │   │   │   │   └── settings/ # Configurações
│   │   │   │   └── page.tsx      # Landing page
│   │   │   ├── components/       # Componentes compartilhados
│   │   │   ├── services/         # Serviços (API)
│   │   │   ├── lib/              # Configurações (Supabase, Auth)
│   │   │   └── types/            # TypeScript types
│   │   ├── supabase-setup.sql    # Script SQL principal
│   │   └── supabase-attachments-setup.sql  # Script para anexos
│   │
│   ├── mfe-login/          # Microfrontend de Login
│   │   └── src/
│   │       ├── app/
│   │       │   └── components/
│   │       │       └── login/    # Componente de login
│   │       └── lib/              # Configuração Supabase
│   │
│   ├── mfe-register/       # Microfrontend de Registro
│   │   └── src/
│   │       ├── app/
│   │       └── components/
│   │           └── register/     # Componente de registro
│   │
│   └── mfe-home/           # Microfrontend Home (Landing)
│       └── src/
│           └── app/
│               └── components/   # Hero, Stats, etc
│
└── docker-compose.yml      # Configuração Docker
```

---

## 🚀 Como Rodar Localmente

### Opção 1: Com Docker (Recomendado)

```bash
# Iniciar todos os serviços
docker-compose up --build

# Parar os serviços
docker-compose down

# Ver logs em tempo real
docker-compose logs -f

# Reiniciar um serviço específico
docker-compose restart app-main
```

Acesse:
- **App Principal**: http://localhost:4000
- **Dashboard**: http://localhost:4000/dashboard
- **Login**: http://localhost:4000/login
- **Register**: http://localhost:4000/register

### Opção 2: Sem Docker

Execute cada microfrontend em um terminal separado:

```bash
# Terminal 1 - App Main (Dashboard)
cd packages/app-main
npm install
npm run dev

# Terminal 2 - MFE Login
cd packages/mfe-login
npm install
npm run dev -- -p 3001

# Terminal 3 - MFE Register
cd packages/mfe-register
npm install
npm run dev -- -p 3002

# Terminal 4 - MFE Home (Opcional)
cd packages/mfe-home
npm install
npm run dev -- -p 3003
```