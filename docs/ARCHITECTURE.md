# ARCHITECTURE.md — 系统架构

## 总体结构

```
china-visa-assist/
├── client/              # React 前端 SPA
│   ├── src/
│   │   ├── types/       # ← 新增：共享类型定义
│   │   ├── constants/   # ← 新增：共享常量
│   │   ├── context/     # 全局状态管理
│   │   ├── i18n/        # 国际化
│   │   ├── components/  # 通用组件
│   │   ├── pages/       # 页面（5 Step + step4 子组件）
│   │   └── layout/      # 布局
│   └── package.json
├── server/              # Express Mock 后端
│   └── src/
│       └── index.ts     # 所有路由 + Mock 数据
├── docs/                # 规格文档（系统的源头真相）
│   ├── visa-demo-spec.md     # 交互流程 PRD
│   ├── visa-ccna-form-prd.md # CCNA 表单字段
│   ├── ARCHITECTURE.md       # 本文档
│   ├── CONVENTIONS.md        # 编码约定
│   └── QUALITY.md            # 质量评分
├── AGENTS.md            # 仓库入口（目录式，~60行）
├── CCNA-SPEC.md         # 完整 CCNA 字段规格
├── PROJECT-STATUS.md    # 项目状态快照
└── README.md
```

## 依赖方向（强制）

```
types → constants → context → i18n → components → pages → layout
  ↑                                                        │
  └────────────────── 不可反向 ─────────────────────────────┘
```

### 规则

1. **types/** 是零依赖层，只导出 TypeScript 接口和类型
2. **constants/** 只依赖 types/，存放国家列表、选项枚举等
3. **context/** 定义 VisaContext，依赖 types/
4. **components/** 是通用 UI 组件，可以依赖 types + context + i18n
5. **pages/** 是业务页面，可以依赖一切
6. **pages/ 之间互不依赖**：Step1.tsx 不能 import Step3 的东西
7. **step4/ 子组件** 之间可以共享 step4/ 内的 types.ts 和 constants.ts

### 违规示例

```typescript
// ❌ 错误：组件反向依赖页面
// components/ChatBubble.tsx
import { someHelper } from '../pages/Step3';

// ❌ 错误：页面互相依赖
// pages/Step4.tsx
import { chatState } from './Step3';

// ✅ 正确：共享逻辑提到 types/ 或 components/
// types/visa.ts
export interface FormSection { ... }
```

## 数据流

```
Step1 (选签证类型)
  → VisaContext.visaType
  
Step2 (上传材料)
  → POST /api/upload → Mock OCR 数据
  → VisaContext.extractedPassport

Step3 (对话填表)
  → POST /api/chat/start → 获取问题列表
  → POST /api/chat/reply → 逐题回答
  → VisaContext.formData（⚠️ 当前未实现回流）

Step4 (汇总确认)
  → GET /api/summary → Mock 数据（⚠️ 应改为读 VisaContext）

Step5 (导出)
  → GET /api/export/json 或 /csv
```

## API 路由

| 方法 | 路径 | 用途 | 状态 |
|------|------|------|------|
| POST | /api/visa-type | 签证类型判断 | Mock |
| POST | /api/upload | 材料上传 + OCR | Mock |
| POST | /api/validate-documents | 材料合规校验 | Mock（永远通过） |
| POST | /api/chat/start | 开始对话 | Mock（预定义问题） |
| POST | /api/chat/reply | 对话回复 | Mock（顺序推进） |
| GET | /api/summary | 汇总数据 | Mock |
| GET | /api/export/json | 导出 JSON | Mock |
| GET | /api/export/csv | 导出 CSV | Mock |
| GET | /api/health | 健康检查 | 正常 |

## 关键设计决策

1. **为什么用 Mock 后端**：真实 OCR/AI 引擎由另一团队开发，我们只负责前端 Demo + Mock API shell
2. **为什么用 React Context 而不是 Redux**：Demo 规模不大，Context 够用，避免过度工程化
3. **为什么 Step3 用预定义问题而不是自由对话**：Mock 阶段用固定问题流保证可演示性，真实场景接大模型
