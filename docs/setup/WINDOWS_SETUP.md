# Configuração para Windows - Nossa Maternidade

Guia completo para configurar e rodar o projeto no Windows.

---

## 📋 Pré-requisitos

1. **Node.js 20.11.1** - [Download](https://nodejs.org/)
2. **Bun** - Instalar via PowerShell:
   ```powershell
   powershell -c "irm bun.sh/install.ps1 | iex"
   ```
   Ou via npm:
   ```powershell
   npm install -g bun
   ```
3. **Git** - [Download Git for Windows](https://git-scm.com/download/win) (inclui Git Bash)
4. **EAS CLI** (opcional, para builds):
   ```powershell
   npm install -g eas-cli
   ```

---

## 🚀 Setup Inicial

### 1. Clonar o Repositório

```powershell
git clone [url-do-repositorio]
cd NossaMaternidade-1
```

### 2. Instalar Dependências

```powershell
# Usando Bun (recomendado)
bun install

# Ou usando npm
npm install
```

### 3. Configurar Variáveis de Ambiente

```powershell
# Copiar template
Copy-Item .env.example .env.local

# Editar .env.local com seus valores reais
notepad .env.local
```

**Importante:** Preencha todas as variáveis obrigatórias:

- `EXPO_PUBLIC_SUPABASE_URL`
- `EXPO_PUBLIC_SUPABASE_ANON_KEY`
- `EXPO_PUBLIC_SUPABASE_FUNCTIONS_URL`

---

## ✅ Rodar Validações (Windows)

### Quality Gate Completo

```powershell
# Usando script PowerShell (Windows)
bun run quality-gate:win

# Ou usando Git Bash (funciona igual ao Linux)
bash scripts/quality-gate.sh
```

### Validações Individuais

```powershell
# Formatação
bun run format:check

# TypeScript
bun run typecheck

# ESLint
bun run lint

# Build readiness (PowerShell)
bun run check-build-ready:win

# Build readiness (Git Bash)
bash scripts/check-build-ready.sh

# Verificar variáveis de ambiente
bun run check-env
```

---

## 🏗️ Scripts Disponíveis no Windows

### Scripts PowerShell (Nativos)

- `bun run quality-gate:win` - Quality gate completo (PowerShell)
- `bun run check-build-ready:win` - Validação pré-build (PowerShell)

### Scripts Bash (via Git Bash)

- `bun run quality-gate` - Quality gate completo (bash)
- `bun run check-build-ready` - Validação pré-build (bash)

**Nota:** Ambos fazem a mesma coisa, escolha o que preferir. O PowerShell é mais rápido no Windows.

---

## 🐛 Troubleshooting Windows

### Problema: Scripts bash não funcionam

**Solução:** Use os scripts PowerShell:

```powershell
bun run quality-gate:win
bun run check-build-ready:win
```

Ou instale Git Bash e use:

```bash
bash scripts/quality-gate.sh
bash scripts/check-build-ready.sh
```

### Problema: "ExecutionPolicy" bloqueado

**Solução:** Execute no PowerShell como Administrador:

```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

Ou use o flag `-ExecutionPolicy Bypass` diretamente:

```powershell
powershell -ExecutionPolicy Bypass -File scripts/quality-gate.ps1
```

### Problema: Bun não encontrado

**Solução:** Instale o Bun:

```powershell
powershell -c "irm bun.sh/install.ps1 | iex"
```

Ou adicione ao PATH manualmente após instalação.

### Problema: EAS CLI não encontrado

**Solução:** Instale globalmente:

```powershell
npm install -g eas-cli
```

### Problema: Metro bundler não inicia

**Solução:** Limpe o cache:

```powershell
bun run start:clear
```

Ou limpe manualmente:

```powershell
Remove-Item -Recurse -Force .expo
Remove-Item -Recurse -Force node_modules/.cache
```

### Problema: Builds EAS falham

**Solução:** Verifique se está logado:

```powershell
eas login
```

E se os secrets estão configurados:

```powershell
eas env:list
```

---

## 📝 Comandos Úteis Windows

### Desenvolvimento

```powershell
# Iniciar Expo Dev Server
bun run start

# Limpar cache e iniciar
bun run start:clear

# Rodar no Android (requer Android Studio/Emulator)
bun run android

# Rodar no iOS (requer Mac + Xcode)
# Não suportado no Windows
```

### Validação

```powershell
# Validação completa (PowerShell)
bun run quality-gate:win

# Validação completa (Git Bash)
bash scripts/quality-gate.sh

# TypeScript
bun run typecheck

# ESLint
bun run lint

# Formatação
bun run format:check
```

### Builds EAS

```powershell
# Build preview
bun run build:preview

# Build staging
bun run build:staging

# Build production (com quality gate)
bun run build:prod
```

---

## 🔧 Configuração de Terminal

### PowerShell (Recomendado)

Use PowerShell 7+ (pwsh) para melhor compatibilidade:

```powershell
# Verificar versão
$PSVersionTable.PSVersion
```

### Git Bash (Alternativa)

Se preferir ambiente Linux-like:

1. Instale Git for Windows (inclui Git Bash)
2. Use comandos bash normalmente
3. Scripts `.sh` funcionarão diretamente

### Windows Terminal (Opcional)

Para melhor experiência:

1. Instale [Windows Terminal](https://aka.ms/terminal)
2. Configure PowerShell 7 como padrão
3. Use tabs para múltiplos terminais

---

## 📚 Referências

- **Build Quickstart:** `docs/BUILD_QUICKSTART.md`
- **Environment Variables:** `docs/ENV_QUICK_REFERENCE.md`
- **EAS Secrets:** `docs/EAS_SECRETS_SETUP.md`
- **Windows Setup Completo:** `docs/SETUP_WINDOWS_COMPLETO.md` (se existir)

---

## ✅ Checklist de Setup Windows

- [ ] Node.js 20.11.1 instalado
- [ ] Bun instalado e funcionando
- [ ] Git instalado (para Git Bash)
- [ ] EAS CLI instalado (opcional)
- [ ] `.env.local` criado e configurado
- [ ] Dependências instaladas (`bun install`)
- [ ] Quality gate passa (`bun run quality-gate:win`)
- [ ] Expo Dev Server inicia (`bun run start`)

---

**Última atualização:** 04 Jan 2026
