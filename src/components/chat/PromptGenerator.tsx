
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Copy, Lightbulb } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface PromptTemplate {
  id: string;
  category: string;
  title: string;
  prompt: string;
  description: string;
  expectedServers: string[];
}

export const PromptGenerator: React.FC = () => {
  const { toast } = useToast();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const promptTemplates: PromptTemplate[] = [
    {
      id: 'file-operations',
      category: '文件操作',
      title: '文件管理助手',
      prompt: '我需要帮助管理我的项目文件，包括读取配置文件、创建新的文档和组织目录结构。你能帮我建立一个文件管理的工作流程吗？',
      description: '触发文件系统服务器推荐',
      expectedServers: ['Filesystem MCP Server']
    },
    {
      id: 'database-query',
      category: '数据库',
      title: '数据库查询',
      prompt: '我想要连接到我的数据库，执行一些SQL查询来分析用户数据。你能帮我设置数据库连接并编写查询语句吗？',
      description: '触发数据库服务器推荐',
      expectedServers: ['Database MCP Server']
    },
    {
      id: 'api-integration',
      category: 'API集成',
      title: 'API数据获取',
      prompt: '我需要从外部API获取一些数据，并进行处理分析。你能帮我设置HTTP请求和数据处理流程吗？',
      description: '触发网络请求服务器推荐',
      expectedServers: ['Fetch MCP Server']
    },
    {
      id: 'git-operations',
      category: 'Git操作',
      title: 'Git仓库管理',
      prompt: '我想要管理我的Git仓库，包括查看提交历史、创建分支和合并代码。你能帮我自动化这些Git操作吗？',
      description: '触发Git服务器推荐',
      expectedServers: ['Git MCP Server']
    },
    {
      id: 'comprehensive',
      category: '综合功能',
      title: '全栈开发助手',
      prompt: '我正在开发一个全栈应用，需要文件管理、API集成、数据库操作等多种功能。你能为我推荐合适的工具和设置吗？',
      description: '触发多个服务器推荐',
      expectedServers: ['Filesystem MCP Server', 'Fetch MCP Server', 'Database MCP Server']
    },
    {
      id: 'web-scraping',
      category: '数据抓取',
      title: '网页数据抓取',
      prompt: '我需要从多个网站抓取数据，并将结果保存到本地文件中。你能帮我建立一个网页爬虫系统吗？',
      description: '触发文件和网络服务器推荐',
      expectedServers: ['Fetch MCP Server', 'Filesystem MCP Server']
    },
    {
      id: 'dev-workflow',
      category: '开发工作流',
      title: '开发环境设置',
      prompt: '我想要建立一个高效的开发工作流程，包括代码管理、自动化测试和部署。你能帮我配置这些开发工具吗？',
      description: '触发开发工具服务器推荐',
      expectedServers: ['Git MCP Server', 'Filesystem MCP Server']
    },
    {
      id: 'data-analysis',
      category: '数据分析',
      title: '数据分析项目',
      prompt: '我有一些CSV文件需要进行数据分析，包括数据清洗、统计分析和可视化。你能帮我建立数据分析流程吗？',
      description: '触发文件操作服务器推荐',
      expectedServers: ['Filesystem MCP Server']
    }
  ];

  const categories = ['all', ...Array.from(new Set(promptTemplates.map(p => p.category)))];
  
  const filteredPrompts = selectedCategory === 'all' 
    ? promptTemplates 
    : promptTemplates.filter(p => p.category === selectedCategory);

  const copyPrompt = (prompt: string, title: string) => {
    navigator.clipboard.writeText(prompt);
    toast({
      title: "Prompt已复制",
      description: `"${title}" 的Prompt已复制到剪贴板`,
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-4">
        <Lightbulb className="h-5 w-5 text-amber-500" />
        <h3 className="text-lg font-semibold">Server推荐 Prompt 生成器</h3>
      </div>
      
      <div className="flex flex-wrap gap-2 mb-4">
        {categories.map((category) => (
          <Button
            key={category}
            variant={selectedCategory === category ? "default" : "outline"}
            size="sm"
            onClick={() => setSelectedCategory(category)}
          >
            {category === 'all' ? '全部' : category}
          </Button>
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {filteredPrompts.map((template) => (
          <Card key={template.id} className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-sm font-medium">{template.title}</CardTitle>
                  <p className="text-xs text-muted-foreground mt-1">{template.description}</p>
                </div>
                <Badge variant="outline" className="text-xs">
                  {template.category}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="text-xs bg-gray-50 dark:bg-gray-800 rounded p-2 max-h-20 overflow-y-auto">
                {template.prompt}
              </div>
              
              <div className="flex flex-wrap gap-1">
                {template.expectedServers.map((server) => (
                  <Badge key={server} variant="secondary" className="text-xs">
                    {server}
                  </Badge>
                ))}
              </div>
              
              <Button
                size="sm"
                variant="outline"
                className="w-full"
                onClick={() => copyPrompt(template.prompt, template.title)}
              >
                <Copy className="h-3 w-3 mr-2" />
                复制 Prompt
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};
