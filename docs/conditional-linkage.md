# 表单字段条件联动关系（补充）

## 联动总览

整个表单共有 **23 个布尔型控制标志（Flag）** 用于控制子字段的显隐。以下按节归类。

---

## 第 1 节：个人信息

### 1.1 姓名

| 触发字段 | 触发条件 | 出现的子字段 |
|----------|----------|--------------|
| 1.1A Family name 旁的 **"Not applicable"** 复选框 | 勾选 | 1.1A 文本框禁用，无需填写 |
| 1.1B Given name 旁的 **"Not applicable"** 复选框 | 勾选 | 1.1B 文本框禁用，无需填写 |

> `notApplyItems` 对象还控制了 `nationalityIdcard`、`formerNationals_x_idcard`、`formerNationals_x_passportNumber`、`lostPassports_x_lostPassportNumber` 等字段的"不适用"跳过。

### 1.5 婚姻状况

| 触发字段 | 触发条件 | 出现的子字段 |
|----------|----------|--------------|
| 1.5A maritalStatus | = `706005`（Other） | **otherSpecify**：其他婚姻状况请说明（文本输入） |
| 1.5A maritalStatus | = `706001`（Married） | → 设置 `haveSpouseFlag = true`，在第 5 节显示配偶信息（5.5A） |

### 1.6 国籍与永久居留

| 触发字段（Flag） | 触发条件 | 出现的子字段 |
|------------------|----------|--------------|
| **1.6C** `haveOtherNationalityFlag` | = Yes | → **otherNationals** 数组（可添加多条），每条包含：countryName（其他国籍国家）、idcard（1.6D 其他国籍身份证件号码）、passportNumber（1.6E 其他国籍护照号码）、unableProvideReason（若身份证号和护照号都未填的说明） |
| **1.6F** `havePermanentFlag` | = Yes | → **permanentCountries**（永久居留国家，下拉多选） |
| `haveFormerNationalityFlag` | = Yes | → **formerNationals** 数组（曾有国籍记录）、**joinNationalityDate**（1.6H 加入现有国籍时间） |
| `haveFormerNationalityFlag` = Yes **且**曾有国籍为中国 | 条件联动 | → **1.6I** 曾持中国身份证号码（chineseIdcardDescription）、最后一本中国护照号码（lastChinesePassportDescription） |
| **nationalityCountry** | = 中国大陆 | ⚠️ 系统弹窗阻止：不能申请中国签证 |
| `firstApplyChinaVisaFlag` | = No（非首次申请） | → 提示需携带最新中国旅行证件，并在第 7 节填写以往签证信息 |

### 1.7 护照信息

| 触发字段 | 触发条件 | 出现的子字段 |
|----------|----------|--------------|
| 1.7A passport（护照种类） | = `707006`（Other） | → **otherPassportinfo**（请说明证件种类） |

### 1.8 遗失/被盗护照

| 触发字段（Flag） | 触发条件 | 出现的子字段 |
|------------------|----------|--------------|
| **1.8A** `lostPassportFlag` | = Yes | → **lostPassports** 数组（可添加多条），每条包含：lostPassportNumber（1.8B 证件号码）、lostPassportIssueCountry（1.8C 签发国家/地区）、lostPassportIssueUnit（1.8D 签发机关）、lostPassportPlace（遗失地点）、lostPassportDate（遗失日期） |

---

## 第 2 节：申请信息

### 2.1 签证种类与来华事由 — 三级联动

```
visaPurpose（来华目的，709xxx）
  └─→ 决定签证字母类型（L/M/F/Q1/Q2/S1/S2/Z/X1/X2/J1/J2/C/G/D/R/K/外交/公务/礼遇）
  └─→ 每个目的下有不同的**具体事由**子选项（710xxx）
       └─→ 部分具体事由触发额外字段
```

