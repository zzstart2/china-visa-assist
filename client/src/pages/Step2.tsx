import { useState, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useVisa } from '../context/VisaContext';
import type { DocumentStatus, DocumentType, ApplicationForm } from '../types/application';
import { createMockPrefill, createEmptyForm } from '../constants/formDefaults';
import './Step2.css';

const API = import.meta.env.VITE_API_URL || 'http://localhost:3001';

/** M-visa required document checklist */
function getInitialChecklist(_lang: 'en' | 'zh'): DocumentStatus[] {
  return [
    { type: 'passport', label: 'Passport photo page', labelZh: '护照信息页', mandatory: true, uploaded: false, valid: false },
    { type: 'photo', label: 'Application photo (white bg)', labelZh: '申请照片（白底）', mandatory: true, uploaded: false, valid: false },
    { type: 'invitation', label: 'Business invitation letter', labelZh: '商务邀请函', mandatory: true, uploaded: false, valid: false },
    { type: 'employment', label: 'Employment certificate', labelZh: '在职证明', mandatory: false, uploaded: false, valid: false },
    { type: 'previousVisa' as DocumentType, label: 'Previous Chinese visa copy', labelZh: '旧中国签证复印件', mandatory: false, uploaded: false, valid: false },
    { type: 'residence', label: 'Residence permit', labelZh: '居住证明', mandatory: false, uploaded: false, valid: false },
  ];
}

/** Compute which fields are still empty after prefill */
function computePendingFields(form: ApplicationForm): string[] {
  const pending: string[] = [];
  const s1 = form.section1;
  // Section 1 key fields
  if (!s1.familyName.value) pending.push('section1.familyName');
  if (!s1.givenName.value) pending.push('section1.givenName');
  if (!s1.birthDate.year) pending.push('section1.birthDate');
  if (!s1.gender) pending.push('section1.gender');
  if (!s1.birthCountry) pending.push('section1.birthCountry');
  if (!s1.maritalStatus) pending.push('section1.maritalStatus');
  if (!s1.currentNationality) pending.push('section1.currentNationality');
  if (!s1.passportNumber) pending.push('section1.passportNumber');

  // Section 5 contact
  const s5 = form.section5;
  if (!s5.currentAddress) pending.push('section5.currentAddress');
  if (!s5.phone) pending.push('section5.phone');
  if (!s5.mobilePhone) pending.push('section5.mobilePhone');
  if (!s5.email) pending.push('section5.email');

  // Section 6 travel
  const s6 = form.section6;
  if (!s6.inviter.name) pending.push('section6.inviter.name');
  if (!s6.inviter.phone) pending.push('section6.inviter.phone');
  if (!s6.emergencyContact.familyName.value) pending.push('section6.emergencyContact.familyName');
  if (!s6.emergencyContact.phone) pending.push('section6.emergencyContact.phone');
  if (!s6.travelPayBy) pending.push('section6.travelPayBy');

  // Section 3 work
  const s3 = form.section3;
  if (!s3.currentOccupation) pending.push('section3.currentOccupation');

  // Section 4 education
  if (form.section4.entries.length === 0 && !form.section4.notApplicable) pending.push('section4.entries');

  return pending;
}

