
import React from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight, Download, Cpu, Bot, Laptop } from "lucide-react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const HeroSection: React.FC = () => {
  return (
    <section className="py-20 md:py-28 overflow-hidden">
      <div className="container">
        <div className="flex flex-col lg:flex-row gap-12 lg:gap-24 items-center">
          <div className="flex-1 space-y-8">
            <div className="inline-flex items-center rounded-full border px-4 py-1.5 text-sm font-medium">
              <span className="text-primary">New</span>
              <span className="mx-2">|</span>
              <span>Introducing MCP Now v2.0</span>
            </div>
            
            <div className="space-y-4">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight">
                Simplify Your <br />
                <span className="bg-gradient-to-r from-primary to-blue-400 bg-clip-text text-transparent">MCP Management</span>
              </h1>
              <p className="text-xl text-muted-foreground max-w-[600px]">
                MCP Now is a powerful desktop application that bridges AI applications with MCP servers, serving as your central hub for server discovery, configuration and management.
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <Button size="lg" className="gap-2 group" id="mac-download" onClick={() => window.open("#mac-download", "_blank")}>
                <Download className="h-4 w-4" />
                Download for macOS
                <ArrowRight className="h-4 w-4 opacity-70 group-hover:translate-x-1 transition-all" />
              </Button>
              <button onClick={() => {
                const element = document.getElementById("features");
                if (element) {
                  const yOffset = -80;
                  const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
                  window.scrollTo({ top: y, behavior: 'smooth' });
                }
              }}>
                <Button variant="outline" size="lg">
                  Explore Features
                </Button>
              </button>
            </div>
            
            <div className="flex flex-wrap items-center gap-8 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <Laptop className="h-4 w-4 text-primary" />
                <span>Local Proxy Service</span>
              </div>
              <div className="flex items-center gap-2">
                <Cpu className="h-4 w-4 text-primary" />
                <span>Server Discovery</span>
              </div>
              <div className="flex items-center gap-2">
                <Bot className="h-4 w-4 text-primary" />
                <span>MCP Configuration</span>
              </div>
            </div>
          </div>
          
          <motion.div 
            className="flex-1 w-full"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <div className="relative rounded-xl border bg-gradient-to-br from-background via-blue-50/30 to-blue-100/30 dark:from-background dark:via-blue-900/10 dark:to-blue-800/10 p-2 shadow-lg">
              <div className="bg-background rounded-lg overflow-hidden border">
                <img 
                  src="https://images.unsplash.com/photo-1531297484001-80022131f5a1?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2920&q=80" 
                  alt="MCP Now dashboard interface showing server configuration" 
                  width={600} 
                  height={400}
                  className="w-full h-auto object-cover"
                />
              </div>
              <div className="absolute -bottom-6 -right-6 bg-gradient-to-br from-primary/40 via-primary/30 to-primary/10 p-8 rounded-full blur-3xl opacity-50"></div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
