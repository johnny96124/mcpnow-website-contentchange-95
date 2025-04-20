import React from 'react';
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@/components/theme/theme-provider";
import { ServerProvider } from "@/context/ServerContext";
import DefaultLayout from "./layouts/DefaultLayout";
import Dashboard from "./pages/Dashboard";
import EmptyDashboard from "./pages/EmptyDashboard";
import Hosts from "./pages/Hosts";
import HostsNewUser from "./pages/HostsNewUser";
import Profiles from "./pages/Profiles";
import Servers from "./pages/Servers";
import ServersNewUser from "./pages/ServersNewUser";
import ProfilesNewUser from "./pages/ProfilesNewUser";
import Discovery from "./pages/Discovery";
import DiscoveryNoNetwork from "./pages/DiscoveryNoNetwork";
import Settings from "./pages/Settings";
import TrayPopup from "./pages/TrayPopup";
import NewUserTrayPopup from "./pages/NewUserTrayPopup";
import NotFound from "./pages/NotFound";
import NewUserDashboard from "./pages/NewUserDashboard";
import LandingPage from "./pages/LandingPage";

// Create a new QueryClient instance
const queryClient = new QueryClient();

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="light" storageKey="mcp-now-theme">
        <TooltipProvider>
          <ServerProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <Routes>
                <Route path="/" element={<LandingPage />} />
                <Route path="/tray" element={<TrayPopup />} />
                <Route path="/tray/new-user" element={<NewUserTrayPopup />} />
                <Route path="/" element={<DefaultLayout />}>
                  <Route path="dashboard" element={<Dashboard />} />
                  <Route path="dashboard/new-user" element={<NewUserDashboard />} />
                  <Route path="new-user" element={<NewUserDashboard />} />
                  <Route path="empty-dashboard" element={<EmptyDashboard />} />
                  <Route path="hosts" element={<Hosts />} />
                  <Route path="hosts/new-user" element={<HostsNewUser />} />
                  <Route path="profiles" element={<Profiles />} />
                  <Route path="profiles/new-user" element={<ProfilesNewUser />} />
                  <Route path="servers" element={<Servers />} />
                  <Route path="servers/new-user" element={<ServersNewUser />} />
                  <Route path="discovery" element={<Discovery />} />
                  <Route path="discovery/no-network" element={<DiscoveryNoNetwork />} />
                  <Route path="settings" element={<Settings />} />
                </Route>
                <Route path="*" element={<NotFound />} />
              </Routes>
            </BrowserRouter>
          </ServerProvider>
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
};

export default App;
