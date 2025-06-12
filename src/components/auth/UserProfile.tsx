
import React from 'react';
import { useUser, useClerk } from '@clerk/clerk-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Settings, LogOut, User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface UserProfileProps {
  collapsed?: boolean;
}

export const UserProfile: React.FC<UserProfileProps> = ({ collapsed = false }) => {
  const { user } = useUser();
  const { signOut } = useClerk();
  const navigate = useNavigate();

  if (!user) return null;

  const handleSignOut = () => {
    signOut();
    navigate('/auth/sign-in');
  };

  const handleAccountSettings = () => {
    navigate('/account');
  };

  if (collapsed) {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 rounded-full p-0">
            <Avatar className="h-8 w-8">
              <AvatarImage src={user.imageUrl} alt={user.fullName || 'User'} />
              <AvatarFallback>
                {user.firstName?.charAt(0) || user.emailAddresses[0]?.emailAddress.charAt(0) || 'U'}
              </AvatarFallback>
            </Avatar>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          <DropdownMenuLabel>My Account</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={handleAccountSettings}>
            <User className="mr-2 h-4 w-4" />
            Account Settings
          </DropdownMenuItem>
          <DropdownMenuItem onClick={handleSignOut}>
            <LogOut className="mr-2 h-4 w-4" />
            Sign out
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="w-full justify-start h-auto p-2">
          <div className="flex items-center gap-2 w-full">
            <Avatar className="h-8 w-8">
              <AvatarImage src={user.imageUrl} alt={user.fullName || 'User'} />
              <AvatarFallback>
                {user.firstName?.charAt(0) || user.emailAddresses[0]?.emailAddress.charAt(0) || 'U'}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 text-left overflow-hidden">
              <p className="text-sm font-medium truncate">
                {user.fullName || user.emailAddresses[0]?.emailAddress}
              </p>
              <p className="text-xs text-muted-foreground truncate">
                {user.emailAddresses[0]?.emailAddress}
              </p>
            </div>
          </div>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel>My Account</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleAccountSettings}>
          <Settings className="mr-2 h-4 w-4" />
          Account Settings
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleSignOut}>
          <LogOut className="mr-2 h-4 w-4" />
          Sign out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
