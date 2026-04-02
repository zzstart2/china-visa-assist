# China Visa Application Assistant (Demo)

AI-assisted visa application system for Manila CVASC (Chinese Visa Application Service Center).

## Demo Scope

- **M Visa** (Business/Commercial) — 完整流程
- **G Visa** (Transit) — 基础支持

当前为 Demo 版本，所有后端数据为 Mock（OCR、文档分类、表单预填），LLM 问答为可选功能。

---

## Tech Stack

| Layer | Technology | Version |
|-------|-----------|---------|
| Frontend | React + TypeScript + Vite | React 19, Vite 8, TS 5.9 |
| Backend | Express.js + TypeScript | Express 4.18, TS 5.3 |
| Runtime | Node.js | >= 18 (recommended 22) |
| LLM (optional) | MiniMax API (Anthropic Messages format) | MiniMax-M2.5 |

## Prerequisites

- **Node.js** >= 18（推荐 22.x）
- **npm** >= 9
- (可选) MiniMax API Key — 没有也能运行，AI 聊天会 fallback 到静态双语问题

---

## Quick Start

```bash
# 1. 克隆项目
git clone https://github.com/zzstart2/china-visa-assist.git
cd china-visa-assist

# 2. 安装依赖
cd server && npm install && cd ..
cd client && npm install && cd ..

# 3. (可选) 配置环境变量
cp server/.env.example server/.env
# 编辑 server/.env 填入 MINIMAX_API_KEY

# 4. 启动后端 (终端 1)
cd server && npx tsx src/index.ts

# 5. 启动前端 (终端 2)
cd client && npx vite --port 5173
```

打开浏览器访问 **http://localhost:5173**

### 验证服务正常

```bash
curl http://localhost:3001/api/health
# 期望返回: {"status":"ok","timestamp":"..."}
```

---

## Environment Variables

在 `server/` 目录下创建 `.env` 文件：

```bash
# server/.env
MINIMAX_API_KEY=your_key_here    # 可选，MiniMax LLM API key
```

| Variable | Required | Description |
|----------|----------|-------------|
| `MINIMAX_API_KEY` | No | MiniMax LLM API key，用于 Step 3 对话式问答生成。不配置时自动降级为静态双语问题模板，所有功能仍可正常使用。 |

---

## 5-Step Application Flow

| Step | Page | Description | Backend Endpoint |
|------|------|-------------|-----------------|
| 1 | Visa Type | 签证类型判定（M/G） | `POST /api/visa-type` |
| 2 | Upload Documents | 上传文件 + Mock OCR + 合规校验 | `POST /api/upload/batch`, `POST /api/validate/compliance` |
| 3 | Fill Information | AI 对话式表单填写（34+ 字段） | `POST /api/chat/ai` |
| 4 | Review & Confirm | 9 个 Section 表单预览确认 | `GET /api/summary` |
| 5 | Export Data | 导出 JSON/CSV | `GET /api/export/json`, `GET /api/export/csv` |

---

## API Endpoints

### Core Flow

| Method | Path | Description |
|--------|------|-------------|
| `GET` | `/api/health` | 健康检查 |
| `POST` | `/api/visa-type` | 签证类型判定，返回签证类型和所需材料 |
| `POST` | `/api/upload` | 单文件上传 + Mock OCR（legacy） |
| `POST` | `/api/upload/batch` | 批量上传 + Mock OCR + 预填数据 + 待填字段列表 |
| `POST` | `/api/validate-documents` | 文档校验（legacy，始终返回 pass） |
| `POST` | `/api/validate/compliance` | 合规校验：护照有效期、未成年、非菲公民等 6 条规则 |
| `POST` | `/api/validate/field` | 单字段校验：手机号格式、必填项等 20+ 条规则 |
| `POST` | `/api/chat/start` | Legacy 结构化问答开始 |
| `POST` | `/api/chat/reply` | Legacy 结构化问答回复 |
| `POST` | `/api/chat/ai` | AI 对话式问答（支持 MiniMax LLM / 静态降级） |
| `GET` | `/api/summary` | 获取表单汇总数据 |
| `GET` | `/api/export/json` | 导出 JSON 文件 |
| `GET` | `/api/export/csv` | 导出 CSV 文件 |

