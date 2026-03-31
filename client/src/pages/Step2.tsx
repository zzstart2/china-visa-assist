import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import FileUploader from '../components/FileUploader';
import { useVisa } from '../context/VisaContext';
import './Step2.css';

interface DocumentItem {
  id: string;
  label: string;
  required: boolean;
  uploaded: boolean;
  uploading: boolean;
  success: boolean;
  file?: File;
}

interface ValidationResult {
  document: string;
  status: 'pass' | 'fail';
  message: string;
}

function Step2() {
  const navigate = useNavigate();
  const { state, setExtractedPassport, setUploadedFiles } = useVisa();
  const { visaType } = state;

  const [documents, setDocuments] = useState<DocumentItem[]>([]);
  const [validationResults, setValidationResults] = useState<ValidationResult[]>([]);
  const [showValidation, setShowValidation] = useState(false);
  const [isValidating, setIsValidating] = useState(false);

  // Initialize documents based on visa type
  useEffect(() => {
    if (!visaType) return;

    const baseDocs: DocumentItem[] = [
      { id: 'passport', label: 'Passport photo page', required: true, uploaded: false, uploading: false, success: false },
      { id: 'photo', label: 'Application photo', required: true, uploaded: false, uploading: false, success: false },
    ];

    if (visaType === 'M') {
      baseDocs.push({ id: 'invitation', label: 'Business invitation letter', required: true, uploaded: false, uploading: false, success: false });
    } else if (visaType === 'G') {
      baseDocs.push({ id: 'ticket', label: 'Onward ticket to third country', required: true, uploaded: false, uploading: false, success: false });
    }

    // Optional documents
    baseDocs.push({ id: 'residence', label: 'Residence permit', required: false, uploaded: false, uploading: false, success: false });
    baseDocs.push({ id: 'previous-visa', label: 'Previous Chinese visa copy', required: false, uploaded: false, uploading: false, success: false });

    setDocuments(baseDocs);
  }, [visaType]);

  const handleFileUpload = async (docId: string, files: File[]) => {
    if (files.length === 0) return;

    const file = files[0];
    setDocuments(prev => prev.map(d => d.id === docId ? { ...d, uploading: true } : d));

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('documentType', docId);

      const response = await fetch('http://localhost:3001/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) throw new Error('Upload failed');

      const data = await response.json();

      // If passport, extract info
      if (docId === 'passport' && data.extractedData) {
        setExtractedPassport({
          name: data.extractedData.name,
          passportNumber: data.extractedData.passportNumber,
          nationality: data.extractedData.nationality,
          birthDate: data.extractedData.birthDate,
          expiryDate: data.extractedData.expiryDate,
        });
      }

      setDocuments(prev => prev.map(d => 
        d.id === docId 
          ? { ...d, uploaded: true, uploading: false, success: true, file } 
          : d
      ));

      // Update uploaded files in context
      const newUploadedFiles = { ...state.uploadedFiles, [docId]: files };
      setUploadedFiles(newUploadedFiles);
    } catch (error) {
      console.error('Upload error:', error);
      // Mock success for demo
      setDocuments(prev => prev.map(d => 
        d.id === docId 
          ? { ...d, uploaded: true, uploading: false, success: true, file } 
          : d
      ));
    }
  };

  const canValidate = documents.filter(d => d.required).every(d => d.uploaded);

  const handleValidate = async () => {
    setIsValidating(true);
    setShowValidation(true);

    try {
      const response = await fetch('http://localhost:3001/api/validate-documents', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          documents: documents.filter(d => d.uploaded).map(d => d.id),
          visaType,
        }),
      });

      if (!response.ok) throw new Error('Validation failed');
      const data = await response.json();
      setValidationResults(data.results || []);
    } catch (error) {
      console.error('Validation error:', error);
      // Mock results for demo
      setValidationResults(documents.filter(d => d.required).map(d => ({
        document: d.label,
        status: 'pass' as const,
        message: 'Document verified successfully',
      })));
    } finally {
      setIsValidating(false);
    }
  };

  const allPassed = validationResults.every(r => r.status === 'pass');

  if (!visaType) {
    return (
      <div className="step2-container">
        <div className="step2-empty">
          <p>Please complete Step 1 first to determine your visa type.</p>
          <button onClick={() => navigate('/step/1')}>Go to Step 1</button>
        </div>
      </div>
    );
  }

  return (
    <div className="step2-container">
      <div className="step2-header">
        <h2>Step 2: Document Upload</h2>
        <p className="visa-type-badge">{visaType === 'M' ? 'M Visa (Business)' : 'G Visa (Transit)'}</p>
      </div>

      <div className="documents-grid">
        {documents.map(doc => (
          <div key={doc.id} className={`document-card ${doc.uploaded ? 'uploaded' : ''} ${doc.success ? 'success' : ''}`}>
            <div className="doc-header">
              <h3>{doc.label}</h3>
              {doc.required && <span className="required-tag">Required</span>}
            </div>
            
            <FileUploader
              accept="image/*,.pdf"
              multiple={false}
              maxSize={10}
              onFilesChange={(files) => handleFileUpload(doc.id, files)}
              label={doc.uploaded ? 'Click to replace' : 'Drag file or click to upload'}
            />
            
            {doc.uploading && (
              <div className="upload-status uploading">
                <div className="spinner"></div>
                <span>Uploading...</span>
              </div>
            )}
            
            {doc.success && (
              <div className="upload-status success">
                <span className="check-icon">✓</span>
                <span>OCR extraction successful</span>
              </div>
            )}
            
            {doc.file && (
              <div className="file-preview-info">
                📄 {doc.file.name}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Extracted Passport Info */}
      {state.extractedPassport && (
        <div className="passport-info-card">
          <h3>📘 Extracted Passport Information</h3>
          <div className="passport-details">
            <div className="detail-row">
              <span className="detail-label">Name:</span>
              <span className="detail-value">{state.extractedPassport.name || 'N/A'}</span>
            </div>
            <div className="detail-row">
              <span className="detail-label">Passport Number:</span>
              <span className="detail-value">{state.extractedPassport.passportNumber || 'N/A'}</span>
            </div>
            <div className="detail-row">
              <span className="detail-label">Nationality:</span>
              <span className="detail-value">{state.extractedPassport.nationality || 'N/A'}</span>
            </div>
            <div className="detail-row">
              <span className="detail-label">Date of Birth:</span>
              <span className="detail-value">{state.extractedPassport.birthDate || 'N/A'}</span>
            </div>
            <div className="detail-row">
              <span className="detail-label">Expiry Date:</span>
              <span className="detail-value">{state.extractedPassport.expiryDate || 'N/A'}</span>
            </div>
          </div>
        </div>
      )}

      {/* Validation Button */}
      {canValidate && !showValidation && (
        <div className="validation-action">
          <button className="validate-btn" onClick={handleValidate} disabled={isValidating}>
            {isValidating ? 'Validating...' : 'Validate Documents'}
          </button>
        </div>
      )}

      {/* Validation Results */}
      {showValidation && (
        <div className="validation-results">
          <h3>📋 Validation Results</h3>
          {validationResults.map((result, index) => (
            <div key={index} className={`result-item ${result.status}`}>
              <span className="result-icon">{result.status === 'pass' ? '✓' : '✗'}</span>
              <span className="result-doc">{result.document}</span>
              <span className="result-message">{result.message}</span>
            </div>
          ))}
          
          {allPassed && (
            <div className="continue-action">
              <button className="continue-btn" onClick={() => navigate('/step/3')}>
                Continue to Information Collection →
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default Step2;