import { useState } from "react";
import { useLocation } from "wouter";
import { motion } from "framer-motion";
import { MobileLayout } from "@/components/layout/mobile-layout";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/hooks/use-auth";
import { 
  ArrowLeft, 
  Camera,
  Star,
  Award,
  Clock,
  Shield,
  MapPin
} from "lucide-react";

export default function BabysitterProfile() {
  const [, setLocation] = useLocation();
  const { user } = useAuth();

  return (
    <MobileLayout>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-4"
      >
        {/* Header */}
        <div className="flex items-center p-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setLocation("/babysitter/dashboard")}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="ml-4 font-semibold">Profile</h1>
        </div>

        {/* Profile Header with Background */}
        <div className="relative">
          <div className="h-32 bg-primary/10" />
          <div className="px-4">
            <div className="relative -mt-16 mb-20"> {/* Increased bottom margin */}
              <Avatar className="h-32 w-32 border-4 border-background mx-auto">
                <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.username}`} />
                <AvatarFallback>{user?.fullName[0]}</AvatarFallback>
              </Avatar>
              <Button
                size="icon"
                className="absolute bottom-0 right-1/2 translate-x-12 rounded-full bg-primary"
              >
                <Camera className="h-4 w-4 text-white" />
              </Button>
            </div>
          </div>
        </div>

        {/* Basic Info */}
        <Card>
          <CardContent className="p-6 text-center">
            <h2 className="text-xl font-semibold">{user?.fullName}</h2>
            <div className="flex items-center justify-center mt-2 space-x-2">
              <div className="flex items-center">
                <Star className="h-4 w-4 text-yellow-500" />
                <span className="font-medium ml-1">4.8</span>
              </div>
              <span className="text-muted-foreground">(124 reviews)</span>
            </div>
            <div className="flex justify-center gap-2 mt-4">
              <Badge variant="secondary" className="bg-blue-100 text-blue-700">
                <Clock className="h-4 w-4 mr-1" />
                2+ years
              </Badge>
              <Badge variant="secondary" className="bg-green-100 text-green-700">
                <Shield className="h-4 w-4 mr-1" />
                Verified
              </Badge>
              <Badge variant="secondary" className="bg-purple-100 text-purple-700">
                <MapPin className="h-4 w-4 mr-1" />
                New York
              </Badge>
            </div>
          </CardContent>
        </Card>

        {/* Experience & Certifications */}
        <Card>
          <CardHeader>
            <div className="flex items-center">
              <Award className="h-5 w-5 mr-2 text-blue-500" />
              <h3 className="font-medium">Experience & Certifications</h3>
            </div>
          </CardHeader>
          <CardContent className="p-6 space-y-4">
            <div>
              <Label>Years of Experience</Label>
              <Input value="2" disabled />
            </div>
            <div>
              <Label>Certifications</Label>
              <div className="flex flex-wrap gap-2 mt-2">
                <Badge className="bg-red-100 text-red-700">First Aid Certified</Badge>
                <Badge className="bg-blue-100 text-blue-700">CPR Certified</Badge>
                <Badge className="bg-green-100 text-green-700">Child Care License</Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Bio */}
        <Card>
          <CardHeader>
            <h3 className="font-medium">About Me</h3>
          </CardHeader>
          <CardContent className="p-6">
            <p className="text-muted-foreground">
              Experienced babysitter with a passion for childcare. I believe in creating
              a safe, fun, and educational environment for children. Certified in First Aid
              and CPR.
            </p>
          </CardContent>
        </Card>

        {/* Availability */}
        <Card>
          <CardHeader>
            <h3 className="font-medium">Availability</h3>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Monday - Friday</span>
                <span className="text-primary-foreground bg-primary px-2 py-1 rounded-md text-sm">9:00 AM - 6:00 PM</span>
              </div>
              <div className="flex justify-between">
                <span>Saturday</span>
                <span className="text-primary-foreground bg-primary px-2 py-1 rounded-md text-sm">10:00 AM - 4:00 PM</span>
              </div>
              <div className="flex justify-between">
                <span>Sunday</span>
                <span className="text-destructive">Unavailable</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </MobileLayout>
  );
}