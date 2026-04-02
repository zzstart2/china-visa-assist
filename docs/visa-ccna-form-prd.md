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

**条件联动：**
| 触发条件 | 出现的子字段 | 实现状态 |
|----------|--------------|----------|
| maritalStatus = `Other` | → `otherSpecify`（其他婚姻状况说明，文本输入） | ⬜ 未实现 |
| maritalStatus = `Married` | → 第 5 节 `haveSpouseFlag = true`，显示配偶信息区块（5.5A） | ✅ 已实现 |

---

#### 1.6 Nationality and Permanent Residence（国籍与永居）

| 字段编号 | 字段名称 | 组件类型 | 是否必填 | 特殊说明 |
|----------|----------|----------|----------|----------|
| 1.6A | Current nationality（现国籍） | 下拉选择（全球国家列表） | ✅ 必填 | — |
| 1.6B | ID number in the country of nationality（国籍国身份证号） | 文本输入框 | ✅ 必填 | 含"Not applicable"复选框 |
| 1.6C | Do you have any other nationality?（是否有其他国籍） | 单选（Yes/No） | ✅ 必填 | 选 Yes 时展开子字段 |
| 1.6F | Do you have permanent resident status in any other country or region?（其他国家永居） | 单选（Yes/No） | ✅ 必填 | 选 Yes 时展开子字段 |
| — | Have you ever had any other nationalities or resident status?（曾有其他国籍/居留身份） | 单选（Yes/No） | ✅ 必填 | 选 Yes 时展开子字段 |
| — | Is this your first time to apply for Chinese visa?（是否首次申请中国签证） | 单选（Yes/No） | ✅ 必填 | 选 No → 提示携带旧旅行证件，联动第 7 节 |

**条件联动：**
| 触发条件 | 出现的子字段 | 实现状态 |
|----------|--------------|----------|
| `haveOtherNationalityFlag` = Yes (1.6C) | → `otherNationals[]` 数组（可多条），每条含：countryName、idcard (1.6D)、passportNumber (1.6E)、unableProvideReason | ✅ 基础实现（仅单条） |
| `havePermanentFlag` = Yes (1.6F) | → `permanentCountries`（永居国家，下拉多选） | ✅ 基础实现（仅单条） |
| `haveFormerNationalityFlag` = Yes | → `formerNationals[]` 数组 + `joinNationalityDate`（1.6H 加入现有国籍时间） | ⬜ 未实现 |
| 曾有国籍为中国 | → `chineseIdcardDescription`（1.6I 曾持中国身份证号）+ `lastChinesePassportDescription`（最后中国护照号） | ⬜ 未实现 |
| `nationalityCountry` = 中国大陆 | ⚠️ 系统弹窗阻止：不能申请中国签证 | ⬜ 未实现 |
| `firstApplyChinaVisaFlag` = No | → 提示携带最新中国旅行证件，联动第 7 节填写以往签证信息 | ⬜ 未实现 |

---

#### 1.7 Passport Information（护照信息）

| 字段编号 | 字段名称 | 组件类型 | 是否必填 | 选项/说明 |
|----------|----------|----------|----------|-----------|
| 1.7A | Type of passport/travel document | 单选按钮组（Radio） | ✅ 必填 | Ordinary / Service / Diplomatic / Official / Special / Other |
| 1.7B | Passport/travel document number | 文本输入框 | ✅ 必填 | — |
| 1.7C | Issuing country/region | 下拉选择（含全球国家+欧盟+联合国） | ✅ 必填 | — |
| 1.7D | Place of issue（签发地） | 文本输入框 | ✅ 必填 | — |
| 1.7E | Expiration date（有效期至） | 三列组合：年（文本输入 yyyy）+ 月（下拉）+ 日（下拉） | ✅ 必填 | 提示：护照有效期须不少于 6 个月 |

**条件联动：**
| 触发条件 | 出现的子字段 | 实现状态 |
|----------|--------------|----------|
| passport (1.7A) = `Other` | → `otherPassportinfo`（请说明证件种类，文本输入） | ⬜ 未实现 |

#### 1.8 Lost/Stolen Passport（遗失/被盗护照）

