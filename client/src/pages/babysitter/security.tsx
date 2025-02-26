import { useState } from "react";
import { useLocation } from "wouter";
import { motion } from "framer-motion";
import { MobileLayout } from "@/components/layout/mobile-layout";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { PasswordChangeForm } from "@/components/security/PasswordChangeForm";
import { TwoFactorSetup } from "@/components/security/TwoFactorSetup";
import { useToast } from "@/hooks/use-toast";
import { 
  ArrowLeft, 
  Shield, 
  Key, 
  Smartphone, 
  Lock, 
  ChevronRight,
  Laptop,
  Clock,
  LogOut
} from "lucide-react";

type Device = {
  id: string;
  name: string;
  type: string;
  lastUsed: string;
  isCurrentDevice: boolean;
};

type LoginActivity = {
  id: string;
  device: string;
  location: string;
  timestamp: string;
  status: "success" | "failed";
};

export default function BabysitterSecurity() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [showPasswordDialog, setShowPasswordDialog] = useState(false);
  const [show2FADialog, setShow2FADialog] = useState(false);
  const [showActivityDialog, setShowActivityDialog] = useState(false);
  const [is2FAEnabled, setIs2FAEnabled] = useState(false);
  const [isLoginVerificationEnabled, setIsLoginVerificationEnabled] = useState(true);

  // Simulated data
  const devices: Device[] = [
    {
      id: "1",
      name: "iPhone 13 Pro",
      type: "mobile",
      lastUsed: "Just now",
      isCurrentDevice: true,
    },
    {
      id: "2",
      name: "MacBook Pro",
      type: "desktop",
      lastUsed: "2 days ago",
      isCurrentDevice: false,
    }
  ];

  const loginActivity: LoginActivity[] = [
    {
      id: "1",
      device: "iPhone 13 Pro",
      location: "New York, USA",
      timestamp: "Just now",
      status: "success",
    },
    {
      id: "2",
      device: "Unknown Device",
      location: "London, UK",
      timestamp: "2 days ago",
      status: "failed",
    }
  ];

  const handleLogoutDevice = (deviceId: string) => {
    toast({
      title: "Device logged out",
      description: "The selected device has been logged out successfully.",
    });
  };

  return (
    <MobileLayout>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-4 pb-8"
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
          <h1 className="ml-4 font-semibold">Security</h1>
        </div>

        {/* Account Protection */}
        <Card>
          <CardHeader>
            <h2 className="text-sm font-medium text-muted-foreground">ACCOUNT PROTECTION</h2>
          </CardHeader>
          <CardContent className="p-4 space-y-4">
            <div 
              className="flex items-center justify-between cursor-pointer"
              onClick={() => setShowPasswordDialog(true)}
            >
              <div className="flex items-center space-x-3">
                <Key className="h-5 w-5 text-blue-500" />
                <div>
                  <p className="font-medium">Password</p>
                  <p className="text-sm text-muted-foreground">Last changed 30 days ago</p>
                </div>
              </div>
              <ChevronRight className="h-5 w-5 text-muted-foreground" />
            </div>

            <div 
              className="flex items-center justify-between cursor-pointer"
              onClick={() => !is2FAEnabled && setShow2FADialog(true)}
            >
              <div className="flex items-center space-x-3">
                <Smartphone className="h-5 w-5 text-green-500" />
                <div>
                  <p className="font-medium">Two-Factor Authentication</p>
                  <p className="text-sm text-muted-foreground">
                    <Badge 
                      variant="outline" 
                      className={is2FAEnabled ? "text-green-500 bg-green-50" : "text-red-500 bg-red-50"}
                    >
                      {is2FAEnabled ? "Enabled" : "Not Enabled"}
                    </Badge>
                  </p>
                </div>
              </div>
              <ChevronRight className="h-5 w-5 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>

        {/* Device Management */}
        <Card>
          <CardHeader>
            <h2 className="text-sm font-medium text-muted-foreground">DEVICE MANAGEMENT</h2>
          </CardHeader>
          <CardContent className="p-4 space-y-4">
            {devices.map(device => (
              <div key={device.id} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Laptop className="h-5 w-5 text-purple-500" />
                  <div>
                    <p className="font-medium">{device.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {device.isCurrentDevice ? `Current device · Last used ${device.lastUsed}` : `Last used ${device.lastUsed}`}
                    </p>
                  </div>
                </div>
                {device.isCurrentDevice ? (
                  <Badge variant="outline" className="text-green-500 bg-green-50">Active</Badge>
                ) : (
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => handleLogoutDevice(device.id)}
                  >
                    <LogOut className="h-4 w-4 mr-2" />
                    Logout
                  </Button>
                )}
              </div>
            ))}

            <div 
              className="flex items-center justify-between cursor-pointer"
              onClick={() => setShowActivityDialog(true)}
            >
              <div className="flex items-center space-x-3">
                <Clock className="h-5 w-5 text-orange-500" />
                <div>
                  <p className="font-medium">Login Activity</p>
                  <p className="text-sm text-muted-foreground">View recent sign-ins</p>
                </div>
              </div>
              <ChevronRight className="h-5 w-5 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>

        {/* Advanced Security */}
        <Card>
          <CardHeader>
            <h2 className="text-sm font-medium text-muted-foreground">ADVANCED SECURITY</h2>
          </CardHeader>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Shield className="h-5 w-5 text-cyan-500" />
                <div>
                  <p className="font-medium">Login Verification</p>
                  <p className="text-sm text-muted-foreground">Require verification code on new devices</p>
                </div>
              </div>
              <Switch 
                checked={isLoginVerificationEnabled}
                onCheckedChange={setIsLoginVerificationEnabled}
                className="data-[state=checked]:bg-green-500"
              />
            </div>
          </CardContent>
        </Card>

        {/* Dialogs */}
        <Dialog open={showPasswordDialog} onOpenChange={setShowPasswordDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Change Password</DialogTitle>
            </DialogHeader>
            <PasswordChangeForm onClose={() => setShowPasswordDialog(false)} />
          </DialogContent>
        </Dialog>

        <Dialog open={show2FADialog} onOpenChange={setShow2FADialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Set Up Two-Factor Authentication</DialogTitle>
            </DialogHeader>
            <TwoFactorSetup onClose={() => setShow2FADialog(false)} onEnable={() => setIs2FAEnabled(true)}/>
          </DialogContent>
        </Dialog>

        <Dialog open={showActivityDialog} onOpenChange={setShowActivityDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Login Activity</DialogTitle>
            </DialogHeader>
            <ScrollArea className="h-[400px] pr-4">
              <div className="space-y-4">
                {loginActivity.map(activity => (
                  <div key={activity.id} className="border-b pb-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">{activity.device}</p>
                        <p className="text-sm text-muted-foreground">{activity.location}</p>
                        <p className="text-sm text-muted-foreground">{activity.timestamp}</p>
                      </div>
                      <Badge 
                        variant="outline" 
                        className={activity.status === "success" ? 
                          "text-green-500 bg-green-50" : 
                          "text-red-500 bg-red-50"
                        }
                      >
                        {activity.status === "success" ? "Success" : "Failed"}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </DialogContent>
        </Dialog>
      </motion.div>
    </MobileLayout>
  );
}