
import React from "react";
import { motion } from "framer-motion";
import { Download, ChevronRight, Twitter, DiscIcon, Compass, MousePointer, Share2, Cpu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const fadeInUp = {
  initial: { opacity: 0, y: 40 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.7 }
};

const DownloadIntroSection = () => {
  const quickStartSteps = [
    {
      title: "Discover & Install",
      description: "Download MCP Now and explore the world of AI tools in one place",
      icon: Download,
    },
    {
      title: "Connect Applications",
      description: "Easily connect your favorite apps and development tools",
      icon: Compass,
    },
    {
      title: "Manage & Configure",
      description: "Create profiles and customize your AI tool configurations",
      icon: Cpu,
    },
    {
      title: "Share & Collaborate",
      description: "Share your favorite setups with friends and colleagues",
      icon: Share2,
    },
  ];

  return (
    <section id="download" className="py-16 bg-gradient-to-b from-blue-50 to-white dark:from-blue-950/20 dark:to-gray-900">
      <div className="container px-4 md:px-6">
        <motion.div
          className="text-center max-w-3xl mx-auto mb-10"
          {...fadeInUp}
        >
          <h2 className="text-2xl md:text-3xl font-bold mb-3 font-montserrat">Unlock the MCP Ecosystem Today</h2>
          <p className="text-base text-gray-600 dark:text-gray-300 font-roboto">
            Join thousands of users who have simplified their AI workflow
          </p>
        </motion.div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 max-w-5xl mx-auto mb-12">
          {quickStartSteps.map((step, idx) => (
            <motion.div
              key={idx}
              className="relative"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
            >
              <Card className="h-full border-gray-200 dark:border-gray-800">
                <CardContent className="p-6 flex flex-col items-center text-center">
                  <div className="w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center mb-4">
                    <step.icon className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div className="absolute -top-3 -left-3 w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold">
                    {idx + 1}
                  </div>
                  <h3 className="text-lg font-semibold mb-2 font-montserrat">{step.title}</h3>
                  <p className="text-gray-600 dark:text-gray-300 font-opensans leading-relaxed">{step.description}</p>
                </CardContent>
              </Card>
              
              {idx < quickStartSteps.length - 1 && (
                <div className="hidden lg:block absolute top-1/2 -right-4 transform -translate-y-1/2">
                  <ChevronRight className="w-6 h-6 text-gray-400" />
                </div>
              )}
            </motion.div>
          ))}
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 max-w-4xl mx-auto">
          <motion.div
            className="flex flex-col items-center text-center"
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <h3 className="text-2xl font-bold mb-4 font-montserrat">Download MCP Now</h3>
            <div className="space-y-4 w-full">
              <Button size="lg" className="w-full bg-blue-600 hover:bg-blue-700 font-roboto">
                <Download className="mr-2 h-5 w-5" />
                Download for Mac
              </Button>
              <Button size="lg" variant="outline" className="w-full font-roboto" disabled>
                <Download className="mr-2 h-5 w-5" />
                Windows Version (Coming Soon)
              </Button>
            </div>
            <p className="mt-4 text-sm text-gray-500 dark:text-gray-400 font-roboto">
              Current Version: 1.0.0 | Free for Everyone
            </p>
          </motion.div>
          
          <motion.div
            className="flex flex-col items-center text-center"
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <h3 className="text-2xl font-bold mb-4 font-montserrat">Join Our Community</h3>
            <p className="mb-6 text-gray-600 dark:text-gray-300 font-opensans leading-relaxed">
              Connect with other MCP Now users, share your configurations, and stay updated with the latest features and tools.
            </p>
            <div className="flex gap-4">
              <a href="#" className="flex items-center justify-center w-12 h-12 rounded-full bg-blue-100 hover:bg-blue-200 dark:bg-blue-900/30 dark:hover:bg-blue-900/50 transition-colors">
                <DiscIcon className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </a>
              <a href="#" className="flex items-center justify-center w-12 h-12 rounded-full bg-blue-100 hover:bg-blue-200 dark:bg-blue-900/30 dark:hover:bg-blue-900/50 transition-colors">
                <Twitter className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </a>
            </div>
            <p className="mt-6 text-sm font-medium text-blue-600 font-roboto">
              Built on the open MCP standard, ensuring compatibility with future AI innovations
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default DownloadIntroSection;
