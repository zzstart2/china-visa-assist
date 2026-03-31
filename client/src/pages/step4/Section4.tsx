import { useState } from 'react';

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
  const [notApplicable, setNotApplicable] = useState(data.educationNA || false);
  const [educations, setEducations] = useState<EduEntry[]>(data.educations || [emptyEdu()]);

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
      <h3>Section 4: Education</h3>

      <fieldset>
        <legend>4.1 Highest Diploma / Degree</legend>
        <label className="na-check">
          <input type="checkbox" checked={notApplicable}
            onChange={e => { setNotApplicable(e.target.checked); onChange('educationNA', e.target.checked); }} />
          Not applicable
        </label>

        {!notApplicable && educations.map((edu, i) => (
          <div key={i} className="repeatable-item">
            <div className="repeatable-header">
              <strong>Education {i + 1}</strong>
              {educations.length > 1 && <button type="button" className="btn-remove" onClick={() => removeEdu(i)}>Remove</button>}
            </div>
            <div className="form-row">
              <label className="required">Name of Institute</label>
              <input value={edu.schoolName} onChange={e => updateEdu(i, 'schoolName', e.target.value)} />
            </div>
            <div className="form-row">
              <label className="required">Diploma / Degree</label>
              <select value={edu.degree} onChange={e => updateEdu(i, 'degree', e.target.value)}>
                <option value="">Select</option>
                {DEGREES.map(d => <option key={d} value={d}>{d}</option>)}
              </select>
            </div>
            <div className="form-row">
              <label>Major</label>
              <input value={edu.major} onChange={e => updateEdu(i, 'major', e.target.value)} />
            </div>
          </div>
        ))}

        {!notApplicable && <button type="button" className="btn-add" onClick={addEdu}>+ Add Education</button>}
      </fieldset>
    </div>
  );
}
