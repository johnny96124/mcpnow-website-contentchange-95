
import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { ChatInterface } from '@/components/chat/ChatInterface';
import { useAIInstallation } from '@/hooks/useAIInstallation';

const AIChat = () => {
  const [searchParams] = useSearchParams();
  const { getAIInstallationContext } = useAIInstallation();
  const [installationContext, setInstallationContext] = useState<any>(null);

  useEffect(() => {
    const mode = searchParams.get('mode');
    if (mode === 'installation') {
      const context = getAIInstallationContext();
      setInstallationContext(context);
    }
  }, [searchParams, getAIInstallationContext]);

  return (
    <div className="h-full">
      <ChatInterface 
        mode={searchParams.get('mode') || undefined}
        initialContext={installationContext}
      />
    </div>
  );
};

export default AIChat;
