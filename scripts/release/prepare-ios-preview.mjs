#!/usr/bin/env node

/**
 * Script de preparação para iOS Preview Release
 * 
 * Objetivo: Validar configurações e gerar instruções para build EAS iOS Preview
 * 
 * Uso: npm run prepare-ios-preview
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '../..');

// Configurações do projeto
const CONFIG = {
  bundleId: 'com.valenteapp.nossamaternidade',
  appleTeamId: 'KZPW4S77UH',
  appStoreConnectAppId: '6756980888',
  testDeviceUdids: ['00008140-001655C03C50801C'],
  releaseChannel: 'ios_preview',
  sku: 'nossamaternidade001',
};

// Cores para output no terminal
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function logSection(title) {
  console.log('\n' + '='.repeat(60));
  log(title, 'cyan');
  console.log('='.repeat(60));
}

function logSuccess(message) {
  log(`✅ ${message}`, 'green');
}

function logWarning(message) {
  log(`⚠️  ${message}`, 'yellow');
}

function logError(message) {
  log(`❌ ${message}`, 'red');
}

function logInfo(message) {
  log(`ℹ️  ${message}`, 'blue');
}

// Validar se arquivo existe
function fileExists(filePath) {
  return fs.existsSync(path.resolve(ROOT_DIR, filePath));
}

// Ler arquivo JSON
function readJSON(filePath) {
  try {
    const fullPath = path.resolve(ROOT_DIR, filePath);
    const content = fs.readFileSync(fullPath, 'utf-8');
    return JSON.parse(content);
  } catch (error) {
    return null;
  }
}

// Helper para escapar nomes de propriedades em regex
function escapeRegex(text) {
  return text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

// Helper para extrair propriedade do config usando regex
function extractConfigProperty(content, propertyName) {
  // Suporta: property: "X", property: 'X', property:"X" (com ou sem espaços)
  const escapedPropertyName = escapeRegex(propertyName);
  const regex = new RegExp(`${escapedPropertyName}\\s*:\\s*["']([^"']+)["']`);
  const match = content.match(regex);
  return match ? match[1] : null;
}

// Ler app.config.js (JavaScript module)
function readAppConfig() {
  try {
    const configPath = path.resolve(ROOT_DIR, 'app.config.js');
    const configContent = fs.readFileSync(configPath, 'utf-8');
    
    // Usar helper para extrair propriedades
    const version = extractConfigProperty(configContent, 'version');
    const buildNumber = extractConfigProperty(configContent, 'buildNumber');
    const bundleIdentifier = extractConfigProperty(configContent, 'bundleIdentifier');
    
    if (!version && !buildNumber && !bundleIdentifier) {
      logWarning('Não foi possível extrair valores do app.config.js - formato pode ser diferente');
    }
    
    return {
      version,
      ios: {
        buildNumber,
        bundleIdentifier,
      }
    };
  } catch (error) {
    logError(`Erro ao ler app.config.js: ${error.message}`);
    return null;
  }
}

// 1. Auditar repositório
function auditRepository() {
  logSection('1️⃣  AUDITORIA DO REPOSITÓRIO');
  
  let hasErrors = false;

  // Verificar arquivos essenciais
  const requiredFiles = [
    'eas.json',
    'app.config.js',
    'package.json',
  ];

  requiredFiles.forEach(file => {
    if (fileExists(file)) {
      logSuccess(`${file} encontrado`);
    } else {
      logError(`${file} NÃO encontrado`);
      hasErrors = true;
    }
  });

  // Verificar eas.json
  const easConfig = readJSON('eas.json');
  if (easConfig) {
    const profiles = easConfig.build || {};
    if (profiles.ios_preview) {
      logSuccess('Perfil ios_preview encontrado em eas.json');
    } else {
      logWarning('Perfil ios_preview NÃO encontrado em eas.json');
    }
    if (profiles.ios_testflight) {
      logSuccess('Perfil ios_testflight encontrado em eas.json');
    } else {
      logWarning('Perfil ios_testflight NÃO encontrado em eas.json');
    }
  }

  return !hasErrors;
}

// 2. Verificar configuração do app
function checkAppConfig() {
  logSection('2️⃣  CONFIGURAÇÃO DO APP');

  const appConfig = readAppConfig();
  if (!appConfig) {
    logError('Não foi possível ler app.config.js');
    return false;
  }

  // Verificar bundle ID
  const iosBundleId = appConfig.ios?.bundleIdentifier;
  if (iosBundleId === CONFIG.bundleId) {
    logSuccess(`Bundle ID: ${iosBundleId}`);
  } else {
    logWarning(`Bundle ID atual: ${iosBundleId}, esperado: ${CONFIG.bundleId}`);
  }

  // Verificar versão
  const version = appConfig.version;
  if (version != null && version !== '') {
    logInfo(`Versão do app: ${version}`);
  } else {
    logWarning('Versão do app: não definida em app.config.js');
  }

  // Verificar build number (iOS)
  const buildNumber = appConfig.ios?.buildNumber;
  if (buildNumber) {
    logInfo(`Build number (iOS): ${buildNumber}`);
  } else {
    logWarning('Build number (iOS) não definido em app.config.js');
  }

  return true;
}

// 3. Gerar instruções de build
function generateBuildInstructions() {
  logSection('3️⃣  INSTRUÇÕES DE BUILD');

  const appConfig = readAppConfig();
  const version = appConfig?.version || '?.?.?';
  const buildNumber = appConfig?.ios?.buildNumber || '?';

  log('\n📦 Comando para build iOS Preview (Ad Hoc):', 'bright');
  console.log('');
  console.log('  eas build --platform ios --profile ios_preview');
  console.log('');

  log('📦 Comando para build iOS TestFlight (após aprovação):', 'bright');
  console.log('');
  console.log('  eas build --platform ios --profile ios_testflight');
  console.log('');

  logInfo(`Este build será: v${version} (build ${buildNumber})`);
}

// 4. Verificar se build number precisa incrementar
function checkBuildNumber() {
  logSection('4️⃣  VERIFICAÇÃO DE BUILD NUMBER');

  const appConfig = readAppConfig();
  const buildNumber = appConfig?.ios?.buildNumber;

  if (!buildNumber) {
    logWarning('Build number não definido');
    logInfo('Adicione "buildNumber" em app.config.js → ios → buildNumber');
    return;
  }

  logInfo(`Build number atual: ${buildNumber}`);
  logInfo('Se você já fez um build com este número, incremente-o antes de fazer um novo build');
  
  log('\nPara incrementar o build number:', 'bright');
  console.log('1. Abra app.config.js');
  console.log(`2. Encontre: buildNumber: "${buildNumber}"`);
  const buildNumberInt = parseInt(buildNumber, 10);
  const nextBuild = isNaN(buildNumberInt) ? '?' : (buildNumberInt + 1);
  console.log(`3. Altere para: buildNumber: "${nextBuild}"`);
}

// 5. Checklist para Apple Developer Portal
function showAppleDevChecklist() {
  logSection('5️⃣  CHECKLIST - APPLE DEVELOPER PORTAL');

  log('\n🍎 Antes de fazer o build, verifique no Apple Developer Portal:', 'bright');
  console.log('');
  console.log('  1. Acesse: https://developer.apple.com/account');
  console.log('  2. Vá em: Certificates, Identifiers & Profiles');
  console.log('  3. Adicione UDIDs dos dispositivos de teste:');
  
  CONFIG.testDeviceUdids.forEach((udid, index) => {
    console.log(`     ${index + 1}. ${udid}`);
  });

  console.log('  4. Crie/atualize o Provisioning Profile (Ad Hoc)');
  console.log(`  5. Certifique-se de que o Bundle ID está registrado: ${CONFIG.bundleId}`);
  console.log('');
}

// 6. Gerar bloco markdown para issue
function generateIssueMarkdown() {
  logSection('6️⃣  BLOCO MARKDOWN PARA ISSUE');

  const appConfig = readAppConfig();
  const version = appConfig?.version || '?.?.?';
  const buildNumber = appConfig?.ios?.buildNumber || '?';

  const markdown = `
## 📦 Build iOS Preview - v${version} (build ${buildNumber})

### Configuração
- **Bundle ID**: \`${CONFIG.bundleId}\`
- **Apple Team ID**: \`${CONFIG.appleTeamId}\`
- **App Store Connect ID**: \`${CONFIG.appStoreConnectAppId}\`
- **Profile**: \`ios_preview\`

### UDIDs de Teste
${CONFIG.testDeviceUdids.map(udid => `- \`${udid}\``).join('\n')}

### Comandos

\`\`\`bash
# Build iOS Preview (Ad Hoc)
eas build --platform ios --profile ios_preview

# Build iOS TestFlight (após testes aprovados)
# eas build --platform ios --profile ios_testflight
\`\`\`

### Checklist
- [ ] UDIDs adicionados no Apple Developer Portal
- [ ] Provisioning profile atualizado
- [ ] Build completado no EAS
- [ ] Link de instalação enviado
- [ ] App testado pela influenciadora
- [ ] Feedback coletado

### Links
- **App Store Connect**: https://appstoreconnect.apple.com/apps/${CONFIG.appStoreConnectAppId}
- **Apple Developer**: https://developer.apple.com/account
- **Guia de Instalação**: [IOS_PREVIEW_INFLUENCER.md](../docs/IOS_PREVIEW_INFLUENCER.md)
`;

  log('\nCopie o bloco abaixo e cole na issue do GitHub:', 'bright');
  console.log(markdown);
}

// 7. Smoke test checklist
function showSmokeTestChecklist() {
  logSection('7️⃣  SMOKE TEST CHECKLIST');

  log('\n🧪 Testes obrigatórios após instalação:', 'bright');
  console.log('');
  console.log('  [ ] App instala corretamente');
  console.log('  [ ] App abre sem crashes');
  console.log('  [ ] Login/Signup funciona');
  console.log('  [ ] Navegação principal funciona');
  console.log('  [ ] Features críticas testadas');
  console.log('');
  
  logWarning('Se tocar billing/auth (RevenueCat/Supabase), exija checklist de teste manual');
}

// Main
async function main() {
  log('\n' + '█'.repeat(60), 'magenta');
  log('        🚀 PREPARAÇÃO DE RELEASE - iOS PREVIEW', 'magenta');
  log('█'.repeat(60) + '\n', 'magenta');

  log('Repositório: LionGab/NossaMaternidade', 'cyan');
  log('Bundle ID: ' + CONFIG.bundleId, 'cyan');
  log('Release Channel: ' + CONFIG.releaseChannel + '\n', 'cyan');

  // Executar todas as verificações
  const auditPassed = auditRepository();
  
  if (!auditPassed) {
    logError('\n❌ Auditoria falhou. Corrija os erros acima antes de continuar.');
    process.exit(1);
  }

  checkAppConfig();
  checkBuildNumber();
  showAppleDevChecklist();
  generateBuildInstructions();
  showSmokeTestChecklist();
  generateIssueMarkdown();

  logSection('✅ PREPARAÇÃO CONCLUÍDA');
  log('\nPróximos passos:', 'bright');
  console.log('  1. Verifique o checklist do Apple Developer Portal acima');
  console.log('  2. Incremente o build number se necessário');
  console.log('  3. Execute: eas build --platform ios --profile ios_preview');
  console.log('  4. Aguarde o build completar no EAS');
  console.log('  5. Envie o link de instalação para a influenciadora');
  console.log('  6. Siga o guia: docs/IOS_PREVIEW_INFLUENCER.md\n');

  logSuccess('Script concluído com sucesso! 🎉\n');
}

// Executar
main().catch(error => {
  logError(`\n❌ Erro fatal: ${error.message}`);
  console.error(error);
  process.exit(1);
});
