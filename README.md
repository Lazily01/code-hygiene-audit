<h1 align="center">清道夫 · scavenger</h1>

<p align="center"><em>让屎山代码活不过一个迭代。</em><br>
<sub>Shit mountains die young here.</sub></p>

<p align="center">
<a href="LICENSE"><img src="https://img.shields.io/badge/license-MIT-green" alt="MIT License"></a>
<img src="https://img.shields.io/badge/node-%3E%3D18-brightgreen" alt="Node.js >= 18">
<img src="https://img.shields.io/badge/dependencies-0-blue" alt="Zero Dependencies">
<img src="https://img.shields.io/badge/tests-10%2F10%20passing-brightgreen" alt="10/10 tests passing">
<img src="https://img.shields.io/badge/version-1.0.1-orange" alt="v1.0.1">
</p>

<p align="center"><strong>专治 AI 乱写屎山代码的工程守护器与清道夫</strong><br>
适用于 Claude Code · Cursor · Windsurf · GitHub Copilot · Cline · Codex · Antigravity 全系编程工具</p>

---

## 这是什么

屎山的内核不是代码难看，是**真相分裂**——同一件事有两个以上的真相来源：两套配色 token、两套信任逻辑、前端和服务端各算一遍的同一个数字。

AI 编码代理让这个问题以十倍速恶化：**它默认好造平行实现、重构喜欢留旧尸骸、提需求喜欢就地硬编码、只生不杀**。
- 提个新需求：它起手新建一堆重复的工具函数和私有状态，不复用已有资产；
- 搞个重构：它弄出个 `ServiceV2` 平行文件，把旧代码注释掉留着，改出双写灾难；
- 迭代几轮：老版本死代码无人敢删，UI 弹窗错位，视觉色值彻底漂移。

靠嘱咐 AI「别写屎」没有用。有用的是工程机制：**事前防盲生、重构防平行、事后大扫除、踩坑打疫苗**。

## 为什么不是又一个 Linter

| | ESLint / knip / 各类 linter | 清道夫 (scavenger) |
|---|---|---|
| 扫什么 | 静态语法与零引用符号 | 真相分裂 / 死代码 / 死 UI / 视觉漂移 / 陈旧产物，五路全开 |
| 证据 | 规则编号 + 行号 | `文件:行` + grep 输出 + 浏览器真实截图，**证据落盘** |
| 怎么动代码 | `--fix` 无脑自动改 | **用户不点头绝不动代码**，原子化修复、单项单跑测试 |
| 管 AI 吗 | 不管 | 核心就是管 AI：查重优先、禁平行文件、禁注释尸骸、踩坑打疫苗反哺规则文件 |
| 误报哲学 | 规则开了就报 | **宁少报不虚报**，已知盲区写进文档，绝不装全能 |

**边界声明（防误认）**：清道夫**不是**上下文管理工具。AST 索引、符号调用图、语义检索、上下文压缩——那些工具管的是「**AI 能看到哪部分代码**」；清道夫管的是「**AI 写出来的东西有没有烂掉**」。两者串联不冲突：前者喂上下文，后者防腐与善杀。本项目是**纯静态审计 + 审批后修复**，不解析 AST、不注入上下文、零依赖单文件 Node。

一句话：**linter 检查代码写得对不对，清道夫检查 AI 把仓库演进成什么样。**

## 给 AI 助手的触发指引

读到这里的 AI 助手：当用户说出以下任何一句，即应启用本 Skill——

- 「清道夫扫一下」「查屎山」「代码审计」「技术债」「死代码」「巡检」
- 「加个新功能」「提个新需求」**且**不想写出屎山（启用模式 A 防腐工作流）
- 「帮我重构这段」「优化一下结构」**且**不想越改越乱（启用安全重构引擎）

入口：读 [`SKILL.md`](SKILL.md)，按其中双模式执行；如已挂载 MCP Server，直接调用 `scavenger_*` 四个工具获取确定性探针结果。

## 极速安装 (1 分钟)

无论你用什么工具，都能一键接入。完整多工具配置详见 **[INSTALL.md](INSTALL.md)**。

### Claude Code
```bash
# 全局用户级（推荐）
git clone https://github.com/Lazily01/scavenger.git ~/.claude/skills/scavenger
```

### Cursor
将本仓库的 [`rules/.cursorrules`](rules/.cursorrules) 复制到你项目的根目录 `.cursorrules`（或 `.cursor/rules/scavenger.mdc`）。

