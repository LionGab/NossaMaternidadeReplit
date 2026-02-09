# 🚀 Quickstart - Nossa Maternidade

**Objetivo**: Rodar o app localmente em **10 minutos** (assumindo ambiente já configurado).

---

## ✅ Pré-requisitos

Você já deve ter:

- **Node.js** LTS (v20+ ou v22+) → [nodejs.org](https://nodejs.org/)
- **Git** → [git-scm.com](https://git-scm.com/)
- **Emulador/Simulador**:
  - **Android**: Android Studio + AVD configurado
  - **iOS** (Mac only): Xcode + Simulador

> **Primeira vez?** Veja setup completo em [docs/SETUP_WINDOWS.md](docs/SETUP_WINDOWS.md) ou `docs/SETUP_MAC.md`.

---

## 📦 1. Clone e Instale

```bash
# Clone o repositório
git clone https://github.com/seu-usuario/NossaMaternidade.git
cd NossaMaternidade

# Instale dependências (escolha npm ou bun)
npm install
# OU
bun install
```

**Nota Windows**: O script `postinstall` corrige LightningCSS automaticamente.

---

## 🔐 2. Configure Variáveis de Ambiente

```bash
# Windows (PowerShell ou CMD)
copy .env.example .env.local

# macOS/Linux (Terminal ou Git Bash)
cp .env.example .env.local
```

**Edite `.env.local`** com suas credenciais reais:

```env
# Mínimo obrigatório (para testar localmente):
EXPO_PUBLIC_SUPABASE_URL=https://seu-projeto.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=sua-chave-anon-aqui
EXPO_PUBLIC_SUPABASE_FUNCTIONS_URL=https://seu-projeto.supabase.co/functions/v1

# Opcional (para IA funcionar):
EXPO_PUBLIC_GEMINI_API_KEY=sua-chave-gemini-aqui
EXPO_PUBLIC_OPENAI_API_KEY=sua-chave-openai-aqui
```

> **Sem Supabase?** Crie um projeto grátis em [supabase.com](https://supabase.com) (2min).

---

## 🏃‍♂️ 3. Rode o App

### Opção A: Web (mais rápido para testar)

```bash
npm start
# Pressione 'w' quando o Metro iniciar
```

### Opção B: Android (emulador)

```bash
# 1. Abra o emulador Android (via Android Studio ou linha de comando)
# 2. Confirme que está rodando:
adb devices

# 3. Inicie o app:
npm run android
```

### Opção C: iOS (Mac only)

```bash
npm run ios
```

---

## ✅ 4. Validar Qualidade (antes de PR)

```bash
# Roda typecheck + lint + build check + console.log check
npm run quality-gate
```

**Passes individuais**:

```bash
npm run typecheck    # TypeScript
npm run lint         # ESLint
npm run lint:fix     # Auto-fix ESLint
```

---

## 🛠️ Troubleshooting Rápido

### Erro: "Expo não encontra .env.local"

```bash
# Reinicie com cache limpo:
npm start -- --clear
```

### Erro: "Module not found" ou cache

```bash
# Limpeza completa:
npm run clean
# OU nuclear:
npm run clean:all  # Remove node_modules e reinstala
```

### Erro: "ANDROID_HOME not set" (Windows)

```powershell
# Defina a variável (ajuste o caminho se necessário):
[Environment]::SetEnvironmentVariable("ANDROID_HOME", "$env:LOCALAPPDATA\Android\Sdk", "User")

# Reinicie o terminal e confirme:
echo $env:ANDROID_HOME
```

### Erro: iOS Pods (Mac)

```bash
# Script automático de fix:
npm run fix:ios
```

---

## 📚 Próximos Passos

- **Setup completo**: [docs/SETUP_WINDOWS.md](docs/SETUP_WINDOWS.md) ou `docs/SETUP_MAC.md`
- **Arquitetura**: [claude.md](../claude.md) (regras para agentes de IA) ou `docs/README.md`
- **Governança IA**: [docs/AI_GOVERNANCE.md](AI_GOVERNANCE.md)
- **Design System**: [docs/DESIGN_SYSTEM_CALM_FEMTECH.md](docs/DESIGN_SYSTEM_CALM_FEMTECH.md)
- **OAuth/Auth**: [docs/OAUTH_VERIFICATION.md](docs/OAUTH_VERIFICATION.md)
- **Edge Functions**: [docs/EDGE_FUNCTIONS.md](docs/EDGE_FUNCTIONS.md)

---

## 🆘 Ajuda

**Problemas?** Abra uma issue no GitHub ou veja:

- [docs/SETUP_WINDOWS.md](docs/SETUP_WINDOWS.md) - Seção 9 (Troubleshooting completo)
- Slack/Discord do projeto (se aplicável)

---

**Pronto! 🎉** Você deve estar rodando o app agora. Happy coding!
