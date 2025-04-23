
import React from "react";
import { Link } from "react-router-dom";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
} from "@/components/ui/carousel";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Download,
  ArrowRight,
  Server,
  Cpu,
  MousePointer,
  CloudCog,
  BarChart3,
  Lock,
  Zap,
  Sparkles,
  Monitor,
  Apple,
} from "lucide-react";

const Introduction2: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white dark:from-blue-950/30 dark:to-background overflow-x-hidden">
      {/* Hero Section with Animated Elements */}
      <header className="relative pt-24 pb-32 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl" />
          <div className="absolute top-60 -left-40 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl" />
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          <motion.div 
            className="max-w-4xl mx-auto text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="inline-flex items-center gap-2 bg-white dark:bg-white/10 rounded-full px-4 py-1.5 mb-6 shadow-sm"
            >
              <Sparkles className="h-4 w-4 text-blue-500" />
              <span className="text-sm font-medium text-blue-700 dark:text-blue-300">
                Introducing the future of AI model deployment
              </span>
            </motion.div>
            
            <motion.h1 
              className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600 mb-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.8 }}
            >
              Deploy AI Models with Unmatched Simplicity
            </motion.h1>
            
            <motion.p 
              className="text-xl text-muted-foreground mb-8"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6, duration: 0.8 }}
            >
              mcpnow streamlines your AI infrastructure with one-click deployments, intelligent 
              resource management, and seamless multi-host coordination.
            </motion.p>
            
            <motion.div 
              className="flex flex-col sm:flex-row gap-4 justify-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, duration: 0.5 }}
            >
              <Link to="/hosts/new-user">
                <Button size="lg" className="gap-2 bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-500/20 hover:shadow-blue-500/30 transition-all">
                  Get Started For Free
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              
              <Link to="#demo">
                <Button variant="outline" size="lg" className="bg-white/80 dark:bg-background/80 backdrop-blur-sm">
                  Watch Demo
                </Button>
              </Link>
            </motion.div>
          </motion.div>
          
          {/* Animated Dashboard Preview */}
          <motion.div 
            className="mt-16 relative"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1, duration: 0.8 }}
          >
            <div className="relative mx-auto max-w-5xl">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl blur-xl opacity-30 animate-pulse" />
              <div className="relative rounded-xl border border-white/20 shadow-2xl overflow-hidden bg-white dark:bg-black/40 backdrop-blur-xl">
                <img 
                  src="/placeholder.svg" 
                  alt="mcpnow dashboard" 
                  className="w-full h-[400px] object-cover" 
                />
                {/* Animated overlay elements */}
                <div className="absolute top-3 left-3 bg-blue-500/90 text-white text-xs px-2 py-1 rounded-full flex items-center gap-1">
                  <span className="animate-pulse w-2 h-2 bg-white rounded-full"></span>
                  Live Models: 12
                </div>
                <div className="absolute bottom-3 right-3 bg-green-500/90 text-white text-xs px-2 py-1 rounded-full flex items-center gap-1">
                  <span className="animate-pulse w-2 h-2 bg-white rounded-full"></span>
                  All Systems Operational
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </header>

      {/* Animated Features Section */}
      <section className="py-24 bg-white dark:bg-transparent">
        <div className="container mx-auto px-4">
          <motion.div 
            className="text-center mb-16 space-y-4"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-gray-900 dark:text-gray-100">
              Powerful Features for AI Professionals
            </h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              mcpnow provides everything you need to deploy, manage, and scale AI models with unparalleled ease and efficiency.
            </p>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: <Server className="h-10 w-10 text-blue-500" />,
                title: "Powerful Host Management",
                description: "Connect and manage multiple hosts from one intuitive interface, whether they're local machines or remote servers."
              },
              {
                icon: <Cpu className="h-10 w-10 text-purple-500" />,
                title: "Model Profile Configuration",
                description: "Create reusable profiles for your AI models with optimized settings for consistent performance across deployments."
              },
              {
                icon: <MousePointer className="h-10 w-10 text-blue-500" />,
                title: "One-Click Deployment",
                description: "Deploy AI models to your hosts with a single click, eliminating complex setup processes and configuration headaches."
              },
              {
                icon: <CloudCog className="h-10 w-10 text-teal-500" />,
                title: "Advanced Resource Allocation",
                description: "Intelligently allocate computing resources across your hosts to maximize performance and minimize costs."
              },
              {
                icon: <BarChart3 className="h-10 w-10 text-amber-500" />,
                title: "Comprehensive Analytics",
                description: "Monitor model performance, resource utilization, and user requests with detailed analytics and visualization tools."
              },
              {
                icon: <Lock className="h-10 w-10 text-red-500" />,
                title: "Enterprise-Grade Security",
                description: "Keep your models and data secure with role-based access control, encryption, and comprehensive security features."
              }
            ].map((feature, index) => (
              <motion.div 
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card className="overflow-hidden h-full border-0 bg-gradient-to-br from-gray-50 to-white dark:from-gray-900/40 dark:to-gray-900/60 shadow-xl hover:shadow-2xl transition-all duration-300">
                  <CardContent className="p-6 relative">
                    <div className="absolute -top-6 -right-6 w-12 h-12 rounded-full bg-gradient-to-br from-blue-500/20 to-purple-500/20 blur-xl" />
                    
                    <motion.div 
                      className="mb-4 p-3 w-16 h-16 flex items-center justify-center rounded-xl bg-gradient-to-br from-blue-500/10 to-purple-500/10"
                      whileHover={{ scale: 1.05, rotate: 5 }}
                      transition={{ type: "spring", stiffness: 400, damping: 10 }}
                    >
                      {feature.icon}
                    </motion.div>
                    
                    <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                    <p className="text-muted-foreground">{feature.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section with Carousel */}
      <section className="py-24 bg-gradient-to-b from-blue-50 to-white dark:from-blue-950/20 dark:to-background">
        <div className="container mx-auto px-4">
          <motion.div 
            className="text-center mb-16 space-y-4"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
              Loved by AI Teams Everywhere
            </h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              See what our users have to say about how mcpnow has transformed their AI workflows.
            </p>
          </motion.div>
          
          <Carousel className="max-w-5xl mx-auto" opts={{ loop: true }}>
            <CarouselContent>
              {[1, 2, 3, 4, 5].map((_, index) => (
                <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/2">
                  <div className="p-2">
                    <Card className="border-0 shadow-xl bg-white/80 dark:bg-gray-900/60 backdrop-blur-sm">
                      <CardContent className="p-6">
                        <div className="mb-4 flex">
                          {Array(5).fill(0).map((_, i) => (
                            <Sparkles key={i} className="h-5 w-5 text-yellow-500" />
                          ))}
                        </div>
                        <p className="italic mb-6">
                          "mcpnow has completely transformed how we deploy our AI models. What used to take hours now takes minutes, allowing our team to focus on building better models instead of fighting with infrastructure."
                        </p>
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
                            <span className="text-blue-700 dark:text-blue-300 font-bold">
                              {String.fromCharCode(65 + index)}
                            </span>
                          </div>
                          <div>
                            <p className="font-semibold">Sarah Chen</p>
                            <p className="text-sm text-muted-foreground">AI Research Lead, TechCorp</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <div className="mt-8 flex justify-center gap-2">
              <CarouselPrevious className="static" />
              <CarouselNext className="static" />
            </div>
          </Carousel>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-24 bg-white dark:bg-transparent">
        <div className="container mx-auto px-4">
          <motion.div 
            className="text-center mb-16 space-y-4"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
              How mcpnow Works
            </h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              A simple three-step process to revolutionize your AI deployment workflow.
            </p>
          </motion.div>
          
          <div className="max-w-5xl mx-auto">
            <div className="relative">
              {/* Connection line */}
              <div className="absolute left-1/2 top-12 h-[calc(100%-4rem)] w-0.5 bg-gradient-to-b from-blue-500 to-purple-500 -translate-x-1/2 hidden md:block"></div>
              
              {[
                {
                  title: "Connect Your Hosts",
                  description: "Link your local and remote servers to mcpnow with our simple setup process that takes less than 2 minutes.",
                  icon: <Server className="h-10 w-10 text-white" />
                },
                {
                  title: "Create Model Profiles",
                  description: "Configure your AI models once and reuse those profiles across multiple hosts for consistent deployment.",
                  icon: <Cpu className="h-10 w-10 text-white" />
                },
                {
                  title: "Deploy with One Click",
                  description: "Select your model profile, choose a host, and click deploy. mcpnow handles everything else automatically.",
                  icon: <Zap className="h-10 w-10 text-white" />
                }
              ].map((step, index) => (
                <motion.div 
                  key={index}
                  className="flex flex-col md:flex-row items-center gap-8 mb-16"
                  initial={{ opacity: 0, x: index % 2 ? 20 : -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.2 }}
                >
                  <div className={`flex-1 order-2 ${index % 2 ? "md:order-1" : "md:order-2"}`}>
                    <Card className="border-0 shadow-xl h-full bg-gradient-to-br from-gray-50 to-white dark:from-gray-900/40 dark:to-gray-900/60">
                      <CardContent className="p-6">
                        <h3 className="text-2xl font-bold mb-3">{step.title}</h3>
                        <p className="text-muted-foreground">{step.description}</p>
                      </CardContent>
                    </Card>
                  </div>
                  
                  <div className={`z-10 order-1 ${index % 2 ? "md:order-2" : "md:order-1"}`}>
                    <motion.div 
                      className="w-16 h-16 rounded-full flex items-center justify-center bg-gradient-to-r from-blue-500 to-purple-600 shadow-lg"
                      whileHover={{ scale: 1.1 }}
                      transition={{ type: "spring", stiffness: 400, damping: 10 }}
                    >
                      {step.icon}
                    </motion.div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Download Section */}
      <section className="py-24 bg-gradient-to-b from-blue-50 to-white dark:from-blue-950/20 dark:to-background">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <motion.div 
              className="relative rounded-2xl overflow-hidden shadow-2xl"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600/90 to-purple-600/90" />
              <div className="absolute inset-0 bg-[url('/placeholder.svg')] opacity-10 mix-blend-overlay" />
              
              <div className="relative p-8 md:p-12 text-white">
                <div className="max-w-xl">
                  <h2 className="text-3xl md:text-4xl font-bold mb-4">
                    Download MCP Now
                  </h2>
                  <p className="text-white/80 text-lg mb-8">
                    Get started with MCP Now - your central hub for MCP server discovery, configuration, and management.
                  </p>
                  
                  <div className="flex flex-col sm:flex-row gap-4">
                    <Button size="lg" className="bg-white hover:bg-gray-100 text-blue-700">
                      <Apple className="mr-2 h-5 w-5" />
                      Download for macOS
                    </Button>
                    <Button size="lg" variant="outline" className="text-white border-white hover:bg-white/20" disabled>
                      <Monitor className="mr-2 h-5 w-5" />
                      Windows Coming Soon
                    </Button>
                  </div>
                  
                  <div className="mt-6 text-sm text-white/70">
                    Version 1.0.0 | Free Download
                  </div>
                </div>
                
                {/* Animated elements */}
                <div className="absolute -bottom-12 -right-12 w-40 h-40 bg-blue-500/30 rounded-full blur-3xl" />
                <div className="absolute top-6 right-6 flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-full px-3 py-1.5">
                  <span className="animate-pulse w-2 h-2 bg-green-400 rounded-full"></span>
                  <span className="text-sm">5,000+ Downloads</span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24">
        <div className="container mx-auto px-4">
          <motion.div 
            className="max-w-5xl mx-auto text-center space-y-8"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <motion.h2 
              className="text-4xl md:text-5xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              Ready to transform your AI workflow?
            </motion.h2>
            
            <motion.p 
              className="text-xl text-muted-foreground"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              Join thousands of developers, researchers, and enterprises who have streamlined their AI infrastructure with mcpnow.
            </motion.p>
            
            <motion.div 
              className="pt-4"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <Link to="/hosts/new-user">
                <Button 
                  size="lg" 
                  className="gap-2 bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-500/20 hover:shadow-blue-500/30 transition-all"
                >
                  Get Started For Free
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 bg-gray-50 dark:bg-gray-900/50">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-6 md:mb-0">
              <h3 className="font-bold text-xl">mcpnow</h3>
              <p className="text-muted-foreground">The future of AI model deployment</p>
            </div>
            
            <div className="flex gap-8">
              <Link to="#" className="text-muted-foreground hover:text-foreground transition-colors">About</Link>
              <Link to="#" className="text-muted-foreground hover:text-foreground transition-colors">Documentation</Link>
              <Link to="#" className="text-muted-foreground hover:text-foreground transition-colors">Blog</Link>
              <Link to="#" className="text-muted-foreground hover:text-foreground transition-colors">Contact</Link>
            </div>
          </div>
          
          <div className="border-t border-gray-200 dark:border-gray-800 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-sm text-muted-foreground">© 2025 mcpnow. All rights reserved.</p>
            
            <div className="flex gap-4 mt-4 md:mt-0">
              <Link to="#" className="text-muted-foreground hover:text-foreground transition-colors">
                Privacy Policy
              </Link>
              <Link to="#" className="text-muted-foreground hover:text-foreground transition-colors">
                Terms of Service
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Introduction2;
