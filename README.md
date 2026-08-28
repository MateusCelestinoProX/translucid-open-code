# ✨ Translucid OpenCode — Apple Liquid Glass & Radiant Energy Engine

> **A personalização visual definitiva e oficial para o [OpenCode](https://opencode.ai) no macOS, combinando vidro líquido translúcido nativo estilo Apple Vibrancy com um Motor de Efeitos de Energia em Tempo Real a 120 FPS.**

---

## 🌟 O que Há de Novo (Versão Final Consolidada)

- 💎 **Apple Vibrancy Nativo (GPU Metal)**: Janela 100% translúcida integrada ao sistema operacional com desfoque profundo (*backdrop-filter: blur*).
- 🌅 **Deep Horizon Radiant**: Nébula profunda amplificada na base da janela com feixes e raios volumétricos de luz irradiando para cima.
- ✨ **Celestial Radiance**: Fonte de luz estática no canto superior direito irradiando raios cósmicos descendentes pela interface.
- 🌋 **Plasma Lava (Orbs)**: Duas massas fluidas de plasma com gradientes puros e curvas bezier harmônicas.
- ⚡ **Cyber Neon Pulse**: Feixes perimetrais de laser e pulso neon com vibração eletromagnética.
- 🌊 **Aurora Liquid Waves**: Ondas orgânicas ondulantes estilo Aurora Boreal no topo e laterais.
- 💎 **Pure Crystal Glass**: Vidro cristal 100% limpo e minimalista sem efeitos de luz adicionais.
- 🎨 **Custom Color Engine**: Seletores nativos RGB/Hex para **Luz Principal**, **Luz Secundária** e **Destaque (Accent)**, com 6 paletas rápidas e compatibilidade total com os **37 temas nativos do OpenCode**.
- 🔄 **Sincronização em Tempo Real (Solid.js)**: Troca instantânea sem recarregar o app, com sincronização bidirecional via `opencode-theme-id` e `MutationObserver`.

---

## 🚀 Como Aplicar em 1 Clique (Instalação ou Pós-Atualização)

Sempre que o OpenCode for atualizado, reinstalado ou o computador formatado, basta abrir o terminal nesta pasta e executar:

```bash
chmod +x apply-translucid.sh
./apply-translucid.sh
```

### O que o instalador faz de ponta a ponta:
1. **Geração do Motor Visual**: Compila o motor JavaScript limpo com validação de sintaxe na VM.
2. **Backup de Segurança**: Preserva o arquivo `app.asar.backup` original caso precise reverter.
3. **Injeção do Liquid Glass & Apple Vibrancy**: Aplica transparência de alta performance na camada de renderização e no processo principal do Electron.
4. **Reempacotamento**: Empacota o novo `app.asar`.
5. **Assinatura & Gatekeeper**: Remove a quarentena do macOS e aplica assinatura ad-hoc válida.
6. **Reinicialização Imediata**: Inicia o OpenCode com toda a estética ativa.

---

## ⌨️ Como Usar no OpenCode

1. **Botões na Barra Superior**: Clique no botão **Efeitos** ou **Dashboard** na barra de títulos.
2. **Atalho Global de Teclado**: Pressione <kbd>Cmd</kbd> + <kbd>Shift</kbd> + <kbd>T</kbd> (ou <kbd>Cmd</kbd> + <kbd>Shift</kbd> + <kbd>E</kbd>) em qualquer tela para abrir/fechar o painel de efeitos.
3. **Controles Finos**:
   - Ajuste o slider de **Glow / Brilho** (15% a 95%).
   - Alterne a **Velocidade** (🐢 Calmo, ⚡ Fluido, 🚀 Rápido, ⚡⚡ Turbo).
   - Escolha entre **37 Temas Presets** ou use a aba **Cores Personalizadas**.

---

## 📊 Dashboard de Controle Local

Para rodar a central de monitoramento visual:

```bash
chmod +x start-dashboard.sh
./start-dashboard.sh
```
Acesse no seu navegador: **[http://localhost:3030/](http://localhost:3030/)**

---

## 🔄 Restaurar Original

Para reverter para o visual padrão do OpenCode a qualquer momento:

```bash
chmod +x restore-original.sh
./restore-original.sh
```

---

## 🔤 Fontes Profissionais Recomendadas

Para instalar fontes para programação (*JetBrains Mono*, *Fira Code*, *SF Pro*, *Inter*):

```bash
chmod +x install-pro-fonts.sh
./install-pro-fonts.sh
```

---

## 📄 Licença

Distribuído sob a licença MIT. Veja `LICENSE` para mais detalhes.
