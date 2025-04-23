
import React from "react";
import { Button } from "@/components/ui/button";
import { Twitter, Youtube } from "lucide-react";

const socials = [
  {
    Icon: Twitter,
    label: "Twitter",
    href: "https://twitter.com/mcpnow",
    color: "hover:text-[#1DA1F2]"
  },
  {
    Icon: Youtube,
    label: "YouTube",
    href: "https://youtube.com/mcpnow",
    color: "hover:text-[#FF0000]"
  },
  {
    Icon: (() => (
      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
        <path d="M19.54 0c1.356 0 2.46 1.104 2.46 2.472v21.528l-2.58-2.28-1.452-1.344-1.536-1.428.636 2.22h-13.608c-1.356 0-2.46-1.104-2.46-2.472v-16.224c0-1.368 1.104-2.472 2.46-2.472h16.08zm-4.632 15.672c2.652-.084 3.672-1.824 3.672-1.824 0-3.864-1.728-7.008-1.728-7.008-1.728-1.296-3.372-1.26-3.372-1.26l-.168.192c2.04.624 2.988 1.524 2.988 1.524-1.248-.684-2.472-1.02-3.612-1.152-.864-.096-1.692.012-2.424.048l-.204.024c-.42.036-1.44.192-2.724.756-.444.204-.708.348-.708.348s.996-.948 3.156-1.572l-.12-.144s-1.644-.036-3.372 1.26c0 0-1.728 3.144-1.728 7.008 0 0 1.008 1.74 3.66 1.824 0 0 .444-.54.804-.996-1.524-.456-2.1-1.416-2.1-1.416l.336.204.468.276.024.012.024.012c.24.132.48.24.708.348.396.192.876.384 1.428.516.732.144 1.596.2 2.532.012.468-.084.936-.24 1.428-.468 0 0-.6.984-2.172 1.428.36.456.792.972.792.972z" />
      </svg>
    )),
    label: "Discord",
    href: "https://discord.gg/mcpnow",
    color: "hover:text-[#5865F2]"
  }
];

const SocialSection: React.FC = () => (
  <div className="py-10 flex justify-center gap-5">
    {socials.map((s, i) => (
      <Button
        key={i}
        variant="ghost"
        size="icon"
        className={`rounded-full transition-colors ${s.color}`}
        asChild
      >
        <a href={s.href} target="_blank" rel="noopener noreferrer" aria-label={s.label}>
          {/* @ts-ignore */}
          <s.Icon className="h-5 w-5" />
        </a>
      </Button>
    ))}
  </div>
);

export default SocialSection;
