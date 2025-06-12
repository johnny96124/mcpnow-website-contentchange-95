
import { NavLink, useNavigate } from "react-router-dom";
import { 
  LayoutDashboard,
  Settings, 
  HelpCircle,
  BookOpen,
  Telescope,
  Home,
  MessageSquare,
  User,
  LogIn
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useState } from "react";
import { HelpDialog } from "@/components/help/HelpDialog";
import { GettingStartedDialog } from "@/components/onboarding/GettingStartedDialog";
import { ThemeToggle } from "@/components/theme/theme-toggle";
import { SocialLinks } from "./SocialLinks";
import { useAuth, useUser, SignOutButton } from "@clerk/clerk-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";

interface MainSidebarProps {
  collapsed?: boolean;
}

export function MainSidebar({ collapsed = false }: MainSidebarProps) {
  const [showGettingStarted, setShowGettingStarted] = useState(false);
  const { isSignedIn } = useAuth();
  const { user } = useUser();
  const navigate = useNavigate();
  
  const handleLogoClick = () => {
    navigate('/website-en');
  };
  
  return (
    <div className="border-r bg-sidebar h-full flex flex-col">
      <div className="p-4 border-b">
        <div className="flex items-center gap-2 cursor-pointer" onClick={handleLogoClick}>
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
          <NavLink 
            to="/" 
            className={({ isActive }) => 
              cn(
                "sidebar-item text-sm", 
                isActive && "sidebar-item-active",
                collapsed && "justify-center px-0"
              )
            }
          >
            <LayoutDashboard className="h-4 w-4 mr-2" />
            {!collapsed && "Dashboard"}
          </NavLink>

          <NavLink 
            to="/website-en" 
            className={({ isActive }) => 
              cn(
                "sidebar-item text-sm", 
                isActive && "sidebar-item-active",
                collapsed && "justify-center px-0"
              )
            }
          >
            <Home className="h-4 w-4 mr-2" />
            {!collapsed && "Introduction"}
          </NavLink>

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
            <Telescope className="h-4 w-4 mr-2" />
            {!collapsed && "Discovery"}
          </NavLink>

          <NavLink 
            to="/ai-chat" 
            className={({ isActive }) => 
              cn(
                "sidebar-item text-sm", 
                isActive && "sidebar-item-active",
                collapsed && "justify-center px-0"
              )
            }
          >
            <MessageSquare className="h-4 w-4 mr-2" />
            {!collapsed && "AI Chat"}
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

          {isSignedIn && (
            <NavLink 
              to="/account" 
              className={({ isActive }) => 
                cn(
                  "sidebar-item text-sm", 
                  isActive && "sidebar-item-active",
                  collapsed && "justify-center px-0"
                )
              }
            >
              <User className="h-4 w-4 mr-2" />
              {!collapsed && "Account"}
            </NavLink>
          )}
        </nav>
      </ScrollArea>
      
      <SocialLinks />
      
      {/* User Authentication Section */}
      <div className="border-t p-4 space-y-3">
        {isSignedIn && user ? (
          <div className={cn("flex items-center gap-2", collapsed && "justify-center")}>
            {collapsed ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="rounded-full h-8 w-8">
                    <Avatar className="h-6 w-6">
                      <AvatarImage src={user.imageUrl} />
                      <AvatarFallback>{user.firstName?.[0] || user.emailAddresses[0]?.emailAddress[0]}</AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>
                    {user.firstName ? `${user.firstName} ${user.lastName || ''}` : user.emailAddresses[0]?.emailAddress}
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => navigate('/account')}>
                    <User className="h-4 w-4 mr-2" />
                    Account Settings
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <SignOutButton>
                      <span className="flex items-center w-full">
                        <LogIn className="h-4 w-4 mr-2" />
                        Sign Out
                      </span>
                    </SignOutButton>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="justify-start gap-2 px-2 h-auto py-2">
                    <Avatar className="h-6 w-6">
                      <AvatarImage src={user.imageUrl} />
                      <AvatarFallback>{user.firstName?.[0] || user.emailAddresses[0]?.emailAddress[0]}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 text-left overflow-hidden">
                      <p className="text-sm font-medium truncate">
                        {user.firstName ? `${user.firstName} ${user.lastName || ''}` : 'User'}
                      </p>
                      <p className="text-xs text-muted-foreground truncate">
                        {user.emailAddresses[0]?.emailAddress}
                      </p>
                    </div>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => navigate('/account')}>
                    <User className="h-4 w-4 mr-2" />
                    Account Settings
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <SignOutButton>
                      <span className="flex items-center w-full">
                        <LogIn className="h-4 w-4 mr-2" />
                        Sign Out
                      </span>
                    </SignOutButton>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
        ) : (
          <Button 
            variant="default" 
            size="sm" 
            className={cn("w-full", collapsed && "px-2")}
            onClick={() => navigate('/auth')}
          >
            <LogIn className="h-4 w-4 mr-2" />
            {!collapsed && "Sign In"}
          </Button>
        )}
        
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
