
import { Button } from "@/components/ui/button";
import { Youtube, Twitter } from "lucide-react";

export function SocialLinks() {
  const socialLinks = [
    {
      icon: Twitter,
      href: "https://twitter.com/mcpnow",
      hoverColor: "hover:text-[#1DA1F2]"
    },
    {
      icon: Youtube,
      href: "https://youtube.com/mcpnow",
      hoverColor: "hover:text-[#FF0000]"
    },
    {
      icon: ({ className }: { className?: string }) => (
        <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M9.555 2.169a1 1 0 011.89 0l1.772 4.3a1 1 0 00.898.57h4.487a1 1 0 01.707 1.708l-3.614 3.614a1 1 0 00-.293.707v4.485a1 1 0 01-1.708.707l-3.614-3.614a1 1 0 00-1.414 0l-3.614 3.614a1 1 0 01-1.708-.707v-4.485a1 1 0 00-.293-.707L.045 8.747a1 1 0 01.707-1.708h4.487a1 1 0 00.898-.57l1.772-4.3z" fill="currentColor"/>
        </svg>
      ),
      href: "https://discord.gg/mcpnow",
      hoverColor: "hover:text-[#5865F2]"
    }
  ];

  return (
    <div className="px-4 py-2 border-t">
      <div className="flex justify-center gap-2">
        {socialLinks.map((link, index) => (
          <Button
            key={index}
            variant="ghost"
            size="icon"
            className={`h-8 w-8 rounded-full transition-colors ${link.hoverColor}`}
            asChild
          >
            <a href={link.href} target="_blank" rel="noopener noreferrer">
              <link.icon className="h-4 w-4" />
            </a>
          </Button>
        ))}
      </div>
    </div>
  );
}
