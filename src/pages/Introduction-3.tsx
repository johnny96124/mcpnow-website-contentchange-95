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
  MessageCircleQuestion,
  DiscIcon,
  MessageCircleQuestionIcon,
  Twitter,
  CheckCircle2,
  XCircle,
  Zap
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

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
  ];

  const hosts = [
    { name: "Cursor", icon: "/lovable-uploads/888ae2df-5f1b-4ce5-8d4e-6517d4432938.png" },
    { name: "Windurf", icon: "/lovable-uploads/b23d1c2f-49a2-46c2-9fd2-45c26c3686bb.png" },
    { name: "VSCode", icon: "/lovable-uploads/73160045-4ba5-4ffa-a980-50e0b33b3517.png" },
    { name: "JetBrains", icon: "/lovable-uploads/223666e0-b3d5-4b6e-9f8f-c85eea51d4ab.png" },
    { name: "Local Host", icon: "/lovable-uploads/5ebbe2a4-57d7-4db0-98c4-34fc93af0c58.png" },
    { name: "Cloud Host", icon: "/lovable-uploads/5f93fbdd-00d5-49db-862d-e4b247e975d7.png" },
  ];

  const testimonials = [
    {
      author: "Sarah Chen",
      role: "Full-stack Developer",
      company: "TechForward",
      text: "MCP Now has completely transformed my AI development workflow. Now I can seamlessly switch between different models without changing my code.",
      avatar: "/placeholder.svg",
    },
    {
      author: "Michael Rodriguez",
      role: "ML Engineer",
      company: "DataVision",
      text: "The ability to manage multiple MCP servers from one interface is a game-changer. I've cut my model deployment time by 70%.",
      avatar: "/placeholder.svg",
    },
    {
      author: "Aisha Johnson",
      role: "CTO",
      company: "NextGen AI",
      text: "Our entire team relies on MCP Now for consistent and reliable access to our AI infrastructure. It's become an essential part of our tech stack.",
      avatar: "/placeholder.svg",
    },
  ];

  const painPoints = [
    {
      before: "多账号切换，多平台登录",
      after: "一次登录，统一管理所有 AI 服务",
      icon: Cpu
    },
    {
      before: "反复配置不同环境参数",
      after: "统一配置文件，跨环境复用",
      icon: ServerIcon
    },
    {
      before: "API Key 分散管理不安全",
      after: "安全加密，集中授权管理",
      icon: Database
    }
  ];

  // Simplified FAQ with the most important items first
  const faqs = [
    {
      question: "MCP Now 与直接使用各服务商 SDK 有什么区别？",
      answer: "MCP Now 提供统一接口，消除各平台间差异，同时保留每个服务商的特色功能。使用 MCP Now 不需要为每个服务商学习不同的 API，节省开发时间，同时提高代码复用率。"
    },
    {
      question: "如何让 MCP Now 与我现有的开发工具配合使用？",
      answer: "MCP Now 支持与多种流行开发工具集成，包括 Cursor、VSCode、JetBrains 等 IDE，甚至可以无缝集成到您的命令行工作流程中。您只需要简单配置一次，就能在所有开发环境中使用相同的 AI 服务。"
    },
    {
      question: "我可以用 MCP Now 连接自己的本地模型吗？",
      answer: "当然可以！MCP Now 不仅支持主流云端服务，还完全兼容本地部署的模型。您可以通过 MCP Now 的统一接口同时管理云端和本地资源，无需修改应用代码即可灵活切换。"
    },
  ];

  const valueBenefits = [
    {
      title: "统一接口适配",
      description: "使用同一套代码访问所有 AI 服务，告别繁琐的多 API 调用",
      icon: <Zap className="h-8 w-8 text-blue-500" />
    },
    {
      title: "跨平台兼容",
      description: "在任何开发环境中无缝使用，从本地到云端无需重新配置",
      icon: <ServerIcon className="h-8 w-8 text-purple-500" />
    },
    {
      title: "安全管理",
      description: "集中管理所有账号和密钥，更高级别的安全保障",
      icon: <Database className="h-8 w-8 text-teal-500" />
    }
  ];

  const quickStartSteps = [
    {
      title: "下载安装",
      description: "为您的操作系统下载 MCP Now 客户端并安装",
      icon: Download,
    },
    {
      title: "服务配置",
      description: "一次性添加您需要的 AI 服务，填入相关 API 密钥",
      icon: ServerIcon,
    },
    {
      title: "创建配置文件",
      description: "设置您偏好的服务器组合和参数配置",
      icon: Database,
    },
    {
      title: "连接工具",
      description: "将配置绑定到您喜爱的开发工具和环境",
      icon: Cpu,
    },
  ];

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
              <Link to="#what-is-mcp" className="text-sm font-medium text-gray-800 transition-colors hover:text-blue-600 dark:text-gray-200 dark:hover:text-blue-400">
                什么是 MCP
              </Link>
              <Link to="#why-mcp-now" className="text-sm font-medium text-gray-800 transition-colors hover:text-blue-600 dark:text-gray-200 dark:hover:text-blue-400">
                为什么选择 MCP Now
              </Link>
              <Link to="#download" className="text-sm font-medium text-gray-800 transition-colors hover:text-blue-600 dark:text-gray-200 dark:hover:text-blue-400">
                下载
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

      {/* 首屏：清晰阐述价值主张 */}
      <section className="relative py-20 md:py-28 overflow-hidden" id="what-is-mcp">
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-1/4 -left-24 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-1/4 right-10 w-56 h-56 bg-purple-500/10 rounded-full blur-3xl"></div>
        </div>
        
        <div className="container px-4 md:px-6">
          <motion.div
            className="flex flex-col items-center text-center space-y-6"
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
              一站式管理所有
              <span className="bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent block mt-1">
                AI 模型服务
              </span>
            </h1>
            
            <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 max-w-2xl">
              MCP Now 让您通过统一接口访问所有 AI 服务，消除平台差异，
              <span className="font-semibold">简化开发流程，提升工作效率</span>
            </p>
            
            {/* 嵌入 FAQ：什么是 MCP？ */}
            <div className="bg-white/80 dark:bg-gray-800/50 p-4 rounded-lg border border-blue-100 dark:border-blue-900/30 max-w-xl">
              <div className="flex items-start gap-3">
                <MessageCircleQuestion className="h-5 w-5 text-blue-500 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="font-medium text-left">什么是 MCP (Model Context Protocol)?</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300 text-left mt-1">
                    MCP 是一种统一不同 AI 服务接口的协议，让开发者可以用相同的代码调用不同的 AI 模型服务。
                    MCP Now 是这一协议的桌面管理工具，让您可视化管理所有 AI 服务连接。
                  </p>
                </div>
              </div>
            </div>
            
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
              className="w-full max-w-4xl mt-8 rounded-lg overflow-hidden shadow-lg border border-gray-200 dark:border-gray-800"
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

      {/* 新增：为什么选择 MCP Now - 痛点对比 */}
      <section id="why-mcp-now" className="py-20 bg-white/70 dark:bg-gray-900/50">
        <div className="container px-4 md:px-6">
          <motion.div
            className="text-center max-w-3xl mx-auto mb-12"
            {...fadeInUp}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">为什么选择 MCP Now?</h2>
            <p className="text-lg text-gray-600 dark:text-gray-300">
              告别繁琐的多平台管理，一站式解决 AI 开发中的常见痛点
            </p>
          </motion.div>

          {/* 痛点对比卡片 */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {painPoints.map((point, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
              >
                <Card className="h-full border-gray-200 dark:border-gray-800 overflow-hidden">
                  <CardContent className="p-6">
                    <div className="mb-4 p-3 rounded-full bg-blue-100 dark:bg-blue-900/20 w-12 h-12 flex items-center justify-center">
                      <point.icon className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                    </div>
                    
                    <div className="space-y-4 mt-6">
                      <div className="flex items-start gap-2">
                        <XCircle className="h-5 w-5 text-red-500 mt-0.5 flex-shrink-0" />
                        <div>
                          <p className="font-medium">传统方式</p>
                          <p className="text-sm text-gray-600 dark:text-gray-400">{point.before}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-start gap-2">
                        <CheckCircle2 className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                        <div>
                          <p className="font-medium">使用 MCP Now</p>
                          <p className="text-sm text-gray-600 dark:text-gray-400">{point.after}</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          {/* 核心价值点 */}
          <div className="mt-16 max-w-5xl mx-auto">
            <motion.div 
              className="grid grid-cols-1 md:grid-cols-3 gap-8"
              variants={staggerChildren}
              initial="initial"
              whileInView="whileInView"
              viewport={{ once: true }}
            >
              {valueBenefits.map((benefit, idx) => (
                <motion.div
                  key={idx}
                  variants={fadeInUp}
                  className="text-center"
                >
                  <div className="mb-4 mx-auto bg-blue-50 dark:bg-blue-900/20 p-4 rounded-full w-16 h-16 flex items-center justify-center">
                    {benefit.icon}
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{benefit.title}</h3>
                  <p className="text-gray-600 dark:text-gray-300">{benefit.description}</p>
                </motion.div>
              ))}
            </motion.div>
          </div>

          {/* 嵌入常见问题 */}
          <motion.div
            className="mt-12 max-w-3xl mx-auto bg-blue-50/50 dark:bg-blue-900/10 rounded-lg p-6 border border-blue-100 dark:border-blue-900/30"
            {...fadeInUp}
            transition={{ delay: 0.3 }}
          >
            <div className="flex items-start gap-3">
              <MessageCircleQuestion className="h-5 w-5 text-blue-600 mt-1 flex-shrink-0" />
              <div>
                <h3 className="font-medium">MCP Now 与直接使用各服务商 SDK 有什么区别？</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  MCP Now 提供统一接口，消除各平台间差异，同时保留每个服务商的特色功能。使用 MCP Now 不需要为每个服务商学习不同的 API，节省开发时间，同时提高代码复用率。
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* 服务广场：精简，更加突出核心价值 */}
      <section id="servers" className="py-20 bg-white/50 dark:bg-gray-900/50">
        <div className="container px-4 md:px-6">
          <motion.div
            className="text-center max-w-3xl mx-auto mb-12"
            {...fadeInUp}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">全面覆盖主流 AI 服务</h2>
            <p className="text-lg text-gray-600 dark:text-gray-300">
              一站式接入所有您需要的 AI 服务，无需多平台切换
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
              >
                <Card className="h-full overflow-hidden transition-all hover:shadow-md border-gray-200 dark:border-gray-800">
                  <CardContent className="p-4">
                    <div className="flex flex-col items-center text-center">
                      <div className="mb-3 p-2 rounded-lg bg-blue-50 dark:bg-blue-900/20">
                        <img 
                          src={server.icon}
                          alt={server.name}
                          className="w-10 h-10 object-contain"
                        />
                      </div>
                      <h3 className="text-sm font-medium mb-1">{server.name}</h3>
                      <p className="text-xs text-gray-500 dark:text-gray-400">{server.description}</p>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
          
          {/* 嵌入的 FAQ */}
          <motion.div
            className="mt-8 max-w-3xl mx-auto bg-blue-50/50 dark:bg-blue-900/10 rounded-lg p-6 border border-blue-100 dark:border-blue-900/30"
            {...fadeInUp}
            transition={{ delay: 0.2 }}
          >
            <div className="flex items-start gap-3">
              <MessageCircleQuestion className="h-5 w-5 text-blue-600 mt-1 flex-shrink-0" />
              <div>
                <h3 className="font-medium">我可以用 MCP Now 连接自己的本地模型吗？</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  当然可以！MCP Now 不仅支持主流云端服务，还完全兼容本地部署的模型。您可以通过 MCP Now 的统一接口同时管理云端和本地资源，无需修改应用代码即可灵活切换。
                </p>
              </div>
            </div>
          </motion.div>
          
          <div className="mt-8 text-center">
            <Button variant="outline" className="text-blue-600 hover:bg-blue-50" onClick={() => window.location.href = '/discovery'}>
              探索更多 MCP Servers
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      </section>

      {/* 多平台兼容 + 用例场景：tabs 形式展示 */}
      <section id="compatibility" className="py-20 bg-gradient-to-b from-white to-blue-50 dark:from-gray-900 dark:to-gray-950">
        <div className="container px-4 md:px-6">
          <motion.div
            className="text-center max-w-3xl mx-auto mb-12"
            {...fadeInUp}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">无缝集成您的工作环境</h2>
            <p className="text-lg text-gray-600 dark:text-gray-300">
              一次配置，多处使用，适配您喜爱的所有开发工具
            </p>
          </motion.div>
          
          <motion.div 
            className="max-w-4xl mx-auto"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            <Tabs defaultValue="development" className="w-full">
              <TabsList className="grid grid-cols-3 mb-8">
                <TabsTrigger value="development">开发环境</TabsTrigger>
                <TabsTrigger value="hosting">主机环境</TabsTrigger>
                <TabsTrigger value="usage">使用场景</TabsTrigger>
              </TabsList>
              
              <TabsContent value="development" className="p-4">
                <div className="flex flex-wrap justify-center gap-8">
                  {hosts.slice(0, 4).map((host, idx) => (
                    <motion.div
                      key={`${host.name}-${idx}`}
                      className="flex flex-col items-center"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.1 }}
                    >
                      <div className="p-4 rounded-full bg-gray-50 dark:bg-gray-800 mb-3 shadow-sm">
                        <img
                          src={host.icon}
                          alt={host.name}
                          className="w-14 h-14 object-contain"
                        />
                      </div>
                      <span className="font-medium">{host.name}</span>
                    </motion.div>
                  ))}
                </div>
              </TabsContent>
              
              <TabsContent value="hosting" className="p-4">
                <div className="flex flex-wrap justify-center gap-8">
                  {hosts.slice(4, 6).map((host, idx) => (
                    <motion.div
                      key={`${host.name}-${idx}`}
                      className="flex flex-col items-center"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.1 }}
                    >
                      <div className="p-4 rounded-full bg-gray-50 dark:bg-gray-800 mb-3 shadow-sm">
                        <img
                          src={host.icon}
                          alt={host.name}
                          className="w-14 h-14 object-contain"
                        />
                      </div>
                      <span className="font-medium">{host.name}</span>
                    </motion.div>
                  ))}
                </div>
              </TabsContent>
              
              <TabsContent value="usage" className="p-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <Card className="border-gray-200 dark:border-gray-800">
                    <CardContent className="p-6">
                      <h3 className="font-semibold mb-2">开发环境</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        在 IDE 中直接调用多种 AI 模型，辅助代码编写、审查和优化
                      </p>
                    </CardContent>
                  </Card>
                  
                  <Card className="border-gray-200 dark:border-gray-800">
                    <CardContent className="p-6">
                      <h3 className="font-semibold mb-2">数据分析</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        为数据分析流程集成多种 AI 能力，自动化处理和可视化数据
                      </p>
                    </CardContent>
                  </Card>
                  
                  <Card className="border-gray-200 dark:border-gray-800">
                    <CardContent className="p-6">
                      <h3 className="font-semibold mb-2">内容创作</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        在内容创作过程中无缝切换不同风格和功能的 AI 模型
                      </p>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
            </Tabs>
          </motion.div>
          
          {/* 嵌入 FAQ */}
          <motion.div
            className="mt-10 max-w-3xl mx-auto bg-blue-50/50 dark:bg-blue-900/10 rounded-lg p-6 border border-blue-100 dark:border-blue-900/30"
            {...fadeInUp}
            transition={{ delay: 0.2 }}
          >
            <div className="flex items-start gap-3">
              <MessageCircleQuestion className="h-5 w-5 text-blue-600 mt-1 flex-shrink-0" />
              <div>
                <h3 className="font-medium">如何让 MCP Now 与我现有的开发工具配合使用？</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  MCP Now 支持与多种流行开发工具集成，包括 Cursor、VSCode、JetBrains 等 IDE，甚至可以无缝集成到您的命令行工作流程中。您只需要简单配置一次，就能在所有开发环境中使用相同的 AI 服务。
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* 简化的入门指南 */}
      <section id="guide" className="py-20 bg-blue-50/70 dark:bg-gray-950/80">
        <div className="container px-4 md:px-6">
          <motion.div
            className="text-center max-w-3xl mx-auto mb-12"
            {...fadeInUp}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">四步开始使用</h2>
            <p className="text-lg text-gray-600 dark:text-gray-300">
              简单几步配置，即可开始享受统一 AI 服务管理的便利
            </p>
          </motion.div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
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
          
          <div className="mt-12 text-center">
            <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
              <Download className="mr-2 h-5 w-5" />
              立即开始
            </Button>
          </div>
        </div>
      </section>

      {/* 真实用户反馈 */}
      <section id="testimonials" className="py-20 bg-white dark:bg-gray-900">
        <div className="container px-4 md:px-6">
          <motion.div
            className="text-center max-w-3xl mx-auto mb-12"
            {...fadeInUp}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">用户反馈</h2>
            <p className="text-lg text-gray-600 dark:text-gray-300">
              看看开发者们如何通过 MCP Now 提升他们的工作效率
            </p>
          </motion.div>
          
          <motion.div
            className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto"
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

      {/* 简化的常见问题，关键问题已提前展示到各节 */}
      <section id="faq" className="py-20 bg-gray-50 dark:bg-gray-800/50">
        <div className="container px-4 md:px-6">
          <motion.div
            className="text-center max-w-3xl mx-auto mb-12"
            {...fadeInUp}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">更多常见问题</h2>
            <p className="text-lg text-gray-600 dark:text-gray-300">
              了解更多关于 MCP Now 的详细信息
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
                  <MessageCircleQuestion className="mr-2 h-5 w-5 text-blue-600 flex-shrink-0" />
                  {faq.question}
                </h3>
                <p className="text-gray-600 dark:text-gray-300 pl-7">{faq.answer}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 下载部分：更加突出 */}
      <section id="download" className="py-20 bg-gradient-to-b from-blue-50 to-white dark:from-blue-950/20 dark:to-gray-900">
        <div className="container px-4 md:px-6">
          <motion.div
            className="text-center max-w-3xl mx-auto mb-12"
            {...fadeInUp}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">开始使用 MCP Now</h2>
            <p className="text-lg text-gray-600 dark:text-gray-300">
              下载客户端，简化您的 AI 开发流程
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
                与其他 MCP Now 用户交流，获取最新更新，分享您的经验。
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
                <li><Link to="#what-is-mcp" className="text-gray-600 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400">什么是 MCP</Link></li>
                <li><Link to="#why-mcp-now" className="text-gray-600 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400">为什么选择 MCP Now</Link></li>
                <li><Link to="#download" className="text-gray-600 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400">下载</Link></li>
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
