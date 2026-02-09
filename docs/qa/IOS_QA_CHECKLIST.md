# iOS QA Checklist (TestFlight) — 15 itens (5–10 min)

> Nossa Maternidade - QA Checklist para builds TestFlight
> Última atualização: Janeiro 2026

---

Use este checklist **após um build iOS TestFlight** para validar crash fix, navegação e fluxos críticos antes de liberar para testadores/review.

## Informações do Build

| Campo               | Valor                        |
| ------------------- | ---------------------------- |
| **Build Number**    | **\_\_\_\_** (ex.: 48)       |
| **Runtime Version** | **\_\_\_\_** (ex.: 2.0.0)    |
| **Data**            | \_**\_/\_\_**/\_\_\_\_       |
| **Testador(a)**     | **\*\*\*\***\_\_**\*\*\*\*** |
| **Dispositivo**     | **\*\*\*\***\_\_**\*\*\*\*** |
| **iOS Version**     | **\*\*\*\***\_\_**\*\*\*\*** |

> **Dica:** Faça pelo menos **1 cold start** (matar no app switcher e reabrir) e navegue pelas tabs antes de marcar como OK.

---

## 🔴 Crítico (Bloqueia Release)

Estes itens **devem passar 100%** para liberar o build.

### 1. App inicia sem crash

- **Como verificar:** Abrir app, aguardar 3s, não fecha sozinho
- [ ] OK
- Observações: **\*\***\*\*\*\***\*\***\_**\*\***\*\*\*\***\*\***

### 2. Cold start OK

- **Como verificar:** Matar no app switcher, reabrir
- [ ] OK
- Observações: **\*\***\*\*\*\***\*\***\_**\*\***\*\*\*\***\*\***

### 3. Login Email

- **Como verificar:** Criar conta nova ou login existente
- [ ] OK
- Observações: **\*\***\*\*\*\***\*\***\_**\*\***\*\*\*\***\*\***

### 4. Sign in with Apple

- **Como verificar:** Testar login (capability configurada)
- [ ] OK
- Observações: **\*\***\*\*\*\***\*\***\_**\*\***\*\*\*\***\*\***

### 5. Navegação tabs

- **Como verificar:** Tocar em todas as 5 tabs (Home, Ciclo, NathIA, Comunidade, Meus Cuidados)
- [ ] OK
- Observações: **\*\***\*\*\*\***\*\***\_**\*\***\*\*\*\***\*\***

---

## 🟡 Alta Prioridade

Estes itens são importantes para a experiência do usuário.

### 6. NathIA responde

- **Como verificar:** Enviar mensagem, receber resposta da IA
- [ ] OK
- Observações: **\*\***\*\*\*\***\*\***\_**\*\***\*\*\*\***\*\***

### 7. Paywall aparece

- **Como verificar:** Tentar feature premium (ex.: após 6 msg/dia no free tier)
- [ ] OK
- Observações: **\*\***\*\*\*\***\*\***\_**\*\***\*\*\*\***\*\***

### 8. Push permission

- **Como verificar:** Aceitar push, verificar token registrado (se aplicável)
- [ ] OK
- Observações: **\*\***\*\*\*\***\*\***\_**\*\***\*\*\*\***\*\***

### 9. Onboarding flow

- **Como verificar:** Completar todos os passos (novo usuário)
- [ ] OK
- Observações: **\*\***\*\*\*\***\*\***\_**\*\***\*\*\*\***\*\***

### 10. Modal/Sheet

- **Como verificar:** Abrir qualquer modal, fechar com gestos (swipe down)
- [ ] OK
- Observações: **\*\***\*\*\*\***\*\***\_**\*\***\*\*\*\***\*\***

---

## 🟢 Secundário

Estes itens melhoram a qualidade geral mas não bloqueiam release.

### 11. Dark mode

- **Como verificar:** Alternar tema no sistema, app responde corretamente
- [ ] OK
- Observações: **\*\***\*\*\*\***\*\***\_**\*\***\*\*\*\***\*\***

### 12. Scroll em listas

- **Como verificar:** FlatList/FlashList sem travamentos (60fps)
- [ ] OK
- Observações: **\*\***\*\*\*\***\*\***\_**\*\***\*\*\*\***\*\***

### 13. Logout/Relogin

- **Como verificar:** Deslogar, logar novamente
- [ ] OK
- Observações: **\*\***\*\*\*\***\*\***\_**\*\***\*\*\*\***\*\***

### 14. Background/Foreground

- **Como verificar:** Minimizar, voltar (não perde estado / não crasha)
- [ ] OK
- Observações: **\*\***\*\*\*\***\*\***\_**\*\***\*\*\*\***\*\***

### 15. Memory usage

- **Como verificar:** Xcode Instruments ou Settings > Developer (se disponível)
- [ ] OK
- Observações: **\*\***\*\*\*\***\*\***\_**\*\***\*\*\*\***\*\***

---

## Resultado Final

| Seção              | Passou  | Falhou  | Total  |
| ------------------ | ------- | ------- | ------ |
| 🔴 Crítico         | \_\_/5  | \_\_/5  | 5      |
| 🟡 Alta Prioridade | \_\_/5  | \_\_/5  | 5      |
| 🟢 Secundário      | \_\_/5  | \_\_/5  | 5      |
| **Total**          | \_\_/15 | \_\_/15 | **15** |

**Decisão:** [ ] Aprovado para TestFlight [ ] Reprovado - Requer Fix

---

## Se crash aparecer (coleta de evidências)

### 1. Analytics do iOS (mais fácil)

1. No dispositivo, ir em **Settings > Privacy & Security > Analytics & Improvements > Analytics Data**
2. Procurar arquivos recentes com nome do app (ex.: `NossaMaternidade-2026-01-24-...`)
3. Tocar no arquivo e usar **Share** para exportar

### 2. Console.app (macOS - mais detalhado)

1. Conectar dispositivo ao Mac via cabo
2. Abrir **Console.app** (Applications > Utilities)
3. Selecionar o dispositivo na sidebar
4. Filtrar por `NossaMaternidade` ou `br.com.nossamaternidade.app`
5. Reproduzir o crash e capturar os logs

### 3. Xcode Devices (crash logs estruturados)

1. Conectar dispositivo ao Mac
2. Abrir Xcode > Window > Devices and Simulators
3. Selecionar dispositivo > View Device Logs
4. Filtrar por tipo "Crash" e nome do app

### 4. Enviando para análise

Ao reportar um crash, incluir:

```
Build Number: [ex.: 48]
Runtime Version: [ex.: 2.0.0]
Dispositivo: [ex.: iPhone 15 Pro]
iOS Version: [ex.: 17.2]
Ação que causou o crash: [ex.: Abrir app após instalar via TestFlight]
Stack trace: [colar aqui ou anexar arquivo .crash]
```

---

## Referências

- [TESTFLIGHT_DEPLOY.md](../release/TESTFLIGHT_DEPLOY.md) - Guia de deploy
- [TESTFLIGHT_GATES_v1.md](../release/TESTFLIGHT_GATES_v1.md) - Gates de release

---

_Versão: 1.0 - Janeiro 2026_
