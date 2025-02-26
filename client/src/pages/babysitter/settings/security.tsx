import { useLocation } from "wouter";
import { motion } from "framer-motion";
import { MobileLayout } from "@/components/layout/mobile-layout";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { 
  ArrowLeft,
  Lock,
  Fingerprint,
  Smartphone,
  Shield
} from "lucide-react";

export function SecurityPage() {
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
          <h1 className="ml-4 font-semibold">Security</h1>
        </div>

        {/* Two-Factor Authentication */}
        <Card>
          <CardHeader>
            <div className="flex items-center space-x-2">
              <Shield className="h-5 w-5 text-primary" />
              <h3 className="font-medium">Two-Factor Authentication</h3>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Enable 2FA</p>
                <p className="text-sm text-muted-foreground">
                  Add an extra layer of security to your account
                </p>
              </div>
              <Switch />
            </div>
          </CardContent>
        </Card>

        {/* Biometric Authentication */}
        <Card>
          <CardHeader>
            <div className="flex items-center space-x-2">
              <Fingerprint className="h-5 w-5 text-primary" />
              <h3 className="font-medium">Biometric Authentication</h3>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Use Face ID / Touch ID</p>
                <p className="text-sm text-muted-foreground">
                  Quick and secure access to your account
                </p>
              </div>
              <Switch />
            </div>
          </CardContent>
        </Card>

        {/* Device Management */}
        <Card>
          <CardHeader>
            <div className="flex items-center space-x-2">
              <Smartphone className="h-5 w-5 text-primary" />
              <h3 className="font-medium">Device Management</h3>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Current Device</p>
                <p className="text-sm text-muted-foreground">
                  iPhone 13 Pro • Last active now
                </p>
              </div>
              <Button variant="outline" size="sm">
                Manage
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Change Password */}
        <Card>
          <CardHeader>
            <div className="flex items-center space-x-2">
              <Lock className="h-5 w-5 text-primary" />
              <h3 className="font-medium">Change Password</h3>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Current Password</Label>
              <Input type="password" />
            </div>
            <div className="space-y-2">
              <Label>New Password</Label>
              <Input type="password" />
            </div>
            <div className="space-y-2">
              <Label>Confirm New Password</Label>
              <Input type="password" />
            </div>
            <Button className="w-full">Update Password</Button>
          </CardContent>
        </Card>
      </motion.div>
    </MobileLayout>
  );
}

export default SecurityPage;