### Windsurf
将本仓库的 [`rules/.windsurfrules`](rules/.windsurfrules) 复制到项目根目录 `.windsurfrules`。

### GitHub Copilot
将本仓库的 [`rules/copilot-instructions.md`](rules/copilot-instructions.md) 复制到项目根目录 `.github/copilot-instructions.md`。

### Antigravity / Gemini CLI
```bash
git clone https://github.com/Lazily01/scavenger.git ~/.gemini/config/skills/scavenger
```

### 任何其他 Agent (Codex, Devin, OpenCode)
直接将本仓库根目录的 [`AGENTS.md`](AGENTS.md) 复制到项目根目录。

### MCP Server（可选，装确定性探针）

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

## 指令速查 (Commands)

| 指令 | 作用 |
|---|---|
| `/scavenger` | 清道夫状态与主菜单交互 |
| `/scavenger-audit` | 全仓五路深度扫描（P0 渲染损坏 / P1 真相分裂 / P2 漂移 / P3 死代码），出具带证据清单 |
| `/scavenger-refactor` | 安全重构引擎（基线测试保护 -> 极简重构 -> 物理拔除旧实现 -> 杜绝平行文件） |
| `/scavenger-plan` | 新需求防腐（存量资产查重三问 -> 锁死 Blast Radius 改动半径） |
| `/scavenger-clean` | 零引用死代码 & 注释尸骸定向拔除 |

> *注：在 Cursor / Windsurf / Copilot 等对话框中，直接说「清道夫扫一下」、「做需求别写屎山」或「帮我安全重构」亦可直接唤醒。*

---

## 双模式架构

### 模式 A：防腐开发与安全重构模式 (Build & Refactor)
当你要加新功能或重构已有模块时触发：
1. **存量查重三问**：写代码前必先 grep 全局是否有类似 Utils/UI/Store，严禁造重复轮子。
2. **基线测试守护**：重构前测试必须全绿；若无测试，必须先补 1~2 个最小金标准用例（Characterization Test）锁死契约。
3. **极简实现 (/simplify)**：强制使用 Early Return 消除嵌套地狱，所有样式百分百引用 Token，拒绝过度工程。
4. **原子替换与彻底灭骸**：严禁创建 `ServiceV2` 等平行文件；新逻辑就绪的同时物理删除旧实现，**严禁使用注释保留旧代码尸骸**。
5. **验证与打疫苗**：编译测试全绿，提炼负向约束自动反哺 `CLAUDE.md` 的 `## Things Claude gets wrong`。

配套模版：[`templates/safe-refactor-protocol.md`](templates/safe-refactor-protocol.md) 与 [`templates/feature-spec-template.md`](templates/feature-spec-template.md)。

### 模式 B：清道夫巡检审计模式 (Audit & Sweeper)
当你连续迭代数周，或刚完成一次大改版时触发：

| # | 扫什么 | 级别 | 一句话判据 |
|---|---|---|---|
| ① | **渲染损坏** | **P0** | 浏览器真实点开弹窗/极端态，遮罩丢失/错位/死按钮（不靠读代码猜） |
| ② | **真相分裂** | **P1** | 同一件事将来要改，得改几处？>1 就是（平行实现/双写状态） |
| ③ | **漂移** | **P2** | 硬编码十六进制色/魔法数脱离 token、黑话文案、假注释 |
| ④ | **死代码** | **P3** | 零引用的文件与导出、迭代残骸、大段注释尸骸 |
| ⑤ | **陈旧产物** | **P3** | 一次性脚本、临时报告、废弃 Mock、过期文档 |

产出带绝对证据（`文件:行 / 截图 / grep 输出`）的分级报告。**用户不点头，绝不动代码**。

---

## MCP Server：零依赖的确定性探针

[`mcp/`](mcp/) 目录是一个原生 Node.js MCP 服务端——**零外部依赖，Node >= 18 即开即用**，为 AI 助手装备四个确定性扫描工具：

| 工具 | 覆盖 | 说明 |
|---|---|---|
| `scavenger_scan_token_drift` | P2 | 硬编码 Hex / rgb() 颜色扫描：6/8 位高置信直报，3/4 位需行内颜色上下文佐证（不误报 `#feed` 这类 CSS 选择器）；跳过的 Token 定义文件在报告中公示 |
| `scavenger_scan_dead_code` | P3 | 零引用导出符号 + 连续注释尸骸；同文件内使用的导出不误判；全库一次性拼接比对，12 万行级仓库也跑得动 |
| `scavenger_check_truth_split` | P1 | 指定符号的平行定义检测（输入已做正则转义，传带签名的函数名也不会炸） |
| `scavenger_generate_audit_report` | P2+P3 | 综合巡检速报；P0/P1 显式标注未覆盖，由 agent 按五路扫描补扫 |

