
import { NavLink } from "react-router-dom";
import { 
  ChevronDown, 
  Grid, 
  LayoutDashboard, 
  MonitorDot,
  ServerIcon,
  Settings, 
  UsersRound,
  Database,
  BookOpen,
  HelpCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  Collapsible, 
  CollapsibleContent, 
  CollapsibleTrigger 
} from "@/components/ui/collapsible";
import { useState } from "react";
import { HelpDialog } from "@/components/help/HelpDialog";
import { GettingStartedDialog } from "@/components/onboarding/GettingStartedDialog";
import { ThemeToggle } from "@/components/theme/theme-toggle";
import { SocialLinks } from "./SocialLinks";

interface MainSidebarProps {
  collapsed?: boolean;
}

export function MainSidebar({ collapsed = false }: MainSidebarProps) {
  const [isOpen, setIsOpen] = useState(true);
  const [showGettingStarted, setShowGettingStarted] = useState(false);

  return (
    // 添加一个带灰色圆角边框的容器，和原结构保持
    <div className="border border-sidebar-border rounded-lg mx-2 my-3 flex flex-col bg-sidebar">
      <div className="border-b border-sidebar-border p-4">
        <div className="flex items-center gap-2">
          <img 
            src="/lovable-uploads/0ad4c791-4d08-4e94-bbeb-3ac78aae67ef.png" 
            alt="MCP Now Logo" 
            className="h-6 w-6" 
          />
          {!collapsed && <h1 className="text-lg font-semibold">{`MCP Now`}</h1>}
        </div>
      </div>
      <ScrollArea className="flex-1 px-2 py-4">
        <nav className="space-y-2">
          <Collapsible open={isOpen} onOpenChange={setIsOpen}>
            <CollapsibleTrigger asChild>
              <Button 
                variant="ghost" 
                className={cn(
                  "w-full justify-start text-left text-sm",
                  collapsed && "justify-center px-0"
                )}
              >
                <LayoutDashboard className="h-4 w-4 mr-2" />
                {!collapsed && "Dashboard"}
                {!collapsed && (
                  <ChevronDown 
                    className={cn(
                      "h-4 w-4 ml-auto transition-transform",
                      isOpen && "transform rotate-180"
                    )} 
                  />
                )}
              </Button>
            </CollapsibleTrigger>
            <CollapsibleContent>
              {!collapsed && (
                <div className="space-y-1 pl-6 mt-1">
                  <NavLink 
                    to="/dashboard" 
                    end
                    className={({ isActive }) => 
                      cn("sidebar-item text-sm", isActive && "sidebar-item-active")
                    }
                  >
                    <Grid className="h-4 w-4" />
                    Overview
                  </NavLink>
                  <NavLink 
                    to="/hosts" 
                    className={({ isActive }) => 
                      cn("sidebar-item text-sm", isActive && "sidebar-item-active")
                    }
                  >
                    <MonitorDot className="h-4 w-4" />
                    Hosts
                  </NavLink>
                  <NavLink 
                    to="/profiles" 
                    className={({ isActive }) => 
                      cn("sidebar-item text-sm", isActive && "sidebar-item-active")
                    }
                  >
                    <Database className="h-4 w-4" />
                    Profiles
                  </NavLink>
                  <NavLink 
                    to="/servers" 
                    className={({ isActive }) => 
                      cn("sidebar-item text-sm", isActive && "sidebar-item-active")
                    }
                  >
                    <ServerIcon className="h-4 w-4" />
                    Servers
                  </NavLink>
                </div>
              )}
            </CollapsibleContent>
          </Collapsible>

          <NavLink 
            to="/discovery" 
            className={({ isActive }) => 
              cn(
                "sidebar-item text-sm", 
                isActive && "sidebar-item-active",
                collapsed && "justify-center px-0"
              )
            }
          >
            <UsersRound className="h-4 w-4 mr-2" />
            {!collapsed && "Discovery"}
          </NavLink>

          <NavLink 
            to="/settings" 
            className={({ isActive }) => 
              cn(
                "sidebar-item text-sm", 
                isActive && "sidebar-item-active",
                collapsed && "justify-center px-0"
              )
            }
          >
            <Settings className="h-4 w-4 mr-2" />
            {!collapsed && "Settings"}
          </NavLink>
        </nav>
      </ScrollArea>
      
      <SocialLinks />
      
      <div className="border-t border-sidebar-border p-4">
        <div className="flex justify-between items-center gap-2">
          <ThemeToggle />
          <Button 
            variant="ghost" 
            size="icon" 
            className="rounded-full h-8 w-8" 
            onClick={() => setShowGettingStarted(true)}
          >
            <BookOpen className="h-4 w-4" />
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
