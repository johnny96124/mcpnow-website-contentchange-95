
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight, Star } from "lucide-react";

const Introduction: React.FC = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState<number>(0);
  
  const steps = [
    {
      title: "Welcome to Context Switch",
      description: "The smart way to manage multiple server profiles across your development workflow.",
      image: "/lovable-uploads/5f93fbdd-00d5-49db-862d-e4b247e975d7.png"
    },
    {
      title: "Discover & Connect",
      description: "Find the servers you need and connect to them with just a few clicks.",
      image: "/lovable-uploads/5ebbe2a4-57d7-4db0-98c4-34fc93af0c58.png"
    },
    {
      title: "Create Profiles",
      description: "Group related servers together for quick access and efficient context switching.",
      image: "/lovable-uploads/bbb3edcf-989e-42ed-a8dd-d5f07f4c632d.png"
    },
    {
      title: "Powerful Management",
      description: "Monitor and manage all your server instances from one central dashboard.",
      image: "/lovable-uploads/73160045-4ba5-4ffa-a980-50e0b33b3517.png"
    }
  ];
  
  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      navigate("/hosts-new-user");
    }
  };
  
  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };
  
  const handleSkip = () => {
    navigate("/hosts-new-user");
  };

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-indigo-50 to-blue-100 dark:from-gray-900 dark:to-gray-800">
      {/* Header */}
      <header className="flex justify-between items-center p-4 md:p-6">
        <div className="flex items-center">
          <img 
            src="/lovable-uploads/4fecf049-ca5f-4955-a38c-4506556886d2.png" 
            alt="Context Switch Logo" 
            className="h-8 w-8 md:h-10 md:w-10"
          />
          <h1 className="text-xl md:text-2xl font-bold ml-2 text-indigo-800 dark:text-indigo-300">
            Context Switch
          </h1>
        </div>
        <Button 
          variant="ghost" 
          onClick={handleSkip}
          className="text-gray-600 dark:text-gray-300 hover:text-indigo-700 dark:hover:text-indigo-400"
        >
          Skip
        </Button>
      </header>
      
      {/* Main content */}
      <main className="flex-1 flex flex-col md:flex-row justify-center items-center p-4 md:p-8 gap-8 md:gap-12 max-w-7xl mx-auto w-full">
        {/* Left side: Image */}
        <motion.div 
          className="w-full md:w-1/2 flex justify-center items-center order-2 md:order-1"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          key={`image-${currentStep}`}
        >
          <div className="relative w-full max-w-md aspect-video bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
            <img
              src={steps[currentStep].image}
              alt={steps[currentStep].title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>
          </div>
        </motion.div>
        
        {/* Right side: Content */}
        <motion.div 
          className="w-full md:w-1/2 flex flex-col space-y-6 order-1 md:order-2"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          key={`content-${currentStep}`}
        >
          <div className="space-y-4">
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-indigo-900 dark:text-indigo-200">
              {steps[currentStep].title}
            </h2>
            <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300">
              {steps[currentStep].description}
            </p>
          </div>
          
          {/* Features */}
          <div className="space-y-3">
            <h3 className="font-semibold text-gray-700 dark:text-gray-200">Key Features:</h3>
            <ul className="space-y-2">
              <li className="flex items-center">
                <Star className="h-4 w-4 text-yellow-500 mr-2" />
                <span className="text-gray-600 dark:text-gray-300">Smart server discovery</span>
              </li>
              <li className="flex items-center">
                <Star className="h-4 w-4 text-yellow-500 mr-2" />
                <span className="text-gray-600 dark:text-gray-300">Profile management</span>
              </li>
              <li className="flex items-center">
                <Star className="h-4 w-4 text-yellow-500 mr-2" />
                <span className="text-gray-600 dark:text-gray-300">Seamless context switching</span>
              </li>
              <li className="flex items-center">
                <Star className="h-4 w-4 text-yellow-500 mr-2" />
                <span className="text-gray-600 dark:text-gray-300">Real-time monitoring</span>
              </li>
            </ul>
          </div>
          
          {/* Navigation */}
          <div className="flex space-x-4">
            <Button
              variant="outline"
              onClick={handlePrevious}
              disabled={currentStep === 0}
              className="border-indigo-300 text-indigo-700 dark:border-indigo-700 dark:text-indigo-300"
            >
              Previous
            </Button>
            <Button 
              onClick={handleNext}
              className="bg-indigo-600 hover:bg-indigo-700 text-white flex items-center gap-2"
            >
              {currentStep < steps.length - 1 ? 'Next' : 'Get Started'}
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </motion.div>
      </main>
      
      {/* Progress indicator */}
      <div className="flex justify-center mb-8">
        <div className="flex space-x-2">
          {steps.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentStep(index)}
              className={`h-2 w-2 rounded-full transition-all duration-300 ${
                currentStep === index
                  ? "w-8 bg-indigo-600 dark:bg-indigo-400"
                  : "bg-gray-300 dark:bg-gray-600"
              }`}
              aria-label={`Go to step ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Introduction;
