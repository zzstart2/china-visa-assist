# 中国签证在线申请系统（CCNA）表单结构 PRD 文档

## 一、整体申请流程（大步骤）

系统采用 **线性 4 步骤进度条** 结构：

| 步骤 | 名称 |
|------|------|
| Step 1 | Fill in the form online（在线填写表单） |
| Step 2 | Upload materials（上传材料） |
| Step 3 | Please confirm the information entered is correct（确认信息） |
| Step 4 | Payment（支付） |

> 当前文档覆盖 Step 1 的完整表单结构。

---

## 二、表单主体结构

Step 1 内部使用 **左侧垂直 Tab 导航 + 右侧表单内容区** 布局，共 9 个 Section。
每个 Section 顺序解锁（需完成当前节才可进入下一节），底部操作按钮为 `Previous` / `Save` / `Next`。

---

## 三、各 Section 字段详细说明

---

### Section 1：Personal Information（个人信息）

#### 文件上传区（顶部固定）

| 字段 | 组件类型 | 是否必填 | 说明 |
|------|----------|----------|------|
| Upload your photo | 图片上传区（点击上传） | ✅ 必填 | 需符合照片规格要求，提供"View the photo requirements"帮助链接 |
| Data page of the passport | 图片上传区（点击上传） | ✅ 必填 | 上传护照信息页截图；上传后系统自动 OCR 识别并预填表单字段 |

---

#### 1.1 Name（姓名）

| 字段编号 | 字段名称 | 组件类型 | 是否必填 | 特殊说明 |
|----------|----------|----------|----------|----------|
| 1.1A | Family name（姓，护照上）| 文本输入框 | ✅ 必填 | 含"Not applicable"复选框 |
| 1.1B | Given name(s)（名，护照上）| 文本输入框 | ✅ 必填 | 含"Not applicable"复选框 |
| 1.1C | Other name(s) or former name(s)（其他/曾用名） | 文本输入框 | ❌ 选填 | — |
| 1.1D | Chinese name（中文姓名） | 文本输入框 | ❌ 选填 | 提示"in Chinese, if any" |

> 右上角有 **Help** 按钮，点击展开填写说明。

---

#### 1.2 Date of Birth（出生日期）

| 字段编号 | 字段名称 | 组件类型 | 是否必填 |
|----------|----------|----------|----------|
| 1.2A | Date of birth | 三列组合：年（文本输入 yyyy）+ 月（下拉选择）+ 日（下拉选择） | ✅ 必填 |

---

#### 1.3 Gender（性别）

| 字段编号 | 字段名称 | 组件类型 | 是否必填 | 选项 |
|----------|----------|----------|----------|------|
| 1.3A | Gender | 单选按钮组（Radio） | ✅ 必填 | Male / Female |

---

#### 1.4 Place of Birth（出生地）

| 字段编号 | 字段名称 | 组件类型 | 是否必填 |
|----------|----------|----------|----------|
| 1.4A | Country/region（国家/地区） | 下拉选择（全球国家列表） | ✅ 必填 |
| 1.4B | Province/state（省/州） | 文本输入框 | ✅ 必填 |
| 1.4C | City（城市） | 文本输入框 | ✅ 必填 |

---

#### 1.5 Marital Status（婚姻状况）

| 字段编号 | 字段名称 | 组件类型 | 是否必填 | 选项 |
|----------|----------|----------|----------|------|
| 1.5A | Marital status | 单选按钮组（Radio） | ✅ 必填 | Married / Divorced / Single / Widowed / Other |

---

#### 1.6 Nationality and Permanent Residence（国籍与永居）

| 字段编号 | 字段名称 | 组件类型 | 是否必填 | 特殊说明 |
|----------|----------|----------|----------|----------|
| 1.6A | Current nationality（现国籍） | 下拉选择（全球国家列表） | ✅ 必填 | — |
| 1.6B | ID number in the country of nationality（国籍国身份证号） | 文本输入框 | ✅ 必填 | 含"Not applicable"复选框 |
| 1.6C | Do you have any other nationality?（是否有其他国籍） | 单选（Yes/No） | ✅ 必填 | 选 Yes 时展开：其他国籍国家 + 证件号 + 获得日期 |
| 1.6F | Do you have permanent resident status in any other country or region?（其他国家永居） | 单选（Yes/No） | ✅ 必填 | 选 Yes 时展开：永居国家列表（可多条） |
| — | Have you ever had any other nationalities or resident status?（曾有其他国籍/居留身份） | 单选（Yes/No） | ✅ 必填 | 选 Yes 时展开子表单 |

