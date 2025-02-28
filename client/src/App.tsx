import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { AuthProvider } from "@/hooks/use-auth";
import { ProtectedRoute } from "./lib/protected-route";
import NotFound from "@/pages/not-found";
import SplashScreen from "@/pages/splash-screen";
import OnboardingPage from "@/pages/onboarding";
import AuthPage from "@/pages/auth-page";
import VerificationFlow from "@/pages/verification/verification-flow";
import ParentHome from "@/pages/parent/home";
import ParentMessages from "@/pages/parent/messages";
import ParentProfileSetup from "@/pages/parent/profile-setup";
import BabysitterDashboard from "@/pages/babysitter/dashboard";
import BabysitterProfile from "@/pages/babysitter/profile";
import BabysitterSettings from "@/pages/babysitter/settings";
import BabysitterSecurity from "@/pages/babysitter/security";
import BabysitterPrivacy from "@/pages/babysitter/privacy";
import BabysitterPayments from "@/pages/babysitter/payments";
import BabysitterHelp from "@/pages/babysitter/help";
import BabysitterNotifications from "@/pages/babysitter/notifications";
import BabysitterMessages from "@/pages/babysitter/messages";
import BabysitterEarnings from "@/pages/babysitter/earnings";
import BabysitterSchedule from "@/pages/babysitter/schedule";
import BookingPage from "@/pages/parent/booking/[id]";
import BookingTrackingPage from "@/pages/parent/booking/[id]/tracking";

function Router() {
  return (
    <Switch>
      <Route path="/" component={SplashScreen} />
      <Route path="/onboarding" component={OnboardingPage} />
      <Route path="/auth" component={AuthPage} />
      <ProtectedRoute path="/verification" component={VerificationFlow} />
      <ProtectedRoute path="/parent/profile-setup" component={ParentProfileSetup} />
      <ProtectedRoute path="/parent/home" component={ParentHome} />
      <ProtectedRoute path="/parent/messages" component={ParentMessages} />
      <ProtectedRoute path="/parent/booking/:id" component={BookingPage} />
      <ProtectedRoute path="/parent/booking/:id/tracking" component={BookingTrackingPage} />
      <ProtectedRoute path="/babysitter/dashboard" component={BabysitterDashboard} />
      <ProtectedRoute path="/babysitter/profile" component={BabysitterProfile} />
      <ProtectedRoute path="/babysitter/settings" component={BabysitterSettings} />
      <ProtectedRoute path="/babysitter/security" component={BabysitterSecurity} />
      <ProtectedRoute path="/babysitter/privacy" component={BabysitterPrivacy} />
      <ProtectedRoute path="/babysitter/payments" component={BabysitterPayments} />
      <ProtectedRoute path="/babysitter/help" component={BabysitterHelp} />
      <ProtectedRoute path="/babysitter/notifications" component={BabysitterNotifications} />
      <ProtectedRoute path="/babysitter/messages" component={BabysitterMessages} />
      <ProtectedRoute path="/babysitter/earnings" component={BabysitterEarnings} />
      <ProtectedRoute path="/babysitter/schedule" component={BabysitterSchedule} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Router />
        <Toaster />
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;