/**
 * patch-omniroute.js — Translucid Engine para o OmniRoute Desktop
 */
const fs = require('fs');
const path = require('path');

const appPath = '/Applications/OmniRoute.app/Contents/Resources/app';
const mainJsPath = path.join(appPath, 'electron/main.js');
const preloadJsPath = path.join(appPath, 'electron/preload.js');

if (!fs.existsSync(mainJsPath) || !fs.existsSync(preloadJsPath)) {
  console.error('❌ OmniRoute não encontrado em /Applications/OmniRoute.app');
  process.exit(1);
}

// 1. Modificar electron/main.js
let mainJs = fs.readFileSync(mainJsPath, 'utf8');
mainJs = mainJs.replace(
  /backgroundColor:\s*"#0a0a0a",/,
  `backgroundColor: "#00000000",
    transparent: true,
    hasShadow: true,
    opacity: 0.92,`
);
mainJs = mainJs.replace(
  /titleBarStyle:\s*"hiddenInset",\s*trafficLightPosition:\s*\{\s*x:\s*16,\s*y:\s*16\s*\}/,
  `titleBarStyle: "hiddenInset",
      trafficLightPosition: { x: 16, y: 16 },
      vibrancy: "under-window",
      visualEffectState: "active"`
);
fs.writeFileSync(mainJsPath, mainJs, 'utf8');
console.log('✅ OmniRoute electron/main.js configurado com Transparência e Vibrancy.');

// 2. Modificar electron/preload.js (Injetar Liquid Glass CSS)
let preloadJs = fs.readFileSync(preloadJsPath, 'utf8');
const omniGlassCss = `
      :root, html, body {
        background: transparent !important;
        background-color: transparent !important;
        font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Inter', sans-serif !important;
      }
      #__next, main, section, [class*="bg-background"], [class*="bg-zinc-"], [class*="bg-neutral-"], [class*="bg-slate-"], [class*="bg-black"], [class*="bg-[#"] {
        background: transparent !important;
        background-color: transparent !important;
      }
      header, nav, aside, [class*="card"], [class*="panel"], [class*="box"], [class*="container"], table {
        background: rgba(14, 18, 26, 0.35) !important;
        backdrop-filter: blur(24px) saturate(180%) !important;
        -webkit-backdrop-filter: blur(24px) saturate(180%) !important;
        border-color: rgba(255, 255, 255, 0.12) !important;
      }
      p, span, h1, h2, h3, h4, h5, h6, label, td, th, div {
        color: #ffffff !important;
        text-shadow: 0 1px 2px rgba(0, 0, 0, 0.70);
      }
      input, textarea, select, button {
        background-color: rgba(0, 0, 0, 0.35) !important;
        border: 1px solid rgba(255, 255, 255, 0.22) !important;
        backdrop-filter: blur(16px) !important;
        color: #ffffff !important;
      }
`;

if (!preloadJs.includes('omni-translucid-glass-style')) {
  preloadJs = preloadJs.replace(
    /document\.head\.appendChild\(style\);/,
    `style.textContent += \`${omniGlassCss}\`;
    style.id = "omni-translucid-glass-style";
    document.head.appendChild(style);`
  );
  fs.writeFileSync(preloadJsPath, preloadJs, 'utf8');
  console.log('✅ OmniRoute electron/preload.js configurado com Liquid Glass CSS.');
}

console.log('🎉 OmniRoute agora é 100% Translucid Liquid Glass!');
