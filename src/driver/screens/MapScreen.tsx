import { AlertTriangle, Check, Clock3, Compass, LocateFixed, MapPinned, Navigation, Radio, Route as RouteIcon, Signal, WifiOff } from 'lucide-react';
import { useDriver } from '../DriverContext';

const prettyGps = (status: string) => status.replace('_', ' ');

export const MapScreen = () => {
  const { activeRoute, activeTrip, requestLocation, selectRoute, store } = useDriver();
  if (!activeTrip || !activeRoute) return <div className="screen-stack"><header className="screen-heading"><p className="eyebrow">Route monitoring</p><h1>Map & route</h1></header><section className="empty-state card"><MapPinned size={28} /><h2>No trip is currently active</h2><p>Start a ready delivery to review its route and location status.</p></section></div>;
  const disruptions = store.disruptions.filter((item) => activeTrip.disruptionIds.includes(item.id));
  const isLocationActive = store.location.status === 'active';
  return <div className="screen-stack map-screen">
    <header className="screen-heading split-heading"><div><p className="eyebrow">Route monitoring</p><h1>Map & route</h1><p className="heading-copy">{activeTrip.shipmentId} · {activeTrip.origin.name} to {activeTrip.destination.name}</p></div><div className="live-status"><Radio size={16} /><span>{store.location.status === 'active' ? 'Location available' : 'Location not shared'}</span></div></header>
    <section className="operational-map card" aria-label="Development route map">
      <div className="map-header"><div><p className="eyebrow">Development route preview</p><strong>{activeRoute.name}</strong></div><span className={`risk-pill ${activeRoute.risk}`}>{activeRoute.risk} risk</span></div>
      <div className="map-canvas">
        <svg viewBox="0 0 800 410" role="img" aria-label={`Route from ${activeTrip.origin.name} to ${activeTrip.destination.name}`} preserveAspectRatio="none">
          <path className="terrain-line" d="M-20,330 C100,290 100,130 240,185 S370,330 480,200 S650,70 830,145" />
          <path className="terrain-line secondary" d="M-20,95 C95,165 155,30 302,87 S470,44 620,122 S705,285 830,245" />
          <path className="route-shadow" d="M80,325 C145,255 190,266 255,220 S360,115 430,168 S524,265 590,180 S670,104 742,84" />
          <path className="route-path" d="M80,325 C145,255 190,266 255,220 S360,115 430,168 S524,265 590,180 S670,104 742,84" />
          {disruptions.length > 0 && <g className="map-disruption"><circle cx="505" cy="246" r="19" /><path d="M505 234v14m0 7v1" /></g>}
          <g className="map-origin"><circle cx="80" cy="325" r="13" /><circle cx="80" cy="325" r="5" /></g>
          <g className="map-destination"><path d="M742 63l18 21-18 21-18-21z" /><circle cx="742" cy="84" r="4" /></g>
          <g className={`map-driver ${isLocationActive ? 'location-active' : ''}`} transform={`translate(${isLocationActive ? 214 : 110} ${isLocationActive ? 244 : 299})`}><circle r="18" /><path d="M0 -10v20M-8 0h16" /></g>
        </svg>
        <div className="map-label label-origin">Guwahati</div><div className="map-label label-destination">Tezpur</div>{disruptions.length > 0 && <div className="map-label label-disruption">Reported flooding</div>}
      </div>
      <div className="map-footer"><span><Navigation size={16} /> {activeTrip.progressPercent}% trip progress</span><span><Clock3 size={16} /> {Math.floor(activeRoute.etaMinutes / 60)} h {activeRoute.etaMinutes % 60} min estimated journey</span><span><Compass size={16} /> {activeRoute.distanceKm} km remaining route</span></div>
    </section>
    <div className="map-info-grid">
      <section className="card location-card"><div className="card-heading"><div><p className="eyebrow">Device location</p><h2>{prettyGps(store.location.status)}</h2></div>{isLocationActive ? <Signal size={21} /> : <LocateFixed size={21} />}</div><p>{store.location.message}</p>{isLocationActive && store.location.coordinates && <p className="coordinate">{store.location.coordinates.latitude.toFixed(5)}, {store.location.coordinates.longitude.toFixed(5)} · ±{store.location.coordinates.accuracy ?? '—'}m</p>}<button className="button secondary" type="button" onClick={() => void requestLocation()} disabled={store.location.status === 'acquiring'}>{store.location.status === 'acquiring' ? 'Checking location…' : isLocationActive ? 'Refresh location' : 'Use current location'}</button><small className="support-copy">Location is requested only when you choose this action; continuous tracking is not enabled.</small></section>
      <section className="card connectivity-card"><div className="card-heading"><div><p className="eyebrow">Connection</p><h2>{store.isOnline ? 'Online' : 'Offline mode'}</h2></div>{store.isOnline ? <Radio size={21} /> : <WifiOff size={21} />}</div><p>{store.isOnline ? 'Route and report changes are currently kept in the local development workspace.' : 'Reports are retained locally and will show as pending until connectivity returns.'}</p><span className={`status-chip ${store.isOnline ? 'ready' : 'delayed'}`}>{store.isOnline ? 'Device connected' : 'Local queue active'}</span></section>
    </div>
    {disruptions.map((disruption) => <section className={`route-disruption card ${disruption.severity}`} key={disruption.id}><div className="alert-icon"><AlertTriangle size={21} /></div><div><p className="eyebrow">Active route disruption · {disruption.reportedAt}</p><h2>{disruption.type} {disruption.distanceAheadKm} km ahead</h2><p>{disruption.impact}</p><small>{disruption.location} · Status: {disruption.status}</small></div></section>)}
    <section className="route-options" aria-labelledby="route-options-title"><div className="section-label"><p className="eyebrow">Development recommendation</p><h2 id="route-options-title">Choose a route</h2><p>This rule-based comparison is mock development data, not an AI/ML recommendation.</p></div><div className="route-option-grid">{activeTrip.routeOptions.map((route) => <article className={`route-option card ${route.id === activeTrip.selectedRouteId ? 'selected' : ''}`} key={route.id}><div className="route-option-heading"><div><h3>{route.name}</h3>{route.recommended && <span className="recommended"><Check size={13} /> Recommended for this scenario</span>}</div>{route.id === activeTrip.selectedRouteId && <span className="selected-route">Active</span>}</div><p>{route.note}</p><div className="route-comparison"><span><b>{Math.floor(route.etaMinutes / 60)} h {route.etaMinutes % 60} min</b><small>ETA</small></span><span><b>{route.distanceKm} km</b><small>Distance</small></span><span><b>{route.risk}</b><small>Risk</small></span><span><b>{route.accessibility}</b><small>Access</small></span></div>{route.id !== activeTrip.selectedRouteId && <button className="button secondary" type="button" onClick={() => selectRoute(activeTrip.id, route.id)}><RouteIcon size={17} /> Use this route</button>}</article>)}</div></section>
  </div>;
};
