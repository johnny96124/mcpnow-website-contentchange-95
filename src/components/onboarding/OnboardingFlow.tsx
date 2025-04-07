
import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useOnboarding } from "@/context/OnboardingContext";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { ChevronRight, X, CheckCircle, Server, Cpu, FolderPlus, HardDrive } from "lucide-react";
import { cn } from "@/lib/utils";

export function OnboardingFlow() {
  const { 
    isOnboarding, 
    currentStep, 
    skipOnboarding, 
    nextStep, 
    selectedServerId,
    selectedInstanceId,
    selectedProfileId,
    selectedHostId
  } = useOnboarding();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    // 只在引导进行中显示
    setIsOpen(isOnboarding);
  }, [isOnboarding]);

  // 根据当前路径和步骤选择合适的引导内容
  const getStepContent = () => {
    switch (currentStep) {
      case "discover":
        return {
          icon: <Server className="h-8 w-8 text-primary" />,
          title: "安装服务器",
          description: "浏览可用的服务器并添加一个到您的系统中",
          hint: "在服务器卡片上点击「添加服务器」按钮",
          canProceed: !!selectedServerId,
          cta: "安装了服务器？继续下一步"
        };
      case "create-instance":
        return {
          icon: <Cpu className="h-8 w-8 text-primary" />,
          title: "创建服务器实例",
          description: "为您安装的服务器创建一个实例",
          hint: "填写实例信息并点击「创建实例」",
          canProceed: !!selectedInstanceId,
          cta: "创建了实例？继续下一步"
        };
      case "add-to-profile":
        return {
          icon: <FolderPlus className="h-8 w-8 text-primary" />,
          title: "添加到配置文件",
          description: "创建或选择一个配置文件，并将实例添加到其中",
          hint: "在配置文件页面，创建或编辑配置文件并添加实例",
          canProceed: !!selectedProfileId,
          cta: "添加到配置文件？继续下一步"
        };
      case "assign-profile":
        return {
          icon: <HardDrive className="h-8 w-8 text-primary" />,
          title: "分配配置文件到主机",
          description: "将您创建的配置文件分配给一个主机",
          hint: "在主机页面，选择一个主机并分配配置文件",
          canProceed: !!selectedHostId,
          cta: "配置完成主机？完成引导"
        };
      default:
        return {
          icon: <CheckCircle className="h-8 w-8 text-primary" />,
          title: "设置完成",
          description: "恭喜！您已完成初始设置",
          hint: "",
          canProceed: true,
          cta: "完成引导"
        };
    }
  };

  const content = getStepContent();

  const handleNext = () => {
    if (currentStep === "complete") {
      skipOnboarding();
      setIsOpen(false);
    } else {
      nextStep();
    }
  };

  const handleSkip = () => {
    skipOnboarding();
    setIsOpen(false);
  };

  // 步骤指示器
  const steps = [
    { id: "discover", label: "发现服务器", icon: Server },
    { id: "create-instance", label: "创建实例", icon: Cpu },
    { id: "add-to-profile", label: "添加到配置文件", icon: FolderPlus },
    { id: "assign-profile", label: "分配到主机", icon: HardDrive },
  ];

  if (!isOnboarding) {
    return null;
  }

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetContent 
        side="right" 
        className="w-[350px] sm:w-[400px] border-l-4 border-l-primary"
      >
        <SheetHeader className="mb-6">
          <div className="flex items-center justify-between">
            <SheetTitle className="text-xl font-semibold">新手引导</SheetTitle>
            <Button 
              variant="outline" 
              size="icon" 
              className="h-8 w-8" 
              onClick={handleSkip}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
          <SheetDescription>
            我们将引导您完成MCP Now的基本设置
          </SheetDescription>
        </SheetHeader>
        
        {/* 步骤指示器 */}
        <div className="mb-8">
          <div className="flex items-center justify-between px-2">
            {steps.map((step, i) => (
              <div key={step.id} className="flex flex-col items-center">
                <div 
                  className={cn(
                    "flex items-center justify-center w-10 h-10 rounded-full border-2",
                    currentStep === step.id 
                      ? "border-primary bg-primary text-primary-foreground"
                      : currentStep === "complete" || 
                        steps.findIndex(s => s.id === currentStep) > i
                        ? "border-primary bg-primary/20" 
                        : "border-muted bg-muted/20"
                  )}
                >
                  <step.icon className="h-5 w-5" />
                </div>
                {i < steps.length - 1 && (
                  <div className={cn(
                    "w-[50px] h-[2px] mt-5",
                    currentStep === "complete" || 
                    steps.findIndex(s => s.id === currentStep) > i
                      ? "bg-primary" 
                      : "bg-muted"
                  )} />
                )}
              </div>
            ))}
          </div>
          <div className="flex justify-between mt-2 px-0 text-xs">
            {steps.map((step) => (
              <div 
                key={`label-${step.id}`} 
                className={cn(
                  "text-center w-[70px]",
                  currentStep === step.id && "font-medium text-primary"
                )}
              >
                {step.label}
              </div>
            ))}
          </div>
        </div>
        
        {/* 当前步骤内容 */}
        <div className="space-y-6">
          <div className="flex flex-col items-center text-center space-y-3 py-4">
            {content.icon}
            <h3 className="text-xl font-semibold">{content.title}</h3>
            <p className="text-muted-foreground">{content.description}</p>
          </div>
          
          {content.hint && (
            <div className="bg-muted p-4 rounded-lg text-sm">
              <span className="font-medium">提示：</span> {content.hint}
            </div>
          )}
        </div>
        
        <div className="absolute bottom-0 left-0 w-full p-6 border-t bg-background">
          <div className="flex justify-between">
            <Button 
              variant="outline" 
              onClick={handleSkip}
            >
              跳过引导
            </Button>
            <Button 
              onClick={handleNext}
              disabled={!content.canProceed}
              className="gap-1"
            >
              {content.cta}
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
