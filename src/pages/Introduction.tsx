
import React from "react";
import { motion } from "framer-motion";
import { useLanguage } from "@/components/theme/language-provider";
import Navbar from "@/components/marketing/Navbar";
import NavbarEn from "@/components/marketing/NavbarEn";
import IntroductionHero from "@/components/marketing/IntroductionHero";
import IntroductionHeroEn from "@/components/marketing/IntroductionHeroEn";
import WhyMcpNow from "@/components/marketing/WhyMcpNow";
import WhyMcpNowEn from "@/components/marketing/WhyMcpNowEn";
import CompatibilitySection from "@/components/marketing/CompatibilitySection";
import ServersShowcase from "@/components/marketing/ServersShowcase";
import ServerDiscoverySection from "@/components/marketing/ServerDiscoverySection";
import CentralHubSection from "@/components/marketing/CentralHubSection";
import ShareServersSection from "@/components/marketing/ShareServersSection";
import TestimonialsSection from "@/components/marketing/TestimonialsSection";
import DownloadIntroSection from "@/components/marketing/DownloadIntroSection";
import DownloadIntroSectionEn from "@/components/marketing/DownloadIntroSectionEn";
import IntroFooter from "@/components/marketing/IntroFooter";
import IntroFooterEn from "@/components/marketing/IntroFooterEn";

const Introduction: React.FC = () => {
  const { language } = useLanguage();
  const isEnglish = language === "en";

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white dark:from-gray-900 dark:to-gray-950 font-noto">
      {isEnglish ? <NavbarEn /> : <Navbar />}
      {isEnglish ? <IntroductionHeroEn /> : <IntroductionHero />}
      {isEnglish ? <WhyMcpNowEn /> : <WhyMcpNow />}
      <CompatibilitySection />
      <ServersShowcase />
      {isEnglish && (
        <>
          <ServerDiscoverySection />
          <CentralHubSection />
          <ShareServersSection />
        </>
      )}
      <TestimonialsSection />
      {isEnglish ? <DownloadIntroSectionEn /> : <DownloadIntroSection />}
      {isEnglish ? <IntroFooterEn /> : <IntroFooter />}
    </div>
  );
};

export default Introduction;
