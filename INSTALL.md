# 清道夫 (Scavenger) 安装与配置指南 (Install)

清道夫（Scavenger）支持当前所有主流 AI 编码环境。无论你使用命令行 Agent 还是 IDE 插件，都能以最简方式接入。

---

## 1. Claude Code

#### 全局用户级（推荐，所有项目可用）：
```bash
git clone https://github.com/Lazily01/scavenger.git ~/.claude/skills/scavenger
```

#### 项目级（随代码库分发）：
```bash
git clone https://github.com/Lazily01/scavenger.git .claude/skills/scavenger
```

同时可将仓库中的 [`templates/CLAUDE.md.template`](templates/CLAUDE.md.template) 复制为项目根目录的 `CLAUDE.md`。

---

## 2. Cursor

在项目根目录下任选一种方式：
- **方案 A (简单规则)**：将 [`rules/.cursorrules`](rules/.cursorrules) 复制到项目根目录的 `.cursorrules`。
- **方案 B (MDC 规则)**：将 [`rules/.cursorrules`](rules/.cursorrules) 复制为 `.cursor/rules/scavenger.mdc`。

---

## 3. Windsurf

将 [`rules/.windsurfrules`](rules/.windsurfrules) 复制到项目根目录的 `.windsurfrules` 即可。

---

## 4. GitHub Copilot (VS Code / JetBrains / CLI)

将 [`rules/copilot-instructions.md`](rules/copilot-instructions.md) 复制到项目根目录的 `.github/copilot-instructions.md`。Copilot 在每次生成代码和对话时会自动遵循该规则。

---

## 5. Cline / Roo Code

将 [`rules/.clinerules`](rules/.clinerules) 复制到项目根目录的 `.clinerules`。

---

## 6. Antigravity / Gemini CLI

#### 全局用户级：
```bash
git clone https://github.com/Lazily01/scavenger.git ~/.gemini/config/skills/scavenger
```

#### 项目级：
```bash
git clone https://github.com/Lazily01/scavenger.git .gemini/skills/scavenger
```

---

## 7. 作为原生 MCP 服务端挂载 (Model Context Protocol)

如果你想让 AI 直接拥有专属的扫描工具按钮（调用 `scavenger_scan_dead_code`、`scavenger_scan_token_drift`、`scavenger_check_truth_split` 等）：

无需任何 npm 安装，直接使用本地 Node.js 启动：
```json
{
  "mcpServers": {
    "scavenger": {
      "command": "node",
      "args": ["/你的绝对路径/scavenger/mcp/index.js"]
    }
  }
}
```
支持 **Claude Code (`claude mcp add`)**、**Cursor MCP**、**Windsurf MCP** 及 **Claude Desktop**。详见 [`mcp/README.md`](mcp/README.md)。

---

## 8. 通用 Agent 与其他工具 (Codex, Devin, OpenCode 等)

直接将仓库根目录的 [`AGENTS.md`](AGENTS.md) 复制到任意项目根目录下。现代智能体规范会自动在会话开始时将 `AGENTS.md` 注入上下文并永久遵守。
