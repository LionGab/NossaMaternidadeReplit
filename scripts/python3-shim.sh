#!/bin/bash
# Shim python3 para Git Bash no Windows: redireciona para Python 3.13.
# Uso: coloque no PATH antes do python do Git, ou use como wrapper.
# Log opcional: defina PYTHON_SHIM_DEBUG_LOG com path do arquivo para habilitar.

TARGET="/c/Users/User/AppData/Local/Programs/Python/Python313/python.exe"

if [ ! -x "$TARGET" ]; then
  if [ -n "${PYTHON_SHIM_DEBUG_LOG}" ]; then
    printf '{"runId":"pre-fix","hypothesisId":"H2","location":"python3-shim","message":"python3 shim target missing","data":{"target":"%s"},"timestamp":%s}\n' \
      "$TARGET" "$(($(date +%s)*1000))" >> "${PYTHON_SHIM_DEBUG_LOG}" 2>/dev/null
  fi
  echo "python3 shim error: target not found: $TARGET" >&2
  exit 127
fi

if [ -n "${PYTHON_SHIM_DEBUG_LOG}" ]; then
  printf '{"runId":"pre-fix","hypothesisId":"H1","location":"python3-shim","message":"python3 shim exec","data":{"target":"%s"},"timestamp":%s}\n' \
    "$TARGET" "$(($(date +%s)*1000))" >> "${PYTHON_SHIM_DEBUG_LOG}" 2>/dev/null
fi

exec "$TARGET" "$@"
