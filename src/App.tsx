
import React from 'react';
import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";
import Index from "@/pages/Index";
import Dashboard from "@/pages/Dashboard";
import Hosts from "@/pages/Hosts";
import Servers from "@/pages/Servers";
import Profiles from "@/pages/Profiles";
import Settings from "@/pages/Settings";
import NewUserDashboard from "@/pages/NewUserDashboard";
import NotFound from "@/pages/NotFound";
import DefaultLayout from "@/layouts/DefaultLayout";
import HostsNewUser from "@/pages/HostsNewUser";
import ServersNewUser from "@/pages/ServersNewUser";
import ProfilesNewUser from "@/pages/ProfilesNewUser";
import Discovery from "@/pages/Discovery";
import TrayPopup from "@/pages/TrayPopup";
import NewUserTrayPopup from "@/pages/NewUserTrayPopup";
import EmptyDashboard from "@/pages/EmptyDashboard";
import DiscoveryNoNetwork from "@/pages/DiscoveryNoNetwork";
import { ServerProvider } from "@/context/ServerContext";

function App() {
  const [isOnline, setIsOnline] = React.useState(navigator.onLine);

  React.useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);
  
  return (
    <ServerProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<DefaultLayout />}>
            <Route index element={<Index />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="hosts" element={<Hosts />} />
            <Route path="hosts/new-user" element={<HostsNewUser />} />
            <Route path="servers" element={<Servers />} />
            <Route path="servers/new-user" element={<ServersNewUser />} />
            <Route path="profiles" element={<Profiles />} />
            <Route path="profiles/new-user" element={<ProfilesNewUser />} />
            <Route path="discovery" element={<Discovery />} />
            <Route path="discovery/no-network" element={<DiscoveryNoNetwork />} />
            <Route path="settings" element={<Settings />} />
            <Route path="new-user" element={<NewUserDashboard />} />
            <Route path="*" element={<NotFound />} />
          </Route>
          <Route path="/tray-popup" element={<TrayPopup />} />
          <Route path="/tray-popup/new-user" element={<NewUserTrayPopup />} />
          <Route path="/empty-dashboard" element={<EmptyDashboard />} />
        </Routes>
      </BrowserRouter>
    </ServerProvider>
  );
}

export default App;