---

#### 1.7 Passport Information（护照信息）

| 字段编号 | 字段名称 | 组件类型 | 是否必填 | 选项/说明 |
|----------|----------|----------|----------|-----------|
| 1.7A | Type of passport/travel document | 单选按钮组（Radio） | ✅ 必填 | Ordinary / Service / Diplomatic / Official / Special / Other |
| 1.7B | Passport/travel document number | 文本输入框 | ✅ 必填 | — |
| 1.7C | Issuing country/region | 下拉选择（含全球国家+欧盟+联合国） | ✅ 必填 | — |
| 1.7D | Place of issue（签发地） | 文本输入框 | ✅ 必填 | — |
| 1.7E | Expiration date（有效期至） | 三列组合：年（文本输入 yyyy）+ 月（下拉）+ 日（下拉） | ✅ 必填 | 提示：护照有效期须不少于 6 个月 |

---

### Section 2：Type of Visa（签证类型）

#### 2.1 Visa Type（签证种类）

| 字段编号 | 字段名称 | 组件类型 | 是否必填 | 选项 |
|----------|----------|----------|----------|------|
| 2.1 | The type of visa that you are applying for and the main purpose of your visit to China | 下拉选择 | ✅ 必填 | 见下方签证类型列表 |

**可选签证类型完整列表：**

- (L) Tourism
- (M) Commercial and trade activities
- (F) Exchanges, visits, study tours, or other relevant activities
- (Q1) Family member / relative of Chinese citizen or foreigner with permanent residence in China（>180 days）
- (Q2) 同上（≤180 days）
- (S1) Family member of foreigner staying/residing in China or personal matters（>180 days）
- (S2) 同上（≤180 days）
- (Z) Work
- (X1) Long-term study（>180 days）
- (X2) Short-term study（≤180 days）
- (J1) Resident foreign journalist
- (J2) Foreign journalist visiting for short-term coverage
- (C) Crew member
- (G) Transit
- (D) Permanent residence
- (R) Foreigner of high talent or specialist
- (K) Young STEM talent or specialist
- Diplomatic visa
- Official visa
- Person related to diplomatic/consular missions or international organisations in China
- Other purposes
- Courtesy visa（需领事官员酌情批准）

> 右上角有 **Help** 按钮。

---

#### 2.2 Service Type（服务类型）

| 字段编号 | 字段名称 | 组件类型 | 是否必填 | 选项 | 说明 |
|----------|----------|----------|----------|------|------|
| 2.2 | Service type | 单选按钮组（Radio） | ✅ 必填 | Normal / Express | 加急服务额外收费且不可退款；加急计时从提交护照之日起算 |

---

#### 2.3 Visa Application Information（申请信息）

| 字段编号 | 字段名称 | 组件类型 | 是否必填 | 说明 |
|----------|----------|----------|----------|------|
| 2.3A | Visa validity of your application (months)（申请有效期/月） | 数字输入框 | 选填 | — |
| 2.3B | Maximum duration of stay of your application (days)（申请最长停留天数） | 数字输入框 | 选填 | — |
| 2.3C | Entries of your application（申请入境次数） | 单选按钮组（Radio） | 选填 | Single / Double / Multiple |

> 注：实际签发结果由领事官员决定，可能与申请不同。右上角有 **Help** 按钮。

---

### Section 3：Work Information（工作信息）

#### 3.1 Current Occupation（当前职业）

| 字段编号 | 字段名称 | 组件类型 | 是否必填 | 选项 |
|----------|----------|----------|----------|------|
| 3.1 | Current occupation | 下拉选择 | ✅ 必填 | Businessperson / Company employee / Entertainer / Industrial & agricultural worker / Student / Member of parliament / Government official / Military personnel / NGO staff / Religious personnel / Media representative / Crew member / Self-employed / Unemployed / Retired / Academic / Other |

