
import React from "react";
import { motion } from "framer-motion";
import { Download, ChevronRight, Twitter, DiscIcon, Cpu, Database, ServerIcon, Share2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const fadeInUp = {
  initial: { opacity: 0, y: 40 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.7 }
};

const DownloadIntroSection = () => {
  const quickStartSteps = [
    {
      title: "下载安装",
      description: "一键下载并安装 MCP Now，轻松启动您的 AI 探索之旅",
      icon: Download
    }, 
    {
      title: "发现 AI 工具",
      description: "浏览并一键安装您感兴趣的 AI 服务和工具",
      icon: ServerIcon
    }, 
    {
      title: "创建配置文件",
      description: "根据不同场景定制您的 AI 工具组合与设置",
      icon: Database
    }, 
    {
      title: "分享与协作",
      description: "与团队和社区分享您的发现和配置方案",
      icon: Share2
    }
  ];

  return (
    <section id="download" className="py-20 bg-gradient-to-b from-blue-50 to-white dark:from-blue-950/20 dark:to-gray-900">
      <div className="container px-4 md:px-6">
        <motion.div className="text-center max-w-3xl mx-auto mb-12" {...fadeInUp}>
          <h2 className="text-3xl md:text-4xl font-extrabold mb-4 font-montserrat">开始使用 MCP Now</h2>
          <p className="text-lg text-gray-600 dark:text-gray-300 leading-relaxed">
            四步上手，畅享无缝 AI 体验
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
              whileHover={{ y: -5, transition: { duration: 0.2 } }}
            >
              <Card className="h-full border-gray-200 dark:border-gray-800 hover:shadow-md transition-all duration-300">
                <CardContent className="p-6 flex flex-col items-center text-center">
                  <div className="w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center mb-4">
                    <step.icon className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div className="absolute -top-3 -left-3 w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold">
                    {idx + 1}
                  </div>
                  <h3 className="text-lg font-bold mb-2 font-montserrat">{step.title}</h3>
                  <p className="text-gray-600 dark:text-gray-300 leading-relaxed">{step.description}</p>
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
            <h3 className="text-2xl font-extrabold mb-4 font-montserrat">立即体验 MCP Now</h3>
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
            <h3 className="text-2xl font-extrabold mb-4 font-montserrat">加入 MCP Now 社区</h3>
            <p className="mb-6 text-gray-600 dark:text-gray-300 leading-relaxed">
              与全球 AI 爱好者交流心得，分享您的配置，共同探索 AI 的无限可能。
            </p>
            <div className="flex gap-4">
              <a href="#" className="flex items-center justify-center w-12 h-12 rounded-full bg-blue-100 hover:bg-blue-200 dark:bg-blue-900/30 dark:hover:bg-blue-900/50 transition-colors hover:scale-110 duration-300">
                <DiscIcon className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </a>
              <a href="#" className="flex items-center justify-center w-12 h-12 rounded-full bg-blue-100 hover:bg-blue-200 dark:bg-blue-900/30 dark:hover:bg-blue-900/50 transition-colors hover:scale-110 duration-300">
                <Twitter className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </a>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default DownloadIntroSection;
