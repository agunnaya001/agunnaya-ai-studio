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
import StudioPage from "@/pages/dashboard/studio";
import PlaygroundPage from "@/pages/dashboard/playground";
import DeployPage from "@/pages/dashboard/deploy";
import GameFiPage from "@/pages/dashboard/gamefi";
import CommunityPage from "@/pages/dashboard/community";
import MarketplacePage from "@/pages/dashboard/marketplace";
import BillingPage from "@/pages/dashboard/billing";
import EcosystemPage from "@/pages/dashboard/ecosystem";
import ProjectsPage from "@/pages/dashboard/projects";
import ApiKeysPage from "@/pages/dashboard/api-keys";
import SettingsPage from "@/pages/dashboard/settings";

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
      <Route path="/dashboard/studio" component={StudioPage} />
      <Route path="/dashboard/playground" component={PlaygroundPage} />
      <Route path="/dashboard/deploy" component={DeployPage} />
      <Route path="/dashboard/gamefi" component={GameFiPage} />
      <Route path="/dashboard/community" component={CommunityPage} />
      <Route path="/dashboard/marketplace" component={MarketplacePage} />
      <Route path="/dashboard/billing" component={BillingPage} />
      <Route path="/dashboard/ecosystem" component={EcosystemPage} />
      <Route path="/dashboard/projects" component={ProjectsPage} />
      <Route path="/dashboard/api-keys" component={ApiKeysPage} />
      <Route path="/dashboard/settings" component={SettingsPage} />
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
