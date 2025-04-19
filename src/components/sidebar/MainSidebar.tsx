
import { NavLink } from "react-router-dom";
import { 
  LayoutDashboard,
  Grid,
  Monitor,
  Database,
  Servers,
  Search,
  Settings,
  Moon,
  Sun,
  BookOpen,
  MoreHorizontal,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { SocialLinks } from "./SocialLinks";
import { useTheme } from "@/components/theme/theme-provider";
import { useState } from "react";
import { HelpDialog } from "@/components/help/HelpDialog";
import { GettingStartedDialog } from "@/components/onboarding/GettingStartedDialog";

interface MainSidebarProps {
  collapsed?: boolean;
}

export function MainSidebar({ collapsed = false }: MainSidebarProps) {
  const { setTheme, theme } = useTheme();
  const [showGettingStarted, setShowGettingStarted] = useState(false);
  
  const navigationItems = [
    {
      title: "Dashboard",
      icon: LayoutDashboard,
      children: [
        { title: "Overview", path: "/", icon: Grid }
      ]
    },
    { title: "Hosts", path: "/hosts", icon: Monitor },
    { title: "Profiles", path: "/profiles", icon: Database },
    { title: "Servers", path: "/servers", icon: Servers },
    { title: "Discovery", path: "/discovery", icon: Search },
    { title: "Settings", path: "/settings", icon: Settings },
  ];

  return (
    <div className="border-r bg-sidebar h-full flex flex-col">
      <div className="p-4 border-b">
        <div className="flex items-center gap-2">
          <img 
            src="/lovable-uploads/0ad4c791-4d08-4e94-bbeb-3ac78aae67ef.png" 
            alt="MCP Now Logo" 
            className="h-6 w-6" 
          />
          {!collapsed && <h1 className="text-lg font-semibold">MCP Now</h1>}
        </div>
      </div>
      
      <ScrollArea className="flex-1 px-2 py-4">
        <nav className="space-y-1">
          {navigationItems.map((item) => (
            item.children ? (
              <div key={item.title} className="space-y-1">
                <div className="flex items-center gap-2 px-2 py-1.5 text-sm text-muted-foreground">
                  <item.icon className="h-5 w-5" />
                  <span>{item.title}</span>
                </div>
                {item.children.map((child) => (
                  <NavLink
                    key={child.path}
                    to={child.path}
                    end
                    className={({ isActive }) => cn(
                      "flex items-center gap-2 px-4 py-1.5 text-sm rounded-md",
                      "hover:bg-accent hover:text-accent-foreground transition-colors",
                      isActive && "bg-accent text-accent-foreground"
                    )}
                  >
                    <child.icon className="h-5 w-5" />
                    <span>{child.title}</span>
                  </NavLink>
                ))}
              </div>
            ) : (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) => cn(
                  "flex items-center gap-2 px-2 py-1.5 text-sm rounded-md",
                  "hover:bg-accent hover:text-accent-foreground transition-colors",
                  isActive && "bg-accent text-accent-foreground"
                )}
              >
                <item.icon className="h-5 w-5" />
                <span>{item.title}</span>
              </NavLink>
            )
          ))}
        </nav>
      </ScrollArea>

      <SocialLinks />
      
      <div className="border-t p-4">
        <div className="flex justify-center gap-2">
          <Button 
            variant="ghost" 
            size="icon" 
            className="rounded-full h-9 w-9"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          >
            {theme === "dark" ? (
              <Sun className="h-5 w-5" />
            ) : (
              <Moon className="h-5 w-5" />
            )}
            <span className="sr-only">Toggle theme</span>
          </Button>

          <Button 
            variant="ghost" 
            size="icon" 
            className="rounded-full h-9 w-9" 
            onClick={() => setShowGettingStarted(true)}
          >
            <BookOpen className="h-5 w-5" />
            <span className="sr-only">Getting started guide</span>
          </Button>

          <HelpDialog />
        </div>
      </div>
      
      <GettingStartedDialog 
        open={showGettingStarted} 
        onOpenChange={setShowGettingStarted} 
      />
    </div>
  );
}
