const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const vm = require('vm');

const buildDir = '/tmp/opencode-pristine-build';

console.log('🚀 [Deploy v11] 1. Preparando diretório de build limpo...');
execSync(`rm -rf "${buildDir}" && cp -R /tmp/opencode-clean "${buildDir}"`);

// 1. Modificar out/main/index.js
console.log('🔧 [Deploy v11] 2. Configurando out/main/index.js...');
const mainPath = path.join(buildDir, 'out/main/index.js');
let mainContent = fs.readFileSync(mainPath, 'utf8');

mainContent = mainContent.replace(
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

mainContent = mainContent.replace(
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

fs.writeFileSync(mainPath, mainContent, 'utf8');

// 2. Configurar oc-theme-preload.js
console.log('🔧 [Deploy v11] 3. Configurando oc-theme-preload.js...');
const preloadPath = path.join(buildDir, 'out/renderer/oc-theme-preload.js');
const preloadCode = `;(function () {
  var key = "opencode-theme-id";
  var themeId = localStorage.getItem(key) || "poimandres";
  if (!localStorage.getItem(key)) {
    localStorage.setItem(key, "poimandres");
  }

  document.documentElement.dataset.theme = themeId;
  document.documentElement.dataset.colorScheme = "dark";
  document.documentElement.classList.add("dark");
  document.documentElement.classList.remove("light");
  document.documentElement.style.backgroundColor = "transparent";
  document.documentElement.style.colorScheme = "dark";

  var metas = document.querySelectorAll("meta[name='theme-color']");
  if (metas.length > 0) metas[0].setAttribute("content", "#080808");
})();
`;
fs.writeFileSync(preloadPath, preloadCode, 'utf8');

// 3. Ler o motor verificado
const engineCode = fs.readFileSync('/tmp/translucid-engine.js', 'utf8');

// Validar sintaxe com VM
try {
  new vm.Script(engineCode);
  console.log('✅ [Deploy v11] Sintaxe do motor validada com 100% de sucesso!');
} catch (e) {
  console.error('❌ [Deploy v11] Erro de sintaxe:', e);
  process.exit(1);
}

// 4. Configurar Glass CSS e Injetar no index.html
const glassCss = `
  <style id="translucid-liquid-glass">
    :root, [data-theme], [data-color-scheme] {
      color-scheme: dark !important;
      --dls-surface: transparent !important;
      --dls-sidebar: transparent !important;
      --dls-app-bg: transparent !important;
      --dls-background: transparent !important;
      --dls-canvas: transparent !important;
      --dls-surface-muted: rgba(255, 255, 255, 0.03) !important;
      --v2-background-base: transparent !important;
      --v2-background-surface: rgba(13, 17, 24, 0.40) !important;
      --v2-background-subtle: rgba(255, 255, 255, 0.04) !important;
      --v2-background-card: rgba(18, 24, 34, 0.50) !important;
      --v2-background-sidebar: rgba(10, 14, 20, 0.55) !important;
      --v2-background-elevated: rgba(22, 28, 40, 0.85) !important;
    }

    html, body {
      background: transparent !important;
      background-color: transparent !important;
      overflow: hidden !important;
    }

    #root {
      background: transparent !important;
      background-color: transparent !important;
    }

    aside, [data-slot="sidebar"], nav {
      background: rgba(10, 14, 20, 0.45) !important;
      backdrop-filter: blur(25px) !important;
      -webkit-backdrop-filter: blur(25px) !important;
      border-right: 1px solid rgba(255, 255, 255, 0.08) !important;
    }

    header, [data-slot="titlebar"], [data-slot="header"] {
      background: rgba(10, 14, 20, 0.35) !important;
      backdrop-filter: blur(20px) !important;
      -webkit-backdrop-filter: blur(20px) !important;
      border-bottom: 1px solid rgba(255, 255, 255, 0.08) !important;
    }

    dialog, [role="dialog"], [class*="modal"], [class*="popover"] {
      background: rgba(13, 17, 24, 0.92) !important;
      backdrop-filter: blur(40px) !important;
      -webkit-backdrop-filter: blur(40px) !important;
      border: 1px solid rgba(255, 255, 255, 0.14) !important;
      box-shadow: 0 25px 70px rgba(0, 0, 0, 0.75) !important;
      border-radius: 14px !important;
    }

    .oc-native-titlebar-btn {
      display: inline-flex !important;
      align-items: center !important;
      justify-content: center !important;
      gap: 4px !important;
      height: 22px !important;
      padding: 0 7px !important;
      margin-right: 4px !important;
      border-radius: 5px !important;
      background: rgba(255, 255, 255, 0.08) !important;
      border: 1px solid rgba(255, 255, 255, 0.15) !important;
      cursor: pointer !important;
      -webkit-app-region: no-drag !important;
      z-index: 99999 !important;
      font-size: 11px !important;
      transition: all 0.15s ease !important;
    }
    .oc-native-titlebar-btn:hover {
      background: rgba(255, 255, 255, 0.15) !important;
      border-color: rgba(255, 255, 255, 0.30) !important;
    }
  </style>
`;

console.log('🔧 [Deploy v11] 4. Gravando index.html com script inline e CSS de vidro...');
const htmlPath = path.join(buildDir, 'out/renderer/index.html');
let htmlContent = fs.readFileSync(htmlPath, 'utf8');

htmlContent = htmlContent.replace('</head>', `${glassCss}\n</head>`);
htmlContent = htmlContent.replace('</body>', `<script id="translucid-engine-script">\n${engineCode}\n</script>\n</body>`);
fs.writeFileSync(htmlPath, htmlContent, 'utf8');

// 5. Empacotar e Assinar
console.log('📦 [Deploy v11] 5. Empacotando novo app.asar...');
const destAsar = '/Applications/OpenCode.app/Contents/Resources/app.asar';

try {
  execSync('pkill -9 -f "OpenCode" || true');
} catch(e) {}

execSync(`npx asar pack "${buildDir}" "${destAsar}"`);

console.log('🛡️ [Deploy v11] 6. Assinando aplicativo...');
execSync('xattr -cr /Applications/OpenCode.app || true');
execSync('codesign --force --deep --sign - /Applications/OpenCode.app || true');

console.log('✨ [Deploy v11] Deploy final concluído com sucesso!');
