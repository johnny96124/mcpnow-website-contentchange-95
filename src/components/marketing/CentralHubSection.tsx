
import React from "react";
import { motion } from "framer-motion";
import { Layout, Layers, Zap } from "lucide-react";
import { useLanguage } from "../theme/language-provider";

const fadeInUp = {
  initial: { opacity: 0, y: 40 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.7 }
};

const CentralHubSection = () => {
  const { language } = useLanguage();
  
  // Content based on language
  const content = {
    en: {
      title: "A Central Hub for All Your MCP Servers",
      features: [
        {
          title: "Single Interface",
          description: "Manage all your servers from one intuitive dashboard. No switching between tools.",
          icon: Layout
        },
        {
          title: "Real-time Monitoring",
          description: "Track server performance and status updates in real-time. Receive alerts instantly.",
          icon: Layers 
        },
        {
          title: "Fast Response Times",
          description: "Optimize for speed with minimal latency between requests and responses.",
          icon: Zap
        }
      ]
    },
    zh: {
      title: "所有 MCP 服务器的中央枢纽",
      features: [
        {
          title: "单一界面",
          description: "从一个直观的仪表板管理所有服务器。无需在工具之间切换。",
          icon: Layout
        },
        {
          title: "实时监控",
          description: "实时跟踪服务器性能和状态更新。立即接收警报。",
          icon: Layers
        },
        {
          title: "快速响应时间",
          description: "通过最小化请求和响应之间的延迟来优化速度。",
          icon: Zap
        }
      ]
    }
  };

  // Use English or Chinese content based on language setting
  const { title, features } = content[language];

  // Determine font classes based on language
  const textFont = language === "en" ? "font-roboto" : "font-noto";
  const headingFont = "font-montserrat";

  return (
    <section className="py-20 bg-gradient-to-b from-white to-blue-50 dark:from-gray-900 dark:to-gray-800/50">
      <div className="container px-4 md:px-6 max-w-6xl mx-auto">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Left column with text content */}
          <motion.div className="space-y-8" {...fadeInUp}>
            <h2 className={`text-3xl md:text-4xl font-bold tracking-tight ${headingFont} leading-tight`}>
              {title}
            </h2>
            
            <div className="space-y-10">
              {features.map((feature, idx) => (
                <motion.div 
                  key={idx} 
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.2 }}
                  className="flex items-start gap-5"
                >
                  <div className="bg-blue-100 dark:bg-blue-900/20 rounded-full p-3 flex-shrink-0">
                    <feature.icon className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <h3 className={`text-xl font-bold mb-2 ${headingFont}`}>{feature.title}</h3>
                    <p className={`text-gray-600 dark:text-gray-300 leading-relaxed ${textFont}`}>
                      {feature.description}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
          
          {/* Right column with dashboard image */}
          <motion.div 
            className="relative"
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <div className="relative mx-auto max-w-md">
              <div className="bg-white dark:bg-gray-800 p-3 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700">
                <img 
                  src="/lovable-uploads/0ad4c791-4d08-4e94-bbeb-3ac78aae67ef.png" 
                  alt="MCP Server Dashboard" 
                  className="w-full h-auto rounded-lg"
                />
              </div>
              <div className="absolute -bottom-4 -left-4 w-24 h-24 bg-blue-500/10 rounded-full blur-3xl"></div>
              <div className="absolute -top-4 -right-4 w-32 h-32 bg-purple-500/10 rounded-full blur-3xl"></div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default CentralHubSection;
