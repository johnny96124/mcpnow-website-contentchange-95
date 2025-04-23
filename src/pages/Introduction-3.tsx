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
  MessageSquareQuoteIcon, 
  DiscIcon,
  MessageCircleQuestionIcon,
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
    {
      author: "David Park",
      role: "AI Researcher",
      company: "Innovation Labs",
      text: "The profile management system in MCP Now makes it incredibly easy to maintain different configurations for development and production.",
      avatar: "/placeholder.svg",
    },
  ];

  const faqs = [
    {
      question: "What is MCP Now?",
      answer: "MCP Now is a desktop application that simplifies the management of Model Context Protocol (MCP) servers. It provides a unified interface for discovering, configuring, and connecting to multiple AI model providers through a single client."
    },
    {
      question: "How does MCP Now improve my AI development workflow?",
      answer: "MCP Now eliminates the need to manage multiple configurations for different AI services. You can quickly switch between providers, create reusable profiles, and connect various host applications to these profiles with minimal configuration."
    },
    {
      question: "Is MCP Now compatible with my existing AI tools?",
      answer: "Yes, MCP Now supports integration with many popular AI development tools like Cursor, VSCode, JetBrains IDEs, and more. It's designed to seamlessly fit into your existing workflow."
    },
    {
      question: "Can I use MCP Now with my own local AI models?",
      answer: "Absolutely! MCP Now fully supports local host configurations, allowing you to integrate your own custom models and servers into the same management interface."
    },
    {
      question: "Is MCP Now secure for enterprise use?",
      answer: "MCP Now prioritizes security with encrypted connections, credential management, and doesn't store your API keys centrally. It's designed from the ground up with enterprise security considerations."
    },
    {
      question: "How much does MCP Now cost?",
      answer: "MCP Now offers a free version with core functionality, with premium features available through subscription plans. Check our website for current pricing details."
    }
  ];

  const quickStartSteps = [
    {
      title: "Download Client",
      description: "Install the MCP Now desktop client for your operating system.",
      icon: Download,
    },
    {
      title: "Discover Servers",
      description: "Browse the Discovery page to find and install MCP servers.",
      icon: ServerIcon,
    },
    {
      title: "Create Profiles",
      description: "Configure profiles with your preferred servers and settings.",
      icon: Database,
    },
    {
      title: "Bind to Hosts",
      description: "Connect your profiles to development environments and tools.",
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
              支持多服务商集成的
              <span className="bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent block mt-1">
                MCP Servers 服务客户端
              </span>
            </h1>
            
            <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 max-w-3xl">
              MCP Now 目前支持市面上绝大多数服务商的集成，并且支持多服务商的模型统一调度，
              大大简化了开发者的工作流程。
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
                src="/placeholder.svg"
                alt="MCP Now Client Screenshot" 
                className="w-full h-auto object-cover"
              />
            </motion.div>
          </motion.div>
        </div>
      </section>

      <section id="servers" className="py-20 bg-white/50 dark:bg-gray-900/50">
        <div className="container px-4 md:px-6">
          <motion.div
            className="text-center max-w-3xl mx-auto mb-16"
            {...fadeInUp}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">MCP 服务广场</h2>
            <p className="text-lg text-gray-600 dark:text-gray-300">
              探索并连接到各种流行的 AI 模型服务商，通过统一的接口简化您的开发流程。
            </p>
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
              MCP Now 内置众多主流 Hosts
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300">
              同时也兼容本地 Hosts 配置，满足您的各类开发需求。
            </p>
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
            <h2 className="text-3xl md:text-4xl font-bold mb-4">入门指南</h2>
            <p className="text-lg text-gray-600 dark:text-gray-300">
              只需几个简单步骤，即可开始使用 MCP Now 提升您的开发体验。
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
        </div>
      </section>

      <section id="testimonials" className="py-20 bg-white dark:bg-gray-900">
        <div className="container px-4 md:px-6">
          <motion.div
            className="text-center max-w-3xl mx-auto mb-16"
            {...fadeInUp}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">全球优秀开发者必备的 MCP 工具</h2>
            <p className="text-lg text-gray-600 dark:text-gray-300">
              来自专业开发者的真实反馈，了解 MCP Now 如何改变他们的工作流程。
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
              了解更多关于 MCP Now 的常见疑问解答。
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
            <h2 className="text-3xl md:text-4xl font-bold mb-4">开始体验 MCP Now</h2>
            <p className="text-lg text-gray-600 dark:text-gray-300">
              下载客户端，或加入我们的社区获取更多支持与交流。
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
