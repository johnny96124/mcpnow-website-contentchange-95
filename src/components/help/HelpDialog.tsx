
import { useState } from "react";
import { Book, ExternalLink, Github, HelpCircle, MessageSquare, Twitter } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger
} from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";

interface HelpDialogProps {
  trigger?: React.ReactNode;
}

export function HelpDialog({ trigger }: HelpDialogProps) {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant="ghost" size="icon" className="rounded-full">
            <HelpCircle className="h-5 w-5" />
            <span className="sr-only">Help</span>
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Help & Resources</DialogTitle>
        </DialogHeader>
        <Tabs defaultValue="help">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="help">Help & Support</TabsTrigger>
            <TabsTrigger value="community">Community</TabsTrigger>
          </TabsList>
          <TabsContent value="help" className="space-y-4 mt-4">
            <div className="space-y-4">
              <Button variant="outline" className="w-full justify-start text-left" asChild>
                <a href="https://docs.mcpnow.org" target="_blank" rel="noopener noreferrer">
                  <Book className="mr-2 h-4 w-4" />
                  Help & documentation
                </a>
              </Button>
              <Button variant="outline" className="w-full justify-start text-left" asChild>
                <a href="https://mcpnow.org/support" target="_blank" rel="noopener noreferrer">
                  <MessageSquare className="mr-2 h-4 w-4" />
                  Get MCP Now support
                </a>
              </Button>
              <div className="pt-2">
                <h4 className="text-sm font-medium mb-2">MCP Now v1.0.0</h4>
                <p className="text-xs text-muted-foreground">
                  Updated 3 days ago
                </p>
              </div>
            </div>
          </TabsContent>
          <TabsContent value="community" className="space-y-4 mt-4">
            <div className="space-y-4">
              <h3 className="font-medium">Join us</h3>
              <div className="space-y-2">
                <Button variant="outline" className="w-full justify-start text-left" asChild>
                  <a href="https://twitter.com/mcpnow" target="_blank" rel="noopener noreferrer">
                    <Twitter className="mr-2 h-4 w-4 text-[#1DA1F2]" />
                    Twitter - @mcpnow
                  </a>
                </Button>
                <Button variant="outline" className="w-full justify-start text-left" asChild>
                  <a href="https://github.com/mcpnow" target="_blank" rel="noopener noreferrer">
                    <Github className="mr-2 h-4 w-4" />
                    GitHub
                  </a>
                </Button>
                <Button variant="outline" className="w-full justify-start text-left" asChild>
                  <a href="https://discord.gg/mcpnow" target="_blank" rel="noopener noreferrer">
                    <MessageSquare className="mr-2 h-4 w-4 text-[#5865F2]" />
                    Discord
                  </a>
                </Button>
              </div>
              <div className="space-y-2 pt-4">
                <h3 className="font-medium">Resources</h3>
                <Button variant="outline" className="w-full justify-start text-left" asChild>
                  <a href="https://mcpnow.org/privacy" target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="mr-2 h-4 w-4" />
                    Terms & privacy
                  </a>
                </Button>
                <Button variant="outline" className="w-full justify-start text-left" asChild>
                  <a href="https://mcpnow.org/status" target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="mr-2 h-4 w-4" />
                    Status
                  </a>
                </Button>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
