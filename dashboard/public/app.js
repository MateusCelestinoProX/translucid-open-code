// =========================================================
// OPENCODE MASTER DASHBOARD · PROFESSIONAL CLIENT APP
// =========================================================

let globalState = {
  config: {},
  opencode: {},
  models: [],
  skills: [],
  agents: [],
  mcps: []
};

let telemetryData = {
  totalSessions: 0,
  totalTokens: 0,
  cacheReadTokens: 0,
  sessionsTree: []
};

let logsPayload = {
  counts: { total: 0, success: 0, error: 0, warn: 0, info: 0 },
  logs: []
};

let skillsList = [];
let allDiscoveredAgents = [];
let currentLogCategoryFilter = 'all';
let currentAgentCategoryFilter = 'all';
let currentSkillsViewMode = localStorage.getItem('opencode_skills_view') || 'grid';

let opencodeServerOnline = false;
let sseEventSource = null;
let liveOpencodeEvents = [];

// Injeta classe CSS status-offline
(function injectStyles() {
  const style = document.createElement('style');
  style.textContent = `.metric-tag.status-offline{background:rgba(244,63,94,0.15);color:#fda4af;border-color:rgba(244,63,94,0.35);}`;
  document.head.appendChild(style);
})();

// SVG Icons for Core Agents
const PANTHEON_ICONS = {
  orchestrator: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"></path></svg>`,
  oracle: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><path d="M12 16v-4M12 8h.01"></path></svg>`,
  council: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>`,
  librarian: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path></svg>`,
  explorer: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76"></polygon></svg>`,
  designer: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="13.5" cy="6.5" r=".5" fill="currentColor"></circle><circle cx="17.5" cy="10.5" r=".5" fill="currentColor"></circle><circle cx="8.5" cy="7.5" r=".5" fill="currentColor"></circle><circle cx="6.5" cy="12.5" r=".5" fill="currentColor"></circle><path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 0 1 1.668-1.668h1.996c3.051 0 5.563-2.512 5.563-5.563C22 6.5 17.5 2 12 2z"></path></svg>`,
  fixer: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"></path></svg>`
};

const PANTHEON_METADATA = {
  orchestrator: { name: 'Orchestrator', desc: 'Coordena o grafo de trabalho, planeja e despacha tarefas para os especialistas em background.' },
  oracle: { name: 'Oracle', desc: 'Consultor de raciocínio profundo, algoritmos complexos, arquitetura e debugging avançado.' },
  council: { name: 'Council', desc: 'Executa múltiplos modelos em paralelo e sintetiza uma resposta consensual unificada.' },
  librarian: { name: 'Librarian', desc: 'Pesquisa documentações técnicas atualizadas (Context7) e repositórios GitHub (gh_grep).' },
  explorer: { name: 'Explorer', desc: 'Varredura de repositório, mapeamento de dependências e símbolos.' },
  designer: { name: 'Designer', desc: 'Frontend, CSS moderno, glassmorphism, design systems e interfaces responsivas.' },
  fixer: { name: 'Fixer', desc: 'Correções cirúrgicas de bugs, tipagem, erros de compilação e testes automatizados.' }
};

document.addEventListener('DOMContentLoaded', async () => {
  setupDropZone();
  initThemeWidget();

  await fetchState();
  await fetchActivityData();
  await fetchLogsData();
  await fetchSkillsData();

  setInterval(fetchActivityData, 5000);
  setInterval(fetchLogsData, 6000);
  setInterval(syncStateFromOpencode, 8000);   // novo: sync agents/skills/mcps

  // Integração com API do opencode (porta 4096 via proxy)
  await checkOpencodeServer();
  connectOpencodeSSE();
  setInterval(checkOpencodeServer, 10000);
});

// THEME / PALETTE WIDGET
function initThemeWidget() {
  const saved = localStorage.getItem('opencode_dither_mode') || '0';
  const mode = parseInt(saved, 10);
  const labels = {
    0: 'Cyber Indigo',
    1: 'Chroma Rainbow',
    2: 'Acid Emerald',
    3: 'Nebula Violet',
    4: 'Solar Sunset',
    5: 'Midnight Thunder',
    6: 'Cyberpunk Neon',
    7: 'Crimson Eclipse'
  };

  const labelEl = document.getElementById('currentThemeLabel');
  if (labelEl) labelEl.textContent = labels[mode] || 'Midnight Thunder';

  document.querySelectorAll('.theme-option-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.mode === String(mode));
  });

  window.addEventListener('click', (e) => {
    if (!e.target.closest('.theme-widget-container')) {
      document.getElementById('themeDropdownMenu')?.classList.remove('active');
    }
  });
}

function toggleThemeDropdown(e) {
  e.stopPropagation();
  const menu = document.getElementById('themeDropdownMenu');
  if (menu) menu.classList.toggle('active');
}

function selectDitherTheme(mode, label, btn) {
  if (window.ditherSettings) {
    window.ditherSettings.colorMode = mode;
  }
  localStorage.setItem('opencode_dither_mode', String(mode));

  const labelEl = document.getElementById('currentThemeLabel');
  if (labelEl) labelEl.textContent = label;

  document.querySelectorAll('.theme-option-btn').forEach(b => b.classList.remove('active'));
  if (btn) btn.classList.add('active');

  document.getElementById('themeDropdownMenu')?.classList.remove('active');
  showToast(`Paleta: ${label}`);
}

function switchTab(tabId) {
  document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
  document.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active'));

  const targetContent = document.getElementById(`tab-${tabId}`);
  if (targetContent) targetContent.classList.add('active');

  const activeBtn = Array.from(document.querySelectorAll('.tab-btn')).find(b => 
    b.getAttribute('onclick')?.includes(tabId)
  );
  if (activeBtn) activeBtn.classList.add('active');

  if (tabId === 'logs') fetchLogsData();
  if (tabId === 'skills') fetchSkillsData();
  if (tabId === 'agents') applyAgentsFilter();
  if (tabId === 'mcps') renderMCPsTab();
}

async function fetchState() {
  try {
    const res = await fetch('/api/state');
    globalState = await res.json();
    allDiscoveredAgents = globalState.agents || [];
    renderAll();
  } catch (err) {
    console.error('Erro ao obter estado:', err);
  }
}

async function fetchActivityData() {
  try {
    const res = await fetch('/api/activity');
    telemetryData = await res.json();
    renderTelemetry();
  } catch (err) {
    console.error('Erro ao obter telemetria:', err);
  }
}

async function fetchLogsData() {
  try {
    const res = await fetch('/api/logs');
    logsPayload = await res.json();
    renderLogsUI();
  } catch (err) {
    console.error('Erro ao obter logs:', err);
  }
}

async function fetchSkillsData() {
  try {
    const res = await fetch('/api/skills');
    const data = await res.json();
    skillsList = data.skills || [];
    applySkillsFilter();
  } catch (err) {
    console.error('Erro ao obter skills:', err);
  }
}

