
import React from "react";
import { motion } from "framer-motion";
import Navbar from "@/components/marketing/Navbar";
import FeaturesSection from "@/components/marketing/FeaturesSection";
import UseCasesSection from "@/components/marketing/UseCasesSection";
import FaqSection from "@/components/marketing/FaqSection";
import ServerMarquee from "@/components/marketing/ServerMarquee";
import HowItWorksSection from "@/components/marketing/HowItWorksSection";
import StickyDownloadButton from "@/components/marketing/StickyDownloadButton";
import SocialSection from "@/components/marketing/SocialSection";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import mcpLogo from "/favicon.ico";

const fadeInUp = {
  initial: { opacity: 0, y: 40 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.8, ease: "easeOut" }
};

const LandingPage: React.FC = () => {
  return (
    <div className="relative min-h-screen bg-gradient-to-b from-white to-blue-50 dark:from-[#1A1F2C] dark:to-[#171727]">
      <Navbar />
      <StickyDownloadButton className="fixed top-6 right-6 z-40" />
      {/* Hero Section Start */}
      <section className="flex flex-col items-center justify-center pt-24 pb-16 relative text-center">
        <motion.img
          src={mcpLogo}
          alt="mcpnow logo"
          className="w-12 h-12 mb-3 rounded-lg shadow-xl bg-white/80"
          initial={{ opacity: 0, scale: .85 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, delay: 0.1 }}
        />
        <motion.h1
          className="text-3xl md:text-5xl font-extrabold tracking-tight bg-gradient-to-r from-[#9b87f5] via-[#7E69AB] to-[#6E59A5] bg-clip-text text-transparent mb-4"
          initial={{ opacity: 0, y: -40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          Welcome to MCP Now
        </motion.h1>
        <motion.p
          className="text-base md:text-lg text-gray-500 dark:text-gray-300 mb-6 max-w-xl"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.2 }}
        >
          Access 1000+ mcp servers
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="mb-8"
        >
          <Button
            size="lg"
            className="bg-[#9b87f5] hover:bg-[#7E69AB] text-white gap-2 px-8 py-6 text-lg shadow-lg"
            onClick={() => {
              window.location.href = "#download";
            }}
          >
            <Download className="mr-2" />
            Download MCP Now
          </Button>
        </motion.div>
        <ServerMarquee />
      </section>
      {/* Hero Section End */}

      {/* Keypoint / Features Section */}
      <motion.section
        className="container mx-auto py-12"
        initial="initial"
        whileInView="animate"
        viewport={{ once: true, amount: 0.2 }}
        variants={{
          initial: { opacity: 0, y: 48 },
          animate: { opacity: 1, y: 0, transition: { duration: 0.7 } }
        }}
      >
        <FeaturesSection />
      </motion.section>

      {/* How It Works Section */}
      <motion.section
        className="container mx-auto py-10"
        initial="initial"
        whileInView="animate"
        viewport={{ once: true, amount: 0.2 }}
        variants={{
          initial: { opacity: 0, y: 50 },
          animate: { opacity: 1, y: 0, transition: { duration: 0.8 } }
        }}
      >
        <HowItWorksSection />
      </motion.section>

      {/* Use Cases Section */}
      <motion.section
        className="container mx-auto py-10"
        initial="initial"
        whileInView="animate"
        viewport={{ once: true, amount: 0.2 }}
        variants={{
          initial: { opacity: 0, y: 24 },
          animate: { opacity: 1, y: 0, transition: { duration: 0.7 } }
        }}
      >
        <UseCasesSection />
      </motion.section>

      {/* FAQ Section */}
      <motion.section
        className="container mx-auto py-14"
        initial="initial"
        whileInView="animate"
        viewport={{ once: true, amount: 0.2 }}
        variants={{
          initial: { opacity: 0, y: 50 },
          animate: { opacity: 1, y: 0, transition: { duration: 0.75 } }
        }}
      >
        <FaqSection />
      </motion.section>

      {/* 底部社交区域 */}
      <footer>
        <SocialSection />
      </footer>
    </div>
  );
};

export default LandingPage;
