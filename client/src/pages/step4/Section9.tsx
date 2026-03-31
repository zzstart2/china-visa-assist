import { useState } from 'react';
import { useI18n } from '../../i18n/I18nContext';

interface Props { data: Record<string, any>; onChange: (field: string, value: any) => void; }

export default function Section9({ data, onChange }: Props) {
  const { t } = useI18n();
  const [agreed, setAgreed] = useState(data.declarationAgreed || false);

  return (
    <div className="section-form">
      <h3>{t('s9.title')}</h3>

      <fieldset>
        <legend>{t('s9.formFiller')}</legend>
        <div className="radio-group">
          {['Applicant','Representative'].map(v=>(<label key={v}><input type="radio" name="formFiller" value={v}
            checked={data.formFiller===v} onChange={()=>onChange('formFiller',v)}/> {v === 'Applicant' ? t('s9.applicant') : t('s9.representative')}</label>))}
        </div>
        {data.formFiller==='Representative'&&(
          <div className="conditional-fields">
            <div className="form-row"><label className="required">{t('s9.repName')}</label>
              <input value={data.repName||''} onChange={e=>onChange('repName',e.target.value)}/></div>
            <div className="form-row"><label className="required">{t('s9.repRelation')}</label>
              <input value={data.repRelation||''} onChange={e=>onChange('repRelation',e.target.value)}/></div>
            <div className="form-row"><label className="required">{t('s9.repPhone')}</label>
              <input value={data.repPhone||''} onChange={e=>onChange('repPhone',e.target.value)}/></div>
          </div>
        )}
      </fieldset>

      <fieldset>
        <legend>{t('s9.declaration')}</legend>
        <div className="declaration-text">
          <p>{t('s9.declarationText')}</p>
          <p><strong>{t('s9.submissionCity')}</strong></p>
        </div>
        <label className="agree-check">
          <input type="checkbox" checked={agreed}
            onChange={e => { setAgreed(e.target.checked); onChange('declarationAgreed', e.target.checked); }} />
          <strong>{t('s9.agree')}</strong>
        </label>
      </fieldset>
    </div>
  );
}
