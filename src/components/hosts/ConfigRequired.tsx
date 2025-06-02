
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AlertCircle, Settings } from 'lucide-react';

interface ConfigRequiredProps {
  onConfig: () => void;
}

export const ConfigRequired: React.FC<ConfigRequiredProps> = ({ onConfig }) => {
  return (
    <Card className="border-orange-200 bg-orange-50 dark:border-orange-800 dark:bg-orange-950/20">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-orange-800 dark:text-orange-200">
          <AlertCircle className="h-5 w-5" />
          Configuration Required
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-orange-700 dark:text-orange-300">
          This host needs to be configured before you can use it. Click the button below to set up the configuration.
        </p>
        <Button onClick={onConfig} className="bg-orange-600 hover:bg-orange-700 text-white">
          <Settings className="h-4 w-4 mr-2" />
          Configure Host
        </Button>
      </CardContent>
    </Card>
  );
};
