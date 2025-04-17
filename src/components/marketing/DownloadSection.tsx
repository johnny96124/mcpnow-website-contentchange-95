
import React from "react";
import { Button } from "@/components/ui/button";
import { Download, Apple, Windows, CheckCheck } from "lucide-react";
import { motion } from "framer-motion";

const DownloadSection: React.FC = () => {
  return (
    <section id="download" className="py-24 bg-blue-50 dark:bg-blue-950/20 relative overflow-hidden">
      <div className="absolute inset-0 bg-grid-pattern opacity-30"></div>
      
      <div className="container relative z-10">
        <div className="max-w-4xl mx-auto">
          <motion.div 
            className="text-center space-y-8"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
              Download MCP Now
            </h2>
            
            <p className="text-xl text-muted-foreground max-w-[600px] mx-auto">
              Get started with MCP Now and simplify your Model Context Protocol management today.
            </p>
            
            <div className="flex flex-col md:flex-row justify-center gap-8 mt-12">
              {/* macOS Download Card */}
              <motion.div
                className="flex-1 bg-background rounded-xl border shadow-lg overflow-hidden"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.1 }}
                whileHover={{ y: -5, transition: { duration: 0.2 } }}
              >
                <div className="p-8 text-center space-y-6">
                  <div className="bg-blue-100 dark:bg-blue-900/40 rounded-full p-4 mx-auto w-16 h-16 flex items-center justify-center">
                    <Apple className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="text-2xl font-bold">macOS</h3>
                  <p className="text-muted-foreground">Universal binary for Intel and Apple Silicon Macs</p>
                  <div className="pt-4 flex justify-center">
                    <Button size="lg" id="mac-download" className="gap-2" onClick={() => window.open("#mac-download", "_blank")}>
                      <Download className="h-4 w-4" />
                      Download for macOS
                    </Button>
                  </div>
                  <div className="pt-4 flex flex-col gap-3">
                    <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                      <CheckCheck className="h-4 w-4 text-primary" />
                      <span>macOS 11.0 or later</span>
                    </div>
                    <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                      <CheckCheck className="h-4 w-4 text-primary" />
                      <span>Intel or Apple Silicon</span>
                    </div>
                  </div>
                </div>
              </motion.div>
              
              {/* Windows Download Card (Coming Soon) */}
              <motion.div
                className="flex-1 bg-background/80 rounded-xl border shadow-lg overflow-hidden"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <div className="p-8 text-center space-y-6">
                  <div className="bg-blue-100/50 dark:bg-blue-900/20 rounded-full p-4 mx-auto w-16 h-16 flex items-center justify-center">
                    <Windows className="h-8 w-8 text-muted-foreground" />
                  </div>
                  <h3 className="text-2xl font-bold text-muted-foreground">Windows</h3>
                  <p className="text-muted-foreground">Windows installer (coming soon)</p>
                  <div className="pt-4 flex justify-center">
                    <Button size="lg" variant="outline" className="gap-2" disabled>
                      <Download className="h-4 w-4" />
                      Coming Soon
                    </Button>
                  </div>
                  <div className="pt-4 flex flex-col gap-3">
                    <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                      <CheckCheck className="h-4 w-4 text-muted-foreground" />
                      <span>Windows 10 or later</span>
                    </div>
                    <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                      <CheckCheck className="h-4 w-4 text-muted-foreground" />
                      <span>64-bit systems</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
            
            <motion.p 
              className="text-sm text-muted-foreground mt-8"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              By downloading, you agree to our <a href="#terms" className="text-primary hover:underline">Terms and Conditions</a> and <a href="#privacy" className="text-primary hover:underline">Privacy Policy</a>.
            </motion.p>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default DownloadSection;