async function syncStateFromOpencode() {
  try {
    // Re-fetch state completo (agents, skills, models, mcps)
    const [stateRes, skillsRes, mcpsRes] = await Promise.all([
      fetch('/api/state'),
      fetch('/api/skills'),
      fetch('/api/mcps')
    ]);

    const newState = await stateRes.json();
    const skillsData = await skillsRes.json();
    const mcpsData = await mcpsRes.json();

    // Detectar mudanças em agents
    const newAgentNames = (newState.agents || []).map(a => a.name).sort().join(',');
    const oldAgentNames = allDiscoveredAgents.map(a => a.name).sort().join(',');

    if (newAgentNames !== oldAgentNames) {
      allDiscoveredAgents = newState.agents || [];
      globalState = { ...globalState, ...newState };
      applyAgentsFilter();
      renderQuickbar();
      showSyncToast('Agentes sincronizados com OpenCode');
    }

    // Detectar mudanças em skills
    const newSkillNames = (skillsData.skills || []).map(s => s.name).sort().join(',');
    const oldSkillNames = skillsList.map(s => s.name).sort().join(',');

    if (newSkillNames !== oldSkillNames) {
      skillsList = skillsData.skills || [];
      applySkillsFilter();
      showSyncToast('Skills sincronizadas com OpenCode');
    }

    // Detectar mudanças em MCPs
    const newMcpNames = (mcpsData.mcps || []).map(m => m.name).sort().join(',');
    const oldMcpNames = (globalState.mcps || []).map(m => m.name ? m.name : m).sort().join(',');

    if (newMcpNames !== oldMcpNames) {
      globalState.mcps = mcpsData.mcps || [];
      showSyncToast('MCPs sincronizados com OpenCode');
    }
  } catch (err) {
    console.warn('Sync error:', err);
  }
}

function renderAll() {
  renderQuickbar();
  applyAgentsFilter();
  setSkillsViewMode(currentSkillsViewMode);
}

// HOMEPAGE ACTIVE AGENTS QUICKBAR
function renderQuickbar() {
  const container = document.getElementById('quickbarChipsList');
  if (!container) return;

  const preset = globalState.config.preset || 'omniroute';
  const activePresetConfig = globalState.config.presets?.[preset] || {};

  const chips = [];

  // Core Agents
  for (const [key] of Object.entries(PANTHEON_METADATA)) {
    const model = activePresetConfig[key]?.model || (key === 'council' ? 'Consensus' : 'omniroute/combo/code');
    const shortModel = model.split('/').pop() || model;

    chips.push(`
      <div class="quick-agent-pill" onclick="switchTab('agents')">
        <span class="quick-agent-status"></span>
        <span class="quick-agent-handle">@${key}</span>
        <span class="quick-agent-model">${escapeHtml(shortModel)}</span>
      </div>
    `);
  }

  // Native and Custom Agents
  for (const agent of allDiscoveredAgents) {
    const shortModel = (agent.model || 'omniroute').split('/').pop() || agent.model;
    const isPrimary = agent.mode === 'primary';
    const dotColor = isPrimary ? '#ec4899' : '#06b6d4';

    chips.push(`
      <div class="quick-agent-pill" onclick="openEditAgent('${agent.name}')">
        <span class="quick-agent-status" style="background: ${dotColor}; box-shadow: 0 0 6px ${dotColor};"></span>
        <span class="quick-agent-handle" style="color: ${isPrimary ? '#f472b6' : '#67e8f9'};">@${agent.name}</span>
        <span class="quick-agent-model">${escapeHtml(shortModel)}</span>
      </div>
    `);
  }

  container.innerHTML = chips.join('');
}

