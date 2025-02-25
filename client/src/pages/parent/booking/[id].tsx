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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

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

  const [bookingDetails, setBookingDetails] = useState({
    duration: 2, // Default 2 hours
    children: [{ age: 0, specialNeeds: "" }]
  });

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

  const addChild = () => {
    setBookingDetails(prev => ({
      ...prev,
      children: [...prev.children, { age: 0, specialNeeds: "" }]
    }));
  };

  const updateChild = (index: number, field: string, value: string | number) => {
    setBookingDetails(prev => ({
      ...prev,
      children: prev.children.map((child, i) => 
        i === index ? { ...child, [field]: value } : child
      )
    }));
  };

  const calculateTotal = () => {
    if (!selectedService) return 0;
    const baseTotal = selectedService.baseRate * bookingDetails.duration;
    const childrenFee = bookingDetails.children.length > 1 ? 
      (bookingDetails.children.length - 1) * 5 * bookingDetails.duration : 0;
    return baseTotal + childrenFee;
  };

  const handleBookNow = () => {
    if (!selectedService || !babysitter) return;

    const startTime = new Date();
    const endTime = new Date(startTime.getTime() + (bookingDetails.duration * 60 * 60 * 1000));

    bookingMutation.mutate({
      babysitterId: babysitter.id,
      serviceType: selectedService.id,
      location: address,
      startTime: startTime.toISOString(),
      endTime: endTime.toISOString(),
      totalAmount: calculateTotal(),
      specialInstructions: JSON.stringify({
        children: bookingDetails.children,
        duration: bookingDetails.duration
      })
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
            <p className="text-muted-foreground">Choose your service details</p>
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

        <Card>
          <CardContent className="p-4 space-y-4">
            <div className="space-y-2">
              <Label>Location</Label>
              <Input value={address || ""} disabled />
            </div>

            <div className="space-y-2">
              <Label>Duration (hours)</Label>
              <Input
                type="number"
                min={1}
                value={bookingDetails.duration}
                onChange={(e) => setBookingDetails(prev => ({
                  ...prev,
                  duration: parseInt(e.target.value) || 1
                }))}
              />
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label>Children</Label>
                <Button type="button" variant="outline" size="sm" onClick={addChild}>
                  Add Child
                </Button>
              </div>

              {bookingDetails.children.map((child, index) => (
                <div key={index} className="space-y-2">
                  <Label>Child {index + 1}</Label>
                  <div className="grid grid-cols-2 gap-2">
                    <Input
                      type="number"
                      placeholder="Age"
                      value={child.age}
                      onChange={(e) => updateChild(index, 'age', parseInt(e.target.value) || 0)}
                    />
                    <Input
                      placeholder="Special needs (optional)"
                      value={child.specialNeeds}
                      onChange={(e) => updateChild(index, 'specialNeeds', e.target.value)}
                    />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <div className="rounded-lg overflow-hidden h-[200px]">
          <GoogleMapComponent
            center={{ lat: 40.7128, lng: -74.0060 }}
            markers={[{ position: { lat: 40.7128, lng: -74.0060 }, title: "Babysitting Location" }]}
          />
        </div>

        <ServiceTypeSelector onSelect={handleServiceSelect} />

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <span className="font-medium">Total Amount</span>
              <span className="text-xl font-bold">${calculateTotal()}</span>
            </div>
            <p className="text-sm text-muted-foreground mt-1">
              {bookingDetails.duration} hours × ${selectedService?.baseRate || 0}/hr
              {bookingDetails.children.length > 1 && ` + $${(bookingDetails.children.length - 1) * 5}/hr additional child fee`}
            </p>
          </CardContent>
        </Card>

        <Button
          className="w-full"
          size="lg"
          disabled={!selectedService || bookingMutation.isPending}
          onClick={handleBookNow}
        >
          {bookingMutation.isPending ? (
            <>Processing...</>
          ) : (
            <>Confirm Booking · ${calculateTotal()}</>
          )}
        </Button>
      </motion.div>
    </MobileLayout>
  );
}