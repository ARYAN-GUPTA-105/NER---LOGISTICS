import { useState } from 'react';
import type { FormEvent } from 'react';
import { ArrowLeft, Camera, CheckCircle2, LocateFixed, MapPinned, Radio, WifiOff } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useDriver } from '../DriverContext';
import type { AlertSeverity } from '../types';

const incidentTypes = ['Blocked road', 'Road damage', 'Flooding', 'Landslide', 'Accident', 'Bridge issue', 'Traffic obstruction', 'Other disruption'];

export const ReportScreen = () => {
  const { requestLocation, store, submitReport } = useDriver();
  const navigate = useNavigate();
  const [type, setType] = useState('');
  const [severity, setSeverity] = useState<AlertSeverity>('warning');
  const [description, setDescription] = useState('');
  const [locationLabel, setLocationLabel] = useState('Current location will be attached if available');
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');
  const attachLocation = async () => { await requestLocation(); };
  const submit = (event: FormEvent) => { event.preventDefault(); if (!type) { setError('Choose the type of incident before submitting.'); return; } submitReport({ type, severity, description, locationLabel: store.location.coordinates ? `${store.location.coordinates.latitude.toFixed(5)}, ${store.location.coordinates.longitude.toFixed(5)}` : locationLabel }); setSubmitted(true); };
  if (submitted) return <div className="screen-stack"><button className="back-link" type="button" onClick={() => navigate('/driver')}><ArrowLeft size={17} /> Back to home</button><section className="report-success card"><div className="success-icon"><CheckCircle2 size={31} /></div><p className="eyebrow">Incident report saved</p><h1>{store.isOnline ? 'Report recorded locally' : 'Report queued locally'}</h1><p>{store.isOnline ? 'No production backend is connected in this development build. Your report remains in local device storage and appears under Profile.' : 'The report will remain pending on this device until connectivity returns. No data has been discarded.'}</p><div className="dialog-actions"><button className="button secondary" type="button" onClick={() => navigate('/driver/alerts')}>View alerts</button><button className="button primary" type="button" onClick={() => navigate('/driver')}>Return home</button></div></section></div>;
  const hasLocation = store.location.status === 'active' && store.location.coordinates;
  return <div className="screen-stack report-screen"><button className="back-link" type="button" onClick={() => navigate(-1)}><ArrowLeft size={17} /> Back</button><header className="screen-heading"><p className="eyebrow">Field observation</p><h1>Report a road issue</h1><p className="heading-copy">Share a concise, usable road condition report while safely stopped. Submission is saved to this device in the development build.</p></header>
    <form className="report-form card" onSubmit={submit} noValidate><fieldset><legend>What did you encounter?</legend><div className="incident-type-grid">{incidentTypes.map((incident) => <label className={`incident-type ${type === incident ? 'selected' : ''}`} key={incident}><input type="radio" name="incident-type" value={incident} checked={type === incident} onChange={() => { setType(incident); setError(''); }} /><span>{incident}</span></label>)}</div>{error && <p className="form-error" role="alert">{error}</p>}</fieldset>
      <fieldset><legend>How severe is it?</legend><div className="segmented-control">{(['information', 'warning', 'critical'] as AlertSeverity[]).map((level) => <label key={level}><input type="radio" name="severity" value={level} checked={severity === level} onChange={() => setSeverity(level)} /><span>{level === 'information' ? 'Information' : level[0].toUpperCase() + level.slice(1)}</span></label>)}</div></fieldset>
      <label className="field-label" htmlFor="report-description">Brief description <span>Optional</span><textarea id="report-description" value={description} onChange={(event) => setDescription(event.target.value)} placeholder="What should the next driver know?" maxLength={500} rows={4} /></label>
      <section className="report-location" aria-labelledby="report-location-title"><div><MapPinned size={20} /><div><h2 id="report-location-title">Location attachment</h2><p>{hasLocation ? `${store.location.coordinates?.latitude.toFixed(5)}, ${store.location.coordinates?.longitude.toFixed(5)} · accuracy ±${store.location.coordinates?.accuracy ?? '—'}m` : store.location.message}</p></div></div><button className="button secondary" type="button" onClick={() => void attachLocation()} disabled={store.location.status === 'acquiring'}><LocateFixed size={16} />{store.location.status === 'acquiring' ? 'Checking…' : hasLocation ? 'Refresh' : 'Use current location'}</button><label className="field-label location-note" htmlFor="location-note">Location note <span>Optional</span><input id="location-note" value={locationLabel} onChange={(event) => setLocationLabel(event.target.value)} /></label></section>
      <section className="report-photo"><Camera size={20} /><div><strong>Photo or video</strong><p>Media attachment is planned after secure storage is connected; it is not simulated here.</p></div></section>
      <footer className="report-submit"><span>{store.isOnline ? <><Radio size={16} /> Saved locally on this connected device</> : <><WifiOff size={16} /> Queued locally until online</>}</span><button className="button primary" type="submit">Save incident report</button></footer>
    </form>
  </div>;
};
