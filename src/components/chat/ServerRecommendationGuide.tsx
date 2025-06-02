
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, Info, Target } from 'lucide-react';

export const ServerRecommendationGuide: React.FC = () => {
  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Target className="h-5 w-5 text-blue-500" />
            Server推荐卡片触发指南
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
              <div>
                <h4 className="font-medium text-sm">触发条件</h4>
                <p className="text-xs text-muted-foreground">
                  在AI完成回复后（非流式输出状态），且消息有内容时自动显示
                </p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <Info className="h-4 w-4 text-blue-500 mt-0.5 flex-shrink-0" />
              <div>
                <h4 className="font-medium text-sm">智能推荐</h4>
                <p className="text-xs text-muted-foreground">
                  系统会根据对话内容智能推荐相关的MCP服务器
                </p>
              </div>
            </div>
          </div>
          
          <div className="border-t pt-3">
            <h4 className="font-medium text-sm mb-2">关键词映射</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="text-xs">文件/目录/读取</Badge>
                <span className="text-muted-foreground">→ Filesystem Server</span>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="text-xs">数据库/SQL</Badge>
                <span className="text-muted-foreground">→ Database Server</span>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="text-xs">API/HTTP</Badge>
                <span className="text-muted-foreground">→ Fetch Server</span>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="text-xs">Git/代码</Badge>
                <span className="text-muted-foreground">→ Git Server</span>
              </div>
            </div>
          </div>
          
          <div className="border-t pt-3">
            <h4 className="font-medium text-sm mb-2">测试建议</h4>
            <ul className="text-xs text-muted-foreground space-y-1">
              <li>• 使用上方的 Prompt 生成器快速创建测试用例</li>
              <li>• 每个 Prompt 都会触发相应的服务器推荐</li>
              <li>• 推荐卡片会在AI回复完成后立即显示</li>
              <li>• 点击"配置"按钮可以添加推荐的服务器</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
