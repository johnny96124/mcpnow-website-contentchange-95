
import { useState, useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { PlusCircle, AlertCircle, Info } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { EndpointType, ServerInstance } from "@/data/mockData";
import { useToast } from "@/hooks/use-toast";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useNavigate } from "react-router-dom";
import { Label } from "@/components/ui/label";

const profileSchema = z.object({
  name: z.string().min(1, { message: "Profile name is required" }),
  endpointType: z.enum(["HTTP_SSE", "STDIO"], { 
    required_error: "Endpoint type is required" 
  }),
  endpoint: z.string().min(1, { message: "Endpoint URL or path is required" }),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

interface CreateProfileDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreateProfile: (profile: {
    name: string;
    endpointType: EndpointType;
    endpoint: string;
  }) => void;
  instances: ServerInstance[];
}

export function CreateProfileDialog({ 
  open, 
  onOpenChange, 
  onCreateProfile,
  instances
}: CreateProfileDialogProps) {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [hasInstances, setHasInstances] = useState(true);
  
  useEffect(() => {
    setHasInstances(instances.length > 0);
  }, [instances]);

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: "",
      endpointType: "HTTP_SSE",
      endpoint: "",
    },
  });

  const handleSubmit = (values: ProfileFormValues) => {
    if (!hasInstances) {
      navigate("/servers");
      onOpenChange(false);
      toast({
        title: "No server instances available",
        description: "You need to create server instances first before creating a profile.",
      });
      return;
    }

    onCreateProfile({
      name: values.name,
      endpointType: values.endpointType,
      endpoint: values.endpoint,
    });
    
    form.reset();
    onOpenChange(false);
    
    toast({
      title: "Profile created",
      description: `Created profile "${values.name}"`,
    });
  };
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Create New Profile</DialogTitle>
          <DialogDescription>
            Profiles allow you to group server instances and connect to hosts.
          </DialogDescription>
        </DialogHeader>
        
        {!hasInstances ? (
          <div className="py-4">
            <Alert variant="destructive" className="mb-4">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                You need to create server instances before creating a profile.
              </AlertDescription>
            </Alert>
            <Button onClick={() => {
              navigate("/servers");
              onOpenChange(false);
            }} className="w-full">
              Go to Servers Page
            </Button>
          </div>
        ) : (
          <div className="py-4 space-y-4">
            {/* Profile name */}
            <div>
              <label className="text-sm font-medium mb-2 block">Profile Name</label>
              <Input 
                value={form.watch("name")} 
                onChange={(e) => form.setValue("name", e.target.value)}
                placeholder="Enter profile name"
              />
              {form.formState.errors.name && (
                <p className="text-sm font-medium text-destructive mt-1">
                  {form.formState.errors.name.message}
                </p>
              )}
            </div>

            {/* Connection endpoint configuration */}
            <div className="space-y-4">
              <Label className="text-sm font-medium">Connection Settings</Label>
              
              <div>
                <Label className="text-sm text-muted-foreground mb-1.5 block">Endpoint Type</Label>
                <Select 
                  value={form.watch("endpointType")}
                  onValueChange={(value) => form.setValue("endpointType", value as EndpointType)}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select endpoint type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="HTTP_SSE">HTTP SSE</SelectItem>
                    <SelectItem value="STDIO">Standard I/O</SelectItem>
                  </SelectContent>
                </Select>
                {form.formState.errors.endpointType && (
                  <p className="text-sm font-medium text-destructive mt-1">
                    {form.formState.errors.endpointType.message}
                  </p>
                )}
              </div>
              
              <div>
                <Label className="text-sm text-muted-foreground mb-1.5 block">Connection Endpoint</Label>
                <Input 
                  value={form.watch("endpoint")}
                  onChange={(e) => form.setValue("endpoint", e.target.value)}
                  placeholder={
                    form.watch("endpointType") === "HTTP_SSE" 
                      ? "http://localhost:8008/mcp" 
                      : "/usr/local/bin/mcp-stdio"
                  } 
                />
                {form.formState.errors.endpoint && (
                  <p className="text-sm font-medium text-destructive mt-1">
                    {form.formState.errors.endpoint.message}
                  </p>
                )}
              </div>
            </div>

            {/* Info alert about instance selection */}
            <Alert variant="default" className="bg-blue-50 border-blue-200">
              <Info className="h-4 w-4 text-blue-500" />
              <AlertDescription className="text-xs text-blue-700">
                You'll be able to add server instances after creating the profile.
              </AlertDescription>
            </Alert>

            <DialogFooter className="pt-4">
              <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
              <Button 
                onClick={form.handleSubmit(handleSubmit)} 
                disabled={!form.formState.isValid}
              >
                <PlusCircle className="mr-2 h-4 w-4" />
                Create Profile
              </Button>
            </DialogFooter>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
