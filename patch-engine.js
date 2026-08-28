const fs = require("fs");
const path = require("path");
const { engineJs, glassCss } = require("./translucid-engine-module.js");

const targetDir = process.argv[2] || "/tmp/opencode-translucid-build";

if (!fs.existsSync(targetDir)) {
  console.error("❌ Diretório alvo não existe:", targetDir);
  process.exit(1);
}

console.log("⚡ [Translucid] Aplicando motor visual v9 Pristine em:", targetDir);

// 1. Configurar oc-theme-preload.js
const preloadPath = path.join(targetDir, "out/renderer/oc-theme-preload.js");
if (fs.existsSync(preloadPath)) {
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
  fs.writeFileSync(preloadPath, preloadCode, "utf8");
  console.log("✅ oc-theme-preload.js configurado.");
}

// 2. Gravar out/renderer/translucid-engine.js
const enginePath = path.join(targetDir, "out/renderer/translucid-engine.js");
fs.writeFileSync(enginePath, engineJs, "utf8");
console.log("✅ out/renderer/translucid-engine.js gravado.");

// 3. Sanitizar e Configurar out/renderer/index.html
const htmlPath = path.join(targetDir, "out/renderer/index.html");
if (fs.existsSync(htmlPath)) {
  let html = fs.readFileSync(htmlPath, "utf8");

  // Limpeza radical de injeções antigas
  html = html.replace(/<style id="translucid-[^>]*>[\s\S]*?<\/style>/gi, "");
  html = html.replace(/<script id="translucid-[^>]*>[\s\S]*?<\/script>/gi, "");
  html = html.replace(/<script id="oc-dashboard-[^>]*>[\s\S]*?<\/script>/gi, "");

  // Injetar glassCss limpo no head
  html = html.replace("</head>", `${glassCss}\n</head>`);

  // Injetar script do motor limpo no body
  html = html.replace("</body>", `<script id="translucid-engine-script" src="./translucid-engine.js"></script>\n</body>`);

  fs.writeFileSync(htmlPath, html, "utf8");
  console.log("✅ out/renderer/index.html sanitizado e configurado.");
}

// 4. Configurar out/main/index.js
const mainJsPath = path.join(targetDir, "out/main/index.js");
if (fs.existsSync(mainJsPath)) {
  let mainJs = fs.readFileSync(mainJsPath, "utf8");

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

  fs.writeFileSync(mainJsPath, mainJs, "utf8");
  console.log("✅ out/main/index.js configurado.");
}

console.log("🎉 [Translucid] Patch aplicado com sucesso total!");
