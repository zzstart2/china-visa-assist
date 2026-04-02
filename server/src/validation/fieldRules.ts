/**
 * Field-level validation rules.
 * To add a new rule: append a FieldRule object to the array.
 */
import { FieldRule, ValidationResult } from './types';

const fail = (lang: string, en: string, zh: string): ValidationResult => ({
  status: 'fail',
  message: lang === 'zh' ? zh : en,
});

/** Philippine mobile number: 09xxxxxxxxx (11 digits) */
const isPhilippineNumber = (v: string) => /09\d{9}/.test(v.replace(/[\s\-\+]/g, ''));

export const fieldRules: FieldRule[] = [
  // ── Phone validation ──
  {
    match: ['section5.phone', 'section5.mobilePhone'],
    validate: ({ value, lang }) => {
      if (!value.trim()) return fail(lang, 'Phone number is required.', '电话号码为必填项。');
      if (!isPhilippineNumber(value))
        return fail(lang,
          'Must include a Philippine local number (starting with 09, 11 digits).',
          '必须包含菲律宾本地号码（09开头，11位数字）。');
      return null;
    },
  },

  // ── Emergency contact phone ≠ applicant phone ──
  {
    match: 'section6.emergencyContact.phone',
    validate: ({ value, lang, filledFields }) => {
      const applicantPhone = filledFields['section5.phone'] || filledFields['section5.mobilePhone'] || '';
      if (value.trim() && applicantPhone && value.replace(/\s/g, '') === applicantPhone.replace(/\s/g, ''))
        return fail(lang,
          "Emergency contact's phone number must be different from your own.",
          '紧急联系人电话不能与申请人相同。');
      return null;
    },
  },

  // ── Visa validity months ──
  {
    match: 'section2.validityMonths',
    validate: ({ value, lang }) => {
      if (!value.trim()) return null;
      const v = parseInt(value);
      const allowed = [3, 6, 12, 24, 36, 48, 60];
      if (!v || !allowed.includes(v))
        return fail(lang,
          'Visa validity must be 3, 6, 12, or a multiple of 12 months.',
          '签证有效期必须为 3、6、12 或 12 的倍数。');
      return null;
    },
  },

  // ── Max stay days ──
  {
    match: 'section2.maxStayDays',
    validate: ({ value, lang }) => {
      if (!value.trim()) return null;
      const d = parseInt(value);
      if (!d || d % 30 !== 0 || d > 180)
        return fail(lang,
          'Max stay must be a multiple of 30 days and no more than 180 days.',
          '最长停留天数必须为 30 的倍数且不超过 180 天。');
      return null;
    },
  },

  // ── Occupation sensitive words ──
  {
    match: 'section3.currentOccupation',
    validate: ({ value, lang }) => {
      const lower = value.toLowerCase();
      if (lower.includes('nanny') || lower.includes('helper') || lower.includes('domestic') || lower.includes('maid'))
        return fail(lang,
          'Domestic worker/nanny applicants have special restrictions (max 15 days stay, additional photos required). Please consult the center staff.',
          '家政/保姆类申请人有特殊限制（最长15天，需提供额外照片），请咨询中心工作人员。');
      return null;
    },
  },

  // ── Share passport must be "no" ──
  {
    match: 'section6.sharePassport',
    validate: ({ value, lang }) => {
      if (value.toLowerCase() === 'yes')
        return fail(lang,
          'Per policy, this field must be "No" for individual applications.',
          '根据政策规定，此项必须填"否"。');
      return null;
    },
  },

  // ── Yes/No format validation ──
  {
    match: (field) => [
      'section1.hasOtherNationality', 'section1.hasPermanentResident', 'section1.hadOtherNationalities',
      'section5.hasRelativesInChina',
      'section7.hasBeenToChina', 'section7.hasChineseVisa', 'section7.hasOtherValidVisa', 'section7.hasTraveledLast12Months',
      'section8.refusedVisa', 'section8.canceledVisa', 'section8.illegalEntry', 'section8.criminalRecord',
      'section8.mentalOrInfectious', 'section8.visitedEpidemic', 'section8.specialSkills',
      'section8.militaryService', 'section8.paramilitaryOrg', 'section8.charitableOrg', 'section8.otherDeclaration',
    ].includes(field),
    validate: ({ value, lang }) => {
      const lower = value.toLowerCase().trim();
      if (lower !== 'yes' && lower !== 'no')
        return fail(lang, 'Please answer "yes" or "no".', '请回答"yes"或"no"。');
      return null;
    },
  },

  // ── Declaration must be agreed ──
  {
    match: 'section9.agreed',
    validate: ({ value, lang }) => {
      if (value.toLowerCase().trim() !== 'yes')
        return fail(lang,
          'You must agree to the declaration to proceed.',
          '必须同意声明条款才能继续。');
      return null;
    },
  },

  // ── Required text fields ──
  {
    match: (field) => [
      'section1.familyName', 'section1.givenName', 'section1.birthCountry', 'section1.birthProvince',
      'section1.birthCity', 'section1.passportNumber', 'section1.issuingCountry', 'section1.placeOfIssue',
      'section5.currentAddress',
      'section6.inviter.name', 'section6.inviter.phone', 'section6.inviter.relationship',
      'section6.emergencyContact.familyName', 'section6.emergencyContact.givenName',
      'section6.emergencyContact.relationship', 'section6.emergencyContact.phone',
    ].includes(field),
    validate: ({ value, lang }) => {
      if (!value.trim())
        return fail(lang, 'This field is required.', '此字段为必填项。');
      return null;
    },
  },
];
