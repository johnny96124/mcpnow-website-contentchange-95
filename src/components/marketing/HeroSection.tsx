
import React from "react";
import { Button } from "@/components/ui/button";
import { Server, ArrowDown } from "lucide-react";
import McpServerLogosCarousel from "./McpServerLogosCarousel";
import { useNavigate } from "react-router-dom";

const HeroSection: React.FC = () => {
  const navigate = useNavigate();
  return (
    <section className="py-20 md:py-24 overflow-hidden bg-background">
      <div className="container flex flex-col items-center justify-center text-center">
        {/* 顶部Logo+Badge */}
        <div className="flex items-center mb-6 gap-3 justify-center">
          <img
            src="/lovable-uploads/12d690f5-eccb-4d2a-bd53-89b67a5f847a.png"
            alt="mcpnow logo"
            className="h-8 w-8 rounded-lg shadow-md"
          />
          <span className="inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold bg-muted/70">
            <span className="text-blue-600 font-bold">New</span>
            <span className="mx-1.5 text-muted-foreground">|</span>
            <span>Introducing MCP Now</span>
          </span>
        </div>

        {/* 标题区域 */}
        <div className="space-y-4 mb-7">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight leading-tight">
            Simplify Your MCP<br />
            <span className="bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent">
              Configuration Management
            </span>
          </h1>
          <p className="text-base md:text-xl text-muted-foreground max-w-2xl mx-auto">
            MCP Now is your central hub for managing Model Context Protocol configurations, bridging AI applications with MCP servers through an intuitive desktop interface.
          </p>
        </div>

        {/* 按钮 */}
        <div className="flex flex-col sm:flex-row justify-center gap-4 mb-7">
          <Button
            size="lg"
            className="bg-blue-600 hover:bg-blue-700 gap-2"
            onClick={() => window.location.href = '#download'}
          >
            Download Now
            <ArrowDown className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="lg"
            onClick={() => window.location.href = '#features'}
          >
            Learn More
          </Button>
        </div>

        {/* 特色说明 */}
        <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-muted-foreground mb-10">
          <div className="flex items-center gap-2">
            <Server className="h-4 w-4" />
            <span>Local Proxy Service</span>
          </div>
          <div className="flex items-center gap-2">
            <svg viewBox="0 0 16 16" className="h-4 w-4" fill="none">
              <path d="M2 14V8a6 6 0 1 1 12 0v6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M8 11.5v2.5m0 0l-2-2m2 2l2-2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <span>Free Download</span>
          </div>
        </div>

        {/* MCP Server logo 合集滑动+入口 */}
        <div className="w-full max-w-3xl mt-2 flex flex-col items-center">
          <McpServerLogosCarousel />
          <Button
            variant="ghost"
            size="sm"
            className="mt-3 text-blue-600 font-medium hover:bg-blue-100 hover:text-blue-700 transition"
            onClick={() => navigate('/discovery')}
          >
            Explore MCP Servers →
          </Button>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;

