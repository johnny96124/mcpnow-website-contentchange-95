
import React from 'react';
import { Progress } from '@/components/ui/progress';

export const OnboardingProgress = () => {
  // In a real app, this would come from user data or context
  // For now we'll hardcode it to 0 for new users
  const completedSteps = 0;
  const totalSteps = 4;
  const progressPercentage = (completedSteps / totalSteps) * 100;
  
  return (
    <div className="flex items-center gap-4">
      <Progress value={progressPercentage} className="w-32" />
      <span className="text-sm text-muted-foreground">
        {completedSteps} of {totalSteps} steps completed
      </span>
    </div>
  );
};