| 字段编号 | 字段名称 | 组件类型 | 是否必填 |
|----------|----------|----------|----------|
| 1.8A | Have you ever lost or had a passport stolen?（是否遗失/被盗护照） | 单选（Yes/No） | ✅ 必填 |

**条件联动：**
| 触发条件 | 出现的子字段 | 实现状态 |
|----------|--------------|----------|
| `lostPassportFlag` = Yes (1.8A) | → `lostPassports[]` 数组（可多条），每条含：lostPassportNumber (1.8B)、lostPassportIssueCountry (1.8C)、lostPassportIssueUnit (1.8D)、lostPassportPlace、lostPassportDate | ⬜ 未实现 |

---

### Section 2：Type of Visa（签证类型）

#### 2.1 Visa Type（签证种类）— 三级联动

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

**条件联动（visaPurpose 三级联动）：**（⬜ Demo 仅实现 M 签，其他签证类型联动未实现）

```
visaPurpose（来华目的，709xxx）
  └─→ 决定签证字母类型
  └─→ 每个目的下有不同的具体事由子选项（710xxx）
       └─→ 部分具体事由触发额外字段
```

| 来华目的（visaPurpose） | 选择的具体事由 | 触发的额外字段 |
|-------------------------|----------------|----------------|
| (L) 旅游 | 团队旅游 | → `groupVisaFlag = true` → `travelAgencyName`（中国旅行社名称）、`travelAgencyLicenseNo`（许可证号） |
| (Q1)/(Q2) 亲属团聚 | 任意 | → `name`（中国公民/永居外国人姓名）、`relation`（关系）、`residencePermit`（居留证号） |
| (S1)/(S2) 私人事务 | 因其他私人事务 | → `personalMatters`（请说明） |
| (R) 高端人才 | 任意 | → `talentProgrammeName`（人才招聘计划名称） |
| 外交/领事人员 | 使领馆人员 | → `missionName`（常驻机构名称）、`newPredecessorFlag` → `predecessorName`（前任姓名） |
| 其他目的 | — | → `otherSpecify`（请说明） |

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

**条件联动：**
| 触发条件 | 出现的子字段 | 实现状态 |
|----------|--------------|----------|
| jobType = `Other` | → `otherSpecify`（请说明职业，文本输入） | ✅ 已实现 |
| jobType 非 Unemployed/Retired/Student | → `workExperience[]` 数组中需填写当前工作单位信息 | ⬜ 未实现（当前无论职业都显示工作经历） |

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

**5.5A 配偶（Spouse）**（仅当 1.5A 婚姻状况选择"Married"时显示）✅ 已实现

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

**父/母 `inChinaFlag` 二级联动：**
| 触发条件 | 出现的子字段 | 实现状态 |
|----------|--------------|----------|
| 父/母 `inChinaFlag` = Yes | → `statusInChina`（在华身份：Citizen / Permanent residence / Residence / Stay） | ⬜ 未实现 |
| `statusInChina` = Residence | → `statusInChinaDetail`：Work-type residence (90天-5年) / Non-work-type residence (180天-5年) | ⬜ 未实现 |
| `statusInChina` = Stay | → `statusInChinaDetail`：Z visa (<90天) / Visas other than Z (<180天) | ⬜ 未实现 |

**5.5C Mother（母亲）** — 含"Not applicable"复选框（结构同父亲，含同样的 inChinaFlag 二级联动）

**5.5D Children（子女）** — 可重复添加，含"Not applicable"复选框

| 字段 | 组件类型 |
|------|----------|
| Family name / Given name | 文本输入框，含"Not applicable"复选框 |
| Nationality | 下拉选择 |
| Occupation | 输入框 |
| Date of birth | 日期选择 |

**5.5E** Do you have any immediate relatives, not including parents, in China?（除父母外是否有直系亲属在华）— 单选（Yes/No）

**条件联动：**
| 触发条件 | 出现的子字段 | 实现状态 |
|----------|--------------|----------|
| `relativeRelativeFlag` = Yes | → `relatives[]` 结构化数组（可多条），每条含：familyName、firstName、relation（关系）、address、statusInChina、statusInChinaDetail | ⬜ 未实现（当前为 textarea 文本框） |

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
| 6.4A | Who will pay for this travel? | 单选按钮组（Radio） | ✅ 必填 | Self / Other / Organization |

