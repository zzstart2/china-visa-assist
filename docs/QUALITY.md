# QUALITY.md — 质量评分

> 每个模块的当前质量评分。Agent 迭代时参考，优先改善低分模块。
> 评分标准：A（生产就绪）/ B（可用但有改进空间）/ C（基础功能）/ D（占位/严重不足）/ F（未实现）

**最后评估**：2026-04-02

## 前端页面

| 模块 | 评分 | 说明 |
|------|------|------|
| Home | B | 功能完整，i18n 覆盖，缺少动画细节 |
| Step1（签证分流） | B+ | 对话式 UI 流畅，i18n 完整，语言切换不刷新对话 |
| Step2（材料上传） | C | 基础上传 UI，Mock OCR，缺条件触发校验 |
| Step3（对话填表） | C+ | 聊天 UI 改进过，但数据未回流 VisaContext |
| Step4（汇总确认） | C | 9 Section 有 UI，但读 Mock API 而非 VisaContext |
| Step5（数据导出） | C- | 基础导出，永远是 M 签数据 |
| step4/Section1 | B- | 字段较完整（215行） |
| step4/Section2 | C | 基础字段（70行） |
| step4/Section3 | C+ | 中等覆盖（130行） |
| step4/Section4 | C | 基础字段（83行） |
| step4/Section5 | C | 基础字段（168行），FE 版本有更完整实现（433行）待合并 |
| step4/Section6 | C- | 基础字段，G签适配不足 |
| step4/Section7 | C- | 基础字段（70行） |
| step4/Section8 | D | 很简略（42行） |
| step4/Section9 | D | 很简略（46行） |

## 通用组件

| 模块 | 评分 | 说明 |
|------|------|------|
| ChatBubble | B | UI 改进过，支持 AI/User 角色 |
| SectionNav | B | 支持进度指示和完成状态 |
| StepProgress | B | 5 步进度条，清晰 |
| FileUploader | C | 基础功能，缺拖拽和预览 |
| FormField | C | 基础表单字段，缺校验反馈 |

## 后端 API

| 模块 | 评分 | 说明 |
|------|------|------|
| Mock 数据完整性 | B | M签+G签两套完整假数据 |
| Chat 会话管理 | C | 内存存储，M签40题/G签17题 |
| 文件上传 | C | 接收文件但不处理 |
| 数据导出 | C- | 不区分签证类型 |

## 基础设施

| 模块 | 评分 | 说明 |
|------|------|------|
| TypeScript 配置 | B | strict mode |
| i18n 覆盖度 | B+ | 967 行翻译，基本全覆盖 |
| 测试 | F | 无任何测试 |
| CI/CD | F | 无 GitHub Actions |
| Linter | D | 只有 ESLint 默认配置，无自定义规则 |
| 架构约束检查 | F | 无机械化强制（需新增） |
| 文档新鲜度 | B | 刚更新，但无自动检查机制 |

## 技术债清单

| # | 描述 | 影响 | 优先级 |
|---|------|------|--------|
| TD-1 | 无测试覆盖 | 改代码没有安全网 | 🔴 高 |
| TD-2 | Step3 数据不回流 VisaContext | Step4/5 无法用真实数据 | 🔴 高 |
| TD-3 | 无 CI pipeline | 合并破坏性变更无感知 | 🟡 中 |
| TD-4 | Section5-9 字段不完整 | Demo 展示薄弱 | 🟡 中 |
| TD-5 | 无架构约束 linter | 依赖方向可能被违反 | 🟡 中 |
| TD-6 | 文件超 300 行（translations.ts 967行） | Agent 上下文爆炸 | 🟢 低 |
| TD-7 | 无错误边界组件 | API 失败白屏 | 🟢 低 |
