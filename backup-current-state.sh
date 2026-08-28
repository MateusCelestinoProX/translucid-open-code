#!/usr/bin/env zsh
# ==============================================================================
# 📦 Translucid Suite — Snapshot & Backup Engine (OpenWork & OpenCode)
# Salva todo o ecossistema ativo (configs, skills, presidente, temas, comandos)
# na pasta presets/ do repositório para versionamento no Git.
# ==============================================================================

set -e
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
PRESETS_DIR="${SCRIPT_DIR}/presets"
OPENWORK_CONFIG_DIR="${HOME}/.config/openwork"
OPENCODE_CONFIG_DIR="${HOME}/.config/opencode"
FULL_CREWS_DIR="${HOME}/Documents/Default Project/full crews"

echo "📦 [Backup Engine] Iniciando snapshot do estado atual (OpenWork & OpenCode)..."

mkdir -p "${PRESETS_DIR}/config"
mkdir -p "${PRESETS_DIR}/skills"
mkdir -p "${PRESETS_DIR}/agents"
mkdir -p "${PRESETS_DIR}/commands"
mkdir -p "${PRESETS_DIR}/themes"
mkdir -p "${PRESETS_DIR}/full-crews"

# 1. Copia arquivos de configuração raiz de OpenWork e OpenCode
echo "📄 Salvando arquivos de configuração principais..."
for cdir in "$OPENWORK_CONFIG_DIR" "$OPENCODE_CONFIG_DIR"; do
    [ -f "${cdir}/opencode.jsonc" ] && cp -f "${cdir}/opencode.jsonc" "${PRESETS_DIR}/config/" 2>/dev/null || true
    [ -f "${cdir}/config.json" ] && cp -f "${cdir}/config.json" "${PRESETS_DIR}/config/" 2>/dev/null || true
    [ -f "${cdir}/oh-my-opencode-slim.json" ] && cp -f "${cdir}/oh-my-opencode-slim.json" "${PRESETS_DIR}/config/" 2>/dev/null || true
    [ -f "${cdir}/tui.json" ] && cp -f "${cdir}/tui.json" "${PRESETS_DIR}/config/" 2>/dev/null || true
    [ -f "${cdir}/openwork.json" ] && cp -f "${cdir}/openwork.json" "${PRESETS_DIR}/config/" 2>/dev/null || true
done

# 2. Copia agentes ativos
echo "🏛️ Salvando agentes..."
for cdir in "$OPENWORK_CONFIG_DIR" "$OPENCODE_CONFIG_DIR"; do
    if [ -d "${cdir}/agents" ]; then
        cp -Rf "${cdir}/agents/"* "${PRESETS_DIR}/agents/" 2>/dev/null || true
    fi
done

# 3. Copia todas as skills
echo "🧠 Salvando skills..."
for cdir in "$OPENWORK_CONFIG_DIR" "$OPENCODE_CONFIG_DIR"; do
    if [ -d "${cdir}/skills" ]; then
        cp -Rf "${cdir}/skills/"* "${PRESETS_DIR}/skills/" 2>/dev/null || true
    fi
done

# 4. Copia comandos e temas
echo "🎨 Salvando temas e comandos..."
for cdir in "$OPENWORK_CONFIG_DIR" "$OPENCODE_CONFIG_DIR"; do
    if [ -d "${cdir}/commands" ]; then
        cp -Rf "${cdir}/commands/"* "${PRESETS_DIR}/commands/" 2>/dev/null || true
    fi
    if [ -d "${cdir}/themes" ]; then
        cp -Rf "${cdir}/themes/"* "${PRESETS_DIR}/themes/" 2>/dev/null || true
    fi
done

# 5. Salva Full Crews de Documents/Default Project se existirem
if [ -d "${FULL_CREWS_DIR}" ]; then
    echo "👥 Salvando Full Crews ativas..."
    cp -Rf "${FULL_CREWS_DIR}/"* "${PRESETS_DIR}/full-crews/" 2>/dev/null || true
fi
touch "${PRESETS_DIR}/full-crews/.gitkeep"

echo "✅ [Backup Engine] Snapshot salvo com sucesso em: ${PRESETS_DIR}"
