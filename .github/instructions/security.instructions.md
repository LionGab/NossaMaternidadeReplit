---
applyTo: "**/*.ts,**/*.tsx,**/*.js,**/*.jsx"
---

# Instruções de Segurança - Nossa Maternidade

## 🚨 PRIORIDADE MÁXIMA

Este é um app de saúde materna. Dados são extremamente sensíveis e protegidos pela LGPD.

## Autenticação

### Firebase Auth - Implementação Segura

```typescript
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  User,
} from "firebase/auth";
import { auth } from "@/config/firebase";

/**
 * Autentica usuário com email e senha
 * @throws AuthError com código específico
 */
export async function login(email: string, senha: string): Promise<User> {
  try {
    const { user } = await signInWithEmailAndPassword(auth, email, senha);
    return user;
  } catch (error: any) {
    // NUNCA logue a senha ou detalhes sensíveis
    console.error("Falha no login:", error.code);

    // Mensagens genéricas para evitar enumeração de usuários
    switch (error.code) {
      case "auth/user-not-found":
      case "auth/wrong-password":
        throw new Error("Email ou senha incorretos");
      case "auth/too-many-requests":
        throw new Error("Muitas tentativas. Aguarde alguns minutos.");
      default:
        throw new Error("Erro ao fazer login. Tente novamente.");
    }
  }
}
```

### Autenticação Biométrica

```typescript
import * as LocalAuthentication from "expo-local-authentication";
import * as SecureStore from "expo-secure-store";

const BIOMETRIC_KEY = "biometric_enabled";
const REFRESH_TOKEN_KEY = "refresh_token";

/**
 * Verifica se dispositivo suporta biometria
 */
export async function checkBiometricSupport(): Promise<boolean> {
  const hasHardware = await LocalAuthentication.hasHardwareAsync();
  const isEnrolled = await LocalAuthentication.isEnrolledAsync();
  return hasHardware && isEnrolled;
}

/**
 * Autentica com biometria
 * @returns true se autenticado com sucesso
 */
export async function authenticateWithBiometrics(): Promise<boolean> {
  const result = await LocalAuthentication.authenticateAsync({
    promptMessage: "Confirme sua identidade",
    fallbackLabel: "Usar senha",
    cancelLabel: "Cancelar",
    disableDeviceFallback: false,
  });

  return result.success;
}

/**
 * Armazena token de forma segura (encrypted)
 * NUNCA use AsyncStorage para tokens!
 */
export async function storeSecureToken(token: string): Promise<void> {
  await SecureStore.setItemAsync(REFRESH_TOKEN_KEY, token, {
    keychainAccessible: SecureStore.WHEN_UNLOCKED_THIS_DEVICE_ONLY,
  });
}

/**
 * Recupera token seguro
 */
export async function getSecureToken(): Promise<string | null> {
  return await SecureStore.getItemAsync(REFRESH_TOKEN_KEY);
}

/**
 * Remove token no logout
 */
export async function clearSecureToken(): Promise<void> {
  await SecureStore.deleteItemAsync(REFRESH_TOKEN_KEY);
}
```

## Validação de Inputs

### SEMPRE Validar no Frontend E Backend

```typescript
import { z } from "zod";

// Schemas de validação
export const emailSchema = z
  .string()
  .email("Email inválido")
  .max(255, "Email muito longo")
  .toLowerCase()
  .trim();

export const senhaSchema = z
  .string()
  .min(8, "Mínimo 8 caracteres")
  .max(128, "Máximo 128 caracteres")
  .regex(/[A-Z]/, "Deve conter letra maiúscula")
  .regex(/[a-z]/, "Deve conter letra minúscula")
  .regex(/[0-9]/, "Deve conter número")
  .regex(/[^A-Za-z0-9]/, "Deve conter caractere especial");

export const cpfSchema = z
  .string()
  .regex(/^\d{11}$/, "CPF deve ter 11 dígitos")
  .refine(validarCPF, "CPF inválido");

export const telefoneSchema = z.string().regex(/^\d{10,11}$/, "Telefone inválido");

export const dataSchema = z
  .string()
  .datetime()
  .refine((date) => new Date(date) <= new Date(), {
    message: "Data não pode ser no futuro",
  });

// Sanitização
export function sanitizeString(input: string): string {
  return input
    .trim()
    .replace(/[<>]/g, "") // Remove < > para prevenir XSS básico
    .slice(0, 1000); // Limita tamanho
}
```

### Validação de CPF

