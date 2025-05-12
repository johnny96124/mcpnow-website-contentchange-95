
import React from "react";
import { motion } from "framer-motion";
import { Share2, Layers } from "lucide-react";

const fadeInUp = {
  initial: { opacity: 0, y: 40 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.7 }
};

const CentralHubSection = () => {
  const features = [
    {
      title: "Central Dashboard",
      description: "Manage all your MCP servers from one unified dashboard with real-time monitoring.",
      icon: Share2
    },
    {
      title: "Multi-Server Control",
      description: "Control multiple servers simultaneously with synchronized actions and configurations.",
      icon: Layers
    }
  ];

  return (
    <section className="py-20 bg-white dark:bg-gray-900/50">
      <div className="container px-4 md:px-6">
        <motion.div className="text-center mb-16" {...fadeInUp}>
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight font-montserrat mb-6">
            Centralized MCP Server Management
          </h2>
        </motion.div>

        <div className="flex flex-col items-center">
          <motion.div
            className="mb-16 relative max-w-4xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            {/* Stacked images with parallel borders */}
            <div className="relative w-full max-w-2xl mx-auto py-8">
              {/* Top image */}
              <div className="absolute z-20 bg-white dark:bg-gray-800 p-2 rounded-xl shadow-lg border-2 border-gray-200 dark:border-gray-700 w-[80%] mx-auto left-0 right-0 top-0">
                <img 
                  src="/lovable-uploads/ab829005-91a6-40c6-bcce-34cc0fc662b5.png" 
                  alt="Central Dashboard" 
                  className="w-full h-auto rounded-lg"
                />
              </div>
              
              {/* Bottom image */}
              <div className="absolute z-10 bg-white dark:bg-gray-800 p-2 rounded-xl shadow-lg border-2 border-gray-200 dark:border-gray-700 w-[80%] mx-auto left-0 right-0 top-28">
                <img 
                  src="/lovable-uploads/b9cf11be-8114-47da-94f0-3b4d1cddb3e9.png" 
                  alt="Server Control Interface" 
                  className="w-full h-auto rounded-lg"
                />
              </div>
              
              {/* Spacer to ensure container has proper height */}
              <div className="invisible h-[500px]"></div>
            </div>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 max-w-4xl mx-auto mt-24">
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

export default CentralHubSection;
