import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { format } from "date-fns";
import { MobileLayout } from "@/components/layout/mobile-layout";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Switch } from "@/components/ui/switch";
import { useAuth } from "@/hooks/use-auth";
import { Calendar, Clock, DollarSign, MapPin } from "lucide-react";
import type { Booking } from "@shared/schema";
import GoogleMapComponent from '@/components/maps/GoogleMapComponent';
import { useLocationTracking } from '@/hooks/use-location-tracking';

export default function BabysitterDashboard() {
  const { user } = useAuth();
  const { data: bookings } = useQuery<Booking[]>({
    queryKey: [`/api/bookings/${user?.id}`],
  });

  const { location, watching, startTracking, stopTracking } = useLocationTracking({
    isTracker: true
  });

  const activeBooking = bookings?.find(b => b.status === "accepted");

  return (
    <MobileLayout>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-6"
      >
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Dashboard</h1>
            <p className="text-muted-foreground">Manage your bookings and availability</p>
          </div>
          <Avatar className="h-10 w-10">
            <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.username}`} />
            <AvatarFallback>{user?.fullName[0]}</AvatarFallback>
          </Avatar>
        </div>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <h2 className="font-medium">Online Status</h2>
                <p className="text-sm text-muted-foreground">Toggle to receive booking requests</p>
              </div>
              <Switch />
            </div>
          </CardContent>
        </Card>

        {activeBooking && (
          <Card>
            <CardContent className="p-6 space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <h2 className="font-medium">Location Tracking</h2>
                  <p className="text-sm text-muted-foreground">
                    Share your location while on duty
                  </p>
                </div>
                <Switch
                  checked={watching}
                  onCheckedChange={(checked) => {
                    if (checked) {
                      startTracking();
                    } else {
                      stopTracking();
                    }
                  }}
                />
              </div>

              {location && (
                <div className="h-[300px] relative rounded-lg overflow-hidden">
                  <GoogleMapComponent
                    center={location}
                    markers={[
                      {
                        position: location,
                        title: "Your Location"
                      }
                    ]}
                  />
                  <div className="absolute bottom-4 left-4 bg-background/80 backdrop-blur-sm p-2 rounded-lg flex items-center space-x-2">
                    <MapPin className="h-4 w-4 text-primary" />
                    <span className="text-sm">Live Location Active</span>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        <div className="grid grid-cols-2 gap-4">
          <Card>
            <CardContent className="p-4 text-center">
              <DollarSign className="h-8 w-8 mx-auto mb-2" />
              <div className="text-2xl font-bold">$240</div>
              <p className="text-sm text-muted-foreground">This Week</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <Clock className="h-8 w-8 mx-auto mb-2" />
              <div className="text-2xl font-bold">16</div>
              <p className="text-sm text-muted-foreground">Hours Worked</p>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <h2 className="text-lg font-medium">Upcoming Bookings</h2>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {bookings?.filter(b => b.status === "pending").map((booking) => (
                <motion.div
                  key={booking.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <Card>
                    <CardContent className="p-4">
                      <div className="flex items-center space-x-4">
                        <Calendar className="h-8 w-8 text-muted-foreground" />
                        <div className="flex-1">
                          <div className="font-medium">
                            {format(new Date(booking.startTime), "MMM d, yyyy")}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {format(new Date(booking.startTime), "h:mm a")} -
                            {format(new Date(booking.endTime), "h:mm a")}
                          </div>
                        </div>
                        <div className="space-x-2">
                          <Button variant="outline" size="sm">Decline</Button>
                          <Button size="sm">Accept</Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </MobileLayout>
  );
}