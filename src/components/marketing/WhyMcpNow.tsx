
import React from "react";
import { motion } from "framer-motion";
import { Cpu, ServerIcon, Database, CheckCircle2, XCircle } from "lucide-react";
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
      title: "统一接口适配",
      before: "多账号切换，多平台登录",
      after: "一次登录，统一管理所有 AI 服务",
      icon: Cpu,
      benefit: "统一接口适配：使用同一套代码访问所有 AI 服务，告别繁琐的多 API 调用"
    }, 
    {
      title: "跨平台兼容",
      before: "反复配置不同环境参数",
      after: "统一配置文件，跨环境复用",
      icon: ServerIcon,
      benefit: "跨平台兼容：在任何开发环境中无缝使用，从本地到云端无需重新配置"
    }, 
    {
      title: "安全管理",
      before: "API Key 分散管理不安全",
      after: "安全加密，集中授权管理",
      icon: Database,
      benefit: "安全管理：集中管理所有账号和密钥，更高级别的安全保障"
    }
  ];

  return (
    <section id="why-mcp-now" className="py-20 bg-white/70 dark:bg-gray-900/50">
      <div className="container px-4 md:px-6">
        <motion.div className="text-center max-w-3xl mx-auto mb-12" {...fadeInUp}>
          <h2 className="text-3xl md:text-4xl font-extrabold mb-4 font-montserrat">为什么选择 MCP Now?</h2>
          <p className="text-lg text-gray-600 dark:text-gray-300 leading-relaxed">
            告别复杂的多平台管理，一站式解决 AI 开发中的常见痛点
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
