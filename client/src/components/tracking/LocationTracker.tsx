import { useState, useEffect } from 'react';
import { GoogleMap, useJsApiLoader, Marker } from '@react-google-maps/api';
import { io } from 'socket.io-client';
import { useAuth } from '@/hooks/use-auth';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { PhoneCall, AlertTriangle, Navigation } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Location {
  lat: number;
  lng: number;
  timestamp: number;
}

interface LocationTrackerProps {
  bookingId: string;
  babysitterId: number;
}

export function LocationTracker({ bookingId, babysitterId }: LocationTrackerProps) {
  const { user } = useAuth();
  const { toast } = useToast();
  const [socket, setSocket] = useState<any>(null);
  const [location, setLocation] = useState<Location | null>(null);
  const [isEmergency, setIsEmergency] = useState(false);

  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY
  });

  useEffect(() => {
    if (!user) return;

    const newSocket = io(window.location.origin, {
      path: '/api/socket',
      auth: {
        userId: user.id,
        role: 'watcher',
        bookingId
      }
    });

    newSocket.on('location_update', (data: Location & { userId: number }) => {
      if (data.userId === babysitterId) {
        setLocation({
          lat: data.lat,
          lng: data.lng,
          timestamp: data.timestamp
        });
      }
    });

    newSocket.on('emergency_alert', ({ userId, type }) => {
      if (userId === babysitterId) {
        setIsEmergency(true);
        toast({
          title: "Emergency Alert!",
          description: "The babysitter has triggered an emergency alert.",
          variant: "destructive",
        });
      }
    });

    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
    };
  }, [user, bookingId, babysitterId]);

  const initiateCall = () => {
    // Here we would integrate with a calling service like Twilio
    toast({
      title: "Initiating Call",
      description: "Connecting to babysitter...",
    });
  };

  const triggerSOS = () => {
    if (!socket) return;

    socket.emit('emergency_alert', {
      bookingId,
      type: 'parent_initiated'
    });

    setIsEmergency(true);
    toast({
      title: "Emergency Alert Sent",
      description: "Emergency services and the babysitter have been notified.",
      variant: "destructive",
    });
  };

  if (!isLoaded) return <div>Loading map...</div>;

  return (
    <div className="space-y-4">
      <div className="relative h-[400px] rounded-lg overflow-hidden">
        <GoogleMap
          mapContainerStyle={{ width: '100%', height: '100%' }}
          center={location || { lat: 0, lng: 0 }}
          zoom={15}
        >
          {location && (
            <Marker
              position={location}
              icon={{
                path: "M10.453 14.016l6.563-6.609-1.406-1.406-5.156 5.203-2.063-2.109-1.406 1.406zM12 2.016q2.906 0 4.945 2.039t2.039 4.945q0 1.453-0.727 3.328t-1.758 3.516-2.039 3.070-1.711 2.273l-0.75 0.797q-0.281-0.328-0.75-0.867t-1.688-2.156-2.133-3.141-1.664-3.445-0.75-3.375q0-2.906 2.039-4.945t4.945-2.039z",
                fillColor: isEmergency ? "red" : "#4CAF50",
                fillOpacity: 1,
                strokeWeight: 0,
                scale: 2,
              }}
            />
          )}
        </GoogleMap>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Button 
          size="lg"
          className="w-full"
          onClick={initiateCall}
        >
          <PhoneCall className="h-5 w-5 mr-2" />
          Call Babysitter
        </Button>
        <Button 
          size="lg"
          variant="destructive"
          className="w-full"
          onClick={triggerSOS}
        >
          <AlertTriangle className="h-5 w-5 mr-2" />
          SOS Emergency
        </Button>
      </div>

      {location && (
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Navigation className="h-5 w-5 text-primary" />
              <span className="text-sm">Last updated: {new Date(location.timestamp).toLocaleTimeString()}</span>
            </div>
            {isEmergency && (
              <span className="text-sm text-destructive font-semibold">Emergency Mode Active</span>
            )}
          </div>
        </Card>
      )}
    </div>
  );
}
