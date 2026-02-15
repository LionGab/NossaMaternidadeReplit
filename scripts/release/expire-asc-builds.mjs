#!/usr/bin/env node

import crypto from "crypto";
import fs from "fs";
import path from "path";

const BASE_URL = "https://api.appstoreconnect.apple.com";

function printHelp() {
  console.log(`
Expira builds do App Store Connect em massa.

Uso:
  node scripts/release/expire-asc-builds.mjs [opções]

Opções:
  --app-id <id>            App ID no App Store Connect (fallback: eas.json -> submit.ios_testflight.ios.ascAppId)
  --version <x.y.z>        Filtra por versão do app (ex.: 1.0.1)
  --build-number <n,...>   Filtra por build number (aceita múltiplos separados por vírgula)
  --limit <n>              Tamanho de página na API (padrão: 200, máximo: 200)
  --include-non-valid      Inclui builds fora de processingState=VALID
  --dry-run                Só lista o que seria expirado (não altera nada)
  --help                   Mostra esta ajuda

Credenciais:
  APPLE_ASC_API_KEY_JSON (keyId, issuerId, privateKey)
  ou EXPO_ASC_API_KEY_PATH + EXPO_ASC_KEY_ID + EXPO_ASC_ISSUER_ID
`);
}

function parseArgs(argv) {
  const options = {
    appId: "",
    version: "",
    buildNumbers: new Set(),
    limit: 200,
    includeNonValid: false,
    dryRun: false,
    help: false,
  };

  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];

    if (arg === "--help") {
      options.help = true;
      continue;
    }
    if (arg === "--dry-run") {
      options.dryRun = true;
      continue;
    }
    if (arg === "--include-non-valid") {
      options.includeNonValid = true;
      continue;
    }
    if (arg === "--app-id") {
      options.appId = argv[index + 1] ?? "";
      index += 1;
      continue;
    }
    if (arg === "--version") {
      options.version = argv[index + 1] ?? "";
      index += 1;
      continue;
    }
    if (arg === "--build-number") {
      const raw = argv[index + 1] ?? "";
      raw
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean)
        .forEach((item) => options.buildNumbers.add(item));
      index += 1;
      continue;
    }
    if (arg === "--limit") {
      const raw = Number(argv[index + 1] ?? 200);
      if (!Number.isFinite(raw) || raw < 1 || raw > 200) {
        throw new Error("`--limit` deve estar entre 1 e 200.");
      }
      options.limit = raw;
      index += 1;
      continue;
    }

    throw new Error(`Argumento inválido: ${arg}`);
  }

  return options;
}

function resolveAppId(cliAppId) {
  if (cliAppId) return cliAppId;

  const envAppId = process.env.ASC_APP_ID || process.env.APP_STORE_CONNECT_APP_ID;
  if (envAppId) return envAppId;

  const easPath = path.resolve(process.cwd(), "eas.json");
  if (!fs.existsSync(easPath)) return "";

  try {
    const eas = JSON.parse(fs.readFileSync(easPath, "utf8"));
    return (
      eas?.submit?.ios_testflight?.ios?.ascAppId ||
      eas?.submit?.testflight?.ios?.ascAppId ||
      eas?.submit?.production?.ios?.ascAppId ||
      ""
    );
  } catch {
    return "";
  }
}

function base64url(input) {
  return Buffer.from(input)
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
}

function createJWT(keyId, issuerId, privateKeyPem) {
  const header = { alg: "ES256", kid: keyId, typ: "JWT" };
  const now = Math.floor(Date.now() / 1000);
  const payload = { iss: issuerId, iat: now, exp: now + 20 * 60, aud: "appstoreconnect-v1" };
  const encodedHeader = base64url(JSON.stringify(header));
  const encodedPayload = base64url(JSON.stringify(payload));
  const message = `${encodedHeader}.${encodedPayload}`;

  let key;
  try {
    key = crypto.createPrivateKey(privateKeyPem);
  } catch (error) {
    const isDecoderError =
      error.code === "ERR_OSSL_UNSUPPORTED" || String(error.message || "").includes("DECODER");
    if (isDecoderError) {
      throw new Error(
        "Chave privada inválida. Use o conteúdo real do arquivo .p8 (PEM) em APPLE_ASC_API_KEY_JSON.privateKey ou EXPO_ASC_API_KEY_PATH."
      );
    }
    throw error;
  }

  const signature = crypto.sign("sha256", Buffer.from(message, "utf8"), {
    key,
    dsaEncoding: "ieee-p1363",
  });
  return `${message}.${base64url(signature)}`;
}

