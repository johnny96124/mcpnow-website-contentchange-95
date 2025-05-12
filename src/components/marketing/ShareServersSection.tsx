import React from "react";
import { motion } from "framer-motion";
import { Share2, Users, Link } from "lucide-react";

const fadeInUp = {
  initial: { opacity: 0, y: 40 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.7 }
};

const ShareServersSection = () => {
  const features = [
    {
      title: "Share Server Collections",
      description: "Create and share curated server collections with your team or community.",
      icon: Share2
    },
    {
      title: "Team Collaboration",
      description: "Collaborate with team members on server management and deployment.",
      icon: Users
    },
    {
      title: "Quick Import via Links",
      description: "Import server configurations directly from shareable links.",
      icon: Link
    }
  ];

  return (
    <section className="py-20 bg-gray-50 dark:bg-gray-900/30">
      <div className="container px-4 md:px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
          <motion.div className="space-y-6" {...fadeInUp}>
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight font-montserrat mb-6">
              Easily Share and Import Server Collections
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
                  <div className="mt-1 p-2 rounded-full bg-purple-100 dark:bg-purple-900/20 h-12 w-12 flex items-center justify-center flex-shrink-0">
                    <feature.icon className="h-6 w-6 text-purple-600 dark:text-purple-400" />
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
          
          <motion.div
            className="relative mt-10 md:mt-0"
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <div className="relative bg-white dark:bg-gray-800 p-4 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700">
              <div className="w-[40%] h-[40%] mx-auto">
                <img 
                  src="/lovable-uploads/b23d1c2f-49a2-46c2-9fd2-45c26c3686bb.png" 
                  alt="Server Sharing Interface" 
                  className="w-full h-auto rounded-lg"
                />
              </div>
              <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-purple-500/10 rounded-full blur-3xl"></div>
              <div className="absolute -top-4 -left-4 w-32 h-32 bg-blue-500/10 rounded-full blur-3xl"></div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default ShareServersSection;
