/**
 * patch-engine.js — Translucid OpenCode Universal Dynamic Engine
 * Motor de injeção 100% dinâmico e resiliente a qualquer atualização futura do OpenCode.
 * Preserva os bundles originais do Vite (hashes dinâmicos) e injeta Liquid Glass + Pro Fonts.
 */
const fs = require('fs');
const path = require('path');

const targetDir = process.argv[2];

if (!targetDir || !fs.existsSync(targetDir)) {
  console.error('❌ Diretório extraído não fornecido ou inexistente:', targetDir);
  process.exit(1);
}

console.log('⚡ Iniciando injeção Dinâmica Universal em:', targetDir);

// =========================================================================
// 1. Localizar dinamicamente o bundle principal do Vite (assets/main-*.js)
// =========================================================================
const assetsDir = path.join(targetDir, 'out/renderer/assets');
if (fs.existsSync(assetsDir)) {
  const files = fs.readdirSync(assetsDir);
  const mainJsFile = files.find(f => f.startsWith('main-') && f.endsWith('.js'));
  if (mainJsFile) {
    const mainJsPath = path.join(assetsDir, mainJsFile);
    let rJs = fs.readFileSync(mainJsPath, 'utf8');
    rJs = rJs.replace(/const monoDefault\s*=\s*"System Mono";/, 'const monoDefault = "Fira Code";');
    rJs = rJs.replace(/const sansDefault\s*=\s*"System Sans";/, 'const sansDefault = "SF Pro Display";');
    rJs = rJs.replace(/const terminalDefault\s*=\s*"JetBrainsMono Nerd Font Mono";/, 'const terminalDefault = "JetBrainsMono Nerd Font";');
    fs.writeFileSync(mainJsPath, rJs, 'utf8');
    console.log(`✅ Bundle dinâmico (${mainJsFile}) configurado com Fontes Pro.`);
  }
}

