
import React from "react";
import { motion } from "framer-motion";
import { ArrowRight, Compass } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useLanguage } from "../theme/language-provider";

const fadeInUp = {
  initial: { opacity: 0, y: 40 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.7 }
};

const staggerChildren = {
  initial: { opacity: 0 },
  whileInView: { opacity: 1 },
  viewport: { once: true },
  transition: { staggerChildren: 0.2 }
};

const cardHover = {
  rest: {
    scale: 1,
    transition: { duration: 0.2 }
  },
  hover: {
    scale: 1.03,
    rotate: 1,
    transition: { duration: 0.3 }
  }
};

const ServersShowcase = () => {
  const { language } = useLanguage();
  
  const mcpServers = [
    {
      name: "AWS KB Retrieval",
      description: language === "en" ? "Retrieval from AWS Knowledge Base using Bedrock Agent Runtime" : "使用 Bedrock Agent 运行时检索 AWS 知识库",
      icon: "/lovable-uploads/888ae2df-5f1b-4ce5-8d4e-6517d4432938.png"
    }, 
    {
      name: "Brave Search",
      description: language === "en" ? "Web and local search using Brave's Search API" : "使用 Brave 的搜索 API 进行网络和本地搜索",
      icon: "/lovable-uploads/b23d1c2f-49a2-46c2-9fd2-45c26c3686bb.png"
    }, 
    {
      name: "EverArt",
      description: language === "en" ? "AI image generation using various models" : "使用各种模型的 AI 图像生成",
      icon: "/lovable-uploads/73160045-4ba5-4ffa-a980-50e0b33b3517.png"
    }, 
    {
      name: "Everything",
      description: language === "en" ? "Reference / test server with prompts, resources, and tools" : "带有提示、资源和工具的参考/测试服务器",
      icon: "/lovable-uploads/223666e0-b3d5-4b6e-9f8f-c85eea51d4ab.png"
    }, 
    {
      name: "Fetch",
      description: language === "en" ? "Web content fetching and conversion for efficient LLM usage" : "用于高效 LLM 使用的网络内容获取和转换",
      icon: "/lovable-uploads/5ebbe2a4-57d7-4db0-98c4-34fc93af0c58.png"
    }, 
    {
      name: "Filesystem",
      description: language === "en" ? "Secure file operations with configurable access controls" : "具有可配置访问控制的安全文件操作",
      icon: "/lovable-uploads/5f93fbdd-00d5-49db-862d-e4b247e975d7.png"
    }, 
    {
      name: "Git",
      description: language === "en" ? "Tools to read, search, and manipulate Git repositories" : "用于读取、搜索和操作 Git 仓库的工具",
      icon: "/lovable-uploads/4fecf049-ca5f-4955-a38c-4506556886d2.png"
    }, 
    {
      name: "GitHub",
      description: language === "en" ? "Repository management, file operations, and GitHub API integration" : "仓库管理、文件操作和 GitHub API 集成",
      icon: "/lovable-uploads/60892b6e-18d9-4bbc-869b-df9d6adecf7d.png"
    }
  ];

  // Content based on language
  const content = {
    en: {
      title: "Discover the Ultimate MCP Server Marketplace",
      subtitle: "Explore our curated collection of powerful third-party MCP servers to enhance your development workflow",
      exploreButton: "Explore More MCP Servers"
    },
    zh: {
      title: "探索终极 MCP 服务器应用市场",
      subtitle: "浏览我们精心策划的强大第三方 MCP 服务器集合，提升您的开发工作流程",
      exploreButton: "探索更多 MCP 服务器"
    }
  };

  // Use English or Chinese content based on language setting
  const { title, subtitle, exploreButton } = content[language];

  // Determine font classes based on language
  const textFont = language === "en" ? "font-roboto" : "font-noto";
  const descriptionFont = language === "en" ? "font-opensans" : "font-noto";

  return (
    <section id="servers" className="py-20 bg-white/50 dark:bg-gray-900/50">
      <div className="container px-4 md:px-6">
        <motion.div className="text-center max-w-3xl mx-auto mb-12" {...fadeInUp}>
          <div className="flex justify-center mb-4">
            <div className="p-3 rounded-full bg-blue-100 dark:bg-blue-900/20">
              <Compass className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
          <h2 className="text-3xl md:text-4xl font-extrabold mb-4 font-montserrat">{title}</h2>
          <p className={`text-lg text-gray-600 dark:text-gray-300 leading-relaxed ${descriptionFont}`}>
            {subtitle}
          </p>
        </motion.div>
        
        <motion.div 
          className="grid grid-cols-2 sm:grid-cols-4 gap-4 md:gap-6 max-w-4xl mx-auto" 
          variants={staggerChildren} 
          initial="initial" 
          whileInView="whileInView" 
          viewport={{ once: true }}
        >
          {mcpServers.map((server, idx) => (
            <motion.div 
              key={`${server.name}-${idx}`} 
              whileHover="hover" 
              initial="rest" 
              animate="rest" 
              variants={cardHover} 
              className="server-card"
            >
              <Card className="h-full overflow-hidden border-gray-200 dark:border-gray-800">
                <CardContent className="p-4">
                  <div className="flex flex-col items-center text-center">
                    <div className="mb-3 p-2 rounded-lg bg-blue-50 dark:bg-blue-900/20">
                      <img src={server.icon} alt={server.name} className="w-10 h-10 object-contain" />
                    </div>
                    <h3 className="text-sm font-bold mb-1 font-montserrat">{server.name}</h3>
                    <p className={`text-xs text-gray-500 dark:text-gray-400 ${descriptionFont}`}>
                      {server.description}
                    </p>
                    {language === "en" && (
                      <button className="mt-2 text-xs text-blue-600 hover:text-blue-800 font-roboto flex items-center">
                        <span>Install</span>
                        <ArrowRight className="ml-1 h-3 w-3" />
                      </button>
                    )}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>
        
        <div className="mt-8 text-center">
          <Button 
            variant="outline" 
            className={`text-blue-600 hover:bg-blue-50 ${textFont}`} 
            onClick={() => window.location.href = '/discovery'}
          >
            {exploreButton}
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </div>
    </section>
  );
};

export default ServersShowcase;
