
import React from "react";
import { motion } from "framer-motion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";

const fadeInUp = {
  initial: { opacity: 0, y: 40 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.7 }
};

const CompatibilitySection = () => {
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
    }
  ];

  return (
    <section id="compatibility" className="py-20 bg-gradient-to-b from-white to-blue-50 dark:from-gray-900 dark:to-gray-950">
      <div className="container px-4 md:px-6">
        <motion.div className="text-center max-w-3xl mx-auto mb-12" {...fadeInUp}>
          <h2 className="text-3xl md:text-4xl font-extrabold mb-4 font-montserrat">多场景灵活适配</h2>
          <p className="text-lg text-gray-600 dark:text-gray-300 leading-relaxed">
            一次配置，多处使用，适配您喜爱的所有开发工具
          </p>
        </motion.div>
        
        <motion.div 
          className="max-w-4xl mx-auto" 
          initial={{ opacity: 0 }} 
          whileInView={{ opacity: 1 }} 
          viewport={{ once: true }}
        >
          <Tabs defaultValue="development" className="w-full">
            <TabsList className="grid grid-cols-3 mb-8">
              <TabsTrigger value="development">开发环境</TabsTrigger>
              <TabsTrigger value="hosting">主机环境</TabsTrigger>
              <TabsTrigger value="usage">使用场景</TabsTrigger>
            </TabsList>
            
            <TabsContent value="development" className="p-4">
              <div className="flex flex-wrap justify-center gap-8">
                {hosts.slice(0, 4).map((host, idx) => (
                  <motion.div 
                    key={`${host.name}-${idx}`} 
                    className="flex flex-col items-center" 
                    initial={{ opacity: 0, y: 10 }} 
                    animate={{ opacity: 1, y: 0 }} 
                    transition={{ delay: idx * 0.1 }} 
                    whileHover={{ scale: 1.05, transition: { duration: 0.2 } }}
                  >
                    <div className="p-4 rounded-full bg-gray-50 dark:bg-gray-800 mb-3 shadow-sm">
                      <img src={host.icon} alt={host.name} className="w-14 h-14 object-contain" />
                    </div>
                    <span className="font-bold font-montserrat">{host.name}</span>
                  </motion.div>
                ))}
              </div>
            </TabsContent>
            
            <TabsContent value="hosting" className="p-4">
              <div className="flex flex-wrap justify-center gap-8">
                {hosts.slice(4, 6).map((host, idx) => (
                  <motion.div 
                    key={`${host.name}-${idx}`} 
                    className="flex flex-col items-center" 
                    initial={{ opacity: 0, y: 10 }} 
                    animate={{ opacity: 1, y: 0 }} 
                    transition={{ delay: idx * 0.1 }} 
                    whileHover={{ scale: 1.05, transition: { duration: 0.2 } }}
                  >
                    <div className="p-4 rounded-full bg-gray-50 dark:bg-gray-800 mb-3 shadow-sm">
                      <img src={host.icon} alt={host.name} className="w-14 h-14 object-contain" />
                    </div>
                    <span className="font-bold font-montserrat">{host.name}</span>
                  </motion.div>
                ))}
              </div>
            </TabsContent>
            
            <TabsContent value="usage" className="p-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <Card className="border-gray-200 dark:border-gray-800 hover:shadow-md transition-all duration-300 hover:-translate-y-1">
                  <CardContent className="p-6">
                    <h3 className="font-bold mb-2 font-montserrat">开发环境</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                      在 IDE 中直接调用多种 AI 模型，辅助代码编写、审查和优化
                    </p>
                  </CardContent>
                </Card>
                
                <Card className="border-gray-200 dark:border-gray-800 hover:shadow-md transition-all duration-300 hover:-translate-y-1">
                  <CardContent className="p-6">
                    <h3 className="font-bold mb-2 font-montserrat">数据分析</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                      为数据分析流程集成多种 AI 能力，自动化处理和可视化数据
                    </p>
                  </CardContent>
                </Card>
                
                <Card className="border-gray-200 dark:border-gray-800 hover:shadow-md transition-all duration-300 hover:-translate-y-1">
                  <CardContent className="p-6">
                    <h3 className="font-bold mb-2 font-montserrat">内容创作</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                      在内容创作过程中无缝切换不同风格和功能的 AI 模型
                    </p>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </motion.div>
        
        <motion.div 
          className="mt-12 max-w-3xl mx-auto bg-blue-50/50 dark:bg-blue-900/10 rounded-lg p-6 border border-blue-100 dark:border-blue-900/30" 
          {...fadeInUp}
        >
          <div className="text-center">
            <h3 className="font-bold mb-2 font-montserrat">不止于灵活，更有热插拔能力</h3>
            <p className="text-gray-600 dark:text-gray-400 leading-relaxed">无需重启应用，一键切换 AI 服务，实时响应业务需求变化</p>
            <p className="text-sm text-gray-500 dark:text-gray-500 italic mt-2">* 部分高性能模型可能需要额外预热时间</p>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default CompatibilitySection;