> 选 "Other" 时展开文本输入框（Other specify）。

---

#### 3.2 Work Experience in the Past Five Years（近五年工作经历）

**可重复添加条目（点击"Add"新增）**

| 字段编号 | 字段名称 | 组件类型 | 是否必填 |
|----------|----------|----------|----------|
| 3.2A | Date from / Date to（起止时间） | 年（文本输入 yyyy）+ 月（下拉选择），共两组 | ✅ 必填 |
| 3.2B | Name of your employer（雇主全称） | 文本输入框 | ✅ 必填 |
| — | Address of your employer（雇主地址） | 文本输入框 | ✅ 必填 |
| — | Telephone number of your employer（雇主电话） | 文本输入框 | ✅ 必填 |
| 3.2C | Supervisor's name（直属上级姓名） | 文本输入框 | ✅ 必填 |
| — | Supervisor's telephone number（直属上级电话） | 文本输入框 | ✅ 必填 |
| 3.2D | Position（职位） | 文本输入框 | ✅ 必填 |
| 3.2E | Duty（职责） | 文本输入框 | ✅ 必填 |

> 提示：雇主名称须填写全称，不可使用缩写。

---

### Section 4：Education（教育背景）

#### 4.1 Highest Diploma/Degree（最高学历）

**可重复添加条目（点击"Add"新增）**，含"Not applicable"复选框。

| 字段编号 | 字段名称 | 组件类型 | 是否必填 | 选项 |
|----------|----------|----------|----------|------|
| 4.1A | Name of institute of education（学校名称） | 文本输入框 | ✅ 必填 | — |
| 4.1B | Diploma/degree（学历/学位） | 下拉选择 | ✅ 必填 | Technical secondary school/high school or equivalent / Junior college/undergraduate degree or equivalent / Master's degree or equivalent / Doctoral degree or above / Other |
| 4.1C | Major（专业） | 文本输入框 | ❌ 选填 | — |

---

### Section 5：Family Information（家庭信息）

#### 联系方式

| 字段编号 | 字段名称 | 组件类型 | 是否必填 |
|----------|----------|----------|----------|
| 5.1 | Current home address（现居住地址） | 文本输入框 | ✅ 必填 |
| 5.2 | Phone number（电话号码） | 文本输入框 | ✅ 必填 |
| 5.3 | Mobile phone number（手机号码） | 文本输入框 | ✅ 必填 |
| 5.4 | Email（电子邮件） | 文本输入框 | ❌ 选填 |

---

#### 5.5 Family Members（家庭成员）

**5.5A 配偶（Spouse）**（仅当 1.5A 婚姻状况选择"Married"时显示）

| 字段 | 组件类型 |
|------|----------|
| Family name / Given name | 文本输入框，含"Not applicable"复选框 |
| Nationality | 下拉选择 |
| Date of birth | 日期选择 |
| Place of birth（Country / Province / City / County） | 组合输入 |
| Address | 文本输入框 |
| Is your spouse in China?（是否在华） | 单选（Yes/No） |

**5.5B Father（父亲）** — 含"Not applicable"复选框

| 字段 | 组件类型 |
|------|----------|
| Family name / Given name | 文本输入框，含"Not applicable"复选框 |
| Nationality | 下拉选择 |
| Date of birth | 日期选择 |
| Is your father in China? | 单选（Yes/No） |

**5.5C Mother（母亲）** — 含"Not applicable"复选框（结构同父亲）

**5.5D Children（子女）** — 可重复添加，含"Not applicable"复选框

| 字段 | 组件类型 |
|------|----------|
| Family name / Given name | 文本输入框，含"Not applicable"复选框 |
| Nationality | 下拉选择 |
| Occupation | 输入框 |
| Date of birth | 日期选择 |

**5.5E** Do you have any immediate relatives, not including parents, in China?（除父母外是否有直系亲属在华）— 单选（Yes/No），选 Yes 展开子表单。

---

### Section 6：Information on Your Travel（旅行信息）

#### 6.1 行程信息（可多条，点击"Add"添加）

