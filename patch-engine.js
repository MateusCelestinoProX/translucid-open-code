/**
 * patch-engine.js — Translucid OpenCode Engine (ESM Safe + Permanent Dark Mode Edition)
 * Injeta Liquid Glass, 120 FPS ProMotion e trava de Dark Mode 100% compatível com ES Modules.
 */
const fs = require('fs');
const path = require('path');

const targetDir = process.argv[2];

if (!targetDir || !fs.existsSync(targetDir)) {
  console.error('❌ Diretório extraído não fornecido ou inexistente:', targetDir);
  process.exit(1);
}

console.log('⚡ Injetando Modo Escuro Permanente ESM-Safe + Liquid Glass em:', targetDir);

// =========================================================================
// 1. out/renderer/assets/main-DxX1DkV8.js (Definição de Fontes Padrão Pro)
// =========================================================================
const mainRendererJsPath = path.join(targetDir, 'out/renderer/assets/main-DxX1DkV8.js');
if (fs.existsSync(mainRendererJsPath)) {
  let rJs = fs.readFileSync(mainRendererJsPath, 'utf8');
  rJs = rJs.replace(/const monoDefault\s*=\s*"System Mono";/, 'const monoDefault = "Fira Code";');
  rJs = rJs.replace(/const sansDefault\s*=\s*"System Sans";/, 'const sansDefault = "SF Pro Display";');
  rJs = rJs.replace(/const terminalDefault\s*=\s*"JetBrainsMono Nerd Font Mono";/, 'const terminalDefault = "JetBrainsMono Nerd Font";');
  fs.writeFileSync(mainRendererJsPath, rJs, 'utf8');
  console.log('✅ main-DxX1DkV8.js configurado com Fira Code e SF Pro Display.');
}

