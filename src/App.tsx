
import React from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { ThemeProvider } from "@/components/theme/theme-provider";
import { RouterProvider, createBrowserRouter, Navigate } from "react-router-dom";
import { ServerProvider } from "@/context/ServerContext";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import DefaultLayout from "@/layouts/DefaultLayout";
import Dashboard from "@/pages/Dashboard";
import Hosts from "@/pages/Hosts";
import Servers from "@/pages/Servers";
import Profiles from "@/pages/Profiles";
import Discovery from "@/pages/Discovery";
import Settings from "@/pages/Settings";
import AIChat from "@/pages/AIChat";
import Account from "@/pages/Account";
import SignIn from "@/pages/auth/SignIn";
import SignUp from "@/pages/auth/SignUp";
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
                path: "/auth/sign-in",
                element: <SignIn />
              },
              {
                path: "/auth/sign-up", 
                element: <SignUp />
              },
              {
                path: "/",
                element: <ProtectedRoute><DefaultLayout><Hosts /></DefaultLayout></ProtectedRoute>
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
                element: <ProtectedRoute><DefaultLayout><Dashboard /></DefaultLayout></ProtectedRoute>
              },
              {
                path: "/hosts",
                element: <Navigate to="/" replace />
              },
              {
                path: "/hosts-new-user",
                element: <ProtectedRoute><DefaultLayout><HostsNewUser /></DefaultLayout></ProtectedRoute>
              },
              {
                path: "/servers",
                element: <ProtectedRoute><DefaultLayout><Servers /></DefaultLayout></ProtectedRoute>
              },
              {
                path: "/profiles",
                element: <ProtectedRoute><DefaultLayout><Profiles /></DefaultLayout></ProtectedRoute>
              },
              {
                path: "/discovery",
                element: <ProtectedRoute><DefaultLayout><Discovery /></DefaultLayout></ProtectedRoute>
              },
              {
                path: "/settings",
                element: <ProtectedRoute><DefaultLayout><Settings /></DefaultLayout></ProtectedRoute>
              },
              {
                path: "/account",
                element: <ProtectedRoute><DefaultLayout><Account /></DefaultLayout></ProtectedRoute>
              },
              {
                path: "/ai-chat",
                element: <ProtectedRoute><DefaultLayout><AIChat /></DefaultLayout></ProtectedRoute>
              },
              {
                path: "/host-new",
                element: <ProtectedRoute><DefaultLayout><HostNewLayout /></DefaultLayout></ProtectedRoute>
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
                element: <ProtectedRoute><DefaultLayout><FileNavigator /></DefaultLayout></ProtectedRoute>
              },
              {
                path: "*",
                element: <ProtectedRoute><DefaultLayout><NotFound /></DefaultLayout></ProtectedRoute>
              }
            ])} />
          </ServerProvider>
        </QueryClientProvider>
      </ThemeProvider>
    </LanguageProvider>
  );
}

export default App;