// TELEMETRY & HIERARCHICAL SESSIONS TREE
function renderTelemetry() {
  const statSessionsEl = document.getElementById('statSessions');
  const statTokensEl = document.getElementById('statTokens');
  const statCacheEl = document.getElementById('statCache');

  if (statSessionsEl) statSessionsEl.textContent = (telemetryData.totalSessions || 0).toLocaleString();
  if (statTokensEl) statTokensEl.textContent = (telemetryData.totalTokens || 0).toLocaleString();
  if (statCacheEl) statCacheEl.textContent = (telemetryData.cacheReadTokens || 0).toLocaleString();

  const sessionsContainer = document.getElementById('sessionsList');
  if (sessionsContainer) {
    const tree = telemetryData.sessionsTree || [];

    if (tree.length === 0) {
      sessionsContainer.innerHTML = `<div style="color: var(--text-dim); font-size: 13px; font-family: var(--font-mono); text-align: center; padding: 30px;">Nenhuma sessão ativa encontrada.</div>`;
    } else {
      sessionsContainer.innerHTML = tree.map(s => {
        const agentName = s.agent || 'orchestrator';
        const rawTime = s.time_updated || s.time_created || Date.now();
        const formattedDate = new Date(rawTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
        
        let modelDisplay = 'omniroute/combo/code';
        try {
          if (typeof s.model === 'string') {
            if (s.model.startsWith('{')) {
              const p = JSON.parse(s.model);
              modelDisplay = p.id || p.name || s.model;
            } else {
              modelDisplay = s.model;
            }
          } else if (s.model && typeof s.model === 'object') {
            modelDisplay = s.model.id || s.model.name || 'omniroute';
          }
        } catch {}

        const shortModel = modelDisplay.split('/').pop() || modelDisplay;
        const totalTok = ((s.tokens_input || 0) + (s.tokens_output || 0)).toLocaleString();
        const hasSubagents = s.subagents && s.subagents.length > 0;

        return `
          <div class="session-parent-box">
            <div class="session-main-row">
              <div class="session-left">
                <span class="session-agent-badge">@${escapeHtml(agentName)}</span>
                <div style="min-width: 0;">
                  <div class="session-title-text" title="${escapeHtml(s.title || s.slug || 'Sessão')}">${escapeHtml(s.title || s.slug || 'Sessão Principal')}</div>
                  <div class="session-meta-text">${escapeHtml(shortModel)} · ${formattedDate}</div>
                </div>
              </div>
              <div class="session-right">
                <div class="session-tokens">${totalTok} tok</div>
                <div class="session-time">${hasSubagents ? `<span style="color: #34d399; font-weight: 700;">${s.subagents.length} subagentes</span>` : 'Sessão Raiz'}</div>
              </div>
            </div>

            ${hasSubagents ? `
              <div class="subagents-nested-container">
                ${s.subagents.map(sub => {
                  let subModel = 'omniroute/combo/code';
                  try {
                    if (typeof sub.model === 'string') {
                      if (sub.model.startsWith('{')) {
                        const p = JSON.parse(sub.model);
                        subModel = p.id || p.name || sub.model;
                      } else {
                        subModel = sub.model;
                      }
                    } else if (sub.model && typeof sub.model === 'object') {
                      subModel = sub.model.id || sub.model.name || 'omniroute';
                    }
                  } catch {}
                  const subShortModel = subModel.split('/').pop() || subModel;
                  const subTotalTok = ((sub.tokens_input || 0) + (sub.tokens_output || 0)).toLocaleString();

                  return `
                    <div class="subagent-child-item">
                      <div style="display: flex; align-items: center; gap: 8px; min-width: 0;">
                        <span style="color: var(--text-dim); font-size: 11px;">↳</span>
                        <span class="session-agent-badge subagent">@${escapeHtml(sub.agent || 'subagent')}</span>
                        <span style="font-size: 12px; font-weight: 700; color: #f1f5f9; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; max-width: 180px;">${escapeHtml(sub.title || sub.slug || 'Tarefa delegada')}</span>
                      </div>
                      <div style="display: flex; align-items: center; gap: 8px; flex-shrink: 0;">
                        <span style="font-family: var(--font-mono); font-size: 10px; color: var(--text-dim);">${escapeHtml(subShortModel)}</span>
                        <span style="font-family: var(--font-mono); font-size: 11px; font-weight: 800; color: #ffffff;">${subTotalTok} tok</span>
                      </div>
                    </div>
                  `;
                }).join('')}
              </div>
            ` : ''}
          </div>
        `;
      }).join('');
    }
  }

  renderLiveEventsFeed();
}

// SKILLS SYSTEM
function setSkillsViewMode(mode) {
  currentSkillsViewMode = mode;
  localStorage.setItem('opencode_skills_view', mode);

  document.getElementById('btnViewGrid')?.classList.toggle('active', mode === 'grid');
  document.getElementById('btnViewList')?.classList.toggle('active', mode === 'list');

  const gridEl = document.getElementById('skillsCardsGrid');
  const listEl = document.getElementById('skillsListContainer');

  if (mode === 'grid') {
    if (gridEl) gridEl.style.display = 'grid';
    if (listEl) listEl.style.display = 'none';
  } else {
    if (gridEl) gridEl.style.display = 'none';
    if (listEl) listEl.style.display = 'flex';
  }

  applySkillsFilter();
}

function applySkillsFilter() {
  const query = (document.getElementById('skillsSearchInput')?.value || '').toLowerCase().trim();
  const filtered = query
    ? skillsList.filter(s => s.name.toLowerCase().includes(query) || (s.description && s.description.toLowerCase().includes(query)))
    : skillsList;

  const countEl = document.getElementById('skillsTotalCount');
  if (countEl) countEl.textContent = `${filtered.length} Habilidades`;

  renderSkillsGrid(filtered);
  renderSkillsList(filtered);
}

function renderSkillsGrid(items = skillsList) {
  const container = document.getElementById('skillsCardsGrid');
  if (!container) return;

  if (items.length === 0) {
    container.innerHTML = `<div style="color: var(--text-dim); font-family: var(--font-mono); text-align: center; grid-column: 1 / -1; padding: 40px;">Nenhuma habilidade encontrada para a busca.</div>`;
    return;
  }

  container.innerHTML = items.map(skill => {
    return `
      <div class="skill-card glass-card">
        <div>
          <div class="skill-card-top">
            <div class="skill-avatar-box">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polyline points="4 17 10 11 4 5"></polyline>
                <line x1="12" y1="19" x2="20" y2="19"></line>
              </svg>
            </div>
            <div>
              <div class="skill-name-row">
                <h3>${escapeHtml(skill.name)}</h3>
                <span class="tag-core">ACTIVE</span>
              </div>
              <p class="skill-card-desc" title="${escapeHtml(skill.description)}">${escapeHtml(skill.description)}</p>
            </div>
          </div>

          <div class="skill-path-box">
            ~/.config/opencode/skills/${escapeHtml(skill.name)}/SKILL.md
          </div>
        </div>

        <div class="skill-card-footer">
          <button class="btn-secondary" onclick="openEditSkillModal('${escapeHtml(skill.name)}')">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M12 20h9M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path>
            </svg>
            Editar Markdown
          </button>
          <button class="btn-remove-agent" onclick="deleteSkillByName('${escapeHtml(skill.name)}')">
            Excluir
          </button>
        </div>
      </div>
    `;
  }).join('');
}

function renderSkillsList(items = skillsList) {
  const container = document.getElementById('skillsListContainer');
  if (!container) return;

  if (items.length === 0) {
    container.innerHTML = `<div style="color: var(--text-dim); font-family: var(--font-mono); text-align: center; padding: 20px;">Nenhuma habilidade encontrada.</div>`;
    return;
  }

  container.innerHTML = items.map(skill => {
    return `
      <div class="skill-list-row">
        <div class="skill-list-left">
          <div class="skill-avatar-box" style="width: 32px; height: 32px;">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <polyline points="4 17 10 11 4 5"></polyline>
              <line x1="12" y1="19" x2="20" y2="19"></line>
            </svg>
          </div>
          <div class="skill-list-info">
            <div style="display: flex; align-items: center; gap: 8px;">
              <span class="skill-list-title">${escapeHtml(skill.name)}</span>
              <span class="tag-core">ACTIVE</span>
            </div>
            <div class="skill-list-desc" title="${escapeHtml(skill.description)}">${escapeHtml(skill.description)}</div>
          </div>
        </div>

        <div style="display: flex; align-items: center; gap: 8px;">
          <button class="btn-secondary" style="padding: 4px 10px; font-size: 11px;" onclick="openEditSkillModal('${escapeHtml(skill.name)}')">
            Editar
          </button>
          <button class="btn-remove-agent" style="padding: 4px 8px; font-size: 11px;" onclick="deleteSkillByName('${escapeHtml(skill.name)}')">
            Excluir
          </button>
        </div>
      </div>
    `;
  }).join('');
}

function openCreateSkillModal() {
  document.getElementById('skillModalTitle').textContent = 'Nova Habilidade (SKILL.md)';
  document.getElementById('modalSkillName').value = '';
  document.getElementById('modalSkillName').disabled = false;
  document.getElementById('modalSkillDesc').value = '';
  document.getElementById('modalSkillContent').value = '';

  document.getElementById('skillModal').style.display = 'flex';
}

function openEditSkillModal(skillName) {
  const skill = skillsList.find(s => s.name === skillName);
  if (!skill) return;

  document.getElementById('skillModalTitle').textContent = `Editar: ${skillName}`;
  document.getElementById('modalSkillName').value = skill.name;
  document.getElementById('modalSkillName').disabled = true;
  document.getElementById('modalSkillDesc').value = skill.description || '';
  document.getElementById('modalSkillContent').value = skill.content || '';

  document.getElementById('skillModal').style.display = 'flex';
}

function closeSkillModal() {
  document.getElementById('skillModal').style.display = 'none';
}

function insertSkillTemplate() {
  const name = document.getElementById('modalSkillName').value.trim() || 'custom-skill';
  const desc = document.getElementById('modalSkillDesc').value.trim() || 'Diretrizes especializadas para execuções precisas.';

  const template = `---
name: ${name}
description: ${desc}
---

# ${name.toUpperCase()}

## Objetivo
Descreva o escopo e as situações em que esta habilidade deve ser carregada.

## Princípios Obrigatórios
1. Preservar o comportamento e as convenções do repositório.
2. Aplicar modificações com escopo cirúrgico e modular.
3. Validar a integridade através de testes antes da conclusão.

## Procedimento de Execução
1. Inspecionar o contexto e identificar arquivos dependentes.
2. Executar alterações preservando tipagem e sintaxe.
3. Executar verificações de integridade.`;

  document.getElementById('modalSkillContent').value = template;
}

function handleSkillFileUpload(event) {
  const file = event.target.files?.[0];
  if (!file) return;
  readFileIntoSkillEditor(file);
}

function readFileIntoSkillEditor(file) {
  const reader = new FileReader();
  reader.onload = (e) => {
    const text = e.target?.result;
    if (typeof text === 'string') {
      document.getElementById('modalSkillContent').value = text;

      const baseName = file.name.replace(/\.(md|markdown|txt)$/i, '').toLowerCase().replace(/[^a-z0-9-_]/g, '-');
      if (!document.getElementById('modalSkillName').value) {
        document.getElementById('modalSkillName').value = baseName;
      }

      const descMatch = text.match(/description:\s*(.*?)(?:\n---|\n[a-z_]+:)/s) || text.match(/description:\s*(.*)/);
      if (descMatch && descMatch[1] && !document.getElementById('modalSkillDesc').value) {
        document.getElementById('modalSkillDesc').value = descMatch[1].trim().replace(/\n/g, ' ');
      }

      showToast(`Arquivo "${file.name}" importado.`);
    }
  };
  reader.readAsText(file);
}

function setupDropZone() {
  const dropZone = document.getElementById('skillDropZone');
  if (!dropZone) return;

  ['dragenter', 'dragover'].forEach(eventName => {
    dropZone.addEventListener(eventName, (e) => {
      e.preventDefault();
      dropZone.classList.add('dragover');
    }, false);
  });

  ['dragleave', 'drop'].forEach(eventName => {
    dropZone.addEventListener(eventName, (e) => {
      e.preventDefault();
      dropZone.classList.remove('dragover');
    }, false);
  });

  dropZone.addEventListener('drop', (e) => {
    const dt = e.dataTransfer;
    const files = dt?.files;
    if (files && files.length > 0) {
      readFileIntoSkillEditor(files[0]);
    }
  }, false);
}

async function submitSkillForm() {
  const name = document.getElementById('modalSkillName').value.trim().toLowerCase().replace(/[^a-z0-9-_]/g, '-');
  const description = document.getElementById('modalSkillDesc').value.trim();
  const content = document.getElementById('modalSkillContent').value.trim();

  if (!name || !content) {
    alert('Nome e Conteúdo são obrigatórios.');
    return;
  }

  try {
    const res = await fetch('/api/skills', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, description, content })
    });

    if (res.ok) {
      closeSkillModal();
      showToast(`Habilidade "${name}" registrada.`);
      await fetchSkillsData();
      await fetchState();
    } else {
      const err = await res.json();
      alert('Erro: ' + err.error);
    }
  } catch (err) {
    alert('Falha de rede: ' + err.message);
  }
}

