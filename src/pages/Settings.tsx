import { useState, useEffect } from "react";
import { Laptop, Moon, RefreshCw, Sun, Download, Check, Globe, BugOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useTheme } from "@/components/theme/theme-provider";
import { useToast } from "@/components/ui/use-toast";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";

const DEFAULT_PORT = 8008;
const APP_VERSION = "1.0.0";

const Settings = () => {
  const { theme, setTheme } = useTheme();
  const { toast } = useToast();
  
  const [settings, setSettings] = useState({
    startOnLogin: true,
    port: DEFAULT_PORT,
    autoUpdate: true,
    minimizeToTray: true,
    downloadMajorUpdates: false,
    language: 'en',
    sendErrorLogs: true,
  });
  
  const [initialPort, setInitialPort] = useState(settings.port);
  const [portChanged, setPortChanged] = useState(false);
  const [checkingForUpdate, setCheckingForUpdate] = useState(false);
  const [updateAvailable, setUpdateAvailable] = useState(false);
  const [downloadingUpdate, setDownloadingUpdate] = useState(false);
  const [downloadProgress, setDownloadProgress] = useState(0);
  const [updateReady, setUpdateReady] = useState(false);
  
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
  
  const checkForUpdates = () => {
    setCheckingForUpdate(true);
    // Simulate checking for updates
    setTimeout(() => {
      setCheckingForUpdate(false);
      setUpdateAvailable(true);
      toast({
        title: "Update available",
        description: "A new version (1.1.0) is available to download."
      });
    }, 2000);
  };
  
  const downloadUpdate = () => {
    setDownloadingUpdate(true);
    setDownloadProgress(0);
    
    // Simulate download progress
    const interval = setInterval(() => {
      setDownloadProgress(prev => {
        const newProgress = prev + 10;
        if (newProgress >= 100) {
          clearInterval(interval);
          setDownloadingUpdate(false);
          setUpdateReady(true);
          toast({
            title: "Update downloaded",
            description: "Update is ready to install."
          });
          return 100;
        }
        return newProgress;
      });
    }, 500);
  };
  
  const installUpdate = () => {
    toast({
      title: "Installing update",
      description: "The application will restart to complete the installation."
    });
    
    // Simulate app restart
    setTimeout(() => {
      setUpdateAvailable(false);
      setUpdateReady(false);
    }, 2000);
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
                <label className="text-sm font-medium">Language</label>
                <p className="text-xs text-muted-foreground">
                  Choose your preferred display language
                </p>
              </div>
              <Select
                value={settings.language}
                onValueChange={(value) => updateSetting('language', value)}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue defaultValue="en" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="en">
                    <div className="flex items-center gap-2">
                      <Globe className="h-4 w-4" />
                      English
                    </div>
                  </SelectItem>
                  <SelectItem value="zh">
                    <div className="flex items-center gap-2">
                      <Globe className="h-4 w-4" />
                      中文
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <label className="text-sm font-medium">Send Error Logs</label>
                <p className="text-xs text-muted-foreground">
                  Help improve MCP Now by sending anonymous error reports
                </p>
              </div>
              <Switch
                checked={settings.sendErrorLogs}
                onCheckedChange={(checked) => updateSetting('sendErrorLogs', checked)}
              />
            </div>

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
            <CardTitle>Updates</CardTitle>
            <CardDescription>
              Configure how MCP Now handles updates
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <label className="text-sm font-medium">Automatically download major updates</label>
                <p className="text-xs text-muted-foreground">
                  MCP Now automatically downloads minor updates and bug fixes
                </p>
              </div>
              <Switch
                checked={settings.downloadMajorUpdates}
                onCheckedChange={(checked) => updateSetting('downloadMajorUpdates', checked)}
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
            
            <Separator className="my-2" />
            
            <div className="space-y-2">
              <div className="flex justify-between">
                <div>
                  <h4 className="text-sm font-medium">MCP Now v{APP_VERSION}</h4>
                  {!updateAvailable && !updateReady && (
                    <p className="text-xs text-muted-foreground">You are up to date!</p>
                  )}
                  {updateAvailable && !updateReady && !downloadingUpdate && (
                    <p className="text-xs text-muted-foreground">Version 1.1.0 is available</p>
                  )}
                  {downloadingUpdate && (
                    <div className="mt-2 space-y-2">
                      <p className="text-xs text-muted-foreground">Downloading update...</p>
                      <Progress value={downloadProgress} className="h-2" />
                    </div>
                  )}
                  {updateReady && (
                    <p className="text-xs text-muted-foreground">Update ready to install</p>
                  )}
                </div>
                {!checkingForUpdate && !updateAvailable && !updateReady && (
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={checkForUpdates}
                  >
                    Check for updates
                  </Button>
                )}
                {checkingForUpdate && (
                  <Button 
                    variant="outline" 
                    size="sm"
                    disabled
                  >
                    <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                    Checking...
                  </Button>
                )}
                {updateAvailable && !downloadingUpdate && !updateReady && (
                  <Button 
                    variant="default" 
                    size="sm"
                    onClick={downloadUpdate}
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Download
                  </Button>
                )}
                {updateReady && (
                  <Button 
                    variant="default" 
                    size="sm"
                    onClick={installUpdate}
                  >
                    <Check className="h-4 w-4 mr-2" />
                    Install now
                  </Button>
                )}
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
