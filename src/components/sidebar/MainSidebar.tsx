
import { NavLink } from "react-router-dom";
import { 
  ChevronDown, 
  Database, 
  GridIcon, 
  LayoutDashboard, 
  Menu,
  MonitorCheck, 
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
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
  useSidebar
} from "@/components/ui/sidebar";

export function MainSidebar() {
  const [isDashboardOpen, setIsDashboardOpen] = useState(true);
  const { state } = useSidebar();
  const isCollapsed = state === "collapsed";
  
  return (
    <Sidebar className="border-r bg-sidebar w-full">
      <SidebarHeader className="border-b p-4">
        <div className="flex items-center gap-2">
          <MonitorCheck className="h-6 w-6 text-primary" />
          {!isCollapsed && <h1 className="text-lg font-semibold">MCP Now</h1>}
        </div>
      </SidebarHeader>
      
      <SidebarContent>
        <ScrollArea className="px-2 py-4 h-full">
          <nav className="space-y-2">
            <Collapsible 
              open={isDashboardOpen && !isCollapsed} 
              onOpenChange={setIsDashboardOpen}
            >
              <CollapsibleTrigger asChild>
                <Button 
                  variant="ghost" 
                  className={cn(
                    "w-full justify-start text-left font-medium",
                    isCollapsed && "justify-center p-2"
                  )}
                >
                  <LayoutDashboard className="h-4 w-4 mr-2" />
                  {!isCollapsed && (
                    <>
                      Dashboard
                      <ChevronDown 
                        className={cn(
                          "h-4 w-4 ml-auto transition-transform",
                          isDashboardOpen && "transform rotate-180"
                        )} 
                      />
                    </>
                  )}
                </Button>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <div className={cn(
                  "space-y-1 mt-1",
                  isCollapsed ? "pl-0" : "pl-6"
                )}>
                  <NavLink 
                    to="/" 
                    end
                    className={({ isActive }) => 
                      cn(
                        "sidebar-item text-sm", 
                        isActive && "sidebar-item-active",
                        isCollapsed && "justify-center p-2"
                      )
                    }
                  >
                    <GridIcon className="h-4 w-4" />
                    {!isCollapsed && "Overview"}
                  </NavLink>
                  <NavLink 
                    to="/hosts" 
                    className={({ isActive }) => 
                      cn(
                        "sidebar-item text-sm", 
                        isActive && "sidebar-item-active",
                        isCollapsed && "justify-center p-2"
                      )
                    }
                  >
                    <UsersRound className="h-4 w-4" />
                    {!isCollapsed && "Hosts"}
                  </NavLink>
                  <NavLink 
                    to="/profiles" 
                    className={({ isActive }) => 
                      cn(
                        "sidebar-item text-sm", 
                        isActive && "sidebar-item-active",
                        isCollapsed && "justify-center p-2"
                      )
                    }
                  >
                    <Database className="h-4 w-4" />
                    {!isCollapsed && "Profiles"}
                  </NavLink>
                  <NavLink 
                    to="/servers" 
                    className={({ isActive }) => 
                      cn(
                        "sidebar-item text-sm", 
                        isActive && "sidebar-item-active",
                        isCollapsed && "justify-center p-2"
                      )
                    }
                  >
                    <GridIcon className="h-4 w-4" />
                    {!isCollapsed && "Servers"}
                  </NavLink>
                </div>
              </CollapsibleContent>
            </Collapsible>

            <NavLink 
              to="/discovery" 
              className={({ isActive }) => 
                cn(
                  "sidebar-item font-medium", 
                  isActive && "sidebar-item-active",
                  isCollapsed && "justify-center p-2"
                )
              }
            >
              <ScanLine className="h-4 w-4 mr-2" />
              {!isCollapsed && "Discovery"}
            </NavLink>

            <NavLink 
              to="/settings" 
              className={({ isActive }) => 
                cn(
                  "sidebar-item font-medium", 
                  isActive && "sidebar-item-active",
                  isCollapsed && "justify-center p-2"
                )
              }
            >
              <Settings className="h-4 w-4 mr-2" />
              {!isCollapsed && "Settings"}
            </NavLink>
          </nav>
        </ScrollArea>
      </SidebarContent>
      
      <SidebarFooter className="border-t p-4">
        <div className="flex justify-between items-center">
          {!isCollapsed && (
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-status-active"></div>
              <span className="text-sm text-muted-foreground">Connected</span>
            </div>
          )}
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <SidebarTrigger />
          </div>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
