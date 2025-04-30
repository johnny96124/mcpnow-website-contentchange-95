
import React, { useState } from "react";
import { motion } from "framer-motion";
import { ChevronRight, Download, X } from "lucide-react";
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
        <motion.div className="flex flex-col items-center text-center space-y-6" initial={{
        opacity: 0,
        y: 20
      }} animate={{
        opacity: 1,
        y: 0
      }} transition={{
        duration: 0.7
      }}>
          
          
          
          <div className="space-y-4">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight font-montserrat">
              告别繁琐配置
            </h1>
            <h2 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-blue-600 font-montserrat">
              一站式统一管理 MCP 生态
            </h2>
          </div>
          
          <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 max-w-3xl leading-relaxed">
            <span className="font-semibold text-blue-600">MCP Now</span> 是连接AI应用与模型服务的桥梁，通过创新的聚合模式让您轻松调用多服务能力，
            无需编辑配置文件，一键接入所有MCP服务。
            <button 
              onClick={() => setIsModalOpen(true)}
              className="ml-2 relative inline-block after:content-[''] after:absolute after:w-full after:h-0.5 after:bg-blue-600 after:bottom-0 after:left-0 focus:outline-none text-blue-600 hover:text-blue-700"
            >
              MCP是什么
            </button>
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 pt-4">
            <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
              <Download className="mr-2 h-5 w-5" />
              立即下载体验
            </Button>
            <Button size="lg" variant="outline">
              了解更多功能
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
            <figure className="w-full">
              <img src="/lovable-uploads/4f683003-c59d-41a3-a5c3-c4effc018d81.png" alt="MCP Now 简化集成示意图" className="w-full h-auto object-cover" />
              <figcaption className="py-3 text-center text-sm text-gray-600 dark:text-gray-300 bg-gray-50 dark:bg-gray-800">
                MCP Now 让复杂的服务连接变得简单直观，一站式管理所有AI模型服务
              </figcaption>
            </figure>
          </motion.div>
        </motion.div>
      </div>

      {/* Modal Dialog */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="w-[400px] p-5 rounded-lg bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 shadow-lg" 
          onInteractOutside={(e) => {
            e.preventDefault();
          }}
          hideClose={true}
        >
          <div className="flex items-start justify-between">
            <h3 className="text-lg font-semibold">MCP是什么</h3>
            <DialogClose asChild>
              <button 
                className="h-6 w-6 rounded-full flex items-center justify-center text-gray-500 hover:text-gray-900 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                aria-label="Close"
              >
                <X size={16} />
              </button>
            </DialogClose>
          </div>
          <div className="mt-3">
            <p className="text-base leading-relaxed [line-height:1.6]">
              MCP (Model Context Protocol) 是一种底层通信协议，用于统一不同AI模型服务的接口标准。
            </p>
          </div>
        </DialogContent>
      </Dialog>
    </section>;
};

export default IntroductionHero;
