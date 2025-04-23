
import React from "react";
import { Button } from "@/components/ui/button";
import { ArrowDown } from "lucide-react";
import McpServerLogosCarousel from "./McpServerLogosCarousel";
import { useNavigate } from "react-router-dom";

const HeroSection: React.FC = () => {
  const navigate = useNavigate();
  return (
    <section className="pt-14 pb-10 md:py-20 bg-background flex flex-col items-center">
      {/* 顶部 Logo + Badge */}
      <div className="flex flex-col items-center w-full">
        <div className="flex items-center gap-2 mb-5">
          <img
            src="/lovable-uploads/12d690f5-eccb-4d2a-bd53-89b67a5f847a.png"
            alt="mcpnow logo"
            className="h-8 w-8 rounded-lg shadow"
          />
          <span className="inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold bg-muted/80">
            <span className="text-blue-600 font-bold">New</span>
            <span className="mx-1.5 text-muted-foreground">|</span>
            <span>Introducing MCP Now</span>
          </span>
        </div>
        {/* 标题部分 */}
        <div className="text-center space-y-4 mb-6 w-full max-w-3xl">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight leading-tight">
            Simplify Your MCP<br />
            <span className="bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent">
              Configuration Management
            </span>
          </h1>
          <p className="text-base md:text-xl text-muted-foreground max-w-2xl mx-auto">
            MCP Now is your central hub for managing Model Context Protocol configurations.<br className="hidden sm:inline" /> Access 1000+ MCP servers through an intuitive desktop interface.
          </p>
        </div>
        {/* Download 按钮 */}
        <div className="flex flex-col sm:flex-row justify-center gap-4 mb-4">
          <Button
            size="lg"
            className="bg-blue-600 hover:bg-blue-700 gap-2"
            onClick={() => window.location.href = '#download'}
          >
            Download Now
            <ArrowDown className="h-4 w-4" />
          </Button>
        </div>
      </div>
      {/* MCP Server Logos + Discovery 按钮 */}
      <div className="w-full flex flex-col items-center mt-8">
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
    </section>
  );
};

export default HeroSection;
