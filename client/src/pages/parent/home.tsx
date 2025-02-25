import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { motion } from "framer-motion";
import { MobileLayout } from "@/components/layout/mobile-layout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Loader2, MapPin, Star, Clock } from "lucide-react";
import type { User } from "@shared/schema";
import GoogleMapComponent from "@/components/maps/GoogleMapComponent";
import PlacesAutocomplete from "@/components/maps/PlacesAutocomplete";

export default function ParentHome() {
  const [, setLocation] = useLocation();
  const [mapCenter, setMapCenter] = useState({
    lat: 40.7128,
    lng: -74.0060
  });
  const [selectedAddress, setSelectedAddress] = useState("");
  const [isSearching, setIsSearching] = useState(false);

  const { data: babysitters, isLoading } = useQuery<User[]>({
    queryKey: ["/api/babysitters"],
  });

  const handlePlaceSelect = ({ address, latitude, longitude }: { 
    address: string;
    latitude: number;
    longitude: number;
  }) => {
    setSelectedAddress(address);
    setMapCenter({ lat: latitude, lng: longitude });
    setIsSearching(true);
  };

  const handleBookBabysitter = (sitterId: number) => {
    setLocation(`/parent/booking/${sitterId}?address=${encodeURIComponent(selectedAddress)}`);
  };

  const babysitterMarkers = babysitters?.map(sitter => ({
    position: { lat: 40.7128, lng: -74.0060 }, // TODO: Use actual babysitter locations
    title: sitter.fullName
  })) || [];

  return (
    <div className="h-screen flex flex-col">
      {/* Fixed search bar at top */}
      <div className="absolute top-0 left-0 right-0 z-10 p-4 bg-background/80 backdrop-blur-sm">
        <PlacesAutocomplete
          onPlaceSelect={handlePlaceSelect}
          placeholder="Where do you need a babysitter?"
        />
      </div>

      {/* Full-height map */}
      <div className="flex-1">
        <GoogleMapComponent
          center={mapCenter}
          markers={babysitterMarkers}
        />
      </div>

      {/* Sliding panel for babysitter selection */}
      {isSearching && (
        <motion.div
          initial={{ y: "100%" }}
          animate={{ y: "0%" }}
          className="absolute bottom-0 left-0 right-0 bg-background rounded-t-xl shadow-lg"
          style={{ maxHeight: "60vh" }}
        >
          <div className="p-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">Available Babysitters</h2>
              <p className="text-sm text-muted-foreground">
                {babysitters?.length || 0} nearby
              </p>
            </div>

            <div className="space-y-3 max-h-[calc(60vh-8rem)] overflow-auto">
              {isLoading ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
              ) : (babysitters || []).map((sitter) => (
                <motion.div
                  key={sitter.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <Card>
                    <CardContent className="p-4">
                      <div className="flex items-center space-x-4">
                        <Avatar className="h-12 w-12">
                          <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${sitter.username}`} />
                          <AvatarFallback>{sitter.fullName[0]}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <h3 className="font-medium">{sitter.fullName}</h3>
                          <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                            <Star className="h-4 w-4" />
                            <span>{sitter.profileData?.rating || "4.8"}</span>
                            <Clock className="h-4 w-4 ml-2" />
                            <span>${sitter.profileData?.hourlyRate || "15"}/hr</span>
                          </div>
                        </div>
                        <Button
                          variant="default"
                          onClick={() => handleBookBabysitter(sitter.id)}
                        >
                          Book Now
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}