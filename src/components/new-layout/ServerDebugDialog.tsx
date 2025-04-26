import { ServerInstance, ServerDefinition } from "@/data/mockData";
import { ServerTool } from "@/types/events";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogCancel,
  AlertDialogAction,
  AlertDialogFooter,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";

interface ServerDebugDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  server: ServerInstance | null;
  definition: ServerDefinition | null;
}

interface ToolExecutionResult {
  toolName: string;
  result: any;
  error?: any;
}

export function ServerDebugDialog({
  open,
  onOpenChange,
  server,
  definition
}: ServerDebugDialogProps) {
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [selectedToolId, setSelectedToolId] = useState<string | null>(null);
  const { toast } = useToast();
  const [executionResults, setExecutionResults] = useState<ToolExecutionResult[]>([]);

  const handleExecute = async (tool: ServerTool) => {
    try {
      // Simulate execution and result
      const result = {
        status: "success",
        message: `Tool "${tool.name}" executed successfully.`,
        timestamp: new Date().toISOString(),
      };

      setExecutionResults((prevResults) => [
        ...prevResults,
        { toolName: tool.name, result: result },
      ]);

      toast({
        title: "Tool Executed",
        description: `Tool "${tool.name}" executed successfully.`,
      });
    } catch (error: any) {
      console.error(`Error executing tool "${tool.name}":`, error);

      setExecutionResults((prevResults) => [
        ...prevResults,
        { toolName: tool.name, result: null, error: error.message || "Unknown error" },
      ]);

      toast({
        variant: "destructive",
        title: "Execution Error",
        description: `Failed to execute tool "${tool.name}": ${error.message || "Unknown error"}`,
      });
    }
  };

  const handleDeleteAction = (toolId: string) => {
    setSelectedToolId(toolId);
    setConfirmDelete(true);
  };

  const handleConfirmDelete = () => {
    toast({
      title: "Action deleted",
      description: "The selected action has been removed successfully"
    });
    setConfirmDelete(false);
    setSelectedToolId(null);
  };
  
  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[700px] p-0 gap-0 bg-gradient-to-b from-background to-muted/20" hideClose>
          <DialogHeader className="p-6 pb-4">
            <DialogTitle className="text-xl">
              Debug Tools - {server?.name}
            </DialogTitle>
            <DialogDescription>
              Execute and monitor server actions for debugging purposes
            </DialogDescription>
          </DialogHeader>

          <ScrollArea className="h-[600px] px-6">
            <div className="space-y-4">
              {definition?.tools?.map((tool) => (
                <div 
                  key={tool.id}
                  className="border rounded-md p-4 bg-background space-y-4"
                >
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <h3 className="font-medium text-lg">{tool.name}</h3>
                      <p className="text-sm text-muted-foreground mt-1">
                        {tool.description}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline">Debug Tool</Badge>
                    </div>
                  </div>

                  <Separator />

                  {tool.parameters && tool.parameters.length > 0 && (
                    <div className="space-y-4">
                      <h4 className="text-sm font-medium">Parameters</h4>
                      <div className="grid gap-4">
                        {tool.parameters.map((param) => (
                          <div key={param.name}>
                            <Label htmlFor={`${tool.id}-${param.name}`}>
                              {param.name}
                            </Label>
                            <Input
                              id={`${tool.id}-${param.name}`}
                              placeholder={param.type}
                              className="mt-1"
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="flex justify-between items-center">
                    <Button 
                      variant="destructive" 
                      size="sm"
                      onClick={() => handleDeleteAction(tool.id)}
                    >
                      Delete
                    </Button>
                    <Button onClick={() => handleExecute(tool)}>
                      Execute
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
          
          <DialogFooter className="p-6 pt-4 border-t">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={confirmDelete} onOpenChange={setConfirmDelete}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Action</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this action? This cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setConfirmDelete(false)}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
