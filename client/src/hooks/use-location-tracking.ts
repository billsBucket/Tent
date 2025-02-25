import { useState, useEffect, useCallback } from 'react';
import { io } from 'socket.io-client';
import { useAuth } from './use-auth';

interface Location {
  lat: number;
  lng: number;
  timestamp: number;
}

interface UseLocationTrackingProps {
  bookingId?: number;
  isTracker?: boolean;
}

export function useLocationTracking({ bookingId, isTracker = false }: UseLocationTrackingProps = {}) {
  const [location, setLocation] = useState<Location | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [watching, setWatching] = useState(false);
  const { user } = useAuth();

  const startTracking = useCallback(() => {
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by your browser');
      return;
    }

    const socket = io(window.location.origin, {
      path: '/api/socket',
      auth: {
        bookingId,
        userId: user?.id,
        role: isTracker ? 'tracker' : 'watcher'
      }
    });

    const watchId = navigator.geolocation.watchPosition(
      (position) => {
        const newLocation = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
          timestamp: position.timestamp
        };
        setLocation(newLocation);
        socket.emit('location_update', newLocation);
      },
      (error) => {
        setError(error.message);
      },
      {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0
      }
    );

    socket.on('location_update', (newLocation: Location) => {
      setLocation(newLocation);
    });

    setWatching(true);

    return () => {
      navigator.geolocation.clearWatch(watchId);
      socket.disconnect();
      setWatching(false);
    };
  }, [bookingId, user?.id, isTracker]);

  const stopTracking = useCallback(() => {
    setWatching(false);
  }, []);

  return {
    location,
    error,
    watching,
    startTracking,
    stopTracking
  };
}
