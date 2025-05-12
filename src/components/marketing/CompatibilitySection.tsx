
import React from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { useLanguage } from "../theme/language-provider";
import { ScrollArea } from "@/components/ui/scroll-area";

const fadeInUp = {
  initial: { opacity: 0, y: 40 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.7 }
};

const CompatibilitySection = () => {
  const { language } = useLanguage();
  
  const hosts = [
    {
      name: "Cursor",
      icon: "/lovable-uploads/888ae2df-5f1b-4ce5-8d4e-6517d4432938.png"
    }, 
    {
      name: "Windurf",
      icon: "/lovable-uploads/b23d1c2f-49a2-46c2-9fd2-45c26c3686bb.png"
    }, 
    {
      name: "VSCode",
      icon: "/lovable-uploads/73160045-4ba5-4ffa-a980-50e0b33b3517.png"
    }, 
    {
      name: "JetBrains",
      icon: "/lovable-uploads/223666e0-b3d5-4b6e-9f8f-c85eea51d4ab.png"
    }, 
    {
      name: "Local Host",
      icon: "/lovable-uploads/5ebbe2a4-57d7-4db0-98c4-34fc93af0c58.png"
    }, 
    {
      name: "Cloud Host",
      icon: "/lovable-uploads/5f93fbdd-00d5-49db-862d-e4b247e975d7.png"
    },
    {
      name: "Amplitude",
      icon: "/lovable-uploads/4fecf049-ca5f-4955-a38c-4506556886d2.png"
    },
    {
      name: "Discord",
      icon: "/lovable-uploads/60892b6e-18d9-4bbc-869b-df9d6adecf7d.png"
    },
    {
      name: "1Password",
      icon: "/lovable-uploads/2edef556-b3cc-440b-90c0-af33a7a3730f.png"
    }
  ];
  
  // Content for both languages
  const content = {
    zh: {
      title: "多场景灵活适配",
      subtitle: "一次配置，多处使用，适配您喜爱的所有开发工具",
      hotswap: {
        title: "不止于灵活，更有热插拔能力",
        description: "无需重启应用，一键切换 AI 服务，实时响应业务需求变化",
        note: "* 部分高性能模型可能需要额外预热时间"
      }
    },
    en: {
      title: "Flexible Compatibility Across Platforms",
      subtitle: "Configure once, use everywhere - works with all your favorite development tools",
      hotswap: {
        title: "Beyond Flexibility: Hot-Swapping Capability",
        description: "Switch between AI services instantly without restarting applications, responding to changing business needs in real-time",
        note: "* Some high-performance models may require additional warm-up time"
      }
    }
  };
  
  // Select content based on current language
  const currentContent = content[language] || content.en;

  return (
    <section id="compatibility" className="py-20 bg-gradient-to-b from-white to-blue-50 dark:from-gray-900 dark:to-gray-950">
      <div className="container px-4 md:px-6">
        <motion.div className="text-center max-w-3xl mx-auto mb-12" {...fadeInUp}>
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-800 dark:text-white font-montserrat tracking-tight">
            {currentContent.title}
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300 leading-relaxed font-roboto max-w-2xl mx-auto">
            {currentContent.subtitle}
          </p>
        </motion.div>
        
        <motion.div 
          className="max-w-5xl mx-auto relative" 
          initial={{ opacity: 0 }} 
          whileInView={{ opacity: 1 }} 
          viewport={{ once: true }}
        >
          {/* 水平滚动区域 */}
          <div className="relative w-full overflow-hidden">
            <div className="absolute left-0 top-0 bottom-0 w-12 z-10 bg-gradient-to-r from-white to-transparent dark:from-gray-950 dark:to-transparent pointer-events-none"></div>
            
            <div className="w-full overflow-x-auto py-8 scrollbar-none">
              <div className="inline-flex gap-10 animate-scroll">
                {[...hosts, ...hosts].map((host, idx) => (
                  <motion.div 
                    key={idx} 
                    className="flex flex-col items-center mx-2"
                    initial={{ opacity: 0, y: 10 }} 
                    animate={{ opacity: 1, y: 0 }} 
                    transition={{ delay: (idx % hosts.length) * 0.1 }} 
                    whileHover={{ scale: 1.05, transition: { duration: 0.2 } }}
                  >
                    <div className="p-5 rounded-lg bg-gray-50 dark:bg-gray-800 mb-4 shadow-sm border border-gray-100 dark:border-gray-700">
                      <img src={host.icon} alt={host.name} className="w-16 h-16 object-contain" />
                    </div>
                    <span className="font-medium font-montserrat text-gray-800 dark:text-gray-100">{host.name}</span>
                  </motion.div>
                ))}
              </div>
            </div>
            
            <div className="absolute right-0 top-0 bottom-0 w-12 z-10 bg-gradient-to-l from-white to-transparent dark:from-gray-950 dark:to-transparent pointer-events-none"></div>
          </div>
        </motion.div>
        
        <motion.div 
          className="mt-12 max-w-3xl mx-auto bg-blue-50/50 dark:bg-blue-900/10 rounded-lg p-6 border border-blue-100 dark:border-blue-900/30" 
          {...fadeInUp}
        >
          <div className="text-center">
            <h3 className="font-semibold mb-3 text-xl text-gray-800 dark:text-white font-montserrat">{currentContent.hotswap.title}</h3>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed font-roboto mb-3">
              {currentContent.hotswap.description}
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400 italic mt-2 font-opensans">
              {currentContent.hotswap.note}
            </p>
          </div>
        </motion.div>
      </div>

      <style jsx>{`
        @keyframes scroll {
          0% { transform: translateX(0); }
          100% { transform: translateX(calc(-50% - 1rem)); }
        }
        .animate-scroll {
          animation: scroll 30s linear infinite;
          min-width: fit-content;
        }
        .scrollbar-none::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-none {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </section>
  );
};

export default CompatibilitySection;
