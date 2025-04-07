
import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Terminal, AlertCircle, Info } from "lucide-react";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ServerDefinition } from "@/data/mockData";
import { useOnboarding } from "@/context/OnboardingContext"; 
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface AddInstanceDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  serverDefinition: ServerDefinition | null;
  onCreateInstance: (data: InstanceFormValues) => void;
}

const instanceFormSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  args: z.string().min(1, { message: "Command arguments are required." }),
  env: z.record(z.string(), z.string()).optional(),
});

export type InstanceFormValues = z.infer<typeof instanceFormSchema>;

export function AddInstanceDialog({ 
  open, 
  onOpenChange, 
  serverDefinition, 
  onCreateInstance 
}: AddInstanceDialogProps) {
  const [envFields, setEnvFields] = useState<{name: string; required: boolean; value: string}[]>([
    { name: "API_KEY", required: true, value: "" },
    { name: "MODEL_NAME", required: false, value: "" },
    { name: "MAX_TOKENS", required: false, value: "4096" },
  ]);

  const { isOnboarding, currentStep, nextStep, setSelectedInstanceId } = useOnboarding();

  const form = useForm<InstanceFormValues>({
    resolver: zodResolver(instanceFormSchema),
    defaultValues: {
      name: serverDefinition ? `${serverDefinition.name} Instance` : "",
      args: serverDefinition ? 
        `npx -y @smithery/cli@latest install @block/${serverDefinition.type.toLowerCase()} --client ${serverDefinition.name.toLowerCase()} --key ad3dda05-c241-44f6-bcb8-283ef9149d88` 
        : "",
      env: {},
    },
  });

  const onSubmit = (data: InstanceFormValues) => {
    const envData: Record<string, string> = {};
    
    envFields.forEach(field => {
      if (field.value || field.required) {
        envData[field.name] = field.value;
      }
    });
    
    data.env = envData;
    onCreateInstance(data);
    
    // 如果处于引导模式且当前是第二步，更新状态并继续
    if (isOnboarding && currentStep === "create-instance") {
      setSelectedInstanceId("instance-" + Date.now()); // 模拟实例ID
      nextStep();
    }
    
    form.reset();
  };

  if (!serverDefinition) return null;

  // 添加引导高亮
  const shouldHighlight = isOnboarding && currentStep === "create-instance";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] relative">
        {shouldHighlight && (
          <div className="absolute inset-0 border-2 border-primary rounded-lg pointer-events-none" style={{ zIndex: 1 }} />
        )}
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {serverDefinition.type === 'HTTP_SSE' ? (
              <span className="inline-flex items-center gap-1 text-blue-500"><Terminal className="h-5 w-5" /> HTTP/SSE Server</span>
            ) : (
              <span className="inline-flex items-center gap-1 text-purple-500"><Terminal className="h-5 w-5" /> CLI Server</span>
            )}
            <span className="truncate">- {serverDefinition.name}</span>
          </DialogTitle>
          <DialogDescription className="pt-2">
            {serverDefinition.description}
          </DialogDescription>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center">
                    Instance Name
                    <span className="text-destructive ml-1">*</span>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <span className="ml-1 cursor-help">
                            <Info className="h-4 w-4 text-muted-foreground" />
                          </span>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>A unique name to identify this server instance</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </FormLabel>
                  <FormControl>
                    <Input placeholder="My Server Instance" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="args"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center">
                    Command Arguments
                    <span className="text-destructive ml-1">*</span>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <span className="ml-1 cursor-help">
                            <Info className="h-4 w-4 text-muted-foreground" />
                          </span>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Command line arguments to initialize the server</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="npx -y @smithery/cli@latest install @block/server-type" 
                      className="font-mono text-sm h-20" 
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-medium flex items-center">
                  Environment Variables
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <span className="ml-1 cursor-help">
                          <Info className="h-4 w-4 text-muted-foreground" />
                        </span>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>These variables will be passed to the server instance</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </h4>
              </div>
              
              {envFields.map((field, index) => (
                <div key={index} className="grid grid-cols-12 gap-2 items-start">
                  <div className="col-span-5">
                    <Label className="flex items-center" htmlFor={`env-${index}`}>
                      {field.name}
                      {field.required && <span className="text-destructive ml-1">*</span>}
                    </Label>
                  </div>
                  <div className="col-span-7">
                    <Input
                      id={`env-${index}`}
                      value={field.value}
                      onChange={(e) => {
                        const newFields = [...envFields];
                        newFields[index].value = e.target.value;
                        setEnvFields(newFields);
                      }}
                      placeholder={field.required ? "Required" : "Optional"}
                    />
                  </div>
                </div>
              ))}
              
              {envFields.some(field => field.required && !field.value) && (
                <div className="flex items-center text-xs text-destructive gap-1 mt-1">
                  <AlertCircle className="h-3 w-3" />
                  <span>Required fields must be filled</span>
                </div>
              )}
            </div>
            
            <DialogFooter>
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => onOpenChange(false)}
              >
                Cancel
              </Button>
              <Button 
                type="submit"
                disabled={envFields.some(field => field.required && !field.value)}
                className={shouldHighlight ? "animate-pulse" : ""}
              >
                Create Instance
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
