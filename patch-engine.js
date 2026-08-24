/**
 * patch-engine.js — Translucid OpenCode Engine (High Contrast Edition)
 * Motor de injeção de Liquid Glass, Alto Contraste de Branco e Fontes Pro
 */
const fs = require('fs');
const path = require('path');

const targetDir = process.argv[2];

if (!targetDir || !fs.existsSync(targetDir)) {
  console.error('❌ Diretório extraído não fornecido ou inexistente:', targetDir);
  process.exit(1);
}

console.log('⚡ Iniciando injeção de Transparência Líquida + Alto Contraste em:', targetDir);

// =========================================================================
// 1. out/renderer/index.html (Injeção de CSS de Transparência + Alto Contraste)
// =========================================================================
const htmlPath = path.join(targetDir, 'out/renderer/index.html');
if (fs.existsSync(htmlPath)) {
  const htmlContent = `<!doctype html>
<html lang="en" style="background-color: transparent !important; background: transparent !important;">
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
      :root, [data-theme], [data-color-scheme="dark"], [data-color-scheme="light"], .dark, body {
        /* Backgrounds 100% Translúcidos */
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

        /* Alto Contraste de Branco Nítido nos Textos */
        --v2-text-text-base: #ffffff !important;
        --v2-text-text-subtle: #f1f5f9 !important;
        --v2-text-text-muted: #cbd5e1 !important;
        --text-base: #ffffff !important;
        --text-strong: #ffffff !important;
        --text-stronger: #ffffff !important;
        --text-weak: #f1f5f9 !important;
        --text-weaker: #cbd5e1 !important;
        --icon-base: #ffffff !important;
        --icon-strong: #ffffff !important;

        /* Bordas Definidas */
        --v2-border-border-base: rgba(255, 255, 255, 0.18) !important;
        --v2-border-border-muted: rgba(255, 255, 255, 0.12) !important;
        --border-weak-base: rgba(255, 255, 255, 0.12) !important;
        --border-base: rgba(255, 255, 255, 0.18) !important;
        --border-strong-base: rgba(255, 255, 255, 0.28) !important;
      }

      /* Tipografia com sombra nítida contra fundos claros ou escuros */
      body, p, span, h1, h2, h3, h4, h5, h6, label, button, a, div {
        text-shadow: 0 1px 2px rgba(0, 0, 0, 0.65);
      }

      html, body {
        background: transparent !important;
        background-color: transparent !important;
        font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Inter', sans-serif;
      }

      #root {
        background: transparent !important;
        background-color: transparent !important;
        backdrop-filter: blur(14px) saturate(160%) !important;
        -webkit-backdrop-filter: blur(14px) saturate(160%) !important;
      }

      /* Containers translúcidos */
      main, aside, section, article, nav, header, [data-slot="dialog-container"], .settings-v2-panel {
        background: transparent !important;
        background-color: transparent !important;
      }
      [class*="bg-background-"], [class*="bg-zinc-"], [class*="bg-neutral-"], [class*="bg-slate-"], [class*="bg-black"], [class*="bg-[#"] {
        background: transparent !important;
        background-color: transparent !important;
      }

      /* Inputs, Dropdowns e Seletores com acabamento de vidro de alto contraste */
      [data-component="text-input-v2"], 
      [data-component="settings-v2-list"],
      textarea, input, [contenteditable="true"], select {
        background-color: rgba(0, 0, 0, 0.35) !important;
        border: 1px solid rgba(255, 255, 255, 0.22) !important;
        backdrop-filter: blur(16px) !important;
        -webkit-backdrop-filter: blur(16px) !important;
        color: #ffffff !important;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3) !important;
      }

      /* Botões de Alto Contraste */
      [data-component="button-v2"], button {
        color: #ffffff !important;
      }

      /* Diálogos modais / Popovers */
      dialog, [role="dialog"], [class*="modal"], [class*="popover"] {
        background: rgba(10, 12, 18, 0.55) !important;
        backdrop-filter: blur(35px) saturate(190%) !important;
        border: 1px solid rgba(255, 255, 255, 0.25) !important;
        box-shadow: 0 25px 60px rgba(0, 0, 0, 0.6) !important;
      }
    </style>
  </head>
  <body class="antialiased overscroll-none text-12-regular overflow-hidden" style="background: transparent !important; background-color: transparent !important;">
    <noscript>You need to enable JavaScript to run this app.</noscript>
    <div id="root" class="flex flex-col h-dvh" style="background: transparent !important; background-color: transparent !important;"></div>
  </body>
</html>`;
  fs.writeFileSync(htmlPath, htmlContent, 'utf8');
  console.log('✅ out/renderer/index.html reescrito com Alto Contraste.');
}

// =========================================================================
// 2. out/renderer/oc-theme-preload.js
// =========================================================================
const preloadJsPath = path.join(targetDir, 'out/renderer/oc-theme-preload.js');
if (fs.existsSync(preloadJsPath)) {
  const preloadContent = `;(function () {
  var key = "opencode-theme-id";
  var themeId = localStorage.getItem(key) || "oc-2";
  var scheme = localStorage.getItem("opencode-color-scheme") || "system";
  var isDark = scheme === "dark" || (scheme === "system" && matchMedia("(prefers-color-scheme: dark)").matches);
  var mode = isDark ? "dark" : "light";

  document.documentElement.dataset.theme = themeId;
  document.documentElement.dataset.colorScheme = mode;
  document.documentElement.style.backgroundColor = "transparent";
})();`;
  fs.writeFileSync(preloadJsPath, preloadContent, 'utf8');
  console.log('✅ out/renderer/oc-theme-preload.js neutralizado.');
}

// =========================================================================
// 3. out/main/index.js
// =========================================================================
const mainJsPath = path.join(targetDir, 'out/main/index.js');
if (fs.existsSync(mainJsPath)) {
  let mainJs = fs.readFileSync(mainJsPath, 'utf8');

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
  const mode = tone();
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
    opacity: 0.92,
    ...process.platform === "darwin" ? {
      titleBarStyle: "hidden",
      trafficLightPosition: { x: 14, y: 14 },
      vibrancy: "under-window",
      visualEffectState: "active"
    } : {},
    ...process.platform === "win32" ? {
      frame: false,
      titleBarStyle: "hidden",
      titleBarOverlay: overlay({ mode })
    } : {},
    webPreferences: {`
  );

  fs.writeFileSync(mainJsPath, mainJs, 'utf8');
  console.log('✅ out/main/index.js configurado.');
}

console.log('🎉 Patch de Alto Contraste de Branco aplicado com sucesso!');
