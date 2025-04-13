
import { useState } from "react";
import { ExternalLink, Info, ChevronRight, ArrowRight, PlusCircle, Search, Server, Settings, Download, Globe, Database, Cpu, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { StatusIndicator } from "@/components/status/StatusIndicator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger 
} from "@/components/ui/tooltip";
import { 
  Popover,
  PopoverContent,
  PopoverTrigger 
} from "@/components/ui/popover";
import { serverDefinitions } from "@/data/mockData";

/**
 * A component that displays a first-time user experience in the System Tray.
 * This guides new users through the initial steps of setting up and using the application.
 */
const NewUserTrayPopup = () => {
  const [currentStep, setCurrentStep] = useState<'welcome' | 'discover-install' | 'create-instance' | 'create-profile' | 'associate-host'>('welcome');
  
  // Open the main dashboard in a new window
  const openDashboard = () => {
    window.open("/", "_blank");
  };

  // Open specific pages directly
  const openDiscoveryPage = () => {
    window.open("/discovery", "_blank");
  };

  const openServersPage = () => {
    window.open("/servers", "_blank");
  };

  const openProfilesPage = () => {
    window.open("/profiles", "_blank");
  };

  const openHostsPage = () => {
    window.open("/hosts", "_blank");
  };

  // Navigation between steps
  const goToStep = (step: 'welcome' | 'discover-install' | 'create-instance' | 'create-profile' | 'associate-host') => {
    setCurrentStep(step);
  };

  // Get a few featured server definitions for the discovery step
  const featuredServers = serverDefinitions.slice(0, 3);

  return (
    <div className="w-[420px] p-2 bg-background rounded-lg shadow-lg animate-fade-in max-h-[80vh]">
      {/* Header */}
      <div className="flex items-center justify-between p-2 mb-4">
        <div className="flex items-center gap-2">
          <img 
            src="/lovable-uploads/0ad4c791-4d08-4e94-bbeb-3ac78aae67ef.png" 
            alt="MCP Now Logo" 
            className="h-6 w-6" 
          />
          <h2 className="font-medium">MCP Now</h2>
        </div>
        <Button 
          size="sm" 
          variant="ghost"
          className="text-xs flex items-center gap-1"
          onClick={openDashboard}
        >
          <span>打开仪表盘</span>
          <ExternalLink className="h-3 w-3" />
        </Button>
      </div>

      <ScrollArea className="h-full max-h-[calc(80vh-70px)]">
        <div className="pr-3">
          {/* Welcome Step */}
          {currentStep === 'welcome' && (
            <div className="space-y-4 px-1">
              <div className="text-center py-4">
                <h3 className="text-xl font-semibold mb-2">欢迎使用 MCP Now!</h3>
                <p className="text-muted-foreground">
                  让我们开始设置您的环境
                </p>
              </div>
              
              <Card className="overflow-hidden">
                <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/50 dark:to-indigo-950/50">
                  <h4 className="font-medium mb-2">入门指南</h4>
                  <p className="text-sm text-muted-foreground">
                    MCP Now 帮助您管理服务器、配置文件和实例。请按照以下步骤操作：
                  </p>
                </div>
                
                <div className="p-4 space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="bg-primary/10 rounded-full p-1 h-7 w-7 flex items-center justify-center text-primary text-sm font-medium mt-0.5">
                      1
                    </div>
                    <div>
                      <h5 className="font-medium text-sm">从 Discovery 安装服务器</h5>
                      <p className="text-xs text-muted-foreground">
                        浏览并安装您需要的服务器定义
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <div className="bg-primary/10 rounded-full p-1 h-7 w-7 flex items-center justify-center text-primary text-sm font-medium mt-0.5">
                      2
                    </div>
                    <div>
                      <h5 className="font-medium text-sm">创建实例并配置参数</h5>
                      <p className="text-xs text-muted-foreground">
                        根据您的需求为服务器定义创建和配置实例
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <div className="bg-primary/10 rounded-full p-1 h-7 w-7 flex items-center justify-center text-primary text-sm font-medium mt-0.5">
                      3
                    </div>
                    <div>
                      <h5 className="font-medium text-sm">创建 Profile 并添加实例</h5>
                      <p className="text-xs text-muted-foreground">
                        创建配置文件并将服务器实例添加到其中
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="bg-primary/10 rounded-full p-1 h-7 w-7 flex items-center justify-center text-primary text-sm font-medium mt-0.5">
                      4
                    </div>
                    <div>
                      <h5 className="font-medium text-sm">将 Host 与 Profile 关联</h5>
                      <p className="text-xs text-muted-foreground">
                        将配置文件应用到主机以便管理服务器实例
                      </p>
                    </div>
                  </div>
                </div>
              </Card>
              
              <div className="flex justify-end gap-2 pt-2">
                <Button 
                  onClick={() => goToStep('discover-install')}
                  className="gap-1"
                >
                  开始使用
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}

          {/* Discover and Install Servers Step */}
          {currentStep === 'discover-install' && (
            <div className="space-y-4 px-1">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">步骤 1: 发现并安装服务器</h3>
              </div>
              
              <Card className="overflow-hidden">
                <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/50 dark:to-indigo-950/50">
                  <h4 className="font-medium mb-1">选择并安装服务器</h4>
                  <p className="text-sm text-muted-foreground">
                    浏览官方和社区提供的服务器定义
                  </p>
                </div>
                
                <div className="p-4 space-y-4">
                  <div className="grid grid-cols-1 gap-3">
                    {featuredServers.map((server, index) => (
                      <div key={server.id} className="flex items-center justify-between border rounded-md p-3 hover:bg-muted/30 transition-colors">
                        <div className="flex items-center gap-3">
                          <div className="bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-300 p-2 rounded-md">
                            {index === 0 ? <Globe className="h-5 w-5" /> : 
                             index === 1 ? <Database className="h-5 w-5" /> : 
                             <Cpu className="h-5 w-5" />}
                          </div>
                          <div>
                            <h5 className="font-medium text-sm">{server.name}</h5>
                            <p className="text-xs text-muted-foreground line-clamp-1">{server.description}</p>
                          </div>
                        </div>
                        <Button size="sm" className="h-8 gap-1">
                          <Download className="h-3.5 w-3.5" />
                          安装
                        </Button>
                      </div>
                    ))}
                  </div>
                  
                  <Button 
                    variant="outline" 
                    className="w-full mt-2"
                    onClick={openDiscoveryPage}
                  >
                    <Search className="h-4 w-4 mr-2" />
                    查看更多服务器
                  </Button>
                </div>
              </Card>
              
              <Card className="p-4">
                <h4 className="font-medium mb-2">了解服务器类型</h4>
                <div className="space-y-3">
                  <div className="flex items-start gap-2">
                    <div className="bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-300 p-1.5 rounded-md">
                      <Globe className="h-4 w-4" />
                    </div>
                    <div>
                      <h5 className="font-medium text-sm">Web 服务器</h5>
                      <p className="text-xs text-muted-foreground">用于 Web 应用程序的 HTTP/HTTPS 服务器</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-2">
                    <div className="bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-300 p-1.5 rounded-md">
                      <Database className="h-4 w-4" />
                    </div>
                    <div>
                      <h5 className="font-medium text-sm">数据库服务器</h5>
                      <p className="text-xs text-muted-foreground">管理 SQL、NoSQL 和其他数据库实例</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-2">
                    <div className="bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-300 p-1.5 rounded-md">
                      <Cpu className="h-4 w-4" />
                    </div>
                    <div>
                      <h5 className="font-medium text-sm">应用服务器</h5>
                      <p className="text-xs text-muted-foreground">用于运行后端服务和 API 的服务器</p>
                    </div>
                  </div>
                </div>
              </Card>
              
              <div className="flex justify-between gap-2 pt-2">
                <Button 
                  variant="ghost" 
                  onClick={() => goToStep('welcome')}
                >
                  返回
                </Button>
                <Button 
                  onClick={() => goToStep('create-instance')}
                  className="gap-1"
                >
                  下一步
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}

          {/* Create Instance Step */}
          {currentStep === 'create-instance' && (
            <div className="space-y-4 px-1">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">步骤 2: 创建实例并配置参数</h3>
              </div>
              
              <Card className="overflow-hidden">
                <div className="p-6 flex flex-col items-center justify-center text-center space-y-4">
                  <div className="h-20 w-20 rounded-full bg-muted flex items-center justify-center">
                    <Settings className="h-10 w-10 text-muted-foreground opacity-70" />
                  </div>
                  <div>
                    <h4 className="font-medium mb-1">配置服务器实例</h4>
                    <p className="text-sm text-muted-foreground">
                      为您安装的服务器定义创建和配置实例
                    </p>
                  </div>
                  
                  <Button onClick={openServersPage} className="mt-2 gap-1">
                    <PlusCircle className="h-4 w-4" />
                    创建实例
                  </Button>
                </div>
              </Card>

              <Card className="p-4">
                <h4 className="font-medium mb-2">实例配置选项</h4>
                <div className="space-y-3">
                  <div className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500 mt-0.5" />
                    <div>
                      <h5 className="font-medium text-sm">环境变量</h5>
                      <p className="text-xs text-muted-foreground">配置实例的环境变量，如数据库连接字符串、API 密钥等</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500 mt-0.5" />
                    <div>
                      <h5 className="font-medium text-sm">启动参数</h5>
                      <p className="text-xs text-muted-foreground">设置服务器启动时的命令行参数</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500 mt-0.5" />
                    <div>
                      <h5 className="font-medium text-sm">网络设置</h5>
                      <p className="text-xs text-muted-foreground">配置端口、域名和 SSL 证书等网络设置</p>
                    </div>
                  </div>
                </div>
              </Card>
              
              <div className="flex justify-between gap-2 pt-2">
                <Button 
                  variant="ghost" 
                  onClick={() => goToStep('discover-install')}
                >
                  返回
                </Button>
                <Button 
                  onClick={() => goToStep('create-profile')}
                  className="gap-1"
                >
                  下一步
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}

          {/* Create Profile Step */}
          {currentStep === 'create-profile' && (
            <div className="space-y-4 px-1">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">步骤 3: 创建 Profile 并添加实例</h3>
              </div>
              
              <Card className="overflow-hidden">
                <div className="p-6 flex flex-col items-center justify-center text-center space-y-4">
                  <div className="h-20 w-20 rounded-full bg-muted flex items-center justify-center">
                    <Server className="h-10 w-10 text-muted-foreground opacity-70" />
                  </div>
                  <div>
                    <h4 className="font-medium mb-1">创建配置文件</h4>
                    <p className="text-sm text-muted-foreground">
                      创建配置文件并将服务器实例添加到其中
                    </p>
                  </div>
                  
                  <Button onClick={openProfilesPage} className="mt-2 gap-1">
                    <PlusCircle className="h-4 w-4" />
                    创建 Profile
                  </Button>
                </div>
              </Card>

              <Card className="p-4">
                <h4 className="font-medium mb-2">什么是 Profile?</h4>
                <p className="text-sm text-muted-foreground mb-4">
                  Profile 是服务器实例的集合，可以应用于主机。它们允许您快速配置具有一致设置的多个服务器。
                </p>
                <div className="bg-muted/40 p-3 rounded-md">
                  <p className="text-xs text-muted-foreground">
                    <strong>提示：</strong>为开发、测试和生产环境创建不同的配置文件。
                  </p>
                </div>
              </Card>
              
              <div className="flex justify-between gap-2 pt-2">
                <Button 
                  variant="ghost" 
                  onClick={() => goToStep('create-instance')}
                >
                  返回
                </Button>
                <Button 
                  onClick={() => goToStep('associate-host')}
                  className="gap-1"
                >
                  下一步
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}

          {/* Associate Host with Profile Step */}
          {currentStep === 'associate-host' && (
            <div className="space-y-4 px-1">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">步骤 4: 将 Host 与 Profile 关联</h3>
              </div>
              
              <Card className="overflow-hidden">
                <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/50 dark:to-indigo-950/50">
                  <h4 className="font-medium">完成设置</h4>
                </div>
                
                <div className="p-4">
                  <div className="space-y-4">
                    <div className="bg-muted/40 p-3 rounded-md">
                      <h5 className="font-medium text-sm mb-1 flex items-center gap-2">
                        <span className="h-2 w-2 rounded-full bg-orange-400"></span>
                        将 Profile 与 Host 关联
                      </h5>
                      <p className="text-xs text-muted-foreground mb-2">
                        将您的配置文件应用于主机以部署服务器实例
                      </p>
                      <Button variant="outline" size="sm" className="w-full text-xs" onClick={openHostsPage}>
                        管理主机
                      </Button>
                    </div>
                    
                    <div className="bg-muted/40 p-3 rounded-md">
                      <h5 className="font-medium text-sm mb-1 flex items-center gap-2">
                        <span className="h-2 w-2 rounded-full bg-blue-400"></span>
                        配置主机设置
                      </h5>
                      <p className="text-xs text-muted-foreground mb-2">
                        配置每个主机的详细设置，如网络、存储和权限
                      </p>
                      <Button variant="outline" size="sm" className="w-full text-xs" onClick={openHostsPage}>
                        主机配置
                      </Button>
                    </div>
                    
                    <div className="bg-muted/40 p-3 rounded-md">
                      <h5 className="font-medium text-sm mb-1 flex items-center gap-2">
                        <span className="h-2 w-2 rounded-full bg-green-400"></span>
                        开始使用您的服务器
                      </h5>
                      <p className="text-xs text-muted-foreground mb-2">
                        从仪表盘访问和管理您的服务器实例
                      </p>
                      <Button variant="outline" size="sm" className="w-full text-xs" onClick={openDashboard}>
                        前往仪表盘
                      </Button>
                    </div>
                  </div>
                </div>
              </Card>
              
              <div className="flex justify-between gap-2 pt-2">
                <Button 
                  variant="ghost" 
                  onClick={() => goToStep('create-profile')}
                >
                  返回
                </Button>
                <Button 
                  onClick={openDiscoveryPage}
                  variant="default"
                  className="gap-1"
                >
                  开始使用
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
              
              <div className="mt-4 border-t pt-4">
                <p className="text-xs text-center text-muted-foreground">
                  MCP Now 将继续在您的系统托盘中运行
                  <br />随时通过单击任务栏中的图标访问它
                </p>
              </div>
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  );
};

export default NewUserTrayPopup;
