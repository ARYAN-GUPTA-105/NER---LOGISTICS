import { Navigate, Outlet, Route, Routes } from 'react-router-dom';
import { DriverShell } from './DriverShell';
import { AlertsScreen } from './screens/AlertsScreen';
import { DriverHome } from './screens/DriverHome';
import { MapScreen } from './screens/MapScreen';
import { ProfileScreen } from './screens/ProfileScreen';
import { ReportScreen } from './screens/ReportScreen';
import { TripDetailScreen, TripsScreen } from './screens/TripsScreen';
import './driver.css';

const DriverLayout = () => (
  <DriverShell>
    <Outlet />
  </DriverShell>
);

export const DriverApp = () => (
  <Routes>
    <Route element={<DriverLayout />}>
      <Route index element={<DriverHome />} />
      <Route path="trips" element={<TripsScreen />} />
      <Route path="trips/:tripId" element={<TripDetailScreen />} />
      <Route path="map" element={<MapScreen />} />
      <Route path="alerts" element={<AlertsScreen />} />
      <Route path="report" element={<ReportScreen />} />
      <Route path="profile" element={<ProfileScreen />} />
    </Route>
    <Route path="*" element={<Navigate to="/driver" replace />} />
  </Routes>
);
