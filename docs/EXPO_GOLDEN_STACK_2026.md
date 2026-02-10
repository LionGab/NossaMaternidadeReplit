# NossaMaternidade — Expo SDK 55 Handoff Operacional

> Fonte da verdade para o estado do upgrade SDK 54 → 55.
> Atualizado: 2026-02-10 | PR #8: `chore/expo-sdk-55`

---

## §0 Objetivo (Definition of Done)

Migrar para **Expo SDK 55**, garantindo:

- Builds iOS/Android OK (EAS cloud)
- Runtime estável (New Architecture padrão no SDK 55)
- Sem regressões de navegação/UX
- CI quality-gate verde (typecheck + lint + build check)

**DoD mínimo:**

- [ ] `npx expo-doctor` sem erros bloqueantes
- [ ] `npm run quality-gate` verde
- [ ] EAS build preview iOS + Android
- [ ] Smoke test: abrir app, login, tabs, NathIA, comunidade, push

---

## §1 Estado atual

### main (estável — SDK 54)

| Item           | Versão  |
| -------------- | ------- |
| Expo SDK       | 54.0.33 |
| React Native   | 0.81.5  |
| React          | 19.1.0  |
| Node (EAS)     | 20.11.1 |
| runtimeVersion | 2.0.1   |
| Reanimated     | 4.1.1   |
| NativeWind     | 4.1.23  |

### PR #8 `chore/expo-sdk-55` (não mergeado)

| Item           | Versão                |
| -------------- | --------------------- |
| Expo SDK       | 55.0.0-preview.10     |
| React Native   | 0.83.1                |
| React          | 19.2.0                |
| Node (EAS)     | 20.19.4               |
| runtimeVersion | 3.0.0                 |
| Reanimated     | ~4.2.1                |
| NativeWind     | ^4.1.23 (sem mudança) |
| TypeScript     | ~5.9.2                |
| Sentry         | ~7.11.0               |
| expo-updates   | ~55.0.7               |

**Mudanças chave no PR #8:**

- `enableBsdiffPatchSupport: true` (patches OTA menores)
- New Architecture é padrão (sem `newArchEnabled`)
- Plugin `expo-notifications` adicionado (requerido pelo SDK 55)
- Android `compileSdkVersion: 36`, `targetSdkVersion: 36`

---

## §2 Requisitos de ambiente

| Requisito       | Valor mínimo        | Nota                        |
| --------------- | ------------------- | --------------------------- |
| Node            | 20.19.4             | `.nvmrc` + `engines` no pkg |
| Xcode           | 16.1+               | EAS usa `image: latest`     |
| iOS deployment  | 15.1                | `expo-build-properties`     |
| Android compile | SDK 36              | `expo-build-properties`     |
| Android target  | SDK 36              | `expo-build-properties`     |
| Android min     | SDK 23              | Default                     |
| CocoaPods       | Gerenciado pelo EAS | Não instalar manualmente    |
| Package manager | npm                 | `bun.lock` removido         |

**Path local:** Mover repo para path sem espaço (ex: `C:\Dev\NossaMaternidade`) para evitar bugs de URI no CocoaPods/Metro em Windows.

---

## §3 Regras não negociáveis

- TypeScript strict, sem `any`, sem `@ts-ignore`/`@ts-expect-error` sem justificativa
- Não commitar secrets (.env, keys, tokens)
- Mudanças mínimas e reversíveis
- Se substituir lib, remover a antiga
- Não tocar `supabase/**` sem pedido explícito
- Commits atômicos com mensagens claras
- Manter design system/tokens (não inventar UI)

---

## §4 Estratégia em 3 blocos

### Bloco A — Setup local (fora de PR)

Mover repo para path sem espaço:

```bash
mkdir -p /c/Dev
mv "/c/Users/User/Documents/Nossa-Maternidade-03/NossaMaternidadeReplit" /c/Dev/NossaMaternidade
cd /c/Dev/NossaMaternidade && git status
```

### Bloco B — PR #8 (upgrade + correções operacionais)

Correções aplicadas:

1. Node 22.22.0 → 20.19.4 (`eas.json` + `.nvmrc` + `package.json engines`)
2. Cache key EAS → `nossamaternidade-v6-sdk55`
3. Plugin `expo-notifications` adicionado em `app.config.js`
4. Android `compileSdkVersion: 36` / `targetSdkVersion: 36`
5. Patches avaliados: ambos mantidos (bugs reais, não path-only)
6. `bun.lock` removido (conflito de lock file com npm)

### Bloco C — PR #9 (este documento)

Reescrita do doc como fonte da verdade operacional pós-upgrade.

---

## §5 Ordem de execução (canon 0→10)

