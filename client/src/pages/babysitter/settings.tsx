import { useLocation } from "wouter";
import { motion } from "framer-motion";
import { MobileLayout } from "@/components/layout/mobile-layout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { useAuth } from "@/hooks/use-auth";
import { 
  ArrowLeft,
  Bell,
  Shield,
  Lock,
  CreditCard,
  HelpCircle,
  ChevronRight,
  LogOut
} from "lucide-react";

export function BabysitterSettings() {
  const [, setLocation] = useLocation();
  const { user, logoutMutation } = useAuth();

  const handleLogout = async () => {
    await logoutMutation.mutateAsync();
    setLocation("/auth");
  };

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
          <h1 className="ml-4 font-semibold">Settings</h1>
        </div>

        {/* Account Settings */}
        <Card>
          <CardContent className="p-4 space-y-4">
            <div 
              className="flex items-center justify-between cursor-pointer"
              onClick={() => setLocation("/babysitter/security")}
            >
              <div className="flex items-center space-x-3">
                <Shield className="h-5 w-5 text-primary" />
                <span>Security</span>
              </div>
              <ChevronRight className="h-5 w-5 text-muted-foreground" />
            </div>

            <div 
              className="flex items-center justify-between cursor-pointer"
              onClick={() => setLocation("/babysitter/privacy")}
            >
              <div className="flex items-center space-x-3">
                <Lock className="h-5 w-5 text-primary" />
                <span>Privacy</span>
              </div>
              <ChevronRight className="h-5 w-5 text-muted-foreground" />
            </div>

            <div 
              className="flex items-center justify-between cursor-pointer"
              onClick={() => setLocation("/babysitter/payments")}
            >
              <div className="flex items-center space-x-3">
                <CreditCard className="h-5 w-5 text-primary" />
                <span>Payment Methods</span>
              </div>
              <ChevronRight className="h-5 w-5 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>

        {/* Notifications */}
        <Card>
          <CardContent className="p-4 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Bell className="h-5 w-5 text-primary" />
                <span>Push Notifications</span>
              </div>
              <Switch defaultChecked />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Bell className="h-5 w-5 text-primary" />
                <span>Email Notifications</span>
              </div>
              <Switch defaultChecked />
            </div>
          </CardContent>
        </Card>

        {/* Support */}
        <Card>
          <CardContent className="p-4">
            <div 
              className="flex items-center justify-between cursor-pointer"
              onClick={() => setLocation("/babysitter/help")}
            >
              <div className="flex items-center space-x-3">
                <HelpCircle className="h-5 w-5 text-primary" />
                <span>Help & Support</span>
              </div>
              <ChevronRight className="h-5 w-5 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>

        {/* Logout */}
        <Button
          variant="destructive"
          className="w-full"
          onClick={handleLogout}
          disabled={logoutMutation.isPending}
        >
          <LogOut className="h-5 w-5 mr-2" />
          {logoutMutation.isPending ? "Logging out..." : "Log Out"}
        </Button>
      </motion.div>
    </MobileLayout>
  );
}

export default BabysitterSettings;