
import { ServerInstance } from "@/data/mockData";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";

interface AuthorRequestInfoProps {
  instances: ServerInstance[];
  author: string;
}

export const AuthorRequestInfo = ({ instances, author }: AuthorRequestInfoProps) => {
  return (
    <HoverCard>
      <HoverCardTrigger className="cursor-help flex flex-col">
        <p className="font-medium">Author</p>
        <p className="text-muted-foreground">{author}</p>
      </HoverCardTrigger>
      <HoverCardContent className="w-80">
        <div className="space-y-2">
          <h4 className="font-medium mb-2">Instance Request Counts</h4>
          <div className="space-y-1">
            {instances.map((instance) => (
              <div key={instance.id} className="flex items-center justify-between text-sm">
                <span>{instance.name}</span>
                <span className="font-medium">{instance.requestCount || 0} requests</span>
              </div>
            ))}
          </div>
        </div>
      </HoverCardContent>
    </HoverCard>
  );
};
