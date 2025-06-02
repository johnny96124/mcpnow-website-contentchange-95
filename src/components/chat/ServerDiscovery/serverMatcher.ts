
import { ServerDefinition, serverDefinitions } from '@/data/mockData';

// Server keywords mapping for intelligent matching
const serverKeywords: Record<string, string[]> = {
  'figma': ['figma', 'design', '设计', 'ui', 'prototype', '原型', 'sketch'],
  'github': ['github', 'git', 'code', '代码', 'repository', '仓库', 'version control', '版本控制'],
  'postgresql': ['postgresql', 'postgres', 'database', '数据库', 'sql', 'db'],
  'redis': ['redis', 'cache', '缓存', 'memory', '内存'],
  'file-system': ['file', 'files', '文件', 'filesystem', 'directory', '目录', 'folder', '文件夹'],
  'web-search': ['search', 'google', 'bing', '搜索', 'web', '网页'],
  'notion': ['notion', 'notes', '笔记', 'documentation', '文档'],
  'slack': ['slack', 'chat', '聊天', 'team', '团队', 'communication', '沟通'],
  'gmail': ['gmail', 'email', '邮件', 'mail', 'google mail'],
  'claude': ['claude', 'anthropic', 'ai', '人工智能', 'assistant', '助手']
};

export interface ServerMatch {
  server: ServerDefinition;
  relevanceScore: number;
  matchedKeywords: string[];
}

export const findRelevantServers = (userInput: string): ServerMatch[] => {
  const input = userInput.toLowerCase();
  const matches: ServerMatch[] = [];

  // Check each server definition
  serverDefinitions.forEach(server => {
    const serverKeywordList = serverKeywords[server.id] || [];
    const matchedKeywords: string[] = [];
    let relevanceScore = 0;

    // Check for keyword matches
    serverKeywordList.forEach(keyword => {
      if (input.includes(keyword)) {
        matchedKeywords.push(keyword);
        relevanceScore += keyword.length; // Longer keywords get higher scores
      }
    });

    // Check for direct server name match
    if (input.includes(server.name.toLowerCase())) {
      matchedKeywords.push(server.name);
      relevanceScore += server.name.length * 2; // Name matches get double score
    }

    // Add to matches if relevant
    if (relevanceScore > 0) {
      matches.push({
        server,
        relevanceScore,
        matchedKeywords
      });
    }
  });

  // Sort by relevance score (highest first) and return top 3
  return matches
    .sort((a, b) => b.relevanceScore - a.relevanceScore)
    .slice(0, 3);
};

export const shouldShowServerDiscovery = (userInput: string): boolean => {
  const matches = findRelevantServers(userInput);
  return matches.length > 0;
};
