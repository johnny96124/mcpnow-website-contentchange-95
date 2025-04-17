
import React from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

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
  }
];

const FaqSection: React.FC = () => {
  return (
    <section id="faq" className="py-24 bg-muted/40">
      <div className="container">
        <div className="text-center mb-16 space-y-4">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight">Frequently Asked Questions</h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            Have a question about mcpnow? Find answers to common questions below.
          </p>
        </div>
        
        <div className="max-w-3xl mx-auto">
          <Accordion type="single" collapsible className="w-full">
            {faqs.map((faq, index) => (
              <AccordionItem key={index} value={`item-${index}`}>
                <AccordionTrigger className="text-left">{faq.question}</AccordionTrigger>
                <AccordionContent>{faq.answer}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
        
        <div className="mt-12 text-center">
          <p className="text-muted-foreground">
            Still have questions? <a href="#contact" className="text-primary font-medium hover:underline">Contact our support team</a>
          </p>
        </div>
      </div>
    </section>
  );
};

export default FaqSection;
