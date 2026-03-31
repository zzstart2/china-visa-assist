import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useVisa } from '../context/VisaContext';
import { useI18n } from '../i18n/I18nContext';
import './Step5.css';

const API = import.meta.env.VITE_API_URL || 'http://localhost:3001';

export default function Step5() {
  const navigate = useNavigate();
  const { t } = useI18n();
  const { state } = useVisa();
  const formData = state.formData;
  const passportInfo = state.extractedPassport;
  const [jsonData, setJsonData] = useState<any>(null);
  const [showJson, setShowJson] = useState(false);

  useEffect(() => {
    fetch(`${API}/api/export/json`)
      .then(r => r.json())
      .then(setJsonData)
      .catch(() => setJsonData({ ...formData }));
  }, []);

  const downloadJson = () => {
    const blob = new Blob([JSON.stringify(jsonData || formData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href = url; a.download = 'visa-application.json'; a.click();
    URL.revokeObjectURL(url);
  };

  const downloadCsv = () => {
    window.open(`${API}/api/export/csv`, '_blank');
  };

  return (
    <div className="step5">
      <div className="success-banner">
        <div className="success-icon">✓</div>
        <h2>{t('step5.complete')}</h2>
        <p>{t('step5.desc')}</p>
      </div>

      <div className="summary-card">
        <h3>{t('step5.summary')}</h3>
        <div className="summary-grid">
          <div className="summary-item">
            <span className="label">{t('step5.visaType')}</span>
            <span className="value">(M) Commercial and Trade</span>
          </div>
          <div className="summary-item">
            <span className="label">{t('step5.applicant')}</span>
            <span className="value">{formData?.familyName || passportInfo?.name || 'DELA CRUZ'}, {formData?.givenName || 'JUAN'}</span>
          </div>
          <div className="summary-item">
            <span className="label">{t('step5.passportNo')}</span>
            <span className="value">{passportInfo?.passportNumber || formData?.passportNumber || 'P1234567A'}</span>
          </div>
          <div className="summary-item">
            <span className="label">{t('step5.serviceType')}</span>
            <span className="value">{formData?.serviceType || 'Normal'}</span>
          </div>
        </div>
      </div>

      <div className="export-section">
        <h3>Export</h3>
        <div className="export-buttons">
          <button className="btn-export json" onClick={downloadJson}>
            <span className="icon">📄</span>
            <span>{t('step5.downloadJson')}</span>
          </button>
          <button className="btn-export csv" onClick={downloadCsv}>
            <span className="icon">📊</span>
            <span>{t('step5.downloadCsv')}</span>
          </button>
        </div>
      </div>

      <div className="json-preview">
        <button className="toggle-preview" onClick={() => setShowJson(!showJson)}>
          {showJson ? t('step5.hideJson') : t('step5.showJson')}
        </button>
        {showJson && (
          <pre className="json-code">{JSON.stringify(jsonData || formData || {}, null, 2)}</pre>
        )}
      </div>

      <div className="final-actions">
        <button className="btn-secondary" onClick={() => navigate('/step/4')}>{t('step5.backReview')}</button>
        <button className="btn-primary" onClick={() => navigate('/')}>{t('step5.newApp')}</button>
      </div>
    </div>
  );
}
