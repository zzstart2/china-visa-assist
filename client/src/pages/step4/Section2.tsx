import { useI18n } from '../../i18n/I18nContext';

interface Props {
  data: Record<string, any>;
  onChange: (field: string, value: any) => void;
}

export default function Section2({ data, onChange }: Props) {
  const { t } = useI18n();

  return (
    <div className="section-form">
      <h3>{t('s2.title')}</h3>

      <fieldset>
        <legend>{t('s2.visaType')}</legend>
        <div className="form-row">
          <label className="required">{t('s2.visaTypeLabel')}</label>
          <select value={data.visaType || '(M) Commercial and trade activities'}
            onChange={e => onChange('visaType', e.target.value)}>
            <option value="(M) Commercial and trade activities">{t('s2.visaM')}</option>
            <option value="(L) Tourism">{t('s2.visaL')}</option>
            <option value="(G) Transit">{t('s2.visaG')}</option>
            <option value="(F) Exchanges, visits">{t('s2.visaF')}</option>
            <option value="(Z) Work">{t('s2.visaZ')}</option>
          </select>
        </div>
      </fieldset>

      <fieldset>
        <legend>{t('s2.serviceType')}</legend>
        <div className="radio-group">
          {[{v:'Normal',l:t('s2.normal')},{v:'Express',l:t('s2.express')}].map(st=>(
            <label key={st.v}>
              <input type="radio" name="serviceType" value={st.v}
                checked={data.serviceType === st.v} onChange={() => onChange('serviceType', st.v)} /> {st.l}
              {st.v === 'Express' && <span className="hint"> {t('s2.expressHint')}</span>}
            </label>
          ))}
        </div>
      </fieldset>

      <fieldset>
        <legend>{t('s2.appInfo')}</legend>
        <div className="form-row">
          <label>{t('s2.validity')}</label>
          <input type="number" min={1} max={120} value={data.validityMonths || ''}
            onChange={e => onChange('validityMonths', e.target.value)} />
        </div>
        <div className="form-row">
          <label>{t('s2.stayDays')}</label>
          <input type="number" min={1} max={180} value={data.stayDays || ''}
            onChange={e => onChange('stayDays', e.target.value)} />
        </div>
        <div className="form-row">
          <label>{t('s2.entries')}</label>
          <div className="radio-group">
            {[{v:'Single',l:t('s2.entrySingle')},{v:'Double',l:t('s2.entryDouble')},{v:'Multiple',l:t('s2.entryMultiple')}].map(en=>(
              <label key={en.v}>
                <input type="radio" name="entries" value={en.v}
                  checked={data.entries === en.v} onChange={() => onChange('entries', en.v)} /> {en.l}
              </label>
            ))}
          </div>
        </div>
        <p className="note">{t('s2.note')}</p>
      </fieldset>
    </div>
  );
}
