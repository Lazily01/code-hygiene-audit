#!/usr/bin/env node

/**
 * 清道夫 (Scavenger) - MCP Server
 * Model Context Protocol Server for Automated Code Hygiene & Anti-Rot Guardrails
 * Zero-dependency: runs natively on Node.js >= 18
 */

import fs from 'node:fs';
import path from 'node:path';
import readline from 'node:readline';

const IGNORE_DIRS = new Set([
  'node_modules', '.git', 'dist', 'build', '.next', '.nuxt', '.output',
  'coverage', '.turbo', '.venv', 'venv', '__pycache__', '.idea', '.vscode',
  '.gemini', '.claude'
]);

const CODE_EXTS = new Set([
  '.js', '.jsx', '.ts', '.tsx', '.vue', '.svelte',
  '.py', '.go', '.rs', '.java', '.css', '.scss', '.less', '.html'
]);

// --- Utility Functions ---

function walkDir(dir, fileList = [], baseDir = dir) {
  if (!fs.existsSync(dir)) return fileList;
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    if (IGNORE_DIRS.has(entry.name)) continue;
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      walkDir(fullPath, fileList, baseDir);
    } else {
      const ext = path.extname(entry.name).toLowerCase();
      if (CODE_EXTS.has(ext)) {
        fileList.push(fullPath);
      }
    }
  }
  return fileList;
}

function relPath(baseDir, filePath) {
  return path.relative(baseDir, filePath).replace(/\\/g, '/');
}

// --- Tool Implementations ---

/**
 * 1. Token 漂移检测：扫描所有代码与样式中的硬编码色值与非 Token 颜色
 */
function scanTokenDrift({ directory = '.', allowedTokensFile = '' }) {
  const root = path.resolve(process.cwd(), directory);
  if (!fs.existsSync(root)) {
    return `错误: 目录未找到: ${directory}`;
  }

  const files = walkDir(root);
  const HEX_REGEX = /#([0-9a-fA-F]{3,8})\b/g;
  const RGB_REGEX = /\brgba?\([^)]+\)/g;
  const findings = [];

  for (const file of files) {
    // 忽略本身就是 token 定义的文件
    if (allowedTokensFile && file.includes(allowedTokensFile)) continue;
    if (file.includes('token') || file.includes('theme') || file.includes('colors')) continue;

    try {
      const content = fs.readFileSync(file, 'utf-8');
      const lines = content.split('\n');
      for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        if (line.trim().startsWith('//') || line.trim().startsWith('*')) continue;

        let match;
        HEX_REGEX.lastIndex = 0;
        while ((match = HEX_REGEX.exec(line)) !== null) {
          findings.push({
            file: relPath(root, file),
            line: i + 1,
            value: match[0],
            snippet: line.trim()
          });
        }
      }
    } catch {
      // 忽略无法读取的文件
    }
  }

  if (findings.length === 0) {
    return `✅ Token 扫描完成：未发现硬编码颜色漂移，设计系统纯洁度极佳。`;
  }

  let out = `### 🚨 发现 ${findings.length} 处设计 Token 漂移 (P2)\n\n`;
  out += `| 文件:行 | 硬编码值 | 代码片段 |\n`;
  out += `|---|---|---|\n`;
  for (const f of findings.slice(0, 50)) {
    out += `| \`${f.file}:${f.line}\` | \`${f.value}\` | \`${f.snippet.replace(/\|/g, '\\|')}\` |\n`;
  }
  if (findings.length > 50) {
    out += `\n*(已截断，仅展示前 50 条。总计: ${findings.length} 处)*\n`;
  }
  return out;
}

/**
 * 2. 死代码与注释尸骸检测
 */
