interface Props { data: Record<string, any>; onChange: (field: string, value: any) => void; }

const QUESTIONS = [
  { key:'refusedEntry', text:'8.1 Have you ever been refused a Chinese visa or denied entry into China?' },
  { key:'visaCanceled', text:'8.2 Has your Chinese visa ever been canceled?' },
  { key:'illegalEntry', text:'8.3 Have you ever entered China illegally, overstayed, or worked illegally?' },
  { key:'criminalRecord', text:'8.4 Do you have any criminal record in China or any other country?' },
  { key:'mentalDisease', text:'8.5 Do you have any serious mental disorders or infectious diseases?' },
  { key:'epidemicArea', text:'8.6 Have you visited epidemic areas in the past 30 days?' },
  { key:'specialSkills', text:'8.7 Have you been trained in firearms, explosives, nuclear/biological/chemical?' },
  { key:'military', text:'8.8 Are you serving or have you ever served in the military?' },
  { key:'paramilitary', text:'8.9 Have you participated in any paramilitary/rebel organization?' },
  { key:'charitableOrg', text:'8.10 Have you worked for professional/social/charitable organizations?' },
  { key:'otherDeclare', text:'8.11 Is there anything else you want to declare?' },
];

export default function Section8({ data, onChange }: Props) {
  return (
    <div className="section-form">
      <h3>Section 8: Other Information</h3>
      {QUESTIONS.map(q => (
        <fieldset key={q.key}>
          <legend>{q.text}</legend>
          <div className="radio-group">
            {['Yes','No'].map(v=>(<label key={v}><input type="radio" name={q.key} value={v}
              checked={data[q.key]===v} onChange={()=>onChange(q.key,v)}/> {v}</label>))}
          </div>
          {data[q.key]==='Yes'&&(
            <div className="conditional-fields">
              <div className="form-row"><label>Please explain</label>
                <textarea value={data[q.key+'Details']||''} onChange={e=>onChange(q.key+'Details',e.target.value)} rows={3}/></div>
            </div>
          )}
        </fieldset>
      ))}
    </div>
  );
}
