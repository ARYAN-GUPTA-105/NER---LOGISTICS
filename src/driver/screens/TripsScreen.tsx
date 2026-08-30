import { useState } from 'react';
import { ArrowLeft, ArrowRight, CheckCircle2, Clock3, MapPinned, Package, ShieldCheck, Truck } from 'lucide-react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useDriver } from '../DriverContext';
import type { Trip, TripStatus } from '../types';

const statusLabel = (status: TripStatus) => status.replace('_', ' ');

const TripCard = ({ trip }: { trip: Trip }) => (
  <Link className="trip-card card" to={`/driver/trips/${trip.id}`}>
    <div className="trip-card-top"><span className={`status-chip ${trip.status}`}>{statusLabel(trip.status)}</span><small>{trip.priority} delivery</small></div>
    <h2>{trip.shipmentId}</h2><p className="commodity">{trip.commodity}</p>
    <div className="compact-stops"><span>{trip.origin.name}</span><ArrowRight size={15} /><span>{trip.destination.name}</span></div>
    <footer><span><Clock3 size={15} />{trip.scheduledFor}</span><span>Open <ArrowRight size={15} /></span></footer>
  </Link>
);

export const TripsScreen = () => {
  const { isLoading, store } = useDriver();
  if (isLoading) return <div className="screen-loading" aria-label="Loading trips"><span /><span /><span /></div>;
  const current = store.trips.filter((trip) => trip.status !== 'completed');
  const completed = store.trips.filter((trip) => trip.status === 'completed');
  return <div className="screen-stack">
    <header className="screen-heading"><div><p className="eyebrow">Delivery management</p><h1>Your trips</h1><p className="heading-copy">Review assigned work, start a ready delivery, and record completion from one consistent trip state.</p></div></header>
    <section aria-labelledby="current-trips-title"><div className="section-label"><p className="eyebrow">Current & upcoming</p><h2 id="current-trips-title">Delivery queue</h2></div><div className="trip-grid">{current.length ? current.map((trip) => <TripCard key={trip.id} trip={trip} />) : <div className="empty-state card"><Package size={26} /><h2>No current deliveries</h2><p>Completed trips will remain in your history below.</p></div>}</div></section>
    <section aria-labelledby="completed-trips-title"><div className="section-label"><p className="eyebrow">Delivery history</p><h2 id="completed-trips-title">Recently completed</h2></div><div className="trip-grid">{completed.length ? completed.map((trip) => <TripCard key={trip.id} trip={trip} />) : <div className="empty-state card"><CheckCircle2 size={26} /><h2>No completed deliveries yet</h2><p>Completed trips will appear here with their final status.</p></div>}</div></section>
  </div>;
};

