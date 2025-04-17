
import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { ArrowRight, Code, Sparkles, Building2, Microscope, MessageSquare, Book } from "lucide-react";
import { motion } from "framer-motion";

interface UseCase {
  id: string;
  icon: React.ReactNode;
  title: string;
  description: string;
  benefits: string[];
  image: string;
}

const useCases: UseCase[] = [
  {
    id: "developers",
    icon: <Code className="h-5 w-5" />,
    title: "Software Developers",
    description: "Integrate powerful AI capabilities into your applications without the complexity of managing infrastructure.",
    benefits: [
      "Seamlessly integrate with your existing development workflow",
      "Deploy models with API access for your applications",
      "Scale computing resources on-demand as your needs grow",
      "Focus on building features, not managing AI infrastructure"
    ],
    image: "https://images.unsplash.com/photo-1585079542156-2755d9c8a094?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2000&q=80"
  },
  {
    id: "researchers",
    icon: <Microscope className="h-5 w-5" />,
    title: "AI Researchers",
    description: "Deploy experimental models quickly and iterate faster with simplified management and deployment.",
    benefits: [
      "Quickly test models in isolated environments",
      "Compare performance across different model configurations",
      "Share access to models with your research team",
      "Standardize deployment across your research organization"
    ],
    image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2000&q=80"
  },
  {
    id: "enterprises",
    icon: <Building2 className="h-5 w-5" />,
    title: "Enterprise Teams",
    description: "Maintain control over your AI infrastructure with enterprise-grade security and management features.",
    benefits: [
      "Enforce role-based access control across your organization",
      "Keep sensitive data and models within your security perimeter",
      "Implement governance and compliance controls",
      "Centralize management of all AI resources"
    ],
    image: "https://images.unsplash.com/photo-1553877522-43269d4ea984?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2000&q=80"
  },
  {
    id: "content",
    icon: <MessageSquare className="h-5 w-5" />,
    title: "Content Creators",
    description: "Access state-of-the-art AI models for content generation, editing, and enhancement.",
    benefits: [
      "Run AI assistants locally for creative writing and editing",
      "Generate images and other visual content on your own hardware",
      "Maintain privacy by keeping your content on your own machines",
      "Customize models for your specific content needs"
    ],
    image: "https://images.unsplash.com/photo-1499750310107-5fef28a66643?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2000&q=80"
  },
  {
    id: "education",
    icon: <Book className="h-5 w-5" />,
    title: "Educators & Students",
    description: "Provide hands-on AI experience with easy-to-manage model deployments for educational purposes.",
    benefits: [
      "Set up standardized environments for AI coursework",
      "Allow students to experiment with models safely",
      "Create shareable model configurations for classroom use",
      "Teach practical AI deployment alongside theory"
    ],
    image: "https://images.unsplash.com/photo-1605810230434-7631ac76ec81?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2000&q=80"
  }
];

const UseCasesSection: React.FC = () => {
  const [activeTab, setActiveTab] = useState("developers");

  return (
    <section id="use-cases" className="py-24">
      <div className="container">
        <motion.div 
          className="mb-16 space-y-4"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight">Who Uses mcpnow?</h2>
          <p className="text-lg text-muted-foreground max-w-3xl">
            Discover how different professionals leverage mcpnow to streamline their AI workflows and achieve better results.
          </p>
        </motion.div>

        <Tabs defaultValue="developers" value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2 md:grid-cols-5 gap-4 h-auto mb-12">
            {useCases.map((useCase) => (
              <TabsTrigger
                key={useCase.id}
                value={useCase.id}
                className="flex items-center gap-2 py-3 h-auto data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
              >
                {useCase.icon}
                <span className="hidden sm:inline">{useCase.title}</span>
              </TabsTrigger>
            ))}
          </TabsList>
          
          {useCases.map((useCase) => (
            <TabsContent key={useCase.id} value={useCase.id} className="animate-fade-in">
              <div className="flex flex-col lg:flex-row gap-12 items-center">
                <motion.div 
                  className="flex-1 space-y-6"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5 }}
                  key={`${useCase.id}-content`}
                >
                  <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5">
                    {useCase.icon}
                    <span className="font-medium text-primary">{useCase.title}</span>
                  </div>
                  
                  <h3 className="text-2xl md:text-3xl font-bold">{useCase.description}</h3>
                  
                  <ul className="space-y-4">
                    {useCase.benefits.map((benefit, index) => (
                      <motion.li 
                        key={index} 
                        className="flex items-start gap-3"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: index * 0.1 }}
                      >
                        <div className="rounded-full p-1 bg-primary/20 text-primary mt-1">
                          <Sparkles className="h-3 w-3" />
                        </div>
                        <span>{benefit}</span>
                      </motion.li>
                    ))}
                  </ul>
                  
                  <Button className="gap-2 group">
                    Learn More
                    <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </motion.div>
                
                <motion.div 
                  className="flex-1 w-full"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5 }}
                  key={`${useCase.id}-image`}
                >
                  <div className="relative rounded-xl overflow-hidden shadow-lg">
                    <img
                      src={useCase.image}
                      alt={useCase.title}
                      width={600}
                      height={400}
                      className="w-full h-[400px] object-cover transition-transform duration-700 ease-in-out hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 to-transparent opacity-70"></div>
                  </div>
                </motion.div>
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </section>
  );
};

export default UseCasesSection;
