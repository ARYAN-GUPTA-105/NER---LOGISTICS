import { AlertTriangle, ArrowRight, BatteryCharging, ChevronRight, CircleAlert, Clock3, Map, MapPinned, Navigation, PackageCheck, Radio, Truck, UserRound } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { severityLabel, useDriver } from '../DriverContext';

const tripStatusLabel = (status: string) => status.replace('_', ' ');

export const DriverHome = () => {
  const { activeRoute, activeTrip, dataError, isLoading, store } = useDriver();
  const navigate = useNavigate();

  if (isLoading) {
    return <div className="screen-loading" aria-label="Loading driver workspace"><span /><span /><span /></div>;
  }

  if (dataError) {
    return <div className="screen-stack"><header className="screen-heading"><div><p className="eyebrow">Driver operations</p><h1>Workspace restored safely</h1></div></header><section className="empty-state card" role="alert"><CircleAlert size={28} /><h2>Saved data needs attention</h2><p>{dataError}</p><button className="button secondary" type="button" onClick={() => navigate('/driver/trips')}>Review available trips</button></section></div>;
  }

  const activeAlerts = store.alerts.filter((alert) => !alert.read || alert.severity === 'critical');

  return (
    <div className="screen-stack">
      <header className="screen-heading home-heading">
        <div>
          <p className="eyebrow">Driver operations · Development workspace</p>
          <h1>Good morning, {store.driver.name.split(' ')[0]}.</h1>
          <p className="heading-copy">Your next delivery and route conditions are ready to review.</p>
        </div>
        <button className="driver-identity" type="button" onClick={() => navigate('/driver/profile')} aria-label="Open profile">
          <span><UserRound size={19} /></span>
          <div><strong>{store.driver.id}</strong><small>Verified driver</small></div>
          <ChevronRight size={17} />
        </button>
      </header>

      {activeTrip && activeRoute ? (
        <section className="active-delivery card" aria-labelledby="active-delivery-title">
          <div className="active-delivery-topline">
            <div><span className="eyebrow">Active delivery</span><h2 id="active-delivery-title">{activeTrip.shipmentId}</h2></div>
            <span className={`status-chip ${activeTrip.status}`}>{tripStatusLabel(activeTrip.status)}</span>
          </div>
          <div className="delivery-stops">
            <div className="stop origin"><span /><div><small>Collect from</small><strong>{activeTrip.origin.name}</strong><p>{activeTrip.origin.detail}</p></div></div>
            <div className="stop-line" aria-hidden="true" />
            <div className="stop destination"><span /><div><small>Deliver to</small><strong>{activeTrip.destination.name}</strong><p>{activeTrip.destination.detail}</p></div></div>
          </div>
          <div className="delivery-summary">
            <span><Clock3 size={17} /><b>{Math.floor(activeRoute.etaMinutes / 60)} h {activeRoute.etaMinutes % 60} min</b><small>estimated journey</small></span>
            <span><Navigation size={17} /><b>{activeRoute.distanceKm} km</b><small>selected route</small></span>
            <span><MapPinned size={17} /><b>{activeRoute.accessibility}</b><small>road access</small></span>
          </div>
          <div className="active-delivery-actions">
            <button className="button primary" type="button" onClick={() => navigate(`/driver/trips/${activeTrip.id}`)}>
              {activeTrip.status === 'ready' ? 'Review & start trip' : 'Open active trip'} <ArrowRight size={17} />
            </button>
            <button className="button text" type="button" onClick={() => navigate('/driver/map')}>View route</button>
          </div>
        </section>
      ) : (
        <section className="empty-state card" aria-labelledby="no-trip-title">
          <div className="empty-state-icon"><PackageCheck size={28} /></div>
          <h2 id="no-trip-title">No active delivery</h2>
          <p>You have no trip in progress. Your assigned deliveries remain available in Trips.</p>
          <button className="button secondary" type="button" onClick={() => navigate('/driver/trips')}>View assigned trips</button>
        </section>
      )}

      <div className="home-grid">
        <section className="card route-brief" aria-labelledby="route-brief-title">
          <div className="card-heading"><div><p className="eyebrow">Route condition</p><h2 id="route-brief-title">{activeRoute ? activeRoute.name : 'No active route'}</h2></div><Map size={21} /></div>
          {activeRoute ? <>
            <div className="condition-row"><span className={`risk-pill ${activeRoute.risk}`}>{activeRoute.risk} risk</span><span className="access-label">{activeRoute.accessibility}</span></div>
            <p>{activeRoute.note}</p>
            <button className="inline-action" type="button" onClick={() => navigate('/driver/map')}>Review route options <ArrowRight size={15} /></button>
          </> : <p>Start an assigned trip to make route information available.</p>}
        </section>

        <section className="card vehicle-brief" aria-labelledby="vehicle-brief-title">
          <div className="card-heading"><div><p className="eyebrow">Assigned vehicle</p><h2 id="vehicle-brief-title">{store.vehicle.id}</h2></div><Truck size={21} /></div>
          <p>{store.vehicle.type}</p>
          <div className="vehicle-health"><BatteryCharging size={17} /><span>{store.vehicle.operationalStatus}</span><small>Last check {store.vehicle.lastInspection}</small></div>
          <button className="inline-action" type="button" onClick={() => navigate('/driver/profile')}>Vehicle details <ArrowRight size={15} /></button>
        </section>
      </div>

      <section className="card alerts-preview" aria-labelledby="alerts-title">
        <div className="card-heading"><div><p className="eyebrow">Attention needed</p><h2 id="alerts-title">Route & operational alerts</h2></div><button className="inline-action" type="button" onClick={() => navigate('/driver/alerts')}>View all <ArrowRight size={15} /></button></div>
        {activeAlerts.length ? (
          <div className="alert-preview-list">
            {activeAlerts.slice(0, 2).map((alert) => <button className={`alert-preview ${alert.severity}`} key={alert.id} onClick={() => navigate('/driver/alerts')}>
              <span><AlertTriangle size={19} /></span><div><small>{severityLabel(alert.severity)} · {alert.timestamp}</small><strong>{alert.title}</strong><p>{alert.message}</p></div><ChevronRight size={17} />
            </button>)}
          </div>
        ) : <div className="clear-state"><CircleAlert size={19} /><span>No active alerts. Your route and vehicle status are clear.</span></div>}
      </section>

      <section className="quick-actions" aria-labelledby="quick-actions-title">
        <div className="section-label"><p className="eyebrow">Quick actions</p><h2 id="quick-actions-title">Keep the trip moving</h2></div>
        <div className="quick-action-grid">
          <button type="button" onClick={() => navigate('/driver/trips')}><Navigation size={21} /><span>View trips</span><small>Delivery details</small></button>
          <button type="button" onClick={() => navigate('/driver/map')}><Map size={21} /><span>Open map</span><small>Route status</small></button>
          <button type="button" onClick={() => navigate('/driver/report')}><AlertTriangle size={21} /><span>Report issue</span><small>Road incident</small></button>
          <button type="button" onClick={() => navigate('/driver/alerts')}><Radio size={21} /><span>View alerts</span><small>{store.alerts.filter((alert) => !alert.read).length} unread</small></button>
        </div>
      </section>
    </div>
  );
};
