/**
 * Field metadata for AI chat question generation.
 * Each entry maps a dotted field path to bilingual labels and input type.
 * Extension point: add new fields as the form grows.
 */
import { FieldMetaEntry } from '../types';

// Full CCNA occupation list (17 options per PRD)
export const OCCUPATIONS = [
  'Businessperson','Company employee','Entertainer','Industrial & agricultural worker',
  'Student','Member of parliament','Government official','Military personnel','NGO staff',
  'Religious personnel','Media representative','Crew member','Self-employed','Unemployed',
  'Retired','Academic','Other'
];

export const fieldMeta: Record<string, FieldMetaEntry> = {
  // ── Section 1: Personal Information ──
  'section1.familyName': { labelEn: 'What is your family name (as shown on passport)?', labelZh: '您的姓氏（护照上的）：', type: 'text' },
  'section1.givenName': { labelEn: 'What is your given name (as shown on passport)?', labelZh: '您的名字（护照上的）：', type: 'text' },
  'section1.birthDate': { labelEn: 'What is your date of birth?', labelZh: '您的出生日期：', type: 'date' },
  'section1.gender': { labelEn: 'What is your gender?', labelZh: '您的性别：', type: 'select', options: ['Male', 'Female'] },
  'section1.birthCountry': { labelEn: 'Which country were you born in?', labelZh: '您的出生国家：', type: 'text' },
  'section1.birthProvince': { labelEn: 'Which province/state were you born in?', labelZh: '出生省份/州：', type: 'text' },
  'section1.birthCity': { labelEn: 'Which city were you born in?', labelZh: '出生城市：', type: 'text' },
  'section1.maritalStatus': { labelEn: 'What is your marital status?', labelZh: '您的婚姻状况：', type: 'select', options: ['Single', 'Married', 'Divorced', 'Widowed', 'Other'] },
  'section1.currentNationality': { labelEn: 'What is your current nationality?', labelZh: '您的当前国籍：', type: 'text' },
  'section1.nationalIdNumber': { labelEn: 'What is your national ID number in the country of nationality? (type N/A if not applicable)', labelZh: '您的国籍国身份证号（无则输入 N/A）：', type: 'text' },
  'section1.hasOtherNationality': { labelEn: 'Do you have any other nationality?', labelZh: '您是否有其他国籍？', type: 'select', options: ['yes', 'no'] },
  'section1.hasPermanentResident': { labelEn: 'Do you have permanent resident status in any other country or region?', labelZh: '您是否拥有其他国家或地区的永久居留权？', type: 'select', options: ['yes', 'no'] },
  'section1.hadOtherNationalities': { labelEn: 'Have you ever had any other nationalities or resident status?', labelZh: '您是否曾拥有其他国籍或居留身份？', type: 'select', options: ['yes', 'no'] },
  'section1.passportType': { labelEn: 'What type of passport/travel document do you hold?', labelZh: '您的护照/旅行证件类型：', type: 'select', options: ['Ordinary', 'Service', 'Diplomatic', 'Official', 'Special', 'Other'] },
  'section1.passportNumber': { labelEn: 'What is your passport number?', labelZh: '您的护照号码：', type: 'text' },
  'section1.issuingCountry': { labelEn: 'Which country issued your passport?', labelZh: '护照签发国：', type: 'text' },
  'section1.placeOfIssue': { labelEn: 'Where was your passport issued?', labelZh: '护照签发地：', type: 'text' },
  'section1.passportExpiry': { labelEn: 'When does your passport expire?', labelZh: '护照有效期至：', type: 'date' },

  // ── Section 2: Visa Type ──
  'section2.serviceType': { labelEn: 'Do you need express or normal service? (Express service has an additional non-refundable fee)', labelZh: '您需要加急还是普通服务？（加急需额外费用且不可退款）', type: 'select', options: ['Normal', 'Express'] },

  // ── Section 3: Work Information ──
  'section3.currentOccupation': { labelEn: 'What is your current occupation?', labelZh: '您当前的职业：', type: 'select', options: OCCUPATIONS },
  'section3.workHistory': { labelEn: 'Please provide your most recent employer name (full name, no abbreviations).', labelZh: '请提供您最近的雇主全称（不可使用缩写）：', type: 'text' },

  // ── Section 4: Education ──
  'section4.entries': { labelEn: 'What is your highest education level?', labelZh: '您的最高学历是什么？', type: 'select', options: ['Technical secondary school/high school or equivalent', 'Junior college/undergraduate degree or equivalent', "Master's degree or equivalent", 'Doctoral degree or above', 'Other'] },

  // ── Section 5: Family / Contact ──
  'section5.currentAddress': { labelEn: 'What is your current home address?', labelZh: '请输入您当前的居住地址：', type: 'text' },
  'section5.phone': { labelEn: 'What is your phone number?', labelZh: '请输入您的电话号码：', type: 'text' },
  'section5.mobilePhone': { labelEn: 'What is your mobile phone number?', labelZh: '请输入您的手机号码：', type: 'text' },
  'section5.father': { labelEn: "What is your father's full name? (family name, given name)", labelZh: '您父亲的姓名（姓、名）：', type: 'text' },
  'section5.mother': { labelEn: "What is your mother's full name? (family name, given name)", labelZh: '您母亲的姓名（姓、名）：', type: 'text' },
  'section5.hasRelativesInChina': { labelEn: 'Do you have any immediate relatives (other than parents) in China?', labelZh: '除父母外，您是否有直系亲属在中国？', type: 'select', options: ['yes', 'no'] },

  // ── Section 6: Travel ──
  'section6.itinerary': { labelEn: 'What is your planned arrival date in China? (YYYY-MM-DD)', labelZh: '您计划什么时候到达中国？（YYYY-MM-DD）', type: 'date' },
  'section6.inviter.name': { labelEn: 'Name of the inviting company/person in China?', labelZh: '在华邀请公司/人名称：', type: 'text' },
  'section6.inviter.phone': { labelEn: 'Phone number of the inviting person/organization?', labelZh: '邀请人/机构电话：', type: 'text' },
  'section6.inviter.relationship': { labelEn: 'Your relationship with the inviter?', labelZh: '与邀请人/机构的关系：', type: 'text' },
  'section6.emergencyContact.familyName': { labelEn: "Emergency contact's family name?", labelZh: '紧急联系人姓氏：', type: 'text' },
  'section6.emergencyContact.givenName': { labelEn: "Emergency contact's given name?", labelZh: '紧急联系人名字：', type: 'text' },
  'section6.emergencyContact.relationship': { labelEn: "Emergency contact's relationship to you?", labelZh: '紧急联系人与您的关系：', type: 'text' },
  'section6.emergencyContact.phone': { labelEn: "Emergency contact's phone number?", labelZh: '紧急联系人电话：', type: 'text' },
  'section6.travelPayBy': { labelEn: 'Who will pay for this travel?', labelZh: '旅行费用由谁承担？', type: 'select', options: ['Self', 'Other', 'Organization'] },
  'section6.sharePassport': { labelEn: 'Are you traveling with someone who shares the same passport with you?', labelZh: '是否有人与您共用同一本护照旅行？', type: 'select', options: ['yes', 'no'] },

  // ── Section 7: Previous Travel ──
  'section7.hasBeenToChina': { labelEn: 'Have you ever been to China?', labelZh: '您是否曾到访过中国？', type: 'select', options: ['yes', 'no'] },
  'section7.hasChineseVisa': { labelEn: 'Have you ever obtained a Chinese visa?', labelZh: '您是否曾获得过中国签证？', type: 'select', options: ['yes', 'no'] },
  'section7.hasOtherValidVisa': { labelEn: 'Do you have any valid visas issued by other countries?', labelZh: '您是否持有其他国家的有效签证？', type: 'select', options: ['yes', 'no'] },
  'section7.hasTraveledLast12Months': { labelEn: 'Have you traveled to any other country in the past 12 months?', labelZh: '过去12个月您是否出访过其他国家？', type: 'select', options: ['yes', 'no'] },

  // ── Section 8: Other Information (11 Yes/No) ──
  'section8.refusedVisa': { labelEn: 'Have you ever been refused a Chinese visa or denied entry into China?', labelZh: '您是否曾被拒签或拒绝入境中国？', type: 'select', options: ['yes', 'no'] },
  'section8.canceledVisa': { labelEn: 'Has your Chinese visa ever been canceled?', labelZh: '您的中国签证是否曾被注销？', type: 'select', options: ['yes', 'no'] },
  'section8.illegalEntry': { labelEn: 'Have you ever entered China illegally, overstayed, or worked illegally in China?', labelZh: '您是否曾非法入境、逾期居留或在中国非法工作？', type: 'select', options: ['yes', 'no'] },
  'section8.criminalRecord': { labelEn: 'Do you have any criminal record in China or any other country?', labelZh: '您是否有犯罪记录？', type: 'select', options: ['yes', 'no'] },
  'section8.mentalOrInfectious': { labelEn: 'Do you have any serious mental disorders or infectious diseases?', labelZh: '您是否患有严重精神疾病或传染病？', type: 'select', options: ['yes', 'no'] },
  'section8.visitedEpidemic': { labelEn: 'Have you visited countries or regions in the past 30 days where there is an epidemic?', labelZh: '过去30天您是否到访过疫区？', type: 'select', options: ['yes', 'no'] },
  'section8.specialSkills': { labelEn: 'Do you have any training in firearms, explosives, or nuclear/biological/chemical fields?', labelZh: '您是否受过枪械、爆炸物或核生化领域的培训？', type: 'select', options: ['yes', 'no'] },
  'section8.militaryService': { labelEn: 'Are you serving or have you ever served in the military?', labelZh: '您是否正在服役或曾经服役？', type: 'select', options: ['yes', 'no'] },
  'section8.paramilitaryOrg': { labelEn: 'Have you ever served or participated in any paramilitary/rebel organization?', labelZh: '您是否曾参与准军事或武装组织？', type: 'select', options: ['yes', 'no'] },
  'section8.charitableOrg': { labelEn: 'Have you worked for any professional, social, or charitable organization?', labelZh: '您是否在专业/社会/慈善机构工作过？', type: 'select', options: ['yes', 'no'] },
  'section8.otherDeclaration': { labelEn: 'Is there anything else you want to declare?', labelZh: '您是否有其他需要申报的事项？', type: 'select', options: ['yes', 'no'] },

  // ── Section 9: Declaration ──
  'section9.filledBy': { labelEn: 'Who is filling in this form?', labelZh: '谁在填写此表？', type: 'select', options: ['applicant', 'representative'] },
  'section9.agreed': { labelEn: 'Do you understand and agree with the declaration that all info is true and correct?', labelZh: '您是否理解并同意所填信息真实准确的声明？', type: 'select', options: ['yes', 'no'] },
};
