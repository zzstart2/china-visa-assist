# China Visa Application Assistant — 项目状态文档

> **最后更新**：2026-04-02  
> **仓库**：https://github.com/zzstart2/china-visa-assist  
> **目标交付**：2026年4月底（五一前 Demo 演示）

---

## 一、项目概述

为菲律宾马尼拉中国签证申请中心（CVASC）开发的 **AI 辅助签证申请系统 Demo**。申请人通过 5 步流程完成签证信息填写，系统辅助校验并输出结构化数据。

**Demo 范围**：
- **M 签**（商务签）— 完整流程
- **G 签**（过境签）— 完整流程

**不包含**：账号系统、数据持久化、真实 OCR/AI 引擎、自动填表脚本

---

## 二、技术栈

| 层 | 技术 | 说明 |
|---|------|------|
| 前端 | React 19 + TypeScript + Vite 8 | SPA，react-router-dom v7 |
| 后端 | Express 4 + TypeScript | Mock API，返回固定假数据 |
| 状态管理 | React Context（VisaContext） | visaType / formData / extractedPassport 等 |
| 国际化 | 自研 I18nContext + translations.ts | 中英双语，967 行翻译文件 |
| 部署 | 本机开发服务器 | 前端 :5173 / :80，后端 :3001 |

---

## 三、项目结构

```
china-visa-assist/
├── client/                          # React 前端
│   └── src/
│       ├── components/              # 通用组件
│       │   ├── ChatBubble.tsx       # 聊天气泡（AI/User 双角色）
│       │   ├── FileUploader.tsx     # 文件上传组件
│       │   ├── FormField.tsx        # 表单字段通用组件
│       │   ├── QuestionCard.tsx     # 问题卡片
│       │   ├── SectionNav.tsx       # Step4 左侧 Section 导航
│       │   └── StepProgress.tsx     # 顶部 5 步进度条
│       ├── context/
│       │   └── VisaContext.tsx       # 全局状态（签证类型、表单数据等）
│       ├── i18n/
│       │   ├── I18nContext.tsx       # 国际化上下文
│       │   └── translations.ts      # 中英翻译（967行）
│       ├── layout/
│       │   └── Layout.tsx           # 全局布局（顶栏 + 语言切换）
│       └── pages/
│           ├── Home.tsx             # 首页（项目介绍 + 开始按钮）
│           ├── Step1.tsx            # 签证类型分流（对话式选择）
│           ├── Step2.tsx            # 材料上传 + OCR（Mock）
│           ├── Step3.tsx            # 对话式信息收集
│           ├── Step4.tsx            # 信息汇总确认（9 Section 表单）
│           ├── Step5.tsx            # 数据导出（JSON/CSV）
│           └── step4/
│               ├── Section1-9.tsx   # Step4 的 9 个表单 Section
│               ├── constants.ts     # 国家列表等常量（仅 fe 分支）
│               └── types.ts         # 类型定义（仅 fe 分支）
├── server/                          # Express Mock 后端
│   └── src/
│       └── index.ts                 # 所有 API 路由 + Mock 数据
├── docs/
│   ├── visa-demo-spec.md            # 交互流程 PRD（v1.1）
│   └── visa-ccna-form-prd.md        # CCNA 表单字段 PRD
├── CCNA-SPEC.md                     # CCNA 9 Section 完整字段规格
├── INTERACTION-SPEC.md              # 交互流程详细说明
├── AGENTS.md                        # Agent 开发上下文
└── README.md                        # 项目说明
```

---

## 四、5 步流程实现状态

### Step 1：签证类型分流 ✅ 完成

- **交互方式**：对话式 UI（ChatBubble），AI 提问 + 用户点选按钮
- **逻辑**：固定决策树，不使用大模型
- **支持**：商务 → M 签、过境 → G 签、旅游 → 提示不支持
- **问询轮次**：Q1 确定目的 → Q2 确定入境次数/停留时间 → 显示结果
- **状态**：已完成，含中英文国际化

### Step 2：材料上传 + 合规校验 ✅ 完成（Mock）

- **交互方式**：文件上传区 + 合规结果展示
- **后端**：Mock OCR，上传任意文件返回固定护照数据
- **Mock 数据**：M 签（JUAN DELA CRUZ）和 G 签（MARIA SANTOS）两套
- **提取字段**：familyName, givenName, passportNo, nationality, birthDate, expiryDate, gender
- **状态**：已完成，UI + Mock API 联通