```
 0. [SETUP] Mover repo para path sem espaço (C:\Dev\NossaMaternidade)
 1. [PR #8] ✅ Node → 20.19.4 em eas.json + .nvmrc + package.json
 2. [PR #8] ✅ newArchEnabled já não existia (SDK 55 assume)
 3. [PR #8] ✅ Patch react-native+0.83.1 MANTIDO (null-safety SPM + URI fix)
 4. [PR #8] ✅ Patch metro-config+0.83.3 MANTIDO (bug Windows import path)
 5. [PR #8] ✅ Cache key EAS bumped para nossamaternidade-v6-sdk55
 6. [PR #8] ✅ Plugin expo-notifications + Android SDK levels 36
 7. [VALIDAÇÃO] ✅ npm run quality-gate (typecheck + lint OK)
 8. [VALIDAÇÃO] ✅ npx expo-doctor 17/17
 9. [VALIDAÇÃO] ⏳ EAS build preview iOS + Android (pendente)
10. [VALIDAÇÃO] ⏳ Smoke test + update gating (pendente)
```

---

## §6 Validação

### Quality Gate (local) ✅

```bash
npm run quality-gate          # typecheck + lint + build check
npx expo-doctor               # 17/17 passed
npx expo export --platform web # bundle OK
```

### EAS build (prova real) ⏳

```bash
eas build --profile preview --platform ios
eas build --profile preview --platform android
```

### Smoke test (no build gerado)

- [ ] App abre sem crash
- [ ] Login (email + social)
- [ ] Tabs principais navegam
- [ ] NathIA responde
- [ ] Comunidade carrega posts
- [ ] Push notifications recebidas

### Update gating (runtimeVersion)

- App antigo (runtime 2.0.1) **NÃO** recebe update novo
- App novo (runtime 3.0.0) recebe updates normalmente
- `enableBsdiffPatchSupport: true` reduz tamanho dos patches OTA

---

## §7 Riscos

| Risco                         | Severidade | Mitigação                                           |
| ----------------------------- | ---------- | --------------------------------------------------- |
| SDK 55 em preview (instável)  | ALTO       | EAS build real antes de merge; rollback pronto      |
| Libs nativas incompatíveis    | ALTO       | expo-doctor 17/17 OK; validar em build nativo       |
| Plugin notifications faltando | ALTO       | Adicionado no PR #8                                 |
| Metro patch Windows           | BAIXO      | Mantido; bug confirmado no metro-config 0.83.3      |
| RN CocoaPods URI::File        | BAIXO      | Patch mantido; defensivo para paths com espaço      |
| OTA breakage                  | BAIXO      | Mitigado pelo bump runtimeVersion 2.0.1 → 3.0.0     |
| Android SDK 36 incompat.      | MÉDIO      | compileSdk + targetSdk setados via build-properties |

---

## §8 Rollback

Se algo der errado após merge:

```bash
# Opção 1: Reverter o merge
git revert <PR #8 merge commit>
npm install
# main volta ao SDK 54

# Opção 2: Reset completo
# No package.json, reverter expo para ~54.0.33
npx expo install --fix
npx expo prebuild --clean
```

**runtimeVersion:** Ao reverter, builds voltam para runtime 2.0.1. Apps com 3.0.0 não recebem mais updates (isso é esperado e seguro).

---

## §9 Prompt único para Codex

Bloco colável para validar o estado pós-correção:

```bash
npm install && npx expo-doctor && npm run typecheck && npm run lint && echo "SDK 55 READY"
```

Para build real:

```bash
eas build --profile preview --platform ios && eas build --profile preview --platform android
```

---

## Patches ativos

| Patch                       | Bug                                     | Necessário? |
| --------------------------- | --------------------------------------- | ----------- |
| `metro-config+0.83.3.patch` | `import(absolutePath)` falha no Windows | Sim         |
| `react-native+0.83.1.patch` | `URI::File.build` + SPM null-safety     | Sim         |

Ambos os patches são aplicados automaticamente via `postinstall` (`patch-package`).

---

## Arquivos modificados (PR #8 + correções)

| Arquivo                       | Mudança                                             |
| ----------------------------- | --------------------------------------------------- |
| `eas.json`                    | Node 20.19.4, cache key `nossamaternidade-v6-sdk55` |
| `app.config.js`               | Plugin expo-notifications, Android SDK 36           |
| `.nvmrc`                      | 20.19.4                                             |
| `package.json`                | `engines.node >= 20.19.4`, deps SDK 55              |
| `package-lock.json`           | Atualizado                                          |
| `patches/metro-config+0.83.3` | Mantido (bug Windows)                               |
| `patches/react-native+0.83.1` | Mantido (URI + SPM fix)                             |
