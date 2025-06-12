
import React from 'react';
import { UserProfile, useUser } from '@clerk/clerk-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { User, Settings, Shield, CreditCard } from 'lucide-react';

const AccountSettings: React.FC = () => {
  const { user } = useUser();

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Account Settings</h1>
          <p className="text-muted-foreground mt-1">
            Manage your account preferences and profile information
          </p>
        </div>
        <Badge variant="secondary" className="bg-blue-100 text-blue-700">
          <User className="h-3 w-3 mr-1" />
          {user?.primaryEmailAddress?.emailAddress}
        </Badge>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <div className="md:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                Profile Information
              </CardTitle>
            </CardHeader>
            <CardContent>
              <UserProfile 
                routing="hash"
                appearance={{
                  elements: {
                    rootBox: "w-full",
                    card: "shadow-none border-0"
                  }
                }}
              />
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Account Plan
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                  Free Plan
                </Badge>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Hosts</span>
                    <span className="font-medium">Unlimited</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Profiles</span>
                    <span className="font-medium">5</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Cloud Sync</span>
                    <span className="font-medium">Basic</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="h-5 w-5" />
                Usage Stats
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Active Hosts</span>
                  <span className="font-medium">3</span>
                </div>
                <div className="flex justify-between">
                  <span>Total Servers</span>
                  <span className="font-medium">12</span>
                </div>
                <div className="flex justify-between">
                  <span>Profiles Created</span>
                  <span className="font-medium">2</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AccountSettings;
