const fs = require('fs');
const path = require('path');

const targetDir = '/tmp/omniroute-extracted';

// 1. Modificar main.js
const mainJsPath = path.join(targetDir, 'main.js');
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
console.log('✅ OmniRoute main.js configurado com transparent: true e vibrancy: under-window.');

// 2. Modificar preload.js
const preloadJsPath = path.join(targetDir, 'preload.js');
let preloadJs = fs.readFileSync(preloadJsPath, 'utf8');

const liquidGlassInjection = `
function installOmniLiquidGlass() {
  const attach = () => {
    if (!document.head) return;
    const styleId = "omni-translucid-liquid-glass";
    if (document.getElementById(styleId)) return;

    const style = document.createElement("style");
    style.id = styleId;
    style.textContent = \`
      :root, html, body {
        background: transparent !important;
        background-color: transparent !important;
        font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Inter', sans-serif !important;
      }
      #__next, main, section, aside, nav,
      [class*="bg-background"], [class*="bg-zinc-"], [class*="bg-neutral-"], [class*="bg-slate-"], [class*="bg-gray-"], [class*="bg-black"], [class*="bg-[#"], [class*="dark:bg-"] {
        background-color: transparent !important;
        background: transparent !important;
      }
      /* Remove fundos pretos sólidos e grades opacas */
      [class*="grid-pattern"], [class*="bg-grid"], svg[class*="grid"], [style*="background-color: rgb(10, 10, 10)"], [style*="background-color: #0a0a0a"] {
        background-color: transparent !important;
        background: transparent !important;
      }
      /* Painéis laterais e cards translúcidos de vidro líquido */
      header, nav, aside, [class*="card"], [class*="panel"], [class*="border"], table {
        background: rgba(14, 18, 26, 0.35) !important;
        backdrop-filter: blur(20px) saturate(180%) !important;
        -webkit-backdrop-filter: blur(20px) saturate(180%) !important;
        border-color: rgba(255, 255, 255, 0.14) !important;
      }
      /* Textos em branco brilhante com relevo */
      p, span, h1, h2, h3, h4, h5, h6, label, td, th, a, button, div {
        text-shadow: 0 1px 2px rgba(0, 0, 0, 0.70);
      }
      /* Inputs e caixas de seleção com acabamento de vidro */
      input, textarea, select {
        background-color: rgba(0, 0, 0, 0.40) !important;
        border: 1px solid rgba(255, 255, 255, 0.22) !important;
        backdrop-filter: blur(14px) !important;
        color: #ffffff !important;
      }
    \`;
    document.head.appendChild(style);
  };

  if (document.readyState === "loading") {
    window.addEventListener("DOMContentLoaded", attach, { once: true });
  } else {
    attach();
  }
  window.addEventListener("load", attach);
  setInterval(attach, 1000);
}
installOmniLiquidGlass();
`;

preloadJs = liquidGlassInjection + '\n' + preloadJs;
fs.writeFileSync(preloadJsPath, preloadJs, 'utf8');
console.log('✅ OmniRoute preload.js atualizado com injeção Liquid Glass.');
