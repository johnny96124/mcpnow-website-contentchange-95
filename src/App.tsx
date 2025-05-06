
import React from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { ThemeProvider } from "@/components/theme/theme-provider";
import { RouterProvider, createBrowserRouter, Navigate } from "react-router-dom";
import { ServerProvider } from "@/context/ServerContext";
import DefaultLayout from "@/layouts/DefaultLayout";
import Dashboard from "@/pages/Dashboard";
import Hosts from "@/pages/Hosts";
import Servers from "@/pages/Servers";
import Profiles from "@/pages/Profiles";
import Discovery from "@/pages/Discovery";
import Settings from "@/pages/Settings";
import HostNewLayout from "./pages/Host-newlayout";
import NotFound from "./pages/NotFound";
import TrayPopup from "./pages/TrayPopup";
import NewUserTrayPopup from "./pages/NewUserTrayPopup";
import HostsNewUser from "./pages/HostsNewUser";
import WebsiteEn from "./pages/website-en";
import WebsiteCn from "./pages/website-cn";
import FileNavigator from "./pages/FileNavigator";
import { LanguageProvider } from "./components/theme/language-provider";

function App() {
  const queryClient = new QueryClient();

  return (
    <LanguageProvider defaultLanguage="zh">
      <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
        <QueryClientProvider client={queryClient}>
          <ServerProvider>
            <Toaster />
            <RouterProvider router={createBrowserRouter([
              {
                path: "/",
                element: <DefaultLayout><Hosts /></DefaultLayout>
              },
              {
                path: "/index",
                element: <Navigate to="/" replace />
              },
              {
                path: "/website-en",
                element: <WebsiteEn />
              },
              {
                path: "/website-cn",
                element: <WebsiteCn />
              },
              {
                path: "/introduction",
                element: <Navigate to="/website-en" replace />
              },
              {
                path: "/introduction-3",
                element: <Navigate to="/website-cn" replace />
              },
              {
                path: "/dashboard",
                element: <DefaultLayout><Dashboard /></DefaultLayout>
              },
              {
                path: "/hosts",
                element: <Navigate to="/" replace />
              },
              {
                path: "/hosts-new-user",
                element: <DefaultLayout><HostsNewUser /></DefaultLayout>
              },
              {
                path: "/servers",
                element: <DefaultLayout><Servers /></DefaultLayout>
              },
              {
                path: "/profiles",
                element: <DefaultLayout><Profiles /></DefaultLayout>
              },
              {
                path: "/discovery",
                element: <DefaultLayout><Discovery /></DefaultLayout>
              },
              {
                path: "/settings",
                element: <DefaultLayout><Settings /></DefaultLayout>
              },
              {
                path: "/host-new",
                element: <DefaultLayout><HostNewLayout /></DefaultLayout>
              },
              {
                path: "/tray",
                element: <TrayPopup />
              },
              {
                path: "/tray-new-user",
                element: <NewUserTrayPopup />
              },
              {
                path: "/file-navigator",
                element: <DefaultLayout><FileNavigator /></DefaultLayout>
              },
              {
                path: "*",
                element: <DefaultLayout><NotFound /></DefaultLayout>
              }
            ])} />
          </ServerProvider>
        </QueryClientProvider>
      </ThemeProvider>
    </LanguageProvider>
  );
}

export default App;
