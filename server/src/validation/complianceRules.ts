/**
 * Compliance-level validation rules (run after document upload).
 * To add a new rule: append a ComplianceRule object to the array.
 */
import { ComplianceRule, ComplianceWarning } from './types';

export const complianceRules: ComplianceRule[] = [
  // ── 1. Passport expiry: must be ≥ 6 months from today ──
  {
    name: 'passportExpiry',
    check: (prefillData, warnings) => {
      const s1 = prefillData?.section1;
      if (!s1?.passportExpiry) return;
      const { year, month, day } = s1.passportExpiry;
      if (!year || !month || !day) return;
      const expiry = new Date(`${year}-${month}-${day}`);
      const sixMonthsLater = new Date();
      sixMonthsLater.setMonth(sixMonthsLater.getMonth() + 6);
      if (expiry < sixMonthsLater) {
        warnings.push({
          field: 'section1.passportExpiry',
          level: 'error',
          messageEn: `Passport expires on ${year}-${month}-${day}. It must be valid for at least 6 months from today.`,
          messageZh: `护照有效期至 ${year}-${month}-${day}，距今不足6个月，不符合要求。`,
        });
      }
    },
  },

  // ── 2. Minor applicant (under 18) ──
  {
    name: 'minorApplicant',
    check: (prefillData, warnings) => {
      const s1 = prefillData?.section1;
      if (!s1?.birthDate) return;
      const { year, month, day } = s1.birthDate;
      if (!year || !month || !day) return;
      const birth = new Date(`${year}-${month}-${day}`);
      const today = new Date();
      let age = today.getFullYear() - birth.getFullYear();
      const m = today.getMonth() - birth.getMonth();
      if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) age--;
      if (age < 18) {
        warnings.push({
          field: 'section1.birthDate',
          level: 'warning',
          messageEn: `Applicant is under 18 (age ${age}). Additional documents required: birth certificate, parents' passport copies, and consent letter if one parent is not traveling.`,
          messageZh: `申请人未满18岁（${age}岁）。需额外提供：出生证明、父母护照复印件，如一方父母未同行需提供同意旅行函。`,
        });
      }
    },
  },

  // ── 3. Non-Philippine citizen → need residence permit ──
  {
    name: 'nonPhilippineCitizen',
    check: (prefillData, warnings) => {
      const s1 = prefillData?.section1;
      if (!s1?.currentNationality) return;
      if (s1.currentNationality.toLowerCase() !== 'philippines' && s1.currentNationality !== 'PHL') {
        warnings.push({
          field: 'section1.currentNationality',
          level: 'warning',
          messageEn: `Applicant is not a Philippine citizen (nationality: ${s1.currentNationality}). A valid residence/work/study permit in the Philippines is required.`,
          messageZh: `申请人非菲律宾公民（国籍：${s1.currentNationality}），需提供在菲居留/工作/学习的有效证明。`,
        });
      }
    },
  },

  // ── 4. Birth in China → may need former nationality proof ──
  {
    name: 'chinaBirth',
    check: (prefillData, warnings) => {
      const s1 = prefillData?.section1;
      if (!s1?.birthCountry) return;
      const cn = s1.birthCountry.toLowerCase();
      if (cn === 'china' || cn === 'cn' || cn === 'chn' || cn.includes('中国') || cn.includes('hong kong') || cn.includes('macau') || cn.includes('taiwan')) {
        warnings.push({
          field: 'section1.birthCountry',
          level: 'warning',
          messageEn: `Applicant was born in ${s1.birthCountry}. If you previously held Chinese nationality, you must provide your original Chinese passport or relevant proof.`,
          messageZh: `申请人出生地为${s1.birthCountry}。如曾持有中国国籍，需提供原中国护照或相关证明。`,
        });
      }
    },
  },

  // ── 5. M-visa: invitation letter required ──
  {
    name: 'mVisaInvitation',
    check: (prefillData, warnings) => {
      const s2 = prefillData?.section2;
      if (!s2?.visaType || !s2.visaType.includes('(M)')) return;
      const s6 = prefillData?.section6;
      if (!s6?.inviter?.name) {
        warnings.push({
          field: 'section6.inviter.name',
          level: 'warning',
          messageEn: 'Business invitation letter required for M-visa. The letter must include: invitee info (name, gender, DOB, passport no.), visit details (purpose, dates, places, relationship, funding source), and inviter info (company name, phone, address, stamp, representative signature).',
          messageZh: '商务签（M签）需提供商务邀请函。邀请函须包含：被邀请人信息（姓名、性别、出生日期、护照号）、访问信息（事由、日期、地点、关系、费用来源）、邀请方信息（单位名称、电话、地址、公章、法人签字）。',
        });
      }
    },
  },

  // ── 6. Visa parameter constraints ──
  {
    name: 'visaParameters',
    check: (prefillData, warnings) => {
      const s2 = prefillData?.section2;
      if (s2?.validityMonths) {
        const v = parseInt(s2.validityMonths);
        const allowed = [3, 6, 12, 24, 36, 48, 60];
        if (v && !allowed.includes(v)) {
          warnings.push({
            field: 'section2.validityMonths',
            level: 'error',
            messageEn: `Visa validity ${v} months is not allowed. Must be one of: 3, 6, 12, or a multiple of 12.`,
            messageZh: `签证有效期 ${v} 个月不符合要求，必须为 3、6、12 或 12 的倍数。`,
          });
        }
      }
      if (s2?.maxStayDays) {
        const d = parseInt(s2.maxStayDays);
        if (d && (d % 30 !== 0 || d > 180)) {
          warnings.push({
            field: 'section2.maxStayDays',
            level: 'error',
            messageEn: `Max stay ${d} days is not allowed. Must be a multiple of 30 and ≤ 180 days.`,
            messageZh: `最长停留 ${d} 天不符合要求，必须为 30 的倍数且不超过 180 天。`,
          });
        }
      }
    },
  },
];