async function deleteSkillByName(name) {
  const confirmed = await showConfirmDialog({
    title: 'Excluir Habilidade',
    message: `Deseja remover permanentemente a habilidade <strong style="color:#fff;">"${escapeHtml(name)}"</strong> do OpenCode?`,
    confirmText: 'Excluir Habilidade',
    isDanger: true
  });
  if (!confirmed) return;
  try {
    const res = await fetch(`/api/skills/${name}`, { method: 'DELETE' });
    if (res.ok) {
      showToast(`Habilidade "${name}" excluída.`);
      await fetchSkillsData();
      await fetchState();
    }
  } catch (err) {
    showToast('Erro ao excluir: ' + err.message);
  }
}

// AGENTS STUDIO & COMPLETE DISCOVERY
function setAgentCategoryFilter(category) {
  currentAgentCategoryFilter = category;

  document.querySelectorAll('#filterAgentAll, #filterAgentCore, #filterAgentNative, #filterAgentCustom').forEach(pill => pill.classList.remove('active'));
  
  const mapBtn = {
    all: 'filterAgentAll',
    core: 'filterAgentCore',
    native: 'filterAgentNative',
    custom: 'filterAgentCustom'
  };

  const activeBtn = document.getElementById(mapBtn[category]);
  if (activeBtn) activeBtn.classList.add('active');

  applyAgentsFilter();
}

function applyAgentsFilter() {
  const query = (document.getElementById('agentsSearchInput')?.value || '').toLowerCase().trim();

  const totalCore = Object.keys(PANTHEON_METADATA).length;
  const nativeList = allDiscoveredAgents.filter(a => a.type === 'native_md');
  const customList = allDiscoveredAgents.filter(a => a.type !== 'native_md');

  document.getElementById('countAgentsAll').textContent = totalCore + allDiscoveredAgents.length;
  document.getElementById('countAgentsCore').textContent = totalCore;
  document.getElementById('countAgentsNative').textContent = nativeList.length;
  document.getElementById('countAgentsCustom').textContent = customList.length;

  renderAgentGrid(query);
}

