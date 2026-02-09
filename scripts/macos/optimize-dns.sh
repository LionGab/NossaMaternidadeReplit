#!/bin/bash
# Otimiza DNS para desenvolvimento
# Uso: bash scripts/macos/optimize-dns.sh

set -e

echo "🌐 Otimizando DNS..."

# Verificar interfaces de rede disponíveis
INTERFACES=$(networksetup -listallnetworkservices | grep -v "An asterisk" | tail -n +2)

for INTERFACE in $INTERFACES; do
  echo "📡 Configurando DNS para $INTERFACE..."
  # Usar DNS rápido (Cloudflare)
  networksetup -setdnsservers "$INTERFACE" 1.1.1.1 1.0.0.1 2>/dev/null || {
    echo "⚠️  Não foi possível configurar DNS para $INTERFACE (pode requerer sudo)"
  }
done

# Limpar cache DNS
echo "🗑️  Limpando cache DNS..."
sudo dscacheutil -flushcache
sudo killall -HUP mDNSResponder

echo "✅ DNS otimizado!"
echo "📊 DNS configurado: 1.1.1.1 (Cloudflare)"
