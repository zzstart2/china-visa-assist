import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useVisa } from '../context/VisaContext';
import Section1 from './step4/Section1';
import Section2 from './step4/Section2';
import Section3 from './step4/Section3';
import Section4 from './step4/Section4';
import Section5 from './step4/Section5';
import Section6 from './step4/Section6';
import Section7 from './step4/Section7';
import Section8 from './step4/Section8';
import Section9 from './step4/Section9';
import './Step4.css';

const SECTION_NAMES = [
  'Personal Information','Type of Visa','Work Information','Education',
  'Family Information','Travel Information','Previous Travel','Other Information','Declaration'
];

const API = import.meta.env.VITE_API_URL || 'http://localhost:3001';

export default function Step4() {
  const navigate = useNavigate();
  const { state, setFormData } = useVisa();
  const passportInfo = state.extractedPassport;
  const [currentSection, setCurrentSection] = useState(0);
  const [data, setData] = useState<Record<string, any>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API}/api/summary`)
      .then(r => r.json())
      .then(summary => {
        const merged = { ...flattenSummary(summary), ...mapPassport(passportInfo), ...state.formData };
        setData(merged);
        setLoading(false);
      })
      .catch(() => {
        setData({ ...mapPassport(passportInfo), ...state.formData });
        setLoading(false);
      });
  }, []);

  const handleChange = (field: string, value: any) => {
    const next = { ...data, [field]: value };
    setData(next);
    setFormData(next as Record<string, string>);
  };

  const sections = [
    <Section1 data={data} onChange={handleChange} />,
    <Section2 data={data} onChange={handleChange} />,
    <Section3 data={data} onChange={handleChange} />,
    <Section4 data={data} onChange={handleChange} />,
    <Section5 data={data} onChange={handleChange} />,
    <Section6 data={data} onChange={handleChange} />,
    <Section7 data={data} onChange={handleChange} />,
    <Section8 data={data} onChange={handleChange} />,
    <Section9 data={data} onChange={handleChange} />,
  ];

  if (loading) return <div className="step4-loading">Loading application data...</div>;

  return (
    <div className="step4">
      <div className="step4-nav">
        <h4>Sections</h4>
        {SECTION_NAMES.map((name, i) => (
          <button key={i}
            className={`nav-item ${i === currentSection ? 'active' : ''} ${i < currentSection ? 'completed' : ''}`}
            onClick={() => setCurrentSection(i)}>
            <span className="nav-num">{i < currentSection ? '✓' : i + 1}</span>
            <span className="nav-label">{name}</span>
          </button>
        ))}
      </div>

      <div className="step4-content">
        <div className="section-progress">Section {currentSection + 1} of 9</div>
        {sections[currentSection]}

        <div className="step4-actions">
          <button className="btn-secondary" disabled={currentSection === 0}
            onClick={() => setCurrentSection(currentSection - 1)}>← Previous</button>

          {currentSection < 8 ? (
            <button className="btn-primary"
              onClick={() => setCurrentSection(currentSection + 1)}>Next →</button>
          ) : (
            <button className="btn-primary btn-submit"
              disabled={!data.declarationAgreed}
              onClick={() => navigate('/step/5')}>Submit & Export →</button>
          )}
        </div>
      </div>
    </div>
  );
}

function flattenSummary(summary: any): Record<string, any> {
  if (!summary) return {};
  const flat: Record<string, any> = {};
  for (const section of Object.values(summary)) {
    if (typeof section === 'object' && section !== null) {
      Object.assign(flat, section);
    }
  }
  return flat;
}

function mapPassport(p: any): Record<string, any> {
  if (!p) return {};
  return {
    familyName: p.familyName || p.family_name || '',
    givenName: p.givenName || p.given_name || '',
    passportNumber: p.passportNo || p.passport_no || '',
    gender: p.gender === 'M' ? 'Male' : p.gender === 'F' ? 'Female' : '',
    currentNationality: p.nationality === 'PHL' ? 'Philippines' : p.nationality || '',
    issuingCountry: p.nationality === 'PHL' ? 'Philippines' : '',
    birthCountry: p.nationality === 'PHL' ? 'Philippines' : '',
    passportType: 'Ordinary',
  };
}
