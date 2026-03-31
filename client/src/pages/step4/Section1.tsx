import { useState } from 'react';
import '../components/FormField.css';

const COUNTRIES = [
  'Philippines','China','United States','Japan','South Korea','Singapore',
  'Malaysia','Indonesia','Thailand','Vietnam','India','United Kingdom',
  'Australia','Canada','Germany','France','Brazil','Saudi Arabia'
];

interface Props {
  data: Record<string, any>;
  onChange: (field: string, value: any) => void;
}

export default function Section1({ data, onChange }: Props) {
  const [naIdNA, setNaIdNA] = useState(false);

  return (
    <div className="section-form">
      <h3>Section 1: Personal Information</h3>

      <fieldset>
        <legend>1.1 Name</legend>
        <div className="form-row">
          <label className="required">Family Name (as in passport)</label>
          <input value={data.familyName || ''} onChange={e => onChange('familyName', e.target.value)} />
        </div>
        <div className="form-row">
          <label className="required">Given Name(s)</label>
          <input value={data.givenName || ''} onChange={e => onChange('givenName', e.target.value)} />
        </div>
        <div className="form-row">
          <label>Other / Former Name(s)</label>
          <input value={data.otherNames || ''} onChange={e => onChange('otherNames', e.target.value)} />
        </div>
        <div className="form-row">
          <label>Chinese Name (if any)</label>
          <input value={data.chineseName || ''} onChange={e => onChange('chineseName', e.target.value)} />
        </div>
      </fieldset>

      <fieldset>
        <legend>1.2 Date of Birth</legend>
        <div className="date-group">
          <input type="text" placeholder="YYYY" maxLength={4} className="date-year"
            value={data.birthYear || ''} onChange={e => onChange('birthYear', e.target.value)} />
          <select value={data.birthMonth || ''} onChange={e => onChange('birthMonth', e.target.value)}>
            <option value="">Month</option>
            {Array.from({length:12},(_,i)=>i+1).map(m=><option key={m} value={m}>{m}</option>)}
          </select>
          <select value={data.birthDay || ''} onChange={e => onChange('birthDay', e.target.value)}>
            <option value="">Day</option>
            {Array.from({length:31},(_,i)=>i+1).map(d=><option key={d} value={d}>{d}</option>)}
          </select>
        </div>
      </fieldset>

      <fieldset>
        <legend>1.3 Gender</legend>
        <div className="radio-group">
          {['Male','Female'].map(g=>(
            <label key={g}><input type="radio" name="gender" value={g} checked={data.gender===g}
              onChange={()=>onChange('gender',g)}/> {g}</label>
          ))}
        </div>
      </fieldset>

      <fieldset>
        <legend>1.4 Place of Birth</legend>
        <div className="form-row">
          <label className="required">Country / Region</label>
          <select value={data.birthCountry||''} onChange={e=>onChange('birthCountry',e.target.value)}>
            <option value="">Select</option>
            {COUNTRIES.map(c=><option key={c} value={c}>{c}</option>)}
          </select>
        </div>
        <div className="form-row">
          <label className="required">Province / State</label>
          <input value={data.birthProvince||''} onChange={e=>onChange('birthProvince',e.target.value)}/>
        </div>
        <div className="form-row">
          <label className="required">City</label>
          <input value={data.birthCity||''} onChange={e=>onChange('birthCity',e.target.value)}/>
        </div>
      </fieldset>

      <fieldset>
        <legend>1.5 Marital Status</legend>
        <div className="radio-group">
          {['Married','Divorced','Single','Widowed','Other'].map(s=>(
            <label key={s}><input type="radio" name="marital" value={s} checked={data.maritalStatus===s}
              onChange={()=>onChange('maritalStatus',s)}/> {s}</label>
          ))}
        </div>
      </fieldset>

      <fieldset>
        <legend>1.6 Nationality & Permanent Residence</legend>
        <div className="form-row">
          <label className="required">Current Nationality</label>
          <select value={data.currentNationality||''} onChange={e=>onChange('currentNationality',e.target.value)}>
            <option value="">Select</option>
            {COUNTRIES.map(c=><option key={c} value={c}>{c}</option>)}
          </select>
        </div>
        <div className="form-row">
          <label className="required">ID Number in Country of Nationality</label>
          <div className="input-with-na">
            <input disabled={naIdNA} value={naIdNA?'N/A':(data.nationalityIdNumber||'')}
              onChange={e=>onChange('nationalityIdNumber',e.target.value)}/>
            <label className="na-check"><input type="checkbox" checked={naIdNA}
              onChange={e=>{setNaIdNA(e.target.checked);if(e.target.checked)onChange('nationalityIdNumber','N/A');}}/> Not applicable</label>
          </div>
        </div>
        <div className="form-row">
          <label className="required">Do you have any other nationality?</label>
          <div className="radio-group">
            {['Yes','No'].map(v=>(
              <label key={v}><input type="radio" name="otherNat" value={v} checked={data.hasOtherNationality===v}
                onChange={()=>onChange('hasOtherNationality',v)}/> {v}</label>
            ))}
          </div>
          {data.hasOtherNationality==='Yes'&&(
            <div className="conditional-fields">
              <div className="form-row">
                <label>Other Nationality</label>
                <select value={data.otherNationality||''} onChange={e=>onChange('otherNationality',e.target.value)}>
                  <option value="">Select</option>
                  {COUNTRIES.map(c=><option key={c} value={c}>{c}</option>)}
                </select>
              </div>
            </div>
          )}
        </div>
        <div className="form-row">
          <label className="required">Permanent resident in another country?</label>
          <div className="radio-group">
            {['Yes','No'].map(v=>(
              <label key={v}><input type="radio" name="permRes" value={v} checked={data.hasPermanentResident===v}
                onChange={()=>onChange('hasPermanentResident',v)}/> {v}</label>
            ))}
          </div>
          {data.hasPermanentResident==='Yes'&&(
            <div className="conditional-fields">
              <div className="form-row">
                <label>Country of Permanent Residence</label>
                <select value={data.permanentResidentCountry||''} onChange={e=>onChange('permanentResidentCountry',e.target.value)}>
                  <option value="">Select</option>
                  {COUNTRIES.map(c=><option key={c} value={c}>{c}</option>)}
                </select>
              </div>
            </div>
          )}
        </div>
      </fieldset>

      <fieldset>
        <legend>1.7 Passport Information</legend>
        <div className="form-row">
          <label className="required">Type of Passport</label>
          <div className="radio-group">
            {['Ordinary','Service','Diplomatic','Official','Special','Other'].map(t=>(
              <label key={t}><input type="radio" name="passType" value={t} checked={data.passportType===t}
                onChange={()=>onChange('passportType',t)}/> {t}</label>
            ))}
          </div>
        </div>
        <div className="form-row">
          <label className="required">Passport Number</label>
          <input value={data.passportNumber||''} onChange={e=>onChange('passportNumber',e.target.value)}/>
        </div>
        <div className="form-row">
          <label className="required">Issuing Country</label>
          <select value={data.issuingCountry||''} onChange={e=>onChange('issuingCountry',e.target.value)}>
            <option value="">Select</option>
            {COUNTRIES.map(c=><option key={c} value={c}>{c}</option>)}
          </select>
        </div>
        <div className="form-row">
          <label className="required">Place of Issue</label>
          <input value={data.placeOfIssue||''} onChange={e=>onChange('placeOfIssue',e.target.value)}/>
        </div>
        <div className="form-row">
          <label className="required">Expiration Date</label>
          <div className="date-group">
            <input type="text" placeholder="YYYY" maxLength={4} className="date-year"
              value={data.expiryYear||''} onChange={e=>onChange('expiryYear',e.target.value)}/>
            <select value={data.expiryMonth||''} onChange={e=>onChange('expiryMonth',e.target.value)}>
              <option value="">Month</option>
              {Array.from({length:12},(_,i)=>i+1).map(m=><option key={m} value={m}>{m}</option>)}
            </select>
            <select value={data.expiryDay||''} onChange={e=>onChange('expiryDay',e.target.value)}>
              <option value="">Day</option>
              {Array.from({length:31},(_,i)=>i+1).map(d=><option key={d} value={d}>{d}</option>)}
            </select>
          </div>
        </div>
      </fieldset>
    </div>
  );
}
