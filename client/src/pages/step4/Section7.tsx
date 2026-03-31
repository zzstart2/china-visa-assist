interface Props { data: Record<string, any>; onChange: (field: string, value: any) => void; }

export default function Section7({ data, onChange }: Props) {
  return (
    <div className="section-form">
      <h3>Section 7: Information on Previous Travel</h3>

      <fieldset>
        <legend>7.1 Have you ever been to China?</legend>
        <div className="radio-group">
          {['Yes','No'].map(v=>(<label key={v}><input type="radio" name="beenToChina" value={v}
            checked={data.beenToChina===v} onChange={()=>onChange('beenToChina',v)}/> {v}</label>))}
        </div>
        {data.beenToChina==='Yes'&&(
          <div className="conditional-fields">
            <div className="form-row"><label>Last visit date</label><input type="date" value={data.lastChinaVisitDate||''} onChange={e=>onChange('lastChinaVisitDate',e.target.value)}/></div>
            <div className="form-row"><label>Number of visits</label><input type="number" min={1} value={data.chinaVisitCount||''} onChange={e=>onChange('chinaVisitCount',e.target.value)}/></div>
          </div>
        )}
      </fieldset>

      <fieldset>
        <legend>7.2 Have you ever gotten a Chinese visa?</legend>
        <div className="radio-group">
          {['Yes','No'].map(v=>(<label key={v}><input type="radio" name="hadChineseVisa" value={v}
            checked={data.hadChineseVisa===v} onChange={()=>onChange('hadChineseVisa',v)}/> {v}</label>))}
        </div>
        {data.hadChineseVisa==='Yes'&&(
          <div className="conditional-fields">
            <div className="form-row"><label>Visa Number</label><input value={data.previousVisaNumber||''} onChange={e=>onChange('previousVisaNumber',e.target.value)}/></div>
            <div className="form-row"><label>Place of Issue</label><input value={data.previousVisaPlace||''} onChange={e=>onChange('previousVisaPlace',e.target.value)}/></div>
            <div className="form-row"><label>Issue Date</label><input type="date" value={data.previousVisaDate||''} onChange={e=>onChange('previousVisaDate',e.target.value)}/></div>
          </div>
        )}
      </fieldset>

      <fieldset>
        <legend>7.3 Do you have valid visas from other countries?</legend>
        <div className="radio-group">
          {['Yes','No'].map(v=>(<label key={v}><input type="radio" name="otherVisas" value={v}
            checked={data.hasOtherVisas===v} onChange={()=>onChange('hasOtherVisas',v)}/> {v}</label>))}
        </div>
        {data.hasOtherVisas==='Yes'&&(
          <div className="conditional-fields">
            <div className="form-row"><label>Details (country, type, number)</label>
              <textarea value={data.otherVisasDetails||''} onChange={e=>onChange('otherVisasDetails',e.target.value)} rows={3}/></div>
          </div>
        )}
      </fieldset>

      <fieldset>
        <legend>7.4 Traveled to other countries in past 12 months?</legend>
        <div className="radio-group">
          {['Yes','No'].map(v=>(<label key={v}><input type="radio" name="traveledRecently" value={v}
            checked={data.traveledRecently===v} onChange={()=>onChange('traveledRecently',v)}/> {v}</label>))}
        </div>
        {data.traveledRecently==='Yes'&&(
          <div className="conditional-fields">
            <div className="form-row"><label>Countries visited</label>
              <textarea value={data.recentTravelCountries||''} onChange={e=>onChange('recentTravelCountries',e.target.value)} rows={2} placeholder="e.g. Japan, South Korea"/></div>
          </div>
        )}
      </fieldset>
    </div>
  );
}