// =========================================================================
// 2. Modificar out/renderer/index.html PRESERVANDO scripts e hashes originais
// =========================================================================
const htmlPath = path.join(targetDir, 'out/renderer/index.html');
if (fs.existsSync(htmlPath)) {
  let html = fs.readFileSync(htmlPath, 'utf8');

  // Remove injeção anterior se já existir
  html = html.replace(/<style id="translucid-opencode-glass">[\s\S]*?<\/style>/g, '');

  // Força atributos dark e transparência na tag html e body
  html = html.replace(/<html([^>]*)>/i, '<html$1 class="dark" data-color-scheme="dark" style="background-color: transparent !important; background: transparent !important; color-scheme: dark !important;">');
  html = html.replace(/<body([^>]*)>/i, '<body$1 class="dark" data-color-scheme="dark" style="background: transparent !important; background-color: transparent !important; color-scheme: dark !important;">');

  const customStyle = `
    <style id="translucid-opencode-glass">
      /* 🔒 FORÇA MODO ESCURO PERMANENTE E LIQUID GLASS */
      :root, [data-theme], [data-color-scheme], [data-color-scheme="light"], [data-color-scheme="dark"], .light, .dark, body, html {
        color-scheme: dark !important;

        /* Backgrounds Translúcidos */
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

        /* Bordas de Cristal */
        --v2-border-border-base: rgba(255, 255, 255, 0.22) !important;
        --v2-border-border-muted: rgba(255, 255, 255, 0.14) !important;
        --border-weak-base: rgba(255, 255, 255, 0.14) !important;
        --border-base: rgba(255, 255, 255, 0.22) !important;
        --border-strong-base: rgba(255, 255, 255, 0.32) !important;

        /* Tipografia Pro */
        --font-sans: 'SF Pro Display', -apple-system, BlinkMacSystemFont, 'Inter', sans-serif !important;
        --font-mono: 'Fira Code', 'JetBrainsMono Nerd Font', 'Monaspace Neon', 'SF Mono', monospace !important;
      }

      /* 🎨 MATIZES CROMÁTICAS DE CADA TEMA NO VIDRO */
      [data-theme*="purple"], [data-theme*="dracula"], [data-theme*="aura"], [data-theme*="rosepine"] {
        --theme-tint-overlay: linear-gradient(135deg, rgba(147, 51, 234, 0.22) 0%, rgba(88, 28, 135, 0.14) 50%, rgba(15, 12, 28, 0.35) 100%) !important;
        --theme-border-glow: rgba(192, 132, 252, 0.40) !important;
      }
      [data-theme*="tokyonight"], [data-theme*="cobalt"], [data-theme*="nord"], [data-theme*="one-dark"] {
        --theme-tint-overlay: linear-gradient(135deg, rgba(37, 99, 235, 0.22) 0%, rgba(29, 78, 216, 0.14) 50%, rgba(10, 18, 32, 0.35) 100%) !important;
        --theme-border-glow: rgba(147, 197, 253, 0.40) !important;
      }
      [data-theme*="matrix"], [data-theme*="jade"], [data-theme*="everforest"] {
        --theme-tint-overlay: linear-gradient(135deg, rgba(16, 185, 129, 0.22) 0%, rgba(5, 150, 105, 0.14) 50%, rgba(8, 24, 18, 0.35) 100%) !important;
        --theme-border-glow: rgba(110, 231, 183, 0.40) !important;
      }
      [data-theme*="synthwave"], [data-theme*="catppuccin"], [data-theme*="cyberpunk"] {
        --theme-tint-overlay: linear-gradient(135deg, rgba(236, 72, 153, 0.24) 0%, rgba(139, 92, 246, 0.18) 50%, rgba(18, 12, 26, 0.35) 100%) !important;
        --theme-border-glow: rgba(244, 114, 182, 0.45) !important;
      }
      [data-theme*="orng"], [data-theme*="gruvbox"], [data-theme*="solarized"], [data-theme*="monokai"] {
        --theme-tint-overlay: linear-gradient(135deg, rgba(245, 158, 11, 0.22) 0%, rgba(217, 119, 6, 0.14) 50%, rgba(26, 18, 10, 0.35) 100%) !important;
        --theme-border-glow: rgba(252, 211, 77, 0.40) !important;
      }

      #root {
        background: var(--theme-tint-overlay, rgba(10, 12, 18, 0.30)) !important;
        transform: translateZ(0);
      }

      /* ⚡ SINTAXE E CÓDIGO COM ALTO CONTRASTE */
      code, pre, [data-component*="code"], [class*="font-mono"], .monaco-editor, .xterm, [class*="syntax-"], [class*="token"] {
        font-family: 'Fira Code', 'Monaspace Neon', 'JetBrainsMono Nerd Font', monospace !important;
        font-variant-ligatures: contextual !important;
        font-feature-settings: "calt" 1, "liga" 1, "zero" 1, "ss01" 1, "ss02" 1 !important;
        filter: saturate(155%) contrast(110%) !important;
        letter-spacing: -0.01em;
      }

      body, p, span, h1, h2, h3, h4, h5, h6, label, button, a, div {
        text-shadow: 0 1px 2px rgba(0, 0, 0, 0.75);
      }

      html, body {
        background: transparent !important;
        background-color: transparent !important;
        font-family: var(--font-sans);
        -webkit-font-smoothing: antialiased;
        text-rendering: optimizeLegibility;
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
        background-color: rgba(10, 14, 22, 0.50) !important;
        border: 1px solid var(--theme-border-glow, rgba(255, 255, 255, 0.28)) !important;
        color: #ffffff !important;
        box-shadow: 0 4px 16px rgba(0, 0, 0, 0.40) !important;
        border-radius: 10px !important;
        transform: translateZ(0);
      }

      form [data-component="text-input-v2"],
      form textarea,
      [class*="prompt-box"],
      [class*="chat-input"] {
        background-color: rgba(8, 10, 16, 0.60) !important;
        border: 1.5px solid var(--theme-border-glow, rgba(255, 255, 255, 0.35)) !important;
        box-shadow: 0 12px 36px rgba(0, 0, 0, 0.55), 0 0 20px var(--theme-border-glow, rgba(255, 255, 255, 0.12)) !important;
        transform: translateZ(0);
      }

      h1, [class*="logo"], [class*="hero-title"] {
        color: #ffffff !important;
        font-weight: 800 !important;
        letter-spacing: -0.03em !important;
        text-shadow: 0 2px 10px rgba(0, 0, 0, 0.8), 0 0 25px var(--theme-border-glow, rgba(255, 255, 255, 0.35)) !important;
      }

      [data-component="button-v2"], button {
        color: #ffffff !important;
        border-color: rgba(255, 255, 255, 0.20) !important;
        transform: translateZ(0);
        transition: all 0.15s ease;
      }
      button:hover {
        background-color: rgba(255, 255, 255, 0.16) !important;
        border-color: var(--theme-border-glow, rgba(255, 255, 255, 0.45)) !important;
        box-shadow: 0 0 12px var(--theme-border-glow, rgba(255, 255, 255, 0.20)) !important;
      }

      dialog, [role="dialog"], [class*="modal"], [class*="popover"] {
        background: rgba(10, 12, 18, 0.70) !important;
        border: 1px solid var(--theme-border-glow, rgba(255, 255, 255, 0.28)) !important;
        box-shadow: 0 30px 70px rgba(0, 0, 0, 0.70) !important;
        transform: translateZ(0);
      }

      /* ⚡ BOTÃO NATIVO OPENCODE DASHBOARD INTEGRADO NA TITLEBAR */
      .oc-native-titlebar-btn {
        display: inline-flex !important;
        align-items: center !important;
        justify-content: center !important;
        gap: 5px !important;
        height: 22px !important;
        padding: 0 8px !important;
        margin-right: 8px !important;
        border-radius: 5px !important;
        background: rgba(255, 255, 255, 0.07) !important;
        border: 1px solid rgba(255, 255, 255, 0.16) !important;
        color: #cbd5e1 !important;
        font-family: var(--font-sans, -apple-system, BlinkMacSystemFont, 'Inter', sans-serif) !important;
        font-size: 11px !important;
        font-weight: 500 !important;
        cursor: pointer !important;
        -webkit-app-region: no-drag !important;
        flex-shrink: 0 !important;
        transition: all 0.15s ease !important;
        text-shadow: none !important;
        white-space: nowrap !important;
        position: static !important;
      }
      .oc-native-titlebar-btn:hover {
        background: rgba(255, 255, 255, 0.15) !important;
        border-color: rgba(255, 255, 255, 0.35) !important;
        color: #ffffff !important;
        box-shadow: 0 2px 6px rgba(0, 0, 0, 0.25) !important;
      }
      .oc-native-titlebar-btn:active {
        transform: scale(0.96) !important;
        background: rgba(255, 255, 255, 0.20) !important;
      }
    </style>
  `;

  html = html.replace('</head>', `${customStyle}\n</head>`);

  // Remove script anterior se existir
  html = html.replace(/<script id="oc-dashboard-script">[\s\S]*?<\/script>/g, '');

  const dashboardScript = `
    <script id="oc-dashboard-script">
      (function() {
        function mountDashboardButton() {
          const existingBtn = document.getElementById('opencode-dashboard-btn');

          // Container oficial de ações da titlebar à direita
          const titlebarRight = document.getElementById('opencode-titlebar-right');

          if (titlebarRight) {
            if (existingBtn) {
              if (existingBtn.parentElement !== titlebarRight) {
                titlebarRight.insertBefore(existingBtn, titlebarRight.firstChild);
              }
              return;
            }

            const btn = document.createElement('button');
            btn.id = 'opencode-dashboard-btn';
            btn.type = 'button';
            btn.title = 'Abrir OpenCode Dashboard (http://localhost:3030/)';
            btn.className = 'oc-native-titlebar-btn';
            btn.innerHTML = \`
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
                <rect x="3" y="3" width="7" height="9"></rect>
                <rect x="14" y="3" width="7" height="5"></rect>
                <rect x="14" y="12" width="7" height="9"></rect>
                <rect x="3" y="16" width="7" height="5"></rect>
              </svg>
              <span>Dashboard</span>
            \`;

            btn.addEventListener('click', function(e) {
              e.stopPropagation();
              e.preventDefault();
              const targetUrl = 'http://localhost:3030/';
              if (window.api && typeof window.api.openExternal === 'function') {
                window.api.openExternal(targetUrl);
              } else {
                window.open(targetUrl, '_blank');
              }
            });

            titlebarRight.insertBefore(btn, titlebarRight.firstChild);
            return;
          }

          // Fallback caso a barra da direita ainda não esteja no DOM
          const tabsScroll = document.querySelector('[data-slot="titlebar-tabs-scroll"]');
          if (tabsScroll && !existingBtn) {
            const btn = document.createElement('button');
            btn.id = 'opencode-dashboard-btn';
            btn.type = 'button';
            btn.title = 'Abrir OpenCode Dashboard (http://localhost:3030/)';
            btn.className = 'oc-native-titlebar-btn';
            btn.innerHTML = \`
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
                <rect x="3" y="3" width="7" height="9"></rect>
                <rect x="14" y="3" width="7" height="5"></rect>
                <rect x="14" y="12" width="7" height="9"></rect>
                <rect x="3" y="16" width="7" height="5"></rect>
              </svg>
              <span>Dashboard</span>
            \`;

            btn.addEventListener('click', function(e) {
              e.stopPropagation();
              e.preventDefault();
              const targetUrl = 'http://localhost:3030/';
              if (window.api && typeof window.api.openExternal === 'function') {
                window.api.openExternal(targetUrl);
              } else {
                window.open(targetUrl, '_blank');
              }
            });

            tabsScroll.appendChild(btn);
          }
        }

        if (document.readyState === 'loading') {
          document.addEventListener('DOMContentLoaded', mountDashboardButton);
        } else {
          mountDashboardButton();
        }

        setInterval(mountDashboardButton, 1000);
      })();
    </script>
  `;

  html = html.replace('</body>', `${dashboardScript}\n</body>`);
  fs.writeFileSync(htmlPath, html, 'utf8');
  console.log('✅ out/renderer/index.html configurado com botão do Dashboard e injeção Liquid Glass.');
}

