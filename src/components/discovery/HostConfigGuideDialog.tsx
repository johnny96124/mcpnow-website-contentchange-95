
import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Check, ExternalLink, Info, Server } from "lucide-react";
import { StatusIndicator } from "@/components/status/StatusIndicator";
import { Profile } from "@/data/mockData";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface Host {
  id: string;
  name: string;
  status: string;
}

interface HostConfigGuideDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  profile: Profile | null;
  hosts: Host[];
}

export function HostConfigGuideDialog({
  open,
  onOpenChange,
  profile,
  hosts,
}: HostConfigGuideDialogProps) {
  const navigate = useNavigate();

  const handleGoToHosts = () => {
    onOpenChange(false);
    navigate("/hosts");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold flex items-center gap-2">
            <Info className="h-5 w-5 text-blue-500" />
            Host Configuration Guide
          </DialogTitle>
          <DialogDescription>
            {profile ? (
              <>
                Your instance has been added to <strong>{profile.name}</strong>. Now you need to configure a host to run this profile.
              </>
            ) : (
              <>Configure a host to run your profiles and instances.</>
            )}
          </DialogDescription>
        </DialogHeader>

        <div className="py-4 space-y-4">
          <div className="bg-blue-50 dark:bg-blue-950/30 rounded-md p-4 border border-blue-100 dark:border-blue-900">
            <h3 className="font-medium text-blue-800 dark:text-blue-300 mb-2 flex items-center gap-2">
              <Server className="h-4 w-4" />
              What is a Host?
            </h3>
            <p className="text-sm text-blue-700 dark:text-blue-400">
              Hosts are machines that run your server profiles. You need to configure at least one host 
              to run your servers. A host can be your local machine or a remote server.
            </p>
          </div>

          {hosts.length > 0 && (
            <div>
              <h3 className="text-sm font-medium mb-2">Available Hosts:</h3>
              <div className="space-y-2">
                {hosts.map((host) => (
                  <Card key={host.id} className="border border-gray-200 dark:border-gray-800">
                    <CardHeader className="py-3 px-4">
                      <CardTitle className="text-sm flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <StatusIndicator status="inactive" />
                          {host.name}
                        </div>
                        {host.status === "connected" && (
                          <span className="text-xs px-2 py-1 rounded-full bg-green-50 text-green-600 dark:bg-green-900/20 dark:text-green-400 flex items-center gap-1">
                            <Check className="h-3 w-3" />
                            Connected
                          </span>
                        )}
                      </CardTitle>
                    </CardHeader>
                  </Card>
                ))}
              </div>
            </div>
          )}
          
          <div className="text-sm text-gray-600 dark:text-gray-400">
            <p>
              To complete the setup, you need to:
            </p>
            <ol className="list-decimal ml-5 mt-2 space-y-1">
              <li>Go to the Hosts page</li>
              <li>Configure your host settings</li>
              <li>Connect your host to run your profiles</li>
            </ol>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Close
          </Button>
          <Button onClick={handleGoToHosts} className="gap-2">
            <ExternalLink className="h-4 w-4" />
            Go to Hosts Page
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
