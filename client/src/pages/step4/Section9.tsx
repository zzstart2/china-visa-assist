import { useState } from 'react';

interface Props { data: Record<string, any>; onChange: (field: string, value: any) => void; }

const DECLARATION_TEXT = `I declare that the information I have provided in this application is true and correct to the best of my knowledge and belief. I understand that any false or misleading information may result in the refusal of my visa application or the cancellation of any visa granted. I understand that the consular officer has the final authority to determine whether to issue a visa, the type of visa, validity period, duration of stay, and number of entries. I understand that holding a visa does not guarantee entry into China.`;

export default function Section9({ data, onChange }: Props) {
  const [agreed, setAgreed] = useState(data.declarationAgreed || false);

  return (
    <div className="section-form">
      <h3>Section 9: Declaration</h3>

      <fieldset>
        <legend>9.1 The person who fills in the form</legend>
        <div className="radio-group">
          {['Applicant','Representative'].map(v=>(<label key={v}><input type="radio" name="formFiller" value={v}
            checked={data.formFiller===v} onChange={()=>onChange('formFiller',v)}/> {v === 'Applicant' ? 'Applicant (self)' : 'Person filling on behalf of applicant'}</label>))}
        </div>
        {data.formFiller==='Representative'&&(
          <div className="conditional-fields">
            <div className="form-row"><label className="required">Representative Name</label>
              <input value={data.repName||''} onChange={e=>onChange('repName',e.target.value)}/></div>
            <div className="form-row"><label className="required">Relationship to Applicant</label>
              <input value={data.repRelation||''} onChange={e=>onChange('repRelation',e.target.value)}/></div>
            <div className="form-row"><label className="required">Phone</label>
              <input value={data.repPhone||''} onChange={e=>onChange('repPhone',e.target.value)}/></div>
          </div>
        )}
      </fieldset>

      <fieldset>
        <legend>Declaration</legend>
        <div className="declaration-text">
          <p>{DECLARATION_TEXT}</p>
          <p><strong>Submission City: MANILA</strong></p>
        </div>
        <label className="agree-check">
          <input type="checkbox" checked={agreed}
            onChange={e => { setAgreed(e.target.checked); onChange('declarationAgreed', e.target.checked); }} />
          <strong>I understand and agree with the above.</strong>
        </label>
      </fieldset>
    </div>
  );
}
