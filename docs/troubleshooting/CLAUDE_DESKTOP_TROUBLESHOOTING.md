# Claude Desktop - Troubleshooting CSP (Content Security Policy)

**Última atualização:** 2025-01-30
**Versão:** 1.0.0

---

## 🔴 Problemas Identificados

### 1. Content Security Policy muito restritiva

**Erro:**

```
Content Security Policy bloqueando: https://a-cdn.anthropic.com/analytics.js
```

**Causa:**

- CSP configurado com `script-src 'self' 'unsafe-inline' https://cdn.segment.com ...`
- Não inclui `https://a-cdn.anthropic.com` na whitelist

### 2. Feature Gate Statsig falhando

**Erro:**

```
StatsigClient não encontrado para 'datadog_rum_enabled'
```

**Causa:**

- Statsig SDK não carregado corretamente
- Feature flags não inicializados

### 3. Permissions-Policy inválida

**Erro:**

```
'web-share' não é uma feature reconhecida
```

**Causa:**

- `Permissions-Policy` header com feature não suportada pelo navegador/Electron

---

## ✅ Soluções

### Opção 1: Limpar dados locais corrompidos (RECOMENDADO)

#### Windows

```powershell
# Fechar Claude Desktop antes de executar

# Limpar storage
Remove-Item -Recurse -Force "$env:APPDATA\Claude\storage" -ErrorAction SilentlyContinue

# Limpar cache
Remove-Item -Recurse -Force "$env:LOCALAPPDATA\Claude\cache" -ErrorAction SilentlyContinue

# Limpar logs (opcional)
Remove-Item -Recurse -Force "$env:APPDATA\Claude\logs" -ErrorAction SilentlyContinue
```

**Via CMD:**

```cmd
del /s /q "%APPDATA%\Claude\storage"
del /s /q "%LOCALAPPDATA%\Claude\cache"
```

#### macOS

```bash
# Fechar Claude Desktop antes de executar

# Limpar storage
rm -rf ~/Library/Application\ Support/Claude/storage

# Limpar cache
rm -rf ~/Library/Caches/Claude

# Limpar logs (opcional)
rm -rf ~/Library/Logs/Claude
```

#### Linux

```bash
# Fechar Claude Desktop antes de executar

# Limpar storage
rm -rf ~/.config/Claude/storage

# Limpar cache
rm -rf ~/.cache/Claude

# Limpar logs (opcional)
rm -rf ~/.local/share/Claude/logs
```

**Após limpar:**

1. Reinicie o Claude Desktop
2. Faça login novamente
3. Verifique se os erros desapareceram

---

### Opção 2: Desativar analytics (se disponível)

Se o Claude Desktop tiver flags de linha de comando:

#### Windows

```powershell
# Criar atalho com flags
$shortcut = "$env:APPDATA\Microsoft\Windows\Start Menu\Programs\Claude.lnk"
$shell = New-Object -ComObject WScript.Shell
$link = $shell.CreateShortcut($shortcut)
$link.TargetPath = "C:\Users\User\AppData\Local\Programs\Claude\Claude.exe"
$link.Arguments = "--disable-analytics --no-data-collection"
$link.Save()
```

#### macOS

```bash
# Editar aplicativo (se suportar flags)
open -a Claude --args --disable-analytics --no-data-collection
```

**Nota:** Nem todas as versões do Claude Desktop suportam essas flags. Se não funcionar, use a Opção 1 ou 4.

---

### Opção 3: Corrigir CSP (se você controla o servidor/proxy)

**Se você estiver rodando Claude Desktop através de um proxy ou servidor próprio:**

Adicione ao seu servidor/proxy:

```nginx
# Nginx example
add_header Content-Security-Policy "script-src 'self' 'unsafe-inline' https://cdn.segment.com https://a-cdn.anthropic.com https://api.statsig.com; connect-src 'self' https://api.statsig.com https://a-cdn.anthropic.com;";
```

**Headers necessários:**

- `script-src`: Adicionar `https://a-cdn.anthropic.com`
- `connect-src`: Adicionar `https://api.statsig.com` e `https://a-cdn.anthropic.com`

**Nota:** A maioria dos usuários não controla o servidor do Claude Desktop. Esta opção é apenas para casos específicos.

---

### Opção 4: Usar Claude Web (contorna tudo)

**Solução mais simples e confiável:**

1. Acesse: https://claude.ai
2. Faça login com sua conta
3. Use normalmente no navegador

**Vantagens:**

- ✅ Sem problemas de CSP
- ✅ Sem problemas de cache corrompido
- ✅ Funciona 100%
- ✅ Sem necessidade de instalação

**Desvantagens:**

- ❌ Requer conexão com internet
- ❌ Não é um app desktop nativo

---

## 🔍 Verificação

### Como verificar se o problema foi resolvido

1. **Abrir DevTools no Claude Desktop:**
   - Windows/Linux: `Ctrl+Shift+I`
   - macOS: `Cmd+Option+I`

2. **Verificar Console:**
   - Não deve haver erros de CSP
   - Não deve haver erros de Statsig
   - Não deve haver erros de Permissions-Policy

3. **Verificar Network:**
   - `analytics.js` deve carregar com status 200
   - Requisições para `api.statsig.com` devem funcionar

---

## 📝 Notas Técnicas

### Por que isso acontece?

1. **CSP restritivo:** Claude Desktop usa Electron, que aplica políticas de segurança. Se o cache estiver corrompido, as políticas podem ficar desatualizadas.

2. **Statsig:** Sistema de feature flags usado pela Anthropic. Se não carregar, algumas funcionalidades podem não funcionar.

3. **Permissions-Policy:** Header HTTP que controla features do navegador. Features inválidas causam warnings no console.

### Prevenção

- **Atualizar Claude Desktop regularmente:** Versões mais recentes corrigem bugs de CSP
- **Não modificar arquivos de configuração manualmente:** Deixe o app gerenciar suas próprias configurações
- **Usar Claude Web se problemas persistirem:** É a solução mais estável

---

## 🆘 Suporte Adicional

Se nenhuma das soluções funcionar:

1. **Reportar bug:** https://github.com/anthropics/claude-desktop/issues
2. **Verificar versão:** Certifique-se de estar usando a versão mais recente
3. **Reinstalar:** Desinstalar completamente e reinstalar o Claude Desktop

---

## 📚 Referências

- [Claude Desktop GitHub](https://github.com/anthropics/claude-desktop)
- [Content Security Policy MDN](https://developer.mozilla.org/en-US/docs/Web/HTTP/CSP)
- [Permissions Policy MDN](https://developer.mozilla.org/en-US/docs/Web/HTTP/Permissions_Policy)
