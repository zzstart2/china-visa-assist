/**
 * Question banks for structured chat (legacy Q&A flow).
 * Extension point: replace with dynamic question generation.
 */
import { QuestionDef } from '../types';

// M Visa Questions (40 questions)
export const mVisaQuestions: QuestionDef[] = [
  // Section 0: Personal Info
  { question: "What is your family name (as in passport)?", type: 'text', field: 'familyName', section: 0 },
  { question: "What is/are your given name(s)?", type: 'text', field: 'givenName', section: 0 },
  { question: "Do you have a Chinese name? (leave blank if none)", type: 'text', field: 'chineseName', section: 0 },
  { question: "What is your gender?", type: 'select', options: ['Male', 'Female'], field: 'gender', section: 0 },
  { question: "What is your date of birth?", type: 'date', field: 'dateOfBirth', section: 0 },
  { question: "What is your country of birth?", type: 'text', field: 'birthCountry', section: 0 },
  { question: "What is your province/state of birth?", type: 'text', field: 'birthProvince', section: 0 },
  { question: "What is your city of birth?", type: 'text', field: 'birthCity', section: 0 },
  { question: "What is your marital status?", type: 'select', options: ['Married', 'Single', 'Divorced', 'Widowed'], field: 'maritalStatus', section: 0 },
  // Section 1: Passport
  { question: "What is your passport number?", type: 'text', field: 'passportNumber', section: 1 },
  { question: "What type of passport do you have?", type: 'select', options: ['Ordinary', 'Service', 'Diplomatic'], field: 'passportType', section: 1 },
  { question: "What country issued your passport?", type: 'text', field: 'issuingCountry', section: 1 },
  { question: "When was your passport issued?", type: 'date', field: 'passportIssueDate', section: 1 },
  { question: "When does your passport expire?", type: 'date', field: 'passportExpiryDate', section: 1 },
  // Section 2: Travel
  { question: "What is the purpose of your visit to China?", type: 'select', options: ['Business', 'Trade', 'Exhibition', 'Other'], field: 'purposeOfVisit', section: 2 },
  { question: "What is your intended date of entry into China?", type: 'date', field: 'intendedEntryDate', section: 2 },
  { question: "What is your intended port of entry into China?", type: 'select', options: ['Beijing', 'Shanghai', 'Guangzhou', 'Shenzhen', 'Other'], field: 'intendedEntryPort', section: 2 },
  { question: "How many days do you plan to stay in China?", type: 'select', options: ['30', '60', '90', '180'], field: 'durationOfStay', section: 2 },
  { question: "How many entries do you need?", type: 'select', options: ['Single Entry', 'Double Entry', 'Multiple Entry'], field: 'numberOfEntries', section: 2 },
  // Section 3: Contact Info
  { question: "What is your current residential address?", type: 'text', field: 'currentAddress', section: 3 },
  { question: "What is your phone number?", type: 'text', field: 'phone', section: 3 },
  { question: "What is your email address?", type: 'text', field: 'email', section: 3 },
  // Section 4: Education & Work
  { question: "What is your highest education level?", type: 'select', options: ['High School', 'Bachelor', 'Master', 'Doctorate'], field: 'education', section: 4 },
  { question: "What is your current occupation?", type: 'text', field: 'occupation', section: 4 },
  { question: "What is your position/job title?", type: 'text', field: 'position', section: 4 },
  { question: "What is your employer's name?", type: 'text', field: 'employerName', section: 4 },
  { question: "What is your employer's address?", type: 'text', field: 'employerAddress', section: 4 },
  { question: "What is your employer's phone number?", type: 'text', field: 'employerPhone', section: 4 },
  // Section 5: Previous China Visit
  { question: "Have you previously visited China?", type: 'select', options: ['Yes', 'No'], field: 'previousChinaVisit', section: 5 },
  { question: "When did you last visit China? (if applicable)", type: 'date', field: 'previousChinaDate', section: 5 },
  // Section 6: Invitation
  { question: "What is the name of the inviting company in China?", type: 'text', field: 'inviterName', section: 6 },
  { question: "What is the inviting company's address?", type: 'text', field: 'inviterAddress', section: 6 },
  { question: "What is the inviting company's phone number?", type: 'text', field: 'inviterPhone', section: 6 },
  // Section 7: Accommodation
  { question: "Hotel name in Shanghai?", type: 'text', field: 'hotelName', section: 7 },
  { question: "Hotel address?", type: 'text', field: 'hotelAddress', section: 7 },
  { question: "Hotel phone?", type: 'text', field: 'hotelPhone', section: 7 },
  // Section 8: Emergency Contact + Declaration
  { question: "Emergency contact name?", type: 'text', field: 'emergencyName', section: 8 },
  { question: "Relationship to emergency contact?", type: 'text', field: 'emergencyRelationship', section: 8 },
  { question: "Emergency contact phone?", type: 'text', field: 'emergencyPhone', section: 8 },
  { question: "Do you agree to the declaration that all information provided is true and correct?", type: 'select', options: ['Yes', 'No'], field: 'declarationAgreed', section: 8 },
];

// G Visa Questions (17 questions)
export const gVisaQuestions: QuestionDef[] = [
  { question: "What is your current residential address?", type: 'text', field: 'currentAddress', section: 3 },
  { question: "What is your phone number?", type: 'text', field: 'phone', section: 3 },
  { question: "What is your email address?", type: 'text', field: 'email', section: 3 },
  { question: "What is your highest education level?", type: 'select', options: ['High School', 'Bachelor', 'Master', 'Doctorate'], field: 'education', section: 4 },
  { question: "What is your current occupation?", type: 'text', field: 'occupation', section: 4 },
  { question: "What is your position/job title?", type: 'text', field: 'position', section: 4 },
  { question: "What is your employer's name?", type: 'text', field: 'employerName', section: 4 },
  { question: "Have you previously visited China?", type: 'select', options: ['Yes', 'No'], field: 'previousChinaVisit', section: 5 },
  { question: "When did you last visit China? (if applicable)", type: 'date', field: 'previousChinaDate', section: 5 },
  { question: "What city will you depart from in China?", type: 'text', field: 'departureCity', section: 6 },
  { question: "What is your departure date from China?", type: 'date', field: 'departureDate', section: 6 },
  { question: "What is your flight number?", type: 'text', field: 'flightNo', section: 6 },
  { question: "What is your final destination country?", type: 'text', field: 'finalDestination', section: 6 },
  { question: "Hotel name near airport?", type: 'text', field: 'hotelName', section: 7 },
  { question: "Emergency contact name?", type: 'text', field: 'emergencyName', section: 8 },
  { question: "Relationship to emergency contact?", type: 'text', field: 'emergencyRelationship', section: 8 },
  { question: "Emergency contact phone?", type: 'text', field: 'emergencyPhone', section: 8 },
];
