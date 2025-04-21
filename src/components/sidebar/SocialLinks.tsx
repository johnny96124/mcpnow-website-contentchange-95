import { Button } from "@/components/ui/button";
import { Youtube, Twitter } from "lucide-react";
export function SocialLinks() {
  const socialLinks = [{
    icon: Twitter,
    href: "https://twitter.com/mcpnow",
    hoverColor: "hover:text-[#1DA1F2]"
  }, {
    icon: Youtube,
    href: "https://youtube.com/mcpnow",
    hoverColor: "hover:text-[#FF0000]"
  }, {
    icon: ({
      className
    }: {
      className?: string;
    }) => <svg className={className} viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
          <path d="M19.54 0c1.356 0 2.46 1.104 2.46 2.472v21.528l-2.58-2.28-1.452-1.344-1.536-1.428.636 2.22h-13.608c-1.356 0-2.46-1.104-2.46-2.472v-16.224c0-1.368 1.104-2.472 2.46-2.472h16.08zm-4.632 15.672c2.652-.084 3.672-1.824 3.672-1.824 0-3.864-1.728-7.008-1.728-7.008-1.728-1.296-3.372-1.26-3.372-1.26l-.168.192c2.04.624 2.988 1.524 2.988 1.524-1.248-.684-2.472-1.02-3.612-1.152-.864-.096-1.692.012-2.424.048l-.204.024c-.42.036-1.44.192-2.724.756-.444.204-.708.348-.708.348s.996-.948 3.156-1.572l-.12-.144s-1.644-.036-3.372 1.26c0 0-1.728 3.144-1.728 7.008 0 0 1.008 1.74 3.66 1.824 0 0 .444-.54.804-.996-1.524-.456-2.1-1.416-2.1-1.416l.336.204.468.276.024.012.024.012c.24.132.48.24.708.348.396.192.876.384 1.428.516.732.144 1.596.2 2.532.012.468-.084.936-.24 1.428-.468 0 0-.6.984-2.172 1.428.36.456.792.972.792.972z" fill="currentColor" />
        </svg>,
    href: "https://discord.gg/mcpnow",
    hoverColor: "hover:text-[#5865F2]"
  }];
  return <div>
      <div className="flex justify-center gap-2 mx-0 my-[17px] py-0 px-0 bg-transparent rounded-none">
        {socialLinks.map((link, index) => <Button key={index} variant="ghost" size="icon" className={`h-8 w-8 rounded-full transition-colors ${link.hoverColor}`} asChild>
            <a href={link.href} target="_blank" rel="noopener noreferrer">
              <link.icon className="h-4 w-4" />
            </a>
          </Button>)}
      </div>
    </div>;
}