function renderAgentGrid(query = '') {
  const grid = document.getElementById('agentCardsGrid');
  if (!grid) return;

  const preset = globalState.config.preset || 'omniroute';
  const activePresetConfig = globalState.config.presets?.[preset] || {};

  grid.innerHTML = '';

  // 1. Render Core Pantheon Agents
  if (currentAgentCategoryFilter === 'all' || currentAgentCategoryFilter === 'core') {
    for (const [key, meta] of Object.entries(PANTHEON_METADATA)) {
      if (query && !key.toLowerCase().includes(query) && !meta.desc.toLowerCase().includes(query)) {
        continue;
      }

      const agentConf = activePresetConfig[key] || {};
      const model = agentConf.model || (key === 'council' ? 'Multi-Model Consensus' : 'omniroute/combo/code');
      const icon = PANTHEON_ICONS[key] || PANTHEON_ICONS.orchestrator;

      const card = document.createElement('div');
      card.className = 'agent-card glass-card';
      card.innerHTML = `
        <div>
          <div class="agent-card-top">
            <div class="agent-avatar-box">${icon}</div>
            <div>
              <div class="agent-name-row">
                <h3>@${key}</h3>
                <span class="tag-core">CORE</span>
              </div>
              <p class="agent-card-desc">${meta.desc}</p>
            </div>
          </div>

          <div class="agent-model-container">
            <div class="model-header-label">MODELO LLM</div>
            <div class="model-value-name">${escapeHtml(model)}</div>
          </div>
        </div>

        <div class="agent-card-footer">
          <span style="font-family: var(--font-mono); font-size: 11px; color: #10b981; font-weight: 700;">● ONLINE</span>
          <button class="btn-secondary" onclick="openEditCoreAgent('${key}', '${escapeHtml(model)}')">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M12 20h9M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path>
            </svg>
            Editar Modelo
          </button>
        </div>
      `;
      grid.appendChild(card);
    }
  }

  // 2. Render Discovered Native (.md) and Custom Agents
  for (const agent of allDiscoveredAgents) {
    const isNative = agent.type === 'native_md';

    if (currentAgentCategoryFilter === 'core') continue;
    if (currentAgentCategoryFilter === 'native' && !isNative) continue;
    if (currentAgentCategoryFilter === 'custom' && isNative) continue;

    if (query && !agent.name.toLowerCase().includes(query) && !(agent.description && agent.description.toLowerCase().includes(query))) {
      continue;
    }

    const isPrimary = agent.mode === 'primary';
    const tagClass = isNative ? (isPrimary ? 'tag-primary-agent' : 'tag-native') : 'tag-custom';
    const tagLabel = isNative ? (isPrimary ? 'NATIVE PRIMARY' : 'NATIVE SUBAGENT') : 'CUSTOM';

    const card = document.createElement('div');
    card.className = 'agent-card glass-card';
    card.innerHTML = `
      <div>
        <div class="agent-card-top">
          <div class="agent-avatar-box" style="${isPrimary ? 'background: rgba(236, 72, 153, 0.15); color: #f472b6;' : 'background: rgba(6, 182, 212, 0.15); color: #22d3ee;'}">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon>
            </svg>
          </div>
          <div>
            <div class="agent-name-row">
              <h3>@${escapeHtml(agent.name)}</h3>
              <span class="${tagClass}">${tagLabel}</span>
            </div>
            <p class="agent-card-desc">${escapeHtml(agent.description || 'Agente especializado.')}</p>
          </div>
        </div>

        <div class="agent-model-container">
          <div class="model-header-label">MODELO LLM</div>
          <div class="model-value-name">${escapeHtml(agent.model || 'omniroute/combo/code')}</div>
        </div>

        <div class="skill-path-box">
          ${isNative ? `~/.config/opencode/agents/${escapeHtml(agent.name)}.md` : `Configuração OpenCode`}
        </div>

        ${agent.skills && agent.skills.length > 0 ? `
          <div class="skills-pill-row">
            ${agent.skills.map(s => `<span class="skill-chip">${escapeHtml(s)}</span>`).join('')}
          </div>
        ` : ''}
      </div>

      <div class="agent-card-footer">
        <button class="btn-secondary" onclick="openEditAgent('${escapeHtml(agent.name)}')">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M12 20h9M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path>
          </svg>
          Editar (.md)
        </button>
        <button class="btn-remove-agent" onclick="deleteAgentByName('${escapeHtml(agent.name)}')">Excluir</button>
      </div>
    `;
    grid.appendChild(card);
  }

  if (grid.children.length === 0) {
    grid.innerHTML = `<div style="color: var(--text-dim); font-family: var(--font-mono); text-align: center; grid-column: 1 / -1; padding: 40px;">Nenhum agente encontrado para os filtros selecionados.</div>`;
  }
}

function populateModalOptions() {
  const select = document.getElementById('modalAgentModel');
  if (select) {
    select.innerHTML = globalState.models.map(m => 
      `<option value="${m.id}">${m.name ? `${m.name} (${m.id})` : m.id}</option>`
    ).join('');
  }

  const skillsBox = document.getElementById('modalSkillsContainer');
  if (skillsBox) {
    skillsBox.innerHTML = globalState.skills.map(s => `
      <label class="skill-checkbox-label">
        <input type="checkbox" value="${s}" name="modalSkills">
        <span>${s}</span>
      </label>
    `).join('');
  }
}

function openCreateAgentModal() {
  populateModalOptions();

  document.getElementById('modalAgentType').value = 'native_md';
  document.getElementById('modalTitle').textContent = 'Criar Agente Nativo (.md)';

  document.getElementById('modalAgentName').value = '';
  document.getElementById('modalAgentName').disabled = false;
  document.getElementById('modalAgentMode').value = 'subagent';
  document.getElementById('modalAgentDesc').value = '';
  document.getElementById('modalAgentFilePath').textContent = '~/.config/opencode/agents/<handle>.md';

  const defaultPrompt = `# Novo Agente Especialista\n\n<Role>\nVocê é um especialista focado em...\n</Role>\n\n## Diretrizes\n1. Siga as convenções do projeto.\n2. Execute tarefas de forma cirúrgica.`;
  document.getElementById('modalAgentPrompt').value = defaultPrompt;

  document.getElementById('fieldMetaRow').style.display = 'grid';
  document.getElementById('fieldDescGroup').style.display = 'block';
  document.getElementById('fieldPromptGroup').style.display = 'block';
  document.getElementById('fieldSkillsGroup').style.display = 'block';

  document.getElementById('agentModal').style.display = 'flex';
}

function openEditCoreAgent(agentName, currentModel) {
  populateModalOptions();

  document.getElementById('modalAgentType').value = 'core';
  document.getElementById('modalTitle').textContent = `Editar @${agentName}`;

  document.getElementById('modalAgentName').value = agentName;
  document.getElementById('modalAgentName').disabled = true;

  const select = document.getElementById('modalAgentModel');
  if (select) select.value = currentModel;

  document.getElementById('fieldMetaRow').style.display = 'none';
  document.getElementById('fieldDescGroup').style.display = 'none';
  document.getElementById('fieldPromptGroup').style.display = 'none';
  document.getElementById('fieldSkillsGroup').style.display = 'none';

  document.getElementById('agentModal').style.display = 'flex';
}

function openEditAgent(agentName) {
  populateModalOptions();

  const agent = allDiscoveredAgents.find(a => a.name === agentName);
  if (!agent) return;

  document.getElementById('modalAgentType').value = agent.type || 'native_md';
  document.getElementById('modalTitle').textContent = `Editar Agente @${agentName} (.md)`;

  document.getElementById('modalAgentName').value = agent.name;
  document.getElementById('modalAgentName').disabled = true;

  const select = document.getElementById('modalAgentModel');
  if (select) select.value = agent.model || 'omniroute/combo/code';

  document.getElementById('modalAgentMode').value = agent.mode || 'subagent';
  document.getElementById('modalAgentDesc').value = agent.description || '';
  document.getElementById('modalAgentFilePath').textContent = agent.path || `~/.config/opencode/agents/${agent.name}.md`;
  document.getElementById('modalAgentPrompt').value = agent.prompt || '';

  const skills = agent.skills || [];
  document.querySelectorAll('input[name="modalSkills"]').forEach(cb => {
    cb.checked = skills.includes(cb.value);
  });

  document.getElementById('fieldMetaRow').style.display = 'grid';
  document.getElementById('fieldDescGroup').style.display = 'block';
  document.getElementById('fieldPromptGroup').style.display = 'block';
  document.getElementById('fieldSkillsGroup').style.display = 'block';

  document.getElementById('agentModal').style.display = 'flex';
}

