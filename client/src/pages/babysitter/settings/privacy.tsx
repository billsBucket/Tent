import { useLocation } from "wouter";
import { motion } from "framer-motion";
import { MobileLayout } from "@/components/layout/mobile-layout";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { 
  ArrowLeft,
  Eye,
  UserCircle,
  Bell,
  Share2
} from "lucide-react";

export function PrivacyPage() {
  const [, setLocation] = useLocation();

  return (
    <MobileLayout>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-4"
      >
        {/* Header */}
        <div className="flex items-center p-4 border-b">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setLocation("/babysitter/settings")}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="ml-4 font-semibold">Privacy</h1>
        </div>

        {/* Profile Visibility */}
        <Card>
          <CardHeader>
            <div className="flex items-center space-x-2">
              <UserCircle className="h-5 w-5 text-primary" />
              <h3 className="font-medium">Profile Visibility</h3>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Show Online Status</p>
                <p className="text-sm text-muted-foreground">
                  Let parents see when you're available
                </p>
              </div>
              <Switch defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Show Last Active</p>
                <p className="text-sm text-muted-foreground">
                  Display when you were last online
                </p>
              </div>
              <Switch defaultChecked />
            </div>
          </CardContent>
        </Card>

        {/* Location Sharing */}
        <Card>
          <CardHeader>
            <div className="flex items-center space-x-2">
              <Share2 className="h-5 w-5 text-primary" />
              <h3 className="font-medium">Location Sharing</h3>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Share Location While Working</p>
                <p className="text-sm text-muted-foreground">
                  Required for active bookings
                </p>
              </div>
              <Switch defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Location History</p>
                <p className="text-sm text-muted-foreground">
                  Save your work location history
                </p>
              </div>
              <Switch />
            </div>
          </CardContent>
        </Card>

        {/* Data Usage */}
        <Card>
          <CardHeader>
            <div className="flex items-center space-x-2">
              <Eye className="h-5 w-5 text-primary" />
              <h3 className="font-medium">Data Usage</h3>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Analytics Sharing</p>
                <p className="text-sm text-muted-foreground">
                  Help improve our services
                </p>
              </div>
              <Switch defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Personalized Content</p>
                <p className="text-sm text-muted-foreground">
                  Receive tailored recommendations
                </p>
              </div>
              <Switch defaultChecked />
            </div>
          </CardContent>
        </Card>

        {/* Communication Preferences */}
        <Card>
          <CardHeader>
            <div className="flex items-center space-x-2">
              <Bell className="h-5 w-5 text-primary" />
              <h3 className="font-medium">Communication</h3>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Marketing Emails</p>
                <p className="text-sm text-muted-foreground">
                  Receive updates and promotions
                </p>
              </div>
              <Switch />
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </MobileLayout>
  );
}

export default PrivacyPage;
