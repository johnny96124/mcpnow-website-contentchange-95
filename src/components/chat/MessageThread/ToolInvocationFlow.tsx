
import React, { useState, useEffect } from 'react';
import { ChevronDown, ChevronRight, Wrench, CheckCircle, XCircle, Clock, Zap, Server } from 'lucide-react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Progress } from '@/components/ui/progress';
import { ToolInvocation as ToolInvocationType } from '../types/chat';

interface ToolInvocationFlowProps {
  invocations: ToolInvocationType[];
}

export const ToolInvocationFlow: React.FC<ToolInvocationFlowProps> = ({ invocations }) => {
  const [expandedTools, setExpandedTools] = useState<Set<string>>(new Set());

  const toggleExpanded = (toolId: string) => {
    const newExpanded = new Set(expandedTools);
    if (newExpanded.has(toolId)) {
      newExpanded.delete(toolId);
    } else {
      newExpanded.add(toolId);
    }
    setExpandedTools(newExpanded);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
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

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success':
        return 'border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-950/20';
      case 'error':
        return 'border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-950/20';
      case 'pending':
        return 'border-yellow-200 bg-yellow-50 dark:border-yellow-800 dark:bg-yellow-950/20';
      default:
        return 'border-purple-200 bg-purple-50 dark:border-purple-800 dark:bg-purple-950/20';
    }
  };

  if (invocations.length === 0) return null;

  return (
    <div className="space-y-3 my-4">
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Zap className="h-4 w-4 text-purple-500" />
        <span className="font-medium">MCP工具调用</span>
        <Badge variant="outline" className="text-xs">
          {invocations.length} 个工具
        </Badge>
      </div>

      <div className="space-y-2">
        {invocations.map((invocation, index) => (
          <ToolInvocationCard
            key={invocation.id}
            invocation={invocation}
            index={index}
            isExpanded={expandedTools.has(invocation.id)}
            onToggleExpanded={() => toggleExpanded(invocation.id)}
          />
        ))}
      </div>
    </div>
  );
};

interface ToolInvocationCardProps {
  invocation: ToolInvocationType;
  index: number;
  isExpanded: boolean;
  onToggleExpanded: () => void;
}

const ToolInvocationCard: React.FC<ToolInvocationCardProps> = ({
  invocation,
  index,
  isExpanded,
  onToggleExpanded
}) => {
  const [animationPhase, setAnimationPhase] = useState<'appear' | 'thinking' | 'complete'>('appear');

  useEffect(() => {
    // 模拟工具调用的动画阶段
    if (invocation.status === 'pending') {
      setAnimationPhase('thinking');
    } else {
      const timer = setTimeout(() => {
        setAnimationPhase('complete');
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [invocation.status]);

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
        return 'border-purple-200 bg-purple-50 dark:border-purple-800 dark:bg-purple-950/20';
    }
  };

  return (
    <Card 
      className={`${getStatusColor()} transition-all duration-300 animate-fade-in`}
      style={{ animationDelay: `${index * 100}ms` }}
    >
      <Collapsible open={isExpanded} onOpenChange={onToggleExpanded}>
        <CollapsibleTrigger asChild>
          <CardHeader className="cursor-pointer p-3 hover:bg-black/5 dark:hover:bg-white/5 transition-colors">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2">
                  <div className="relative">
                    <Wrench className="h-4 w-4 text-purple-500" />
                    {animationPhase === 'thinking' && (
                      <div className="absolute -inset-1 bg-purple-500/20 rounded-full animate-pulse" />
                    )}
                  </div>
                  <span className="font-medium text-sm">{invocation.toolName}</span>
                </div>
                
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="text-xs flex items-center gap-1">
                    <Server className="h-3 w-3" />
                    {invocation.serverName}
                  </Badge>
                  {getStatusIcon()}
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                {invocation.duration && (
                  <span className="text-xs text-muted-foreground">
                    {invocation.duration}ms
                  </span>
                )}
                <Button variant="ghost" size="sm" className="h-auto p-1">
                  {isExpanded ? (
                    <ChevronDown className="h-4 w-4" />
                  ) : (
                    <ChevronRight className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>

            {/* 状态进度条 */}
            {invocation.status === 'pending' && (
              <div className="mt-2">
                <Progress value={undefined} className="h-1" />
                <p className="text-xs text-muted-foreground mt-1">正在调用工具...</p>
              </div>
            )}
          </CardHeader>
        </CollapsibleTrigger>
        
        <CollapsibleContent>
          <CardContent className="p-3 pt-0 space-y-4">
            {/* Request 部分 */}
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <h4 className="text-sm font-medium text-blue-700 dark:text-blue-300">请求参数</h4>
              </div>
              <div className="bg-white dark:bg-gray-800 rounded-lg border p-3 ml-4">
                <pre className="text-xs overflow-x-auto text-gray-600 dark:text-gray-400">
                  {JSON.stringify(invocation.request, null, 2)}
                </pre>
              </div>
            </div>
            
            {/* Response 部分 */}
            {invocation.status !== 'pending' && (
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${
                    invocation.status === 'success' ? 'bg-green-500' : 'bg-red-500'
                  }`}></div>
                  <h4 className={`text-sm font-medium ${
                    invocation.status === 'success' 
                      ? 'text-green-700 dark:text-green-300' 
                      : 'text-red-700 dark:text-red-300'
                  }`}>
                    {invocation.status === 'success' ? '响应结果' : '错误信息'}
                  </h4>
                </div>
                <div className="bg-white dark:bg-gray-800 rounded-lg border p-3 ml-4">
                  {invocation.status === 'error' && invocation.error ? (
                    <div className="text-red-600 dark:text-red-400 text-sm">
                      {invocation.error}
                    </div>
                  ) : (
                    <pre className="text-xs overflow-x-auto text-gray-600 dark:text-gray-400">
                      {JSON.stringify(invocation.response, null, 2)}
                    </pre>
                  )}
                </div>
              </div>
            )}

            {/* 工具执行摘要 */}
            {invocation.status === 'success' && (
              <div className="bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-950/20 dark:to-blue-950/20 rounded-lg p-3 border border-green-200 dark:border-green-800">
                <div className="flex items-center gap-2 mb-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span className="text-sm font-medium text-green-700 dark:text-green-300">
                    执行成功
                  </span>
                </div>
                <p className="text-xs text-green-600 dark:text-green-400">
                  工具 {invocation.toolName} 已成功执行，耗时 {invocation.duration}ms
                </p>
              </div>
            )}
          </CardContent>
        </CollapsibleContent>
      </Collapsible>
    </Card>
  );
};
