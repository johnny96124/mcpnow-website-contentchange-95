
import React from "react";
import { motion } from "framer-motion";
import { Cpu, ServerIcon, Database, CheckCircle2, XCircle, Share2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const fadeInUp = {
  initial: { opacity: 0, y: 40 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.7 }
};

const WhyMcpNow = () => {
  const painPoints = [
    {
      title: "轻松发现与安装",
      before: "手动搜索、注册多个 AI 服务",
      after: "一站式发现与一键安装各类 AI 工具",
      icon: ServerIcon,
      benefit: "探索丰富的 AI 工具生态：轻松找到并安装各种支持 MCP 协议的 AI 工具与服务"
    }, 
    {
      title: "无缝工作流集成",
      before: "切换服务打断思路与创作流程",
      after: "实时热切换，无需重启应用程序",
      icon: Cpu,
      benefit: "提升创作效率：在不中断工作流程的情况下，轻松切换或组合使用多种 AI 工具"
    }, 
    {
      title: "社区共享与协作",
      before: "复杂配置难以分享给团队成员",
      after: "一键分享您的 AI 工具与配置方案",
      icon: Share2,
      benefit: "促进团队协作：轻松与同事、朋友或社区分享您喜爱的 AI 工具组合与设置"
    }
  ];

  return (
    <section id="why-mcp-now" className="py-20 bg-white/70 dark:bg-gray-900/50">
      <div className="container px-4 md:px-6">
        <motion.div className="text-center max-w-3xl mx-auto mb-12" {...fadeInUp}>
          <h2 className="text-3xl md:text-4xl font-extrabold mb-4 font-montserrat">为什么选择 MCP Now?</h2>
          <p className="text-lg text-gray-600 dark:text-gray-300 leading-relaxed">
            您的 AI 指挥中心，让复杂变简单，释放 AI 工具的真正潜力
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
              <Card className="h-full border-gray-200 dark:border-gray-800 overflow-hidden hover:shadow-md transition-all duration-300 hover:-translate-y-1">
                <CardContent className="p-6">
                  <div className="flex items-center gap-3 mb-5">
                    <div className="mb-0 p-3 rounded-full bg-blue-100 dark:bg-blue-900/20 w-12 h-12 flex items-center justify-center flex-shrink-0">
                      <point.icon className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                    </div>
                    <h3 className="text-xl font-bold text-blue-600 font-montserrat">{point.title}</h3>
                  </div>
                  
                  <div className="space-y-4 mt-6">
                    <div className="flex items-start gap-2">
                      <XCircle className="h-5 w-5 text-red-500 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="font-bold">传统方式</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{point.before}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-2">
                      <CheckCircle2 className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="font-bold">使用 MCP Now</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{point.after}</p>
                      </div>
                    </div>
                    
                    <div className="pt-4 border-t border-gray-100 dark:border-gray-800"></div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhyMcpNow;
