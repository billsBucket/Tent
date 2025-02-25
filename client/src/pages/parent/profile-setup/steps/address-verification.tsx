import { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MapPin } from "lucide-react";
import PlacesAutocomplete from "@/components/maps/PlacesAutocomplete";
import GoogleMapComponent from "@/components/maps/GoogleMapComponent";

interface AddressVerificationStepProps {
  onComplete: (data: {
    address: string;
    location: { latitude: number; longitude: number };
  }) => void;
}

export default function AddressVerificationStep({ onComplete }: AddressVerificationStepProps) {
  const [selectedLocation, setSelectedLocation] = useState<{
    address: string;
    latitude: number;
    longitude: number;
  } | null>(null);

  const handlePlaceSelect = ({ address, latitude, longitude }: {
    address: string;
    latitude: number;
    longitude: number;
  }) => {
    setSelectedLocation({ address, latitude, longitude });
  };

  const handleConfirm = () => {
    if (selectedLocation) {
      onComplete({
        address: selectedLocation.address,
        location: {
          latitude: selectedLocation.latitude,
          longitude: selectedLocation.longitude,
        },
      });
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className="text-center space-y-2">
        <h2 className="text-xl font-semibold">Home Address</h2>
        <p className="text-muted-foreground">
          Enter your home address for babysitting services
        </p>
      </div>

      <Card>
        <CardContent className="p-6 space-y-4">
          <PlacesAutocomplete
            onPlaceSelect={handlePlaceSelect}
            placeholder="Enter your home address"
          />

          {selectedLocation && (
            <>
              <div className="h-[200px] rounded-lg overflow-hidden">
                <GoogleMapComponent
                  center={{
                    lat: selectedLocation.latitude,
                    lng: selectedLocation.longitude,
                  }}
                  markers={[
                    {
                      position: {
                        lat: selectedLocation.latitude,
                        lng: selectedLocation.longitude,
                      },
                      title: "Your Location",
                    },
                  ]}
                />
              </div>

              <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                <MapPin className="h-4 w-4" />
                <span>{selectedLocation.address}</span>
              </div>

              <Button
                className="w-full"
                onClick={handleConfirm}
              >
                Confirm Address
              </Button>
            </>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}
