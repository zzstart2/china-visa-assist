import { useState, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useVisa } from '../context/VisaContext';
import type { DocumentStatus, DocumentType, ApplicationForm } from '../types/application';
import { createMockPrefill, createEmptyForm } from '../constants/formDefaults';
import './Step2.css';

const API = import.meta.env.VITE_API_URL || '';

/** M-visa required document checklist */
function getInitialChecklist(): DocumentStatus[] {
  return [
    { type: 'passport', label: 'Passport photo page', labelZh: '护照信息页', mandatory: true, uploaded: false, valid: false },
    { type: 'photo', label: 'Application photo (white bg)', labelZh: '申请照片（白底）', mandatory: true, uploaded: false, valid: false },
    { type: 'invitation', label: 'Business invitation letter', labelZh: '商务邀请函', mandatory: true, uploaded: false, valid: false },
    { type: 'employment', label: 'Employment certificate', labelZh: '在职证明', mandatory: false, uploaded: false, valid: false },
    { type: 'previousVisa' as DocumentType, label: 'Previous Chinese visa copy', labelZh: '旧中国签证复印件', mandatory: false, uploaded: false, valid: false },
    { type: 'residence', label: 'Residence permit', labelZh: '居住证明', mandatory: false, uploaded: false, valid: false },
  ];
}

/** Compute which fields are still empty after prefill — covers ALL required CCNA fields */
function computePendingFields(form: ApplicationForm): string[] {
  const pending: string[] = [];

  // ── Section 1: Personal Information ──
  const s1 = form.section1;
  if (!s1.familyName.value && !s1.familyName.notApplicable) pending.push('section1.familyName');
  if (!s1.givenName.value && !s1.givenName.notApplicable) pending.push('section1.givenName');
  if (!s1.birthDate.year) pending.push('section1.birthDate');
  if (!s1.gender) pending.push('section1.gender');
  if (!s1.birthCountry) pending.push('section1.birthCountry');
  if (!s1.birthProvince) pending.push('section1.birthProvince');
  if (!s1.birthCity) pending.push('section1.birthCity');
  if (!s1.maritalStatus) pending.push('section1.maritalStatus');
  if (!s1.currentNationality) pending.push('section1.currentNationality');
  if (!s1.nationalIdNumber.value && !s1.nationalIdNumber.notApplicable) pending.push('section1.nationalIdNumber');
  if (!s1.hasOtherNationality) pending.push('section1.hasOtherNationality');
  if (!s1.hasPermanentResident) pending.push('section1.hasPermanentResident');
  if (!s1.hadOtherNationalities) pending.push('section1.hadOtherNationalities');
  if (!s1.passportType) pending.push('section1.passportType');
  if (!s1.passportNumber) pending.push('section1.passportNumber');
  if (!s1.issuingCountry) pending.push('section1.issuingCountry');
  if (!s1.placeOfIssue) pending.push('section1.placeOfIssue');
  if (!s1.passportExpiry.year) pending.push('section1.passportExpiry');

  // ── Section 2: Visa Type ──
  const s2 = form.section2;
  if (!s2.serviceType) pending.push('section2.serviceType');

  // ── Section 3: Work Information ──
  const s3 = form.section3;
  if (!s3.currentOccupation) pending.push('section3.currentOccupation');
  if (s3.workHistory.length === 0) pending.push('section3.workHistory');

  // ── Section 4: Education ──
  if (form.section4.entries.length === 0 && !form.section4.notApplicable) pending.push('section4.entries');

  // ── Section 5: Family Information ──
  const s5 = form.section5;
  if (!s5.currentAddress) pending.push('section5.currentAddress');
  if (!s5.phone) pending.push('section5.phone');
  if (!s5.mobilePhone) pending.push('section5.mobilePhone');
  // 5.5B Father
  if (!s5.father.familyName.value && !s5.father.familyName.notApplicable) pending.push('section5.father');
  // 5.5C Mother
  if (!s5.mother.familyName.value && !s5.mother.familyName.notApplicable) pending.push('section5.mother');
  // 5.5E Relatives in China
  if (!s5.hasRelativesInChina) pending.push('section5.hasRelativesInChina');

  // ── Section 6: Travel Information ──
  const s6 = form.section6;
  if (s6.itinerary.length === 0) pending.push('section6.itinerary');
  if (!s6.inviter.name && !s6.inviter.notApplicable) pending.push('section6.inviter.name');
  if (!s6.inviter.phone && !s6.inviter.notApplicable) pending.push('section6.inviter.phone');
  if (!s6.inviter.relationship && !s6.inviter.notApplicable) pending.push('section6.inviter.relationship');
  if (!s6.emergencyContact.familyName.value && !s6.emergencyContact.familyName.notApplicable) pending.push('section6.emergencyContact.familyName');
  if (!s6.emergencyContact.givenName.value && !s6.emergencyContact.givenName.notApplicable) pending.push('section6.emergencyContact.givenName');
  if (!s6.emergencyContact.relationship) pending.push('section6.emergencyContact.relationship');
  if (!s6.emergencyContact.phone) pending.push('section6.emergencyContact.phone');
  if (!s6.travelPayBy) pending.push('section6.travelPayBy');
  if (!s6.sharePassport) pending.push('section6.sharePassport');

  // ── Section 7: Previous Travel ──
  const s7 = form.section7;
  if (!s7.hasBeenToChina) pending.push('section7.hasBeenToChina');
  if (!s7.hasChineseVisa) pending.push('section7.hasChineseVisa');
  if (!s7.hasOtherValidVisa) pending.push('section7.hasOtherValidVisa');
  if (!s7.hasTraveledLast12Months) pending.push('section7.hasTraveledLast12Months');

  // ── Section 8: Other Information (11 Yes/No questions) ──
  const s8 = form.section8;
  if (!s8.refusedVisa.answer) pending.push('section8.refusedVisa');
  if (!s8.canceledVisa.answer) pending.push('section8.canceledVisa');
  if (!s8.illegalEntry.answer) pending.push('section8.illegalEntry');
  if (!s8.criminalRecord.answer) pending.push('section8.criminalRecord');
  if (!s8.mentalOrInfectious.answer) pending.push('section8.mentalOrInfectious');
  if (!s8.visitedEpidemic.answer) pending.push('section8.visitedEpidemic');
  if (!s8.specialSkills.answer) pending.push('section8.specialSkills');
  if (!s8.militaryService.answer) pending.push('section8.militaryService');
  if (!s8.paramilitaryOrg.answer) pending.push('section8.paramilitaryOrg');
  if (!s8.charitableOrg.answer) pending.push('section8.charitableOrg');
  if (!s8.otherDeclaration.answer) pending.push('section8.otherDeclaration');

  // ── Section 9: Declaration ──
  const s9 = form.section9;
  if (!s9.filledBy) pending.push('section9.filledBy');
  if (!s9.agreed) pending.push('section9.agreed');

  return pending;
}

