
import { Tool, ToolParameter } from "@/data/mockData";
import { 
  Accordion, 
  AccordionContent, 
  AccordionItem, 
  AccordionTrigger 
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ChevronDown, ChevronUp, Code, Play, Wrench } from "lucide-react";
import { useState } from "react";

interface ServerToolsListProps {
  tools?: Tool[];
}

export function ServerToolsList({ tools }: ServerToolsListProps) {
  if (!tools || tools.length === 0) {
    return (
      <div className="py-8 text-center">
        <div className="flex justify-center mb-4">
          <div className="p-3 rounded-full bg-gray-100 dark:bg-gray-800">
            <Wrench className="w-6 h-6 text-gray-500 dark:text-gray-400" />
          </div>
        </div>
        <h3 className="text-lg font-medium text-gray-700 dark:text-gray-300">No tools available</h3>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          This server does not have any tools defined.
        </p>
      </div>
    );
  }

  return (
    <ScrollArea className="h-[380px] pr-4">
      <Accordion type="single" collapsible className="w-full">
        {tools.map((tool) => (
          <AccordionItem key={tool.id} value={tool.id} className="border border-gray-200 dark:border-gray-800 rounded-lg mb-3 overflow-hidden">
            <div className="bg-gray-50 dark:bg-gray-800/50">
              <AccordionTrigger className="px-4 py-3 hover:no-underline font-medium">
                <div className="flex items-center text-left">
                  <Code className="h-4 w-4 mr-2 text-blue-600 dark:text-blue-400" />
                  <span className="text-blue-600 dark:text-blue-400 font-mono text-sm">
                    {tool.name}
                  </span>
                </div>
              </AccordionTrigger>
            </div>
            <AccordionContent className="pb-0">
              <div className="p-4 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900">
                <p className="text-sm text-gray-700 dark:text-gray-300 mb-4">
                  {tool.description}
                </p>
                
                {tool.parameters && tool.parameters.length > 0 && (
                  <div className="mt-4">
                    <h4 className="text-xs uppercase tracking-wider text-gray-500 dark:text-gray-400 font-semibold mb-2">
                      Parameters
                    </h4>
                    <div className="space-y-3">
                      {tool.parameters.map((param) => (
                        <ParameterItem key={param.name} parameter={param} />
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </ScrollArea>
  );
}

interface ParameterItemProps {
  parameter: ToolParameter;
}

function ParameterItem({ parameter }: ParameterItemProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  
  return (
    <div className="bg-gray-50 dark:bg-gray-800 rounded-md p-2">
      <div className="flex items-start justify-between">
        <div className="flex items-center">
          <span className="font-mono text-xs text-blue-600 dark:text-blue-400 mr-2">
            {parameter.name}
          </span>
          <Badge variant="outline" className="text-[10px] px-1.5 py-0 h-4 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300">
            {parameter.type}
          </Badge>
          {parameter.required && (
            <Badge className="ml-1 text-[10px] px-1.5 py-0 h-4 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 border-red-200 dark:border-red-800">
              required
            </Badge>
          )}
        </div>
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
        >
          {isExpanded ? (
            <ChevronUp className="h-4 w-4" />
          ) : (
            <ChevronDown className="h-4 w-4" />
          )}
        </button>
      </div>
      
      {isExpanded && (
        <div className="mt-2 pl-2 border-l-2 border-gray-200 dark:border-gray-700">
          <p className="text-xs text-gray-600 dark:text-gray-400">
            {parameter.description}
          </p>
          {parameter.default !== undefined && (
            <div className="mt-1 text-xs">
              <span className="text-gray-500 dark:text-gray-500">Default: </span>
              <code className="font-mono text-gray-800 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 px-1 rounded">
                {typeof parameter.default === 'object' 
                  ? JSON.stringify(parameter.default) 
                  : String(parameter.default)
                }
              </code>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
