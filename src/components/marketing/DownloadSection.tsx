
import React from "react";
import { Button } from "@/components/ui/button";
import { Download, Apple, Monitor } from "lucide-react";

const DownloadSection: React.FC = () => {
  return (
    <section id="download" className="py-24 bg-gradient-to-b from-blue-50 to-transparent dark:from-blue-950/20">
      <div className="container">
        <div className="max-w-3xl mx-auto text-center space-y-8">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
            Download MCP Now
          </h2>
          <p className="text-lg text-muted-foreground">
            Get started with MCP Now - your central hub for MCP server discovery, configuration, and management.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-6 justify-center pt-8">
            <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
              <Apple className="mr-2 h-5 w-5" />
              Download for macOS
            </Button>
            <Button size="lg" variant="outline" disabled>
              <Monitor className="mr-2 h-5 w-5" />
              Windows Coming Soon
            </Button>
          </div>
          
          <div className="pt-6 text-sm text-muted-foreground">
            Version 1.0.0 | Free Download
          </div>
        </div>
      </div>
    </section>
  );
};

export default DownloadSection;
