
import React from "react";
import { motion } from "framer-motion";
import { Star } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const fadeInUp = {
  initial: { opacity: 0, y: 40 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.7 }
};

const staggerChildren = {
  initial: { opacity: 0 },
  whileInView: { opacity: 1 },
  viewport: { once: true },
  transition: { staggerChildren: 0.2 }
};

const TestimonialsSection = () => {
  const testimonials = [
    {
      author: "Sarah Chen",
      role: "Full-stack Developer",
      company: "TechForward",
      text: "MCP Now has completely transformed my AI development workflow. Now I can seamlessly switch between different models without changing my code.",
      avatar: "/placeholder.svg"
    }, 
    {
      author: "Michael Rodriguez",
      role: "ML Engineer",
      company: "DataVision",
      text: "The ability to manage multiple MCP servers from one interface is a game-changer. I've cut my model deployment time by 70%.",
      avatar: "/placeholder.svg"
    }, 
    {
      author: "Aisha Johnson",
      role: "CTO",
      company: "NextGen AI",
      text: "Our entire team relies on MCP Now for consistent and reliable access to our AI infrastructure. It's become an essential part of our tech stack.",
      avatar: "/placeholder.svg"
    }
  ];

  const impactMetrics = [
    { value: "50,000+", label: "Active Developers" },
    { value: "120,000+", label: "AI Project Deployments" },
    { value: "75%", label: "Development Efficiency Increase" },
    { value: "98.7%", label: "Service Reliability" }
  ];

  return (
    <section id="testimonials" className="py-20 bg-white dark:bg-gray-900">
      <div className="container px-4 md:px-6">
        <motion.div className="text-center max-w-3xl mx-auto mb-12" {...fadeInUp}>
          <h2 className="text-3xl md:text-4xl font-extrabold mb-4 font-montserrat">Community Impact & Success Stories</h2>
          <p className="text-lg text-gray-600 dark:text-gray-300 leading-relaxed">
            See how developers are accelerating innovation with MCP Now
          </p>
        </motion.div>

        <div className="flex justify-center mb-16">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
            {impactMetrics.map((metric, idx) => (
              <motion.div 
                key={idx} 
                className="text-center" 
                initial={{ opacity: 0, y: 20 }} 
                whileInView={{ opacity: 1, y: 0 }} 
                viewport={{ once: true }} 
                transition={{ delay: idx * 0.1 }}
              >
                <div className="mb-2">
                  <span className="text-3xl md:text-4xl font-extrabold text-blue-600 dark:text-blue-400 font-montserrat">{metric.value}</span>
                </div>
                <p className="text-gray-600 dark:text-gray-400">{metric.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
        
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto" 
          variants={staggerChildren} 
          initial="initial" 
          whileInView="whileInView" 
          viewport={{ once: true }}
        >
          {testimonials.map((testimonial, idx) => (
            <motion.div 
              key={idx} 
              variants={fadeInUp} 
              transition={{ delay: idx * 0.1 }} 
              whileHover={{ y: -5, transition: { duration: 0.2 } }}
            >
              <Card className="h-full border-gray-200 dark:border-gray-800 hover:shadow-md transition-all duration-300">
                <CardContent className="p-6">
                  <div className="flex flex-col space-y-4">
                    <div className="flex items-center space-x-1">
                      {Array(5).fill(null).map((_, i) => (
                        <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      ))}
                    </div>
                    
                    <p className="italic text-gray-700 dark:text-gray-300 leading-relaxed">"{testimonial.text}"</p>
                    
                    <div className="flex items-center pt-4">
                      <div className="mr-4">
                        <div className="h-10 w-10 rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden">
                          <img src={testimonial.avatar} alt={testimonial.author} className="h-full w-full object-cover" />
                        </div>
                      </div>
                      <div>
                        <p className="font-bold font-montserrat">{testimonial.author}</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {testimonial.role}, {testimonial.company}
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
