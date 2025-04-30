import React from "react";
import { motion } from "framer-motion";
import { Star, Users } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { useLanguage } from "../theme/language-provider";
const fadeInUp = {
  initial: {
    opacity: 0,
    y: 40
  },
  whileInView: {
    opacity: 1,
    y: 0
  },
  viewport: {
    once: true
  },
  transition: {
    duration: 0.7
  }
};
const staggerChildren = {
  initial: {
    opacity: 0
  },
  whileInView: {
    opacity: 1
  },
  viewport: {
    once: true
  },
  transition: {
    staggerChildren: 0.2
  }
};
const TestimonialsSection = () => {
  const {
    language
  } = useLanguage();
  const testimonials = [{
    author: "Sarah Chen",
    role: "Full-stack Developer",
    company: "TechForward",
    text: "MCP Now has completely transformed my AI workflow. I can effortlessly switch between different models without disrupting my creative process or coding flow.",
    avatar: "/placeholder.svg"
  }, {
    author: "Michael Rodriguez",
    role: "ML Engineer",
    company: "DataVision",
    text: "The ability to discover and manage multiple AI tools from one interface is a game-changer. I've cut my model deployment time by 70% and can easily share configurations with my team.",
    avatar: "/placeholder.svg"
  }, {
    author: "Aisha Johnson",
    role: "CTO",
    company: "NextGen AI",
    text: "Our entire development team relies on MCP Now for consistent access to our AI infrastructure. The centralized command center and debugging tools have become essential to our workflow.",
    avatar: "/placeholder.svg"
  }];

  // Impact metrics with both Chinese and English versions
  const impactMetricsContent = {
    zh: [{
      value: "50,000+",
      label: "活跃开发者"
    }, {
      value: "120,000+",
      label: "AI 项目部署"
    }, {
      value: "75%",
      label: "开发效率提升"
    }, {
      value: "98.7%",
      label: "服务可靠性"
    }],
    en: [{
      value: "50,000+",
      label: "Active Users"
    }, {
      value: "120,000+",
      label: "AI Tools Connected"
    }, {
      value: "75%",
      label: "Workflow Efficiency Boost"
    }, {
      value: "98.7%",
      label: "User Satisfaction"
    }]
  };

  // Select metrics based on language
  const impactMetrics = impactMetricsContent[language] || impactMetricsContent.en;

  // Title and subtitle based on language
  const content = {
    zh: {
      title: "用户反馈与影响",
      subtitle: "了解开发者如何通过 MCP Now 提高工作效率"
    },
    en: {
      title: "Community Impact & Success Stories",
      subtitle: "See how users are transforming their AI workflows with MCP Now"
    }
  };
  const {
    title,
    subtitle
  } = content[language] || content.en;

  // Determine font classes based on language
  const textFont = language === "en" ? "font-roboto" : "font-noto";
  const descriptionFont = language === "en" ? "font-opensans" : "font-noto";
  return <section id="testimonials" className="py-20 bg-white dark:bg-gray-900">
      <div className="container px-4 md:px-6">
        <motion.div className="text-center max-w-3xl mx-auto mb-12" {...fadeInUp}>
          <div className="flex justify-center mb-4">
            <div className="p-3 rounded-full bg-blue-100 dark:bg-blue-900/20">
              
            </div>
          </div>
          <h2 className="text-3xl md:text-4xl font-extrabold mb-4 font-montserrat">{title}</h2>
          <p className={`text-lg text-gray-600 dark:text-gray-300 leading-relaxed ${descriptionFont}`}>
            {subtitle}
          </p>
        </motion.div>

        <div className="flex justify-center mb-16">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
            {impactMetrics.map((metric, idx) => <motion.div key={idx} className="text-center" initial={{
            opacity: 0,
            y: 20
          }} whileInView={{
            opacity: 1,
            y: 0
          }} viewport={{
            once: true
          }} transition={{
            delay: idx * 0.1
          }}>
                <div className="mb-2">
                  <span className="text-3xl md:text-4xl font-extrabold text-blue-600 dark:text-blue-400 font-montserrat">{metric.value}</span>
                </div>
                <p className={`text-gray-600 dark:text-gray-400 ${textFont}`}>{metric.label}</p>
              </motion.div>)}
          </div>
        </div>
        
        <motion.div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto" variants={staggerChildren} initial="initial" whileInView="whileInView" viewport={{
        once: true
      }}>
          {testimonials.map((testimonial, idx) => <motion.div key={idx} variants={fadeInUp} transition={{
          delay: idx * 0.1
        }} whileHover={{
          y: -5,
          transition: {
            duration: 0.2
          }
        }}>
              <Card className="h-full border-gray-200 dark:border-gray-800 hover:shadow-md transition-all duration-300">
                <CardContent className="p-6">
                  <div className="flex flex-col space-y-4">
                    <div className="flex items-center space-x-1">
                      {Array(5).fill(null).map((_, i) => <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />)}
                    </div>
                    
                    <p className={`italic text-gray-700 dark:text-gray-300 leading-relaxed ${descriptionFont} tracking-wide`}>"{testimonial.text}"</p>
                    
                    <div className="flex items-center pt-4">
                      <div className="mr-4">
                        <div className="h-10 w-10 rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden">
                          <img src={testimonial.avatar} alt={testimonial.author} className="h-full w-full object-cover" />
                        </div>
                      </div>
                      <div>
                        <p className="font-bold font-montserrat">{testimonial.author}</p>
                        <p className={`text-sm text-gray-500 dark:text-gray-400 ${textFont}`}>
                          {testimonial.role}, {testimonial.company}
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>)}
        </motion.div>
      </div>
    </section>;
};
export default TestimonialsSection;