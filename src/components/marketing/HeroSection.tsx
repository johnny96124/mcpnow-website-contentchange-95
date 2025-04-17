
import React from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight, ServerIcon, Cpu, Bot } from "lucide-react";
import { Link } from "react-router-dom";

const HeroSection: React.FC = () => {
  return (
    <section className="py-20 md:py-28 overflow-hidden">
      <div className="container">
        <div className="flex flex-col lg:flex-row gap-12 lg:gap-24 items-center">
          <div className="flex-1 space-y-8">
            <div className="inline-flex items-center rounded-full border px-4 py-1.5 text-sm font-medium">
              <span className="text-primary">New</span>
              <span className="mx-2">|</span>
              <span>Introducing mcpnow v2.0</span>
            </div>
            
            <div className="space-y-4">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight">
                Modern AI Model <br />
                <span className="bg-gradient-to-r from-primary to-purple-400 bg-clip-text text-transparent">Hosting & Management</span>
              </h1>
              <p className="text-xl text-muted-foreground max-w-[600px]">
                Deploy, manage, and scale AI models with ease. mcpnow streamlines your AI infrastructure so you can focus on innovation.
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <Link to="/hosts/new-user">
                <Button size="lg" className="gap-2">
                  Get Started Free
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <button onClick={() => {
                const element = document.getElementById("features");
                if (element) {
                  const yOffset = -80;
                  const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
                  window.scrollTo({ top: y, behavior: 'smooth' });
                }
              }}>
                <Button variant="outline" size="lg">
                  Explore Features
                </Button>
              </button>
            </div>
            
            <div className="flex items-center gap-8 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <ServerIcon className="h-4 w-4" />
                <span>Powerful Hosts</span>
              </div>
              <div className="flex items-center gap-2">
                <Cpu className="h-4 w-4" />
                <span>Model Profiles</span>
              </div>
              <div className="flex items-center gap-2">
                <Bot className="h-4 w-4" />
                <span>Instant Deployment</span>
              </div>
            </div>
          </div>
          
          <div className="flex-1 w-full">
            <div className="relative rounded-xl border bg-gradient-to-br from-background via-muted/50 to-muted p-2 shadow-lg">
              <div className="bg-background rounded-lg overflow-hidden border">
                <img 
                  src="https://images.unsplash.com/photo-1531297484001-80022131f5a1?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2920&q=80" 
                  alt="mcpnow dashboard interface showing AI model management" 
                  width={600} 
                  height={400}
                  className="w-full h-auto object-cover"
                />
              </div>
              <div className="absolute -bottom-6 -right-6 bg-gradient-to-br from-primary/40 via-primary/30 to-primary/10 p-8 rounded-full blur-3xl opacity-50"></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
