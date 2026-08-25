import { serve } from "bun";
import { Database } from "bun:sqlite";
import { readFileSync, writeFileSync, existsSync, readdirSync, mkdirSync, rmSync } from "fs";
import { join } from "path";
import { homedir } from "os";

const PORT = 3030;
const SLIM_CONFIG_PATH = join(homedir(), ".config/opencode/oh-my-opencode-slim.json");
const OPENCODE_CONFIG_PATH = join(homedir(), ".config/opencode/opencode.jsonc");
const DB_PATH = join(homedir(), ".local/share/opencode/opencode.db");
const LOG_DIR_PATH = join(homedir(), ".local/share/opencode/log");
const SKILLS_DIR_PATH = join(homedir(), ".config/opencode/skills");
const AGENTS_DIR_PATH = join(homedir(), ".config/opencode/agents");

function getDatabase() {
  if (existsSync(DB_PATH)) {
    try {
      return new Database(DB_PATH, { readonly: true });
    } catch (e) {
      console.warn("Não foi possível abrir o banco SQLite:", e);
      return null;
    }
  }
  return null;
}

function getSlimConfig() {
  if (!existsSync(SLIM_CONFIG_PATH)) return {};
  try {
    return JSON.parse(readFileSync(SLIM_CONFIG_PATH, "utf-8"));
  } catch {
    return {};
  }
}

function saveSlimConfig(config: any) {
  writeFileSync(SLIM_CONFIG_PATH, JSON.stringify(config, null, 2), "utf-8");
}

function stripJsoncComments(raw: string): string {
  // State-machine stripper: skips // and /* */ only outside strings
  let out = "";
  let i = 0;
  const len = raw.length;

  while (i < len) {
    const ch = raw[i];

    // String literal — copy verbatim until closing unescaped quote
    if (ch === '"') {
      out += ch;
      i++;
      while (i < len) {
        const sc = raw[i];
        out += sc;
        if (sc === "\\" && i + 1 < len) {
          i++;
          out += raw[i]; // escaped char
        } else if (sc === '"') {
          break;
        }
        i++;
      }
      i++;
      continue;
    }

    // Line comment
    if (ch === "/" && raw[i + 1] === "/") {
      while (i < len && raw[i] !== "\n") i++;
      continue;
    }

    // Block comment
    if (ch === "/" && raw[i + 1] === "*") {
      i += 2;
      while (i < len && !(raw[i] === "*" && raw[i + 1] === "/")) i++;
      i += 2;
      continue;
    }

    out += ch;
    i++;
  }

  return out;
}

function getOpenCodeConfig() {
  if (!existsSync(OPENCODE_CONFIG_PATH)) return {};
  try {
    const raw = readFileSync(OPENCODE_CONFIG_PATH, "utf-8");
    return JSON.parse(stripJsoncComments(raw));
  } catch {
    return {};
  }
}

function saveOpenCodeConfig(newConfig: any) {
  let raw = "";
  if (existsSync(OPENCODE_CONFIG_PATH)) {
    raw = readFileSync(OPENCODE_CONFIG_PATH, "utf-8");
  }

  let existing: any = {};
  try { existing = JSON.parse(stripJsoncComments(raw)); } catch {}

  function deepMerge(target: any, source: any): any {
    const out = { ...target };
    for (const key of Object.keys(source)) {
      if (source[key] && typeof source[key] === "object" && !Array.isArray(source[key])
          && target[key] && typeof target[key] === "object" && !Array.isArray(target[key])) {
        out[key] = deepMerge(target[key], source[key]);
      } else {
        out[key] = source[key];
      }
    }
    return out;
  }

  const merged = deepMerge(existing, newConfig);
  if (existing["$schema"] && !merged["$schema"]) merged["$schema"] = existing["$schema"];

  writeFileSync(OPENCODE_CONFIG_PATH, JSON.stringify(merged, null, 2), "utf-8");
}

function writeOpenCodeConfig(config: any) {
  if (!config["$schema"]) {
    config["$schema"] = "https://opencode.ai/config.json";
  }
  writeFileSync(OPENCODE_CONFIG_PATH, JSON.stringify(config, null, 2), "utf-8");
}

