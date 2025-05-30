
import React, { useState } from 'react';
import { ChevronDown, ChevronRight, Wrench, CheckCircle, XCircle, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { ToolInvocation as ToolInvocationType } from '../types/chat';

interface ToolInvocationProps {
  invocation: ToolInvocationType;
}

export const ToolInvocation: React.FC<ToolInvocationProps> = ({ invocation }) => {
  const [isOpen, setIsOpen] = useState(false);

  const getStatusIcon = () => {
    switch (invocation.status) {
      case 'success':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'error':
        return <XCircle className="h-4 w-4 text-red-500" />;
      case 'pending':
        return <Clock className="h-4 w-4 text-yellow-500 animate-spin" />;
      default:
        return <Wrench className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusColor = () => {
    switch (invocation.status) {
      case 'success':
        return 'border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-950/20';
      case 'error':
        return 'border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-950/20';
      case 'pending':
        return 'border-yellow-200 bg-yellow-50 dark:border-yellow-800 dark:bg-yellow-950/20';
      default:
        return 'border-gray-200 bg-gray-50 dark:border-gray-800 dark:bg-gray-950/20';
    }
  };

  return (
    <Card className={`${getStatusColor()} transition-colors`}>
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <CollapsibleTrigger asChild>
          <CardHeader className="cursor-pointer p-3">
            <CardTitle className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2">
                <Wrench className="h-4 w-4 text-purple-500" />
                <span className="font-medium">{invocation.toolName}</span>
                <Badge variant="outline" className="text-xs">
                  {invocation.serverName}
                </Badge>
                {getStatusIcon()}
              </div>
              
              <div className="flex items-center gap-2">
                {invocation.duration && (
                  <span className="text-xs text-muted-foreground">
                    {invocation.duration}ms
                  </span>
                )}
                <Button variant="ghost" size="sm" className="h-auto p-1">
                  {isOpen ? (
                    <ChevronDown className="h-4 w-4" />
                  ) : (
                    <ChevronRight className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </CardTitle>
          </CardHeader>
        </CollapsibleTrigger>
        
        <CollapsibleContent>
          <CardContent className="p-3 pt-0 space-y-3">
            {/* Request Details */}
            <div>
              <h4 className="text-xs font-medium text-muted-foreground mb-2">Request</h4>
              <div className="bg-white dark:bg-gray-800 rounded border p-2">
                <pre className="text-xs overflow-x-auto">
                  {JSON.stringify(invocation.request, null, 2)}
                </pre>
              </div>
            </div>
            
            {/* Response Details */}
            {invocation.status !== 'pending' && (
              <div>
                <h4 className="text-xs font-medium text-muted-foreground mb-2">Response</h4>
                <div className="bg-white dark:bg-gray-800 rounded border p-2">
                  {invocation.status === 'error' && invocation.error ? (
                    <div className="text-red-600 text-xs">{invocation.error}</div>
                  ) : (
                    <pre className="text-xs overflow-x-auto">
                      {JSON.stringify(invocation.response, null, 2)}
                    </pre>
                  )}
                </div>
              </div>
            )}
          </CardContent>
        </CollapsibleContent>
      </Collapsible>
    </Card>
  );
};
