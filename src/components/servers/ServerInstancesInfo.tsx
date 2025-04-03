
import { ServerInstance } from "@/data/mockData";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { StatusIndicator } from "@/components/status/StatusIndicator";

interface ServerInstancesInfoProps {
  instances: ServerInstance[];
  label: React.ReactNode;
}

export const ServerInstancesInfo = ({ instances, label }: ServerInstancesInfoProps) => {
  return (
    <HoverCard>
      <HoverCardTrigger className="cursor-help">{label}</HoverCardTrigger>
      <HoverCardContent className="w-80">
        <div className="space-y-2">
          <h4 className="font-medium mb-2">Instance Details</h4>
          <div className="space-y-1">
            {instances.map((instance) => (
              <div key={instance.id} className="flex items-center justify-between text-sm">
                <span>{instance.name}</span>
                <StatusIndicator 
                  status={
                    instance.status === 'running' ? 'active' : 
                    instance.status === 'error' ? 'error' : 'inactive'
                  } 
                  label={
                    instance.status === 'running' ? 'Running' : 
                    instance.status === 'error' ? 'Error' : 'Stopped'
                  }
                />
              </div>
            ))}
          </div>
        </div>
      </HoverCardContent>
    </HoverCard>
  );
};
