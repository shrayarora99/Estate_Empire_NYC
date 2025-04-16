import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import NotFound from "@/pages/not-found";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Home from "@/pages/Home";
import TenantDashboard from "@/pages/TenantDashboard";
import LandlordDashboard from "@/pages/LandlordDashboard";
import PropertyDetails from "@/pages/PropertyDetails";
import PropertySearch from "@/pages/PropertySearch";
import ProfileSettings from "@/pages/ProfileSettings";
import DocumentUpload from "@/pages/DocumentUpload";
import Login from "@/pages/Login";
import SignUp from "@/pages/SignUp";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/tenant-dashboard" component={TenantDashboard} />
      <Route path="/landlord-dashboard" component={LandlordDashboard} />
      <Route path="/property/:id" component={PropertyDetails} />
      <Route path="/properties" component={PropertySearch} />
      <Route path="/profile" component={ProfileSettings} />
      <Route path="/documents" component={DocumentUpload} />
      <Route path="/login" component={Login} />
      <Route path="/signup" component={SignUp} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-grow">
          <Router />
        </main>
        <Footer />
      </div>
      <Toaster />
    </QueryClientProvider>
  );
}

export default App;