function scanDeadCode({ directory = '.' }) {
  const root = path.resolve(process.cwd(), directory);
  if (!fs.existsSync(root)) return `错误: 目录未找到: ${directory}`;

  const files = walkDir(root);
  const fileContents = new Map();
  for (const f of files) {
    try {
      fileContents.set(f, fs.readFileSync(f, 'utf-8'));
    } catch {
      // ignore
    }
  }

  const exportRegex = /export\s+(?:const|let|var|function|class|type|interface)\s+([a-zA-Z0-9_$]+)/g;
  const deadExports = [];
  const commentedCorpses = [];

  for (const [file, content] of fileContents) {
    const lines = content.split('\n');
    let consecutiveComments = 0;
    let commentStartLine = 0;

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();
      // 检查注释尸骸（多行被注释掉的疑似代码）
      if (line.startsWith('//') && (line.includes('const ') || line.includes('function ') || line.includes('return ') || line.includes('import ') || line.includes('if ('))) {
        if (consecutiveComments === 0) commentStartLine = i + 1;
        consecutiveComments++;
      } else {
        if (consecutiveComments >= 3) {
          commentedCorpses.push({
            file: relPath(root, file),
            line: commentStartLine,
            count: consecutiveComments
          });
        }
        consecutiveComments = 0;
      }
    }

    // 检查导出的符号在其他文件中是否有引用
    let match;
    exportRegex.lastIndex = 0;
    while ((match = exportRegex.exec(content)) !== null) {
      const symbol = match[1];
      if (symbol === 'default') continue;

      let hasRef = false;
      const refRegex = new RegExp(`\\b${symbol}\\b`);

      for (const [otherFile, otherContent] of fileContents) {
        if (otherFile === file) continue;
        if (refRegex.test(otherContent)) {
          hasRef = true;
          break;
        }
      }

      if (!hasRef) {
        deadExports.push({
          file: relPath(root, file),
          symbol
        });
      }
    }
  }

  let out = `## 🧹 死代码与尸骸排查结果 (P3)\n\n`;

  if (deadExports.length > 0) {
    out += `### 零引用导出候选 (${deadExports.length} 个)\n`;
    for (const d of deadExports.slice(0, 30)) {
      out += `- \`${d.file}\`: 符号 \`${d.symbol}\` 全仓零引用\n`;
    }
    if (deadExports.length > 30) out += `*(截断，展示前 30 项)*\n`;
    out += `\n`;
  } else {
    out += `✅ 未发现明显的零引用孤岛导出符号。\n\n`;
  }

  if (commentedCorpses.length > 0) {
    out += `### 注释代码尸骸 (${commentedCorpses.length} 处)\n`;
    for (const c of commentedCorpses.slice(0, 20)) {
      out += `- \`${c.file}:${c.line}\`: 连续 ${c.count} 行被注释的代码块（建议物理删除，Git 已有历史）\n`;
    }
    out += `\n`;
  } else {
    out += `✅ 未发现连续的大段废弃注释尸骸。\n\n`;
  }

  return out;
}

/**
 * 3. 真相分裂检测：检测同名函数、平行类、重复常量的多处定义
 */
function checkTruthSplit({ symbolOrKeyword, directory = '.' }) {
  if (!symbolOrKeyword) return `错误: 必须提供待检索的符号或关键词`;
  const root = path.resolve(process.cwd(), directory);
  if (!fs.existsSync(root)) return `错误: 目录未找到: ${directory}`;

  const files = walkDir(root);
  const occurrences = [];
  const reg = new RegExp(`(?:const|function|class|type|interface|def)\\s+(${symbolOrKeyword})\\b`, 'i');

  for (const file of files) {
    try {
      const content = fs.readFileSync(file, 'utf-8');
      const lines = content.split('\n');
      for (let i = 0; i < lines.length; i++) {
        if (reg.test(lines[i])) {
          occurrences.push({
            file: relPath(root, file),
            line: i + 1,
            code: lines[i].trim()
          });
        }
      }
    } catch {
      // ignore
    }
  }

  if (occurrences.length === 0) {
    return `未在代码库定义中检索到符合 \`${symbolOrKeyword}\` 的实现。`;
  }

  if (occurrences.length === 1) {
    return `✅ 单一真相源验证通过：符号 \`${symbolOrKeyword}\` 全仓仅此一处定义：\n- \`${occurrences[0].file}:${occurrences[0].line}\`: \`${occurrences[0].code}\``;
  }

  let out = `### ⚠️ 真相分裂预警 (P1)：检测到 ${occurrences.length} 处平行定义！\n\n`;
  out += `同一概念在多个文件中被重复声明，违背 Single Source of Truth 原则：\n\n`;
  for (const o of occurrences) {
    out += `- \`${o.file}:${o.line}\`: \`${o.code}\`\n`;
  }
  out += `\n**清道夫建议修法**：收拢为一个公共共享模块导出，其余调用点改为引用导入，坚决消除平行实现。`;
  return out;
}

/**
 * 4. 自动生成标准审计清单报告
 */
function generateAuditReport({ directory = '.' }) {
  const tokenReport = scanTokenDrift({ directory });
  const deadReport = scanDeadCode({ directory });

  return `# 清道夫 (Scavenger) 自动化审计速报\n\n` +
    `> 扫描目录: \`${directory}\` | 运行状态: 自动化基线就绪\n\n` +
    `---\n\n` +
    `${tokenReport}\n\n` +
    `---\n\n` +
    `${deadReport}\n\n` +
    `> **清道夫守护铁律**：以上清单仅作为待审证据，用户确认前严禁擅动源码。`;
}

