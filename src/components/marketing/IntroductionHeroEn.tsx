
import React, { useState } from "react";
import { motion } from "framer-motion";
import { ChevronRight, Download, X, Compass, MousePointer, Star, Share2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogClose } from "@/components/ui/dialog";

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
              One App to Rule All Your MCP Setups
            </h1>
            <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-blue-600 font-roboto">
              Discover. Manage. Share.
            </h2>
          </div>
          
          <p className="text-lg md:text-xl text-gray-700 dark:text-gray-200 max-w-3xl leading-relaxed font-opensans mx-auto">
            <span className="font-semibold text-blue-600">MCP Now</span> is a desktop app that lets you discover, manage, and share MCP servers in 
            one place — simplifying configs and enabling instant switching.
            <button onClick={() => setIsModalOpen(true)} className="ml-2 relative inline-block after:content-[''] after:absolute after:w-full after:h-0.5 after:bg-blue-600 after:bottom-0 after:left-0 focus:outline-none text-blue-600 hover:text-blue-700">
              What is MCP?
            </button>
          </p>
          
          <div className="flex flex-col sm:flex-row gap-5 pt-8">
            <Button size="lg" className="bg-blue-600 hover:bg-blue-700 font-roboto flex items-center">
              <Download className="mr-2 h-5 w-5" />
              Download MCP Now
            </Button>
            <Button size="lg" variant="outline" className="font-roboto flex items-center">
              Product Manuals
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
            <img src="/lovable-uploads/1af94d9b-4348-4966-8772-8037b4c69f62.png" alt="MCP Now Dashboard" className="w-full h-auto object-cover" />
          </motion.div>
        </motion.div>
      </div>

      {/* Modal Dialog */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="w-[400px] p-6 rounded-lg bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 shadow-lg" onInteractOutside={e => {
        e.preventDefault();
      }} hideClose={true}>
          <div className="flex items-start justify-between">
            <h3 className="text-lg font-medium font-roboto">What is MCP</h3>
            <DialogClose asChild>
              <button className="h-6 w-6 rounded-full flex items-center justify-center text-gray-500 hover:text-gray-900 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors" aria-label="Close">
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
