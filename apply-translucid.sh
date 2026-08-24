#!/usr/bin/env zsh
# ==============================================================================
# ✨ Translucid OpenCode — Aplicador Automatizado de Transparência Líquida
# ==============================================================================

set -e

APP_PATH="/Applications/OpenCode.app"
RESOURCES_DIR="${APP_PATH}/Contents/Resources"
ASAR_FILE="${RESOURCES_DIR}/app.asar"
BACKUP_FILE="${RESOURCES_DIR}/app.asar.backup"
WORK_DIR="/tmp/opencode-translucid-build"
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"

echo "🔮 [Translucid OpenCode] Iniciando processo de personalização..."

# 1. Validação de existência do app
if [ ! -d "$APP_PATH" ]; then
    echo "❌ Erro: OpenCode.app não encontrado em /Applications."
    echo "   Certifique-se de que o aplicativo está instalado."
    exit 1
fi

# 2. Fechar o OpenCode se estiver aberto
echo "🛑 Encerrando instâncias em execução do OpenCode..."
killall "OpenCode" 2>/dev/null || true
sleep 1

# 3. Backup de segurança
if [ ! -f "$BACKUP_FILE" ]; then
    echo "📦 Criando backup original em: ${BACKUP_FILE}..."
    cp "$ASAR_FILE" "$BACKUP_FILE"
    echo "✅ Backup concluído."
else
    echo "ℹ️ Backup existente preservado em: ${BACKUP_FILE}"
fi

# 4. Extração do pacote ASAR
echo "📂 Extraindo app.asar para ambiente temporário..."
rm -rf "$WORK_DIR"
npx --yes @electron/asar extract "$ASAR_FILE" "$WORK_DIR"

# 5. Execução do motor de injeção JS
echo "💉 Injetando regras de Liquid Glass e Transparência Nativa..."
node "${SCRIPT_DIR}/patch-engine.js" "$WORK_DIR"

# 6. Reempacotamento do ASAR
echo "📦 Reempacotando app.asar..."
npx --yes @electron/asar pack "$WORK_DIR" "$ASAR_FILE"

# 7. Limpeza
rm -rf "$WORK_DIR"

echo "✨ [Sucesso!] OpenCode agora possui interface 100% translúcida estilo Apple Glass!"
echo "🚀 Abrindo OpenCode..."
open -a "$APP_PATH"
