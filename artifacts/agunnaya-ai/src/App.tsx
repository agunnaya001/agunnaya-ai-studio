import { Switch, Route, Router as WouterRouter } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import HomePage from "@/pages/home";
import LoginPage from "@/pages/auth/login";
import SignUpPage from "@/pages/auth/sign-up";
import SignUpSuccessPage from "@/pages/auth/sign-up-success";
import AuthErrorPage from "@/pages/auth/error";
import AuthCallbackPage from "@/pages/auth/callback";
import DashboardPage from "@/pages/dashboard/index";

const queryClient = new QueryClient();

function Router() {
  return (
    <Switch>
      <Route path="/" component={HomePage} />
      <Route path="/auth/login" component={LoginPage} />
      <Route path="/auth/sign-up" component={SignUpPage} />
      <Route path="/auth/sign-up-success" component={SignUpSuccessPage} />
      <Route path="/auth/error" component={AuthErrorPage} />
      <Route path="/auth/callback" component={AuthCallbackPage} />
      <Route path="/dashboard" component={DashboardPage} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
          <Router />
        </WouterRouter>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
