
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
import HostsNewLayout from "./pages/hosts/NewLayout";
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
import Introduction2 from "./pages/Introduction-2";
import Introduction3 from "./pages/Introduction-3"; 
import NewLayout from "./pages/NewLayout"; 

// Define the interface for the DefaultLayout props
interface DefaultLayoutProps {
  children: React.ReactNode;
}

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
                <Route path="/" element={<DefaultLayout><Dashboard /></DefaultLayout>} />
                <Route path="/dashboard" element={<DefaultLayout><Dashboard /></DefaultLayout>} />
                <Route path="/new-user" element={<DefaultLayout><NewUserDashboard /></DefaultLayout>} />
                <Route path="/empty-dashboard" element={<DefaultLayout><EmptyDashboard /></DefaultLayout>} />
                <Route path="/hosts" element={<DefaultLayout><Hosts /></DefaultLayout>} />
                <Route path="/hosts/new-user" element={<DefaultLayout><HostsNewUser /></DefaultLayout>} />
                <Route path="/hosts/newlayout" element={<DefaultLayout><HostsNewLayout /></DefaultLayout>} />
                <Route path="/profiles" element={<DefaultLayout><Profiles /></DefaultLayout>} />
                <Route path="/profiles/new-user" element={<DefaultLayout><ProfilesNewUser /></DefaultLayout>} />
                <Route path="/servers" element={<DefaultLayout><Servers /></DefaultLayout>} />
                <Route path="/servers/new-user" element={<DefaultLayout><ServersNewUser /></DefaultLayout>} />
                <Route path="/discovery" element={<DefaultLayout><Discovery /></DefaultLayout>} />
                <Route path="/discovery/no-network" element={<DefaultLayout><DiscoveryNoNetwork /></DefaultLayout>} />
                <Route path="/settings" element={<DefaultLayout><Settings /></DefaultLayout>} />
                <Route path="/introduction-3" element={<DefaultLayout><Introduction3 /></DefaultLayout>} />
                <Route path="/new-layout" element={<DefaultLayout><NewLayout /></DefaultLayout>} />
                <Route path="/tray" element={<TrayPopup />} />
                <Route path="/tray/new-user" element={<NewUserTrayPopup />} />
                <Route path="/introduction" element={<LandingPage />} />
                <Route path="/introduction-2" element={<Introduction2 />} />
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
