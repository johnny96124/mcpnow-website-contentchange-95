
import React from "react";
import { motion } from "framer-motion";
import Navbar from "@/components/marketing/Navbar";
import IntroductionHero from "@/components/marketing/IntroductionHero";
import WhyMcpNow from "@/components/marketing/WhyMcpNow";
import CompatibilitySection from "@/components/marketing/CompatibilitySection";
import ServersShowcase from "@/components/marketing/ServersShowcase";
import CentralHubSection from "@/components/marketing/CentralHubSection";
import TestimonialsSection from "@/components/marketing/TestimonialsSection";
import DownloadIntroSection from "@/components/marketing/DownloadIntroSection";
import IntroFooter from "@/components/marketing/IntroFooter";

const WebsiteCn: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white dark:from-gray-900 dark:to-gray-950 font-noto">
      <Navbar />
      <IntroductionHero />
      <WhyMcpNow />
      <CompatibilitySection />
      <ServersShowcase />
      <CentralHubSection />
      <TestimonialsSection />
      <DownloadIntroSection />
      <IntroFooter />
    </div>
  );
};

export default WebsiteCn;