### Step 3：对话式信息收集 ✅ 完成（Mock）

- **交互方式**：左侧 Section 导航 + 右侧聊天区
- **后端**：预定义问题列表，M 签 40 题 / G 签 17 题
- **问题类型**：text（文本输入）、select（单选）、date（日期选择器）
- **进度条**：实时显示 Section 完成进度
- **覆盖 9 Section**：个人信息、护照、旅行、联系方式、教育工作、历史访华、邀请方、住宿、紧急联系人+声明
- **状态**：已完成，聊天流程跑通

### Step 4：信息汇总确认 ✅ 完成

- **交互方式**：左侧 Section 导航 + 右侧表单展示
- **9 个 Section 组件**：每个 Section 对应 CCNA 表单结构
- **字段展示**：只读模式，展示从 Step 2 OCR + Step 3 对话收集的数据
- **状态**：已完成，9 个 Section 全部有 UI

### Step 5：结构化数据导出 ✅ 完成

- **导出格式**：JSON + CSV
- **API**：`/api/export/json` 和 `/api/export/csv`
- **状态**：已完成

---

## 五、各工作区状态（多 Agent 协作）

项目使用 OpenClaw 多 Agent 开发体系，存在 3 个工作副本：

| 工作区 | 路径 | Agent | 说明 |
|--------|------|-------|------|
| **visa-demo** | workspace-pm/projects/visa-demo/ | 小P（PM） | Git 仓库，已推送到 GitHub |
| **visa-demo-server** | workspace-pm/projects/visa-demo-server/ | 小P/小后 | Git 仓库 + 未提交的 UI 改进（19 文件 +1471/-611 行） |
| **workspace-fe/client** | workspace-fe/client/ | 小前（FE） | 非 Git，独立开发的前端，当前运行在 :80 |

### 关键差异

1. **visa-demo-server** 有大量未提交的改动（UI 优化、Step3/Step4 全面改进、i18n 翻译扩展），需要提交
2. **workspace-fe** 的 Section5（Family Information）远比 server 版详细（433 行 vs 168 行），含配偶/父母/子女动态子表单
3. **workspace-fe** 缺少 Section6-9，Step5 只是占位符
4. **workspace-fe** 没有 i18n（I18nContext），没有 Section6-9

### ⚠️ 需要统一的分歧

- Section5 的详细实现（workspace-fe 版本更完整）应合并回 server 版
- workspace-fe 的 constants.ts / types.ts 抽象更好，应采纳
- 最终应以一个仓库为准

---

## 六、已实现的功能特性

### ✅ 已完成

| 功能 | 说明 |
|------|------|
| 5 步完整流程 | 从首页到导出全流程可走通 |
| 中英双语 i18n | 967 行翻译，覆盖所有 5 步 + 组件 |
| 对话式 UI | ChatBubble 组件，AI/User 角色区分 |
| Section 导航 | Step3/Step4 左侧导航 + 进度指示 |
| Mock 后端 | M 签 + G 签两套完整假数据 |
| 路由 | react-router-dom v7，/step/1-5 |
| 全局状态 | VisaContext 管理签证类型、表单数据、OCR 数据 |
| 响应式布局 | 基础响应式 CSS |

### ⚠️ Mock / 占位（需接真实服务）

| 功能 | 当前状态 | 接入需求 |
|------|----------|----------|
| OCR 识别 | 返回固定假数据 | 接真实 OCR API（护照 MRZ 解析） |
| 材料合规校验 | 永远返回通过 | 接校验引擎（护照有效期、照片规格等） |
| 对话式填表 | 预定义问题列表 | 接大模型对话引擎（自然语言理解 + 字段提取） |
| 实时校验 | 无 | 接校验引擎（身份比对、行程逻辑、职业敏感词等） |
| 数据持久化 | 无 | 接数据库（如需保存中途进度） |

---

## 七、已知问题 & Tech Debt

