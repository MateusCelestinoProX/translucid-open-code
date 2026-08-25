// =========================================================
// ULTRA-LEVE & ESTÁVEL: BACKGROUND NATIVO CSS (0% GPU OVERHEAD)
// =========================================================
// Remove completamente qualquer shader WebGL ou render loop
// que causava os glitches de renderização/ghost boxes no scroll.

(function() {
  // Garante que o body use fundo escuro, suave e sem repaints
  document.body.style.background = '#090d16 radial-gradient(circle at 50% 10%, rgba(30, 27, 75, 0.45) 0%, rgba(13, 17, 28, 0.95) 60%, #060911 100%) fixed';
  document.body.style.backgroundAttachment = 'fixed';
})();
