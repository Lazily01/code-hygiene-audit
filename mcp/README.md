# 清道夫 (Scavenger) · MCP Server

> Model Context Protocol (MCP) 标准服务端。为你的 AI 编码助手装备确定性的“代码卫生分析仪与防腐探针”。
> **特性**：零外部依赖（Zero Dependencies），原生 Node.js >= 18 即开即用。

---

## 暴露的 MCP Tools (工具清单)

| 工具名称 | 功能描述 |
|---|---|
| `scavenger_scan_token_drift` | 扫描代码中所有脱离系统 Token 体系的硬编码 Hex / rgb() 颜色（6/8 位高置信；3/4 位需行内颜色上下文佐证，避免误报 CSS 选择器），输出前公示跳过的 Token 定义文件 (P2) |
| `scavenger_scan_dead_code` | 扫描全仓零引用的导出符号候选（含同文件内使用判定）、孤岛模块与连续注释的代码尸骸 (P3) |
| `scavenger_check_truth_split` | 检查指定函数名、组件名或常量是否存在平行多重定义（真相分裂 P1 诊断） |
| `scavenger_generate_audit_report` | 综合执行可自动化的 P2 Token 漂移与 P3 死代码静态扫描并输出分级证据报告；P0 渲染损坏与 P1 真相分裂需 agent 按五路扫描启发式补扫（报告中已显式标注未覆盖） |

### 已知盲区（诚实声明）

- **死代码扫描只覆盖导出符号**：文件内部未导出的死变量、死 import 检测不到，建议互补 `eslint --rule no-unused-vars` 等静态检查。
- **引用判定基于词边界匹配**：字符串、注释中的同名提及会被视为引用（宁可漏报不误杀）；动态导入、re-export 场景请结合 LSP / 依赖图工具复核。
- **P0 / P1 不在自动化范围**：渲染损坏需真实浏览器检查，真相分裂需启发式检索——这两路由 agent 按 `SKILL.md` 执行，本 server 不虚报覆盖。

---

## 各平台配置方法

### 1. Claude Code
在终端中执行：
```bash
claude mcp add scavenger node /path/to/scavenger/mcp/index.js
```

### 2. Cursor (Settings -> Features -> MCP)
点击 **Add New MCP Server**，或在配置文件中追加：
```json
{
  "mcpServers": {
    "scavenger": {
      "command": "node",
      "args": ["/绝对路径/to/scavenger/mcp/index.js"]
    }
  }
}
```

### 3. Windsurf (`~/.codeium/windsurf/mcp_config.json`)
```json
{
  "mcpServers": {
    "scavenger": {
      "command": "node",
      "args": ["/绝对路径/to/scavenger/mcp/index.js"]
    }
  }
}
```

### 4. Claude Desktop (`claude_desktop_config.json`)
```json
{
  "mcpServers": {
    "scavenger": {
      "command": "node",
      "args": ["/绝对路径/to/scavenger/mcp/index.js"]
    }
  }
}
```

---

## 本地直接测试

无需安装依赖，使用 Node.js 直接运行：
```bash
node mcp/index.js
```
服务将在标准输入输出 (stdio) 上侦听 JSON-RPC 2.0 请求。
