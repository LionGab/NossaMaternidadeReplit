# Archive: Privacy & Support Features

## 🎯 Motivo do Archive

Estes componentes foram movidos para **fora do projeto principal** para manter o foco em:

- **iOS TestFlight Launch**
- **Google Play Internal Track**
- **App Store/Play Store submission**

Features de privacidade/suporte serão **re-implementadas após o lançamento** quando tivermos tempo para focar em compliance (LGPD/GDPR).

---

## 📁 Estrutura

```
archive/privacy-support/
├── screens/          # Screens de privacidade
│   ├── PrivacySettingsScreen.tsx
│   └── LegalScreen.tsx
├── components/       # Componentes relacionados
│   └── AIConsentModal.tsx
├── docs/             # Documentação de compliance
│   ├── REVENUECAT_AND_GDPR.md
│   ├── SECURITY.md
│   └── SECURITY_AUDIT_RESULTS.md
└── edge-functions/   # (Futuro) Edge functions de LGPD
    ├── delete-account/
    └── export-data/
```

---

## 🚫 O que foi removido

### Screens

- **PrivacySettingsScreen** - Configurações de opt-in/opt-out (AI, analytics, etc.)
- **LegalScreen** - Links para Termos de Uso, Privacidade, AI Disclaimer

### Componentes

- **AIConsentModal** - Modal de consentimento antes de usar NathIA

### Rotas

- Comentadas no `RootNavigator.tsx`:
  - `Legal` (linha ~336)
  - `PrivacySettings` (linha ~381)

### Docs

- **REVENUECAT_AND_GDPR.md** - Guia de compliance RevenueCat + GDPR
- **SECURITY.md** - Security policy
- **SECURITY_AUDIT_RESULTS.md** - Relatório de auditoria

---

## ✅ Edge Functions (mantidas no projeto)

**Estas funções PERMANECEM ativas** (são obrigatórias por lei LGPD):

- `supabase/functions/delete-account/` - Exclusão de conta (LGPD Art. 18)
- `supabase/functions/export-data/` - Exportação de dados (LGPD Art. 18)
- `supabase/functions/analytics/` - Analytics com privacidade

**Motivo:** São requisitos legais e funcionam automaticamente via API (não dependem de UI).

---

## 🔄 Roadmap de Reintegração (Pós-lançamento)

### Fase 1: MVP Stores (ATUAL)

- ❌ Remover distrações de privacidade/suporte
- ✅ Focar em TestFlight + Google Play
- ✅ Funcionalidades core: NathIA, Ciclo, Comunidade, Premium

### Fase 2: Compliance & Support (Q1 2026)

- [ ] Re-adicionar LegalScreen com termos atualizados
- [ ] Re-adicionar PrivacySettingsScreen
- [ ] Implementar consentimento granular (analytics, AI, etc.)
- [ ] Adicionar Help Center / FAQ
- [ ] Integrar sistema de tickets (Zendesk/Intercom?)

### Fase 3: Advanced Privacy (Q2 2026)

- [ ] Data portability UI (exportar dados via app)
- [ ] Account deletion UI (soft/hard delete com confirmação)
- [ ] Audit log de acessos a dados sensíveis
- [ ] Privacy dashboard (quais dados coletamos, quando, por quê)

---

## 📝 Notas para Claude Code

Se você ver referências a `PrivacySettingsScreen` ou `LegalScreen` no código:

1. **Não tente importar** - arquivos estão em `archive/privacy-support/`
2. **Remover referências** se causarem erros de build
3. **Focar em iOS/Android Stores** - este é o objetivo atual
4. **Não re-adicionar** sem autorização explícita do usuário

---

## 🔗 Links Úteis

- [CLAUDE.md (root)](../../CLAUDE.md) - Regras atualizadas focadas em Stores
- [TestFlight Gates](../../docs/release/TESTFLIGHT_GATES_v1.md) - Checklist de lançamento
- [Plano Operacional TestFlight](../../docs/release/PLANO_OPERACIONAL_TESTFLIGHT.md)

---

**Última atualização:** 2026-01-06
**Status:** Arquivado (não usar em produção)
