import { useState } from "react";
import { useLocation } from "wouter";
import { motion } from "framer-motion";
import { MobileLayout } from "@/components/layout/mobile-layout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, MessageCircle, Phone, FileText, ChevronRight } from "lucide-react";

export default function BabysitterHelp() {
  const [, setLocation] = useLocation();

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
            onClick={() => setLocation("/babysitter/settings")}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="ml-4 font-semibold">Help & Support</h1>
        </div>

        <Card>
          <CardContent className="p-4 space-y-4">
            <div className="flex items-center justify-between cursor-pointer">
              <div className="flex items-center space-x-3">
                <MessageCircle className="h-5 w-5 text-blue-500" />
                <div>
                  <p className="font-medium">Chat with Support</p>
                  <p className="text-sm text-muted-foreground">Get help from our team</p>
                </div>
              </div>
              <ChevronRight className="h-5 w-5 text-muted-foreground" />
            </div>

            <div className="flex items-center justify-between cursor-pointer">
              <div className="flex items-center space-x-3">
                <Phone className="h-5 w-5 text-green-500" />
                <div>
                  <p className="font-medium">Call Support</p>
                  <p className="text-sm text-muted-foreground">Speak with an agent</p>
                </div>
              </div>
              <ChevronRight className="h-5 w-5 text-muted-foreground" />
            </div>

            <div className="flex items-center justify-between cursor-pointer">
              <div className="flex items-center space-x-3">
                <FileText className="h-5 w-5 text-purple-500" />
                <div>
                  <p className="font-medium">FAQs</p>
                  <p className="text-sm text-muted-foreground">Browse common questions</p>
                </div>
              </div>
              <ChevronRight className="h-5 w-5 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </MobileLayout>
  );
}