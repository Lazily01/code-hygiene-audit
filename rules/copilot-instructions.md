# GitHub Copilot Instructions: 清道夫 (Scavenger)
# 将此文件复制到项目根目录的 .github/copilot-instructions.md

Apply the Scavenger (清道夫) engineering hygiene rules:
1. Always search for existing utility functions and UI components before creating new ones.
2. Maintain a single source of truth across all modules. Strictly follow the project design tokens.
3. When refactoring, do NOT create parallel implementations (no `_v2` files). Delete replaced code cleanly instead of commenting it out.
4. When adding features or refactoring, verify behavior with tests and avoid over-engineering.
