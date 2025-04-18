
import React from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight, ServerIcon, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";

const CtaSection: React.FC = () => {
  return (
    <section className="py-24 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-primary/5 z-0"></div>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-primary/10 rounded-full blur-3xl opacity-30 z-0"></div>
      
      <div className="container relative z-10">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <div className="inline-flex items-center gap-2 bg-primary/10 rounded-full px-4 py-1.5">
            <Sparkles className="h-4 w-4 text-primary" />
            <span className="text-sm font-medium text-primary">Ready to transform your AI workflow?</span>
          </div>
          
          <h2 className="text-4xl md:text-5xl font-bold tracking-tighter">
            Start deploying AI models <br /> with unparalleled ease
          </h2>
          
          <p className="text-xl text-muted-foreground">
            Join thousands of developers, researchers, and enterprises who have streamlined their AI infrastructure with mcpnow.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
            <Link to="/hosts/new-user">
              <Button size="lg" className="gap-2">
                Get Started For Free
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            
            <Link to="#demo">
              <Button variant="outline" size="lg">
                Request Demo
              </Button>
            </Link>
          </div>
          
          <div className="pt-6 flex items-center justify-center text-sm">
            <ServerIcon className="h-4 w-4 mr-2 text-primary" />
            <span>No credit card required</span>
            <span className="mx-2">•</span>
            <span>Free plan available</span>
            <span className="mx-2">•</span>
            <span>Setup in minutes</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CtaSection;
