
import React from "react";
import { motion } from "framer-motion";
import NavbarEn from "@/components/marketing/NavbarEn";
import IntroductionHero from "@/components/marketing/IntroductionHeroEn";
import WhyMcpNow from "@/components/marketing/WhyMcpNowEn";
import CompatibilitySection from "@/components/marketing/CompatibilitySection";
import ServersShowcase from "@/components/marketing/ServersShowcase";
import ServerDiscoverySection from "@/components/marketing/ServerDiscoverySection";
import CentralHubSection from "@/components/marketing/CentralHubSection";
import ShareServersSection from "@/components/marketing/ShareServersSection";
import TestimonialsSection from "@/components/marketing/TestimonialsSection";
import DownloadIntroSection from "@/components/marketing/DownloadIntroSectionEn";
import IntroFooter from "@/components/marketing/IntroFooterEn";

const WebsiteEn: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white dark:from-gray-900 dark:to-gray-950 font-sans">
      <NavbarEn />
      <IntroductionHero />
      <WhyMcpNow />
      <CompatibilitySection />
      <ServersShowcase />
      <ServerDiscoverySection />
      <CentralHubSection />
      <ShareServersSection />
      <TestimonialsSection />
      <DownloadIntroSection />
      <IntroFooter />
    </div>
  );
};

export default WebsiteEn;
