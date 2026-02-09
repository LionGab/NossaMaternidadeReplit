# Auditoria de Dimensions.get() Estático

> Gerado em: 2026-01-06
> Objetivo: Eliminar `Dimensions.get()` estático (causa raiz de layouts quebrados)

## Resumo

| Prioridade         | Arquivos | Status           |
| ------------------ | -------- | ---------------- |
| P0 (Onboarding)    | 3        | ✅ Corrigido     |
| P1 (Auth/Features) | 10       | ⏳ Próxima etapa |
| P2 (Utils)         | 1        | 📝 Deprecar      |
| **Total**          | **14**   | -                |

---

## Tabela de Ocorrências

| Arquivo                                                | Linha | Expressão                                                                         | Uso                                       | Impacto                            | Prioridade |
| ------------------------------------------------------ | ----- | --------------------------------------------------------------------------------- | ----------------------------------------- | ---------------------------------- | ---------- |
| `src/screens/onboarding/OnboardingWelcomePremium.tsx`  | 50    | `const { height: SCREEN_HEIGHT } = Dimensions.get("window")`                      | HERO_HEIGHT (45% tela)                    | Alto - hero height fixo            | **P0**     |
| `src/screens/onboarding/OnboardingStage.tsx`           | 30    | `const SCREEN_HEIGHT = Dimensions.get("window").height`                           | HERO_HEIGHT (22% tela), header paddingTop | Alto - hero + header quebram       | **P0**     |
| `src/screens/onboarding/OnboardingWelcomeRedesign.tsx` | 50    | `const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window")` | Orbs posicionamento                       | Médio - orbs fixos mas decorativos | **P0**     |
| `src/screens/auth/EmailAuthScreen.tsx`                 | 65    | `const { height: SCREEN_HEIGHT } = Dimensions.get("window")`                      | isCompact check                           | Alto - layout responsivo           | P1         |
| `src/screens/auth/AuthLandingScreen.tsx`               | 68    | `const { height: SCREEN_HEIGHT, width: SCREEN_WIDTH } = Dimensions.get("window")` | Layout principal                          | Alto - tela inicial                | P1         |
| `src/screens/auth/ForgotPasswordScreen.tsx`            | 51    | `const { height: SCREEN_HEIGHT } = Dimensions.get("window")`                      | Layout                                    | Médio                              | P1         |
| `src/screens/LoginScreenRedesign.tsx`                  | 74    | `const { width: SCREEN_WIDTH } = Dimensions.get("window")`                        | Partículas flutuantes                     | Baixo - decorativo                 | P1         |
| `src/screens/AffirmationsScreen.tsx`                   | 21    | `const { height: SCREEN_HEIGHT } = Dimensions.get("window")`                      | Layout                                    | Médio                              | P1         |
| `src/screens/AffirmationsScreenRedesign.tsx`           | 35    | `const { width: SCREEN_WIDTH } = Dimensions.get("window")`                        | Cards width                               | Médio                              | P1         |
| `src/screens/CycleTrackerScreen.tsx`                   | 11    | `const { width: SCREEN_WIDTH } = Dimensions.get("window")`                        | Charts width                              | Médio                              | P1         |
| `src/screens/CycleTrackerScreenRedesign.tsx`           | 36    | `const { width: SCREEN_WIDTH } = Dimensions.get("window")`                        | Charts width                              | Médio                              | P1         |
| `src/screens/DailyLogScreen.tsx`                       | 25    | `const { width: SCREEN_WIDTH } = Dimensions.get("window")`                        | Layout                                    | Médio                              | P1         |
| `src/components/login/FloatingParticle.tsx`            | 20    | `const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window")` | Animações                                 | Baixo - decorativo                 | P1         |
| `src/utils/dimensions.ts`                              | 4-10  | Múltiplas                                                                         | Exports legacy                            | Baixo - utils                      | P2         |

---

## Padrão de Correção

### ANTES (ERRADO - fora do componente)

```typescript
const { height: SCREEN_HEIGHT } = Dimensions.get("window");
const isCompact = SCREEN_HEIGHT < 700;

export function Screen() {
  // SCREEN_HEIGHT nunca atualiza
}
```

### DEPOIS (CORRETO - dentro do componente)

```typescript
import { useWindowDimensions } from "react-native";

export function Screen() {
  const { width, height } = useWindowDimensions();
  const isCompact = height < 700;
  // Valores reativos, atualizam automaticamente
}
```

---

## Critérios de Aceitação

- [x] `rg "Dimensions.get(" src/screens/onboarding` retorna **0 resultados**
- [x] `npm run typecheck` passa
- [x] `npm run lint` passa
- [x] `npm run quality-gate` passa
- [ ] Testado em iPhone SE (tela pequena)
- [ ] Testado em iPhone 15 Pro Max (tela grande)

---

## Hotfixes Adicionais (sem Dimensions.get)

| Arquivo                    | Problema                       | Solução                                  |
| -------------------------- | ------------------------------ | ---------------------------------------- |
| `OnboardingDate.tsx`       | DatePicker coberto pelo footer | Esconder footer quando picker iOS aberto |
| `OnboardingCheckIn.tsx`    | TimePicker coberto pelo footer | Esconder footer quando picker iOS aberto |
| `OnboardingSeason.tsx`     | TextInput coberto pelo teclado | KeyboardAvoidingView + scroll config     |
| `AnimatedSplashScreen.tsx` | Splash pode travar infinito    | Timeout 5s de segurança                  |
