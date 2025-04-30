
import React from "react";
import { motion } from "framer-motion";
import { useLanguage } from "@/components/theme/language-provider";
import { Card, CardContent } from "@/components/ui/card";
import { GitCommitHorizontal, FileJson, Code2, Workflow, PanelLeft, Braces, Terminal } from "lucide-react";

const fadeInUp = {
  initial: { opacity: 0, y: 40 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.7 }
};

const staggerChildren = {
  initial: { opacity: 0 },
  whileInView: { opacity: 1 },
  viewport: { once: true },
  transition: { staggerChildren: 0.2 }
};

const cardHover = {
  rest: { scale: 1, transition: { duration: 0.2 } },
  hover: { scale: 1.05, transition: { duration: 0.3 } }
};

const CompatibilitySection = () => {
  const { language } = useLanguage();
  
  // Compatible tools data
  const compatibleTools = [
    {
      icon: GitCommitHorizontal,
      name: language === "en" ? "Version Control Systems" : "版本控制系统",
      description: language === "en" ? "Integrate with Git, SVN, and more" : "与 Git、SVN 等版本控制系统集成",
    },
    {
      icon: FileJson,
      name: language === "en" ? "Configuration Files" : "配置文件",
      description: language === "en" ? "JSON, YAML, and INI formats" : "支持 JSON、YAML 和 INI 格式",
    },
    {
      icon: Code2,
      name: language === "en" ? "IDEs & Editors" : "IDE 和编辑器",
      description: language === "en" ? "VS Code, IntelliJ, Sublime Text" : "支持 VS Code、IntelliJ、Sublime Text",
    },
    {
      icon: Workflow,
      name: language === "en" ? "CI/CD Pipelines" : "CI/CD 流程",
      description: language === "en" ? "GitHub Actions, Jenkins, CircleCI" : "GitHub Actions、Jenkins、CircleCI",
    },
    {
      icon: PanelLeft,
      name: language === "en" ? "Project Management" : "项目管理工具",
      description: language === "en" ? "Jira, Asana, Trello integration" : "Jira、Asana、Trello 集成",
    },
    {
      icon: Braces,
      name: language === "en" ? "Developer Tools" : "开发者工具",
      description: language === "en" ? "Docker, Kubernetes, AWS" : "Docker、Kubernetes、AWS",
    }
  ];

  // Content based on language
  const content = {
    en: {
      title: "Seamless Integration with Your Existing Workflow",
      subtitle: "MCP Now works with your favorite tools and services out of the box",
      tryItNow: "Try It Now"
    },
    zh: {
      title: "无缝融入现有工作流程",
      subtitle: "MCP Now 开箱即用，与你喜爱的工具和服务完美协作",
      tryItNow: "立即尝试"
    }
  };

  // Use English or Chinese content based on language setting
  const { title, subtitle, tryItNow } = content[language];

  return (
    <section className="py-20 bg-gradient-to-b from-white to-blue-50 dark:from-gray-900 dark:to-gray-950">
      <div className="container px-4 md:px-6">
        <motion.div className="text-center max-w-3xl mx-auto mb-12" {...fadeInUp}>
          <h2 className="text-3xl md:text-4xl font-extrabold mb-4 font-montserrat">{title}</h2>
          <p className="text-lg text-gray-600 dark:text-gray-300 leading-relaxed font-opensans">
            {subtitle}
          </p>
        </motion.div>
        
        <motion.div 
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 max-w-5xl mx-auto" 
          variants={staggerChildren} 
          initial="initial" 
          whileInView="whileInView" 
          viewport={{ once: true }}
        >
          {compatibleTools.map((tool, idx) => (
            <motion.div 
              key={idx} 
              className="flex justify-center" 
              variants={fadeInUp} 
              whileHover="hover" 
              initial="rest" 
              animate="rest"
              viewport={{ once: true }}
            >
              <motion.div variants={cardHover} className="w-full">
                <Card className="h-full border-gray-200 dark:border-gray-800 hover:shadow-md transition-all duration-300">
                  <CardContent className="p-6 flex flex-col items-center text-center">
                    <div className="w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center mb-4">
                      <tool.icon className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                    </div>
                    <h3 className="text-lg font-bold mb-2 font-montserrat">{tool.name}</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400 font-opensans leading-relaxed">
                      {tool.description}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            </motion.div>
          ))}
        </motion.div>
        
        <div className="mt-12 text-center">
          <button className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 md:py-4 md:text-lg md:px-8 transition-colors duration-300">
            {tryItNow}
          </button>
          
          <div className="mt-4 flex flex-wrap justify-center gap-4">
            <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
              <Terminal className="h-4 w-4 mr-1" />
              <span>{language === "en" ? "CLI Support" : "命令行支持"}</span>
            </div>
            <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
              <Code2 className="h-4 w-4 mr-1" />
              <span>{language === "en" ? "API Available" : "API 可用"}</span>
            </div>
            <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
              <FileJson className="h-4 w-4 mr-1" />
              <span>{language === "en" ? "Export/Import" : "导入/导出"}</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CompatibilitySection;
