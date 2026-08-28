#!/usr/bin/env bash
# ==============================================================================
# 🔮 Translucid Suite — Master Script (OpenCode + OpenWork + Antigravity Tools + Pro Fonts)
# ==============================================================================

set -e
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

echo "═══════════════════════════════════════════════════════════════════════════"
echo "        💎 TRANSLUCID SUITE — MASTER INJECTOR (ALL-IN-ONE)                "
echo "═══════════════════════════════════════════════════════════════════════════"

echo -e "\n🔤 [Passo 1/4] Verificando e Instalando Fontes Profissionais..."
if [ -f "${SCRIPT_DIR}/install-pro-fonts.sh" ]; then
    "${SCRIPT_DIR}/install-pro-fonts.sh"
fi

echo -e "\n🪟 [Passo 2/4] Aplicando Translucid Liquid Glass no OpenCode Desktop..."
if [ -d "/Applications/OpenCode.app" ]; then
    "${SCRIPT_DIR}/apply-translucid.sh"
else
    echo "ℹ️ OpenCode.app não instalado em /Applications, pulando..."
fi

echo -e "\n🪟 [Passo 3/4] Aplicando Translucid Liquid Glass no OpenWork Desktop..."
OPENWORK_SCRIPT="/Users/mcp/Downloads/translucid-openwork/apply-translucid.sh"
if [ -f "$OPENWORK_SCRIPT" ] && [ -d "/Applications/OpenWork.app" ]; then
    "$OPENWORK_SCRIPT"
elif [ -d "/Applications/OpenWork.app" ]; then
    echo "ℹ️ OpenWork instalado."
fi

echo -e "\n🪟 [Passo 4/4] Aplicando Translucid Simple Glass no Antigravity Tools..."
AGT_SCRIPT="/Users/mcp/Downloads/translucid-antigravity-tools/apply-translucid.sh"
if [ -f "$AGT_SCRIPT" ]; then
    "$AGT_SCRIPT"
else
    echo "ℹ️ Antigravity Tools script não encontrado, pulando..."
fi

echo -e "\n═══════════════════════════════════════════════════════════════════════════"
echo "🎉 [FINALIZADO COM SUCESSO] Todas as personalizações foram aplicadas!"
echo "═══════════════════════════════════════════════════════════════════════════"
