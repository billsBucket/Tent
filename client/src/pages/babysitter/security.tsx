import { useState } from "react";
import { useLocation } from "wouter";
import { motion } from "framer-motion";
import { MobileLayout } from "@/components/layout/mobile-layout";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  ArrowLeft, 
  Shield, 
  Key, 
  Smartphone, 
  Lock, 
  ChevronRight,
  Laptop,
  Clock
} from "lucide-react";

export default function BabysitterSecurity() {
  const [, setLocation] = useLocation();
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [show2FASetup, setShow2FASetup] = useState(false);

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
            <div className="flex items-center justify-between cursor-pointer">
              <div className="flex items-center space-x-3">
                <Key className="h-5 w-5 text-blue-500" />
                <div>
                  <p className="font-medium">Password</p>
                  <p className="text-sm text-muted-foreground">Last changed 30 days ago</p>
                </div>
              </div>
              <ChevronRight className="h-5 w-5 text-muted-foreground" />
            </div>

            <div className="flex items-center justify-between cursor-pointer">
              <div className="flex items-center space-x-3">
                <Smartphone className="h-5 w-5 text-green-500" />
                <div>
                  <p className="font-medium">Two-Factor Authentication</p>
                  <p className="text-sm text-muted-foreground">
                    <Badge variant="outline" className="text-red-500 bg-red-50">Not Enabled</Badge>
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
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Laptop className="h-5 w-5 text-purple-500" />
                <div>
                  <p className="font-medium">iPhone 13 Pro</p>
                  <p className="text-sm text-muted-foreground">Current device · Last used just now</p>
                </div>
              </div>
              <Badge variant="outline" className="text-green-500 bg-green-50">Active</Badge>
            </div>

            <div className="flex items-center justify-between cursor-pointer">
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

        {/* Privacy & Safety */}
        <Card>
          <CardHeader>
            <h2 className="text-sm font-medium text-muted-foreground">PRIVACY & SAFETY</h2>
          </CardHeader>
          <CardContent className="p-4">
            <div className="flex items-center justify-between cursor-pointer">
              <div className="flex items-center space-x-3">
                <Lock className="h-5 w-5 text-red-500" />
                <div>
                  <p className="font-medium">Blocked Accounts</p>
                  <p className="text-sm text-muted-foreground">Manage blocked users</p>
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
              <Switch className="data-[state=checked]:bg-green-500" />
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </MobileLayout>
  );
}