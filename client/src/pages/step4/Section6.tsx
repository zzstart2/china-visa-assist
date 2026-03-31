import { useState } from 'react';

interface ItineraryEntry {
  arrivalDate:string; flightNo:string; destCity:string; stayCity:string;
  stayAddress:string; stayArrival:string; stayDeparture:string;
}
const emptyItinerary = (): ItineraryEntry => ({
  arrivalDate:'',flightNo:'',destCity:'',stayCity:'',stayAddress:'',stayArrival:'',stayDeparture:''
});

interface Props { data: Record<string, any>; onChange: (field: string, value: any) => void; }

export default function Section6({ data, onChange }: Props) {
  const [itinerary, setItinerary] = useState<ItineraryEntry[]>(data.itinerary || [emptyItinerary()]);
  const updateIt = (idx: number, field: keyof ItineraryEntry, value: string) => {
    const u = [...itinerary]; u[idx] = {...u[idx],[field]:value}; setItinerary(u); onChange('itinerary',u);
  };
  const addIt = () => { const it=[...itinerary,emptyItinerary()]; setItinerary(it); onChange('itinerary',it); };
  const removeIt = (i:number) => { const it=itinerary.filter((_,idx)=>idx!==i); setItinerary(it); onChange('itinerary',it); };

  return (
    <div className="section-form">
      <h3>Section 6: Information on Your Travel</h3>
      <fieldset>
        <legend>6.1 Itinerary</legend>
        {itinerary.map((it,i)=>(
          <div key={i} className="repeatable-item">
            <div className="repeatable-header"><strong>Leg {i+1}</strong>
              {itinerary.length>1&&<button type="button" className="btn-remove" onClick={()=>removeIt(i)}>Remove</button>}</div>
            <div className="form-row-pair">
              <div className="form-row"><label className="required">Arrival Date</label><input type="date" value={it.arrivalDate} onChange={e=>updateIt(i,'arrivalDate',e.target.value)}/></div>
              <div className="form-row"><label>Flight No.</label><input value={it.flightNo} onChange={e=>updateIt(i,'flightNo',e.target.value)}/></div>
            </div>
            <div className="form-row-pair">
              <div className="form-row"><label className="required">Destination City</label><input value={it.destCity} onChange={e=>updateIt(i,'destCity',e.target.value)}/></div>
              <div className="form-row"><label className="required">City to Stay</label><input value={it.stayCity} onChange={e=>updateIt(i,'stayCity',e.target.value)}/></div>
            </div>
            <div className="form-row"><label className="required">Address to Stay</label><input value={it.stayAddress} onChange={e=>updateIt(i,'stayAddress',e.target.value)}/></div>
            <div className="form-row-pair">
              <div className="form-row"><label className="required">From</label><input type="date" value={it.stayArrival} onChange={e=>updateIt(i,'stayArrival',e.target.value)}/></div>
              <div className="form-row"><label className="required">Until</label><input type="date" value={it.stayDeparture} onChange={e=>updateIt(i,'stayDeparture',e.target.value)}/></div>
            </div>
          </div>
        ))}
        <button type="button" className="btn-add" onClick={addIt}>+ Add Leg</button>
      </fieldset>

      <fieldset>
        <legend>6.1 Departure</legend>
        <div className="form-row"><label className="required">Departure Date</label><input type="date" value={data.departureDate||''} onChange={e=>onChange('departureDate',e.target.value)}/></div>
        <div className="form-row"><label>Departure Flight No.</label><input value={data.departureFlightNo||''} onChange={e=>onChange('departureFlightNo',e.target.value)}/></div>
        <div className="form-row"><label className="required">City of Departure</label><input value={data.departureCity||''} onChange={e=>onChange('departureCity',e.target.value)}/></div>
      </fieldset>

      <fieldset>
        <legend>6.2 Inviting Organization in China</legend>
        <div className="form-row"><label className="required">Name</label><input value={data.inviterName||''} onChange={e=>onChange('inviterName',e.target.value)}/></div>
        <div className="form-row"><label className="required">Relationship</label><input value={data.inviterRelation||''} onChange={e=>onChange('inviterRelation',e.target.value)}/></div>
        <div className="form-row"><label className="required">Phone</label><input value={data.inviterPhone||''} onChange={e=>onChange('inviterPhone',e.target.value)}/></div>
        <div className="form-row"><label>Email</label><input value={data.inviterEmail||''} onChange={e=>onChange('inviterEmail',e.target.value)}/></div>
        <div className="form-row"><label className="required">Address</label><input value={data.inviterAddress||''} onChange={e=>onChange('inviterAddress',e.target.value)}/></div>
      </fieldset>

      <fieldset>
        <legend>6.3 Emergency Contact</legend>
        <div className="form-row-pair">
          <div className="form-row"><label className="required">Family Name</label><input value={data.emergencyFamilyName||''} onChange={e=>onChange('emergencyFamilyName',e.target.value)}/></div>
          <div className="form-row"><label className="required">Given Name</label><input value={data.emergencyGivenName||''} onChange={e=>onChange('emergencyGivenName',e.target.value)}/></div>
        </div>
        <div className="form-row"><label className="required">Relationship</label><input value={data.emergencyRelation||''} onChange={e=>onChange('emergencyRelation',e.target.value)}/></div>
        <div className="form-row"><label className="required">Phone</label><input value={data.emergencyPhone||''} onChange={e=>onChange('emergencyPhone',e.target.value)}/></div>
        <div className="form-row"><label>Email</label><input value={data.emergencyEmail||''} onChange={e=>onChange('emergencyEmail',e.target.value)}/></div>
      </fieldset>

      <fieldset>
        <legend>6.4 Who Will Pay for This Travel?</legend>
        <div className="radio-group">
          {['Self','Other','Organization'].map(v=>(<label key={v}><input type="radio" name="whoPays" value={v}
            checked={data.whoPays===v} onChange={()=>onChange('whoPays',v)}/> {v}</label>))}
        </div>
        {data.whoPays==='Other'&&(
          <div className="conditional-fields">
            <div className="form-row"><label>Name</label><input value={data.payerName||''} onChange={e=>onChange('payerName',e.target.value)}/></div>
            <div className="form-row"><label>Relationship</label><input value={data.payerRelation||''} onChange={e=>onChange('payerRelation',e.target.value)}/></div>
            <div className="form-row"><label>Phone</label><input value={data.payerPhone||''} onChange={e=>onChange('payerPhone',e.target.value)}/></div>
          </div>
        )}
        {data.whoPays==='Organization'&&(
          <div className="conditional-fields">
            <div className="form-row"><label>Organization Name</label><input value={data.payerOrgName||''} onChange={e=>onChange('payerOrgName',e.target.value)}/></div>
            <div className="form-row"><label>Phone</label><input value={data.payerOrgPhone||''} onChange={e=>onChange('payerOrgPhone',e.target.value)}/></div>
          </div>
        )}
      </fieldset>

      <fieldset>
        <legend>6.5 Same Passport Companion</legend>
        <div className="radio-group">
          {['Yes','No'].map(v=>(<label key={v}><input type="radio" name="samePassport" value={v}
            checked={data.samePassportCompanion===v} onChange={()=>onChange('samePassportCompanion',v)}/> {v}</label>))}
        </div>
      </fieldset>
    </div>
  );
}
