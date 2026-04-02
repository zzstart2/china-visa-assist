import dotenv from "dotenv";
dotenv.config({ path: "/root/.openclaw/.env" });

import express, { Request, Response } from 'express';
import cors from 'cors';
import multer from 'multer';
import path from 'path';

const app = express();
const PORT = 3001;

// Middleware
app.use(cors({
  origin: '*',
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Multer for file uploads
const upload = multer({ dest: 'uploads/' });

// ==================== MOCK DATA ====================
// Philippine applicant names for M visa (business visit Shanghai)
const mockMData = {
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
  // 9 Sections of form data (OCR extracted + chat collected)
  sections: {
    section1: { // Personal Information (already from OCR)
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
    section2: { // Passport Information (already from OCR)
      passportType: 'P',
      passportNo: 'P1234567A',
      issueDate: '2020-01-15',
      expiryDate: '2030-01-01',
      issuePlace: 'Manila',
      issuingAuthority: 'Department of Foreign Affairs'
    },
    section3: { // Contact Information
      currentAddress: '123 Taft Avenue, Manila',
      phone: '+63 912 345 6789',
      email: 'juan.delacruz@email.com'
    },
    section4: { // Education & Occupation
      education: 'Bachelor',
      occupation: 'Business Manager',
      position: 'Regional Manager',
      employerName: 'ABC Trading Co., Ltd.',
      employerAddress: '456 Business Ave, Makati City',
      employerPhone: '+63 2 888 1234'
    },
    section5: { // Previous China Visit
      previousChinaVisit: false,
      previousChinaDate: '',
      previousChinaPurpose: ''
    },
    section6: { // Invitation Information (M visa specific)
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
    section7: { // Accommodation
      hotelName: 'Shanghai Grand Hyatt',
      hotelAddress: '123 West Nanjing Road, Shanghai',
      hotelPhone: '+86 21 1234 5678'
    },
    section8: { // Emergency Contact
      emergencyName: 'Maria Dela Cruz',
      emergencyRelationship: 'Spouse',
      emergencyPhone: '+63 917 987 6543',
      emergencyEmail: 'maria.delacruz@email.com',
      emergencyAddress: '123 Taft Avenue, Manila'
    },
    section9: { // Declaration
      declarationDate: '2024-02-15',
      declarationSignature: 'J dela Cruz'
    }
  }
};

// Philippine applicant for G visa (transit via Beijing to Tokyo)
const mockGData = {
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

// Session storage
interface ChatSession {
  visaType: string;
  currentQuestionIndex: number;
  answers: Record<string, string>;
  questions: Array<{
    question: string;
    type: 'text' | 'select' | 'date';
    options?: string[];
    field: string;
    section: number;
  }>;
}

const chatSessions: Record<string, ChatSession> = {};

// M Visa Questions (40 questions)
const mVisaQuestions = [
  // Section 0: Personal Info
  { question: "What is your family name (as in passport)?", type: 'text' as const, field: 'familyName', section: 0 },
  { question: "What is/are your given name(s)?", type: 'text' as const, field: 'givenName', section: 0 },
  { question: "Do you have a Chinese name? (leave blank if none)", type: 'text' as const, field: 'chineseName', section: 0 },
  { question: "What is your gender?", type: 'select' as const, options: ['Male', 'Female'], field: 'gender', section: 0 },
  { question: "What is your date of birth?", type: 'date' as const, field: 'dateOfBirth', section: 0 },
  { question: "What is your country of birth?", type: 'text' as const, field: 'birthCountry', section: 0 },
  { question: "What is your province/state of birth?", type: 'text' as const, field: 'birthProvince', section: 0 },
  { question: "What is your city of birth?", type: 'text' as const, field: 'birthCity', section: 0 },
  { question: "What is your marital status?", type: 'select' as const, options: ['Married', 'Single', 'Divorced', 'Widowed'], field: 'maritalStatus', section: 0 },
  // Section 1: Passport
  { question: "What is your passport number?", type: 'text' as const, field: 'passportNumber', section: 1 },
  { question: "What type of passport do you have?", type: 'select' as const, options: ['Ordinary', 'Service', 'Diplomatic'], field: 'passportType', section: 1 },
  { question: "What country issued your passport?", type: 'text' as const, field: 'issuingCountry', section: 1 },
  { question: "When was your passport issued?", type: 'date' as const, field: 'passportIssueDate', section: 1 },
  { question: "When does your passport expire?", type: 'date' as const, field: 'passportExpiryDate', section: 1 },
  // Section 2: Travel
  { question: "What is the purpose of your visit to China?", type: 'select' as const, options: ['Business', 'Trade', 'Exhibition', 'Other'], field: 'purposeOfVisit', section: 2 },
  { question: "What is your intended date of entry into China?", type: 'date' as const, field: 'intendedEntryDate', section: 2 },
  { question: "What is your intended port of entry into China?", type: 'select' as const, options: ['Beijing', 'Shanghai', 'Guangzhou', 'Shenzhen', 'Other'], field: 'intendedEntryPort', section: 2 },
  { question: "How many days do you plan to stay in China?", type: 'select' as const, options: ['30', '60', '90', '180'], field: 'durationOfStay', section: 2 },
  { question: "How many entries do you need?", type: 'select' as const, options: ['Single Entry', 'Double Entry', 'Multiple Entry'], field: 'numberOfEntries', section: 2 },
  // Section 3: Contact Info (existing)
  { question: "What is your current residential address?", type: 'text' as const, field: 'currentAddress', section: 3 },
  { question: "What is your phone number?", type: 'text' as const, field: 'phone', section: 3 },
  { question: "What is your email address?", type: 'text' as const, field: 'email', section: 3 },
  // Section 4: Education & Work (existing)
  { question: "What is your highest education level?", type: 'select' as const, options: ['High School', 'Bachelor', 'Master', 'Doctorate'], field: 'education', section: 4 },
  { question: "What is your current occupation?", type: 'text' as const, field: 'occupation', section: 4 },
  { question: "What is your position/job title?", type: 'text' as const, field: 'position', section: 4 },
  { question: "What is your employer's name?", type: 'text' as const, field: 'employerName', section: 4 },
  { question: "What is your employer's address?", type: 'text' as const, field: 'employerAddress', section: 4 },
  { question: "What is your employer's phone number?", type: 'text' as const, field: 'employerPhone', section: 4 },
  // Section 5: Previous China Visit (existing + new previousChinaDate)
  { question: "Have you previously visited China?", type: 'select' as const, options: ['Yes', 'No'], field: 'previousChinaVisit', section: 5 },
  { question: "When did you last visit China? (if applicable)", type: 'date' as const, field: 'previousChinaDate', section: 5 },
  // Section 6: Invitation (existing)
  { question: "What is the name of the inviting company in China?", type: 'text' as const, field: 'inviterName', section: 6 },
  { question: "What is the inviting company's address?", type: 'text' as const, field: 'inviterAddress', section: 6 },
  { question: "What is the inviting company's phone number?", type: 'text' as const, field: 'inviterPhone', section: 6 },
  // Section 7: Accommodation (existing)
  { question: "Hotel name in Shanghai?", type: 'text' as const, field: 'hotelName', section: 7 },
  { question: "Hotel address?", type: 'text' as const, field: 'hotelAddress', section: 7 },
  { question: "Hotel phone?", type: 'text' as const, field: 'hotelPhone', section: 7 },
  // Section 8: Emergency Contact + Declaration (existing + new)
  { question: "Emergency contact name?", type: 'text' as const, field: 'emergencyName', section: 8 },
  { question: "Relationship to emergency contact?", type: 'text' as const, field: 'emergencyRelationship', section: 8 },
  { question: "Emergency contact phone?", type: 'text' as const, field: 'emergencyPhone', section: 8 },
  { question: "Do you agree to the declaration that all information provided is true and correct?", type: 'select' as const, options: ['Yes', 'No'], field: 'declarationAgreed', section: 8 },
];

// G Visa Questions (12 questions)
const gVisaQuestions = [
  { question: "What is your current residential address?", type: 'text' as const, field: 'currentAddress', section: 3 },
  { question: "What is your phone number?", type: 'text' as const, field: 'phone', section: 3 },
  { question: "What is your email address?", type: 'text' as const, field: 'email', section: 3 },
  { question: "What is your highest education level?", type: 'select' as const, options: ['High School', 'Bachelor', 'Master', 'Doctorate'], field: 'education', section: 4 },
  { question: "What is your current occupation?", type: 'text' as const, field: 'occupation', section: 4 },
  { question: "What is your position/job title?", type: 'text' as const, field: 'position', section: 4 },
  { question: "What is your employer's name?", type: 'text' as const, field: 'employerName', section: 4 },
  { question: "Have you previously visited China?", type: 'select' as const, options: ['Yes', 'No'], field: 'previousChinaVisit', section: 5 },
  { question: "When did you last visit China? (if applicable)", type: 'date' as const, field: 'previousChinaDate', section: 5 },
  { question: "What city will you depart from in China?", type: 'text' as const, field: 'departureCity', section: 6 },
  { question: "What is your departure date from China?", type: 'date' as const, field: 'departureDate', section: 6 },
  { question: "What is your flight number?", type: 'text' as const, field: 'flightNo', section: 6 },
  { question: "What is your final destination country?", type: 'text' as const, field: 'finalDestination', section: 6 },
  { question: "Hotel name near airport?", type: 'text' as const, field: 'hotelName', section: 7 },
  { question: "Emergency contact name?", type: 'text' as const, field: 'emergencyName', section: 8 },
  { question: "Relationship to emergency contact?", type: 'text' as const, field: 'emergencyRelationship', section: 8 },
  { question: "Emergency contact phone?", type: 'text' as const, field: 'emergencyPhone', section: 8 },
];

// ==================== ROUTES ====================

// Step 1: Visa Type Determination
app.post('/api/visa-type', (req: Request, res: Response) => {
  const { purpose, duration, transit } = req.body;
  
  let visaType = 'M';
  let requiredDocs = [
    'Passport (original + copy)',
    'Visa application form',
    'Photo (white background)',
    'Invitation letter (for business)',
    'Hotel reservation',
    'Flight itinerary'
  ];
  
  if (transit === true || transit === 'true') {
    visaType = 'G';
    requiredDocs = [
      'Passport (original + copy)',
      'Visa application form',
      'Photo (white background)',
      'Onward ticket to third country',
      'Hotel reservation near airport'
    ];
  }
  
  res.json({
    visaType,
    requiredDocs,
    note: visaType === 'M' 
      ? 'Business visa - requires invitation from Chinese company'
      : 'Transit visa - for transit through China to third country'
  });
});

// Step 2: Upload & OCR
app.post('/api/upload', upload.single('file'), (req: Request, res: Response) => {
  const { visaType } = req.body;
  
  const mockData = visaType === 'G' ? mockGData : mockMData;
  
  res.json({
    success: true,
    ocrResult: {
      passport: mockData.passport,
      photo: mockData.photo
    },
    extractedFields: [
      'familyName', 'givenName', 'passportNo', 
      'nationality', 'birthDate', 'expiryDate', 'gender'
    ]
  });
});

// Step 2: Validate Documents
app.post('/api/validate-documents', (req: Request, res: Response) => {
  const { passport, photo } = req.body;
  
  res.json({
    success: true,
    validation: {
      passport: {
        valid: true,
        message: 'Passport information verified'
      },
      photo: {
        valid: true,
        message: 'Photo meets requirements (white background, correct size)'
      }
    }
  });
});

// Step 3: Chat - Start
app.post('/api/chat/start', (req: Request, res: Response) => {
  const { visaType } = req.body;
  const sessionId = `session_${Date.now()}`;
  
  const questions = visaType === 'G' ? gVisaQuestions : mVisaQuestions;
  
  chatSessions[sessionId] = {
    visaType: visaType || 'M',
    currentQuestionIndex: 0,
    answers: {},
    questions
  };
  
  const firstQ = questions[0];
  res.json({
    sessionId,
    question: firstQ.question,
    type: firstQ.type,
    options: firstQ.options,
    field: firstQ.field,
    section: firstQ.section,
    progress: Math.round(100 / questions.length)
  });
});

// Step 3: Chat - Reply
app.post('/api/chat/reply', (req: Request, res: Response) => {
  const { sessionId, answer } = req.body;
  const session = chatSessions[sessionId];
  
  if (!session) {
    return res.status(400).json({ error: 'Invalid session' });
  }
  
  // Save answer
  const currentQ = session.questions[session.currentQuestionIndex];
  session.answers[currentQ.field] = answer;
  
  // Move to next question
  session.currentQuestionIndex++;
  
  if (session.currentQuestionIndex >= session.questions.length) {
    // Complete
    return res.json({
      done: true,
      complete: true,
      totalQuestions: session.questions.length,
      progress: 100,
      summary: session.answers
    });
  }
  
  const nextQ = session.questions[session.currentQuestionIndex];
  res.json({
    question: nextQ.question,
    type: nextQ.type,
    options: nextQ.options,
    field: nextQ.field,
    section: nextQ.section,
    progress: Math.round(((session.currentQuestionIndex + 1) / session.questions.length) * 100)
  });
});

// Step 4: Summary
app.get('/api/summary', (req: Request, res: Response) => {
  // Return mock M visa data (most common)
  res.json(mockMData.sections);
});

// Step 5: Export JSON
app.get('/api/export/json', (req: Request, res: Response) => {
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Content-Disposition', 'attachment; filename=visa-application.json');
  res.json(mockMData.sections);
});

// Step 5: Export CSV
app.get('/api/export/csv', (req: Request, res: Response) => {
  const sections = mockMData.sections;
  
  // Flatten data for CSV
  let csv = 'Section,Field,Value\n';
  
  Object.entries(sections).forEach(([sectionName, sectionData]) => {
    Object.entries(sectionData as Record<string, string>).forEach(([field, value]) => {
      csv += `${sectionName},${field},"${value}"\n`;
    });
  });
  
  res.setHeader('Content-Type', 'text/csv');
  res.setHeader('Content-Disposition', 'attachment; filename=visa-application.csv');
  res.send(csv);
});

// ==================== P2: Batch Upload + Mock OCR ====================
const uploadBatch = multer({ dest: 'uploads/' });

app.post('/api/upload/batch', uploadBatch.array('files', 20), (req: Request, res: Response) => {
  const files = (req as any).files || [];
  
  // Mock classification + OCR result
  const classified = files.map((f: any) => ({
    filename: f.originalname,
    type: guessDocType(f.originalname),
    status: 'processed',
  }));

  // Return mock prefill data (Philippine M-visa applicant)
  res.json({
    success: true,
    files: classified,
    prefillData: {
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
    },
    pendingFields: [
      'section5.currentAddress', 'section5.phone', 'section5.mobilePhone', 'section5.email',
      'section6.inviter.name', 'section6.inviter.phone', 'section6.inviter.relationship',
      'section6.emergencyContact.familyName', 'section6.emergencyContact.phone',
      'section6.emergencyContact.relationship', 'section6.travelPayBy',
      'section4.entries',
    ],
  });
});

function guessDocType(filename: string): string {
  const lower = filename.toLowerCase();
  if (lower.includes('passport')) return 'passport';
  if (lower.includes('photo')) return 'photo';
  if (lower.includes('invit')) return 'invitation';
  if (lower.includes('employ')) return 'employment';
  return 'other';
}

// ==================== P3: AI Chat (MiniMax / Mock fallback) ====================

interface AIChatSession {
  pendingFields: string[];
  filledFields: Record<string, string>;
  currentFieldIdx: number;
  language: string;
}

const aiChatSessions: Record<string, AIChatSession> = {};

// Field metadata for generating questions
const fieldMeta: Record<string, { labelEn: string; labelZh: string; type: string; options?: string[] }> = {
  // Section 1: Personal Information
  'section1.familyName': { labelEn: 'What is your family name (as shown on passport)?', labelZh: '您的姓氏（护照上的）：', type: 'text' },
  'section1.givenName': { labelEn: 'What is your given name (as shown on passport)?', labelZh: '您的名字（护照上的）：', type: 'text' },
  'section1.birthDate': { labelEn: 'What is your date of birth?', labelZh: '您的出生日期：', type: 'date' },
  'section1.gender': { labelEn: 'What is your gender?', labelZh: '您的性别：', type: 'select', options: ['Male', 'Female'] },
  'section1.birthCountry': { labelEn: 'Which country were you born in?', labelZh: '您的出生国家：', type: 'text' },
  'section1.birthProvince': { labelEn: 'Which province/state were you born in?', labelZh: '出生省份/州：', type: 'text' },
  'section1.birthCity': { labelEn: 'Which city were you born in?', labelZh: '出生城市：', type: 'text' },
  'section1.maritalStatus': { labelEn: 'What is your marital status?', labelZh: '您的婚姻状况：', type: 'select', options: ['Single', 'Married', 'Divorced', 'Widowed', 'Other'] },
  'section1.currentNationality': { labelEn: 'What is your current nationality?', labelZh: '您的当前国籍：', type: 'text' },
  'section1.passportNumber': { labelEn: 'What is your passport number?', labelZh: '您的护照号码：', type: 'text' },
  'section1.issuingCountry': { labelEn: 'Which country issued your passport?', labelZh: '护照签发国：', type: 'text' },
  'section1.placeOfIssue': { labelEn: 'Where was your passport issued?', labelZh: '护照签发地：', type: 'text' },
  'section1.passportExpiry': { labelEn: 'When does your passport expire?', labelZh: '护照有效期至：', type: 'date' },
  // Section 3: Work
  'section3.currentOccupation': { labelEn: 'What is your current occupation?', labelZh: '您当前的职业：', type: 'select', options: ['Businessperson', 'Company employee', 'Student', 'Self-employed', 'Retired', 'Other'] },
  'section3.employerName': { labelEn: 'What is the name of your employer?', labelZh: '您的雇主名称：', type: 'text' },
  'section3.employerAddress': { labelEn: 'What is your employer\'s address?', labelZh: '雇主地址：', type: 'text' },
  'section3.employerPhone': { labelEn: 'What is your employer\'s phone number?', labelZh: '雇主电话：', type: 'text' },
  'section3.position': { labelEn: 'What is your job title/position?', labelZh: '您的职位：', type: 'text' },
  // Section 4: Education
  'section4.entries': { labelEn: 'What is your highest education level?', labelZh: '您的最高学历是什么？', type: 'select', options: ['High school', 'Bachelor', 'Master', 'Doctoral', 'Other'] },
  'section4.instituteName': { labelEn: 'Name of your educational institution?', labelZh: '您的学校名称：', type: 'text' },
  'section4.major': { labelEn: 'What was your major/field of study?', labelZh: '您的专业：', type: 'text' },
  // Section 5: Family / Contact
  'section5.currentAddress': { labelEn: 'What is your current home address?', labelZh: '请输入您当前的居住地址：', type: 'text' },
  'section5.phone': { labelEn: 'What is your phone number?', labelZh: '请输入您的电话号码：', type: 'text' },
  'section5.mobilePhone': { labelEn: 'What is your mobile phone number?', labelZh: '请输入您的手机号码：', type: 'text' },
  'section5.email': { labelEn: 'What is your email address?', labelZh: '请输入您的电子邮箱：', type: 'text' },
  // Section 6: Travel
  'section6.inviter.name': { labelEn: 'Name of the inviting person/organization in China?', labelZh: '在华邀请人/机构名称：', type: 'text' },
  'section6.inviter.phone': { labelEn: 'Phone number of the inviting person/organization?', labelZh: '邀请人/机构电话：', type: 'text' },
  'section6.inviter.relationship': { labelEn: 'Your relationship with the inviter?', labelZh: '与邀请人/机构的关系：', type: 'text' },
  'section6.emergencyContact.familyName': { labelEn: 'Emergency contact\'s name?', labelZh: '紧急联系人姓名：', type: 'text' },
  'section6.emergencyContact.phone': { labelEn: 'Emergency contact\'s phone number?', labelZh: '紧急联系人电话：', type: 'text' },
  'section6.emergencyContact.relationship': { labelEn: 'Emergency contact\'s relationship to you?', labelZh: '紧急联系人与您的关系：', type: 'text' },
  'section6.travelPayBy': { labelEn: 'Who will pay for this travel?', labelZh: '旅行费用由谁承担？', type: 'select', options: ['Self', 'Other', 'Organization'] },
  // Short-name aliases (for compatibility with different pendingFields formats)
  'maritalStatus': { labelEn: 'What is your marital status?', labelZh: '您的婚姻状况：', type: 'select', options: ['Single', 'Married', 'Divorced', 'Widowed', 'Other'] },
  'currentAddress': { labelEn: 'What is your current home address?', labelZh: '请输入您当前的居住地址：', type: 'text' },
  'phone': { labelEn: 'What is your phone number?', labelZh: '请输入您的电话号码：', type: 'text' },
  'email': { labelEn: 'What is your email address?', labelZh: '请输入您的电子邮箱：', type: 'text' },
  'education': { labelEn: 'What is your highest education level?', labelZh: '您的最高学历是什么？', type: 'select', options: ['High school', 'Bachelor', 'Master', 'Doctoral', 'Other'] },
  'occupation': { labelEn: 'What is your current occupation?', labelZh: '您当前的职业：', type: 'select', options: ['Businessperson', 'Company employee', 'Student', 'Self-employed', 'Retired', 'Other'] },
  'employerName': { labelEn: 'What is the name of your employer?', labelZh: '您的雇主名称：', type: 'text' },
};

// POST /api/chat/ai — start or continue AI chat
app.post('/api/chat/ai', async (req: Request, res: Response) => {
  const { sessionId, pendingFields, language, field, value } = req.body;

  // ── Start new session ──
  if (!field && pendingFields) {
    const sid = sessionId || `ai_${Date.now()}`;
    aiChatSessions[sid] = {
      pendingFields: pendingFields || [],
      filledFields: {},
      currentFieldIdx: 0,
      language: language || 'en',
    };

    const session = aiChatSessions[sid];
    if (session.pendingFields.length === 0) {
      return res.json({ done: true, sessionId: sid, progress: 100 });
    }

    const firstField = session.pendingFields[0];
    const meta = fieldMeta[firstField];
    const question = await generateQuestion(firstField, meta, session, true);

    return res.json({
      sessionId: sid,
      field: firstField,
      question: question.text,
      type: meta?.type || 'text',
      options: meta?.options,
      progress: 0,
      totalFields: session.pendingFields.length,
    });
  }

  // ── Reply to a question ──
  const session = aiChatSessions[sessionId];
  if (!session) {
    return res.status(400).json({ error: 'Invalid session' });
  }

  // Validate field
  const validation = await validateField(field, value);

  if (validation.status === 'fail') {
    // Re-ask same field
    const meta = fieldMeta[field];
    return res.json({
      field,
      question: validation.message,
      type: meta?.type || 'text',
      options: meta?.options,
      validation,
      progress: Math.round((Object.keys(session.filledFields).length / session.pendingFields.length) * 100),
      done: false,
    });
  }

  // Save answer
  session.filledFields[field] = value;
  session.currentFieldIdx = session.pendingFields.indexOf(field) + 1;

  // Check if done
  const remaining = session.pendingFields.filter(f => !session.filledFields[f]);
  if (remaining.length === 0) {
    return res.json({
      done: true,
      formData: session.filledFields,
      progress: 100,
      validation,
    });
  }

  // Next field
  const nextField = remaining[0];
  const meta = fieldMeta[nextField];
  const question = await generateQuestion(nextField, meta, session, false);

  res.json({
    field: nextField,
    question: question.text,
    type: meta?.type || 'text',
    options: meta?.options,
    validation,
    progress: Math.round((Object.keys(session.filledFields).length / session.pendingFields.length) * 100),
    done: false,
  });
});

// POST /api/validate/field — rule-based validation (mock: always pass)
app.post('/api/validate/field', (req: Request, res: Response) => {
  const { field, value } = req.body;
  // Placeholder for real rule engine
  res.json({ field, status: 'pass', message: '' });
});

// ── MiniMax LLM integration (Anthropic Messages API) ──
async function generateQuestion(
  field: string,
  meta: { labelEn: string; labelZh: string; type: string; options?: string[] } | undefined,
  session: AIChatSession,
  isFirst: boolean
): Promise<{ text: string }> {
  const MINIMAX_API_KEY = process.env.MINIMAX_API_KEY;

  if (!MINIMAX_API_KEY || !meta) {
    // Fallback to static question
    const text = session.language === 'zh' ? (meta?.labelZh || field) : (meta?.labelEn || field);
    return { text };
  }

  try {
    const filledSummary = Object.entries(session.filledFields)
      .map(([k, v]) => `${k}: ${v}`)
      .join('\n');

    const systemPrompt = session.language === 'zh'
      ? `你是中国签证申请助手，正在帮助菲律宾商务签（M签）申请人补充申请表信息。
已填写的字段：
${filledSummary || '（暂无）'}
现在需要询问字段：${field}（${meta.labelZh}）
只问一个简短自然的问题（1-2句话）。不要列出选项，不要解释字段含义。像朋友聊天一样问。`
      : `You are a China visa application assistant helping a Philippine M-visa (business) applicant.
Already filled:
${filledSummary || '(none yet)'}
Now ask about: ${field} (${meta.labelEn})
Ask ONE short, natural question (1-2 sentences max). Do NOT list options or explain the field. Be conversational.`;

    const response = await fetch('https://api.minimaxi.com/anthropic/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': MINIMAX_API_KEY,
      },
      body: JSON.stringify({
        model: 'MiniMax-M2.5',
        max_tokens: 200,
        system: systemPrompt,
        messages: [
          { role: 'user', content: isFirst ? 'Please start asking.' : 'Next question please.' },
        ],
      }),
    });

    const data: any = await response.json();
    const text = data?.content?.find((c: any) => c.type === 'text')?.text;
    if (text) return { text };
  } catch (e) {
    console.error('MiniMax API error:', e);
  }

  // Fallback
  const text = session.language === 'zh' ? (meta?.labelZh || field) : (meta?.labelEn || field);
  return { text };
}

async function validateField(_field: string, _value: string): Promise<{ status: string; message: string }> {
  // Placeholder — always pass. Future: plug in rule engine.
  return { status: 'pass', message: '' };
}

// Health check
app.get('/api/health', (req: Request, res: Response) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Start server
app.listen(PORT, () => {
  console.log(`🇨🇳 Visa Mock Server running on http://localhost:${PORT}`);
  console.log(`   CORS enabled for http://localhost:5173`);
});

export default app;