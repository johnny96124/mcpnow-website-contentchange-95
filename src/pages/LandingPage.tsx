
import React from "react";
import Navbar from "@/components/marketing/Navbar";
import HeroSection from "@/components/marketing/HeroSection";
import FeaturesSection from "@/components/marketing/FeaturesSection";
import UseCasesSection from "@/components/marketing/UseCasesSection";
import TestimonialsSection from "@/components/marketing/TestimonialsSection";
import DownloadSection from "@/components/marketing/DownloadSection";
import FaqSection from "@/components/marketing/FaqSection";
import CtaSection from "@/components/marketing/CtaSection";
import Footer from "@/components/marketing/Footer";

const LandingPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <HeroSection />
      <FeaturesSection />
      <UseCasesSection />
      <TestimonialsSection />
      <DownloadSection />
      <FaqSection />
      <CtaSection />
      <Footer />
    </div>
  );
};

export default LandingPage;