function loadCredentials() {
  const rawJson = process.env.APPLE_ASC_API_KEY_JSON;
  if (rawJson) {
    const parsed = JSON.parse(rawJson);
    const keyId = parsed.keyId ?? parsed.key_id;
    const issuerId = parsed.issuerId ?? parsed.issuer_id;
    let privateKey = parsed.privateKey ?? parsed.private_key ?? parsed.key;
    if (!keyId || !issuerId || !privateKey) {
      throw new Error("APPLE_ASC_API_KEY_JSON deve incluir keyId, issuerId e privateKey.");
    }
    if (keyId === "..." || issuerId === "..." || String(privateKey).includes("...")) {
      throw new Error(
        "Use credenciais reais. keyId, issuerId e privateKey devem vir da API Key do App Store Connect."
      );
    }
    if (typeof privateKey === "string" && privateKey.includes("\\n")) {
      privateKey = privateKey.replace(/\\n/g, "\n");
    }
    if (
      !String(privateKey).includes("-----BEGIN PRIVATE KEY-----") ||
      String(privateKey).length < 200
    ) {
      throw new Error("privateKey inválida. Forneça o conteúdo completo do arquivo .p8.");
    }
    return { keyId, issuerId, privateKey };
  }

  const keyPath = process.env.EXPO_ASC_API_KEY_PATH;
  const keyId = process.env.EXPO_ASC_KEY_ID;
  const issuerId = process.env.EXPO_ASC_ISSUER_ID;
  if (keyPath && keyId && issuerId) {
    const privateKey = fs.readFileSync(keyPath, "utf8");
    return { keyId, issuerId, privateKey };
  }

  throw new Error(
    "Defina APPLE_ASC_API_KEY_JSON ou EXPO_ASC_API_KEY_PATH + EXPO_ASC_KEY_ID + EXPO_ASC_ISSUER_ID."
  );
}

async function ascRequest(jwt, url, init = {}) {
  const headers = {
    Authorization: `Bearer ${jwt}`,
    "Content-Type": "application/json",
    ...(init.headers || {}),
  };
  const response = await fetch(url, { ...init, headers });
  const text = await response.text();
  const data = text ? JSON.parse(text) : {};
  if (!response.ok) {
    const detail = data?.errors?.[0]?.detail || data?.errors?.[0]?.title || text;
    throw new Error(`ASC ${response.status} em ${url}: ${detail}`);
  }
  return data;
}

function extractAppVersion(build, includedMap) {
  const preReleaseId = build?.relationships?.preReleaseVersion?.data?.id;
  return preReleaseId ? includedMap.get(preReleaseId) || "" : "";
}

async function listAllBuilds(jwt, appId, limit) {
  const builds = [];
  let nextUrl = `${BASE_URL}/v1/builds?filter[app]=${encodeURIComponent(appId)}&include=preReleaseVersion&fields[builds]=version,uploadedDate,expirationDate,expired,processingState,preReleaseVersion&fields[preReleaseVersions]=version&sort=-uploadedDate&limit=${limit}`;

  while (nextUrl) {
    const payload = await ascRequest(jwt, nextUrl);
    const includedMap = new Map(
      (payload.included || [])
        .filter((item) => item.type === "preReleaseVersions")
        .map((item) => [item.id, item.attributes?.version || ""])
    );

    for (const build of payload.data || []) {
      builds.push({
        id: build.id,
        appVersion: extractAppVersion(build, includedMap),
        buildNumber: build.attributes?.version || "",
        expired: Boolean(build.attributes?.expired),
        processingState: build.attributes?.processingState || "",
      });
    }

    nextUrl = payload?.links?.next || "";
  }

  return builds;
}

function filterBuilds(allBuilds, options) {
  return allBuilds.filter((build) => {
    if (build.expired) return false;
    if (!options.includeNonValid && build.processingState !== "VALID") return false;
    if (options.version && build.appVersion !== options.version) return false;
    if (options.buildNumbers.size > 0 && !options.buildNumbers.has(build.buildNumber)) return false;
    return true;
  });
}

async function expireBuild(jwt, build) {
  const url = `${BASE_URL}/v1/builds/${build.id}`;
  const body = {
    data: {
      type: "builds",
      id: build.id,
      attributes: { expired: true },
    },
  };
  await ascRequest(jwt, url, { method: "PATCH", body: JSON.stringify(body) });
}

function printSelection(builds) {
  if (builds.length === 0) {
    console.log("Nenhuma build elegível encontrada.");
    return;
  }
  console.table(
    builds.map((build) => ({
      appVersion: build.appVersion,
      buildNumber: build.buildNumber,
      processingState: build.processingState,
      id: build.id,
    }))
  );
}

async function main() {
  const options = parseArgs(process.argv.slice(2));
  if (options.help) {
    printHelp();
    return;
  }

  const appId = resolveAppId(options.appId);
  if (!appId) {
    throw new Error("Não foi possível resolver o App ID. Use --app-id ou configure ASC_APP_ID.");
  }

  const { keyId, issuerId, privateKey } = loadCredentials();
  const jwt = createJWT(keyId, issuerId, privateKey);

  const allBuilds = await listAllBuilds(jwt, appId, options.limit);
  const targets = filterBuilds(allBuilds, options);

  console.log(`App ID: ${appId}`);
  console.log(`Builds ativas encontradas: ${targets.length}`);
  printSelection(targets);

  if (options.dryRun || targets.length === 0) {
    if (options.dryRun) console.log("Dry run concluído. Nenhuma build foi expirada.");
    return;
  }

  const failed = [];
  let successCount = 0;
  for (const build of targets) {
    try {
      await expireBuild(jwt, build);
      successCount += 1;
      console.log(`Expirada: ${build.appVersion} (${build.buildNumber}) [${build.id}]`);
    } catch (error) {
      failed.push({ build, error: error.message });
      console.error(
        `Falha ao expirar ${build.appVersion} (${build.buildNumber}) [${build.id}]: ${error.message}`
      );
    }
  }

  console.log(`Resultado: ${successCount} sucesso(s), ${failed.length} falha(s).`);
  if (failed.length > 0) process.exitCode = 1;
}

main().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
