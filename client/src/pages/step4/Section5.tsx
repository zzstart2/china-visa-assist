import { useState } from 'react';

const COUNTRIES = [
  'Philippines','China','United States','Japan','South Korea','Singapore',
  'Malaysia','Indonesia','Thailand','Vietnam','India','United Kingdom',
  'Australia','Canada','Germany','France'
];

interface ChildEntry { familyName:string; givenName:string; nationality:string; occupation:string; dob:string; }
const emptyChild = (): ChildEntry => ({familyName:'',givenName:'',nationality:'',occupation:'',dob:''});

interface Props {
  data: Record<string, any>;
  onChange: (field: string, value: any) => void;
}

export default function Section5({ data, onChange }: Props) {
  const [children, setChildren] = useState<ChildEntry[]>(data.children || []);
  const [childNA, setChildNA] = useState(data.childrenNA || false);
  const [fatherNA, setFatherNA] = useState(data.fatherNA || false);
  const [motherNA, setMotherNA] = useState(data.motherNA || false);
  const isMarried = data.maritalStatus === 'Married';

  const updateChild = (idx: number, field: keyof ChildEntry, value: string) => {
    const updated = [...children]; updated[idx] = {...updated[idx],[field]:value};
    setChildren(updated); onChange('children', updated);
  };
  const addChild = () => { const c=[...children,emptyChild()]; setChildren(c); onChange('children',c); };
  const removeChild = (i:number) => { const c=children.filter((_,idx)=>idx!==i); setChildren(c); onChange('children',c); };

  return (
    <div className="section-form">
      <h3>Section 5: Family Information</h3>

      <fieldset>
        <legend>Contact Information</legend>
        <div className="form-row">
          <label className="required">Current Home Address</label>
          <input value={data.homeAddress||''} onChange={e=>onChange('homeAddress',e.target.value)}/>
        </div>
        <div className="form-row">
          <label className="required">Phone Number</label>
          <input value={data.phoneNumber||''} onChange={e=>onChange('phoneNumber',e.target.value)}/>
        </div>
        <div className="form-row">
          <label className="required">Mobile Phone Number</label>
          <input value={data.mobilePhone||''} onChange={e=>onChange('mobilePhone',e.target.value)}/>
        </div>
        <div className="form-row">
          <label>Email</label>
          <input type="email" value={data.email||''} onChange={e=>onChange('email',e.target.value)}/>
        </div>
      </fieldset>

      {isMarried && (
        <fieldset>
          <legend>5.5A Spouse</legend>
          <div className="form-row-pair">
            <div className="form-row">
              <label>Family Name</label>
              <input value={data.spouseFamilyName||''} onChange={e=>onChange('spouseFamilyName',e.target.value)}/>
            </div>
            <div className="form-row">
              <label>Given Name</label>
              <input value={data.spouseGivenName||''} onChange={e=>onChange('spouseGivenName',e.target.value)}/>
            </div>
          </div>
          <div className="form-row">
            <label>Nationality</label>
            <select value={data.spouseNationality||''} onChange={e=>onChange('spouseNationality',e.target.value)}>
              <option value="">Select</option>
              {COUNTRIES.map(c=><option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div className="form-row">
            <label>Date of Birth</label>
            <input type="text" placeholder="YYYY-MM-DD" value={data.spouseDob||''} onChange={e=>onChange('spouseDob',e.target.value)}/>
          </div>
          <div className="form-row">
            <label>Is your spouse in China?</label>
            <div className="radio-group">
              {['Yes','No'].map(v=>(<label key={v}><input type="radio" name="spouseInChina" value={v}
                checked={data.spouseInChina===v} onChange={()=>onChange('spouseInChina',v)}/> {v}</label>))}
            </div>
          </div>
        </fieldset>
      )}

      <fieldset>
        <legend>5.5B Father</legend>
        <label className="na-check"><input type="checkbox" checked={fatherNA}
          onChange={e=>{setFatherNA(e.target.checked);onChange('fatherNA',e.target.checked);}}/> Not applicable</label>
        {!fatherNA && (<>
          <div className="form-row-pair">
            <div className="form-row"><label>Family Name</label><input value={data.fatherFamilyName||''} onChange={e=>onChange('fatherFamilyName',e.target.value)}/></div>
            <div className="form-row"><label>Given Name</label><input value={data.fatherGivenName||''} onChange={e=>onChange('fatherGivenName',e.target.value)}/></div>
          </div>
          <div className="form-row"><label>Nationality</label>
            <select value={data.fatherNationality||''} onChange={e=>onChange('fatherNationality',e.target.value)}>
              <option value="">Select</option>{COUNTRIES.map(c=><option key={c} value={c}>{c}</option>)}</select></div>
          <div className="form-row"><label>Is your father in China?</label>
            <div className="radio-group">{['Yes','No'].map(v=>(<label key={v}><input type="radio" name="fatherInChina" value={v}
              checked={data.fatherInChina===v} onChange={()=>onChange('fatherInChina',v)}/> {v}</label>))}</div></div>
        </>)}
      </fieldset>

      <fieldset>
        <legend>5.5C Mother</legend>
        <label className="na-check"><input type="checkbox" checked={motherNA}
          onChange={e=>{setMotherNA(e.target.checked);onChange('motherNA',e.target.checked);}}/> Not applicable</label>
        {!motherNA && (<>
          <div className="form-row-pair">
            <div className="form-row"><label>Family Name</label><input value={data.motherFamilyName||''} onChange={e=>onChange('motherFamilyName',e.target.value)}/></div>
            <div className="form-row"><label>Given Name</label><input value={data.motherGivenName||''} onChange={e=>onChange('motherGivenName',e.target.value)}/></div>
          </div>
          <div className="form-row"><label>Nationality</label>
            <select value={data.motherNationality||''} onChange={e=>onChange('motherNationality',e.target.value)}>
              <option value="">Select</option>{COUNTRIES.map(c=><option key={c} value={c}>{c}</option>)}</select></div>
          <div className="form-row"><label>Is your mother in China?</label>
            <div className="radio-group">{['Yes','No'].map(v=>(<label key={v}><input type="radio" name="motherInChina" value={v}
              checked={data.motherInChina===v} onChange={()=>onChange('motherInChina',v)}/> {v}</label>))}</div></div>
        </>)}
      </fieldset>

      <fieldset>
        <legend>5.5D Children</legend>
        <label className="na-check"><input type="checkbox" checked={childNA}
          onChange={e=>{setChildNA(e.target.checked);onChange('childrenNA',e.target.checked);}}/> Not applicable</label>
        {!childNA && (<>
          {children.map((ch,i)=>(
            <div key={i} className="repeatable-item">
              <div className="repeatable-header"><strong>Child {i+1}</strong>
                <button type="button" className="btn-remove" onClick={()=>removeChild(i)}>Remove</button></div>
              <div className="form-row-pair">
                <div className="form-row"><label>Family Name</label><input value={ch.familyName} onChange={e=>updateChild(i,'familyName',e.target.value)}/></div>
                <div className="form-row"><label>Given Name</label><input value={ch.givenName} onChange={e=>updateChild(i,'givenName',e.target.value)}/></div>
              </div>
              <div className="form-row"><label>Nationality</label>
                <select value={ch.nationality} onChange={e=>updateChild(i,'nationality',e.target.value)}>
                  <option value="">Select</option>{COUNTRIES.map(c=><option key={c} value={c}>{c}</option>)}</select></div>
              <div className="form-row"><label>Date of Birth</label><input placeholder="YYYY-MM-DD" value={ch.dob} onChange={e=>updateChild(i,'dob',e.target.value)}/></div>
            </div>
          ))}
          <button type="button" className="btn-add" onClick={addChild}>+ Add Child</button>
        </>)}
      </fieldset>

      <fieldset>
        <legend>5.5E Other Relatives in China</legend>
        <div className="form-row">
          <label>Do you have immediate relatives (excluding parents) in China?</label>
          <div className="radio-group">
            {['Yes','No'].map(v=>(<label key={v}><input type="radio" name="otherRelChina" value={v}
              checked={data.hasOtherRelativesInChina===v} onChange={()=>onChange('hasOtherRelativesInChina',v)}/> {v}</label>))}
          </div>
          {data.hasOtherRelativesInChina==='Yes'&&(
            <div className="conditional-fields">
              <div className="form-row"><label>Details</label>
                <textarea value={data.otherRelativesDetails||''} onChange={e=>onChange('otherRelativesDetails',e.target.value)} rows={3}/></div>
            </div>
          )}
        </div>
      </fieldset>
    </div>
  );
}
