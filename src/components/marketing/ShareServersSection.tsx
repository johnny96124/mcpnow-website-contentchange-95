
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

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          {/* Image Column */}
          <motion.div
            className="order-2 md:order-1"
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
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
          
          {/* Content Column */}
          <div className="space-y-10 order-1 md:order-2">
            {features.map((feature, idx) => (
              <motion.div 
                key={idx} 
                className="flex items-start"
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.2, duration: 0.7 }}
              >
                <div className="mr-4 p-3 rounded-full bg-blue-100 dark:bg-blue-900/20 h-14 w-14 flex items-center justify-center flex-shrink-0">
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
        </div>
      </div>
    </section>
  );
};

export default ShareServersSection;
