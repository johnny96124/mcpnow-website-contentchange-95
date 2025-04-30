
import React from "react";
import { motion } from "framer-motion";
import { Cpu, ServerIcon, Database, CheckCircle2, XCircle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const fadeInUp = {
  initial: { opacity: 0, y: 40 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.7 }
};

const WhyMcpNow = () => {
  const painPoints = [
    {
      title: "Unified Interface Adaptation",
      before: "Multiple account switching, multi-platform logins",
      after: "Single login, unified management of all AI services",
      icon: Cpu,
      benefit: "Unified interface adaptation: Use the same code to access all AI services, say goodbye to complex multiple API calls"
    }, 
    {
      title: "Cross-Platform Compatibility",
      before: "Repeatedly configuring different environment parameters",
      after: "Unified configuration files, cross-environment reuse",
      icon: ServerIcon,
      benefit: "Cross-platform compatibility: Seamless use in any development environment, from local to cloud without reconfiguration"
    }, 
    {
      title: "Secure Management",
      before: "Scattered API Key management is insecure",
      after: "Secure encryption, centralized authorization management",
      icon: Database,
      benefit: "Secure management: Centralize all accounts and keys for higher level security protection"
    }
  ];

  return (
    <section id="why-mcp-now" className="py-20 bg-white/70 dark:bg-gray-900/50">
      <div className="container px-4 md:px-6">
        <motion.div className="text-center max-w-3xl mx-auto mb-12" {...fadeInUp}>
          <h2 className="text-3xl md:text-4xl font-extrabold mb-4 font-sans">Why Choose MCP Now?</h2>
          <p className="text-lg text-gray-600 dark:text-gray-300 leading-relaxed">
            Say goodbye to cumbersome multi-platform management, a one-stop solution for common pain points in AI development
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {painPoints.map((point, idx) => (
            <motion.div 
              key={idx} 
              initial={{ opacity: 0, y: 20 }} 
              whileInView={{ opacity: 1, y: 0 }} 
              viewport={{ once: true }} 
              transition={{ delay: idx * 0.1 }}
            >
              <Card className="h-full border-gray-200 dark:border-gray-800 overflow-hidden hover:shadow-md transition-all duration-300 hover:-translate-y-1">
                <CardContent className="p-6">
                  <div className="flex items-center gap-3 mb-5">
                    <div className="mb-0 p-3 rounded-full bg-blue-100 dark:bg-blue-900/20 w-12 h-12 flex items-center justify-center flex-shrink-0">
                      <point.icon className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                    </div>
                    <h3 className="text-xl font-bold text-blue-600 font-sans">{point.title}</h3>
                  </div>
                  
                  <div className="space-y-4 mt-6">
                    <div className="flex items-start gap-2">
                      <XCircle className="h-5 w-5 text-red-500 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="font-bold">Traditional Method</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{point.before}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-2">
                      <CheckCircle2 className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="font-bold">Using MCP Now</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{point.after}</p>
                      </div>
                    </div>
                    
                    <div className="pt-4 border-t border-gray-100 dark:border-gray-800"></div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhyMcpNow;
