import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';

interface AIInstallationContext {
  type: 'server_installation';
  serverDefinition: any;
  currentStep: string;
  progress: any;
  messages: Array<{
    role: 'user' | 'assistant';
    content: string;
  }>;
}

export const useAIInstallation = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isAIInstallationActive, setIsAIInstallationActive] = useState(false);

  const startAIInstallation = useCallback((context: AIInstallationContext) => {
    setIsAIInstallationActive(true);
    
    // Store the context in sessionStorage for the AI chat page
    sessionStorage.setItem('aiInstallationContext', JSON.stringify(context));
    
    // Navigate to AI chat page with special mode
    navigate('/ai-chat?mode=installation');
    
    toast({
      title: "AI 安装助手已启动",
      description: "正在为您打开AI对话界面",
    });
  }, [navigate, toast]);

  const completeAIInstallation = useCallback(() => {
    setIsAIInstallationActive(false);
    sessionStorage.removeItem('aiInstallationContext');
  }, []);

  const getAIInstallationContext = useCallback((): AIInstallationContext | null => {
    const contextStr = sessionStorage.getItem('aiInstallationContext');
    if (!contextStr) return null;
    
    try {
      return JSON.parse(contextStr);
    } catch (error) {
      console.error('Failed to parse AI installation context:', error);
      return null;
    }
  }, []);

  return {
    isAIInstallationActive,
    startAIInstallation,
    completeAIInstallation,
    getAIInstallationContext
  };
};