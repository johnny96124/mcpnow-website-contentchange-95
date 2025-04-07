
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useOnboarding } from "@/context/OnboardingContext";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ArrowRight, ExternalLink } from "lucide-react";

export function WelcomeModal() {
  const [isOpen, setIsOpen] = useState(false);
  const { startOnboarding } = useOnboarding();
  
  // 检查是否是新用户（实际应用中可能基于localStorage或其他状态）
  useEffect(() => {
    const hasSeenWelcome = localStorage.getItem('mcpnow-welcomed');
    if (!hasSeenWelcome) {
      setIsOpen(true);
    }
  }, []);

  const handleStartOnboarding = () => {
    localStorage.setItem('mcpnow-welcomed', 'true');
    setIsOpen(false);
    startOnboarding();
  };

  const handleSkip = () => {
    localStorage.setItem('mcpnow-welcomed', 'true');
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader className="text-center">
          <div className="flex justify-center mb-4">
            <img 
              src="/lovable-uploads/0ad4c791-4d08-4e94-bbeb-3ac78aae67ef.png" 
              alt="MCP Now Logo" 
              className="h-16 w-16" 
            />
          </div>
          <DialogTitle className="text-2xl">欢迎使用 MCP Now</DialogTitle>
          <DialogDescription className="mt-2 text-base">
            MCP Now 让您可以轻松管理多种服务器和配置。
            让我们通过一个简单的引导，帮助您了解系统的基本功能。
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-5 py-4">
          <div className="rounded-lg bg-muted p-4">
            <h3 className="font-medium mb-1">您将学习如何:</h3>
            <ul className="space-y-2 text-sm">
              <li className="flex items-start gap-2">
                <span className="bg-primary/20 text-primary rounded-full p-1 mt-0.5">
                  <span className="block h-3 w-3 rounded-full bg-primary" />
                </span>
                <span>从发现页面安装服务器</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="bg-primary/20 text-primary rounded-full p-1 mt-0.5">
                  <span className="block h-3 w-3 rounded-full bg-primary" />
                </span>
                <span>创建服务器实例并配置环境</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="bg-primary/20 text-primary rounded-full p-1 mt-0.5">
                  <span className="block h-3 w-3 rounded-full bg-primary" />
                </span>
                <span>将实例添加到配置文件中</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="bg-primary/20 text-primary rounded-full p-1 mt-0.5">
                  <span className="block h-3 w-3 rounded-full bg-primary" />
                </span>
                <span>将配置文件分配给主机</span>
              </li>
            </ul>
          </div>
        </div>

        <DialogFooter className="flex sm:justify-between sm:space-x-0 gap-3">
          <div className="flex items-center gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleSkip}
            >
              跳过引导
            </Button>
            <Button 
              variant="link" 
              size="sm" 
              className="text-muted-foreground"
            >
              查看文档 <ExternalLink className="ml-1 h-3 w-3" />
            </Button>
          </div>
          <Button onClick={handleStartOnboarding} className="gap-1">
            开始引导 <ArrowRight className="h-4 w-4" />
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
