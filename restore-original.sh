#!/usr/bin/env zsh
# ==============================================================================
# 🔄 Translucid OpenCode — Restaurador do Estado Original
# ==============================================================================

set -e

APP_PATH="/Applications/OpenCode.app"
RESOURCES_DIR="${APP_PATH}/Contents/Resources"
ASAR_FILE="${RESOURCES_DIR}/app.asar"
BACKUP_FILE="${RESOURCES_DIR}/app.asar.backup"

echo "🔄 [Restore] Restaurando OpenCode para a versão original de fábrica..."

if [ ! -f "$BACKUP_FILE" ]; then
    echo "❌ Erro: Nenhum backup encontrado em ${BACKUP_FILE}."
    exit 1
fi

# Fechar o OpenCode se estiver aberto
echo "🛑 Encerrando OpenCode..."
killall "OpenCode" 2>/dev/null || true
sleep 1

# Restaurar arquivo
cp "$BACKUP_FILE" "$ASAR_FILE"

echo "✅ OpenCode restaurado com sucesso para a versão padrão de fábrica!"
echo "🚀 Abrindo OpenCode..."
open -a "$APP_PATH"
