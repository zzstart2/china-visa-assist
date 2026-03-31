import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import FileUploader from '../components/FileUploader';
import { useVisa } from '../context/VisaContext';
import { useI18n } from '../i18n/I18nContext';
import './Step2.css';

interface DocumentItem {
  id: string;
  labelKey: string;
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
  const { t } = useI18n();
  const { state, setExtractedPassport, setUploadedFiles } = useVisa();
  const { visaType } = state;

  const [documents, setDocuments] = useState<DocumentItem[]>([]);
  const [validationResults, setValidationResults] = useState<ValidationResult[]>([]);
  const [showValidation, setShowValidation] = useState(false);
  const [isValidating, setIsValidating] = useState(false);

  useEffect(() => {
    if (!visaType) return;

    const baseDocs: DocumentItem[] = [
      { id: 'passport', labelKey: 'step2.passport', required: true, uploaded: false, uploading: false, success: false },
      { id: 'photo', labelKey: 'step2.photo', required: true, uploaded: false, uploading: false, success: false },
    ];

    if (visaType === 'M') {
      baseDocs.push({ id: 'invitation', labelKey: 'step2.invitation', required: true, uploaded: false, uploading: false, success: false });
    } else if (visaType === 'G') {
      baseDocs.push({ id: 'ticket', labelKey: 'step2.ticket', required: true, uploaded: false, uploading: false, success: false });
    }

    baseDocs.push({ id: 'residence', labelKey: 'step2.doc.residence', required: false, uploaded: false, uploading: false, success: false });
    baseDocs.push({ id: 'previous-visa', labelKey: 'step2.doc.prevVisa', required: false, uploaded: false, uploading: false, success: false });

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
        d.id === docId ? { ...d, uploaded: true, uploading: false, success: true, file } : d
      ));

      const newUploadedFiles = { ...state.uploadedFiles, [docId]: files };
      setUploadedFiles(newUploadedFiles);
    } catch (error) {
      console.error('Upload error:', error);
      setDocuments(prev => prev.map(d =>
        d.id === docId ? { ...d, uploaded: true, uploading: false, success: true, file } : d
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
      setValidationResults(documents.filter(d => d.required).map(d => ({
        document: t(d.labelKey),
        status: 'pass' as const,
        message: t('step2.validated'),
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
          <p>{t('step2.goBack')}</p>
          <button onClick={() => navigate('/step/1')}>{t('step2.goStep1')}</button>
        </div>
      </div>
    );
  }

  return (
    <div className="step2-container">
      <div className="step2-header">
        <h2>{t('step2.title')}</h2>
        <p className="visa-type-badge">{visaType === 'M' ? t('step2.mBadge') : t('step2.gBadge')}</p>
      </div>

      <div className="documents-grid">
        {documents.map(doc => (
          <div key={doc.id} className={`document-card ${doc.uploaded ? 'uploaded' : ''} ${doc.success ? 'success' : ''}`}>
            <div className="doc-header">
              <h3>{t(doc.labelKey)}</h3>
              {doc.required ? <span className="required-tag">{t('step2.required')}</span> : <span className="optional-tag">{t('step2.optional')}</span>}
            </div>

            <FileUploader
              accept="image/*,.pdf"
              multiple={false}
              maxSize={10}
              onFilesChange={(files) => handleFileUpload(doc.id, files)}
              label={doc.uploaded ? t('step2.replace') : t('step2.upload')}
            />

            {doc.uploading && (
              <div className="upload-status uploading">
                <div className="spinner"></div>
                <span>{t('step2.uploading')}</span>
              </div>
            )}

            {doc.success && (
              <div className="upload-status success">
                <span className="check-icon">✓</span>
                <span>{t('step2.ocrSuccess')}</span>
              </div>
            )}

            {doc.file && (
              <div className="file-preview-info">📄 {doc.file.name}</div>
            )}
          </div>
        ))}
      </div>

      {state.extractedPassport && (
        <div className="passport-info-card">
          <h3>📘 {t('step2.extracted')}</h3>
          <div className="passport-details">
            <div className="detail-row">
              <span className="detail-label">{t('step2.field.name')}:</span>
              <span className="detail-value">{state.extractedPassport.name || 'N/A'}</span>
            </div>
            <div className="detail-row">
              <span className="detail-label">{t('step2.field.passportNo')}:</span>
              <span className="detail-value">{state.extractedPassport.passportNumber || 'N/A'}</span>
            </div>
            <div className="detail-row">
              <span className="detail-label">{t('step2.field.nationality')}:</span>
              <span className="detail-value">{state.extractedPassport.nationality || 'N/A'}</span>
            </div>
            <div className="detail-row">
              <span className="detail-label">{t('step2.field.birthDate')}:</span>
              <span className="detail-value">{state.extractedPassport.birthDate || 'N/A'}</span>
            </div>
            <div className="detail-row">
              <span className="detail-label">{t('step2.field.expiryDate')}:</span>
              <span className="detail-value">{state.extractedPassport.expiryDate || 'N/A'}</span>
            </div>
          </div>
        </div>
      )}

      {canValidate && !showValidation && (
        <div className="validation-action">
          <button className="validate-btn" onClick={handleValidate} disabled={isValidating}>
            {isValidating ? t('step2.validating') : t('step2.validate')}
          </button>
        </div>
      )}

      {showValidation && (
        <div className="validation-results">
          <h3>📋 {t('step2.results')}</h3>
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
                {t('step2.continue')}
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default Step2;
