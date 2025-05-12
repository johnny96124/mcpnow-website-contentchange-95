
import React from "react";
import { motion } from "framer-motion";
import { Share2, Shield, Users } from "lucide-react";
import { useLanguage } from "../theme/language-provider";

const fadeInUp = {
  initial: { opacity: 0, y: 40 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.7 }
};

const ShareServersSection = () => {
  const { language } = useLanguage();
  
  // Content based on language
  const content = {
    en: {
      title: "Share MCP Servers with Your Team",
      features: [
        {
          title: "Team Collaboration",
          description: "Share server configurations with your team members for seamless collaboration.",
          icon: Users
        },
        {
          title: "Permission Controls",
          description: "Set granular permissions for who can view, edit, or manage specific servers.",
          icon: Shield 
        },
        {
          title: "Easy Sharing",
          description: "Generate shareable links or invite users directly to access your MCP servers.",
          icon: Share2
        }
      ]
    },
    zh: {
      title: "与团队共享 MCP 服务器",
      features: [
        {
          title: "团队协作",
          description: "与团队成员共享服务器配置，实现无缝协作。",
          icon: Users
        },
        {
          title: "权限控制",
          description: "为谁可以查看、编辑或管理特定服务器设置精细权限。",
          icon: Shield
        },
        {
          title: "轻松共享",
          description: "生成可共享链接或直接邀请用户访问您的 MCP 服务器。",
          icon: Share2
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
          {/* Left column with image */}
          <motion.div 
            className="relative order-2 md:order-1"
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <div className="relative mx-auto max-w-md">
              <div className="bg-white dark:bg-gray-800 p-3 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700">
                <img 
                  src="/lovable-uploads/b23d1c2f-49a2-46c2-9fd2-45c26c3686bb.png" 
                  alt="Team Sharing Interface" 
                  className="w-full h-auto rounded-lg"
                />
              </div>
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

export default ShareServersSection;
