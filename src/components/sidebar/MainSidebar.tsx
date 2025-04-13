
import { NavLink } from "react-router-dom";
import { 
  ChevronDown, 
  Database, 
  GridIcon, 
  LayoutDashboard, 
  MessageCircle,
  ScanLine, 
  Settings, 
  UsersRound,
  Twitter,
  Github,
  MessageSquare,
  HelpCircle,
  Info,
  Home
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
import { FeedbackDialog } from "@/components/feedback/FeedbackDialog";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";

interface MainSidebarProps {
  collapsed?: boolean;
}

export function MainSidebar({ collapsed = false }: MainSidebarProps) {
  const [isOpen, setIsOpen] = useState(true);
  const [showFeedbackDialog, setShowFeedbackDialog] = useState(false);
  
  const mainNavItems = [
    { path: "/", icon: Home, label: "Home" },
    { path: "/hosts", icon: UsersRound, label: "Hosts" },
    { path: "/profiles", icon: Database, label: "Profiles" },
    { path: "/servers", icon: GridIcon, label: "Servers" },
    { path: "/discovery", icon: ScanLine, label: "Discovery" },
    { path: "/settings", icon: Settings, label: "Settings" }
  ];
  
  const helpNavItems = [
    { icon: Info, label: "About", onClick: () => console.log("About clicked") },
    { icon: HelpCircle, label: "Help", onClick: () => console.log("Help clicked") },
    { icon: MessageCircle, label: "Feedback", onClick: () => setShowFeedbackDialog(true) }
  ];
  
  return (
    <div className="border-r bg-sidebar h-full flex flex-col">
      {/* App Logo and Title */}
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
      
      {/* Main Navigation */}
      <ScrollArea className="flex-1 p-2">
        <nav className="space-y-6">
          {/* Primary Navigation Section */}
          <div className="space-y-2">
            {!collapsed && (
              <div className="px-3 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Main
              </div>
            )}
            
            {mainNavItems.map((item) => (
              <NavLink 
                key={item.path}
                to={item.path} 
                end={item.path === "/"} 
                className={({ isActive }) => 
                  cn(
                    "sidebar-item font-medium flex items-center gap-2 px-3 py-2 rounded-md hover:bg-accent transition-colors", 
                    isActive ? "bg-accent text-accent-foreground" : "text-foreground",
                    collapsed && "justify-center px-0"
                  )
                }
              >
                <item.icon className="h-4 w-4" />
                {!collapsed && <span>{item.label}</span>}
              </NavLink>
            ))}
          </div>
          
          {/* Help & Support Section */}
          <div className="space-y-2">
            {!collapsed && (
              <div className="px-3 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Support
              </div>
            )}
            
            {helpNavItems.map((item, index) => (
              <Button
                key={index}
                variant="ghost"
                size="sm"
                className={cn(
                  "sidebar-item font-medium w-full justify-start",
                  collapsed && "justify-center px-0"
                )}
                onClick={item.onClick}
              >
                <item.icon className="h-4 w-4 mr-2" />
                {!collapsed && <span>{item.label}</span>}
              </Button>
            ))}
          </div>
        </nav>
      </ScrollArea>
      
      {/* Footer */}
      <div className="border-t p-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-status-active"></div>
            {!collapsed && <span className="text-sm text-muted-foreground">Connected</span>}
          </div>
          <ThemeToggle />
        </div>
        
        {/* Social Media Icons */}
        <div className="flex justify-center gap-3 mt-3">
          <Button variant="ghost" size="icon" className="h-7 w-7 rounded-full" asChild>
            <a href="https://twitter.com/mcpnow" target="_blank" rel="noopener noreferrer" aria-label="Twitter">
              <Twitter className="h-4 w-4 text-[#1DA1F2]" />
            </a>
          </Button>
          <Button variant="ghost" size="icon" className="h-7 w-7 rounded-full" asChild>
            <a href="https://github.com/mcpnow" target="_blank" rel="noopener noreferrer" aria-label="GitHub">
              <Github className="h-4 w-4" />
            </a>
          </Button>
          <Button variant="ghost" size="icon" className="h-7 w-7 rounded-full" asChild>
            <a href="https://discord.gg/mcpnow" target="_blank" rel="noopener noreferrer" aria-label="Discord">
              <MessageSquare className="h-4 w-4 text-[#5865F2]" />
            </a>
          </Button>
        </div>
      </div>
      
      {/* Feedback Dialog */}
      <FeedbackDialog open={showFeedbackDialog} onOpenChange={setShowFeedbackDialog} />
    </div>
  );
}
