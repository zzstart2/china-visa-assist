# CONVENTIONS.md — 编码约定

> Agent 和人类开发者共同遵守。违反约定的代码应在 review 中指出。

## TypeScript

- **严格模式**：`strict: true`，不用 `any`（用 `unknown` + 类型守卫）
- **接口优先**：用 `interface` 定义数据结构，`type` 用于联合类型和工具类型
- **命名**：
  - 组件/类：PascalCase（`ChatBubble.tsx`）
  - 工具函数/hook：camelCase（`useVisa.ts`）
  - 常量：UPPER_SNAKE_CASE（`MAX_FILE_SIZE`）
  - 类型/接口：PascalCase（`VisaState`）
- **导出**：组件用 `export default`，工具函数用命名导出

## React

- **函数组件**：不用 class 组件
- **Hook 规则**：遵守 React Hook 规则（不在条件/循环中调用）
- **State 最小化**：只在 state 中存放不能从其他 state 派生的数据
- **事件处理器命名**：`handle` 前缀（`handleSelect`、`handleSubmit`）

## CSS

- **文件对应**：每个组件一个 `.css` 文件（`Step1.tsx` → `Step1.css`）
- **CSS 变量管理主题色**：在 `index.css` 定义 `--primary`、`--accent` 等，组件中引用
- **不硬编码颜色**：用 `var(--primary)` 而不是 `#2563eb`
- **不用内联 style**：除非是动态计算的布局值
- **class 命名**：kebab-case（`chat-bubble`、`step-progress`）
- **响应式**：移动端优先，`min-width` 媒体查询向上适配

## 国际化（i18n）

- **所有用户可见文案**都走 `t('key')` 函数
- **翻译 key 命名**：`{page}.{section}.{item}`（如 `step1.welcome`、`step3.sec.0`）
- **翻译文件**：`src/i18n/translations.ts`，en 和 zh 两个语言包
- **新增文案**必须同时添加中英文翻译

## 文件大小

- **单文件不超过 300 行**：超过就拆分
- **组件拆分信号**：超过 200 行、或有 3 个以上独立功能块

## Mock 数据

- **所有 Mock 数据集中在 `server/src/index.ts`**
- **前端不硬编码假数据**：通过 API 获取
- **Mock 数据要合理**：用真实格式的菲律宾人名、地址、电话等

## Git

- **commit message 格式**：`type: description`
  - feat：新功能
  - fix：修复
  - docs：文档
  - style：样式（不影响逻辑）
  - refactor：重构
  - test：测试
  - chore：构建/工具
- **提交前**：`npm run build` 必须通过
- **一个 commit 做一件事**

## 验证清单（提交前）

- [ ] `npm run build` 零错误
- [ ] 新增文案有中英文翻译
- [ ] 没有 `any` 类型
- [ ] 没有硬编码颜色值
- [ ] 没有跨层反向依赖
- [ ] 文件不超过 300 行
