
import React from "react";
import { motion } from "framer-motion";
import { Compass, Settings, MousePointer } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const fadeInUp = {
  initial: { opacity: 0, y: 40 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.7 }
};

const ServerDiscoverySection = () => {
  const features = [
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
  ];

  return (
    <section className="py-20 bg-white dark:bg-gray-900/50">
      <div className="container px-4 md:px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
          <motion.div
            className="relative mt-10 md:mt-0 order-2 md:order-1 mx-auto md:mx-0"
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <div className="relative w-full aspect-[4/3] flex items-center justify-center">
              {/* Third card (background) */}
              <div className="absolute -bottom-2 -right-4 w-full h-[85%] bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 -rotate-6 z-10 overflow-hidden opacity-70">
                <img 
                  src="https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d" 
                  alt="MCP Server Interface Demo" 
                  className="w-full h-full object-cover opacity-50"
                />
              </div>
              
              {/* Second card (middle) */}
              <div className="absolute -bottom-1 -left-2 w-full h-[90%] bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 rotate-3 z-20 overflow-hidden opacity-80">
                <img 
                  src="/lovable-uploads/c21fd8d9-04e1-4efa-a1b9-59f4639767af.png" 
                  alt="MCP Server Interface" 
                  className="w-full h-full object-cover"
                />
              </div>
              
              {/* First card (foreground) */}
              <div className="relative w-full h-[95%] bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 z-30 overflow-hidden">
                <img 
                  src="/lovable-uploads/197ec007-5749-4981-98f3-9c1aa83eec0a.png" 
                  alt="Server Discovery Interface" 
                  className="w-full h-full object-cover rounded-lg"
                />
                <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-blue-500/10 rounded-full blur-3xl"></div>
                <div className="absolute -top-4 -left-4 w-32 h-32 bg-purple-500/10 rounded-full blur-3xl"></div>
              </div>
            </div>
          </motion.div>
          
          <motion.div className="space-y-6 order-1 md:order-2" {...fadeInUp}>
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight font-montserrat mb-6">
              The Fastest Way to Find and Run the MCP Servers You Need
            </h2>
            
            <div className="space-y-10">
              {features.map((feature, idx) => (
                <motion.div 
                  key={idx} 
                  className="flex gap-4"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.2 }}
                >
                  <div className="mt-1 p-2 rounded-full bg-blue-100 dark:bg-blue-900/20 h-12 w-12 flex items-center justify-center flex-shrink-0">
                    <feature.icon className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold mb-2 font-montserrat">{feature.title}</h3>
                    <p className="text-gray-600 dark:text-gray-300 font-opensans leading-relaxed">
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