| 来华目的（visaPurpose） | 选择的具体事由 | 触发的额外字段 |
|-------------------------|----------------|----------------|
| 709001 (L) 旅游 | 710002 = Group tourist（团队旅游） | → `groupVisaFlag = true` → 显示 **travelAgencyName**（中国旅行社名称）、**travelAgencyLicenseNo**（旅行社许可证号） |
| 709004 (Q1) / 709005 (Q2) 亲属团聚 | 任意 | → **name**（中国公民/被委托人/永居外国人姓名）、**relation**（与其关系）、**residencePermit**（居留证号码） |
| 709006 (S1) 私人事务 > 180天 | 710019 = 因其他私人事务 | → **personalMatters**（请说明私人事务） |
| 709007 (S2) 私人事务 ≤ 180天 | 710021 = 因其他私人事务 | → **personalMatters**（请说明私人事务） |
| 709016 (R) 高端人才 | 任意 | → **talentProgrammeName**（人才招聘计划名称） |
| 709019 外交/领事相关人员 | 710047 = 使领馆人员 | → **missionName**（常驻机构名称）、**newPredecessorFlag**（是否首次任职？）→ 若否则填 **predecessorName**（前任姓名）、**residentName**（常驻机构人员姓名） |
| 709020 其他目的 | — | → **otherSpecify**（请说明） |

### 2.2 服务种类

| 触发字段 | 触发条件 | 效果 |
|----------|----------|------|
| serviceType | = Express（加急） | 显示加急服务说明和额外费用提示 |

---

## 第 3 节：工作情况

| 触发字段 | 触发条件 | 出现的子字段 |
|----------|----------|--------------|
| 3.1 jobType（当前职业） | = `Other`（其他） | → **otherSpecify**（请说明职业） |
| 3.1 jobType | 非 Unemployed/Retired/Student | → **workExperience** 数组中需填写当前工作单位信息 |

---

## 第 4 节：教育背景

| 触发字段 | 触发条件 | 出现的子字段 |
|----------|----------|--------------|
| language（语言） | 填写多种语言 | 文本输入，可自由填写 |
| **educationExperience** 数组 | highestDegree = `Other` | → 说明具体学历 |

---

## 第 5 节：家庭情况

### 5.5A 配偶

| 触发字段（Flag） | 触发条件 | 出现的子字段 |
|------------------|----------|--------------|
| `haveSpouseFlag` | = true（由第1节 maritalStatus = Married 触发） | → 整个 **spouses** 数组区块显示，每条包含：familyName、firstName、nationalityCountry、profession、birthday、birthCountry、birthCity、address |

### 5.5B/C 父母

| 触发字段（Flag） | 触发条件 | 出现的子字段 |
|------------------|----------|--------------|
| 父/母 `inChinaFlag` | = Yes（父亲/母亲是否在中国？） | → **statusInChina**（在华身份：Citizen/Permanent residence/Residence/Stay）、**statusInChinaDetail**（身份细节） |

**statusInChina 的二级联动**：

| statusInChina 值 | 出现的子字段 |
|-------------------|--------------|
| `702003`（Residence 居留） | → statusInChinaDetail 选项：Work-type residence (90天-5年) / Non-work-type residence (180天-5年) |
| `702004`（Stay 停留） | → statusInChinaDetail 选项：Z visa (< 90天) / Visas other than Z (< 180天) |

### 5.5E 直系亲属

| 触发字段（Flag） | 触发条件 | 出现的子字段 |
|------------------|----------|--------------|
| `relativeRelativeFlag` | = Yes（是否有直系亲属在中国？） | → **relatives** 数组，每条包含：familyName、firstName、relation（与您的关系）、address、statusInChina、statusInChinaDetail |

---

## 第 6 节：旅行信息

### 6.1 停留信息

| 触发字段 | 触发条件 | 出现的子字段 |
|----------|----------|--------------|
| 点击"添加" | — | → **stayInfo** 数组可添加多条停留城市记录，每条含：stayCity、stayCounty、travelAddr（停留地址）、arrivalDate（到达日期）、leaveDate（离开日期） |

### 6.4 旅行费用支付 — 三选一联动

