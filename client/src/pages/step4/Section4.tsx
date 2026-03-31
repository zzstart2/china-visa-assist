import { useState } from 'react';
import { useI18n } from '../../i18n/I18nContext';

const DEGREES = [
  'Technical secondary school/high school or equivalent',
  'Junior college/undergraduate degree or equivalent',
  "Master's degree or equivalent",
  'Doctoral degree or above',
  'Other'
];

interface EduEntry { schoolName: string; degree: string; major: string; }
const emptyEdu = (): EduEntry => ({ schoolName: '', degree: '', major: '' });

interface Props {
  data: Record<string, any>;
  onChange: (field: string, value: any) => void;
}

export default function Section4({ data, onChange }: Props) {
  const { t } = useI18n();
  const [notApplicable, setNotApplicable] = useState(data.educationNA || false);
  const [educations, setEducations] = useState<EduEntry[]>(data.educations || [emptyEdu()]);

  const DEGREE_KEYS: Record<string, string> = {
    'Technical secondary school/high school or equivalent': 's4.degTech',
    'Junior college/undergraduate degree or equivalent': 's4.degJunior',
    "Master's degree or equivalent": 's4.degMaster',
    'Doctoral degree or above': 's4.degDoctor',
    'Other': 's4.degOther'
  };

  const updateEdu = (idx: number, field: keyof EduEntry, value: string) => {
    const updated = [...educations];
    updated[idx] = { ...updated[idx], [field]: value };
    setEducations(updated);
    onChange('educations', updated);
  };

  const addEdu = () => { const e = [...educations, emptyEdu()]; setEducations(e); onChange('educations', e); };
  const removeEdu = (i: number) => { const e = educations.filter((_,idx)=>idx!==i); setEducations(e); onChange('educations', e); };

  return (
    <div className="section-form">
      <h3>{t('s4.title')}</h3>

      <fieldset>
        <legend>{t('s4.diploma')}</legend>
        <label className="na-check">
          <input type="checkbox" checked={notApplicable}
            onChange={e => { setNotApplicable(e.target.checked); onChange('educationNA', e.target.checked); }} />
          {t('step4.notApplicable')}
        </label>

        {!notApplicable && educations.map((edu, i) => (
          <div key={i} className="repeatable-item">
            <div className="repeatable-header">
              <strong>{t('s4.education')} {i + 1}</strong>
              {educations.length > 1 && <button type="button" className="btn-remove" onClick={() => removeEdu(i)}>{t('s.remove')}</button>}
            </div>
            <div className="form-row">
              <label className="required">{t('s4.schoolName')}</label>
              <input value={edu.schoolName} onChange={e => updateEdu(i, 'schoolName', e.target.value)} />
            </div>
            <div className="form-row">
              <label className="required">{t('s4.degree')}</label>
              <select value={edu.degree} onChange={e => updateEdu(i, 'degree', e.target.value)}>
                <option value="">{t('s.select')}</option>
                {DEGREES.map(d => <option key={d} value={d}>{t(DEGREE_KEYS[d])}</option>)}
              </select>
            </div>
            <div className="form-row">
              <label>{t('s4.major')}</label>
              <input value={edu.major} onChange={e => updateEdu(i, 'major', e.target.value)} />
            </div>
          </div>
        ))}

        {!notApplicable && <button type="button" className="btn-add" onClick={addEdu}>{t('s4.addEdu')}</button>}
      </fieldset>
    </div>
  );
}
