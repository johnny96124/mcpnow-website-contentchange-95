import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Bot, 
  Check, 
  AlertCircle, 
  Loader2, 
  MessageSquare,
  Server,
  Key,
  Settings,
  Play
} from "lucide-react";
import { ServerDefinition } from "@/data/mockData";
import { useToast } from "@/hooks/use-toast";

interface AIInstallDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  serverDefinition: ServerDefinition | null;
  onComplete: (instanceData: any) => void;
  onStartAIChat: (context: any) => void;
}

type InstallStep = 
  | 'confirm'
  | 'connection_mode'
  | 'dependencies'
  | 'api_keys'
  | 'configure'
  | 'verify'
  | 'complete';

interface InstallProgress {
  step: InstallStep;
  completed: InstallStep[];
  data: {
    connectionMode?: 'HTTP_SSE' | 'STDIO' | 'WS';
    dependencies?: { name: string; status: 'missing' | 'installed' | 'installing' }[];
    apiKeys?: { name: string; required: boolean; provided: boolean }[];
    configuration?: Record<string, any>;
    verificationResult?: { success: boolean; message: string };
  };
}

export const AIInstallDialog: React.FC<AIInstallDialogProps> = ({
  open,
  onOpenChange,
  serverDefinition,
  onComplete,
  onStartAIChat
}) => {
  const { toast } = useToast();
  const [progress, setProgress] = useState<InstallProgress>({
    step: 'confirm',
    completed: [],
    data: {}
  });

  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    if (open && serverDefinition) {
      // Reset progress when dialog opens
      setProgress({
        step: 'confirm',
        completed: [],
        data: {}
      });
    }
  }, [open, serverDefinition]);

  const stepLabels = {
    confirm: "确认安装",
    connection_mode: "选择连接模式",
    dependencies: "检查依赖项",
    api_keys: "配置API密钥",
    configure: "完成配置",
    verify: "验证安装",
    complete: "安装完成"
  };

  const stepIcons = {
    confirm: MessageSquare,
    connection_mode: Settings,
    dependencies: Server,
    api_keys: Key,
    configure: Settings,
    verify: Play,
    complete: Check
  };

  const totalSteps = Object.keys(stepLabels).length;
  const currentStepIndex = Object.keys(stepLabels).indexOf(progress.step);
  const progressPercentage = (progress.completed.length / totalSteps) * 100;

  const handleStartAIChat = () => {
    const aiContext = {
      type: 'server_installation',
      serverDefinition,
      currentStep: progress.step,
      progress: progress,
      messages: [
        {
          role: 'assistant',
          content: `你好！我将协助你安装 ${serverDefinition?.name} 服务器。让我们开始安装过程。

首先，请确认你要安装 **${serverDefinition?.name}** 吗？

**服务器信息：**
- 类型：${serverDefinition?.type}
- 描述：${serverDefinition?.description}
- 官方服务器：${serverDefinition?.isOfficial ? '是' : '否'}

如果确认，请回复"确认"或"yes"，我将引导你完成接下来的步骤。`
        }
      ]
    };
    
    onStartAIChat(aiContext);
    onOpenChange(false);
  };

  const mockInstallStep = async (step: InstallStep) => {
    setIsProcessing(true);
    
    // Simulate AI processing time
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const newCompleted = [...progress.completed, progress.step];
    
    switch (step) {
      case 'confirm':
        setProgress({
          step: 'connection_mode',
          completed: newCompleted,
          data: { ...progress.data }
        });
        break;
        
      case 'connection_mode':
        setProgress({
          step: 'dependencies',
          completed: newCompleted,
          data: { 
            ...progress.data, 
            connectionMode: serverDefinition?.type || 'HTTP_SSE'
          }
        });
        break;
        
      case 'dependencies':
        setProgress({
          step: 'api_keys',
          completed: newCompleted,
          data: { 
            ...progress.data,
            dependencies: [
              { name: 'Node.js', status: 'installed' },
              { name: 'npm', status: 'installed' },
              { name: serverDefinition?.name || 'Server Package', status: 'installed' }
            ]
          }
        });
        break;
        
      case 'api_keys':
        setProgress({
          step: 'configure',
          completed: newCompleted,
          data: { 
            ...progress.data,
            apiKeys: [
              { name: 'API_KEY', required: true, provided: true }
            ]
          }
        });
        break;
        
      case 'configure':
        setProgress({
          step: 'verify',
          completed: newCompleted,
          data: { 
            ...progress.data,
            configuration: {
              name: `${serverDefinition?.name} Instance`,
              url: 'http://localhost:8080',
              enabled: true
            }
          }
        });
        break;
        
      case 'verify':
        setProgress({
          step: 'complete',
          completed: newCompleted,
          data: { 
            ...progress.data,
            verificationResult: { success: true, message: '服务器连接测试成功！' }
          }
        });
        break;
        
      case 'complete':
        // Handle completion
        onComplete(progress.data.configuration);
        toast({
          title: "安装成功",
          description: `${serverDefinition?.name} 已成功安装并添加到您的配置中。`
        });
        onOpenChange(false);
        break;
    }
    
    setIsProcessing(false);
  };

  const renderStepContent = () => {
    const StepIcon = stepIcons[progress.step];
    
    return (
      <div className="space-y-4">
        <div className="flex items-center gap-3 p-4 bg-blue-50 dark:bg-blue-950/30 rounded-lg">
          <Bot className="h-6 w-6 text-blue-600" />
          <div>
            <h3 className="font-medium text-blue-900 dark:text-blue-100">AI 安装助手</h3>
            <p className="text-sm text-blue-700 dark:text-blue-300">
              我将引导您完成 {serverDefinition?.name} 的安装过程
            </p>
          </div>
        </div>

        <Card>
          <CardContent className="p-6">
            {progress.step === 'confirm' && (
              <div className="space-y-6">
                <div className="text-center">
                  <h3 className="text-lg font-semibold mb-2">即将安装：{serverDefinition?.name}</h3>
                  <p className="text-sm text-muted-foreground">
                    {serverDefinition?.description}
                  </p>
                  <div className="flex justify-center mt-3">
                    <Badge variant="secondary" className="text-xs">
                      {serverDefinition?.type} 连接
                    </Badge>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <h4 className="font-medium text-center">AI助手将为您完成以下步骤：</h4>
                  <div className="grid grid-cols-1 gap-3">
                    <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                      <Settings className="h-4 w-4 text-blue-600" />
                      <span className="text-sm">智能选择最佳连接模式</span>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                      <Server className="h-4 w-4 text-green-600" />
                      <span className="text-sm">自动检查并配置依赖项</span>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                      <Key className="h-4 w-4 text-orange-600" />
                      <span className="text-sm">引导配置必要的API密钥</span>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                      <Play className="h-4 w-4 text-purple-600" />
                      <span className="text-sm">验证服务器连接并完成配置</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            {progress.step === 'connection_mode' && (
              <div className="space-y-3">
                <p className="text-sm">
                  推荐使用 <Badge variant="outline">{serverDefinition?.type}</Badge> 连接模式
                </p>
                <p className="text-sm text-muted-foreground">
                  这是最适合 {serverDefinition?.name} 的连接方式。
                </p>
              </div>
            )}
            
            {progress.step === 'dependencies' && progress.data.dependencies && (
              <div className="space-y-2">
                {progress.data.dependencies.map((dep, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-green-600" />
                    <span className="text-sm">{dep.name}</span>
                    <Badge variant="outline" className="text-xs">已安装</Badge>
                  </div>
                ))}
              </div>
            )}
            
            {progress.step === 'api_keys' && progress.data.apiKeys && (
              <div className="space-y-2">
                {progress.data.apiKeys.map((key, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-green-600" />
                    <span className="text-sm">{key.name}</span>
                    <Badge variant="outline" className="text-xs">已配置</Badge>
                  </div>
                ))}
              </div>
            )}
            
            {progress.step === 'verify' && progress.data.verificationResult && (
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-green-600" />
                  <span className="text-sm">{progress.data.verificationResult.message}</span>
                </div>
              </div>
            )}
            
            {progress.step === 'complete' && (
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-green-600">
                  <Check className="h-5 w-5" />
                  <span className="font-medium">安装完成！</span>
                </div>
                <p className="text-sm text-muted-foreground">
                  {serverDefinition?.name} 已成功安装并配置完成。服务器实例已添加到您的当前配置文件中。
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    );
  };

  if (!serverDefinition) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Bot className="h-5 w-5" />
            AI 辅助安装 - {serverDefinition.name}
          </DialogTitle>
        </DialogHeader>

        {renderStepContent()}

        <DialogFooter className="flex justify-between">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isProcessing}
          >
            取消
          </Button>
          
          <div className="flex gap-2">
            {progress.step === 'confirm' && (
              <Button
                onClick={handleStartAIChat}
                disabled={isProcessing}
                className="gap-2"
              >
                <MessageSquare className="h-4 w-4" />
                开始AI对话安装
              </Button>
            )}
            
            {progress.step !== 'confirm' && progress.step !== 'complete' && (
              <Button
                onClick={() => mockInstallStep(progress.step)}
                disabled={isProcessing}
                className="gap-2"
              >
                {isProcessing && <Loader2 className="h-4 w-4 animate-spin" />}
                {isProcessing ? '处理中...' : '继续'}
              </Button>
            )}
            
            {progress.step === 'complete' && (
              <Button
                onClick={() => onOpenChange(false)}
                className="gap-2"
              >
                <Check className="h-4 w-4" />
                完成
              </Button>
            )}
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};