**条件联动（三选一）：**
| payForTravel 值 | 出现的子字段 | 实现状态 |
|-----------------|--------------|----------|
| Self (6.4A) | → `disposableFunds`（可用资金）、`disposableFundsCurrency`（货币：RMB/USD/EUR） | ⬜ 未实现 |
| Other (6.4B) | → 以上 + `payForTravelName`（付款人姓名）、`payForTravelPhoneNumber`、`payForTravelEmail`、`payForTravelRelation`（关系） | ✅ 基础实现 |
| Organization (6.4C) | → 以上 + `payForTravelOrganizationName`（组织名称）、`payForTravelAddr`、`payForTravelCountry` | ✅ 基础实现 |

**担保人（Sponsor）联动：**
| sponsorType 值 | 出现的子字段 | 实现状态 |
|----------------|--------------|----------|
| Organization | → sponsorName、sponsorPhoneNumber、sponsorEmail、sponsorCountry、sponsorProvince 等 | ⬜ 未实现 |
| Individual | → sponsorName、sponsorRelation、sponsorPhoneNumber、sponsorEmail 等 | ⬜ 未实现 |

---

#### 6.5 Travel Companions（偕行人 / 同护照同行者）

| 字段编号 | 字段名称 | 组件类型 | 是否必填 |
|----------|----------|----------|----------|
| 6.5A | Are you traveling with someone who shares the same passport with you? | 单选（Yes/No） | ✅ 必填 |

**条件联动：**
| 触发条件 | 出现的子字段 | 实现状态 |
|----------|--------------|----------|
| `havePeersFlag` = Yes | → `travelCompanion[]` 数组（可多人），每人含：peerFamilyName、peerFirstName、gender、birthday、`samePassportFlag`（是否同一本护照）、photoPath（照片上传） | ⬜ 未实现 |

---

### Section 7：Information on Previous Travel（历史旅行信息）

| 字段编号 | 字段名称 | 组件类型 | 是否必填 |
|----------|----------|----------|----------|
| 7.1A | Have you ever been to China?（是否曾到访中国） | 单选（Yes/No） | ✅ 必填 |
| 7.2A | Have you ever gotten a Chinese visa?（是否曾获中国签证） | 单选（Yes/No） | ✅ 必填 |
| 7.3 | Do you have any valid visas issued by other countries?（是否持有其他国家有效签证） | 单选（Yes/No） | ✅ 必填 |
| 7.4A | Have you traveled to any other country in the past 12 months?（过去 12 个月是否出访其他国家） | 单选（Yes/No） | ✅ 必填 |

**条件联动（完整链路）：**
| 触发条件 | 出现的子字段 | 实现状态 |
|----------|--------------|----------|
| `arrivedChinaFlag` = Yes (7.1A) | → `previousTravelInChinaInfos[]` 数组，每条含：arrivalCity、arrivalCounty、arrivalDate、leaveDate | ✅ 基础实现（仅日期+次数） |
| `haveChinaVisaFlag` = Yes (7.2A) | → 签证详情区块 | ✅ 基础实现 |
| `provideChinaVisaDetailFlag` = Yes | → `visaType`（签证种类）、`visaNumber`（签证号码）、`issuePlace`（签发地点）、`issueDate`（签发日期） | ⬜ 未实现（缺少 provideChinaVisaDetailFlag 二级开关） |
| `collectFingerprintFlag` = Yes | → `collectFingerprintCountry`（采集国家）、`collectFingerprintPlace`（采集地点）、`collectFingerprintDate` | ⬜ 未实现 |
| `chinaResidenceLicenseFlag` = Yes | → `residenceLicenseNumber`（居留证件号码） | ⬜ 未实现 |
| `haveOtherVisaFlag` = Yes (7.3) | → `otherVisas`（国家多选列表） | ✅ 基础实现 |
| `visitedOtherCountryFlag` = Yes (7.4A) | → `otherCountries`（国家多选列表） | ✅ 基础实现 |

