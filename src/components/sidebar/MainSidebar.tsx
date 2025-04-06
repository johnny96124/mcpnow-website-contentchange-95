
import { NavLink } from "react-router-dom";
import { 
  ChevronDown, 
  Database, 
  GridIcon, 
  LayoutDashboard, 
  ScanLine, 
  Settings, 
  UsersRound 
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  Collapsible, 
  CollapsibleContent, 
  CollapsibleTrigger 
} from "@/components/ui/collapsible";
import { ThemeToggle } from "@/components/theme/theme-toggle";
import { useState } from "react";

interface MainSidebarProps {
  collapsed?: boolean;
}

export function MainSidebar({ collapsed = false }: MainSidebarProps) {
  const [isOpen, setIsOpen] = useState(true);
  
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
        <nav className="space-y-2">
          <Collapsible open={isOpen} onOpenChange={setIsOpen}>
            <CollapsibleTrigger asChild>
              <Button 
                variant="ghost" 
                className={cn(
                  "w-full justify-start text-left font-medium",
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
                    to="/" 
                    end
                    className={({ isActive }) => 
                      cn("sidebar-item text-sm", isActive && "sidebar-item-active")
                    }
                  >
                    <GridIcon className="h-4 w-4" />
                    Overview
                  </NavLink>
                  <NavLink 
                    to="/hosts" 
                    className={({ isActive }) => 
                      cn("sidebar-item text-sm", isActive && "sidebar-item-active")
                    }
                  >
                    <UsersRound className="h-4 w-4" />
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
                    <GridIcon className="h-4 w-4" />
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
                "sidebar-item font-medium", 
                isActive && "sidebar-item-active",
                collapsed && "justify-center px-0"
              )
            }
          >
            <ScanLine className="h-4 w-4 mr-2" />
            {!collapsed && "Discovery"}
          </NavLink>

          <NavLink 
            to="/settings" 
            className={({ isActive }) => 
              cn(
                "sidebar-item font-medium", 
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
      <div className="border-t p-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-status-active"></div>
            {!collapsed && <span className="text-sm text-muted-foreground">Connected</span>}
          </div>
          <ThemeToggle />
        </div>
      </div>
    </div>
  );
}
