# 🪟💎 Translucid Suite: OpenCode & OmniRoute

> Transforme o **OpenCode Desktop**, **OmniRoute Desktop** e qualquer aplicativo **Electron** em uma obra de arte de **Vidro Líquido 100% Translúcido (Liquid Glass & Apple Native Vibrancy)** no macOS.

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Platform: macOS](https://img.shields.io/badge/Platform-macOS%20(Apple%20Silicon%20%26%20Intel)-black.svg)](https://apple.com)
[![Electron: Native Glass](https://img.shields.io/badge/Electron-Vibrancy%20%26%20Alpha-emerald.svg)](https://electronjs.org)
[![Typography: Pro Fonts](https://img.shields.io/badge/Fonts-Fira%20Code%20%7C%20JetBrains%20Mono%20%7C%20Monaspace-purple.svg)](https://github.com/tonsky/FiraCode)

---

## 📖 Como Funciona? (A Teoria por Trás do Electron)

### Qualquer aplicativo Electron pode ser transformado em Vidro?
**SIM! Absolutamente qualquer aplicativo construído em Electron** (OpenCode, OmniRoute, VS Code, Discord, Slack, Obsidian, Spotify, Notion, etc.) pode ser convertido em vidro líquido translúcido.

### Como o motor funciona por debaixo dos panos?
Um aplicativo Electron é composto por duas partes:
1. **Processo Principal (Node.js / `BrowserWindow`):** Gerencia a janela nativa do sistema operacional.
2. **Processo de Renderização (Chromium / HTML / CSS / React):** Renderiza a interface do usuário.

Para alcançar o efeito **Translucid Liquid Glass**:
* No **macOS**, o Electron acessa a API nativa da Apple (`NSVisualEffectView`) através de `vibrancy: "under-window"`, `transparent: true`, `backgroundColor: "#00000000"` e `opacity: 0.92`.
* No **Design System Web**, neutralizamos todas as cores de fundo sólidas (`--v2-background-bg-*` e `background-color`) para `transparent !important`, e aplicamos `backdrop-filter: blur(...)` com tipografia em branco de alto contraste (`#ffffff`).

---

## ⚡ Como Aplicar em 1 Segundo (Reproduza 1000 Vezes)

Abra o Terminal nesta pasta e execute:

```bash
chmod +x *.sh

# Aplicar tudo de uma vez (Fontes + OpenCode + OmniRoute)
./apply-all.sh
```

Ou execute individualmente conforme desejar:

```bash
# 1. Apenas instalar as 312 Fontes Pro (Fira Code, JetBrains Mono, Monaspace)
./install-pro-fonts.sh

# 2. Apenas aplicar no OpenCode Desktop
./apply-translucid.sh

# 3. Apenas aplicar no OmniRoute Desktop
./apply-translucid-omniroute.sh

# 4. Restaurar OpenCode original de fábrica
./restore-original.sh
```

---

## ❓ Perguntas Frequentes (FAQ)

### 1. Se eu desligar ou reiniciar o Mac, o visual volta ao padrão?
> **Não!** As alterações são gravadas diretamente no binário `app.asar` e nos scripts internos do aplicativo. Ao desligar, reiniciar ou suspender o Mac, o efeito **permanece ativo e intacto indefinidamente**.

### 2. Se o OpenCode ou OmniRoute receber uma atualização, volta ao padrão?
> **Sim.** Quando um aplicativo Electron é atualizado, o instalador substitui o pacote `app.asar` pela nova versão.
> **Solução:** Basta rodar `./apply-all.sh` e em **5 segundos** o visual de vidro estará novamente ativo na nova versão!

### 3. Isso funciona apenas no macOS?
> No **macOS**, o efeito utiliza o desfoque real de vidro do sistema operacional (`NSVisualEffectView`). No **Windows 11**, o Electron suporta `backgroundMaterial: 'mica'` ou `transparent: true`, e no **Linux** através dos compositores X11/Wayland. No macOS, a renderização de vidro é nativa e fluida a 120Hz no Apple Silicon.

### 4. A engine do aplicativo ou chamadas de IA são afetadas?
> **Não.** O patch atua com precisão cirúrgica apenas nas camadas de apresentação visual. Conexões de API, WebSockets, subprocessos e tokens funcionam 100% normalmente.

---

## 📄 Licença

Distribuído sob a licença [MIT](LICENSE). Desenvolvido para personalização estética de alta fidelidade visual no macOS.
