#!/usr/bin/env node

/**
 * Chama a App Store Connect API (GET /v1/apps).
 * Usa as mesmas credenciais do EAS Submit: APPLE_ASC_API_KEY_JSON ou EXPO_ASC_*.
 *
 * Uso:
 *   APPLE_ASC_API_KEY_JSON='{"keyId":"...","issuerId":"...","privateKey":"..."}' node scripts/appstore-connect-api.mjs
 *   # ou export EXPO_ASC_API_KEY_PATH, EXPO_ASC_KEY_ID, EXPO_ASC_ISSUER_ID
 */

import crypto from "crypto";
import fs from "fs";

function base64url(buf) {
  return Buffer.from(buf)
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
}

function createJWT(keyId, issuerId, privateKeyPem) {
  const header = { alg: "ES256", kid: keyId };
  const now = Math.floor(Date.now() / 1000);
  const payload = { iss: issuerId, iat: now, exp: now + 1200 };
  const headerB64 = base64url(JSON.stringify(header));
  const payloadB64 = base64url(JSON.stringify(payload));
  const message = `${headerB64}.${payloadB64}`;
  let key;
  try {
    key = crypto.createPrivateKey(privateKeyPem);
  } catch (e) {
    const msg =
      e.code === "ERR_OSSL_UNSUPPORTED" || e.message?.includes("DECODER")
        ? "Chave privada inválida. Use o conteúdo real do arquivo .p8 (App Store Connect → Keys). Não use placeholders como '...'."
        : e.message;
    throw new Error(msg);
  }
  const sig = crypto.sign("sha256", Buffer.from(message, "utf8"), {
    key,
    dsaEncoding: "ieee-p1363",
  });
  const sigB64 = base64url(sig);
  return `${message}.${sigB64}`;
}

function loadCredentials() {
  const raw = process.env.APPLE_ASC_API_KEY_JSON;
  if (raw) {
    const parsed = JSON.parse(raw);
    const keyId = parsed.keyId ?? parsed.key_id;
    const issuerId = parsed.issuerId ?? parsed.issuer_id;
    let privateKey = parsed.privateKey ?? parsed.private_key ?? parsed.key;
    if (!keyId || !issuerId || !privateKey) {
      throw new Error("APPLE_ASC_API_KEY_JSON must include keyId, issuerId, privateKey");
    }
    if (keyId === "..." || issuerId === "..." || privateKey.includes("...")) {
      throw new Error(
        "Use credenciais reais. keyId, issuerId e privateKey devem ser os valores da sua API Key (App Store Connect → Users and Access → Keys). O privateKey é o conteúdo completo do arquivo .p8."
      );
    }
    if (typeof privateKey === "string" && privateKey.includes("\\n")) {
      privateKey = privateKey.replace(/\\n/g, "\n");
    }
    if (!privateKey.includes("-----BEGIN PRIVATE KEY-----") || privateKey.length < 200) {
      throw new Error("privateKey deve ser o conteúdo completo do arquivo .p8 (PEM), não um placeholder.");
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
    "Set APPLE_ASC_API_KEY_JSON (JSON with keyId, issuerId, privateKey) or EXPO_ASC_API_KEY_PATH + EXPO_ASC_KEY_ID + EXPO_ASC_ISSUER_ID"
  );
}

async function main() {
  const { keyId, issuerId, privateKey } = loadCredentials();
  const jwt = createJWT(keyId, issuerId, privateKey);
  const res = await fetch("https://api.appstoreconnect.apple.com/v1/apps", {
    headers: { Authorization: `Bearer ${jwt}` },
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`App Store Connect API error ${res.status}: ${text}`);
  }
  const data = await res.json();
  console.log(JSON.stringify(data, null, 2));
}

main().catch((err) => {
  console.error(err.message);
  process.exit(1);
});
