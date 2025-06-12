
import React from 'react';
import { SignUp } from '@clerk/clerk-react';
import { Card, CardContent } from '@/components/ui/card';

const SignUpPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <img 
            src="/lovable-uploads/0ad4c791-4d08-4e94-bbeb-3ac78aae67ef.png" 
            alt="MCP Now Logo" 
            className="h-12 w-12 mx-auto mb-4" 
          />
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Join MCP Now</h1>
          <p className="text-gray-600 dark:text-gray-300 mt-2">Create your account</p>
        </div>
        
        <Card className="shadow-lg">
          <CardContent className="p-0">
            <SignUp 
              appearance={{
                elements: {
                  rootBox: "w-full",
                  card: "shadow-none border-0",
                  headerTitle: "hidden",
                  headerSubtitle: "hidden",
                }
              }}
              redirectUrl="/dashboard"
              signInUrl="/auth/sign-in"
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SignUpPage;
