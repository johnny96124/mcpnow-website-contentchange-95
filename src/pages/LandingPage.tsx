
import React from "react";
import Navbar from "@/components/marketing/Navbar";
import HeroSection from "@/components/marketing/HeroSection";
import FeaturesSection from "@/components/marketing/FeaturesSection";
import UseCasesSection from "@/components/marketing/UseCasesSection";
import TestimonialsSection from "@/components/marketing/TestimonialsSection";
import FaqSection from "@/components/marketing/FaqSection";
import DownloadSection from "@/components/marketing/DownloadSection";
import Footer from "@/components/marketing/Footer";
import { motion } from "framer-motion";

const fadeInUp = {
  initial: { opacity: 0, y: 40 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.7 },
};

const fadeIn = {
  initial: { opacity: 0 },
  whileInView: { opacity: 1 },
  viewport: { once: true },
  transition: { duration: 0.6 },
};

const LandingPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-background">
      <motion.div
        {...fadeIn}
        transition={{ ...fadeIn.transition, delay: 0 }}
      >
        <Navbar />
      </motion.div>

      {/* Hero Section with motion */}
      <motion.section
        className="relative"
        {...fadeInUp}
        transition={{ ...fadeInUp.transition, delay: 0.1 }}
      >
        <HeroSection />
        {/* 可选装饰动效 */}
        <motion.div
          className="absolute -top-32 -left-24 w-72 h-72 bg-blue-500/20 rounded-full blur-2xl -z-10"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.1, delay: 0.3 }}
        />
        <motion.div
          className="absolute top-60 right-10 w-56 h-56 bg-purple-500/10 rounded-full blur-2xl -z-10"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1.1 }}
          transition={{ duration: 1.3, delay: 0.5 }}
        />
      </motion.section>

      {/* Features Section with motion */}
      <motion.section
        {...fadeInUp}
        transition={{ ...fadeInUp.transition, delay: 0.2 }}
      >
        <FeaturesSection />
      </motion.section>

      {/* Use Cases Section with motion */}
      <motion.section
        {...fadeInUp}
        transition={{ ...fadeInUp.transition, delay: 0.3 }}
      >
        <UseCasesSection />
      </motion.section>

      {/* Testimonials Section with motion */}
      <motion.section
        {...fadeInUp}
        transition={{ ...fadeInUp.transition, delay: 0.4 }}
      >
        <TestimonialsSection />
      </motion.section>

      {/* Download Section with motion */}
      <motion.section
        {...fadeInUp}
        transition={{ ...fadeInUp.transition, delay: 0.5 }}
      >
        <DownloadSection />
      </motion.section>

      {/* Faq Section with motion */}
      <motion.section
        {...fadeInUp}
        transition={{ ...fadeInUp.transition, delay: 0.6 }}
      >
        <FaqSection />
      </motion.section>

      {/* Footer 单独淡入 */}
      <motion.div
        {...fadeIn}
        transition={{ ...fadeIn.transition, delay: 0.7 }}
      >
        <Footer />
      </motion.div>
    </div>
  );
};

export default LandingPage;

