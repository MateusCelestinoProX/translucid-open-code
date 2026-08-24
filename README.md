# 🪟✨ Translucid OpenCode

> Transforme o **OpenCode Desktop (Electron)** em uma interface de **Vidro Líquido Ultra-Translúcida (Liquid Glass & Apple Native Vibrancy)** no macOS.

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Platform: macOS](https://img.shields.io/badge/Platform-macOS%20(Apple%20Silicon%20%26%20Intel)-black.svg)](https://apple.com)
[![Electron: Native Glass](https://img.shields.io/badge/Electron-Vibrancy%20%26%20Alpha-emerald.svg)](https://electronjs.org)

---

## 📖 Visão Geral

O **OpenCode Desktop** é um aplicativo construído em **Electron + React (Design System v2)**. Por padrão, ele possui uma interface com painéis de cores sólidas e opacas (`#080808`, `#101010`, `#18181b`).

O **Translucid OpenCode** é um motor de patch cirúrgico que desbloqueia a transparência alfa nativa do macOS e substitui as cores sólidas por uma lâmina de **vidro líquido 100% translúcida**, permitindo visualizar nitidamente o seu papel de parede ou janelas em segundo plano (como o Antigravity IDE ou VS Code), mantendo textos e elementos de digitação perfeitamente nítidos e ergonômicos.

---

## ⚡ Como Aplicar com 1 Comando (Automático)

Abra o Terminal no diretório do projeto e execute:

```bash
chmod +x apply-translucid.sh restore-original.sh
./apply-translucid.sh
```

O script automaticamente:
1. Encerra qualquer instância em execução do OpenCode.
2. Cria um backup seguro do arquivo original (`app.asar.backup`).
3. Extrai o pacote de recursos com `@electron/asar`.
4. Injeta as diretivas de janela transparente (`transparent: true`, `opacity: 0.90`, `vibrancy: "under-window"`).
5. Neutraliza todas as variáveis de CSS sólido (`--v2-background-bg-*`) para `transparent`.
6. Reempacota o aplicativo e o inicializa instantaneamente.

---

## 🔄 Como Restaurar para a Versão Padrão de Fábrica

Se você desejar retornar ao visual original sólido do OpenCode a qualquer momento, basta executar:

```bash
./restore-original.sh
```

---

## ❓ Perguntas Frequentes (FAQ)

### 1. Se eu desligar ou reiniciar o Mac, o visual volta ao padrão?
> **Não!** As alterações são gravadas de forma permanente no arquivo binário `app.asar` dentro de `/Applications/OpenCode.app`. Portanto, ao desligar, reiniciar ou suspender o Mac, o efeito translúcido **continua ativo e intacto**.

### 2. Se o OpenCode receber uma atualização, o visual volta ao padrão?
> **Sim.** Quando o aplicativo recebe um update oficial (automático ou por novo instalador `.dmg`), o instalador substitui o arquivo `app.asar` pelo da nova versão. 
> **Solução:** Basta rodar novamente o `./apply-translucid.sh` para aplicar a transparência na versão atualizada em menos de 10 segundos!

### 3. A engine do aplicativo, consumo de IA ou terminal são afetados?
> **Não, a engine continua 100% intacta.** O patch atua exclusivamente nas camadas de apresentação visual (instanciação da janela `BrowserWindow` do Electron e folha de estilos CSS). Toda a lógica de chamadas de LLM, sockets, sidecars, execução de comandos e tokens permanece inalterada.

---

## 🛠️ Arquitetura Técnica: O que foi alterado por debaixo dos panos?

### 1. No Processo Principal do Electron (`out/main/index.js`):
* `transparent: true` — Habilita a transparência do canal Alpha na janela.
* `backgroundColor: "#00000000"` — Elimina o fundo de cor sólida inicial.
* `opacity: 0.90` — Controla a refração física da janela no compositor de janelas do macOS.
* `vibrancy: "under-window"` — Aplica o efeito nativo de vidro fosco do macOS.

### 2. No Script de Inicialização de Tema (`out/renderer/oc-theme-preload.js`):
* Neutralizado o script inline que forçava `document.documentElement.style.backgroundColor = "#080808"`.

### 3. No Design System Web (`out/renderer/index.html`):
* Redefinição de todas as variáveis do sistema de tokens v2 para `transparent !important`:
  * `--v2-background-bg-base`
  * `--v2-background-bg-layer-01` a `05`
  * `--background-base` e `--background-strong`
* Efeito de desfoque sedoso com `backdrop-filter: blur(14px) saturate(160%)`.

---

## 📄 Licença

Este projeto é disponibilizado sob a licença [MIT](LICENSE). Desenvolvido para personalização estética de alta fidelidade visual.
