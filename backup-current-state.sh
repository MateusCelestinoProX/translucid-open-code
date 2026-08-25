#!/usr/bin/env zsh
# ==============================================================================
# 📦 Translucid OpenCode — Snapshot & Backup Engine
# Salva todo o ecossistema ativo (configs, skills, presidente, temas, comandos)
# na pasta presets/ do repositório para versionamento no Git.
# ==============================================================================

set -e
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
PRESETS_DIR="${SCRIPT_DIR}/presets"
OPENCODE_CONFIG_DIR="${HOME}/.config/opencode"

echo "📦 [Backup Engine] Iniciando snapshot do estado atual do OpenCode..."

mkdir -p "${PRESETS_DIR}/config"
mkdir -p "${PRESETS_DIR}/skills"
mkdir -p "${PRESETS_DIR}/agents"
mkdir -p "${PRESETS_DIR}/commands"
mkdir -p "${PRESETS_DIR}/themes"
mkdir -p "${PRESETS_DIR}/full-crews"

# 1. Copia arquivos de configuração raiz
echo "📄 Salvando configurações principais (opencode.jsonc, oh-my-opencode-slim.json, etc)..."
[ -f "${OPENCODE_CONFIG_DIR}/opencode.jsonc" ] && cp "${OPENCODE_CONFIG_DIR}/opencode.jsonc" "${PRESETS_DIR}/config/"
[ -f "${OPENCODE_CONFIG_DIR}/config.json" ] && cp "${OPENCODE_CONFIG_DIR}/config.json" "${PRESETS_DIR}/config/"
[ -f "${OPENCODE_CONFIG_DIR}/oh-my-opencode-slim.json" ] && cp "${OPENCODE_CONFIG_DIR}/oh-my-opencode-slim.json" "${PRESETS_DIR}/config/"
[ -f "${OPENCODE_CONFIG_DIR}/tui.json" ] && cp "${OPENCODE_CONFIG_DIR}/tui.json" "${PRESETS_DIR}/config/"

# 2. Copia agentes ativos (especialmente o presidente.md)
echo "🏛️ Salvando agentes (~/.config/opencode/agents)..."
if [ -d "${OPENCODE_CONFIG_DIR}/agents" ]; then
    cp -R "${OPENCODE_CONFIG_DIR}/agents/"* "${PRESETS_DIR}/agents/" 2>/dev/null || true
fi

# 3. Copia todas as skills
echo "🧠 Salvando skills (~/.config/opencode/skills)..."
if [ -d "${OPENCODE_CONFIG_DIR}/skills" ]; then
    cp -R "${OPENCODE_CONFIG_DIR}/skills/"* "${PRESETS_DIR}/skills/" 2>/dev/null || true
fi

# 4. Copia comandos e temas
echo "🎨 Salvando temas e comandos..."
if [ -d "${OPENCODE_CONFIG_DIR}/commands" ]; then
    cp -R "${OPENCODE_CONFIG_DIR}/commands/"* "${PRESETS_DIR}/commands/" 2>/dev/null || true
fi
if [ -d "${OPENCODE_CONFIG_DIR}/themes" ]; then
    cp -R "${OPENCODE_CONFIG_DIR}/themes/"* "${PRESETS_DIR}/themes/" 2>/dev/null || true
fi

# 5. Template para Full Crews
touch "${PRESETS_DIR}/full-crews/.gitkeep"

echo "✅ [Backup Engine] Snapshot salvo com sucesso em: ${PRESETS_DIR}"
