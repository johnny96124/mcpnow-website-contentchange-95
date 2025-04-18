
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme/theme-toggle";
import { Menu, X, Server } from "lucide-react";
import { cn } from "@/lib/utils";

const Navbar: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Add scroll effect for navbar
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const yOffset = -80; // Account for header height
      const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: 'smooth' });
      setMobileMenuOpen(false);
    }
  };

  return (
    <header className={cn(
      "sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 transition-all duration-200",
      scrolled && "shadow-md"
    )}>
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-6">
          <Link to="/" className="flex items-center gap-2">
            <Server className="h-6 w-6 text-primary" />
            <span className="text-xl font-bold tracking-tight">mcpnow</span>
          </Link>
          <nav className="hidden md:flex items-center gap-6">
            <button onClick={() => scrollToSection("features")} className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">
              Features
            </button>
            <button onClick={() => scrollToSection("use-cases")} className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">
              Use Cases
            </button>
            <button onClick={() => scrollToSection("pricing")} className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">
              Pricing
            </button>
            <button onClick={() => scrollToSection("faq")} className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">
              FAQ
            </button>
          </nav>
        </div>
        <div className="flex items-center gap-4">
          <div className="hidden md:flex items-center gap-4">
            <Link to="/hosts">
              <Button variant="outline">Dashboard</Button>
            </Link>
            <Link to="/hosts/new-user">
              <Button>Get Started</Button>
            </Link>
          </div>
          <ThemeToggle />
          <button
            className="md:hidden"
            onClick={toggleMobileMenu}
            aria-label="Toggle mobile menu"
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
          <button 
            onClick={() => scrollToSection("features")} 
            className="block w-full text-left py-2 text-base font-medium"
          >
            Features
          </button>
          <button 
            onClick={() => scrollToSection("use-cases")} 
            className="block w-full text-left py-2 text-base font-medium"
          >
            Use Cases
          </button>
          <button 
            onClick={() => scrollToSection("pricing")} 
            className="block w-full text-left py-2 text-base font-medium"
          >
            Pricing
          </button>
          <button 
            onClick={() => scrollToSection("faq")} 
            className="block w-full text-left py-2 text-base font-medium"
          >
            FAQ
          </button>
          <div className="pt-4 flex flex-col gap-4 border-t">
            <Link to="/hosts" onClick={() => setMobileMenuOpen(false)}>
              <Button variant="outline" className="w-full">Dashboard</Button>
            </Link>
            <Link to="/hosts/new-user" onClick={() => setMobileMenuOpen(false)}>
              <Button className="w-full">Get Started</Button>
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