/** Apply prefill and compute pending/filled — shared by API success and fallback */
function applyPrefill(
  prefill: Partial<ApplicationForm>,
  mergeForm: (p: Partial<ApplicationForm>) => void,
  setPendingFields: (f: string[]) => void,
  setFilledFields: (f: string[]) => void,
) {
  mergeForm(prefill);
  const mergedForm: ApplicationForm = { ...createEmptyForm(), ...prefill } as ApplicationForm;
  // Deep merge section1 if provided
  if (prefill.section1) {
    mergedForm.section1 = { ...createEmptyForm().section1, ...prefill.section1 };
  }
  if (prefill.section3) {
    mergedForm.section3 = { ...createEmptyForm().section3, ...prefill.section3 };
  }
  const pending = computePendingFields(mergedForm);
  const allFields = Object.keys(flattenObj(mergedForm));
  const filled = allFields.filter(f => !pending.includes(f));
  setPendingFields(pending);
  setFilledFields(filled);
  return { pending, filled };
}

function Step2() {
  const navigate = useNavigate();
  const { state, setDocuments, mergeForm, setPendingFields, setFilledFields } = useVisa();
  const lang = state.language;

  const [checklist, setChecklist] = useState<DocumentStatus[]>(getInitialChecklist());
  const [isUploading, setIsUploading] = useState(false);
  const [uploadDone, setUploadDone] = useState(false);
  const [prefillSummary, setPrefillSummary] = useState<{ filled: number; pending: number } | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [complianceWarnings, setComplianceWarnings] = useState<Array<{ field: string; level: string; messageEn: string; messageZh: string }>>([]);
  const batchInputRef = useRef<HTMLInputElement>(null);
  const itemInputRefs = useRef<Record<string, HTMLInputElement | null>>({});

  const mandatoryDone = checklist.filter(d => d.mandatory).every(d => d.uploaded);
  const anyUploaded = checklist.some(d => d.uploaded);
  const uploadedCount = checklist.filter(d => d.uploaded).length;

  // Handle file selection for a specific document type
  const handleFileSelect = useCallback((docType: string, files: FileList | null) => {
    if (!files || files.length === 0) return;
    setChecklist(prev => prev.map(d =>
      d.type === docType ? { ...d, uploaded: true, valid: false, file: files[0] } : d
    ));
  }, []);

  // Handle batch drag & drop — auto-classify by filename
  const handleBatchFiles = useCallback((files: FileList | null) => {
    if (!files) return;
    const fileArr = Array.from(files);
    setChecklist(prev => {
      const updated = [...prev];
      for (const file of fileArr) {
        const lower = file.name.toLowerCase();
        let matchIdx = -1;
        if (lower.includes('passport')) matchIdx = updated.findIndex(d => d.type === 'passport' && !d.uploaded);
        else if (lower.includes('photo') || lower.includes('照片')) matchIdx = updated.findIndex(d => d.type === 'photo' && !d.uploaded);
        else if (lower.includes('invit') || lower.includes('邀请')) matchIdx = updated.findIndex(d => d.type === 'invitation' && !d.uploaded);
        else if (lower.includes('employ') || lower.includes('在职')) matchIdx = updated.findIndex(d => d.type === 'employment' && !d.uploaded);

        if (matchIdx === -1) {
          // Assign to first empty mandatory, then optional
          matchIdx = updated.findIndex(d => !d.uploaded && d.mandatory);
          if (matchIdx === -1) matchIdx = updated.findIndex(d => !d.uploaded);
        }

        if (matchIdx !== -1) {
          updated[matchIdx] = { ...updated[matchIdx], uploaded: true, valid: false, file };
        }
      }
      return updated;
    });
  }, []);

  const removeFile = useCallback((docType: string) => {
    setChecklist(prev => prev.map(d =>
      d.type === docType ? { ...d, uploaded: false, valid: false, file: undefined } : d
    ));
  }, []);

  // Process & Extract — calls API with fallback to local mock
  const handleProcess = async () => {
    setIsUploading(true);

    const formData = new FormData();
    checklist.filter(d => d.uploaded && d.file).forEach(d => {
      formData.append('files', d.file!, d.file!.name);
    });

    try {
      const res = await fetch(`${API}/api/upload/batch`, { method: 'POST', body: formData });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();

      if (data.success && data.prefillData) {
        // API success path
        setChecklist(prev => prev.map(d => d.uploaded ? { ...d, valid: true } : d));
        const result = applyPrefill(data.prefillData, mergeForm, setPendingFields, setFilledFields);
        setPrefillSummary({ filled: result.filled.length, pending: result.pending.length });
        setDocuments(checklist.filter(d => d.uploaded));

        // Run compliance validation
        try {
          const valRes = await fetch(`${API}/api/validate/compliance`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ prefillData: data.prefillData }),
          });
          const valData = await valRes.json();
          if (valData.warnings?.length > 0) {
            setComplianceWarnings(valData.warnings);
          }
        } catch { /* compliance check is best-effort */ }

        setUploadDone(true);
      } else {
        throw new Error('Invalid API response');
      }
    } catch {
      // Fallback: local mock
      setChecklist(prev => prev.map(d => d.uploaded ? { ...d, valid: true } : d));
      const prefill = createMockPrefill();
      const result = applyPrefill(prefill as Partial<ApplicationForm>, mergeForm, setPendingFields, setFilledFields);
      setPrefillSummary({ filled: result.filled.length, pending: result.pending.length });
      setDocuments(checklist.filter(d => d.uploaded));

      // Run compliance validation on mock data too
      try {
        const valRes = await fetch(`${API}/api/validate/compliance`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ prefillData: prefill }),
        });
        const valData = await valRes.json();
        if (valData.warnings?.length > 0) {
          setComplianceWarnings(valData.warnings);
        }
      } catch { /* best-effort */ }

      setUploadDone(true);
    }

    setIsUploading(false);
  };

  // Drag & drop handlers
  const handleDragOver = (e: React.DragEvent) => { e.preventDefault(); setIsDragging(true); };
  const handleDragLeave = () => setIsDragging(false);
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    handleBatchFiles(e.dataTransfer.files);
  };

  return (
    <div className="step2-container">
      <div className="step2-header">
        <h2>{lang === 'en' ? 'Step 2: Document Upload' : '第二步：材料上传'}</h2>
        <span className="visa-type-badge">M Visa</span>
      </div>

      {/* Intro text */}
      <p className="step2-intro">
        {lang === 'en'
          ? 'Please upload the required documents below. You can drag & drop all files at once, or upload them one by one.'
          : '请上传以下所需材料。您可以一次拖放所有文件，也可以逐个上传。'}
      </p>

      {/* Batch drop zone */}
      {!uploadDone && (
        <div
          className={`batch-drop-zone ${isDragging ? 'dragging' : ''}`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => batchInputRef.current?.click()}
        >
          <input
            ref={batchInputRef}
            type="file"
            multiple
            accept="image/*,.pdf"
            style={{ display: 'none' }}
            onChange={e => handleBatchFiles(e.target.files)}
          />
          <div className="drop-icon">📁</div>
          <p className="drop-title">
            {lang === 'en' ? 'Drag & drop files here' : '拖放文件到此处'}
          </p>
          <p className="drop-subtitle">
            {lang === 'en' ? 'or click to browse · supports multiple files' : '或点击选择 · 支持多文件'}
          </p>
        </div>
      )}

      {/* Document Checklist */}
      <div className="doc-checklist">
        <h3>
          {lang === 'en' ? 'Document Checklist' : '材料清单'}
          {anyUploaded && <span className="checklist-count">{uploadedCount}/{checklist.length}</span>}
        </h3>
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
                    ref={el => { itemInputRefs.current[doc.type] = el; }}
                    type="file"
                    accept="image/*,.pdf"
                    style={{ display: 'none' }}
                    onChange={e => handleFileSelect(doc.type, e.target.files)}
                  />
                  <button
                    className="upload-btn-small"
                    onClick={(e) => { e.stopPropagation(); itemInputRefs.current[doc.type]?.click(); }}
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

      {/* Process button */}
      {anyUploaded && !uploadDone && (
        <div className="upload-action">
          <button
            className="process-btn"
            onClick={handleProcess}
            disabled={!mandatoryDone || isUploading}
          >
            {isUploading
              ? (lang === 'en' ? '⏳ Classifying & Extracting...' : '⏳ 自动分类与提取中...')
              : mandatoryDone
                ? (lang === 'en' ? '🔍 Auto-Classify & Extract Information' : '🔍 自动分类并提取信息')
                : (lang === 'en' ? 'Upload all required documents first' : '请先上传所有必须材料')}
          </button>
        </div>
      )}

      {/* Compliance Warnings */}
      {uploadDone && complianceWarnings.length > 0 && (
        <div className="compliance-warnings">
          <h3>{lang === 'en' ? '⚠️ Compliance Check Results' : '⚠️ 合规校验结果'}</h3>
          {complianceWarnings.map((w, i) => (
            <div key={i} className={`compliance-item ${w.level}`}>
              <span className="compliance-icon">{w.level === 'error' ? '🚫' : '⚠️'}</span>
              <span className="compliance-msg">{lang === 'en' ? w.messageEn : w.messageZh}</span>
            </div>
          ))}
          {complianceWarnings.some(w => w.level === 'error') && (
            <p className="compliance-block-msg">
              {lang === 'en'
                ? 'Please fix the errors above before continuing.'
                : '请先修正以上错误后再继续。'}
            </p>
          )}
        </div>
      )}

      {/* Prefill Summary */}
      {uploadDone && prefillSummary && (
        <div className="prefill-summary">
          <div className="prefill-header">
            <span className="prefill-icon">📋</span>
            <h3>{lang === 'en' ? 'Extraction Complete' : '提取完成'}</h3>
          </div>
          <div className="prefill-stats">
            <div className="stat-card filled">
              <span className="stat-number">{prefillSummary.filled}</span>
              <span className="stat-label">{lang === 'en' ? 'Fields Prefilled' : '已预填字段'}</span>
            </div>
            <div className="stat-card pending">
              <span className="stat-number">{prefillSummary.pending}</span>
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

/** Flatten nested object to dot-path keys */
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
