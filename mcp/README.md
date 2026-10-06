# 清道夫 (Scavenger) · MCP Server

> Model Context Protocol (MCP) 标准服务端。为你的 AI 编码助手装备确定性的“代码卫生分析仪与防腐探针”。
> **特性**：零外部依赖（Zero Dependencies），原生 Node.js >= 18 即开即用。

---

## 暴露的 MCP Tools (工具清单)

| 工具名称 | 功能描述 |
|---|---|
| `scavenger_scan_token_drift` | 扫描代码中所有脱离系统 Token 体系的硬编码 Hex 颜色、魔法值与局部样式漂移 (P2) |
| `scavenger_scan_dead_code` | 扫描全仓零引用的导出符号候选、孤岛模块与连续注释的代码尸骸 (P3) |
| `scavenger_check_truth_split` | 检查指定函数名、组件名或常量是否存在平行多重定义（真相分裂 P1 诊断） |
| `scavenger_generate_audit_report` | 综合执行清道夫全套静态巡检，输出标准的 P0~P3 分级待办清单与证据报告 |

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
