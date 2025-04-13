
import { useState } from "react";
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTabs,
  DialogTab,
  DialogTabContent,
  DialogTabList,
  DialogTabTrigger 
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ExternalLink, Github, Twitter, MessageSquare } from "lucide-react";
import { toast } from "sonner";

interface HelpDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function HelpDialog({ open, onOpenChange }: HelpDialogProps) {
  const [feedback, setFeedback] = useState("");
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState("feedback");

  const handleSubmit = async () => {
    if (!feedback.trim()) {
      toast.error("Please provide feedback before submitting");
      return;
    }

    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      toast.success("Thank you for your feedback!");
      setFeedback("");
      setEmail("");
      onOpenChange(false);
    }, 1000);
  };

  const socialLinks = [
    { 
      name: "Twitter", 
      url: "https://twitter.com/mcpnow", 
      icon: Twitter, 
      color: "#1DA1F2" 
    },
    { 
      name: "GitHub", 
      url: "https://github.com/mcpnow", 
      icon: Github, 
      color: "#333" 
    },
    { 
      name: "Discord", 
      url: "https://discord.gg/mcpnow", 
      icon: MessageSquare, 
      color: "#5865F2" 
    }
  ];

  const documentationLinks = [
    { name: "User Guide", url: "https://docs.mcpnow.com/guide" },
    { name: "API Reference", url: "https://docs.mcpnow.com/api" },
    { name: "FAQ", url: "https://docs.mcpnow.com/faq" },
    { name: "Troubleshooting", url: "https://docs.mcpnow.com/troubleshooting" }
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Help & Support</DialogTitle>
          <DialogDescription>
            Get help, provide feedback, or connect with us
          </DialogDescription>
        </DialogHeader>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="feedback">Feedback</TabsTrigger>
            <TabsTrigger value="docs">Documentation</TabsTrigger>
            <TabsTrigger value="connect">Connect</TabsTrigger>
          </TabsList>
          
          <TabsContent value="feedback" className="py-4">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="feedback">Feedback</Label>
                <Textarea
                  id="feedback"
                  placeholder="Tell us what you think about MCP Now..."
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                  className="min-h-[100px]"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email (optional)</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="your@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <p className="text-xs text-muted-foreground">
                  Provide your email if you'd like us to follow up with you.
                </p>
              </div>
              <Button 
                onClick={handleSubmit} 
                disabled={isSubmitting} 
                className="w-full"
              >
                {isSubmitting ? "Submitting..." : "Submit Feedback"}
              </Button>
            </div>
          </TabsContent>
          
          <TabsContent value="docs" className="py-4">
            <div className="space-y-3">
              {documentationLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between p-3 rounded-md border hover:bg-accent"
                >
                  <span>{link.name}</span>
                  <ExternalLink className="h-4 w-4 text-muted-foreground" />
                </a>
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="connect" className="py-4">
            <div className="grid gap-4">
              <p className="text-sm text-muted-foreground">
                Connect with us on social media or join our community
              </p>
              
              <div className="space-y-3">
                {socialLinks.map((link) => (
                  <a
                    key={link.name}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 p-3 rounded-md border hover:bg-accent"
                  >
                    <link.icon className="h-5 w-5" style={{color: link.color}} />
                    <span>{link.name}</span>
                  </a>
                ))}
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
