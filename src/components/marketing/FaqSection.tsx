
import React from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { motion } from "framer-motion";
import { MessageCircleQuestion } from "lucide-react";

interface FaqItem {
  question: string;
  answer: string;
}

const faqs: FaqItem[] = [
  {
    question: "What is mcpnow?",
    answer: "mcpnow is a comprehensive platform for deploying, managing, and scaling AI models across multiple hosts. It provides an intuitive interface for creating model profiles, connecting to hosts, and monitoring performance — all designed to simplify AI infrastructure management."
  },
  {
    question: "Do I need specialized hardware to use mcpnow?",
    answer: "No, mcpnow works with a variety of hardware configurations. While having GPUs will enhance performance for many AI models, you can use mcpnow with standard CPUs as well. The platform will help you optimize resource usage for whatever hardware you have available."
  },
  {
    question: "Can I use mcpnow with my existing AI models?",
    answer: "Yes, mcpnow is designed to work with most standard AI model formats and frameworks, including PyTorch, TensorFlow, Hugging Face models, and many others. You can create profiles for your existing models and deploy them through the platform."
  },
  {
    question: "How does mcpnow handle security and privacy?",
    answer: "Security is a top priority for mcpnow. The platform offers enterprise-grade security features including encryption, role-based access control, and secure API endpoints. You maintain complete control over your models and data, with options to keep everything within your own infrastructure."
  },
  {
    question: "Does mcpnow support team collaboration?",
    answer: "Absolutely. mcpnow offers robust team collaboration features, allowing team members to share access to hosts and model profiles with appropriate permissions. This makes it ideal for research teams, development groups, and enterprise environments."
  },
  {
    question: "What kind of support is available?",
    answer: "Free users have access to our community support forums and documentation. Pro users receive priority email support, while Enterprise customers benefit from dedicated support channels and optional SLAs. We're committed to helping you succeed with mcpnow regardless of your plan."
  },
  {
    question: "Can I try mcpnow before purchasing?",
    answer: "Yes, we offer a free plan with core features that you can use indefinitely. This allows you to experience the platform's capabilities before deciding to upgrade. We also offer demos for enterprise customers interested in our advanced features."
  },
  {
    question: "Is mcpnow suitable for both small startups and large enterprises?",
    answer: "Absolutely. mcpnow's scalable architecture makes it suitable for organizations of all sizes. Small startups can begin with the free tier and scale up as they grow, while enterprises can leverage our advanced security, administration, and integration features from day one."
  }
];

const FaqSection: React.FC = () => {
  return (
    <section id="faq" className="py-24 bg-muted/40 relative">
      <div className="absolute top-0 inset-x-0 h-32 bg-gradient-to-b from-background to-transparent pointer-events-none"></div>
      <div className="absolute bottom-0 inset-x-0 h-32 bg-gradient-to-t from-background to-transparent pointer-events-none"></div>
      
      <div className="container relative z-10">
        <motion.div 
          className="text-center mb-16 space-y-4"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <div className="inline-flex items-center gap-2 bg-primary/10 rounded-full px-4 py-1.5 mb-4">
            <MessageCircleQuestion className="h-4 w-4 text-primary" />
            <span className="text-sm font-medium text-primary">Help Center</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight">Frequently Asked Questions</h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            Have a question about mcpnow? Find answers to common questions below.
          </p>
        </motion.div>
        
        <motion.div 
          className="max-w-3xl mx-auto"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <Accordion type="single" collapsible className="w-full">
            {faqs.map((faq, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
              >
                <AccordionItem value={`item-${index}`} className="border-b border-muted">
                  <AccordionTrigger className="text-left hover:text-primary transition-colors py-4">
                    <span className="font-medium">{faq.question}</span>
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground">
                    <p className="py-2">{faq.answer}</p>
                  </AccordionContent>
                </AccordionItem>
              </motion.div>
            ))}
          </Accordion>
        </motion.div>
        
        <motion.div 
          className="mt-12 text-center bg-card border rounded-xl p-8 max-w-3xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <h3 className="text-xl font-semibold mb-2">Still have questions?</h3>
          <p className="text-muted-foreground mb-4">
            Our support team is ready to assist you with any inquiries about mcpnow's features, pricing, or implementation.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <a href="#contact" className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-md bg-primary text-primary-foreground hover:bg-primary/90 transition-colors">
              Contact Support
            </a>
            <a href="/docs" className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-md border border-input bg-background hover:bg-accent hover:text-accent-foreground transition-colors">
              Browse Documentation
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default FaqSection;
