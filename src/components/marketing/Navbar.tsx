
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { LanguageToggle } from "@/components/theme/language-toggle";
import { Menu, X, Download } from "lucide-react";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/components/theme/language-provider";

const Navbar: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { language } = useLanguage();

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  // Translations
  const translations = {
    zh: {
      home: "首页",
      whatIsMcp: "什么是 MCP",
      whyMcpNow: "为什么选择 MCP Now",
      download: "下载",
      downloadClient: "下载客户端"
    },
    en: {
      home: "Home",
      whatIsMcp: "What is MCP",
      whyMcpNow: "Why MCP Now",
      download: "Download",
      downloadClient: "Download Client"
    }
  };

  const t = translations[language];

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-6">
          <Link to="/" className="flex items-center gap-2">
            <img 
              src="/lovable-uploads/bbb3edcf-989e-42ed-a8dd-d5f07f4c632d.png" 
              alt="MCP Now Logo" 
              className="h-8 w-8 rounded-lg shadow" 
            />
            <span className="text-xl font-bold tracking-tight">MCP Now</span>
          </Link>
          <nav className="hidden md:flex items-center gap-6">
            <Link to="/" className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">
              {t.home}
            </Link>
            <Link to="#what-is-mcp" className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">
              {t.whatIsMcp}
            </Link>
            <Link to="#why-mcp-now" className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">
              {t.whyMcpNow}
            </Link>
            <Link to="#download" className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">
              {t.download}
            </Link>
          </nav>
        </div>
        <div className="flex items-center gap-4">
          <div className="hidden md:flex items-center gap-4">
            <Button variant="default" className="bg-blue-600 hover:bg-blue-700" onClick={() => window.location.href = '#download'}>
              <Download className="mr-2 h-4 w-4" />
              {t.downloadClient}
            </Button>
          </div>
          <LanguageToggle />
          <button
            className="md:hidden"
            onClick={toggleMobileMenu}
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>
      
      {/* Mobile menu */}
      <div 
        className={cn(
          "md:hidden absolute top-16 inset-x-0 bg-background border-b z-50 overflow-hidden transition-all duration-300 ease-in-out",
          mobileMenuOpen ? "max-h-[500px]" : "max-h-0"
        )}
      >
        <div className="container py-4 space-y-4">
          <Link 
            to="/" 
            className="block py-2 text-base font-medium"
            onClick={() => setMobileMenuOpen(false)}
          >
            {t.home}
          </Link>
          <Link 
            to="#what-is-mcp" 
            className="block py-2 text-base font-medium"
            onClick={() => setMobileMenuOpen(false)}
          >
            {t.whatIsMcp}
          </Link>
          <Link 
            to="#why-mcp-now" 
            className="block py-2 text-base font-medium"
            onClick={() => setMobileMenuOpen(false)}
          >
            {t.whyMcpNow}
          </Link>
          <Link 
            to="#download" 
            className="block py-2 text-base font-medium"
            onClick={() => setMobileMenuOpen(false)}
          >
            {t.download}
          </Link>
          <div className="pt-4 flex flex-col gap-4 border-t">
            <Button variant="default" className="w-full bg-blue-600 hover:bg-blue-700" onClick={() => window.location.href = '#download'}>
              <Download className="mr-2 h-4 w-4" />
              {t.downloadClient}
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