function closeAgentModal() {
  document.getElementById('agentModal').style.display = 'none';
}

async function submitAgentForm() {
  const type = document.getElementById('modalAgentType').value;
  const name = document.getElementById('modalAgentName').value.trim().toLowerCase().replace('@', '');
  const model = document.getElementById('modalAgentModel').value;

  if (!name || !model) {
    alert('Nome e Modelo são obrigatórios.');
    return;
  }

  if (type === 'core') {
    try {
      const res = await fetch('/api/agent/core', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, model })
      });

      if (res.ok) {
        closeAgentModal();
        showToast(`Modelo de @${name} atualizado.`);
        await fetchState();
      } else {
        const err = await res.json();
        alert('Erro: ' + err.error);
      }
    } catch (err) {
      alert('Falha de rede: ' + err.message);
    }
  } else {
    const description = document.getElementById('modalAgentDesc').value.trim();
    const mode = document.getElementById('modalAgentMode').value;
    const prompt = document.getElementById('modalAgentPrompt').value.trim();
    const selectedSkills = Array.from(document.querySelectorAll('input[name="modalSkills"]:checked')).map(cb => cb.value);

    try {
      const res = await fetch('/api/agent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          model,
          description,
          mode,
          prompt,
          skills: selectedSkills
        })
      });

      if (res.ok) {
        closeAgentModal();
        showToast(`Agente @${name} gravado no OpenCode (.md)!`);
        await fetchState();
      } else {
        const err = await res.json();
        alert('Erro: ' + err.error);
      }
    } catch (err) {
      alert('Falha de rede: ' + err.message);
    }
  }
}

async function deleteAgentByName(name) {
  const confirmed = await showConfirmDialog({
    title: 'Excluir Agente Nativo',
    message: `Deseja remover permanentemente o agente <strong style="color:#fff;">@${escapeHtml(name)}</strong> do OpenCode (.md)?`,
    confirmText: 'Excluir Agente',
    isDanger: true
  });
  if (!confirmed) return;
  try {
    const res = await fetch(`/api/agent/${name}`, { method: 'DELETE' });
    if (res.ok) {
      showToast(`Agente @${name} excluído.`);
      await fetchState();
    }
  } catch (err) {
    showToast('Erro ao excluir: ' + err.message);
  }
}

// LOGS SYSTEM
function setLogCategoryFilter(category) {
  currentLogCategoryFilter = category;

  document.querySelectorAll('.filter-pill').forEach(pill => pill.classList.remove('active'));
  const activePill = Array.from(document.querySelectorAll('.filter-pill')).find(p => 
    p.getAttribute('onclick')?.includes(category)
  );
  if (activePill) activePill.classList.add('active');

  applyLogFilters();
}

function renderLogsUI() {
  document.getElementById('countAll').textContent = logsPayload.counts.total || 0;
  document.getElementById('countSuccess').textContent = logsPayload.counts.success || 0;
  document.getElementById('countError').textContent = logsPayload.counts.error || 0;
  document.getElementById('countWarn').textContent = logsPayload.counts.warn || 0;
  document.getElementById('countInfo').textContent = logsPayload.counts.info || 0;

  const agentFilter = document.getElementById('logAgentFilterSelect');
  if (agentFilter) {
    const currentVal = agentFilter.value;
    const uniqueAgents = Array.from(new Set(logsPayload.logs.map(l => l.agent).filter(Boolean)));
    agentFilter.innerHTML = `<option value="all">Todos os Agentes</option>` + uniqueAgents.map(a => 
      `<option value="${a}" ${a === currentVal ? 'selected' : ''}>@${a}</option>`
    ).join('');
  }

  applyLogFilters();
}

function applyLogFilters() {
  const container = document.getElementById('fullLogsContainer');
  if (!container) return;

  const searchText = (document.getElementById('logSearchInput')?.value || '').toLowerCase().trim();
  const selectedAgent = document.getElementById('logAgentFilterSelect')?.value || 'all';

  let filtered = logsPayload.logs;

  if (currentLogCategoryFilter !== 'all') {
    filtered = filtered.filter(l => l.category === currentLogCategoryFilter);
  }

  if (selectedAgent !== 'all') {
    filtered = filtered.filter(l => l.agent === selectedAgent);
  }

  if (searchText) {
    filtered = filtered.filter(l => 
      l.message.toLowerCase().includes(searchText) ||
      l.agent.toLowerCase().includes(searchText) ||
      (l.sessionTitle && l.sessionTitle.toLowerCase().includes(searchText))
    );
  }

  if (filtered.length === 0) {
    container.innerHTML = `<div style="color: var(--text-dim); font-size: 13px; font-family: var(--font-mono); text-align: center; padding: 40px;">[0] Nenhum evento registrado para estes filtros.</div>`;
    return;
  }

  container.innerHTML = filtered.map(renderStructuredLogItem).join('');
}

function renderStructuredLogItem(log) {
  const timeStr = new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  const categoryTitles = {
    success: 'SUCCESS',
    error: 'ERROR',
    warn: 'WARN',
    info: 'EXEC'
  };

  const badgeText = categoryTitles[log.category] || 'LOG';

  return `
    <div class="log-item-card category-${log.category}">
      <div class="log-item-header">
        <div style="display: flex; align-items: center; gap: 8px;">
          <span class="log-category-badge">${badgeText}</span>
          <span style="font-weight: 700; font-size: 12px; font-family: var(--font-mono); color: #ffffff;">@${escapeHtml(log.agent)}</span>
          ${log.sessionTitle ? `<span style="font-size: 11px; color: var(--text-dim); font-family: var(--font-mono);">· ${escapeHtml(log.sessionTitle)}</span>` : ''}
        </div>
        <div class="log-meta-info">
          <span>${timeStr}</span>
        </div>
      </div>
      <div class="log-message-body">${escapeHtml(log.message)}</div>
    </div>
  `;
}

function renderSimpleLogItem(log) {
  const timeStr = new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  const categoryPill = {
    success: 'SUCCESS',
    error: 'ERR',
    warn: 'WARN',
    info: 'EXEC'
  }[log.category] || 'LOG';

  return `
    <div class="event-card">
      <div class="event-header">
        <span class="event-type-badge">${categoryPill} · @${escapeHtml(log.agent)}</span>
        <span class="event-time">${timeStr}</span>
      </div>
      <div class="event-snippet">${escapeHtml(log.message.slice(0, 180))}</div>
    </div>
  `;
}

function showToast(msg) {
  const toast = document.getElementById('toastPopup');
  toast.textContent = msg;
  toast.style.display = 'block';
  setTimeout(() => { toast.style.display = 'none'; }, 3000);
}

