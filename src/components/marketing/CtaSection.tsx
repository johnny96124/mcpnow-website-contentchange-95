
import React from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight, Download, Sparkles, Cpu, Bot } from "lucide-react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const CtaSection: React.FC = () => {
  return (
    <section className="py-24 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 via-transparent to-blue-50/50 dark:from-blue-950/5 dark:via-transparent dark:to-blue-950/5 z-0"></div>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/10 rounded-full blur-3xl opacity-30 z-0"></div>
      <div className="absolute top-20 right-20 w-20 h-20 bg-blue-400/30 rounded-full blur-2xl"></div>
      <div className="absolute bottom-20 left-20 w-40 h-40 bg-blue-400/20 rounded-full blur-3xl"></div>
      
      <div className="container relative z-10">
        <div className="max-w-4xl mx-auto">
          <motion.div 
            className="text-center space-y-8"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <motion.div 
              className="inline-flex items-center gap-2 bg-primary/10 rounded-full px-4 py-1.5"
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <Sparkles className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium text-primary">Ready to simplify MCP management?</span>
            </motion.div>
            
            <motion.h2 
              className="text-4xl md:text-5xl font-bold tracking-tighter"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              Start managing your MCP <br /> configurations with ease
            </motion.h2>
            
            <motion.p 
              className="text-xl text-muted-foreground"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              Join the community of developers and AI enthusiasts who have streamlined their MCP workflow with MCP Now.
            </motion.p>
            
            <motion.div 
              className="flex flex-col sm:flex-row gap-4 justify-center pt-4"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <Button size="lg" className="gap-2 group" id="mac-download" onClick={() => window.open("#mac-download", "_blank")}>
                <Download className="h-4 w-4" />
                Download Now
                <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Button>
              
              <Link to="/hosts">
                <Button variant="outline" size="lg">
                  Open Dashboard
                </Button>
              </Link>
            </motion.div>
            
            <motion.div 
              className="pt-8 flex flex-wrap items-center justify-center gap-8 md:gap-12"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.5 }}
            >
              <div className="flex items-center gap-3">
                <div className="bg-primary/10 rounded-full p-2">
                  <Download className="h-5 w-5 text-primary" />
                </div>
                <span className="font-medium">Free download</span>
              </div>
              
              <div className="flex items-center gap-3">
                <div className="bg-primary/10 rounded-full p-2">
                  <Cpu className="h-5 w-5 text-primary" />
                </div>
                <span className="font-medium">Easy setup</span>
              </div>
              
              <div className="flex items-center gap-3">
                <div className="bg-primary/10 rounded-full p-2">
                  <Bot className="h-5 w-5 text-primary" />
                </div>
                <span className="font-medium">Works with major MCP hosts</span>
              </div>
            </motion.div>
          </motion.div>
          
          <motion.div 
            className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-4"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.6 }}
          >
            {[
              "https://images.unsplash.com/photo-1607252650355-f7fd0460ccdb?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80",
              "https://images.unsplash.com/photo-1531297484001-80022131f5a1?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80",
              "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80",
              "https://images.unsplash.com/photo-1518770660439-4636190af475?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80"
            ].map((image, index) => (
              <motion.div 
                key={index} 
                className="overflow-hidden rounded-lg shadow-md h-40 md:h-52" 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: 0.7 + index * 0.1 }}
              >
                <img 
                  src={image} 
                  alt={`MCP Now user interface ${index + 1}`}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-700" 
                />
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default CtaSection;
