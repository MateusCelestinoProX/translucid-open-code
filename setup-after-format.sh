#!/usr/bin/env zsh
# ==============================================================================
# 🚀 Translucid OpenCode — Master Installer & Restore Engine
# Restaura 100% do ecossistema OpenCode após formatação do Mac ou nova instalação:
# - Configurações, temas, comandos, skills e o @presidente
# - Estrutura de diretórios e Full Crews Workspace
# - Fontes Profissionais (SF Pro, Fira Code, JetBrains Mono)
# - Injeção de Liquid Glass Translucid + Botão Dashboard no OpenCode Desktop
# - Injeção Translucid no OmniRoute (se instalado)
# ==============================================================================

set -e
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
PRESETS_DIR="${SCRIPT_DIR}/presets"
OPENCODE_CONFIG_DIR="${HOME}/.config/opencode"
FULL_CREWS_DIR="${HOME}/Documents/Default Project/full crews"
DASHBOARD_TARGET_DIR="${HOME}/Documents/Default Project/opencode-dashboard"

echo "═══════════════════════════════════════════════════════════════════════════"
echo "  💎 TRANSLUCID OPENCODE & CONTROL CENTER — INSTALAÇÃO MASTER (NOVO MAC)   "
echo "═══════════════════════════════════════════════════════════════════════════"

# 1. Criação das Pastas Essenciais no Sistema
echo "\n📁 [Passo 1/6] Criando estrutura de pastas no macOS..."
mkdir -p "${OPENCODE_CONFIG_DIR}/skills"
mkdir -p "${OPENCODE_CONFIG_DIR}/agents"
mkdir -p "${OPENCODE_CONFIG_DIR}/commands"
mkdir -p "${OPENCODE_CONFIG_DIR}/themes"
mkdir -p "${OPENCODE_CONFIG_DIR}/teams"
mkdir -p "${FULL_CREWS_DIR}"
mkdir -p "${HOME}/.local/share/opencode/log"
mkdir -p "${HOME}/Documents/Default Project"

# 2. Restauração das Configurações e Presets
echo "\n📦 [Passo 2/6] Restaurando configurações do OpenCode e Oh-My-OpenCode-Slim..."
if [ -d "${PRESETS_DIR}/config" ]; then
    cp -f "${PRESETS_DIR}/config/"* "${OPENCODE_CONFIG_DIR}/" 2>/dev/null || true
fi

if [ -d "${PRESETS_DIR}/agents" ]; then
    cp -Rf "${PRESETS_DIR}/agents/"* "${OPENCODE_CONFIG_DIR}/agents/" 2>/dev/null || true
fi

if [ -d "${PRESETS_DIR}/skills" ]; then
    cp -Rf "${PRESETS_DIR}/skills/"* "${OPENCODE_CONFIG_DIR}/skills/" 2>/dev/null || true
fi

if [ -d "${PRESETS_DIR}/commands" ]; then
    cp -Rf "${PRESETS_DIR}/commands/"* "${OPENCODE_CONFIG_DIR}/commands/" 2>/dev/null || true
fi

if [ -d "${PRESETS_DIR}/themes" ]; then
    cp -Rf "${PRESETS_DIR}/themes/"* "${OPENCODE_CONFIG_DIR}/themes/" 2>/dev/null || true
fi

# Copia os arquivos do Dashboard para o Default Project se necessário
if [ -d "${SCRIPT_DIR}/dashboard" ]; then
    mkdir -p "${DASHBOARD_TARGET_DIR}"
    cp -Rf "${SCRIPT_DIR}/dashboard/"* "${DASHBOARD_TARGET_DIR}/" 2>/dev/null || true
fi

echo "✅ Presets e configurações restaurados com sucesso."

# 3. Instalação de Fontes Profissionais
echo "\n🔤 [Passo 3/6] Instalando Fontes Profissionais (Fira Code, SF Pro, JetBrains Mono)..."
chmod +x "${SCRIPT_DIR}/install-pro-fonts.sh"
"${SCRIPT_DIR}/install-pro-fonts.sh"

# 4. Aplicação do Translucid Glass + Botão Dashboard no OpenCode
echo "\n🪟 [Passo 4/6] Injetando Liquid Glass e Botão do Dashboard no OpenCode Desktop..."
chmod +x "${SCRIPT_DIR}/apply-translucid.sh"
"${SCRIPT_DIR}/apply-translucid.sh"

# 5. Aplicação do Translucid Glass no OmniRoute (se instalado)
echo "\n⚡ [Passo 5/6] Verificando OmniRoute Desktop..."
if [ -d "/Applications/OmniRoute.app" ]; then
    chmod +x "${SCRIPT_DIR}/apply-translucid-omniroute.sh"
    "${SCRIPT_DIR}/apply-translucid-omniroute.sh"
else
    echo "ℹ️ OmniRoute.app não detectado em /Applications, pulando..."
fi

# 6. Permissões de Execução em todos os scripts
chmod +x "${SCRIPT_DIR}"/*.sh 2>/dev/null || true

echo "\n═══════════════════════════════════════════════════════════════════════════"
echo "🎉 [SUCESSO TOTAL] Seu Mac está 100% configurado com o Translucid OpenCode!"
echo "═══════════════════════════════════════════════════════════════════════════"
echo "▶️ Para abrir o Dashboard de Controle a qualquer momento, execute:"
echo "   ./start-dashboard.sh"
echo "   ou clique no botão 'Dashboard' no topo do seu OpenCode Desktop!"
echo "═══════════════════════════════════════════════════════════════════════════\n"
