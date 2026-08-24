#!/usr/bin/env zsh
# ==============================================================================
# ✨ Translucid OmniRoute — Aplicador Automatizado de Transparência Líquida
# ==============================================================================

set -e

APP_PATH="/Applications/OmniRoute.app"
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"

echo "🔮 [Translucid OmniRoute] Iniciando personalização..."

if [ ! -d "$APP_PATH" ]; then
    echo "❌ Erro: OmniRoute.app não encontrado em /Applications."
    exit 1
fi

echo "🛑 Encerrando instâncias em execução do OmniRoute..."
killall "OmniRoute" 2>/dev/null || true
sleep 1

# Backup do main.js e preload.js
MAIN_JS="${APP_PATH}/Contents/Resources/app/electron/main.js"
if [ ! -f "${MAIN_JS}.backup" ]; then
    echo "📦 Criando backup original..."
    cp "$MAIN_JS" "${MAIN_JS}.backup"
    cp "${APP_PATH}/Contents/Resources/app/electron/preload.js" "${APP_PATH}/Contents/Resources/app/electron/preload.js.backup"
fi

# Executar injeção
echo "💉 Injetando regras de Liquid Glass no OmniRoute..."
node "${SCRIPT_DIR}/patch-omniroute.js"

echo "✨ [Sucesso!] OmniRoute agora possui interface 100% translúcida estilo Apple Glass!"
echo "🚀 Abrindo OmniRoute..."
open -a "$APP_PATH"
