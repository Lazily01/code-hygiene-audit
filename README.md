<h1 align="center">code-hygiene-audit</h1>

<p align="center"><em>让垃圾代码活不过一个迭代。</em><br>
<sub>Shit mountains die young here.</sub></p>

<p align="center"><strong>全周期 AI-Native 防屎山清道夫 & 架构守护体系</strong> · 适用于 Claude Code / Antigravity / Cursor 等编码代理</p>

---

## 为什么需要它

屎山的内核不是代码难看，是**真相分裂**——同一件事有两个以上的真相来源：两套配色 token、两套信任逻辑、前端和服务端各算一遍的同一个数字。

AI 编码代理让这个问题以十倍速恶化：**它默认只生不杀、好造平行实现、重构喜欢留旧尸骸、提需求喜欢就地硬编码**。
- 提个新需求：它起手新建一堆重复的工具函数和私有状态，不复用已有资产；
- 搞个重构：它弄出个 `ServiceV2` 平行文件，把旧代码注释掉留着，改出双写灾难；
- 迭代几轮：老版本死代码无人敢删，UI 弹窗错位，视觉色值彻底漂移。

靠嘱咐 AI「别写屎」没有用。有用的是工程机制：**事前防盲生、重构防平行、事后大扫除、踩坑打疫苗**。这个仓库将 Anthropic 官方 [*The AI-Native SDLC Playbook*](https://claude.com/blog/the-ai-native-sdlc-playbook) 的防腐理念固化为开箱即用的 Skill 与工程模板。

---

## 核心能力：双模式架构 (Dual Operational Modes)

本 Skill 根据你的指令上下文，自动在两种工作模式间无缝切换：

### 模式 A：防腐开发与安全重构模式 (Anti-Rot Build & Refactor)
> **触发语句**：*“做个新需求，别写出屎山”*、*“帮我把这段逻辑重构一下”*、*“加个新功能”*。

当 AI 接到开发或重构任务时，强制执行防腐 5 步工作流：
1. **存量查重与划定边界 (Search-First & Blast Radius)**：写代码前必须先全局检索是否已有函数/组件/类型，拒绝造重复轮子；严格锁定只允许改动的白名单文件，禁止改动越界。
2. **基线测试守护 (Baseline Test Guard)**：重构前先跑测试；若目标模块无测试，必须先补 1~2 个最小金标准用例（Golden Master）锁死输入输出契约再动手。
3. **极简实现与反过度工程 (KISS & /simplify)**：杜绝滥用抽象工厂和深层继承；强制使用 Early Return (卫语句) 消除嵌套地狱；严禁硬编码 Hex/数字，百分百对齐 Token。
4. **原子替换与彻底灭骸 (Atomic Swap & Zero Corpse)**：严禁创建 `v2` 平行实现文件；新逻辑写就的同时物理删除旧实现，**严禁使用注释保留旧代码尸骸**。
5. **验证通关与打疫苗**：编译、类型检查、测试全绿；提炼踩坑规则反哺写入 `CLAUDE.md`。

配套模版：[`templates/feature-spec-template.md`](templates/feature-spec-template.md) 与 [`templates/safe-refactor-protocol.md`](templates/safe-refactor-protocol.md)。

---

### 模式 B：清道夫巡检审计模式 (Audit & Sweeper)
> **触发语句**：*“帮我扫扫代码”*、*“清一下屎山”*、*“大改版完了看看留没留垃圾”*、*“查死代码”*。

对项目执行**五路深度扫描**，生成带证据的清单，**用户不点头绝不动代码**：

| # | 扫什么 | 级别 | 一句话判据 |
|---|---|---|---|
| ① | **渲染损坏** | **P0** | 浏览器真实点开弹窗/极端态，遮罩丢失/错位/死按钮（不靠读代码猜） |
| ② | **真相分裂** | **P1** | 同一件事将来要改，得改几处？>1 就是（平行实现/双写状态） |
| ③ | **漂移** | **P2** | 硬编码十六进制色/魔法数脱离 token、黑话文案、假注释 |
| ④ | **死代码** | **P3** | 零引用的文件与导出、迭代残骸、大段注释尸骸 |
| ⑤ | **陈旧产物** | **P3** | 一次性脚本、临时报告、废弃 Mock、过期文档 |

产出带证据（`文件:行 / 截图 / grep 输出`）的分级报告，经你审批后执行原子化拔除。

---

## 包含的开箱即用资产

- [`SKILL.md`](SKILL.md)：核心执行 Skill，包含双模式切换引擎、五路扫描启发式、重构五戒、无头降级保护与反哺机制。
- [`templates/safe-refactor-protocol.md`](templates/safe-refactor-protocol.md)：**【新】安全重构协议模版**，锁死契约、基线测试、杜绝平行文件。
- [`templates/feature-spec-template.md`](templates/feature-spec-template.md)：提新需求专用的防膨胀 Plan 模版，查重优先、锁定改动半径。
- [`templates/CLAUDE.md.template`](templates/CLAUDE.md.template)：任何 GitHub 项目都可直接套用的防屎山工程守护模版（含 `Things Claude gets wrong` 负向约束）。
- [`examples/audit-report-example.md`](examples/audit-report-example.md)：12 万行全栈产品真实脱敏审计报告。

---

## 实战绩例

来自一次真实审计（约 12 万行的 AI 写作工具，全栈，连续迭代两个月后）：

> 22 个弹窗逐一真实点开 + 全仓扫描，19 张截图存证：
>
> - **P0 ×2**：两个弹窗渲染彻底损坏（建书向导无遮罩不居中、标题重复渲染两遍；
>   书籍预览 dialog 丢样式内联压住榜单）——之前没有任何人发现，因为没人逐个点过。
> - **P1 ×1**：聊天检索自己复制了一套信任逻辑，绕过了共享投影——用户在对话里看到「基于事实」的无据引用。
> - **P2**：三个品牌色系并存（默认绿 / 自定义暖棕 / 粉红），每个新页面随机站队。
> - **P3**：约 725 行零引用死代码（4 个文件，都是上一版迭代的残骸）、0 字空版本条目、写着「已下线」但还在跑的假注释。

*P1 那一条修复后成为后续 8 个逻辑缺陷修复的入口——真相分裂不清理，bug 会一直从同一个地方长出来。*

---

## 安装与集成指南

### 1. 将 Skill 安装到你的开发环境

#### Claude Code
```sh
# 全局生效
git clone https://github.com/Lazily01/code-hygiene-audit.git ~/.claude/skills/code-hygiene-audit

# 或仅当前项目生效
git clone https://github.com/Lazily01/code-hygiene-audit.git .claude/skills/code-hygiene-audit
```

#### Antigravity / Gemini CLI
```sh
# 用户级全局生效
git clone https://github.com/Lazily01/code-hygiene-audit.git ~/.gemini/config/skills/code-hygiene-audit

# 或工作区生效
git clone https://github.com/Lazily01/code-hygiene-audit.git .gemini/skills/code-hygiene-audit
```

#### 通用 Agent Skills / Cursor
```sh
git clone https://github.com/Lazily01/code-hygiene-audit.git ~/.agents/skills/code-hygiene-audit
```

### 2. 在任意 GitHub 项目中启用防屎山防护网

1. **部署规则文件**：复制 `templates/CLAUDE.md.template` 到你的项目根目录，命名为 `CLAUDE.md`（或合并入 `.cursorrules` / `.geminirules`）。
2. **提新需求时**：告诉 AI：*“按 `feature-spec-template.md` 先做查重并列出 Plan，锁定范围，不要直接写代码”*。
3. **做代码重构时**：告诉 AI：*“按 `safe-refactor-protocol.md` 执行重构，先跑测试基线，严禁造 v2 平行实现和留注释旧代码”*。
4. **日常周期清理时**：直接说：*“帮我扫扫代码”*、*“清一下屎山”*，或显式触发 `/code-hygiene-audit`。

---

## 搭配使用建议

- **日常小修小补**：配合 Claude Code 内置的 `/simplify` 随时随手消除局部嵌套和冗余代码。
- **做功能 / 大重构**：使用本 Skill 的**模式 A（防腐开发与安全重构）**锁住输入输出与原子替换。
- **周期收尾期**：使用本 Skill 的**模式 B（清道夫巡检审计）**全量盘点与灭绝技术债。

---

## License

MIT
