
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
                <Route path="/dashboard" element={<DefaultLayout />}>
                  <Route index element={<Dashboard />} />
                  <Route path="new-user" element={<NewUserDashboard />} />
                  <Route path="empty" element={<EmptyDashboard />} />
                </Route>
                <Route path="/hosts" element={<DefaultLayout />}>
                  <Route index element={<Hosts />} />
                  <Route path="new-user" element={<HostsNewUser />} />
                </Route>
                <Route path="/profiles" element={<DefaultLayout />}>
                  <Route index element={<Profiles />} />
                  <Route path="new-user" element={<ProfilesNewUser />} />
                </Route>
                <Route path="/servers" element={<DefaultLayout />}>
                  <Route index element={<Servers />} />
                  <Route path="new-user" element={<ServersNewUser />} />
                </Route>
                <Route path="/discovery" element={<DefaultLayout />}>
                  <Route index element={<Discovery />} />
                  <Route path="no-network" element={<DiscoveryNoNetwork />} />
                </Route>
                <Route path="/settings" element={<DefaultLayout />}>
                  <Route index element={<Settings />} />
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
