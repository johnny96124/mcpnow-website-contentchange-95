
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Quote, Star } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface Testimonial {
  quote: string;
  author: string;
  role: string;
  company: string;
  avatar: string;
  rating: number;
}

const testimonials: Testimonial[] = [
  {
    quote: "mcpnow has completely transformed how we deploy AI models. What used to take days now takes minutes, and the intuitive interface makes managing our infrastructure a breeze.",
    author: "Alex Johnson",
    role: "CTO",
    company: "TechInnovate",
    avatar: "https://randomuser.me/api/portraits/men/32.jpg",
    rating: 5
  },
  {
    quote: "The ability to standardize our model configurations across the research department has been invaluable. We've seen a 40% improvement in our experiment turnaround times.",
    author: "Priya Sharma",
    role: "Lead AI Researcher",
    company: "DataSci Labs",
    avatar: "https://randomuser.me/api/portraits/women/44.jpg",
    rating: 5
  },
  {
    quote: "We've reduced our model deployment time by 85% and significantly improved resource utilization. The ROI on mcpnow was evident within the first month of implementation.",
    author: "Michael Chen",
    role: "Engineering Manager",
    company: "CloudScale AI",
    avatar: "https://randomuser.me/api/portraits/men/52.jpg",
    rating: 4
  },
  {
    quote: "mcpnow's intuitive interface made it possible for our non-technical team members to work with AI models. This democratization of AI has been transformative for our creative process.",
    author: "Sarah Williams",
    role: "Creative Director",
    company: "ContentCraft",
    avatar: "https://randomuser.me/api/portraits/women/67.jpg",
    rating: 5
  },
];

const StarRating = ({ rating }: { rating: number }) => {
  return (
    <div className="flex">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={cn(
            "h-4 w-4 mr-0.5",
            star <= rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300"
          )}
        />
      ))}
    </div>
  );
};

const TestimonialCard = ({ testimonial, index }: { testimonial: Testimonial, index: number }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
    >
      <Card className="bg-background border h-full hover:shadow-md transition-shadow">
        <CardContent className="pt-6 flex flex-col h-full">
          <div className="mb-2">
            <StarRating rating={testimonial.rating} />
          </div>
          
          <Quote className="h-8 w-8 text-primary/40 mb-4" />
          <p className="text-lg mb-6 italic flex-grow">"{testimonial.quote}"</p>
          
          <div className="flex items-center gap-4 mt-4">
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
    </motion.div>
  );
};

const TestimonialsSection: React.FC = () => {
  return (
    <section className="py-24 bg-muted/40 relative">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/5 to-transparent pointer-events-none"></div>
      
      <div className="container relative z-10">
        <motion.div 
          className="text-center mb-16 space-y-4"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight">What Our Users Say</h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            Professionals across industries trust mcpnow to power their AI infrastructure.
          </p>
        </motion.div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {testimonials.map((testimonial, index) => (
            <TestimonialCard key={index} testimonial={testimonial} index={index} />
          ))}
        </div>
        
        <motion.div 
          className="mt-16 pt-8 border-t text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <p className="text-xl font-medium text-muted-foreground mb-8">Trusted by innovative companies worldwide</p>
          <div className="flex flex-wrap justify-center gap-8 md:gap-16 items-center">
            {[
              { name: 'TechInnovate', logo: "https://tailwindui.com/img/logos/tuple-logo-gray-300.svg" },
              { name: 'DataSci Labs', logo: "https://tailwindui.com/img/logos/mirage-logo-gray-300.svg" },
              { name: 'CloudScale AI', logo: "https://tailwindui.com/img/logos/statickit-logo-gray-300.svg" },
              { name: 'ContentCraft', logo: "https://tailwindui.com/img/logos/transistor-logo-gray-300.svg" },
              { name: 'AI Educators', logo: "https://tailwindui.com/img/logos/workcation-logo-gray-300.svg" }
            ].map((company, index) => (
              <motion.img 
                key={index} 
                src={company.logo} 
                alt={company.name}
                className="h-8 md:h-10 opacity-70 hover:opacity-100 transition-opacity"
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: 0.5 + index * 0.1 }}
              />
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