---

### Section 8：Other Information（其他信息）

采用 **otherInfoItems[0-12]** 数组统一管理 **13 个 Yes/No 问题**，选"Yes"时展开补充说明。

| 数组索引 | 题号 | 问题内容 | Yes 时的子字段 | 实现状态 |
|----------|------|---------|---------------|----------|
| [0] | 8.1 | Have you ever been refused a Chinese visa or denied entry into China?（是否曾被拒签或拒绝入境） | → `itemNote`（说明文本） | ✅ |
| [1] | 8.2 | Has your Chinese visa ever been canceled?（中国签证是否曾被注销） | → `itemNote` | ✅ |
| [2] | 8.3 | Have you ever entered China illegally, overstayed, or worked illegally in China?（是否曾非法入境/逾期居留/非法工作） | → `itemNote` | ✅ |
| [3] | 8.4 | Do you have any criminal record in China or any other country?（是否有犯罪记录） | → `itemNote` | ✅ |
| [4] | 8.5 | Do you have any serious mental disorders or infectious diseases?（是否患有严重精神疾病或传染病） | → `itemNote` | ✅ |
| [5] | 8.6 | Have you ever visited countries or regions in the past 30 days where there is an epidemic?（过去 30 天是否到访疫区） | → `itemNote` | ✅ |
| [6] | 8.7 | Do you have or have you ever been trained to have any special skill in terms of firearms, explosives, or nuclear/biological/chemical fields?（是否受过特殊技能训练） | → `itemNote` | ✅ |
| [7] | **8.8** | **Are you serving or have you ever served in the military?（是否服役或曾服役）** | → **`militaryServiceInfos[]`**（见下方详情） | ⬜ 未实现（当前为 textarea） |
| [8] | 8.9 | Have you ever served or participated in any paramilitary/rebel organization?（是否参与准军事/武装组织） | → `itemNote` | ✅ |
| [9] | 8.10 | Have you worked for any professional, social, or charitable organization?（是否在专业/社会/慈善机构工作过） | → `itemNote` | ✅ |
| [10] | 8.11 | Is there anything else you want to declare?（其他需要申报的事项） | → `itemNote` | ✅ |
| [11] | **8.12** | **Have you or any family member ever worked in military or law enforcement?（本人或家庭成员是否从事军队/执法相关工作）** | → `itemNote` | ⬜ 未实现 |
| [12] | **8.13** | **Have you or any family member ever been associated with any political party?（本人或家庭成员是否隶属政治党派）** | → `itemNote` | ⬜ 未实现 |

**8.8 军事服役详情联动**（otherInfoItems[7] = Yes）：⬜ 未实现

→ 展开 `militaryServiceInfos[]` 数组（可多条），每条记录包含：

| 字段 | 说明 | 可选项 |
|------|------|--------|
| serviceCountry | 8.8A 服役国家或地区 | 国家下拉 |
| armedType | 8.8B 军种 | Army / Air Force / Navy / Special Forces |
| militaryRank | 8.8C 军衔 | General ~ Second Lieutenant（10 级） |
| militarySpecialties | 8.8D 军事特长 | 文本输入 |
| beginDate | 8.8E 开始服役时间 | 日期选择 |
| endDate | 8.8F 结束服役时间 | 日期选择 |

---

### Section 9：Declaration（申报声明）

| 字段编号 | 字段名称 | 组件类型 | 是否必填 | 说明 |
|----------|----------|----------|----------|------|
| 9.1 | The person who fills in the form | 单选按钮组（Radio） | ✅ 必填 | Applicant（申请人本人） / The person who fills in the application on behalf of the applicant（代填人） |
| 9.1A | Declaration（声明条款） | 文本展示 + 复选框确认 | ✅ 必填 | 申请人须勾选"I understand and agree with the above." |

**条件联动：**
| 触发条件 | 出现的子字段 | 实现状态 |
|----------|--------------|----------|
| `agentFlag` = 本人填写 (9.1) | → 显示 9.1A 声明复选确认框 | ✅ 已实现 |
| `agentFlag` = 代填人填写 (9.2) | → `agentName` (9.2A 代填人姓名)、`relationship` (9.2B 与申请人关系)、`agentAddr` (9.2C 地址)、`agentTel` (9.2D 电话)、9.2E 声明复选确认框 | ✅ 已实现（缺 agentAddr） |

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

