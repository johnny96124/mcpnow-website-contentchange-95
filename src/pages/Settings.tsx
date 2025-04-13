
import { useState, useEffect } from "react";
import { Laptop, Moon, RefreshCw, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { useTheme } from "@/components/theme/theme-provider";
import { useToast } from "@/components/ui/use-toast";

const DEFAULT_PORT = 8008;

const Settings = () => {
  const { theme, setTheme } = useTheme();
  const { toast } = useToast();
  
  const [settings, setSettings] = useState({
    startOnLogin: true,
    port: DEFAULT_PORT,
    autoUpdate: true,
    minimizeToTray: true
  });
  
  const [initialPort, setInitialPort] = useState(settings.port);
  const [portChanged, setPortChanged] = useState(false);
  
  useEffect(() => {
    setPortChanged(settings.port !== initialPort);
  }, [settings.port, initialPort]);
  
  const updateSetting = <K extends keyof typeof settings>(key: K, value: typeof settings[K]) => {
    setSettings({
      ...settings,
      [key]: value
    });
  };

  const handleSavePort = () => {
    setInitialPort(settings.port);
    setPortChanged(false);
    toast({
      title: "Port settings saved",
      description: `Default port has been set to ${settings.port}`
    });
  };
  
  const handleResetPort = () => {
    updateSetting('port', DEFAULT_PORT);
    setInitialPort(DEFAULT_PORT);
    setPortChanged(false);
    toast({
      title: "Port reset",
      description: "Default port has been reset to 8008"
    });
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground">
          Configure application preferences and behavior
        </p>
      </div>
      
      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Application</CardTitle>
            <CardDescription>
              General application settings
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <label className="text-sm font-medium">Start on login</label>
                <p className="text-xs text-muted-foreground">
                  Automatically start MCP Now when your computer boots up
                </p>
              </div>
              <Switch
                checked={settings.startOnLogin}
                onCheckedChange={(checked) => updateSetting('startOnLogin', checked)}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <label className="text-sm font-medium">Minimize to tray</label>
                <p className="text-xs text-muted-foreground">
                  Keep the app running in the system tray when closed
                </p>
              </div>
              <Switch
                checked={settings.minimizeToTray}
                onCheckedChange={(checked) => updateSetting('minimizeToTray', checked)}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <label className="text-sm font-medium">Auto update</label>
                <p className="text-xs text-muted-foreground">
                  Automatically check for and install updates
                </p>
              </div>
              <Switch
                checked={settings.autoUpdate}
                onCheckedChange={(checked) => updateSetting('autoUpdate', checked)}
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Theme</label>
              <div className="grid grid-cols-3 gap-2">
                <Button
                  variant={theme === 'light' ? 'default' : 'outline'}
                  className="w-full justify-start"
                  onClick={() => setTheme('light')}
                >
                  <Sun className="h-4 w-4 mr-2" />
                  Light
                </Button>
                <Button
                  variant={theme === 'dark' ? 'default' : 'outline'}
                  className="w-full justify-start"
                  onClick={() => setTheme('dark')}
                >
                  <Moon className="h-4 w-4 mr-2" />
                  Dark
                </Button>
                <Button
                  variant={theme === 'system' ? 'default' : 'outline'}
                  className="w-full justify-start"
                  onClick={() => setTheme('system')}
                >
                  <Laptop className="h-4 w-4 mr-2" />
                  System
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Network</CardTitle>
            <CardDescription>
              Configure network settings
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Default Port</label>
              <div className="flex items-center gap-2">
                <Input 
                  type="number" 
                  value={settings.port} 
                  onChange={(e) => updateSetting('port', parseInt(e.target.value))}
                  className="flex-1"
                />
                <Button 
                  onClick={handleSavePort} 
                  disabled={!portChanged}
                >
                  Save
                </Button>
                <Button 
                  variant="outline" 
                  onClick={handleResetPort}
                  title="Reset to default port (8008)"
                >
                  <RefreshCw className="h-4 w-4" />
                </Button>
              </div>
              <p className="text-xs text-muted-foreground">
                This port will be used as the base for HTTP SSE endpoints
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Settings;
