const fs = require('fs');
const path = require('path');

const THEMES = JSON.parse(fs.readFileSync('/tmp/curated-themes.json', 'utf8'));

function createEngineCode() {
  return `(function() {
  'use strict';

  const THEMES_LIST = ${JSON.stringify(THEMES)};
  const EFFECTS_LIST = [
    { id: 'deep-horizon', name: 'Deep Horizon Radiant', icon: '🌅', desc: 'Nébula profunda na base amplificada com feixes de luz e raios de energia irradiando para cima' },
    { id: 'celestial-radiance', name: 'Celestial Radiance', icon: '✨', desc: 'Fonte de luz no canto superior direito irradiando raios elegantes pela tela' },
    { id: 'walking-lava', name: 'Plasma Lava (Orbs)', icon: '🌋', desc: '2 massas fluidas de plasma com gradientes reais caminhando suavemente pela tela' },
    { id: 'cyber-pulse', name: 'Cyber Neon Pulse', icon: '⚡', desc: 'Feixes perimetrais de laser e pulso neon com vibração eletromagnética' },
    { id: 'aurora-waves', name: 'Aurora Liquid Waves', icon: '🌊', desc: 'Ondas ondulantes orgânicas estilo Aurora Boreal no topo e laterais' },
    { id: 'pure-glass', name: 'Pure Crystal Glass', icon: '💎', desc: 'Vidro cristal 100% puro e translúcido (Apple Vibrancy) sem ruído de luz' }
  ];

  const QUICK_PALETTES = [
    { name: 'Cyan Cyber', p: '#00f0ff', s: '#ff007f', a: '#ffe600' },
    { name: 'Neon Emerald', p: '#10b981', s: '#06b6d4', a: '#34d399' },
    { name: 'Purple Dream', p: '#a855f7', s: '#ec4899', a: '#8b5cf6' },
    { name: 'Solar Flare', p: '#f59e0b', s: '#ef4444', a: '#fbbf24' },
    { name: 'Electric Blue', p: '#3b82f6', s: '#8b5cf6', a: '#60a5fa' },
    { name: 'Crimson Blood', p: '#f43f5e', s: '#fb923c', a: '#fda4af' }
  ];

  const KEY_THEME_ID = 'opencode-theme-id';
  const KEY_EFFECT_ID = 'opencode-energy-effect';
  const KEY_SPEED = 'opencode-energy-speed';
  const KEY_INTENSITY = 'opencode-energy-intensity';
  const KEY_CUSTOM_MODE = 'opencode-custom-mode';
  const KEY_CUSTOM_P = 'opencode-custom-primary';
  const KEY_CUSTOM_S = 'opencode-custom-secondary';
  const KEY_CUSTOM_A = 'opencode-custom-accent';

  let activeThemeId = localStorage.getItem(KEY_THEME_ID) || 'poimandres';
  let activeEffectId = localStorage.getItem(KEY_EFFECT_ID) || 'deep-horizon';
  let activeSpeed = localStorage.getItem(KEY_SPEED) || 'medium';
  let activeIntensity = parseFloat(localStorage.getItem(KEY_INTENSITY) || '0.50');
  let isCustomMode = localStorage.getItem(KEY_CUSTOM_MODE) === 'true';
  let customPrimary = localStorage.getItem(KEY_CUSTOM_P) || '#5DE4c7';
  let customSecondary = localStorage.getItem(KEY_CUSTOM_S) || '#f087bd';
  let customAccent = localStorage.getItem(KEY_CUSTOM_A) || '#00CED1';

  function getActiveColors() {
    if (isCustomMode) {
      return {
        id: 'custom',
        name: 'Personalizado',
        primary: customPrimary,
        keyword: customSecondary,
        func: customAccent,
        string: customSecondary,
        comment: '#64748b',
        accents: [customPrimary, customSecondary, customAccent]
      };
    }
    const currentNativeId = document.documentElement.dataset.theme || activeThemeId;
    const found = THEMES_LIST.find(function(t) { return t.id === currentNativeId; });
    return found || THEMES_LIST.find(function(t) { return t.id === activeThemeId; }) || THEMES_LIST[0];
  }

  function getSpeedSec(speed) {
    if (speed === 'low') return 32;
    if (speed === 'high') return 12;
    if (speed === 'turbo') return 6;
    return 18;
  }

  function getOrCreateVisualLayers() {
    const root = document.documentElement;

    let walkingLayer = document.getElementById('translucid-walking-layer');
    if (!walkingLayer) {
      walkingLayer = document.createElement('div');
      walkingLayer.id = 'translucid-walking-layer';
      walkingLayer.style.cssText = 'position: fixed; inset: 0; pointer-events: none; z-index: 99998; overflow: hidden; mix-blend-mode: screen; transition: opacity 0.3s ease;';
      walkingLayer.innerHTML = '<div id="walking-orb-1" class="walking-orb"></div><div id="walking-orb-2" class="walking-orb"></div>';
      root.appendChild(walkingLayer);
    }

    let ambientLayer = document.getElementById('translucid-ambient-glow-layer');
    if (!ambientLayer) {
      ambientLayer = document.createElement('div');
      ambientLayer.id = 'translucid-ambient-glow-layer';
      ambientLayer.style.cssText = 'position: fixed; inset: 0; pointer-events: none; z-index: 99997; overflow: hidden; mix-blend-mode: screen; transition: opacity 0.3s ease;';
      root.appendChild(ambientLayer);
    }

    let pulseLayer = document.getElementById('translucid-pulse-layer');
    if (!pulseLayer) {
      pulseLayer = document.createElement('div');
      pulseLayer.id = 'translucid-pulse-layer';
      pulseLayer.style.cssText = 'position: fixed; inset: 0; pointer-events: none; z-index: 99996; overflow: hidden; mix-blend-mode: screen; transition: opacity 0.3s ease;';
      pulseLayer.innerHTML = '<div id="cyber-pulse-beam-1" class="cyber-beam"></div><div id="cyber-pulse-beam-2" class="cyber-beam"></div>';
      root.appendChild(pulseLayer);
    }

    let celestialLayer = document.getElementById('translucid-celestial-layer');
    if (!celestialLayer) {
      celestialLayer = document.createElement('div');
      celestialLayer.id = 'translucid-celestial-layer';
      celestialLayer.style.cssText = 'position: fixed; inset: 0; pointer-events: none; z-index: 99995; overflow: hidden; mix-blend-mode: screen; transition: opacity 0.3s ease;';
      celestialLayer.innerHTML = '<div id="celestial-source" class="celestial-source"></div><div id="celestial-rays" class="celestial-rays"></div>';
      root.appendChild(celestialLayer);
    }

    let horizonLayer = document.getElementById('translucid-horizon-layer');
    if (!horizonLayer) {
      horizonLayer = document.createElement('div');
      horizonLayer.id = 'translucid-horizon-layer';
      horizonLayer.style.cssText = 'position: fixed; inset: 0; pointer-events: none; z-index: 99994; overflow: hidden; mix-blend-mode: screen; transition: opacity 0.3s ease;';
      horizonLayer.innerHTML = '<div id="horizon-base-glow" class="horizon-base-glow"></div><div id="horizon-radiant-rays" class="horizon-radiant-rays"></div>';
      root.appendChild(horizonLayer);
    }

    return {
      walkingLayer: walkingLayer,
      ambientLayer: ambientLayer,
      pulseLayer: pulseLayer,
      celestialLayer: celestialLayer,
      horizonLayer: horizonLayer,
      orb1: document.getElementById('walking-orb-1'),
      orb2: document.getElementById('walking-orb-2'),
      beam1: document.getElementById('cyber-pulse-beam-1'),
      beam2: document.getElementById('cyber-pulse-beam-2'),
      celestialSource: document.getElementById('celestial-source'),
      celestialRays: document.getElementById('celestial-rays'),
      horizonBaseGlow: document.getElementById('horizon-base-glow'),
      horizonRadiantRays: document.getElementById('horizon-radiant-rays')
    };
  }

  function updateVisualLayers() {
    const colors = getActiveColors();
    const durationSec = getSpeedSec(activeSpeed);
    const layers = getOrCreateVisualLayers();

    document.documentElement.dataset.translucidTheme = colors.id;
    document.documentElement.dataset.translucidEffect = activeEffectId;
    document.documentElement.classList.add('dark');
    document.documentElement.classList.remove('light');
    document.documentElement.style.backgroundColor = 'transparent';

    layers.walkingLayer.style.display = 'none';
    layers.ambientLayer.style.display = 'none';
    layers.pulseLayer.style.display = 'none';
    layers.celestialLayer.style.display = 'none';
    layers.horizonLayer.style.display = 'none';
    layers.ambientLayer.style.background = 'none';
    layers.ambientLayer.style.animation = 'none';

    const primaryColor = colors.primary;
    const secondaryColor = colors.keyword || colors.primary;
    const accentColor = colors.func || colors.primary;

    if (activeEffectId === 'deep-horizon') {
      layers.horizonLayer.style.display = 'block';
      layers.horizonLayer.style.opacity = '1';

      if (layers.horizonBaseGlow && layers.horizonRadiantRays) {
        // Amplified Base Glow
        layers.horizonBaseGlow.style.opacity = (activeIntensity * 1.35).toFixed(2);
        layers.horizonBaseGlow.style.background = 'radial-gradient(ellipse 140% 75% at 50% 120%, ' + primaryColor + ' 0%, ' + secondaryColor + '99 45%, ' + accentColor + '44 70%, transparent 92%)';
        layers.horizonBaseGlow.style.animation = 'horizonBaseGlowPulse ' + (durationSec * 0.7).toFixed(1) + 's ease-in-out infinite alternate';

        // Upward Radiant Rays
        layers.horizonRadiantRays.style.opacity = (activeIntensity * 0.95).toFixed(2);
        layers.horizonRadiantRays.style.background = 'conic-gradient(from 270deg at 50% 100%, transparent 0deg, ' + primaryColor + '55 18deg, transparent 32deg, ' + secondaryColor + '66 45deg, transparent 60deg, ' + accentColor + '44 75deg, transparent 90deg, ' + secondaryColor + '44 105deg, transparent 120deg, ' + primaryColor + '66 135deg, transparent 148deg, ' + accentColor + '44 162deg, transparent 180deg)';
        layers.horizonRadiantRays.style.animation = 'horizonRaysPulse ' + (durationSec * 0.85).toFixed(1) + 's ease-in-out infinite alternate';
      }

    } else if (activeEffectId === 'celestial-radiance') {
      layers.celestialLayer.style.display = 'block';
      layers.celestialLayer.style.opacity = '1';

      if (layers.celestialSource && layers.celestialRays) {
        layers.celestialSource.style.opacity = (activeIntensity * 1.3).toFixed(2);
        layers.celestialSource.style.background = 'radial-gradient(circle at top right, ' + primaryColor + ' 0%, ' + secondaryColor + '99 35%, ' + accentColor + '44 65%, transparent 85%)';
        layers.celestialSource.style.animation = 'celestialSourceGlow ' + (durationSec * 0.6).toFixed(1) + 's ease-in-out infinite alternate';

        layers.celestialRays.style.opacity = (activeIntensity * 0.85).toFixed(2);
        layers.celestialRays.style.background = 'conic-gradient(from 180deg at 100% 0%, transparent 0deg, ' + primaryColor + '44 25deg, transparent 40deg, ' + secondaryColor + '55 60deg, transparent 75deg, ' + accentColor + '33 90deg, transparent 110deg)';
        layers.celestialRays.style.animation = 'celestialRaysPulse ' + (durationSec * 0.8).toFixed(1) + 's ease-in-out infinite alternate';
      }

    } else if (activeEffectId === 'walking-lava') {
      layers.walkingLayer.style.display = 'block';
      layers.walkingLayer.style.opacity = '1';

      if (layers.orb1 && layers.orb2) {
        layers.orb1.style.opacity = (activeIntensity * 1.15).toFixed(2);
        layers.orb2.style.opacity = (activeIntensity * 0.95).toFixed(2);
        layers.orb1.style.background = 'radial-gradient(circle, ' + primaryColor + ' 0%, ' + secondaryColor + '99 44%, transparent 72%)';
        layers.orb2.style.background = 'radial-gradient(circle, ' + accentColor + ' 0%, ' + primaryColor + '99 44%, transparent 72%)';
        
        layers.orb1.style.animation = 'none';
        layers.orb2.style.animation = 'none';
        void layers.orb1.offsetWidth;
        void layers.orb2.offsetWidth;

        layers.orb1.style.animation = 'orbWalkOpposite1 ' + durationSec + 's cubic-bezier(0.42, 0, 0.58, 1) infinite alternate';
        layers.orb2.style.animation = 'orbWalkOpposite2 ' + durationSec + 's cubic-bezier(0.42, 0, 0.58, 1) infinite alternate';
      }

    } else if (activeEffectId === 'cyber-pulse') {
      layers.pulseLayer.style.display = 'block';
      layers.pulseLayer.style.opacity = '1';

      if (layers.beam1 && layers.beam2) {
        layers.beam1.style.background = 'linear-gradient(90deg, transparent, ' + primaryColor + ', transparent)';
        layers.beam1.style.boxShadow = '0 0 35px ' + primaryColor;
        layers.beam1.style.opacity = activeIntensity.toFixed(2);
        layers.beam1.style.animation = 'cyberPulseTop ' + (durationSec * 0.4).toFixed(1) + 's ease-in-out infinite alternate';

        layers.beam2.style.background = 'linear-gradient(180deg, transparent, ' + secondaryColor + ', transparent)';
        layers.beam2.style.boxShadow = '0 0 35px ' + secondaryColor;
        layers.beam2.style.opacity = (activeIntensity * 0.9).toFixed(2);
        layers.beam2.style.animation = 'cyberPulseRight ' + (durationSec * 0.5).toFixed(1) + 's ease-in-out infinite alternate';
      }

    } else if (activeEffectId === 'aurora-waves') {
      layers.ambientLayer.style.display = 'block';
      layers.ambientLayer.style.opacity = '1';
      layers.ambientLayer.style.background = 'radial-gradient(ellipse 110% 65% at 50% -10%, ' + primaryColor + ' 0%, ' + secondaryColor + '77 40%, ' + accentColor + '33 70%, transparent 90%)';
      layers.ambientLayer.style.animation = 'auroraWaveMovement ' + (durationSec * 0.75).toFixed(1) + 's ease-in-out infinite alternate';

    } else if (activeEffectId === 'pure-glass') {
      // Clean pure glass without added lights
    }

    let styleEl = document.getElementById('translucid-dynamic-overrides');
    if (!styleEl) {
      styleEl = document.createElement('style');
      styleEl.id = 'translucid-dynamic-overrides';
      document.documentElement.appendChild(styleEl);
    }

    styleEl.innerHTML = [
      '.walking-orb { position: absolute; border-radius: 50%; filter: blur(80px); -webkit-filter: blur(80px); will-change: transform; pointer-events: none; }',
      '#walking-orb-1 { width: 620px; height: 620px; top: -80px; left: -80px; }',
      '#walking-orb-2 { width: 660px; height: 660px; bottom: -100px; right: -100px; }',
      '.cyber-beam { position: absolute; pointer-events: none; border-radius: 999px; }',
      '#cyber-pulse-beam-1 { top: 0; left: 0; right: 0; height: 4px; }',
      '#cyber-pulse-beam-2 { top: 0; bottom: 0; right: 0; width: 4px; }',
      '.horizon-base-glow { position: absolute; bottom: -40px; left: 50%; transform: translateX(-50%); width: 100vw; height: 480px; filter: blur(65px); -webkit-filter: blur(65px); pointer-events: none; will-change: transform, opacity; }',
      '.horizon-radiant-rays { position: absolute; bottom: 0; left: 0; width: 100vw; height: 100vh; pointer-events: none; filter: blur(40px); -webkit-filter: blur(40px); will-change: opacity, transform; }',
      '.celestial-source { position: absolute; top: -70px; right: -70px; width: 720px; height: 720px; border-radius: 50%; filter: blur(75px); -webkit-filter: blur(75px); pointer-events: none; will-change: opacity, transform; }',
      '.celestial-rays { position: absolute; top: 0; right: 0; width: 100vw; height: 100vh; pointer-events: none; filter: blur(40px); -webkit-filter: blur(40px); will-change: opacity; }',
      '@keyframes horizonBaseGlowPulse { 0% { transform: translateX(-50%) scaleY(0.95); opacity: ' + (activeIntensity * 1.0).toFixed(2) + '; } 50% { transform: translateX(-50%) scaleY(1.30); opacity: ' + (activeIntensity * 1.45).toFixed(2) + '; } 100% { transform: translateX(-50%) scaleY(0.95); opacity: ' + (activeIntensity * 1.0).toFixed(2) + '; } }',
      '@keyframes horizonRaysPulse { 0% { opacity: ' + (activeIntensity * 0.70).toFixed(2) + '; transform: scaleY(0.95); } 50% { opacity: ' + (activeIntensity * 1.25).toFixed(2) + '; transform: scaleY(1.18); } 100% { opacity: ' + (activeIntensity * 0.70).toFixed(2) + '; transform: scaleY(0.95); } }',
      '@keyframes celestialSourceGlow { 0% { transform: scale(0.95); opacity: ' + (activeIntensity * 0.9).toFixed(2) + '; } 50% { transform: scale(1.08); opacity: ' + (activeIntensity * 1.35).toFixed(2) + '; } 100% { transform: scale(0.95); opacity: ' + (activeIntensity * 0.9).toFixed(2) + '; } }',
      '@keyframes celestialRaysPulse { 0% { opacity: ' + (activeIntensity * 0.65).toFixed(2) + '; transform: rotate(0deg); } 50% { opacity: ' + (activeIntensity * 1.1).toFixed(2) + '; transform: rotate(3deg); } 100% { opacity: ' + (activeIntensity * 0.65).toFixed(2) + '; transform: rotate(0deg); } }',
      '@keyframes orbWalkOpposite1 { 0% { transform: translate3d(0px, 0px, 0) scale(1); } 25% { transform: translate3d(440px, 160px, 0) scale(1.22); } 50% { transform: translate3d(820px, -20px, 0) scale(0.92); } 75% { transform: translate3d(320px, 280px, 0) scale(1.20); } 100% { transform: translate3d(640px, 80px, 0) scale(1.06); } }',
      '@keyframes orbWalkOpposite2 { 0% { transform: translate3d(0px, 0px, 0) scale(1); } 25% { transform: translate3d(-460px, -170px, 0) scale(1.22); } 50% { transform: translate3d(-860px, 40px, 0) scale(0.90); } 75% { transform: translate3d(-340px, -300px, 0) scale(1.26); } 100% { transform: translate3d(-660px, -90px, 0) scale(1.03); } }',
      '@keyframes cyberPulseTop { 0% { transform: translateX(-60%); opacity: 0.2; } 50% { opacity: 1; } 100% { transform: translateX(60%); opacity: 0.2; } }',
      '@keyframes cyberPulseRight { 0% { transform: translateY(-60%); opacity: 0.2; } 50% { opacity: 1; } 100% { transform: translateY(60%); opacity: 0.2; } }',
      '@keyframes auroraWaveMovement { 0% { transform: scaleY(1) translateY(0); filter: hue-rotate(-15deg); } 50% { transform: scaleY(1.3) translateY(20px); filter: hue-rotate(15deg); } 100% { transform: scaleY(1) translateY(0); filter: hue-rotate(-15deg); } }',
      ':root, [data-theme], [data-color-scheme] {',
      '  --primary: ' + colors.primary + ' !important;',
      '  --accent: ' + colors.primary + ' !important;',
      '  --dls-accent: ' + colors.primary + ' !important;',
      '  --ring: ' + colors.primary + ' !important;',
      '  --theme-accent: ' + colors.primary + ' !important;',
      '  --sidebar-primary: ' + colors.primary + ' !important;',
      '  --sidebar-ring: ' + colors.primary + ' !important;',
      '}',
      '#root, main, [data-slot="app-root"], .app-container { background: rgba(10, 14, 20, 0.16) !important; }',
      '#opencode-theme-btn, #opencode-dashboard-btn { color: ' + colors.primary + ' !important; }'
    ].join('\\n');
  }

  function applyPresetTheme(themeId) {
    isCustomMode = false;
    activeThemeId = themeId;
    localStorage.setItem(KEY_CUSTOM_MODE, 'false');
    localStorage.setItem(KEY_THEME_ID, themeId);

    try {
      window.dispatchEvent(new StorageEvent('storage', {
        key: KEY_THEME_ID,
        newValue: themeId
      }));
    } catch(e) {}

    document.documentElement.dataset.theme = themeId;
    updateVisualLayers();
    updateModalUI();
  }

  function applyCustomColors(primary, secondary, accent) {
    isCustomMode = true;
    if (primary) customPrimary = primary;
    if (secondary) customSecondary = secondary;
    if (accent) customAccent = accent;

    localStorage.setItem(KEY_CUSTOM_MODE, 'true');
    localStorage.setItem(KEY_CUSTOM_P, customPrimary);
    localStorage.setItem(KEY_CUSTOM_S, customSecondary);
    localStorage.setItem(KEY_CUSTOM_A, customAccent);

    updateVisualLayers();
    updateModalUI();
  }

  function applyEffect(effectId) {
    activeEffectId = effectId;
    localStorage.setItem(KEY_EFFECT_ID, effectId);
    updateVisualLayers();
    updateModalUI();
  }

  function applySpeed(speed) {
    activeSpeed = speed;
    localStorage.setItem(KEY_SPEED, speed);
    updateVisualLayers();
    updateModalUI();
  }

  function applyIntensity(val) {
    activeIntensity = parseFloat(val);
    localStorage.setItem(KEY_INTENSITY, activeIntensity.toString());
    updateVisualLayers();
    updateModalUI();
  }

  function updateModalUI() {
    const modal = document.getElementById('app-theme-picker-modal');
    if (!modal) return;

    const colors = getActiveColors();
    const currentThemeId = document.documentElement.dataset.theme || activeThemeId;

    const tabPresets = modal.querySelector('#tab-btn-presets');
    const tabCustom = modal.querySelector('#tab-btn-custom');
    const viewPresets = modal.querySelector('#view-presets');
    const viewCustom = modal.querySelector('#view-custom');

    if (tabPresets && tabCustom && viewPresets && viewCustom) {
      if (isCustomMode) {
        tabPresets.style.background = 'transparent';
        tabPresets.style.color = '#94a3b8';
        tabCustom.style.background = 'rgba(255, 255, 255, 0.12)';
        tabCustom.style.color = '#ffffff';
        viewPresets.style.display = 'none';
        viewCustom.style.display = 'flex';
      } else {
        tabPresets.style.background = 'rgba(255, 255, 255, 0.12)';
        tabPresets.style.color = '#ffffff';
        tabCustom.style.background = 'transparent';
        tabCustom.style.color = '#94a3b8';
        viewPresets.style.display = 'flex';
        viewCustom.style.display = 'none';
      }
    }

    modal.querySelectorAll('.app-theme-card').forEach(function(card) {
      const isCur = !isCustomMode && card.dataset.themeId === currentThemeId;
      card.style.borderColor = isCur ? colors.primary : 'rgba(255, 255, 255, 0.08)';
      card.style.background = isCur ? 'rgba(255, 255, 255, 0.14)' : 'rgba(255, 255, 255, 0.04)';
      const check = card.querySelector('.theme-check-icon');
      if (check) check.style.display = isCur ? 'block' : 'none';
    });

    modal.querySelectorAll('.app-effect-pill').forEach(function(pill) {
      const isCurEff = pill.dataset.effectId === activeEffectId;
      pill.style.borderColor = isCurEff ? colors.primary : 'rgba(255, 255, 255, 0.08)';
      pill.style.background = isCurEff ? 'rgba(255, 255, 255, 0.16)' : 'rgba(255, 255, 255, 0.04)';
      pill.style.color = isCurEff ? '#ffffff' : '#94a3b8';
    });

    modal.querySelectorAll('.app-speed-btn').forEach(function(btn) {
      const isCurSpd = btn.dataset.speed === activeSpeed;
      btn.style.borderColor = isCurSpd ? colors.primary : 'rgba(255, 255, 255, 0.08)';
      btn.style.background = isCurSpd ? 'rgba(255, 255, 255, 0.18)' : 'rgba(255, 255, 255, 0.04)';
      btn.style.color = isCurSpd ? '#ffffff' : '#94a3b8';
    });

    const intensityVal = modal.querySelector('#intensity-val-label');
    if (intensityVal) intensityVal.textContent = Math.round(activeIntensity * 100) + '%';

    const inputP = modal.querySelector('#custom-color-primary');
    const inputS = modal.querySelector('#custom-color-secondary');
    const inputA = modal.querySelector('#custom-color-accent');
    if (inputP && inputP.value !== customPrimary) inputP.value = customPrimary;
    if (inputS && inputS.value !== customSecondary) inputS.value = customSecondary;
    if (inputA && inputA.value !== customAccent) inputA.value = customAccent;
  }

  function openThemeModal() {
    let modal = document.getElementById('app-theme-picker-modal');
    if (modal) {
      modal.style.display = modal.style.display === 'none' ? 'flex' : 'none';
      if (modal.style.display === 'flex') {
        updateModalUI();
        const input = modal.querySelector('#theme-search-input');
        if (input && !isCustomMode) input.focus();
      }
      return;
    }

    modal = document.createElement('div');
    modal.id = 'app-theme-picker-modal';
    modal.style.cssText = 'position: fixed; top: 46px; right: 20px; width: 430px; max-height: 85vh; background: rgba(13, 17, 24, 0.96); backdrop-filter: blur(45px); -webkit-backdrop-filter: blur(45px); border: 1px solid rgba(255, 255, 255, 0.18); border-radius: 16px; box-shadow: 0 30px 90px rgba(0, 0, 0, 0.85), 0 0 1px rgba(255, 255, 255, 0.3); z-index: 2147483647; display: flex; flex-direction: column; overflow: hidden; font-family: -apple-system, BlinkMacSystemFont, sans-serif; color: #e6edf3; animation: themeModalFadeIn 0.18s cubic-bezier(0.16, 1, 0.3, 1);';

    let keyframes = document.getElementById('theme-picker-keyframes');
    if (!keyframes) {
      keyframes = document.createElement('style');
      keyframes.id = 'theme-picker-keyframes';
      keyframes.innerHTML = '@keyframes themeModalFadeIn { from { opacity: 0; transform: translateY(-8px) scale(0.98); } to { opacity: 1; transform: translateY(0) scale(1); } } .app-theme-card:hover, .app-effect-pill:hover, .app-speed-btn:hover, .quick-palette-chip:hover { background: rgba(255, 255, 255, 0.10) !important; border-color: rgba(255, 255, 255, 0.25) !important; transform: translateY(-1px); }';
      document.documentElement.appendChild(keyframes);
    }

    let h = '';
    h += '<div style="display: flex; align-items: center; justify-content: space-between; padding: 14px 18px; border-bottom: 1px solid rgba(255, 255, 255, 0.08); background: rgba(255, 255, 255, 0.02);">';
    h += '  <div style="display: flex; align-items: center; gap: 8px; font-weight: 600; font-size: 13px;"><span style="font-size: 16px;">⚡</span><span>Controle de Efeitos & Temas (OpenCode)</span></div>';
    h += '  <button id="close-theme-modal-btn" style="background: transparent; border: none; color: #9198a1; font-size: 16px; cursor: pointer; padding: 4px 8px; border-radius: 4px; line-height: 1;">✕</button>';
    h += '</div>';

    h += '<div style="overflow-y: auto; max-height: calc(85vh - 60px); display: flex; flex-direction: column;">';
    
    h += '  <div style="padding: 12px 16px; border-bottom: 1px solid rgba(255, 255, 255, 0.08); background: rgba(0, 0, 0, 0.2);">';
    h += '    <div style="font-size: 10.5px; font-weight: 700; color: #94a3b8; text-transform: uppercase; letter-spacing: 0.6px; margin-bottom: 8px; display: flex; align-items: center; justify-content: space-between;"><span>Efeito de Energia em Tempo Real</span><span style="color: #64748b; font-size: 9.5px; font-weight: 500;">(Metal 120 FPS)</span></div>';
    h += '    <div id="effects-pills-container" style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 6px;"></div>';
    h += '  </div>';

    h += '  <div style="padding: 12px 16px; border-bottom: 1px solid rgba(255, 255, 255, 0.08); display: flex; flex-direction: column; gap: 10px;">';
    h += '    <div style="display: flex; align-items: center; justify-content: space-between; gap: 10px;"><span style="font-size: 11px; font-weight: 600; color: #cbd5e1;">Brilho / Glow:</span><div style="display: flex; align-items: center; gap: 8px; flex: 1; justify-content: flex-end;"><input id="glow-intensity-slider" type="range" min="0.15" max="0.95" step="0.05" value="' + activeIntensity + '" style="width: 130px; cursor: pointer; accent-color: var(--primary);"><span id="intensity-val-label" style="font-size: 11px; font-weight: 600; min-width: 32px; text-align: right; color: var(--primary);">' + Math.round(activeIntensity * 100) + '%</span></div></div>';
    h += '    <div style="display: flex; align-items: center; justify-content: space-between; gap: 8px;"><span style="font-size: 11px; font-weight: 600; color: #cbd5e1;">Velocidade:</span><div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 4px;"><button class="app-speed-btn" data-speed="low" style="padding: 4px 6px; border-radius: 6px; font-size: 10px; cursor: pointer; border: 1px solid rgba(255,255,255,0.08); background: rgba(255,255,255,0.04); color: #94a3b8;">🐢 Calmo</button><button class="app-speed-btn" data-speed="medium" style="padding: 4px 6px; border-radius: 6px; font-size: 10px; cursor: pointer; border: 1px solid rgba(255,255,255,0.08); background: rgba(255,255,255,0.04); color: #94a3b8;">⚡ Fluido</button><button class="app-speed-btn" data-speed="high" style="padding: 4px 6px; border-radius: 6px; font-size: 10px; cursor: pointer; border: 1px solid rgba(255,255,255,0.08); background: rgba(255,255,255,0.04); color: #94a3b8;">🚀 Rápido</button><button class="app-speed-btn" data-speed="turbo" style="padding: 4px 6px; border-radius: 6px; font-size: 10px; cursor: pointer; border: 1px solid rgba(255,255,255,0.08); background: rgba(255,255,255,0.04); color: #94a3b8;">⚡⚡ Turbo</button></div></div>';
    h += '  </div>';

    h += '  <div style="padding: 8px 16px; background: rgba(0, 0, 0, 0.3); border-bottom: 1px solid rgba(255, 255, 255, 0.08); display: flex; gap: 6px;"><button id="tab-btn-presets" style="flex: 1; padding: 6px 10px; border-radius: 6px; border: none; font-size: 11.5px; font-weight: 600; cursor: pointer; transition: all 0.15s ease;">🎨 37 Temas Presets</button><button id="tab-btn-custom" style="flex: 1; padding: 6px 10px; border-radius: 6px; border: none; font-size: 11.5px; font-weight: 600; cursor: pointer; transition: all 0.15s ease;">✨ Cores Personalizadas</button></div>';

    h += '  <div id="view-presets" style="display: flex; flex-direction: column;"><div style="padding: 10px 16px 6px 16px;"><input id="theme-search-input" type="text" placeholder="Filtrar por nome do tema..." style="width: 100%; box-sizing: border-box; padding: 7px 10px; border-radius: 7px; background: rgba(0, 0, 0, 0.35); border: 1px solid rgba(255, 255, 255, 0.12); color: #ffffff; font-size: 11.5px; outline: none;"></div><div id="theme-cards-container" style="padding: 6px 16px 14px 16px; overflow-y: auto; max-height: 240px; display: flex; flex-direction: column; gap: 5px;"></div></div>';

    h += '  <div id="view-custom" style="display: none; flex-direction: column; padding: 12px 16px 16px 16px; gap: 12px;">';
    h += '    <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 8px;">';
    h += '      <div style="display: flex; flex-direction: column; gap: 4px; background: rgba(255,255,255,0.03); padding: 8px; border-radius: 8px; border: 1px solid rgba(255,255,255,0.06);"><span style="font-size: 10px; color: #94a3b8; font-weight: 600;">Luz Principal</span><input id="custom-color-primary" type="color" value="' + customPrimary + '" style="width: 100%; height: 28px; border: none; border-radius: 4px; cursor: pointer; background: transparent;"></div>';
    h += '      <div style="display: flex; flex-direction: column; gap: 4px; background: rgba(255,255,255,0.03); padding: 8px; border-radius: 8px; border: 1px solid rgba(255,255,255,0.06);"><span style="font-size: 10px; color: #94a3b8; font-weight: 600;">Luz Secundária</span><input id="custom-color-secondary" type="color" value="' + customSecondary + '" style="width: 100%; height: 28px; border: none; border-radius: 4px; cursor: pointer; background: transparent;"></div>';
    h += '      <div style="display: flex; flex-direction: column; gap: 4px; background: rgba(255,255,255,0.03); padding: 8px; border-radius: 8px; border: 1px solid rgba(255,255,255,0.06);"><span style="font-size: 10px; color: #94a3b8; font-weight: 600;">Destaque / Accent</span><input id="custom-color-accent" type="color" value="' + customAccent + '" style="width: 100%; height: 28px; border: none; border-radius: 4px; cursor: pointer; background: transparent;"></div>';
    h += '    </div>';

    h += '    <div style="display: flex; flex-direction: column; gap: 6px;"><span style="font-size: 10.5px; font-weight: 600; color: #94a3b8;">Paletas Rápidas Populares:</span><div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 6px;">';
    h += QUICK_PALETTES.map(function(qp) { return '<button class="quick-palette-chip" data-p="' + qp.p + '" data-s="' + qp.s + '" data-a="' + qp.a + '" style="display: flex; align-items: center; gap: 6px; padding: 6px 8px; border-radius: 6px; border: 1px solid rgba(255,255,255,0.08); background: rgba(255,255,255,0.04); cursor: pointer; font-size: 10px; color: #e2e8f0; text-align: left;"><span style="display: flex; gap: 2px;"><span style="display:inline-block; width:6px; height:6px; border-radius:50%; background:' + qp.p + ';"></span><span style="display:inline-block; width:6px; height:6px; border-radius:50%; background:' + qp.s + ';"></span><span style="display:inline-block; width:6px; height:6px; border-radius:50%; background:' + qp.a + ';"></span></span><span>' + qp.name + '</span></button>'; }).join('');
    h += '    </div></div>';
    h += '  </div>';
    h += '</div>';

    modal.innerHTML = h;
    document.documentElement.appendChild(modal);

    const effectsContainer = modal.querySelector('#effects-pills-container');
    EFFECTS_LIST.forEach(function(eff) {
      const pill = document.createElement('button');
      pill.className = 'app-effect-pill';
      pill.dataset.effectId = eff.id;
      pill.style.cssText = 'display: flex; align-items: center; gap: 6px; padding: 7px 10px; border-radius: 8px; font-size: 11px; font-weight: 500; cursor: pointer; transition: all 0.14s ease; text-align: left; outline: none; border: 1px solid rgba(255,255,255,0.08); background: rgba(255,255,255,0.04);';
      pill.title = eff.desc;
      pill.innerHTML = '<span>' + eff.icon + '</span><span style="white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">' + eff.name + '</span>';
      pill.addEventListener('click', function() { applyEffect(eff.id); });
      effectsContainer.appendChild(pill);
    });

    modal.querySelectorAll('.app-speed-btn').forEach(function(btn) {
      btn.addEventListener('click', function() { applySpeed(btn.dataset.speed); });
    });

    const slider = modal.querySelector('#glow-intensity-slider');
    slider.addEventListener('input', function(e) { applyIntensity(e.target.value); });

    const tabPresets = modal.querySelector('#tab-btn-presets');
    const tabCustom = modal.querySelector('#tab-btn-custom');
    tabPresets.addEventListener('click', function() {
      isCustomMode = false;
      applyPresetTheme(activeThemeId);
    });
    tabCustom.addEventListener('click', function() {
      isCustomMode = true;
      applyCustomColors(null, null, null);
    });

    const cpP = modal.querySelector('#custom-color-primary');
    const cpS = modal.querySelector('#custom-color-secondary');
    const cpA = modal.querySelector('#custom-color-accent');
    function onColorChange() {
      applyCustomColors(cpP.value, cpS.value, cpA.value);
    }
    cpP.addEventListener('input', onColorChange);
    cpS.addEventListener('input', onColorChange);
    cpA.addEventListener('input', onColorChange);

    modal.querySelectorAll('.quick-palette-chip').forEach(function(chip) {
      chip.addEventListener('click', function() {
        cpP.value = chip.dataset.p;
        cpS.value = chip.dataset.s;
        cpA.value = chip.dataset.a;
        onColorChange();
      });
    });

    const container = modal.querySelector('#theme-cards-container');
    function renderList(query) {
      query = query || '';
      container.innerHTML = '';
      const filtered = THEMES_LIST.filter(function(t) {
        return t.name.toLowerCase().includes(query.toLowerCase()) || t.id.toLowerCase().includes(query.toLowerCase());
      });
      filtered.forEach(function(theme) {
        const card = document.createElement('div');
        card.className = 'app-theme-card';
        card.dataset.themeId = theme.id;
        card.style.cssText = 'display: flex; align-items: center; justify-content: space-between; padding: 7px 10px; border-radius: 7px; cursor: pointer; transition: all 0.14s ease; border: 1px solid rgba(255,255,255,0.08); background: rgba(255,255,255,0.04);';
        const swatches = (theme.accents || [theme.primary, theme.keyword, theme.func]).map(function(c) {
          return '<span style="display:inline-block; width:8px; height:8px; border-radius:50%; background:' + c + '; box-shadow: 0 0 3px ' + c + '88;"></span>';
        }).join('');
        card.innerHTML = '<div style="display: flex; flex-direction: column; gap: 2px;"><span style="font-size: 11.5px; font-weight: 500; color: #f1f5f9;">' + theme.name + '</span><div style="display: flex; gap: 4px; align-items: center;">' + swatches + '</div></div><div style="display: flex; align-items: center;"><svg class="theme-check-icon" style="display: none; color: ' + theme.primary + '; width: 13px; height: 13px;" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg></div>';
        card.addEventListener('click', function() {
          applyPresetTheme(theme.id);
        });
        container.appendChild(card);
      });
    }
    renderList('');

    const searchInput = modal.querySelector('#theme-search-input');
    searchInput.addEventListener('input', function(e) { renderList(e.target.value); });

    modal.querySelector('#close-theme-modal-btn').addEventListener('click', function() { modal.style.display = 'none'; });
    document.addEventListener('click', function(e) {
      if (modal.style.display !== 'none' && !modal.contains(e.target) && !e.target.closest('#opencode-theme-btn')) {
        modal.style.display = 'none';
      }
    });
    document.addEventListener('keydown', function(e) {
      if (e.key === 'Escape' && modal.style.display !== 'none') { modal.style.display = 'none'; }
    });
    updateModalUI();
  }

  window.openThemePicker = openThemeModal;

  window.addEventListener('keydown', function(e) {
    if ((e.metaKey || e.ctrlKey) && (e.key === 'T' || e.key === 't') && e.shiftKey) {
      e.preventDefault(); e.stopPropagation(); openThemeModal();
    }
    if ((e.metaKey || e.ctrlKey) && (e.key === 'E' || e.key === 'e') && e.shiftKey) {
      e.preventDefault(); e.stopPropagation(); openThemeModal();
    }
  });

  function mountButtons() {
    const headerContainer = document.getElementById('opencode-titlebar-right') || document.querySelector('header') || document.querySelector('[data-tauri-drag-region]') || document.querySelector('[data-slot="titlebar-actions"]');

    if (headerContainer) {
      if (!document.getElementById('opencode-dashboard-btn')) {
        const topDashBtn = document.createElement('button');
        topDashBtn.id = 'opencode-dashboard-btn';
        topDashBtn.type = 'button';
        topDashBtn.title = 'Abrir Control Center (http://localhost:3030/)';
        topDashBtn.className = 'oc-native-titlebar-btn';
        topDashBtn.style.cssText = 'display: inline-flex !important; align-items: center !important; justify-content: center !important; gap: 4px !important; height: 22px !important; padding: 0 8px !important; margin-right: 4px !important; border-radius: 5px !important; background: rgba(255, 255, 255, 0.08) !important; border: 1px solid rgba(255, 255, 255, 0.15) !important; cursor: pointer !important; -webkit-app-region: no-drag !important; z-index: 99999 !important; font-size: 11px !important; color: #cbd5e1 !important;';
        topDashBtn.innerHTML = '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="7" height="9" rx="1"></rect><rect x="14" y="3" width="7" height="5" rx="1"></rect><rect x="14" y="12" width="7" height="9" rx="1"></rect><rect x="3" y="16" width="7" height="5"></rect></svg><span>Dashboard</span>';
        topDashBtn.addEventListener('click', function(e) {
          e.stopPropagation(); e.preventDefault();
          window.open('http://localhost:3030/', '_blank');
        });
        const rightZone = headerContainer.querySelector('.justify-end') || headerContainer.lastElementChild || headerContainer;
        if (rightZone && rightZone !== headerContainer) {
          rightZone.appendChild(topDashBtn);
        } else {
          headerContainer.appendChild(topDashBtn);
        }
      }

      if (!document.getElementById('opencode-theme-btn')) {
        const topThemeBtn = document.createElement('button');
        topThemeBtn.id = 'opencode-theme-btn';
        topThemeBtn.type = 'button';
        topThemeBtn.title = 'Personalizar Efeitos & Cores (Cmd+Shift+T)';
        topThemeBtn.className = 'oc-native-titlebar-btn';
        topThemeBtn.style.cssText = 'display: inline-flex !important; align-items: center !important; justify-content: center !important; gap: 4px !important; height: 22px !important; padding: 0 8px !important; margin-right: 4px !important; border-radius: 5px !important; background: rgba(255, 255, 255, 0.08) !important; border: 1px solid rgba(255, 255, 255, 0.15) !important; cursor: pointer !important; -webkit-app-region: no-drag !important; z-index: 99999 !important; font-size: 11px !important; color: var(--primary, #5DE4c7) !important;';
        topThemeBtn.innerHTML = '<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/></svg><span>Efeitos</span>';
        topThemeBtn.addEventListener('click', function(e) { e.stopPropagation(); e.preventDefault(); openThemeModal(); });

        const rightZone = headerContainer.querySelector('.justify-end') || headerContainer.lastElementChild || headerContainer;
        if (rightZone && rightZone !== headerContainer) {
          rightZone.appendChild(topThemeBtn);
        } else {
          headerContainer.appendChild(topThemeBtn);
        }
      }
    }
  }

  const observer = new MutationObserver(function(mutations) {
    for (var i = 0; i < mutations.length; i++) {
      var mutation = mutations[i];
      if (mutation.type === 'attributes' && mutation.attributeName === 'data-theme') {
        var nativeThemeId = document.documentElement.dataset.theme;
        if (nativeThemeId && !isCustomMode) {
          activeThemeId = nativeThemeId;
          updateVisualLayers();
          updateModalUI();
        }
      }
    }
  });
  observer.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme', 'data-color-scheme'] });

  updateVisualLayers();
  setInterval(function() {
    getOrCreateVisualLayers();
    mountButtons();
  }, 1000);

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function() {
      getOrCreateVisualLayers();
      mountButtons();
    });
  } else {
    getOrCreateVisualLayers();
    mountButtons();
  }
})();
`;
}

const engineCode = createEngineCode();
fs.writeFileSync('/tmp/translucid-engine.js', engineCode, 'utf8');
console.log('✅ Generated /tmp/translucid-engine.js with Deep Horizon Radiant and final effects palette');
