import { useLocation } from "wouter";
import { motion } from "framer-motion";
import { MobileLayout } from "@/components/layout/mobile-layout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { ArrowLeft, Eye, Globe, Phone } from "lucide-react";

export default function BabysitterPrivacy() {
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
          <h1 className="ml-4 font-semibold">Privacy</h1>
        </div>

        <Card>
          <CardContent className="p-4 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Globe className="h-5 w-5 text-blue-500" />
                <div>
                  <p className="font-medium">Profile Visibility</p>
                  <p className="text-sm text-muted-foreground">Show profile to verified parents</p>
                </div>
              </div>
              <Switch className="data-[state=checked]:bg-green-500" defaultChecked />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Phone className="h-5 w-5 text-green-500" />
                <div>
                  <p className="font-medium">Phone Number</p>
                  <p className="text-sm text-muted-foreground">Show phone number to matched parents</p>
                </div>
              </div>
              <Switch className="data-[state=checked]:bg-green-500" defaultChecked />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Eye className="h-5 w-5 text-purple-500" />
                <div>
                  <p className="font-medium">Online Status</p>
                  <p className="text-sm text-muted-foreground">Show when you're online</p>
                </div>
              </div>
              <Switch className="data-[state=checked]:bg-green-500" defaultChecked />
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </MobileLayout>
  );
}