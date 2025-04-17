
import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight, Server, Cpu, MousePointer, CloudCog, Bot, BarChart3, Zap, Lock, Layers, Network } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

const features = [
  {
    icon: <Server className="h-10 w-10 text-primary" />,
    title: "Powerful Host Management",
    description: "Connect and manage multiple hosts, whether they're local machines or remote servers, all from one intuitive interface.",
    image: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2000&q=80"
  },
  {
    icon: <Cpu className="h-10 w-10 text-purple-500" />,
    title: "Model Profile Configuration",
    description: "Create reusable profiles for your AI models with optimized settings, ensuring consistent performance across deployments.",
    image: "https://images.unsplash.com/photo-1518770660439-4636190af475?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2000&q=80"
  },
  {
    icon: <MousePointer className="h-10 w-10 text-blue-500" />,
    title: "One-Click Deployment",
    description: "Deploy AI models to your hosts with a single click, eliminating complex setup processes and configuration headaches.",
    image: "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2000&q=80"
  },
  {
    icon: <CloudCog className="h-10 w-10 text-teal-500" />,
    title: "Advanced Resource Allocation",
    description: "Intelligently allocate computing resources across your hosts to maximize performance and minimize costs.",
    image: "https://images.unsplash.com/photo-1607252650355-f7fd0460ccdb?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2000&q=80"
  },
  {
    icon: <BarChart3 className="h-10 w-10 text-amber-500" />,
    title: "Comprehensive Analytics",
    description: "Monitor model performance, resource utilization, and user requests with detailed analytics and visualization tools.",
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2000&q=80"
  },
  {
    icon: <Lock className="h-10 w-10 text-red-500" />,
    title: "Enterprise-Grade Security",
    description: "Keep your models and data secure with role-based access control, encryption, and comprehensive security features.",
    image: "https://images.unsplash.com/photo-1563453392212-326f5e854473?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2000&q=80"
  }
];

const FeatureCard = ({ feature, index }: { feature: typeof features[0], index: number }) => {
  const [isHovered, setIsHovered] = useState(false);
  
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
    >
      <Card 
        className={cn(
          "border bg-background/60 overflow-hidden h-full",
          "hover:shadow-md hover:border-primary/20 transition-all duration-300",
          "relative",
        )}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <CardContent className="pt-6 pb-4">
          <div className="mb-4">{feature.icon}</div>
          <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
          <p className="text-muted-foreground">{feature.description}</p>
          <div className="absolute top-0 right-0 -mt-6 -mr-6 bg-gradient-to-bl from-background via-muted/10 to-muted/5 p-12 rounded-full blur-2xl opacity-30"></div>
        </CardContent>
        <div className={cn(
          "h-48 mt-2 overflow-hidden transition-all duration-500",
          isHovered ? "opacity-100" : "opacity-80"
        )}>
          <img 
            src={feature.image} 
            alt={feature.title} 
            className={cn(
              "w-full h-full object-cover transition-transform duration-700",
              isHovered ? "scale-110" : "scale-100"
            )}
          />
        </div>
      </Card>
    </motion.div>
  );
};

const FeaturesSection: React.FC = () => {
  return (
    <section id="features" className="py-24 bg-muted/40">
      <div className="container">
        <motion.div 
          className="text-center mb-16 space-y-4"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight">Powerful Features for AI Professionals</h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            mcpnow provides everything you need to deploy, manage, and scale AI models with unparalleled ease and efficiency.
          </p>
        </motion.div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <FeatureCard key={index} feature={feature} index={index} />
          ))}
        </div>
        
        <motion.div 
          className="mt-16 flex justify-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <div className="relative rounded-xl border bg-card overflow-hidden shadow-lg max-w-4xl w-full">
            <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-transparent to-primary/5 rounded-xl"></div>
            <div className="p-8 md:p-12 relative z-10">
              <div className="flex items-center justify-between flex-col md:flex-row gap-6">
                <div className="space-y-4">
                  <h3 className="text-2xl font-bold">Ready to supercharge your AI workflows?</h3>
                  <p className="text-muted-foreground">Experience the full power of mcpnow with our interactive demo.</p>
                </div>
                <a href="#demo" className="flex items-center gap-4 group">
                  <div className="bg-primary/10 p-3 rounded-full group-hover:bg-primary/20 transition-colors">
                    <Zap className="h-6 w-6 text-primary" />
                  </div>
                  <span className="font-semibold">Try Interactive Demo</span>
                  <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </a>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default FeaturesSection;
