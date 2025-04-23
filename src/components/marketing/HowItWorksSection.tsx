
import React from "react";
import { motion } from "framer-motion";

const steps = [
  {
    num: 1,
    title: "Install MCP Now",
    desc: "Download and install the MCP Now desktop app on your device."
  },
  {
    num: 2,
    title: "Connect a Server",
    desc: "Easily link to a MCP server from the home interface."
  },
  {
    num: 3,
    title: "Configure Model or Workflow",
    desc: "One-click create model profiles or import existing models."
  },
  {
    num: 4,
    title: "Start Using AI Features!",
    desc: "Enjoy streamlined AI capability, orchestration and monitoring in one place."
  },
];

const animation = {
  initial: { opacity: 0, y: 40 },
  whileInView: { opacity: 1, y: 0 },
  transition: { duration: 0.7 },
  viewport: { once: true, amount: 0.3 }
};

const HowItWorksSection: React.FC = () => {
  return (
    <section className="w-full py-12 md:py-16">
      <div className="container text-center">
        <h2 className="text-2xl md:text-3xl font-bold mb-4">How to use MCP Now?</h2>
        <p className="text-muted-foreground mb-10 max-w-2xl mx-auto">Just 4 quick steps to fully utilize your MCP AI capabilities!</p>
        <div className="flex flex-col md:flex-row justify-center items-center gap-8 md:gap-4">
          {steps.map((step, idx) => (
            <motion.div
              key={step.num}
              className="flex-1 min-w-[200px] bg-white/80 dark:bg-[#191B23] rounded-lg p-6 shadow-lg mx-auto"
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.7, delay: idx * 0.12 }}
            >
              <div className="w-12 h-12 mx-auto flex items-center justify-center mb-2 text-lg font-bold rounded-full bg-gradient-to-br from-[#9b87f5] to-[#7E69AB] text-white shadow">{step.num}</div>
              <h3 className="font-semibold text-lg mb-1">{step.title}</h3>
              <p className="text-muted-foreground text-sm">{step.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;
