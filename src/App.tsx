import { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import DefaultLayout from "./layouts/DefaultLayout";
import Index from "./pages/Index";
import Introduction2 from "./pages/Introduction-2";
import Introduction3 from "./pages/Introduction-3";
import LandingPage from "./pages/LandingPage";
import Dashboard from "./pages/Dashboard";
import NewUserDashboard from "./pages/NewUserDashboard";
import EmptyDashboard from "./pages/EmptyDashboard";
import Servers from "./pages/Servers";
import ServersNewUser from "./pages/ServersNewUser";
import Hosts from "./pages/Hosts";
import HostsNewUser from "./pages/HostsNewUser";
import Profiles from "./pages/Profiles";
import ProfilesNewUser from "./pages/ProfilesNewUser";
import Settings from "./pages/Settings";
import Discovery from "./pages/Discovery";
import DiscoveryNoNetwork from "./pages/DiscoveryNoNetwork";
import TrayPopup from "./pages/TrayPopup";
import NewUserTrayPopup from "./pages/NewUserTrayPopup";
import NotFound from "./pages/NotFound";
import NewLayout from "./pages/NewLayout";

function App() {
  const [isNewUser, setIsNewUser] = useState(
    localStorage.getItem("newUser") !== "false"
  );

  useEffect(() => {
    localStorage.setItem("newUser", String(isNewUser));
  }, [isNewUser]);
  
  return (
    <div className="app">
      <Router>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/introduction-2" element={<Introduction2 />} />
          <Route path="/introduction-3" element={<Introduction3 />} />
          <Route path="/landing" element={<LandingPage />} />
          <Route element={<DefaultLayout />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/new-user-dashboard" element={<NewUserDashboard />} />
            <Route path="/empty-dashboard" element={<EmptyDashboard />} />
            <Route path="/servers" element={<Servers />} />
            <Route path="/servers-new-user" element={<ServersNewUser />} />
            <Route path="/hosts" element={<Hosts />} />
            <Route path="/hosts-new-user" element={<HostsNewUser />} />
            <Route path="/profiles" element={<Profiles />} />
            <Route path="/profiles-new-user" element={<ProfilesNewUser />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/discovery" element={<Discovery />} />
            <Route path="/discovery-no-network" element={<DiscoveryNoNetwork />} />
            <Route path="/new-layout" element={<NewLayout />} />
          </Route>
          <Route path="/tray" element={<TrayPopup />} />
          <Route path="/new-user-tray" element={<NewUserTrayPopup />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
      <Toaster />
      <Sonner />
    </div>
  );
}

export default App;
