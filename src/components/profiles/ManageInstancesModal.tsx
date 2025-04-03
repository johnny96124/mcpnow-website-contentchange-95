
import { useState, useEffect } from "react";
import { Check, ChevronsUpDown, ServerIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";
import { StatusIndicator } from "@/components/status/StatusIndicator";
import { Profile, ServerInstance } from "@/data/mockData";

interface ManageInstancesModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: Profile;
  allInstances: ServerInstance[];
  onSave: (profile: Profile, selectedInstanceIds: string[]) => void;
}

export function ManageInstancesModal({
  isOpen,
  onClose,
  profile,
  allInstances,
  onSave,
}: ManageInstancesModalProps) {
  const [selectedInstanceIds, setSelectedInstanceIds] = useState<string[]>(profile.instances);
  const [searchOpen, setSearchOpen] = useState(false);

  // Reset selections when modal opens
  useEffect(() => {
    if (isOpen) {
      setSelectedInstanceIds([...profile.instances]);
    }
  }, [isOpen, profile.instances]);

  const handleSave = () => {
    onSave(profile, selectedInstanceIds);
    onClose();
  };

  const toggleInstance = (instanceId: string) => {
    setSelectedInstanceIds(prev => {
      if (prev.includes(instanceId)) {
        return prev.filter(id => id !== instanceId);
      } else {
        return [...prev, instanceId];
      }
    });
  };

  // Filter out already selected instances for the dropdown
  const availableInstances = allInstances.filter(
    instance => !selectedInstanceIds.includes(instance.id)
  );

  // Get the selected instances
  const selectedInstances = allInstances.filter(
    instance => selectedInstanceIds.includes(instance.id)
  );

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Manage Instances for {profile.name}</DialogTitle>
          <DialogDescription>
            Add or remove server instances from this profile.
          </DialogDescription>
        </DialogHeader>

        <div className="py-4 space-y-4">
          {/* Add new instance dropdown */}
          <div>
            <label className="text-sm font-medium mb-2 block">Add Server Instance</label>
            <Popover open={searchOpen} onOpenChange={setSearchOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  aria-expanded={searchOpen}
                  className="w-full justify-between"
                  disabled={availableInstances.length === 0}
                >
                  {availableInstances.length > 0 
                    ? "Select a server instance..." 
                    : "No available instances"}
                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-[400px] p-0">
                <Command>
                  <CommandInput placeholder="Search instances..." />
                  <CommandEmpty>No instances found.</CommandEmpty>
                  <CommandList>
                    <CommandGroup>
                      {availableInstances.map(instance => (
                        <CommandItem
                          key={instance.id}
                          onSelect={() => {
                            toggleInstance(instance.id);
                            setSearchOpen(false);
                          }}
                        >
                          <div className="flex items-center justify-between w-full">
                            <div className="flex items-center">
                              <ServerIcon className="mr-2 h-4 w-4" />
                              <span>{instance.name}</span>
                            </div>
                            <StatusIndicator 
                              status={
                                instance.status === 'running' ? 'active' : 
                                instance.status === 'error' ? 'error' : 'inactive'
                              } 
                            />
                          </div>
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
          </div>

          {/* List of currently selected instances */}
          <div>
            <label className="text-sm font-medium mb-2 block">Selected Instances ({selectedInstanceIds.length})</label>
            <ScrollArea className="h-[200px] rounded-md border">
              {selectedInstances.length > 0 ? (
                <div className="p-0">
                  {selectedInstances.map(instance => (
                    <div 
                      key={instance.id}
                      className="flex items-center justify-between p-3 border-b last:border-b-0 hover:bg-muted/50"
                    >
                      <div className="flex items-center">
                        <StatusIndicator 
                          status={
                            instance.status === 'running' ? 'active' : 
                            instance.status === 'error' ? 'error' : 'inactive'
                          } 
                        />
                        <span className="ml-2">{instance.name}</span>
                      </div>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="text-destructive hover:text-destructive"
                        onClick={() => toggleInstance(instance.id)}
                      >
                        Remove
                      </Button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-4 text-center text-sm text-muted-foreground">
                  No instances selected
                </div>
              )}
            </ScrollArea>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={handleSave}>Save Changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
