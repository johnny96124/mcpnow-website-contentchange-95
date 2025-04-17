
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Quote } from "lucide-react";

interface Testimonial {
  quote: string;
  author: string;
  role: string;
  company: string;
  avatar: string;
}

const testimonials: Testimonial[] = [
  {
    quote: "mcpnow has completely transformed how we deploy AI models. What used to take days now takes minutes.",
    author: "Alex Johnson",
    role: "CTO",
    company: "TechInnovate",
    avatar: "/placeholder.svg"
  },
  {
    quote: "The ability to standardize our model configurations across the research department has been invaluable.",
    author: "Priya Sharma",
    role: "Lead AI Researcher",
    company: "DataSci Labs",
    avatar: "/placeholder.svg"
  },
  {
    quote: "We've reduced our model deployment time by 85% and significantly improved resource utilization.",
    author: "Michael Chen",
    role: "Engineering Manager",
    company: "CloudScale AI",
    avatar: "/placeholder.svg"
  },
  {
    quote: "mcpnow's intuitive interface made it possible for our non-technical team members to work with AI models.",
    author: "Sarah Williams",
    role: "Creative Director",
    company: "ContentCraft",
    avatar: "/placeholder.svg"
  },
];

const TestimonialsSection: React.FC = () => {
  return (
    <section className="py-24 bg-muted/40">
      <div className="container">
        <div className="text-center mb-16 space-y-4">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight">What Our Users Say</h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            Professionals across industries trust mcpnow to power their AI infrastructure.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {testimonials.map((testimonial, index) => (
            <Card key={index} className="bg-background border">
              <CardContent className="pt-6">
                <Quote className="h-8 w-8 text-primary/40 mb-4" />
                <p className="text-lg mb-6 italic">"{testimonial.quote}"</p>
                
                <div className="flex items-center gap-4">
                  <Avatar>
                    <AvatarImage src={testimonial.avatar} alt={testimonial.author} />
                    <AvatarFallback>{testimonial.author.split(' ').map(name => name[0]).join('')}</AvatarFallback>
                  </Avatar>
                  
                  <div>
                    <h4 className="font-semibold">{testimonial.author}</h4>
                    <p className="text-sm text-muted-foreground">{testimonial.role}, {testimonial.company}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        
        <div className="mt-16 pt-8 border-t text-center">
          <div className="flex flex-wrap justify-center gap-8 md:gap-16">
            {['TechInnovate', 'DataSci Labs', 'CloudScale AI', 'ContentCraft', 'AI Educators'].map((company, index) => (
              <div key={index} className="text-xl font-semibold text-muted-foreground/70">
                {company}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