| 字段编号 | 字段名称 | 组件类型 | 是否必填 | 说明 |
|----------|----------|----------|----------|------|
| 6.1A | Date of arrival（抵达日期） | 日期选择 | ✅ 必填 | 系统只接受未来 90 天内的入境日期 |
| 6.1B | Arrival train/ship/flight No.（交通工具编号） | 文本输入框 | ❌ 选填 | — |
| 6.1C | The city of your destination（目的城市） | 城市+区县（下拉/文本） | ✅ 必填 | — |
| 6.1D | City to stay（停留城市） | 城市+区县 | ✅ 必填 | — |
| 6.1E | Address to stay（住宿地址） | 文本输入框 | ✅ 必填 | — |
| 6.1F | Date of arrival（每段的抵达日期） | 日期选择 | ✅ 必填 | — |
| 6.1G | Date of departure（每段的离开日期） | 日期选择 | ✅ 必填 | — |
| 6.1H | Date of departure（总离境日期） | 日期选择 | ✅ 必填 | — |
| 6.1J | Departure train/ship/flight No. | 文本输入框 | ❌ 选填 | — |
| 6.1K | City of departure（出发城市） | 城市+区县 | ✅ 必填 | — |

---

#### 6.2 Inviting Person/Contact or Organization in China（在华邀请人/联系人/机构）

含"Not applicable"复选框。

| 字段编号 | 字段名称 | 组件类型 | 是否必填 |
|----------|----------|----------|----------|
| 6.2A | Name（姓名/机构名） | 文本输入框 | ✅ 必填 |
| 6.2B | Relationship with you（与您的关系） | 文本输入框 | ✅ 必填 |
| 6.2C | Phone No.（电话） | 文本输入框 | ✅ 必填 |
| 6.2D | Email | 文本输入框 | ❌ 选填 |
| 6.2E | Province/state + City + District/county | 组合下拉/文本 | ✅ 必填 |
| 6.2F | Post code（邮编） | 文本输入框 | ❌ 选填 |

---

#### 6.3 Emergency Contact（紧急联系人）

| 字段编号 | 字段名称 | 组件类型 | 是否必填 |
|----------|----------|----------|----------|
| 6.3A | Family name / Given name | 文本输入框，含"Not applicable"复选框 | ✅ 必填 |
| 6.3B | Relationship with you | 文本输入框 | ✅ 必填 |
| 6.3C | Phone No. | 文本输入框 | ✅ 必填 |
| 6.3D | Email | 文本输入框 | ❌ 选填 |

---

#### 6.4 Who Will Pay for This Travel?（旅行费用承担方）

| 字段编号 | 字段名称 | 组件类型 | 是否必填 | 选项/条件展开 |
|----------|----------|----------|----------|---------------|
| 6.4A | Who will pay for this travel? | 单选按钮组（Radio） | ✅ 必填 | Self / Other（展开：姓名、关系、电话、邮件、地址）/ Organization（展开：机构名、类型、电话、邮件、地址） |

---

#### 6.5 Person Sharing the Same Passport（同护照同行者）

| 字段编号 | 字段名称 | 组件类型 | 是否必填 |
|----------|----------|----------|----------|
| 6.5A | Are you traveling with someone who shares the same passport with you? | 单选（Yes/No） | ✅ 必填 |

> 选 Yes 时展开：同行者姓名、关系等信息。

---

### Section 7：Information on Previous Travel（历史旅行信息）

| 字段编号 | 字段名称 | 组件类型 | 是否必填 | 条件展开 |
|----------|----------|----------|----------|----------|
| 7.1A | Have you ever been to China?（是否曾到访中国） | 单选（Yes/No） | ✅ 必填 | Yes：展开上次到访日期、入境次数、签证类型等 |
| 7.2A | Have you ever gotten a Chinese visa?（是否曾获中国签证） | 单选（Yes/No） | ✅ 必填 | Yes：展开签证号、签发地、签发日期；并追问是否丢失过中国签证（丢失时间、地点、编号） |
| 7.3 | Do you have any valid visas issued by other countries?（是否持有其他国家有效签证） | 单选（Yes/No） | ✅ 必填 | Yes：展开国家、签证类型、签证号、有效期（可多条） |
| 7.4A | Have you traveled to any other country in the past 12 months?（过去 12 个月是否出访其他国家） | 单选（Yes/No） | ✅ 必填 | Yes：展开国家列表（可多条） |

