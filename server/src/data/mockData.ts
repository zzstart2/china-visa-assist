/**
 * Mock OCR/document extraction data.
 * Extension point: replace with real OCR service calls.
 */

// Philippine applicant for M visa (business visit Shanghai)
export const mockMData = {
  passport: {
    familyName: 'DELA CRUZ',
    givenName: 'JUAN',
    passportNo: 'P1234567A',
    nationality: 'PHL',
    birthDate: '1990-05-15',
    expiryDate: '2030-01-01',
    gender: 'M'
  },
  photo: { compliant: true },
  sections: {
    section1: {
      fullName: 'JUAN DELA CRUZ',
      familyName: 'DELA CRUZ',
      givenName: 'JUAN',
      otherName: '',
      sex: 'M',
      birthDate: '1990-05-15',
      birthPlace: 'Manila, Philippines',
      nationality: 'Philippines',
      otherNationality: ''
    },
    section2: {
      passportType: 'P',
      passportNo: 'P1234567A',
      issueDate: '2020-01-15',
      expiryDate: '2030-01-01',
      issuePlace: 'Manila',
      issuingAuthority: 'Department of Foreign Affairs'
    },
    section3: {
      currentAddress: '123 Taft Avenue, Manila',
      phone: '+63 912 345 6789',
      email: 'juan.delacruz@email.com'
    },
    section4: {
      education: 'Bachelor',
      occupation: 'Business Manager',
      position: 'Regional Manager',
      employerName: 'ABC Trading Co., Ltd.',
      employerAddress: '456 Business Ave, Makati City',
      employerPhone: '+63 2 888 1234'
    },
    section5: {
      previousChinaVisit: false,
      previousChinaDate: '',
      previousChinaPurpose: ''
    },
    section6: {
      visaType: 'M',
      purpose: 'Business',
      inviterName: 'Shanghai Tech Solutions Ltd.',
      inviterOrganization: 'Shanghai Tech Solutions Ltd.',
      inviterAddress: '888 Nanjing Road, Shanghai',
      inviterPhone: '+86 21 5555 8888',
      inviterRelationship: 'Business Partner',
      invitationLetterNo: 'INV2024SH001',
      invitationDate: '2024-02-01'
    },
    section7: {
      hotelName: 'Shanghai Grand Hyatt',
      hotelAddress: '123 West Nanjing Road, Shanghai',
      hotelPhone: '+86 21 1234 5678'
    },
    section8: {
      emergencyName: 'Maria Dela Cruz',
      emergencyRelationship: 'Spouse',
      emergencyPhone: '+63 917 987 6543',
      emergencyEmail: 'maria.delacruz@email.com',
      emergencyAddress: '123 Taft Avenue, Manila'
    },
    section9: {
      declarationDate: '2024-02-15',
      declarationSignature: 'J dela Cruz'
    }
  }
};

// Philippine applicant for G visa (transit via Beijing to Tokyo)
export const mockGData = {
  passport: {
    familyName: 'SANTOS',
    givenName: 'MARIA',
    passportNo: 'P7654321B',
    nationality: 'PHL',
    birthDate: '1985-08-22',
    expiryDate: '2029-08-22',
    gender: 'F'
  },
  photo: { compliant: true },
  sections: {
    section1: {
      fullName: 'MARIA SANTOS',
      familyName: 'SANTOS',
      givenName: 'MARIA',
      otherName: 'ROSARIO',
      sex: 'F',
      birthDate: '1985-08-22',
      birthPlace: 'Cebu City, Philippines',
      nationality: 'Philippines',
      otherNationality: ''
    },
    section2: {
      passportType: 'P',
      passportNo: 'P7654321B',
      issueDate: '2019-09-01',
      expiryDate: '2029-08-22',
      issuePlace: 'Cebu',
      issuingAuthority: 'Department of Foreign Affairs'
    },
    section3: {
      currentAddress: '456 Colon Street, Cebu City',
      phone: '+63 932 456 7890',
      email: 'maria.santos@email.com'
    },
    section4: {
      education: 'Master',
      occupation: 'Engineer',
      position: 'Software Engineer',
      employerName: 'Tech Global Inc.',
      employerAddress: '789 IT Park, Cebu City',
      employerPhone: '+63 32 234 5678'
    },
    section5: {
      previousChinaVisit: true,
      previousChinaDate: '2023-12-10',
      previousChinaPurpose: 'Transit to Hong Kong'
    },
    section6: {
      visaType: 'G',
      purpose: 'Transit',
      departureCity: 'Beijing',
      departureDate: '2024-03-01',
      flightNo: 'CA123',
      finalDestination: 'Tokyo, Japan'
    },
    section7: {
      hotelName: 'Beijing Capital Airport Hotel',
      hotelAddress: 'Terminal 3, Beijing Capital Airport',
      hotelPhone: '+86 10 6456 7890'
    },
    section8: {
      emergencyName: 'Pedro Santos',
      emergencyRelationship: 'Father',
      emergencyPhone: '+63 918 123 4567',
      emergencyEmail: 'pedro.santos@email.com',
      emergencyAddress: '456 Colon Street, Cebu City'
    },
    section9: {
      declarationDate: '2024-02-20',
      declarationSignature: 'M Santos'
    }
  }
};

/** Mock prefill data returned by batch upload (structured per ApplicationForm) */
export const mockBatchPrefill = {
  section1: {
    familyName: { value: 'DELA CRUZ', notApplicable: false },
    givenName: { value: 'JUAN', notApplicable: false },
    otherNames: '',
    chineseName: '',
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
