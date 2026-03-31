interface Props {
  data: Record<string, any>;
  onChange: (field: string, value: any) => void;
}

export default function Section2({ data, onChange }: Props) {
  return (
    <div className="section-form">
      <h3>Section 2: Type of Visa</h3>

      <fieldset>
        <legend>2.1 Visa Type</legend>
        <div className="form-row">
          <label className="required">Type of visa you are applying for</label>
          <select value={data.visaType || '(M) Commercial and trade activities'}
            onChange={e => onChange('visaType', e.target.value)}>
            <option value="(M) Commercial and trade activities">(M) Commercial and trade activities</option>
            <option value="(L) Tourism">(L) Tourism</option>
            <option value="(G) Transit">(G) Transit</option>
            <option value="(F) Exchanges, visits">(F) Exchanges, visits</option>
            <option value="(Z) Work">(Z) Work</option>
          </select>
        </div>
      </fieldset>

      <fieldset>
        <legend>2.2 Service Type</legend>
        <div className="radio-group">
          {['Normal', 'Express'].map(t => (
            <label key={t}>
              <input type="radio" name="serviceType" value={t}
                checked={data.serviceType === t} onChange={() => onChange('serviceType', t)} /> {t}
              {t === 'Express' && <span className="hint"> (additional fee, non-refundable)</span>}
            </label>
          ))}
        </div>
      </fieldset>

      <fieldset>
        <legend>2.3 Visa Application Information</legend>
        <div className="form-row">
          <label>Visa validity (months)</label>
          <input type="number" min={1} max={120} value={data.validityMonths || ''}
            onChange={e => onChange('validityMonths', e.target.value)} />
        </div>
        <div className="form-row">
          <label>Maximum duration of stay (days)</label>
          <input type="number" min={1} max={180} value={data.stayDays || ''}
            onChange={e => onChange('stayDays', e.target.value)} />
        </div>
        <div className="form-row">
          <label>Entries</label>
          <div className="radio-group">
            {['Single', 'Double', 'Multiple'].map(e => (
              <label key={e}>
                <input type="radio" name="entries" value={e}
                  checked={data.entries === e} onChange={() => onChange('entries', e)} /> {e}
              </label>
            ))}
          </div>
        </div>
        <p className="note">Note: Actual visa parameters are determined by the consular officer.</p>
      </fieldset>
    </div>
  );
}