function showConfirmDialog({ title, message, confirmText = 'Confirmar', isDanger = true }) {
  return new Promise(resolve => {
    const modal = document.getElementById('confirmModal');
    const titleEl = document.getElementById('confirmModalTitle');
    const msgEl = document.getElementById('confirmModalMessage');
    const okBtn = document.getElementById('confirmModalOkBtn');
    const cancelBtn = document.getElementById('confirmModalCancelBtn');

    if (!modal || !okBtn || !cancelBtn) {
      resolve(window.confirm(message));
      return;
    }

    titleEl.textContent = title || 'Confirmar Exclusão';
    msgEl.innerHTML = message;
    okBtn.textContent = confirmText;

    if (isDanger) {
      okBtn.className = 'btn-remove-agent';
      okBtn.style.background = 'var(--rose)';
      okBtn.style.color = '#fff';
      okBtn.style.boxShadow = '0 4px 15px rgba(244,63,94,0.4)';
    } else {
      okBtn.className = 'btn-cta';
      okBtn.style.background = 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)';
      okBtn.style.color = '#fff';
      okBtn.style.boxShadow = '0 4px 15px rgba(99,102,241,0.4)';
    }

    modal.style.display = 'flex';

    function cleanup(result) {
      modal.style.display = 'none';
      okBtn.removeEventListener('click', onOk);
      cancelBtn.removeEventListener('click', onCancel);
      modal.removeEventListener('click', onBackdrop);
      window.removeEventListener('keydown', onKey);
      resolve(result);
    }

    function onOk() { cleanup(true); }
    function onCancel() { cleanup(false); }
    function onBackdrop(e) { if (e.target === modal) cleanup(false); }
    function onKey(e) { if (e.key === 'Escape') cleanup(false); }

    okBtn.addEventListener('click', onOk);
    cancelBtn.addEventListener('click', onCancel);
    modal.addEventListener('click', onBackdrop);
    window.addEventListener('keydown', onKey);
  });
}

function showSyncToast(msg) {
  let el = document.getElementById('syncToastEl');
  if (!el) {
    el = document.createElement('div');
    el.id = 'syncToastEl';
    el.style.cssText = [
      'position:fixed', 'top:16px', 'right:16px',
      'background:rgba(16,185,129,0.15)', 'border:1px solid rgba(16,185,129,0.4)',
      'color:#34d399', 'padding:6px 12px', 'border-radius:8px',
      'font-size:11px', 'font-family:var(--font-mono)', 'font-weight:700',
      'z-index:3000', 'display:none', 'backdrop-filter:blur(14px)',
      'transition:opacity 0.3s ease'
    ].join(';');
    document.body.appendChild(el);
  }
  el.textContent = '⟳ ' + msg;
  el.style.display = 'block';
  el.style.opacity = '1';
  clearTimeout(el._timer);
  el._timer = setTimeout(() => { el.style.opacity = '0'; setTimeout(() => { el.style.display = 'none'; }, 300); }, 2500);
}

