
import React from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle2, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface PricingTier {
  name: string;
  price: string;
  description: string;
  features: string[];
  cta: string;
  popular?: boolean;
}

const pricingTiers: PricingTier[] = [
  {
    name: "Free",
    price: "$0",
    description: "Perfect for individuals and hobbyists to get started with AI model hosting.",
    features: [
      "Up to 3 model profiles",
      "Single host connection",
      "Basic analytics",
      "Community support",
      "Standard security features"
    ],
    cta: "Get Started"
  },
  {
    name: "Pro",
    price: "$29",
    description: "For professionals who need more power and flexibility.",
    features: [
      "Unlimited model profiles",
      "Up to 5 host connections",
      "Advanced analytics & monitoring",
      "Priority email support",
      "Enhanced security controls",
      "Custom configuration templates"
    ],
    cta: "Upgrade to Pro",
    popular: true
  },
  {
    name: "Enterprise",
    price: "Custom",
    description: "For organizations requiring enterprise-grade features and support.",
    features: [
      "Unlimited hosts and profiles",
      "Advanced team management",
      "Dedicated infrastructure options",
      "24/7 premium support",
      "Custom integrations",
      "SLA guarantees",
      "Compliance & audit features"
    ],
    cta: "Contact Sales"
  }
];

const PricingSection: React.FC = () => {
  return (
    <section id="pricing" className="py-24 relative overflow-hidden">
      <div className="absolute inset-0 bg-grid-pattern opacity-5 pointer-events-none"></div>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/5 rounded-full blur-3xl opacity-30 pointer-events-none"></div>
      
      <div className="container relative z-10">
        <motion.div 
          className="text-center mb-16 space-y-4"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <div className="inline-flex items-center gap-2 bg-primary/10 rounded-full px-4 py-1.5 mb-4">
            <Sparkles className="h-4 w-4 text-primary" />
            <span className="text-sm font-medium text-primary">Transparent Pricing</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight">Choose Your Perfect Plan</h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            All plans include core mcpnow features. Select the option that best fits your needs and scale as you grow.
          </p>
        </motion.div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {pricingTiers.map((tier, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card className={cn(
                "flex flex-col h-full transition-all duration-300 hover:shadow-lg hover:-translate-y-1",
                tier.popular && "border-primary shadow-lg shadow-primary/10"
              )}>
                {tier.popular && (
                  <div className="bg-primary text-primary-foreground text-center py-2 text-sm font-medium">
                    Most Popular
                  </div>
                )}
                
                <CardHeader>
                  <CardTitle className="text-2xl">{tier.name}</CardTitle>
                  <div className="mt-4 flex items-baseline">
                    <span className="text-5xl font-extrabold">{tier.price}</span>
                    {tier.price !== "Custom" && <span className="ml-1 text-2xl font-medium text-muted-foreground">/mo</span>}
                  </div>
                  <CardDescription className="mt-4 text-base">{tier.description}</CardDescription>
                </CardHeader>
                
                <CardContent className="flex-1">
                  <ul className="space-y-3 text-sm">
                    {tier.features.map((feature, i) => (
                      <motion.li 
                        key={i} 
                        className="flex items-center gap-3"
                        initial={{ opacity: 0, x: -10 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.3, delay: i * 0.05 + index * 0.1 }}
                      >
                        <CheckCircle2 className="h-4 w-4 text-primary flex-shrink-0" />
                        <span>{feature}</span>
                      </motion.li>
                    ))}
                  </ul>
                </CardContent>
                
                <CardFooter>
                  <Button 
                    className={cn(
                      "w-full transition-all", 
                      tier.popular ? "bg-primary hover:bg-primary/90" : ""
                    )} 
                    variant={tier.popular ? "default" : "outline"}
                  >
                    {tier.cta}
                  </Button>
                </CardFooter>
              </Card>
            </motion.div>
          ))}
        </div>
        
        <motion.div 
          className="mt-12 text-center text-sm text-muted-foreground"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.6 }}
        >
          All plans include core features. Prices are in USD and billed monthly or annually.
          <br />View our <a href="#" className="underline underline-offset-4 hover:text-primary">full pricing details</a> for more information.
        </motion.div>
      </div>
    </section>
  );
};

export default PricingSection;
