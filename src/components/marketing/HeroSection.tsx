
import React from "react";
import { Button } from "@/components/ui/button";
import { ArrowDown, Server, Download } from "lucide-react";

const HeroSection: React.FC = () => {
  return (
    <section className="py-20 md:py-28 overflow-hidden">
      <div className="container">
        <div className="flex flex-col lg:flex-row gap-12 lg:gap-24 items-center">
          <div className="flex-1 space-y-8">
            <div className="inline-flex items-center rounded-full border px-4 py-1.5 text-sm font-medium">
              <span className="text-blue-600">New</span>
              <span className="mx-2">|</span>
              <span>Introducing MCP Now</span>
            </div>
            
            <div className="space-y-4">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight">
                Simplify Your MCP <br />
                <span className="bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent">Configuration Management</span>
              </h1>
              <p className="text-xl text-muted-foreground max-w-[600px]">
                MCP Now is your central hub for managing Model Context Protocol configurations, bridging AI applications with MCP servers through an intuitive desktop interface.
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <Button size="lg" className="bg-blue-600 hover:bg-blue-700 gap-2" onClick={() => window.location.href = '#download'}>
                Download Now
                <ArrowDown className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="lg" onClick={() => window.location.href = '#features'}>
                Learn More
              </Button>
            </div>
            
            <div className="flex items-center gap-8 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <Server className="h-4 w-4" />
                <span>Local Proxy Service</span>
              </div>
              <div className="flex items-center gap-2">
                <Download className="h-4 w-4" />
                <span>Free Download</span>
              </div>
            </div>
          </div>
          
          <div className="flex-1 w-full">
            <div className="relative rounded-xl border bg-gradient-to-br from-background via-muted/50 to-muted p-2 shadow-lg">
              <div className="bg-background rounded-lg overflow-hidden border">
                <img 
                  src="/lovable-uploads/0ad4c791-4d08-4e94-bbeb-3ac78aae67ef.png" 
                  alt="MCP Now interface"
                  className="w-full h-auto"
                />
              </div>
              <div className="absolute -bottom-6 -right-6 bg-gradient-to-br from-blue-600/40 via-blue-600/30 to-blue-600/10 p-8 rounded-full blur-3xl opacity-50"></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
