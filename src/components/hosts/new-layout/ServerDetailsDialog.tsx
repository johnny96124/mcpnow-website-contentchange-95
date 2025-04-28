
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ServerLogo } from "@/components/servers/ServerLogo";
import { EndpointLabel } from "@/components/status/EndpointLabel";
import { Badge } from "@/components/ui/badge";
import { ServerInstance, serverDefinitions } from "@/data/mockData";

interface ServerDetailsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  server: ServerInstance | null;
}

export function ServerDetailsDialog({
  open,
  onOpenChange,
  server
}: ServerDetailsDialogProps) {
  if (!server) return null;

  // Find server definition based on definitionId
  const definition = serverDefinitions.find(def => def.id === server.definitionId);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Server Details</DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          <div className="flex items-start gap-4">
            <ServerLogo name={server.name} className="w-16 h-16" />
            <div>
              <h2 className="text-xl font-semibold">{server.name}</h2>
              <div className="flex items-center gap-2 mt-1">
                <EndpointLabel type={server.type || "HTTP_SSE"} />
                {definition?.isOfficial && (
                  <Badge variant="outline" className="text-xs">Official</Badge>
                )}
              </div>
              <p className="text-sm text-muted-foreground mt-2">
                {definition?.description || "No description available"}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Connection Details</p>
              <p className="font-medium">{server.connectionDetails || server.url}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Status</p>
              <p className="font-medium capitalize">{server.status}</p>
            </div>
          </div>

          {definition?.features && definition.features.length > 0 && (
            <div>
              <h3 className="text-sm font-medium mb-2">Features</h3>
              <div className="flex flex-wrap gap-2">
                {definition.features.map((feature, index) => (
                  <Badge key={index} variant="secondary">{feature}</Badge>
                ))}
              </div>
            </div>
          )}

          {definition?.categories && definition.categories.length > 0 && (
            <div>
              <h3 className="text-sm font-medium mb-2">Categories</h3>
              <div className="flex flex-wrap gap-2">
                {definition.categories.map((category, index) => (
                  <Badge key={index} variant="outline">{category}</Badge>
                ))}
              </div>
            </div>
          )}

          {definition?.author && (
            <div>
              <h3 className="text-sm font-medium mb-1">Author</h3>
              <p>{definition.author}</p>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Close
          </Button>
          {definition?.repository && (
            <Button asChild>
              <a href={definition.repository} target="_blank" rel="noopener noreferrer">
                View Repository
              </a>
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
