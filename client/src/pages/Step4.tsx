import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useVisa } from '../context/VisaContext';
import { useI18n } from '../i18n/I18nContext';
import type { ApplicationForm } from '../types/application';
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

const API = import.meta.env.VITE_API_URL || '';

export default function Step4() {
  const navigate = useNavigate();
  const { t } = useI18n();
  const { state, setFormData } = useVisa();
  const passportInfo = state.extractedPassport;
  const [currentSection, setCurrentSection] = useState(0);
  const [data, setData] = useState<Record<string, any>>({});
  const [loading, setLoading] = useState(true);
  const contentRef = useRef<HTMLDivElement>(null);

  const SECTION_NAMES = Array.from({length:9},(_,i)=>t(`section.${i+1}`));

  // Scroll to top of content when section changes
  useEffect(() => {
    contentRef.current?.scrollTo(0, 0);
    window.scrollTo(0, 0);
  }, [currentSection]);

  useEffect(() => {
    // Primary data source: state.form (ApplicationForm from Step2 OCR + Step3 chat)
    const formFlat = mapFormToFlat(state.form);

    fetch(`${API}/api/summary`)
      .then(r => r.json())
      .then(summary => {
        // formFlat takes priority over mock summary
        const merged = { ...flattenSummary(summary), ...mapPassport(passportInfo), ...state.formData, ...formFlat };
        setData(merged);
        setLoading(false);
      })
      .catch(() => {
        const merged = { ...mapPassport(passportInfo), ...state.formData, ...formFlat };
        setData(merged);
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

  if (loading) return <div className="step4-loading">{t('step4.loading')}</div>;

  return (
    <div className="step4">
      <div className="step4-nav">
        <h4>{t('step4.sections')}</h4>
        {SECTION_NAMES.map((name, i) => (
          <button key={i}
            className={`nav-item ${i === currentSection ? 'active' : ''} ${i < currentSection ? 'completed' : ''}`}
            onClick={() => setCurrentSection(i)}>
            <span className="nav-num">{i < currentSection ? '✓' : i + 1}</span>
            <span className="nav-label">{name}</span>
          </button>
        ))}
      </div>

      <div className="step4-content" ref={contentRef}>
        <div className="section-progress">{t('step4.sectionOf', {current: String(currentSection+1), total: '9'})}</div>
        {sections[currentSection]}

        <div className="step4-actions">
          <button className="btn-secondary" disabled={currentSection === 0}
            onClick={() => setCurrentSection(currentSection - 1)}>{t('step4.previous')}</button>

          {currentSection < 8 ? (
            <button className="btn-primary"
              onClick={() => setCurrentSection(currentSection + 1)}>{t('step4.next')}</button>
          ) : (
            <button className="btn-primary btn-submit"
              disabled={!data.declarationAgreed}
              onClick={() => navigate('/step/5')}>{t('step4.submit')}</button>
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

/** Convert ApplicationForm (nested) → flat key-value pairs matching Section1-9 components */
function mapFormToFlat(form: ApplicationForm): Record<string, any> {
  const f: Record<string, any> = {};
  if (!form) return f;

  // Section 1: Personal Information
  const s1 = form.section1;
  if (s1) {
    if (s1.familyName?.value) f.familyName = s1.familyName.value;
    if (s1.givenName?.value) f.givenName = s1.givenName.value;
    if (s1.otherNames) f.otherNames = s1.otherNames;
    if (s1.chineseName) f.chineseName = s1.chineseName;
    if (s1.birthDate?.year) {
      f.birthYear = s1.birthDate.year;
      f.birthMonth = s1.birthDate.month;
      f.birthDay = s1.birthDate.day;
    }
    if (s1.gender) f.gender = s1.gender;
    if (s1.birthCountry) f.birthCountry = s1.birthCountry;
    if (s1.birthProvince) f.birthProvince = s1.birthProvince;
    if (s1.birthCity) f.birthCity = s1.birthCity;
    if (s1.maritalStatus) f.maritalStatus = s1.maritalStatus;
    if (s1.currentNationality) f.currentNationality = s1.currentNationality;
    if (s1.nationalIdNumber?.value) f.nationalityIdNumber = s1.nationalIdNumber.value;
    if (s1.hasOtherNationality) f.hasOtherNationality = s1.hasOtherNationality;
    if (s1.hasPermanentResident) f.hasPermanentResident = s1.hasPermanentResident;
    if (s1.hadOtherNationalities) f.hadOtherNationalities = s1.hadOtherNationalities;
    if (s1.passportType) f.passportType = s1.passportType;
    if (s1.passportNumber) f.passportNumber = s1.passportNumber;
    if (s1.issuingCountry) f.issuingCountry = s1.issuingCountry;
    if (s1.placeOfIssue) f.placeOfIssue = s1.placeOfIssue;
    if (s1.passportExpiry?.year) {
      f.expiryYear = s1.passportExpiry.year;
      f.expiryMonth = s1.passportExpiry.month;
      f.expiryDay = s1.passportExpiry.day;
    }
  }

  // Section 2: Visa Type
  const s2 = form.section2;
  if (s2) {
    if (s2.visaType) f.visaType = s2.visaType;
    if (s2.serviceType) f.serviceType = s2.serviceType;
    if (s2.entries) f.entries = s2.entries;
    if (s2.validityMonths) f.validityMonths = s2.validityMonths;
    if (s2.maxStayDays) f.stayDays = s2.maxStayDays;
  }

  // Section 3: Work Information
  const s3 = form.section3;
  if (s3) {
    if (s3.currentOccupation) f.currentOccupation = s3.currentOccupation;
    if (s3.occupationOther) f.occupationOther = s3.occupationOther;
    if (s3.workHistory?.length) f.workHistory = s3.workHistory;
  }

  // Section 5: Family / Contact
  const s5 = form.section5;
  if (s5) {
    if (s5.currentAddress) f.homeAddress = s5.currentAddress;
    if (s5.phone) f.phoneNumber = s5.phone;
    if (s5.mobilePhone) f.mobilePhone = s5.mobilePhone;
    if (s5.email) f.email = s5.email;
  }

  // Section 6: Travel
  const s6 = form.section6;
  if (s6) {
    if (s6.travelPayBy) f.travelPayBy = s6.travelPayBy;
    if (s6.inviter?.name) f.inviterName = s6.inviter.name;
    if (s6.inviter?.phone) f.inviterPhone = s6.inviter.phone;
    if (s6.inviter?.relationship) f.inviterRelationship = s6.inviter.relationship;
    if (s6.emergencyContact?.familyName?.value) f.emergencyFamilyName = s6.emergencyContact.familyName.value;
    if (s6.emergencyContact?.givenName?.value) f.emergencyGivenName = s6.emergencyContact.givenName.value;
    if (s6.emergencyContact?.phone) f.emergencyPhone = s6.emergencyContact.phone;
    if (s6.emergencyContact?.relationship) f.emergencyRelationship = s6.emergencyContact.relationship;
  }

  return f;
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
