import { useEffect } from "react";
import { useParams, useLocation } from "wouter";
import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { MobileLayout } from "@/components/layout/mobile-layout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Phone, MessageSquare, AlertTriangle } from "lucide-react";
import type { Booking, User } from "@shared/schema";
import { LocationTracker } from "@/components/tracking/LocationTracker";
import { useToast } from "@/hooks/use-toast";

export default function BookingTrackingPage() {
  const { id } = useParams();
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  const { data: booking } = useQuery<Booking>({
    queryKey: [`/api/bookings/${id}`],
  });

  const { data: babysitter } = useQuery<User>({
    queryKey: [`/api/babysitters/${booking?.babysitterId}`],
    enabled: !!booking?.babysitterId,
  });

  const handleCall = () => {
    // In a production app, this would integrate with a calling service
    toast({
      title: "Initiating Call",
      description: "Connecting to babysitter...",
    });
  };

  const handleMessage = () => {
    setLocation(`/parent/messages?babysitter=${babysitter?.id}`);
  };

  if (!booking || !babysitter) {
    return (
      <MobileLayout>
        <div className="flex items-center justify-center min-h-screen">
          <p>Loading...</p>
        </div>
      </MobileLayout>
    );
  }

  return (
    <MobileLayout>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="h-screen flex flex-col"
      >
        {/* Location Tracker Map */}
        <div className="flex-1">
          <LocationTracker 
            bookingId={id!} 
            babysitterId={babysitter.id}
          />
        </div>

        {/* Bottom Panel */}
        <Card className="rounded-t-xl shadow-lg">
          <CardContent className="p-4 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <Avatar className="h-12 w-12">
                  <AvatarImage
                    src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${babysitter.username}`}
                  />
                  <AvatarFallback>{babysitter.fullName?.[0]}</AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="font-medium">{babysitter.fullName}</h3>
                  <p className="text-sm text-muted-foreground">
                    Currently with {booking.childrenNames?.join(" & ")}
                  </p>
                </div>
              </div>
              <div className="flex space-x-2">
                <Button variant="outline" size="icon" onClick={handleMessage}>
                  <MessageSquare className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="icon" onClick={handleCall}>
                  <Phone className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div className="pt-2">
              <Button className="w-full" variant="destructive" size="lg">
                <AlertTriangle className="h-5 w-5 mr-2" />
                Emergency SOS
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </MobileLayout>
  );
}