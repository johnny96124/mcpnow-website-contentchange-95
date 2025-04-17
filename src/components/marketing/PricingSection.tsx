
import React from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";

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
    <section id="pricing" className="py-24">
      <div className="container">
        <div className="text-center mb-16 space-y-4">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight">Simple, Transparent Pricing</h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            Choose the plan that's right for you. All plans include core mcpnow features.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {pricingTiers.map((tier, index) => (
            <Card key={index} className={cn(
              "flex flex-col",
              tier.popular && "border-primary shadow-lg shadow-primary/10"
            )}>
              {tier.popular && (
                <div className="bg-primary text-primary-foreground text-center py-1 text-sm font-medium">
                  Most Popular
                </div>
              )}
              
              <CardHeader>
                <CardTitle>{tier.name}</CardTitle>
                <div className="mt-4 flex items-baseline text-5xl font-extrabold">
                  {tier.price}
                  {tier.price !== "Custom" && <span className="ml-1 text-2xl font-medium text-muted-foreground">/mo</span>}
                </div>
                <CardDescription className="mt-4">{tier.description}</CardDescription>
              </CardHeader>
              
              <CardContent className="flex-1">
                <ul className="space-y-3 text-sm">
                  {tier.features.map((feature, i) => (
                    <li key={i} className="flex items-center gap-3">
                      <CheckCircle2 className="h-4 w-4 text-primary" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
              
              <CardFooter>
                <Button 
                  className={cn("w-full", tier.popular ? "bg-primary" : "")} 
                  variant={tier.popular ? "default" : "outline"}
                >
                  {tier.cta}
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
        
        <div className="mt-12 text-center text-sm text-muted-foreground">
          All plans include core features. Prices are in USD and billed monthly or annually.
          <br />View our <a href="#" className="underline underline-offset-4 hover:text-primary">full pricing details</a> for more information.
        </div>
      </div>
    </section>
  );
};

export default PricingSection;
