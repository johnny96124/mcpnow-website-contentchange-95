
import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { ArrowRight, Download, Plus } from "lucide-react";
import { Card, CardContent, CardDescription } from "@/components/ui/card";
import { EndpointLabel } from "@/components/status/EndpointLabel";

interface AddServerDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreateServer: (data: ServerFormValues) => void;
  onNavigateToDiscovery: () => void;
}

const serverFormSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters long" }),
  type: z.enum(["HTTP_SSE", "STDIO"]),
  description: z.string().optional(),
});

type ServerFormValues = z.infer<typeof serverFormSchema>;

export function AddServerDialog({
  open,
  onOpenChange,
  onCreateServer,
  onNavigateToDiscovery
}: AddServerDialogProps) {
  const [activeTab, setActiveTab] = useState<"local" | "discovery">("local");
  
  const form = useForm<ServerFormValues>({
    resolver: zodResolver(serverFormSchema),
    defaultValues: {
      name: "",
      type: "HTTP_SSE",
      description: "",
    },
  });
  
  const onSubmit = (data: ServerFormValues) => {
    onCreateServer(data);
  };
  
  const handleDiscoveryNavigation = () => {
    onOpenChange(false);
    onNavigateToDiscovery();
  };
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[550px]">
        <DialogHeader>
          <DialogTitle>Add New Server</DialogTitle>
          <DialogDescription>
            Choose how you want to add a new server
          </DialogDescription>
        </DialogHeader>
        
        <Tabs value={activeTab} onValueChange={(val) => setActiveTab(val as "local" | "discovery")}>
          <TabsList className="grid grid-cols-2 w-full mb-4">
            <TabsTrigger value="local">Create Local Server</TabsTrigger>
            <TabsTrigger value="discovery">Browse Discovery</TabsTrigger>
          </TabsList>
          
          <TabsContent value="local" className="space-y-4">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Server Name <span className="text-destructive">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input placeholder="My Custom Server" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="type"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Server Type <span className="text-destructive">*</span>
                      </FormLabel>
                      <FormControl>
                        <RadioGroup
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                          className="grid grid-cols-2 gap-4"
                        >
                          <div>
                            <RadioGroupItem 
                              value="HTTP_SSE" 
                              id="http_sse"
                              className="peer sr-only"
                            />
                            <Label
                              htmlFor="http_sse"
                              className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary cursor-pointer"
                            >
                              <EndpointLabel type="HTTP_SSE" />
                              <p className="text-sm text-center mt-2">
                                HTTP Server Sent Events
                              </p>
                            </Label>
                          </div>
                          
                          <div>
                            <RadioGroupItem 
                              value="STDIO" 
                              id="stdio"
                              className="peer sr-only"
                            />
                            <Label
                              htmlFor="stdio"
                              className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary cursor-pointer"
                            >
                              <EndpointLabel type="STDIO" />
                              <p className="text-sm text-center mt-2">
                                Standard Input/Output
                              </p>
                            </Label>
                          </div>
                        </RadioGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Description <span className="text-muted-foreground text-sm">(optional)</span>
                      </FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Describe your server's purpose and functionality"
                          className="resize-none"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <DialogFooter>
                  <Button type="submit">
                    <Plus className="mr-2 h-4 w-4" />
                    Create Server
                  </Button>
                </DialogFooter>
              </form>
            </Form>
          </TabsContent>
          
          <TabsContent value="discovery" className="space-y-6">
            <div className="grid gap-4">
              <Card>
                <CardContent className="p-6">
                  <div className="flex flex-col items-center gap-4 text-center">
                    <Download className="h-12 w-12 text-muted-foreground" />
                    <div>
                      <h3 className="text-lg font-semibold">Browse from Discovery</h3>
                      <CardDescription>
                        Find and install pre-built servers from our official catalog
                      </CardDescription>
                    </div>
                    <Button className="mt-2" onClick={handleDiscoveryNavigation}>
                      Go to Discovery
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
