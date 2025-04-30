
import React from "react";
import { Button } from "@/components/ui/button";
import { useLanguage } from "./language-provider";
import { Languages } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function LanguageToggle() {
  const { language, setLanguage } = useLanguage();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Languages className="h-[1.2rem] w-[1.2rem]" />
          <span className="sr-only">Toggle language</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => setLanguage("zh")}>
          {language === "zh" && "✓ "}中文
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setLanguage("en")}>
          {language === "en" && "✓ "}English
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
