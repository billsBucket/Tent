import { useCallback, useState } from 'react';
import { GoogleMap, useJsApiLoader, Marker } from '@react-google-maps/api';

const containerStyle = {
  width: '100%',
  height: '100%',
  minHeight: '300px'
};

const defaultCenter = {
  lat: 40.7128,
  lng: -74.0060
};

interface MapProps {
  center?: google.maps.LatLngLiteral;
  markers?: Array<{
    position: google.maps.LatLngLiteral;
    title?: string;
  }>;
  onLoad?: (map: google.maps.Map) => void;
}

export default function GoogleMapComponent({ center = defaultCenter, markers = [], onLoad }: MapProps) {
  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: "AIzaSyBXBrUDX9OBAAa9SjTfALgsjjKr5WL7H1A",
    libraries: ['places']
  });

  const [map, setMap] = useState<google.maps.Map | null>(null);

  const handleLoad = useCallback((map: google.maps.Map) => {
    const bounds = new window.google.maps.LatLngBounds();
    markers.forEach(marker => bounds.extend(marker.position));
    if (markers.length > 0) {
      map.fitBounds(bounds);
    } else {
      map.setCenter(center);
      map.setZoom(14);
    }
    setMap(map);
    onLoad?.(map);
  }, [center, markers, onLoad]);

  const handleUnmount = useCallback(() => {
    setMap(null);
  }, []);

  if (!isLoaded) {
    return <div className="w-full h-[300px] bg-accent animate-pulse rounded-lg" />;
  }

  return (
    <GoogleMap
      mapContainerStyle={containerStyle}
      center={center}
      zoom={14}
      onLoad={handleLoad}
      onUnmount={handleUnmount}
      options={{
        zoomControl: true,
        streetViewControl: false,
        mapTypeControl: false,
        fullscreenControl: false,
        styles: [
          {
            featureType: "poi",
            elementType: "labels",
            stylers: [{ visibility: "off" }]
          }
        ]
      }}
    >
      {markers.map((marker, index) => (
        <Marker
          key={index}
          position={marker.position}
          title={marker.title}
          animation={window.google.maps.Animation.DROP}
        />
      ))}
    </GoogleMap>
  );
}