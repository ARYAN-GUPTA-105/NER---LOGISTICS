import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import { createMockDriverStore } from './mockData';
import { requestCurrentLocation } from './locationService';
import type { AlertSeverity, DriverStore, IncidentReport, RouteOption, Trip, TripStatus } from './types';

const STORAGE_KEY = 'smart-ner-driver-core-v1';

const canTransition = (from: TripStatus, to: TripStatus) => (
  (from === 'assigned' && to === 'ready')
  || (from === 'ready' && to === 'in_progress')
  || (from === 'in_progress' && to === 'completed')
);

const loadStore = (): { store: DriverStore; error: string | null } => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return { store: saved ? JSON.parse(saved) as DriverStore : createMockDriverStore(), error: null };
  } catch {
    return { store: createMockDriverStore(), error: 'Saved Driver data could not be read. A safe development workspace has been restored.' };
  }
};

export interface DriverContextValue {
  store: DriverStore;
  isLoading: boolean;
  dataError: string | null;
  activeTrip: Trip | undefined;
  activeRoute: RouteOption | undefined;
  unreadAlerts: number;
  transitionTrip: (tripId: string, nextStatus: 'ready' | 'in_progress' | 'completed') => boolean;
  selectRoute: (tripId: string, routeId: string) => void;
  markAlertRead: (alertId: string) => void;
  requestLocation: () => Promise<void>;
  submitReport: (report: Pick<IncidentReport, 'type' | 'severity' | 'description' | 'locationLabel'>) => void;
  syncPendingReports: () => void;
  triggerSos: () => void;
  clearSos: () => void;
}

const DriverContext = createContext<DriverContextValue | undefined>(undefined);

export const DriverProvider = ({ children }: { children: ReactNode }) => {
  const [initialState] = useState(loadStore);
  const [store, setStore] = useState<DriverStore>(initialState.store);
  const [dataError] = useState<string | null>(initialState.error);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = window.setTimeout(() => setIsLoading(false), 280);
    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(store));
  }, [store]);

  useEffect(() => {
    const setOnline = () => {
      setStore((current) => ({
        ...current,
        isOnline: true,
        reports: current.reports.map((report) => report.syncState === 'pending' || report.syncState === 'failed' ? { ...report, syncState: 'syncing' } : report),
      }));
      window.setTimeout(() => {
        setStore((current) => ({
          ...current,
          reports: current.isOnline ? current.reports.map((report) => report.syncState === 'syncing' ? { ...report, syncState: 'synced' } : report) : current.reports,
        }));
      }, 700);
    };
    const setOffline = () => setStore((current) => ({ ...current, isOnline: false }));
    window.addEventListener('online', setOnline);
    window.addEventListener('offline', setOffline);
    return () => {
      window.removeEventListener('online', setOnline);
      window.removeEventListener('offline', setOffline);
    };
  }, []);

  const transitionTrip = useCallback((tripId: string, nextStatus: 'ready' | 'in_progress' | 'completed') => {
    const target = store.trips.find((trip) => trip.id === tripId);
    if (!target || !canTransition(target.status, nextStatus)) return false;
    setStore((current) => {
      const now = new Date().toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' });
      const trips = current.trips.map((trip) => {
        if (trip.id !== tripId) return trip;
        if (nextStatus === 'in_progress') return { ...trip, status: nextStatus, startedAt: now, progressPercent: Math.max(8, trip.progressPercent) };
        if (nextStatus === 'completed') return { ...trip, status: nextStatus, completedAt: now, progressPercent: 100, proofOfDelivery: 'Recorded locally' as const };
        return { ...trip, status: nextStatus };
      });
      return {
        ...current,
        trips,
        activeTripId: nextStatus === 'completed' ? null : tripId,
      };
    });
    return true;
  }, [store.trips]);

  const selectRoute = useCallback((tripId: string, routeId: string) => {
    setStore((current) => ({
      ...current,
      trips: current.trips.map((trip) => {
        if (trip.id !== tripId || !trip.routeOptions.some((route) => route.id === routeId)) return trip;
        return { ...trip, selectedRouteId: routeId };
      }),
      alerts: current.alerts.map((alert) => (
        alert.tripId === tripId && alert.action === 'review_route' ? { ...alert, read: true } : alert
      )),
    }));
  }, []);

  const markAlertRead = useCallback((alertId: string) => {
    setStore((current) => ({
      ...current,
      alerts: current.alerts.map((alert) => alert.id === alertId ? { ...alert, read: true } : alert),
    }));
  }, []);

  const requestLocation = useCallback(async () => {
    setStore((current) => ({ ...current, location: { status: 'acquiring', message: 'Checking your device location…' } }));
    const result = await requestCurrentLocation();
    setStore((current) => ({
      ...current,
      location: result.ok
        ? { status: 'active', coordinates: result.coordinates, updatedAt: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }), message: 'Current location available on this device.' }
        : { status: result.reason, message: result.message },
    }));
  }, []);

  const submitReport = useCallback((report: Pick<IncidentReport, 'type' | 'severity' | 'description' | 'locationLabel'>) => {
    setStore((current) => ({
      ...current,
      reports: [{
        id: `report-${Date.now()}`,
        ...report,
        location: current.location.coordinates,
        createdAt: new Date().toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' }),
        syncState: current.isOnline ? 'synced' : 'pending',
      }, ...current.reports],
    }));
  }, []);

  const syncPendingReports = useCallback(() => {
    setStore((current) => ({
      ...current,
      reports: current.reports.map((report) => report.syncState === 'pending' || report.syncState === 'failed' ? { ...report, syncState: 'syncing' } : report),
    }));
    window.setTimeout(() => {
      setStore((current) => ({
        ...current,
        reports: current.reports.map((report) => report.syncState === 'syncing' ? { ...report, syncState: 'synced' } : report),
      }));
    }, 700);
  }, []);

  const triggerSos = useCallback(() => {
    setStore((current) => ({ ...current, sosActive: true, sosLocation: current.location.coordinates }));
  }, []);

  const clearSos = useCallback(() => setStore((current) => ({ ...current, sosActive: false })), []);

  const value = useMemo<DriverContextValue>(() => {
    const activeTrip = store.trips.find((trip) => trip.id === store.activeTripId);
    return {
      store,
      isLoading,
      dataError,
      activeTrip,
      activeRoute: activeTrip?.routeOptions.find((route) => route.id === activeTrip.selectedRouteId),
      unreadAlerts: store.alerts.filter((alert) => !alert.read).length,
      transitionTrip,
      selectRoute,
      markAlertRead,
      requestLocation,
      submitReport,
      syncPendingReports,
      triggerSos,
      clearSos,
    };
  }, [store, isLoading, dataError, transitionTrip, selectRoute, markAlertRead, requestLocation, submitReport, syncPendingReports, triggerSos, clearSos]);

  return <DriverContext.Provider value={value}>{children}</DriverContext.Provider>;
};

export const useDriver = () => {
  const context = useContext(DriverContext);
  if (!context) throw new Error('useDriver must be used within DriverProvider.');
  return context;
};

export const severityLabel = (severity: AlertSeverity) => severity === 'information' ? 'Information' : severity[0].toUpperCase() + severity.slice(1);
