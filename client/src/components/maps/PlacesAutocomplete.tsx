import { useState, useEffect, useRef } from 'react';
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { MapPin, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface PlacesAutocompleteProps {
  onPlaceSelect: (place: {
    address: string;
    latitude: number;
    longitude: number;
  }) => void;
  placeholder?: string;
}

export default function PlacesAutocomplete({ onPlaceSelect, placeholder = "Enter location..." }: PlacesAutocompleteProps) {
  const [inputValue, setInputValue] = useState("");
  const [predictions, setPredictions] = useState<google.maps.places.AutocompletePrediction[]>([]);
  const [loading, setLoading] = useState(false);
  const autocompleteService = useRef<google.maps.places.AutocompleteService | null>(null);
  const placesService = useRef<google.maps.places.PlacesService | null>(null);
  const sessionToken = useRef<google.maps.places.AutocompleteSessionToken | null>(null);

  useEffect(() => {
    if (window.google && window.google.maps) {
      autocompleteService.current = new google.maps.places.AutocompleteService();
      placesService.current = new google.maps.places.PlacesService(
        document.createElement('div')
      );
      sessionToken.current = new google.maps.places.AutocompleteSessionToken();
    }
  }, []);

  const getPlacePredictions = async (input: string) => {
    if (!input || !autocompleteService.current || input.length < 3) return;

    setLoading(true);
    try {
      const response = await autocompleteService.current.getPlacePredictions({
        input,
        sessionToken: sessionToken.current || undefined,
        componentRestrictions: { country: 'us' },
        types: ['address', 'establishment', 'geocode']
      });
      setPredictions(response.predictions);
    } catch (error) {
      console.error('Error fetching predictions:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePlaceSelect = (prediction: google.maps.places.AutocompletePrediction) => {
    if (!placesService.current) return;

    placesService.current.getDetails(
      {
        placeId: prediction.place_id,
        fields: ['formatted_address', 'geometry', 'name'],
        sessionToken: sessionToken.current || undefined
      },
      (place, status) => {
        if (status === google.maps.places.PlacesServiceStatus.OK && place?.geometry?.location) {
          onPlaceSelect({
            address: place.formatted_address || prediction.description,
            latitude: place.geometry.location.lat(),
            longitude: place.geometry.location.lng()
          });
          setInputValue(prediction.description);
          setPredictions([]);
          // Generate new session token after selection
          sessionToken.current = new google.maps.places.AutocompleteSessionToken();
        }
      }
    );
  };

  return (
    <div className="relative">
      <div className="relative">
        <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          value={inputValue}
          onChange={(e) => {
            const value = e.target.value;
            setInputValue(value);
            getPlacePredictions(value);
          }}
          placeholder={placeholder}
          className="pl-10"
        />
        {loading && (
          <Loader2 className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 animate-spin" />
        )}
      </div>

      {predictions.length > 0 && (
        <Card className="absolute z-10 w-full mt-1 shadow-lg">
          <div className="p-1">
            {predictions.map((prediction) => (
              <Button
                key={prediction.place_id}
                variant="ghost"
                className="w-full justify-start text-left"
                onClick={() => handlePlaceSelect(prediction)}
              >
                <MapPin className="h-4 w-4 mr-2 flex-shrink-0" />
                <span className="truncate">{prediction.description}</span>
              </Button>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
}