### Request/Response Examples

**POST /api/chat/ai — 启动会话**
```json
// Request
{ "pendingFields": ["section5.currentAddress", "section5.phone"], "language": "en" }

// Response
{ "sessionId": "ai_xxx", "field": "section5.currentAddress", "question": "What is your current home address?", "type": "text", "progress": 0, "totalFields": 2 }
```

**POST /api/chat/ai — 回复问题**
```json
// Request
{ "sessionId": "ai_xxx", "field": "section5.phone", "value": "09171234567" }

// Response
{ "done": true, "formData": { "section5.phone": "09171234567" }, "progress": 100, "validation": { "status": "pass", "message": "" } }
```

**POST /api/validate/compliance**
```json
// Request
{ "prefillData": { "section1": { "passportExpiry": { "year": "2025", "month": "06", "day": "01" } } } }

// Response
{ "success": false, "warnings": [{ "field": "section1.passportExpiry", "level": "error", "messageEn": "Passport expires on 2025-06-01...", "messageZh": "护照有效期至 2025-06-01..." }] }
```

---

## Project Structure

```
china-visa-assist/
├── client/                          # React Frontend
│   ├── src/
│   │   ├── pages/                   #   Step1 ~ Step5 页面组件
│   │   ├── pages/step4/             #   Step4 的 9 个 Section 子组件
│   │   ├── components/              #   公共组件
│   │   ├── context/VisaContext.tsx   #   全局状态管理
│   │   ├── types/application.ts     #   表单类型定义（9 Section, 100+ fields）
│   │   ├── constants/formDefaults.ts #   表单默认值工厂
│   │   ├── i18n/translations.ts     #   中英双语翻译
│   │   └── layout/Layout.tsx        #   页面布局 + 进度导航
│   └── vite.config.ts               #   Vite 配置（含 /api 代理到 3001）
│
├── server/                          # Express Backend
│   ├── src/
│   │   ├── index.ts                 #   入口（~24 行）：env, routes, listen
│   │   ├── app.ts                   #   Express app + CORS/JSON 中间件
│   │   ├── types.ts                 #   共享接口定义
│   │   ├── data/
│   │   │   ├── mockData.ts          #   Mock OCR 数据（M/G 签菲律宾申请人）
│   │   │   ├── questionBanks.ts     #   Legacy 问题库（M 签 40 题 / G 签 17 题）
│   │   │   └── fieldMeta.ts         #   字段元数据（60+ 字段双语标签 + 输入类型）
│   │   ├── validation/
│   │   │   ├── types.ts             #   FieldRule / ComplianceRule 接口
│   │   │   ├── fieldRules.ts        #   字段校验规则数组（8 条规则, 20+ 字段）
│   │   │   ├── complianceRules.ts   #   合规校验规则数组（6 条规则）
│   │   │   └── index.ts             #   引擎：runFieldValidation / runComplianceValidation
│   │   ├── services/
│   │   │   ├── chatSession.ts       #   内存会话存储（扩展点：接 Redis/DB）
│   │   │   └── llm.ts              #   MiniMax LLM 集成（扩展点：换其他 LLM）
│   │   └── routes/
│   │       ├── index.ts             #   路由聚合器 mountRoutes()
│   │       ├── visaType.ts          #   POST /api/visa-type
│   │       ├── upload.ts            #   POST /api/upload, /api/upload/batch
│   │       ├── validate.ts          #   POST /api/validate/*
│   │       ├── chat.ts              #   POST /api/chat/*
│   │       ├── summary.ts           #   GET /api/summary
│   │       └── export.ts            #   GET /api/export/*
│   └── tsconfig.json
│
└── docs/                            # 需求文档
    ├── visa-ccna-form-prd.md        #   CCNA 表单结构 PRD（9 Section 定义）
    ├── visa-demo-spec.md            #   Demo 交互流程说明
    └── ARCHITECTURE.md              #   架构说明
```

---

## Backend Extension Points

