# 🪟✨ Translucid OpenCode

> Motor de injeção de **Vidro Líquido Ultra-Translúcido (Pure Liquid Glass & Apple Native Vibrancy)**, aceleração por hardware **120 FPS ProMotion** e tipografia profissional para o **OpenCode Desktop (macOS)**.

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Platform: macOS](https://img.shields.io/badge/Platform-macOS%20(Apple%20Silicon%20%26%20Intel)-black.svg)](https://apple.com)
[![Electron: Native Glass](https://img.shields.io/badge/Electron-Vibrancy%20%26%20Alpha-emerald.svg)](https://electronjs.org)
[![Display: 120 FPS](https://img.shields.io/badge/ProMotion-120%20FPS%20Metal-purple.svg)](https://apple.com)

---

## 📖 Visão Geral

O **OpenCode Desktop** é um aplicativo construído em **Electron + React (Design System v2)**. Por padrão de fábrica, ele vem com fundos escuros e opacos (`#080808`, `#101010`, `#18181b`).

O **Translucid OpenCode** é um motor de patch automatizado que:
1. Desbloqueia o canal Alpha nativo do macOS através do **`NSVisualEffectView`** (`vibrancy: "under-window"`, `transparent: true`, `opacity: 0.94`).
2. Neutraliza todas as variáveis de background sólido do design system v2 (`--v2-background-bg-*`) para `transparent !important`.
3. Aplica **Alto Contraste de Branco Reluzente (`#ffffff`)** com micro-sombras ópticas nos textos e na logo da Home, garantindo legibilidade nítida sobre qualquer papel de parede.
4. Ativa **Fontes Profissionais** com suporte a ligaduras de código no editor (`Fira Code`, `SF Pro Display`, `JetBrainsMono Nerd Font`).
5. Garante **120 FPS cravados (ProMotion)** usando isolamento de textura por GPU (`transform: translateZ(0)`).
6. Integra botão nativo discreto na barra de título para acesso rápido com 1 clique ao **OpenCode Dashboard** ([`http://localhost:3030/`](http://localhost:3030/)) no seu navegador padrão.

---

## ⚡ Como Usar (Aplicação em 1 Comando)

Abra o Terminal nesta pasta e execute:

```bash
# 1. Conceda permissão de execução aos scripts
chmod +x *.sh

# 2. Instale as fontes profissionais no macOS
./install-pro-fonts.sh

# 3. Aplique a transparência líquida no OpenCode
./apply-translucid.sh

# 4. Inicie o OpenCode Dashboard (opcional)
./start-dashboard.sh
```

O script automaticamente:
* Encerra instâncias em execução do OpenCode.
* Cria um backup de segurança em `/Applications/OpenCode.app/Contents/Resources/app.asar.backup`.
* Desempacota o arquivo `.asar`, injeta as diretivas de janela transparente, o CSS de alto contraste e o botão do Dashboard.
* Reempacota o aplicativo e o abre instantaneamente com a interface de vidro líquido ativa!

---

## 🔄 Como Restaurar para o Padrão de Fábrica

Se em algum momento você desejar desfazer as alterações e voltar ao OpenCode original:

```bash
./restore-original.sh
```

---

## ❓ Perguntas Frequentes (FAQ)

### 1. Se eu desligar ou reiniciar o Mac, o visual volta ao padrão?
> **Não!** As modificações são gravadas diretamente no pacote físico `app.asar` dentro de `/Applications/OpenCode.app`. O efeito translúcido **permanece ativo e intacto indefinidamente**.

### 2. Se o OpenCode for atualizado, o visual volta ao padrão?
> **Sim.** Quando um aplicativo Electron recebe uma atualização oficial, o instalador substitui o arquivo `app.asar`.
> **Solução:** Basta rodar novamente `./apply-translucid.sh` para reaplicar o efeito na nova versão em menos de **10 segundos**!

### 3. A engine do aplicativo ou chamadas de IA são afetadas?
> **Não, 100% intactas.** O patch atua estritamente na camada cosmética (janela `BrowserWindow` e CSS do DOM). Toda a comunicação de LLMs, WebSockets, subprocessos `node-pty` e chaves de API funcionam com velocidade e segurança normais.

---

## 🛠️ O que foi modificado por debaixo dos panos:

### No Processo Principal do Electron (`out/main/index.js`):
```javascript
mainWindow = new BrowserWindow({
  transparent: true,
  backgroundColor: "#00000000",
  opacity: 0.94,
  titleBarStyle: "hidden",
  trafficLightPosition: { x: 14, y: 14 },
  vibrancy: "under-window",
  visualEffectState: "active"
});
```

### Na Camada Web (`out/renderer/index.html`):
```css
:root, [data-theme], .dark {
  --v2-background-bg-base: transparent !important;
  --v2-background-bg-layer-01: transparent !important;
  --v2-text-text-base: #ffffff !important;
  --font-sans: 'SF Pro Display', -apple-system, sans-serif !important;
  --font-mono: 'Fira Code', 'JetBrainsMono Nerd Font', monospace !important;
}
```

---

## 📄 Licença

Distribuído sob a licença [MIT](LICENSE). Desenvolvido para personalização estética de alta fidelidade visual.
