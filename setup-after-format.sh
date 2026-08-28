#!/usr/bin/env zsh
# ==============================================================================
# 🚀 Translucid Suite (OpenWork + OpenCode) — Master Installer & Restore Engine
# Restaura 100% do ecossistema OpenWork e OpenCode após formatação do Mac:
# - Configurações, temas, comandos, skills e o @presidente
# - Estrutura de diretórios em ~/.config/openwork, ~/.config/opencode e Full Crews
# - Fontes Profissionais (SF Pro, Fira Code, JetBrains Mono)
# - Injeção de Liquid Glass Translucid + Botão Dashboard no OpenWork e OpenCode Desktop
# - Injeção Translucid no OmniRoute (se instalado)
# ==============================================================================

set -e
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
PRESETS_DIR="${SCRIPT_DIR}/presets"
OPENWORK_CONFIG_DIR="${HOME}/.config/openwork"
OPENCODE_CONFIG_DIR="${HOME}/.config/opencode"
FULL_CREWS_DIR="${HOME}/Documents/Default Project/full crews"
DASHBOARD_TARGET_DIR="${HOME}/Documents/Default Project/opencode-dashboard"

echo "═══════════════════════════════════════════════════════════════════════════"
echo "  💎 TRANSLUCID SUITE — MASTER RESTORE ENGINE (OPENWORK & OPENCODE)        "
echo "═══════════════════════════════════════════════════════════════════════════"

# 1. Criação das Pastas Essenciais no Sistema
echo "\n📁 [Passo 1/6] Criando estrutura de pastas no macOS..."
for config_dir in "$OPENWORK_CONFIG_DIR" "$OPENCODE_CONFIG_DIR"; do
    mkdir -p "${config_dir}/skills"
    mkdir -p "${config_dir}/agents"
    mkdir -p "${config_dir}/commands"
    mkdir -p "${config_dir}/themes"
    mkdir -p "${config_dir}/teams"
done

mkdir -p "${FULL_CREWS_DIR}"
mkdir -p "${HOME}/.local/share/openwork/log"
mkdir -p "${HOME}/.local/share/opencode/log"
mkdir -p "${HOME}/Documents/Default Project"

# 2. Restauração das Configurações e Presets
echo "\n📦 [Passo 2/6] Restaurando configurações e presets (Full Crews, Skills, Agentes)..."
for target_dir in "$OPENWORK_CONFIG_DIR" "$OPENCODE_CONFIG_DIR"; do
    if [ -d "${PRESETS_DIR}/config" ]; then
        cp -f "${PRESETS_DIR}/config/"* "${target_dir}/" 2>/dev/null || true
    fi

    if [ -d "${PRESETS_DIR}/agents" ]; then
        cp -Rf "${PRESETS_DIR}/agents/"* "${target_dir}/agents/" 2>/dev/null || true
    fi

    if [ -d "${PRESETS_DIR}/skills" ]; then
        cp -Rf "${PRESETS_DIR}/skills/"* "${target_dir}/skills/" 2>/dev/null || true
    fi

    if [ -d "${PRESETS_DIR}/commands" ]; then
        cp -Rf "${PRESETS_DIR}/commands/"* "${target_dir}/commands/" 2>/dev/null || true
    fi

    if [ -d "${PRESETS_DIR}/themes" ]; then
        cp -Rf "${PRESETS_DIR}/themes/"* "${target_dir}/themes/" 2>/dev/null || true
    fi
done

# Copia presets de full-crews para Documents/Default Project/full crews se disponível
if [ -d "${PRESETS_DIR}/full-crews" ]; then
    cp -Rf "${PRESETS_DIR}/full-crews/"* "${FULL_CREWS_DIR}/" 2>/dev/null || true
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

# 4. Aplicação do Translucid Glass no OpenWork Desktop
echo "\n🪟 [Passo 4/6] Verificando e Injetando Liquid Glass no OpenWork Desktop..."
if [ -d "/Applications/OpenWork.app" ]; then
    chmod +x "${SCRIPT_DIR}/apply-translucid-openwork.sh"
    "${SCRIPT_DIR}/apply-translucid-openwork.sh"
else
    echo "ℹ️ OpenWork.app não encontrado em /Applications, pulando injeção..."
fi

# 5. Aplicação do Translucid Glass no OpenCode Desktop
echo "\n🪟 [Passo 5/6] Verificando e Injetando Liquid Glass no OpenCode Desktop..."
if [ -d "/Applications/OpenCode.app" ]; then
    chmod +x "${SCRIPT_DIR}/apply-translucid.sh"
    "${SCRIPT_DIR}/apply-translucid.sh"
else
    echo "ℹ️ OpenCode.app não detectado em /Applications, pulando injeção..."
fi

# OmniRoute Desktop (se instalado)
if [ -d "/Applications/OmniRoute.app" ]; then
    echo "\n⚡ [Extra] Aplicando Liquid Glass no OmniRoute Desktop..."
    chmod +x "${SCRIPT_DIR}/apply-translucid-omniroute.sh"
    "${SCRIPT_DIR}/apply-translucid-omniroute.sh"
fi

# 6. Permissões de Execução em todos os scripts
chmod +x "${SCRIPT_DIR}"/*.sh 2>/dev/null || true

echo "\n═══════════════════════════════════════════════════════════════════════════"
echo "🎉 [SUCESSO TOTAL] Seu Mac está 100% configurado com o Translucid Suite!"
echo "═══════════════════════════════════════════════════════════════════════════"
echo "▶️ Para abrir o Dashboard de Controle a qualquer momento, execute:"
echo "   ./start-dashboard.sh"
echo "   ou acesse no navegador: http://localhost:3030/"
echo "═══════════════════════════════════════════════════════════════════════════\n"
