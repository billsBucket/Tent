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
import ParentHome from "@/pages/parent/home";
import BabysitterDashboard from "@/pages/babysitter/dashboard";
import BabysitterDetail from "@/pages/parent/babysitter-detail";

function Router() {
  return (
    <Switch>
      <Route path="/" component={SplashScreen} />
      <Route path="/onboarding" component={OnboardingPage} />
      <Route path="/auth" component={AuthPage} />
      <ProtectedRoute path="/parent/home" component={ParentHome} />
      <ProtectedRoute path="/parent/babysitter/:id" component={BabysitterDetail} />
      <ProtectedRoute path="/babysitter/dashboard" component={BabysitterDashboard} />
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
