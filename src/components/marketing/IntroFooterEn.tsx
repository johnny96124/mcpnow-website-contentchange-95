
import React from "react";
import { Link } from "react-router-dom";
import { Twitter, DiscIcon } from "lucide-react";

const IntroFooter = () => {
  return (
    <footer className="py-12 bg-white dark:bg-gray-950 border-t border-gray-200 dark:border-gray-800">
      <div className="container px-4 md:px-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
          <div>
            <Link to="/" className="flex items-center gap-2 mb-4">
              <img src="/lovable-uploads/bbb3edcf-989e-42ed-a8dd-d5f07f4c632d.png" alt="MCP Now Logo" className="h-8 w-8 rounded-lg shadow" />
              <span className="text-xl font-extrabold tracking-tight font-sans">MCP Now</span>
            </Link>
            <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
              Modern solution for simplifying AI model management and deployment
            </p>
          </div>
          
          <div>
            <h4 className="font-bold mb-4 font-sans">Products</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="#what-is-mcp" className="text-gray-600 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400 nav-link">What is MCP</Link></li>
              <li><Link to="#why-mcp-now" className="text-gray-600 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400 nav-link">Why MCP Now</Link></li>
              <li><Link to="#download" className="text-gray-600 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400 nav-link">Download</Link></li>
              <li><Link to="#" className="text-gray-600 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400 nav-link">Changelog</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-bold mb-4 font-sans">Resources</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="#" className="text-gray-600 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400 nav-link">Documentation</Link></li>
              <li><Link to="#download" className="text-gray-600 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400 nav-link">Getting Started Guide</Link></li>
              <li><Link to="#" className="text-gray-600 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400 nav-link">API Reference</Link></li>
              <li><Link to="#" className="text-gray-600 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400 nav-link">Examples</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-bold mb-4 font-sans">About Us</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="#" className="text-gray-600 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400 nav-link">Company</Link></li>
              <li><Link to="#" className="text-gray-600 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400 nav-link">Blog</Link></li>
              <li><Link to="#" className="text-gray-600 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400 nav-link">Contact Us</Link></li>
              <li>
                <div className="flex gap-4 mt-2">
                  <a href="#" className="text-gray-500 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400 hover:scale-110 transition-transform duration-300">
                    <DiscIcon className="h-5 w-5" />
                  </a>
                  <a href="#" className="text-gray-500 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400 hover:scale-110 transition-transform duration-300">
                    <Twitter className="h-5 w-5" />
                  </a>
                </div>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-800 flex flex-col sm:flex-row justify-between items-center">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            © 2025 MCP Now. All rights reserved.
          </p>
          <div className="flex gap-4 mt-4 sm:mt-0">
            <Link to="#" className="text-sm text-gray-500 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400 nav-link">Privacy Policy</Link>
            <Link to="#" className="text-sm text-gray-500 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400 nav-link">Terms of Service</Link>
            <Link to="#" className="text-sm text-gray-500 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400 nav-link">Legal Information</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default IntroFooter;
