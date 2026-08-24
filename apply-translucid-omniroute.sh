#!/usr/bin/env zsh
# ==============================================================================
# ✨ Translucid OmniRoute — Aplicador Automatizado de Transparência Líquida
# ==============================================================================

set -e

APP_PATH="/Applications/OmniRoute.app"
RESOURCES_DIR="${APP_PATH}/Contents/Resources"
ASAR_FILE="${RESOURCES_DIR}/app.asar"
BACKUP_FILE="${RESOURCES_DIR}/app.asar.backup"
WORK_DIR="/tmp/omniroute-translucid-build"
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"

echo "🔮 [Translucid OmniRoute] Iniciando personalização..."

if [ ! -d "$APP_PATH" ]; then
    echo "❌ Erro: OmniRoute.app não encontrado em /Applications."
    exit 1
fi

echo "🛑 Encerrando instâncias em execução do OmniRoute..."
killall "OmniRoute" 2>/dev/null || true
sleep 1

# Backup do app.asar
if [ ! -f "$BACKUP_FILE" ]; then
    echo "📦 Criando backup original em: ${BACKUP_FILE}..."
    cp "$ASAR_FILE" "$BACKUP_FILE"
else
    echo "ℹ️ Backup existente preservado em: ${BACKUP_FILE}"
fi

# Extração do ASAR
echo "📂 Extraindo app.asar do OmniRoute..."
rm -rf "$WORK_DIR"
npx --yes @electron/asar extract "$ASAR_FILE" "$WORK_DIR"

# Executar injeção
echo "💉 Injetando regras de Liquid Glass no OmniRoute..."
node "${SCRIPT_DIR}/patch-omniroute-asar.js"

# Reempacotamento
echo "📦 Reempacotando app.asar..."
npx --yes @electron/asar pack "$WORK_DIR" "$ASAR_FILE"
rm -rf "$WORK_DIR"

echo "✨ [Sucesso!] OmniRoute agora possui interface 100% translúcida estilo Apple Glass!"
echo "🚀 Abrindo OmniRoute..."
open -a "$APP_PATH"
