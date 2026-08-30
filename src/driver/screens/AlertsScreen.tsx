import { useState } from 'react';
import { AlertTriangle, ArrowRight, BellRing, CheckCheck, CircleAlert, Info, MapPinned } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { severityLabel, useDriver } from '../DriverContext';
import type { DriverAlert } from '../types';

const AlertIcon = ({ severity }: { severity: DriverAlert['severity'] }) => severity === 'information' ? <Info size={20} /> : severity === 'critical' ? <AlertTriangle size={20} /> : <CircleAlert size={20} />;

export const AlertsScreen = () => {
  const { markAlertRead, store } = useDriver();
  const navigate = useNavigate();
  const [selectedId, setSelectedId] = useState<string | null>(store.alerts[0]?.id ?? null);
  const selected = store.alerts.find((alert) => alert.id === selectedId);
  const openAlert = (alert: DriverAlert) => { setSelectedId(alert.id); markAlertRead(alert.id); };
  const followAction = () => { if (!selected) return; markAlertRead(selected.id); navigate(selected.action === 'review_route' || selected.action === 'open_map' ? '/driver/map' : '/driver/alerts'); };
  return <div className="screen-stack"><header className="screen-heading split-heading"><div><p className="eyebrow">Operational messages</p><h1>Alerts</h1><p className="heading-copy">Review time-sensitive road and delivery updates before they affect the trip.</p></div><button className="button secondary" type="button" onClick={() => navigate('/driver/report')}><AlertTriangle size={17} /> Report an issue</button></header>
    {store.alerts.length ? <div className="alerts-layout"><section className="alert-list" aria-label="Driver alerts">{store.alerts.map((alert) => <button type="button" className={`alert-row ${alert.severity} ${selectedId === alert.id ? 'selected' : ''} ${!alert.read ? 'unread' : ''}`} key={alert.id} onClick={() => openAlert(alert)}><span className="alert-row-icon"><AlertIcon severity={alert.severity} /></span><span><small>{severityLabel(alert.severity)} · {alert.timestamp}</small><strong>{alert.title}</strong><p>{alert.message}</p></span>{!alert.read && <i aria-label="Unread" />}</button>)}</section>
      {selected && <aside className={`alert-detail card ${selected.severity}`} aria-live="polite"><div className="detail-alert-icon"><AlertIcon severity={selected.severity} /></div><p className="eyebrow">{severityLabel(selected.severity)} alert · {selected.timestamp}</p><h2>{selected.title}</h2><p>{selected.message}</p>{selected.location && <div className="alert-location"><MapPinned size={17} /><span>{selected.location}</span></div>}<div className="alert-detail-footer"><span>{selected.read ? <><CheckCheck size={16} /> Acknowledged</> : <><BellRing size={16} /> Unread</>}</span>{selected.action && <button className="button primary" type="button" onClick={followAction}>Review route <ArrowRight size={16} /></button>}</div></aside>}</div> : <section className="empty-state card"><BellRing size={28} /><h2>No active alerts</h2><p>New route and operational messages will appear here as they are received.</p></section>}
  </div>;
};