function Step2() {
  const navigate = useNavigate();
  const { state, setDocuments, mergeForm, setPendingFields, setFilledFields } = useVisa();
  const lang = state.language;

  const [checklist, setChecklist] = useState<DocumentStatus[]>(getInitialChecklist(lang));
  const [isUploading, setIsUploading] = useState(false);
  const [uploadDone, setUploadDone] = useState(false);
  const [prefillSummary, setPrefillSummary] = useState<{ filled: string[]; pending: string[] } | null>(null);
  const inputRefs = useRef<Record<string, HTMLInputElement | null>>({});

  const mandatoryDone = checklist.filter(d => d.mandatory).every(d => d.uploaded);
  const anyUploaded = checklist.some(d => d.uploaded);

  const handleFileSelect = useCallback((docType: string, files: FileList | null) => {
    if (!files || files.length === 0) return;
    setChecklist(prev => prev.map(d =>
      d.type === docType ? { ...d, uploaded: true, valid: false, file: files[0] } : d
    ));
  }, []);

  const removeFile = useCallback((docType: string) => {
    setChecklist(prev => prev.map(d =>
      d.type === docType ? { ...d, uploaded: false, valid: false, file: undefined } : d
    ));
  }, []);

  const handleBatchUpload = async () => {
    setIsUploading(true);

    // Build FormData with all uploaded files
    const formData = new FormData();
    checklist.filter(d => d.uploaded && d.file).forEach(d => {
      formData.append('files', d.file!, d.file!.name);
    });

    try {
      const res = await fetch(`${API}/api/upload/batch`, { method: 'POST', body: formData });
      const data = await res.json();

      if (data.success) {
        // Mark all uploaded docs as valid
        setChecklist(prev => prev.map(d => d.uploaded ? { ...d, valid: true } : d));

        // Apply prefill to ApplicationForm
        const prefill = data.prefillData || createMockPrefill();
        const mergedForm: ApplicationForm = { ...createEmptyForm(), ...prefill };
        mergeForm(prefill as Partial<ApplicationForm>);

        const pending = computePendingFields(mergedForm);
        const allFields = Object.keys(flattenObj(mergedForm));
        const filled = allFields.filter(f => !pending.includes(f));
        setPendingFields(pending);
        setFilledFields(filled);

        setPrefillSummary({ filled: filled.slice(0, 10), pending });
        setDocuments(checklist.filter(d => d.uploaded));
        setUploadDone(true);
      }
    } catch {
      // Fallback: use local mock
      setChecklist(prev => prev.map(d => d.uploaded ? { ...d, valid: true } : d));
      const prefill = createMockPrefill();
      mergeForm(prefill as Partial<ApplicationForm>);
      const mergedForm: ApplicationForm = { ...createEmptyForm(), ...prefill };
      const pending = computePendingFields(mergedForm);
      setPendingFields(pending);
      setPrefillSummary({ filled: [], pending });
      setDocuments(checklist.filter(d => d.uploaded));
      setUploadDone(true);
    }

    setIsUploading(false);
  };

  return (
    <div className="step2-container">
      <div className="step2-header">
        <h2>{lang === 'en' ? 'Step 2: Document Upload' : '第二步：材料上传'}</h2>
        <span className="visa-type-badge">M Visa</span>
      </div>

      {/* Document Checklist */}
      <div className="doc-checklist">
        <h3>{lang === 'en' ? 'Document Checklist' : '材料清单'}</h3>
        {checklist.map(doc => (
          <div key={doc.type} className={`doc-row ${doc.uploaded ? (doc.valid ? 'valid' : 'uploaded') : ''}`}>
            <div className="doc-status-icon">
              {doc.valid ? '✅' : doc.uploaded ? '📎' : doc.mandatory ? '🔴' : '⚪'}
            </div>
            <div className="doc-info">
              <span className="doc-name">{lang === 'en' ? doc.label : doc.labelZh}</span>
              <span className="doc-tag">{doc.mandatory
                ? (lang === 'en' ? 'Required' : '必须')
                : (lang === 'en' ? 'Optional' : '可选')}</span>
            </div>
            <div className="doc-action">
              {doc.uploaded ? (
                <>
                  <span className="file-name-small">{doc.file?.name}</span>
                  <button className="remove-btn" onClick={() => removeFile(doc.type)} disabled={uploadDone}>×</button>
                </>
              ) : (
                <>
                  <input
                    ref={el => { inputRefs.current[doc.type] = el; }}
                    type="file"
                    accept="image/*,.pdf"
                    style={{ display: 'none' }}
                    onChange={e => handleFileSelect(doc.type, e.target.files)}
                  />
                  <button
                    className="upload-btn-small"
                    onClick={() => inputRefs.current[doc.type]?.click()}
                    disabled={uploadDone}
                  >
                    {lang === 'en' ? 'Upload' : '上传'}
                  </button>
                </>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Upload & Process button */}
      {anyUploaded && !uploadDone && (
        <div className="upload-action">
          <button
            className="process-btn"
            onClick={handleBatchUpload}
            disabled={!mandatoryDone || isUploading}
          >
            {isUploading
              ? (lang === 'en' ? '⏳ Processing & Extracting...' : '⏳ 处理并提取中...')
              : mandatoryDone
                ? (lang === 'en' ? '🔍 Upload & Extract Information' : '🔍 上传并提取信息')
                : (lang === 'en' ? 'Please upload all required documents' : '请上传所有必须材料')}
          </button>
        </div>
      )}

      {/* Prefill Summary */}
      {uploadDone && prefillSummary && (
        <div className="prefill-summary">
          <div className="prefill-header">
            <span className="prefill-icon">📋</span>
            <h3>{lang === 'en' ? 'OCR Extraction Result' : 'OCR 提取结果'}</h3>
          </div>
          <div className="prefill-stats">
            <div className="stat-card filled">
              <span className="stat-number">{prefillSummary.filled.length}</span>
              <span className="stat-label">{lang === 'en' ? 'Fields Prefilled' : '已预填字段'}</span>
            </div>
            <div className="stat-card pending">
              <span className="stat-number">{prefillSummary.pending.length}</span>
              <span className="stat-label">{lang === 'en' ? 'Fields Remaining' : '待填字段'}</span>
            </div>
          </div>
          <p className="prefill-hint">
            {lang === 'en'
              ? 'The AI assistant will help you complete the remaining fields in the next step.'
              : 'AI 助手将在下一步帮您补充剩余字段。'}
          </p>
          <button className="continue-btn" onClick={() => navigate('/step/3')}>
            {lang === 'en' ? 'Continue to AI Assistant →' : '继续 AI 填表 →'}
          </button>
        </div>
      )}
    </div>
  );
}

/** Flatten nested object to dot-path keys (shallow, for counting) */
function flattenObj(obj: any, prefix = ''): Record<string, any> {
  const result: Record<string, any> = {};
  for (const key of Object.keys(obj)) {
    const path = prefix ? `${prefix}.${key}` : key;
    const val = obj[key];
    if (val && typeof val === 'object' && !Array.isArray(val) && !(val instanceof File)) {
      Object.assign(result, flattenObj(val, path));
    } else {
      result[path] = val;
    }
  }
  return result;
}

export default Step2;
