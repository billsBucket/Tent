import { useState } from "react";
import { useLocation, useParams } from "wouter";
import { motion } from "framer-motion";
import { useMutation, useQuery } from "@tanstack/react-query";
import { MobileLayout } from "@/components/layout/mobile-layout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import ServiceTypeSelector from "@/components/booking/ServiceTypeSelector";
import GoogleMapComponent from "@/components/maps/GoogleMapComponent";
import { ArrowLeft, Clock, Shield } from "lucide-react";
import type { User, Booking } from "@shared/schema";
import { apiRequest, queryClient } from "@/lib/queryClient";

export default function BookingPage() {
  const { id } = useParams();
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const searchParams = new URLSearchParams(window.location.search);
  const address = searchParams.get("address");

  const [selectedService, setSelectedService] = useState<{
    id: string;
    name: string;
    baseRate: number;
  }>();

  const { data: babysitter } = useQuery<User>({
    queryKey: [`/api/babysitters/${id}`],
  });

  const bookingMutation = useMutation({
    mutationFn: async (bookingData: any) => {
      const res = await apiRequest("POST", "/api/bookings", bookingData);
      return res.json();
    },
    onSuccess: (booking: Booking) => {
      queryClient.invalidateQueries({ queryKey: ["/api/bookings"] });
      setLocation(`/parent/booking/${booking.id}/tracking`);
    },
    onError: (error: Error) => {
      toast({
        title: "Booking failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleServiceSelect = (service: { id: string; name: string; baseRate: number }) => {
    setSelectedService(service);
  };

  const handleBookNow = () => {
    if (!selectedService || !babysitter) return;

    bookingMutation.mutate({
      babysitterId: babysitter.id,
      serviceType: selectedService.id,
      location: address,
      startTime: new Date().toISOString(), // TODO: Add time selection
      endTime: new Date(Date.now() + 3600000).toISOString(), // Default to 1 hour
      totalAmount: selectedService.baseRate,
    });
  };

  return (
    <MobileLayout>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-6"
      >
        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setLocation("/parent/home")}
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold">Book a Babysitter</h1>
            <p className="text-muted-foreground">Choose your service type</p>
          </div>
        </div>

        {babysitter && (
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-4">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <Shield className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-medium">{babysitter.fullName}</h3>
                  <p className="text-sm text-muted-foreground flex items-center">
                    <Clock className="h-4 w-4 mr-1" />
                    Arrives in 15-20 mins
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        <div className="rounded-lg overflow-hidden h-[200px]">
          <GoogleMapComponent
            center={{ lat: 40.7128, lng: -74.0060 }}
            markers={[{ position: { lat: 40.7128, lng: -74.0060 }, title: "Pickup Location" }]}
          />
        </div>

        <ServiceTypeSelector onSelect={handleServiceSelect} />

        <Button
          className="w-full"
          size="lg"
          disabled={!selectedService || bookingMutation.isPending}
          onClick={handleBookNow}
        >
          {bookingMutation.isPending ? (
            <>Processing...</>
          ) : (
            <>Book Now · ${selectedService?.baseRate || 0}/hr</>
          )}
        </Button>
      </motion.div>
    </MobileLayout>
  );
}
