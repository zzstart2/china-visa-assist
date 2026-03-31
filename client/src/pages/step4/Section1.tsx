import { useState } from 'react';
import { useI18n } from '../../i18n/I18nContext';

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
  const { t } = useI18n();
  const [naIdNA, setNaIdNA] = useState(false);

  return (
    <div className="section-form">
      <h3>{t('s1.title')}</h3>

      <fieldset>
        <legend>{t('s1.name')}</legend>
        <div className="form-row">
          <label className="required">{t('s1.familyName')}</label>
          <input value={data.familyName || ''} onChange={e => onChange('familyName', e.target.value)} />
        </div>
        <div className="form-row">
          <label className="required">{t('s1.givenName')}</label>
          <input value={data.givenName || ''} onChange={e => onChange('givenName', e.target.value)} />
        </div>
        <div className="form-row">
          <label>{t('s1.otherNames')}</label>
          <input value={data.otherNames || ''} onChange={e => onChange('otherNames', e.target.value)} />
        </div>
        <div className="form-row">
          <label>{t('s1.chineseName')}</label>
          <input value={data.chineseName || ''} onChange={e => onChange('chineseName', e.target.value)} />
        </div>
      </fieldset>

      <fieldset>
        <legend>{t('s1.dob')}</legend>
        <div className="date-group">
          <input type="text" placeholder={t('s1.year')} maxLength={4} className="date-year"
            value={data.birthYear || ''} onChange={e => onChange('birthYear', e.target.value)} />
          <select value={data.birthMonth || ''} onChange={e => onChange('birthMonth', e.target.value)}>
            <option value="">{t('s1.month')}</option>
            {Array.from({length:12},(_,i)=>i+1).map(m=><option key={m} value={m}>{m}</option>)}
          </select>
          <select value={data.birthDay || ''} onChange={e => onChange('birthDay', e.target.value)}>
            <option value="">{t('s1.day')}</option>
            {Array.from({length:31},(_,i)=>i+1).map(d=><option key={d} value={d}>{d}</option>)}
          </select>
        </div>
      </fieldset>

      <fieldset>
        <legend>{t('s1.gender')}</legend>
        <div className="radio-group">
          {['Male','Female'].map(g=>(
            <label key={g}><input type="radio" name="gender" value={g} checked={data.gender===g}
              onChange={()=>onChange('gender',g)}/> {g === 'Male' ? t('s1.male') : t('s1.female')}</label>
          ))}
        </div>
      </fieldset>

      <fieldset>
        <legend>{t('s1.birthPlace')}</legend>
        <div className="form-row">
          <label className="required">{t('s1.country')}</label>
          <select value={data.birthCountry||''} onChange={e=>onChange('birthCountry',e.target.value)}>
            <option value="">{t('s1.select')}</option>
            {COUNTRIES.map(c=><option key={c} value={c}>{c}</option>)}
          </select>
        </div>
        <div className="form-row">
          <label className="required">{t('s1.province')}</label>
          <input value={data.birthProvince||''} onChange={e=>onChange('birthProvince',e.target.value)}/>
        </div>
        <div className="form-row">
          <label className="required">{t('s1.city')}</label>
          <input value={data.birthCity||''} onChange={e=>onChange('birthCity',e.target.value)}/>
        </div>
      </fieldset>

      <fieldset>
        <legend>{t('s1.maritalStatus')}</legend>
        <div className="radio-group">
          {[
            {v:'Married',l:t('s1.married')},
            {v:'Divorced',l:t('s1.divorced')},
            {v:'Single',l:t('s1.single')},
            {v:'Widowed',l:t('s1.widowed')},
            {v:'Other',l:t('s1.maritalOther')}
          ].map(s=>(
            <label key={s.v}><input type="radio" name="marital" value={s.v} checked={data.maritalStatus===s.v}
              onChange={()=>onChange('maritalStatus',s.v)}/> {s.l}</label>
          ))}
        </div>
      </fieldset>

      <fieldset>
        <legend>{t('s1.nationality')}</legend>
        <div className="form-row">
          <label className="required">{t('s1.currentNationality')}</label>
          <select value={data.currentNationality||''} onChange={e=>onChange('currentNationality',e.target.value)}>
            <option value="">{t('s1.select')}</option>
            {COUNTRIES.map(c=><option key={c} value={c}>{c}</option>)}
          </select>
        </div>
        <div className="form-row">
          <label className="required">{t('s1.idNumber')}</label>
          <div className="input-with-na">
            <input disabled={naIdNA} value={naIdNA?'N/A':(data.nationalityIdNumber||'')}
              onChange={e=>onChange('nationalityIdNumber',e.target.value)}/>
            <label className="na-check"><input type="checkbox" checked={naIdNA}
              onChange={e=>{setNaIdNA(e.target.checked);if(e.target.checked)onChange('nationalityIdNumber','N/A');}}/> {t('s1.notApplicable')}</label>
          </div>
        </div>
        <div className="form-row">
          <label className="required">{t('s1.otherNationality')}</label>
          <div className="radio-group">
            {['Yes','No'].map(v=>(
              <label key={v}><input type="radio" name="otherNat" value={v} checked={data.hasOtherNationality===v}
                onChange={()=>onChange('hasOtherNationality',v)}/> {v === 'Yes' ? t('s.yes') : t('s.no')}</label>
            ))}
          </div>
          {data.hasOtherNationality==='Yes'&&(
            <div className="conditional-fields">
              <div className="form-row">
                <label>{t('s1.otherNationalityLabel')}</label>
                <select value={data.otherNationality||''} onChange={e=>onChange('otherNationality',e.target.value)}>
                  <option value="">{t('s1.select')}</option>
                  {COUNTRIES.map(c=><option key={c} value={c}>{c}</option>)}
                </select>
              </div>
            </div>
          )}
        </div>
        <div className="form-row">
          <label className="required">{t('s1.permanentResident')}</label>
          <div className="radio-group">
            {['Yes','No'].map(v=>(
              <label key={v}><input type="radio" name="permRes" value={v} checked={data.hasPermanentResident===v}
                onChange={()=>onChange('hasPermanentResident',v)}/> {v === 'Yes' ? t('s.yes') : t('s.no')}</label>
            ))}
          </div>
          {data.hasPermanentResident==='Yes'&&(
            <div className="conditional-fields">
              <div className="form-row">
                <label>{t('s1.permanentResidentCountry')}</label>
                <select value={data.permanentResidentCountry||''} onChange={e=>onChange('permanentResidentCountry',e.target.value)}>
                  <option value="">{t('s1.select')}</option>
                  {COUNTRIES.map(c=><option key={c} value={c}>{c}</option>)}
                </select>
              </div>
            </div>
          )}
        </div>
      </fieldset>

      <fieldset>
        <legend>{t('s1.passport')}</legend>
        <div className="form-row">
          <label className="required">{t('s1.passportType')}</label>
          <div className="radio-group">
            {[
              {v:'Ordinary',l:t('s1.passportOrdinary')},
              {v:'Service',l:t('s1.passportService')},
              {v:'Diplomatic',l:t('s1.passportDiplomatic')},
              {v:'Official',l:t('s1.passportOfficial')},
              {v:'Special',l:t('s1.passportSpecial')},
              {v:'Other',l:t('s1.passportOther')}
            ].map(pt=>(
              <label key={pt.v}><input type="radio" name="passType" value={pt.v} checked={data.passportType===pt.v}
                onChange={()=>onChange('passportType',pt.v)}/> {pt.l}</label>
            ))}
          </div>
        </div>
        <div className="form-row">
          <label className="required">{t('s1.passportNumber')}</label>
          <input value={data.passportNumber||''} onChange={e=>onChange('passportNumber',e.target.value)}/>
        </div>
        <div className="form-row">
          <label className="required">{t('s1.issuingCountry')}</label>
          <select value={data.issuingCountry||''} onChange={e=>onChange('issuingCountry',e.target.value)}>
            <option value="">{t('s1.select')}</option>
            {COUNTRIES.map(c=><option key={c} value={c}>{c}</option>)}
          </select>
        </div>
        <div className="form-row">
          <label className="required">{t('s1.placeOfIssue')}</label>
          <input value={data.placeOfIssue||''} onChange={e=>onChange('placeOfIssue',e.target.value)}/>
        </div>
        <div className="form-row">
          <label className="required">{t('s1.expirationDate')}</label>
          <div className="date-group">
            <input type="text" placeholder={t('s1.year')} maxLength={4} className="date-year"
              value={data.expiryYear||''} onChange={e=>onChange('expiryYear',e.target.value)}/>
            <select value={data.expiryMonth||''} onChange={e=>onChange('expiryMonth',e.target.value)}>
              <option value="">{t('s1.month')}</option>
              {Array.from({length:12},(_,i)=>i+1).map(m=><option key={m} value={m}>{m}</option>)}
            </select>
            <select value={data.expiryDay||''} onChange={e=>onChange('expiryDay',e.target.value)}>
              <option value="">{t('s1.day')}</option>
              {Array.from({length:31},(_,i)=>i+1).map(d=><option key={d} value={d}>{d}</option>)}
            </select>
          </div>
        </div>
      </fieldset>
    </div>
  );
}
