# code-hygiene-audit · 代码卫生清道夫

一个 [ZCode](https://zcode.ai) / Claude Code 通用的 Skill：**防屎山清道夫**。

屎山的内核不是烂代码，是**真相分裂**——同一件事有两个以上的真相来源。
AI 默认只生不杀，所以清理必须是机制，不能靠自觉。

这个 Skill 把「清道夫」固化成五路扫描 + 分级清单 + 用户确认后才动手的纪律。

## 五路扫描

1. **真相分裂** — 同一件事将来要改，得改几处？>1 就是。双套 token、平行实现、状态双写。
2. **死代码** — 零引用的文件与导出、迭代残骸、注释尸骸。
3. **死 UI** — 浏览器真实点开弹窗/空态/死按钮，渲染损坏是 P0。
4. **漂移** — 硬编码色/魔法数偏离 token、黑话文案、假注释。
5. **陈旧产物** — 一次性脚本、临时报告、过期文档。

产出 P0→P3 分级清单，每项带证据（文件:行 / 截图 / grep 输出）和一句话修法，
**先报告，等用户点头再动代码**。

## 安装

把本目录复制到技能目录即可（ZCode 与 Claude Code 均可发现）：

```sh
# 用户级（所有项目可用）
git clone https://github.com/Lazily01/code-hygiene-audit.git ~/.agents/skills/code-hygiene-audit
```

触发方式：直接说「帮我扫扫代码」「清一下屎山」「大改版完了看看留没留垃圾」，
或显式调用 `/code-hygiene-audit`。

## 搭配使用

- 写新代码前用 [ponytail-lazy-dev](https://github.com/) 的决策梯子管住「少生」；
- 本 Skill 管「善杀」。一个管进嘴的，一个管排队的。

## License

MIT
