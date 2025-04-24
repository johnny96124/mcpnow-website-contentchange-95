
import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { 
  Download, 
  ChevronRight, 
  ArrowRight, 
  ServerIcon, 
  Cpu, 
  Database, 
  Star, 
  MessageCircleQuestionIcon, 
  DiscIcon,
  MessageSquareQuoteIcon,
  Twitter
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const fadeInUp = {
  initial: { opacity: 0, y: 40 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.7 },
};

const staggerChildren = {
  initial: { opacity: 0 },
  whileInView: { opacity: 1 },
  viewport: { once: true },
  transition: { staggerChildren: 0.2 },
};

const cardHover = {
  rest: { scale: 1, transition: { duration: 0.2 } },
  hover: { scale: 1.03, transition: { duration: 0.2 } }
};

const Introduction3: React.FC = () => {
  const mcpServers = [
    { name: "OpenAI Server", description: "Access GPT-4 and DALL-E models", icon: "/lovable-uploads/888ae2df-5f1b-4ce5-8d4e-6517d4432938.png" },
    { name: "Anthropic Claude", description: "High-performance Claude models", icon: "/lovable-uploads/b23d1c2f-49a2-46c2-9fd2-45c26c3686bb.png" },
    { name: "Adobe Firefly", description: "Creative image generation APIs", icon: "/lovable-uploads/73160045-4ba5-4ffa-a980-50e0b33b3517.png" },
    { name: "Atlassian Server", description: "Multi-protocol connectivity", icon: "/lovable-uploads/223666e0-b3d5-4b6e-9f8f-c85eea51d4ab.png" },
    { name: "Airbnb Custom", description: "Custom model deployment tools", icon: "/lovable-uploads/5ebbe2a4-57d7-4db0-98c4-34fc93af0c58.png" },
    { name: "Amazon Bedrock", description: "Managed foundation model access", icon: "/lovable-uploads/5f93fbdd-00d5-49db-862d-e4b247e975d7.png" },
    { name: "Amplitude AI", description: "Analytics-focused AI models", icon: "/lovable-uploads/4fecf049-ca5f-4955-a38c-4506556886d2.png" },
    { name: "Discord AI", description: "Social-first AI integrations", icon: "/lovable-uploads/60892b6e-18d9-4bbc-869b-df9d6adecf7d.png" },
    { name: "1Password AI", description: "Secure credential handling", icon: "/lovable-uploads/2edef556-b3cc-440b-90c0-af33a7a3730f.png" },
    { name: "Google Vertex", description: "Advanced ML API integrations", icon: "/lovable-uploads/888ae2df-5f1b-4ce5-8d4e-6517d4432938.png" },
    { name: "Hugging Face", description: "Open-source model hub", icon: "/lovable-uploads/b23d1c2f-49a2-46c2-9fd2-45c26c3686bb.png" },
    { name: "Midjourney", description: "Image generation services", icon: "/lovable-uploads/73160045-4ba5-4ffa-a980-50e0b33b3517.png" },
    { name: "Cohere", description: "Enterprise language solutions", icon: "/lovable-uploads/223666e0-b3d5-4b6e-9f8f-c85eea51d4ab.png" },
    { name: "Stability AI", description: "Customizable generation APIs", icon: "/lovable-uploads/5ebbe2a4-57d7-4db0-98c4-34fc93af0c58.png" },
    { name: "Mistral AI", description: "Powerful open-weight models", icon: "/lovable-uploads/5f93fbdd-00d5-49db-862d-e4b247e975d7.png" },
    { name: "Pinecone", description: "Vector database integration", icon: "/lovable-uploads/4fecf049-ca5f-4955-a38c-4506556886d2.png" },
  ];

  const hosts = [
    { name: "Cursor", icon: "/lovable-uploads/888ae2df-5f1b-4ce5-8d4e-6517d4432938.png" },
    { name: "Windurf", icon: "/lovable-uploads/b23d1c2f-49a2-46c2-9fd2-45c26c3686bb.png" },
    { name: "VSCode", icon: "/lovable-uploads/73160045-4ba5-4ffa-a980-50e0b33b3517.png" },
    { name: "JetBrains", icon: "/lovable-uploads/223666e0-b3d5-4b6e-9f8f-c85eea51d4ab.png" },
    { name: "Local Host", icon: "/lovable-uploads/5ebbe2a4-57d7-4db0-98c4-34fc93af0c58.png" },
    { name: "Cloud Host", icon: "/lovable-uploads/5f93fbdd-00d5-49db-862d-e4b247e975d7.png" },
  ];

  const painPoints = [
    {
      title: "繁琐的手动配置",
      before: "在不同应用间切换多个模型服务需要频繁修改配置文件",
      after: "一次配置，多处使用，自动连接不同模型服务",
      icon: ServerIcon
    },
    {
      title: "模型能力难整合",
      before: "各AI服务提供的工具和模型分散在不同平台",
      after: "独创聚合模式，统一调用多个服务商的模型能力",
      icon: Database
    },
    {
      title: "权限管理混乱",
      before: "无法精确控制哪些应用可以访问哪些AI服务",
      after: "精细化权限管理，安全且可控",
      icon: Cpu
    }
  ];

  const testimonials = [
    {
      author: "Sarah Chen",
      role: "全栈开发者",
      company: "TechForward",
      text: "MCP Now的聚合模式太强大了！现在我可以在不修改代码的情况下无缝切换不同的模型，每个应用都能统一调用多个模型的能力。",
      avatar: "/placeholder.svg",
    },
    {
      author: "Michael Rodriguez",
      role: "机器学习工程师",
      company: "DataVision",
      text: "从一个接口管理多个MCP服务器的能力彻底改变了我的工作方式。我的模型部署时间减少了70%，再也不用担心配置问题了。",
      avatar: "/placeholder.svg",
    },
    {
      author: "Aisha Johnson",
      role: "技术总监",
      company: "NextGen AI",
      text: "我们整个团队都依赖MCP Now来统一管理AI基础设施。它的配置文件共享功能解决了团队协作中的大量问题，现在是我们技术栈中不可或缺的部分。",
      avatar: "/placeholder.svg",
    },
    {
      author: "David Park",
      role: "AI研究员",
      company: "Innovation Labs",
      text: "MCP Now的配置文件管理系统让维护不同的开发和生产环境变得异常简单。我可以轻松在本地测试模型，然后一键部署到生产环境。",
      avatar: "/placeholder.svg",
    },
  ];

  const faqs = [
    {
      question: "什么是MCP协议？",
      answer: "MCP (Model Context Protocol) 是由Anthropic于2024年提出的开放协议标准，旨在统一AI模型服务的接入方式。它定义了AI应用（Host）与AI模型服务（Server）之间的通信标准，让开发者可以更容易地接入多种AI模型服务。"
    },
    {
      question: "MCP Now与直接配置MCP服务有什么区别？",
      answer: "MCP Now通过代理服务和聚合模式，解决了手动配置MCP服务的三大痛点：1）无需手动编辑配置文件，一键连接多个服务；2）独创的聚合模式让一个应用同时调用多个服务的能力；3）提供友好的可视化界面，让非技术用户也能轻松使用。"
    },
    {
      question: "MCP Now如何提升我的AI开发效率？",
      answer: "MCP Now消除了管理多个AI服务配置的需求，让您可以快速切换模型提供商、创建可重用的配置文件，并通过最少的配置将各种主机应用程序连接到这些配置文件。我们的聚合模式让您可以一次性调用多个服务的能力，大大简化了开发流程。"
    },
    {
      question: "MCP Now与现有AI工具兼容吗？",
      answer: "是的，MCP Now支持与许多流行的AI开发工具集成，如Cursor、VSCode、JetBrains IDE等。它设计为无缝融入您现有的工作流程，减少使用AI工具时的摩擦。"
    },
    {
      question: "我可以将MCP Now与自己的本地AI模型一起使用吗？",
      answer: "当然可以！MCP Now完全支持本地主机配置，允许您将自己的自定义模型和服务器集成到相同的管理界面中，实现统一管理。"
    },
    {
      question: "MCP Now对企业级应用安全吗？",
      answer: "MCP Now优先考虑安全性，提供加密连接、凭据管理，并且不会集中存储您的API密钥。它从设计之初就考虑到了企业安全因素，提供完整的访问控制机制。"
    }
  ];

  const quickStartSteps = [
    {
      title: "下载客户端",
      description: "为您的操作系统安装MCP Now桌面客户端。",
      icon: Download,
    },
    {
      title: "发现并连接服务器",
      description: "浏览发现页面，找到并安装您需要的MCP服务器。",
      icon: ServerIcon,
    },
    {
      title: "创建配置文件",
      description: "使用您首选的服务器和设置配置个性化配置文件。",
      icon: Database,
    },
    {
      title: "连接到应用",
      description: "将您的配置文件连接到开发环境和工具。",
      icon: Cpu,
    },
  ];

  const chunkedServers = Array.from({ length: Math.ceil(mcpServers.length / 4) }, (_, i) =>
    mcpServers.slice(i * 4, i * 4 + 4)
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white dark:from-gray-900 dark:to-gray-950">
      <nav className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60 dark:bg-gray-950/90 dark:border-gray-800">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-6">
            <Link to="/" className="flex items-center gap-2">
              <img
                src="/lovable-uploads/bbb3edcf-989e-42ed-a8dd-d5f07f4c632d.png"
                alt="MCP Now Logo"
                className="h-8 w-8 rounded-lg shadow"
              />
              <span className="text-xl font-bold tracking-tight">MCP Now</span>
            </Link>
            <div className="hidden md:flex items-center gap-6">
              <Link to="/" className="text-sm font-medium text-gray-800 transition-colors hover:text-blue-600 dark:text-gray-200 dark:hover:text-blue-400">
                首页
              </Link>
              <Link to="#download" className="text-sm font-medium text-gray-800 transition-colors hover:text-blue-600 dark:text-gray-200 dark:hover:text-blue-400">
                下载
              </Link>
              <Link to="#" className="text-sm font-medium text-gray-800 transition-colors hover:text-blue-600 dark:text-gray-200 dark:hover:text-blue-400">
                文档
              </Link>
              <Link to="#" className="text-sm font-medium text-gray-800 transition-colors hover:text-blue-600 dark:text-gray-200 dark:hover:text-blue-400">
                社区
              </Link>
              <Link to="#" className="text-sm font-medium text-gray-800 transition-colors hover:text-blue-600 dark:text-gray-200 dark:hover:text-blue-400">
                联系我们
              </Link>
            </div>
          </div>
          <div>
            <Button className="bg-blue-600 hover:bg-blue-700">
              <Download className="mr-2 h-4 w-4" />
              下载客户端
            </Button>
          </div>
        </div>
      </nav>

      <section className="relative py-20 md:py-32 overflow-hidden">
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-1/4 -left-24 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-1/4 right-10 w-56 h-56 bg-purple-500/10 rounded-full blur-3xl"></div>
        </div>
        
        <div className="container px-4 md:px-6">
          <motion.div
            className="flex flex-col items-center text-center space-y-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            <Badge variant="outline" className="px-3 py-1 border-blue-200 bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:border-blue-800 dark:text-blue-400">
              <span className="text-blue-600 font-bold mr-1.5">New</span>
              <span className="text-gray-600 dark:text-gray-300">|</span>
              <span className="ml-1.5">Introducing MCP Now</span>
            </Badge>
            
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight max-w-3xl">
              告别繁琐配置
              <span className="bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent block mt-1">
                一站式统一管理 MCP 生态
              </span>
            </h1>
            
            <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 max-w-3xl">
              MCP Now 是连接AI应用与模型服务的桥梁，通过创新的聚合模式让您轻松调用多服务能力，
              无需编辑配置文件，一键接入所有MCP服务。
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
                <Download className="mr-2 h-5 w-5" />
                下载客户端
              </Button>
              <Button size="lg" variant="outline">
                了解更多
                <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
            
            <motion.div 
              className="w-full max-w-4xl mt-12 rounded-lg overflow-hidden shadow-lg border border-gray-200 dark:border-gray-800"
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.3 }}
            >
              <img 
                src="/lovable-uploads/3debc8dc-96ad-462c-8379-a4b4e08a889b.png"
                alt="MCP Now Dashboard" 
                className="w-full h-auto object-cover"
              />
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* MCP协议解释部分 */}
      <section className="py-20 bg-white/50 dark:bg-gray-900/50">
        <div className="container px-4 md:px-6">
          <motion.div
            className="text-center mb-12"
            {...fadeInUp}
          >
            <Badge className="mb-4 px-3 py-1 bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400">
              MCP协议是什么？
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Model Context Protocol：AI生态的统一标准</h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              由Anthropic提出的开放协议，为AI应用（Host）与AI模型服务（Server）之间建立通信标准，简化AI生态系统的复杂度。
            </p>
          </motion.div>

          <motion.div 
            className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12"
            variants={staggerChildren}
            initial="initial"
            whileInView="whileInView"
            viewport={{ once: true }}
          >
            <motion.div className="flex flex-col items-center text-center p-6" variants={fadeInUp}>
              <div className="w-16 h-16 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center mb-4">
                <ServerIcon className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold mb-2">统一接口标准</h3>
              <p className="text-gray-600 dark:text-gray-300">MCP协议统一了AI模型服务的接口标准，让开发者可以用相同的方式调用不同的模型服务</p>
            </motion.div>

            <motion.div className="flex flex-col items-center text-center p-6" variants={fadeInUp}>
              <div className="w-16 h-16 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center mb-4">
                <Database className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold mb-2">丰富的模型生态</h3>
              <p className="text-gray-600 dark:text-gray-300">从OpenAI到Anthropic，从Google到Midjourney，越来越多的AI服务支持MCP协议</p>
            </motion.div>

            <motion.div className="flex flex-col items-center text-center p-6" variants={fadeInUp}>
              <div className="w-16 h-16 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center mb-4">
                <Cpu className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold mb-2">工具互操作性</h3>
              <p className="text-gray-600 dark:text-gray-300">MCP协议确保AI工具之间的互操作性，让不同应用能够无缝协作，提升开发效率</p>
              
              <div className="mt-5 rounded-lg bg-blue-50 dark:bg-blue-900/20 p-4 text-sm">
                <MessageCircleQuestionIcon className="inline-block mr-2 h-4 w-4 text-blue-600" />
                <span className="text-blue-800 dark:text-blue-300 font-medium">为什么MCP协议很重要？</span>
                <p className="mt-2 text-gray-700 dark:text-gray-300">它让AI应用可以轻松切换和组合不同的AI服务，不再受单一提供商限制，为AI生态系统带来更多可能性。</p>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* 痛点与解决方案对比 */}
      <section className="py-20 bg-gradient-to-b from-white to-blue-50 dark:from-gray-900 dark:to-blue-950/20">
        <div className="container px-4 md:px-6">
          <motion.div
            className="text-center max-w-3xl mx-auto mb-16"
            {...fadeInUp}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">为什么选择 MCP Now？</h2>
            <p className="text-lg text-gray-600 dark:text-gray-300">
              MCP Now 解决了使用MCP协议时的关键痛点，让您的AI开发体验更加流畅高效
            </p>
          </motion.div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
            {painPoints.map((point, idx) => (
              <motion.div
                key={idx}
                className="relative"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.2 }}
              >
                <Card className="h-full border-gray-200 dark:border-gray-800 overflow-hidden">
                  <CardContent className="p-6">
                    <div className="w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center mb-4">
                      {<point.icon className="w-6 h-6 text-blue-600 dark:text-blue-400" />}
                    </div>
                    <h3 className="text-xl font-bold mb-4">{point.title}</h3>
                    
                    <div className="space-y-6">
                      <div className="p-4 bg-red-50 dark:bg-red-900/10 rounded-lg">
                        <p className="font-semibold text-red-700 dark:text-red-400 mb-1">传统方式</p>
                        <p className="text-gray-700 dark:text-gray-300">{point.before}</p>
                      </div>
                      
                      <div className="p-4 bg-green-50 dark:bg-green-900/10 rounded-lg">
                        <p className="font-semibold text-green-700 dark:text-green-400 mb-1">使用 MCP Now</p>
                        <p className="text-gray-700 dark:text-gray-300">{point.after}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
          
          <motion.div
            className="mt-16 p-6 md:p-8 rounded-xl border border-blue-100 dark:border-blue-900/30 bg-blue-50/50 dark:bg-blue-900/10 max-w-4xl mx-auto"
            {...fadeInUp}
            transition={{ delay: 0.4 }}
          >
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="text-center md:text-left">
                <h3 className="text-xl md:text-2xl font-bold mb-2">独特优势：聚合模式</h3>
                <p className="text-gray-600 dark:text-gray-300">
                  MCP Now独创的聚合模式让您在一个界面中同时使用多个MCP服务器的能力，真正实现一次配置，多处调用。
                </p>
              </div>
              <div className="rounded-lg bg-blue-100/80 dark:bg-blue-900/40 p-4">
                <MessageCircleQuestionIcon className="inline-block mr-2 h-4 w-4 text-blue-600" />
                <span className="text-blue-800 dark:text-blue-300 font-medium">什么是聚合模式？</span>
                <p className="mt-1 text-sm text-gray-700 dark:text-gray-300">MCP Now作为统一代理，自动合并多个服务器的功能，让应用可以无缝调用不同服务商的模型能力。</p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
      
      <section id="servers" className="py-20 bg-white/50 dark:bg-gray-900/50">
        <div className="container px-4 md:px-6">
          <motion.div
            className="text-center max-w-3xl mx-auto mb-16"
            {...fadeInUp}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">一站式 MCP 服务集成</h2>
            <p className="text-lg text-gray-600 dark:text-gray-300">
              MCP Now 支持市面上绝大多数 MCP 服务商的即插即用集成，通过统一界面简化您的配置和使用流程
            </p>
            <div className="mt-4 rounded-lg bg-blue-50 dark:bg-blue-900/20 p-4 mx-auto max-w-2xl">
              <MessageCircleQuestionIcon className="inline-block mr-2 h-4 w-4 text-blue-600" />
              <span className="text-blue-800 dark:text-blue-300 font-medium">我可以用MCP Now连接我自己的本地模型吗？</span>
              <p className="mt-2 text-sm text-gray-700 dark:text-gray-300">当然可以！MCP Now完全支持本地模型和自定义服务器配置，您可以将私有部署的模型和公共服务统一管理。</p>
            </div>
          </motion.div>
          
          <motion.div
            className="space-y-8"
            variants={staggerChildren}
            initial="initial"
            whileInView="whileInView"
            viewport={{ once: true }}
          >
            {chunkedServers.map((row, rowIndex) => (
              <motion.div 
                key={`row-${rowIndex}`} 
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
                variants={fadeInUp}
              >
                {row.map((server, idx) => (
                  <motion.div
                    key={`${server.name}-${idx}`}
                    whileHover="hover"
                    initial="rest"
                    animate="rest"
                    variants={cardHover}
                  >
                    <Card className="h-full overflow-hidden transition-all hover:shadow-md border-gray-200 dark:border-gray-800">
                      <CardContent className="p-6">
                        <div className="flex flex-col items-center text-center">
                          <div className="mb-4 p-3 rounded-lg bg-blue-50 dark:bg-blue-900/20">
                            <img 
                              src={server.icon}
                              alt={server.name}
                              className="w-12 h-12 object-contain"
                            />
                          </div>
                          <h3 className="text-lg font-semibold mb-2">{server.name}</h3>
                          <p className="text-sm text-gray-500 dark:text-gray-400">{server.description}</p>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </motion.div>
            ))}
          </motion.div>
          
          <div className="mt-12 text-center">
            <Button variant="outline" className="text-blue-600 hover:bg-blue-50" onClick={() => window.location.href = '/discovery'}>
              探索更多 MCP Servers
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      </section>

      <section id="hosts" className="py-20">
        <div className="container px-4 md:px-6">
          <motion.div
            className="text-center max-w-3xl mx-auto mb-16"
            {...fadeInUp}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              无缝连接所有MCP兼容应用
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300">
              MCP Now 与主流开发工具和应用程序无缝集成，让您在熟悉的环境中使用强大的AI功能
            </p>
            <div className="mt-4 rounded-lg bg-blue-50 dark:bg-blue-900/20 p-4 mx-auto max-w-2xl">
              <MessageCircleQuestionIcon className="inline-block mr-2 h-4 w-4 text-blue-600" />
              <span className="text-blue-800 dark:text-blue-300 font-medium">MCP Now与现有AI工具兼容吗？</span>
              <p className="mt-2 text-sm text-gray-700 dark:text-gray-300">是的，MCP Now支持与许多流行的AI开发工具集成，如Cursor、VSCode、JetBrains IDE等。它设计为无缝融入您现有的工作流程。</p>
            </div>
          </motion.div>
          
          <motion.div 
            className="flex flex-wrap justify-center gap-8 md:gap-12"
            variants={staggerChildren}
            initial="initial"
            whileInView="whileInView"
            viewport={{ once: true }}
          >
            {hosts.map((host, idx) => (
              <motion.div
                key={`${host.name}-${idx}`}
                className="flex flex-col items-center"
                variants={fadeInUp}
                transition={{ delay: idx * 0.1 }}
              >
                <div className="p-4 rounded-full bg-gray-50 dark:bg-gray-800 mb-3 shadow-sm">
                  <img
                    src={host.icon}
                    alt={host.name}
                    className="w-16 h-16 object-contain"
                  />
                </div>
                <span className="font-medium">{host.name}</span>
              </motion.div>
            ))}
          </motion.div>
          
          <motion.div
            className="mt-16 p-6 md:p-8 rounded-xl border border-blue-100 dark:border-blue-900/30 bg-blue-50/50 dark:bg-blue-900/10 max-w-4xl mx-auto"
            {...fadeInUp}
            transition={{ delay: 0.4 }}
          >
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="text-center md:text-left">
                <h3 className="text-xl md:text-2xl font-bold mb-2">轻松集成您的开发环境</h3>
                <p className="text-gray-600 dark:text-gray-300">
                  MCP Now 与您现有的开发工具无缝协作，快速增强您的 AI 开发能力。
                </p>
              </div>
              <Button className="bg-blue-600 hover:bg-blue-700">
                查看集成教程
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      <section id="guide" className="py-20 bg-gradient-to-b from-white to-blue-50 dark:from-gray-900 dark:to-gray-950">
        <div className="container px-4 md:px-6">
          <motion.div
            className="text-center max-w-3xl mx-auto mb-16"
            {...fadeInUp}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">四步开启MCP新体验</h2>
            <p className="text-lg text-gray-600 dark:text-gray-300">
              只需几个简单步骤，即刻体验MCP Now带来的高效AI开发体验
            </p>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {quickStartSteps.map((step, idx) => (
              <motion.div
                key={idx}
                className="relative"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
              >
                <Card className="h-full border-gray-200 dark:border-gray-800">
                  <CardContent className="p-6 flex flex-col items-center text-center">
                    <div className="w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center mb-4">
                      <step.icon className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div className="absolute -top-3 -left-3 w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold">
                      {idx + 1}
                    </div>
                    <h3 className="text-lg font-semibold mb-2">{step.title}</h3>
                    <p className="text-gray-600 dark:text-gray-300">{step.description}</p>
                    
                    <div className="mt-4 w-full h-24 rounded-lg bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                      <span className="text-sm text-gray-500">Step screenshot</span>
                    </div>
                  </CardContent>
                </Card>
                
                {idx < quickStartSteps.length - 1 && (
                  <div className="hidden lg:block absolute top-1/2 -right-4 transform -translate-y-1/2">
                    <ChevronRight className="w-6 h-6 text-gray-400" />
                  </div>
                )}
              </motion.div>
            ))}
          </div>

          <motion.div
            className="mt-12 p-6 bg-blue-50 dark:bg-blue-900/20 rounded-lg max-w-3xl mx-auto"
            {...fadeInUp}
          >
            <div className="flex items-start gap-3">
              <MessageCircleQuestionIcon className="h-5 w-5 text-blue-600 mt-1 flex-shrink-0" />
              <div>
                <p className="font-medium text-blue-800 dark:text-blue-300">MCP Now真的有那么简单吗？</p>
                <p className="mt-1 text-gray-700 dark:text-gray-300">
                  是的！MCP Now的设计初衷就是降低MCP使用门槛，即使您没有技术背景，也能在几分钟内完成配置并开始使用。我们的愿景是让每个人都能轻松享受AI技术带来的便利。
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <section id="testimonials" className="py-20 bg-white dark:bg-gray-900">
        <div className="container px-4 md:px-6">
          <motion.div
            className="text-center max-w-3xl mx-auto mb-16"
            {...fadeInUp}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">用户的真实反馈</h2>
            <p className="text-lg text-gray-600 dark:text-gray-300">
              来自专业开发者的真实使用体验，了解 MCP Now 如何改变他们的工作流程
            </p>
          </motion.div>
          
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 gap-8"
            variants={staggerChildren}
            initial="initial"
            whileInView="whileInView"
            viewport={{ once: true }}
          >
            {testimonials.map((testimonial, idx) => (
              <motion.div
                key={idx}
                variants={fadeInUp}
                transition={{ delay: idx * 0.1 }}
              >
                <Card className="h-full border-gray-200 dark:border-gray-800">
                  <CardContent className="p-6">
                    <div className="flex flex-col space-y-4">
                      <div className="flex items-center space-x-1">
                        {Array(5).fill(null).map((_, i) => (
                          <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        ))}
                      </div>
                      
                      <p className="italic text-gray-700 dark:text-gray-300">"{testimonial.text}"</p>
                      
                      <div className="flex items-center pt-4">
                        <div className="mr-4">
                          <div className="h-10 w-10 rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden">
                            <img
                              src={testimonial.avatar}
                              alt={testimonial.author}
                              className="h-full w-full object-cover"
                            />
                          </div>
                        </div>
                        <div>
                          <p className="font-semibold">{testimonial.author}</p>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            {testimonial.role}, {testimonial.company}
                          </p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      <section id="faq" className="py-20 bg-gray-50 dark:bg-gray-800/50">
        <div className="container px-4 md:px-6">
          <motion.div
            className="text-center max-w-3xl mx-auto mb-16"
            {...fadeInUp}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">常见问题</h2>
            <p className="text-lg text-gray-600 dark:text-gray-300">
              关于 MCP Now 的常见疑问解答，帮助您更好地了解我们的产品
            </p>
          </motion.div>
          
          <div className="max-w-3xl mx-auto divide-y divide-gray-200 dark:divide-gray-700">
            {faqs.map((faq, idx) => (
              <motion.div
                key={idx}
                className="py-6"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
              >
                <h3 className="text-xl font-semibold mb-2 flex items-center">
                  <MessageCircleQuestionIcon className="mr-2 h-5 w-5 text-blue-600 flex-shrink-0" />
                  {faq.question}
                </h3>
                <p className="text-gray-600 dark:text-gray-300 pl-7">{faq.answer}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section id="download" className="py-20 bg-gradient-to-b from-blue-50 to-white dark:from-blue-950/20 dark:to-gray-900">
        <div className="container px-4 md:px-6">
          <motion.div
            className="text-center max-w-3xl mx-auto mb-16"
            {...fadeInUp}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">立即体验 MCP Now</h2>
            <p className="text-lg text-gray-600 dark:text-gray-300">
              下载客户端，一键解锁MCP生态的全部潜力，或加入我们的社区获取更多支持与交流
            </p>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-4xl mx-auto">
            <motion.div
              className="flex flex-col items-center text-center"
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h3 className="text-2xl font-bold mb-4">下载客户端</h3>
              <div className="space-y-4 w-full">
                <Button size="lg" className="w-full bg-blue-600 hover:bg-blue-700">
                  <Download className="mr-2 h-5 w-5" />
                  Mac 版本下载
                </Button>
                <Button size="lg" variant="outline" className="w-full" disabled>
                  <Download className="mr-2 h-5 w-5" />
                  Windows 版本 (即将推出)
                </Button>
              </div>
              <p className="mt-4 text-sm text-gray-500 dark:text-gray-400">
                当前版本: 1.0.0 | 免费下载
              </p>
            </motion.div>
            
            <motion.div
              className="flex flex-col items-center text-center"
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h3 className="text-2xl font-bold mb-4">加入社区</h3>
              <p className="mb-6 text-gray-600 dark:text-gray-300">
                与其他 MCP Now 用户交流，获取最新更新，分享您的经验和反馈
              </p>
              <div className="flex gap-4">
                <a href="#" className="flex items-center justify-center w-12 h-12 rounded-full bg-blue-100 hover:bg-blue-200 dark:bg-blue-900/30 dark:hover:bg-blue-900/50 transition-colors">
                  <DiscIcon className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                </a>
                <a href="#" className="flex items-center justify-center w-12 h-12 rounded-full bg-blue-100 hover:bg-blue-200 dark:bg-blue-900/30 dark:hover:bg-blue-900/50 transition-colors">
                  <Twitter className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                </a>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <footer className="py-12 bg-white dark:bg-gray-950 border-t border-gray-200 dark:border-gray-800">
        <div className="container px-4 md:px-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
            <div>
              <Link to="/" className="flex items-center gap-2 mb-4">
                <img
                  src="/lovable-uploads/bbb3edcf-989e-42ed-a8dd-d5f07f4c632d.png"
                  alt="MCP Now Logo"
                  className="h-8 w-8 rounded-lg shadow"
                />
                <span className="text-xl font-bold tracking-tight">MCP Now</span>
              </Link>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                简化 AI 模型管理与部署的现代解决方案
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">产品</h4>
              <ul className="space-y-2 text-sm">
                <li><Link to="#" className="text-gray-600 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400">特性</Link></li>
                <li><Link to="#download" className="text-gray-600 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400">下载</Link></li>
                <li><Link to="#" className="text-gray-600 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400">价格</Link></li>
                <li><Link to="#" className="text-gray-600 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400">更新日志</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">资源</h4>
              <ul className="space-y-2 text-sm">
                <li><Link to="#" className="text-gray-600 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400">文档</Link></li>
                <li><Link to="#guide" className="text-gray-600 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400">入门指南</Link></li>
                <li><Link to="#" className="text-gray-600 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400">API 参考</Link></li>
                <li><Link to="#" className="text-gray-600 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400">示例</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">关于我们</h4>
              <ul className="space-y-2 text-sm">
                <li><Link to="#" className="text-gray-600 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400">公司</Link></li>
                <li><Link to="#" className="text-gray-600 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400">博客</Link></li>
                <li><Link to="#" className="text-gray-600 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400">联系我们</Link></li>
                <li>
                  <div className="flex gap-4 mt-2">
                    <a href="#" className="text-gray-500 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400">
                      <DiscIcon className="h-5 w-5" />
                    </a>
                    <a href="#" className="text-gray-500 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400">
                      <Twitter className="h-5 w-5" />
                    </a>
                  </div>
                </li>
              </ul>
            </div>
          </div>
          
          <div className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-800 flex flex-col sm:flex-row justify-between items-center">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              © 2025 MCP Now. 保留所有权利。
            </p>
            <div className="flex gap-4 mt-4 sm:mt-0">
              <Link to="#" className="text-sm text-gray-500 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400">隐私政策</Link>
              <Link to="#" className="text-sm text-gray-500 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400">服务条款</Link>
              <Link to="#" className="text-sm text-gray-500 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400">法律信息</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Introduction3;
