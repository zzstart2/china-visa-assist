/**
 * CCNA M-Visa (Business) Application Form — Complete Type Definitions
 * Based on visa-ccna-form-prd.md Section 1-9
 * 
 * This is the SINGLE SOURCE OF TRUTH for the application data structure.
 * All steps read from and write to this structure via VisaContext.
 */

// ============================================================
// Shared primitives
// ============================================================

export type Language = 'zh' | 'en';

/** Date stored as { year, month, day } strings to match CCNA 3-column date picker */
export interface DateValue {
  year: string;   // "yyyy"
  month: string;  // "01"-"12"
  day: string;    // "01"-"31"
}

export type YesNo = 'yes' | 'no' | '';

/** A field that supports "Not applicable" checkbox */
export interface NAField {
  value: string;
  notApplicable: boolean;
}

// ============================================================
// Section 1: Personal Information
// ============================================================

export interface PersonalInfo {
  // 1.1 Name
  familyName: NAField;       // 1.1A
  givenName: NAField;        // 1.1B
  otherNames: string;        // 1.1C (optional)
  chineseName: string;       // 1.1D (optional)

  // 1.2 Date of Birth
  birthDate: DateValue;      // 1.2A

  // 1.3 Gender
  gender: 'Male' | 'Female' | '';  // 1.3A

  // 1.4 Place of Birth
  birthCountry: string;      // 1.4A (dropdown)
  birthProvince: string;     // 1.4B
  birthCity: string;         // 1.4C

  // 1.5 Marital Status
  maritalStatus: 'Married' | 'Divorced' | 'Single' | 'Widowed' | 'Other' | '';

  // 1.6 Nationality & Permanent Residence
  currentNationality: string;     // 1.6A (dropdown)
  nationalIdNumber: NAField;      // 1.6B
  hasOtherNationality: YesNo;     // 1.6C
  otherNationality?: string;
  otherNationalityIdNumber?: string;
  otherNationalityDate?: DateValue;
  hasPermanentResident: YesNo;    // 1.6F
  permanentResidentCountry?: string;
  hadOtherNationalities: YesNo;

  // 1.7 Passport
  passportType: 'Ordinary' | 'Service' | 'Diplomatic' | 'Official' | 'Special' | 'Other' | '';
  passportNumber: string;         // 1.7B
  issuingCountry: string;         // 1.7C (dropdown)
  placeOfIssue: string;           // 1.7D
  passportExpiry: DateValue;      // 1.7E
}

// ============================================================
// Section 2: Type of Visa
// ============================================================

export interface VisaTypeInfo {
  visaType: string;                    // 2.1 — fixed to "(M) Commercial and trade activities"
  serviceType: 'Normal' | 'Express' | '';  // 2.2
  validityMonths: string;              // 2.3A (optional)
  maxStayDays: string;                 // 2.3B (optional)
  entries: 'Single' | 'Double' | 'Multiple' | '';  // 2.3C (optional)
}

// ============================================================
// Section 3: Work Information
// ============================================================

export interface WorkExperience {
  dateFrom: { year: string; month: string };
  dateTo: { year: string; month: string };
  employerName: string;       // 3.2B — full name, no abbreviations
  employerAddress: string;
  employerPhone: string;
  supervisorName: string;     // 3.2C
  supervisorPhone: string;
  position: string;           // 3.2D
  duty: string;               // 3.2E
}

export interface WorkInfo {
  currentOccupation: string;  // 3.1 (dropdown)
  occupationOther: string;    // only if "Other"
  workHistory: WorkExperience[];  // 3.2 (repeatable)
}

// ============================================================
// Section 4: Education
// ============================================================

export interface EducationEntry {
  instituteName: string;   // 4.1A
  degree: string;          // 4.1B (dropdown)
  major: string;           // 4.1C (optional)
}

export interface EducationInfo {
  notApplicable: boolean;
  entries: EducationEntry[];
}

// ============================================================
// Section 5: Family Information
// ============================================================

export interface FamilyMemberBasic {
  familyName: NAField;
  givenName: NAField;
  nationality: string;
  birthDate: DateValue;
}

export interface SpouseInfo extends FamilyMemberBasic {
  birthCountry: string;
  birthProvince: string;
  birthCity: string;
  address: string;
  isInChina: YesNo;
}

export interface ParentInfo extends FamilyMemberBasic {
  isInChina: YesNo;
}

export interface ChildInfo {
  familyName: NAField;
  givenName: NAField;
  nationality: string;
  occupation: string;
  birthDate: DateValue;
}

export interface FamilyInfo {
  // Contact
  currentAddress: string;    // 5.1
  phone: string;             // 5.2
  mobilePhone: string;       // 5.3
  email: string;             // 5.4 (optional)

  // Family members
  spouse?: SpouseInfo;       // 5.5A — only if married
  father: ParentInfo;        // 5.5B
  mother: ParentInfo;        // 5.5C
  children: ChildInfo[];     // 5.5D (repeatable)
  hasRelativesInChina: YesNo;  // 5.5E
}

// ============================================================
// Section 6: Travel Information
// ============================================================

export interface ItineraryEntry {
  arrivalDate: DateValue;        // 6.1A
  arrivalTransport: string;      // 6.1B (optional)
  destinationCity: string;       // 6.1C
  stayCity: string;              // 6.1D
  stayAddress: string;           // 6.1E
  stayArrivalDate: DateValue;    // 6.1F
  stayDepartureDate: DateValue;  // 6.1G
}

