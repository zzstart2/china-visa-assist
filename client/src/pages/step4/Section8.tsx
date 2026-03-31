import { useI18n } from '../../i18n/I18nContext';

interface Props { data: Record<string, any>; onChange: (field: string, value: any) => void; }

const QUESTIONS = [
  { key:'refusedEntry', tKey:'s8.refusedEntry' },
  { key:'visaCanceled', tKey:'s8.visaCanceled' },
  { key:'illegalEntry', tKey:'s8.illegalEntry' },
  { key:'criminalRecord', tKey:'s8.criminalRecord' },
  { key:'mentalDisease', tKey:'s8.mentalDisease' },
  { key:'epidemicArea', tKey:'s8.epidemicArea' },
  { key:'specialSkills', tKey:'s8.specialSkills' },
  { key:'military', tKey:'s8.military' },
  { key:'paramilitary', tKey:'s8.paramilitary' },
  { key:'charitableOrg', tKey:'s8.charitableOrg' },
  { key:'otherDeclare', tKey:'s8.otherDeclare' },
];

export default function Section8({ data, onChange }: Props) {
  const { t } = useI18n();

  return (
    <div className="section-form">
      <h3>{t('s8.title')}</h3>
      {QUESTIONS.map(q => (
        <fieldset key={q.key}>
          <legend>{t(q.tKey)}</legend>
          <div className="radio-group">
            {['Yes','No'].map(v=>(<label key={v}><input type="radio" name={q.key} value={v}
              checked={data[q.key]===v} onChange={()=>onChange(q.key,v)}/> {v === 'Yes' ? t('s.yes') : t('s.no')}</label>))}
          </div>
          {data[q.key]==='Yes'&&(
            <div className="conditional-fields">
              <div className="form-row"><label>{t('s8.pleaseExplain')}</label>
                <textarea value={data[q.key+'Details']||''} onChange={e=>onChange(q.key+'Details',e.target.value)} rows={3}/></div>
            </div>
          )}
        </fieldset>
      ))}
    </div>
  );
}