---

## 六、条件联动总览（23 个 Flag）

整个表单共有 **23 个布尔型控制标志（Flag）** 用于控制子字段的显隐。下图为简化版跨节联动关系：

```
第1节 maritalStatus = Married ──────────────────→ 第5节 haveSpouseFlag = true → 显示配偶信息    ✅
第1节 haveOtherNationalityFlag = Yes ───────────→ otherNationals[] 多条记录                    ✅ 基础
第1节 havePermanentFlag = Yes ──────────────────→ permanentCountries 多选                      ✅ 基础
第1节 haveFormerNationalityFlag = Yes ──────────→ formerNationals[] + joinNationalityDate       ⬜
   └─ 若曾有中国国籍 ─────────────────────────→ chineseIdcardDescription + lastChinesePassportDescription ⬜
第1节 lostPassportFlag = Yes ───────────────────→ lostPassports[] 多条记录                     ⬜
第1节 passport = Other ─────────────────────────→ otherPassportinfo                             ⬜
第1节 firstApplyChinaVisaFlag = No ─────────────→ 提示 + 联动第7节                             ⬜

第2节 visaPurpose ──→ 联动具体事由子选项 ──→ 部分事由触发额外字段：                              ⬜ (仅 M 签)
   └─ L+团队旅游 → travelAgencyName/LicenseNo
   └─ Q1/Q2 → name/relation/residencePermit
   └─ S1/S2+其他私人事务 → personalMatters
   └─ R → talentProgrammeName
   └─ 外交人员 → missionName + newPredecessorFlag → predecessorName

第3节 jobType = Other → otherSpecify                                                           ✅
第3节 jobType 非 Unemployed/Retired/Student → 显示 workExperience                              ⬜

第5节 父/母 inChinaFlag = Yes ──────────────────→ statusInChina → statusInChinaDetail          ⬜
第5节 relativeRelativeFlag = Yes ───────────────→ relatives[] 结构化数组                       ⬜

第6节 payForTravel = Self/Other/Organization ───→ 不同付款人字段组                              ✅ 基础
第6节 havePeersFlag = Yes ─────────────────────→ travelCompanion[] 多条记录                    ⬜

第7节 arrivedChinaFlag = Yes ──────────────────→ previousTravelInChinaInfos[]                  ✅ 基础
第7节 haveChinaVisaFlag = Yes ─────────────────→ provideChinaVisaDetailFlag                    ✅ 基础
   └─ = Yes → visaType/visaNumber/issuePlace/issueDate                                        ⬜
第7节 collectFingerprintFlag = Yes ────────────→ 采集国家/地点/日期                            ⬜
第7节 chinaResidenceLicenseFlag = Yes ─────────→ residenceLicenseNumber                        ⬜
第7节 haveOtherVisaFlag = Yes ─────────────────→ otherVisas 多选                               ✅ 基础
第7节 visitedOtherCountryFlag = Yes ───────────→ otherCountries 多选                           ✅ 基础

第8节 otherInfoItems[0-12] = Yes ──────────────→ 各自 itemNote（说明文本）                     ✅ (11题)
   └─ [7] (8.8服役) = Yes → militaryServiceInfos[] 结构化详情数组                              ⬜
   └─ [11] (8.12军队/执法) 和 [12] (8.13政治党派) 两题                                         ⬜ 未添加

第9节 agentFlag = 代填 ────────────────────────→ 代填人四项信息 + 9.2E声明                     ✅
```

### 实现状态统计

| 状态 | 数量 | 说明 |
|------|------|------|
| ✅ 已实现 | 9 | 包含基础实现（仅单条/简化版） |
| ⬜ 未实现 | 14 | 待后端接手后实现 |

> 详细的联动规则（含字段编码、触发值、多级嵌套）见 `docs/conditional-linkage.md`
- 数据持久化：每个 Section 有独立"Save"按钮，可中途保存进度
