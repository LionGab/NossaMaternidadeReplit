// scripts/test-cors-community-feed.mjs
/* eslint-disable no-console */

/**
 * Teste automatizado de CORS para Edge Function community-feed
 *
 * Cenários testados:
 * 1. POST com origin permitido → 2xx + access-control-allow-origin
 * 2. POST com origin não permitido → 403 sem headers CORS
 * 3. POST sem origin (server-to-server) → 2xx sem headers CORS
 * 4. OPTIONS preflight com origin permitido → 204 + headers CORS
 * 5. OPTIONS preflight com origin não permitido → 403 sem headers CORS
 *
 * Uso:
 *   node scripts/test-cors-community-feed.mjs
 *
 * Requer env vars:
 *   EXPO_PUBLIC_SUPABASE_URL ou SUPABASE_URL
 *   EXPO_PUBLIC_SUPABASE_ANON_KEY ou SUPABASE_ANON_KEY
 */

const ALLOWED_ORIGINS = [
  'https://app.nossamaternidade.com',
  'https://admin.nossamaternidade.com',
];

const DISALLOWED_ORIGIN = 'https://malicious-site.com';

function getEnv(name) {
  return process.env[name] && String(process.env[name]).trim();
}

function requireEnvOneOf(names) {
  for (const n of names) {
    const v = getEnv(n);
    if (v) return v;
  }
  throw new Error(`Missing required env. Provide one of: ${names.join(' | ')}`);
}

function normalizeBaseUrl(url) {
  return url.replace(/\/+$/, '');
}

function headerGet(headers, name) {
  return headers.get(name);
}

function redactSecrets(text, secrets) {
  let out = String(text ?? '');
  for (const s of secrets) {
    if (!s) continue;
    // Replace exact secret and also "Bearer <secret>" occurrences
    out = out.split(s).join('<REDACTED>');
  }
  return out;
}

function expect(cond, message) {
  if (!cond) throw new Error(message);
}

function fmt(val) {
  if (val == null) return '(null)';
  return String(val);
}

async function doPostJson({ url, origin, anonKey, body }) {
  const headers = {
    'Content-Type': 'application/json',
    // supabase edge functions commonly accept both headers; keep both to avoid false negatives
    Authorization: `Bearer ${anonKey}`,
    apikey: anonKey,
  };

  if (origin) headers.Origin = origin;

  const res = await fetch(url, {
    method: 'POST',
    headers,
    body: JSON.stringify(body),
  });

  const text = await res.text();
  return { status: res.status, headers: res.headers, text };
}

async function doPreflightOptions({ url, origin }) {
  // Simula preflight real do browser: não envia token.
  const headers = {
    Origin: origin,
    'Access-Control-Request-Method': 'POST',
    'Access-Control-Request-Headers': 'authorization,content-type,apikey',
  };

  const res = await fetch(url, {
    method: 'OPTIONS',
    headers,
  });

  const text = await res.text();
  return { status: res.status, headers: res.headers, text };
}

async function testScenario({ name, fnUrl, origin, expectStatus, expectAllowOrigin, anonKey }) {
  const payload = { page: 1, limit: 10, type: 'feed' };

  const res = await doPostJson({
    url: fnUrl,
    origin,
    anonKey,
    body: payload,
  });

  const allowOrigin = headerGet(res.headers, 'access-control-allow-origin');

  const statusOk =
    typeof expectStatus === 'function' ? expectStatus(res.status) : res.status === expectStatus;

  const safeBody = redactSecrets(res.text.slice(0, 300), [anonKey]);

  expect(statusOk, `[${name}] Status inesperado: got ${res.status}. Body: ${safeBody}`);

  if (expectAllowOrigin === 'absent') {
    expect(
      !allowOrigin,
      `[${name}] Esperava não ter access-control-allow-origin, mas veio: ${fmt(allowOrigin)}`
    );
  } else if (typeof expectAllowOrigin === 'string') {
    expect(
      allowOrigin === expectAllowOrigin,
      `[${name}] access-control-allow-origin inválido: got ${fmt(allowOrigin)} expected ${expectAllowOrigin}`
    );
  }

  console.log(`✅ ${name} — status ${res.status} — allow-origin: ${fmt(allowOrigin)}`);
}

