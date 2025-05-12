
import React from "react";
import { motion } from "framer-motion";
import { Compass, Settings, MousePointer } from "lucide-react";
import { useLanguage } from "../theme/language-provider";

const fadeInUp = {
  initial: { opacity: 0, y: 40 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.7 }
};

const ServerDiscoverySection = () => {
  const { language } = useLanguage();

  // Content based on language
  const content = {
    en: {
      title: "The Fastest Way to Find and Run the MCP Servers You Need",
      features: [
        {
          title: "Server Discovery",
          description: "Browse MCP servers from curated lists and tailored recommendations.",
          icon: Compass
        },
        {
          title: "Reusable Config",
          description: "Set up the server once, use it everywhere. One config works across all hosts.",
          icon: Settings
        },
        {
          title: "One-Click Add",
          description: "Add servers without CLI or config files. Select parameters and deploy instantly.",
          icon: MousePointer
        }
      ]
    },
    zh: {
      title: "寻找和运行 MCP 服务器的最快方式",
      features: [
        {
          title: "服务器发现",
          description: "从精选列表和定制推荐中浏览 MCP 服务器。",
          icon: Compass
        },
        {
          title: "可重用配置",
          description: "设置一次服务器，随处使用。一份配置适用于所有主机。",
          icon: Settings
        },
        {
          title: "一键添加",
          description: "无需 CLI 或配置文件添加服务器。选择参数并即时部署。",
          icon: MousePointer
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
    <section className="py-20 bg-white dark:bg-gray-900/50">
      <div className="container px-4 md:px-6 max-w-6xl mx-auto">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Left column with dialog/form image */}
          <motion.div 
            className="relative order-2 md:order-1"
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <div className="relative mx-auto max-w-md">
              <img 
                src="/lovable-uploads/874a0bbc-cdab-4c84-85e4-ea61da6f4326.png" 
                alt="Docker Assistant API Dialog" 
                className="w-full h-auto rounded-lg shadow-xl border border-gray-200 dark:border-gray-700"
              />
              <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-blue-500/10 rounded-full blur-3xl"></div>
              <div className="absolute -top-4 -left-4 w-32 h-32 bg-purple-500/10 rounded-full blur-3xl"></div>
            </div>
          </motion.div>
          
          {/* Right column with text content */}
          <motion.div className="space-y-8 order-1 md:order-2" {...fadeInUp}>
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
        </div>
      </div>
    </section>
  );
};

export default ServerDiscoverySection;
