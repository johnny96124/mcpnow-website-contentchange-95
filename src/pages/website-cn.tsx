
import React from "react";
import { motion } from "framer-motion";
import Navbar from "@/components/marketing/Navbar";
import IntroductionHero from "@/components/marketing/IntroductionHero";
import WhyMcpNow from "@/components/marketing/WhyMcpNow";
import ServersShowcase from "@/components/marketing/ServersShowcase";
import CompatibilitySection from "@/components/marketing/CompatibilitySection";
import TestimonialsSection from "@/components/marketing/TestimonialsSection";
import DownloadIntroSection from "@/components/marketing/DownloadIntroSection";
import IntroFooter from "@/components/marketing/IntroFooter";
import ServerDiscoverySection from "@/components/marketing/ServerDiscoverySection";
import ShareServersSection from "@/components/marketing/ShareServersSection";
import DebugToolsSection from "@/components/marketing/DebugToolsSection";
import CentralHubSection from "@/components/marketing/CentralHubSection";

const WebsiteCn: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white dark:from-gray-900 dark:to-gray-950 font-noto">
      <Navbar />
      <IntroductionHero />
      <WhyMcpNow />
      <ServersShowcase />
      <ServerDiscoverySection />
      <CentralHubSection />
      <ShareServersSection />
      <DebugToolsSection />
      <CompatibilitySection />
      <TestimonialsSection />
      <DownloadIntroSection />
      <IntroFooter />
    </div>
  );
};

export default WebsiteCn;
