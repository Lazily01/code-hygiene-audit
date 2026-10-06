# 清道夫 (Scavenger) · MCP Server

> Model Context Protocol (MCP) 标准服务端。为你的 AI 编码助手装备确定性的「代码卫生分析仪与防腐探针」。
> **特性**：零外部依赖（Zero Dependencies）、单文件实现、原生 Node.js >= 18 即开即用。

---

## 暴露的 MCP Tools (工具清单)

| 工具 | 覆盖 | 功能描述 |
|---|---|---|
| `scavenger_scan_token_drift` | P2 | 扫描代码中脱离系统 Token 体系的硬编码颜色。6/8 位 Hex 与 `rgb()/rgba()` 为高置信直接上报；3/4 位 Hex 仅当行内存在颜色上下文关键词时才报（不会把 `#feed` 这类 CSS id 选择器、`#123` 这类 issue 引用误报为颜色）。跳过的 Token 定义文件在报告中公示，参数失效时显式警告 |
| `scavenger_scan_dead_code` | P3 | 扫描全仓零引用的导出符号候选与连续注释的代码尸骸。同文件内被使用的导出不会误判为死代码；全库内容一次性拼接比对，大型仓库可扩展 |
| `scavenger_check_truth_split` | P1 | 检查指定函数名、组件名或常量是否存在平行多重定义（真相分裂诊断）。输入已做正则转义，传入带签名的函数名（如 `formatMoney(cents`）也不会导致服务端报错 |
| `scavenger_generate_audit_report` | P2+P3 | 综合执行可自动化的静态扫描并输出分级证据报告。P0 渲染损坏与 P1 真相分裂不在自动化范围，报告中显式标注未覆盖、由 agent 按五路扫描启发式补扫 |

### 参数说明

| 参数 | 适用工具 | 说明 |
|---|---|---|
| `directory` | 全部 | 扫描目录，相对或绝对路径，默认 `.` |
| `allowedTokensFile` | token_drift / audit_report | Token 定义文件的路径关键词。显式传入时只按它匹配跳过；未传入时按文件名启发式（token/theme/colors）跳过；匹配不到任何文件时输出警告而非静默 |

### 输出契约

- 所有工具输出 Markdown 证据清单，带 `文件:行` 绝对证据，**供用户审批，不得据此直接改代码**；
- 错误以标准 JSON-RPC error 返回（`-32601` 未知方法 / `-32603` 内部错误），不会 crash 整个 stdio 通道。

---

## 已知盲区（诚实声明）

宁少报不虚报。以下能力边界请知悉：

- **死代码扫描只覆盖导出符号**：文件内部未导出的死变量、死 import 检测不到，建议互补 `eslint --rule no-unused-vars` 等静态检查。
- **引用判定基于词边界匹配**：字符串、注释中的同名提及会被视为引用（宁可漏报不误杀）；动态导入、re-export 场景请结合 LSP / 依赖图工具复核。
- **P0 / P1 不在自动化范围**：渲染损坏需真实浏览器检查，真相分裂需启发式检索——这两路由 agent 按 [`SKILL.md`](../SKILL.md) 执行，本 server 不虚报覆盖。

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
服务将在标准输入输出 (stdio) 上侦听 JSON-RPC 2.0 请求。手工冒烟：

```bash
echo '{"jsonrpc":"2.0","id":1,"method":"initialize","params":{}}
{"jsonrpc":"2.0","id":2,"method":"tools/list","params":{}}' | node mcp/index.js
```

## 质量保障

仓库根目录 `npm test` 运行 10 个测试：协议握手、四工具全链路，外加 4 个回归用例（同文件引用误报、CSS 选择器误报、正则注入、参数静默失效——每个都是曾实测复现的真实 bug，已被回归测试永久锁定）。
