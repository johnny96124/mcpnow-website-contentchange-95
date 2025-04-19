
import { Twitter, Youtube, Discord } from "lucide-react";
import { Button } from "@/components/ui/button";

export function SocialLinks() {
  const socialLinks = [
    {
      icon: Twitter,
      href: "#",
      hoverColor: "hover:text-[#1DA1F2]",
      label: "Twitter"
    },
    {
      icon: Youtube,
      href: "#",
      hoverColor: "hover:text-[#FF0000]",
      label: "YouTube"
    },
    {
      icon: Discord,
      href: "#",
      hoverColor: "hover:text-[#5865F2]",
      label: "Discord"
    }
  ];

  return (
    <div className="px-2 py-4 border-t border-gray-200 dark:border-gray-800">
      <div className="flex justify-center gap-2">
        {socialLinks.map(({ icon: Icon, href, hoverColor, label }) => (
          <Button
            key={label}
            variant="ghost"
            size="icon"
            className={`h-9 w-9 rounded-full ${hoverColor} transition-colors`}
            asChild
          >
            <a href={href} target="_blank" rel="noopener noreferrer">
              <Icon className="h-5 w-5" />
              <span className="sr-only">{label}</span>
            </a>
          </Button>
        ))}
      </div>
    </div>
  );
}