function toggleMcpServer(name: string, enabled?: boolean): { success: boolean; enabled: boolean; error?: string } {
  const config = getOpenCodeConfig();
  if (!config.mcp || !config.mcp[name]) {
    return { success: false, enabled: false, error: `MCP '${name}' não encontrado no opencode.jsonc` };
  }
  const current = config.mcp[name].enabled !== false;
  const nextState = enabled !== undefined ? enabled : !current;
  config.mcp[name].enabled = nextState;
  writeOpenCodeConfig(config);
  return { success: true, enabled: nextState };
}

function deleteMcpServer(name: string): { success: boolean; error?: string } {
  const config = getOpenCodeConfig();
  if (!config.mcp || !config.mcp[name]) {
    return { success: false, error: `MCP '${name}' não encontrado no opencode.jsonc` };
  }
  delete config.mcp[name];
  writeOpenCodeConfig(config);
  return { success: true };
}

function parseYamlFrontmatter(content: string) {
  const match = content.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/);
  if (!match) {
    return { frontmatter: {}, body: content };
  }

  const yamlStr = match[1];
  const body = match[2];
  const frontmatter: any = {};

  const lines = yamlStr.split("\n");
  let currentKey = "";
  let multilineKey = "";    // key collecting a >- / | block
  let multilineLines: string[] = [];

  function flushMultiline() {
    if (!multilineKey) return;
    frontmatter[multilineKey] = multilineLines.join(" ").replace(/\s+/g, " ").trim();
    multilineKey = "";
    multilineLines = [];
  }

  for (const line of lines) {
    const trimmed = line.trim();

    // Collect multiline block lines (indented, after >- or | header)
    if (multilineKey && line.startsWith("  ")) {
      multilineLines.push(trimmed);
      continue;
    } else if (multilineKey) {
      flushMultiline();
    }

    if (!trimmed || trimmed.startsWith("#")) continue;

    // Subkey under an object key (e.g. permission:)
    if (line.startsWith("  ") && currentKey && typeof frontmatter[currentKey] === "object") {
      const subMatch = trimmed.match(/^([a-zA-Z0-9_-]+):\s*(.*)$/);
      if (subMatch) {
        frontmatter[currentKey][subMatch[1]] = subMatch[2].replace(/^["']|["']$/g, "");
      }
      continue;
    }

    const kvMatch = line.match(/^([a-zA-Z0-9_-]+):\s*(.*)$/);
    if (kvMatch) {
      currentKey = kvMatch[1];
      const val = kvMatch[2].trim();

      if (!val) {
        frontmatter[currentKey] = {};
      } else if (val === ">-" || val === ">" || val === "|" || val === "|-") {
        // Begin multiline block
        multilineKey = currentKey;
        multilineLines = [];
      } else if (val.startsWith("[") && val.endsWith("]")) {
        frontmatter[currentKey] = val.slice(1, -1).split(",").map(s => s.trim().replace(/^["']|["']$/g, "")).filter(Boolean);
      } else {
        frontmatter[currentKey] = val.replace(/^["']|["']$/g, "");
      }
    }
  }

  flushMultiline();

  return { frontmatter, body };
}

function getAvailableModels(): any[] {
  const modelsMap = new Map<string, any>();

  const defaults = [
    { id: "omniroute/combo/code", name: "Super Combo Programação", context: 1000000, output: 65536, provider: "OmniRoute" },
    { id: "omniroute/combo/chat-multimodal", name: "Super Combo Multimodal & Visão", context: 2000000, output: 65536, provider: "OmniRoute" },
    { id: "omniroute/antigravity/claude-sonnet-4-6", name: "Claude Sonnet 4.6", provider: "OmniRoute" },
    { id: "omniroute/antigravity/claude-opus-4-6-thinking", name: "Claude Opus 4.6 Thinking", provider: "OmniRoute" },
    { id: "omniroute/antigravity/gemini-3.1-pro-low", name: "Gemini 3.1 Pro Multimodal 2M", context: 2000000, provider: "OmniRoute" },
    { id: "omniroute/antigravity/gemini-3.6-flash-high", name: "Gemini 3.6 Flash High", provider: "OmniRoute" },
    { id: "omniroute/antigravity/gemini-2.5-flash", name: "Gemini 2.5 Flash", provider: "OmniRoute" },
    { id: "omniroute/antigravity/gemini-3.1-flash-lite", name: "Gemini 3.1 Flash Lite", provider: "OmniRoute" },
    { id: "omniroute/baseten/deepseek-ai/DeepSeek-V4-Pro", name: "DeepSeek V4 Pro", provider: "OmniRoute" },
    { id: "omniroute/typhoon/typhoon-v2.5-30b-a3b-instruct", name: "Typhoon 30B", context: 131072, output: 16384, provider: "OmniRoute" },
    { id: "omniroute/nscale/moonshotai/Kimi-K2.5", name: "Kimi K2.5", provider: "OmniRoute" },
    { id: "omniroute/nscale/Qwen/Qwen3-235B-A22B-Instruct-2507", name: "Qwen3 235B A22B", provider: "OmniRoute" }
  ];

  for (const item of defaults) {
    modelsMap.set(item.id, item);
  }

  try {
    const opencode = getOpenCodeConfig();
    if (opencode.provider?.omniroute?.models) {
      for (const [key, val] of Object.entries(opencode.provider.omniroute.models) as [string, any][]) {
        const fullId = `omniroute/${key}`;
        modelsMap.set(fullId, {
          id: fullId,
          name: val.name || key,
          context: val.limit?.context,
          output: val.limit?.output,
          provider: "OmniRoute"
        });
      }
    }
  } catch {}

  return Array.from(modelsMap.values());
}

function getInstalledSkills(): any[] {
  if (!existsSync(SKILLS_DIR_PATH)) return [];
  try {
    const entries = readdirSync(SKILLS_DIR_PATH, { withFileTypes: true });
    const skills = [];

    for (const entry of entries) {
      if (entry.isDirectory()) {
        const skillName = entry.name;
        const skillFilePath = join(SKILLS_DIR_PATH, skillName, "SKILL.md");
        let description = `Habilidade especializada '${skillName}'`;
        let content = "";

        if (existsSync(skillFilePath)) {
          content = readFileSync(skillFilePath, "utf-8");
          const descMatch = content.match(/description:\s*(.*?)(?:\n---|\n[a-z_]+:)/s) || content.match(/description:\s*(.*)/);
          if (descMatch && descMatch[1]) {
            description = descMatch[1].trim().replace(/\n/g, " ");
          }
        }

        skills.push({
          name: skillName,
          description,
          content,
          path: skillFilePath,
          hasSkillFile: existsSync(skillFilePath)
        });
      }
    }
    return skills;
  } catch (e) {
    console.error("Erro ao listar skills:", e);
    return [];
  }
}

function saveSkill(name: string, description: string, markdownContent: string) {
  if (!existsSync(SKILLS_DIR_PATH)) {
    mkdirSync(SKILLS_DIR_PATH, { recursive: true });
  }

  const cleanName = name.trim().toLowerCase().replace(/[^a-z0-9-_]/g, "-");
  const skillFolder = join(SKILLS_DIR_PATH, cleanName);
  
  if (!existsSync(skillFolder)) {
    mkdirSync(skillFolder, { recursive: true });
  }

  let finalContent = markdownContent.trim();
  if (!finalContent.startsWith("---")) {
    finalContent = `---
name: ${cleanName}
description: ${description || `Habilidade especializada ${cleanName}`}
---

${finalContent}`;
  }

  const skillFile = join(skillFolder, "SKILL.md");
  writeFileSync(skillFile, finalContent, "utf-8");
  return { name: cleanName, path: skillFile, content: finalContent };
}

function deleteSkill(name: string) {
  const cleanName = name.trim().toLowerCase();
  const skillFolder = join(SKILLS_DIR_PATH, cleanName);
  if (existsSync(skillFolder)) {
    rmSync(skillFolder, { recursive: true, force: true });
    return true;
  }
  return false;
}

// SCAN ALL OPENCODE NATIVE AGENTS (.md) + CONFIGS
function getInstalledAgents(): any[] {
  const agentsMap = new Map<string, any>();

  // 1. Scan ~/.config/opencode/agents/*.md
  if (existsSync(AGENTS_DIR_PATH)) {
    try {
      const files = readdirSync(AGENTS_DIR_PATH).filter(f => f.endsWith(".md"));
      for (const file of files) {
        const name = file.replace(/\.md$/, "");
        const filePath = join(AGENTS_DIR_PATH, file);
        const rawContent = readFileSync(filePath, "utf-8");
        const { frontmatter, body } = parseYamlFrontmatter(rawContent);

        agentsMap.set(name, {
          name,
          type: "native_md",
          description: frontmatter.description || `Agente nativo '${name}'`,
          mode: frontmatter.mode || "subagent",
          model: frontmatter.model || "omniroute/combo/code",
          permission: frontmatter.permission || {},
          skills: frontmatter.skills || [],
          prompt: body.trim(),
          rawContent,
          path: filePath
        });
      }
    } catch (e) {
      console.error("Erro ao listar agentes nativos em .config/opencode/agents:", e);
    }
  }

  // 2. Scan opencode.jsonc agent definitions
  try {
    const opencode = getOpenCodeConfig();
    if (opencode.agent) {
      for (const [name, conf] of Object.entries(opencode.agent) as [string, any][]) {
        if (!agentsMap.has(name)) {
          agentsMap.set(name, {
            name,
            type: "json_opencode",
            description: conf.description || `Agente '${name}'`,
            mode: conf.mode || "subagent",
            model: conf.model || "omniroute/combo/code",
            permission: conf.permission || {},
            skills: conf.skills || [],
            prompt: conf.prompt || "",
            path: OPENCODE_CONFIG_PATH
          });
        } else {
          const existing = agentsMap.get(name);
          if (conf.model) existing.model = conf.model;
        }
      }
    }
  } catch {}

  // 3. Scan oh-my-opencode-slim.json agent definitions
  try {
    const slim = getSlimConfig();
    if (slim.agents) {
      for (const [name, conf] of Object.entries(slim.agents) as [string, any][]) {
        if (!agentsMap.has(name)) {
          agentsMap.set(name, {
            name,
            type: "custom",
            description: conf.description || `Agente '${name}'`,
            mode: conf.mode || "subagent",
            model: conf.model || "omniroute/combo/code",
            permission: {},
            skills: conf.skills || [],
            prompt: conf.prompt || "",
            path: SLIM_CONFIG_PATH
          });
        } else {
          const existing = agentsMap.get(name);
          if (conf.model) existing.model = conf.model;
          if (conf.skills && conf.skills.length > 0) existing.skills = conf.skills;
        }
      }
    }
  } catch {}

  return Array.from(agentsMap.values());
}

function saveNativeAgent(name: string, description: string, mode: string, model: string, prompt: string, skills: string[], permission: any) {
  if (!existsSync(AGENTS_DIR_PATH)) {
    mkdirSync(AGENTS_DIR_PATH, { recursive: true });
  }

  const cleanName = name.trim().toLowerCase().replace(/[^a-z0-9-_]/g, "-");
  const agentFilePath = join(AGENTS_DIR_PATH, `${cleanName}.md`);

  // Build Frontmatter YAML
  let permYaml = "";
  if (permission && typeof permission === "object" && Object.keys(permission).length > 0) {
    permYaml = "permission:\n" + Object.entries(permission).map(([k, v]) => `  ${k}: ${v}`).join("\n") + "\n";
  } else {
    permYaml = `permission:
  read: allow
  edit: allow
  write: allow
  glob: allow
  grep: allow
  bash: allow
  task: allow
  skill: allow
  websearch: allow
  webfetch: allow\n`;
  }

  const skillsYaml = skills && skills.length > 0 ? `skills: [${skills.map(s => `"${s}"`).join(", ")}]\n` : "";
  const modelYaml = model ? `model: "${model}"\n` : "";

  const fileContent = `---
description: ${description || `Agente nativo ${cleanName}`}
mode: ${mode || "subagent"}
${modelYaml}${skillsYaml}${permYaml}---

${prompt || `# Agente @${cleanName}\n\nInstruções especializadas do especialista.`}`;

  writeFileSync(agentFilePath, fileContent, "utf-8");

  // Sync to opencode.jsonc
  try {
    const opencode = getOpenCodeConfig();
    opencode.agent = opencode.agent || {};
    opencode.agent[cleanName] = {
      model: model || "omniroute/combo/code",
      description: description || `Agente nativo ${cleanName}`,
      prompt: prompt || `Você é o especialista ${cleanName}.`
    };
    saveOpenCodeConfig(opencode);
  } catch {}

  // Sync to slim config
  try {
    const slim = getSlimConfig();
    slim.agents = slim.agents || {};
    slim.agents[cleanName] = {
      model: model || "omniroute/combo/code",
      description: description || `Agente nativo ${cleanName}`,
      prompt: prompt || `Você é o especialista ${cleanName}.`,
      skills: skills || []
    };
    saveSlimConfig(slim);
  } catch {}

  return { name: cleanName, path: agentFilePath };
}

function deleteNativeAgent(name: string) {
  const cleanName = name.trim().toLowerCase();
  const agentFilePath = join(AGENTS_DIR_PATH, `${cleanName}.md`);
  
  if (existsSync(agentFilePath)) {
    rmSync(agentFilePath, { force: true });
  }

  try {
    const opencode = getOpenCodeConfig();
    if (opencode.agent && opencode.agent[cleanName]) {
      delete opencode.agent[cleanName];
      saveOpenCodeConfig(opencode);
    }
  } catch {}

  try {
    const slim = getSlimConfig();
    if (slim.agents && slim.agents[cleanName]) {
      delete slim.agents[cleanName];
      saveSlimConfig(slim);
    }
  } catch {}

  return true;
}

function classifyLogEntry(agent: string, type: string, text: string, dataObj: any): "success" | "error" | "warn" | "info" {
  const content = `${type} ${text} ${JSON.stringify(dataObj)}`.toLowerCase();

  if (
    type === "error" ||
    content.includes("error") ||
    content.includes("failed") ||
    content.includes("exception") ||
    content.includes("sqliteerror") ||
    content.includes("rejected") ||
    (dataObj?.exitCode !== undefined && dataObj.exitCode !== 0)
  ) {
    return "error";
  }

  if (
    content.includes("warn") ||
    content.includes("retry") ||
    content.includes("timeout") ||
    content.includes("fallback") ||
    content.includes("skipped") ||
    content.includes("evicted") ||
    content.includes("revert") ||
    content.includes("idle candidate")
  ) {
    return "warn";
  }

  if (
    type === "step-finish" ||
    type === "finish" ||
    content.includes("success") ||
    content.includes("completed") ||
    content.includes("reconciled") ||
    content.includes("reconciling consumed") ||
    (type === "text" && text.length > 0)
  ) {
    return "success";
  }

  return "info";
}

function getStructuredLogs(limit = 100) {
  const logs: any[] = [];
  const db = getDatabase();

  if (db) {
    try {
      const parts = db.query(`
        SELECT 
          p.id, p.session_id, p.time_created, p.data,
          s.agent, s.title as session_title, s.slug
        FROM part p
        LEFT JOIN session s ON p.session_id = s.id
        ORDER BY p.time_created DESC 
        LIMIT ${limit}
      `).all() as any[];

      for (const item of parts) {
        let parsed: any = {};
        try {
          parsed = typeof item.data === "string" ? JSON.parse(item.data) : item.data;
        } catch {}

        const type = parsed.type || "event";
        let message = parsed.text || parsed.reason || (parsed.tokens ? `Tokens: ${parsed.tokens.total} (In: ${parsed.tokens.input}, Out: ${parsed.tokens.output})` : JSON.stringify(parsed));
        
        const category = classifyLogEntry(item.agent || "agente", type, message, parsed);

        logs.push({
          id: item.id,
          source: "sqlite",
          sessionId: item.session_id,
          sessionTitle: item.session_title || item.slug || "Sessão",
          agent: item.agent || "orchestrator",
          type: type.toUpperCase(),
          category,
          message,
          raw: parsed,
          timestamp: item.time_created
        });
      }
      db.close();
    } catch (e) {
      console.error("Erro ao ler partes SQLite:", e);
      try { db.close(); } catch {}
    }
  }

  if (existsSync(LOG_DIR_PATH)) {
    try {
      const files = readdirSync(LOG_DIR_PATH)
        .filter(f => f.endsWith(".log"))
        .sort()
        .reverse()
        .slice(0, 3);

      for (const f of files) {
        const filePath = join(LOG_DIR_PATH, f);
        const content = readFileSync(filePath, "utf-8");
        const lines = content.split("\n").filter(l => l.trim().length > 0).slice(-30);

        for (const line of lines) {
          const match = line.match(/^\[(.*?)\]\s+\[(.*?)\]\s+(.*)$/);
          if (match) {
            const timeStr = match[1];
            const component = match[2];
            const rest = match[3];
            const timestamp = new Date(timeStr).getTime() || Date.now();

            const category = classifyLogEntry(component, component, rest, {});

            logs.push({
              id: `file_${Math.random().toString(36).substring(2, 9)}`,
              source: "system-log",
              sessionId: null,
              sessionTitle: component,
              agent: component,
              type: "SYSTEM",
              category,
              message: rest,
              raw: { line },
              timestamp
            });
          }
        }
      }
    } catch (e) {
      console.error("Erro ao ler arquivos de log:", e);
    }
  }

  logs.sort((a, b) => b.timestamp - a.timestamp);

  const counts = {
    total: logs.length,
    success: logs.filter(l => l.category === "success").length,
    error: logs.filter(l => l.category === "error").length,
    warn: logs.filter(l => l.category === "warn").length,
    info: logs.filter(l => l.category === "info").length
  };

  return {
    counts,
    logs: logs.slice(0, 150)
  };
}

function getLiveTelemetry() {
  const db = getDatabase();
  if (!db) {
    return {
      totalSessions: 0,
      totalTokens: 0,
      cacheReadTokens: 0,
      sessionsTree: []
    };
  }

  try {
    const totals = db.query(`
      SELECT 
        COUNT(*) as total_sessions,
        SUM(tokens_input + tokens_output + tokens_reasoning) as total_tokens,
        SUM(tokens_cache_read) as total_cache_read
      FROM session
    `).get() as any;

    const allSessions = db.query(`
      SELECT 
        id, parent_id, slug, directory, title, agent, model,
        tokens_input, tokens_output, tokens_cache_read,
        time_created, time_updated
      FROM session 
      ORDER BY time_updated DESC 
      LIMIT 25
    `).all() as any[];

    const roots: any[] = [];
    const childrenMap = new Map<string, any[]>();

    for (const s of allSessions) {
      if (s.parent_id) {
        if (!childrenMap.has(s.parent_id)) {
          childrenMap.set(s.parent_id, []);
        }
        childrenMap.get(s.parent_id)!.push(s);
      } else {
        roots.push(s);
      }
    }

    const sessionsTree = roots.map(root => {
      return {
        ...root,
        subagents: childrenMap.get(root.id) || []
      };
    });

    db.close();

    return {
      totalSessions: totals?.total_sessions || 0,
      totalTokens: totals?.total_tokens || 0,
      cacheReadTokens: totals?.total_cache_read || 0,
      sessionsTree
    };
  } catch (e) {
    console.error("Erro ao ler telemetria SQLite:", e);
    try { db.close(); } catch {}
    return {
      totalSessions: 0,
      totalTokens: 0,
      cacheReadTokens: 0,
      sessionsTree: []
    };
  }
}

function getInstalledMCPs(opencode?: any): any[] {
  const config = opencode || getOpenCodeConfig();
  const mcpConfig = config.mcp || {};
  const result: any[] = [];

  for (const [name, conf] of Object.entries(mcpConfig) as [string, any][]) {
    result.push({
      name,
      type: conf.type || "local",
      enabled: conf.enabled !== false,
      command: Array.isArray(conf.command) ? conf.command.join(" ") : (conf.url || ""),
      url: conf.url || null
    });
  }

  return result;
}

const server = serve({
  port: PORT,
  idleTimeout: 255,
  async fetch(req) {
    const url = new URL(req.url);

    // API: Estado Geral com todos os Agentes Nativos (.md) e Skills
    if (url.pathname === "/api/state" && req.method === "GET") {
      const config = getSlimConfig();
      const opencode = getOpenCodeConfig();
      const models = getAvailableModels();
      const skills = getInstalledSkills().map(s => s.name);
      const agents = getInstalledAgents();
      const mcps = getInstalledMCPs(opencode);

      return Response.json({
        config,
        opencode,
        models,
        skills,
        agents,
        mcps
      });
    }

    // API: Listar Todos os Agentes Nativos
    if (url.pathname === "/api/agents" && req.method === "GET") {
      const agents = getInstalledAgents();
      return Response.json({ agents });
    }

    if (url.pathname === "/api/mcps" && req.method === "GET") {
      const mcps = getInstalledMCPs();
      return Response.json({ mcps });
    }

    // API: Alternar Ativação/Desativação de MCP
    if (url.pathname === "/api/mcp/toggle" && req.method === "POST") {
      try {
        const body = await req.json();
        const { name, enabled } = body;
        if (!name) {
          return Response.json({ error: "Nome do MCP é obrigatório" }, { status: 400 });
        }
        const result = toggleMcpServer(name, enabled);
        if (!result.success) {
          return Response.json({ error: result.error }, { status: 404 });
        }
        return Response.json({ success: true, name, enabled: result.enabled });
      } catch (err: any) {
        return Response.json({ error: err.message }, { status: 500 });
      }
    }

    // API: Deletar MCP
    if (url.pathname.startsWith("/api/mcp/") && req.method === "DELETE") {
      try {
        const name = decodeURIComponent(url.pathname.replace("/api/mcp/", ""));
        if (!name) {
          return Response.json({ error: "Nome do MCP é obrigatório" }, { status: 400 });
        }
        const result = deleteMcpServer(name);
        if (!result.success) {
          return Response.json({ error: result.error }, { status: 404 });
        }
        return Response.json({ success: true, name });
      } catch (err: any) {
        return Response.json({ error: err.message }, { status: 500 });
      }
    }

    if (url.pathname === "/api/activity" && req.method === "GET") {
      const telemetry = getLiveTelemetry();
      return Response.json(telemetry);
    }

    if (url.pathname === "/api/logs" && req.method === "GET") {
      const structuredLogs = getStructuredLogs(200);
      return Response.json(structuredLogs);
    }

    if (url.pathname === "/api/skills" && req.method === "GET") {
      const skills = getInstalledSkills();
      return Response.json({ skills });
    }

    if (url.pathname === "/api/skills" && req.method === "POST") {
      try {
        const body = await req.json();
        const { name, description, content } = body;

        if (!name || !content) {
          return Response.json({ error: "Nome e Conteúdo da Skill são obrigatórios" }, { status: 400 });
        }

        const saved = saveSkill(name, description, content);
        return Response.json({ success: true, skill: saved });
      } catch (err: any) {
        return Response.json({ error: err.message }, { status: 500 });
      }
    }

    if (url.pathname.startsWith("/api/skills/") && req.method === "DELETE") {
      const skillName = url.pathname.replace("/api/skills/", "");
      const deleted = deleteSkill(skillName);
      return Response.json({ success: deleted });
    }

    // API: Atualizar Agente Core do Pantheon
    if (url.pathname === "/api/agent/core" && req.method === "POST") {
      try {
        const body = await req.json();
        const { name, model, variant } = body;
        const config = getSlimConfig();
        const activePreset = config.preset || "omniroute";

        if (!config.presets || !config.presets[activePreset]) {
          config.presets = config.presets || {};
          config.presets[activePreset] = {};
        }

        config.presets[activePreset][name] = config.presets[activePreset][name] || {};
        config.presets[activePreset][name].model = model;
        if (variant) {
          config.presets[activePreset][name].variant = variant;
        }

        saveSlimConfig(config);
        return Response.json({ success: true, preset: activePreset, agent: config.presets[activePreset][name] });
      } catch (err: any) {
        return Response.json({ error: err.message }, { status: 500 });
      }
    }

    // API: Salvar/Editar Agente Nativo (.md) & Custom
    if (url.pathname === "/api/agent" && req.method === "POST") {
      try {
        const body = await req.json();
        const { name, model, description, mode, prompt, skills, permission } = body;

        if (!name) {
          return Response.json({ error: "Nome do Agente é obrigatório" }, { status: 400 });
        }

        const saved = saveNativeAgent(
          name,
          description,
          mode || "subagent",
          model || "omniroute/combo/code",
          prompt,
          skills || [],
          permission || {}
        );

        return Response.json({ success: true, agent: saved });
      } catch (err: any) {
        return Response.json({ error: err.message }, { status: 500 });
      }
    }

    // API: Deletar Agente Nativo (.md)
    if (url.pathname.startsWith("/api/agent/") && req.method === "DELETE") {
      const agentName = url.pathname.replace("/api/agent/", "");
      const deleted = deleteNativeAgent(agentName);
      return Response.json({ success: deleted });
    }

    // ── PROXY: API do OpenCode (detecção dinâmica 4096 / 4040) ──────────────

    async function getOpencodeApiBase(): Promise<string> {
      for (const p of [4096, 4040]) {
        try {
          const res = await fetch(`http://127.0.0.1:${p}/global/health`, { signal: AbortSignal.timeout(600) });
          if (res.ok) return `http://127.0.0.1:${p}`;
        } catch {}
      }
      return "http://127.0.0.1:4096";
    }

    // Health check do servidor opencode
    if (url.pathname === "/api/opencode/health" && req.method === "GET") {
      try {
        const base = await getOpencodeApiBase();
        const res = await fetch(`${base}/global/health`, { signal: AbortSignal.timeout(2000) });
        const data = await res.json() as any;
        return Response.json({ online: true, port: base.split(":").pop(), ...data });
      } catch {
        return Response.json({ online: false, healthy: false, version: null });
      }
    }

    // Sessões ao vivo do opencode
    if (url.pathname === "/api/opencode/sessions" && req.method === "GET") {
      try {
        const base = await getOpencodeApiBase();
        const res = await fetch(`${base}/session`, { signal: AbortSignal.timeout(3000) });
        const data = await res.json() as any;
        return Response.json({ sessions: Array.isArray(data) ? data : [] });
      } catch {
        return Response.json({ sessions: [] });
      }
    }

    // Provedores e modelos do opencode
    if (url.pathname === "/api/opencode/providers" && req.method === "GET") {
      try {
        const base = await getOpencodeApiBase();
        const res = await fetch(`${base}/provider`, { signal: AbortSignal.timeout(3000) });
        const data = await res.json() as any;
        return Response.json(data);
      } catch {
        return Response.json({ all: [], connected: [] });
      }
    }

    // Config ao vivo do opencode
    if (url.pathname === "/api/opencode/config" && req.method === "GET") {
      try {
        const base = await getOpencodeApiBase();
        const res = await fetch(`${base}/config`, { signal: AbortSignal.timeout(3000) });
        const data = await res.json() as any;
        return Response.json(data);
      } catch {
        return Response.json({});
      }
    }

    // SSE Relay: eventos do opencode → dashboard (evita CORS)
    if (url.pathname === "/api/opencode/events" && req.method === "GET") {
      let upstreamController: AbortController | null = null;

      const stream = new ReadableStream({
        async start(controller) {
          upstreamController = new AbortController();
          const enc = new TextEncoder();
          try {
            const base = await getOpencodeApiBase();
            const upstream = await fetch(`${base}/global/event`, {
              signal: upstreamController.signal,
              headers: { "Accept": "text/event-stream" }
            });

            if (!upstream.ok || !upstream.body) {
              controller.enqueue(enc.encode("data: {\"payload\":{\"type\":\"server.offline\",\"properties\":{}}}\n\n"));
              controller.close();
              return;
            }

            const reader = upstream.body.getReader();
            while (true) {
              const { done, value } = await reader.read();
              if (done) break;
              controller.enqueue(value);
            }
          } catch (err: any) {
            if (err?.name !== "AbortError") {
              try { controller.enqueue(enc.encode("data: {\"payload\":{\"type\":\"server.offline\",\"properties\":{}}}\n\n")); } catch {}
            }
            try { controller.close(); } catch {}
          }
        },
        cancel() {
          upstreamController?.abort();
        }
      });

      return new Response(stream, {
        headers: {
          "Content-Type": "text/event-stream",
          "Cache-Control": "no-cache",
          "Connection": "keep-alive",
          "Access-Control-Allow-Origin": "*"
        }
      });
    }

    // ─────────────────────────────────────────────────────────────────────────

    const publicDir = join(__dirname, "public");

    if (url.pathname === "/" || url.pathname === "/index.html") {
      const html = readFileSync(join(publicDir, "index.html"), "utf-8");
      return new Response(html, { headers: { "Content-Type": "text/html; charset=utf-8" } });
    }

    if (url.pathname === "/app.css") {
      const css = readFileSync(join(publicDir, "app.css"), "utf-8");
      return new Response(css, { headers: { "Content-Type": "text/css; charset=utf-8" } });
    }

    if (url.pathname === "/app.js") {
      const js = readFileSync(join(publicDir, "app.js"), "utf-8");
      return new Response(js, { headers: { "Content-Type": "application/javascript; charset=utf-8" } });
    }

    if (url.pathname === "/dither-background.js") {
      const js = readFileSync(join(publicDir, "dither-background.js"), "utf-8");
      return new Response(js, { headers: { "Content-Type": "application/javascript; charset=utf-8" } });
    }

    return new Response("Not Found", { status: 404 });
  }
});

console.log(`✨ OpenCode Master Dashboard rodando em http://localhost:${PORT}`);
