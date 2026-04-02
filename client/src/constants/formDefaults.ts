/**
 * Default values and factory functions for ApplicationForm.
 * Used by VisaContext on init and by Step2 mock prefill.
 */
import type {
  ApplicationForm, DateValue, NAField, OtherInfoQuestion,
  PersonalInfo, VisaTypeInfo, WorkInfo, EducationInfo,
  FamilyInfo, TravelInfo, PreviousTravel, OtherInfo, Declaration,
  ParentInfo, EmergencyContact, InviterInfo,
} from '../types/application';

// ---- Helpers ----

export const emptyDate = (): DateValue => ({ year: '', month: '', day: '' });
export const emptyNA = (): NAField => ({ value: '', notApplicable: false });
export const emptyYesNo = '' as const;
export const emptyQuestion = (): OtherInfoQuestion => ({ answer: '', details: '' });

const emptyParent = (): ParentInfo => ({
  familyName: emptyNA(), givenName: emptyNA(),
  nationality: '', birthDate: emptyDate(), isInChina: '',
});

const emptyEmergencyContact = (): EmergencyContact => ({
  familyName: emptyNA(), givenName: emptyNA(),
  relationship: '', phone: '', email: '',
});

const emptyInviter = (): InviterInfo => ({
  notApplicable: false, name: '', relationship: '', phone: '', email: '',
  province: '', city: '', district: '', postCode: '',
});

// ---- Section defaults ----

export const defaultSection1 = (): PersonalInfo => ({
  familyName: emptyNA(), givenName: emptyNA(),
  otherNames: '', chineseName: '',
  birthDate: emptyDate(),
  gender: '',
  birthCountry: '', birthProvince: '', birthCity: '',
  maritalStatus: '',
  currentNationality: '', nationalIdNumber: emptyNA(),
  hasOtherNationality: '', hasPermanentResident: '', hadOtherNationalities: '',
  passportType: '', passportNumber: '',
  issuingCountry: '', placeOfIssue: '', passportExpiry: emptyDate(),
});

export const defaultSection2 = (): VisaTypeInfo => ({
  visaType: '(M) Commercial and trade activities',
  serviceType: '', validityMonths: '', maxStayDays: '', entries: '',
});

export const defaultSection3 = (): WorkInfo => ({
  currentOccupation: '', occupationOther: '', workHistory: [],
});

export const defaultSection4 = (): EducationInfo => ({
  notApplicable: false, entries: [],
});

export const defaultSection5 = (): FamilyInfo => ({
  currentAddress: '', phone: '', mobilePhone: '', email: '',
  father: emptyParent(), mother: emptyParent(),
  children: [], hasRelativesInChina: '',
});

export const defaultSection6 = (): TravelInfo => ({
  itinerary: [], departureDate: emptyDate(), departureTransport: '', departureCity: '',
  inviter: emptyInviter(), emergencyContact: emptyEmergencyContact(),
  travelPayBy: '', sharePassport: '',
});

export const defaultSection7 = (): PreviousTravel => ({
  hasBeenToChina: '', hasChineseVisa: '', hasOtherValidVisa: '', hasTraveledLast12Months: '',
});

export const defaultSection8 = (): OtherInfo => ({
  refusedVisa: emptyQuestion(), canceledVisa: emptyQuestion(),
  illegalEntry: emptyQuestion(), criminalRecord: emptyQuestion(),
  mentalOrInfectious: emptyQuestion(), visitedEpidemic: emptyQuestion(),
  specialSkills: emptyQuestion(), militaryService: emptyQuestion(),
  paramilitaryOrg: emptyQuestion(), charitableOrg: emptyQuestion(),
  otherDeclaration: emptyQuestion(),
});

export const defaultSection9 = (): Declaration => ({
  filledBy: '', agreed: false,
});

// ---- Full form factory ----

export function createEmptyForm(): ApplicationForm {
  return {
    section1: defaultSection1(),
    section2: defaultSection2(),
    section3: defaultSection3(),
    section4: defaultSection4(),
    section5: defaultSection5(),
    section6: defaultSection6(),
    section7: defaultSection7(),
    section8: defaultSection8(),
    section9: defaultSection9(),
  };
}

// ---- M-Visa mock prefill (Philippine business applicant JUAN DELA CRUZ) ----

export function createMockPrefill(): Partial<ApplicationForm> {
  return {
    section1: {
      ...defaultSection1(),
      familyName: { value: 'DELA CRUZ', notApplicable: false },
      givenName: { value: 'JUAN', notApplicable: false },
      birthDate: { year: '1990', month: '05', day: '15' },
      gender: 'Male',
      birthCountry: 'Philippines',
      birthProvince: 'Metro Manila',
      birthCity: 'Manila',
      maritalStatus: 'Single',
      currentNationality: 'Philippines',
      nationalIdNumber: { value: '', notApplicable: true },
      hasOtherNationality: 'no',
      hasPermanentResident: 'no',
      hadOtherNationalities: 'no',
      passportType: 'Ordinary',
      passportNumber: 'P1234567A',
      issuingCountry: 'Philippines',
      placeOfIssue: 'Manila',
      passportExpiry: { year: '2030', month: '05', day: '15' },
    },
    section2: {
      visaType: '(M) Commercial and trade activities',
      serviceType: 'Normal',
      validityMonths: '',
      maxStayDays: '',
      entries: 'Single',
    },
    section3: {
      currentOccupation: 'Businessperson',
      occupationOther: '',
      workHistory: [{
        dateFrom: { year: '2020', month: '01' },
        dateTo: { year: '2026', month: '03' },
        employerName: 'ABC Trading Co., Ltd.',
        employerAddress: '123 Business Ave, Makati City, Philippines',
        employerPhone: '+63 2 888 1234',
        supervisorName: '',
        supervisorPhone: '',
        position: 'Regional Manager',
        duty: 'Business development and trade negotiations',
      }],
    },
  };
}