async function testPreflight({ name, fnUrl, origin, expectStatus, expectAllowOrigin }) {
  const res = await doPreflightOptions({
    url: fnUrl,
    origin,
  });

  const allowOrigin = headerGet(res.headers, 'access-control-allow-origin');

  const statusOk =
    typeof expectStatus === 'function' ? expectStatus(res.status) : res.status === expectStatus;

  expect(
    statusOk,
    `[${name}] (OPTIONS) Status inesperado: got ${res.status}. Body: ${res.text.slice(0, 200)}`
  );

  if (expectAllowOrigin === 'absent') {
    expect(
      !allowOrigin,
      `[${name}] (OPTIONS) Esperava não ter access-control-allow-origin, mas veio: ${fmt(allowOrigin)}`
    );
  } else if (typeof expectAllowOrigin === 'string') {
    expect(
      allowOrigin === expectAllowOrigin,
      `[${name}] (OPTIONS) access-control-allow-origin inválido: got ${fmt(allowOrigin)} expected ${expectAllowOrigin}`
    );
  }

  console.log(`✅ ${name} (OPTIONS) — status ${res.status} — allow-origin: ${fmt(allowOrigin)}`);
}

async function main() {
  if (typeof fetch !== 'function') {
    throw new Error('Global fetch is not available. Use Node.js 18+ to run this script.');
  }

  const supabaseUrl = normalizeBaseUrl(
    requireEnvOneOf(['EXPO_PUBLIC_SUPABASE_URL', 'NEXT_PUBLIC_SUPABASE_URL', 'SUPABASE_URL'])
  );

  const anonKey = requireEnvOneOf(['EXPO_PUBLIC_SUPABASE_ANON_KEY', 'NEXT_PUBLIC_SUPABASE_ANON_KEY', 'SUPABASE_ANON_KEY']);

  const fnUrl = `${supabaseUrl}/functions/v1/community-feed`;

  console.log('🔎 Testing CORS for community-feed');
  console.log(`- fnUrl: ${fnUrl}`);
  console.log(`- allowed origins: ${ALLOWED_ORIGINS.join(', ')}`);
  console.log('');

  // Allowed origins: accept 2xx or 401 (401 means CORS passed but auth failed - expected without JWT)
  for (const origin of ALLOWED_ORIGINS) {
    await testScenario({
      name: `POST allowed origin: ${origin}`,
      fnUrl,
      origin,
      anonKey,
      // 2xx = success, 401 = CORS passed but auth required (expected without user JWT)
      expectStatus: (s) => (s >= 200 && s < 300) || s === 401,
      expectAllowOrigin: origin,
    });

    // Preflight: accept 200 or 204
    await testPreflight({
      name: `OPTIONS allowed origin: ${origin}`,
      fnUrl,
      origin,
      expectStatus: (s) => s === 200 || s === 204,
      expectAllowOrigin: origin,
    });
  }

  // Disallowed: expect 403 and no allow-origin
  await testScenario({
    name: `POST disallowed origin: ${DISALLOWED_ORIGIN}`,
    fnUrl,
    origin: DISALLOWED_ORIGIN,
    anonKey,
    expectStatus: 403,
    expectAllowOrigin: 'absent',
  });

  await testPreflight({
    name: `OPTIONS disallowed origin: ${DISALLOWED_ORIGIN}`,
    fnUrl,
    origin: DISALLOWED_ORIGIN,
    // Accept any 4xx (ideally 403), but must not leak allow-origin.
    expectStatus: (s) => s >= 400 && s < 500,
    expectAllowOrigin: 'absent',
  });

  // No origin: allow server-to-server, but no CORS header
  // 2xx = success, 401 = CORS passed but auth required (expected without user JWT)
  await testScenario({
    name: 'POST without Origin header',
    fnUrl,
    origin: undefined,
    anonKey,
    expectStatus: (s) => (s >= 200 && s < 300) || s === 401,
    expectAllowOrigin: 'absent',
  });

  console.log('');
  console.log('🎉 CORS checks passed.');
}

main().catch((err) => {
  console.error('❌ CORS checks failed:', err?.message || err);
  process.exit(1);
});
