
import React, { useState } from "react";
import { motion } from "framer-motion";
import { Compass, MousePointer, Share2, CheckCircle2, XCircle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";

const fadeInUp = {
  initial: { opacity: 0, y: 40 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.7 }
};

const WhyMcpNow = () => {
  // Create state variables for editable text content
  const [sectionTitle, setSectionTitle] = useState("Why Choose MCP Now?");
  const [sectionDescription, setSectionDescription] = useState("Your AI command center, making the complex simple and unleashing the true potential of AI tools");
  
  const [painPoints, setPainPoints] = useState([
    {
      id: 1,
      title: "Effortless Discovery",
      before: "Manually searching and registering for multiple AI services",
      after: "One-stop discovery and exploration of all AI tools",
      icon: Compass,
      benefit: "Explore a world of AI capabilities through curated lists and integrated discovery features"
    }, 
    {
      id: 2,
      title: "Seamless Integration",
      before: "Disrupted workflow when switching between tools",
      after: "Instant hot-swap without restarting applications",
      icon: MousePointer,
      benefit: "Stay in your creative flow with seamless switching between AI tools directly from the system tray"
    }, 
    {
      id: 3,
      title: "Community & Sharing",
      before: "Complex configurations difficult to share with team",
      after: "One-click sharing of your favorite AI tool setups",
      icon: Share2,
      benefit: "Easily share your favorite MCP server configurations with friends, colleagues, or the community"
    }
  ]);

  // Function to update pain point text
  const updatePainPoint = (id: number, field: keyof typeof painPoints[0], value: string) => {
    setPainPoints(prev => prev.map(point => 
      point.id === id ? { ...point, [field]: value } : point
    ));
  };

  return (
    <section id="why-mcp-now" className="py-20 bg-white/70 dark:bg-gray-900/50">
      <div className="container px-4 md:px-6">
        <motion.div className="text-center max-w-3xl mx-auto mb-12" {...fadeInUp}>
          <div className="mb-4">
            <Textarea 
              value={sectionTitle}
              onChange={(e) => setSectionTitle(e.target.value)}
              className="text-3xl md:text-4xl font-extrabold text-center border-none focus-visible:ring-0 focus-visible:ring-offset-0 resize-none overflow-hidden p-0 h-auto font-montserrat bg-transparent"
              style={{ minHeight: '2.5rem' }}
            />
          </div>
          <div>
            <Textarea
              value={sectionDescription}
              onChange={(e) => setSectionDescription(e.target.value)}
              className="text-lg text-gray-600 dark:text-gray-300 leading-relaxed text-center border-none focus-visible:ring-0 focus-visible:ring-offset-0 resize-none overflow-hidden p-0 h-auto font-roboto bg-transparent"
              style={{ minHeight: '3rem' }}
            />
          </div>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {painPoints.map((point, idx) => (
            <motion.div 
              key={point.id} 
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
                    <Textarea
                      value={point.title}
                      onChange={(e) => updatePainPoint(point.id, 'title', e.target.value)}
                      className="text-xl font-bold text-blue-600 border-none focus-visible:ring-0 focus-visible:ring-offset-0 resize-none overflow-hidden p-0 h-auto font-montserrat bg-transparent"
                      style={{ minHeight: '1.5rem' }}
                    />
                  </div>
                  
                  <div className="space-y-4 mt-6">
                    <div className="flex items-start gap-2">
                      <XCircle className="h-5 w-5 text-red-500 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="font-bold font-roboto">Traditional Method</p>
                        <Textarea
                          value={point.before}
                          onChange={(e) => updatePainPoint(point.id, 'before', e.target.value)}
                          className="text-sm text-gray-600 dark:text-gray-400 border-none focus-visible:ring-0 focus-visible:ring-offset-0 resize-none overflow-hidden p-0 h-auto font-opensans leading-relaxed bg-transparent"
                          style={{ minHeight: '1.5rem' }}
                        />
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-2">
                      <CheckCircle2 className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="font-bold font-roboto">Using MCP Now</p>
                        <Textarea
                          value={point.after}
                          onChange={(e) => updatePainPoint(point.id, 'after', e.target.value)}
                          className="text-sm text-gray-600 dark:text-gray-400 border-none focus-visible:ring-0 focus-visible:ring-offset-0 resize-none overflow-hidden p-0 h-auto font-opensans leading-relaxed bg-transparent"
                          style={{ minHeight: '1.5rem' }}
                        />
                      </div>
                    </div>
                    
                    <div className="pt-4 border-t border-gray-100 dark:border-gray-800">
                      <Textarea
                        value={point.benefit}
                        onChange={(e) => updatePainPoint(point.id, 'benefit', e.target.value)}
                        className="text-sm text-blue-600 font-medium border-none focus-visible:ring-0 focus-visible:ring-offset-0 resize-none overflow-hidden p-0 h-auto font-roboto bg-transparent"
                        style={{ minHeight: '1.5rem' }}
                      />
                    </div>
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
