import type { Coordinates } from './types';

export type LocationResult =
  | { ok: true; coordinates: Coordinates }
  | { ok: false; reason: 'permission_required' | 'unavailable'; message: string };

/**
 * Browser-only, one-time location lookup. Continuous tracking and backend
 * transport are intentionally separate future concerns.
 */
export const requestCurrentLocation = (): Promise<LocationResult> => {
  if (!('geolocation' in navigator)) {
    return Promise.resolve({ ok: false, reason: 'unavailable', message: 'This device does not support location services.' });
  }

  return new Promise((resolve) => {
    navigator.geolocation.getCurrentPosition(
      (position) => resolve({
        ok: true,
        coordinates: {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          accuracy: Math.round(position.coords.accuracy),
        },
      }),
      (error) => {
        if (error.code === error.PERMISSION_DENIED) {
          resolve({ ok: false, reason: 'permission_required', message: 'Location permission is needed to show your position.' });
          return;
        }
        resolve({ ok: false, reason: 'unavailable', message: 'Your position is temporarily unavailable. You can continue without it.' });
      },
      { enableHighAccuracy: false, timeout: 10000, maximumAge: 60000 },
    );
  });
};