// =========================================================================
// 2. out/renderer/index.html (Estilos 120 FPS + Trava Permanente no Dark Mode)
// =========================================================================
const htmlPath = path.join(targetDir, 'out/renderer/index.html');
if (fs.existsSync(htmlPath)) {
  const htmlContent = `<!doctype html>
<html lang="en" class="dark" data-color-scheme="dark" style="background-color: transparent !important; background: transparent !important; color-scheme: dark !important;">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>OpenCode</title>
    <link rel="icon" type="image/png" href="./favicon-96x96-v3.png" sizes="96x96" />
    <link rel="icon" type="image/svg+xml" href="./favicon-v3.svg" />
    <link rel="shortcut icon" href="./favicon-v3.ico" />
    <link rel="apple-touch-icon" sizes="180x180" href="./apple-touch-icon-v3.png" />
    <meta name="theme-color" content="#00000000" />
    <script id="oc-theme-preload-script" src="./oc-theme-preload.js"></script>
    <script type="module" crossorigin src="./assets/main-DxX1DkV8.js"></script>
    <link rel="stylesheet" crossorigin href="./assets/main-CIkHDf4N.css">
    <style id="translucid-opencode-glass">
      /* 🔒 FORÇA MODO ESCURO PERMANENTE EM QUALQUER CENÁRIO */
      :root, [data-theme], [data-color-scheme], [data-color-scheme="light"], [data-color-scheme="dark"], .light, .dark, body, html {
        color-scheme: dark !important;

        /* Fundo Totalmente Translúcido */
        --v2-background-bg-base: transparent !important;
        --v2-background-bg-layer-01: transparent !important;
        --v2-background-bg-layer-02: transparent !important;
        --v2-background-bg-layer-03: transparent !important;
        --v2-background-bg-layer-04: transparent !important;
        --v2-background-bg-layer-05: transparent !important;
        --v2-background-bg-surface: transparent !important;
        --v2-background-bg-subtle: transparent !important;
        --v2-background-bg-muted: transparent !important;
        --background-base: transparent !important;
        --background-weak: transparent !important;
        --background-strong: transparent !important;
        --background-stronger: transparent !important;
        --surface-base: transparent !important;
        --surface-float-base: transparent !important;
        --surface-raised-base: transparent !important;
        --surface-inset-base: transparent !important;
        --surface-diff-unchanged-base: transparent !important;

        /* Textos em Branco Puro e Alto Contraste */
        --v2-text-text-base: #ffffff !important;
        --v2-text-text-subtle: #f8fafc !important;
        --v2-text-text-muted: #e2e8f0 !important;
        --text-base: #ffffff !important;
        --text-strong: #ffffff !important;
        --text-stronger: #ffffff !important;
        --text-weak: #f8fafc !important;
        --text-weaker: #e2e8f0 !important;
        --icon-base: #ffffff !important;
        --icon-strong: #ffffff !important;

        /* Bordas Definidas */
        --v2-border-border-base: rgba(255, 255, 255, 0.22) !important;
        --v2-border-border-muted: rgba(255, 255, 255, 0.14) !important;
        --border-weak-base: rgba(255, 255, 255, 0.14) !important;
        --border-base: rgba(255, 255, 255, 0.22) !important;
        --border-strong-base: rgba(255, 255, 255, 0.32) !important;

        /* Tipografia Pro */
        --font-sans: 'SF Pro Display', -apple-system, BlinkMacSystemFont, 'Inter', sans-serif !important;
        --font-mono: 'Fira Code', 'JetBrainsMono Nerd Font', 'Monaspace Neon', 'SF Mono', monospace !important;
      }

      body, p, span, h1, h2, h3, h4, h5, h6, label, button, a, div {
        text-shadow: 0 1px 2px rgba(0, 0, 0, 0.70);
      }

      html, body {
        background: transparent !important;
        background-color: transparent !important;
        font-family: var(--font-sans);
        -webkit-font-smoothing: antialiased;
        text-rendering: optimizeLegibility;
      }

      code, pre, [data-component*="code"], [class*="font-mono"], .monaco-editor, .xterm {
        font-family: 'Fira Code', 'Monaspace Neon', 'JetBrainsMono Nerd Font', monospace !important;
        font-variant-ligatures: contextual !important;
        font-feature-settings: "calt" 1, "liga" 1, "zero" 1, "ss01" 1, "ss02" 1 !important;
        letter-spacing: -0.01em;
      }

      #root {
        background: transparent !important;
        background-color: transparent !important;
        transform: translateZ(0);
      }

      main, aside, section, article, nav, header, [data-slot="dialog-container"], .settings-v2-panel {
        background: transparent !important;
        background-color: transparent !important;
        transform: translateZ(0);
      }
      [class*="bg-background-"], [class*="bg-zinc-"], [class*="bg-neutral-"], [class*="bg-slate-"], [class*="bg-black"], [class*="bg-[#"] {
        background: transparent !important;
        background-color: transparent !important;
      }

      [data-component="text-input-v2"], 
      [data-component="settings-v2-list"],
      textarea, input, [contenteditable="true"], select {
        background-color: rgba(10, 14, 22, 0.45) !important;
        border: 1px solid rgba(255, 255, 255, 0.28) !important;
        color: #ffffff !important;
        box-shadow: 0 4px 16px rgba(0, 0, 0, 0.40) !important;
        border-radius: 10px !important;
        transform: translateZ(0);
      }

      form [data-component="text-input-v2"],
      form textarea,
      [class*="prompt-box"],
      [class*="chat-input"] {
        background-color: rgba(8, 10, 16, 0.55) !important;
        border: 1.5px solid rgba(255, 255, 255, 0.35) !important;
        box-shadow: 0 12px 36px rgba(0, 0, 0, 0.55) !important;
        transform: translateZ(0);
      }

      h1, [class*="logo"], [class*="hero-title"] {
        color: #ffffff !important;
        font-weight: 800 !important;
        letter-spacing: -0.03em !important;
        text-shadow: 0 2px 10px rgba(0, 0, 0, 0.8), 0 0 25px rgba(255, 255, 255, 0.35) !important;
      }

      [data-component="button-v2"], button {
        color: #ffffff !important;
        border-color: rgba(255, 255, 255, 0.20) !important;
        transform: translateZ(0);
        transition: background-color 0.15s ease;
      }
      button:hover {
        background-color: rgba(255, 255, 255, 0.14) !important;
        border-color: rgba(255, 255, 255, 0.35) !important;
      }

      dialog, [role="dialog"], [class*="modal"], [class*="popover"] {
        background: rgba(10, 12, 18, 0.65) !important;
        border: 1px solid rgba(255, 255, 255, 0.28) !important;
        box-shadow: 0 30px 70px rgba(0, 0, 0, 0.70) !important;
        transform: translateZ(0);
      }
    </style>
  </head>
  <body class="dark antialiased overscroll-none text-12-regular overflow-hidden" data-color-scheme="dark" style="background: transparent !important; background-color: transparent !important; color-scheme: dark !important;">
    <noscript>You need to enable JavaScript to run this app.</noscript>
    <div id="root" class="flex flex-col h-dvh" style="background: transparent !important; background-color: transparent !important;"></div>
  </body>
</html>`;
  fs.writeFileSync(htmlPath, htmlContent, 'utf8');
  console.log('✅ out/renderer/index.html travado no Modo Escuro Permanente.');
}

