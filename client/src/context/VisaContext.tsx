/**
 * VisaContext — Global application state.
 * 
 * Core data structure: ApplicationForm (9 sections matching CCNA spec).
 * All steps read/write through this context.
 */
import { createContext, useContext, useState, useCallback, type ReactNode } from 'react';
import type {
  ApplicationForm, Language, DocumentStatus, AppSession,
} from '../types/application';
import { createEmptyForm } from '../constants/formDefaults';

// ============================================================
// Context interface
// ============================================================

interface VisaContextType {
  state: AppSession;

  // Language
  setLanguage: (lang: Language) => void;

  // Session
  setSessionId: (id: string | null) => void;
  setCurrentStep: (step: number) => void;

  // Form — bulk operations
  setForm: (form: ApplicationForm) => void;
  mergeForm: (partial: Partial<ApplicationForm>) => void;

  // Form — field-level update (dot-path, e.g. "section5.phone")
  updateField: (path: string, value: unknown) => void;

  // Documents
  setDocuments: (docs: DocumentStatus[]) => void;

  // Pending/Filled field tracking
  setPendingFields: (fields: string[]) => void;
  setFilledFields: (fields: string[]) => void;
  markFieldFilled: (path: string) => void;

  // Legacy compat
  /** @deprecated */
  setFormData: (data: Record<string, string>) => void;
  /** @deprecated */
  setExtractedPassport: (data: AppSession['extractedPassport']) => void;
  /** @deprecated */
  setVisaType: (type: string | null) => void;
  /** @deprecated */
  setVisaEntry: (entry: string) => void;
  /** @deprecated */
  setVisaDuration: (dur: string) => void;
  /** @deprecated */
  setUploadedFiles: (files: Record<string, File[]>) => void;
}

// ============================================================
// Default state
// ============================================================

const defaultSession: AppSession = {
  language: 'en',
  sessionId: null,
  form: createEmptyForm(),
  documents: [],
  pendingFields: [],
  filledFields: [],
  currentStep: 1,
  // Legacy compat
  formData: {},
  extractedPassport: null,
  visaType: null,
  uploadedFiles: {},
};

// ============================================================
// Provider
// ============================================================

const VisaContext = createContext<VisaContextType | undefined>(undefined);

export function VisaProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AppSession>(defaultSession);

  const setLanguage = useCallback((language: Language) =>
    setState(s => ({ ...s, language })), []);

  const setSessionId = useCallback((sessionId: string | null) =>
    setState(s => ({ ...s, sessionId })), []);

  const setCurrentStep = useCallback((currentStep: number) =>
    setState(s => ({ ...s, currentStep })), []);

  const setForm = useCallback((form: ApplicationForm) =>
    setState(s => ({ ...s, form })), []);

  const mergeForm = useCallback((partial: Partial<ApplicationForm>) =>
    setState(s => ({
      ...s,
      form: {
        ...s.form,
        ...Object.fromEntries(
          Object.entries(partial).map(([key, val]) => [
            key,
            { ...(s.form as any)[key], ...val },
          ])
        ),
      } as ApplicationForm,
    })), []);

  const updateField = useCallback((path: string, value: unknown) =>
    setState(s => {
      const newForm = structuredClone(s.form);
      setNestedValue(newForm, path, value);
      return { ...s, form: newForm };
    }), []);

  const setDocuments = useCallback((documents: DocumentStatus[]) =>
    setState(s => ({ ...s, documents })), []);

  const setPendingFields = useCallback((pendingFields: string[]) =>
    setState(s => ({ ...s, pendingFields })), []);

  const setFilledFields = useCallback((filledFields: string[]) =>
    setState(s => ({ ...s, filledFields })), []);

  const markFieldFilled = useCallback((path: string) =>
    setState(s => ({
      ...s,
      filledFields: s.filledFields.includes(path) ? s.filledFields : [...s.filledFields, path],
      pendingFields: s.pendingFields.filter(f => f !== path),
    })), []);

  // Legacy compat
  const setFormData = useCallback((formData: Record<string, string>) =>
    setState(s => ({ ...s, formData })), []);

  const setExtractedPassport = useCallback((extractedPassport: AppSession['extractedPassport']) =>
    setState(s => ({ ...s, extractedPassport })), []);

  const setVisaType = useCallback((visaType: string | null) =>
    setState(s => ({ ...s, visaType })), []);

  const setVisaEntry = useCallback((_entry: string) => {}, []);
  const setVisaDuration = useCallback((_dur: string) => {}, []);

  const setUploadedFiles = useCallback((uploadedFiles: Record<string, File[]>) =>
    setState(s => ({ ...s, uploadedFiles })), []);

  return (
    <VisaContext.Provider value={{
      state,
      setLanguage,
      setSessionId,
      setCurrentStep,
      setForm,
      mergeForm,
      updateField,
      setDocuments,
      setPendingFields,
      setFilledFields,
      markFieldFilled,
      setFormData,
      setExtractedPassport,
      setVisaType,
      setVisaEntry,
      setVisaDuration,
      setUploadedFiles,
    }}>
      {children}
    </VisaContext.Provider>
  );
}

// ============================================================
// Hook
// ============================================================

export function useVisa() {
  const ctx = useContext(VisaContext);
  if (!ctx) throw new Error('useVisa must be used within VisaProvider');
  return ctx;
}

// ============================================================
// Utility: set nested value by dot-path
// ============================================================

function setNestedValue(obj: any, path: string, value: unknown): void {
  const keys = path.split('.');
  let current = obj;
  for (let i = 0; i < keys.length - 1; i++) {
    const key = keys[i];
    if (current[key] === undefined || current[key] === null) {
      current[key] = /^\d+$/.test(keys[i + 1]) ? [] : {};
    }
    current = current[key];
  }
  current[keys[keys.length - 1]] = value;
}
