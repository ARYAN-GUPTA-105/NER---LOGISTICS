export type TripStatus = 'assigned' | 'ready' | 'in_progress' | 'delayed' | 'completed' | 'cancelled';
export type AlertSeverity = 'information' | 'warning' | 'critical';
export type RouteRisk = 'low' | 'moderate' | 'high';
export type GpsStatus = 'idle' | 'permission_required' | 'acquiring' | 'active' | 'unavailable';
export type SyncState = 'synced' | 'pending' | 'syncing' | 'failed';

export interface DriverProfile {
  id: string;
  name: string;
  phone: string;
  email: string;
  accountStatus: 'Active';
}

export interface Vehicle {
  id: string;
  type: string;
  registration: string;
  operationalStatus: 'Ready' | 'Attention required';
  lastInspection: string;
}

export interface Stop {
  name: string;
  detail: string;
}

export interface RouteOption {
  id: string;
  name: string;
  distanceKm: number;
  etaMinutes: number;
  risk: RouteRisk;
  accessibility: 'Clear' | 'Restricted' | 'Monitor';
  note: string;
  recommended?: boolean;
}

export interface Disruption {
  id: string;
  type: 'Flooding' | 'Landslide' | 'Road closure' | 'Bridge issue' | 'Accident' | 'Congestion';
  severity: AlertSeverity;
  location: string;
  distanceAheadKm: number;
  reportedAt: string;
  status: 'Active' | 'Monitoring' | 'Cleared';
  impact: string;
}

export interface Trip {
  id: string;
  shipmentId: string;
  commodity: string;
  origin: Stop;
  destination: Stop;
  status: TripStatus;
  priority: 'Standard' | 'Priority';
  scheduledFor: string;
  completedAt?: string;
  startedAt?: string;
  proofOfDelivery?: 'Recorded locally';
  progressPercent: number;
  routeOptions: RouteOption[];
  selectedRouteId: string;
  disruptionIds: string[];
}

export interface DriverAlert {
  id: string;
  severity: AlertSeverity;
  title: string;
  message: string;
  timestamp: string;
  location?: string;
  tripId?: string;
  read: boolean;
  action?: 'review_route' | 'open_map';
}

export interface Coordinates {
  latitude: number;
  longitude: number;
  accuracy?: number;
}

export interface LocationState {
  status: GpsStatus;
  coordinates?: Coordinates;
  updatedAt?: string;
  message: string;
}

export interface IncidentReport {
  id: string;
  type: string;
  severity: AlertSeverity;
  description: string;
  location?: Coordinates;
  locationLabel: string;
  createdAt: string;
  syncState: SyncState;
}

export interface DriverStore {
  driver: DriverProfile;
  vehicle: Vehicle;
  trips: Trip[];
  disruptions: Disruption[];
  alerts: DriverAlert[];
  reports: IncidentReport[];
  activeTripId: string | null;
  location: LocationState;
  isOnline: boolean;
  sosActive: boolean;
  sosLocation?: Coordinates;
}
