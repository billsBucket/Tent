import { useState } from "react";
import { useLocation } from "wouter";
import { motion } from "framer-motion";
import { MobileLayout } from "@/components/layout/mobile-layout";
import { Button } from "@/components/ui/button";
import { SmartAvailabilityCalendar } from "@/components/scheduling/SmartAvailabilityCalendar";
import { ArrowLeft, Calendar } from "lucide-react";

export default function BabysitterSchedule() {
  const [, setLocation] = useLocation();

  return (
    <MobileLayout>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-4 pb-20"
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
          <div className="ml-4">
            <h1 className="font-semibold">Schedule</h1>
            <p className="text-sm text-muted-foreground">
              Manage your availability
            </p>
          </div>
        </div>

        {/* Smart Calendar */}
        <div className="px-4">
          <SmartAvailabilityCalendar
            onAvailabilityChange={(availability) => {
              console.log("Availability updated:", availability);
              // Here we would save the availability to the backend
            }}
          />
        </div>
      </motion.div>
    </MobileLayout>
  );
}
