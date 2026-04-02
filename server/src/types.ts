/**
 * Shared type definitions for the visa application server.
 */

export interface QuestionDef {
  question: string;
  type: 'text' | 'select' | 'date';
  options?: string[];
  field: string;
  section: number;
}

export interface ChatSession {
  visaType: string;
  currentQuestionIndex: number;
  answers: Record<string, string>;
  questions: QuestionDef[];
}

export interface AIChatSession {
  pendingFields: string[];
  filledFields: Record<string, string>;
  currentFieldIdx: number;
  language: string;
}

export interface FieldMetaEntry {
  labelEn: string;
  labelZh: string;
  type: string;
  options?: string[];
}
