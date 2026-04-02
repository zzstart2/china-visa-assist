# SPRINT — M签 Demo 重构

> **目标**：重构签证辅助申请系统，实现 M签完整流程  
> **优先级**：P0 > P1 > P2 > P3  
> **状态**：🚀 进行中

---

## P0：数据结构重构（基础，其他任务依赖它）

### 任务：定义 CCNA 申请表核心数据结构

**背景**：当前 VisaContext 只有零散字段，缺少贯穿全程的完整申请表数据结构。申请表是整个系统的核心——Step2 预填、Step3 补填、Step4 展示、Step5 导出，都围绕这一个数据结构。

**要求**：
1. 在 `client/src/types/` 新建 `application.ts`，定义完整的 M签 CCNA 申请表 interface
   - 9 个 Section 对应的字段（参考 `CCNA-SPEC.md`）
   - 每个字段包含：值（value）、来源（source: 'ocr' | 'chat' | 'manual' | null）、是否已填（filled: boolean）
2. 重构 `VisaContext`，以申请表为核心状态
   - `application: ApplicationForm`（完整申请表）
   - `updateField(section, field, value, source)` 方法
   - `getUnfilledFields()` 方法（Step3 用来决定问哪些问题）
   - `getFilledPercentage()` 方法（进度展示）
3. 保持向后兼容：现有的 visaType、extractedPassport 等保留

**参考文档**：`CCNA-SPEC.md` 的 Section 1-9 字段定义

**验收标准**：
- `npm run build` 零错误
- ApplicationForm interface 覆盖 CCNA 9 个 Section
- VisaContext 新增 updateField / getUnfilledFields / getFilledPercentage
- 无 `any` 类型

---

## P1：Step1 改造（M签 only + 语言选择）

### 任务：简化 Step1，M签专用 + 开始前选语言

**要求**：
1. 进入 Step1 时，**首先显示语言选择**（中文 / English），选择后设置 i18n 语言
2. 语言选择后进入签证问询流程
3. **去掉 G签和旅游签选项**——只保留 M签（商务签）路径
4. M签问询精简：确认是商务目的 → 确认入境次数和停留时间 → 进入 Step2
5. 问询结果写入 ApplicationForm 对应字段

**验收标准**：
- 首屏是语言选择（两个按钮）
- 选完语言后只有商务签一条路径
- 不再出现 Transit / Tourism 选项
- visaType 固定为 'M'

---

## P2：Step2 改造（材料清单 + Mock OCR 预填）

### 任务：材料上传重构，增加清单管理和 OCR 预填

**要求**：
1. 定义 M签必须材料清单（参考 `docs/visa-demo-spec.md` Section 2.1 + 2.2）：
   - ✅ 必须：护照首页、申请照片、商务邀请函
   - ⚠️ 条件：居留证明（非菲公民）、原中国签证（曾获签）、未成年材料
   - 📎 可选：银行存款证明、在职证明等
2. 显示材料清单，每项有状态：未上传 / 已上传 / 已验证 ✅ / 验证失败 ❌
3. 用户批量上传文件后，**Mock 分类**（假设完美识别每个文件对应哪个材料）
4. **Mock OCR 提取**后，将识别结果**写入 ApplicationForm**（调用 updateField）
   - 护照 → 预填姓名、护照号、国籍、出生日期、签发日期、有效期、性别
   - 邀请函 → 预填邀请公司、地址、电话
5. 必须材料全部"已验证"后，才能点"下一步"
6. 规则校验模块**预留接口**：`validateDocument(docType, ocrResult) → ValidationResult`，当前 Mock 永远返回通过

**验收标准**：
- 页面显示材料清单 + 上传状态
- 上传后自动"分类"和"验证"（Mock）
- OCR 结果预填到 ApplicationForm
- 必须材料全通过才能继续
- `npm run build` 零错误

---

## P3：Step3 改造（接真实大模型）

### 任务：对话式填表接入 MiniMax 大模型

**要求**：
1. Step3 启动时，调用 `getUnfilledFields()` 获取未填字段列表
2. 后端新增 `/api/chat/ai` 接口，接入 MiniMax API：
   - System prompt 包含：当前申请表状态（哪些已填、哪些未填）、CCNA 字段定义、校验规则
   - AI 逐个引导用户填写未填字段
   - 用户回答后，AI 提取结构化信息，调用 updateField 更新申请表
3. 每次填写后，前端实时更新左侧 Section 进度
4. 规则校验**预留接口**：`validateField(section, field, value) → ValidationResult`，当前 Mock 永远通过
5. 所有必填字段填完后，显示"填写完成"并可进入 Step4

**MiniMax 授权**：使用阿哲的 MiniMax coding plan（API key 待提供）

**验收标准**：
- AI 只问未填的字段（已被 OCR 预填的跳过）
- 用户回答后实时更新 ApplicationForm
- 左侧 Section 进度实时变化
- 全部填完可进入 Step4
- `npm run build` 零错误

---

## 依赖关系

```
P0（数据结构）→ P1（Step1）
              → P2（Step2，依赖 updateField）
              → P3（Step3，依赖 getUnfilledFields + updateField）
```

P1 和 P2 可以并行（都依赖 P0）。P3 依赖 P0 + P2（需要预填数据）。
