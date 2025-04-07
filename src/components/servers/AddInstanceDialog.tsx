
import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Info } from "lucide-react";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ServerDefinition } from "@/data/mockData";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { EndpointLabel } from "@/components/status/EndpointLabel";

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
  const [envFields, setEnvFields] = useState<{name: string; value: string}[]>([
    { name: "API_KEY", value: "" },
    { name: "MODEL_NAME", value: "" },
    { name: "MAX_TOKENS", value: "4096" },
  ]);

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
      if (field.value) {
        envData[field.name] = field.value;
      }
    });
    
    data.env = envData;
    onCreateInstance(data);
    form.reset();
  };

  if (!serverDefinition) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between gap-2">
            <span>{serverDefinition.name}</span>
            {serverDefinition.type === 'HTTP_SSE' ? (
              <EndpointLabel type="HTTP_SSE" />
            ) : (
              <EndpointLabel type="STDIO" />
            )}
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
                      placeholder="Optional"
                    />
                  </div>
                </div>
              ))}
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
