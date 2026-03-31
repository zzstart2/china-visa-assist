import { useI18n } from '../../i18n/I18nContext';

interface Props { data: Record<string, any>; onChange: (field: string, value: any) => void; }

export default function Section7({ data, onChange }: Props) {
  const { t } = useI18n();

  return (
    <div className="section-form">
      <h3>{t('s7.title')}</h3>

      <fieldset>
        <legend>{t('s7.beenToChina')}</legend>
        <div className="radio-group">
          {['Yes','No'].map(v=>(<label key={v}><input type="radio" name="beenToChina" value={v}
            checked={data.beenToChina===v} onChange={()=>onChange('beenToChina',v)}/> {v === 'Yes' ? t('s.yes') : t('s.no')}</label>))}
        </div>
        {data.beenToChina==='Yes'&&(
          <div className="conditional-fields">
            <div className="form-row"><label>{t('s7.lastVisitDate')}</label><input type="date" value={data.lastChinaVisitDate||''} onChange={e=>onChange('lastChinaVisitDate',e.target.value)}/></div>
            <div className="form-row"><label>{t('s7.visitCount')}</label><input type="number" min={1} value={data.chinaVisitCount||''} onChange={e=>onChange('chinaVisitCount',e.target.value)}/></div>
          </div>
        )}
      </fieldset>

      <fieldset>
        <legend>{t('s7.hadVisa')}</legend>
        <div className="radio-group">
          {['Yes','No'].map(v=>(<label key={v}><input type="radio" name="hadChineseVisa" value={v}
            checked={data.hadChineseVisa===v} onChange={()=>onChange('hadChineseVisa',v)}/> {v === 'Yes' ? t('s.yes') : t('s.no')}</label>))}
        </div>
        {data.hadChineseVisa==='Yes'&&(
          <div className="conditional-fields">
            <div className="form-row"><label>{t('s7.visaNumber')}</label><input value={data.previousVisaNumber||''} onChange={e=>onChange('previousVisaNumber',e.target.value)}/></div>
            <div className="form-row"><label>{t('s7.visaPlace')}</label><input value={data.previousVisaPlace||''} onChange={e=>onChange('previousVisaPlace',e.target.value)}/></div>
            <div className="form-row"><label>{t('s7.visaDate')}</label><input type="date" value={data.previousVisaDate||''} onChange={e=>onChange('previousVisaDate',e.target.value)}/></div>
          </div>
        )}
      </fieldset>

      <fieldset>
        <legend>{t('s7.otherVisas')}</legend>
        <div className="radio-group">
          {['Yes','No'].map(v=>(<label key={v}><input type="radio" name="otherVisas" value={v}
            checked={data.hasOtherVisas===v} onChange={()=>onChange('hasOtherVisas',v)}/> {v === 'Yes' ? t('s.yes') : t('s.no')}</label>))}
        </div>
        {data.hasOtherVisas==='Yes'&&(
          <div className="conditional-fields">
            <div className="form-row"><label>{t('s7.otherVisasDetails')}</label>
              <textarea value={data.otherVisasDetails||''} onChange={e=>onChange('otherVisasDetails',e.target.value)} rows={3}/></div>
          </div>
        )}
      </fieldset>

      <fieldset>
        <legend>{t('s7.traveledRecently')}</legend>
        <div className="radio-group">
          {['Yes','No'].map(v=>(<label key={v}><input type="radio" name="traveledRecently" value={v}
            checked={data.traveledRecently===v} onChange={()=>onChange('traveledRecently',v)}/> {v === 'Yes' ? t('s.yes') : t('s.no')}</label>))}
        </div>
        {data.traveledRecently==='Yes'&&(
          <div className="conditional-fields">
            <div className="form-row"><label>{t('s7.recentCountries')}</label>
              <textarea value={data.recentTravelCountries||''} onChange={e=>onChange('recentTravelCountries',e.target.value)} rows={2} placeholder={t('s7.recentPlaceholder')}/></div>
          </div>
        )}
      </fieldset>
    </div>
  );
}
