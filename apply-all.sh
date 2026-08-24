#!/usr/bin/env zsh
# ==============================================================================
# 🔮 Translucid Suite — Aplicador Completo (OpenCode + OmniRoute + Pro Fonts)
# ==============================================================================

set -e
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"

echo "═══════════════════════════════════════════════════════════════════════════"
echo "        💎 TRANSLUCID SUITE — ULTRA-LIGHT LIQUID GLASS INJECTOR           "
echo "═══════════════════════════════════════════════════════════════════════════"

echo "\n🔤 [Passo 1/3] Verificando e Instalando Fontes Profissionais..."
"${SCRIPT_DIR}/install-pro-fonts.sh"

echo "\n🪟 [Passo 2/3] Aplicando Liquid Glass no OpenCode Desktop..."
"${SCRIPT_DIR}/apply-translucid.sh"

echo "\n⚡ [Passo 3/3] Aplicando Liquid Glass no OmniRoute Desktop..."
if [ -d "/Applications/OmniRoute.app" ]; then
    "${SCRIPT_DIR}/apply-translucid-omniroute.sh"
else
    echo "ℹ️ OmniRoute não instalado nesta máquina, pulando..."
fi

echo "\n═══════════════════════════════════════════════════════════════════════════"
echo "🎉 [FINALIZADO COM SUCESSO] Todos os aplicativos agora são 100% de vidro!"
echo "═══════════════════════════════════════════════════════════════════════════"