当前后端全部使用 Mock 数据，以下是需要替换为真实服务的接入点：

| Mock | File | How to Replace |
|------|------|---------------|
| OCR / 文档分类 | `data/mockData.ts`, `routes/upload.ts` | 替换 `mockBatchPrefill` 为真实 OCR API 调用（如 Azure Form Recognizer, Google Vision） |
| LLM 问答 | `services/llm.ts` | 已支持 MiniMax API；可替换为 OpenAI / Claude / 自有模型，只需改 `generateQuestion()` |
| 会话存储 | `services/chatSession.ts` | 替换内存 Map 为 Redis / PostgreSQL |
| 表单数据持久化 | `routes/summary.ts`, `routes/export.ts` | 当前返回 Mock 数据，需接入数据库存储用户填写结果 |
| 字段校验 | `validation/fieldRules.ts` | 追加 `FieldRule` 对象即可，无需改引擎代码 |
| 合规校验 | `validation/complianceRules.ts` | 追加 `ComplianceRule` 对象即可 |

### 添加校验规则示例

```typescript
// validation/fieldRules.ts — 在数组末尾追加：
{
  match: 'section1.passportNumber',
  validate: ({ value, lang }) => {
    if (!/^[A-Z]\d{7}[A-Z]$/.test(value))
      return { status: 'fail', message: lang === 'zh' ? '护照号格式不正确' : 'Invalid passport number format' };
    return null;
  },
}
```

---

## Build & Deploy

### Production Build

```bash
# 构建前端静态文件
cd client && npm run build    # 输出到 client/dist/

# 构建后端
cd server && npm run build    # 输出到 server/dist/

# 启动生产服务
cd server && node dist/index.js
```

### Deploy Checklist

- [ ] Node.js >= 18 已安装
- [ ] `server/.env` 已配置（至少确认文件存在，MINIMAX_API_KEY 可选）
- [ ] `npm install` 在 server/ 和 client/ 都已执行
- [ ] 前端构建产物 `client/dist/` 由 Nginx 或 CDN 托管
- [ ] 后端端口 3001 已开放（或通过反向代理转发 `/api` 请求）
- [ ] 上传目录 `server/uploads/` 存在且有写权限

### Nginx Reference Config (Production)

```nginx
server {
    listen 80;
    server_name your-domain.com;

    # 前端静态文件
    location / {
        root /path/to/client/dist;
        try_files $uri $uri/ /index.html;
    }

    # API 反向代理
    location /api/ {
        proxy_pass http://127.0.0.1:3001;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

---

## CCNA Form Structure (9 Sections)

完整的表单字段定义见 `client/src/types/application.ts`，概要如下：

| Section | Name | Key Fields |
|---------|------|-----------|
| 1 | Personal Information | 姓名、性别、出生日期、国籍、护照信息（18 fields） |
| 2 | Visa Type & Service | 签证类别、服务类型、入境次数 |
| 3 | Occupation & Work | 职业（17 选项）、工作经历 |
| 4 | Education | 最高学历 |
| 5 | Family & Contact | 地址、电话、父母信息、在华亲属 |
| 6 | Travel Details | 行程、邀请人、紧急联系人、费用承担 |
| 7 | Previous Travel | 是否到访过中国、是否持有其他签证（4 个 Yes/No） |
| 8 | Other Information | 拒签记录、犯罪记录等（11 个 Yes/No） |
| 9 | Declaration | 填表人、声明同意 |

---

## Related Documents

| Document | Path | Description |
|----------|------|-------------|
| CCNA 表单 PRD | `docs/visa-ccna-form-prd.md` | 表单 9 Section 字段定义 + 条件联动规则 + 实现状态标注 |
| 条件联动详情 | `docs/conditional-linkage.md` | 23 个 Flag 完整联动规则（含字段编码、多级嵌套、联动关系图） |
| Demo 交互流程 | `docs/visa-demo-spec.md` | 5 步流程交互说明 |
| 架构说明 | `docs/ARCHITECTURE.md` | 系统架构设计 |
| 表单类型定义 | `client/src/types/application.ts` | TypeScript 类型（100+ fields） |