---

### Section 8：Other Information（其他信息）

全部为 **Yes/No 单选题**，选"Yes"时均需填写补充说明文本框。

| 题号 | 问题内容 |
|------|---------|
| 8.1 | Have you ever been refused a Chinese visa or denied entry into China?（是否曾被拒签或拒绝入境） |
| 8.2 | Has your Chinese visa ever been canceled?（中国签证是否曾被注销） |
| 8.3 | Have you ever entered China illegally, overstayed, or worked illegally in China?（是否曾非法入境/逾期居留/非法工作） |
| 8.4 | Do you have any criminal record in China or any other country?（是否有犯罪记录） |
| 8.5 | Do you have any serious mental disorders or infectious diseases?（是否患有严重精神疾病或传染病） |
| 8.6 | Have you ever visited countries or regions in the past 30 days where there is an epidemic?（过去 30 天是否到访疫区） |
| 8.7 | Do you have or have you ever been trained to have any special skill in terms of firearms, explosives, or nuclear/biological/chemical fields?（是否受过特殊技能训练） |
| 8.8 | Are you serving or have you ever served in the military?（是否服役或曾服役） |
| 8.9 | Have you ever served or participated in any paramilitary/rebel organization?（是否参与准军事/武装组织） |
| 8.10 | Have you worked for any professional, social, or charitable organization?（是否在专业/社会/慈善机构工作过） |
| 8.11 | Is there anything else you want to declare?（其他需要申报的事项） |

---

### Section 9：Declaration（申报声明）

| 字段编号 | 字段名称 | 组件类型 | 是否必填 | 说明 |
|----------|----------|----------|----------|------|
| 9.1 | The person who fills in the form | 单选按钮组（Radio） | ✅ 必填 | Applicant（申请人本人） / The person who fills in the application on behalf of the applicant（代填人）；选代填人时需补充代填人信息 |
| 9.1A | Declaration（声明条款） | 文本展示 + 复选框确认 | ✅ 必填 | 申请人须勾选"I understand and agree with the above." |

> 声明内容摘要：确认所填信息真实；理解领事官员拥有最终决定权；同意加急服务条款；理解持签证不保证入境权利。声明中会自动显示提交城市（如"MANILA"）。

---

## 四、交互组件汇总

| 组件类型 | 使用场景 |
|----------|---------|
| **文本输入框（Input）** | 姓名、护照号、地址、电话等自由文本字段 |
| **数字输入框（Number Input）** | 签证有效期（月数）、停留天数 |
| **下拉选择（Select / Dropdown）** | 国家/地区、省/州/城市、签证类型、学历、职业等枚举字段 |
| **单选按钮组（Radio Group）** | 性别、婚姻状况、护照类型、服务类型、Yes/No 判断题 |
| **三列日期选择器（Date Picker）** | 出生日期、护照有效期（年文本输入 + 月下拉 + 日下拉） |
| **图片上传区（File Uploader）** | 照片上传、护照信息页上传（支持 OCR 自动识别） |
| **复选框（Checkbox）** | "Not applicable" 选项（勾选后禁用对应输入框） |
| **可重复添加表单块（Repeatable Form Group）** | 工作经历、教育经历、子女信息、历史签证、历史出访国等 |
| **条件展开（Conditional Display）** | Yes/No 选择后动态显示/隐藏子字段；配偶字段仅婚姻状况为 Married 时展开 |
| **确认复选框（Agree Checkbox）** | Section 9 声明确认 |
| **Help 帮助按钮（Tooltip）** | Section 1.1、Section 2.1、Section 2.3 提供字段填写说明 |

---

## 五、表单级别说明

- 表单语言：中文或英文（提示"Please fill in the form in Chinese or English"）
- 必填字段：标有红色 `*` 星号
- 可选字段：无星号
- "Not applicable" 机制：多个字段提供此复选框，勾选后禁用输入并提交 N/A 值
- OCR 自动填充：上传护照信息页后自动识别并填写 Section 1 中的护照相关字段（需用户确认）
- 进度锁定：各 Section 顺序解锁，未完成当前 Section 验证无法跳转至下一 Section
- 数据持久化：每个 Section 有独立"Save"按钮，可中途保存进度
