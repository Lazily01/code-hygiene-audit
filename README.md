<h1 align="center">清道夫 · scavenger</h1>

<p align="center"><em>让屎山代码活不过一个迭代。</em><br>
<sub>Shit mountains die young here.</sub></p>

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

## 极速安装 (1 分钟)

无论你用什么工具，都能一键接入。完整多工具配置详见 **[INSTALL.md](INSTALL.md)**。

### Claude Code
```bash
# 全局用户级（推荐）
git clone https://github.com/Lazily01/code-hygiene-audit.git ~/.claude/skills/scavenger
```

### Cursor
将本仓库的 [`rules/.cursorrules`](rules/.cursorrules) 复制到你项目的根目录 `.cursorrules`（或 `.cursor/rules/scavenger.mdc`）。

### Windsurf
将本仓库的 [`rules/.windsurfrules`](rules/.windsurfrules) 复制到项目根目录 `.windsurfrules`。

### GitHub Copilot
将本仓库的 [`rules/copilot-instructions.md`](rules/copilot-instructions.md) 复制到项目根目录 `.github/copilot-instructions.md`。

### Antigravity / Gemini CLI
```bash
git clone https://github.com/Lazily01/code-hygiene-audit.git ~/.gemini/config/skills/scavenger
```

### 任何其他 Agent (Codex, Devin, OpenCode)
直接将本仓库根目录的 [`AGENTS.md`](AGENTS.md) 复制到项目根目录。

---

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

---

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

## 包含的开箱即用资产

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

MIT