function escapeHtml(text) {
  if (!text) return '';
  return String(text)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

// =========================================================
// INTEGRAÇÃO COM API OPENCODE (PORTA 4096)
// =========================================================

async function checkOpencodeServer() {
  try {
    const res = await fetch('/api/opencode/health');
    const data = await res.json();
    opencodeServerOnline = data.online === true;

    const tagEl = document.getElementById('opencodeServerTag');
    const versionEl = document.getElementById('statOpencodeVersion');
    const urlEl = document.getElementById('statOpencodeUrl');

    if (tagEl) {
      tagEl.textContent = opencodeServerOnline ? 'Online' : 'Offline';
      tagEl.className = 'metric-tag ' + (opencodeServerOnline ? 'status-online' : 'status-offline');
    }
    if (versionEl) {
      versionEl.textContent = data.version || (opencodeServerOnline ? 'conectado' : 'offline');
      versionEl.style.color = opencodeServerOnline ? '#10b981' : '#f43f5e';
      versionEl.style.fontSize = '22px';
    }
    if (urlEl) {
      const activePort = data.port || '4096';
      urlEl.textContent = opencodeServerOnline
        ? `localhost:${activePort} · API REST ativa`
        : 'localhost:4096 · rode: opencode serve';
    }
  } catch {
    opencodeServerOnline = false;
    const tagEl = document.getElementById('opencodeServerTag');
    if (tagEl) { tagEl.textContent = 'Offline'; tagEl.className = 'metric-tag status-offline'; }
  }
}

function connectOpencodeSSE() {
  if (sseEventSource) sseEventSource.close();

  const badge = document.getElementById('sseStatusBadge');
  function setBadge(text, bg, color, border) {
    if (!badge) return;
    badge.textContent = text;
    badge.style.background = bg;
    badge.style.color = color;
    badge.style.borderColor = border || 'transparent';
  }

  setBadge('SSE CONNECTING', 'rgba(245,158,11,0.15)', '#fde68a', 'rgba(245,158,11,0.4)');

  sseEventSource = new EventSource('/api/opencode/events');

  sseEventSource.onopen = () => {
    setBadge('SSE LIVE', 'rgba(16,185,129,0.15)', '#34d399', 'rgba(16,185,129,0.4)');
  };

  sseEventSource.onmessage = (event) => {
    try {
      const parsed = JSON.parse(event.data);
      const payload = parsed.payload || parsed;
      const type = payload?.type || 'event';

      if (type === 'server.offline') {
        setBadge('SERVER OFFLINE', 'rgba(244,63,94,0.15)', '#fda4af', 'rgba(244,63,94,0.4)');
        return;
      }

      if (type === 'server.heartbeat' || type === 'server.connected') return;

      const liveItem = {
        id: `sse_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
        source: 'sse',
        agent: parsed.directory ? parsed.directory.split('/').pop() : 'opencode',
        type: type.toUpperCase(),
        category: type.includes('error') ? 'error' : type.includes('idle') ? 'warn' : 'info',
        message: JSON.stringify(payload.properties || payload).slice(0, 200),
        sessionId: payload.properties?.id || null,
        sessionTitle: type,
        timestamp: Date.now()
      };

      liveOpencodeEvents.unshift(liveItem);
      if (liveOpencodeEvents.length > 50) liveOpencodeEvents.pop();
      renderLiveEventsFeed();

      if (['session.created', 'session.updated', 'session.idle'].includes(type)) {
        fetchActivityData();
        // Sync agents/skills/MCPs após nova sessão (criações via dashboard)
        setTimeout(syncStateFromOpencode, 1500);
      }
    } catch {}
  };

  sseEventSource.onerror = () => {
    setBadge('SSE OFFLINE', 'rgba(244,63,94,0.15)', '#fda4af', 'rgba(244,63,94,0.4)');
    sseEventSource.close();
    setTimeout(() => connectOpencodeSSE(), 8000);
  };
}

// =========================================================
// TAB MCPs
// =========================================================

async function renderMCPsTab() {
  const grid = document.getElementById('mcpCardsGrid');
  const badge = document.getElementById('mcpCountBadge');
  if (!grid) return;

  grid.innerHTML = `<div style="color:var(--text-dim);font-family:var(--font-mono);text-align:center;grid-column:1/-1;padding:30px;">Carregando MCPs...</div>`;

  try {
    const res = await fetch('/api/mcps');
    const data = await res.json();
    const mcps = data.mcps || globalState.mcps || [];

    if (badge) badge.textContent = `${mcps.length} servidor${mcps.length !== 1 ? 'es' : ''}`;

    if (mcps.length === 0) {
      grid.innerHTML = `<div style="color:var(--text-dim);font-family:var(--font-mono);text-align:center;grid-column:1/-1;padding:40px;">Nenhum MCP configurado em opencode.jsonc</div>`;
      return;
    }

    grid.innerHTML = mcps.map(mcp => {
      const isEnabled = mcp.enabled !== false;
      const typeColor = mcp.type === 'remote' ? '#a5b4fc' : '#6ee7b7';
      const typeBg = mcp.type === 'remote' ? 'rgba(99,102,241,0.15)' : 'rgba(16,185,129,0.15)';
      const statusDot = isEnabled ? '#10b981' : '#64748b';
      const statusText = isEnabled ? 'ATIVO' : 'DESATIVADO';
      const cmd = mcp.command || mcp.url || '';

      return `
        <div class="agent-card glass-card" style="${!isEnabled ? 'opacity:0.75;filter:grayscale(0.2);' : ''}">
          <div>
            <div class="agent-card-top">
              <div class="agent-avatar-box" style="background:${typeBg};color:${typeColor};">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect>
                  <line x1="8" y1="21" x2="16" y2="21"></line>
                  <line x1="12" y1="17" x2="12" y2="21"></line>
                </svg>
              </div>
              <div>
                <div class="agent-name-row">
                  <h3>${escapeHtml(mcp.name)}</h3>
                  <span style="font-size:9px;font-family:var(--font-mono);text-transform:uppercase;font-weight:800;padding:2px 6px;border-radius:4px;background:${typeBg};border:1px solid ${typeColor}33;color:${typeColor};">${mcp.type || 'local'}</span>
                </div>
                <p class="agent-card-desc">${isEnabled ? 'Servidor ativo e pronto' : 'Servidor desativado no OpenCode'}</p>
              </div>
            </div>

            <div class="agent-model-container">
              <div class="model-header-label">COMANDO / URL</div>
              <div class="model-value-name" style="word-break:break-all;font-size:11px;">${escapeHtml(cmd || '—')}</div>
            </div>
          </div>

          <div class="agent-card-footer" style="display:flex;justify-content:space-between;align-items:center;padding-top:14px;border-top:1px solid rgba(255,255,255,0.08);margin-top:14px;">
            <span style="font-family:var(--font-mono);font-size:11px;font-weight:800;color:${statusDot};display:flex;align-items:center;gap:6px;">
              <span style="display:inline-block;width:8px;height:8px;border-radius:50%;background:${statusDot};box-shadow:${isEnabled ? '0 0 8px #10b981' : 'none'};"></span>
              ${statusText}
            </span>

            <div style="display:flex;align-items:center;gap:8px;">
              <button 
                class="btn-secondary" 
                style="padding:5px 12px;font-size:11px;font-weight:700;cursor:pointer;background:${isEnabled ? 'rgba(234,179,8,0.12)' : 'rgba(16,185,129,0.15)'};color:${isEnabled ? '#fde047' : '#6ee7b7'};border-color:${isEnabled ? 'rgba(234,179,8,0.3)' : 'rgba(16,185,129,0.3)'};"
                onclick="toggleMcpByName('${escapeHtml(mcp.name)}', ${isEnabled})"
                title="${isEnabled ? 'Desativar servidor MCP' : 'Ativar servidor MCP'}"
              >
                ${isEnabled ? 'Desativar' : 'Ativar'}
              </button>
              <button 
                class="btn-remove-agent" 
                style="padding:5px 12px;font-size:11px;font-weight:700;cursor:pointer;"
                onclick="deleteMcpByName('${escapeHtml(mcp.name)}')"
                title="Excluir servidor MCP"
              >
                Excluir
              </button>
            </div>
          </div>
        </div>
      `;
    }).join('');
  } catch (err) {
    grid.innerHTML = `<div style="color:#fda4af;font-family:var(--font-mono);text-align:center;grid-column:1/-1;padding:30px;">Erro ao carregar MCPs: ${escapeHtml(err.message)}</div>`;
  }
}

async function toggleMcpByName(name, currentEnabled) {
  const nextState = !currentEnabled;
  try {
    const res = await fetch('/api/mcp/toggle', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, enabled: nextState })
    });
    const data = await res.json();
    if (res.ok && data.success) {
      showToast(`Servidor MCP '${name}' ${nextState ? 'ativado' : 'desativado'}.`);
      await renderMCPsTab();
      await fetchState();
    } else {
      alert(`Erro: ${data.error || 'Falha ao alterar estado do MCP'}`);
    }
  } catch (err) {
    alert(`Erro de conexão: ${err.message}`);
  }
}

async function deleteMcpByName(name) {
  const confirmed = await showConfirmDialog({
    title: 'Excluir Servidor MCP',
    message: `Deseja remover permanentemente o servidor <strong style="color:#fff;">'${escapeHtml(name)}'</strong> do OpenCode (<code style="color:#a5b4fc;">opencode.jsonc</code>)?`,
    confirmText: 'Excluir Definitivamente',
    isDanger: true
  });

  if (!confirmed) return;

  try {
    const res = await fetch(`/api/mcp/${encodeURIComponent(name)}`, {
      method: 'DELETE'
    });
    const data = await res.json();
    if (res.ok && data.success) {
      showToast(`Servidor MCP '${name}' excluído com sucesso.`);
      await renderMCPsTab();
      await fetchState();
    } else {
      showToast(`Erro ao excluir: ${data.error || 'Falha desconhecida'}`);
    }
  } catch (err) {
    showToast(`Erro de conexão: ${err.message}`);
  }
}

function renderLiveEventsFeed() {
  const feedEl = document.getElementById('overviewEventsFeed');
  if (!feedEl) return;

  const items = liveOpencodeEvents.length > 0
    ? liveOpencodeEvents.slice(0, 10)
    : logsPayload.logs.slice(0, 7);

  feedEl.innerHTML = items.map(item => {
    const timeStr = new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    const badge = { success: 'SUCCESS', error: 'ERR', warn: 'WARN', info: 'EVENT' }[item.category] || 'EVT';
    const sseTag = item.source === 'sse'
      ? `<span style="font-size:9px;color:#a5b4fc;font-family:var(--font-mono);font-weight:800;margin-left:4px;">SSE</span>`
      : '';
    return `
      <div class="event-card">
        <div class="event-header">
          <span class="event-type-badge">${badge} · @${escapeHtml(item.agent)}${sseTag}</span>
          <span class="event-time">${timeStr}</span>
        </div>
        <div class="event-snippet">${escapeHtml((item.message || '').slice(0, 180))}</div>
      </div>
    `;
  }).join('');
}