| payForTravel 值 | 标签 | 出现的子字段 |
|-----------------|------|--------------|
| `708001` Self（本人） | 6.4A | → **disposableFunds**（可用资金）、**disposableFundsCurrency**（货币：RMB/USD/EUR） |
| `708002` Other（他人） | 6.4B | → 以上 + **payForTravelName**（付款人姓名）、**payForTravelPhoneNumber**、**payForTravelEmail**、**payForTravelRelation**（与您的关系） |
| `708003` Organization（组织） | 6.4C | → 以上 + **payForTravelOrganizationName**（组织名称）、**payForTravelAddr**、**payForTravelCountry** |

此外还有 **sponsor（担保人）** 相关字段：

| 触发字段 | 触发条件 | 出现的子字段 |
|----------|----------|--------------|
| sponsorType | = `712001`（Organization） | → sponsorName、sponsorPhoneNumber、sponsorEmail、sponsorCountry、sponsorProvince 等 |
| sponsorType | = `712002`（Individual） | → sponsorName、sponsorRelation、sponsorPhoneNumber、sponsorEmail 等 |

### 6.5 偕行人

| 触发字段（Flag） | 触发条件 | 出现的子字段 |
|------------------|----------|--------------|
| `havePeersFlag` | = Yes | → **travelCompanion** 数组（可添加多人），每人含：peerFamilyName、peerFirstName、gender、birthday、**samePassportFlag**（是否同一本护照）、photoPath（照片上传） |

---

## 第 7 节：以往旅行信息

### 7.1 来华经历

| 触发字段（Flag） | 触发条件 | 出现的子字段 |
|------------------|----------|--------------|
| `arrivedChinaFlag` | = Yes（是否曾来过中国？） | → **previousTravelInChinaInfos** 数组，每条含：arrivalCity、arrivalCounty、arrivalDate、leaveDate |

### 7.2 原中国签证信息

| 触发字段（Flag） | 触发条件 | 出现的子字段 |
|------------------|----------|--------------|
| `haveChinaVisaFlag` | = Yes（是否曾获得中国签证？） | → 显示签证详情区块 |
| `provideChinaVisaDetailFlag` | = Yes（能否提供最近一次签证详情？） | → **visaType**（签证种类）、**visaNumber**（签证号码）、**issuePlace**（签发地点）、**issueDate**（签发日期） |
| `collectFingerprintFlag` | = Yes（是否曾被采集指纹？） | → **collectFingerprintCountry**（采集国家）、**collectFingerprintPlace**（采集地点）、**collectFingerprintDate**（采集日期） |
| `chinaResidenceLicenseFlag` | = Yes（是否曾获中国居留证件？） | → **residenceLicenseNumber**（居留证件号码） |

### 7.3 其他国家有效签证

| 触发字段（Flag） | 触发条件 | 出现的子字段 |
|------------------|----------|--------------|
| `haveOtherVisaFlag` | = Yes | → **otherVisas**（国家多选列表） |

### 7.4 近12个月访问国家

| 触发字段（Flag） | 触发条件 | 出现的子字段 |
|------------------|----------|--------------|
| `visitedOtherCountryFlag` | = Yes | → **otherCountries**（国家多选列表） |

---

## 第 8 节：其他事项

第 8 节采用 **otherInfoItems[0-12]** 数组统一管理 13 个 Yes/No 问题：

| 数组索引 | 对应问题 | itemValue = Yes 时的子字段 |
|----------|----------|---------------------------|
| [0] | 8.1 是否曾被拒签或拒绝入境？ | → **itemNote**（请说明，文本输入） |
| [1] | 8.2 是否曾被注销中国签证？ | → itemNote |
| [2] | 8.3 是否曾非法入境/滞留/就业？ | → itemNote |
| [3] | 8.4 是否有犯罪记录？ | → itemNote |
| [4] | 8.5 是否有严重精神障碍或传染性疾病？ | → itemNote |
| [5] | 8.6 近30日是否前往过疫区？ | → itemNote |
| [6] | 8.7 是否具有枪械/炸药/核/生化特殊技能？ | → itemNote |
| [7] | **8.8 是否（曾）在部队服役？** | → **militaryServiceInfos** 数组（见下方） |
| [8] | 8.9 是否曾参加准军事/游击/叛乱组织？ | → itemNote |
| [9] | 8.10 是否任职于职业/社会/慈善机构？ | → itemNote |
| [10] | 8.11 是否有其他需要声明的事项？ | → itemNote |
| [11] | 8.12 本人或家庭成员是否（曾）从事军队或执法相关工作？ | → itemNote |
| [12] | 8.13 本人或家庭成员是否（曾）隶属于任何政治党派？ | → itemNote |

