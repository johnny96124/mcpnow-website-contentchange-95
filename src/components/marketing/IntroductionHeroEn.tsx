
import React, { useState } from "react";
import { motion } from "framer-motion";
import { ChevronRight, Download, X, Compass, MousePointer, Star, Share2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogClose
} from "@/components/ui/dialog";

const IntroductionHero = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return <section className="relative py-20 md:py-28 overflow-hidden" id="what-is-mcp">
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-1/4 -left-24 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 right-10 w-56 h-56 bg-purple-500/10 rounded-full blur-3xl"></div>
      </div>
      
      <div className="container px-4 md:px-6">
        <motion.div className="flex flex-col items-center text-center space-y-8" initial={{
        opacity: 0,
        y: 20
      }} animate={{
        opacity: 1,
        y: 0
      }} transition={{
        duration: 0.7
      }}>
          
          <div className="space-y-5">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight font-roboto leading-tight text-gray-900 dark:text-white">
              Your AI Universe - Explore, Control, Create
            </h1>
            <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-blue-600 font-roboto">
              Effortlessly discover, install, manage, 
              <br className="hidden md:inline" />
              and share your AI tools
            </h2>
          </div>
          
          <p className="text-lg md:text-xl text-gray-700 dark:text-gray-200 max-w-3xl leading-relaxed font-opensans mx-auto">
            <span className="font-semibold text-blue-600">MCP Now</span> is your command center for the AI universe. 
            Discover, install, manage, debug, and share powerful AI tools effortlessly, all from one central hub. 
            Seamlessly integrate them into your favorite applications without disruption.
            <button 
              onClick={() => setIsModalOpen(true)}
              className="ml-2 relative inline-block after:content-[''] after:absolute after:w-full after:h-0.5 after:bg-blue-600 after:bottom-0 after:left-0 focus:outline-none text-blue-600 hover:text-blue-700"
            >
              What is MCP?
            </button>
          </p>
          
          <div className="flex flex-wrap gap-8 justify-center mt-4">
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-full bg-blue-100 dark:bg-blue-900/20">
                <Compass className="h-5 w-5 text-blue-600" />
              </div>
              <div className="text-left">
                <h3 className="font-medium text-base font-roboto text-gray-900 dark:text-white">Discover & Explore</h3>
                <p className="text-sm text-gray-700 dark:text-gray-300 font-opensans mt-1">Find new and trending MCP servers</p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-full bg-green-100 dark:bg-green-900/20">
                <MousePointer className="h-5 w-5 text-green-600" />
              </div>
              <div className="text-left">
                <h3 className="font-medium text-base font-roboto text-gray-900 dark:text-white">One-Click Installation</h3>
                <p className="text-sm text-gray-700 dark:text-gray-300 font-opensans mt-1">No complex setup required</p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-full bg-purple-100 dark:bg-purple-900/20">
                <Share2 className="h-5 w-5 text-purple-600" />
              </div>
              <div className="text-left">
                <h3 className="font-medium text-base font-roboto text-gray-900 dark:text-white">Share the Power</h3>
                <p className="text-sm text-gray-700 dark:text-gray-300 font-opensans mt-1">Foster community collaboration</p>
              </div>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-5 pt-8">
            <Button size="lg" className="bg-blue-600 hover:bg-blue-700 font-roboto">
              <Download className="mr-2 h-5 w-5" />
              Download MCP Now
            </Button>
            <Button size="lg" variant="outline" className="font-roboto">
              Learn More Features
              <ChevronRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
          
          <motion.div className="w-full max-w-4xl mt-10 rounded-lg overflow-hidden shadow-lg border border-gray-200 dark:border-gray-800" initial={{
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
            <div className="text-center mt-5 mb-6 text-base text-gray-700 dark:text-gray-300 font-opensans">
              Centralized command center for all your AI tools - manage everything in one place
            </div>
          </motion.div>
        </motion.div>
      </div>

      {/* Modal Dialog */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="w-[400px] p-6 rounded-lg bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 shadow-lg" 
          onInteractOutside={(e) => {
            e.preventDefault();
          }}
          hideClose={true}
        >
          <div className="flex items-start justify-between">
            <h3 className="text-lg font-medium font-roboto">What is MCP</h3>
            <DialogClose asChild>
              <button 
                className="h-6 w-6 rounded-full flex items-center justify-center text-gray-500 hover:text-gray-900 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                aria-label="Close"
              >
                <X size={16} />
              </button>
            </DialogClose>
          </div>
          <div className="mt-4">
            <p className="text-base leading-relaxed text-gray-700 dark:text-gray-300 font-opensans [line-height:1.7]">
              MCP (Model Context Protocol) is an underlying communication protocol used to standardize interfaces for different AI model services.
            </p>
          </div>
        </DialogContent>
      </Dialog>
    </section>;
};

export default IntroductionHero;
