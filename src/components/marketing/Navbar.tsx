
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme/theme-toggle";
import { Menu, X, Server, Download } from "lucide-react";
import { cn } from "@/lib/utils";

const Navbar: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // 检测滚动并添加背景模糊效果
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  // 快速导航链接
  const navLinks = [
    { label: "特点", href: "#features" },
    { label: "应用场景", href: "#use-cases" },
    { label: "常见问题", href: "#faq" },
    { label: "仪表盘", href: "/hosts", highlight: true }
  ];

  return (
    <header className={cn(
      "sticky top-0 z-50 w-full border-b transition-all duration-300",
      scrolled 
        ? "bg-white/95 backdrop-blur-md dark:bg-gray-950/95 shadow-sm border-transparent" 
        : "bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 dark:border-gray-800"
    )}>
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-6">
          <Link to="/" className="flex items-center gap-2 transition-transform hover:scale-105 duration-300">
            <Server className="h-6 w-6 text-blue-600" />
            <span className="text-xl font-bold tracking-tight">MCP Now</span>
          </Link>
          <nav className="hidden md:flex items-center gap-6">
            {navLinks.map((link, index) => (
              <Link 
                key={index}
                to={link.href} 
                className={cn(
                  "text-sm font-medium transition-colors relative after:content-[''] after:absolute after:w-full after:scale-x-0 after:h-0.5 after:bottom-0 after:left-0 after:bg-blue-600 after:origin-bottom-right after:transition-transform after:duration-300 hover:after:scale-x-100 hover:after:origin-bottom-left",
                  link.highlight 
                    ? "text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300" 
                    : "text-muted-foreground hover:text-foreground dark:text-gray-400 dark:hover:text-gray-200"
                )}
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
        <div className="flex items-center gap-4">
          <div className="hidden md:flex items-center gap-4">
            <Button variant="pulse" size="lg" className="bg-blue-600 hover:bg-blue-700 group" onClick={() => window.location.href = '#download'}>
              <Download className="mr-2 h-4 w-4 group-hover:animate-float" />
              下载
            </Button>
          </div>
          <ThemeToggle />
          <button
            className="md:hidden focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 rounded-md p-1"
            onClick={toggleMobileMenu}
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>
      
      {/* Mobile menu */}
      <div 
        className={cn(
          "md:hidden absolute top-16 inset-x-0 bg-white dark:bg-gray-900 border-b z-50 overflow-hidden transition-all duration-300 ease-in-out",
          mobileMenuOpen ? "max-h-[500px] opacity-100 shadow-lg" : "max-h-0 opacity-0"
        )}
      >
        <div className="container py-4 space-y-4 divide-y divide-gray-100 dark:divide-gray-800">
          {navLinks.map((link, index) => (
            <Link 
              key={index}
              to={link.href} 
              className={cn(
                "block py-3 text-base font-medium transition-colors",
                link.highlight 
                  ? "text-blue-600 dark:text-blue-400" 
                  : "text-gray-700 dark:text-gray-200"
              )}
              onClick={() => setMobileMenuOpen(false)}
            >
              {link.label}
            </Link>
          ))}
          <div className="pt-4 flex flex-col gap-4">
            <Button variant="pulse" className="w-full bg-blue-600 hover:bg-blue-700" onClick={() => window.location.href = '#download'}>
              <Download className="mr-2 h-5 w-5" />
              下载
            </Button>
          </div>
        </div>
      </div>
      
      {/* 导航辅助 - 侧边快速导航（当滚动超过一定距离时显示） */}
      <div className={cn(
        "fixed right-4 top-1/2 transform -translate-y-1/2 flex flex-col gap-3 z-40 transition-opacity duration-300",
        scrolled ? "opacity-100" : "opacity-0 pointer-events-none"
      )}>
        <div className="flex flex-col items-center gap-3 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm p-2 rounded-full shadow-lg">
          {["#what-is-mcp", "#why-mcp-now", "#servers", "#compatibility", "#testimonials", "#download"].map((section, idx) => (
            <a 
              key={idx}
              href={section}
              className="w-2.5 h-2.5 rounded-full bg-gray-300 dark:bg-gray-600 hover:bg-blue-600 dark:hover:bg-blue-500 transition-all duration-300"
              aria-label={`导航至${section.substring(1)}部分`}
            />
          ))}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
