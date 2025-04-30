
import React from "react";
import { motion } from "framer-motion";
import { ChevronRight, Download } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const IntroductionHero = () => {
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
            <img src="/lovable-uploads/3debc8dc-96ad-462c-8379-a4b4e08a889b.png" alt="MCP Now Dashboard" className="w-full h-auto object-cover" />
          </motion.div>
        </motion.div>
      </div>
    </section>;
};

export default IntroductionHero;