**盲区诚实声明**（详见 [`mcp/README.md`](mcp/README.md)）：死代码扫描只覆盖导出符号（非导出死变量请互补 ESLint `no-unused-vars`）；引用判定基于词边界匹配，宁可漏报不误杀；P0 渲染损坏与 P1 真相分裂由 agent 执行，server 不虚报覆盖。

---

## 实战绩例

来自一次真实审计（约 12 万行的 AI 写作工具，全栈，连续迭代两个月后）：

> 22 个弹窗逐一真实点开 + 全仓扫描，19 张截图存证：
>
> - **P0 ×2**：两个弹窗渲染彻底损坏（建书向导无遮罩不居中、标题重复渲染两遍；书籍预览 dialog 丢样式内联压住榜单）——之前没有任何人发现，因为没人逐个点过。
> - **P1 ×1**：聊天检索自己复制了一套信任逻辑，绕过了共享投影——用户在对话里看到「基于事实」的无据引用。
> - **P2**：三个品牌色系并存（默认绿 / 自定义暖棕 / 粉红），每个新页面随机站队。
> - **P3**：约 725 行零引用死代码（4 个文件，都是上一版迭代的残骸）、0 字空版本条目、写着「已下线」但还在跑的假注释。

*P1 那一条修复后成为后续 8 个逻辑缺陷修复的入口——真相分裂不清理，bug 会一直从同一个地方长出来。*

---

## 工程质量

工具自身的质量是信条，不是口号：

- **测试 10/10 通过**（`npm test`）：协议握手、四个工具全链路、外加 4 个回归用例——每个曾实测复现的 bug 都被回归测试永久锁定；
- **吃狗粮**：清道夫定期扫自己。v1.0.1 就是被自审发现的问题（版本号三处真相分裂、工具描述虚报覆盖范围、定义未用的死正则）驱动的一次自我清扫，修复全部公开在提交历史里；
- **零依赖**：MCP server 单文件、原生 Node，无 `node_modules`，无供应链面；
- **快**：扫描采用全库一次性拼接比对，测试套件 233ms 跑完。

---

## 与 ponytail 的天作之合

如果你知道 [ponytail](https://github.com/dietrichgebert/ponytail)：

```
┌─────────────────────────────────┐       ┌─────────────────────────────────┐
│        ponytail (决策梯子)       │       │         清道夫 (scavenger)      │
│            【管少生】            │   +   │          【管防腐与善杀】         │
│  能用原生的别引包、能一行的别写类 │       │  查重优先、零平行文件、灭绝技术债 │
└─────────────────────────────────┘       └─────────────────────────────────┘
```

* **ponytail** 管进嘴的：控制生成欲望，写最克制精简的代码；
* **清道夫 (scavenger)** 管排毒的：锁死单一真相源，重构杜绝双写平行宇宙，大改版全量清算死代码与破损 UI。

二者搭配，AI 编程真正具备了工业级防腐能力。

---

## 包含的开箱即用资产

- [`mcp/`](mcp/)：零依赖原生 MCP Server，死代码 / Token 漂移 / 真相分裂自动化探针。
- [`SKILL.md`](SKILL.md)：核心执行 Skill，包含指令体系、双模式引擎、五路扫描启发式与反哺闭环。
- [`AGENTS.md`](AGENTS.md)：现代智能体统一规范入口。
- [`INSTALL.md`](INSTALL.md)：覆盖 Claude Code、Cursor、Windsurf、Copilot、Cline、Antigravity 的配置指南。
- [`templates/safe-refactor-protocol.md`](templates/safe-refactor-protocol.md)：安全重构协议模版。
- [`templates/feature-spec-template.md`](templates/feature-spec-template.md)：提新需求防膨胀模版。
- [`templates/CLAUDE.md.template`](templates/CLAUDE.md.template)：防屎山工程守护模版。
- [`rules/`](rules/)：预置的 `.cursorrules`、`.windsurfrules`、`copilot-instructions.md`、`.clinerules` 规则适配器。
- [`examples/audit-report-example.md`](examples/audit-report-example.md)：真实全量脱敏审计报告。

---

## License

[MIT](LICENSE)