| # | 问题 | 优先级 | 说明 |
|---|------|--------|------|
| 1 | 多工作区代码分裂 | 🔴 高 | 3 个副本不同步，需统一为 1 个源码 |
| 2 | 19 个文件未提交 | 🔴 高 | visa-demo-server 的 UI 改进需提交推送 |
| 3 | Step4 表单数据未回流 | 🟡 中 | Step3 收集的数据未传递到 Step4 展示（Step4 目前用 Mock 数据） |
| 4 | Step3 → Step4 数据衔接 | 🟡 中 | 用户在 Step3 填的数据应合并进 VisaContext 传递 |
| 5 | Section5 详细度不一致 | 🟡 中 | FE 版有配偶/父母/子女子表单，Server 版只有基础字段 |
| 6 | G 签 Section6 字段偏移 | 🟡 中 | G 签的过境信息（departureCity, flightNo）挂在 section6 但 UI 布局未适配 |
| 7 | Step5 导出永远是 M 签数据 | 🟢 低 | `/api/export` 不根据 session 区分签证类型 |
| 8 | 无错误处理 / 加载状态 | 🟢 低 | API 失败时无友好提示 |
| 9 | Step1 语言切换不刷新对话 | 🟢 低 | 已通过 useEffect 依赖修复，但切换语言后需重新开始 |

---

## 八、PRD 需求 vs 实现对照

基于 `docs/visa-demo-spec.md` 和 `CCNA-SPEC.md` 的需求对照：

| PRD 需求 | 实现状态 | 差距 |
|----------|----------|------|
| Step1 固定分流（不用大模型） | ✅ 完全匹配 | — |
| Step2 护照 OCR + 照片合规 | ⚠️ Mock | 需接真实 OCR |
| Step2 条件触发校验（居留证明、未成年人材料等） | ❌ 未实现 | 需按 PRD 条件逻辑实现 |
| Step2 M 签专项材料（商务邀请函校验） | ❌ 未实现 | Mock 状态 |
| Step3 大模型对话式填表 | ⚠️ Mock（预定义问题） | 需接大模型 |
| Step3 随填随审校验 | ❌ 未实现 | PRD 定义了 7 类校验规则 |
| Step4 9-Section CCNA 表单完整展示 | ⚠️ 部分完成 | Section1-5 较完整，Section6-9 较简略 |
| Step5 JSON/CSV 导出 | ✅ 完成 | — |
| CCNA 表单 9 Section 完整字段 | ⚠️ 部分 | Section1 最完整，其他 Section 字段不全 |

---

## 九、下一步迭代建议

### P0 — 代码统一 & 推送（立即）

1. 将 visa-demo-server 的未提交改动 commit + push
2. 决定以哪个工作区为源码基准（建议 visa-demo-server）
3. 将 workspace-fe 的 Section5 详细实现合并回来
4. 清理重复工作区

### P1 — 数据流打通（1-2 天）

5. Step3 对话收集的数据写入 VisaContext.formData
6. Step4 从 VisaContext 读取数据展示（而不是 Mock API）
7. Step5 导出 VisaContext 中的实际数据

### P2 — 表单完善（2-3 天）

8. 按 CCNA-SPEC.md 补全 Section1-9 所有字段
9. 字段校验（必填、格式）
10. 条件触发逻辑（"是否有其他国籍" → 展开子表单）

### P3 — 真实服务接入（待另一团队）

11. 接入真实 OCR API
12. 接入大模型对话引擎
13. 接入校验引擎

---

## 十、开发环境

```bash
# 克隆仓库
git clone https://github.com/zzstart2/china-visa-assist.git
cd china-visa-assist

# 启动后端 Mock 服务（端口 3001）
cd server && npm install && npm run dev

# 启动前端开发服务器（端口 5173）
cd client && npm install && npm run dev

# 访问
open http://localhost:5173
```

### 环境要求
- Node.js ≥ 22
- npm ≥ 10

---

## 十一、Git 提交历史

```
058970b fix: Step1 useEffect dep [t]→[] prevents flow reset on re-render
623226b sync: pull Step1 state machine rewrite from deploy server
4f2c2d6 feat: full i18n coverage for all 5 steps
5ebb30e fix: remove unused lang import in Step3
92c6e85 fix: Step3 i18n + chat stuck bug
94a8d04 feat: add Chinese/English language toggle (i18n)
5bf180a fix: remove invalid CSS import in Section1
2c1caa1 fix: Step5 type errors for passportInfo fields
33da360 P3: Step 4 (9-section summary form) + Step 5 (data export)
7b15893 P2: Step 3 dialog-based form filling
fde524f P1: Step 1 visa type routing + Step 2 document upload
ac3facb P0: project setup - React+TS frontend + Express mock backend
```

---

*本文档用于项目交接和迭代续接。任何人（或 Agent）拿到本文档 + 仓库源码 + docs/ 目录下的 PRD，即可理解当前状态并继续开发。*
