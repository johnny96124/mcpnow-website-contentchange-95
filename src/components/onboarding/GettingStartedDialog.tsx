
import React from "react";
import { Link } from "react-router-dom";
import { ChevronRight, Download, Settings2, Layers, Computer, X } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface GettingStartedDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function GettingStartedDialog({ open, onOpenChange }: GettingStartedDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl p-0 overflow-hidden">
        <DialogHeader className="bg-blue-50 dark:bg-blue-950/30 p-6 pb-3">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <DialogTitle className="text-2xl font-bold">Welcome to MCP Now</DialogTitle>
              <p className="text-muted-foreground">Complete these steps to get started</p>
            </div>
            <DialogClose className="rounded-full h-8 w-8 flex items-center justify-center hover:bg-blue-200/40">
              <X className="h-4 w-4" />
              <span className="sr-only">Close</span>
            </DialogClose>
          </div>
        </DialogHeader>
        
        <div className="p-6 space-y-6">
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1 p-5 border rounded-lg hover:border-blue-200 hover:bg-blue-50/50 dark:hover:bg-blue-950/20 dark:hover:border-blue-900 transition-all duration-200">
                <div className="flex items-center gap-3 mb-3">
                  <div className="bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400 rounded-full p-2.5">
                    <Download className="h-5 w-5" />
                  </div>
                  <h3 className="text-lg font-semibold">Step 1: Install Servers</h3>
                </div>
                <p className="text-sm text-muted-foreground mb-4">
                  Browse and install server definitions from the Discovery page to start building your workflow.
                </p>
                <Button asChild size="sm" variant="outline" className="gap-1.5 mt-2">
                  <Link to="/discovery">
                    Go to Discovery
                    <ChevronRight className="h-3 w-3" />
                  </Link>
                </Button>
              </div>
              
              <div className="flex-1 p-5 border rounded-lg hover:border-blue-200 hover:bg-blue-50/50 dark:hover:bg-blue-950/20 dark:hover:border-blue-900 transition-all duration-200">
                <div className="flex items-center gap-3 mb-3">
                  <div className="bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400 rounded-full p-2.5">
                    <Settings2 className="h-5 w-5" />
                  </div>
                  <h3 className="text-lg font-semibold">Step 2: Create Instances</h3>
                </div>
                <p className="text-sm text-muted-foreground mb-4">
                  Create and configure server instances with custom parameters to match your requirements.
                </p>
                <Button asChild size="sm" variant="outline" className="gap-1.5 mt-2">
                  <Link to="/servers">
                    Manage Servers
                    <ChevronRight className="h-3 w-3" />
                  </Link>
                </Button>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1 p-5 border rounded-lg hover:border-blue-200 hover:bg-blue-50/50 dark:hover:bg-blue-950/20 dark:hover:border-blue-900 transition-all duration-200">
                <div className="flex items-center gap-3 mb-3">
                  <div className="bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400 rounded-full p-2.5">
                    <Layers className="h-5 w-5" />
                  </div>
                  <h3 className="text-lg font-semibold">Step 3: Create Profiles</h3>
                </div>
                <p className="text-sm text-muted-foreground mb-4">
                  Organize your server instances into profiles for easier management and deployment.
                </p>
                <Button asChild size="sm" variant="outline" className="gap-1.5 mt-2">
                  <Link to="/profiles">
                    Create Profiles
                    <ChevronRight className="h-3 w-3" />
                  </Link>
                </Button>
              </div>
              
              <div className="flex-1 p-5 border rounded-lg hover:border-blue-200 hover:bg-blue-50/50 dark:hover:bg-blue-950/20 dark:hover:border-blue-900 transition-all duration-200">
                <div className="flex items-center gap-3 mb-3">
                  <div className="bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400 rounded-full p-2.5">
                    <Computer className="h-5 w-5" />
                  </div>
                  <h3 className="text-lg font-semibold">Step 4: Connect Hosts</h3>
                </div>
                <p className="text-sm text-muted-foreground mb-4">
                  Associate your profiles with hosts to deploy and manage your server instances.
                </p>
                <Button asChild size="sm" variant="outline" className="gap-1.5 mt-2">
                  <Link to="/hosts">
                    Manage Hosts
                    <ChevronRight className="h-3 w-3" />
                  </Link>
                </Button>
              </div>
            </div>
          </div>
          
          <div className="flex justify-center pt-2">
            <Button asChild size="lg" className="px-8 gap-2">
              <Link to="/discovery">
                Start Setup Process
                <ChevronRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
