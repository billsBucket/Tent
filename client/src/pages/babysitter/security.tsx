import { useLocation } from "wouter";
import { motion } from "framer-motion";
import { MobileLayout } from "@/components/layout/mobile-layout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Shield, Key, Smartphone, Lock, ChevronRight } from "lucide-react";

export default function BabysitterSecurity() {
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
          <h1 className="ml-4 font-semibold">Security</h1>
        </div>

        <Card>
          <CardContent className="p-4 space-y-4">
            <div className="flex items-center justify-between cursor-pointer">
              <div className="flex items-center space-x-3">
                <Key className="h-5 w-5 text-blue-500" />
                <div>
                  <p className="font-medium">Password</p>
                  <p className="text-sm text-muted-foreground">Change your password</p>
                </div>
              </div>
              <ChevronRight className="h-5 w-5 text-muted-foreground" />
            </div>

            <div className="flex items-center justify-between cursor-pointer">
              <div className="flex items-center space-x-3">
                <Smartphone className="h-5 w-5 text-green-500" />
                <div>
                  <p className="font-medium">Two-Factor Authentication</p>
                  <p className="text-sm text-muted-foreground">Add extra security to your account</p>
                </div>
              </div>
              <ChevronRight className="h-5 w-5 text-muted-foreground" />
            </div>

            <div className="flex items-center justify-between cursor-pointer">
              <div className="flex items-center space-x-3">
                <Shield className="h-5 w-5 text-purple-500" />
                <div>
                  <p className="font-medium">Login Activity</p>
                  <p className="text-sm text-muted-foreground">See your recent login activity</p>
                </div>
              </div>
              <ChevronRight className="h-5 w-5 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>

        <Card>
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
      </motion.div>
    </MobileLayout>
  );
}