```typescript
function validarCPF(cpf: string): boolean {
  // Remove caracteres não numéricos
  cpf = cpf.replace(/\D/g, "");

  // Verifica se tem 11 dígitos
  if (cpf.length !== 11) return false;

  // Verifica se todos os dígitos são iguais
  if (/^(\d)\1+$/.test(cpf)) return false;

  // Validação dos dígitos verificadores
  let soma = 0;
  for (let i = 0; i < 9; i++) {
    soma += parseInt(cpf.charAt(i)) * (10 - i);
  }
  let resto = (soma * 10) % 11;
  if (resto === 10 || resto === 11) resto = 0;
  if (resto !== parseInt(cpf.charAt(9))) return false;

  soma = 0;
  for (let i = 0; i < 10; i++) {
    soma += parseInt(cpf.charAt(i)) * (11 - i);
  }
  resto = (soma * 10) % 11;
  if (resto === 10 || resto === 11) resto = 0;
  if (resto !== parseInt(cpf.charAt(10))) return false;

  return true;
}
```

## Proteção de Dados (LGPD)

### Dados de Saúde são Sensíveis

```typescript
// NUNCA logue esses dados:
// - Nome completo + dados médicos
// - CPF
// - Histórico de gestação
// - Exames e resultados
// - Informações do bebê

// ✅ CORRETO - Log sem PII
console.log("Gestação criada", { gestacaoId: "123", userId: "abc" });

// ❌ ERRADO - NUNCA faça isso
console.log("Gestação criada", {
  nome: "Maria Silva",
  cpf: "12345678900",
  gestacao: dadosCompletos,
});
```

### Criptografia de Dados Sensíveis

```typescript
import * as Crypto from "expo-crypto";

/**
 * Hash de dados sensíveis para busca
 * Útil para indexar CPF sem armazenar em texto puro
 */
export async function hashSensitiveData(data: string): Promise<string> {
  const digest = await Crypto.digestStringAsync(
    Crypto.CryptoDigestAlgorithm.SHA256,
    data + process.env.EXPO_PUBLIC_HASH_SALT
  );
  return digest;
}
```

## Variáveis de Ambiente

### Estrutura de .env

```bash
# .env.local (NUNCA commitar!)

# Firebase
EXPO_PUBLIC_FIREBASE_API_KEY=xxx
EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=xxx
EXPO_PUBLIC_FIREBASE_PROJECT_ID=xxx
EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=xxx
EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=xxx
EXPO_PUBLIC_FIREBASE_APP_ID=xxx

# Supabase (se usar)
EXPO_PUBLIC_SUPABASE_URL=xxx
EXPO_PUBLIC_SUPABASE_ANON_KEY=xxx

# App
EXPO_PUBLIC_API_URL=xxx
EXPO_PUBLIC_HASH_SALT=xxx

# SECRETS (apenas backend/functions)
FIREBASE_ADMIN_KEY=xxx
SUPABASE_SERVICE_KEY=xxx
```

### .gitignore Obrigatório

```gitignore
# Secrets
.env
.env.local
.env.*.local
*.pem
*.key
serviceAccountKey.json
google-services.json
GoogleService-Info.plist

# Expo
.expo/
dist/
```

## Comunicação Segura

### HTTPS Obrigatório

```typescript
// Configuração do cliente HTTP
import axios from "axios";

const api = axios.create({
  baseURL: process.env.EXPO_PUBLIC_API_URL,
  timeout: 30000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Interceptor para adicionar token
api.interceptors.request.use(async (config) => {
  const token = await getSecureToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Interceptor para refresh token
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      // Tentar refresh ou redirect para login
      await handleTokenRefresh();
    }
    return Promise.reject(error);
  }
);
```

### Certificate Pinning (Produção)

```typescript
// Para APIs críticas de saúde, implemente cert pinning
// Expo não suporta nativamente, use react-native-ssl-pinning
// ou configure no backend com mTLS
```

## Code Review Checklist - Segurança

### 🔴 CRÍTICO - Bloquear PR se:

- [ ] Senhas/tokens/API keys hardcoded
- [ ] Dados de saúde logados
- [ ] CPF/PII em logs ou analytics
- [ ] AsyncStorage usado para tokens (usar SecureStore!)
- [ ] HTTP ao invés de HTTPS
- [ ] Sem validação de input
- [ ] SQL/NoSQL injection possível
- [ ] XSS possível

### 🟡 IMPORTANTE - Solicitar correção:

- [ ] Mensagens de erro expõem detalhes internos
- [ ] Falta rate limiting
- [ ] Falta timeout em requests
- [ ] Sessão não expira
- [ ] Falta verificação de autorização

### 🟢 BOM TER:

- [ ] Logging estruturado
- [ ] Métricas de segurança
- [ ] Audit trail de ações sensíveis
- [ ] Backup de dados criptografado
