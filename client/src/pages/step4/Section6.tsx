import { useState } from 'react';
import { useI18n } from '../../i18n/I18nContext';

interface ItineraryEntry {
  arrivalDate:string; flightNo:string; destCity:string; stayCity:string;
  stayAddress:string; stayArrival:string; stayDeparture:string;
}
const emptyItinerary = (): ItineraryEntry => ({
  arrivalDate:'',flightNo:'',destCity:'',stayCity:'',stayAddress:'',stayArrival:'',stayDeparture:''
});

interface Props { data: Record<string, any>; onChange: (field: string, value: any) => void; }

export default function Section6({ data, onChange }: Props) {
  const { t } = useI18n();
  const [itinerary, setItinerary] = useState<ItineraryEntry[]>(data.itinerary || [emptyItinerary()]);
  const updateIt = (idx: number, field: keyof ItineraryEntry, value: string) => {
    const u = [...itinerary]; u[idx] = {...u[idx],[field]:value}; setItinerary(u); onChange('itinerary',u);
  };
  const addIt = () => { const it=[...itinerary,emptyItinerary()]; setItinerary(it); onChange('itinerary',it); };
  const removeIt = (i:number) => { const it=itinerary.filter((_,idx)=>idx!==i); setItinerary(it); onChange('itinerary',it); };

  return (
    <div className="section-form">
      <h3>{t('s6.title')}</h3>
      <fieldset>
        <legend>{t('s6.itinerary')}</legend>
        {itinerary.map((it,i)=>(
          <div key={i} className="repeatable-item">
            <div className="repeatable-header"><strong>{t('s6.leg')} {i+1}</strong>
              {itinerary.length>1&&<button type="button" className="btn-remove" onClick={()=>removeIt(i)}>{t('s.remove')}</button>}</div>
            <div className="form-row-pair">
              <div className="form-row"><label className="required">{t('s6.arrivalDate')}</label><input type="date" value={it.arrivalDate} onChange={e=>updateIt(i,'arrivalDate',e.target.value)}/></div>
              <div className="form-row"><label>{t('s6.flightNo')}</label><input value={it.flightNo} onChange={e=>updateIt(i,'flightNo',e.target.value)}/></div>
            </div>
            <div className="form-row-pair">
              <div className="form-row"><label className="required">{t('s6.destCity')}</label><input value={it.destCity} onChange={e=>updateIt(i,'destCity',e.target.value)}/></div>
              <div className="form-row"><label className="required">{t('s6.stayCity')}</label><input value={it.stayCity} onChange={e=>updateIt(i,'stayCity',e.target.value)}/></div>
            </div>
            <div className="form-row"><label className="required">{t('s6.stayAddress')}</label><input value={it.stayAddress} onChange={e=>updateIt(i,'stayAddress',e.target.value)}/></div>
            <div className="form-row-pair">
              <div className="form-row"><label className="required">{t('s6.from')}</label><input type="date" value={it.stayArrival} onChange={e=>updateIt(i,'stayArrival',e.target.value)}/></div>
              <div className="form-row"><label className="required">{t('s6.until')}</label><input type="date" value={it.stayDeparture} onChange={e=>updateIt(i,'stayDeparture',e.target.value)}/></div>
            </div>
          </div>
        ))}
        <button type="button" className="btn-add" onClick={addIt}>{t('s6.addLeg')}</button>
      </fieldset>

      <fieldset>
        <legend>{t('s6.departure')}</legend>
        <div className="form-row"><label className="required">{t('s6.departureDate')}</label><input type="date" value={data.departureDate||''} onChange={e=>onChange('departureDate',e.target.value)}/></div>
        <div className="form-row"><label>{t('s6.departureFlightNo')}</label><input value={data.departureFlightNo||''} onChange={e=>onChange('departureFlightNo',e.target.value)}/></div>
        <div className="form-row"><label className="required">{t('s6.departureCity')}</label><input value={data.departureCity||''} onChange={e=>onChange('departureCity',e.target.value)}/></div>
      </fieldset>

      <fieldset>
        <legend>{t('s6.inviter')}</legend>
        <div className="form-row"><label className="required">{t('s6.inviterName')}</label><input value={data.inviterName||''} onChange={e=>onChange('inviterName',e.target.value)}/></div>
        <div className="form-row"><label className="required">{t('s6.inviterRelation')}</label><input value={data.inviterRelation||''} onChange={e=>onChange('inviterRelation',e.target.value)}/></div>
        <div className="form-row"><label className="required">{t('s6.inviterPhone')}</label><input value={data.inviterPhone||''} onChange={e=>onChange('inviterPhone',e.target.value)}/></div>
        <div className="form-row"><label>{t('s6.inviterEmail')}</label><input value={data.inviterEmail||''} onChange={e=>onChange('inviterEmail',e.target.value)}/></div>
        <div className="form-row"><label className="required">{t('s6.inviterAddress')}</label><input value={data.inviterAddress||''} onChange={e=>onChange('inviterAddress',e.target.value)}/></div>
      </fieldset>

      <fieldset>
        <legend>{t('s6.emergency')}</legend>
        <div className="form-row-pair">
          <div className="form-row"><label className="required">{t('s6.emergencyFamilyName')}</label><input value={data.emergencyFamilyName||''} onChange={e=>onChange('emergencyFamilyName',e.target.value)}/></div>
          <div className="form-row"><label className="required">{t('s6.emergencyGivenName')}</label><input value={data.emergencyGivenName||''} onChange={e=>onChange('emergencyGivenName',e.target.value)}/></div>
        </div>
        <div className="form-row"><label className="required">{t('s6.emergencyRelation')}</label><input value={data.emergencyRelation||''} onChange={e=>onChange('emergencyRelation',e.target.value)}/></div>
        <div className="form-row"><label className="required">{t('s6.emergencyPhone')}</label><input value={data.emergencyPhone||''} onChange={e=>onChange('emergencyPhone',e.target.value)}/></div>
        <div className="form-row"><label>{t('s6.emergencyEmail')}</label><input value={data.emergencyEmail||''} onChange={e=>onChange('emergencyEmail',e.target.value)}/></div>
      </fieldset>

      <fieldset>
        <legend>{t('s6.whoPays')}</legend>
        <div className="radio-group">
          {[{v:'Self',l:t('s6.paySelf')},{v:'Other',l:t('s6.payOther')},{v:'Organization',l:t('s6.payOrg')}].map(wp=>(<label key={wp.v}><input type="radio" name="whoPays" value={wp.v}
            checked={data.whoPays===wp.v} onChange={()=>onChange('whoPays',wp.v)}/> {wp.l}</label>))}
        </div>
        {data.whoPays==='Other'&&(
          <div className="conditional-fields">
            <div className="form-row"><label>{t('s6.payerName')}</label><input value={data.payerName||''} onChange={e=>onChange('payerName',e.target.value)}/></div>
            <div className="form-row"><label>{t('s6.payerRelation')}</label><input value={data.payerRelation||''} onChange={e=>onChange('payerRelation',e.target.value)}/></div>
            <div className="form-row"><label>{t('s6.payerPhone')}</label><input value={data.payerPhone||''} onChange={e=>onChange('payerPhone',e.target.value)}/></div>
          </div>
        )}
        {data.whoPays==='Organization'&&(
          <div className="conditional-fields">
            <div className="form-row"><label>{t('s6.payerOrgName')}</label><input value={data.payerOrgName||''} onChange={e=>onChange('payerOrgName',e.target.value)}/></div>
            <div className="form-row"><label>{t('s6.payerOrgPhone')}</label><input value={data.payerOrgPhone||''} onChange={e=>onChange('payerOrgPhone',e.target.value)}/></div>
          </div>
        )}
      </fieldset>

      <fieldset>
        <legend>{t('s6.samePassport')}</legend>
        <div className="radio-group">
          {['Yes','No'].map(v=>(<label key={v}><input type="radio" name="samePassport" value={v}
            checked={data.samePassportCompanion===v} onChange={()=>onChange('samePassportCompanion',v)}/> {v === 'Yes' ? t('s.yes') : t('s.no')}</label>))}
        </div>
      </fieldset>
    </div>
  );
}
