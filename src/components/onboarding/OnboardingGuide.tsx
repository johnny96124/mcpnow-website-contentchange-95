
import React from 'react';
import { Search, Database, Settings, Users } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';

// This defines our onboarding steps
const steps = [
  {
    id: 1,
    title: 'Install Servers from Discovery',
    icon: Search,
    description: 'Browse and install server components from our catalog',
    details: 'Find the server components that match your needs from our curated catalog. Select and install them to begin building your infrastructure.',
    linkText: 'Go to Discovery',
    linkPath: '/discovery'
  },
  {
    id: 2,
    title: 'Create Instances & Configure Parameters',
    icon: Settings,
    description: 'Set up instances with the right configuration',
    details: 'After installing server components, create instances and configure their parameters to match your environment requirements.',
    linkText: 'Go to Servers',
    linkPath: '/servers'
  },
  {
    id: 3,
    title: 'Create Profiles & Add Instances',
    icon: Database,
    description: 'Organize your instances into profiles',
    details: 'Group your instances into profiles that can be applied to hosts. This allows for consistent configuration across your infrastructure.',
    linkText: 'Go to Profiles',
    linkPath: '/profiles'
  },
  {
    id: 4,
    title: 'Associate Hosts with Profiles',
    icon: Users,
    description: 'Apply profiles to hosts to deploy your configuration',
    details: 'Finally, connect your hosts and associate them with the profiles you created to deploy your configuration.',
    linkText: 'Go to Hosts',
    linkPath: '/hosts'
  }
];

export const OnboardingGuide = () => {
  const navigate = useNavigate();
  
  return (
    <div className="space-y-8">
      {steps.map((step) => (
        <div key={step.id} className="flex gap-4">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground">
            <step.icon className="h-5 w-5" />
          </div>
          <div className="space-y-2">
            <h3 className="font-semibold flex items-center gap-2">
              <span className="bg-primary/10 text-primary px-2 py-0.5 rounded-full text-xs">
                Step {step.id}
              </span>
              {step.title}
            </h3>
            <p className="text-sm text-muted-foreground">{step.description}</p>
            <p className="text-sm">{step.details}</p>
            <Button 
              variant="link" 
              className="p-0 h-auto text-primary" 
              onClick={() => navigate(step.linkPath)}
            >
              {step.linkText}
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
};
