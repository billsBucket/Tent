import { useEffect } from "react";
import { useParams } from "wouter";
import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { MobileLayout } from "@/components/layout/mobile-layout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Phone, MessageSquare, Clock, MapPin } from "lucide-react";
import type { Booking, User } from "@shared/schema";
import GoogleMapComponent from "@/components/maps/GoogleMapComponent";
import { useLocationTracking } from "@/hooks/use-location-tracking";

export default function BookingTrackingPage() {
  const { id } = useParams();
  
  const { data: booking } = useQuery<Booking>({
    queryKey: [`/api/bookings/${id}`],
  });

  const { data: babysitter } = useQuery<User>({
    queryKey: [`/api/babysitters/${booking?.babysitterId}`],
    enabled: !!booking?.babysitterId,
  });

  const { location } = useLocationTracking({
    bookingId: parseInt(id!),
    isTracker: false,
  });

  return (
    <MobileLayout>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="h-screen flex flex-col"
      >
        {/* Map taking up most of the screen */}
        <div className="flex-1 relative">
          <GoogleMapComponent
            center={location || { lat: 40.7128, lng: -74.0060 }}
            markers={location ? [
              {
                position: location,
                title: `${babysitter?.fullName}'s location`
              }
            ] : []}
          />
        </div>

        {/* Sliding panel at bottom */}
        <Card className="rounded-t-xl shadow-lg">
          <CardContent className="p-4 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <Avatar className="h-12 w-12">
                  <AvatarImage
                    src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${babysitter?.username}`}
                  />
                  <AvatarFallback>{babysitter?.fullName?.[0]}</AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="font-medium">{babysitter?.fullName}</h3>
                  <p className="text-sm text-muted-foreground flex items-center">
                    <Clock className="h-4 w-4 mr-1" />
                    Arriving in 10 mins
                  </p>
                </div>
              </div>
              <div className="flex space-x-2">
                <Button variant="outline" size="icon">
                  <MessageSquare className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="icon">
                  <Phone className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-start space-x-2">
                <MapPin className="h-4 w-4 mt-1 text-primary" />
                <div>
                  <p className="text-sm font-medium">Location</p>
                  <p className="text-sm text-muted-foreground">
                    {booking?.location || "Loading..."}
                  </p>
                </div>
              </div>
            </div>

            <Button className="w-full" variant="destructive">
              Emergency Contact
            </Button>
          </CardContent>
        </Card>
      </motion.div>
    </MobileLayout>
  );
}
