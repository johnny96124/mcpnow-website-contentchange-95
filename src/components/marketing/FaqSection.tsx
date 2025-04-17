
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
    question: "What is MCP Now?",
    answer: "MCP Now is a powerful desktop application that simplifies the management of Model Context Protocol (MCP) configurations. It serves as a local proxy service that bridges AI applications (MCP Hosts like Cursor, Claude Desktop) with various MCP servers, functioning as a central hub for MCP server discovery, configuration, and management."
  },
  {
    question: "What is the Model Context Protocol (MCP)?",
    answer: "The Model Context Protocol (MCP) is a standardized communication protocol that enables AI applications to interact with various AI models and services. It provides a consistent way for applications to send requests to and receive responses from AI models, regardless of the underlying implementation."
  },
  {
    question: "How does MCP Now work?",
    answer: "MCP Now acts as a local proxy service that sits between your AI applications (MCP Hosts) and MCP servers. It automatically discovers available MCP servers, allows you to configure them, and manages the connections between your applications and these servers. This simplifies the setup process and provides a centralized way to manage all your MCP configurations."
  },
  {
    question: "What are MCP Hosts and how do they work with MCP Now?",
    answer: "MCP Hosts are applications that implement the MCP client side of the protocol, such as Cursor and Claude Desktop. These applications connect to MCP Now, which then routes their requests to appropriate MCP servers based on your configuration. This allows these applications to leverage various AI models and services without having to implement direct connections to each one."
  },
  {
    question: "Is MCP Now free to use?",
    answer: "Yes, MCP Now is currently available as a free download. We are committed to providing a powerful tool for the community to simplify MCP configuration management."
  },
  {
    question: "Which operating systems does MCP Now support?",
    answer: "MCP Now currently supports macOS (both Intel and Apple Silicon). Windows support is coming soon. We are continuously working to expand platform support based on user feedback."
  },
  {
    question: "Do I need technical knowledge to use MCP Now?",
    answer: "MCP Now is designed to be user-friendly and does not require extensive technical knowledge. The intuitive interface guides you through the process of discovering and configuring MCP servers. However, some basic understanding of the MCP ecosystem can be helpful."
  },
  {
    question: "Can I contribute to MCP Now's development?",
    answer: "While MCP Now is not currently open source, we welcome feature suggestions and feedback from the community. If you have ideas for improving MCP Now, please share them through our feedback channels."
  }
];

const FaqSection: React.FC = () => {
  return (
    <section id="faq" className="py-24 bg-blue-50/50 dark:bg-blue-950/10 relative">
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
            Have questions about MCP Now? Find answers to common questions below.
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
            Our support team is ready to assist you with any inquiries about MCP Now's features or implementation.
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
