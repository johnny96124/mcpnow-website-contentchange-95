
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
  Zap,
  CheckCircle2,
  XCircle,
  Twitter,
  DiscIcon
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
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

const Introduction: React.FC = () => {
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
      before: "Multiple account switching, multi-platform logins",
      after: "Single login, unified management of all AI services",
      icon: Cpu,
      benefit: "Unified interface adaptation: Use the same code to access all AI services, say goodbye to complex multiple API calls"
    },
    {
      before: "Repeatedly configuring different environment parameters",
      after: "Unified configuration files, cross-environment reuse",
      icon: ServerIcon,
      benefit: "Cross-platform compatibility: Seamless use in any development environment, from local to cloud without reconfiguration"
    },
    {
      before: "Scattered API Key management is insecure",
      after: "Secure encryption, centralized authorization management",
      icon: Database,
      benefit: "Secure management: Centralize all accounts and keys for higher level security protection"
    }
  ];

  const quickStartSteps = [
    {
      title: "Download and Install",
      description: "Download and install the MCP Now client for your operating system",
      icon: Download,
    },
    {
      title: "Service Configuration",
      description: "Add the AI services you need once, enter the relevant API keys",
      icon: ServerIcon,
    },
    {
      title: "Create Configuration File",
      description: "Set up your preferred server combinations and parameter configurations",
      icon: Database,
    },
    {
      title: "Connect Tools",
      description: "Bind configurations to your favorite development tools and environments",
      icon: Cpu,
    },
  ];

  const impactMetrics = [
    { value: "50,000+", label: "Active Developers" },
    { value: "120,000+", label: "AI Project Deployments" },
    { value: "75%", label: "Development Efficiency Improvement" },
    { value: "98.7%", label: "Service Reliability" }
  ];

  const keyFeatures = [
    {
      title: "Host Auto-Scanning & Configuration",
      description: "Automatically identify local and remote Hosts, one-click connection setup, no manual configuration needed",
      icon: <ServerIcon className="h-8 w-8 text-blue-500" />
    },
    {
      title: "Server One-Click Installation & Deployment",
      description: "Support multiple Server configuration solutions to meet different scenario requirements, install once and use in multiple places",
      icon: <Database className="h-8 w-8 text-purple-500" />
    },
    {
      title: "Configuration Decoupling & Flexible Combinations",
      description: "Host and Server configurations completely decoupled, eliminating duplicate configurations, improving reuse efficiency",
      icon: <Cpu className="h-8 w-8 text-teal-500" />
    },
    {
      title: "Profile Intelligent Management",
      description: "Flexibly combine Servers through Profiles, support hot-swapping capability, switch without restarting",
      icon: <Zap className="h-8 w-8 text-amber-500" />
    }
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
                Home
              </Link>
              <Link to="#what-is-mcp" className="text-sm font-medium text-gray-800 transition-colors hover:text-blue-600 dark:text-gray-200 dark:hover:text-blue-400">
                What is MCP
              </Link>
              <Link to="#why-mcp-now" className="text-sm font-medium text-gray-800 transition-colors hover:text-blue-600 dark:text-gray-200 dark:hover:text-blue-400">
                Why MCP Now
              </Link>
              <Link to="#download" className="text-sm font-medium text-gray-800 transition-colors hover:text-blue-600 dark:text-gray-200 dark:hover:text-blue-400">
                Download
              </Link>
            </div>
          </div>
          <div>
            <Button className="bg-blue-600 hover:bg-blue-700">
              <Download className="mr-2 h-4 w-4" />
              Download Client
            </Button>
          </div>
        </div>
      </nav>

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
            
            <div className="space-y-4">
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight">
                Say Goodbye to Complex Configurations
              </h1>
              <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-blue-600">
                One-Stop Unified Management of MCP Ecosystem
              </h2>
            </div>
            
            <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 max-w-3xl">
              MCP Now is the bridge connecting AI applications with model services, allowing you to easily call multiple 
              service capabilities through an innovative aggregation approach, without editing configuration files, 
              connecting to all MCP services with one click.
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
                    <path d="M turbo 2.29 19.99"></path>
                  </svg>
                </div>
                <div>
                  <h3 className="font-medium text-left">What's the relationship between MCP and MCP Now?</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300 text-left mt-1">
                    MCP (Model Context Protocol) is an underlying communication protocol used to standardize interfaces for different AI model services.
                    MCP Now is a desktop management tool for this protocol that allows users to easily manage and use all AI services 
                    that support the MCP protocol through a graphical interface, without having to manually handle complex configuration processes.
                  </p>
                </div>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
                <Download className="mr-2 h-5 w-5" />
                Download Client
              </Button>
              <Button size="lg" variant="outline">
                Learn More
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

      <section id="why-mcp-now" className="py-20 bg-white/70 dark:bg-gray-900/50">
        <div className="container px-4 md:px-6">
          <motion.div
            className="text-center max-w-3xl mx-auto mb-12"
            {...fadeInUp}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Why Choose MCP Now?</h2>
            <p className="text-lg text-gray-600 dark:text-gray-300">
              Say goodbye to cumbersome multi-platform management, a one-stop solution for common pain points in AI development
            </p>
          </motion.div>

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
                          <p className="font-medium">Traditional Method</p>
                          <p className="text-sm text-gray-600 dark:text-gray-400">{point.before}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-start gap-2">
                        <CheckCircle2 className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                        <div>
                          <p className="font-medium">Using MCP Now</p>
                          <p className="text-sm text-gray-600 dark:text-gray-400">{point.after}</p>
                        </div>
                      </div>
                      
                      <div className="pt-4 border-t border-gray-100 dark:border-gray-800">
                        <p className="font-medium text-blue-600 dark:text-blue-400">{point.benefit}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          <div className="mt-16 max-w-5xl mx-auto">
            <motion.div 
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
              variants={staggerChildren}
              initial="initial"
              whileInView="whileInView"
              viewport={{ once: true }}
            >
              {keyFeatures.map((feature, idx) => (
                <motion.div
                  key={idx}
                  variants={fadeInUp}
                  className="text-center"
                >
                  <div className="mb-4 mx-auto bg-blue-50 dark:bg-blue-900/20 p-4 rounded-full w-16 h-16 flex items-center justify-center">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                  <p className="text-gray-600 dark:text-gray-300">{feature.description}</p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      <section id="servers" className="py-20 bg-white/50 dark:bg-gray-900/50">
        <div className="container px-4 md:px-6">
          <motion.div
            className="text-center max-w-3xl mx-auto mb-12"
            {...fadeInUp}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Comprehensive Coverage of Mainstream AI Services</h2>
            <p className="text-lg text-gray-600 dark:text-gray-300">
              One-stop access to all the AI services you need, without platform switching
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
          
          <div className="mt-8 text-center">
            <Button variant="outline" className="text-blue-600 hover:bg-blue-50" onClick={() => window.location.href = '/discovery'}>
              Explore More MCP Servers
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      </section>

      <section id="compatibility" className="py-20 bg-gradient-to-b from-white to-blue-50 dark:from-gray-900 dark:to-gray-950">
        <div className="container px-4 md:px-6">
          <motion.div
            className="text-center max-w-3xl mx-auto mb-12"
            {...fadeInUp}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Flexible Adaptation for Multiple Scenarios</h2>
            <p className="text-lg text-gray-600 dark:text-gray-300">
              Configure once, use in multiple places, compatible with all your favorite development tools
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
                <TabsTrigger value="development">Development Environment</TabsTrigger>
                <TabsTrigger value="hosting">Host Environment</TabsTrigger>
                <TabsTrigger value="usage">Usage Scenarios</TabsTrigger>
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
                      <h3 className="font-semibold mb-2">Development Environment</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Directly call multiple AI models within your IDE to assist with code writing, review, and optimization
                      </p>
                    </CardContent>
                  </Card>
                  
                  <Card className="border-gray-200 dark:border-gray-800">
                    <CardContent className="p-6">
                      <h3 className="font-semibold mb-2">Data Analysis</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Integrate multiple AI capabilities into data analysis workflows, automate processing and data visualization
                      </p>
                    </CardContent>
                  </Card>
                  
                  <Card className="border-gray-200 dark:border-gray-800">
                    <CardContent className="p-6">
                      <h3 className="font-semibold mb-2">Content Creation</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Seamlessly switch between AI models with different styles and functions during the content creation process
                      </p>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
            </Tabs>
          </motion.div>
          
          <motion.div 
            className="mt-12 max-w-3xl mx-auto bg-blue-50/50 dark:bg-blue-900/10 rounded-lg p-6 border border-blue-100 dark:border-blue-900/30"
            {...fadeInUp}
          >
            <div className="text-center">
              <h3 className="font-semibold mb-2">Not Just Flexible, But Hot-Swappable Too</h3>
              <p className="text-gray-600 dark:text-gray-400">Switch AI services with one click without restarting applications, responding to your business needs in real-time</p>
              <p className="text-sm text-gray-500 dark:text-gray-500 italic mt-2">* Some high-performance models may require additional warm-up time</p>
            </div>
          </motion.div>
        </div>
      </section>

      <section id="testimonials" className="py-20 bg-white dark:bg-gray-900">
        <div className="container px-4 md:px-6">
          <motion.div
            className="text-center max-w-3xl mx-auto mb-12"
            {...fadeInUp}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">User Feedback & Impact</h2>
            <p className="text-lg text-gray-600 dark:text-gray-300">
              See how developers are improving their workflow efficiency with MCP Now
            </p>
          </motion.div>

          <div className="flex justify-center mb-16">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
              {impactMetrics.map((metric, idx) => (
                <motion.div 
                  key={idx}
                  className="text-center"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1 }}
                >
                  <div className="mb-2">
                    <span className="text-3xl md:text-4xl font-bold text-blue-600 dark:text-blue-400">{metric.value}</span>
                  </div>
                  <p className="text-gray-600 dark:text-gray-400">{metric.label}</p>
                </motion.div>
              ))}
            </div>
          </div>
          
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

      <section id="download" className="py-20 bg-gradient-to-b from-blue-50 to-white dark:from-blue-950/20 dark:to-gray-900">
        <div className="container px-4 md:px-6">
          <motion.div
            className="text-center max-w-3xl mx-auto mb-12"
            {...fadeInUp}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Get Started with MCP Now</h2>
            <p className="text-lg text-gray-600 dark:text-gray-300">
              Four steps to simplify your AI development workflow
            </p>
          </motion.div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto mb-16">
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
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-4xl mx-auto">
            <motion.div
              className="flex flex-col items-center text-center"
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h3 className="text-2xl font-bold mb-4">Download Client</h3>
              <div className="space-y-4 w-full">
                <Button size="lg" className="w-full bg-blue-600 hover:bg-blue-700">
                  <Download className="mr-2 h-5 w-5" />
                  Download for Mac
                </Button>
                <Button size="lg" variant="outline" className="w-full" disabled>
                  <Download className="mr-2 h-5 w-5" />
                  Windows Version (Coming Soon)
                </Button>
              </div>
              <p className="mt-4 text-sm text-gray-500 dark:text-gray-400">
                Current Version: 1.0.0 | Free Download
              </p>
            </motion.div>
            
            <motion.div
              className="flex flex-col items-center text-center"
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h3 className="text-2xl font-bold mb-4">Join Community</h3>
              <p className="mb-6 text-gray-600 dark:text-gray-300">
                Connect with other MCP Now users, get the latest updates, share your experiences.
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
                Modern solution for simplifying AI model management and deployment
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Products</h4>
              <ul className="space-y-2 text-sm">
                <li><Link to="#what-is-mcp" className="text-gray-600 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400">What is MCP</Link></li>
                <li><Link to="#why-mcp-now" className="text-gray-600 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400">Why MCP Now</Link></li>
                <li><Link to="#download" className="text-gray-600 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400">Download</Link></li>
                <li><Link to="#" className="text-gray-600 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400">Changelog</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Resources</h4>
              <ul className="space-y-2 text-sm">
                <li><Link to="#" className="text-gray-600 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400">Documentation</Link></li>
                <li><Link to="#download" className="text-gray-600 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400">Getting Started Guide</Link></li>
                <li><Link to="#" className="text-gray-600 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400">API Reference</Link></li>
                <li><Link to="#" className="text-gray-600 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400">Examples</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">About Us</h4>
              <ul className="space-y-2 text-sm">
                <li><Link to="#" className="text-gray-600 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400">Company</Link></li>
                <li><Link to="#" className="text-gray-600 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400">Blog</Link></li>
                <li><Link to="#" className="text-gray-600 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400">Contact Us</Link></li>
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
              © 2025 MCP Now. All rights reserved.
            </p>
            <div className="flex gap-4 mt-4 sm:mt-0">
              <Link to="#" className="text-sm text-gray-500 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400">Privacy Policy</Link>
              <Link to="#" className="text-sm text-gray-500 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400">Terms of Service</Link>
              <Link to="#" className="text-sm text-gray-500 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400">Legal Information</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Introduction;
