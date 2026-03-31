import { useState } from 'react';

const OCCUPATIONS = [
  'Businessperson','Company employee','Entertainer','Industrial & agricultural worker',
  'Student','Government official','Military personnel','NGO staff','Religious personnel',
  'Media representative','Crew member','Self-employed','Unemployed','Retired','Academic','Other'
];

interface WorkEntry {
  dateFrom: string; dateTo: string;
  employerName: string; employerAddress: string; employerPhone: string;
  supervisorName: string; supervisorPhone: string;
  position: string; duty: string;
}
const emptyWork = (): WorkEntry => ({
  dateFrom:'',dateTo:'',employerName:'',employerAddress:'',employerPhone:'',
  supervisorName:'',supervisorPhone:'',position:'',duty:''
});

interface Props {
  data: Record<string, any>;
  onChange: (field: string, value: any) => void;
}

export default function Section3({ data, onChange }: Props) {
  const [workHistory, setWorkHistory] = useState<WorkEntry[]>(
    data.workHistory || [emptyWork()]
  );

  const updateWork = (idx: number, field: keyof WorkEntry, value: string) => {
    const updated = [...workHistory];
    updated[idx] = { ...updated[idx], [field]: value };
    setWorkHistory(updated);
    onChange('workHistory', updated);
  };

  const addWork = () => { const w = [...workHistory, emptyWork()]; setWorkHistory(w); onChange('workHistory', w); };
  const removeWork = (i: number) => { const w = workHistory.filter((_,idx)=>idx!==i); setWorkHistory(w); onChange('workHistory', w); };

  return (
    <div className="section-form">
      <h3>Section 3: Work Information</h3>

      <fieldset>
        <legend>3.1 Current Occupation</legend>
        <div className="form-row">
          <label className="required">Occupation</label>
          <select value={data.currentOccupation||''} onChange={e=>onChange('currentOccupation',e.target.value)}>
            <option value="">Select</option>
            {OCCUPATIONS.map(o=><option key={o} value={o}>{o}</option>)}
          </select>
        </div>
        {data.currentOccupation==='Other'&&(
          <div className="form-row">
            <label>Please specify</label>
            <input value={data.occupationOther||''} onChange={e=>onChange('occupationOther',e.target.value)}/>
          </div>
        )}
      </fieldset>

      <fieldset>
        <legend>3.2 Work Experience (Past 5 Years)</legend>
        {workHistory.map((w, i) => (
          <div key={i} className="repeatable-item">
            <div className="repeatable-header">
              <strong>Entry {i + 1}</strong>
              {workHistory.length > 1 && <button type="button" className="btn-remove" onClick={() => removeWork(i)}>Remove</button>}
            </div>
            <div className="form-row-pair">
              <div className="form-row">
                <label className="required">Date From</label>
                <input type="text" placeholder="YYYY-MM" value={w.dateFrom} onChange={e=>updateWork(i,'dateFrom',e.target.value)}/>
              </div>
              <div className="form-row">
                <label className="required">Date To</label>
                <input type="text" placeholder="YYYY-MM" value={w.dateTo} onChange={e=>updateWork(i,'dateTo',e.target.value)}/>
              </div>
            </div>
            <div className="form-row">
              <label className="required">Employer Name (full name)</label>
              <input value={w.employerName} onChange={e=>updateWork(i,'employerName',e.target.value)}/>
            </div>
            <div className="form-row">
              <label className="required">Employer Address</label>
              <input value={w.employerAddress} onChange={e=>updateWork(i,'employerAddress',e.target.value)}/>
            </div>
            <div className="form-row">
              <label className="required">Employer Phone</label>
              <input value={w.employerPhone} onChange={e=>updateWork(i,'employerPhone',e.target.value)}/>
            </div>
            <div className="form-row-pair">
              <div className="form-row">
                <label className="required">Supervisor Name</label>
                <input value={w.supervisorName} onChange={e=>updateWork(i,'supervisorName',e.target.value)}/>
              </div>
              <div className="form-row">
                <label className="required">Supervisor Phone</label>
                <input value={w.supervisorPhone} onChange={e=>updateWork(i,'supervisorPhone',e.target.value)}/>
              </div>
            </div>
            <div className="form-row-pair">
              <div className="form-row">
                <label className="required">Position</label>
                <input value={w.position} onChange={e=>updateWork(i,'position',e.target.value)}/>
              </div>
              <div className="form-row">
                <label className="required">Duty</label>
                <input value={w.duty} onChange={e=>updateWork(i,'duty',e.target.value)}/>
              </div>
            </div>
          </div>
        ))}
        <button type="button" className="btn-add" onClick={addWork}>+ Add Work Experience</button>
      </fieldset>
    </div>
  );
}
