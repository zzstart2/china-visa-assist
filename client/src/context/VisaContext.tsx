import { createContext, useContext, useState, type ReactNode } from 'react';

export type VisaType = 'M' | 'G' | null;

export interface VisaState {
  visaType: VisaType;
  visaEntry: string;
  visaDuration: string;
  extractedPassport: {
    name?: string;
    passportNumber?: string;
    nationality?: string;
    birthDate?: string;
    expiryDate?: string;
  } | null;
  uploadedFiles: Record<string, File[]>;
  formData: Record<string, string>;
}

interface VisaContextType {
  state: VisaState;
  setVisaType: (type: VisaType) => void;
  setVisaEntry: (entry: string) => void;
  setVisaDuration: (duration: string) => void;
  setExtractedPassport: (data: VisaState['extractedPassport']) => void;
  setUploadedFiles: (files: Record<string, File[]>) => void;
  setFormData: (data: Record<string, string>) => void;
}

const defaultState: VisaState = {
  visaType: null,
  visaEntry: '',
  visaDuration: '',
  extractedPassport: null,
  uploadedFiles: {},
  formData: {},
};

const VisaContext = createContext<VisaContextType | undefined>(undefined);

export function VisaProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<VisaState>(defaultState);

  const setVisaType = (visaType: VisaType) => setState(s => ({ ...s, visaType }));
  const setVisaEntry = (visaEntry: string) => setState(s => ({ ...s, visaEntry }));
  const setVisaDuration = (visaDuration: string) => setState(s => ({ ...s, visaDuration }));
  const setExtractedPassport = (extractedPassport: VisaState['extractedPassport']) => 
    setState(s => ({ ...s, extractedPassport }));
  const setUploadedFiles = (uploadedFiles: Record<string, File[]>) => 
    setState(s => ({ ...s, uploadedFiles }));

  const setFormData = (formData: Record<string, string>) => 
    setState(s => ({ ...s, formData }));

  return (
    <VisaContext.Provider value={{
      state,
      setVisaType,
      setVisaEntry,
      setVisaDuration,
      setExtractedPassport,
      setUploadedFiles,
      setFormData,
    }}>
      {children}
    </VisaContext.Provider>
  );
}

export function useVisa() {
  const context = useContext(VisaContext);
  if (!context) {
    throw new Error('useVisa must be used within a VisaProvider');
  }
  return context;
}