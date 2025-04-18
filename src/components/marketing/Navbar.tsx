
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme/theme-toggle";
import { Menu, X, Server, Download } from "lucide-react";
import { cn } from "@/lib/utils";

const Navbar: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-6">
          <Link to="/" className="flex items-center gap-2">
            <Server className="h-6 w-6 text-blue-600" />
            <span className="text-xl font-bold tracking-tight">MCP Now</span>
          </Link>
          <nav className="hidden md:flex items-center gap-6">
            <Link to="#features" className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">
              Features
            </Link>
            <Link to="#use-cases" className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">
              Use Cases
            </Link>
            <Link to="#faq" className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">
              FAQ
            </Link>
          </nav>
        </div>
        <div className="flex items-center gap-4">
          <div className="hidden md:flex items-center gap-4">
            <Button variant="default" className="bg-blue-600 hover:bg-blue-700" onClick={() => window.location.href = '#download'}>
              <Download className="mr-2 h-4 w-4" />
              Download
            </Button>
          </div>
          <ThemeToggle />
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
            to="#features" 
            className="block py-2 text-base font-medium"
            onClick={() => setMobileMenuOpen(false)}
          >
            Features
          </Link>
          <Link 
            to="#use-cases" 
            className="block py-2 text-base font-medium"
            onClick={() => setMobileMenuOpen(false)}
          >
            Use Cases
          </Link>
          <Link 
            to="#faq" 
            className="block py-2 text-base font-medium"
            onClick={() => setMobileMenuOpen(false)}
          >
            FAQ
          </Link>
          <div className="pt-4 flex flex-col gap-4 border-t">
            <Button variant="default" className="w-full bg-blue-600 hover:bg-blue-700" onClick={() => window.location.href = '#download'}>
              <Download className="mr-2 h-4 w-4" />
              Download
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;

