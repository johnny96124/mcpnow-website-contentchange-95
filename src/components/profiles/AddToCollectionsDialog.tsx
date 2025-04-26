
import { useState, useEffect } from "react";
import { Plus, PlusCircle, Check } from "lucide-react";
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { Profile, ServerInstance } from "@/data/mockData";
import { useToast } from "@/hooks/use-toast";

interface AddToCollectionsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAddToCollections: (collectionIds: string[]) => void;
  onCreateCollection: () => void;
  server: ServerInstance | null;
  collections: Profile[];
  serverCollections: Profile[];
}

export function AddToCollectionsDialog({
  open,
  onOpenChange,
  onAddToCollections,
  onCreateCollection,
  server,
  collections: profiles,
  serverCollections,
}: AddToCollectionsDialogProps) {
  const [selectedCollections, setSelectedCollections] = useState<string[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    if (open) {
      setSelectedCollections(serverCollections.map(profile => profile.id));
    }
  }, [open, serverCollections]);

  const handleToggleCollection = (collectionId: string) => {
    setSelectedCollections(prev => 
      prev.includes(collectionId)
        ? prev.filter(id => id !== collectionId)
        : [...prev, collectionId]
    );
  };

  const handleSave = () => {
    if (selectedCollections.length === 0) {
      toast({
        title: "No collections selected",
        description: "Please select at least one collection or create a new one.",
        variant: "destructive"
      });
      return;
    }

    onAddToCollections(selectedCollections);
    onOpenChange(false);
  };

  const isCollectionSelected = (collectionId: string) => {
    return selectedCollections.includes(collectionId);
  };

  const allCollectionsSelected = profiles.length > 0 && selectedCollections.length === profiles.length;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Add to Collections</DialogTitle>
          <DialogDescription>
            {server ? `Add ${server.name} to one or more collections` : "Select collections to add the server to"}
          </DialogDescription>
        </DialogHeader>

        <div className="py-4 space-y-4">
          {profiles.length === 0 ? (
            <div className="text-center py-8 space-y-4 border rounded-md bg-muted/20 p-4">
              <h3 className="font-medium text-lg">No collections yet</h3>
              <p className="text-muted-foreground">
                Create your first collection to start organizing your servers.
              </p>
              <Button onClick={onCreateCollection}>
                <PlusCircle className="mr-2 h-4 w-4" />
                Create Collection
              </Button>
            </div>
          ) : (
            <>
              <div className="space-y-3">
                <label className="text-sm font-medium leading-none">
                  Select collections ({selectedCollections.length} of {profiles.length} selected)
                </label>
                <ScrollArea className="h-[200px] rounded-md border">
                  <div className="p-4 space-y-2">
                    {profiles.map(profile => (
                      <div key={profile.id} className="flex items-center justify-between p-2 rounded-md hover:bg-muted/50">
                        <div className="flex items-center space-x-2">
                          <Checkbox 
                            checked={isCollectionSelected(profile.id)}
                            onCheckedChange={() => handleToggleCollection(profile.id)}
                            id={`collection-${profile.id}`}
                          />
                          <label 
                            htmlFor={`collection-${profile.id}`}
                            className="font-medium cursor-pointer flex-1"
                          >
                            {profile.name}
                          </label>
                        </div>
                        {serverCollections.some(p => p.id === profile.id) && (
                          <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">
                            Already added
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </div>

              <div className="flex justify-between items-center">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => setSelectedCollections(profiles.map(p => p.id))}
                  disabled={allCollectionsSelected}
                >
                  Select All
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => setSelectedCollections([])}
                  disabled={selectedCollections.length === 0}
                >
                  Clear Selection
                </Button>
              </div>
            </>
          )}

          <Separator />
          
          <div className="pt-2">
            <Button variant="outline" className="w-full" onClick={onCreateCollection}>
              <Plus className="mr-2 h-4 w-4" />
              Create New Collection
            </Button>
          </div>
        </div>

        <DialogFooter className="flex justify-between">
          <Button variant="ghost" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          
          {profiles.length > 0 && (
            <Button 
              onClick={handleSave}
              disabled={selectedCollections.length === 0}
            >
              <Check className="mr-2 h-4 w-4" />
              {selectedCollections.length === 1 
                ? "Add to 1 Collection" 
                : `Add to ${selectedCollections.length} Collections`}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