export const TripDetailScreen = () => {
  const { tripId } = useParams();
  const { store, transitionTrip } = useDriver();
  const navigate = useNavigate();
  const [confirming, setConfirming] = useState<'start' | 'complete' | null>(null);
  const trip = store.trips.find((item) => item.id === tripId);
  if (!trip) return <div className="not-found card"><h1>Delivery not found</h1><p>This trip may no longer be available on this device.</p><Link className="button secondary" to="/driver/trips">Back to trips</Link></div>;
  const route = trip.routeOptions.find((item) => item.id === trip.selectedRouteId);
  const doTransition = () => {
    if (confirming === 'start') { transitionTrip(trip.id, 'in_progress'); navigate('/driver/map'); }
    if (confirming === 'complete') { transitionTrip(trip.id, 'completed'); setConfirming(null); }
  };
  return <div className="screen-stack trip-detail">
    <button className="back-link" type="button" onClick={() => navigate('/driver/trips')}><ArrowLeft size={17} /> Back to trips</button>
    <header className="screen-heading detail-heading"><div><p className="eyebrow">{trip.priority} delivery</p><h1>{trip.shipmentId}</h1><p className="heading-copy">{trip.commodity}</p></div><span className={`status-chip ${trip.status}`}>{statusLabel(trip.status)}</span></header>
    <section className="detail-hero card"><div className="delivery-stops"><div className="stop origin"><span /><div><small>Collection</small><strong>{trip.origin.name}</strong><p>{trip.origin.detail}</p></div></div><div className="stop-line" aria-hidden="true" /><div className="stop destination"><span /><div><small>Delivery</small><strong>{trip.destination.name}</strong><p>{trip.destination.detail}</p></div></div></div><div className="progress-wrap"><div className="progress-label"><span>Trip progress</span><strong>{trip.progressPercent}%</strong></div><div className="progress-track"><span style={{ width: `${trip.progressPercent}%` }} /></div></div></section>
    <div className="detail-grid">
      <section className="card"><div className="card-heading"><div><p className="eyebrow">Route</p><h2>{route?.name}</h2></div><MapPinned size={20} /></div><p>{route?.note}</p><div className="metric-row"><span><b>{route?.distanceKm} km</b><small>Distance</small></span><span><b>{route && Math.floor(route.etaMinutes / 60)} h {route && route.etaMinutes % 60} min</b><small>Estimated journey</small></span></div><button className="inline-action" type="button" onClick={() => navigate('/driver/map')}>Open route & conditions <ArrowRight size={15} /></button></section>
      <section className="card"><div className="card-heading"><div><p className="eyebrow">Delivery handling</p><h2>Shipment information</h2></div><Package size={20} /></div><dl className="detail-list"><div><dt>Scheduled</dt><dd>{trip.scheduledFor}</dd></div><div><dt>Commodity</dt><dd>{trip.commodity}</dd></div><div><dt>Proof of delivery</dt><dd>{trip.proofOfDelivery ?? 'Available after completion'}</dd></div></dl></section>
    </div>
    {trip.disruptionIds.length > 0 && <section className="card related-alert"><ShieldCheck size={20} /><div><p className="eyebrow">Route alert</p><strong>There is an active route condition affecting this delivery.</strong><p>Review the route before departure or while safely stopped.</p></div><button className="button secondary" type="button" onClick={() => navigate('/driver/map')}>Review</button></section>}
    <section className="trip-action-bar card"><div><Truck size={21} /><div><strong>{trip.status === 'ready' ? 'Ready to depart' : trip.status === 'in_progress' ? 'Delivery in progress' : trip.status === 'completed' ? 'Delivery completed' : 'Awaiting release'}</strong><p>{trip.status === 'ready' ? 'Confirm when you are ready to start. Location access remains optional until requested.' : trip.status === 'in_progress' ? 'Record delivery completion once the consignment is handed over.' : trip.status === 'completed' ? `Completed ${trip.completedAt}` : 'This delivery will become ready when it is released.'}</p></div></div>
      {trip.status === 'ready' && <button className="button primary" type="button" onClick={() => setConfirming('start')}>Start trip <ArrowRight size={17} /></button>}
      {trip.status === 'in_progress' && <button className="button success" type="button" onClick={() => setConfirming('complete')}>Complete delivery <CheckCircle2 size={17} /></button>}
    </section>
    {confirming && <div className="dialog-backdrop" role="presentation"><section className="confirm-dialog" role="dialog" aria-modal="true" aria-labelledby="trip-confirm-title"><div className="dialog-icon"><Truck size={24} /></div><h2 id="trip-confirm-title">{confirming === 'start' ? 'Start this trip?' : 'Complete this delivery?'}</h2><p>{confirming === 'start' ? 'This changes the delivery to in progress and opens the route view. You can request device location from the map when appropriate.' : 'This records the delivery as complete on this device, including a local completion timestamp. External proof verification is not configured.'}</p><div className="dialog-actions"><button className="button secondary" type="button" onClick={() => setConfirming(null)}>Cancel</button><button className="button primary" type="button" onClick={doTransition}>{confirming === 'start' ? 'Start trip' : 'Confirm completion'}</button></div></section></div>}
  </div>;
};