// =========================================================================
// 3. out/renderer/oc-theme-preload.js
// =========================================================================
const preloadJsPath = path.join(targetDir, 'out/renderer/oc-theme-preload.js');
if (fs.existsSync(preloadJsPath)) {
  const preloadContent = `;(function () {
  var key = "opencode-theme-id";
  var themeId = localStorage.getItem(key) || "oc-2";
  try {
    localStorage.setItem("opencode-color-scheme", "dark");
  } catch (e) {}

  document.documentElement.dataset.theme = themeId;
  document.documentElement.dataset.colorScheme = "dark";
  document.documentElement.classList.add("dark");
  document.documentElement.classList.remove("light");
  document.documentElement.style.backgroundColor = "transparent";
  document.documentElement.style.colorScheme = "dark";
})();`;
  fs.writeFileSync(preloadJsPath, preloadContent, 'utf8');
  console.log('✅ out/renderer/oc-theme-preload.js configurado.');
}

// =========================================================================
// 4. out/main/index.js (Electron ESM NativeTheme & Transparência)
// =========================================================================
const mainJsPath = path.join(targetDir, 'out/main/index.js');
if (fs.existsSync(mainJsPath)) {
  let mainJs = fs.readFileSync(mainJsPath, 'utf8');

  // ESM safe nativeTheme
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
  console.log('✅ out/main/index.js configurado.');
}

console.log('🎉 Injeção Dinâmica Universal concluída com sucesso!');
