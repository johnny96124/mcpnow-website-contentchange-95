
import { Twitter, Youtube } from "lucide-react";
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
      // Since Discord icon is not available in lucide-react, we'll create a custom one using SVG
      icon: () => (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="lucide lucide-discord"
        >
          <path d="M8.5 14a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3z" />
          <path d="M15.5 14a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3z" />
          <path d="M18.25 4h-12.5a1.75 1.75 0 0 0-1.75 1.75v12.5c0 .966.784 1.75 1.75 1.75h12.5a1.75 1.75 0 0 0 1.75-1.75v-12.5a1.75 1.75 0 0 0-1.75-1.75z" />
          <path d="M7.5 8.5v.01" />
          <path d="M16.5 8.5v.01" />
          <path d="M12 15.5a4.5 4.5 0 0 1-4.14-2.75 4.49 4.49 0 0 1 8.28 0A4.5 4.5 0 0 1 12 15.5z" />
        </svg>
      ),
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
