# Microfrontend Next.js - Multi-Zones

Projeto de microfrontend usando Next.js Multi-Zones com Docker e deploy na Vercel.

## 📁 Estrutura

```
microfront-nextjs/
├── packages/
│   ├── app-main/       # Aplicação principal (porta 4000)
│   ├── mfe-login/      # Microfrontend Login (porta 4001)
│   └── mfe-register/   # Microfrontend Register (porta 4002)
└── docker-compose.yml
```

## 🚀 Desenvolvimento Local

### Com Docker (Recomendado)

```bash
# Iniciar todos os serviços
docker-compose up --build

# Parar
docker-compose down
```

Acesse:
- **App Principal**: http://localhost:4000
- **Login**: http://localhost:4000/login
- **Register**: http://localhost:4000/register

### Sem Docker

```bash
# Terminal 1 - App Main
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

## 🛠️ Comandos Docker

```bash
# Iniciar
docker-compose up --build

# Parar
docker-compose down

# Limpar tudo
docker-compose down --rmi all --volumes

# Ver logs
docker-compose logs -f

# Reiniciar um serviço
docker-compose restart app-main
```

## 📝 Notas

- Hot reload funciona automaticamente no Docker
- Cada MFE pode ser desenvolvido independentemente
- Deploy separado permite escalar cada app individualmente
- Um push no GitHub atualiza todos os projetos automaticamente

## 🔗 Links Úteis

- [Next.js Multi-Zones](https://nextjs.org/docs/advanced-features/multi-zones)
- [Vercel Documentation](https://vercel.com/docs)
- [Docker Compose](https://docs.docker.com/compose/)

