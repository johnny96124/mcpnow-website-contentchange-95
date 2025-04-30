import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Download, ChevronRight, ArrowRight, Server as ServerIcon, Cpu, Database, Star, Zap, CheckCircle2, XCircle, Twitter, DiscIcon, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { ThemeToggle } from "@/components/theme/theme-toggle";
const fadeInUp = {
  initial: {
    opacity: 0,
    y: 40
  },
  whileInView: {
    opacity: 1,
    y: 0
  },
  viewport: {
    once: true
  },
  transition: {
    duration: 0.7
  }
};
const staggerChildren = {
  initial: {
    opacity: 0
  },
  whileInView: {
    opacity: 1
  },
  viewport: {
    once: true
  },
  transition: {
    staggerChildren: 0.2
  }
};
const cardHover = {
  rest: {
    scale: 1,
    transition: {
      duration: 0.2
    }
  },
  hover: {
    scale: 1.03,
    rotate: 1,
    transition: {
      duration: 0.3
    }
  }
};
const Introduction3: React.FC = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 10;
      if (isScrolled !== scrolled) {
        setScrolled(isScrolled);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [scrolled]);
  const mcpServers = [{
    name: "OpenAI Server",
    description: "Access GPT-4 and DALL-E models",
    icon: "/lovable-uploads/888ae2df-5f1b-4ce5-8d4e-6517d4432938.png"
  }, {
    name: "Anthropic Claude",
    description: "High-performance Claude models",
    icon: "/lovable-uploads/b23d1c2f-49a2-46c2-9fd2-45c26c3686bb.png"
  }, {
    name: "Adobe Firefly",
    description: "Creative image generation APIs",
    icon: "/lovable-uploads/73160045-4ba5-4ffa-a980-50e0b33b3517.png"
  }, {
    name: "Atlassian Server",
    description: "Multi-protocol connectivity",
    icon: "/lovable-uploads/223666e0-b3d5-4b6e-9f8f-c85eea51d4ab.png"
  }, {
    name: "Airbnb Custom",
    description: "Custom model deployment tools",
    icon: "/lovable-uploads/5ebbe2a4-57d7-4db0-98c4-34fc93af0c58.png"
  }, {
    name: "Amazon Bedrock",
    description: "Managed foundation model access",
    icon: "/lovable-uploads/5f93fbdd-00d5-49db-862d-e4b247e975d7.png"
  }, {
    name: "Amplitude AI",
    description: "Analytics-focused AI models",
    icon: "/lovable-uploads/4fecf049-ca5f-4955-a38c-4506556886d2.png"
  }, {
    name: "Discord AI",
    description: "Social-first AI integrations",
    icon: "/lovable-uploads/60892b6e-18d9-4bbc-869b-df9d6adecf7d.png"
  }];
  const hosts = [{
    name: "Cursor",
    icon: "/lovable-uploads/888ae2df-5f1b-4ce5-8d4e-6517d4432938.png"
  }, {
    name: "Windurf",
    icon: "/lovable-uploads/b23d1c2f-49a2-46c2-9fd2-45c26c3686bb.png"
  }, {
    name: "VSCode",
    icon: "/lovable-uploads/73160045-4ba5-4ffa-a980-50e0b33b3517.png"
  }, {
    name: "JetBrains",
    icon: "/lovable-uploads/223666e0-b3d5-4b6e-9f8f-c85eea51d4ab.png"
  }, {
    name: "Local Host",
    icon: "/lovable-uploads/5ebbe2a4-57d7-4db0-98c4-34fc93af0c58.png"
  }, {
    name: "Cloud Host",
    icon: "/lovable-uploads/5f93fbdd-00d5-49db-862d-e4b247e975d7.png"
  }];
  const testimonials = [{
    author: "Sarah Chen",
    role: "Full-stack Developer",
    company: "TechForward",
    text: "MCP Now has completely transformed my AI development workflow. Now I can seamlessly switch between different models without changing my code.",
    avatar: "/placeholder.svg"
  }, {
    author: "Michael Rodriguez",
    role: "ML Engineer",
    company: "DataVision",
    text: "The ability to manage multiple MCP servers from one interface is a game-changer. I've cut my model deployment time by 70%.",
    avatar: "/placeholder.svg"
  }, {
    author: "Aisha Johnson",
    role: "CTO",
    company: "NextGen AI",
    text: "Our entire team relies on MCP Now for consistent and reliable access to our AI infrastructure. It's become an essential part of our tech stack.",
    avatar: "/placeholder.svg"
  }];
  const painPoints = [{
    before: "多账号切换，多平台登录",
    after: "一次登录，统一管理所有 AI 服务",
    icon: Cpu,
    benefit: "统一接口适配：使用同一套代码访问所有 AI 服务，告别繁琐的多 API 调用"
  }, {
    before: "反复配置不同环境参数",
    after: "统一配置文件，跨环境复用",
    icon: ServerIcon,
    benefit: "跨平台兼容：在任何开发环境中无缝使用，从本地到云端无需重新配置"
  }, {
    before: "API Key 分散管理不安全",
    after: "安全加密，集中授权管理",
    icon: Database,
    benefit: "安全管理：集中管理所有账号和密钥，更高级别的安全保障"
  }];
  const quickStartSteps = [{
    title: "下载安装",
    description: "为您的操作系统下载 MCP Now 客户端并安装",
    icon: Download
  }, {
    title: "服务配置",
    description: "一次性添加您需要的 AI 服务，填入相关 API 密钥",
    icon: ServerIcon
  }, {
    title: "创建配置文件",
    description: "设置您偏好的服务器组合和参数配置",
    icon: Database
  }, {
    title: "连接工具",
    description: "将配置绑定到您喜爱的开发工具和环境",
    icon: Cpu
  }];
  const impactMetrics = [{
    value: "50,000+",
    label: "活跃开发者"
  }, {
    value: "120,000+",
    label: "AI 项目部署"
  }, {
    value: "75%",
    label: "开发效率提升"
  }, {
    value: "98.7%",
    label: "服务可靠性"
  }];
  const keyFeatures = [{
    title: "Host 自动扫描与配置",
    description: "自动识别本地和远程 Host，一键完成连接配置，无需手动设置",
    icon: <ServerIcon className="h-8 w-8 text-blue-500" />
  }, {
    title: "Server 一键安装部署",
    description: "支持多种 Server 配置方案，满足不同场景需求，一次安装多处使用",
    icon: <Database className="h-8 w-8 text-purple-500" />
  }, {
    title: "Profile 智能管理",
    description: "通过 Profile 灵活组合 Server，支持热插拔能力，无需重启即可切换",
    icon: <Zap className="h-8 w-8 text-amber-500" />
  }];
  return <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white dark:from-gray-900 dark:to-gray-950 font-noto">
      <nav className={cn("sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60", scrolled && "shadow-sm bg-background/80 backdrop-blur-md")}>
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-6">
            <Link to="/" className="flex items-center gap-2">
              <ServerIcon className="h-6 w-6 text-blue-600" />
              <span className="text-xl font-extrabold tracking-tight">MCP Now</span>
            </Link>
            <nav className="hidden md:flex items-center gap-6">
              <Link to="#features" className="nav-link text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">
                Features
              </Link>
              <Link to="#use-cases" className="nav-link text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">
                Use Cases
              </Link>
              <Link to="#faq" className="nav-link text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">
                FAQ
              </Link>
              <Link to="/hosts" className="nav-link text-sm font-medium text-blue-600 transition-colors hover:text-blue-700">
                Dashboard
              </Link>
            </nav>
          </div>
          <div className="flex items-center gap-4">
            <div className="hidden md:flex items-center gap-4">
              <Button variant="default" className="bg-blue-600 hover:bg-blue-700" onClick={() => window.location.href = '#download'}>
                <Download className="mr-2 h-4 w-4" />
                Download
              </Button>
            </div>
            <ThemeToggle />
            <button className="md:hidden" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
        
        {/* Mobile menu */}
        <div className={cn("md:hidden absolute top-16 inset-x-0 bg-background border-b z-50 overflow-hidden transition-all duration-300 ease-in-out", mobileMenuOpen ? "max-h-[500px]" : "max-h-0")}>
          <div className="container py-4 space-y-4">
            <Link to="#features" className="block py-2 text-base font-medium" onClick={() => setMobileMenuOpen(false)}>
              Features
            </Link>
            <Link to="#use-cases" className="block py-2 text-base font-medium" onClick={() => setMobileMenuOpen(false)}>
              Use Cases
            </Link>
            <Link to="#faq" className="block py-2 text-base font-medium" onClick={() => setMobileMenuOpen(false)}>
              FAQ
            </Link>
            <Link to="/hosts" className="block py-2 text-base font-medium text-blue-600" onClick={() => setMobileMenuOpen(false)}>
              Dashboard
            </Link>
            <div className="pt-4 flex flex-col gap-4 border-t">
              <Button variant="default" className="w-full bg-blue-600 hover:bg-blue-700" onClick={() => window.location.href = '#download'}>
                <Download className="mr-2 h-4 w-4" />
                Download
              </Button>
            </div>
          </div>
        </div>
      </nav>

      <section className="relative py-20 md:py-28 overflow-hidden" id="what-is-mcp">
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-1/4 -left-24 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-1/4 right-10 w-56 h-56 bg-purple-500/10 rounded-full blur-3xl"></div>
        </div>
        
        <div className="container px-4 md:px-6">
          <motion.div className="flex flex-col items-center text-center space-y-6" initial={{
          opacity: 0,
          y: 20
        }} animate={{
          opacity: 1,
          y: 0
        }} transition={{
          duration: 0.7
        }}>
            <Badge variant="outline" className="px-3 py-1 border-blue-200 bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:border-blue-800 dark:text-blue-400">
              <span className="text-blue-600 font-bold mr-1.5">New</span>
              <span className="text-gray-600 dark:text-gray-300">|</span>
              <span className="ml-1.5">Introducing MCP Now</span>
            </Badge>
            
            <div className="space-y-4">
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight font-montserrat">
                告别繁琐配置
              </h1>
              <h2 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-blue-600 font-montserrat">
                一站式统一管理 MCP 生态系统
              </h2>
            </div>
            
            <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 max-w-3xl leading-relaxed">
              MCP Now 充当 AI 应用和模型服务之间的桥梁，通过创新的聚合方式让您轻松调用多种服务能力，
              无需编辑配置文件，一键接入所有 MCP 服务。
            </p>
            
            <div className="bg-white/80 dark:bg-gray-800/50 p-4 rounded-lg border border-blue-100 dark:border-blue-900/30 max-w-xl">
              <div className="flex items-start gap-3">
                <div className="h-5 w-5 text-blue-500 mt-1 flex-shrink-0">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M19.07 4.93A10 10 0 0 0 6.99 3.34"></path>
                    <path d="M4 6h.01"></path>
                    <path d="M2.29 9.62A10 10 0 1 0 21.31 8.35"></path>
                    <path d="M16.24 7.76A6 6 0 1 0 8.23 16.67"></path>
                    <path d="M12 18h.01"></path>
                    <path d="M17.99 11.12A6 6 0 0 1 15.01 16.89"></path>
                    <path d="M15.01 16.89A6 6 0 0 1 8.72 11.12"></path>
                    <path d="M17.99 11.12A6 6 0 0 0 8.72 11.12"></path>
                    <path d="turbo 2.29 19.99"></path>
                  </svg>
                </div>
                <div>
                  <h3 className="font-bold text-left">MCP 与 MCP Now 是什么关系？</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300 text-left mt-1 leading-relaxed">
                    MCP (Model Context Protocol) 是一种底层通信协议，用于统一不同AI模型服务的接口标准。
                    而MCP Now则是这个协议的桌面管理工具，它让用户通过图形界面轻松管理和使用所有支持MCP协议的AI服务，
                    无需手动处理复杂的配置过程。
                  </p>
                </div>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
                
                下载客户端
              </Button>
              <Button size="lg" variant="outline">
                了解更多
                <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
            
            <motion.div className="w-full max-w-4xl mt-8 rounded-lg overflow-hidden shadow-lg border border-gray-200 dark:border-gray-800" initial={{
            opacity: 0,
            y: 40
          }} animate={{
            opacity: 1,
            y: 0
          }} transition={{
            duration: 0.7,
            delay: 0.3
          }}>
              <img src="/lovable-uploads/3debc8dc-96ad-462c-8379-a4b4e08a889b.png" alt="MCP Now Dashboard" className="w-full h-auto object-cover" />
            </motion.div>
          </motion.div>
        </div>
      </section>

      <section id="why-mcp-now" className="py-20 bg-white/70 dark:bg-gray-900/50">
        <div className="container px-4 md:px-6">
          <motion.div className="text-center max-w-3xl mx-auto mb-12" {...fadeInUp}>
            <h2 className="text-3xl md:text-4xl font-extrabold mb-4 font-montserrat">为什么选择 MCP Now?</h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 leading-relaxed">
              告别复杂的多平台管理，一站式解决 AI 开发中的常见痛点
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {painPoints.map((point, idx) => <motion.div key={idx} initial={{
            opacity: 0,
            y: 20
          }} whileInView={{
            opacity: 1,
            y: 0
          }} viewport={{
            once: true
          }} transition={{
            delay: idx * 0.1
          }}>
                <Card className="h-full border-gray-200 dark:border-gray-800 overflow-hidden hover:shadow-md transition-all duration-300 hover:-translate-y-1">
                  <CardContent className="p-6">
                    <div className="mb-4 p-3 rounded-full bg-blue-100 dark:bg-blue-900/20 w-12 h-12 flex items-center justify-center">
                      <point.icon className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                    </div>
                    
                    <div className="space-y-4 mt-6">
                      <div className="flex items-start gap-2">
                        <XCircle className="h-5 w-5 text-red-500 mt-0.5 flex-shrink-0" />
                        <div>
                          <p className="font-bold">传统方式</p>
                          <p className="text-sm text-gray-600 dark:text-gray-400">{point.before}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-start gap-2">
                        <CheckCircle2 className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                        <div>
                          <p className="font-bold">使用 MCP Now</p>
                          <p className="text-sm text-gray-600 dark:text-gray-400">{point.after}</p>
                        </div>
                      </div>
                      
                      <div className="pt-4 border-t border-gray-100 dark:border-gray-800">
                        <p className="font-medium text-blue-600 dark:text-blue-400">{point.benefit}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>)}
          </div>

          <div className="mt-16 max-w-5xl mx-auto">
            <motion.div className="grid grid-cols-1 md:grid-cols-3 gap-10 lg:gap-16" variants={staggerChildren} initial="initial" whileInView="whileInView" viewport={{
            once: true
          }}>
              {keyFeatures.map((feature, idx) => {})}
            </motion.div>
          </div>
        </div>
      </section>

      <section id="servers" className="py-20 bg-white/50 dark:bg-gray-900/50">
        <div className="container px-4 md:px-6">
          <motion.div className="text-center max-w-3xl mx-auto mb-12" {...fadeInUp}>
            <h2 className="text-3xl md:text-4xl font-extrabold mb-4 font-montserrat">全面覆盖主流 AI 服务</h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 leading-relaxed">
              一站式接入所有您需要的 AI 服务，无需切换多个平台
            </p>
          </motion.div>
          
          <motion.div className="grid grid-cols-2 sm:grid-cols-4 gap-4 md:gap-6 max-w-4xl mx-auto" variants={staggerChildren} initial="initial" whileInView="whileInView" viewport={{
          once: true
        }}>
            {mcpServers.map((server, idx) => <motion.div key={`${server.name}-${idx}`} whileHover="hover" initial="rest" animate="rest" variants={cardHover} className="server-card">
                <Card className="h-full overflow-hidden border-gray-200 dark:border-gray-800">
                  <CardContent className="p-4">
                    <div className="flex flex-col items-center text-center">
                      <div className="mb-3 p-2 rounded-lg bg-blue-50 dark:bg-blue-900/20">
                        <img src={server.icon} alt={server.name} className="w-10 h-10 object-contain" />
                      </div>
                      <h3 className="text-sm font-bold mb-1 font-montserrat">{server.name}</h3>
                      <p className="text-xs text-gray-500 dark:text-gray-400">{server.description}</p>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>)}
          </motion.div>
          
          <div className="mt-8 text-center">
            <Button variant="outline" className="text-blue-600 hover:bg-blue-50" onClick={() => window.location.href = '/discovery'}>
              探索更多 MCP Servers
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      </section>

      <section id="compatibility" className="py-20 bg-gradient-to-b from-white to-blue-50 dark:from-gray-900 dark:to-gray-950">
        <div className="container px-4 md:px-6">
          <motion.div className="text-center max-w-3xl mx-auto mb-12" {...fadeInUp}>
            <h2 className="text-3xl md:text-4xl font-extrabold mb-4 font-montserrat">多场景灵活适配</h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 leading-relaxed">
              一次配置，多处使用，适配您喜爱的所有开发工具
            </p>
          </motion.div>
          
          <motion.div className="max-w-4xl mx-auto" initial={{
          opacity: 0
        }} whileInView={{
          opacity: 1
        }} viewport={{
          once: true
        }}>
            <Tabs defaultValue="development" className="w-full">
              <TabsList className="grid grid-cols-3 mb-8">
                <TabsTrigger value="development">开发环境</TabsTrigger>
                <TabsTrigger value="hosting">主机环境</TabsTrigger>
                <TabsTrigger value="usage">使用场景</TabsTrigger>
              </TabsList>
              
              <TabsContent value="development" className="p-4">
                <div className="flex flex-wrap justify-center gap-8">
                  {hosts.slice(0, 4).map((host, idx) => <motion.div key={`${host.name}-${idx}`} className="flex flex-col items-center" initial={{
                  opacity: 0,
                  y: 10
                }} animate={{
                  opacity: 1,
                  y: 0
                }} transition={{
                  delay: idx * 0.1
                }} whileHover={{
                  scale: 1.05,
                  transition: {
                    duration: 0.2
                  }
                }}>
                      <div className="p-4 rounded-full bg-gray-50 dark:bg-gray-800 mb-3 shadow-sm">
                        <img src={host.icon} alt={host.name} className="w-14 h-14 object-contain" />
                      </div>
                      <span className="font-bold font-montserrat">{host.name}</span>
                    </motion.div>)}
                </div>
              </TabsContent>
              
              <TabsContent value="hosting" className="p-4">
                <div className="flex flex-wrap justify-center gap-8">
                  {hosts.slice(4, 6).map((host, idx) => <motion.div key={`${host.name}-${idx}`} className="flex flex-col items-center" initial={{
                  opacity: 0,
                  y: 10
                }} animate={{
                  opacity: 1,
                  y: 0
                }} transition={{
                  delay: idx * 0.1
                }} whileHover={{
                  scale: 1.05,
                  transition: {
                    duration: 0.2
                  }
                }}>
                      <div className="p-4 rounded-full bg-gray-50 dark:bg-gray-800 mb-3 shadow-sm">
                        <img src={host.icon} alt={host.name} className="w-14 h-14 object-contain" />
                      </div>
                      <span className="font-bold font-montserrat">{host.name}</span>
                    </motion.div>)}
                </div>
              </TabsContent>
              
              <TabsContent value="usage" className="p-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <Card className="border-gray-200 dark:border-gray-800 hover:shadow-md transition-all duration-300 hover:-translate-y-1">
                    <CardContent className="p-6">
                      <h3 className="font-bold mb-2 font-montserrat">开发环境</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                        在 IDE 中直接调用多种 AI 模型，辅助代码编写、审查和优化
                      </p>
                    </CardContent>
                  </Card>
                  
                  <Card className="border-gray-200 dark:border-gray-800 hover:shadow-md transition-all duration-300 hover:-translate-y-1">
                    <CardContent className="p-6">
                      <h3 className="font-bold mb-2 font-montserrat">数据分析</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                        为数据分析流程集成多种 AI 能力，自动化处理和可视化数据
                      </p>
                    </CardContent>
                  </Card>
                  
                  <Card className="border-gray-200 dark:border-gray-800 hover:shadow-md transition-all duration-300 hover:-translate-y-1">
                    <CardContent className="p-6">
                      <h3 className="font-bold mb-2 font-montserrat">内容创作</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                        在内容创作过程中无缝切换不同风格和功能的 AI 模型
                      </p>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
            </Tabs>
          </motion.div>
          
          <motion.div className="mt-12 max-w-3xl mx-auto bg-blue-50/50 dark:bg-blue-900/10 rounded-lg p-6 border border-blue-100 dark:border-blue-900/30" {...fadeInUp}>
            <div className="text-center">
              <h3 className="font-bold mb-2 font-montserrat">不止于灵活，更有热插拔能力</h3>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed">无需重启应用，一键切换 AI 服务，实时响应业务需求变化</p>
              <p className="text-sm text-gray-500 dark:text-gray-500 italic mt-2">* 部分高性能模型可能需要额外预热时间</p>
            </div>
          </motion.div>
        </div>
      </section>

      <section id="testimonials" className="py-20 bg-white dark:bg-gray-900">
        <div className="container px-4 md:px-6">
          <motion.div className="text-center max-w-3xl mx-auto mb-12" {...fadeInUp}>
            <h2 className="text-3xl md:text-4xl font-extrabold mb-4 font-montserrat">用户反馈与影响</h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 leading-relaxed">
              了解开发者如何通过 MCP Now 提高工作效率
            </p>
          </motion.div>

          <div className="flex justify-center mb-16">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
              {impactMetrics.map((metric, idx) => <motion.div key={idx} className="text-center" initial={{
              opacity: 0,
              y: 20
            }} whileInView={{
              opacity: 1,
              y: 0
            }} viewport={{
              once: true
            }} transition={{
              delay: idx * 0.1
            }}>
                  <div className="mb-2">
                    <span className="text-3xl md:text-4xl font-extrabold text-blue-600 dark:text-blue-400 font-montserrat">{metric.value}</span>
                  </div>
                  <p className="text-gray-600 dark:text-gray-400">{metric.label}</p>
                </motion.div>)}
            </div>
          </div>
          
          {/* Removed the div with className="text-center" here */}
          
          <motion.div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto" variants={staggerChildren} initial="initial" whileInView="whileInView" viewport={{
          once: true
        }}>
            {testimonials.map((testimonial, idx) => <motion.div key={idx} variants={fadeInUp} transition={{
            delay: idx * 0.1
          }} whileHover={{
            y: -5,
            transition: {
              duration: 0.2
            }
          }}>
                <Card className="h-full border-gray-200 dark:border-gray-800 hover:shadow-md transition-all duration-300">
                  <CardContent className="p-6">
                    <div className="flex flex-col space-y-4">
                      <div className="flex items-center space-x-1">
                        {Array(5).fill(null).map((_, i) => <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />)}
                      </div>
                      
                      <p className="italic text-gray-700 dark:text-gray-300 leading-relaxed">"{testimonial.text}"</p>
                      
                      <div className="flex items-center pt-4">
                        <div className="mr-4">
                          <div className="h-10 w-10 rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden">
                            <img src={testimonial.avatar} alt={testimonial.author} className="h-full w-full object-cover" />
                          </div>
                        </div>
                        <div>
                          <p className="font-bold font-montserrat">{testimonial.author}</p>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            {testimonial.role}, {testimonial.company}
                          </p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>)}
          </motion.div>
        </div>
      </section>

      <section id="download" className="py-20 bg-gradient-to-b from-blue-50 to-white dark:from-blue-950/20 dark:to-gray-900">
        <div className="container px-4 md:px-6">
          <motion.div className="text-center max-w-3xl mx-auto mb-12" {...fadeInUp}>
            <h2 className="text-3xl md:text-4xl font-extrabold mb-4 font-montserrat">开始使用 MCP Now</h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 leading-relaxed">
              四步上手，简化您的 AI 开发流程
            </p>
          </motion.div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto mb-16">
            {quickStartSteps.map((step, idx) => <motion.div key={idx} className="relative" initial={{
            opacity: 0,
            y: 20
          }} whileInView={{
            opacity: 1,
            y: 0
          }} viewport={{
            once: true
          }} transition={{
            delay: idx * 0.1
          }} whileHover={{
            y: -5,
            transition: {
              duration: 0.2
            }
          }}>
                <Card className="h-full border-gray-200 dark:border-gray-800 hover:shadow-md transition-all duration-300">
                  <CardContent className="p-6 flex flex-col items-center text-center">
                    <div className="w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center mb-4">
                      <step.icon className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div className="absolute -top-3 -left-3 w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold">
                      {idx + 1}
                    </div>
                    <h3 className="text-lg font-bold mb-2 font-montserrat">{step.title}</h3>
                    <p className="text-gray-600 dark:text-gray-300 leading-relaxed">{step.description}</p>
                  </CardContent>
                </Card>
                
                {idx < quickStartSteps.length - 1 && <div className="hidden lg:block absolute top-1/2 -right-4 transform -translate-y-1/2">
                    <ChevronRight className="w-6 h-6 text-gray-400" />
                  </div>}
              </motion.div>)}
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-4xl mx-auto">
            <motion.div className="flex flex-col items-center text-center" initial={{
            opacity: 0,
            x: -20
          }} whileInView={{
            opacity: 1,
            x: 0
          }} viewport={{
            once: true
          }}>
              <h3 className="text-2xl font-extrabold mb-4 font-montserrat">下载客户端</h3>
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
            
            <motion.div className="flex flex-col items-center text-center" initial={{
            opacity: 0,
            x: 20
          }} whileInView={{
            opacity: 1,
            x: 0
          }} viewport={{
            once: true
          }}>
              <h3 className="text-2xl font-extrabold mb-4 font-montserrat">加入社区</h3>
              <p className="mb-6 text-gray-600 dark:text-gray-300 leading-relaxed">
                与其他 MCP Now 用户交流，获取最新更新，分享您的经验。
              </p>
              <div className="flex gap-4">
                <a href="#" className="flex items-center justify-center w-12 h-12 rounded-full bg-blue-100 hover:bg-blue-200 dark:bg-blue-900/30 dark:hover:bg-blue-900/50 transition-colors hover:scale-110 duration-300">
                  <DiscIcon className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                </a>
                <a href="#" className="flex items-center justify-center w-12 h-12 rounded-full bg-blue-100 hover:bg-blue-200 dark:bg-blue-900/30 dark:hover:bg-blue-900/50 transition-colors hover:scale-110 duration-300">
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
                <img src="/lovable-uploads/bbb3edcf-989e-42ed-a8dd-d5f07f4c632d.png" alt="MCP Now Logo" className="h-8 w-8 rounded-lg shadow" />
                <span className="text-xl font-extrabold tracking-tight font-montserrat">MCP Now</span>
              </Link>
              <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
                简化 AI 模型管理与部署的现代解决方案
              </p>
            </div>
            
            <div>
              <h4 className="font-bold mb-4 font-montserrat">产品</h4>
              <ul className="space-y-2 text-sm">
                <li><Link to="#what-is-mcp" className="text-gray-600 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400 nav-link">什么是 MCP</Link></li>
                <li><Link to="#why-mcp-now" className="text-gray-600 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400 nav-link">为什么选择 MCP Now</Link></li>
                <li><Link to="#download" className="text-gray-600 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400 nav-link">下载</Link></li>
                <li><Link to="#" className="text-gray-600 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400 nav-link">更新日志</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-bold mb-4 font-montserrat">资源</h4>
              <ul className="space-y-2 text-sm">
                <li><Link to="#" className="text-gray-600 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400 nav-link">文档</Link></li>
                <li><Link to="#download" className="text-gray-600 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400 nav-link">入门指南</Link></li>
                <li><Link to="#" className="text-gray-600 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400 nav-link">API 参考</Link></li>
                <li><Link to="#" className="text-gray-600 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400 nav-link">示例</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-bold mb-4 font-montserrat">关于我们</h4>
              <ul className="space-y-2 text-sm">
                <li><Link to="#" className="text-gray-600 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400 nav-link">公司</Link></li>
                <li><Link to="#" className="text-gray-600 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400 nav-link">博客</Link></li>
                <li><Link to="#" className="text-gray-600 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400 nav-link">联系我们</Link></li>
                <li>
                  <div className="flex gap-4 mt-2">
                    <a href="#" className="text-gray-500 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400 hover:scale-110 transition-transform duration-300">
                      <DiscIcon className="h-5 w-5" />
                    </a>
                    <a href="#" className="text-gray-500 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400 hover:scale-110 transition-transform duration-300">
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
              <Link to="#" className="text-sm text-gray-500 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400 nav-link">隐私政策</Link>
              <Link to="#" className="text-sm text-gray-500 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400 nav-link">服务条款</Link>
              <Link to="#" className="text-sm text-gray-500 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400 nav-link">法律信息</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>;
};
export default Introduction3;