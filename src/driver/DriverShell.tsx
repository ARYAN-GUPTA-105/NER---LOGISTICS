import type { ReactNode } from 'react';
import { useState } from 'react';
import { AlertTriangle, Bell, House, Map, Navigation, Radio, ShieldAlert, UserRound } from 'lucide-react';
import { NavLink } from 'react-router-dom';
import { useDriver } from './DriverContext';

const navigation = [
  { to: '/driver', label: 'Home', icon: House, end: true },
  { to: '/driver/trips', label: 'Trips', icon: Navigation },
  { to: '/driver/map', label: 'Map', icon: Map },
  { to: '/driver/alerts', label: 'Alerts', icon: Bell },
  { to: '/driver/profile', label: 'Profile', icon: UserRound },
];

export const DriverShell = ({ children }: { children: ReactNode }) => {
  const { store, unreadAlerts, triggerSos, clearSos } = useDriver();
  const [confirmSos, setConfirmSos] = useState(false);

  return (
    <div className="driver-app">
      <aside className="driver-sidebar" aria-label="Driver navigation">
        <div className="app-mark">
          <span className="app-mark-icon"><Navigation size={20} /></span>
          <span><strong>SMART NER</strong><small>DRIVER CONSOLE</small></span>
        </div>
        <nav className="driver-nav">
          {navigation.map(({ to, label, icon: Icon, end }) => (
            <NavLink key={to} to={to} end={end} className="driver-nav-link">
              <Icon size={20} aria-hidden="true" />
              <span>{label}</span>
              {label === 'Alerts' && unreadAlerts > 0 && <b className="nav-count" aria-label={`${unreadAlerts} unread alerts`}>{unreadAlerts}</b>}
            </NavLink>
          ))}
        </nav>
        <div className={`sidebar-connectivity ${store.isOnline ? 'is-online' : 'is-offline'}`}>
          <Radio size={15} />
          <span>{store.isOnline ? 'Connected' : 'Offline mode'}</span>
        </div>
      </aside>

      <div className="driver-main">
        <header className="driver-topbar">
          <div className="mobile-brand"><Navigation size={18} /> SMART NER</div>
          <div className="topbar-status">
            <span className={`status-dot ${store.isOnline ? 'is-online' : 'is-offline'}`} />
            {store.isOnline ? 'Online' : 'Offline — actions are kept on this device'}
          </div>
          <button className="sos-button" type="button" onClick={() => setConfirmSos(true)}>
            <ShieldAlert size={17} /> SOS
          </button>
        </header>

        {!store.isOnline && (
          <div className="offline-banner" role="status">
            <AlertTriangle size={18} />
            <span>Offline mode is active. New reports are queued locally until a connection is available.</span>
          </div>
        )}
        <main className="driver-content">{children}</main>
      </div>

      <nav className="mobile-nav" aria-label="Driver navigation">
        {navigation.map(({ to, label, icon: Icon, end }) => (
          <NavLink key={to} to={to} end={end} className="mobile-nav-link">
            <span className="mobile-nav-icon"><Icon size={20} aria-hidden="true" />{label === 'Alerts' && unreadAlerts > 0 && <i />}</span>
            <span>{label}</span>
          </NavLink>
        ))}
      </nav>

      {confirmSos && (
        <div className="dialog-backdrop" role="presentation">
          <section className="confirm-dialog" role="alertdialog" aria-modal="true" aria-labelledby="sos-title">
            <div className="dialog-icon danger"><ShieldAlert size={24} /></div>
            <h2 id="sos-title">Start an SOS check-in?</h2>
            <p>This records an emergency intent and any available device location locally. It does not contact emergency services.</p>
            <div className="dialog-actions">
              <button className="button secondary" type="button" onClick={() => setConfirmSos(false)}>Cancel</button>
              <button className="button danger" type="button" onClick={() => { triggerSos(); setConfirmSos(false); }}>Confirm SOS</button>
            </div>
          </section>
        </div>
      )}

      {store.sosActive && (
        <div className="sos-state" role="status">
          <div><ShieldAlert size={19} /><strong>SOS check-in recorded on this device</strong><span>No emergency-service dispatch is configured.</span></div>
          <button type="button" onClick={clearSos} aria-label="Dismiss SOS status">×</button>
        </div>
      )}
    </div>
  );
};
