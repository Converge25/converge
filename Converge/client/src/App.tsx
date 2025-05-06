import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import NotFound from "@/pages/not-found";
import Dashboard from "@/pages/dashboard";
import EmailMarketing from "@/pages/email-marketing";
import SmsMarketing from "@/pages/sms-marketing";
import SocialMedia from "@/pages/social-media";
import Popups from "@/pages/popups";
import Analytics from "@/pages/analytics";
import UserManagement from "@/pages/user-management";
import Subscription from "@/pages/subscription";
import Settings from "@/pages/settings";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Dashboard} />
      <Route path="/email-marketing" component={EmailMarketing} />
      <Route path="/sms-marketing" component={SmsMarketing} />
      <Route path="/social-media" component={SocialMedia} />
      <Route path="/popups" component={Popups} />
      <Route path="/analytics" component={Analytics} />
      <Route path="/user-management" component={UserManagement} />
      <Route path="/subscription" component={Subscription} />
      <Route path="/settings" component={Settings} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router />
      <Toaster />
    </QueryClientProvider>
  );
}

export default App;