// =========================================================================
// 3. out/renderer/oc-theme-preload.js (Trava Rígida no Tema Dark)
// =========================================================================
const preloadJsPath = path.join(targetDir, 'out/renderer/oc-theme-preload.js');
if (fs.existsSync(preloadJsPath)) {
  const preloadContent = `;(function () {
  try {
    localStorage.setItem("opencode-theme-id", "oc-2");
    localStorage.setItem("opencode-color-scheme", "dark");
  } catch (e) {}

  document.documentElement.dataset.theme = "oc-2";
  document.documentElement.dataset.colorScheme = "dark";
  document.documentElement.classList.add("dark");
  document.documentElement.classList.remove("light");
  document.documentElement.style.backgroundColor = "transparent";
  document.documentElement.style.colorScheme = "dark";
})();`;
  fs.writeFileSync(preloadJsPath, preloadContent, 'utf8');
  console.log('✅ out/renderer/oc-theme-preload.js configurado para Modo Escuro Permanente.');
}

// =========================================================================
// 4. out/main/index.js (Electron ESM NativeTheme Dark Lock)
// =========================================================================
const mainJsPath = path.join(targetDir, 'out/main/index.js');
if (fs.existsSync(mainJsPath)) {
  let mainJs = fs.readFileSync(mainJsPath, 'utf8');

  // Remove qualquer require indevido anterior
  mainJs = mainJs.replace(/const \{ nativeTheme: _nativeTheme \} = require\("electron"\);[\s\S]*?\n/, '');

  // Insere a trava de nativeTheme via ESM seguro
  if (!mainJs.includes('nativeTheme.themeSource = "dark";')) {
    mainJs = mainJs.replace(
      /import electron, \{([\s\S]*?)\} from "electron";/,
      `import electron, { $1 } from "electron";\ntry { nativeTheme.themeSource = "dark"; } catch(e) {}`
    );
  }

  mainJs = mainJs.replace(
    /function setBackgroundColor\(color\) \{[\s\S]*?win\.setBackgroundColor\(color\);[\s\S]*?\}\);[\s\S]*?\}/,
    `function setBackgroundColor(color) {
  backgroundColor = "#00000000";
  BrowserWindow.getAllWindows().forEach((win) => {
    win.setBackgroundColor("#00000000");
    if (process.platform === "darwin") {
      win.setVibrancy("under-window");
      win.invalidateShadow();
    }
  });
}`
  );

  mainJs = mainJs.replace(
    /function createMainWindow\(id = randomUUID\(\)\) \{[\s\S]*?const win = new BrowserWindow\(\{[\s\S]*?webPreferences: \{/,
    `function createMainWindow(id = randomUUID()) {
  const state = windowState({
    file: windowStateFile(id),
    defaultWidth: 1280,
    defaultHeight: 800
  });
  const mode = "dark";
  const win = new BrowserWindow({
    x: state.x,
    y: state.y,
    width: state.width,
    height: state.height,
    show: false,
    autoHideMenuBar: true,
    title: "OpenCode",
    icon: iconPath(),
    backgroundColor: "#00000000",
    transparent: true,
    hasShadow: true,
    opacity: 0.94,
    ...process.platform === "darwin" ? {
      titleBarStyle: "hidden",
      trafficLightPosition: { x: 14, y: 14 },
      vibrancy: "under-window",
      visualEffectState: "active"
    } : {},
    ...process.platform === "win32" ? {
      frame: false,
      titleBarStyle: "hidden",
      titleBarOverlay: overlay({ mode: "dark" })
    } : {},
    webPreferences: {`
  );

  fs.writeFileSync(mainJsPath, mainJs, 'utf8');
  console.log('✅ out/main/index.js configurado com nativeTheme dark ESM-Safe.');
}

console.log('🎉 OpenCode travado no Modo Escuro Permanente com sucesso!');
