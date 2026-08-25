# 🪟✨ Translucid OpenCode & Control Center Suite

> Ecossistema definitivo de personalização visual **Liquid Glass (Transparência Nativa Apple Vibrancy)**, aceleração por hardware **120 FPS ProMotion**, tipografia profissional e **Centro de Controle Multi-Agente (Full Crews & Governança Executiva)** para o **OpenCode Desktop (macOS)**.

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Platform: macOS](https://img.shields.io/badge/Platform-macOS%20(Apple%20Silicon%20%26%20Intel)-black.svg)](https://apple.com)
[![Electron: Native Glass](https://img.shields.io/badge/Electron-Vibrancy%20%26%20Alpha-emerald.svg)](https://electronjs.org)
[![Display: 120 FPS](https://img.shields.io/badge/ProMotion-120%20FPS%20Metal-purple.svg)](https://apple.com)
[![Dashboard: Port 3030](https://img.shields.io/badge/Control%20Center-Port%203030-indigo.svg)](http://localhost:3030)

---

## 📖 Visão Geral

O **Translucid OpenCode** transforma o OpenCode Desktop em uma estação de trabalho futurista de vidro translúcido com orquestração multi-agente completa:

1. **Pure Liquid Glass (NSVisualEffectView)**: Desbloqueia o canal Alpha nativo do macOS (`vibrancy: "under-window"`, `transparent: true`, `opacity: 0.94`), eliminando os fundos escuros opacos de fábrica.
2. **Alto Contraste & Tipografia Pro**: Textos em branco puro reluzente com micro-sombras ópticas e fontes profissionais com ligaduras (`SF Pro Display`, `Fira Code`, `JetBrainsMono Nerd Font`).
3. **Botão de Dashboard Integrado**: Botão nativo na barra de título do OpenCode para abrir o painel de controle com apenas 1 clique em [`http://localhost:3030/`](http://localhost:3030/).
4. **Governança Global com @presidente**: Orquestrador supremo executivo para gerenciar equipes, despachar objetivos paralelos e delegar aos líderes de squad.
5. **Arquitetura Full Crews & Skills**: Motor de equipes sob medida, instruções em Markdown (`SKILL.md`, `agent.md`), agendamento de tarefas e telemetria em tempo real.
6. **Resiliência a Formatação (Snapshot Master)**: Script único que restaura 100% de todo o ecossistema (skills, agentes, temas, configs, vidro e dashboard) em qualquer Mac recém-formatado.

---

## 🚀 Instalação em Novo Mac / Após Formatar

Após baixar e instalar o **OpenCode Desktop**, basta clonar este repositório e rodar o instalador mestre:

```bash
# 1. Clone o repositório
git clone https://github.com/MateusCelestinoProX/translucid-open-code.git
cd translucid-open-code

# 2. Execute a instalação e restauração completa em 1 comando:
./setup-after-format.sh
```

O script automaticamente:
- Cria toda a estrutura de pastas em `~/.config/opencode/` e `Documents/Default Project/full crews/`.
- Restaura configurações, temas, comandos, skills e o `@presidente`.
- Instala as fontes profissionais no sistema macOS.
- Injeta o Liquid Glass e o botão nativo do Dashboard no OpenCode Desktop.
- Aplica o efeito no OmniRoute Desktop (se instalado).

---

## 📊 Como Iniciar o Dashboard de Controle

Para abrir o painel web de telemetria, equipes e skills:

```bash
./start-dashboard.sh
```
Acesse no seu navegador: **[`http://localhost:3030/`](http://localhost:3030/)**

---

## 📦 Snapshot e Backup do Estado Ativo

Se você criar novas skills ou modificar configurações e quiser salvar tudo no repositório para subir ao Git:

```bash
./backup-current-state.sh
git add .
git commit -m "feat: snapshot atualizado do ecossistema"
git push
```

---

## 🔄 Como Restaurar para o Padrão de Fábrica

Se desejar remover os efeitos translúcidos e retornar ao OpenCode original:

```bash
./restore-original.sh
```

---

## 📄 Licença

Distribuído sob a licença [MIT](LICENSE). Desenvolvido para personalização visual e orquestração de IA de alto nível.
