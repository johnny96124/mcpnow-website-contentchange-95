
import React from 'react';
import { SignIn, SignUp, useAuth, useUser } from '@clerk/clerk-react';
import { Navigate, useSearchParams } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const Auth: React.FC = () => {
  const { isSignedIn } = useAuth();
  const { user } = useUser();
  const [searchParams] = useSearchParams();
  const mode = searchParams.get('mode') || 'sign-in';

  // Redirect if already signed in
  if (isSignedIn && user) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-950/20 dark:to-purple-950/20 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <img 
            src="/lovable-uploads/bbb3edcf-989e-42ed-a8dd-d5f07f4c632d.png" 
            alt="MCP Now Logo" 
            className="h-12 w-12 mx-auto mb-4 rounded-lg shadow" 
          />
          <h1 className="text-2xl font-bold tracking-tight">Welcome to MCP Now</h1>
          <p className="text-muted-foreground mt-2">
            Manage your AI agent connections with ease
          </p>
        </div>

        <Card>
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl text-center">
              {mode === 'sign-up' ? 'Create Account' : 'Sign In'}
            </CardTitle>
            <CardDescription className="text-center">
              {mode === 'sign-up' 
                ? 'Start your journey with MCP Now' 
                : 'Welcome back to MCP Now'
              }
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs value={mode} className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="sign-in">Sign In</TabsTrigger>
                <TabsTrigger value="sign-up">Sign Up</TabsTrigger>
              </TabsList>
              
              <TabsContent value="sign-in" className="mt-6">
                <div className="flex justify-center">
                  <SignIn 
                    routing="hash"
                    signUpUrl="/auth?mode=sign-up"
                    afterSignInUrl="/"
                    appearance={{
                      elements: {
                        rootBox: "w-full",
                        card: "shadow-none border-0 bg-transparent"
                      }
                    }}
                  />
                </div>
              </TabsContent>
              
              <TabsContent value="sign-up" className="mt-6">
                <div className="flex justify-center">
                  <SignUp 
                    routing="hash"
                    signInUrl="/auth?mode=sign-in"
                    afterSignUpUrl="/"
                    appearance={{
                      elements: {
                        rootBox: "w-full",
                        card: "shadow-none border-0 bg-transparent"
                      }
                    }}
                  />
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Auth;
