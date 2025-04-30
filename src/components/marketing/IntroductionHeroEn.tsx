
import React from "react";
import { motion } from "framer-motion";
import { ChevronRight, Download } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const IntroductionHero = () => {
  return (
    <section className="relative py-20 md:py-28 overflow-hidden" id="what-is-mcp">
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-1/4 -left-24 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 right-10 w-56 h-56 bg-purple-500/10 rounded-full blur-3xl"></div>
      </div>
      
      <div className="container px-4 md:px-6">
        <motion.div 
          className="flex flex-col items-center text-center space-y-6" 
          initial={{
            opacity: 0,
            y: 20
          }} 
          animate={{
            opacity: 1,
            y: 0
          }} 
          transition={{
            duration: 0.7
          }}
        >
          <div className="space-y-4">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight font-sans leading-tight">
              Say Goodbye to Complex Configurations
            </h1>
            <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-blue-600 font-sans leading-tight">
              One-Stop Unified Management of MCP Ecosystem
            </h2>
          </div>
          
          <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 max-w-3xl leading-relaxed font-normal">
            <span className="font-medium text-blue-600">MCP Now</span> acts as a bridge between AI applications and model services. 
            Our innovative aggregation technology enables you to connect to all MCP services with one click, 
            eliminating complex configurations.
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
                <h3 className="font-medium text-left">What's the relationship between MCP and MCP Now?</h3>
                <p className="text-sm text-gray-600 dark:text-gray-300 text-left mt-1 leading-relaxed">
                  MCP (Model Context Protocol) is an underlying communication protocol used to standardize interfaces for different AI model services.
                  MCP Now is a desktop management tool for this protocol that allows users to easily manage and use all AI services 
                  that support the MCP protocol through a graphical interface, without having to manually handle complex configuration processes.
                </p>
              </div>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 pt-4">
            <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
              Download Client
            </Button>
            <Button size="lg" variant="outline">
              Learn More
              <ChevronRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
          
          <motion.div 
            className="w-full max-w-4xl mt-8 rounded-lg overflow-hidden shadow-lg border border-gray-200 dark:border-gray-800" 
            initial={{
              opacity: 0,
              y: 40
            }} 
            animate={{
              opacity: 1,
              y: 0
            }} 
            transition={{
              duration: 0.7,
              delay: 0.3
            }}
          >
            <img src="/lovable-uploads/3debc8dc-96ad-462c-8379-a4b4e08a889b.png" alt="MCP Now Dashboard" className="w-full h-auto object-cover" />
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default IntroductionHero;
