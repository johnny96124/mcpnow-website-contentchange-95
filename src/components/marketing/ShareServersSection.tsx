
import React from "react";
import { motion } from "framer-motion";
import { Share2, MessageSquare } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const fadeInUp = {
  initial: { opacity: 0, y: 40 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.7 }
};

const ShareServersSection = () => {
  const features = [
    {
      title: "Easy Sharing",
      description: "Share any MCP server or full setup as a link — no config files, no manual steps.",
      icon: Share2
    },
    {
      title: "One-Step Import",
      description: "Import shared setups instantly. All configs are preloaded and ready to run.",
      icon: MessageSquare
    }
  ];

  return (
    <section className="py-20 bg-white dark:bg-gray-900/50">
      <div className="container px-4 md:px-6">
        <motion.div className="text-center mb-16" {...fadeInUp}>
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight font-montserrat mb-6">
            Share and Launch MCP Servers in Seconds
          </h2>
        </motion.div>

        <div className="flex flex-col items-center">
          <motion.div
            className="mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <div className="relative bg-white dark:bg-gray-800 p-2 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700">
              <img 
                src="/lovable-uploads/d51c0e76-46bc-489c-ace9-0d4fad50c089.png" 
                alt="Share Profile Interface" 
                className="w-full h-auto rounded-lg"
              />
              <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-blue-500/10 rounded-full blur-3xl"></div>
              <div className="absolute -top-4 -left-4 w-32 h-32 bg-purple-500/10 rounded-full blur-3xl"></div>
            </div>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 max-w-4xl mx-auto">
            {features.map((feature, idx) => (
              <motion.div 
                key={idx} 
                className="flex flex-col items-center text-center"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.2 }}
              >
                <div className="mb-4 p-3 rounded-full bg-blue-100 dark:bg-blue-900/20 h-16 w-16 flex items-center justify-center">
                  <feature.icon className="h-8 w-8 text-blue-600 dark:text-blue-400" />
                </div>
                <h3 className="text-xl font-bold mb-3 font-montserrat">{feature.title}</h3>
                <p className="text-gray-600 dark:text-gray-300 font-opensans leading-relaxed">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ShareServersSection;
