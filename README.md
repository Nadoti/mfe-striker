# Microfrontend Next.js - Multi-Zones

Projeto de microfrontend usando Next.js Multi-Zones com Docker, Supabase e deploy na Vercel.

## 🔧 Pré-requisitos e Configuração

### 1️⃣ Criar Conta no Supabase

Antes de rodar o projeto, você precisa configurar o backend:

1. Acesse [https://supabase.com](https://supabase.com) e crie uma conta
2. Crie um novo projeto
3. Aguarde a criação do projeto (pode levar alguns minutos)

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

### ✅ Configuração Concluída!

Agora você pode criar contas, fazer transações, editar, excluir e adicionar imagens/documentos!

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

## 📦 Deploy na Vercel

### 1. Push para o GitHub

```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/seu-usuario/microfront-nextjs.git
git push -u origin main
```

### 2. Criar 3 Projetos na Vercel

**Projeto 1: app-main**
- Import do GitHub
- Root Directory: `packages/app-main`
- Framework: Next.js
- Environment Variables:
  ```
  MFE_LOGIN_URL=https://seu-mfe-login.vercel.app
  MFE_REGISTER_URL=https://seu-mfe-register.vercel.app
  ```

**Projeto 2: mfe-login**
- Import do GitHub (mesmo repo)
- Root Directory: `packages/mfe-login`
- Framework: Next.js

**Projeto 3: mfe-register**
- Import do GitHub (mesmo repo)
- Root Directory: `packages/mfe-register`
- Framework: Next.js

### 3. Atualizar URLs de Produção

Após o deploy dos MFEs, copie as URLs e atualize as variáveis de ambiente do `app-main` na Vercel:

```
MFE_LOGIN_URL=https://mfe-login-abc123.vercel.app
MFE_REGISTER_URL=https://mfe-register-xyz789.vercel.app
```

### 4. Workflow de Deploy

Quando você fizer push para o GitHub:

```bash
git add .
git commit -m "Suas alterações"
git push
```

A Vercel detecta automaticamente qual pasta foi alterada e faz rebuild apenas do projeto necessário! 🎯

## 🔧 Como Funciona

### Multi-Zones

- **app-main** usa `rewrites()` para fazer proxy das rotas `/login` e `/register`
- **mfe-login** tem `basePath: "/login"`
- **mfe-register** tem `basePath: "/register"`

### Desenvolvimento vs Produção

```javascript
// next.config.ts do app-main
const mfeLoginUrl = process.env.MFE_LOGIN_URL || "http://mfe-login:3000";
```

- **Desenvolvimento (Docker)**: Usa `http://mfe-login:3000`
- **Produção (Vercel)**: Usa `https://mfe-login.vercel.app`

## 🐳 Comandos Docker

### Comandos Básicos

```bash
# Iniciar todos os serviços (com rebuild)
docker-compose up --build

# Iniciar em modo background (detached)
docker-compose up -d

# Parar todos os serviços
docker-compose down

# Parar e remover volumes
docker-compose down -v
```

### Gerenciamento de Serviços

```bash
# Ver status dos containers
docker-compose ps

# Ver logs em tempo real
docker-compose logs -f

# Ver logs de um serviço específico
docker-compose logs -f app-main

# Reiniciar todos os serviços
docker-compose restart

# Reiniciar um serviço específico
docker-compose restart app-main

# Parar um serviço específico
docker-compose stop mfe-login

# Iniciar um serviço específico
docker-compose start mfe-login
```

### Limpeza e Manutenção

```bash
# Remover containers parados
docker-compose rm

# Parar e remover tudo (containers, networks, volumes)
docker-compose down --rmi all --volumes

# Limpar cache do Docker (liberar espaço)
docker system prune -a

# Ver uso de espaço do Docker
docker system df
```

### Rebuild e Updates

```bash
# Rebuild de um serviço específico
docker-compose build app-main

# Rebuild sem cache
docker-compose build --no-cache

# Rebuild e iniciar
docker-compose up --build --force-recreate
```

### Debugging

```bash
# Acessar shell de um container
docker-compose exec app-main sh

# Executar comando em um container
docker-compose exec app-main npm run build

# Ver variáveis de ambiente de um container
docker-compose exec app-main env

# Inspecionar um container
docker inspect microfront-nextjs-app-main-1
```

## ✨ Funcionalidades do Sistema

### 🏦 Dashboard Financeiro
- **Resumo Financeiro**: Cards com total de receitas, despesas e saldo
- **Gráficos Interativos**: 
  - Receitas vs Despesas (últimos 6 meses)
  - Despesas por categoria (gráfico de pizza)
- **Transações Recentes**: Lista das últimas 5 transações

### 💰 Gestão de Transações
- **CRUD Completo**: Criar, visualizar, editar e excluir transações
- **Filtros Avançados**:
  - Busca por texto (descrição ou categoria)
  - Filtro por tipo (receita/despesa)
  - Filtro por categoria
  - Filtro por período (data inicial/final)
  - Filtro por valor (mínimo/máximo)
- **Paginação**: Sistema de paginação para grandes volumes de dados
- **Upload de Anexos**: Adicione recibos, notas fiscais e documentos (imagens e PDFs)

### 👤 Autenticação e Segurança
- **Login/Registro**: Sistema completo de autenticação via Supabase
- **Row Level Security (RLS)**: Cada usuário vê apenas suas próprias transações
- **Guards de Rotas**: Proteção automática de páginas privadas
- **Logout Seguro**: Sistema de logout com confirmação

### 🎨 Interface Moderna
- **Design Responsivo**: Funciona em desktop, tablet e mobile
- **Notificações Toast**: Feedback visual para todas as ações
- **Modais Interativos**: Criação e edição de transações em modais
- **Loading States**: Indicadores de carregamento em todas as operações

---

## 📝 Notas Importantes

- ✅ Hot reload funciona automaticamente no Docker
- ✅ Cada MFE pode ser desenvolvido independentemente
- ✅ Deploy separado permite escalar cada app individualmente
- ✅ Um push no GitHub atualiza todos os projetos automaticamente
- ✅ As transações são privadas por usuário (RLS habilitado)
- ✅ Suporte a upload de múltiplos anexos por transação
- ✅ Validações em tempo real nos formulários

## 🔗 Links Úteis

### Documentação
- [Next.js Multi-Zones](https://nextjs.org/docs/advanced-features/multi-zones)
- [Supabase Documentation](https://supabase.com/docs)
- [Supabase Auth](https://supabase.com/docs/guides/auth)
- [Supabase Storage](https://supabase.com/docs/guides/storage)
- [Row Level Security (RLS)](https://supabase.com/docs/guides/auth/row-level-security)
- [Vercel Documentation](https://vercel.com/docs)
- [Docker Compose](https://docs.docker.com/compose/)

### Arquivos de Configuração
- `packages/app-main/supabase-setup.sql` - Script SQL principal
- `packages/app-main/supabase-attachments-setup.sql` - Script para anexos
- `packages/app-main/SETUP_SUPABASE.md` - Guia detalhado de setup
- `docker-compose.yml` - Configuração dos containers

---

## 🤝 Contribuindo

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/MinhaFeature`)
3. Commit suas mudanças (`git commit -m 'Adiciona MinhaFeature'`)
4. Push para a branch (`git push origin feature/MinhaFeature`)
5. Abra um Pull Request

---

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo LICENSE para mais detalhes.

---

## 👨‍💻 Autor

Desenvolvido com ❤️ usando Microfrontends e Next.js

