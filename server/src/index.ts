import express, { Request, Response } from 'express';
import cors from 'cors';
import multer from 'multer';
import path from 'path';

const app = express();
const PORT = 3001;

// Middleware
app.use(cors({
  origin: 'http://localhost:5173',
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

// M Visa Questions (12 questions)
const mVisaQuestions = [
  { question: "What is your current residential address?", type: 'text' as const, field: 'currentAddress', section: 3 },
  { question: "What is your phone number?", type: 'text' as const, field: 'phone', section: 3 },
  { question: "What is your email address?", type: 'text' as const, field: 'email', section: 3 },
  { question: "What is your highest education level?", type: 'select' as const, options: ['High School', 'Bachelor', 'Master', 'Doctorate'], field: 'education', section: 4 },
  { question: "What is your current occupation?", type: 'text' as const, field: 'occupation', section: 4 },
  { question: "What is your position/job title?", type: 'text' as const, field: 'position', section: 4 },
  { question: "What is your employer's name?", type: 'text' as const, field: 'employerName', section: 4 },
  { question: "What is your employer's address?", type: 'text' as const, field: 'employerAddress', section: 4 },
  { question: "What is your employer's phone number?", type: 'text' as const, field: 'employerPhone', section: 4 },
  { question: "Have you previously visited China?", type: 'select' as const, options: ['Yes', 'No'], field: 'previousChinaVisit', section: 5 },
  { question: "What is the name of the inviting company in China?", type: 'text' as const, field: 'inviterName', section: 6 },
  { question: "What is the inviting company's address?", type: 'text' as const, field: 'inviterAddress', section: 6 },
  { question: "What is the inviting company's phone number?", type: 'text' as const, field: 'inviterPhone', section: 6 },
  { question: "Hotel name in Shanghai?", type: 'text' as const, field: 'hotelName', section: 7 },
  { question: "Hotel address?", type: 'text' as const, field: 'hotelAddress', section: 7 },
  { question: "Hotel phone?", type: 'text' as const, field: 'hotelPhone', section: 7 },
  { question: "Emergency contact name?", type: 'text' as const, field: 'emergencyName', section: 8 },
  { question: "Relationship to emergency contact?", type: 'text' as const, field: 'emergencyRelationship', section: 8 },
  { question: "Emergency contact phone?", type: 'text' as const, field: 'emergencyPhone', section: 8 },
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