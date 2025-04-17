
import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight, Laptop, Cpu, MousePointer, CloudCog, Bot, BarChart3, Zap, Lock, Globe, Network, Download } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

const features = [
  {
    icon: <Laptop className="h-10 w-10 text-primary" />,
    title: "Local Proxy Service",
    description: "MCP Now acts as a seamless local proxy service that connects your AI applications (MCP Hosts like Cursor and Claude Desktop) with various MCP servers.",
    image: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2000&q=80"
  },
  {
    icon: <Globe className="h-10 w-10 text-blue-500" />,
    title: "MCP Server Discovery",
    description: "Automatically discover available Model Context Protocol servers in your network and beyond, making it simple to find and connect to the resources you need.",
    image: "https://images.unsplash.com/photo-1518770660439-4636190af475?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2000&q=80"
  },
  {
    icon: <MousePointer className="h-10 w-10 text-blue-400" />,
    title: "One-Click Configuration",
    description: "Set up and manage your MCP configurations with just a few clicks, eliminating complex manual setup processes and configuration headaches.",
    image: "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2000&q=80"
  },
  {
    icon: <Network className="h-10 w-10 text-blue-600" />,
    title: "Central Management Hub",
    description: "Manage all your MCP servers and configurations from a single, intuitive interface that serves as your command center for MCP operations.",
    image: "https://images.unsplash.com/photo-1607252650355-f7fd0460ccdb?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2000&q=80"
  },
  {
    icon: <CloudCog className="h-10 w-10 text-blue-300" />,
    title: "Profile Management",
    description: "Create and manage different MCP configuration profiles to quickly switch between different setups based on your needs.",
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2000&q=80"
  },
  {
    icon: <Lock className="h-10 w-10 text-blue-700" />,
    title: "Secure Connections",
    description: "Establish secure and reliable connections between your AI applications and MCP servers, with built-in security features to protect your data.",
    image: "https://images.unsplash.com/photo-1563453392212-326f5e854473?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2000&q=80"
  }
];

const FeatureCard = ({ feature, index }: { feature: typeof features[0], index: number }) => {
  const [isHovered, setIsHovered] = useState(false);
  
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
    >
      <Card 
        className={cn(
          "border bg-background/60 overflow-hidden h-full",
          "hover:shadow-md hover:border-primary/20 transition-all duration-300",
          "relative",
        )}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <CardContent className="pt-6 pb-4">
          <div className="mb-4">{feature.icon}</div>
          <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
          <p className="text-muted-foreground">{feature.description}</p>
          <div className="absolute top-0 right-0 -mt-6 -mr-6 bg-gradient-to-bl from-background via-blue-50/10 to-blue-100/5 dark:via-blue-900/10 dark:to-blue-800/5 p-12 rounded-full blur-2xl opacity-30"></div>
        </CardContent>
        <div className={cn(
          "h-48 mt-2 overflow-hidden transition-all duration-500",
          isHovered ? "opacity-100" : "opacity-80"
        )}>
          <img 
            src={feature.image} 
            alt={feature.title} 
            className={cn(
              "w-full h-full object-cover transition-transform duration-700",
              isHovered ? "scale-110" : "scale-100"
            )}
          />
        </div>
      </Card>
    </motion.div>
  );
};

const FeaturesSection: React.FC = () => {
  return (
    <section id="features" className="py-24 bg-gradient-to-b from-white to-blue-50/50 dark:from-background dark:to-blue-950/10">
      <div className="container">
        <motion.div 
          className="text-center mb-16 space-y-4"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight">Powerful Features for MCP Management</h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            MCP Now provides everything you need to discover, configure, and manage Model Context Protocol servers with unparalleled ease.
          </p>
        </motion.div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <FeatureCard key={index} feature={feature} index={index} />
          ))}
        </div>
        
        <motion.div 
          className="mt-16 flex justify-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <div className="relative rounded-xl border bg-card overflow-hidden shadow-lg max-w-4xl w-full">
            <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-transparent to-primary/5 rounded-xl"></div>
            <div className="p-8 md:p-12 relative z-10">
              <div className="flex items-center justify-between flex-col md:flex-row gap-6">
                <div className="space-y-4">
                  <h3 className="text-2xl font-bold">Ready to simplify your MCP workflow?</h3>
                  <p className="text-muted-foreground">Download MCP Now and experience seamless MCP management.</p>
                </div>
                <a href="#mac-download" className="flex items-center gap-4 group">
                  <div className="bg-primary/10 p-3 rounded-full group-hover:bg-primary/20 transition-colors">
                    <Download className="h-6 w-6 text-primary" />
                  </div>
                  <span className="font-semibold">Download Now</span>
                  <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </a>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default FeaturesSection;
