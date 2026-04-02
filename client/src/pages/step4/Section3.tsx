import { useState } from 'react';
import { useI18n } from '../../i18n/I18nContext';

const OCCUPATIONS = [
  'Businessperson','Company employee','Entertainer','Industrial & agricultural worker',
  'Student','Member of parliament','Government official','Military personnel','NGO staff',
  'Religious personnel','Media representative','Crew member','Self-employed','Unemployed',
  'Retired','Academic','Other'
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
  const { t } = useI18n();
  const [workHistory, setWorkHistory] = useState<WorkEntry[]>(
    data.workHistory || [emptyWork()]
  );

  const OCCUPATION_KEYS: Record<string, string> = {
    'Businessperson': 's3.occBusinessperson', 'Company employee': 's3.occEmployee',
    'Entertainer': 's3.occEntertainer', 'Industrial & agricultural worker': 's3.occWorker',
    'Student': 's3.occStudent', 'Member of parliament': 's3.occParliament',
    'Government official': 's3.occGovernment',
    'Military personnel': 's3.occMilitary', 'NGO staff': 's3.occNgo',
    'Religious personnel': 's3.occReligious', 'Media representative': 's3.occMedia',
    'Crew member': 's3.occCrew', 'Self-employed': 's3.occSelfEmployed',
    'Unemployed': 's3.occUnemployed', 'Retired': 's3.occRetired',
    'Academic': 's3.occAcademic', 'Other': 's3.occOther'
  };

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
      <h3>{t('s3.title')}</h3>

      <fieldset>
        <legend>{t('s3.occupation')}</legend>
        <div className="form-row">
          <label className="required">{t('s3.occupationLabel')}</label>
          <select value={data.currentOccupation||''} onChange={e=>onChange('currentOccupation',e.target.value)}>
            <option value="">{t('s.select')}</option>
            {OCCUPATIONS.map(o=><option key={o} value={o}>{t(OCCUPATION_KEYS[o])}</option>)}
          </select>
        </div>
        {data.currentOccupation==='Other'&&(
          <div className="form-row">
            <label>{t('s3.pleaseSpecify')}</label>
            <input value={data.occupationOther||''} onChange={e=>onChange('occupationOther',e.target.value)}/>
          </div>
        )}
      </fieldset>

      <fieldset>
        <legend>{t('s3.workExp')}</legend>
        {workHistory.map((w, i) => (
          <div key={i} className="repeatable-item">
            <div className="repeatable-header">
              <strong>{t('s3.entry')} {i + 1}</strong>
              {workHistory.length > 1 && <button type="button" className="btn-remove" onClick={() => removeWork(i)}>{t('s.remove')}</button>}
            </div>
            <div className="form-row-pair">
              <div className="form-row">
                <label className="required">{t('s3.dateFrom')}</label>
                <input type="text" placeholder="YYYY-MM" value={w.dateFrom} onChange={e=>updateWork(i,'dateFrom',e.target.value)}/>
              </div>
              <div className="form-row">
                <label className="required">{t('s3.dateTo')}</label>
                <input type="text" placeholder="YYYY-MM" value={w.dateTo} onChange={e=>updateWork(i,'dateTo',e.target.value)}/>
              </div>
            </div>
            <div className="form-row">
              <label className="required">{t('s3.employerName')}</label>
              <input value={w.employerName} onChange={e=>updateWork(i,'employerName',e.target.value)}/>
            </div>
            <div className="form-row">
              <label className="required">{t('s3.employerAddress')}</label>
              <input value={w.employerAddress} onChange={e=>updateWork(i,'employerAddress',e.target.value)}/>
            </div>
            <div className="form-row">
              <label className="required">{t('s3.employerPhone')}</label>
              <input value={w.employerPhone} onChange={e=>updateWork(i,'employerPhone',e.target.value)}/>
            </div>
            <div className="form-row-pair">
              <div className="form-row">
                <label className="required">{t('s3.supervisorName')}</label>
                <input value={w.supervisorName} onChange={e=>updateWork(i,'supervisorName',e.target.value)}/>
              </div>
              <div className="form-row">
                <label className="required">{t('s3.supervisorPhone')}</label>
                <input value={w.supervisorPhone} onChange={e=>updateWork(i,'supervisorPhone',e.target.value)}/>
              </div>
            </div>
            <div className="form-row-pair">
              <div className="form-row">
                <label className="required">{t('s3.position')}</label>
                <input value={w.position} onChange={e=>updateWork(i,'position',e.target.value)}/>
              </div>
              <div className="form-row">
                <label className="required">{t('s3.duty')}</label>
                <input value={w.duty} onChange={e=>updateWork(i,'duty',e.target.value)}/>
              </div>
            </div>
          </div>
        ))}
        <button type="button" className="btn-add" onClick={addWork}>{t('s3.addWork')}</button>
      </fieldset>
    </div>
  );
}
