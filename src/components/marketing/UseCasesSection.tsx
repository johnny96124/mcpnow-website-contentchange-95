
import React from "react";
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
    image: "/placeholder.svg"
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
    image: "/placeholder.svg"
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
    image: "/placeholder.svg"
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
    image: "/placeholder.svg"
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
    image: "/placeholder.svg"
  }
];

const UseCasesSection: React.FC = () => {
  const [isHovered, setIsHovered] = React.useState(false);

  return (
    <section id="use-cases" className="py-24">
      <div className="container">
        <div className="mb-16 space-y-4">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight">Who Uses mcpnow?</h2>
          <p className="text-lg text-muted-foreground max-w-3xl">
            Discover how different professionals leverage mcpnow to streamline their AI workflows and achieve better results.
          </p>
        </div>

        <Tabs defaultValue="developers" className="w-full">
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
                <div className="flex-1 space-y-6">
                  <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5">
                    {useCase.icon}
                    <span className="font-medium text-primary">{useCase.title}</span>
                  </div>
                  
                  <h3 className="text-2xl md:text-3xl font-bold">{useCase.description}</h3>
                  
                  <ul className="space-y-4">
                    {useCase.benefits.map((benefit, index) => (
                      <li key={index} className="flex items-start gap-3">
                        <div className="rounded-full p-1 bg-primary/20 text-primary mt-1">
                          <Sparkles className="h-3 w-3" />
                        </div>
                        <span>{benefit}</span>
                      </li>
                    ))}
                  </ul>
                  
                  <Button className="gap-2">
                    Learn More
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </div>
                
                <div className="flex-1 w-full">
                  <div 
                    className="relative rounded-xl overflow-hidden shadow-lg"
                    onMouseEnter={() => setIsHovered(true)}
                    onMouseLeave={() => setIsHovered(false)}
                  >
                    <img
                      src={useCase.image}
                      alt={useCase.title}
                      width={600}
                      height={400}
                      className="w-full h-auto object-cover transition-transform duration-700 ease-in-out"
                    />
                    <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 to-transparent opacity-70"></div>
                  </div>
                </div>
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </section>
  );
};

export default UseCasesSection;