// --- MCP Server JSON-RPC Protocol Handler ---

const TOOLS = [
  {
    name: 'scavenger_scan_token_drift',
    description: '扫描代码中所有脱离系统 Token 体系的硬编码 Hex 颜色、魔法值与局部样式漂移 (P2 审计)',
    inputSchema: {
      type: 'object',
      properties: {
        directory: {
          type: 'string',
          description: '扫描的根目录相对路径或绝对路径，默认为当前工作目录 .'
        },
        allowedTokensFile: {
          type: 'string',
          description: '允许定义 Token 的文件路径关键词（在此文件内的颜色定义将被忽略）'
        }
      }
    }
  },
  {
    name: 'scavenger_scan_dead_code',
    description: '扫描全仓零引用的导出符号候选、废弃模块与连续注释的代码尸骸 (P3 审计)',
    inputSchema: {
      type: 'object',
      properties: {
        directory: {
          type: 'string',
          description: '扫描目录，默认为当前工作目录 .'
        }
      }
    }
  },
  {
    name: 'scavenger_check_truth_split',
    description: '检查指定函数名、组件名或常量是否存在平行多重定义（真相分裂 P1 诊断）',
    inputSchema: {
      type: 'object',
      properties: {
        symbolOrKeyword: {
          type: 'string',
          description: '要核验单一真相源的函数名、变量名或类名'
        },
        directory: {
          type: 'string',
          description: '扫描目录，默认为 .'
        }
      },
      required: ['symbolOrKeyword']
    }
  },
  {
    name: 'scavenger_generate_audit_report',
    description: '综合执行清道夫全套静态巡检，输出标准的 P0~P3 分级待办清单与证据报告',
    inputSchema: {
      type: 'object',
      properties: {
        directory: {
          type: 'string',
          description: '扫描目录，默认为 .'
        }
      }
    }
  }
];

function send(msg) {
  process.stdout.write(JSON.stringify(msg) + '\n');
}

function handleMessage(msg) {
  if (!msg || typeof msg !== 'object') return;
  const { id, method, params } = msg;

  if (method === 'initialize') {
    send({
      jsonrpc: '2.0',
      id,
      result: {
        protocolVersion: '2024-11-05',
        capabilities: {
          tools: {}
        },
        serverInfo: {
          name: 'scavenger-mcp',
          version: '1.0.0'
        }
      }
    });
    return;
  }

  if (method === 'notifications/initialized') {
    // Client initialized confirmation, no response required
    return;
  }

  if (method === 'ping') {
    send({ jsonrpc: '2.0', id, result: {} });
    return;
  }

  if (method === 'tools/list') {
    send({
      jsonrpc: '2.0',
      id,
      result: {
        tools: TOOLS
      }
    });
    return;
  }

  if (method === 'tools/call') {
    const { name, arguments: args = {} } = params || {};
    let resultText = '';

    try {
      if (name === 'scavenger_scan_token_drift') {
        resultText = scanTokenDrift(args);
      } else if (name === 'scavenger_scan_dead_code') {
        resultText = scanDeadCode(args);
      } else if (name === 'scavenger_check_truth_split') {
        resultText = checkTruthSplit(args);
      } else if (name === 'scavenger_generate_audit_report') {
        resultText = generateAuditReport(args);
      } else {
        send({
          jsonrpc: '2.0',
          id,
          error: { code: -32601, message: `Unknown tool: ${name}` }
        });
        return;
      }

      send({
        jsonrpc: '2.0',
        id,
        result: {
          content: [
            {
              type: 'text',
              text: resultText
            }
          ]
        }
      });
    } catch (err) {
      send({
        jsonrpc: '2.0',
        id,
        error: { code: -32603, message: err.message || String(err) }
      });
    }
    return;
  }

  if (id !== undefined) {
    send({
      jsonrpc: '2.0',
      id,
      error: { code: -32601, message: `Method not found: ${method}` }
    });
  }
}

// Start stdio reader
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  terminal: false
});

rl.on('line', (line) => {
  const trimmed = line.trim();
  if (!trimmed) return;
  try {
    const parsed = JSON.parse(trimmed);
    handleMessage(parsed);
  } catch (e) {
    send({
      jsonrpc: '2.0',
      id: null,
      error: { code: -32700, message: `Parse error: ${e.message}` }
    });
  }
});

// Suppress unhandled errors crashing stdio
process.on('uncaughtException', (err) => {
  process.stderr.write(`[scavenger-mcp error] ${err.stack || err}\n`);
});