**8.8 军事服役详情联动**（otherInfoItems[7].itemValue = Yes）：

→ 展开 **militaryServiceInfos** 数组，每条记录包含：

| 字段 | 说明 | 可选项 |
|------|------|--------|
| serviceCountry | 8.8A 服役国家或地区 | 国家下拉 |
| armedType | 8.8B 军种 | Army / Air Force / Navy / Special Forces |
| militaryRank | 8.8C 军衔 | General ~ Second Lieutenant（10级） |
| militarySpecialties | 8.8D 军事特长 | 文本输入 |
| beginDate | 8.8E 开始服役时间 | 日期选择 |
| endDate | 8.8F 结束服役时间 | 日期选择 |

---

## 第 9 节：声明

| 触发字段（Flag） | 触发条件 | 出现的子字段 |
|------------------|----------|--------------|
| `agentFlag` | = 本人填写（9.1） | → 显示 **9.1A 声明** 复选确认框 |
| `agentFlag` | = 代填人填写（9.2） | → **agentName**（9.2A 代填人姓名）、**relationship**（9.2B 与申请人关系）、**agentAddr**（9.2C 地址）、**agentTel**（9.2D 电话）、**9.2E 声明** 复选确认框 |

---

## 联动关系图（简化版）

```
第1节 maritalStatus = Married ──────────────────→ 第5节 haveSpouseFlag = true → 显示配偶信息
第1节 haveOtherNationalityFlag = Yes ───────────→ otherNationals[] 多条记录
第1节 havePermanentFlag = Yes ──────────────────→ permanentCountries 多选
第1节 haveFormerNationalityFlag = Yes ──────────→ formerNationals[] + joinNationalityDate
   └─ 若曾有中国国籍 ─────────────────────────→ chineseIdcardDescription + lastChinesePassportDescription
第1节 lostPassportFlag = Yes ───────────────────→ lostPassports[] 多条记录
第1节 passport = Other ─────────────────────────→ otherPassportinfo

第2节 visaPurpose ──→ 联动具体事由子选项 ──→ 部分事由触发额外字段：
   └─ L+团队旅游 → travelAgencyName/LicenseNo
   └─ Q1/Q2 → name/relation/residencePermit
   └─ S1/S2+其他私人事务 → personalMatters
   └─ R → talentProgrammeName
   └─ 外交人员 → missionName + newPredecessorFlag → predecessorName

第5节 父/母 inChinaFlag = Yes ──────────────────→ statusInChina → statusInChinaDetail
第5节 relativeRelativeFlag = Yes ───────────────→ relatives[] 多条记录

第6节 payForTravel = Self/Other/Organization ───→ 不同付款人字段组
第6节 havePeersFlag = Yes ─────────────────────→ travelCompanion[] 多条记录

第7节 arrivedChinaFlag = Yes ──────────────────→ previousTravelInChinaInfos[]
第7节 haveChinaVisaFlag = Yes ─────────────────→ provideChinaVisaDetailFlag
   └─ = Yes → visaType/visaNumber/issuePlace/issueDate
第7节 collectFingerprintFlag = Yes ────────────→ 采集国家/地点/日期
第7节 chinaResidenceLicenseFlag = Yes ─────────→ residenceLicenseNumber
第7节 haveOtherVisaFlag = Yes ─────────────────→ otherVisas 多选
第7节 visitedOtherCountryFlag = Yes ───────────→ otherCountries 多选

第8节 otherInfoItems[0-12] = Yes ──────────────→ 各自 itemNote（说明文本）
   └─ [7] (8.8服役) = Yes → militaryServiceInfos[] 详情数组

第9节 agentFlag = 代填 ────────────────────────→ 代填人四项信息 + 9.2E声明
```
