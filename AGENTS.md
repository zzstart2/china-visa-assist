# AGENTS.md — 签证辅助申请系统

> 这是仓库的入口文档。**先读这里，再按指引找深层文档。**

## 项目一句话

菲律宾马尼拉 CVASC 的 AI 辅助签证申请系统 Demo（M签 + G签）。

## 快速导航

| 需要了解 | 去哪里看 |
|----------|----------|
| 项目当前状态、进度、已知问题 | [PROJECT-STATUS.md](./PROJECT-STATUS.md) |
| 交互流程 PRD（5 步流程详细说明） | [docs/visa-demo-spec.md](./docs/visa-demo-spec.md) |
| CCNA 表单字段规格（9 Section） | [CCNA-SPEC.md](./CCNA-SPEC.md) |
| 架构约束 & 分层规则 | [docs/ARCHITECTURE.md](./docs/ARCHITECTURE.md) |
| 前端代码规范 | [docs/CONVENTIONS.md](./docs/CONVENTIONS.md) |
| 已知技术债 & 质量评分 | [docs/QUALITY.md](./docs/QUALITY.md) |

## 技术栈

- **前端**：React 19 + TypeScript + Vite 8（`client/`）
- **后端**：Express 4 + TypeScript（`server/`），当前全部 Mock
- **路由**：react-router-dom v7
- **状态**：React Context（VisaContext）
- **国际化**：自研 I18nContext（中英双语）

## 架构分层（强制）

```
client/src/
├── types/          # 类型定义（只依赖自身）
├── constants/      # 常量、枚举（只依赖 types）
├── context/        # 全局状态（依赖 types）
├── i18n/           # 国际化（依赖 types）
├── components/     # 通用 UI 组件（依赖 types + context + i18n）
├── pages/          # 页面组件（依赖以上所有）
│   └── step4/      # Step4 子组件
└── layout/         # 布局组件（依赖 components）
```

**规则**：
1. **单向依赖**：只能依赖同层或上方的层，不能反向依赖
2. **pages/ 不互相导入**：Step1 不能 import Step3 的东西
3. **共享逻辑提升**：如果两个 page 需要同一个 helper，提到 components/ 或 types/
4. **Mock 数据集中**：所有 Mock 数据在 `server/src/index.ts`，前端不硬编码假数据

## 编码约定（概要）

- 所有用户可见文案用 `t()` 国际化函数
- CSS 变量管理主题色，不硬编码颜色值
- 组件文件名 PascalCase，工具文件 camelCase
- 每个组件配套 `.css` 文件，不用内联 style（布局微调除外）
- TypeScript strict mode，不用 `any`

详见 [docs/CONVENTIONS.md](./docs/CONVENTIONS.md)。

## 开发环境

```bash
# 后端（端口 3001）
cd server && npm install && npm run dev

# 前端（端口 5173）
cd client && npm install && npm run dev
```

## Git 规范

- commit message 格式：`type: description`
- type 可选：feat / fix / docs / style / refactor / test / chore
- 一个 PR 做一件事，不混杂无关改动
- 提交前必须 `npm run build` 通过