export interface InviterInfo {
  notApplicable: boolean;
  name: string;             // 6.2A
  relationship: string;     // 6.2B
  phone: string;            // 6.2C
  email: string;            // 6.2D (optional)
  province: string;         // 6.2E
  city: string;
  district: string;
  postCode: string;         // 6.2F (optional)
}

export interface EmergencyContact {
  familyName: NAField;      // 6.3A
  givenName: NAField;
  relationship: string;     // 6.3B
  phone: string;            // 6.3C
  email: string;            // 6.3D (optional)
}

export type TravelPayBy = 'Self' | 'Other' | 'Organization' | '';

export interface TravelPayOther {
  name: string;
  relationship: string;
  phone: string;
  email: string;
  address: string;
}

export interface TravelPayOrg {
  orgName: string;
  orgType: string;
  phone: string;
  email: string;
  address: string;
}

export interface TravelInfo {
  itinerary: ItineraryEntry[];          // 6.1 (repeatable)
  departureDate: DateValue;              // 6.1H
  departureTransport: string;            // 6.1J (optional)
  departureCity: string;                 // 6.1K
  inviter: InviterInfo;                  // 6.2
  emergencyContact: EmergencyContact;    // 6.3
  travelPayBy: TravelPayBy;             // 6.4A
  travelPayOther?: TravelPayOther;
  travelPayOrg?: TravelPayOrg;
  sharePassport: YesNo;                  // 6.5A
}

// ============================================================
// Section 7: Previous Travel
// ============================================================

export interface PreviousTravel {
  hasBeenToChina: YesNo;           // 7.1A
  lastChinaVisitDate?: DateValue;
  chinaVisitCount?: string;
  hasChineseVisa: YesNo;           // 7.2A
  chineseVisaNumber?: string;
  chineseVisaIssuePlace?: string;
  chineseVisaIssueDate?: DateValue;
  hasLostChineseVisa?: YesNo;
  hasOtherValidVisa: YesNo;        // 7.3
  otherVisas?: Array<{
    country: string;
    visaType: string;
    visaNumber: string;
    expiryDate: DateValue;
  }>;
  hasTraveledLast12Months: YesNo;  // 7.4A
  recentTravelCountries?: string[];
}

// ============================================================
// Section 8: Other Information (11 Yes/No questions)
// ============================================================

export interface OtherInfoQuestion {
  answer: YesNo;
  details: string;  // required if "yes"
}

export interface OtherInfo {
  refusedVisa: OtherInfoQuestion;           // 8.1
  canceledVisa: OtherInfoQuestion;          // 8.2
  illegalEntry: OtherInfoQuestion;          // 8.3
  criminalRecord: OtherInfoQuestion;        // 8.4
  mentalOrInfectious: OtherInfoQuestion;    // 8.5
  visitedEpidemic: OtherInfoQuestion;       // 8.6
  specialSkills: OtherInfoQuestion;         // 8.7
  militaryService: OtherInfoQuestion;       // 8.8
  paramilitaryOrg: OtherInfoQuestion;       // 8.9
  charitableOrg: OtherInfoQuestion;         // 8.10
  otherDeclaration: OtherInfoQuestion;      // 8.11
}

// ============================================================
// Section 9: Declaration
// ============================================================

export interface Declaration {
  filledBy: 'applicant' | 'representative' | '';  // 9.1
  representativeName?: string;
  representativeRelationship?: string;
  representativePhone?: string;
  agreed: boolean;  // 9.1A checkbox
}

// ============================================================
// Top-level Application Form
// ============================================================

export interface ApplicationForm {
  section1: PersonalInfo;
  section2: VisaTypeInfo;
  section3: WorkInfo;
  section4: EducationInfo;
  section5: FamilyInfo;
  section6: TravelInfo;
  section7: PreviousTravel;
  section8: OtherInfo;
  section9: Declaration;
}

// ============================================================
// Document Upload State
// ============================================================

export type DocumentType =
  | 'passport'
  | 'photo'
  | 'invitation'
  | 'employment'
  | 'residence'
  | 'previousVisa'
  | 'other';

export interface DocumentStatus {
  type: DocumentType;
  label: string;
  labelZh: string;
  mandatory: boolean;
  uploaded: boolean;
  valid: boolean;
  file?: File;
}

// ============================================================
// Field metadata (for Step3 LLM conversation)
// ============================================================

export interface FieldMeta {
  path: string;        // dot-notation, e.g. "section5.phone"
  labelEn: string;
  labelZh: string;
  inputType: 'text' | 'select' | 'date' | 'radio' | 'textarea';
  options?: string[];
  required: boolean;
  section: number;     // 1-9
}

// ============================================================
// Application Session State (in VisaContext)
// ============================================================

export interface AppSession {
  language: Language;
  sessionId: string | null;
  form: ApplicationForm;
  documents: DocumentStatus[];
  /** dot-paths of fields that still need to be filled in Step3 */
  pendingFields: string[];
  /** dot-paths of fields already filled */
  filledFields: string[];
  /** Step progression: 1-5 */
  currentStep: number;

  // Legacy compat — used by Step4/Step5 (will be removed after Step4/5 refactor)
  /** @deprecated use form sections instead */
  formData: Record<string, string>;
  /** @deprecated use form.section1 passport fields instead */
  extractedPassport: {
    name?: string;
    passportNumber?: string;
    nationality?: string;
    birthDate?: string;
    expiryDate?: string;
  } | null;
  /** @deprecated use form.section2.visaType */
  visaType: string | null;
  /** @deprecated */
  uploadedFiles: Record<string, File[]>;
}
