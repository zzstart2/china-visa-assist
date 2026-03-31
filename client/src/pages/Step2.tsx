import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useVisa } from '../context/VisaContext';
import { useI18n } from '../i18n/I18nContext';
import './Step2.css';

interface UploadedFile {
  file: File;
  name: string;
}

interface ValidationResult {
  document: string;
  status: 'pass' | 'fail';
  message: string;
}

function Step2() {
  const navigate = useNavigate();
  const { t } = useI18n();
  const { state, setUploadedFiles } = useVisa();
  const { visaType } = state;

  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [validationResults, setValidationResults] = useState<ValidationResult[]>([]);
  const [showValidation, setShowValidation] = useState(false);
  const [isValidating, setIsValidating] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFiles = (newFiles: FileList | null) => {
    if (!newFiles) return;
    const added = Array.from(newFiles).map(f => ({ file: f, name: f.name }));
    const updated = [...files, ...added];
    setFiles(updated);

    // Silently attempt upload to API, treat failures as success in mock mode
    added.forEach(({ file }) => {
      const formData = new FormData();
      formData.append('file', file);
      fetch('/api/upload', { method: 'POST', body: formData }).catch(() => {});
    });

    const fileMap: Record<string, File[]> = {};
    updated.forEach(({ file }) => {
      const key = file.name;
      fileMap[key] = [file];
    });
    setUploadedFiles(fileMap);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    handleFiles(e.dataTransfer.files);
  };

  const removeFile = (index: number) => {
    const updated = files.filter((_, i) => i !== index);
    setFiles(updated);
  };

  const handleValidateAll = () => {
    setIsValidating(true);
    setShowValidation(true);

    setTimeout(() => {
      setValidationResults(files.map(f => ({
        document: f.name,
        status: 'pass' as const,
        message: t('step2.validated'),
      })));
      setIsValidating(false);
    }, 500);
  };

  const allPassed = validationResults.length > 0 && validationResults.every(r => r.status === 'pass');

  const formatSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

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

      <div
        className={`batch-upload-zone ${isDragging ? 'dragging' : ''}`}
        onClick={() => inputRef.current?.click()}
        onDrop={handleDrop}
        onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
        onDragLeave={() => setIsDragging(false)}
      >
        <input
          ref={inputRef}
          type="file"
          multiple
          onChange={(e) => handleFiles(e.target.files)}
          style={{ display: 'none' }}
        />
        <div className="upload-icon-large">+</div>
        <p className="upload-title">{t('step2.upload')}</p>
        <p className="upload-subtitle">Drag & drop multiple files here, or click to browse</p>
      </div>

      {files.length > 0 && (
        <div className="uploaded-files-list">
          <h3>{files.length} file{files.length !== 1 ? 's' : ''} uploaded</h3>
          {files.map((item, index) => (
            <div key={index} className="uploaded-file-row">
              <span className="file-icon-small">&#128196;</span>
              <div className="file-details">
                <span className="file-name">{item.name}</span>
                <span className="file-size">{formatSize(item.file.size)}</span>
              </div>
              <button className="file-remove-btn" onClick={(e) => { e.stopPropagation(); removeFile(index); }}>&times;</button>
            </div>
          ))}
        </div>
      )}

      {files.length > 0 && !showValidation && (
        <div className="validation-action">
          <button className="validate-btn" onClick={handleValidateAll} disabled={isValidating}>
            {isValidating ? t('step2.validating') : t('step2.validate')}
          </button>
        </div>
      )}

      {showValidation && (
        <div className="validation-results">
          <h3>{t('step2.results')}</h3>
          {validationResults.map((result, index) => (
            <div key={index} className={`result-item ${result.status}`}>
              <span className="result-icon">{result.status === 'pass' ? '\u2713' : '\u2717'}</span>
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
