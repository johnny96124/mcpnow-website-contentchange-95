
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { BookOpen } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

export const OnboardingButton = () => {
  const navigate = useNavigate();
  
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-9 w-9 rounded-full"
            onClick={() => navigate('/new-user')}
          >
            <BookOpen className="h-5 w-5" />
            <span className="sr-only">Show Onboarding Guide</span>
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>Getting Started Guide</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};
