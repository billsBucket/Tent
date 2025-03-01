import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { format } from "date-fns";
import { MobileLayout } from "@/components/layout/mobile-layout";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/hooks/use-auth";
import {
  Calendar,
  Clock,
  DollarSign,
  MapPin,
  Settings,
  User,
  MessageSquare,
  Bell,
  ChevronRight,
  AlertCircle
} from "lucide-react";
import type { Booking } from "@shared/schema";
import { useLocation } from "wouter";
import GoogleMapComponent from '@/components/maps/GoogleMapComponent';
import { useLocationTracking } from '@/hooks/use-location-tracking';

export default function BabysitterDashboard() {
  const { user } = useAuth();
  const [, setLocation] = useLocation();
  const [isOnline, setIsOnline] = useState(false);

  const { data: bookings } = useQuery<Booking[]>({
    queryKey: [`/api/bookings/${user?.id}`],
  });

  const { location, watching, startTracking, stopTracking } = useLocationTracking({
    isTracker: true
  });

  const activeBooking = bookings?.find(b => b.status === "accepted");
  const todaysEarnings = 120; // TODO: Calculate from actual bookings
  const weeklyEarnings = 840;
  const totalHours = 16;

  // Effect to start/stop location tracking based on online status
  useEffect(() => {
    if (isOnline) {
      startTracking();
    } else {
      stopTracking();
    }
  }, [isOnline, startTracking, stopTracking]);

  return (
    <MobileLayout>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-4 pb-20"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 bg-background border-b sticky top-0 z-10">
          <div className="flex items-center space-x-3">
            <Avatar
              className="h-10 w-10 cursor-pointer"
              onClick={() => setLocation("/babysitter/profile")}
            >
              <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.username}`} />
              <AvatarFallback>{user?.fullName[0]}</AvatarFallback>
            </Avatar>
            <div>
              <h2 className="font-semibold">Hello, {user?.fullName?.split(' ')[0]}</h2>
              <p className="text-sm text-muted-foreground">Babysitter</p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <Button 
              variant="ghost" 
              size="icon"
              onClick={() => setLocation("/babysitter/notifications")}
            >
              <div className="relative">
                <Bell className="h-5 w-5" />
                <Badge 
                  className="absolute -top-2 -right-2 h-4 w-4 p-0 flex items-center justify-center"
                  variant="destructive"
                >
                  2
                </Badge>
              </div>
            </Button>
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => setLocation("/babysitter/settings")}
            >
              <Settings className="h-5 w-5" />
            </Button>
          </div>
        </div>

        {/* Online Toggle with Map */}
        <Card>
          <CardContent className="p-4 space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <h3 className="font-medium">Go Online</h3>
                <p className="text-sm text-muted-foreground">
                  {isOnline ? "You're available for bookings" : "You're currently offline"}
                </p>
              </div>
              <Switch
                checked={isOnline}
                onCheckedChange={setIsOnline}
                className="data-[state=checked]:bg-green-500"
              />
            </div>

            {isOnline && location && (
              <div className="h-[200px] relative rounded-lg overflow-hidden">
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
                  <MapPin className="h-4 w-4 text-green-500" />
                  <span className="text-sm">Live Location Active</span>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Active Booking Alert */}
        {activeBooking && (
          <Card className="border-primary">
            <CardContent className="p-4">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-primary/10 rounded-full">
                  <AlertCircle className="h-6 w-6 text-primary" />
                </div>
                <div className="flex-1">
                  <h3 className="font-medium">Active Booking</h3>
                  <p className="text-sm text-muted-foreground">
                    {format(new Date(activeBooking.startTime), "h:mm a")} - 
                    {format(new Date(activeBooking.endTime), "h:mm a")}
                  </p>
                </div>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => setLocation(`/babysitter/booking/${activeBooking.id}`)}
                >
                  View
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Today's Summary */}
        <Card>
          <CardHeader className="pb-3">
            <h3 className="font-medium">Today's Summary</h3>
          </CardHeader>
          <CardContent className="grid grid-cols-3 gap-4 p-4">
            <div className="text-center">
              <DollarSign className="h-6 w-6 mx-auto mb-1 text-green-500" />
              <div className="text-xl font-bold text-green-600">${todaysEarnings}</div>
              <p className="text-xs text-muted-foreground">Earnings</p>
            </div>
            <div className="text-center">
              <Clock className="h-6 w-6 mx-auto mb-1 text-blue-500" />
              <div className="text-xl font-bold text-blue-600">{totalHours}</div>
              <p className="text-xs text-muted-foreground">Hours</p>
            </div>
            <div className="text-center">
              <Calendar className="h-6 w-6 mx-auto mb-1 text-purple-500" />
              <div className="text-xl font-bold text-purple-600">{bookings?.length || 0}</div>
              <p className="text-xs text-muted-foreground">Bookings</p>
            </div>
          </CardContent>
        </Card>

        {/* Weekly Earnings */}
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-medium">This Week's Earnings</h3>
                <p className="text-sm text-muted-foreground">
                  {format(new Date(), "MMM d")} - {format(new Date(), "MMM d")}
                </p>
              </div>
              <Button 
                variant="ghost" 
                size="icon"
                onClick={() => setLocation("/babysitter/earnings")}
              >
                <ChevronRight className="h-5 w-5" />
              </Button>
            </div>
            <div className="text-3xl font-bold mb-2 text-green-600">${weeklyEarnings}</div>
            <div className="h-2 bg-green-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-green-500 transition-all"
                style={{ width: `${(todaysEarnings / weeklyEarnings) * 100}%` }}
              />
            </div>
          </CardContent>
        </Card>

        {/* Upcoming Bookings */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <h3 className="font-medium">Upcoming Bookings</h3>
              <Button variant="ghost" size="sm">
                View All
              </Button>
            </div>
          </CardHeader>
          <CardContent className="p-4 space-y-4">
            {bookings?.filter(b => b.status === "pending").map((booking) => (
              <motion.div
                key={booking.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center space-x-4">
                      <Calendar className="h-8 w-8 text-purple-500" />
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
          </CardContent>
        </Card>

        {/* Navigation Grid */}
        <div className="grid grid-cols-4 gap-4 mt-4"> {/* Moved Quick Actions here */}
          <Button
            variant="ghost"
            className="flex flex-col items-center space-y-1"
            onClick={() => setLocation("/babysitter/profile")}
          >
            <User className="h-6 w-6 text-purple-500" />
            <span className="text-xs">Profile</span>
          </Button>
          <Button
            variant="ghost"
            className="flex flex-col items-center space-y-1"
            onClick={() => setLocation("/babysitter/messages")}
          >
            <MessageSquare className="h-6 w-6 text-blue-500" />
            <span className="text-xs">Messages</span>
          </Button>
          <Button
            variant="ghost"
            className="flex flex-col items-center space-y-1"
            onClick={() => setLocation("/babysitter/earnings")}
          >
            <DollarSign className="h-6 w-6 text-green-500" />
            <span className="text-xs">Earnings</span>
          </Button>
          <Button
            variant="ghost"
            className="flex flex-col items-center space-y-1"
            onClick={() => setLocation("/babysitter/schedule")}
          >
            <Calendar className="h-6 w-6 text-orange-500" />
            <span className="text-xs">Schedule</span>
          </Button>
        </div>
      </motion.div>
    </MobileLayout>
  );
}