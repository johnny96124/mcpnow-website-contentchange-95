
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ChevronDown, 
  ChevronUp, 
  Lightbulb, 
  Search,
  Database,
  Settings,
  Users,
  BookOpen,
  ArrowRight
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { OnboardingGuide } from '@/components/onboarding/OnboardingGuide';
import { OnboardingProgress } from '@/components/onboarding/OnboardingProgress';

const NewUserHome = () => {
  const navigate = useNavigate();
  const [showGuide, setShowGuide] = useState(true);
  
  const toggleGuide = () => {
    setShowGuide(!showGuide);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Welcome to MCP Now</h1>
          <p className="text-muted-foreground">Get started quickly with our step-by-step guide</p>
        </div>
        <Button 
          variant="outline" 
          className="flex items-center gap-1" 
          onClick={toggleGuide}
        >
          {showGuide ? (
            <>
              <ChevronUp className="h-4 w-4" />
              Hide Guide
            </>
          ) : (
            <>
              <ChevronDown className="h-4 w-4" />
              Show Guide
            </>
          )}
        </Button>
      </div>
      
      {/* Onboarding Guide */}
      {showGuide && (
        <Card className="border-primary/20 bg-primary/5 animate-fade-in">
          <CardHeader className="flex flex-row items-center gap-2 border-b pb-3">
            <Lightbulb className="h-5 w-5 text-primary" />
            <div>
              <CardTitle>Getting Started Guide</CardTitle>
              <CardDescription>Follow these steps to set up your environment</CardDescription>
            </div>
          </CardHeader>
          <CardContent className="pt-6">
            <OnboardingGuide />
          </CardContent>
          <CardFooter className="flex justify-between border-t pt-4">
            <OnboardingProgress />
            <Button onClick={() => navigate('/discovery')}>
              Start Setup <ArrowRight className="ml-1 h-4 w-4" />
            </Button>
          </CardFooter>
        </Card>
      )}
      
      {/* Quick Access Cards */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <Card className="hover:shadow-md transition-all">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Search className="h-5 w-5 text-primary" />
              Discovery
            </CardTitle>
            <CardDescription>Find and install server components</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm">Browse through our catalog of server components and tools to extend your infrastructure.</p>
          </CardContent>
          <CardFooter>
            <Button variant="outline" className="w-full" onClick={() => navigate('/discovery')}>
              Explore Servers
            </Button>
          </CardFooter>
        </Card>

        <Card className="hover:shadow-md transition-all">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="h-5 w-5 text-primary" />
              Profiles
            </CardTitle>
            <CardDescription>Configure and manage profiles</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm">Create profiles to organize your instances and apply them to hosts.</p>
          </CardContent>
          <CardFooter>
            <Button variant="outline" className="w-full" onClick={() => navigate('/profiles')}>
              Manage Profiles
            </Button>
          </CardFooter>
        </Card>

        <Card className="hover:shadow-md transition-all">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5 text-primary" />
              Hosts
            </CardTitle>
            <CardDescription>Connect and configure hosts</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm">Add hosts and associate them with profiles to deploy your configuration.</p>
          </CardContent>
          <CardFooter>
            <Button variant="outline" className="w-full" onClick={() => navigate('/hosts')}>
              Configure Hosts
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default NewUserHome;
