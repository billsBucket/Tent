import { useQuery, useMutation } from "@tanstack/react-query";
import { useParams, useLocation } from "wouter";
import { motion } from "framer-motion";
import { format } from "date-fns";
import { MobileLayout } from "@/components/layout/mobile-layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Calendar } from "@/components/ui/calendar";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Star, ChevronLeft, Clock, Shield, Award } from "lucide-react";
import { queryClient, apiRequest } from "@/lib/queryClient";
import type { User, InsertBooking } from "@shared/schema";

export default function BabysitterDetail() {
  const { id } = useParams();
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  const { data: babysitter } = useQuery<User>({
    queryKey: [`/api/babysitters/${id}`],
  });

  const bookingMutation = useMutation({
    mutationFn: async (bookingData: InsertBooking) => {
      const res = await apiRequest("POST", "/api/bookings", bookingData);
      return res.json();
    },
    onSuccess: () => {
      toast({
        title: "Booking Requested",
        description: "The babysitter will be notified of your request.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/bookings"] });
    },
  });

  if (!babysitter) return null;

  return (
    <MobileLayout>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-6"
      >
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={() => setLocation("/parent/home")}
          className="mb-4"
        >
          <ChevronLeft className="h-4 w-4 mr-2" />
          Back to Search
        </Button>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <Avatar className="h-16 w-16">
                <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${babysitter.username}`} />
                <AvatarFallback>{babysitter.fullName[0]}</AvatarFallback>
              </Avatar>
              <div>
                <h1 className="text-2xl font-bold">{babysitter.fullName}</h1>
                <div className="flex items-center space-x-2 text-muted-foreground">
                  <Star className="h-4 w-4 text-yellow-500" />
                  <span>4.8 (124 reviews)</span>
                </div>
              </div>
            </div>

            <div className="mt-6 space-y-4">
              <div className="flex items-center space-x-2">
                <Shield className="h-5 w-5 text-green-500" />
                <span>Verified Identity</span>
              </div>
              <div className="flex items-center space-x-2">
                <Award className="h-5 w-5 text-blue-500" />
                <span>{babysitter.profileData?.experience}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Clock className="h-5 w-5" />
                <span>${babysitter.profileData?.hourlyRate}/hour</span>
              </div>
            </div>

            <div className="mt-6">
              <h3 className="font-medium mb-2">Certifications</h3>
              <div className="flex flex-wrap gap-2">
                {babysitter.profileData?.certifications?.map((cert, index) => (
                  <Badge key={index} variant="secondary">{cert}</Badge>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <h2 className="text-lg font-medium">Select Date & Time</h2>
          </CardHeader>
          <CardContent>
            <Calendar 
              mode="single"
              className="rounded-md border"
            />

            <div className="mt-4 space-y-4">
              <Button 
                className="w-full"
                onClick={() => {
                  bookingMutation.mutate({
                    parentId: 1, // Should come from auth context
                    babysitterId: babysitter.id,
                    startTime: new Date(),
                    endTime: new Date(),
                    status: "pending",
                  });
                }}
                disabled={bookingMutation.isPending}
              >
                Request Booking
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </MobileLayout>
  );
}
